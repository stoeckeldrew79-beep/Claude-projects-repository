import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLogin, useRegister } from '../hooks/useAuth';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { ShieldLogo } from '../components/ShieldLogo';

function errorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { error?: string } } } | null)?.response?.data?.error;
  return message ?? fallback;
}

// Only same-site paths are honoured as a post-sign-in destination, so a
// crafted ?next= link can't bounce someone off to another website.
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return '/dashboard';
  return raw;
}

const BENEFITS = [
  'Email alerts for your state and the scam types you choose',
  'A free monthly digest of newly documented scams',
  'Upgrade any time for faster alerts and family coverage',
];

export default function Login() {
  const [params, setParams] = useSearchParams();
  const mode: 'login' | 'register' = params.get('mode') === 'register' ? 'register' : 'login';
  const next = safeNext(params.get('next'));

  useDocumentMeta({
    title: mode === 'login' ? 'Sign In' : 'Create an Account',
    description: 'Sign in to your ScamShield National account.',
    noindex: true,
  });

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();
  const register = useRegister();
  const mutation = mode === 'login' ? login : register;

  function setMode(m: 'login' | 'register') {
    const p = new URLSearchParams(params);
    if (m === 'register') p.set('mode', 'register');
    else p.delete('mode');
    setParams(p, { replace: true });
    login.reset();
    register.reset();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({ email, password }, { onSuccess: () => navigate(next) });
  }

  const tabClass = (active: boolean) =>
    `flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
      active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
    }`;

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-2 lg:items-center">
      <div className="order-2 lg:order-1 hidden sm:block">
        <p className="text-xs font-bold uppercase tracking-widest text-[#8a2e2e]">Your ScamShield account</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Stay a step ahead of the scams aimed at you.
        </h2>
        <ul className="mt-6 space-y-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex gap-3 text-slate-700">
              <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-[#8a2e2e]" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-slate-500">
          ScamShield National is a private consumer-protection service, not a government agency.
        </p>
      </div>

      <div className="order-1 lg:order-2 mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldLogo className="h-8 w-8" />
          <span className="font-bold text-slate-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            ScamShield National
          </span>
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          {mode === 'login' ? 'Welcome back' : 'Create your free account'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === 'login' ? 'Sign in to manage your alerts and plan.' : 'Takes 30 seconds. No card needed.'}
        </p>

        <div className="mt-6 flex rounded-lg bg-slate-100 p-1" role="group" aria-label="Choose sign in or create account">
          <button type="button" aria-pressed={mode === 'login'} onClick={() => setMode('login')} className={tabClass(mode === 'login')}>
            Sign in
          </button>
          <button
            type="button"
            aria-pressed={mode === 'register'}
            onClick={() => setMode('register')}
            className={tabClass(mode === 'register')}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="login-email"
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="login-password"
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={mode === 'register' ? 8 : undefined}
              aria-describedby={mode === 'register' ? 'password-hint' : undefined}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
            />
            {mode === 'register' && (
              <p id="password-hint" className="mt-1 text-xs text-slate-500">
                At least 8 characters.
              </p>
            )}
          </div>
          {mutation.isError && (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage(mutation.error, mode === 'login' ? 'Sign in failed.' : 'Registration failed.')}
            </p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-md bg-[#8a2e2e] py-2.5 text-sm font-semibold text-white hover:bg-[#7a2626] disabled:opacity-50"
          >
            {mutation.isPending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create free account'}
          </button>
        </form>

        {mode === 'register' && (
          <p className="mt-4 text-xs text-slate-500">
            Want faster alerts? You can pick a plan after signing up —{' '}
            <Link to="/subscribe" className="underline hover:text-slate-800">
              see plans
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
