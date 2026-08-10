import { api } from './api';
import { AlertLevel, Article, Scam } from '../types';

export interface NewScam {
  name: string;
  slug: string;
  description: string;
  alert_level?: AlertLevel;
  is_historical?: boolean;
}

export async function createScam(scam: NewScam) {
  const { data } = await api.post<{ data: Scam }>('/scams', scam);
  return data.data;
}

export interface NewArticle {
  title: string;
  slug: string;
  body: string;
  author?: string;
  published: boolean;
}

export async function createArticle(article: NewArticle) {
  const { data } = await api.post<{ data: Article }>('/articles', article);
  return data.data;
}
