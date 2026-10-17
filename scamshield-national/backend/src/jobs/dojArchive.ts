// Pure helpers for the DOJ press-release archive (scanDojArchive.ts):
// deciding which of the Justice Department's ~274,000 releases since 2009
// are fraud/scam cases, and turning one into a federal_cases row. No
// database or network access here, so the rules are unit-tested directly.
import { US_STATE_NAMES, UsStateCode } from '../utils/usStates';
import { fraudTheme } from './newsCluster';
import { cleanText } from './agFeedParse';

// One release as https://www.justice.gov/api/v1/press_releases.json
// returns it (only the fields used here).
export interface DojRelease {
  uuid: string;
  title: string;
  url: string;
  date: string; // unix seconds, as a string; empty on some releases
  created?: string; // '<time datetime="...">1231183207</time>'
  teaser?: string | null;
  body?: string | null;
  component?: { name: string }[] | unknown;
  topic?: { name: string }[] | unknown;
}

export interface FederalCaseRow {
  doj_uuid: string;
  title: string;
  summary: string | null;
  url: string;
  published_at: Date;
  office: string | null;
  components: string[];
  topics: string[];
  state: string | null;
  theme: string;
}

// DOJ's own topic tags that mean fraud. Tagging only became consistent
// around 2017, so older releases are judged on the headline alone.
// "Tax" and "Cybercrime" are deliberately not here: on their own they also
// cover child-exploitation sites and plain tax evasion by local businesses;
// a fraud headline still brings those cases in.
const FRAUD_TOPICS = new Set([
  'Fraud',
  'Financial Fraud',
  'COVID-Related Fraud',
  'Benefit Fraud',
  'Healthcare Fraud',
  'Health Care Fraud',
  'Identity Theft',
  'Securities, Commodities, & Investment Fraud',
  'Elder Justice',
  'Disaster Fraud',
  'Mortgage Fraud',
  'Consumer Protection',
  'False Claims Act',
]);

const FRAUD_HEADLINE =
  /\b(fraud\w*|scams?|scammers?|scammed|ponzi|swindl\w*|defraud\w*|con artists?|identity theft|stolen identit\w*|phish\w*|embezzl\w*|impersonat\w*|false claims|kickbacks?|telemarket\w*|sextort\w*|romance|pyramid scheme|investment scheme|money mules?|elder abuse|counterfeit\w*)\b/i;

// Releases that match the vocabulary above but are not fraud cases.
const NOT_A_FRAUD_CASE =
  /\b(child (?:sexual|porn\w*|exploitation)|csam|media advisory|news conference|child support)\b/i;

function names(field: unknown): string[] {
  if (!Array.isArray(field)) return [];
  return field
    .map((x) => (x && typeof x === 'object' && typeof (x as { name?: unknown }).name === 'string' ? (x as { name: string }).name : null))
    .filter((x): x is string => Boolean(x));
}

export function isFraudRelease(release: DojRelease): boolean {
  const title = release.title ?? '';
  if (!title || NOT_A_FRAUD_CASE.test(title)) return false;
  if (FRAUD_HEADLINE.test(title)) return true;
  return names(release.topic).some((t) => FRAUD_TOPICS.has(t));
}

const STATE_BY_NAME = new Map<string, UsStateCode>(
  (Object.entries(US_STATE_NAMES) as [UsStateCode, string][]).map(([code, name]) => [name.toLowerCase(), code])
);
const TERRITORIES: Record<string, string> = {
  'puerto rico': 'PR',
  guam: 'GU',
  'virgin islands': 'VI',
  'northern mariana islands': 'MP',
  // US_STATE_NAMES may spell DC differently; DOJ always uses this.
  'district of columbia': 'DC',
};

// "USAO - Texas, Western" -> TX; "USAO - District of Columbia" -> DC;
// "USAO - Puerto Rico" -> PR. Main Justice components (Criminal Division,
// FBI, ...) have no state.
export function stateForComponent(component: string): string | null {
  const m = /^USAO\s*-\s*(.+?)(?:,\s*(?:Northern|Southern|Eastern|Western|Middle|Central))?$/i.exec(component.trim());
  if (!m) return null;
  const place = m[1].trim().toLowerCase();
  return STATE_BY_NAME.get(place) ?? TERRITORIES[place] ?? null;
}

// "USAO - Texas, Western" -> "Western District of Texas".
export function officeName(component: string): string {
  const m = /^USAO\s*-\s*(.+?)(?:,\s*(Northern|Southern|Eastern|Western|Middle|Central))?$/i.exec(component.trim());
  if (!m) return component;
  if (/^district of /i.test(m[1])) return m[1];
  return m[2] ? `${m[2]} District of ${m[1]}` : `District of ${m[1]}`;
}

const SUMMARY_MAX = 400;

// A short plain-text summary: DOJ's own teaser when it has one, else the
// opening of the body. Kept short on purpose — the archive points readers
// to the full release on justice.gov rather than republishing it, which
// also keeps ~70,000 rows small enough for the database plan.
export function summarize(release: DojRelease): string | null {
  const source = (release.teaser && release.teaser.trim()) || release.body || '';
  const text = cleanText(source.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    // Drop the dateline ("WASHINGTON – ", "TULSA, Okla. — ").
    .replace(/^[A-Z][A-Z .'-]{1,30}(?:,\s*[A-Za-z. ]{2,20})?\s+[–—-]\s+/, '')
    .trim();
  if (!text) return null;
  if (text.length <= SUMMARY_MAX) return text;
  const cut = text.slice(0, SUMMARY_MAX);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), SUMMARY_MAX - 40)).trim()}…`;
}

// The release date, falling back to when DOJ created the page (a few
// releases carry no date at all).
export function releaseSeconds(release: DojRelease): number | null {
  const date = Number(release.date);
  if (release.date && Number.isFinite(date) && date > 0) return date;
  const created = /(\d{9,})\s*<\/time>/.exec(release.created ?? '')?.[1];
  return created ? Number(created) : null;
}

export function toFederalCase(release: DojRelease): FederalCaseRow | null {
  const seconds = releaseSeconds(release) ?? NaN;
  if (!release.uuid || !release.title || !release.url || !Number.isFinite(seconds) || seconds <= 0) return null;
  const components = names(release.component);
  const usao = components.find((c) => /^USAO\s*-/i.test(c));
  const title = cleanText(release.title).replace(/\s+/g, ' ').trim();
  return {
    doj_uuid: release.uuid,
    title,
    summary: summarize(release),
    url: release.url,
    published_at: new Date(seconds * 1000),
    office: usao ? officeName(usao) : components[0] ?? null,
    components,
    topics: names(release.topic),
    state: usao ? stateForComponent(usao) : null,
    theme: fraudTheme(title),
  };
}
