import { pool } from '../db/connection';

export interface SiteStats {
  scams: number;
  categories: number;
  countries: number;
  sources: number;
}

// Every number here is a live COUNT(*) against real tables — no
// hardcoded or fabricated figures. "countries" unions scams.country
// with global_sources.country so it reflects both our own curated
// records and the official agencies we link out to.
export async function getSiteStats(): Promise<SiteStats> {
  const [scams, categories, countries, sources] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM scams WHERE is_active = true'),
    pool.query('SELECT COUNT(*) FROM categories'),
    pool.query(`
      SELECT COUNT(DISTINCT country) FROM (
        SELECT country FROM scams WHERE is_active = true AND country IS NOT NULL
        UNION
        SELECT country FROM global_sources
      ) AS c
    `),
    pool.query('SELECT COUNT(*) FROM global_sources'),
  ]);

  return {
    scams: Number(scams.rows[0].count),
    categories: Number(categories.rows[0].count),
    countries: Number(countries.rows[0].count),
    sources: Number(sources.rows[0].count),
  };
}

export interface LiveStatsCritical {
  id: string;
  name: string;
  slug: string;
  alert_level: string;
  category_name: string | null;
  country: string | null;
  created_at: string;
}

export interface LiveStats {
  newLast7Days: number;
  newLast30Days: number;
  activeCriticalCount: number;
  activeHighCount: number;
  newsLast24h: number;
  mostActiveCategory: { name: string; count: number } | null;
  recentCritical: LiveStatsCritical[];
}

