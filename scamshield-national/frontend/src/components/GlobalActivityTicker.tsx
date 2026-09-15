import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PAGE_SIZE, fetchScams } from '../services/scams';
import { countryName } from '../utils/countries';
import { timeAgo } from '../utils/timeAgo';

type ActivityFilter = 'all' | 'us';

const ALERT_DOT_COLORS: Record<string, string> = {
  low: 'bg-slate-400',
  medium: 'bg-yellow-400',
  high: 'bg-orange-400',
  critical: 'bg-red-500',
};

// Polls rather than streams — the backend has no websocket/SSE channel, and
// a short interval reads as "live" without needing one for a feed this size.
const REFRESH_MS = 20_000;

export function GlobalActivityTicker() {
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const country = filter === 'us' ? 'US' : undefined;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['scams', 'ticker', { sort: 'newest' as const, country }],
    queryFn: ({ pageParam }) => fetchScams({ sort: 'newest', country, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined),
    // Polling an infinite query refetches every page it holds, so it stays on
    // only while the feed is still a single page. The "live" part of this is
    // the top of the list; someone scrolled further down is reading history,
    // not watching for arrivals, and does not need 20-second round trips over
    // everything they have already loaded.
    refetchInterval: (query) => ((query.state.data?.pages.length ?? 1) > 1 ? false : REFRESH_MS),
  });

  const items = data?.pages.flat() ?? [];

  // The database holds thousands of entries — nowhere near small enough to
  // load into this little panel, and not the point of it anyway. Instead of
  // representing that true size, the panel never lets its own scrollbar
  // thumb travel past the middle of the track: crossing the midpoint snaps
  // back to it, so scrolling always reads as "there's more below" rather
  // than counting down toward a visible end.
  //
  // Loading more is driven straight off scroll position rather than an
  // IntersectionObserver on a moving target — with the trigger row itself
  // shifting index every time a page arrives, a freshly re-observed node can
  // miss firing (proven out empirically: it stalled under rapid scrolling),
  // where checking "how close is scrollTop to the boundary" cannot miss.
  const scrollRef = useRef<HTMLDivElement>(null);
  const maybeLoadMore = () => {
    const el = scrollRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const halfway = maxScroll / 2;
    // Fetch well before the reader actually reaches the clamp point, so a
    // fresh page is already in by the time they'd otherwise feel the panel
    // stop growing under them. Also covers the panel not yet being tall
    // enough to scroll at all (a short first page, or a tall viewport).
    if (maxScroll <= 0 || el.scrollTop >= halfway * 0.7) fetchNextPage();
  };
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const halfway = (el.scrollHeight - el.clientHeight) / 2;
    if (el.scrollTop > halfway) el.scrollTop = halfway;
    maybeLoadMore();
  };
  // Tops the panel up on mount and after every page arrives, in case the
  // panel still isn't scrollable yet (a short page, or a tall viewport) —
  // handleScroll alone only runs in response to a scroll the reader made.
  useEffect(() => {
    maybeLoadMore();
  }, [items.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <p className="text-xs font-semibold tracking-widest text-slate-300 uppercase">Live activity</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/5 p-0.5">
          {(['all', 'us'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${
                filter === tab ? 'bg-white/15 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All' : 'US'}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="mt-3 flex-1 space-y-1 overflow-y-auto pr-1">
        {isLoading && <p className="px-1 text-sm text-slate-400">Loading…</p>}
        {items.map((scam) => (
          <Link
            key={scam.id}
            to={`/scams/${scam.slug}`}
            className="block rounded-md px-2 py-2 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start gap-2">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  ALERT_DOT_COLORS[scam.alert_level ?? 'low'] ?? 'bg-slate-400'
                }`}
              />
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-100">{scam.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {scam.country && countryName(scam.country)}
                  {scam.country && ' · '}
                  {timeAgo(scam.created_at)}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {isFetchingNextPage && <p className="px-1 py-2 text-xs text-slate-500">Loading more…</p>}
        {!isLoading && items.length === 0 && <p className="px-1 text-sm text-slate-400">No activity recorded yet.</p>}
      </div>
    </div>
  );
}
