import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';
import { INTERNATIONAL_SEARCH_TERMS } from '../jobs/dailyNewsSearchTerms';
// Pure modules (no main(), no DB) - safe to import from a request handler.
import { INVESTOR_SPAM_PG, PRESS_WIRE_PG, WIRE_LITIGATION_PG } from '../jobs/newsQuality';
import { clusterStories, dojOfficeFromUrl, fraudTheme, themeCounts } from '../jobs/newsCluster';

// Most stories any single outlet may contribute to the Today's Scams feed.
const MAX_STORIES_PER_SOURCE = 2;

// One page of the feed. The page used to take a flat 100 and stop, which is
// not "today's scams ran out" but "the query said 100" - the table holds a
// 30-day window and the reader could not reach past the first screenful.
const PAGE_SIZE = 50;

function pageOffset(raw: unknown): number {
  const page = Number(typeof raw === 'string' ? raw : 1);
  return Number.isFinite(page) && page > 1 ? Math.floor(page - 1) * PAGE_SIZE : 0;
}

// A row is unambiguously US if it's state-tagged (state-AG feeds and the
// state-scoped scan are both US-only by construction). A state-less row
// came from the general news scan, which runs US and international queries
// side by side (see scanDailyScamNews.ts) — search_term is the only record
// of which, so "US only" excludes state-less rows whose search_term is one
// of the international queries.
function usOnlyRequested(req: AuthedRequest): boolean {
  return req.query.scope === 'us';
}

// Powers the "Recent AI Scam Activity" strip on the AI-Enabled Scams page.
// A headline filter, not a search_term filter: the general scan's
// "deepfake scam" query is one of 26 terms feeding this table, but an
// AI-voice-clone story just as often surfaces under "romance scam" or
// "crypto investment fraud" — so this has to look at what the headline
// actually says, not which query happened to find it.
//
// \y is Postgres's word-boundary escape (POSIX ARE, not PCRE — \b means
// backspace here, not boundary). It's load-bearing on "ai" specifically:
// without it, a case-insensitive substring match on "ai" hits "said",
// "email", "claim", "detail" constantly. The longer terms (deepfake,
// chatbot, ...) don't strictly need it, but keeping every alternative
// inside the same \y...\y group is simpler than deciding term by term.
const AI_TOPIC_PATTERN =
  '\\y(ai|deepfake|deep fake|voice clon\\w*|voice-clon\\w*|cloned voice|synthetic voice|voice spoof\\w*|chatbot|generative ai)\\y';

function aiTopicRequested(req: AuthedRequest): boolean {
  return req.query.topic === 'ai';
}

type SourceKind = 'ag' | 'federal' | 'news';

// Everything that narrows the Today's Scams feed. One parser, one SQL
// builder: list() and count() both go through feedCte() below, so the count
// the page reserves placeholder height from cannot drift from the rows the
// list actually returns.
interface FeedFilter {
  state: string | null;
  usOnly: boolean;
  // Source-type chip on Today's Scams: official AG / federal / news only.
  kind: SourceKind | null;
}

function parseFilter(req: AuthedRequest): FeedFilter {
  const raw = typeof req.query.state === 'string' ? req.query.state.toUpperCase() : '';
  const kind = req.query.kind;
  return {
    state: /^[A-Z]{2}$/.test(raw) ? raw : null,
    usOnly: usOnlyRequested(req),
    kind: kind === 'ag' || kind === 'federal' || kind === 'news' ? kind : null,
  };
}

// A narrow view - one state, or official sources only - has few enough rows
// that the per-outlet cap would only hide real alerts (each AG office is a
// single "outlet"), and official items sort ahead of coverage of them.
function isNarrow(f: FeedFilter): boolean {
  return Boolean(f.state) || f.kind === 'ag' || f.kind === 'federal';
}

