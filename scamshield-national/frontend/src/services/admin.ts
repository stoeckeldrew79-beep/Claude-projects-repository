import { api } from './api';
import { AlertLevel, Article, Scam } from '../types';

export interface NewScam {
  name: string;
  slug: string;
  description: string;
  alert_level?: AlertLevel;
  is_historical?: boolean;
  country?: string;
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
  cover_image?: string;
  cover_image_credit?: string;
  published: boolean;
}

export async function createArticle(article: NewArticle) {
  const { data } = await api.post<{ data: Article }>('/articles', article);
  return data.data;
}

// Used to attach a real, rights-cleared cover photo to an existing
// article (e.g. a Notorious Scams profile) — everything else about the
// article stays as-is. `credit` is required for Creative Commons
// Attribution photos (legally required wherever the image is shown);
// leave it unset for public-domain sources like federal mugshots.
export async function updateArticleCoverImage(
  id: string,
  cover_image: string,
  cover_image_credit?: string,
  source_url?: string
) {
  const { data } = await api.put<{ data: Article }>(`/articles/${id}`, {
    cover_image,
    cover_image_credit: cover_image_credit || null,
    source_url: source_url || null,
  });
  return data.data;
}
