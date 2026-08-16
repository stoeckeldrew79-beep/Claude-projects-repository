// Small fixed set matching what /report currently collects. Not a full
// ISO-3166 list — extend as real international data actually comes in,
// rather than pre-building selectors for countries with zero records.
export const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  AU: 'Australia',
  NZ: 'New Zealand',
  IE: 'Ireland',
  SG: 'Singapore',
  OTHER: 'Other',
};

export function countryName(code: string | null | undefined): string {
  if (!code) return 'Unknown';
  return COUNTRY_NAMES[code] ?? code;
}
