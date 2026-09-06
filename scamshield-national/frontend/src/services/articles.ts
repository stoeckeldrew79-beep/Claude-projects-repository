import { api } from './api';
import { Article, ArticleSummary } from '../types';

export async function fetchArticles(tag?: string) {
  const { data } = await api.get<{ data: Article[] }>('/articles', { params: tag ? { tag } : undefined });
  return data.data;
}

// The API caps a single page, so anything that must show every article has to
// page. The admin cover-photo panel does: at 664 notorious profiles a single
// capped request left most of them unreachable, with nothing on screen to
// suggest more existed.
const PAGE_SIZE = 500;

// One window of a collection. Public pages ask for these as the reader
// scrolls rather than pulling 600+ articles up front.
export const ARTICLE_PAGE_SIZE = 24;

export interface ArticlePageParams {
  tag?: string;
  q?: string;
  sort?: 'photos-first';
  offset: number;
}

export async function fetchArticlePage({ tag, q, sort, offset }: ArticlePageParams) {
  const { data } = await api.get<{ data: Article[] }>('/articles', {
    params: {
      ...(tag ? { tag } : {}),
      ...(q ? { q } : {}),
      ...(sort ? { sort } : {}),
      limit: ARTICLE_PAGE_SIZE,
      offset,
    },
  });
  return data.data;
}

export async function fetchAllArticleSummaries(tag: string) {
  const all: ArticleSummary[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data } = await api.get<{ data: ArticleSummary[] }>('/articles', {
      params: { tag, brief: '1', limit: PAGE_SIZE, offset },
    });
    all.push(...data.data);
    if (data.data.length < PAGE_SIZE) return all;
  }
}

export async function fetchArticleBySlug(slug: string) {
  const { data } = await api.get<{ data: Article }>(`/articles/${slug}`);
  return data.data;
}
