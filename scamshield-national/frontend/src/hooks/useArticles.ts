import { useQuery } from '@tanstack/react-query';
import { fetchArticleBySlug, fetchArticles } from '../services/articles';

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });
}

export function useArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleBySlug(slug as string),
    enabled: Boolean(slug),
  });
}
