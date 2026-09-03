import { api } from './api';
import { User } from '../types';

export interface AuthResponse {
  data: User;
  token: string;
}

export async function registerAccount(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/register', { email, password });
  return data;
}

export async function loginAccount(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}
