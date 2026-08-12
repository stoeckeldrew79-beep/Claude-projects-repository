import { api } from './api';

export interface NewScamReport {
  reporter_name?: string;
  reporter_email?: string;
  reporter_phone?: string;
  scammer_phone?: string;
  scammer_email?: string;
  scammer_website?: string;
  category_id?: string;
  description: string;
  money_lost_amount?: number;
  incident_date?: string;
  country?: string;
  state?: string;
  zip_code?: string;
}

export interface ScamReport extends NewScamReport {
  id: string;
  status: 'pending' | 'reviewed' | 'promoted' | 'dismissed';
  created_at: string;
}

export async function submitReport(report: NewScamReport) {
  const { data } = await api.post<{ data: ScamReport }>('/reports', report);
  return data.data;
}

export async function fetchReports(status = 'pending') {
  const { data } = await api.get<{ data: ScamReport[] }>('/reports', { params: { status } });
  return data.data;
}

export async function promoteReport(id: string, payload: { name: string; slug: string; alert_level?: string }) {
  const { data } = await api.post(`/reports/${id}/promote`, payload);
  return data.data;
}

export async function dismissReport(id: string) {
  const { data } = await api.post(`/reports/${id}/dismiss`);
  return data.data;
}
