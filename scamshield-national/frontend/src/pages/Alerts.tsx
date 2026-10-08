import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlerts } from '../hooks/useAlerts';
import { useAuthStore } from '../store/useAuthStore';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useCategories } from '../hooks/useScams';
import {
  useAlertPreferences,
  useAlertWatchProfiles,
  useCreateWatchProfile,
  useDeleteWatchProfile,
  useUpdateAlertFrequency,
} from '../hooks/useAlertSubscriptions';
import { AlertFrequency } from '../services/alertSubscriptions';

const ALERT_COLORS: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const FREQUENCY_RANK: Record<AlertFrequency, number> = { monthly: 0, weekly: 1, daily: 2, instant: 3 };

const FREQUENCY_OPTIONS: { value: AlertFrequency; label: string; blurb: string }[] = [
  { value: 'monthly', label: 'Monthly', blurb: 'One email a month' },
  { value: 'weekly', label: 'Weekly', blurb: 'Once a week' },
  { value: 'daily', label: 'Daily', blurb: 'Once a day' },
  { value: 'instant', label: 'Instant', blurb: 'Within ~20 minutes' },
];

function extractErrorMessage(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
  return message ?? fallback;
}

function AlertPreferencesPanel() {
  const { data, isLoading } = useAlertPreferences();
  const updateFrequency = useUpdateAlertFrequency();
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <p className="text-sm text-slate-500">Loading your alert settings…</p>;
  if (!data) return null;

  const maxRank = FREQUENCY_RANK[data.maxFrequency];

  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-900">How often do you want alerts?</h2>
      <p className="mt-1 text-sm text-slate-500">
        We'll email you when something new matches what you're watching below.
      </p>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FREQUENCY_OPTIONS.map((opt) => {
          const locked = FREQUENCY_RANK[opt.value] > maxRank;
          const active = data.data.frequency === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={locked || updateFrequency.isPending}
              onClick={() => {
                setError(null);
                updateFrequency.mutate(opt.value, {
                  onError: (err) => setError(extractErrorMessage(err, "Couldn't update that — try again.")),
                });
              }}
              className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                active ? 'border-[#8a2e2e] bg-[#8a2e2e]/5' : 'border-slate-200'
              } ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-400'}`}
            >
              <div className="font-medium text-slate-900">
                {opt.label}
                {locked && ' 🔒'}
              </div>
              <div className="text-xs text-slate-500">{opt.blurb}</div>
            </button>
          );
        })}
      </div>

      {maxRank < FREQUENCY_RANK.instant && (
        <p className="mt-3 text-sm text-slate-600">
          Want faster alerts?{' '}
          <Link to="/subscribe" className="underline">
            Upgrade your plan
          </Link>
          .
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}

function WatchProfilesPanel() {
  const { data: profiles, isLoading } = useAlertWatchProfiles();
  const { data: categories } = useCategories();
  const createProfile = useCreateWatchProfile();
  const deleteProfile = useDeleteWatchProfile();

  const [label, setLabel] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createProfile.mutateAsync({
        label: label || undefined,
        state: state || undefined,
        category: category || undefined,
      });
      setLabel('');
      setState('');
      setCategory('');
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't add that — try again."));
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-900">What are you watching?</h2>
      <p className="mt-1 text-sm text-slate-500">
        Add a state and/or category. Plans that cover more than one profile let you watch your own state and a
        family member's — all in one digest, one membership.
      </p>

      {isLoading && <p className="mt-3 text-sm text-slate-500">Loading…</p>}

      <div className="mt-4 space-y-2">
        {profiles?.map((profile) => {
          const categoryName = categories?.find((c) => c.id === profile.category_id)?.name;
          return (
            <div
              key={profile.id}
              className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2"
            >
              <div className="text-sm">
                <span className="font-medium text-slate-900">{profile.label || 'Untitled'}</span>
                <span className="text-slate-500">
                  {' — '}
                  {profile.state ?? 'Nationwide'}
                  {categoryName ? ` · ${categoryName}` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => deleteProfile.mutate(profile.id)}
                className="text-xs text-slate-400 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          );
        })}
        {profiles && profiles.length === 0 && <p className="text-sm text-slate-500">Nothing set up yet.</p>}
      </div>

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-2">
        <div>
          <label className="block text-xs text-slate-500">Label (optional)</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Mom"
            className="mt-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm w-28"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">State</label>
          <input
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
            placeholder="FL"
            className="mt-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm w-20"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={createProfile.isPending}
          className="rounded-md bg-[#8a2e2e] text-white text-sm font-medium px-4 py-1.5 disabled:opacity-50"
        >
          {createProfile.isPending ? 'Adding…' : 'Add'}
        </button>
      </form>
      {formError && <p className="mt-2 text-sm text-red-700">{formError}</p>}
    </div>
  );
}

export default function Alerts() {
  useDocumentMeta({
    title: 'Alerts',
    description: 'Set up scam alerts for your state and category, and browse real-time alerts for subscribers.',
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
        <p className="mt-2 text-slate-600">
          <Link to="/login" className="underline">
            Sign in
          </Link>{' '}
          to set up scam alerts and see the real-time feed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Alerts</h1>
      <p className="text-sm text-slate-500 mb-6">Tell us what to watch for, and how often to hear from us.</p>

      <AlertPreferencesPanel />
      <WatchProfilesPanel />

      <div className="mt-10">
        <h2 className="font-semibold text-slate-900 mb-3">Real-time alert feed</h2>

        <input
          value={state}
          onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
          placeholder="Filter by state (e.g. FL)"
          className="mb-6 rounded-md border border-slate-300 px-3 py-2 text-sm w-48"
        />

        {isForbidden && (
          <p className="text-slate-600">
            The real-time feed is a Pro-and-above feature.{' '}
            <Link to="/subscribe" className="underline">
              Upgrade your plan
            </Link>{' '}
            to unlock it — your alert preferences above still work on any plan.
          </p>
        )}

        {!isForbidden && (
          <>
            {isLoading && <p className="text-slate-500">Loading…</p>}
            {isError && <p className="text-red-700">Couldn't load alerts.</p>}

            <div className="space-y-3">
              {alerts?.map((alert) => (
                <div key={alert.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                    {alert.alert_level && (
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${ALERT_COLORS[alert.alert_level]}`}
                      >
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
          </>
        )}
      </div>
    </div>
  );
}
