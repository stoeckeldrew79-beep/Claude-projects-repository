import { Request, Response } from 'express';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';

// Deliberately loose — the goal is to catch typos, not to validate RFC 5322.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// POST /v1/waitlist — the launch page's "be the first to know" form. The
// answer is the same whether or not the address was already on the list,
// so the endpoint can't be used to check who has signed up.
export const join = asyncHandler(async (req: Request, res: Response) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  const source = typeof req.body?.source === 'string' ? req.body.source.slice(0, 40) : 'launch';
  await pool.query(
    `INSERT INTO waitlist_signups (email, source) VALUES ($1, $2)
     ON CONFLICT ((lower(email))) DO NOTHING`,
    [email, source]
  );
  res.status(201).json({ data: { ok: true } });
});

// GET /v1/waitlist — admin only: how many have signed up, newest first.
export const list = asyncHandler(async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT email, source, created_at FROM waitlist_signups ORDER BY created_at DESC LIMIT 500`
  );
  const { rows: count } = await pool.query<{ n: number }>('SELECT count(*)::int AS n FROM waitlist_signups');
  res.json({ data: { total: count[0].n, signups: rows } });
});
