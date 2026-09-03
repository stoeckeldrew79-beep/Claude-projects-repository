import { useQuery } from '@tanstack/react-query';
import { fetchArticleBySlug, fetchArticles } from '../services/articles';

export function useArticles(tag?: string) {
  return useQuery({
    queryKey: ['articles', tag ?? null],
    queryFn: () => fetchArticles(tag),
  });
}

export function useArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleBySlug(slug as string),
    enabled: Boolean(slug),
  });
}
