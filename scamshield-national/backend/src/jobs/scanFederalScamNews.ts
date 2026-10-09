// Powers a federal-level live feed — the US Department of Justice (headed
// by the US Attorney General) and the FTC, the two federal agencies whose
// own press releases cover fraud enforcement nationwide. Same shape as
// scanStateAgNews.ts, one tier per agency, both first-party.
//
// Rows are tagged state = 'US' rather than a real two-letter postal code.
// That is deliberate: it is a jurisdiction column, and "federal" is a real
// jurisdiction distinct from "state" or "international/no jurisdiction"
// (NULL). Every reader of daily_scam_news.state that treats it as "one of
// the 50 states + DC" (the Global Map, the state dropdown, the state-count
// endpoint) must exclude 'US' explicitly — see dailyNews.ts controller.
//
// Rows are deduped by source_url like the other two scanners, so re-running
// is safe.
import 'dotenv/config';
import { XMLParser } from 'fast-xml-parser';
import { pool } from '../db/connection';
import { RELEVANT } from './scanStateAgNews';

interface FederalSource {
  name: string;
  feedUrl: string;
  searchTerm: string;
}

// Both independently verified live and returning real, current RSS 2.0
// content before being added (DOJ: Justice News press releases; FTC: the
// Consumer Protection press-release feed specifically, not the broader
// all-topics feed, so this isn't diluted with competition/antitrust news).
const FEDERAL_SOURCES: FederalSource[] = [
  {
    name: 'U.S. Department of Justice',
    feedUrl: 'https://www.justice.gov/news/rss?type=press_release',
    searchTerm: 'DOJ press feed',
  },
  {
    name: 'Federal Trade Commission',
    feedUrl: 'https://www.ftc.gov/feeds/press-release-consumer-protection.xml',
    searchTerm: 'FTC consumer protection press feed',
  },
];

const MAX_SOURCE_URL = 2048;
const RETENTION_DAYS = 30;
const REQUEST_DELAY_MS = 400;
const FETCH_TIMEOUT_MS = 20000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

interface Candidate {
  headline: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: Date | null;
  searchTerm: string;
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
  const raw = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? [];
  return Array.isArray(raw) ? raw : [raw];
}

function parseDate(raw: unknown): Date | null {
  const s = textOf(raw);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function fetchXml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ScamShieldNational/1.0 (+federal scam alert scan)' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`scanFederalScamNews: ${res.status} for ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(`scanFederalScamNews: fetch failed for ${url}`, (err as Error).message);
    return null;
  }
}

async function fromSource(source: FederalSource): Promise<Candidate[]> {
  const xml = await fetchXml(source.feedUrl);
  if (!xml) return [];
  const out: Candidate[] = [];
  for (const item of itemsFrom(xml)) {
    const title = textOf(item.title).trim();
    const link = textOf(item.link) || textOf((item.link as Record<string, unknown>)?.href);
    if (!title || !link) continue;
    if (!RELEVANT.test(title)) continue;
    out.push({
      headline: title,
      sourceName: source.name,
      sourceUrl: link.trim(),
      publishedAt: parseDate(item.pubDate ?? item.published ?? item.updated),
      searchTerm: source.searchTerm,
    });
  }
  return out;
}

async function save(c: Candidate): Promise<boolean> {
  if (c.sourceUrl.length > MAX_SOURCE_URL) {
    console.error(`scanFederalScamNews: skipping over-long URL (${c.sourceUrl.length} chars)`);
    return false;
  }
  const { rows } = await pool.query(
    `INSERT INTO daily_scam_news
       (headline, summary, source_name, source_url, published_at, search_term, state, source_kind)
     VALUES ($1, NULL, $2, $3, $4, $5, 'US', 'ag')
     ON CONFLICT (source_url) DO NOTHING
     RETURNING id`,
    [c.headline, c.sourceName, c.sourceUrl, c.publishedAt, c.searchTerm]
  );
  return rows.length > 0;
}

// Mirrors scanStateAgNews.ts's purgeMistagged: re-checks stored federal rows
// against the current filter each run, so a filter change reaches rows
// already on the page, not just new ones.
async function purgeIrrelevant(): Promise<number> {
  const { rows } = await pool.query<{ id: string; headline: string }>(
    "SELECT id, headline FROM daily_scam_news WHERE state = 'US'"
  );
  const stale = rows.filter((r) => !RELEVANT.test(r.headline)).map((r) => r.id);
  if (!stale.length) return 0;
  const { rowCount } = await pool.query('DELETE FROM daily_scam_news WHERE id = ANY($1::uuid[])', [stale]);
  return rowCount ?? 0;
}

async function main() {
  let scanned = 0;
  let inserted = 0;

  for (const source of FEDERAL_SOURCES) {
    const candidates = await fromSource(source);
    await sleep(REQUEST_DELAY_MS);
    scanned += candidates.length;
    for (const c of candidates) {
      if (await save(c)) inserted += 1;
    }
  }

  const { rowCount } = await pool.query(
    `DELETE FROM daily_scam_news
     WHERE state = 'US' AND scanned_at < NOW() - INTERVAL '${RETENTION_DAYS} days'`
  );

  const purged = await purgeIrrelevant();
  console.log(
    `scanFederalScamNews: ${scanned} items scanned across ${FEDERAL_SOURCES.length} federal sources, ` +
      `${inserted} new, ${rowCount ?? 0} pruned, ${purged} removed as off-topic`
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
