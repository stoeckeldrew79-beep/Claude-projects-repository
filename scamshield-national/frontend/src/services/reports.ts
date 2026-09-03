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
  consent_to_file?: boolean;
}

export interface ScamReport extends NewScamReport {
  id: string;
  status: 'pending' | 'reviewed' | 'promoted' | 'dismissed';
  created_at: string;
}

export interface ReportStatus {
  id: string;
  status: 'pending' | 'reviewed' | 'promoted' | 'dismissed';
  created_at: string;
  consent_to_file: boolean;
  filings: {
    agency_name: string;
    status: 'suggested' | 'filed' | 'not_applicable';
    reference_number: string | null;
    filed_at: string | null;
  }[];
}

export interface AgencySuggestion {
  agency_name: string;
  agency_url: string;
  reason: string;
}

export interface ReportFiling {
  id: string;
  report_id: string;
  agency_name: string;
  agency_url: string;
  status: 'suggested' | 'filed' | 'not_applicable';
  reference_number: string | null;
  filed_at: string | null;
  notes: string | null;
}

export async function submitReport(report: NewScamReport) {
  const { data } = await api.post<{ data: ScamReport }>('/reports', report);
  return data.data;
}

export async function fetchReports(status = 'pending') {
  const { data } = await api.get<{ data: ScamReport[] }>('/reports', { params: { status } });
  return data.data;
}

export async function fetchReportStatus(id: string) {
  const { data } = await api.get<{ data: ReportStatus }>(`/reports/${id}/status`);
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

export async function fetchFilingSuggestions(reportId: string) {
  const { data } = await api.get<{ data: AgencySuggestion[] }>(`/reports/${reportId}/filings/suggestions`);
  return data.data;
}

export async function fetchFilings(reportId: string) {
  const { data } = await api.get<{ data: ReportFiling[] }>(`/reports/${reportId}/filings`);
  return data.data;
}

export async function createFiling(
  reportId: string,
  payload: { agency_name: string; agency_url: string; status?: string; reference_number?: string; notes?: string }
) {
  const { data } = await api.post<{ data: ReportFiling }>(`/reports/${reportId}/filings`, payload);
  return data.data;
}

export async function updateFiling(
  reportId: string,
  filingId: string,
  payload: { status?: string; reference_number?: string; notes?: string }
) {
  const { data } = await api.patch<{ data: ReportFiling }>(`/reports/${reportId}/filings/${filingId}`, payload);
  return data.data;
}
