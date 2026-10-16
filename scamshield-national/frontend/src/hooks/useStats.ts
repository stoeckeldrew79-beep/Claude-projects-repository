import { useQuery } from '@tanstack/react-query';
import { fetchStats, fetchLiveStats, fetchStatsBreakdown } from '../services/stats';

export function useStats() {
  return useQuery({ queryKey: ['stats'], queryFn: fetchStats });
}

// Refetches on the same cadence as the Today's Scams / AI activity feeds —
// this panel's whole point is to look different from one visit to the next,
// so a page left open should actually show that happening.
const LIVE_STATS_REFETCH_MS = 10 * 60 * 1000;

export function useLiveStats() {
  return useQuery({ queryKey: ['stats', 'live'], queryFn: fetchLiveStats, refetchInterval: LIVE_STATS_REFETCH_MS });
}

// The server caches this for five minutes; matching staleTime avoids
// refetching on every tab focus. retry: 1 so an API without the endpoint
// fails fast and the page hides those panels instead of spinning.
export function useStatsBreakdown() {
  return useQuery({ queryKey: ['stats', 'breakdown'], queryFn: fetchStatsBreakdown, staleTime: 5 * 60 * 1000, retry: 1 });
}
