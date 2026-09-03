import { pool } from '../db/connection';
import { buildUpdateSet } from '../utils/buildUpdateSet';

export interface NewScamReport {
  reporter_name?: string;
  reporter_email?: string;
  reporter_phone?: string;
  scammer_phone?: string;
  scammer_email?: string;
  scammer_website?: string;
  category_id?: string;
  description: string;
  money_lost_amount?: number;
  money_lost_currency?: string;
  incident_date?: string;
  country?: string;
  state?: string;
  zip_code?: string;
  // Consent to have ScamShield National file this report with the
  // relevant outside agency on the reporter's behalf. Captured at
  // submission time only — there's no logged-in session tying a later
  // request back to an anonymous public submission, so this can't be
  // added retroactively without contacting support.
  consent_to_file?: boolean;
}

const SUBMIT_FIELDS = [
  'reporter_name',
  'reporter_email',
  'reporter_phone',
  'scammer_phone',
  'scammer_email',
  'scammer_website',
  'category_id',
  'description',
  'money_lost_amount',
  'money_lost_currency',
  'incident_date',
  'country',
  'state',
  'zip_code',
  'consent_to_file',
] as const;

// Only status transitions and promotion linkage are writable through the
// review endpoint — everything the reporter originally submitted is
// immutable once filed, same principle as an incident report.
const REVIEW_FIELDS = ['status', 'promoted_scam_id', 'reviewed_by', 'reviewed_at'] as const;

export async function createReport(data: NewScamReport) {
  const { fields, values } = buildUpdateSetForInsert(data as unknown as Record<string, unknown>, SUBMIT_FIELDS);
  const placeholders = fields.map((_, i) => `$${i + 1}`);
  // consent_to_file_at is server-set, never client-supplied, so a
  // reporter can't fabricate an earlier consent timestamp.
  const consentIndex = fields.indexOf('consent_to_file');
  const extraColumn = consentIndex !== -1 && values[consentIndex] ? ', consent_to_file_at' : '';
  const extraValue = consentIndex !== -1 && values[consentIndex] ? ', NOW()' : '';
  const { rows } = await pool.query(
    `INSERT INTO scam_reports (${fields.join(', ')}${extraColumn}) VALUES (${placeholders.join(', ')}${extraValue}) RETURNING *`,
    values
  );
  return rows[0];
}

// buildUpdateSet is shaped for UPDATE ($1 reserved for id); INSERT has
// no reserved slot, so this is the same whitelist-filter idea with $n
// starting at 1.
function buildUpdateSetForInsert(data: Record<string, unknown>, allowed: readonly string[]) {
  const fields = Object.keys(data).filter((f) => allowed.includes(f) && data[f] !== undefined);
  const values = fields.map((f) => data[f]);
  return { fields, values };
}

export async function listReports(status?: string) {
  const { rows } = await pool.query(
    status
      ? 'SELECT * FROM scam_reports WHERE status = $1 ORDER BY created_at DESC LIMIT 100'
      : 'SELECT * FROM scam_reports ORDER BY created_at DESC LIMIT 100',
    status ? [status] : []
  );
  return rows;
}

export async function getReportById(id: string) {
  const { rows } = await pool.query(
    `SELECT r.*, c.slug AS category_slug
     FROM scam_reports r
     LEFT JOIN categories c ON c.id = r.category_id
     WHERE r.id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function updateReportReview(id: string, data: Record<string, unknown>) {
  const { fields, setClauses, values } = buildUpdateSet(data, REVIEW_FIELDS);
  if (fields.length === 0) return getReportById(id);

  setClauses.push('updated_at = NOW()');
  const { rows } = await pool.query(
    `UPDATE scam_reports SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0] ?? null;
}
