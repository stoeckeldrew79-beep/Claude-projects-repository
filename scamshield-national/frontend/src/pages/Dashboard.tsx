import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useBillingPortal, useSubscriptionStatus } from '../hooks/useSubscription';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const TIER_LABEL: Record<string, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  family: 'Family',
  business: 'Business',
};

const SHORTCUTS = [
  { to: '/alerts', title: 'Alert settings', body: 'Choose what to watch and how often you hear from us.' },
  { to: '/check-now', title: 'Check something now', body: 'Compare a call, text or message with known scams.' },
  { to: '/todays-scams', title: "Today's scams", body: 'The newest official warnings and headlines.' },
  { to: '/report', title: 'Report a scam', body: 'Tell us what happened — we can file it for you.' },
];

export default function Dashboard() {
  useDocumentMeta({ title: 'Dashboard', description: 'Manage your ScamShield National account.', noindex: true });

  const user = useAuthStore((s) => s.user);
  const { data: subscription, isLoading } = useSubscriptionStatus(Boolean(user));
  const portal = useBillingPortal();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your account</h1>
        <p className="mt-3 text-slate-600">Sign in to manage your scam alerts and billing.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/login?next=/dashboard"
            className="rounded-md bg-[#8a2e2e] px-5 py-2.5 font-semibold text-white hover:bg-[#7a2626]"
          >
            Sign in
          </Link>
          <Link
            to="/login?mode=register&next=/alerts"
            className="rounded-md border border-slate-300 px-5 py-2.5 font-semibold text-slate-800 hover:bg-slate-50"
          >
            Create free account
          </Link>
        </div>
      </div>
    );
  }

  const renews = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-[#8a2e2e]">Your account</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600 break-all">Signed in as {user.email}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl bg-[#0f1a2b] p-6 text-white">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Your plan</h2>
          {isLoading && <div className="mt-3 h-9 w-32 rounded bg-white/10 animate-pulse" />}
          {!isLoading && !subscription && (
            <>
              <p className="mt-2 text-3xl font-bold">Free</p>
              <p className="mt-2 text-sm text-slate-300">
                Monthly digest, one watch profile. Upgrade for daily or instant alerts and family coverage.
              </p>
              <Link
                to="/subscribe"
                className="mt-5 inline-block rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                See plans
              </Link>
            </>
          )}
          {subscription && (
            <>
              <p className="mt-2 flex items-center gap-3 text-3xl font-bold">
                {TIER_LABEL[subscription.tier] ?? subscription.tier}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    subscription.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-200'
                  }`}
                >
                  {subscription.status.replace(/_/g, ' ')}
                </span>
              </p>
              {renews && !Number.isNaN(renews.getTime()) && (
                <p className="mt-2 text-sm text-slate-300">Current period ends {renews.toLocaleDateString()}</p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => portal.mutate()}
                  disabled={portal.isPending}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
                >
                  {portal.isPending ? 'Opening…' : 'Manage billing'}
                </button>
                <Link
                  to="/subscribe"
                  className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Compare plans
                </Link>
              </div>
              {portal.isError && (
                <p role="alert" className="mt-3 text-sm text-red-300">
                  Couldn't open billing right now — please try again.
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {SHORTCUTS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
            >
              <p className="font-semibold text-slate-900 group-hover:text-[#8a2e2e]">{s.title} →</p>
              <p className="mt-1 text-sm text-slate-500">{s.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
