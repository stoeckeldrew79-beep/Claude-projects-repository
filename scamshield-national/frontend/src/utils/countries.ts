import { COUNTRIES } from './countryData';

// Names come from the generated ISO table rather than a hand-kept list, so a
// country the content routines add overnight is named the moment it appears.
export function countryName(code: string | null | undefined): string {
  if (!code) return 'Unknown';
  if (code === 'OTHER') return 'Other';
  return COUNTRIES[code]?.name ?? code;
}

// Kept for callers that want the whole map; prefer countryName().
export const COUNTRY_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRIES).map(([code, info]) => [code, info.name])
);
