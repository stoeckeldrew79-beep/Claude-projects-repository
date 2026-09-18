// Finds a real, rights-cleared photograph on Wikimedia Commons for a scam
// profile, and refuses to return anything whose licence it has not actually
// read off the file page.
//
// Why this exists: every entry the generator writes used to arrive with no
// coverImage at all, so the site fell back to the generated abstract art.
// That art was never meant to be the normal case - it is the placeholder for
// "no rights-cleared photo exists" - but because nothing ever set a photo, the
// placeholder became the default, and the newest profiles (which sort first)
// were the ones showing it.
//
// The honesty rule this module enforces: for an obscure fraudster there is
// usually no free photo OF THEM, and inventing one is not an option. What
// does exist is a free photo of the place or the thing the case turns on -
// the courthouse that tried it, the port the containers never sat in, the
// city the firm operated from. Those are real photographs, relevant to the
// case, and legal to publish. To stop a reader mistaking a courthouse for a
// portrait, every photo this module returns carries a caption saying what the
// photo actually shows, which the profile renders under the image.

const API = 'https://commons.wikimedia.org/w/api.php';

// Commons asks automated clients to identify themselves; unidentified traffic
// gets throttled first when the API is under load.
const UA = 'ScamShieldNational/1.0 (scam-awareness database; contact: via repository)';

const TIMEOUT_MS = 20000;

// Licence short-names that permit commercial republication with attribution.
// Anything not on this list - "fair use", CC BY-NC, GFDL-only, no licence
// tag at all - is rejected rather than guessed at.
const ALLOWED = [
  /^public domain$/i,
  /^pd\b/i,
  /^cc0$/i,
  /^cc by(?!-nc)(-sa)?\s*[\d.]*$/i,
];

export interface CommonsPhoto {
  /** Ready to store in SeedArticle.coverImage. */
  url: string;
  /** Ready to store in SeedArticle.coverImageCredit. */
  credit: string;
  title: string;
  license: string;
}

interface SearchOptions {
  /** What the photo actually depicts, e.g. "The federal courthouse in Salt Lake City". */
  caption: string;
}

// Commons rate-limits hard, and a backfill run is hundreds of calls in a row.
// Without pacing, a run gets a handful of photos and then several hundred
// 429s - which this module would dutifully report as "no free photo exists"
// for every remaining case, quietly turning a throttle into a wrong answer.
// So: one request at a time, a gap between them, and a real retry on 429.
const MIN_GAP_MS = 350;
const MAX_ATTEMPTS = 5;

let chain: Promise<unknown> = Promise.resolve();
let lastCall = 0;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Serialises every call through one queue so concurrency can't outpace the gap. */
function queued<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const wait = MIN_GAP_MS - (Date.now() - lastCall);
    if (wait > 0) await sleep(wait);
    try {
      return await fn();
    } finally {
      lastCall = Date.now();
    }
  });
  // Keep the chain alive even when this call rejects, or one failure would
  // poison every request queued behind it.
  chain = run.catch(() => undefined);
  return run;
}

