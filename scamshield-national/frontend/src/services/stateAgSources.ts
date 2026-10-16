import { api } from './api';
import { StateAgSource } from '../types';

export async function fetchStateAgSources() {
  const { data } = await api.get<{ data: StateAgSource[] }>('/state-ag-sources');
  return data.data;
}

// One row of GET /v1/daily-news/ag-status: how the AG feed engine last fared
// reading a state's own site. Lives here rather than in types/index.ts
// because only the state pages read it.
export interface AgFeedStatus {
  state: string;
  source_type: string;
  source_url: string;
  last_attempt_at: string | null;
  last_success_at: string | null;
  last_item_count: number | null;
  newest_item_at: string | null;
  last_error: string | null;
}

export async function fetchAgFeedStatus() {
  const { data } = await api.get<{ data: AgFeedStatus[] }>('/daily-news/ag-status');
  return data.data;
}
