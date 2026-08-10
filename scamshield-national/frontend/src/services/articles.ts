import { api } from './api';
import { Article } from '../types';

export async function fetchArticles() {
  const { data } = await api.get<{ data: Article[] }>('/articles');
  return data.data;
}

export async function fetchArticleBySlug(slug: string) {
  const { data } = await api.get<{ data: Article }>(`/articles/${slug}`);
  return data.data;
}
