import { useQuery } from '@tanstack/react-query';
import { fetchCategoryTrends } from '../services/trends';

export function useCategoryTrends() {
  return useQuery({
    queryKey: ['category-trends'],
    queryFn: fetchCategoryTrends,
  });
}
