import { api } from './api';
import { Alert } from '../types';

export async function fetchAlerts(params: { state?: string; zip?: string } = {}) {
  const { data } = await api.get<{ data: Alert[] }>('/alerts', { params });
  return data.data;
}
