// Digest-tier ladder for alert_preferences.frequency. Lower index = less
// frequent. A user may pick anything at or below their tier's max (e.g. a
// Family subscriber can still choose 'weekly' if that's all they want),
// never above it — enforced in controllers/alertSubscriptions.ts.
export type AlertFrequency = 'monthly' | 'weekly' | 'daily' | 'instant';

const FREQUENCY_RANK: Record<AlertFrequency, number> = {
  monthly: 0,
  weekly: 1,
  daily: 2,
  instant: 3,
};

export function frequencyRank(frequency: AlertFrequency): number {
  return FREQUENCY_RANK[frequency];
}

// subscription_tier as stored on users (includes 'free', unlike
// config/stripePrices.ts's SubscriptionTier, which only covers paid tiers
// billable through Stripe).
export type UserTier = 'free' | 'basic' | 'pro' | 'family' | 'business';

interface TierAlertLimits {
  maxFrequency: AlertFrequency;
  // How many alert_watch_profiles rows this tier may have at once. Free/
  // Basic/Pro are single-person plans (one profile — just themselves);
  // Family and Business cover multiple people/locations under one
  // membership, which is the actual product difference "Family" sells.
  maxWatchProfiles: number;
}

export const TIER_ALERT_LIMITS: Record<UserTier, TierAlertLimits> = {
  free: { maxFrequency: 'monthly', maxWatchProfiles: 1 },
  basic: { maxFrequency: 'weekly', maxWatchProfiles: 1 },
  pro: { maxFrequency: 'daily', maxWatchProfiles: 1 },
  family: { maxFrequency: 'instant', maxWatchProfiles: 5 },
  business: { maxFrequency: 'instant', maxWatchProfiles: 20 },
};

export function maxFrequencyForTier(tier: string): AlertFrequency {
  return (TIER_ALERT_LIMITS[tier as UserTier] ?? TIER_ALERT_LIMITS.free).maxFrequency;
}

export function maxWatchProfilesForTier(tier: string): number {
  return (TIER_ALERT_LIMITS[tier as UserTier] ?? TIER_ALERT_LIMITS.free).maxWatchProfiles;
}

export function isFrequencyAllowedForTier(frequency: AlertFrequency, tier: string): boolean {
  return frequencyRank(frequency) <= frequencyRank(maxFrequencyForTier(tier));
}