async function api(params: Record<string, string>): Promise<any> {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`;

  return queued(async () => {
    let delay = 1000;

    for (let attempt = 1; ; attempt++) {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA },
        // Node's fetch has NO default timeout. Without this an unresponsive
        // endpoint hangs the whole generator run indefinitely rather than
        // failing the one photo lookup - the same failure mode that once left
        // the state AG scan stuck on a single slow feed.
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (res.ok) return res.json();

      // 429 (throttled) and 5xx (transient) are worth waiting out. Anything
      // else is a real error and retrying it just wastes the rate budget.
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= MAX_ATTEMPTS) {
        throw new Error(`Commons API ${res.status}`);
      }

      // Honour Retry-After when the server sends one; it knows better than
      // our backoff curve does.
      const header = Number(res.headers.get('retry-after'));
      const wait = Number.isFinite(header) && header > 0 ? header * 1000 : delay;
      await sleep(wait);
      delay = Math.min(delay * 2, 30000);
    }
  });
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reads the licence off one file's page and returns it only if it is free.
 * Returns null for anything unverifiable - a missing file, a missing licence
 * tag, or a non-commercial licence.
 */
export async function verifyFile(title: string, caption: string): Promise<CommonsPhoto | null> {
  const data = await api({
    action: 'query',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size|mime',
    titles: title,
  });

  const pages = data?.query?.pages ?? {};
  const page: any = Object.values(pages)[0];
  if (!page || page.missing !== undefined) return null;

  const info = page.imageinfo?.[0];
  if (!info) return null;

  // Photographs only. An SVG diagram or a PDF is not what a cover slot wants,
  // and animated files make for a poor 224px-tall crop.
  if (!/^image\/(jpeg|png|webp)$/.test(info.mime ?? '')) return null;

  // A cover renders 1200px wide; upscaling a thumbnail looks worse than the
  // placeholder it would replace.
  if ((info.width ?? 0) < 800) return null;

  const meta = info.extmetadata ?? {};
  const license: string = stripHtml(meta.LicenseShortName?.value ?? '');
  if (!license) return null;
  if (!ALLOWED.some((re) => re.test(license))) return null;

  // Commons' Artist field is free text some contributors pad with a
  // parenthetical contact notice ("if there is an issue with this image,
  // contact me using...") that has nothing to do with the name and no
  // length limit of its own - it once pushed a credit past the articles
  // table's 255-char cover_image_credit column and broke the seed. Stripped
  // here rather than trusted, since the failure mode is silent until seed.
  const artist = stripHtml(meta.Artist?.value ?? '').replace(/\s*\([^)]*\)\s*$/, '').trim();

  // Public-domain files legally need no credit; CC-BY ones do. Keeping the
  // caption on both is a readability choice, not a licence one - it is what
  // stops a photo of a courthouse reading as a photo of the defendant.
  const isPd = /^(public domain|pd\b|cc0)/i.test(license);
  const attribution = isPd
    ? artist
      ? `Photo: ${artist} (public domain)`
      : 'Photo: public domain'
    : `Photo: ${artist || 'Wikimedia Commons'} (${license})`;

  const file = title.replace(/^File:/, '').replace(/ /g, '_');

  // Hard safety net on top of the artist-field cleanup above: whatever the
  // caption plus attribution come to, this can never exceed the DB column
  // that stores it, no matter what Commons metadata throws at it next.
  const MAX_CREDIT_LENGTH = 255;
  let credit = `${caption}. ${attribution}`;
  if (credit.length > MAX_CREDIT_LENGTH) {
    credit = `${credit.slice(0, MAX_CREDIT_LENGTH - 1)}…`;
  }

  return {
    // Special:FilePath with a width serves a resized copy from Commons' own
    // thumbnail pipeline, so a 40MP archive scan does not ship to the browser.
    url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`,
    credit,
    title,
    license,
  };
}

/**
 * Searches Commons for a photo matching `query` and returns the first result
 * whose licence verifies as free. Returns null when nothing suitable exists,
 * which is a normal outcome and must leave the entry's coverImage unset.
 */
export async function findPhoto(query: string, { caption }: SearchOptions): Promise<CommonsPhoto | null> {
  let results: any[];
  try {
    const data = await api({
      action: 'query',
      list: 'search',
      srsearch: `${query} filetype:bitmap`,
      srnamespace: '6',
      srlimit: '12',
    });
    results = data?.query?.search ?? [];
  } catch (err) {
    console.log(`  commons search failed for "${query}": ${(err as Error).message}`);
    return null;
  }

  for (const hit of results) {
    try {
      const photo = await verifyFile(hit.title, caption);
      if (photo) return photo;
    } catch {
      // One unreadable file must not abandon the remaining candidates.
    }
  }
  return null;
}
