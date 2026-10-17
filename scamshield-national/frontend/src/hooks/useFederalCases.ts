import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchFederalArchiveStats, fetchFederalCases } from '../services/federalCases';
import { FederalCaseFilters } from '../types';

export function useFederalCases(filters: FederalCaseFilters) {
  return useInfiniteQuery({
    queryKey: ['federal-cases', filters],
    queryFn: ({ pageParam }) => fetchFederalCases(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page * last.page_size < last.total ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

export function useFederalArchiveStats() {
  return useQuery({
    queryKey: ['federal-cases', 'stats'],
    queryFn: fetchFederalArchiveStats,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
