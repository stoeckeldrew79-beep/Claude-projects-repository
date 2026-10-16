import { SEED_GLOBAL_SOURCES, SEED_GLOBAL_STATS } from '../src/db/seed-data/global-sources';

// Seeded figures attach to their source by exact (agency_name, country). A
// typo there doesn't fail the deploy — the seed just logs a warning and the
// figure silently never appears — so it is checked here instead.
describe('SEED_GLOBAL_STATS', () => {
  const sourceKeys = new Set(SEED_GLOBAL_SOURCES.map((s) => `${s.agency_name}|${s.country}`));

  it.each(SEED_GLOBAL_STATS.map((s) => [`${s.agency_name} ${s.period_label}`, s] as const))(
    '%s attaches to a seeded source and cites an https source',
    (_label, stat) => {
      expect(sourceKeys.has(`${stat.agency_name}|${stat.country}`)).toBe(true);
      expect(stat.source_url).toMatch(/^https:\/\//);
      expect(stat.headline.length).toBeGreaterThan(20);
      if (stat.loss_amount != null) expect(stat.currency).toMatch(/^[A-Z]{3}$/);
    }
  );

  it('has no duplicate upsert keys', () => {
    const keys = SEED_GLOBAL_STATS.map((s) => `${s.agency_name}|${s.country}|${s.period_label}|${s.source_url}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
