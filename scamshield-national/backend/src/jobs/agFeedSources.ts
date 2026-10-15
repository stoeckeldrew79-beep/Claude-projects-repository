// One first-party source per state Attorney General office: the office's
// own publication, read directly, so a state page shows what the AG actually
// published rather than news coverage about it.
//
// Every entry was fetched and checked to return real, current releases
// before being added. Offices are wildly inconsistent, so there are three
// shapes:
//   rss  — an RSS/Atom feed
//   wp   — a WordPress REST endpoint (/wp-json/wp/v2/posts), which often
//          still answers when the HTML is behind a bot wall
//   html — the office's server-rendered press-release listing page;
//          linkPattern matches the PATH of individual release URLs on it
//   custom — a one-off format with its own parser (IN, KY, MD, MI, MN, OK, SD, WI)
//
// Watch for "Comments on: ..." feeds: WordPress serves a comments feed at
// <page>/feed/, which is valid RSS with zero releases in it. AR, ID, MO and
// MS were configured that way for months, silently producing nothing.
//
// No entry yet, so news search only:
//   KS, MA, NH — the whole domain returns 403 to cloud/datacenter networks
//        (Akamai or equivalent), feeds and APIs included.
//   NC — ncdoj.gov answers server-side (Node) requests with a 202 bot
//        challenge, though curl gets through; revisit with a different client.
//   WY — the office publishes ~2 releases a year, as Google Drive PDFs.
//
// A state with no entry falls back to news search only (scanStateAgNews.ts),
// and ag_feed_status records every attempt so a source that breaks shows up
// in monitoring instead of going quietly stale.

import {
  FeedItem,
  parseIndianaLocalist,
  parseKentuckyActivity,
  parseMarylandSharePoint,
  parseMichiganSearch,
  parseMinnesotaIndex,
  parseOklahomaListing,
  parseSouthDakotaTable,
  parseWisconsinList,
} from './agFeedParse';

export type AgSource =
  | { type: 'rss'; url: string }
  | { type: 'wp'; url: string }
  | { type: 'html'; url: string; linkPattern: RegExp }
  // A one-off format, parsed by the given function.
  | { type: 'custom'; url: string; parse: (body: string) => FeedItem[]; headers?: Record<string, string> };

const day = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

