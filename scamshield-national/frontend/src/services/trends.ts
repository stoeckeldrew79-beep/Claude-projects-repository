import { api } from './api';

export interface CategoryTrend {
  category_id: string;
  name: string;
  slug: string;
  count_last_30d: number;
  count_prior_30d: number;
}

// What /categories/trends counts: database ENTRIES added per category in
// each 30-day window (scams.created_at) — not victim reports.
export interface CategoryTrendsMeta {
  window_days: number;
  first_entry_at: string | null;
  total_last_30d: number;
  total_prior_30d: number;
}

export async function fetchCategoryTrends(country?: string) {
  const { data } = await api.get<{ data: CategoryTrend[] }>('/categories/trends', {
    params: country ? { country } : undefined,
  });
  return data.data;
}

// Same request, keeping the meta block (null from an API that predates it).
export async function fetchCategoryTrendsWithMeta(country?: string) {
  const { data } = await api.get<{ data: CategoryTrend[]; meta?: CategoryTrendsMeta }>('/categories/trends', {
    params: country ? { country } : undefined,
  });
  return { trends: data.data, meta: data.meta ?? null };
}
