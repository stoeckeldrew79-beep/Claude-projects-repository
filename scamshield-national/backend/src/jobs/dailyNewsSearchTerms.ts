// Shared between scanDailyScamNews.ts (which runs these queries) and the
// dailyNews controller (which needs to know, after the fact, whether a
// state-less row came from a US or an international query, to power the
// "US Only" filter on the Today's Scams page — state-tagged rows are
// unambiguously US already; state-less rows split on search_term).

export const US_SEARCH_TERMS = [
  'scam warning',
  'fraud scheme charged',
  'phishing scam',
  'scam arrest',
  'consumer alert scam',
  'romance scam',
  'crypto investment fraud',
  'elder fraud charged',
  'IRS impersonation scam',
  'gift card scam',
  'tech support scam',
  'business email compromise',
  'SIM swap fraud',
  'Medicare fraud charged',
  'deepfake scam',
  'utility scam warning',
  'rental scam',
  'employment scam',
  'charity fraud',
  'student loan scam',
];

// International coverage is done with country-targeted TERMS, not with
// Google News' locale parameters — see scanDailyScamNews.ts for why.
export const INTERNATIONAL_SEARCH_TERMS = [
  'ACCC Scamwatch scam', // Australia
  'Action Fraud scam UK', // United Kingdom
  'Canadian Anti-Fraud Centre scam', // Canada
  'Singapore police scam alert', // Singapore
  'India cyber fraud arrest', // India
  'Garda fraud warning Ireland', // Ireland
];
