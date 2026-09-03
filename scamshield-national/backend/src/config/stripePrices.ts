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

// Reverse lookup used when a webhook event only carries a price ID.
export function tierForPriceId(priceId: string): SubscriptionTier | null {
  for (const tier of Object.keys(TIER_PRICE_ENV) as SubscriptionTier[]) {
    if (process.env[TIER_PRICE_ENV[tier]] === priceId) return tier;
  }
  return null;
}
