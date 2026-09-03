import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { approveDraft, discardDraft, fetchDraftArticles } from '../services/drafts';

export function useDraftArticles(enabled: boolean) {
  return useQuery({
    queryKey: ['articles', 'drafts'],
    queryFn: fetchDraftArticles,
    enabled,
  });
}

export function useApproveDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...edits }: { id: string; title?: string; body?: string }) => approveDraft(id, edits),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles', 'drafts'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useDiscardDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => discardDraft(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles', 'drafts'] }),
  });
}
