import { api } from './api';

export type AlertFrequency = 'monthly' | 'weekly' | 'daily' | 'instant';

export interface AlertPreferences {
  user_id: string;
  frequency: AlertFrequency;
  last_sent_at: string | null;
}

export interface AlertWatchProfile {
  id: string;
  user_id: string;
  label: string | null;
  state: string | null;
  category_id: string | null;
  created_at: string;
}

export async function fetchPreferences() {
  const { data } = await api.get<{ data: AlertPreferences; maxFrequency: AlertFrequency }>(
    '/alert-subscriptions/preferences'
  );
  return data;
}

export async function updatePreferences(frequency: AlertFrequency) {
  const { data } = await api.put<{ data: AlertPreferences }>('/alert-subscriptions/preferences', { frequency });
  return data.data;
}

export async function fetchWatchProfiles() {
  const { data } = await api.get<{ data: AlertWatchProfile[] }>('/alert-subscriptions/watch-profiles');
  return data.data;
}

export async function createWatchProfile(input: { label?: string; state?: string; category?: string }) {
  const { data } = await api.post<{ data: AlertWatchProfile }>('/alert-subscriptions/watch-profiles', input);
  return data.data;
}

export async function deleteWatchProfile(id: string) {
  await api.delete(`/alert-subscriptions/watch-profiles/${id}`);
}
