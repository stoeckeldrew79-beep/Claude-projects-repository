import { api } from './api';
import { Alert, AlertAudienceSummary, AlertCandidate } from '../types';

export async function fetchPendingAlertCandidates() {
  const { data } = await api.get<{ data: AlertCandidate[] }>('/alert-candidates');
  return data.data;
}

export interface ApproveAlertCandidateResult {
  data: Alert;
  broadcast: { smsSent: number; emailsSent: number; errors: string[] };
}

export async function approveAlertCandidate(id: string) {
  const { data } = await api.post<ApproveAlertCandidateResult>(`/alert-candidates/${id}/approve`);
  return data;
}

export async function dismissAlertCandidate(id: string) {
  await api.post(`/alert-candidates/${id}/dismiss`);
}

export async function fetchAlertAudienceSummary() {
  const { data } = await api.get<{ data: AlertAudienceSummary }>('/alert-candidates/audience');
  return data.data;
}
