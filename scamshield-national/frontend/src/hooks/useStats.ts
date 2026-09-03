import { useQuery } from '@tanstack/react-query';
import { fetchStats, fetchStatsBreakdown } from '../services/stats';

export function useStats() {
  return useQuery({ queryKey: ['stats'], queryFn: fetchStats });
}

export function useStatsBreakdown() {
  return useQuery({ queryKey: ['stats', 'breakdown'], queryFn: fetchStatsBreakdown });
}
