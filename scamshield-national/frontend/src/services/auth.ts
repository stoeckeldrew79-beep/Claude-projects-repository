import { api } from './api';
import { User } from '../types';

export interface AuthResponse {
  data: User;
  token: string;
}

// zipCode is optional: when given, the account's home state is set from it
// at signup so state alerts work from day one.
export async function registerAccount(email: string, password: string, zipCode?: string) {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
    ...(zipCode ? { zip_code: zipCode } : {}),
  });
  return data;
}

export async function loginAccount(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export interface HomeAreaUpdate {
  zip_code?: string | null;
  state?: string | null;
}

export async function updateMyProfile(
  update: HomeAreaUpdate & { email_opt_in?: boolean; phone?: string | null; sms_opt_in?: boolean }
) {
  const { data } = await api.put<{ data: User }>('/users/me', update);
  return data.data;
}
