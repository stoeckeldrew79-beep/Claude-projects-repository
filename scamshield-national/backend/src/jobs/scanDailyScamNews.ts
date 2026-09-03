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

// A handful of distinct queries rather than one broad "scam" search, so
// coverage isn't dominated by whichever single term trends hardest that day.
const SEARCH_TERMS = [
  'scam warning',
  'fraud scheme charged',
  'phishing scam',
  'scam arrest',
  'consumer alert scam',
];

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
    const publishedAt = item.pubDate ? new Date(item.pubDate) : null;
    candidates.push({
      headline: cleanHeadline(String(item.title), sourceName),
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

async function main() {
  let scanned = 0;
  let inserted = 0;

  for (const term of SEARCH_TERMS) {
    const candidates = await fetchCandidates(term);
    scanned += candidates.length;
    for (const candidate of candidates) {
      if (await saveCandidate(candidate)) inserted += 1;
    }
  }

  const pruned = await pruneOldNews();
  console.log(
    `scanDailyScamNews: ${scanned} headlines scanned across ${SEARCH_TERMS.length} search terms, ${inserted} new, ${pruned} pruned (>${RETENTION_DAYS}d old)`
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
