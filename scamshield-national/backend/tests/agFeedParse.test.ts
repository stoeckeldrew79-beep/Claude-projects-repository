import {
  canonicalUrl,
  cleanText,
  dateFromReleasePage,
  dateFromUrl,
  extractHtmlReleases,
  headlineSimilarity,
  isNearDuplicate,
  parseFeed,
  parseKentuckyActivity,
  parseMarylandSharePoint,
  parseMichiganSearch,
  parseMinnesotaIndex,
  parseSouthDakotaTable,
  parseWisconsinList,
} from '../src/jobs/agFeedParse';
import { AG_SOURCES } from '../src/jobs/agFeedSources';

describe('near-duplicate headlines', () => {
  // The real Florida case: six outlets, one hurricane story.
  const florida = [
    'Florida attorney general warns of price gouging, repair scams after Hurricane Isaias',
    'Florida officials warn of price gouging, repair scams after Hurricane Isaias',
    'Florida Attorney General warns against price gouging during Hurricane Isaias',
    'Florida Price Gouging Hotline Activated Ahead Of Hurricane Isaias',
    'Florida Attorney General Issues Warnings Against Looting And Price Gouging Ahead Of Hurricane Isaias',
    'Florida price gouging hotline active as Hurricane Isaias approaches',
  ];

  test('rewordings of one story collapse to one (each checked against every wording seen so far)', () => {
    const seen: string[] = [];
    const kept: string[] = [];
    for (const h of florida) {
      if (!seen.some((k) => isNearDuplicate(k, h))) kept.push(h);
      seen.push(h);
    }
    expect(kept).toEqual([florida[0]]);
  });

  test('different stories from the same office stay separate', () => {
    expect(isNearDuplicate(florida[0], 'Attorney General Uthmeier Sues Robocall Company for Deceptive Calls')).toBe(false);
    expect(
      isNearDuplicate(
        'Attorney General Uthmeier Sues Robocall Company for Deceptive Calls',
        'Attorney General Uthmeier warns seniors about grandparent scam calls'
      )
    ).toBe(false);
  });

  test('AG boilerplate alone does not make two releases the same story', () => {
    expect(
      headlineSimilarity(
        'Attorney General Announces Settlement With Acme Roofing',
        'Attorney General Announces Settlement With Zenith Solar'
      )
    ).toBeLessThan(0.7);
  });
});

describe('feeds', () => {
  test('parses RSS items, decoding entities and dates', () => {
    const xml = `<?xml version="1.0"?><rss><channel><title>AG</title>
      <item><title>AG Warns of &amp;quot;Toll&amp;quot; Text Scam</title><link>https://ag.example.gov/a?utm_source=rss</link><pubDate>Wed, 14 Oct 2026 10:00:00 GMT</pubDate></item>
      <item><title>Second</title><link>https://ag.example.gov/b</link></item>
    </channel></rss>`;
    const items = parseFeed(xml);
    expect(items).toHaveLength(2);
    expect(items[0].title).toBe('AG Warns of "Toll" Text Scam');
    expect(items[0].publishedAt?.toISOString()).toBe('2026-10-14T10:00:00.000Z');
    expect(items[1].publishedAt).toBeNull();
  });

  test('parses Atom entries with link href', () => {
    const xml = `<feed><entry><title>Atom item</title><link href="https://ag.example.gov/x"/><updated>2026-10-01T00:00:00Z</updated></entry></feed>`;
    expect(parseFeed(xml)).toEqual([
      { title: 'Atom item', url: 'https://ag.example.gov/x', publishedAt: new Date('2026-10-01T00:00:00Z') },
    ]);
  });

  test('a WordPress comments feed yields no releases (the AR/ID/MO/MS bug)', () => {
    const xml = `<rss><channel><title>Comments on: Press Releases</title></channel></rss>`;
    expect(parseFeed(xml)).toEqual([]);
  });
});

