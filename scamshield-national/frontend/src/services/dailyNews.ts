import { api } from './api';
import { DailyScamNews } from '../types';

export async function fetchDailyScamNews() {
  const { data } = await api.get<{ data: DailyScamNews[] }>('/daily-news');
  return data.data;
}
