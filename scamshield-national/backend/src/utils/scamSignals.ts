// The Scam Checker's rules engine: reads a pasted message (or a bare link,
// phone number or email) and reports the warning signs it contains. Pure
// and synchronous — no network or database — so every rule is unit-tested
// and the checker answers instantly even when everything else is down.
//
// It never says "safe". The strongest it gets in the reassuring direction
// is "no common warning signs found", because a scam that avoids these
// tells is still a scam.

export type Severity = 'high' | 'medium' | 'low';

export interface Signal {
  id: string;
  title: string;
  why: string;
  severity: Severity;
  // Words that steer the "similar scams in the database" search.
  searchTerms: string;
}

export interface LinkFinding {
  url: string;
  host: string;
  issues: string[];
}

export interface Analysis {
  verdict: 'high_risk' | 'suspicious' | 'no_signs';
  score: number;
  signals: Signal[];
  links: LinkFinding[];
  phones: string[];
  emails: string[];
  // Free text for the database search, built from the matched signals.
  searchQuery: string;
}

const WEIGHT: Record<Severity, number> = { high: 35, medium: 18, low: 8 };

interface Rule extends Omit<Signal, 'id'> {
  id: string;
  pattern: RegExp;
}

// Ordered roughly by how decisive the sign is. Patterns are deliberately
// phrase-level: single words like "bank" or "package" alone are far too
// common in legitimate messages to count.
const RULES: Rule[] = [
  {
    id: 'gift_cards',
    title: 'Asks for payment in gift cards',
    why: 'No real company, government agency or utility takes payment in gift cards. This is one of the clearest signs of a scam.',
    severity: 'high',
    searchTerms: 'gift card payment',
    pattern: /\b(gift ?cards?|itunes cards?|apple cards?|google play cards?|steam cards?|target cards?|ebay cards?|vanilla (?:visa|cards?)|card numbers? (?:on|from) the back)\b/i,
  },
  {
    id: 'crypto_payment',
    title: 'Asks you to pay or move money with crypto',
    why: 'Requests to send Bitcoin or other crypto, or to use a Bitcoin ATM, are a hallmark of impersonation and investment scams. Crypto payments are almost impossible to reverse.',
    severity: 'high',
    searchTerms: 'cryptocurrency bitcoin payment',
    pattern: /\b(bitcoin|btc|usdt|tether|crypto(?:currency)?|bitcoin atm|crypto atm|coinbase wallet|wallet address|qr code to deposit)\b/i,
  },
  {
    id: 'verification_code',
    title: 'Asks you to share a verification code',
    why: 'Those one-time codes exist to stop someone else getting into your accounts. Anyone asking you to read one back is trying to take over your account.',
    severity: 'high',
    searchTerms: 'verification code account takeover',
    pattern: /\b(verification code|one[- ]time (?:pass(?:code|word)|code)|otp|security code (?:we|i) (?:just )?sent|(?:read|send|tell) (?:me|us) the (?:\d-digit )?code|\d-digit code)\b/i,
  },
  {
    id: 'safe_account',
    title: 'Tells you to move money to a "safe" account',
    why: 'Banks and government agencies never ask you to move your money to protect it. "Safe account" requests are a classic bank-impersonation scam.',
    severity: 'high',
    searchTerms: 'bank impersonation safe account transfer',
    pattern: /\b(safe account|secure account|protected account|move (?:your|the) (?:money|funds|savings)|withdraw (?:cash|the money) and|courier (?:will|to) (?:pick up|collect)|put (?:the )?cash in a (?:box|envelope))\b/i,
  },
  {
    id: 'remote_access',
    title: 'Asks to control your computer or phone',
    why: 'Tech-support scammers ask you to install AnyDesk, TeamViewer or similar so they can take over your device and your bank accounts.',
    severity: 'high',
    searchTerms: 'tech support remote access',
    pattern: /\b(anydesk|teamviewer|ultraviewer|quick ?assist|logmein|remote (?:access|desktop|control)|screen ?share|install (?:this|the) app so (?:we|i) can)\b/i,
  },
  {
    id: 'arrest_threat',
    title: 'Threatens arrest, lawsuits or legal action',
    why: 'Real agencies send letters and don\'t threaten immediate arrest by phone or text. Threats are meant to scare you into acting before you think.',
    severity: 'high',
    searchTerms: 'government impersonation arrest warrant',
    pattern: /\b(arrest(?:ed)?|warrant (?:for|out)|legal action|lawsuit (?:will be|has been) filed|police (?:will|are on)|you (?:will|could) be (?:jailed|prosecuted)|suspend(?:ed)? your social security|deportation)\b/i,
  },
  {
    id: 'secrecy',
    title: 'Tells you to keep it secret',
    why: 'Scammers isolate you so no one can warn you. A real bank, agency or family member won\'t tell you to hide it from others.',
    severity: 'high',
    searchTerms: 'secrecy do not tell',
    pattern: /\b(don'?t tell (?:anyone|your|the bank)|do not tell|keep (?:this|it) (?:a )?(?:secret|confidential|between us)|don'?t hang up|do not hang up|stay on the line)\b/i,
  },
  {
    id: 'family_emergency',
    title: 'A family member in trouble needs money fast',
    why: 'The "grandparent" or family-emergency scam — now often with an AI-cloned voice. Hang up and call your relative back on the number you already have.',
    severity: 'high',
    searchTerms: 'family emergency grandparent voice',
    pattern: /\b(grand(?:ma|pa|mother|father)|it'?s me,? your|(?:in|from) jail|bail money|post bail|had an accident|(?:this is|it'?s) my new number|lost my phone,? (?:this is|new number))\b/i,
  },
  {
    id: 'urgency',
    title: 'Pressure to act right now',
    why: 'Deadlines like "within 24 hours" or "final notice" are designed to rush you past your own judgment.',
    severity: 'medium',
    searchTerms: 'urgent deadline',
    pattern: /\b(within (?:24|48|12) hours|immediately|urgent(?:ly)?|act now|final (?:notice|warning|reminder)|last chance|expires? today|right away|as soon as possible|avoid (?:a )?(?:penalty|late fee|suspension))\b/i,
  },
  {
    id: 'account_problem',
    title: 'Claims there is a problem with your account',
    why: '"Unusual activity" or "your account is locked" messages push you to log in through their link, which captures your password.',
    severity: 'medium',
    searchTerms: 'phishing account verify',
    pattern: /\b(unusual (?:sign-?in )?activity|suspicious (?:activity|login|transaction)|account (?:has been |is |will be )?(?:locked|suspended|limited|on hold|disabled)|verify your (?:account|identity|information)|confirm your (?:identity|details|information)|update your (?:payment|billing) (?:info|information|details))\b/i,
  },
  {
    id: 'package_toll',
    title: 'Unpaid toll, delivery fee or missed package',
    why: 'Fake toll and delivery texts are among the most reported scams. Toll agencies and carriers don\'t text links demanding small fees.',
    severity: 'medium',
    searchTerms: 'toll text package delivery smishing',
    pattern: /\b(unpaid toll|toll (?:balance|charges?|violation)|e-?zpass|sunpass|fastrak|redeliver(?:y)?|(?:package|parcel|shipment) (?:could not|couldn'?t|cannot|is on hold|was returned|delivery (?:failed|attempt))|delivery fee|incomplete (?:address|delivery))\b/i,
  },
  {
    id: 'government',
    title: 'Claims to be a government agency',
    why: 'IRS, Social Security, Medicare and law-enforcement impersonation is common. Real agencies contact you by mail first and never demand payment by phone, text or gift card.',
    severity: 'medium',
    searchTerms: 'government impersonation IRS social security',
    pattern: /\b(irs|internal revenue|social security (?:administration|number)|ssa\b|medicare|fbi|federal agent|u\.?s\.? marshal|department of (?:justice|treasury)|customs (?:and|&) border|homeland security|dmv)\b/i,
  },
  {
    id: 'prize',
    title: 'Says you won a prize, lottery or refund',
    why: 'You can\'t win a contest you didn\'t enter, and real prizes never require a fee to collect.',
    severity: 'medium',
    searchTerms: 'prize lottery sweepstakes',
    pattern: /\b(you(?:'ve| have)? won|winner|lottery|sweepstakes|claim your (?:prize|reward|refund|gift)|selected to receive|unclaimed (?:funds|money|refund)|processing fee to (?:release|claim))\b/i,
  },
  {
    id: 'investment',
    title: 'Promises big or guaranteed returns',
    why: 'Guaranteed or very high returns are the bait in investment and "pig-butchering" scams. Real investments never guarantee profit.',
    severity: 'medium',
    searchTerms: 'investment fraud crypto trading',
    pattern: /\b(guaranteed (?:returns?|profits?|income)|double your (?:money|investment)|risk[- ]free (?:investment|profit|returns?)|\d{2,3}% (?:return|profit|daily|weekly|monthly)|trading platform|(?:my|our) (?:mentor|uncle|aunt) (?:taught|showed)|insider (?:tip|trading signals?))\b/i,
  },
  {
    id: 'job_offer',
    title: 'An easy job offer or task-for-pay',
    why: 'Fake jobs pay "per task" or ask you to deposit checks, reship packages or pay for equipment up front — then the money vanishes.',
    severity: 'medium',
    searchTerms: 'job scam work from home',
    pattern: /\b(work from home|\$\d{2,4} (?:per|a) (?:day|hour)|(?:daily|easy) (?:income|pay)|tasks? (?:to complete|optimization)|reshipp?ing|package (?:inspector|forwarder)|deposit (?:the|this) check|overpaid|buy (?:the )?equipment)\b/i,
  },
  {
    id: 'wrong_number',
    title: 'A friendly "wrong number" or stranger opener',
    why: '"Sorry, wrong number" chats that turn friendly are how many romance and crypto-investment scams start.',
    severity: 'low',
    searchTerms: 'wrong number romance pig butchering',
    pattern: /\b(wrong number|is this (?:\w+)\?|sorry,? i (?:think i )?(?:have|got) the wrong|we met (?:at|on) (?:a|the)|nice to meet you,? (?:by|through))\b/i,
  },
  {
    id: 'unusual_payment',
    title: 'Asks for payment by wire, Zelle, Cash App or Venmo',
    why: 'These apps move money instantly and usually can\'t be reversed, which is why scammers prefer them.',
    severity: 'low',
    searchTerms: 'payment app zelle wire transfer',
    pattern: /\b(wire (?:transfer|the money)|western union|moneygram|zelle|cash ?app|venmo|paypal friends)\b/i,
  },
];

// --- Links -------------------------------------------------------------

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'rebrand.ly', 'cutt.ly', 'shorturl.at',
  'rb.gy', 't.ly', 'tiny.cc', 'bl.ink', 's.id', 'v.gd',
]);

// TLDs that show up in scam campaigns far out of proportion to legitimate use.
const RISKY_TLDS = new Set([
  'top', 'xyz', 'icu', 'click', 'live', 'cyou', 'sbs', 'buzz', 'rest', 'cfd', 'bond', 'mom', 'lol', 'monster',
  'quest', 'zip', 'mov', 'win', 'vip', 'loan', 'work', 'gq', 'tk', 'ml', 'cf', 'ga', 'cn', 'su',
]);

// Brand → domains it really uses. A link that names the brand but isn't
// on one of these is almost always impersonation.
const BRANDS: Record<string, string[]> = {
  usps: ['usps.com', 'usps.gov'],
  fedex: ['fedex.com'],
  ups: ['ups.com'],
  dhl: ['dhl.com'],
  amazon: ['amazon.com', 'amazon.co.uk', 'amazon.ca', 'amazon.de', 'amazon.in', 'amazon.com.au', 'amazon.co.jp'],
  paypal: ['paypal.com', 'paypal.me'],
  apple: ['apple.com', 'icloud.com'],
  microsoft: ['microsoft.com', 'live.com', 'outlook.com', 'office.com'],
  netflix: ['netflix.com'],
  irs: ['irs.gov'],
  ssa: ['ssa.gov'],
  medicare: ['medicare.gov', 'cms.gov'],
  chase: ['chase.com'],
  wellsfargo: ['wellsfargo.com'],
  bankofamerica: ['bankofamerica.com', 'bofa.com'],
  citi: ['citi.com', 'citibank.com'],
  coinbase: ['coinbase.com'],
  ezpass: ['e-zpassny.com', 'ezpassnj.com', 'ezpassva.com', 'ezpassmd.com', 'ezpassde.com', 'ezpassma.com', 'e-zpassiag.com', 'ezpass.com'],
  sunpass: ['sunpass.com'],
  fastrak: ['bayareafastrak.org', 'thetollroads.com'],
  venmo: ['venmo.com'],
  zelle: ['zellepay.com'],
  walmart: ['walmart.com'],
  costco: ['costco.com'],
  geeksquad: ['geeksquad.com', 'bestbuy.com'],
};

// Digit-for-letter swaps used in lookalike domains (paypa1, amaz0n).
const DEOBFUSCATE: Record<string, string> = { '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b' };

function registrableDomain(host: string): string {
  const parts = host.split('.');
  // Good enough for the common two-part public suffixes in BRANDS.
  const twoPart = /^(co|com|org|net|gov|ac)\.[a-z]{2}$/.test(parts.slice(-2).join('.'));
  return parts.slice(twoPart ? -3 : -2).join('.');
}

export function checkLink(raw: string): LinkFinding | null {
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `http://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (!host.includes('.')) return null;
  const issues: string[] = [];
  const domain = registrableDomain(host);
  const tld = host.split('.').pop() ?? '';

  if (SHORTENERS.has(host)) issues.push('A link shortener hides where this really goes.');
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) issues.push('The link is a bare number address, not a company website.');
  if (host.startsWith('xn--') || host.includes('.xn--')) issues.push('The address uses look-alike characters from other alphabets.');
  if (RISKY_TLDS.has(tld)) issues.push(`Ends in ".${tld}", a domain ending heavily used by scam sites.`);
  if (url.username || raw.includes('@')) issues.push('The link contains an "@", which can disguise the real destination.');
  if ((domain.match(/-/g) ?? []).length >= 2) issues.push('The address strings words together with hyphens, a common trick in fake sites.');

  const flat = host.replace(/[0-9]/g, (d) => DEOBFUSCATE[d] ?? d).replace(/[-.]/g, '');
  for (const [brand, official] of Object.entries(BRANDS)) {
    if (!flat.includes(brand)) continue;
    const isOfficial = official.some((d) => host === d || host.endsWith(`.${d}`));
    if (!isOfficial) {
      issues.push(`Uses the name "${brand.toUpperCase()}" but isn't ${brand.toUpperCase()}'s real website (${official[0]}).`);
      break;
    }
  }
  return { url: raw, host, issues };
}

// --- Extraction --------------------------------------------------------

const URL_RE =
  /\b((?:https?:\/\/)?(?:[a-z0-9-]+\.)+(?:[a-z]{2,24}|xn--[a-z0-9-]+)(?::\d{2,5})?(?:\/[^\s<>"')\]]*)?)/gi;
const EMAIL_RE = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;
const PHONE_RE = /(?:\+?\(?\d[\d\s().-]{7,}\d)/g;

// File names and abbreviations that look like domains but aren't.
const NOT_A_DOMAIN = /\.(?:jpg|jpeg|png|gif|pdf|doc|docx|txt|exe)$|^(?:e\.g|i\.e|u\.s|a\.m|p\.m)\.?$/i;

export function extractContacts(text: string): { urls: string[]; emails: string[]; phones: string[] } {
  const emails = [...new Set((text.match(EMAIL_RE) ?? []).map((e) => e.toLowerCase()))];
  const withoutEmails = emails.reduce((t, e) => t.replace(new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' '), text);
  const urls = [
    ...new Set(
      (withoutEmails.match(URL_RE) ?? [])
        .map((u) => u.replace(/[.,;:!?]+$/, ''))
        .filter((u) => !NOT_A_DOMAIN.test(u) && /[a-z]/i.test(u.split('.').pop() ?? ''))
    ),
  ];
  const phones = [
    ...new Set(
      (withoutEmails.match(PHONE_RE) ?? [])
        .map((p) => p.trim())
        .filter((p) => {
          const digits = p.replace(/\D/g, '');
          return digits.length >= 10 && digits.length <= 15;
        })
    ),
  ];
  return { urls: urls.slice(0, 10), emails: emails.slice(0, 10), phones: phones.slice(0, 10) };
}

// --- Analysis ----------------------------------------------------------

export function analyzeMessage(text: string): Analysis {
  const input = text.slice(0, 5000);
  const signals: Signal[] = [];
  for (const { pattern, ...signal } of RULES) {
    if (pattern.test(input)) signals.push(signal);
  }

  const { urls, emails, phones } = extractContacts(input);
  const links = urls.map(checkLink).filter((l): l is LinkFinding => l !== null);
  const riskyLinks = links.filter((l) => l.issues.length > 0);
  if (riskyLinks.length) {
    const impersonates = riskyLinks.some((l) => l.issues.some((i) => i.startsWith('Uses the name')));
    signals.push({
      id: 'risky_link',
      title: impersonates ? 'A link pretends to be a well-known company' : 'A link has warning signs',
      why: 'Don\'t open it. If you think the message might be real, go to the company\'s website by typing it yourself or using its app.',
      severity: impersonates ? 'high' : 'medium',
      searchTerms: 'phishing link fake website',
    });
  }
  // A link plus pressure or an account problem is the shape of most
  // phishing texts, even when each part alone looks mild.
  if (links.length && signals.some((s) => ['urgency', 'account_problem', 'package_toll', 'prize'].includes(s.id))) {
    signals.push({
      id: 'link_with_pressure',
      title: 'A link paired with pressure to act',
      why: 'Legitimate companies rarely text a link demanding action. This combination is how most phishing messages work.',
      severity: 'medium',
      searchTerms: 'smishing text link',
    });
  }

  const score = Math.min(100, signals.reduce((sum, s) => sum + WEIGHT[s.severity], 0));
  const verdict = score >= 50 || signals.some((s) => s.severity === 'high') ? 'high_risk' : score >= 18 ? 'suspicious' : 'no_signs';
  signals.sort((a, b) => WEIGHT[b.severity] - WEIGHT[a.severity]);

  return {
    verdict,
    score,
    signals,
    links,
    phones,
    emails,
    searchQuery: signals.length ? signals.slice(0, 3).map((s) => s.searchTerms).join(' ') : input.slice(0, 300),
  };
}
