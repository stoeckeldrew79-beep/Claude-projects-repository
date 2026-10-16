// connection.ts throws at import without DATABASE_URL; the pool is never
// used by these pure helpers, so any value will do.
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://unused:unused@localhost:1/unused';

import { SCAM_COLUMNS, toPrefixTsQuery } from '../src/models/scams';

describe('toPrefixTsQuery', () => {
  it('prefix-matches every typed word', () => {
    expect(toPrefixTsQuery('voice clon')).toBe('voice:* & clon:*');
  });

  it('strips tsquery syntax so user input cannot break the query', () => {
    expect(toPrefixTsQuery("IRS & (call) | !refund's:*")).toBe('irs:* & call:* & refund:* & s:*');
  });

  it('keeps non-Latin letters and digits', () => {
    expect(toPrefixTsQuery('Schockanruf 2026 Énergie')).toBe('schockanruf:* & 2026:* & énergie:*');
  });

  it('returns null when nothing searchable was typed', () => {
    expect(toPrefixTsQuery('  --- ')).toBeNull();
  });

  it('caps the number of terms', () => {
    expect(toPrefixTsQuery('a b c d e f g h i j')!.split(' & ')).toHaveLength(8);
  });
});

describe('SCAM_COLUMNS', () => {
  it('never ships the search_vector tsvector to clients', () => {
    expect(SCAM_COLUMNS).not.toContain('search_vector');
  });
});
