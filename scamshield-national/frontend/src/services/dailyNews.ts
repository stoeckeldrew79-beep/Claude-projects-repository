import { api } from './api';
import { DailyScamNews, DailyNewsStateCount } from '../types';

// Must match PAGE_SIZE in backend/src/controllers/dailyNews.ts — a short
// page is how the caller knows it has reached the end of the feed.
export const DAILY_NEWS_PAGE_SIZE = 50;

export async function fetchDailyScamNews(state?: string, page?: number) {
  const params: Record<string, string | number> = {};
  if (state) params.state = state;
  if (page && page > 1) params.page = page;
  const { data } = await api.get<{ data: DailyScamNews[] }>('/daily-news', {
    params: Object.keys(params).length ? params : undefined,
  });
  return data.data;
}

export async function fetchDailyNewsStates() {
  const { data } = await api.get<{ data: DailyNewsStateCount[] }>('/daily-news/states');
  return data.data;
}
