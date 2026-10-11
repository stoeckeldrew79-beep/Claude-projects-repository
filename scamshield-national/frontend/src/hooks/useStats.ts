import { useQuery } from '@tanstack/react-query';
import { fetchStats, fetchLiveStats } from '../services/stats';

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
