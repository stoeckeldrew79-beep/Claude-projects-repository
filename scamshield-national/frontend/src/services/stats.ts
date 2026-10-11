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

export interface LiveStatsCritical {
  id: string;
  name: string;
  slug: string;
  alert_level: string;
  category_name: string | null;
  country: string | null;
  created_at: string;
}

export interface LiveStats {
  newLast7Days: number;
  newLast30Days: number;
  activeCriticalCount: number;
  activeHighCount: number;
  newsLast24h: number;
  mostActiveCategory: { name: string; count: number } | null;
  recentCritical: LiveStatsCritical[];
}

export async function fetchLiveStats() {
  const { data } = await api.get<{ data: LiveStats }>('/stats/live');
  return data.data;
}
