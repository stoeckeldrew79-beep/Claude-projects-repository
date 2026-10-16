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

// GET /stats/breakdown — aggregate view of the curated database. Every field
// is a live GROUP BY on the server; see backend/src/models/stats.ts.
export interface StatsBreakdown {
  generated_at: string;
  totals: { current: number; historical: number; countries: number; categories_in_use: number };
  bySeverity: { critical: number; high: number; medium: number; low: number; unrated: number };
  byCategory: { name: string; slug: string; count: number; critical_high: number }[];
  topCountries: { country: string; count: number }[];
  topTargets: { tag: string; count: number }[];
  weeklyAdded: { week_start: string; count: number }[];
}

export async function fetchStatsBreakdown() {
  const { data } = await api.get<{ data: StatsBreakdown }>('/stats/breakdown');
  return data.data;
}
