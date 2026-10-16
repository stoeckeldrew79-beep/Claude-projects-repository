import fs from 'fs';
import path from 'path';
import {
  INVESTOR_SPAM_PG,
  INVESTOR_SPAM_SOURCE,
  PRESS_WIRE_PG,
  WIRE_LITIGATION_PG,
  isInvestorSpam,
  toPostgresRegex,
} from '../src/jobs/newsQuality';

// Every example below is a real headline (source, headline) pulled from the
// production feed or the Google News queries the scanner runs, October 2026.
const SPAM: [string, string][] = [
  ['Business Wire', 'BAC Stock Alert: BFA Law Announces Securities Fraud and Breach of Fiduciary Duty Investigation into Bank of America Following 1.2 Billion Penalty'],
  ['GlobeNewswire', 'Hims & Hers Health, Inc. Securities Fraud Class Action'],
  ['ACCESS Newswire', 'AVEX ALERT: Securities Fraud Class Action Launched Against AEVEX Corp. - October 20, 2026 Deadline'],
  ['PR Newswire', 'INVESTOR ALERT: Fluence Energy, Inc. (FLNC) Investors: November 27, 2026, Filing Deadline in Securities Fraud Class Action - Contact Kessler Topaz Meltzer & Check, LLP'],
  ['PR Newswire', 'Endava plc (DAVA) Alert: Securities Fraud Class Action Filed, Investors with Losses Encouraged to Contact Hagens Berman'],
  ['FinancialContent', 'Millrose Properties, Inc. Securities Fraud Class Action Result of Undisclosed Rental Home Business and 8.5% Stock Decline - Investors may Contact Lewis Kahn, Esq., at Kahn Swick & Foti, LLC'],
  ['GlobeNewswire', 'DUOL Shareholder Alert: December 7, 2026 Lead Plaintiff Deadline'],
  ['PR Newswire', 'SHAREHOLDER ALERT: Purcell & Lefkowitz LLP Announces Shareholder Investigation of First Industrial Realty Trust, Inc. (NYSE: FR)'],
  ['PR Newswire', 'BMBL SHAREHOLDER ALERT: ADEMI LLP INVESTIGATES WHETHER BUYOUT FAIRLY VALUES BUMBLE INC.'],
  ['PR Newswire', 'TTAN Stock Alert: ServiceTitan Growth Issues and Subsequent 30% Stock Drop Trigger Securities Fraud Investigation for Investors'],
  ['Business Wire', 'SPT Investor Alert: Robbins LLP Announces that Sprout Social, Inc. Beat Motion to Dismiss'],
  ['GlobeNewswire', 'Hims & Hers Health (NYSE: HIMS) Faces Securities Fraud'],
  ['GlobeNewswire', 'INV INVESTOR ALERT: Innventure, Inc. Investors with'],
  // Syndicated well beyond the wires - no wire source name to lean on.
  ['Morningstar', 'APP Investors Have Opportunity to Lead AppLovin Corporation Securities Fraud Lawsuit'],
  ['Times Argus', 'SMPL Deadline: SMPL Investors with Losses in Excess of $100K Have Opportunity to Lead The Simply Good Foods Company Securities Fraud Lawsuit'],
  ['WBOC TV', 'MRP INVESTOR ALERT: Millrose Properties, Inc. Investors with Substantial Losses May Seek to Lead the Millrose Class Action Lawsuit – RGRD Law'],
  ['StreetInsider', 'Distribution Solutions Group (DSGR) Investor Alert: Investigation Into Fairness of Proposed Acquisition - Kehoe Law Firm, P.C.'],
  ['Stockhouse', 'XTIA SHAREHOLDER ALERT: Bronstein, Gewirtz and Grossman, LLC Announces that XTI Aerospace, Inc. Investors Have Opportunity to Lead Class'],
  ['The National Law Review', 'Glancy Prongay Wolke & Rotter LLP, a Leading Securities Fraud Law'],
  ['EIN Presswire', 'MARS FX INVESTOR ALERT: KlaymanToskes Investigates Potential FINRA Claims Following Fund Collapse'],
];

