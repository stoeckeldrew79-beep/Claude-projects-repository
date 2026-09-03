import { api } from './api';

export interface CountryCount {
  country: string;
  count: number;
}

export async function fetchCountsByCountry() {
  const { data } = await api.get<{ data: CountryCount[] }>('/scams/by-country');
  return data.data;
}
