import { useState } from 'react';
import { NotoriousCoverArt } from './NotoriousCoverArt';
import { coverImageSrc, coverImageSrcSet, COVER_SIZES } from '../utils/coverImage';

interface CoverImageProps {
  src: string;
  alt: string;
  slug: string;
  className?: string;
  position?: number;
  /** Above-the-fold hero images (article detail pages) should load eagerly and at high priority. */
  priority?: boolean;
  /** Grid thumbnails are a fixed card width; a full-width hero image needs a wider hint. */
  sizes?: string;
}

// Wraps every external (mostly Wikimedia-hosted) cover photo on the site.
// Three problems this fixes over a plain <img>: a card only ever requests
// the resolution it can actually show (coverImageSrc/srcSet resize through
// Wikimedia's own thumbnail pipeline instead of downloading the full
// archive-size original), grid thumbnails no longer all fetch at once
// regardless of viewport (loading="lazy" lets the browser stagger/skip
// off-screen requests), and a slow or dead source URL no longer leaves a
// permanent blank box — it swaps to the same abstract placeholder already
// used for articles with no cover_image.
export function CoverImage({
  src,
  alt,
  slug,
  className,
  position = 50,
  priority = false,
  sizes = COVER_SIZES,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <NotoriousCoverArt slug={slug} className={className} />;
  }

  return (
    <img
      src={coverImageSrc(src, 500)}
      srcSet={coverImageSrcSet(src)}
      sizes={sizes}
      alt={alt}
      className={className}
      style={{ objectPosition: `50% ${position}%` }}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // @ts-expect-error -- fetchPriority isn't in the TS DOM lib yet, but is supported by all major browsers.
      fetchpriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
    />
  );
}
