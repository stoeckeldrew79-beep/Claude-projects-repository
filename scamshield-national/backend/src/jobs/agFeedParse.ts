// Pure parsing helpers for the state Attorney General feed engine
// (scanStateAgNews.ts). No database or network access here, so every rule
// below is unit-tested directly (tests/agFeedParse.test.ts).
import { XMLParser } from 'fast-xml-parser';

export interface FeedItem {
  title: string;
  url: string;
  publishedAt: Date | null;
}

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

function textOf(v: unknown): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (v && typeof v === 'object' && '#text' in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)['#text'] ?? '');
  }
  return '';
}

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…',
};

export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

export function cleanText(s: string): string {
  // \u00ad: soft hyphens some CMSes inject for line-breaking ("Attor\u00adney").
  return decodeEntities(s.replace(/<[^>]+>/g, ' ').replace(/&shy;/gi, ''))
    .replace(/[\u00ad\u200b]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Feed links often carry tracking parameters (?utm_source=rss...), which
// would make the same release look new on every run. They are not part of
// the release's identity, so they are stripped before deduping.
export function canonicalUrl(raw: string): string {
  try {
    const u = new URL(raw.trim());
    for (const key of [...u.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$)/i.test(key)) u.searchParams.delete(key);
    }
    u.hash = '';
    return u.toString();
  } catch {
    return raw.trim();
  }
}

export function parseDate(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  // Guard against garbage like year 1970 or far-future typos.
  const year = d.getUTCFullYear();
  return year >= 1995 && d.getTime() <= Date.now() + 2 * 86400000 ? d : null;
}

// RSS 2.0 (rss.channel.item) or Atom (feed.entry).
export function parseFeed(xml: string): FeedItem[] {
  const parsed = parser.parse(xml);
  const raw = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? parsed?.['rdf:RDF']?.item ?? [];
  const items: Record<string, unknown>[] = Array.isArray(raw) ? raw : [raw];
  const out: FeedItem[] = [];
  for (const item of items) {
    const title = cleanText(textOf(item.title));
    const linkField = item.link as unknown;
    let link = textOf(linkField);
    if (!link && Array.isArray(linkField)) {
      const alt = (linkField as Record<string, string>[]).find((l) => !l.rel || l.rel === 'alternate');
      link = alt?.href ?? '';
    } else if (!link && linkField && typeof linkField === 'object') {
      link = String((linkField as Record<string, unknown>).href ?? '');
    }
    if (!title || !link) continue;
    out.push({
      title,
      url: link.trim(),
      publishedAt: parseDate(textOf(item.pubDate ?? item.published ?? item.updated ?? item['dc:date'])),
    });
  }
  return out;
}

// WordPress REST API (/wp-json/wp/v2/posts) — works on many sites whose
// HTML is behind a bot wall.
export function parseWpJson(body: string): FeedItem[] {
  let posts: unknown;
  try {
    posts = JSON.parse(body);
  } catch {
    return [];
  }
  if (!Array.isArray(posts)) return [];
  return posts
    .map((p: Record<string, unknown>) => ({
      title: cleanText(textOf((p.title as Record<string, unknown>)?.rendered)),
      url: String(p.link ?? ''),
      publishedAt: parseDate(String(p.date_gmt ? `${p.date_gmt}Z` : p.date ?? '')),
    }))
    .filter((i) => i.title && i.url);
}

// Minnesota publishes its release index as a JavaScript file the page loads:
//   var pr2026 = [{date:'October 13, 2026', file:'2026/10/13_PUC.asp', title:'...', lede:'...'}, ...]
export function parseMinnesotaIndex(body: string): FeedItem[] {
  const out: FeedItem[] = [];
  const re = /date\s*:\s*'([^']*)'\s*,\s*file\s*:\s*'([^']*)'\s*,\s*title\s*:\s*'((?:[^'\\]|\\.)*)'/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    out.push({
      title: cleanText(m[3].replace(/\\(.)/g, '$1')),
      url: `https://www.ag.state.mn.us/Office/Communications/${m[2]}`,
      publishedAt: parseDate(m[1]),
    });
  }
  return out;
}

