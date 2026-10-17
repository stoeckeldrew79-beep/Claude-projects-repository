import { pool } from '../db/connection';
import { buildUpdateSet } from '../utils/buildUpdateSet';

export interface UserProfileUpdate {
  phone?: string | null;
  zip_code?: string | null;
  state?: string | null;
  email_opt_in?: boolean;
}

// subscription_tier, role, and anything else on this table must never be
// reachable from this endpoint — it's user-self-service, not admin.
const UPDATABLE_PROFILE_FIELDS = ['phone', 'zip_code', 'state', 'email_opt_in'] as const;

// Every controller that returns a user row to the client must run it
// through this first — password_hash must never leave the server.
export function sanitizeUser<T extends Record<string, unknown>>(user: T): Omit<T, 'password_hash'> {
  const { password_hash: _password_hash, ...rest } = user;
  return rest;
}

export async function getUserByAuthId(authProviderId: string) {
  const { rows } = await pool.query('SELECT * FROM users WHERE auth_provider_id = $1', [authProviderId]);
  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export async function createUser(data: { authProviderId: string; email: string; passwordHash: string }) {
  const { rows } = await pool.query(
    'INSERT INTO users (auth_provider_id, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [data.authProviderId, data.email, data.passwordHash]
  );
  return rows[0];
}

export async function updateUserProfile(id: string, data: UserProfileUpdate) {
  const { fields, setClauses, values } = buildUpdateSet(data as Record<string, unknown>, UPDATABLE_PROFILE_FIELDS);
  if (fields.length === 0) return getUserById(id);

  setClauses.push('updated_at = NOW()');
  const { rows } = await pool.query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0] ?? null;
}

export async function setSmsOptIn(id: string, optIn: boolean) {
  const { rows } = await pool.query(
    'UPDATE users SET sms_opt_in = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
    [id, optIn]
  );
  return rows[0] ?? null;
}

export interface AlertTargeting {
  state?: string;
  zip?: string;
  nationwide: boolean;
}

// Who a given alert reaches — spec 5.2's targeting rule. A nationwide alert
// reaches everyone on the channel's tiers. A state alert reaches anyone
// whose home state is that state, or who watches it from their alerts
// page (a "Mom in FL" watch profile on a Texas account) — the same people
// whose digest that state's scams already go to. A ZIP alert reaches that
// home ZIP. Users with no home state and no state watch profile only ever
// receive nationwide alerts.
//
// $1 state, $2 zip, $3 nationwide.
const AUDIENCE_MATCH = `(
  $3::boolean = true
  OR u.state = $1::text
  OR u.zip_code = $2::text
  OR ($1::text IS NOT NULL AND EXISTS (
    SELECT 1 FROM alert_watch_profiles wp WHERE wp.user_id = u.id AND wp.state = $1::text
  ))
)`;

// SMS is a Family/Business-tier feature per the pricing table (section 6);
// real-time email alerts are Pro and above (Basic is digest-only, handled
// by the digest job).
const SMS_AUDIENCE = `u.sms_opt_in = true AND u.is_active = true
  AND u.subscription_tier IN ('family', 'business') AND u.phone IS NOT NULL AND u.phone <> ''`;
const EMAIL_AUDIENCE = `u.email_opt_in = true AND u.is_active = true
  AND u.subscription_tier IN ('pro', 'family', 'business')`;

function targetingParams(params: AlertTargeting) {
  return [params.state ?? null, params.zip ?? null, params.nationwide];
}

export async function usersForAlertSms(params: AlertTargeting): Promise<{ id: string; phone: string }[]> {
  const { rows } = await pool.query(
    `SELECT u.id, u.phone FROM users u WHERE ${SMS_AUDIENCE} AND ${AUDIENCE_MATCH}`,
    targetingParams(params)
  );
  return rows;
}

export async function usersForAlertEmail(params: AlertTargeting): Promise<{ id: string; email: string }[]> {
  const { rows } = await pool.query(
    `SELECT u.id, u.email FROM users u WHERE ${EMAIL_AUDIENCE} AND ${AUDIENCE_MATCH}`,
    targetingParams(params)
  );
  return rows;
}

// How many people an alert would reach if it were sent now — shown on each
// candidate in the admin review queue, so approving a state alert is a
// decision made with the real audience size in front of you. Uses the
// exact predicates the send uses, so the number can't drift from reality.
export async function countAlertAudience(params: AlertTargeting): Promise<{ email: number; sms: number }> {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE ${EMAIL_AUDIENCE})::int AS email,
       COUNT(*) FILTER (WHERE ${SMS_AUDIENCE})::int AS sms
     FROM users u
     WHERE ${AUDIENCE_MATCH}`,
    targetingParams(params)
  );
  return { email: rows[0]?.email ?? 0, sms: rows[0]?.sms ?? 0 };
}

// Subscribers with a home state, per state — the admin "where are our
// subscribers" view, and the denominator for deciding whether a state
// alert is worth its own send.
export async function homeStateCounts(): Promise<{ state: string; users: number }[]> {
  const { rows } = await pool.query(
    `SELECT state, COUNT(*)::int AS users FROM users
     WHERE state IS NOT NULL AND is_active = true
     GROUP BY state ORDER BY users DESC, state`
  );
  return rows;
}
