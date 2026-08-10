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
  locations?: ScamLocation[];
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

export interface Article {
  id: string;
  title: string;
  slug: string;
  body: string;
  author: string | null;
  cover_image: string | null;
  tags: string[] | null;
  scam_id: string | null;
  scam_slug?: string | null;
  published: boolean;
  published_at: string | null;
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
