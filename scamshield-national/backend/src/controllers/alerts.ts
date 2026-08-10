import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';

// Full alert broadcast + Twilio/SendGrid fan-out lands in Phase 3
// (spec section 7). These handlers cover the CRUD surface only.

export async function list(req: AuthedRequest, res: Response) {
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
}

export async function create(req: AuthedRequest, res: Response) {
  const { scam_id, title, body, alert_level, state, zip_code, is_nationwide } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO alerts (scam_id, title, body, alert_level, state, zip_code, is_nationwide)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [scam_id, title, body, alert_level, state ?? null, zip_code ?? null, is_nationwide ?? false]
  );
  // TODO(Phase 3): fan out via services/alerts.ts -> twilio.ts / sendgrid.ts
  res.status(201).json({ data: rows[0] });
}
