import { api } from './api';
import { DailyScamNews, DailyNewsStateCount } from '../types';

export async function fetchDailyScamNews(state?: string) {
  const { data } = await api.get<{ data: DailyScamNews[] }>('/daily-news', {
    params: state ? { state } : undefined,
  });
  return data.data;
}

export async function fetchDailyNewsStates() {
  const { data } = await api.get<{ data: DailyNewsStateCount[] }>('/daily-news/states');
  return data.data;
}
