import { api } from './api';
import { Category, Scam } from '../types';

// Must match the backend's default pageSize in listScams (backend/src/models/scams.ts).
export const PAGE_SIZE = 20;

export interface ScamListParams {
  category?: string;
  state?: string;
  zip?: string;
  country?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'alert_level' | 'name_asc' | 'chronological';
  view?: 'current' | 'historical' | 'all';
  page?: number;
}

export async function fetchScams(params: ScamListParams = {}) {
  const { data } = await api.get<{ data: Scam[] }>('/scams', { params });
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
