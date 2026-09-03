import { pool } from '../db/connection';

export interface AlertCandidate {
  id: string;
  dedupe_tag: string;
  title: string;
  body: string;
  alert_level: string;
  state: string | null;
  zip_code: string | null;
  is_nationwide: boolean;
  pattern_type: 'recurring_contact' | 'category_spike';
  status: 'pending' | 'approved' | 'dismissed';
  created_at: string;
  resolved_at: string | null;
}

export interface NewAlertCandidate {
  dedupe_tag: string;
  title: string;
  body: string;
  alert_level: string;
  state?: string | null;
  zip_code?: string | null;
  is_nationwide: boolean;
  pattern_type: 'recurring_contact' | 'category_spike';
}

// ON CONFLICT DO NOTHING: dedupe_tag is unique, so re-running detection
// never creates a second row for a pattern that's already pending,
// approved, or dismissed — same idempotency principle as the AI-drafted
// article queue's alreadyDrafted() check.
export async function insertCandidate(candidate: NewAlertCandidate) {
  const { rows } = await pool.query(
    `INSERT INTO alert_candidates (dedupe_tag, title, body, alert_level, state, zip_code, is_nationwide, pattern_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (dedupe_tag) DO NOTHING
     RETURNING id`,
    [
      candidate.dedupe_tag,
      candidate.title,
      candidate.body,
      candidate.alert_level,
      candidate.state ?? null,
      candidate.zip_code ?? null,
      candidate.is_nationwide,
      candidate.pattern_type,
    ]
  );
  return rows[0] ?? null;
}

export async function listPending(): Promise<AlertCandidate[]> {
  const { rows } = await pool.query<AlertCandidate>(
    `SELECT * FROM alert_candidates WHERE status = 'pending' ORDER BY created_at DESC LIMIT 50`
  );
  return rows;
}

export async function getById(id: string): Promise<AlertCandidate | null> {
  const { rows } = await pool.query<AlertCandidate>('SELECT * FROM alert_candidates WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export async function markResolved(id: string, status: 'approved' | 'dismissed') {
  const { rows } = await pool.query<AlertCandidate>(
    `UPDATE alert_candidates SET status = $2, resolved_at = NOW() WHERE id = $1 RETURNING *`,
    [id, status]
  );
  return rows[0] ?? null;
}
