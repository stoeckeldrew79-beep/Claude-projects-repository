import { api } from './api';
import { DailyScamNews, DailyNewsStateCount } from '../types';

// Must match PAGE_SIZE in backend/src/controllers/dailyNews.ts — a short
// page is how the caller knows it has reached the end of the feed.
export const DAILY_NEWS_PAGE_SIZE = 50;

// scope: 'us' narrows the state-less bucket to US-origin queries only (see
// the dailyNews controller for how a state-less row is classified). A state
// filter is already unambiguously US, so scope is only meaningful without one.
export async function fetchDailyScamNews(state?: string, page?: number, scope?: 'us') {
  const params: Record<string, string | number> = {};
  if (state) params.state = state;
  if (page && page > 1) params.page = page;
  if (scope && !state) params.scope = scope;
  const { data } = await api.get<{ data: DailyScamNews[] }>('/daily-news', {
    params: Object.keys(params).length ? params : undefined,
  });
  return data.data;
}

export async function fetchDailyNewsStates() {
  const { data } = await api.get<{ data: DailyNewsStateCount[] }>('/daily-news/states');
  return data.data;
}

export async function fetchDailyScamNewsCount(state?: string, scope?: 'us') {
  const params: Record<string, string> = {};
  if (state) params.state = state;
  if (scope && !state) params.scope = scope;
  const { data } = await api.get<{ data: { count: number } }>('/daily-news/count', {
    params: Object.keys(params).length ? params : undefined,
  });
  return data.data.count;
}
