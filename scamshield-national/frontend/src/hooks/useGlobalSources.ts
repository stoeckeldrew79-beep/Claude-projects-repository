import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createGlobalStat, deleteGlobalStat, fetchGlobalSources, NewGlobalStat } from '../services/globalSources';

export function useGlobalSources() {
  return useQuery({
    queryKey: ['global-sources'],
    queryFn: fetchGlobalSources,
  });
}

export function useCreateGlobalStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stat: NewGlobalStat) => createGlobalStat(stat),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['global-sources'] }),
  });
}

export function useDeleteGlobalStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGlobalStat(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['global-sources'] }),
  });
}
