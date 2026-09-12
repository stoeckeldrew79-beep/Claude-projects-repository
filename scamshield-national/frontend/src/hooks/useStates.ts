import { useQuery } from '@tanstack/react-query';
import { fetchStateBySlug, fetchStates } from '../services/states';

export function useStates() {
  return useQuery({ queryKey: ['states'], queryFn: fetchStates });
}

export function useStateDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ['state', slug],
    queryFn: () => fetchStateBySlug(slug as string),
    enabled: Boolean(slug),
    retry: false,
  });
}
