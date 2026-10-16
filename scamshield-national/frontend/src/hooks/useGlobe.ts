import { useQuery } from '@tanstack/react-query';
import { fetchCountsByCountry } from '../services/globe';

export function useCountsByCountry() {
  return useQuery({
    queryKey: ['scams-by-country'],
    queryFn: fetchCountsByCountry,
    // Per-country totals move a few times a day; no need to refetch on
    // every tab focus on a phone.
    staleTime: 5 * 60 * 1000,
  });
}
