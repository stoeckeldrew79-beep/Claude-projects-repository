import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../hooks/useAuth';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

function errorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { error?: string } } } | null)?.response?.data?.error;
  return message ?? fallback;
}

export default function Login() {
  useDocumentMeta({ title: 'Sign In', description: 'Sign in to your ScamShield National account.', noindex: true });

  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useLogin();
  const register = useRegister();
  const mutation = mode === 'login' ? login : register;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate(
      { email, password },
      { onSuccess: () => navigate('/dashboard') }
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        {mode === 'login' ? 'Sign in' : 'Create an account'}
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button type="button" onClick={() => setMode('register')} className="underline">
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" onClick={() => setMode('login')} className="underline">
              Sign in
            </button>
          </>
        )}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          minLength={mode === 'register' ? 8 : undefined}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {mutation.isError && (
          <p className="text-sm text-red-700">
            {errorMessage(mutation.error, mode === 'login' ? 'Sign in failed.' : 'Registration failed.')}
          </p>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-2 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
        >
          {mutation.isPending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
