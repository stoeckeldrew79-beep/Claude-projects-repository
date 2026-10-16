// Quality rules for the general news scan (scanDailyScamNews.ts) that the
// relevance filter cannot express: a headline can be full of fraud words and
// still not be scam intelligence.
//
// The case this exists for is shareholder class-action advertising. Law
// firms pay the press-release wires (Business Wire, GlobeNewswire, PR
// Newswire, ACCESS Newswire...) to push out a stream of near-identical
// solicitations - "BAC Stock Alert: BFA Law Announces Securities Fraud ...
// Investigation", "INVESTOR ALERT: Fluence Energy (FLNC) Investors: November
// 27, 2026, Filing Deadline in Securities Fraud Class Action - Contact
// Kessler Topaz". Google News surfaces them for "fraud" queries, the
// relevance filter rightly sees "fraud", and they took over the Today's Scams
// feed. They are lawsuits about a listed company's stock price, not scams
// aimed at consumers.
//
// Pure module: no database, no network, no main(). The same rules run in
// three places - at ingest (scanDailyScamNews.ts), at query time
// (controllers/dailyNews.ts, as Postgres regexes built from the same
// sources by toPostgresRegex), and once over stored rows (migration 031,
// whose literal patterns tests/newsQuality.test.ts checks against these).
//
// Deliberately conservative. Real consumer-fraud stories mention investors
// constantly ("Ponzi scheme targeting 300 investors", "SBI warns investors
// against fake schemes", "SEC charges 'AI investing bot' fraudsters"), so no
// single word like "investor" or "securities" excludes anything. Every rule
// below needs phrasing that only the solicitation genre uses.

// Plaintiff-side securities firms whose names appear in these headlines.
// A firm name alone is enough: these firms do not publish consumer-scam news.
const LAW_FIRMS = [
  'rosen law',
  'pomerantz',
  'levi (?:&|and) korsinsky',
  'bragar eagel',
  'kessler topaz',
  'hagens berman',
  'bronstein,? gewirtz',
  'faruqi',
  'glancy prongay',
  'robbins geller',
  'kahn swick',
  'lewis kahn',
  'bfa law',
  'bernstein liebhard',
  'schall law',
  'the gross law firm',
  'portnoy law',
  'johnson fistel',
  'block (?:&|and) leviton',
  'holzer (?:&|and) holzer',
  'howard g\\.? smith',
  'frank r\\.? cruz',
  'brodsky (?:&|and) smith',
  'halper sadeh',
  'monteverde (?:&|and) associates',
  'ademi firm',
  'kirby mcinerney',
  'bleichmar fonti',
  'labaton',
  'scott\\+scott',
  'berger montague',
  'saxena white',
  'edelson lechtzin',
  'gainey mckenna',
  'wolf haldenstein',
  'rigrodsky',
  'claimsfiler',
  'djs law',
  'bernstein litowitz',
  'grabar law',
  'kaskela law',
];

// Phrases only the solicitation genre uses. Each alone is enough.
const SOLICITATION_PHRASES = [
  // "Securities Fraud Class Action", "securities class action lawsuit".
  'securities (?:fraud )?class action',
  'class action (?:lawsuit |suit )?(?:filed )?(?:against|on behalf of) (?:\\w+ ){0,4}(?:investors|shareholders|stockholders)',
  // Not "investor alert": the SEC and FINRA publish real anti-scam guidance
  // under exactly that name.
  '(?:shareholder|stockholder)s? (?:alert|notice|reminder|update)',
  'shareholder (?:class action|lawsuit|investigation|rights)',
  // Not "filing deadline" or "deadline reminder": "Tax filing deadline
  // nears as IRS impersonation scams surge" is exactly what the feed wants.
  '(?:lead plaintiff|class action) deadline',
  'encourage[ds]? (?:\\w+ ){0,3}(?:investors|shareholders) (?:to )?contact',
  '(?:investors|shareholders) (?:may|should|are encouraged to) contact',
  'breach of fiduciary duty investigation',
  'stock alert',
];

// An exchange ticker in a headline - "(NASDAQ: HIMS)", "(NYSE:BAC)" - is the
// solicitation genre's signature when it sits next to fraud / lawsuit words.
// A ticker alone is not enough (a company's own fraud-prevention launch can
// carry one), so this is checked together with LITIGATION_CONTEXT.
const TICKER = '\\((?:nasdaq|nyse|nyse american|amex|otc\\w*|tsx|cboe)\\s*:\\s*[a-z.]{1,6}\\)';
const LITIGATION_CONTEXT = '(?:class action|lawsuit|investigation|investors|shareholders|securities)';

// The wires these solicitations are bought on. A wire release is held to a
// lower bar - one securities-litigation word plus a fraud word - because a
// wire is where they come from; real consumer-scam news on a wire (bank
// fraud-prevention launches) never talks about class actions or investors.
const PRESS_WIRES = [
  'business ?wire',
  'globe ?newswire',
  'pr ?newswire',
  'access ?(?:news)?wire',
  'financialcontent',
  'newsfile',
  'ein presswire',
  'accesswire',
];
const WIRE_LITIGATION = '(?:class action|securities|shareholders?|stockholders?|investors?|law firm|investigation)';

// The JS sources use \b for word boundaries; toPostgresRegex rewrites them to
// Postgres's \y. Nothing else in these sources differs between the two
// dialects (no lookbehind, no named groups).
export const INVESTOR_SPAM_SOURCE =
  `\\b(?:${LAW_FIRMS.join('|')})\\b|\\b(?:${SOLICITATION_PHRASES.join('|')})\\b|${TICKER}.*\\b${LITIGATION_CONTEXT}\\b|\\b${LITIGATION_CONTEXT}\\b.*${TICKER}`;
export const PRESS_WIRE_SOURCE = `\\b(?:${PRESS_WIRES.join('|')})\\b`;
export const WIRE_LITIGATION_SOURCE = `\\b${WIRE_LITIGATION}\\b`;

const INVESTOR_SPAM = new RegExp(INVESTOR_SPAM_SOURCE, 'i');
const PRESS_WIRE = new RegExp(PRESS_WIRE_SOURCE, 'i');
const WIRE_LITIGATION_RE = new RegExp(WIRE_LITIGATION_SOURCE, 'i');

// True for a shareholder-litigation solicitation (or similar investor-relations
// noise) that must not appear on the consumer scam feed.
export function isInvestorSpam(headline: string, sourceName = ''): boolean {
  if (INVESTOR_SPAM.test(headline)) return true;
  return PRESS_WIRE.test(sourceName) && WIRE_LITIGATION_RE.test(headline);
}

// The same rules as Postgres ARE regexes, for `~*` (case-insensitive) use.
export function toPostgresRegex(jsSource: string): string {
  return jsSource.replace(/\\b/g, '\\y');
}

export const INVESTOR_SPAM_PG = toPostgresRegex(INVESTOR_SPAM_SOURCE);
export const PRESS_WIRE_PG = toPostgresRegex(PRESS_WIRE_SOURCE);
export const WIRE_LITIGATION_PG = toPostgresRegex(WIRE_LITIGATION_SOURCE);
