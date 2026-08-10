import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { broadcastAlert } from '../services/alerts';
import { asyncHandler } from '../utils/asyncHandler';

export const list = asyncHandler<AuthedRequest>(async (req, res) => {
  const { zip, state } = req.query;
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (zip) {
    values.push(zip);
    conditions.push(`zip_code = $${values.length}`);
  }
  if (state) {
    values.push(state);
    conditions.push(`state = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' OR ')}` : '';
  const { rows } = await pool.query(`SELECT * FROM alerts ${where} ORDER BY sent_at DESC LIMIT 100`, values);
  res.json({ data: rows });
});

export const create = asyncHandler<AuthedRequest>(async (req, res) => {
  const { scam_id, title, body, alert_level, state, zip_code, is_nationwide } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO alerts (scam_id, title, body, alert_level, state, zip_code, is_nationwide)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [scam_id, title, body, alert_level, state ?? null, zip_code ?? null, is_nationwide ?? false]
  );
  const alert = rows[0];

  // Broadcast failures must not fail alert creation — the alert is
  // already persisted. Surface what happened so the admin caller knows
  // whether SMS/email actually went out.
  const broadcast = await broadcastAlert(alert).catch((err) => ({
    smsSent: 0,
    emailsSent: 0,
    errors: [(err as Error).message],
  }));

  res.status(201).json({ data: alert, broadcast });
});
