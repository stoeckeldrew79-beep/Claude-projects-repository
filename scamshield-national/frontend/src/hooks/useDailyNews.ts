import { useQuery } from '@tanstack/react-query';
import { fetchDailyScamNews, fetchDailyNewsStates } from '../services/dailyNews';

// The underlying data only changes once a day (see the scanDailyScamNews
// job), but refetching periodically means a tab left open shows a new
// headline landing without the visitor needing to reload.
const REFETCH_INTERVAL_MS = 10 * 60 * 1000;

export function useDailyScamNews(state?: string) {
  return useQuery({
    // state is part of the key so switching filters refetches rather than
    // showing the previous state's cached headlines.
    queryKey: ['daily-scam-news', state ?? 'all'],
    queryFn: () => fetchDailyScamNews(state),
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}

export function useDailyNewsStates() {
  return useQuery({
    queryKey: ['daily-scam-news-states'],
    queryFn: fetchDailyNewsStates,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
