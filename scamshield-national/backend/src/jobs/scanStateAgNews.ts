// Powers state-scoped entries on the "Today's Scams" feed, and the
// state-level data behind the Global Map's planned zoom-to-region view.
// Run daily alongside scanDailyScamNews (see README).
//
// Coverage comes from two tiers, because state Attorney General offices are
// wildly inconsistent about publishing machine-readable feeds. All 51
// jurisdictions were probed directly: only 18 expose a working RSS/Atom
// feed, so the rest are covered via news search naming the office.
//
//   tier 'ag'   — the office's own feed. First-party and authoritative, but
//                 it carries every press release, so items are filtered for
//                 scam/fraud relevance before being kept.
//   tier 'news' — a Google News query naming that state's Attorney General.
//                 Secondary coverage, but it reaches every state.
//
// Rows are deduped by source_url like the general news scan, so re-running
// is safe and the two tiers can overlap without creating duplicates.
import 'dotenv/config';
import { XMLParser } from 'fast-xml-parser';
import { pool } from '../db/connection';

// States whose AG publishes a usable feed, verified by probing all 51.
const STATE_AG_FEEDS: Partial<Record<string, string>> = {
  AL: 'https://www.alabamaag.gov/feed/',
  AR: 'https://arkansasag.gov/news-alerts/news-releases/feed/',
  CA: 'https://oag.ca.gov/taxonomy/term/948/feed',
  CO: 'https://coag.gov/category/press-releases/feed/',
  DC: 'https://oag.dc.gov/taxonomy/term/63/feed',
  DE: 'https://news.delaware.gov/category/justice/prs/fraud/feed/',
  HI: 'https://cca.hawaii.gov/feed/',
  ID: 'https://www.ag.idaho.gov/consumer-protection/alerts/feed/',
  MO: 'https://ago.mo.gov/press-releases/feed/',
  MS: 'https://attorneygenerallynnfitch.com/media/press-releases/feed/',
  ND: 'https://attorneygeneral.nd.gov/feed/',
  NJ: 'https://www.njoag.gov/feed/',
  OR: 'https://www.doj.state.or.us/media-home/news-media-releases/category/consumer-protection/feed/',
  PA: 'https://www.attorneygeneral.gov/taking-action/feed/',
  RI: 'https://riag.ri.gov/press-releases.xml',
  TX: 'https://www.texasattorneygeneral.gov/taxonomy/term/671/feed',
  UT: 'https://attorneygeneral.utah.gov/feed/',
  VT: 'https://ago.vermont.gov/taxonomy/term/9/feed',
};

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

// An AG press feed carries everything the office publishes — indictments,
// appointments, settlements, hearings. Only keep items that read as consumer
// scam/fraud warnings.
//
// This is matched against the TITLE ONLY, deliberately. Matching the
// description too was tried first and gave 31% false positives out of 108
// real items: a press release whose body merely mentions fraud in passing
// got pulled in, and an "elder abuse" term dragged in a nursing-home assault
// case that has nothing to do with scams.
//
// The alert vocabulary below (warns/consumer alert/beware) is kept alongside
// the scam vocabulary because real alerts often name the lure instead of the
// category — "Warns Delawareans of Bogus Tax E-mails" contains no scam word
// at all. Tuned against 108 actual AG headlines: keeps the genuine alerts,
// drops settlements, hearings and unrelated prosecutions.
const RELEVANT =
  /\b(scam|fraud|fraudulent|phishing|spoof|imposter|impostor|identity theft|robocall|price goug|deceptive|ponzi|swindl|predatory|counterfeit|deceiv|consumer alert|consumer warning|consumer advisory|warns?\b|warning|beware|urges consumers|alerts consumers)/i;

// source_url is the dedupe key and is indexed, so it cannot be truncated.
// Anything past the column width is dropped rather than silently mangled.
const MAX_SOURCE_URL = 2048;

const RETENTION_DAYS = 30;
const REQUEST_DELAY_MS = 400;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