export const AG_SOURCES: Partial<Record<string, AgSource>> = {
  // --- RSS/Atom feeds ---
  AL: { type: 'rss', url: 'https://www.alabamaag.gov/feed/' },
  AR: { type: 'rss', url: 'https://arkansasag.gov/feed/?post_type=news-release' },
  CA: { type: 'rss', url: 'https://oag.ca.gov/taxonomy/term/948/feed' },
  CO: { type: 'rss', url: 'https://coag.gov/category/press-releases/feed/' },
  DE: { type: 'rss', url: 'https://news.delaware.gov/category/justice/prs/fraud/feed/' },
  HI: { type: 'rss', url: 'https://cca.hawaii.gov/feed/' },
  ID: { type: 'rss', url: 'https://www.ag.idaho.gov/feed/' },
  MO: { type: 'rss', url: 'https://ago.mo.gov/feed/' },
  MS: { type: 'rss', url: 'https://attorneygenerallynnfitch.com/feed/' },
  // The site's HTML and REST API are behind a bot wall; its feed is not.
  MT: { type: 'rss', url: 'https://dojmt.gov/feed/' },
  // Some item links sit at the site root rather than under /news/.
  NE: { type: 'rss', url: 'https://ago.nebraska.gov/rss.xml' },
  ND: { type: 'rss', url: 'https://attorneygeneral.nd.gov/feed/' },
  NJ: { type: 'rss', url: 'https://www.njoag.gov/feed/' },
  // Releases are a custom post type; the plain /feed/ is empty.
  NM: { type: 'rss', url: 'https://nmdoj.gov/feed/?post_type=press-release' },
  OR: { type: 'rss', url: 'https://www.doj.state.or.us/feed/' },
  PA: { type: 'rss', url: 'https://www.attorneygeneral.gov/taking-action/feed/' },
  RI: { type: 'rss', url: 'https://riag.ri.gov/press-releases.xml' },
  UT: { type: 'rss', url: 'https://attorneygeneral.utah.gov/feed/' },
  VT: { type: 'rss', url: 'https://ago.vermont.gov/taxonomy/term/9/feed' },
  WV: { type: 'rss', url: 'https://ago.wv.gov/rss.xml' },

  // --- Press-release listing pages ---
  AK: { type: 'html', url: 'https://law.alaska.gov/department/civil/consumer/cp-headlines-archive.html', linkPattern: /^\/press\/releases\/\d{4}\// },
  AZ: { type: 'html', url: 'https://www.azag.gov/media/press-releases', linkPattern: /^\/press-release\/[^/]+/ },
  CT: { type: 'html', url: 'https://portal.ct.gov/ag/press-releases', linkPattern: /^\/ag\/press-releases\/\d{4}-press-releases\/[^/]+/ },
  DC: { type: 'html', url: 'https://oag.dc.gov/newsroom', linkPattern: /^\/release\/[^/]+/ },
  // The AG's releases live on law.georgia.gov (consumer.georgia.gov is a different office).
  GA: { type: 'html', url: 'https://law.georgia.gov/press-releases', linkPattern: /^\/press-releases\/\d{4}-\d{2}-\d{2}\/[^/]+$/ },
  FL: { type: 'html', url: 'https://www.myfloridalegal.com/newsrelease', linkPattern: /^\/newsrelease\/[^/]+/ },
  IA: { type: 'html', url: 'https://www.iowaattorneygeneral.gov/newsroom', linkPattern: /^\/newsroom\/[^/]+/ },
  IL: { type: 'html', url: 'https://illinoisattorneygeneral.gov/news-room/', linkPattern: /^\/news\/story\/[^/]+/ },
  LA: { type: 'html', url: 'https://ag.louisiana.gov/News', linkPattern: /^\/Article\/[^/]+/i },
  ME: { type: 'html', url: 'https://www.maine.gov/ag/news-and-library/press-releases', linkPattern: /^\/ag\/news-and-library\/press-releases\/(?!archive$)[^/?#]+$/ },
  NV: { type: 'html', url: 'https://ag.nv.gov/News/Press_Releases/', linkPattern: /^\/News\/PR\/\d{4}\/[^/]+/ },
  NY: { type: 'html', url: 'https://ag.ny.gov/press-releases', linkPattern: /^\/press-release\/\d{4}\/[^/]+/ },
  OH: { type: 'html', url: 'https://www.ohioattorneygeneral.gov/Media/News-Releases', linkPattern: /^\/Media\/News-Releases\/[A-Za-z]+-\d{4}\/[^/]+/ },
  // The old feed (taxonomy/term/671) stopped updating in 2023.
  SC: { type: 'html', url: 'https://www.scag.gov/about-the-office/news/', linkPattern: /^\/about-the-office\/news\/[a-z0-9-]+\/$/ },
  TN: { type: 'html', url: 'https://www.tn.gov/attorneygeneral/news.html', linkPattern: /^\/attorneygeneral\/news\/\d{4}\/\d{1,2}\/\d{1,2}\/[a-z0-9-]+\.html$/ },
  TX: { type: 'html', url: 'https://www.texasattorneygeneral.gov/news/releases', linkPattern: /^\/news\/releases\/[^/]+/ },
  VA: { type: 'html', url: 'https://www.oag.state.va.us/media-center/news-releases', linkPattern: /^\/media-center\/news-releases\/[^/]+/ },
  WA: { type: 'html', url: 'https://www.atg.wa.gov/news/news-releases', linkPattern: /^\/news\/news-releases\/[^/]+/ },

  // --- One-off formats ---
  // The year is in the file name; roll it over in January.
  MN: { type: 'custom', url: `https://www.ag.state.mn.us/Office/Communications/_Scripts/pr${new Date().getUTCFullYear()}.js`, parse: parseMinnesotaIndex },
  SD: { type: 'custom', url: 'https://atg.sd.gov/OurOffice/Media/pressreleases.aspx', parse: parseSouthDakotaTable },
  WI: { type: 'custom', url: 'https://www.wisdoj.gov/Pages/AboutUs/press-releases.aspx', parse: parseWisconsinList },
  // A rolling window: Localist's days=-N parameter returns almost nothing.
  IN: { type: 'custom', url: `https://events.in.gov/api/2/events?type=35642400191644&start=${day(-60)}&end=${day(1)}&pp=50`, parse: parseIndianaLocalist },
  // The agency key is still the previous AG's name; the current one returns 400.
  KY: { type: 'custom', url: 'https://newsroom.ky.gov/_layouts/15/Fwk.Webparts.Agency.Ui/ActivityStream/GetActivities.ashx?PageIndex=0&Agencies=Attorney+General+Daniel+Cameron&SearchText=&Category=&ShowDateAsHeader=true', parse: parseKentuckyActivity },
  MD: {
    type: 'custom',
    url: "https://oag.maryland.gov/News/_api/web/lists/getbytitle('Pages')/items?$top=20&$orderby=DisplayDate%20desc&$select=Title,FileLeafRef,DisplayDate",
    parse: parseMarylandSharePoint,
    headers: { Accept: 'application/json;odata=verbose' },
  },
  MI: {
    type: 'custom',
    url: 'https://www.michigan.gov/ag/sxa/search/results/?s=%7B62E9FB6A-7717-4EF1-832C-E5ECBB9BB2D9%7D&itemid=%7B762D5C29-DD27-4FE6-B9FF-4883E753B8C9%7D&v=%7BB7A22BE8-17FC-44A5-83BC-F54442A57941%7D&p=20&o=Article%20Date%2CDescending',
    parse: parseMichiganSearch,
  },
  OK: { type: 'custom', url: 'https://oklahoma.gov/content/sok-wcm/en/oag/news/newsroom/jcr:content/responsivegrid-second/newslisting.json', parse: parseOklahomaListing },
};

// Listing pages can carry hundreds of links (Illinois lists its whole
// archive). Only the newest are worth checking each run; older ones were
// either already saved or are not news.
export const MAX_ITEMS_PER_SOURCE = 40;
