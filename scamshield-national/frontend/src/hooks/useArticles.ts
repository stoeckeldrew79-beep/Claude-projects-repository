import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ARTICLE_PAGE_SIZE, fetchAllArticleSummaries, fetchArticleBySlug, fetchArticleCount, fetchArticlePage, fetchArticles } from '../services/articles';

export function useArticles(tag?: string) {
  return useQuery({
    queryKey: ['articles', tag ?? null],
    queryFn: () => fetchArticles(tag),
  });
}

// Public collections, loaded a window at a time as the reader scrolls.
// A short page means the end: the API has no total count, and asking for one
// would cost a second query per page to tell us something the page length
// already says.
export function useInfiniteArticles(opts: { tag?: string; q?: string; sort?: 'photos-first' }) {
  return useInfiniteQuery({
    queryKey: ['articles', 'infinite', opts.tag ?? null, opts.q ?? '', opts.sort ?? null],
    queryFn: ({ pageParam }) => fetchArticlePage({ ...opts, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < ARTICLE_PAGE_SIZE ? undefined : allPages.length * ARTICLE_PAGE_SIZE,
  });
}

// How many articles exist under a tag, independent of how many have loaded.
export function useArticleCount(opts: { tag?: string; q?: string }) {
  return useQuery({
    queryKey: ['articles', 'count', opts.tag ?? null, opts.q ?? ''],
    queryFn: () => fetchArticleCount(opts),
  });
}

// Admin-only: every article with the given tag, not just the first page.
export function useAllArticleSummaries(tag: string) {
  return useQuery({
    queryKey: ['articles', 'all', tag],
    queryFn: () => fetchAllArticleSummaries(tag),
  });
}

export function useArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleBySlug(slug as string),
    enabled: Boolean(slug),
  });
}
