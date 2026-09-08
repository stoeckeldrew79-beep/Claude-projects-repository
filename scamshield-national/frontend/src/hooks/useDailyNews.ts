import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { DAILY_NEWS_PAGE_SIZE, fetchDailyScamNews, fetchDailyNewsStates } from '../services/dailyNews';

// The underlying data only changes once a day (see the scanDailyScamNews
// job), but refetching periodically means a tab left open shows a new
// headline landing without the visitor needing to reload.
const REFETCH_INTERVAL_MS = 10 * 60 * 1000;

export function useDailyScamNews(state?: string, enabled = true) {
  return useQuery({
    // state is part of the key so switching filters refetches rather than
    // showing the previous state's cached headlines.
    queryKey: ['daily-scam-news', state ?? 'all'],
    queryFn: () => fetchDailyScamNews(state),
    refetchInterval: REFETCH_INTERVAL_MS,
    enabled,
  });
}

export function useDailyNewsStates() {
  return useQuery({
    queryKey: ['daily-scam-news-states'],
    queryFn: fetchDailyNewsStates,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}

// The full Today's Scams feed, which reads back through the 30-day window
// rather than stopping at the first page. The single-page hook above still
// backs the previews (a state page shows six), where paging would be noise.
export function useInfiniteDailyScamNews(state?: string) {
  return useInfiniteQuery({
    queryKey: ['daily-scam-news', 'infinite', state ?? 'all'],
    queryFn: ({ pageParam }) => fetchDailyScamNews(state, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === DAILY_NEWS_PAGE_SIZE ? allPages.length + 1 : undefined,
    // No polling here. Refetching an infinite query refetches every page it
    // holds, and a reader deep in a month of history does not need the whole
    // lot re-fetched every ten minutes to see today's arrivals.
    refetchOnWindowFocus: false,
  });
}
