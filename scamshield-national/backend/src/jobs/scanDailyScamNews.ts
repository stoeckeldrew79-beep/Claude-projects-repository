// Powers the "Today's Scams" page. Run daily (see README "Scheduling the
// daily scam news scan") to pull real, live scam-related headlines from US
// news coverage via Google News' public RSS search — no API key required.
//
// Unlike generateDailyDrafts.ts, this is fully automatic by design: items
// are inserted directly, not held in a review queue. source_url is UNIQUE
// (see migration 018), so re-running this — including multiple times a
// day — is safe; duplicate stories are silently skipped rather than
// re-inserted or updated. Rows older than 30 days are pruned at the end of
// each run so the table stays a rolling window of recent news, not an
// ever-growing archive.
import 'dotenv/config';
import { XMLParser } from 'fast-xml-parser';
import { pool } from '../db/connection';

// Distinct queries rather than one broad "scam" search, so coverage isn't
// dominated by whichever single term trends hardest that day. Each term is
// a separate RSS request, and results are deduped by source_url on insert,
// so overlap between terms costs nothing but a little bandwidth.
//
// Every term below was measured against the original five before being
// added: each one returns stories the others do not. Roughly 2.5x the
// unique headlines of the original set.
const US_SEARCH_TERMS = [
  'scam warning',
  'fraud scheme charged',
  'phishing scam',
  'scam arrest',
  'consumer alert scam',
  'romance scam',
  'crypto investment fraud',
  'elder fraud charged',
  'IRS impersonation scam',
  'gift card scam',
  'tech support scam',
  'business email compromise',
  'SIM swap fraud',
  'Medicare fraud charged',
  'deepfake scam',
  'utility scam warning',
  'rental scam',
  'employment scam',
  'charity fraud',
  'student loan scam',
];

// International coverage is done with country-targeted TERMS, not with
// Google News' locale parameters. Setting hl/gl/ceid to GB, AU, CA, IE, SG,
// IN or NZ was measured and does NOT meaningfully change the results for an
// English query — US and GB returned 85 of the same 87 links, and four
// locales together yielded 95 unique links against 87 for US alone. Naming
// the country's own fraud agency in the query is what actually surfaces
// local coverage. Add more countries by following the same pattern.
const INTERNATIONAL_SEARCH_TERMS = [
  'ACCC Scamwatch scam',              // Australia
  'Action Fraud scam UK',             // United Kingdom
  'Canadian Anti-Fraud Centre scam',  // Canada
  'Singapore police scam alert',      // Singapore
  'India cyber fraud arrest',         // India
  'Garda fraud warning Ireland',      // Ireland
];

const SEARCH_TERMS = [...US_SEARCH_TERMS, ...INTERNATIONAL_SEARCH_TERMS];

// Small pause between requests so a ~26-term run stays a polite trickle
// rather than a burst against Google News.
const REQUEST_DELAY_MS = 400;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Google News matches on article body, not headline, so a query for "scam"
// happily returns a council election or a true-crime documentary. Every
// candidate is checked against the headline before it reaches the feed.
//
// Measured against 417 real headlines pulled from these 26 search terms:
// this keeps 313 and drops 104. The state AG scanner's filter was tried
// first and is wrong here — its soft "warns/warning/beware" tier carries
// signal in an agency press release but not in general news, where it
// admits things like "true crime doc that comes with strong warning". Only
// core fraud vocabulary counts. Bare "cybercrime" was tried and dropped
// too: it let in a defamation arrest by a cybercrime unit.
//
// The trade is deliberate. A handful of real stories that never say a
// fraud word ("Connecticut AG Issues Crypto Alert After Investor Loses
// $200K") are lost to keep obvious noise off the front page. For a feed
// whose whole value is being trustworthy, that is the right direction to
// err. Re-measure before loosening it.
const RELEVANT =
  /\b(scams?|scammers?|scamming|frauds?|fraudster|fraudulent|defraud\w*|phish\w*|smishing|vishing|spoof\w*|impost[eo]rs?|impersonat\w*|identity theft|robocalls?|ponzi|pyramid scheme|swindl\w*|counterfeit\w*|catfish\w*|sextortion|extortion|money launder\w*|money mule|embezzl\w*|racketeering|con artists?|conned|bogus|fake|digital arrest|cyber ?fraud|duped?|price goug\w*|deceptive|elder financial (?:abuse|exploitation))/i;

