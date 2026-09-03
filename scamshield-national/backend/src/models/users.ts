import { pool } from '../db/connection';
import { buildUpdateSet } from '../utils/buildUpdateSet';

export interface UserProfileUpdate {
  phone?: string;
  zip_code?: string;
  state?: string;
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

// Users to notify for a given alert — matches spec 5.2's targeting rule.
// SMS is a Family/Business-tier feature per the pricing table (section 6);
// email real-time alerts are Pro and above (Basic is digest-only, handled
// separately by a periodic job, not this real-time broadcast).
export async function usersForAlertSms(params: { state?: string; zip?: string; nationwide: boolean }) {
  const { rows } = await pool.query(
    `SELECT id, phone FROM users
     WHERE sms_opt_in = true AND is_active = true
       AND subscription_tier IN ('family', 'business')
       AND ($3 = true OR state = $1 OR zip_code = $2)`,
    [params.state ?? null, params.zip ?? null, params.nationwide]
  );
  return rows;
}

export async function usersForAlertEmail(params: { state?: string; zip?: string; nationwide: boolean }) {
  const { rows } = await pool.query(
    `SELECT id, email FROM users
     WHERE email_opt_in = true AND is_active = true
       AND subscription_tier IN ('pro', 'family', 'business')
       AND ($3 = true OR state = $1 OR zip_code = $2)`,
    [params.state ?? null, params.zip ?? null, params.nationwide]
  );
  return rows;
}
