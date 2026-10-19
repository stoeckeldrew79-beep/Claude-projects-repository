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
  // Digest cadence ceiling. Only meaningful where emailAlerts is true: a
  // free account can save a watch profile and see matches on the site, but
  // nothing is emailed or texted to it — delivery is what the plans sell.
  maxFrequency: AlertFrequency;
  // Real-time email alerts and digest emails.
  emailAlerts: boolean;
  // Real-time SMS alerts (still needs a phone number and sms_opt_in).
  smsAlerts: boolean;
  // How many alert_watch_profiles rows this tier may have at once. Free/
  // Basic/Pro are single-person plans (one profile — just themselves);
  // Family and Business cover multiple people/locations under one
  // membership, which is the actual product difference "Family" sells.
  maxWatchProfiles: number;
}

export const TIER_ALERT_LIMITS: Record<UserTier, TierAlertLimits> = {
  free: { maxFrequency: 'monthly', emailAlerts: false, smsAlerts: false, maxWatchProfiles: 1 },
  basic: { maxFrequency: 'weekly', emailAlerts: true, smsAlerts: false, maxWatchProfiles: 1 },
  pro: { maxFrequency: 'daily', emailAlerts: true, smsAlerts: true, maxWatchProfiles: 1 },
  family: { maxFrequency: 'instant', emailAlerts: true, smsAlerts: true, maxWatchProfiles: 5 },
  business: { maxFrequency: 'instant', emailAlerts: true, smsAlerts: true, maxWatchProfiles: 20 },
};

const ALL_TIERS = Object.keys(TIER_ALERT_LIMITS) as UserTier[];

// Tier lists for SQL (subscription_tier = ANY($n)), derived from the table
// above so pricing changes are made in one place.
export const EMAIL_ALERT_TIERS = ALL_TIERS.filter((t) => TIER_ALERT_LIMITS[t].emailAlerts);
export const SMS_ALERT_TIERS = ALL_TIERS.filter((t) => TIER_ALERT_LIMITS[t].smsAlerts);

// Tiers entitled to a digest at this cadence. Checked when sending, not only
// when the cadence is chosen, so a member who downgrades or cancels stops
// receiving emails their plan no longer covers.
export function tiersForDigestFrequency(frequency: AlertFrequency): UserTier[] {
  return EMAIL_ALERT_TIERS.filter((t) => frequencyRank(frequency) <= frequencyRank(TIER_ALERT_LIMITS[t].maxFrequency));
}

function limitsFor(tier: string): TierAlertLimits {
  return TIER_ALERT_LIMITS[tier as UserTier] ?? TIER_ALERT_LIMITS.free;
}

export function emailAlertsForTier(tier: string): boolean {
  return limitsFor(tier).emailAlerts;
}

export function smsAlertsForTier(tier: string): boolean {
  return limitsFor(tier).smsAlerts;
}

export function maxFrequencyForTier(tier: string): AlertFrequency {
  return (TIER_ALERT_LIMITS[tier as UserTier] ?? TIER_ALERT_LIMITS.free).maxFrequency;
}

export function maxWatchProfilesForTier(tier: string): number {
  return (TIER_ALERT_LIMITS[tier as UserTier] ?? TIER_ALERT_LIMITS.free).maxWatchProfiles;
}

export function isFrequencyAllowedForTier(frequency: AlertFrequency, tier: string): boolean {
  return frequencyRank(frequency) <= frequencyRank(maxFrequencyForTier(tier));
}
