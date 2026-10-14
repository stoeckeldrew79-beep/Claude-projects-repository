// US state handling for public report intake. Alert targeting matches a
// report's state against subscribers' `users.state`, so a report's state
// must be one of these exact codes or it silently matches nobody.

// 50 states + DC — the same 51 jurisdictions state_ag_sources covers.
// Territories (PR, GU, VI, ...) are deliberately excluded: subscribers
// can't currently pick them, so a territory-targeted alert would reach no
// one. Add them here and in the migration's CHECK together if that changes.
export const US_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
  'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
  'WV', 'WI', 'WY',
] as const;

export type UsStateCode = (typeof US_STATE_CODES)[number];

export function isUsStateCode(value: string): value is UsStateCode {
  return (US_STATE_CODES as readonly string[]).includes(value);
}

// First-three-digit ZIP prefix ranges, inclusive. Prefixes not listed
// (PR/VI 006–009, military APO/FPO 090–099/340/962–966, Pacific
// territories 969, and unassigned prefixes) return null rather than a
// guess. A handful of ZIPs straddle a state line, so this is best-effort —
// reports record state_source='zip' so a derived state is never mistaken
// for one the reporter chose.
const ZIP3_RANGES: [number, number, UsStateCode][] = [
  [5, 5, 'NY'],
  [10, 27, 'MA'],
  [28, 29, 'RI'],
  [30, 38, 'NH'],
  [39, 49, 'ME'],
  [50, 54, 'VT'],
  [55, 55, 'MA'],
  [56, 59, 'VT'],
  [60, 69, 'CT'],
  [70, 89, 'NJ'],
  [100, 149, 'NY'],
  [150, 196, 'PA'],
  [197, 199, 'DE'],
  [200, 200, 'DC'],
  [201, 201, 'VA'],
  [202, 205, 'DC'],
  [206, 219, 'MD'],
  [220, 246, 'VA'],
  [247, 268, 'WV'],
  [270, 289, 'NC'],
  [290, 299, 'SC'],
  [300, 319, 'GA'],
  [320, 339, 'FL'],
  [341, 349, 'FL'],
  [350, 369, 'AL'],
  [370, 385, 'TN'],
  [386, 397, 'MS'],
  [398, 399, 'GA'],
  [400, 427, 'KY'],
  [430, 459, 'OH'],
  [460, 479, 'IN'],
  [480, 499, 'MI'],
  [500, 528, 'IA'],
  [530, 549, 'WI'],
  [550, 567, 'MN'],
  [569, 569, 'DC'],
  [570, 577, 'SD'],
  [580, 588, 'ND'],
  [590, 599, 'MT'],
  [600, 629, 'IL'],
  [630, 658, 'MO'],
  [660, 679, 'KS'],
  [680, 693, 'NE'],
  [700, 715, 'LA'],
  [716, 729, 'AR'],
  [730, 732, 'OK'],
  [733, 733, 'TX'],
  [734, 749, 'OK'],
  [750, 799, 'TX'],
  [800, 816, 'CO'],
  [820, 831, 'WY'],
  [832, 838, 'ID'],
  [840, 847, 'UT'],
  [850, 865, 'AZ'],
  [870, 884, 'NM'],
  [885, 885, 'TX'],
  [889, 898, 'NV'],
  [900, 961, 'CA'],
  [967, 968, 'HI'],
  [970, 979, 'OR'],
  [980, 994, 'WA'],
  [995, 999, 'AK'],
];

// Accepts "12345" or ZIP+4 ("12345-6789"); anything else returns null.
export function stateForZip(zip: string): UsStateCode | null {
  const match = /^(\d{3})\d{2}(-\d{4})?$/.exec(zip.trim());
  if (!match) return null;
  const prefix = Number(match[1]);
  const range = ZIP3_RANGES.find(([lo, hi]) => prefix >= lo && prefix <= hi);
  return range ? range[2] : null;
}

export type StateSource = 'reporter' | 'zip' | 'admin';

export interface ResolvedReportState {
  state: UsStateCode | null;
  state_source: StateSource | null;
}

export class InvalidStateError extends Error {}

// Decides what state (if any) a new public report is stored with. State
// stays optional — a report with no state still feeds nationwide
// detection. Precedence: the reporter's own pick ("where this happened")
// wins over one derived from their ZIP, which may be a home address
// rather than where the scam took place.
export function resolveReportState(input: {
  country?: unknown;
  state?: unknown;
  zip_code?: unknown;
}): ResolvedReportState {
  const country = typeof input.country === 'string' ? input.country.trim().toUpperCase() : 'US';
  if (country !== 'US') return { state: null, state_source: null };

  if (input.state !== undefined && input.state !== null && input.state !== '') {
    const state = typeof input.state === 'string' ? input.state.trim().toUpperCase() : '';
    if (!isUsStateCode(state)) {
      throw new InvalidStateError('state must be a two-letter US state code (50 states + DC)');
    }
    return { state, state_source: 'reporter' };
  }

  if (typeof input.zip_code === 'string') {
    const derived = stateForZip(input.zip_code);
    if (derived) return { state: derived, state_source: 'zip' };
  }

  return { state: null, state_source: null };
}
