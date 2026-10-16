import { clusterStories, dojOfficeFromUrl, fraudTheme, themeCounts } from '../src/jobs/newsCluster';

const day = (d: number) => `2026-10-${String(d).padStart(2, '0')}T12:00:00Z`;
const doj = (slug: string) => `https://www.justice.gov/${slug}`;

// The real fan-out from the production federal feed, 14 Oct 2026, mixed with
// the unrelated releases that sat around it.
const FEED = [
  { headline: 'Maryland Man Indicted on Tax Charges in Connection With DOJ National Tax Fraud Enforcement Surge', source_url: doj('usao-md/pr/maryland-man-indicted'), published_at: day(14) },
  { headline: 'District of Minnesota Joins DOJ’s Fraud Division, IRS, and IRS-CI to Expose More than $490M in Tax Fraud in National Tax Enforcement Surge', source_url: doj('usao-mn/pr/district-minnesota-joins'), published_at: day(14) },
  // Scores 0.69 against Minnesota's wording - just under the threshold - but
  // matches Maine's and the original, so it must still land in the cluster.
  { headline: "Zachary A. Keller and the U.S. Attorney's Office for the Western District of Louisiana join DOJ Fraud Division, IRS, and IRS-CI in National Tax Enforcement Surge Exposing $490M in Tax Fraud", source_url: doj('usao-wdla/pr/keller-joins'), published_at: day(14) },
  { headline: 'The District of Maine Joins DOJ Fraud Division, IRS, and IRS-CI in National Tax Enforcement Surge Exposing $490M in Tax Fraud', source_url: doj('usao-me/pr/district-maine-joins'), published_at: day(14) },
  { headline: 'DOJ’s Fraud Division, IRS, and IRS-CI Expose More than $490M in Tax Fraud in National Tax Enforcement Surge', source_url: doj('opa/pr/dojs-fraud-division-irs'), published_at: day(14) },
  { headline: 'Eastern District of Texas joins DOJ Fraud Division, IRS, and IRS-CI in National Tax Enforcement Surge exposing over $490M in tax fraud', source_url: doj('usao-edtx/pr/eastern-district-texas-joins'), published_at: day(14) },
  { headline: 'Mexican Citizens Charged in a Fraudulent Tax Scheme', source_url: doj('opa/pr/mexican-citizens-charged'), published_at: day(14) },
  { headline: 'Schoharie County Woman Sentenced for $200,000 Fraud', source_url: doj('usao-ndny/pr/schoharie'), published_at: day(9) },
  { headline: 'Jury Convicts Lake City Woman in $2.9 Million Fraud Case', source_url: doj('usao-mdfl/pr/lake-city'), published_at: day(9) },
  { headline: 'North Hollywood Man Sentenced to Over 5 Years in Federal Prison for COVID-19 Fraud', source_url: doj('usao-cdca/pr/north-hollywood'), published_at: day(9) },
];

