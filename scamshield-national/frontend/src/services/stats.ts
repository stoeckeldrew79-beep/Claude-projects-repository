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

export interface StatsBreakdown {
  byCategory: { name: string; count: number }[];
  byCountry: { country: string; count: number }[];
}

export async function fetchStatsBreakdown() {
  const { data } = await api.get<{ data: StatsBreakdown }>('/stats/breakdown');
  return data.data;
}
