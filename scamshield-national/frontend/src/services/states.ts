import { api } from './api';
import { StateDetail, StateSummary } from '../types';

export async function fetchStates() {
  const { data } = await api.get<{ data: StateSummary[] }>('/states');
  return data.data;
}

export async function fetchStateBySlug(slug: string) {
  const { data } = await api.get<{ data: StateDetail }>(`/states/${slug}`);
  return data.data;
}