const RETENTION_DAYS = 30;

interface FeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  source?: { '#text'?: string } | string;
}

interface NewsCandidate {
  headline: string;
  summary: string | null;
  sourceName: string;
  sourceUrl: string;
  publishedAt: Date | null;
  searchTerm: string;
}

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

// Google News titles are usually "Actual Headline - Source Name" — strip
// the trailing source suffix since we already store the source separately.
function cleanHeadline(rawTitle: string, sourceName: string): string {
  const suffix = ` - ${sourceName}`;
  return rawTitle.endsWith(suffix) ? rawTitle.slice(0, -suffix.length).trim() : rawTitle.trim();
}

async function fetchCandidates(searchTerm: string): Promise<NewsCandidate[]> {
  const query = `${searchTerm} when:2d`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

  const res = await fetch(url, { headers: { 'User-Agent': 'ScamShieldNational/1.0 (+daily scam news scan)' } });
  if (!res.ok) {
    console.error(`scanDailyScamNews: fetch failed for "${searchTerm}" (${res.status})`);
    return [];
  }
  const xml = await res.text();
  const parsed = parser.parse(xml);
  const rawItems: FeedItem[] = parsed?.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  const candidates: NewsCandidate[] = [];
  for (const item of items) {
    if (!item?.title || !item?.link) continue;
    const sourceName =
      (typeof item.source === 'object' ? item.source['#text'] : item.source) || 'Unknown source';
    const headline = cleanHeadline(String(item.title), sourceName);
    if (!RELEVANT.test(headline)) continue;
    const publishedAt = item.pubDate ? new Date(item.pubDate) : null;
    candidates.push({
      headline,
      // Google's search-result RSS <description> is always just the title
      // re-wrapped in a link plus the source name — never a real excerpt —
      // so there's nothing useful to extract into a summary here.
      summary: null,
      sourceName,
      sourceUrl: String(item.link).trim(),
      publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
      searchTerm,
    });
  }
  return candidates;
}

async function saveCandidate(candidate: NewsCandidate): Promise<boolean> {
  const { rows } = await pool.query(
    `INSERT INTO daily_scam_news (headline, summary, source_name, source_url, published_at, search_term)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (source_url) DO NOTHING
     RETURNING id`,
    [candidate.headline, candidate.summary, candidate.sourceName, candidate.sourceUrl, candidate.publishedAt, candidate.searchTerm]
  );
  return rows.length > 0;
}

async function pruneOldNews(): Promise<number> {
  const { rowCount } = await pool.query(
    `DELETE FROM daily_scam_news WHERE scanned_at < NOW() - INTERVAL '${RETENTION_DAYS} days'`
  );
  return rowCount ?? 0;
}

// Filtering new inserts leaves everything already stored untouched, so
// headlines admitted before the filter existed would sit on the feed for
// the full retention window. Re-checking the stored rows each run applies
// any change to the filter to the whole feed, not just what arrives next.
// Tested in JS against the same regex rather than in SQL, so there is one
// definition of relevance and no chance of the two drifting apart.
async function purgeIrrelevant(): Promise<number> {
  const { rows } = await pool.query<{ id: string; headline: string }>(
    'SELECT id, headline FROM daily_scam_news'
  );
  const stale = rows.filter((r) => !RELEVANT.test(r.headline)).map((r) => r.id);
  if (!stale.length) return 0;
  const { rowCount } = await pool.query('DELETE FROM daily_scam_news WHERE id = ANY($1::uuid[])', [stale]);
  return rowCount ?? 0;
}

async function main() {
  let scanned = 0;
  let inserted = 0;

  for (const term of SEARCH_TERMS) {
    const candidates = await fetchCandidates(term);
    await sleep(REQUEST_DELAY_MS);
    scanned += candidates.length;
    for (const candidate of candidates) {
      if (await saveCandidate(candidate)) inserted += 1;
    }
  }

  const pruned = await pruneOldNews();
  const purged = await purgeIrrelevant();
  console.log(
    `scanDailyScamNews: ${scanned} headlines scanned across ${SEARCH_TERMS.length} search terms, ${inserted} new, ${pruned} pruned (>${RETENTION_DAYS}d old), ${purged} removed as off-topic`
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
