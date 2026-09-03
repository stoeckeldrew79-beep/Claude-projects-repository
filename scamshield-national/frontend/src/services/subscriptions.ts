import { api } from './api';

export type SubscriptionTier = 'basic' | 'pro' | 'family' | 'business';

export async function createCheckoutSession(tier: SubscriptionTier) {
  const { data } = await api.post<{ data: { url: string } }>('/subscriptions/checkout', { tier });
  return data.data.url;
}

export async function createPortalSession() {
  const { data } = await api.post<{ data: { url: string } }>('/subscriptions/portal');
  return data.data.url;
}

export interface Subscription {
  id: string;
  tier: string;
  status: string;
  current_period_end: string | null;
}

export async function fetchSubscriptionStatus() {
  const { data } = await api.get<{ data: Subscription | null }>('/subscriptions/status');
  return data.data;
}
