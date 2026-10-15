// The state Attorney General feed engine. Powers each state page's "Latest
// alerts" and the state-tagged entries on Today's Scams.
//
// Every state with a readable first-party source (agFeedSources.ts — feeds,
// press-release pages, and a few one-off formats) is read directly, several
// times a day. A state without one, or whose source fails this run, falls
// back to news coverage naming that state's Attorney General.
//
// Rules that keep the feed clean:
//   - First-party releases are filtered for scam/fraud relevance (title
//     only; see relevantFilter.ts) and kept for a year.
//   - News items are a fallback and kept for 30 days. A news item that is
//     the same story as something already stored ("Florida AG warns of price
//     gouging..." vs "Florida officials warn of price gouging...") is not
//     saved, and news copies of a first-party release are removed when the
//     release arrives. First-party releases are never merged with each other:
//     offices reuse headline templates for unrelated actions.
//   - Every first-party read is recorded in ag_feed_status, which monitoring
//     checks, so a source that breaks is noticed instead of going stale.
import 'dotenv/config';
import { pool } from '../db/connection';
import { RELEVANT } from './relevantFilter';
import { AG_SOURCES, AgSource, MAX_ITEMS_PER_SOURCE } from './agFeedSources';
import {
  canonicalUrl,
  dateFromReleasePage,
  extractHtmlReleases,
  FeedItem,
  isNearDuplicate,
  parseFeed,
  parseWpJson,
} from './agFeedParse';

const STATE_NAMES: Record<string, string> = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
};

// source_url is the dedupe key and is indexed, so it cannot be truncated.
// Anything past the column width is dropped rather than silently mangled.
const MAX_SOURCE_URL = 2048;

const NEWS_RETENTION_DAYS = 30;
const AG_RETENTION_DAYS = 365;
// News items are compared against what the state already has from the
// last three weeks; older coverage of a similar headline is a new story.
const DUPLICATE_WINDOW_DAYS = 21;
// Undated listing items cost one extra request each to date from the
// release page; cap that per state per run.
const MAX_DATE_LOOKUPS_PER_STATE = 15;
const REQUEST_DELAY_MS = 300;
// Node's fetch has no default timeout; a host that never answers would hang
// this unattended job forever.
const FETCH_TIMEOUT_MS = 20000;
// Several offices serve bot walls to obviously automated clients.
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 ScamShieldNational/1.0';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Candidate {
  headline: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: Date | null;
  searchTerm: string;
  state: string;
  sourceKind: 'ag' | 'news';
}

