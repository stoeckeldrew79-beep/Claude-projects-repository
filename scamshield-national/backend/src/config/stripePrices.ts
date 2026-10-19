export type SubscriptionTier = 'basic' | 'pro' | 'family' | 'business';

// The plan prices, in cents. The server keeps Stripe in step with this
// table itself: each price is found by a lookup key that includes the
// amount, and created the first time it's missing, so changing a price here
// is the whole job — no one has to create prices in the Stripe dashboard
// and copy IDs into the host's environment. Existing members stay on the
// price they signed up at; only new checkouts use the new one.
export const PLAN_PRICES: Record<SubscriptionTier, { cents: number; name: string }> = {
  basic: { cents: 1999, name: 'ScamShield Basic' },
  pro: { cents: 2999, name: 'ScamShield Pro' },
  family: { cents: 3999, name: 'ScamShield Family' },
  business: { cents: 9999, name: 'ScamShield Business' },
};

const LOOKUP_PREFIX = 'scamshield_';

export function lookupKey(tier: SubscriptionTier): string {
  return `${LOOKUP_PREFIX}${tier}_monthly_${PLAN_PRICES[tier].cents}`;
}

// "scamshield_pro_monthly_2999" -> "pro". Recognises any past amount too.
export function tierForLookupKey(key: string | null | undefined): SubscriptionTier | null {
  const m = new RegExp(`^${LOOKUP_PREFIX}([a-z]+)_monthly_\\d+$`).exec(key ?? '');
  return m && m[1] in PLAN_PRICES ? (m[1] as SubscriptionTier) : null;
}

export function isSubscriptionTier(value: unknown): value is SubscriptionTier {
  return typeof value === 'string' && value in PLAN_PRICES;
}
