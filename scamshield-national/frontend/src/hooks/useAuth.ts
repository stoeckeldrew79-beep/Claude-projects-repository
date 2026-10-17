import { useMutation } from '@tanstack/react-query';
import { loginAccount, registerAccount, updateMyProfile } from '../services/auth';
import { useAuthStore } from '../store/useAuthStore';

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: ({ email, password, zipCode }: { email: string; password: string; zipCode?: string }) =>
      registerAccount(email, password, zipCode),
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

// Saves profile fields (home ZIP/state, email opt-in) and keeps the signed-in
// user in the auth store current, so every page sees the new home state.
export function useUpdateProfile() {
  const token = useAuthStore((s) => s.token);
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (user) => {
      if (token) setSession(user, token);
    },
  });
}
