import { useMutation, useQuery } from '@tanstack/react-query';
import { createCheckoutSession, createPortalSession, fetchSubscriptionStatus, SubscriptionTier } from '../services/subscriptions';

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: ['subscription-status'],
    queryFn: fetchSubscriptionStatus,
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: (tier: SubscriptionTier) => createCheckoutSession(tier),
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: createPortalSession,
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}
