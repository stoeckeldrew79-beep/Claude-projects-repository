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
  created_at: string;
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
  // tied to one US state (see the scanStateAgNews job).
  state: string | null;
  // 'ag' is the state Attorney General's own feed; 'news' is coverage.
  source_kind: 'ag' | 'news';
}

export interface DailyNewsStateCount {
  state: string;
  total: number;
  ag_count: number;
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