// Shareholder class-action solicitations (newsQuality.ts), excluded at query
// time as well as at ingest so rows stored before the filter existed never
// render, even between a deploy and the next scan. News rows only: official
// AG and federal releases come from their own vetted scanners.
function notInvestorSpamSql(params: unknown[]): string {
  params.push(INVESTOR_SPAM_PG, PRESS_WIRE_PG, WIRE_LITIGATION_PG);
  const n = params.length;
  return `(source_kind <> 'news' OR NOT (headline ~* $${n - 2} OR (source_name ~* $${n - 1} AND headline ~* $${n})))`;
}

function feedWhere(f: FeedFilter, params: unknown[]): string {
  const clauses = [notInvestorSpamSql(params)];
  if (f.state) {
    // Every state-tagged row is already US, so scope=us is a no-op here.
    params.push(f.state);
    clauses.push(`state = $${params.length}`);
  } else if (f.usOnly) {
    params.push(INTERNATIONAL_SEARCH_TERMS);
    clauses.push(`(state IS NOT NULL OR NOT (search_term = ANY($${params.length})))`);
  }
  if (f.kind) {
    params.push(f.kind);
    clauses.push(`source_kind = $${params.length}`);
  }
  return clauses.join(' AND ');
}

// The visible feed as a CTE named "feed".
//
// Narrow views dedupe on exact headline (the same story syndicated under two
// URLs is two rows with one headline), first-party AG/federal copy winning.
//
// The broad view adds a per-outlet cap. Ordering purely by recency lets a
// single high-volume publisher take over the feed whenever it posts a burst -
// one outlet held 4 of the top 5 slots after a scan, which reads as a broken
// page rather than a live one. The filters sit inside the first CTE so a
// filtered view still fills its full per-source cap from matching
// candidates, rather than capping before filtering.
function feedCte(f: FeedFilter, params: unknown[]): string {
  const where = feedWhere(f, params);
  if (isNarrow(f)) {
    return `WITH deduped AS (
       SELECT *, ROW_NUMBER() OVER (
                PARTITION BY lower(headline)
                ORDER BY (source_kind IN ('ag', 'federal')) DESC,
                         COALESCE(published_at, scanned_at) DESC, id
              ) AS dupe_rank
       FROM daily_scam_news
       WHERE ${where}
     ),
     feed AS (SELECT * FROM deduped WHERE dupe_rank = 1)`;
  }
  params.push(MAX_STORIES_PER_SOURCE);
  return `WITH deduped AS (
       SELECT *, ROW_NUMBER() OVER (
                PARTITION BY lower(headline)
                ORDER BY COALESCE(published_at, scanned_at) DESC, id
              ) AS dupe_rank
       FROM daily_scam_news
       WHERE ${where}
     ),
     ranked AS (
       SELECT *, ROW_NUMBER() OVER (
                PARTITION BY source_name
                ORDER BY COALESCE(published_at, scanned_at) DESC, id
              ) AS source_rank
       FROM deduped
       WHERE dupe_rank = 1
     ),
     feed AS (SELECT * FROM ranked WHERE source_rank <= $${params.length})`;
}

// How many stories the feed holds, so the page can reserve its full height
// up front instead of growing (and shrinking the scrollbar thumb) as each
// batch loads. Reads the same feedCte() as list(), so it matches list()'s
// dedup, per-source cap and filters exactly.
export const count = asyncHandler<AuthedRequest>(async (req, res) => {
  const params: unknown[] = [];
  const cte = feedCte(parseFilter(req), params);
  const { rows } = await pool.query<{ count: string }>(`${cte} SELECT COUNT(*)::text AS count FROM feed`, params);
  res.json({ data: { count: Number(rows[0]?.count ?? 0) } });
});

