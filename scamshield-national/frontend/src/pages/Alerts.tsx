import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { useAuthStore } from '../store/useAuthStore';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const ALERT_COLORS: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export default function Alerts() {
  useDocumentMeta({
    title: 'Alerts',
    description: 'Real-time scam alerts for ScamShield National subscribers.',
    noindex: true,
  });

  const [state, setState] = useState('');
  const user = useAuthStore((s) => s.user);
  const { data: alerts, isLoading, isError, error } = useAlerts({ state: state || undefined }, Boolean(user));

  const isForbidden = (error as { response?: { status?: number } } | null)?.response?.status === 403;

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
        <p className="mt-2 text-slate-600">Sign in to see real-time scam alerts.</p>
      </div>
    );
  }

  if (isForbidden) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
        <p className="mt-2 text-slate-600">
          Real-time alerts are a subscriber feature.{' '}
          <a href="/subscribe" className="underline">
            Upgrade your plan
          </a>{' '}
          to unlock this feed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Alerts</h1>

      <input
        value={state}
        onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
        placeholder="Filter by state (e.g. FL)"
        className="mb-6 rounded-md border border-slate-300 px-3 py-2 text-sm w-48"
      />

      {isLoading && <p className="text-slate-500">Loading…</p>}
      {isError && !isForbidden && <p className="text-red-700">Couldn't load alerts.</p>}

      <div className="space-y-3">
        {alerts?.map((alert) => (
          <div key={alert.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{alert.title}</h3>
              {alert.alert_level && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ALERT_COLORS[alert.alert_level]}`}>
                  {alert.alert_level}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1">{alert.body}</p>
            <p className="text-xs text-slate-400 mt-2">{new Date(alert.sent_at).toLocaleString()}</p>
          </div>
        ))}
        {alerts && alerts.length === 0 && <p className="text-slate-500">No alerts yet.</p>}
      </div>
    </div>
  );
}
