import { Request } from 'express';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';

// The federal fraud case archive (federal_cases, filled by
// jobs/scanDojArchive.ts): every DOJ fraud/scam press release since 2009.
const PAGE_SIZE = 25;
const MAX_QUERY_LENGTH = 200;

interface Filters {
  where: string[];
  params: unknown[];
}

function filtersFrom(req: Request): Filters {
  const where: string[] = [];
  const params: unknown[] = [];
  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, MAX_QUERY_LENGTH) : '';
  if (q) {
    params.push(q);
    where.push(`search_vector @@ websearch_to_tsquery('english', $${params.length})`);
  }
  const state = typeof req.query.state === 'string' ? req.query.state.trim().toUpperCase() : '';
  if (/^[A-Z]{2}$/.test(state)) {
    params.push(state);
    where.push(`state = $${params.length}`);
  } else if (state === 'NATIONAL') {
    where.push('state IS NULL');
  }
  const theme = typeof req.query.theme === 'string' ? req.query.theme.trim().slice(0, 60) : '';
  if (theme) {
    params.push(theme);
    where.push(`theme = $${params.length}`);
  }
  const year = Number(req.query.year);
  if (Number.isInteger(year) && year >= 2000 && year <= 2100) {
    params.push(`${year}-01-01`, `${year + 1}-01-01`);
    where.push(`published_at >= $${params.length - 1} AND published_at < $${params.length}`);
  }
  return { where, params };
}

// GET /v1/federal-cases?q=&state=&theme=&year=&page=
// state: a two-letter code, or "national" for Main Justice releases.
export const list = asyncHandler(async (req, res) => {
  const { where, params } = filtersFrom(req);
  const page = Math.max(1, Math.min(Number(req.query.page) || 1, 2000));
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows, count] = await Promise.all([
    pool.query(
      `SELECT id, title, summary, url, published_at, office, state, theme
       FROM federal_cases ${whereSql}
       ORDER BY published_at DESC, id
       LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
      params
    ),
    pool.query<{ total: string }>(`SELECT COUNT(*)::text AS total FROM federal_cases ${whereSql}`, params),
  ]);

  res.set('Cache-Control', 'public, max-age=120');
  res.json({ data: rows.rows, total: Number(count.rows[0].total), page, page_size: PAGE_SIZE });
});

interface ArchiveStats {
  total: number;
  first_date: string | null;
  last_date: string | null;
  states_covered: number;
  by_year: { year: number; count: number }[];
  by_theme: { theme: string; count: number }[];
  by_state: { state: string; count: number }[];
  // The archive is filled a slice per day; until the backfill finishes the
  // page says so rather than presenting a partial count as the whole.
  backfill_complete: boolean;
}

const STATS_TTL_MS = 10 * 60 * 1000;
let statsCache: { at: number; value: Promise<ArchiveStats> } | null = null;

async function computeStats(): Promise<ArchiveStats> {
  const [summary, years, themes, states, done] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS total, MIN(published_at) AS first_date, MAX(published_at) AS last_date,
              COUNT(DISTINCT state)::int AS states_covered
       FROM federal_cases`
    ),
    pool.query(
      `SELECT EXTRACT(YEAR FROM published_at)::int AS year, COUNT(*)::int AS count
       FROM federal_cases GROUP BY 1 ORDER BY 1`
    ),
    pool.query(`SELECT theme, COUNT(*)::int AS count FROM federal_cases GROUP BY 1 ORDER BY 2 DESC, 1`),
    pool.query(
      `SELECT state, COUNT(*)::int AS count FROM federal_cases WHERE state IS NOT NULL GROUP BY 1 ORDER BY 2 DESC, 1`
    ),
    pool.query(`SELECT 1 FROM ingest_state WHERE name = 'doj_archive_backfill_done'`),
  ]);
  const s = summary.rows[0];
  return {
    total: s.total,
    first_date: s.first_date,
    last_date: s.last_date,
    states_covered: s.states_covered,
    by_year: years.rows,
    by_theme: themes.rows,
    by_state: states.rows,
    backfill_complete: (done.rowCount ?? 0) > 0,
  };
}

// GET /v1/federal-cases/stats — cached briefly; the archive changes once a day.
export const stats = asyncHandler(async (_req, res) => {
  if (!statsCache || Date.now() - statsCache.at > STATS_TTL_MS) {
    const value = computeStats();
    statsCache = { at: Date.now(), value };
    value.catch(() => {
      statsCache = null;
    });
  }
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ data: await statsCache.value });
});