async function fetchText(url: string, extraHeaders: Record<string, string> = {}): Promise<{ body: string; finalUrl: string } | { error: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml,application/rss+xml,application/json;q=0.9,*/*;q=0.8',
        ...extraHeaders,
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok || res.status === 202) return { error: `HTTP ${res.status}` };
    return { body: await res.text(), finalUrl: res.url || url };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

function parseSource(src: AgSource, body: string, finalUrl: string): FeedItem[] {
  switch (src.type) {
    case 'rss':
      return parseFeed(body);
    case 'wp':
      return parseWpJson(body);
    case 'html':
      return extractHtmlReleases(body, finalUrl, src.linkPattern);
    case 'custom':
      return src.parse(body);
  }
}

async function alreadyStored(url: string): Promise<boolean> {
  const { rows } = await pool.query('SELECT 1 FROM daily_scam_news WHERE source_url = $1', [url]);
  return rows.length > 0;
}

async function recordStatus(
  state: string,
  src: AgSource,
  result: { count: number; newest: Date | null; error: string | null }
) {
  await pool.query(
    `INSERT INTO ag_feed_status (state, source_type, source_url, last_attempt_at, last_success_at, last_item_count, newest_item_at, last_error)
     VALUES ($1, $2, $3, NOW(), CASE WHEN $4 > 0 THEN NOW() END, $4, $5, $6)
     ON CONFLICT (state) DO UPDATE SET
       source_type = EXCLUDED.source_type,
       source_url = EXCLUDED.source_url,
       last_attempt_at = NOW(),
       last_success_at = CASE WHEN EXCLUDED.last_item_count > 0 THEN NOW() ELSE ag_feed_status.last_success_at END,
       last_item_count = EXCLUDED.last_item_count,
       newest_item_at = COALESCE(EXCLUDED.newest_item_at, ag_feed_status.newest_item_at),
       last_error = EXCLUDED.last_error`,
    [state, src.type, src.url, result.count, result.newest, result.error]
  );
}

// Tier 'ag': the office's own publication.
async function fromFirstParty(state: string, src: AgSource): Promise<{ candidates: Candidate[]; ok: boolean }> {
  const fetched = await fetchText(src.url, src.type === 'custom' ? src.headers : undefined);
  if ('error' in fetched) {
    console.error(`scanStateAgNews: ${state} source failed (${fetched.error}) ${src.url}`);
    await recordStatus(state, src, { count: 0, newest: null, error: fetched.error });
    return { candidates: [], ok: false };
  }

  let items: FeedItem[];
  try {
    items = parseSource(src, fetched.body, fetched.finalUrl).slice(0, MAX_ITEMS_PER_SOURCE);
  } catch (err) {
    const error = `parse failed: ${(err as Error).message}`;
    await recordStatus(state, src, { count: 0, newest: null, error });
    return { candidates: [], ok: false };
  }

  const newest = items.reduce<Date | null>((max, i) => (i.publishedAt && (!max || i.publishedAt > max) ? i.publishedAt : max), null);
  // A source that answers but yields nothing (a comments feed, a redesigned
  // page the pattern no longer matches) is a failure too, and recorded as one.
  await recordStatus(state, src, {
    count: items.length,
    newest,
    error: items.length ? null : 'source answered but no releases were found in it',
  });
  if (!items.length) return { candidates: [], ok: false };

  const cutoff = Date.now() - AG_RETENTION_DAYS * 86400000;
  const candidates: Candidate[] = [];
  let lookups = 0;
  for (const item of items) {
    if (!RELEVANT.test(item.title)) continue;
    const url = canonicalUrl(item.url);
    let publishedAt = item.publishedAt;
    if (!publishedAt) {
      if (await alreadyStored(url)) continue;
      if (lookups >= MAX_DATE_LOOKUPS_PER_STATE) continue;
      lookups += 1;
      const page = await fetchText(url);
      if (!('error' in page)) publishedAt = dateFromReleasePage(page.body);
      await sleep(REQUEST_DELAY_MS);
    }
    // An undated release can't be placed on a timeline, and stamping it
    // "now" would present an old release as breaking news. Skip it.
    if (!publishedAt || publishedAt.getTime() < cutoff) continue;
    candidates.push({
      headline: item.title,
      sourceName: `${STATE_NAMES[state]} Attorney General`,
      sourceUrl: url,
      publishedAt,
      searchTerm: `${state} AG ${src.type}`,
      state,
      sourceKind: 'ag',
    });
  }
  return { candidates, ok: true };
}

// A Google News query for "Florida Attorney General" scam returns whatever
// the ranker thinks is close, and the news tier used to stamp every result
// with the state it searched for. That tag then meant "Google returned this
// for Florida", not "this is about Florida" — which put a Georgia prison
// story under Florida's alerts.
//
// The headline is all we have (the news tier stores no summary), so the test
// is deliberately narrow: reject an item whose headline names a different
// state and never names the target one. A story naming both — "Washington man
// charged in Florida scam" — is real coverage of the target state and stays.
function namesOnlyAnotherState(headline: string, state: string): boolean {
  const target = STATE_NAMES[state];
  if (!target) return false;
  const mentions = (name: string) => new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(headline);
  if (mentions(target)) return false;
  return Object.entries(STATE_NAMES).some(([code, name]) => code !== state && mentions(name));
}

// Tier 'news': news coverage naming that state's Attorney General. A
// fallback for states whose own source is missing or failed this run.
async function fromNewsSearch(state: string): Promise<Candidate[]> {
  const term = `"${STATE_NAMES[state]} Attorney General" scam`;
  const query = encodeURIComponent(`${term} when:7d`);
  const fetched = await fetchText(`https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`);
  if ('error' in fetched) {
    console.error(`scanStateAgNews: ${state} news search failed (${fetched.error})`);
    return [];
  }
  const out: Candidate[] = [];
  for (const item of parseFeed(fetched.body)) {
    // The AG tier has always been relevance-filtered; the news tier leaned on
    // the word "scam" being in the query, which the ranker does not honour.
    if (!RELEVANT.test(item.title)) continue;
    if (namesOnlyAnotherState(item.title, state)) continue;
    // Google News titles end in " - Outlet Name".
    const cut = item.title.lastIndexOf(' - ');
    const headline = cut > 20 ? item.title.slice(0, cut).trim() : item.title;
    const sourceName = cut > 20 ? item.title.slice(cut + 3).trim() : 'News coverage';
    out.push({
      headline,
      sourceName,
      sourceUrl: item.url,
      publishedAt: item.publishedAt,
      searchTerm: term,
      state,
      sourceKind: 'news',
    });
  }
  return out;
}

async function insert(c: Candidate): Promise<boolean> {
  if (c.sourceUrl.length > MAX_SOURCE_URL) {
    console.error(`scanStateAgNews: skipping over-long URL (${c.sourceUrl.length} chars) for ${c.state}`);
    return false;
  }
  const { rows } = await pool.query(
    `INSERT INTO daily_scam_news
       (headline, summary, source_name, source_url, published_at, search_term, state, source_kind)
     VALUES ($1, NULL, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (source_url) DO NOTHING
     RETURNING id`,
    [c.headline, c.sourceName, c.sourceUrl, c.publishedAt, c.searchTerm, c.state, c.sourceKind]
  );
  return rows.length > 0;
}

async function recentHeadlines(state: string): Promise<{ id: string; headline: string; source_kind: string }[]> {
  const { rows } = await pool.query(
    `SELECT id, headline, source_kind FROM daily_scam_news
     WHERE state = $1 AND COALESCE(published_at, scanned_at) > NOW() - INTERVAL '${DUPLICATE_WINDOW_DAYS} days'`,
    [state]
  );
  return rows;
}

// Saves one state's candidates: first-party releases always, and news only
// when it is not a story the state already has.
async function saveState(state: string, candidates: Candidate[]): Promise<{ inserted: number; skipped: number; removed: number }> {
  const recent = await recentHeadlines(state);
  let inserted = 0;
  let skipped = 0;
  let removed = 0;

  for (const c of candidates.filter((x) => x.sourceKind === 'ag')) {
    if (!(await insert(c))) continue;
    inserted += 1;
    const copies = recent.filter((r) => r.source_kind === 'news' && isNearDuplicate(r.headline, c.headline)).map((r) => r.id);
    if (copies.length) {
      await pool.query('DELETE FROM daily_scam_news WHERE id = ANY($1::uuid[])', [copies]);
      removed += copies.length;
    }
    recent.push({ id: '', headline: c.headline, source_kind: 'ag' });
  }

  for (const c of candidates.filter((x) => x.sourceKind === 'news')) {
    if (recent.some((r) => isNearDuplicate(r.headline, c.headline))) {
      skipped += 1;
      // Remember the skipped wording too: a third copy may resemble this
      // one more than the original it was matched against.
      recent.push({ id: '', headline: c.headline, source_kind: 'news' });
      continue;
    }
    if (await insert(c)) {
      inserted += 1;
      recent.push({ id: '', headline: c.headline, source_kind: 'news' });
    }
  }
  return { inserted, skipped, removed };
}

// Re-checks stored news-tier rows against the current rules each run, in JS
// so each rule has one definition rather than a SQL copy that drifts:
// off-topic or mistagged rows, and near-duplicate copies of the same story
// (kept: a first-party release over any news copy, else the earliest copy).
async function purgeStaleNews(): Promise<number> {
  const { rows } = await pool.query<{ id: string; headline: string; state: string; source_kind: string; at: Date }>(
    `SELECT id, headline, state, source_kind, COALESCE(published_at, scanned_at) AS at
     FROM daily_scam_news WHERE state IS NOT NULL AND state <> 'US'
     ORDER BY (source_kind = 'ag') DESC, COALESCE(published_at, scanned_at) ASC`
  );
  const doomed: string[] = [];
  const kept = new Map<string, { headline: string; at: Date }[]>();
  for (const r of rows) {
    const list = kept.get(r.state) ?? [];
    if (r.source_kind === 'news') {
      const offTopic = !RELEVANT.test(r.headline) || namesOnlyAnotherState(r.headline, r.state);
      const dup = list.some(
        (k) => Math.abs(k.at.getTime() - r.at.getTime()) < DUPLICATE_WINDOW_DAYS * 86400000 && isNearDuplicate(k.headline, r.headline)
      );
      if (offTopic || dup) {
        doomed.push(r.id);
        // A duplicate's wording still describes the story it duplicates.
        if (dup) list.push({ headline: r.headline, at: r.at });
        continue;
      }
    }
    list.push({ headline: r.headline, at: r.at });
    kept.set(r.state, list);
  }
  if (!doomed.length) return 0;
  const { rowCount } = await pool.query('DELETE FROM daily_scam_news WHERE id = ANY($1::uuid[])', [doomed]);
  return rowCount ?? 0;
}

async function main() {
  const states = Object.keys(STATE_NAMES).sort();
  let inserted = 0;
  let skipped = 0;
  let removed = 0;
  const firstPartyOk: string[] = [];
  const firstPartyFailed: string[] = [];
  const newsOnly: string[] = [];

  for (const state of states) {
    const src = AG_SOURCES[state];
    let candidates: Candidate[] = [];
    let needNews = true;
    if (src) {
      const result = await fromFirstParty(state, src);
      candidates = result.candidates;
      (result.ok ? firstPartyOk : firstPartyFailed).push(state);
      needNews = !result.ok;
      await sleep(REQUEST_DELAY_MS);
    } else {
      newsOnly.push(state);
    }
    // News coverage only where the office's own source is missing or failed
    // this run — otherwise it just adds copies of releases we already have.
    if (needNews) {
      candidates.push(...(await fromNewsSearch(state)));
      await sleep(REQUEST_DELAY_MS);
    }
    const r = await saveState(state, candidates);
    inserted += r.inserted;
    skipped += r.skipped;
    removed += r.removed;
  }

  const { rowCount: pruned } = await pool.query(
    `DELETE FROM daily_scam_news
     WHERE state IS NOT NULL AND state <> 'US' AND (
       (source_kind = 'news' AND scanned_at < NOW() - INTERVAL '${NEWS_RETENTION_DAYS} days')
       OR (source_kind = 'ag' AND COALESCE(published_at, scanned_at) < NOW() - INTERVAL '${AG_RETENTION_DAYS} days')
     )`
  );
  const purged = await purgeStaleNews();

  console.log(
    `scanStateAgNews: first-party OK ${firstPartyOk.length} [${firstPartyOk.join(' ')}], ` +
      `FAILED ${firstPartyFailed.length} [${firstPartyFailed.join(' ')}], news-only ${newsOnly.length} [${newsOnly.join(' ')}]. ` +
      `${inserted} new, ${skipped} duplicate news skipped, ${removed} news copies replaced by the official release, ` +
      `${pruned ?? 0} expired, ${purged} off-topic/duplicate news removed`
  );
  await pool.end();
}

// Guards against another script importing this file and running a whole
// scan as a side effect.
if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
