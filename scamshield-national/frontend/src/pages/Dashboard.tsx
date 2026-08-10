import { useAuthStore } from '../store/useAuthStore';
import { useBillingPortal, useSubscriptionStatus } from '../hooks/useSubscription';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Dashboard() {
  useDocumentMeta({ title: 'Dashboard', description: 'Manage your ScamShield National account.', noindex: true });

  const user = useAuthStore((s) => s.user);
  const { data: subscription, isLoading } = useSubscriptionStatus();
  const portal = useBillingPortal();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Sign in to manage your alerts and billing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">Signed in as {user.email}.</p>

      <div className="mt-8 rounded-lg border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900">Subscription</h2>
        {isLoading && <p className="text-sm text-slate-500 mt-2">Loading…</p>}
        {!isLoading && !subscription && (
          <p className="text-sm text-slate-600 mt-2">
            You're on the free plan. <a href="/subscribe" className="underline">Upgrade</a>.
          </p>
        )}
        {subscription && (
          <>
            <p className="text-sm text-slate-600 mt-2">
              {subscription.tier} — {subscription.status}
            </p>
            <button
              onClick={() => portal.mutate()}
              disabled={portal.isPending}
              className="mt-4 px-4 py-2 rounded-md border border-slate-300 text-sm font-medium disabled:opacity-50"
            >
              {portal.isPending ? 'Opening…' : 'Manage billing'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