// Replaces the old all-time category/country breakdown (same number every
// time someone checked, which read as a chart rather than a live site).
// This is what's actually changing right now: how fast the database is
// growing, how many currently-active threats are rated critical/high, and
// the specific newest ones — what a visitor should actually watch for
// today, not a percentage split that looks the same on every visit.
export async function getLiveStats(): Promise<LiveStats> {
  const [counts, newsCount, topCategory, recentCritical] = await Promise.all([
    pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS new_7d,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS new_30d,
        COUNT(*) FILTER (WHERE alert_level = 'critical') AS critical_count,
        COUNT(*) FILTER (WHERE alert_level = 'high') AS high_count
      FROM scams
      WHERE is_active = true AND is_historical = false
    `),
    pool.query(`SELECT COUNT(*)::int FROM daily_scam_news WHERE scanned_at >= NOW() - INTERVAL '24 hours'`),
    pool.query(`
      SELECT c.name, COUNT(s.id)::int AS count
      FROM scams s
      JOIN categories c ON c.id = s.category_id
      WHERE s.is_active = true AND s.is_historical = false AND s.created_at >= NOW() - INTERVAL '7 days'
      GROUP BY c.name
      ORDER BY count DESC
      LIMIT 1
    `),
    pool.query(`
      SELECT s.id, s.name, s.slug, s.alert_level, s.country, s.created_at, c.name AS category_name
      FROM scams s
      LEFT JOIN categories c ON c.id = s.category_id
      WHERE s.is_active = true AND s.is_historical = false AND s.alert_level IN ('critical', 'high')
      ORDER BY s.created_at DESC
      LIMIT 5
    `),
  ]);

  const row = counts.rows[0];
  return {
    newLast7Days: Number(row.new_7d),
    newLast30Days: Number(row.new_30d),
    activeCriticalCount: Number(row.critical_count),
    activeHighCount: Number(row.high_count),
    newsLast24h: Number(newsCount.rows[0].count),
    mostActiveCategory: topCategory.rows[0] ?? null,
    recentCritical: recentCritical.rows,
  };
}

export interface StatsBreakdown {
  generated_at: string;
  totals: { current: number; historical: number; countries: number; categories_in_use: number };
  // Current (non-historical) entries by alert level. "unrated" is entries
  // with no alert_level — counted, not hidden, so the parts sum to the total.
  bySeverity: { critical: number; high: number; medium: number; low: number; unrated: number };
  byCategory: { name: string; slug: string; count: number; critical_high: number }[];
  topCountries: { country: string; count: number }[];
  topTargets: { tag: string; count: number }[];
  // Entries ADDED to the database per ISO week (Monday start, UTC), the last
  // 12 weeks, zero-filled. Database growth, not scam incidence.
  weeklyAdded: { week_start: string; count: number }[];
}

const BREAKDOWN_TTL_MS = 5 * 60 * 1000;
let breakdownCache: { at: number; value: StatsBreakdown } | null = null;
let breakdownInFlight: Promise<StatsBreakdown> | null = null;

// Aggregate-only view of the curated database for the Statistics page. All
// counts are live GROUP BYs over `scams` — nothing estimated. Cached in
// process for five minutes (the data changes a few times a day at most), and
// concurrent first requests share one computation instead of each running
// the six aggregates.
export async function getStatsBreakdown(): Promise<StatsBreakdown> {
  if (breakdownCache && Date.now() - breakdownCache.at < BREAKDOWN_TTL_MS) return breakdownCache.value;
  if (breakdownInFlight) return breakdownInFlight;
  breakdownInFlight = computeStatsBreakdown()
    .then((value) => {
      breakdownCache = { at: Date.now(), value };
      return value;
    })
    .finally(() => {
      breakdownInFlight = null;
    });
  return breakdownInFlight;
}

export function clearStatsBreakdownCache() {
  breakdownCache = null;
}

async function computeStatsBreakdown(): Promise<StatsBreakdown> {
  const [totals, severity, categories, countries, targets, weekly] = await Promise.all([
    pool.query(`
      SELECT COUNT(*) FILTER (WHERE is_historical = false)::int AS current,
             COUNT(*) FILTER (WHERE is_historical = true)::int AS historical,
             COUNT(DISTINCT country) FILTER (WHERE is_historical = false)::int AS countries,
             COUNT(DISTINCT category_id) FILTER (WHERE is_historical = false)::int AS categories_in_use
      FROM scams WHERE is_active = true
    `),
    pool.query(`
      SELECT COALESCE(alert_level, 'unrated') AS level, COUNT(*)::int AS count
      FROM scams WHERE is_active = true AND is_historical = false
      GROUP BY 1
    `),
    pool.query(`
      SELECT c.name, c.slug, COUNT(*)::int AS count,
             COUNT(*) FILTER (WHERE s.alert_level IN ('critical', 'high'))::int AS critical_high
      FROM scams s JOIN categories c ON c.id = s.category_id
      WHERE s.is_active = true AND s.is_historical = false
      GROUP BY c.name, c.slug
      ORDER BY count DESC, c.name ASC
    `),
    pool.query(`
      SELECT country, COUNT(*)::int AS count
      FROM scams WHERE is_active = true AND is_historical = false AND country IS NOT NULL
      GROUP BY country ORDER BY count DESC, country ASC LIMIT 12
    `),
    pool.query(`
      SELECT unnest(tags) AS tag, COUNT(*)::int AS count
      FROM scams WHERE is_active = true AND is_historical = false AND tags IS NOT NULL
      GROUP BY tag ORDER BY count DESC, tag ASC LIMIT 8
    `),
    pool.query(`
      WITH weeks AS (
        SELECT generate_series(
          date_trunc('week', NOW() AT TIME ZONE 'UTC') - INTERVAL '11 weeks',
          date_trunc('week', NOW() AT TIME ZONE 'UTC'),
          INTERVAL '1 week'
        ) AS week_start
      ),
      added AS (
        SELECT date_trunc('week', created_at AT TIME ZONE 'UTC') AS week_start, COUNT(*)::int AS count
        FROM scams
        WHERE is_active = true AND is_historical = false
          AND created_at >= date_trunc('week', NOW() AT TIME ZONE 'UTC') - INTERVAL '11 weeks'
        GROUP BY 1
      )
      SELECT to_char(w.week_start, 'YYYY-MM-DD') AS week_start, COALESCE(a.count, 0)::int AS count
      FROM weeks w LEFT JOIN added a ON a.week_start = w.week_start
      ORDER BY w.week_start
    `),
  ]);

  const sev = { critical: 0, high: 0, medium: 0, low: 0, unrated: 0 };
  for (const r of severity.rows) {
    if (r.level in sev) sev[r.level as keyof typeof sev] = Number(r.count);
  }

  return {
    generated_at: new Date().toISOString(),
    totals: totals.rows[0],
    bySeverity: sev,
    byCategory: categories.rows,
    topCountries: countries.rows,
    topTargets: targets.rows,
    weeklyAdded: weekly.rows,
  };
}
