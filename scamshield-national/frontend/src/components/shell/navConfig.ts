// Single source of truth for the site navigation. The desktop header and the
// phone menu both render from this, so a page added here shows up in both.

export interface NavItem {
  to: string;
  label: string;
  end?: boolean;
  /** One-line hint shown in the "More" dropdown and the phone menu. */
  hint?: string;
  /**
   * Smallest breakpoint at which a primary link fits in the header row.
   * Below it the link folds into the "More" menu instead of wrapping onto a
   * second row. 'md' = always in the row on desktop.
   */
  showFrom?: 'md' | 'lg' | 'xl';
}

export const PRIMARY_NAV: NavItem[] = [
  { to: '/todays-scams', label: "Today's Scams", hint: 'Fresh alerts and headlines', showFrom: 'md' },
  { to: '/ai-scams', label: 'AI Scams', hint: 'Deepfakes, voice clones, chatbots', showFrom: 'lg' },
  { to: '/database', label: 'Database', hint: 'Search every documented scam', showFrom: 'md' },
  { to: '/global-map', label: 'Global Map', hint: 'Scam activity by country', showFrom: 'lg' },
  { to: '/notorious', label: 'Notorious', hint: 'Infamous scams and scammers', showFrom: 'xl' },
  { to: '/articles', label: 'Articles', hint: 'Guides and analysis', showFrom: 'xl' },
  { to: '/alerts', label: 'Alerts', hint: 'Get warned about your area', showFrom: 'md' },
];

export const MORE_NAV: NavItem[] = [
  { to: '/state-attorneys-general', label: 'State AGs', hint: 'Official state Attorney General alerts' },
  { to: '/federal', label: 'Federal Watch', hint: 'DOJ and FTC enforcement releases' },
  { to: '/global-sources', label: 'Global Sources', hint: 'Official agencies worldwide' },
  { to: '/statistics', label: 'Statistics', hint: 'Live numbers and trends' },
  { to: '/subscribe', label: 'Plans & Pricing', hint: 'Alerts by email and SMS' },
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
      { to: '/federal', label: 'Federal Watch' },
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
      { to: '/check-now', label: 'Check something now' },
      { to: '/alerts', label: 'Scam Alerts' },
      { to: '/subscribe', label: 'Plans & Pricing' },
      { to: '/report-status', label: 'Check report status' },
    ],
  },
];
