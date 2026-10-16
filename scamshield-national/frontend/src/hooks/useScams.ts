import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  PAGE_SIZE,
  ScamListParams,
  fetchCategories,
  fetchCountries,
  fetchScamBySlug,
  fetchScamStates,
  fetchScamTags,
  fetchScams,
  fetchScamsWithTotal,
  searchScamsByText,
} from '../services/scams';

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

// Database page: like useInfiniteScams, but the first page also carries the
// total match count so the page can say "1,284 results". Only page 1 asks
// for the total (later pages would just repeat the COUNT); placeholderData
// keeps the previous results on screen while a new filter loads, so the grid
// doesn't collapse to nothing and jump on every keystroke.
export function useInfiniteScamsWithTotal(params: Omit<ScamListParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['scams', 'infinite-total', params],
    queryFn: async ({ pageParam }) => {
      if (pageParam === 1) return fetchScamsWithTotal({ ...params, page: 1 });
      return { items: await fetchScams({ ...params, page: pageParam }), total: null };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.items.length === PAGE_SIZE ? allPages.length + 1 : undefined),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
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

// "Check This Now": the page only updates `q` on submit (typing alone
// doesn't touch it), and `enabled` keys off `q` itself rather than a
// separate submitted-flag, so there's no stale-closure risk from calling
// refetch() right after a setState.
export function useScamSearch(q: string) {
  return useQuery({
    queryKey: ['scams', 'search', q],
    queryFn: () => searchScamsByText(q),
    // Matches the page's own "hasSearched" threshold so a couple of stray
    // keystrokes never fire a request that would just be thrown away.
    enabled: q.trim().length > 2,
  });
}
