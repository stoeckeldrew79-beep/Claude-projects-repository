import { lookupKey, PLAN_PRICES, tierForLookupKey } from '../src/config/stripePrices';

describe('plan prices', () => {
  it('match the published pricing', () => {
    expect(PLAN_PRICES.basic.cents).toBe(1999);
    expect(PLAN_PRICES.pro.cents).toBe(2999);
    expect(PLAN_PRICES.family.cents).toBe(3999);
    expect(PLAN_PRICES.business.cents).toBe(9999);
  });

  it('round-trips a tier through its Stripe lookup key', () => {
    expect(lookupKey('pro')).toBe('scamshield_pro_monthly_2999');
    expect(tierForLookupKey(lookupKey('family'))).toBe('family');
    // An older amount still identifies the plan.
    expect(tierForLookupKey('scamshield_basic_monthly_400')).toBe('basic');
    expect(tierForLookupKey('scamshield_gold_monthly_100')).toBeNull();
    expect(tierForLookupKey(null)).toBeNull();
  });
});
