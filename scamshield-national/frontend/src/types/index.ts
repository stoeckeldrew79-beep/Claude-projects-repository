export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  scam_count: number;
}

export type AlertLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ScamLocation {
  id: string;
  scam_id: string;
  state: string | null;
  zip_code: string | null;
  city: string | null;
  is_nationwide: boolean;
}

export interface Scam {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  category_name?: string;
  category_slug?: string;
  alert_level: AlertLevel | null;
  first_recorded: string | null;
  is_active: boolean;
  is_historical: boolean;
  sources: string[] | null;
  source_url: string | null;
  locations?: ScamLocation[];
  country: string | null;
  created_at: string;  // Victim-targeting labels — a separate axis from category, so a scam
  // can carry several or none.
  tags?: string[] | null;
}

export interface Alert {
  id: string;
  scam_id: string;
  title: string;
  body: string;
  alert_level: AlertLevel | null;
  state: string | null;
  zip_code: string | null;
  is_nationwide: boolean;
  sent_at: string;
}

export interface AlertCandidate {
  id: string;
  dedupe_tag: string;
  title: string;
  body: string;
  alert_level: AlertLevel;
  state: string | null;
  zip_code: string | null;
  is_nationwide: boolean;
  pattern_type: 'recurring_contact' | 'category_spike';
  status: 'pending' | 'approved' | 'dismissed';
  created_at: string;
  resolved_at: string | null;
  // Who it would reach if approved now (pending queue only; absent on an
  // older backend).
  audience?: { email: number; sms: number };
}

export interface AlertAudienceSummary {
  by_state: { state: string; users: number }[];
  nationwide: { email: number; sms: number };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  body: string;
  author: string | null;
  cover_image: string | null;
  cover_image_credit: string | null;
  cover_image_position: number;
  source_url: string | null;
  tags: string[] | null;
  scam_id: string | null;
  scam_slug?: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

// What the admin cover-photo panel lists. Article bodies are long and it
// never renders one, so the panel asks the API to leave them out.
export type ArticleSummary = Omit<Article, 'body' | 'author' | 'scam_id' | 'published' | 'created_at'>;

export interface GlobalStat {
  id: string;
  source_id: string;
  period_label: string;
  headline: string;
  report_count: number | null;
  loss_amount: number | null;
  currency: string | null;
  top_category: string | null;
  source_url: string;
  published_date: string | null;
}

export interface GlobalSource {
  id: string;
  agency_name: string;
  country: string;
  country_name: string;
  url: string;
  description: string;
  data_type: 'annual_report' | 'open_dataset' | 'public_stats';
  stats: GlobalStat[];
}

export interface StateAgSource {
  id: string;
  state: string;
  state_name: string;
  agency_name: string;
  consumer_protection_url: string;
  reports_url: string | null;
  has_published_reports: boolean;
  description: string;
}

export interface DailyScamNews {
  id: string;
  headline: string;
  summary: string | null;
  source_name: string;
  source_url: string;
  published_at: string | null;
  search_term: string | null;
  scanned_at: string;
  // Null for national/international stories; a two-letter code for alerts
  // tied to one US state (see the scanStateAgNews job); 'US' for the
  // federal DOJ/FTC feed (see scanFederalScamNews). 'US' is deliberately
  // excluded from the /daily-news/states list, so it never appears where a
  // 2-letter code is assumed to be one of the 50 states + DC.
  state: string | null;
  // 'ag': a state Attorney General's own publication. 'federal': a DOJ/FTC
  // release (state 'US'). 'news': press coverage found by news search.
  source_kind: 'ag' | 'federal' | 'news';
}

// One row of GET /v1/daily-news/latest-by-state: the newest official
// Attorney General item (source_kind 'ag') for a state, for every state that
// has one in the 30-day window. Ordered by state.
export interface LatestAgAlert {
  state: string;
  headline: string;
  source_url: string;
  source_name: string;
  published_at: string | null;
}

// Source-type filter on Today's Scams (GET /daily-news?kind=...).
export type DailyNewsKind = 'ag' | 'federal' | 'news';

// GET /v1/daily-news/summary — the strip at the top of Today's Scams.
// Counted over distinct stories in the 30-day window (investor spam out).
export interface DailyNewsSummary {
  last_24h: number;
  last_7d: number;
  total: number;
  official_ag: number;
  official_ag_7d: number;
  federal: number;
  international: number;
  states_covered: number;
  ag_states: number;
  sources: number;
  last_scanned_at: string | null;
}

// One DOJ/FTC release on Federal Watch (GET /v1/daily-news/federal).
export interface FederalRelease {
  id: string;
  headline: string;
  source_name: string;
  source_url: string;
  published_at: string | null;
  scanned_at: string;
  agency: 'DOJ' | 'FTC';
  // "Middle District of Florida", "DOJ Office of Public Affairs", ...
  office: string | null;
}

// A story: the lead release plus the other offices that republished it.
export interface FederalStory extends FederalRelease {
  theme: string;
  related: FederalRelease[];
}

export interface FederalWatchData {
  clusters: FederalStory[];
  stats: {
    releases_7d: number;
    releases_30d: number;
    stories_7d: number;
    stories_30d: number;
    doj_releases: number;
    ftc_releases: number;
    offices: number;
    themes: { theme: string; count: number }[];
  };
}

export interface DailyNewsStateCount {
  state: string;
  total: number;
  ag_count: number;
}

// Documented scams per state. Same shape minus ag_count, which is a property
// of an alert's source and has no meaning for a database entry.
export interface ScamStateCount {
  state: string;
  total: number;
}

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'family' | 'business';

export interface User {
  id: string;
  email: string;
  phone: string | null;
  zip_code: string | null;
  state: string | null;
  subscription_tier: SubscriptionTier;
  sms_opt_in: boolean;
  email_opt_in: boolean;
}

export interface StateSummary {
  state: string;
  state_name: string;
  slug: string;
  scam_count: number;
  news_count: number;
}

export interface StateCategoryCount {
  name: string;
  slug: string;
  count: number;
}

// One state's page data: its Attorney General's consumer-protection office
// (all 51 verified in state_ag_sources) plus what the database holds for it.
export interface StateDetail extends StateSummary {
  agency_name: string;
  consumer_protection_url: string;
  reports_url: string | null;
  has_published_reports: boolean;
  description: string;
  ag_news_count: number;
  categories: StateCategoryCount[];
}

// A DOJ fraud/scam press release in the federal case archive.
export interface FederalCase {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  published_at: string;
  office: string | null;
  state: string | null;
  theme: string;
}

export interface FederalCasePage {
  data: FederalCase[];
  total: number;
  page: number;
  page_size: number;
}

export interface FederalCaseFilters {
  q?: string;
  state?: string;
  theme?: string;
  year?: number;
}

export interface FederalArchiveStats {
  total: number;
  first_date: string | null;
  last_date: string | null;
  states_covered: number;
  by_year: { year: number; count: number }[];
  by_theme: { theme: string; count: number }[];
  by_state: { state: string; count: number }[];
  backfill_complete: boolean;
}
