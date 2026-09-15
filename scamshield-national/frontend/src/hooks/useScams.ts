import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { PAGE_SIZE, ScamListParams, fetchCategories, fetchCountries, fetchScamBySlug, fetchScamStates, fetchScamTags, fetchScams } from '../services/scams';

export function useScams(params: ScamListParams = {}) {
  return useQuery({
    queryKey: ['scams', params],
    queryFn: () => fetchScams(params),
  });
}

// Powers the Database page's "Load more" — appends pages instead of
// replacing them, so a page shorter than PAGE_SIZE means there's no more.
// `enabled` matters on a page whose filter arrives asynchronously (the state
// page learns its state code from a separate request): without it the first
// render fires an unfiltered fetch of the whole database.
export function useInfiniteScams(params: Omit<ScamListParams, 'page'> = {}, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['scams', 'infinite', params],
    queryFn: ({ pageParam }) => fetchScams({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined),
    enabled,
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

// Only tags actually in use, with counts, so the filter never offers a
// label that would return nothing.
export function useScamTags() {
  return useQuery({
    queryKey: ['scam-tags'],
    queryFn: fetchScamTags,
  });
}

// Documented scams per state, for the coverage view of the US map.
export function useScamStates() {
  return useQuery({ queryKey: ['scams', 'states'], queryFn: fetchScamStates });
}
