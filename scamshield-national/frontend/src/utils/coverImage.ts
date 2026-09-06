// Cover photos are stored at ?width=1200 — a sensible archive size, and about
// six times the pixels a card actually shows. Serving that to a 484px card is
// most of the wait when scrolling: the browser is downloading a full-width
// photo to paint a thumbnail.
//
// Wikimedia's Special:FilePath resizes on demand, so a narrower copy costs
// nothing but a different URL. Anything else is returned untouched — an
// unknown host may not resize, and a broken image is worse than a slow one.
export function coverImageSrc(url: string, width: number): string {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('wikimedia.org')) return url;
    if (!parsed.pathname.includes('/Special:FilePath/')) return url;
    parsed.searchParams.set('width', String(width));
    return parsed.toString();
  } catch {
    // Not a URL we can reason about; leave it alone.
    return url;
  }
}

// Two widths so the browser can pick by pixel density: the smaller for an
// ordinary screen, the larger for a retina one. Without this every display
// gets the same file and one of them is wrong.
export function coverImageSrcSet(url: string): string | undefined {
  const small = coverImageSrc(url, 500);
  const large = coverImageSrc(url, 1000);
  if (small === url && large === url) return undefined;
  return `${small} 500w, ${large} 1000w`;
}

// The card is roughly half of a 1024px container at sm and up, full width
// below it.
export const COVER_SIZES = '(min-width: 640px) 484px, calc(100vw - 2rem)';
