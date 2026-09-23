import { useQuery } from '@tanstack/react-query';
import { fetchCategoryTrends } from '../services/trends';

export function useCategoryTrends(country?: string) {
  return useQuery({
    // country is part of the key so switching "United States Only" vs "All
    // Countries" refetches rather than showing the previous filter's chart.
    queryKey: ['category-trends', country ?? 'all'],
    queryFn: () => fetchCategoryTrends(country),
  });
}
