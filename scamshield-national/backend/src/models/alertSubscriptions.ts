import { pool } from '../db/connection';
import { AlertFrequency } from '../config/alertTiers';

export interface AlertPreferences {
  user_id: string;
  frequency: AlertFrequency;
  last_sent_at: string | null;
}

export interface AlertWatchProfile {
  id: string;
  user_id: string;
  label: string | null;
  state: string | null;
  category_id: string | null;
  created_at: string;
}

export async function getPreferences(userId: string): Promise<AlertPreferences | null> {
  const { rows } = await pool.query('SELECT * FROM alert_preferences WHERE user_id = $1', [userId]);
  return rows[0] ?? null;
}

// Upsert rather than separate create/update — a user either has no row yet
// (first time visiting the alerts page) or is changing their existing
// cadence; the caller never needs to know which.
export async function setFrequency(userId: string, frequency: AlertFrequency): Promise<AlertPreferences> {
  const { rows } = await pool.query(
    `INSERT INTO alert_preferences (user_id, frequency)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET frequency = $2, updated_at = NOW()
     RETURNING *`,
    [userId, frequency]
  );
  return rows[0];
}

export async function markSent(userId: string, sentAt: Date = new Date()): Promise<void> {
  await pool.query(
    `INSERT INTO alert_preferences (user_id, last_sent_at)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET last_sent_at = $2, updated_at = NOW()`,
    [userId, sentAt]
  );
}

export async function listWatchProfiles(userId: string): Promise<AlertWatchProfile[]> {
  const { rows } = await pool.query(
    'SELECT * FROM alert_watch_profiles WHERE user_id = $1 ORDER BY created_at ASC',
    [userId]
  );
  return rows;
}

export async function countWatchProfiles(userId: string): Promise<number> {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM alert_watch_profiles WHERE user_id = $1', [
    userId,
  ]);
  return rows[0].count;
}

export async function createWatchProfile(
  userId: string,
  data: { label?: string | null; state?: string | null; categoryId?: string | null }
): Promise<AlertWatchProfile> {
  const { rows } = await pool.query(
    `INSERT INTO alert_watch_profiles (user_id, label, state, category_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, data.label ?? null, data.state ?? null, data.categoryId ?? null]
  );
  return rows[0];
}

// Scoped to userId in the WHERE clause (not just WHERE id = $1) so one
// subscriber can never delete another's watch profile by guessing a UUID.
export async function deleteWatchProfile(userId: string, profileId: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM alert_watch_profiles WHERE id = $1 AND user_id = $2', [
    profileId,
    userId,
  ]);
  return (rowCount ?? 0) > 0;
}

export interface DigestMatch {
  id: string;
  name: string;
  slug: string;
  description: string;
  alert_level: string | null;
  category_name: string | null;
  matched_label: string | null;
  matched_state: string | null;
}

// Every active scam created since `since` that matches at least one of the
// user's watch profiles (state via scam_locations, or nationwide; category
// via scams.category_id). A profile with no state watches nationwide scams
// only; a profile with no category watches every category in its state.
// DISTINCT ON collapses a scam matched by more than one profile (e.g. two
// family members in the same state) into a single digest line, keeping
// whichever profile's label sorts first.
export async function findNewMatchesForUser(userId: string, since: Date): Promise<DigestMatch[]> {
  const { rows } = await pool.query(
    `SELECT DISTINCT ON (s.id)
       s.id, s.name, s.slug, s.description, s.alert_level,
       c.name AS category_name,
       p.label AS matched_label,
       p.state AS matched_state
     FROM alert_watch_profiles p
     JOIN scams s ON s.is_active = true AND s.created_at > $2
       AND (p.category_id IS NULL OR s.category_id = p.category_id)
       AND (
         p.state IS NULL
         OR EXISTS (
           SELECT 1 FROM scam_locations sl
           WHERE sl.scam_id = s.id AND (sl.state = p.state OR sl.is_nationwide = true)
         )
       )
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE p.user_id = $1
     ORDER BY s.id, p.label NULLS LAST, s.created_at DESC`,
    [userId, since.toISOString()]
  );
  return rows;
}

// Users whose digest cadence resolves to `frequency` and who are due a
// send right now. A user with no alert_preferences row yet (never visited
// the alerts page) is NOT included — digest defaults only take effect once
// a preferences row exists, which getOrCreateDefaultPreferences creates on
// their first visit to the alerts page. This keeps "nobody gets an email
// they never implicitly agreed to by showing up" true even for free tier.
export async function usersDueForDigest(frequency: AlertFrequency): Promise<{ id: string; email: string }[]> {
  const { rows } = await pool.query(
    `SELECT u.id, u.email FROM alert_preferences ap
     JOIN users u ON u.id = ap.user_id
     WHERE ap.frequency = $1 AND u.is_active = true AND u.email_opt_in = true
       AND EXISTS (SELECT 1 FROM alert_watch_profiles wp WHERE wp.user_id = u.id)`,
    [frequency]
  );
  return rows;
}
