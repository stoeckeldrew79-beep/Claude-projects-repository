import { api } from './api';

export interface CategoryTrend {
  category_id: string;
  name: string;
  slug: string;
  count_last_30d: number;
  count_prior_30d: number;
}

export async function fetchCategoryTrends(country?: string) {
  const { data } = await api.get<{ data: CategoryTrend[] }>('/categories/trends', {
    params: country ? { country } : undefined,
  });
  return data.data;
}
