// Search assist for finding a real, legally-usable cover photo for an
// article. Wikimedia Commons only accepts public-domain or openly
// licensed media, so anything it returns is safe to use — but search
// relevance is noisy (PDFs, unrelated scans, etc. mixed into results),
// and a topically-close photo is a judgment call a human should confirm.
// This never assigns a photo itself — it only returns candidates for an
// admin to review and pick from (see controllers/articles.ts).
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

// Wikimedia asks bot/tool traffic to identify itself; anonymous requests
// without one are far more likely to be rate-limited.
const USER_AGENT = 'ScamShieldNational-CoverPhotoTool/1.0 (contact: stoeckeldrew79@gmail.com)';

// Namespace 6 is File: — keep to actual photos, not PDFs/SVGs/audio,
// which dominate raw Commons search results for a text query.
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export interface CommonsCandidate {
  title: string;
  thumbUrl: string;
  fullUrl: string;
  width: number | null;
  height: number | null;
  licenseShortName: string | null;
  artist: string | null;
  commonsPageUrl: string;
}

function stripHtml(value: string | undefined): string | null {
  if (!value) return null;
  const text = value.replace(/<[^>]+>/g, '').trim();
  return text || null;
}

interface CommonsApiPage {
  title: string;
  imageinfo?: Array<{
    url: string;
    thumburl?: string;
    width?: number;
    height?: number;
    descriptionurl?: string;
    extmetadata?: {
      LicenseShortName?: { value: string };
      Artist?: { value: string };
    };
  }>;
}

export async function searchCommonsImages(query: string, limit = 8): Promise<CommonsCandidate[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: trimmed,
    gsrlimit: String(Math.min(limit * 3, 30)), // over-fetch, then filter to real photos
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '600',
    format: 'json',
  });

  const res = await fetch(`${COMMONS_API}?${params.toString()}`, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (res.status === 429) {
    throw new Error('Wikimedia Commons is rate-limiting this server right now — try again shortly.');
  }
  if (!res.ok) {
    throw new Error(`Wikimedia Commons search failed (${res.status})`);
  }

  const body = (await res.json()) as { query?: { pages?: Record<string, CommonsApiPage> } };
  const pages = Object.values(body.query?.pages ?? {});

  const candidates: CommonsCandidate[] = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const lowerTitle = page.title.toLowerCase();
    if (!IMAGE_EXTENSIONS.some((ext) => lowerTitle.endsWith(ext))) continue;

    candidates.push({
      title: page.title.replace(/^File:/, ''),
      thumbUrl: info.thumburl ?? info.url,
      fullUrl: info.url,
      width: info.width ?? null,
      height: info.height ?? null,
      licenseShortName: info.extmetadata?.LicenseShortName?.value ?? null,
      artist: stripHtml(info.extmetadata?.Artist?.value),
      commonsPageUrl: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
    });
    if (candidates.length >= limit) break;
  }

  return candidates;
}
