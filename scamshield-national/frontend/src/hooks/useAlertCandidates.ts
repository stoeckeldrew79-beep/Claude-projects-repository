import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveAlertCandidate,
  dismissAlertCandidate,
  fetchAlertAudienceSummary,
  fetchPendingAlertCandidates,
} from '../services/alertCandidates';

export function usePendingAlertCandidates(enabled: boolean) {
  return useQuery({
    queryKey: ['alert-candidates', 'pending'],
    queryFn: fetchPendingAlertCandidates,
    enabled,
  });
}

export function useApproveAlertCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveAlertCandidate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alert-candidates', 'pending'] }),
  });
}

export function useDismissAlertCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dismissAlertCandidate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alert-candidates', 'pending'] }),
  });
}

export function useAlertAudienceSummary(enabled: boolean) {
  return useQuery({
    queryKey: ['alert-candidates', 'audience'],
    queryFn: fetchAlertAudienceSummary,
    enabled,
    retry: false,
  });
}
