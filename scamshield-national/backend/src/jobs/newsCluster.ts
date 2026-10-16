// Story clustering and theme tagging for the news feeds, used by the
// dailyNews controller. Pure: no database, no network, no main() - safe to
// import from a request handler (job files are not; see relevantFilter.ts).
//
// The case this exists for is DOJ's own release fan-out. When Main Justice
// announces a national action, every participating US Attorney's office
// republishes it under its own headline:
//   "DOJ's Fraud Division, IRS, and IRS-CI Expose More than $490M in Tax Fraud in National Tax Enforcement Surge"
//   "The District of Maine Joins DOJ Fraud Division, IRS, and IRS-CI in National Tax Enforcement Surge Exposing $490M in Tax Fraud"
//   "Eastern District of Texas joins DOJ Fraud Division, IRS, and IRS-CI in National Tax Enforcement Surge exposing over $490M in tax fraud"
// Each has its own URL, so the scanner's source_url dedupe keeps them all and
// Federal Watch showed one story eight times. Clustered, it is one story
// with "+7 more offices reported this".
import { headlineTokens, NEAR_DUPLICATE_THRESHOLD } from './agFeedParse';
import { US_STATE_NAMES, isUsStateCode } from '../utils/usStates';

// Overlap ratio alone over-merges short headlines: "Woman Sentenced for
// Fraud" is fully contained in any longer "...woman sentenced ... fraud"
// release. A cluster also needs this many distinctive shared tokens.
export const MIN_SHARED_TOKENS = 5;
// Fan-out republications land within a day or two of each other; the same
// wording a month apart is a different case.
export const MAX_CLUSTER_SPAN_MS = 3 * 86400000;

export interface ClusterableItem {
  headline: string;
  source_url: string;
  published_at: Date | string | null;
  scanned_at?: Date | string | null;
}

export interface StoryCluster<T> {
  lead: T;
  related: T[];
}

function timeOf(item: ClusterableItem): number | null {
  const raw = item.published_at ?? item.scanned_at ?? null;
  if (!raw) return null;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? null : t;
}

function sameStory(a: Set<string>, b: Set<string>): boolean {
  if (!a.size || !b.size) return false;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared += 1;
  return shared >= MIN_SHARED_TOKENS && shared / Math.min(a.size, b.size) >= NEAR_DUPLICATE_THRESHOLD;
}

// Main Justice's Office of Public Affairs is the originating release when a
// national action fans out; a US Attorney's copy is the echo.
function leadPriority(item: ClusterableItem): number {
  return /justice\.gov\/opa\//i.test(item.source_url) ? 1 : 0;
}

// Groups near-duplicate headlines. Input order is preserved: clusters come
// out in the order of their first member, so pass items newest-first and the
// output is newest-first too. Single linkage: an item joins every earlier
// cluster with any member it is a near-duplicate of (within
// MAX_CLUSTER_SPAN_MS of that member), merging them if there are several. The lead is the originating release when one is recognisable,
// otherwise the first (newest) member.
export function clusterStories<T extends ClusterableItem>(items: T[]): StoryCluster<T>[] {
  const clusters: { members: { item: T; tokens: Set<string>; time: number | null }[] }[] = [];
  for (const item of items) {
    const entry = { item, tokens: headlineTokens(item.headline), time: timeOf(item) };
    const matches = clusters.filter((c) =>
      c.members.some(
        (m) =>
          sameStory(m.tokens, entry.tokens) &&
          (m.time === null || entry.time === null || Math.abs(m.time - entry.time) <= MAX_CLUSTER_SPAN_MS)
      )
    );
    if (!matches.length) {
      clusters.push({ members: [entry] });
      continue;
    }
    // An item can bridge two clusters that did not match each other directly
    // (the Western District of Louisiana's wording scored 0.69 against
    // Minnesota's but 0.92 against Maine's, which matches both). Merge them
    // into the earliest, keeping member order by arrival.
    const [home, ...rest] = matches;
    for (const other of rest) {
      home.members.push(...other.members);
      clusters.splice(clusters.indexOf(other), 1);
    }
    home.members.push(entry);
  }
  return clusters.map(({ members }) => {
    let leadIndex = 0;
    members.forEach((m, i) => {
      if (leadPriority(m.item) > leadPriority(members[leadIndex].item)) leadIndex = i;
    });
    return {
      lead: members[leadIndex].item,
      related: members.filter((_, i) => i !== leadIndex).map((m) => m.item),
    };
  });
}

