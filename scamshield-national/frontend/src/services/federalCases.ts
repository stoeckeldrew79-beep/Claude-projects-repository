import { api } from './api';
import { FederalArchiveStats, FederalCaseFilters, FederalCasePage } from '../types';

export async function fetchFederalCases(filters: FederalCaseFilters, page: number) {
  const params: Record<string, string | number> = { page };
  if (filters.q) params.q = filters.q;
  if (filters.state) params.state = filters.state;
  if (filters.theme) params.theme = filters.theme;
  if (filters.year) params.year = filters.year;
  const { data } = await api.get<FederalCasePage>('/federal-cases', { params });
  return data;
}

export async function fetchFederalArchiveStats() {
  const { data } = await api.get<{ data: FederalArchiveStats }>('/federal-cases/stats');
  return data.data;
}
