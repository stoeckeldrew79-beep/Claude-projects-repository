import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchCountries, fetchScamBySlug, fetchScams, PAGE_SIZE, ScamListParams } from '../services/scams';

export function useScams(params: ScamListParams = {}) {
  return useQuery({
    queryKey: ['scams', params],
    queryFn: () => fetchScams(params),
  });
}

// Powers the Database page's "Load more" — appends pages instead of
// replacing them, so a page shorter than PAGE_SIZE means there's no more.
export function useInfiniteScams(params: Omit<ScamListParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['scams', 'infinite', params],
    queryFn: ({ pageParam }) => fetchScams({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined),
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

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });
}
