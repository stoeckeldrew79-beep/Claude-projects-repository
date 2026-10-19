export type SubscriptionTier = 'basic' | 'pro' | 'family' | 'business';

export const TIER_PRICE_ENV: Record<SubscriptionTier, string> = {
  basic: 'STRIPE_PRICE_BASIC',
  pro: 'STRIPE_PRICE_PRO',
  family: 'STRIPE_PRICE_FAMILY',
  business: 'STRIPE_PRICE_BUSINESS',
};

export function priceIdForTier(tier: SubscriptionTier): string {
  const envVar = TIER_PRICE_ENV[tier];
  const priceId = process.env[envVar];
  if (!priceId) throw new Error(`${envVar} is not set`);
  return priceId;
}

// Reverse lookup used when a webhook event only carries a price ID (a
// subscription started before checkout stamped the tier into metadata).
// STRIPE_PRICE_<TIER>_PREVIOUS (comma-separated) keeps members on an older
// price recognised after the main variable moves to a new price.
export function tierForPriceId(priceId: string): SubscriptionTier | null {
  for (const tier of Object.keys(TIER_PRICE_ENV) as SubscriptionTier[]) {
    const envVar = TIER_PRICE_ENV[tier];
    const previous = (process.env[`${envVar}_PREVIOUS`] ?? '').split(',').map((s) => s.trim());
    if (process.env[envVar] === priceId || previous.includes(priceId)) return tier;
  }
  return null;
}