// Oklahoma's newsroom is an AEM component backed by a JSON listing:
//   {"totalCount":700,"items":[{"newsUrl":"/oag/news/...","title":"...","lastModified":...}]}
export function parseOklahomaListing(body: string): FeedItem[] {
  let data: { items?: Record<string, unknown>[] };
  try {
    data = JSON.parse(body);
  } catch {
    return [];
  }
  return (data.items ?? [])
    .map((i) => {
      const raw = i.lastModified ?? i.date ?? i.publishDate;
      const date = typeof raw === 'number' ? new Date(raw) : parseDate(String(raw ?? ''));
      return {
        title: cleanText(String(i.title ?? '')),
        url: new URL(String(i.newsUrl ?? ''), 'https://oklahoma.gov').toString(),
        publishedAt: date && !Number.isNaN(date.getTime()) ? date : null,
      };
    })
    .filter((i) => i.title && i.url.includes('/oag/'));
}

// South Dakota lists releases as table rows: a "10 13, 2026" date cell, an
// <h2> headline, and a "Read More" link to pressreleasesdetail.aspx?id=N.
export function parseSouthDakotaTable(html: string): FeedItem[] {
  const out: FeedItem[] = [];
  const re = /<td class=['"]date['"]>\s*(\d{1,2}) (\d{1,2}), (\d{4})\s*<\/td>[\s\S]*?<h2>([\s\S]*?)<\/h2>[\s\S]*?href=['"]([^'"]*pressreleasesdetail\.aspx\?id=\d+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    out.push({
      title: cleanText(m[4]),
      url: new URL(m[5], 'https://atg.sd.gov/OurOffice/Media/').toString(),
      publishedAt: parseDate(`${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}T12:00:00Z`),
    });
  }
  return out;
}

function safeJson<T>(body: string): T | null {
  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

// Indiana's newsroom loads its releases from the state's Localist calendar
// (events.in.gov): {"events":[{"event":{"title","localist_url","first_date"}}]}.
export function parseIndianaLocalist(body: string): FeedItem[] {
  const data = safeJson<{ events?: { event?: Record<string, unknown> }[] }>(body);
  return (data?.events ?? [])
    .map(({ event }) => ({
      title: cleanText(String(event?.title ?? '')),
      url: String(event?.localist_url ?? ''),
      publishedAt: parseDate(String(event?.first_date ?? '')),
    }))
    .filter((i) => i.title && i.url)
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
}

// Kentucky's AG news comes from the kentucky.gov activity stream:
// {"Results":[{"Items":[{"Title","LinkUrl","PublishDate":"/Date(1760400000000)/"}]}]}.
export function parseKentuckyActivity(body: string): FeedItem[] {
  const data = safeJson<{ Results?: { Items?: Record<string, unknown>[] }[] }>(body);
  const out: FeedItem[] = [];
  for (const group of data?.Results ?? []) {
    for (const item of group.Items ?? []) {
      const ms = /\/Date\((\d+)/.exec(String(item.PublishDate ?? ''))?.[1];
      const link = String(item.LinkUrl ?? '');
      if (!item.Title || !link) continue;
      out.push({
        title: cleanText(String(item.Title)),
        url: new URL(link, 'https://kentucky.gov').toString(),
        publishedAt: ms ? new Date(Number(ms)) : null,
      });
    }
  }
  return out;
}

// Maryland's news list is a SharePoint list, read through the REST call its
// own page makes: {"d":{"results":[{"Title","FileLeafRef","DisplayDate"}]}}.
export function parseMarylandSharePoint(body: string): FeedItem[] {
  const data = safeJson<{ d?: { results?: Record<string, unknown>[] }; value?: Record<string, unknown>[] }>(body);
  return (data?.d?.results ?? data?.value ?? [])
    .map((r) => ({
      title: cleanText(String(r.Title ?? '')),
      url: `https://oag.maryland.gov/News/Pages/${encodeURIComponent(String(r.FileLeafRef ?? ''))}`,
      publishedAt: parseDate(String(r.DisplayDate ?? '')),
    }))
    .filter((i) => i.title && !i.url.endsWith('/Pages/'));
}

// Michigan's press releases page calls a Sitecore search endpoint:
// {"Results":[{"Url":"/ag/news/press-releases/2026/10/14/slug","Html":"...content-title-link...>Title</a>..."}]}.
export function parseMichiganSearch(body: string): FeedItem[] {
  const data = safeJson<{ Results?: Record<string, unknown>[] }>(body);
  return (data?.Results ?? [])
    .map((r) => {
      const url = new URL(String(r.Url ?? ''), 'https://www.michigan.gov').toString();
      const html = String(r.Html ?? '');
      const title = /content-title-link[^>]*>([\s\S]*?)<\/a>/.exec(html)?.[1] ?? '';
      return { title: cleanText(title), url, publishedAt: dateFromUrl(url) };
    })
    .filter((i) => i.title && i.url.includes('/press-releases/'));
}

// Wisconsin's releases page is SharePoint; the list is embedded in the HTML
// as `WPQ1ListData = { "Row" : [ {..."Title": "...", "Link": "...",
// "Date.": "2026-10-09T05:00:00Z"...}, ... ] }`. "Date." is the release date
// (an item's modified time can be years later, so it is not used).
export function parseWisconsinList(html: string): FeedItem[] {
  const start = html.indexOf('WPQ1ListData');
  if (start === -1) return [];
  const block = html.slice(start, html.indexOf('"FirstRow"', start) > 0 ? html.indexOf('"FirstRow"', start) : start + 500000);
  const str = '"((?:[^"\\\\]|\\\\.)*)"';
  const re = new RegExp(`"Title":\\s*${str}[\\s\\S]*?"Link":\\s*${str}[\\s\\S]*?"Date\\.":\\s*${str}`, 'g');
  const unquote = (v: string) => {
    try {
      return JSON.parse(`"${v}"`) as string;
    } catch {
      return v;
    }
  };
  const out: FeedItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(block))) {
    const url = unquote(m[2]);
    if (!/^https?:/.test(url)) continue;
    out.push({ title: cleanText(unquote(m[1])), url, publishedAt: parseDate(unquote(m[3])) });
  }
  return out.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
}

