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
// Larger pages mean fewer stops. The payload is a page of cards, not the
// whole collection, so this stays modest while making a continuous scroll
// feel continuous.
export const ARTICLE_PAGE_SIZE = 36;

export type ArticleSort = 'photos-first' | 'title' | 'oldest';

export interface ArticlePageParams {
  tag?: string;
  // Extra tags an article must also carry, comma-separated (AND), e.g. the
  // "Ponzi schemes" chip on Notorious sends tag=notorious&tags=ponzi-scheme.
  tags?: string;
  q?: string;
  sort?: ArticleSort;
  offset: number;
}

export async function fetchArticlePage({ tag, tags, q, sort, offset }: ArticlePageParams) {
  const { data } = await api.get<{ data: Article[] }>('/articles', {
    params: {
      ...(tag ? { tag } : {}),
      ...(tags ? { tags } : {}),
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

export async function fetchArticleCount(opts: { tag?: string; tags?: string; q?: string }) {
  const { data } = await api.get<{ data: { count: number } }>('/articles/count', {
    params: {
      ...(opts.tag ? { tag: opts.tag } : {}),
      ...(opts.tags ? { tags: opts.tags } : {}),
      ...(opts.q ? { q: opts.q } : {}),
    },
  });
  return data.data.count;
}

// "Related reading" for an article page: a few others from the same
// collection, preferring ones that share the article's most specific tag and
// topping up from the wider collection when that tag is rare. Never returns
// the article itself.
export async function fetchRelatedArticles(opts: { tag: string; tags?: string; exclude: string; limit?: number }) {
  const limit = opts.limit ?? 3;
  const page = async (tags?: string) => {
    const { data } = await api.get<{ data: Article[] }>('/articles', {
      params: { tag: opts.tag, ...(tags ? { tags } : {}), exclude: opts.exclude, sort: 'photos-first', limit: limit + 1 },
    });
    return data.data;
  };
  const picked: Article[] = [];
  const add = (list: Article[]) => {
    for (const a of list) {
      // exclude is newer than some deployments, so filter here as well.
      if (a.slug !== opts.exclude && !picked.some((p) => p.id === a.id) && picked.length < limit) picked.push(a);
    }
  };
  if (opts.tags) add(await page(opts.tags));
  if (picked.length < limit) add(await page());
  return picked;
}
