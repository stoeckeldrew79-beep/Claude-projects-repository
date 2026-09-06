import { useQuery } from '@tanstack/react-query';
import { fetchAllArticleSummaries, fetchArticleBySlug, fetchArticles } from '../services/articles';

export function useArticles(tag?: string) {
  return useQuery({
    queryKey: ['articles', tag ?? null],
    queryFn: () => fetchArticles(tag),
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
