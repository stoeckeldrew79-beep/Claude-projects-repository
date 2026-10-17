import { isFraudRelease, officeName, stateForComponent, summarize, toFederalCase } from '../src/jobs/dojArchive';

const release = (over: Record<string, unknown> = {}) => ({
  uuid: '507fae43-85e6-45f6-aed3-94da8447f676',
  title: 'Tulsa Woman Charged With Million Dollar Cancer Treatment Scam',
  url: 'https://www.justice.gov/usao-ndok/pr/x',
  date: '1790942400',
  teaser: '',
  body: '<div><p>TULSA, Okla. — The operator of a cancer clinic was charged today with fraud.</p></div>',
  component: [{ name: 'USAO - Oklahoma, Northern' }],
  topic: [],
  ...over,
});

describe('which releases are fraud cases', () => {
  test('a fraud headline counts, with or without topic tags', () => {
    expect(isFraudRelease(release())).toBe(true);
    expect(isFraudRelease(release({ title: 'Promoter of Ponzi Scheme Sentenced' }))).toBe(true);
  });

  test('a fraud topic tag counts even when the headline has no fraud word', () => {
    expect(isFraudRelease(release({ title: 'Mannford Woman Sentenced', topic: [{ name: 'Elder Justice' }] }))).toBe(true);
  });

  test('unrelated cases and look-alikes are excluded', () => {
    expect(isFraudRelease(release({ title: 'Buffalo Man Pleads Guilty To Drug Trafficking', topic: [{ name: 'Drug Trafficking' }] }))).toBe(false);
    // Topic "Cybercrime" alone is not enough (it also covers exploitation sites).
    expect(isFraudRelease(release({ title: 'Operation leads to seizure of websites', topic: [{ name: 'Cybercrime' }] }))).toBe(false);
    expect(isFraudRelease(release({ title: 'Child pornography fraud ring charged' }))).toBe(false);
    expect(isFraudRelease(release({ title: 'MEDIA ADVISORY – Fraud News Conference' }))).toBe(false);
  });
});

describe('offices and states', () => {
  test('US Attorney components map to a state or territory', () => {
    expect(stateForComponent('USAO - Texas, Western')).toBe('TX');
    expect(stateForComponent('USAO - Montana')).toBe('MT');
    expect(stateForComponent('USAO - District of Columbia')).toBe('DC');
    expect(stateForComponent('USAO - Puerto Rico')).toBe('PR');
    expect(stateForComponent('Criminal Division')).toBeNull();
  });

  test('office names read naturally', () => {
    expect(officeName('USAO - Texas, Western')).toBe('Western District of Texas');
    expect(officeName('USAO - Montana')).toBe('District of Montana');
    expect(officeName('USAO - District of Columbia')).toBe('District of Columbia');
    expect(officeName('Criminal Division')).toBe('Criminal Division');
  });
});

describe('rows', () => {
  test('a release becomes a row with state, office, theme and a clean summary', () => {
    const row = toFederalCase(release())!;
    expect(row.state).toBe('OK');
    expect(row.office).toBe('Northern District of Oklahoma');
    expect(row.summary).toBe('The operator of a cancer clinic was charged today with fraud.');
    expect(row.published_at.toISOString()).toBe(new Date(1790942400 * 1000).toISOString());
  });

  test('a release with no date falls back to its creation time', () => {
    const row = toFederalCase(release({ date: '', created: '<time datetime="2009-01-05T14:20:07-05:00">1231183207</time>' }))!;
    expect(row.published_at.toISOString()).toBe('2009-01-05T19:20:07.000Z');
  });

  test('a release missing essentials is skipped', () => {
    expect(toFederalCase(release({ date: '' }))).toBeNull();
    expect(toFederalCase(release({ url: '' }))).toBeNull();
  });

  test('long summaries are cut at a word boundary', () => {
    const body = `<p>WASHINGTON – ${'word '.repeat(200)}</p>`;
    const s = summarize(release({ body }))!;
    expect(s.length).toBeLessThanOrEqual(401);
    expect(s.endsWith('…')).toBe(true);
    expect(s.startsWith('word')).toBe(true);
  });
});