export const list = asyncHandler<AuthedRequest>(async (req, res) => {
  if (aiTopicRequested(req)) {
    // The strip this feeds is a handful of headlines above a curated list,
    // not a paged feed — no per-source cap (the volume is low enough that
    // one outlet dominating isn't a real risk the way it is on the main
    // feed) and a fixed small limit rather than PAGE_SIZE/offset paging.
    const params: unknown[] = [AI_TOPIC_PATTERN];
    const notSpam = notInvestorSpamSql(params);
    const { rows } = await pool.query(
      `WITH deduped AS (
         SELECT *, ROW_NUMBER() OVER (
                  PARTITION BY lower(headline)
                  ORDER BY COALESCE(published_at, scanned_at) DESC, id
                ) AS dupe_rank
         FROM daily_scam_news
         WHERE headline ~* $1 AND ${notSpam}
       )
       SELECT id, headline, summary, source_name, source_url,
              published_at, search_term, scanned_at, state, source_kind
       FROM deduped
       WHERE dupe_rank = 1
       ORDER BY COALESCE(published_at, scanned_at) DESC, id
       LIMIT 8`,
      params
    );
    res.json({ data: rows });
    return;
  }

  const filter = parseFilter(req);
  const params: unknown[] = [];
  const cte = feedCte(filter, params);
  const order = isNarrow(filter)
    ? `(source_kind IN ('ag', 'federal')) DESC, COALESCE(published_at, scanned_at) DESC, id`
    : `COALESCE(published_at, scanned_at) DESC, id`;
  params.push(PAGE_SIZE, pageOffset(req.query.page));
  const { rows } = await pool.query(
    `${cte}
     SELECT id, headline, summary, source_name, source_url,
            published_at, search_term, scanned_at, state, source_kind
     FROM feed
     ORDER BY ${order}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  res.json({ data: rows });
});

// Headline numbers for the strip at the top of Today's Scams. Counted over
// distinct stories (exact-headline dedup, investor spam excluded) across the
// whole 30-day window - not the per-outlet-capped feed, which is a display
// choice, not a measure of activity.
export const summary = asyncHandler<AuthedRequest>(async (_req, res) => {
  const params: unknown[] = [];
  const notSpam = notInvestorSpamSql(params);
  params.push(INTERNATIONAL_SEARCH_TERMS);
  const intl = params.length;
  const { rows } = await pool.query(
    `WITH stories AS (
       SELECT DISTINCT ON (lower(headline))
              state, source_kind, source_name, search_term,
              COALESCE(published_at, scanned_at) AS at
       FROM daily_scam_news
       WHERE ${notSpam}
       ORDER BY lower(headline), (source_kind IN ('ag', 'federal')) DESC,
                COALESCE(published_at, scanned_at) DESC, id
     )
     SELECT count(*) FILTER (WHERE at >= NOW() - INTERVAL '24 hours')::int AS last_24h,
            count(*) FILTER (WHERE at >= NOW() - INTERVAL '7 days')::int AS last_7d,
            count(*)::int AS total,
            count(*) FILTER (WHERE source_kind = 'ag')::int AS official_ag,
            count(*) FILTER (WHERE source_kind = 'ag' AND at >= NOW() - INTERVAL '7 days')::int AS official_ag_7d,
            count(*) FILTER (WHERE source_kind = 'federal')::int AS federal,
            count(*) FILTER (WHERE state IS NULL AND search_term = ANY($${intl}))::int AS international,
            count(DISTINCT state) FILTER (WHERE state IS NOT NULL AND state != 'US')::int AS states_covered,
            count(DISTINCT state) FILTER (WHERE source_kind = 'ag')::int AS ag_states,
            count(DISTINCT source_name)::int AS sources,
            (SELECT max(scanned_at) FROM daily_scam_news) AS last_scanned_at
     FROM stories`,
    params
  );
  res.json({ data: rows[0] });
});

// Federal Watch: every DOJ/FTC release in the window, near-duplicates
// clustered into one story (see newsCluster.ts - one national DOJ action is
// republished by every participating US Attorney's office), plus the counts
// and themes the page leads with. Federal volume is a few dozen rows a
// month, so all of it is returned and clustered in one pass; the page
// filters by agency client-side.
interface FederalRow {
  id: string;
  headline: string;
  source_name: string;
  source_url: string;
  published_at: Date | null;
  scanned_at: Date;
}

function federalItem(r: FederalRow) {
  const agency = /trade commission/i.test(r.source_name) ? 'FTC' : 'DOJ';
  return {
    id: r.id,
    headline: r.headline,
    source_name: r.source_name,
    source_url: r.source_url,
    published_at: r.published_at,
    scanned_at: r.scanned_at,
    agency,
    office: agency === 'DOJ' ? dojOfficeFromUrl(r.source_url) : 'Bureau of Consumer Protection',
  };
}

export const federal = asyncHandler<AuthedRequest>(async (_req, res) => {
  const { rows } = await pool.query<FederalRow>(
    `SELECT id, headline, source_name, source_url, published_at, scanned_at
     FROM daily_scam_news
     WHERE state = 'US' AND source_kind = 'federal'
     ORDER BY COALESCE(published_at, scanned_at) DESC, id`
  );
  const clusters = clusterStories(rows).map(({ lead, related }) => ({
    ...federalItem(lead),
    theme: fraudTheme(lead.headline),
    related: related.map(federalItem),
  }));

  const now = Date.now();
  const within = (r: Pick<FederalRow, 'published_at' | 'scanned_at'>, days: number) =>
    now - new Date(r.published_at ?? r.scanned_at).getTime() <= days * 86400000;
  const agencyOf = (r: FederalRow) => federalItem(r).agency;
  res.json({
    data: {
      clusters,
      stats: {
        releases_7d: rows.filter((r) => within(r, 7)).length,
        releases_30d: rows.filter((r) => within(r, 30)).length,
        stories_7d: clusters.filter((c) => within(c, 7)).length,
        stories_30d: clusters.filter((c) => within(c, 30)).length,
        doj_releases: rows.filter((r) => agencyOf(r) === 'DOJ').length,
        ftc_releases: rows.filter((r) => agencyOf(r) === 'FTC').length,
        offices: new Set(rows.filter((r) => agencyOf(r) === 'DOJ').map((r) => dojOfficeFromUrl(r.source_url))).size,
        // Themes are counted per story, not per release, so one national
        // action echoed by eight offices counts once.
        themes: themeCounts(clusters.filter((c) => within(c, 30)).map((c) => c.headline)),
      },
    },
  });
});

// States that actually have alerts, with counts, so the UI can offer only
// real choices rather than all 51 jurisdictions with most of them empty.
// `ag_count` lets the UI distinguish a state whose own Attorney General
// publishes a feed from one covered only by news search. Every row here is
// already state-tagged, hence already US, so this list is scope-invariant.
//
// 'US' is excluded: it tags the federal (DOJ/FTC) feed from
// scanFederalScamNews.ts, not a US state, and every consumer of this list
// (the Global Map, the state dropdown) treats every row here as one of the
// 50 states + DC. The federal feed is read directly via ?state=US on
// list()/count() instead, from its own page rather than this list.
export const states = asyncHandler<AuthedRequest>(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT state,
            count(*)::int AS total,
            count(*) FILTER (WHERE source_kind = 'ag')::int AS ag_count
     FROM daily_scam_news
     WHERE state IS NOT NULL AND state != 'US'
     GROUP BY state
     ORDER BY state`
  );
  res.json({ data: rows });
});

// Health of each state's first-party Attorney General source, as recorded by
// scanStateAgNews.ts on every run. Public on purpose: it holds no user data,
// and the production monitor reads it to alert when an office's source
// breaks (errors, or answers with nothing in it) instead of letting that
// state's page go quietly stale.
export const agStatus = asyncHandler<AuthedRequest>(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT state, source_type, source_url, last_attempt_at, last_success_at,
            last_item_count, newest_item_at, last_error
     FROM ag_feed_status
     ORDER BY state`
  );
  res.json({ data: rows });
});

// The newest first-party Attorney General item per state — one row for each
// state that has any source_kind = 'ag' row in the 30-day window. Backs the
// "latest official alert" line on the State Attorneys General directory.
// 'US' (federal) rows are source_kind 'federal', never 'ag', so the federal
// feed cannot leak in here; the explicit state filter is belt and braces.
export const latestByState = asyncHandler<AuthedRequest>(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT DISTINCT ON (state)
            state, headline, source_url, source_name, published_at
     FROM daily_scam_news
     WHERE source_kind = 'ag' AND state IS NOT NULL AND state != 'US'
     ORDER BY state, COALESCE(published_at, scanned_at) DESC, id`
  );
  res.json({ data: rows });
});
