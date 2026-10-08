import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertFrequency,
  createWatchProfile,
  deleteWatchProfile,
  fetchPreferences,
  fetchWatchProfiles,
  updatePreferences,
} from '../services/alertSubscriptions';

export function useAlertPreferences(enabled = true) {
  return useQuery({
    queryKey: ['alert-preferences'],
    queryFn: fetchPreferences,
    enabled,
  });
}

export function useUpdateAlertFrequency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (frequency: AlertFrequency) => updatePreferences(frequency),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alert-preferences'] }),
  });
}

export function useAlertWatchProfiles(enabled = true) {
  return useQuery({
    queryKey: ['alert-watch-profiles'],
    queryFn: fetchWatchProfiles,
    enabled,
  });
}

export function useCreateWatchProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWatchProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alert-watch-profiles'] }),
  });
}

export function useDeleteWatchProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWatchProfile(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alert-watch-profiles'] }),
  });
}
