import { useEffect, useRef, useState } from 'react';

// Returns a ref to put on the element that should trigger onReach when it
// scrolls near the viewport — the boundary between what is loaded and what is
// not.
//
// The observed node is held in state, not a ref object, so the effect re-runs
// whenever the element changes. With a plain ref it does not: when the first
// page and the total arrive together the trigger moves from one element to
// another, the observer stays attached to the one that was just unmounted, and
// nothing ever loads again.
export function useInfiniteScroll(onReach: () => void, enabled: boolean) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  // Keeps a changed callback from tearing down and rebuilding the observer.
  const handler = useRef(onReach);
  handler.current = onReach;

  useEffect(() => {
    if (!node || !enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handler.current();
      },
      // Deliberately generous: fetching only at the edge means the reader
      // reaches the end before the next page arrives and the scroll stops.
      { rootMargin: '1500px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, enabled]);

  return setNode;
}
