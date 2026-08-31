import { useQuery } from '@tanstack/react-query';
import { fetchStateAgSources } from '../services/stateAgSources';

export function useStateAgSources() {
  return useQuery({
    queryKey: ['state-ag-sources'],
    queryFn: fetchStateAgSources,
  });
}