// --- Which office published a DOJ release ---------------------------------
// justice.gov/usao-mdfl/pr/... is the US Attorney's Office for the Middle
// District of Florida; /usao-vt/ a single-district state; /opa/ Main Justice.
const DISTRICT_PREFIX: Record<string, string> = {
  n: 'Northern',
  s: 'Southern',
  e: 'Eastern',
  w: 'Western',
  m: 'Middle',
  c: 'Central',
};

export function dojOfficeFromUrl(url: string): string | null {
  if (/justice\.gov\/opa\//i.test(url)) return 'DOJ Office of Public Affairs';
  const code = /justice\.gov\/usao-([a-z]+)\//i.exec(url)?.[1]?.toLowerCase();
  if (!code) return null;
  const multi = /^([nsewmc])d([a-z]{2})$/.exec(code);
  if (multi) {
    const st = multi[2].toUpperCase();
    if (isUsStateCode(st)) return `${DISTRICT_PREFIX[multi[1]]} District of ${US_STATE_NAMES[st]}`;
  }
  const single = code.toUpperCase();
  if (/^[a-z]{2}$/.test(code) && isUsStateCode(single)) return `District of ${US_STATE_NAMES[single]}`;
  // Territories and odd codes (usao-pr, usao-gu, usao-dc...): show the code.
  return `US Attorney's Office (${code.toUpperCase()})`;
}

// --- Fraud themes ----------------------------------------------------------
// First match wins, so the more specific themes come first ("COVID-19
// healthcare fraud" is healthcare; "Medicare fraud ... wire fraud" is too).
export const FRAUD_THEMES: { theme: string; pattern: RegExp }[] = [
  { theme: 'Healthcare & Medicare', pattern: /\b(medicare|medicaid|health ?care|tricare|champva|hospital|pharmac\w*|telehealth|telemedicine|autism|prescription|clinic|doctor)\b/i },
  { theme: 'Tax & IRS', pattern: /\b(tax|taxes|irs|refund scheme)\b/i },
  { theme: 'Pandemic relief', pattern: /\b(covid(?:-19)?|pandemic|ppp|paycheck protection|unemployment insurance|eidl)\b/i },
  { theme: 'Elder & grandparent', pattern: /\b(elder\w*|grandparents?|seniors?|older (?:adults|americans))\b/i },
  { theme: 'Crypto & investment', pattern: /\b(crypto\w*|bitcoin|ponzi|investment|investors?|securities|pig butchering|trading)\b/i },
  { theme: 'Romance & impersonation', pattern: /\b(romance|impersonat\w*|impost[eo]rs?|posing as|sextortion)\b/i },
  { theme: 'Identity theft & phishing', pattern: /\b(identity theft|phish\w*|data breach|hack\w*|sim swap)\b/i },
  { theme: 'Deceptive business practices', pattern: /\b(deceptive|unfair|advertising|marketing|subscription|junk fees?|fees|pricing|franchise\w*|multilevel|telemarket\w*|robocall\w*|debt relief|credit repair|refunds?|redress)\b/i },
  { theme: 'Bank, wire & money laundering', pattern: /\b(wire fraud|bank fraud|money launder\w*|checks?|loan\w*|mortgage)\b/i },
  { theme: 'Government program fraud', pattern: /\b(snap|benefits?|grant|program|contract\w*|postal|food stamps?|housing)\b/i },
];

export function fraudTheme(headline: string): string {
  return FRAUD_THEMES.find((t) => t.pattern.test(headline))?.theme ?? 'Other fraud';
}

// Theme tallies, most common first (ties by name, so output is stable).
export function themeCounts(headlines: string[]): { theme: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const h of headlines) {
    const theme = fraudTheme(h);
    counts.set(theme, (counts.get(theme) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count || a.theme.localeCompare(b.theme));
}
