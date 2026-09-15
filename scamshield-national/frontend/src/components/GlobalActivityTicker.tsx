import type { Ref } from 'react';
import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PAGE_SIZE, fetchScams } from '../services/scams';
import { useScamsCount } from '../hooks/useScams';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
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

// Stands in for a row that has not loaded yet, at the same height as a real
// one (see TodaysScams.tsx / Notorious.tsx for the fuller explanation): this
// panel's own count of activity items only grows as pages load, so without a
// reservation this scrollable panel's height — and its scrollbar thumb —
// shrinks and slides down with every batch instead of staying put.
function PlaceholderRow({ innerRef }: { innerRef?: Ref<HTMLDivElement> }) {
  return (
    <div ref={innerRef} aria-hidden style={{ contentVisibility: 'auto', containIntrinsicSize: '54px' }} className="px-2 py-2">
      <div className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/10" />
        <div className="min-w-0 flex-1">
          <div className="h-3.5 w-3/4 rounded bg-white/10" />
          <div className="mt-1.5 h-3 w-1/3 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

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
  const setTrigger = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    Boolean(hasNextPage) && !isFetchingNextPage
  );
  const { data: total } = useScamsCount({ country });
  // Reserve a row for every item still to come, so the panel is its full
  // height immediately rather than growing — and its scrollbar thumb
  // shrinking and sliding — with every batch that loads in.
  const placeholderCount = Math.max((total ?? 0) - items.length, 0);

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

      <div className="mt-3 flex-1 space-y-1 overflow-y-auto pr-1">
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
        {/* The trigger rides on the first placeholder — see Notorious.tsx for
            why a sentinel placed after the full reserved height never fires. */}
        {Array.from({ length: placeholderCount }, (_, i) => (
          <PlaceholderRow key={`placeholder-${i}`} innerRef={i === 0 ? setTrigger : undefined} />
        ))}
        {placeholderCount === 0 && <div ref={setTrigger} aria-hidden className="h-px" />}
        {isFetchingNextPage && <p className="px-1 py-2 text-xs text-slate-500">Loading more…</p>}
        {!isLoading && items.length === 0 && <p className="px-1 text-sm text-slate-400">No activity recorded yet.</p>}
      </div>
    </div>
  );
}