describe('clusterStories', () => {
  const clusters = clusterStories(FEED);

  test('one national action republished by each office becomes one story', () => {
    const surge = clusters.find((c) => c.lead.headline.startsWith('DOJ’s Fraud Division'));
    expect(surge).toBeDefined();
    expect(surge!.related.map((r) => r.source_url).sort()).toEqual(
      [
        doj('usao-mn/pr/district-minnesota-joins'),
        doj('usao-wdla/pr/keller-joins'),
        doj('usao-me/pr/district-maine-joins'),
        doj('usao-edtx/pr/eastern-district-texas-joins'),
      ].sort()
    );
  });

  test('the Main Justice original leads its cluster', () => {
    const surge = clusters.find((c) => c.related.length > 0)!;
    expect(surge.lead.source_url).toContain('/opa/');
  });

  test('distinct cases stay separate, even when they share words', () => {
    // A separate case charged under the same surge is its own story.
    expect(clusters.find((c) => c.lead.headline.startsWith('Maryland Man Indicted'))!.related).toHaveLength(0);
    expect(clusters).toHaveLength(FEED.length - 4);
  });

  test('order follows the input (newest first in, newest first out)', () => {
    expect(clusters[0].lead.headline).toMatch(/^Maryland Man Indicted/);
    expect(clusters[clusters.length - 1].lead.headline).toMatch(/^North Hollywood/);
  });

  test('an item that matches two clusters merges them', () => {
    const items = [
      { headline: 'alpha bravo charlie delta echo foxtrot golf', source_url: 'a', published_at: day(9) },
      { headline: 'hotel india juliet kilo lima mike golf', source_url: 'b', published_at: day(9) },
      { headline: 'alpha bravo charlie delta echo hotel india juliet kilo lima', source_url: 'c', published_at: day(9) },
    ];
    const out = clusterStories(items);
    expect(out).toHaveLength(1);
    expect(out[0].lead.source_url).toBe('a');
    expect(out[0].related.map((r) => r.source_url)).toEqual(['b', 'c']);
  });

  test('short generic headlines need enough shared words, not just full overlap', () => {
    const items = [
      { headline: 'Woman Sentenced for Fraud', source_url: 'a', published_at: day(9) },
      { headline: 'Springfield Woman Sentenced for Wire Fraud Scheme Targeting Seniors', source_url: 'b', published_at: day(9) },
    ];
    expect(clusterStories(items)).toHaveLength(2);
  });

  test('the same wording weeks apart is a different case', () => {
    const h = 'District of Kansas Joins DOJ Fraud Division, IRS, and IRS-CI in National Tax Enforcement Surge';
    const items = [
      { headline: h, source_url: 'a', published_at: '2026-10-14T12:00:00Z' },
      { headline: h, source_url: 'b', published_at: '2026-09-01T12:00:00Z' },
    ];
    expect(clusterStories(items)).toHaveLength(2);
  });

  test('empty input', () => {
    expect(clusterStories([])).toEqual([]);
  });
});

describe('dojOfficeFromUrl', () => {
  test.each([
    ['https://www.justice.gov/usao-mdfl/pr/x', 'Middle District of Florida'],
    ['https://www.justice.gov/usao-ndwv/pr/x', 'Northern District of West Virginia'],
    ['https://www.justice.gov/usao-vt/pr/x', 'District of Vermont'],
    ['https://www.justice.gov/opa/pr/x', 'DOJ Office of Public Affairs'],
    ['https://www.justice.gov/usao-pr/pr/x', "US Attorney's Office (PR)"],
    ['https://www.ftc.gov/news-events/news/press-releases/x', null],
  ])('%s', (url, office) => {
    expect(dojOfficeFromUrl(url)).toBe(office);
  });
});

describe('fraudTheme', () => {
  test.each([
    ['Medical Supply Company Owner Sentenced to 14 Years in Prison for $30M Medicare, TRICARE, and CHAMPVA Fraud', 'Healthcare & Medicare'],
    ['Maryland Man Facing Federal Indictment for Role in COVID-19 Healthcare Fraud Scheme Totaling More Than $100M', 'Healthcare & Medicare'],
    ['North Hollywood Man Sentenced to Over 5 Years in Federal Prison for COVID-19 Fraud', 'Pandemic relief'],
    ['Canadian Man Sentenced to Prison for Participation in “Grandparent Scam”', 'Elder & grandparent'],
    ['Mexican Citizens Charged in a Fraudulent Tax Scheme', 'Tax & IRS'],
    ['FTC Sends More than $23.8 Million to Drivers and Diners Harmed by Grubhub’s Deceptive Advertising Claims', 'Deceptive business practices'],
    ['Schoharie County Woman Sentenced for $200,000 Fraud', 'Other fraud'],
  ])('%s', (headline, theme) => {
    expect(fraudTheme(headline)).toBe(theme);
  });

  test('themeCounts sorts by count, then name', () => {
    expect(themeCounts(['tax fraud', 'irs scam', 'medicare fraud', 'woman sentenced'])).toEqual([
      { theme: 'Tax & IRS', count: 2 },
      { theme: 'Healthcare & Medicare', count: 1 },
      { theme: 'Other fraud', count: 1 },
    ]);
  });
});
