import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '../services/alerts';

export function useAlerts(params: { state?: string; zip?: string } = {}, enabled = true) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => fetchAlerts(params),
    enabled,
    // A 401/403 ("not on your plan") won't change on retry — show the
    // upgrade message straight away instead of "Loading…" through three
    // retries. Other errors still get the default retries.
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 3;
    },
  });
}
