import { api } from './api';
import {
  DailyScamNews,
  DailyNewsStateCount,
  LatestAgAlert,
  DailyNewsKind,
  DailyNewsSummary,
  FederalWatchData,
} from '../types';

// Must match PAGE_SIZE in backend/src/controllers/dailyNews.ts — a short
// page is how the caller knows it has reached the end of the feed.
export const DAILY_NEWS_PAGE_SIZE = 50;

// scope: 'us' narrows the state-less bucket to US-origin queries only (see
// the dailyNews controller for how a state-less row is classified). A state
// filter is already unambiguously US, so scope is only meaningful without one.
// kind narrows to one source type (official AG / federal / news coverage).
export async function fetchDailyScamNews(state?: string, page?: number, scope?: 'us', kind?: DailyNewsKind) {
  const params: Record<string, string | number> = {};
  if (state) params.state = state;
  if (page && page > 1) params.page = page;
  if (scope && !state) params.scope = scope;
  if (kind) params.kind = kind;
  const { data } = await api.get<{ data: DailyScamNews[] }>('/daily-news', {
    params: Object.keys(params).length ? params : undefined,
  });
  return data.data;
}

// Powers the "Recent AI Scam Activity" strip on the AI-Enabled Scams page —
// a handful of headlines, not a paged feed, so this has its own fetcher
// rather than overloading fetchDailyScamNews's state/page/scope params.
export const AI_TOPIC_PAGE_SIZE = 8;

export async function fetchAiTopicNews(page = 1) {
  const { data } = await api.get<{ data: DailyScamNews[] }>('/daily-news', { params: { topic: 'ai', page } });
  return data.data;
}

export async function fetchDailyNewsStates() {
  const { data } = await api.get<{ data: DailyNewsStateCount[] }>('/daily-news/states');
  return data.data;
}

export async function fetchDailyScamNewsCount(state?: string, scope?: 'us', kind?: DailyNewsKind) {
  const params: Record<string, string> = {};
  if (state) params.state = state;
  if (scope && !state) params.scope = scope;
  if (kind) params.kind = kind;
  const { data } = await api.get<{ data: { count: number } }>('/daily-news/count', {
    params: Object.keys(params).length ? params : undefined,
  });
  return data.data.count;
}

// Newest official Attorney General item per state (only states that have
// one), ordered by state. See latestByState in the dailyNews controller.
export async function fetchLatestAgByState() {
  const { data } = await api.get<{ data: LatestAgAlert[] }>('/daily-news/latest-by-state');
  return data.data;
}

export async function fetchDailyNewsSummary() {
  const { data } = await api.get<{ data: DailyNewsSummary }>('/daily-news/summary');
  return data.data;
}

// Federal Watch: DOJ/FTC releases clustered into stories, plus counts/themes.
export async function fetchFederalWatch() {
  const { data } = await api.get<{ data: FederalWatchData }>('/daily-news/federal');
  return data.data;
}
