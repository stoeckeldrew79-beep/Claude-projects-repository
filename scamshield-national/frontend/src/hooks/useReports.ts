import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFiling,
  dismissReport,
  fetchFilingSuggestions,
  fetchFilings,
  fetchReports,
  fetchReportStatus,
  promoteReport,
  submitReport,
  updateFiling,
} from '../services/reports';

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

export function useReportStatus(id: string | undefined) {
  return useQuery({
    queryKey: ['report-status', id],
    queryFn: () => fetchReportStatus(id as string),
    enabled: Boolean(id),
    retry: false,
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

export function useFilingSuggestions(reportId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['filing-suggestions', reportId],
    queryFn: () => fetchFilingSuggestions(reportId),
    enabled,
  });
}

export function useFilings(reportId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['filings', reportId],
    queryFn: () => fetchFilings(reportId),
    enabled,
  });
}

export function useCreateFiling(reportId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { agency_name: string; agency_url: string; status?: string; reference_number?: string; notes?: string }) =>
      createFiling(reportId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['filings', reportId] }),
  });
}

export function useUpdateFiling(reportId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ filingId, ...payload }: { filingId: string; status?: string; reference_number?: string; notes?: string }) =>
      updateFiling(reportId, filingId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['filings', reportId] }),
  });
}
