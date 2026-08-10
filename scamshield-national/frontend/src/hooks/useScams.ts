import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchScamBySlug, fetchScams, ScamListParams } from '../services/scams';

export function useScams(params: ScamListParams = {}) {
  return useQuery({
    queryKey: ['scams', params],
    queryFn: () => fetchScams(params),
  });
}

export function useScam(slug: string | undefined) {
  return useQuery({
    queryKey: ['scam', slug],
    queryFn: () => fetchScamBySlug(slug as string),
    enabled: Boolean(slug),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}
