import { api } from './api';
import { Category, Scam, ScamStateCount } from '../types';

// Must match the backend's default pageSize in listScams (backend/src/models/scams.ts).
export const PAGE_SIZE = 20;

export interface ScamListParams {
  category?: string;
  tag?: string;
  state?: string;
  zip?: string;
  country?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'alert_level' | 'name_asc' | 'chronological';
  view?: 'current' | 'historical' | 'all' | 'recent';
  // Comma-separated alert levels on the wire (?severity=critical,high).
  severity?: SeverityLevel[];
  page?: number;
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

// Axios would serialize an array as severity[]=a&severity[]=b; the API
// reads one comma-separated value.
function toQuery(params: ScamListParams) {
  const { severity, ...rest } = params;
  return severity && severity.length > 0 ? { ...rest, severity: severity.join(',') } : rest;
}

export async function fetchScams(params: ScamListParams = {}) {
  const { data } = await api.get<{ data: Scam[] }>('/scams', { params: toQuery(params) });
  return data.data;
}

// Same list, plus the total number of matches for the whole filter
// (?include_total=1). total is null against an API that predates the field.
export async function fetchScamsWithTotal(params: ScamListParams = {}) {
  const { data } = await api.get<{ data: Scam[]; total?: number }>('/scams', {
    params: { ...toQuery(params), include_total: 1 },
  });
  return { items: data.data, total: typeof data.total === 'number' ? data.total : null };
}

export async function fetchScamTags() {
  const { data } = await api.get<{ data: { tag: string; count: number }[] }>('/scams/tags');
  return data.data;
}

export async function fetchCountries() {
  const { data } = await api.get<{ data: string[] }>('/scams/countries');
  return data.data;
}

export async function fetchScamBySlug(slug: string) {
  const { data } = await api.get<{ data: Scam }>(`/scams/${slug}`);
  return data.data;
}

export async function fetchCategories() {
  const { data } = await api.get<{ data: Category[] }>('/categories');
  return data.data;
}

export async function fetchScamStates() {
  const { data } = await api.get<{ data: ScamStateCount[] }>('/scams/states');
  return data.data;
}

// Powers "Check This Now" — a free-text description matched against the
// same search the site's search box uses (backend/src/models/scams.ts
// searchScams), not a separate AI-classification pipeline. Results are
// ranked, not scored, so the UI should talk about "closest match," never
// a fabricated confidence percentage the search itself can't back up.
export async function searchScamsByText(q: string) {
  const { data } = await api.get<{ data: Scam[] }>('/scams/search', { params: { q } });
  return data.data;
}
