// Single source of truth for the site navigation. The desktop header and the
// phone menu both render from this, so a page added here shows up in both.

export interface NavItem {
  to: string;
  label: string;
  end?: boolean;
  /** Optional one-line description. */
  hint?: string;
}

// The desktop section bar: every section of the site, visible at a glance
// and grouped, so a first-time visitor sees the full scope of what's here
// without opening a menu. (A "More" dropdown used to hide half of it.)
export const SECTION_GROUPS: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Live intelligence',
    items: [
      { to: '/todays-scams', label: "Today's Scams" },
      { to: '/ai-scams', label: 'AI Scams' },
      { to: '/database', label: 'Scam Database' },
      { to: '/global-map', label: 'Global Map' },
      { to: '/statistics', label: 'Statistics' },
    ],
  },
  {
    heading: 'Official sources',
    items: [
      { to: '/state-attorneys-general', label: 'State AGs' },
      { to: '/federal', label: 'Federal Watch', end: true },
      { to: '/federal/cases', label: 'Federal Cases' },
      { to: '/global-sources', label: 'Global Sources' },
    ],
  },
  {
    heading: 'Learn',
    items: [
      { to: '/notorious', label: 'Notorious' },
      { to: '/articles', label: 'Articles' },
    ],
  },
  {
    heading: 'Protect yourself',
    items: [
      { to: '/check-now', label: 'Scam Checker' },
      { to: '/help', label: 'Get Help' },
      { to: '/alerts', label: 'Alerts' },
      { to: '/subscribe', label: 'Plans' },
    ],
  },
];

// Phone menu: everything, grouped so a long list stays scannable.
export const MOBILE_NAV_GROUPS: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Intelligence',
    items: [
      { to: '/', label: 'Home', end: true },
      { to: '/todays-scams', label: "Today's Scams" },
      { to: '/ai-scams', label: 'AI Scams' },
      { to: '/database', label: 'Scam Database' },
      { to: '/global-map', label: 'Global Map' },
      { to: '/statistics', label: 'Statistics' },
    ],
  },
  {
    heading: 'Official sources',
    items: [
      { to: '/state-attorneys-general', label: 'State Attorneys General' },
      { to: '/federal', label: 'Federal Watch', end: true },
      { to: '/federal/cases', label: 'Federal Case Archive' },
      { to: '/global-sources', label: 'Global Sources' },
    ],
  },
  {
    heading: 'Learn',
    items: [
      { to: '/notorious', label: 'Notorious Scams' },
      { to: '/articles', label: 'Articles' },
    ],
  },
  {
    heading: 'Protect yourself',
    items: [
      { to: '/check-now', label: 'Scam Checker' },
      { to: '/help', label: "I've been scammed — get help" },
      { to: '/alerts', label: 'Scam Alerts' },
      { to: '/subscribe', label: 'Plans & Pricing' },
      { to: '/report-status', label: 'Check report status' },
    ],
  },
];
