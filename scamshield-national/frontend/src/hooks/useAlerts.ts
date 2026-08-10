import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '../services/alerts';

export function useAlerts(params: { state?: string; zip?: string } = {}, enabled = true) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => fetchAlerts(params),
    enabled,
  });
}