describe('HTML listing pages', () => {
  test('extracts same-host release links matching the pattern, with nearby dates', () => {
    const html = `
      <a href="/about">About the office of the attorney general</a>
      <div><span>October 14, 2026</span><a href="/newsrelease/ag-warns-toll-scam">Attorney General Warns of Toll Text Scam</a></div>
      <div><a href="/newsrelease/ag-sues-roofer">Attorney General Sues Storm Chasing Roofer</a><p>Oct 9, 2026</p></div>
      <a href="https://evil.example.com/newsrelease/x">Attorney General Warns Something Elsewhere</a>
      <a href="/newsrelease/ag-sues-roofer">Read more</a>`;
    const items = extractHtmlReleases(html, 'https://www.myfloridalegal.com/newsrelease', /^\/newsrelease\/[^/]+/);
    expect(items.map((i) => [i.title, i.publishedAt?.toISOString().slice(0, 10)])).toEqual([
      ['Attorney General Warns of Toll Text Scam', '2026-10-14'],
      ['Attorney General Sues Storm Chasing Roofer', '2026-10-09'],
    ]);
  });

  test('a date inside the link text is used and stripped from the headline', () => {
    const html = `<a href="/news/story/x">October 14, 2026 ATTORNEY GENERAL RAOUL HALTS PLANT OPERATIONS</a>`;
    const [item] = extractHtmlReleases(html, 'https://illinoisattorneygeneral.gov/news-room/', /^\/news\/story\//);
    expect(item.title).toBe('ATTORNEY GENERAL RAOUL HALTS PLANT OPERATIONS');
    expect(item.publishedAt?.toISOString().slice(0, 10)).toBe('2026-10-14');
  });

  test('matches on path plus query string', () => {
    const html = `<a href='pressreleasesdetail.aspx?id=3174'>Attorney General Jackley Issues Official Opinion</a>`;
    const items = extractHtmlReleases(html, 'https://atg.sd.gov/OurOffice/Media/pressreleases.aspx', /pressreleasesdetail\.aspx\?id=\d+$/);
    expect(items[0].url).toBe('https://atg.sd.gov/OurOffice/Media/pressreleasesdetail.aspx?id=3174');
  });

  test('strips soft hyphens (Texas)', () => {
    expect(cleanText('Attor&shy;ney Gen­eral Pax­ton')).toBe('Attorney General Paxton');
  });
});

describe('dates and URLs', () => {
  test('dateFromUrl', () => {
    expect(dateFromUrl('https://ago.vermont.gov/blog/2026/10/14/slug')?.toISOString().slice(0, 10)).toBe('2026-10-14');
    expect(dateFromUrl('https://law.georgia.gov/press-releases/2026-10-09/slug')?.toISOString().slice(0, 10)).toBe('2026-10-09');
    expect(dateFromUrl('https://ag.example.gov/news/slug')).toBeNull();
  });

  test('dateFromReleasePage prefers metadata, then visible text', () => {
    expect(dateFromReleasePage('<meta property="article:published_time" content="2026-10-12T15:00:00Z">')?.toISOString()).toBe('2026-10-12T15:00:00.000Z');
    expect(dateFromReleasePage('<main><p>RICHMOND (October 3, 2026) — The Attorney General...</p></main>')?.toISOString().slice(0, 10)).toBe('2026-10-03');
    expect(dateFromReleasePage('<main>No date here</main>')).toBeNull();
  });

  test('canonicalUrl strips tracking parameters only', () => {
    expect(canonicalUrl('https://ncdoj.gov/a/?utm_source=rss&utm_medium=rss')).toBe('https://ncdoj.gov/a/');
    expect(canonicalUrl('https://atg.sd.gov/d.aspx?id=3174&utm_campaign=x')).toBe('https://atg.sd.gov/d.aspx?id=3174');
  });
});

describe('one-off state formats', () => {
  test('Minnesota JS index', () => {
    const body = `var pr2026 = [{date:'October 13, 2026', file:'2026/10/13_PUC.asp', title:'Ellison warns of \\'utility\\' scam', lede:'x'}];`;
    expect(parseMinnesotaIndex(body)).toEqual([
      { title: "Ellison warns of 'utility' scam", url: 'https://www.ag.state.mn.us/Office/Communications/2026/10/13_PUC.asp', publishedAt: new Date('October 13, 2026') },
    ]);
  });

  test('South Dakota table', () => {
    const html = `<tr><td class='date'>10 13, 2026</td><td><h2>Jackley Warns of Scam </h2><p><a href='pressreleasesdetail.aspx?id=3174'>Read More</a></p></td></tr>`;
    const [item] = parseSouthDakotaTable(html);
    expect(item.title).toBe('Jackley Warns of Scam');
    expect(item.publishedAt?.toISOString().slice(0, 10)).toBe('2026-10-13');
  });

  test('Wisconsin embedded SharePoint list uses the release date, not modified', () => {
    const html = `WPQ1ListData = { "Row" : [{"Title": "DOJ Warns \\u2019Scam\\u2019", "Link": "https:\\u002f\\u002fwww.wisdoj.gov\\u002fPR\\u002fa.pdf", "Date.": "2026-10-09T05:00:00Z"}], "FirstRow": 1 }`;
    expect(parseWisconsinList(html)).toEqual([
      { title: 'DOJ Warns ’Scam’', url: 'https://www.wisdoj.gov/PR/a.pdf', publishedAt: new Date('2026-10-09T05:00:00Z') },
    ]);
  });

  test('Kentucky activity stream', () => {
    const body = JSON.stringify({ Results: [{ Items: [{ Title: 'Coleman Warns of Scam', LinkUrl: '/Pages/Activity-stream.aspx?prId=1', PublishDate: '/Date(1760400000000)/' }] }] });
    expect(parseKentuckyActivity(body)[0]).toEqual({ title: 'Coleman Warns of Scam', url: 'https://kentucky.gov/Pages/Activity-stream.aspx?prId=1', publishedAt: new Date(1760400000000) });
  });

  test('Maryland SharePoint REST, URL-encoding file names', () => {
    const body = JSON.stringify({ d: { results: [{ Title: 'Agent Pleads Guilty', FileLeafRef: 'Agent-Stole-$100,000.aspx', DisplayDate: '2026-10-09T00:00:00Z' }] } });
    expect(parseMarylandSharePoint(body)[0].url).toBe('https://oag.maryland.gov/News/Pages/Agent-Stole-%24100%2C000.aspx');
  });

  test('Michigan Sitecore search', () => {
    const body = JSON.stringify({ Results: [{ Url: '/ag/news/press-releases/2026/10/14/slug', Html: '<a class="content-title-link" href="#">AG Nessel Warns of Scam</a>' }] });
    expect(parseMichiganSearch(body)[0]).toEqual({ title: 'AG Nessel Warns of Scam', url: 'https://www.michigan.gov/ag/news/press-releases/2026/10/14/slug', publishedAt: new Date('2026-10-14T12:00:00Z') });
  });

  test('bad input never throws', () => {
    for (const fn of [parseKentuckyActivity, parseMarylandSharePoint, parseMichiganSearch, parseWisconsinList, parseMinnesotaIndex, parseSouthDakotaTable]) {
      expect(fn('<html>not json</html>')).toEqual([]);
    }
  });
});

test('sources cover 46 states, each with a valid URL', () => {
  const states = Object.keys(AG_SOURCES);
  expect(states).toHaveLength(46);
  for (const s of states) expect(() => new URL(AG_SOURCES[s]!.url)).not.toThrow();
});
