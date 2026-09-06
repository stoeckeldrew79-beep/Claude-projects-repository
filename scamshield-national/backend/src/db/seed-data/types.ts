// Shared shapes for the seed data. Split out of seed.ts, which had grown past
// 6.9MB — beyond what any model or editor can load whole — with six scheduled
// content routines all editing the same file.
export interface SeedArticle {
  title: string;
  slug: string;
  author: string;
  tags: string[];
  body: string;
  // A real news/court/agency link, used as the "Read the full story" link
  // on profiles that have no rights-cleared photo — optional since photo
  // hunting happens separately (see NotoriousCoverPhotos in Admin.tsx).
  sourceUrl?: string;
  // A verified, rights-cleared (public domain or Creative Commons) photo.
  // Only set these once the license has actually been confirmed by
  // fetching the source page directly — never on an unverified guess.
  coverImage?: string;
  coverImageCredit?: string;
  // Vertical focal point, 0-100 (0 = top, 100 = bottom, 50 = center).
  // Defaults to 50 when coverImage is set without one.
  coverImagePosition?: number;
}

export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
}

export interface SeedScam {
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  // Historical entries have no current threat level, so this is optional
  // rather than forcing an inapplicable low/medium/high/critical label.
  alertLevel?: 'low' | 'medium' | 'high' | 'critical';
  sources: string[];
  // A real, verified link to the citing agency's page (their scam-alert
  // landing page, or general homepage as a fallback) — used as the "Read
  // more" link on the scam detail page. Only ever a verified real URL,
  // never a guess; left unset when no confirmed link exists yet.
  sourceUrl?: string;
  country?: string;
  isHistorical?: boolean;
  // ISO date (YYYY-MM-DD) of the earliest well-documented instance —
  // only set on isHistorical entries, where a specific real date exists.
  firstRecorded?: string;
  // Two-letter USPS state code — only set when the scam is genuinely
  // tied to a specific state (a state agency impersonation, a state AG
  // alert, a state-run benefit program), never guessed. Powers the
  // Global Map's future zoom-to-region view via scam_locations; leave
  // unset for nationwide patterns.
  state?: string;
}

export interface SeedGlobalSource {
  agency_name: string;
  country: string;
  country_name: string;
  url: string;
  description: string;
  data_type: 'annual_report' | 'open_dataset' | 'public_stats';
}

export interface SeedStateAgSource {
  state: string;
  state_name: string;
  agency_name: string;
  consumer_protection_url: string;
  reports_url?: string;
  has_published_reports: boolean;
  description: string;
}
