import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';

export const list = asyncHandler<AuthedRequest>(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM daily_scam_news
     ORDER BY COALESCE(published_at, scanned_at) DESC
     LIMIT 100`
  );
  res.json({ data: rows });
});
