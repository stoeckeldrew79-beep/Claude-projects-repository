import { useQuery } from '@tanstack/react-query';
import { fetchAgFeedStatus, fetchStateAgSources } from '../services/stateAgSources';

export function useStateAgSources() {
  return useQuery({
    queryKey: ['state-ag-sources'],
    queryFn: fetchStateAgSources,
  });
}

// Feed health per state. Decorative on the pages that use it (a "Live feed"
// badge), so a failure is swallowed: no retries, and callers treat missing
// data as "unknown", never as "down".
export function useAgFeedStatus() {
  return useQuery({
    queryKey: ['daily-news', 'ag-status'],
    queryFn: fetchAgFeedStatus,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

// A feed counts as live when the engine read the state's own site
// successfully in the last two days — the scan runs several times a day, so
// anything older means it has been failing, whatever last_error says.
export function isFeedLive(row: { last_success_at: string | null } | undefined): boolean {
  if (!row?.last_success_at) return false;
  return Date.now() - new Date(row.last_success_at).getTime() < 48 * 60 * 60 * 1000;
}
