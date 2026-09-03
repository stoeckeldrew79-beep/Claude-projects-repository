import { useQuery } from '@tanstack/react-query';
import { fetchCountsByCountry } from '../services/globe';

export function useCountsByCountry() {
  return useQuery({
    queryKey: ['scams-by-country'],
    queryFn: fetchCountsByCountry,
  });
}
