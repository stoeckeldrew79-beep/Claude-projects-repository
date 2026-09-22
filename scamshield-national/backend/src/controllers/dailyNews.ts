import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';

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

// How many stories the feed holds, so the page can reserve its full height
// up front instead of growing (and shrinking the scrollbar thumb) as each
// batch loads. Must match list()'s dedup and per-source cap exactly, or the
// reserved space is wrong and the drift this exists to prevent comes back.
export const count = asyncHandler<AuthedRequest>(async (req, res) => {
  const raw = typeof req.query.state === 'string' ? req.query.state.toUpperCase() : '';
  // 'US' is a sentinel, not a real state code (checked before the state-code
  // regex below, which would otherwise happily match it) — every US row,
  // state-tagged or general national, as opposed to a single state or the
  // international rows mixed into the unfiltered feed. See migration 027.
  const isUsAggregate = raw === 'US';
  const state = !isUsAggregate && /^[A-Z]{2}$/.test(raw) ? raw : null;

  if (state) {
    const { rows } = await pool.query<{ count: string }>(
      `WITH deduped AS (
         SELECT id, ROW_NUMBER() OVER (
                  PARTITION BY lower(headline)
                  ORDER BY (source_kind = 'ag') DESC,
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

  if (isUsAggregate) {
    const { rows } = await pool.query<{ count: string }>(
      `WITH deduped AS (
         SELECT id, source_name, published_at, scanned_at, ROW_NUMBER() OVER (
                  PARTITION BY lower(headline)
                  ORDER BY (source_kind = 'ag') DESC,
                           COALESCE(published_at, scanned_at) DESC, id
                ) AS dupe_rank
         FROM daily_scam_news
         WHERE is_international = false
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
      [MAX_STORIES_PER_SOURCE]
    );
    res.json({ data: { count: Number(rows[0]?.count ?? 0) } });
    return;
  }

  const { rows } = await pool.query<{ count: string }>(
    `WITH deduped AS (
       SELECT id, source_name, published_at, scanned_at, ROW_NUMBER() OVER (
                PARTITION BY lower(headline)
                ORDER BY COALESCE(published_at, scanned_at) DESC, id
              ) AS dupe_rank
       FROM daily_scam_news
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
    [MAX_STORIES_PER_SOURCE]
  );
  res.json({ data: { count: Number(rows[0]?.count ?? 0) } });
});

export const list = asyncHandler<AuthedRequest>(async (req, res) => {
  const raw = typeof req.query.state === 'string' ? req.query.state.toUpperCase() : '';
  const isUsAggregate = raw === 'US';
  const state = !isUsAggregate && /^[A-Z]{2}$/.test(raw) ? raw : null;
  const offset = pageOffset(req.query.page);

  if (state) {
    // A state view is already narrow — a state has only its own AG plus a
    // handful of outlets covering it — so the per-source cap that keeps the
    // national feed varied would here just hide most of that state's alerts.
    // First-party AG alerts sort ahead of news coverage of the same story.
    const { rows } = await pool.query(
      `WITH deduped AS (
         SELECT *, ROW_NUMBER() OVER (
                  PARTITION BY lower(headline)
                  ORDER BY (source_kind = 'ag') DESC,
                           COALESCE(published_at, scanned_at) DESC, id
                ) AS dupe_rank
         FROM daily_scam_news
         WHERE state = $1
       )
       SELECT id, headline, summary, source_name, source_url,
              published_at, search_term, scanned_at, state, source_kind
       FROM deduped
       WHERE dupe_rank = 1
       ORDER BY (source_kind = 'ag') DESC,
                COALESCE(published_at, scanned_at) DESC, id
       LIMIT $2 OFFSET $3`,
      [state, PAGE_SIZE, offset]
    );
    res.json({ data: rows });
    return;
  }

  if (isUsAggregate) {
    // Same dedup + per-source cap as the unfiltered feed below, just scoped
    // to is_international = false — the US view is still broad enough (every
    // state plus general national coverage) to need the varied-sources cap
    // that a single state's narrow view does not.
    const { rows } = await pool.query(
      `WITH deduped AS (
         SELECT *,
                ROW_NUMBER() OVER (
                  PARTITION BY lower(headline)
                  ORDER BY (source_kind = 'ag') DESC,
                           COALESCE(published_at, scanned_at) DESC, id
                ) AS dupe_rank
         FROM daily_scam_news
         WHERE is_international = false
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
       ORDER BY (source_kind = 'ag') DESC,
                COALESCE(published_at, scanned_at) DESC, id
       LIMIT $2 OFFSET $3`,
      [MAX_STORIES_PER_SOURCE, PAGE_SIZE, offset]
    );
    res.json({ data: rows });
    return;
  }

  // Cap how many stories any one outlet contributes to the page. Ordering
  // purely by recency lets a single high-volume publisher take over the feed
  // whenever it posts a burst — one outlet held 4 of the top 5 slots after a
  // scan, which reads as a broken page rather than a live one. With 500+
  // distinct sources in the table, a cap of 2 still fills the full 100 rows.
  const { rows } = await pool.query(
    // Two passes. The first drops stories the scan could not see as
     // duplicates: it dedupes on source_url, and the same story syndicated
     // under two URLs is two rows with one headline - which is what a reader
     // notices, the same headline twice in a row from the same outlet. The
     // second is the existing per-outlet cap.
     `WITH deduped AS (
       SELECT *,
              ROW_NUMBER() OVER (
                PARTITION BY lower(headline)
                ORDER BY COALESCE(published_at, scanned_at) DESC, id
              ) AS dupe_rank
       FROM daily_scam_news
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
    [MAX_STORIES_PER_SOURCE, PAGE_SIZE, offset]
  );
  res.json({ data: rows });
});

// States that actually have alerts, with counts, so the UI can offer only
// real choices rather than all 51 jurisdictions with most of them empty.
// `ag_count` lets the UI distinguish a state whose own Attorney General
// publishes a feed from one covered only by news search.
export const states = asyncHandler<AuthedRequest>(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT state,
            count(*)::int AS total,
            count(*) FILTER (WHERE source_kind = 'ag')::int AS ag_count
     FROM daily_scam_news
     WHERE state IS NOT NULL
     GROUP BY state
     ORDER BY state`
  );
  res.json({ data: rows });
});
