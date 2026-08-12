import { api } from './api';
import { Category, Scam } from '../types';

export interface ScamListParams {
  category?: string;
  state?: string;
  zip?: string;
  country?: string;
  search?: string;
  sort?: string;
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
