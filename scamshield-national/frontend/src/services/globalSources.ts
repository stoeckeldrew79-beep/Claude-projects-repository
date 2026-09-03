import { api } from './api';
import { GlobalSource } from '../types';

export async function fetchGlobalSources() {
  const { data } = await api.get<{ data: GlobalSource[] }>('/global-sources');
  return data.data;
}

export interface NewGlobalStat {
  source_id: string;
  period_label: string;
  headline: string;
  report_count?: number;
  loss_amount?: number;
  currency?: string;
  top_category?: string;
  source_url: string;
  published_date?: string;
}

export async function createGlobalStat(stat: NewGlobalStat) {
  const { data } = await api.post('/global-sources/stats', stat);
  return data.data;
}

export async function deleteGlobalStat(id: string) {
  await api.delete(`/global-sources/stats/${id}`);
}