// Real consumer-scam (or at least legitimate fraud-news) headlines that
// share vocabulary with the spam and must survive.
const KEEP: [string, string][] = [
  // A press-release wire, but a consumer fraud-prevention story.
  ['Business Wire', 'Chase Brings AI Fraud-Fighting Advice to Consumers at 700 Chase Branches Nationwide'],
  // "investors" everywhere, all real scams.
  ['Free Press Journal', 'Navi Mumbai Ponzi Scheme: 2 Arrested For Alleged ₹15-Crore Fraud Targeting 300 Investors'],
  ['Business Standard', 'SBI warns of 30% monthly return scams: 4 red flags investors must watch for'],
  ['Telangana Tribune', 'Adilabad Police Arrest Two Andhra Accused Who Allegedly Cheated 500 Investors Through Fake Crypto Website'],
  ['ABC4 Utah', 'Utah man charged after allegedly stealing millions from investors'],
  ['Orange County Register', 'Former Laguna Niguel private equity CEO sentenced in Ponzi scheme that defrauded investors of $63 million'],
  ['CoinMarketCap', "Rapper Doja Cat's X Account Hacked to Promote Scam Token, Investors Lost $1.6M"],
  ['The Daily Hodl', 'NY AG Secures $35,000,000 and Lifetime Crypto Ban From Ex-Celsius CEO for Investor Fraud'],
  ['UL Lawyers', "Crypto King Fraud Trial: Investor's $3.6M Loss Testimony"],
  // Regulators' own anti-scam "investor alerts" are exactly what the feed wants.
  ['Traders Union', 'NSE issues investor warning against fraudulent trading services'],
  ['Yahoo Finance', 'FINRA Launches Enhanced Investor Education and Protection Tools to Help Research Markets and Recognize Fraud'],
  ['FindLaw', "SEC Files Suit Against Alleged 'AI Investing Bots' Fraudsters"],
  // Deadline / class-action / law-enforcement vocabulary in consumer stories.
  ['IT News Africa', 'SARS eFiling Deadline Is 23 October: How to Spot the Tax-Season Phishing Scams'],
  ['Pollstar News', "The Biz: Class Action Suits Roll In After LN Data Breach Disclosure; Feds Probe Streaming Fraud; NYC's 'Click To Cancel' & More"],
  ['City of New Braunfels, TX (.gov)', 'SCAM ALERT: Fake Law Enforcement Calls Targeting Residents'],
  ['Yellow Scene Magazine', 'Frisco Police Issue Advisory About Scammers Calling & Pretending to be Law Enforcement'],
  ['104.5 WOKV', 'SCAM ALERT: St. Johns County warns of $11 million inheritance scam found in mail'],
  ['The Telegraph', 'Savers lose more than £90m to Ponzi schemes'],
  ['CBS News', 'FBI Reports Americans Lost $11.4B to Crypto Scams in 2025'],
  ['wtsp.com', 'US hits Bank of America with $1.2 billion fine, saying it violated money laundering and sanctions laws'],
];

describe('isInvestorSpam', () => {
  test.each(SPAM)('drops %s: %s', (source, headline) => {
    expect(isInvestorSpam(headline, source)).toBe(true);
  });

  test.each(KEEP)('keeps %s: %s', (source, headline) => {
    expect(isInvestorSpam(headline, source)).toBe(false);
  });

  test('a wire release is only held to the lower bar when it actually came from a wire', () => {
    const h = 'Investigation finds fraud ring targeted investors';
    expect(isInvestorSpam(h, 'GlobeNewswire')).toBe(true);
    expect(isInvestorSpam(h, 'Associated Press')).toBe(false);
  });

  test('a ticker alone is not enough; a ticker next to litigation words is', () => {
    expect(isInvestorSpam('Mastercard (NYSE: MA) launches real-time scam alerts for cardholders', 'Reuters')).toBe(false);
    expect(isInvestorSpam('Acme Corp (NASDAQ: ACME) faces class action after fraud claims', 'Reuters')).toBe(true);
  });

  test('a town named Thornton is not a law firm', () => {
    expect(isInvestorSpam('Thornton law enforcement warns of jury duty scam calls', 'Denver Post')).toBe(false);
  });
});

describe('Postgres form of the rules', () => {
  test('only word boundaries change between dialects', () => {
    expect(INVESTOR_SPAM_PG).toBe(INVESTOR_SPAM_SOURCE.replace(/\\b/g, '\\y'));
    expect(INVESTOR_SPAM_PG).not.toMatch(/\\b/);
    expect(toPostgresRegex('\\bscam\\b')).toBe('\\yscam\\y');
    // No lookbehind or named groups, which Postgres AREs do not support.
    for (const p of [INVESTOR_SPAM_PG, PRESS_WIRE_PG, WIRE_LITIGATION_PG]) {
      expect(p).not.toMatch(/\(\?<|\(\?P/);
    }
  });

  test('migration 031 purges with exactly the live rules', () => {
    const sql = fs.readFileSync(
      path.join(__dirname, '../src/db/migrations/031_purge_investor_spam_news.sql'),
      'utf8'
    );
    const literal = (s: string) => `'${s.replace(/'/g, "''")}'`;
    expect(sql).toContain(`headline ~* ${literal(INVESTOR_SPAM_PG)}`);
    expect(sql).toContain(`source_name ~* ${literal(PRESS_WIRE_PG)}`);
    expect(sql).toContain(`headline ~* ${literal(WIRE_LITIGATION_PG)}`);
    expect(sql).toMatch(/WHERE source_kind = 'news'/);
  });
});