const MONTHS = 'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?';
const DATE_PATTERNS = [
  new RegExp(`\\b(?:${MONTHS})\\.? \\d{1,2},? \\d{4}\\b`, 'i'),
  /\b\d{4}-\d{2}-\d{2}\b/,
  /\b\d{1,2}\/\d{1,2}\/\d{4}\b/,
];

// The first date written in a piece of text, if any.
export function findDate(text: string): { date: Date; index: number; match: string } | null {
  let best: { date: Date; index: number; match: string } | null = null;
  for (const re of DATE_PATTERNS) {
    const m = re.exec(text);
    if (!m) continue;
    const date = parseDate(m[0].replace(/(\d)(st|nd|rd|th)/, '$1'));
    if (date && (!best || m.index < best.index)) best = { date, index: m.index, match: m[0] };
  }
  return best;
}

// /2026/10/14/ or /2026-10-14 style dates inside a release URL.
export function dateFromUrl(url: string): Date | null {
  const m = /\/(20\d{2})[/-](\d{1,2})[/-](\d{1,2})(?:[/-]|$)/.exec(url);
  return m ? parseDate(`${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}T12:00:00Z`) : null;
}

// Pulls individual press releases out of an AG's server-rendered listing
// page: same-host links whose path matches the state's release pattern and
// whose text reads like a headline. A date is taken, in order of trust, from
// the link text itself, the release URL, or the closest date written next to
// the link in the page. Anything still undated is resolved later from the
// release page itself (see scanStateAgNews.ts).
export function extractHtmlReleases(html: string, pageUrl: string, linkPattern: RegExp): FeedItem[] {
  const base = new URL(pageUrl);
  const out: FeedItem[] = [];
  const seen = new Set<string>();
  const anchor = /<a\b[^>]*?href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = anchor.exec(html))) {
    let url: URL;
    try {
      url = new URL(decodeEntities(m[1]), base);
    } catch {
      continue;
    }
    if (url.hostname.replace(/^www\./, '') !== base.hostname.replace(/^www\./, '')) continue;
    // Path plus query: some offices identify releases by ?id= (South Dakota).
    if (!linkPattern.test(url.pathname + url.search)) continue;
    const href = url.toString();
    if (seen.has(href)) continue;

    let title = cleanText(m[2]);
    const inTitle = findDate(title);
    if (inTitle) title = (title.slice(0, inTitle.index) + title.slice(inTitle.index + inTitle.match.length)).replace(/^[\s|:–—-]+|[\s|:–—-]+$/g, '').trim();
    if (title.split(' ').length < 4) continue;
    seen.add(href);

    let publishedAt = inTitle?.date ?? dateFromUrl(href);
    if (!publishedAt) {
      // Nearest date in the surrounding markup, before or after the link.
      const before = cleanText(html.slice(Math.max(0, m.index - 600), m.index));
      const after = cleanText(html.slice(m.index + m[0].length, m.index + m[0].length + 600));
      const a = findDate(after);
      let b: { date: Date; index: number; match: string } | null = null;
      for (const re of DATE_PATTERNS) {
        const all = [...before.matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))];
        const last = all[all.length - 1];
        if (last) {
          const d = parseDate(last[0]);
          if (d && (!b || (last.index ?? 0) > b.index)) b = { date: d, index: last.index ?? 0, match: last[0] };
        }
      }
      const distAfter = a ? a.index : Infinity;
      const distBefore = b ? before.length - b.index : Infinity;
      publishedAt = distAfter <= distBefore ? a?.date ?? null : b?.date ?? null;
      // A date more than ~200 visible characters away probably belongs to
      // a different item; leave it for the release-page lookup instead.
      if (Math.min(distAfter, distBefore) > 200) publishedAt = null;
    }
    out.push({ title, url: href, publishedAt });
  }
  return out;
}

