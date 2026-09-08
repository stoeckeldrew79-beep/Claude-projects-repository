import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PAGE_SIZE, fetchScams } from '../services/scams';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { countryName } from '../utils/countries';
import { timeAgo } from '../utils/timeAgo';

const ALERT_DOT_COLORS: Record<string, string> = {
  low: 'bg-slate-400',
  medium: 'bg-yellow-400',
  high: 'bg-orange-400',
  critical: 'bg-red-500',
};

// Polls rather than streams — the backend has no websocket/SSE channel, and
// a short interval reads as "live" without needing one for a feed this size.
const REFRESH_MS = 20_000;
// Load the next page a few items before the reader reaches the bottom, so the
// list grows under them rather than stopping and then jumping.
const TRIGGER_OFFSET = 3;

export function GlobalActivityTicker() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['scams', 'ticker', { sort: 'newest' as const }],
    queryFn: ({ pageParam }) => fetchScams({ sort: 'newest', page: pageParam }),
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
  const setTrigger = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    Boolean(hasNextPage) && !isFetchingNextPage
  );
  const triggerIndex = Math.max(0, items.length - TRIGGER_OFFSET);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <p className="text-xs font-semibold tracking-widest text-slate-300 uppercase">Live activity</p>
      </div>

      <div className="mt-3 flex-1 space-y-1 overflow-y-auto pr-1">
        {isLoading && <p className="px-1 text-sm text-slate-400">Loading…</p>}
        {items.map((scam, index) => (
          <Link
            key={scam.id}
            ref={index === triggerIndex ? setTrigger : undefined}
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