interface Candidate {
  headline: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: Date | null;
  searchTerm: string;
  state: string;
  sourceKind: 'ag' | 'news';
}

function textOf(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object' && '#text' in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)['#text'] ?? '');
  }
  return v == null ? '' : String(v);
}

function itemsFrom(xml: string): Record<string, unknown>[] {
  const parsed = parser.parse(xml);
  // RSS puts items at rss.channel.item; Atom uses feed.entry.
  const raw = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? [];
  return Array.isArray(raw) ? raw : [raw];
}

async function fetchXml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ScamShieldNational/1.0 (+state AG scam alert scan)' },
    });
    if (!res.ok) {
      console.error(`scanStateAgNews: ${res.status} for ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(`scanStateAgNews: fetch failed for ${url}`, (err as Error).message);
    return null;
  }
}

function parseDate(raw: unknown): Date | null {
  const s = textOf(raw);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Tier 'ag': the office's own feed, filtered for scam relevance.
async function fromAgFeed(state: string, feedUrl: string): Promise<Candidate[]> {
  const xml = await fetchXml(feedUrl);
  if (!xml) return [];
  const out: Candidate[] = [];
  for (const item of itemsFrom(xml)) {
    const title = textOf(item.title).trim();
    const link = textOf(item.link) || textOf((item.link as Record<string, unknown>)?.href);
    if (!title || !link) continue;
    if (!RELEVANT.test(title)) continue;
    out.push({
      headline: title,
      sourceName: `${STATE_NAMES[state]} Attorney General`,
      sourceUrl: link.trim(),
      publishedAt: parseDate(item.pubDate ?? item.published ?? item.updated),
      searchTerm: `${state} AG feed`,
      state,
      sourceKind: 'ag',
    });
  }
  return out;
}

// Tier 'news': news coverage naming that state's Attorney General.
async function fromNewsSearch(state: string): Promise<Candidate[]> {
  const term = `"${STATE_NAMES[state]} Attorney General" scam`;
  const query = encodeURIComponent(`${term} when:7d`);
  const xml = await fetchXml(
    `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`
  );
  if (!xml) return [];
  const out: Candidate[] = [];
  for (const item of itemsFrom(xml)) {
    const rawTitle = textOf(item.title).trim();
    const link = textOf(item.link);
    if (!rawTitle || !link) continue;
    const sourceName = textOf(item.source) || 'Unknown source';
    const suffix = ` - ${sourceName}`;
    out.push({
      headline: rawTitle.endsWith(suffix) ? rawTitle.slice(0, -suffix.length).trim() : rawTitle,
      sourceName,
      sourceUrl: link.trim(),
      publishedAt: parseDate(item.pubDate),
      searchTerm: term,
      state,
      sourceKind: 'news',
    });
  }
  return out;
}

async function save(c: Candidate): Promise<boolean> {
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

async function main() {
  const states = Object.keys(STATE_NAMES).sort();
  let scanned = 0;
  let inserted = 0;
  let agStates = 0;

  for (const state of states) {
    const feed = STATE_AG_FEEDS[state];
    const candidates = feed ? await fromAgFeed(state, feed) : [];
    if (feed) {
      agStates += 1;
      await sleep(REQUEST_DELAY_MS);
    }
    // Always run the news tier too: an AG feed can be quiet for weeks, and
    // dedupe by source_url makes the overlap free.
    const news = await fromNewsSearch(state);
    await sleep(REQUEST_DELAY_MS);

    const all = [...candidates, ...news];
    scanned += all.length;
    for (const c of all) {
      if (await save(c)) inserted += 1;
    }
  }

  const { rowCount } = await pool.query(
    `DELETE FROM daily_scam_news
     WHERE state IS NOT NULL AND scanned_at < NOW() - INTERVAL '${RETENTION_DAYS} days'`
  );

  console.log(
    `scanStateAgNews: ${scanned} items scanned across ${states.length} states ` +
      `(${agStates} with a first-party AG feed), ${inserted} new, ${rowCount ?? 0} pruned`
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