// Publication date from a release page: structured metadata first, then the
// first date written in the visible text.
export function dateFromReleasePage(html: string): Date | null {
  const meta =
    /<meta[^>]+(?:property|name|itemprop)=["'](?:article:published_time|datePublished|date|dc\.date|DC\.date\.issued|publish-date)["'][^>]*content=["']([^"']+)["']/i.exec(html) ??
    /<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name|itemprop)=["'](?:article:published_time|datePublished|date)["']/i.exec(html);
  const fromMeta = parseDate(meta?.[1]);
  if (fromMeta) return fromMeta;
  const ld = /"datePublished"\s*:\s*"([^"]+)"/.exec(html);
  const fromLd = parseDate(ld?.[1]);
  if (fromLd) return fromLd;
  const time = /<time[^>]+datetime=["']([^"']+)["']/i.exec(html);
  const fromTime = parseDate(time?.[1]);
  if (fromTime) return fromTime;
  const body = /<(?:main|article)\b[\s\S]*$/i.exec(html)?.[0] ?? html;
  return findDate(cleanText(body))?.date ?? null;
}

// --- Near-duplicate headlines -------------------------------------------
// The same story arrives as "Florida attorney general warns of price
// gouging, repair scams after Hurricane Isaias" and "Florida officials warn
// of price gouging, repair scams after Hurricane Isaias". Exact-match dedupe
// keeps both; token overlap catches them.

const STOPWORDS = new Set(
  ('a an and are as at be by for from has have in into is it its of on or over says said that the their this to was were will with after before about against amid during ahead new ' +
    // AG press-release boilerplate: shared by unrelated releases, so it must
    // not count toward "same story".
    'attorney general announce announces office state department justice').split(' ')
);

// Crude suffix stripping so "warns", "warning" and "warnings" match.
function stem(t: string): string {
  const m = /^(.{4,}?)(ings|ing|ed|es|s)$/.exec(t);
  return m ? m[1] : t;
}

export function headlineTokens(headline: string): Set<string> {
  return new Set(
    headline
      .toLowerCase()
      .replace(/['’]s\b/g, '')
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2 && !STOPWORDS.has(t))
      .map(stem)
  );
}

export function headlineSimilarity(a: string, b: string): number {
  const ta = headlineTokens(a);
  const tb = headlineTokens(b);
  if (!ta.size || !tb.size) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared += 1;
  // Overlap relative to the shorter headline: a short headline fully
  // contained in a longer one is the same story.
  return shared / Math.min(ta.size, tb.size);
}

export const NEAR_DUPLICATE_THRESHOLD = 0.7;

export function isNearDuplicate(a: string, b: string): boolean {
  return headlineSimilarity(a, b) >= NEAR_DUPLICATE_THRESHOLD;
}
