import { api } from './api';
import { StateAgSource } from '../types';

export async function fetchStateAgSources() {
  const { data } = await api.get<{ data: StateAgSource[] }>('/state-ag-sources');
  return data.data;
}
