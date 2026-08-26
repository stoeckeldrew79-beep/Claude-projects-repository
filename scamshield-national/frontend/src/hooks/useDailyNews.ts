import { useQuery } from '@tanstack/react-query';
import { fetchDailyScamNews } from '../services/dailyNews';

// The underlying data only changes once a day (see the scanDailyScamNews
// job), but refetching periodically means a tab left open shows a new
// headline landing without the visitor needing to reload.
const REFETCH_INTERVAL_MS = 10 * 60 * 1000;

export function useDailyScamNews() {
  return useQuery({
    queryKey: ['daily-scam-news'],
    queryFn: fetchDailyScamNews,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
