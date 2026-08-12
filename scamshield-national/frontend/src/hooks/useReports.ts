import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dismissReport, fetchReports, promoteReport, submitReport } from '../services/reports';

export function useSubmitReport() {
  return useMutation({ mutationFn: submitReport });
}

export function usePendingReports(enabled: boolean) {
  return useQuery({
    queryKey: ['reports', 'pending'],
    queryFn: () => fetchReports('pending'),
    enabled,
  });
}

export function usePromoteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name: string; slug: string; alert_level?: string }) =>
      promoteReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['scams'] });
    },
  });
}

export function useDismissReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dismissReport(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports', 'pending'] }),
  });
}
