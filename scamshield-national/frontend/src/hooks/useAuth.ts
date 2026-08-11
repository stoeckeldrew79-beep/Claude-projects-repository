import { useMutation } from '@tanstack/react-query';
import { loginAccount, registerAccount } from '../services/auth';
import { useAuthStore } from '../store/useAuthStore';

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => registerAccount(email, password),
    onSuccess: (res) => setSession(res.data, res.token),
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginAccount(email, password),
    onSuccess: (res) => setSession(res.data, res.token),
  });
}
