import { api } from './api';
import { Category, Scam, ScamStateCount } from '../types';

// Must match the backend's default pageSize in listScams (backend/src/models/scams.ts).
export const PAGE_SIZE = 20;

export interface ScamListParams {
  category?: string;
  tag?: string;
  state?: string;
  zip?: string;
  country?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'alert_level' | 'name_asc' | 'chronological';
  view?: 'current' | 'historical' | 'all' | 'recent';
  page?: number;
}

export async function fetchScams(params: ScamListParams = {}) {
  const { data } = await api.get<{ data: Scam[] }>('/scams', { params });
  return data.data;
}

export async function fetchScamTags() {
  const { data } = await api.get<{ data: { tag: string; count: number }[] }>('/scams/tags');
  return data.data;
}

export async function fetchCountries() {
  const { data } = await api.get<{ data: string[] }>('/scams/countries');
  return data.data;
}

export async function fetchScamBySlug(slug: string) {
  const { data } = await api.get<{ data: Scam }>(`/scams/${slug}`);
  return data.data;
}

export async function fetchCategories() {
  const { data } = await api.get<{ data: Category[] }>('/categories');
  return data.data;
}

export async function fetchScamStates() {
  const { data } = await api.get<{ data: ScamStateCount[] }>('/scams/states');
  return data.data;
}

// Powers "Check This Now" — a free-text description matched against the
// same search the site's search box uses (backend/src/models/scams.ts
// searchScams), not a separate AI-classification pipeline. Results are
// ranked, not scored, so the UI should talk about "closest match," never
// a fabricated confidence percentage the search itself can't back up.
export async function searchScamsByText(q: string) {
  const { data } = await api.get<{ data: Scam[] }>('/scams/search', { params: { q } });
  return data.data;
}
