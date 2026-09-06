import { useEffect, useRef } from 'react';

// Calls onReach when the returned ref scrolls into view. Used as a sentinel
// at the bottom of a paged list. rootMargin fires it before the element is
// actually visible, so the next page is usually already there by the time the
// reader arrives at the end.
export function useInfiniteScroll(onReach: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Keeps the observer from being torn down and rebuilt on every render just
  // because the callback identity changed.
  const handler = useRef(onReach);
  handler.current = onReach;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handler.current();
      },
      // Deliberately generous: at 400px the reader reached the end before the
      // next page arrived and the scroll stopped dead. Fetching this far ahead
      // means the next window is normally already rendered.
      { rootMargin: '1500px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}
