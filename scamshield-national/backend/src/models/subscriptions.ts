import { pool } from '../db/connection';

export async function getUserByStripeCustomerId(customerId: string) {
  const { rows } = await pool.query('SELECT * FROM users WHERE stripe_customer_id = $1', [customerId]);
  return rows[0] ?? null;
}

export async function linkStripeCustomer(userId: string, customerId: string) {
  await pool.query('UPDATE users SET stripe_customer_id = $2, updated_at = NOW() WHERE id = $1', [
    userId,
    customerId,
  ]);
}

export async function setUserTier(userId: string, tier: string) {
  await pool.query('UPDATE users SET subscription_tier = $2, updated_at = NOW() WHERE id = $1', [userId, tier]);
}

export interface StripeSubscriptionSync {
  userId: string;
  stripeSubscriptionId: string;
  tier: string;
  status: string;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  canceledAt: Date | null;
}

export async function upsertSubscription(sub: StripeSubscriptionSync) {
  await pool.query(
    `INSERT INTO subscriptions (user_id, stripe_subscription_id, tier, status, current_period_start, current_period_end, canceled_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (stripe_subscription_id) DO UPDATE SET
       tier = EXCLUDED.tier,
       status = EXCLUDED.status,
       current_period_start = EXCLUDED.current_period_start,
       current_period_end = EXCLUDED.current_period_end,
       canceled_at = EXCLUDED.canceled_at,
       updated_at = NOW()`,
    [
      sub.userId,
      sub.stripeSubscriptionId,
      sub.tier,
      sub.status,
      sub.currentPeriodStart,
      sub.currentPeriodEnd,
      sub.canceledAt,
    ]
  );
}

export async function markSubscriptionStatus(stripeSubscriptionId: string, status: string) {
  await pool.query(
    'UPDATE subscriptions SET status = $2, updated_at = NOW() WHERE stripe_subscription_id = $1',
    [stripeSubscriptionId, status]
  );
}

export async function latestForUser(userId: string) {
  const { rows } = await pool.query(
    'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
    [userId]
  );
  return rows[0] ?? null;
}
