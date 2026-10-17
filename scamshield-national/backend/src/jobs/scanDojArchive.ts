// Builds and maintains the federal fraud case archive (federal_cases) from
// the Justice Department's public press-release API.
//
// Each run does two things:
//   1. Catch-up: reads the newest releases (newest first) until it reaches
//      ones it has already seen, so new cases appear within a day.
//   2. Backfill: reads the next slice of the full archive, oldest first, and
//      records where it stopped in ingest_state. The ~5,500-page archive is
//      spread over a few daily runs instead of one multi-hour job, and a run
//      that dies mid-way just resumes from the last saved page.
// Paging is by creation time, ascending, which is stable: new releases are
// only ever added at the end, so page N keeps meaning the same releases.
//
// Storage guard: the backfill pauses (and says so) if the database is past
// STORAGE_GUARD_FRACTION of DB_STORAGE_LIMIT_MB, so the archive can never
// fill the database and take the site down. Catch-up still runs.
//
// Runs after the daily federal news scan (npm run scan-federal-news).
// Env: DOJ_BACKFILL_PAGES (pages per run, default 1800), DB_STORAGE_LIMIT_MB
// (default 1024, the Render database plan's disk).
import 'dotenv/config';
import { pool } from '../db/connection';
import { DojRelease, isFraudRelease, releaseSeconds, toFederalCase } from './dojArchive';

const API = 'https://www.justice.gov/api/v1/press_releases.json';
const PAGE_SIZE = 50; // the API's maximum
const BACKFILL_PAGES = Number(process.env.DOJ_BACKFILL_PAGES ?? 1800);
const CATCH_UP_MAX_PAGES = 60;
// Catch-up stops once a whole page is older than the newest release seen
// last run, minus a day of slack for releases DOJ posts late.
const CATCH_UP_SLACK_SECONDS = 86400;
const STORAGE_LIMIT_MB = Number(process.env.DB_STORAGE_LIMIT_MB ?? 1024);
const STORAGE_GUARD_FRACTION = 0.75;
const REQUEST_DELAY_MS = 250;
const FETCH_TIMEOUT_MS = 30000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const CURSOR_PAGE = 'doj_archive_backfill_page';
const CURSOR_DONE = 'doj_archive_backfill_done';
const CURSOR_NEWEST = 'doj_archive_newest_created';

async function fetchPage(params: Record<string, string | number>): Promise<DojRelease[]> {
  const url = `${API}?${new URLSearchParams(
    Object.fromEntries(Object.entries({ pagesize: PAGE_SIZE, ...params }).map(([k, v]) => [k, String(v)]))
  )}`;
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'ScamShieldNational/1.0 (+federal fraud case archive)', Accept: 'application/json' },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as { results?: DojRelease[] };
      return Array.isArray(body.results) ? body.results : [];
    } catch (err) {
      lastError = err;
      await sleep(2000 * attempt);
    }
  }
  throw new Error(`DOJ API failed for ${url}: ${(lastError as Error)?.message}`);
}

async function getCursor(name: string): Promise<string | null> {
  const { rows } = await pool.query<{ value: string }>('SELECT value FROM ingest_state WHERE name = $1', [name]);
  return rows[0]?.value ?? null;
}

async function setCursor(name: string, value: string): Promise<void> {
  await pool.query(
    `INSERT INTO ingest_state (name, value) VALUES ($1, $2)
     ON CONFLICT (name) DO UPDATE SET value = $2, updated_at = NOW()`,
    [name, value]
  );
}

// Upserts the fraud cases on one page; returns how many were fraud cases.
async function savePage(releases: DojRelease[]): Promise<number> {
  const cases = releases.filter(isFraudRelease).map(toFederalCase).filter((c) => c !== null);
  for (const c of cases) {
    await pool.query(
      `INSERT INTO federal_cases
         (doj_uuid, title, summary, url, published_at, office, components, topics, state, theme)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (doj_uuid) DO UPDATE SET
         title = EXCLUDED.title, summary = EXCLUDED.summary, url = EXCLUDED.url,
         published_at = EXCLUDED.published_at, office = EXCLUDED.office,
         components = EXCLUDED.components, topics = EXCLUDED.topics,
         state = EXCLUDED.state, theme = EXCLUDED.theme`,
      [c.doj_uuid, c.title, c.summary, c.url, c.published_at, c.office, c.components, c.topics, c.state, c.theme]
    );
  }
  return cases.length;
}

function createdSeconds(r: DojRelease): number {
  const created = /(\d{9,})\s*<\/time>/.exec(r.created ?? '')?.[1];
  return created ? Number(created) : releaseSeconds(r) ?? 0;
}

async function catchUp(): Promise<void> {
  const previous = Number((await getCursor(CURSOR_NEWEST)) ?? 0);
  // First run: the backfill will cover history, so just take the newest few pages.
  const maxPages = previous ? CATCH_UP_MAX_PAGES : 3;
  let newest = previous;
  let saved = 0;
  let pages = 0;
  for (let page = 0; page < maxPages; page++) {
    const releases = await fetchPage({ sort: 'created', direction: 'DESC', page });
    pages++;
    if (releases.length === 0) break;
    saved += await savePage(releases);
    const created = releases.map(createdSeconds);
    newest = Math.max(newest, ...created);
    if (previous && Math.max(...created) < previous - CATCH_UP_SLACK_SECONDS) break;
    await sleep(REQUEST_DELAY_MS);
  }
  if (newest > previous) await setCursor(CURSOR_NEWEST, String(newest));
  console.log(`catch-up: ${pages} page(s) read, ${saved} fraud case(s) saved`);
}

async function databaseMb(): Promise<number> {
  const { rows } = await pool.query<{ bytes: string }>('SELECT pg_database_size(current_database())::text AS bytes');
  return Number(rows[0].bytes) / 1024 / 1024;
}

async function backfill(): Promise<void> {
  if (await getCursor(CURSOR_DONE)) {
    console.log('backfill: complete (nothing to do)');
    return;
  }
  const sizeMb = await databaseMb();
  if (sizeMb > STORAGE_LIMIT_MB * STORAGE_GUARD_FRACTION) {
    console.warn(
      `backfill: PAUSED — database is ${Math.round(sizeMb)} MB of a ${STORAGE_LIMIT_MB} MB limit. ` +
        'Raise the Render disk size (and DB_STORAGE_LIMIT_MB) to continue.'
    );
    return;
  }

  let page = Number((await getCursor(CURSOR_PAGE)) ?? 0);
  const start = page;
  let saved = 0;
  try {
    for (let i = 0; i < BACKFILL_PAGES; i++) {
      const releases = await fetchPage({ sort: 'created', direction: 'ASC', page });
      saved += await savePage(releases);
      if (releases.length < PAGE_SIZE) {
        await setCursor(CURSOR_DONE, new Date().toISOString());
        console.log(`backfill: reached the end of the archive at page ${page}`);
        break;
      }
      page++;
      if (page % 20 === 0) await setCursor(CURSOR_PAGE, String(page));
      await sleep(REQUEST_DELAY_MS);
    }
  } finally {
    await setCursor(CURSOR_PAGE, String(page));
    console.log(`backfill: pages ${start}–${page}, ${saved} fraud case(s) saved`);
  }
}

async function main() {
  // Catch-up first: it is the part people notice (today's cases), and it
  // must not wait behind a long backfill.
  await catchUp();
  await backfill();
  const { rows } = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM federal_cases');
  console.log(`federal_cases: ${rows[0].count} total, database ${Math.round(await databaseMb())} MB`);
  await pool.end();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
