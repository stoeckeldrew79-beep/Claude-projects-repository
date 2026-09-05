import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';

// Most stories any single outlet may contribute to the Today's Scams feed.
const MAX_STORIES_PER_SOURCE = 2;

export const list = asyncHandler<AuthedRequest>(async (_req, res) => {
  // Cap how many stories any one outlet contributes to the page. Ordering
  // purely by recency lets a single high-volume publisher take over the feed
  // whenever it posts a burst — one outlet held 4 of the top 5 slots after a
  // scan, which reads as a broken page rather than a live one. With 500+
  // distinct sources in the table, a cap of 2 still fills the full 100 rows.
  const { rows } = await pool.query(
    `WITH ranked AS (
       SELECT *,
              ROW_NUMBER() OVER (
                PARTITION BY source_name
                ORDER BY COALESCE(published_at, scanned_at) DESC
              ) AS source_rank
       FROM daily_scam_news
     )
     SELECT id, headline, summary, source_name, source_url,
            published_at, search_term, scanned_at
     FROM ranked
     WHERE source_rank <= $1
     ORDER BY COALESCE(published_at, scanned_at) DESC
     LIMIT 100`,
    [MAX_STORIES_PER_SOURCE]
  );
  res.json({ data: rows });
});
