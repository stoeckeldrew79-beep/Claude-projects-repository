import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';
import { INTERNATIONAL_SEARCH_TERMS } from '../jobs/dailyNewsSearchTerms';

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

// How many stories the feed holds, so the page can reserve its full height
// up front instead of growing (and shrinking the scrollbar thumb) as each
// batch loads. Must match list()'s dedup and per-source cap exactly, or the
// reserved space is wrong and the drift this exists to prevent comes back.
export const count = asyncHandler<AuthedRequest>(async (req, res) => {
  const raw = typeof req.query.state === 'string' ? req.query.state.toUpperCase() : '';
  const state = /^[A-Z]{2}$/.test(raw) ? raw : null;

  if (state) {
    const { rows } = await pool.query<{ count: string }>(
      `WITH deduped AS (
         SELECT id, ROW_NUMBER() OVER (
                  PARTITION BY lower(headline)
                  ORDER BY (source_kind IN ('ag', 'federal')) DESC,
                           COALESCE(published_at, scanned_at) DESC, id
                ) AS dupe_rank
         FROM daily_scam_news
         WHERE state = $1
       )
       SELECT COUNT(*)::text AS count FROM deduped WHERE dupe_rank = 1`,
      [state]
    );
    res.json({ data: { count: Number(rows[0]?.count ?? 0) } });
    return;
  }

  const usOnly = usOnlyRequested(req);
  const { rows } = await pool.query<{ count: string }>(
    `WITH deduped AS (
       SELECT id, source_name, published_at, scanned_at, ROW_NUMBER() OVER (
                PARTITION BY lower(headline)
                ORDER BY COALESCE(published_at, scanned_at) DESC, id
              ) AS dupe_rank
       FROM daily_scam_news
       WHERE NOT $2 OR state IS NOT NULL OR NOT (search_term = ANY($3))
     ),
     ranked AS (
       SELECT id, ROW_NUMBER() OVER (
                PARTITION BY source_name
                ORDER BY COALESCE(published_at, scanned_at) DESC
              ) AS source_rank
       FROM deduped
       WHERE dupe_rank = 1
     )
     SELECT COUNT(*)::text AS count FROM ranked WHERE source_rank <= $1`,
    [MAX_STORIES_PER_SOURCE, usOnly, INTERNATIONAL_SEARCH_TERMS]
  );
  res.json({ data: { count: Number(rows[0]?.count ?? 0) } });
});

export const list = asyncHandler<AuthedRequest>(async (req, res) => {
  const raw = typeof req.query.state === 'string' ? req.query.state.toUpperCase() : '';
  const state = /^[A-Z]{2}$/.test(raw) ? raw : null;
  const offset = pageOffset(req.query.page);

  if (state) {
    // A state view is already narrow — a state has only its own AG plus a
    // handful of outlets covering it — so the per-source cap that keeps the
    // national feed varied would here just hide most of that state's alerts.
    // First-party AG alerts sort ahead of news coverage of the same story.
    // Every state-tagged row is already US, so scope=us is a no-op here.
    const { rows } = await pool.query(
      `WITH deduped AS (
         SELECT *, ROW_NUMBER() OVER (
                  PARTITION BY lower(headline)
                  ORDER BY (source_kind IN ('ag', 'federal')) DESC,
                           COALESCE(published_at, scanned_at) DESC, id
                ) AS dupe_rank
         FROM daily_scam_news
         WHERE state = $1
       )
       SELECT id, headline, summary, source_name, source_url,
              published_at, search_term, scanned_at, state, source_kind
       FROM deduped
       WHERE dupe_rank = 1
       ORDER BY (source_kind IN ('ag', 'federal')) DESC,
                COALESCE(published_at, scanned_at) DESC, id
       LIMIT $2 OFFSET $3`,
      [state, PAGE_SIZE, offset]
    );
    res.json({ data: rows });
    return;
  }

  if (aiTopicRequested(req)) {
    // The strip this feeds is a handful of headlines above a curated list,
    // not a paged feed — no per-source cap (the volume is low enough that
    // one outlet dominating isn't a real risk the way it is on the main
    // feed) and a fixed small limit rather than PAGE_SIZE/offset paging.
    const { rows } = await pool.query(
      `WITH deduped AS (
         SELECT *, ROW_NUMBER() OVER (
                  PARTITION BY lower(headline)
                  ORDER BY COALESCE(published_at, scanned_at) DESC, id
                ) AS dupe_rank
         FROM daily_scam_news
         WHERE headline ~* $1
       )
       SELECT id, headline, summary, source_name, source_url,
              published_at, search_term, scanned_at, state, source_kind
       FROM deduped
       WHERE dupe_rank = 1
       ORDER BY COALESCE(published_at, scanned_at) DESC, id
       LIMIT 8`,
      [AI_TOPIC_PATTERN]
    );
    res.json({ data: rows });
    return;
  }

  // Cap how many stories any one outlet contributes to the page. Ordering
  // purely by recency lets a single high-volume publisher take over the feed
  // whenever it posts a burst — one outlet held 4 of the top 5 slots after a
  // scan, which reads as a broken page rather than a live one. With 500+
  // distinct sources in the table, a cap of 2 still fills the full 100 rows.
  const usOnly = usOnlyRequested(req);
  const { rows } = await pool.query(
    // Two passes. The first drops stories the scan could not see as
     // duplicates: it dedupes on source_url, and the same story syndicated
     // under two URLs is two rows with one headline - which is what a reader
     // notices, the same headline twice in a row from the same outlet. The
     // second is the existing per-outlet cap. The scope filter sits inside
     // the first CTE so a US-only view still fills its full per-source cap
     // from US-only candidates, rather than capping before filtering.
     `WITH deduped AS (
       SELECT *,
              ROW_NUMBER() OVER (
                PARTITION BY lower(headline)
                ORDER BY COALESCE(published_at, scanned_at) DESC, id
              ) AS dupe_rank
       FROM daily_scam_news
       WHERE NOT $4 OR state IS NOT NULL OR NOT (search_term = ANY($5))
     ),
     ranked AS (
       SELECT *,
              ROW_NUMBER() OVER (
                PARTITION BY source_name
                ORDER BY COALESCE(published_at, scanned_at) DESC
              ) AS source_rank
       FROM deduped
       WHERE dupe_rank = 1
     )
     SELECT id, headline, summary, source_name, source_url,
            published_at, search_term, scanned_at, state, source_kind
     FROM ranked
     WHERE source_rank <= $1
     ORDER BY COALESCE(published_at, scanned_at) DESC, id
     LIMIT $2 OFFSET $3`,
    [MAX_STORIES_PER_SOURCE, PAGE_SIZE, offset, usOnly, INTERNATIONAL_SEARCH_TERMS]
  );
  res.json({ data: rows });
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
