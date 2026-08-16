import { api } from './api';

export interface SiteStats {
  scams: number;
  categories: number;
  countries: number;
  sources: number;
}

export async function fetchStats() {
  const { data } = await api.get<{ data: SiteStats }>('/stats');
  return data.data;
}
