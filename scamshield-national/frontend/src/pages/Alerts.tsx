import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlerts } from '../hooks/useAlerts';
import { useAuthStore } from '../store/useAuthStore';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { HomeAreaCard } from '../components/HomeAreaCard';
import { stateName, US_STATE_OPTIONS } from '../utils/usStates';
import { useCategories } from '../hooks/useScams';
import {
  useAlertPreferences,
  useAlertWatchProfiles,
  useCreateWatchProfile,
  useDeleteWatchProfile,
  useUpdateAlertFrequency,
} from '../hooks/useAlertSubscriptions';
import { AlertFrequency } from '../services/alertSubscriptions';
import { OfficialAlertsList } from '../components/home/OfficialAlertsList';

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
                  {profile.state ? stateName(profile.state) : 'Nationwide'}
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
          <label htmlFor="watch-state" className="block text-xs text-slate-500">State</label>
          <select
            id="watch-state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="">Nationwide only</option>
            {US_STATE_OPTIONS.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
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

const STEPS = [
  {
    title: 'Choose what to watch',
    body: 'Pick a state, a scam category, or both — like "Florida, government impersonation". Family plans can watch up to five places at once.',
  },
  {
    title: 'We watch the sources',
    body: 'Around the clock we track state Attorney General and federal (DOJ, FTC) publications and news coverage, and document new scams in our database.',
  },
  {
    title: 'You get an email',
    body: 'When a newly documented scam matches your watch list, it lands in your inbox — monthly on a free account, up to within about 20 minutes on Family.',
  },
];

const CADENCE: { plan: string; price: string; cadence: string; profiles: string; highlight?: boolean }[] = [
  { plan: 'Free account', price: '$0', cadence: 'Monthly digest', profiles: '1 watch profile' },
  { plan: 'Basic', price: '$4/mo', cadence: 'Up to weekly', profiles: '1 watch profile' },
  { plan: 'Pro', price: '$9/mo', cadence: 'Up to daily', profiles: '1 watch profile', highlight: true },
  { plan: 'Family', price: '$15/mo', cadence: 'Instant (~20 min)', profiles: 'Up to 5 watch profiles' },
];

function AlertsLanding() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-[#0f1a2b] px-4 py-16 sm:py-20 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-red-600/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">Scam alerts</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
              Hear about the scam <span className="text-red-500">before it reaches you.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Tell us your state and the scams you worry about. We monitor official Attorney General and federal
              warnings and email you when something new matches.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login?mode=register&next=/alerts"
                className="rounded-md bg-red-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-red-950/50 hover:bg-red-500"
              >
                Create free account
              </Link>
              <Link
                to="/subscribe"
                className="rounded-md border border-white/20 bg-white/5 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
              >
                See plans
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Free to start · no card needed ·{' '}
              <Link to="/login?next=/alerts" className="text-slate-200 underline hover:text-white">
                Already a member? Sign in
              </Link>
            </p>
          </div>

          {/* A mock of the email, built only from the steps above — no fake data. */}
          <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#8a2e2e] text-sm font-bold text-white">
                S
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">ScamShield National alerts</p>
                <p className="truncate text-xs text-slate-500">New scams matching your watch list</p>
              </div>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2.5">
                <dt className="text-slate-500">Watching</dt>
                <dd className="font-medium text-right">Your state · any category</dd>
              </div>
              <div className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2.5">
                <dt className="text-slate-500">Sources</dt>
                <dd className="font-medium text-right">State AG · DOJ · FTC · news</dd>
              </div>
              <div className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2.5">
                <dt className="text-slate-500">Delivery</dt>
                <dd className="font-medium text-right">Monthly → instant, by plan</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              Each alert links to the full write-up and the official source behind it.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-4 py-14">
        <h2 id="how-heading" className="text-2xl font-bold tracking-tight text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0f1a2b] text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="preview-heading" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8a2e2e]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Live preview
            </p>
            <h2 id="preview-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              What officials are warning about right now
            </h2>
            <p className="mt-3 text-slate-600">
              These are real, recent publications from state Attorneys General and federal agencies — the same
              sources we watch for you. Members hear about the ones that matter to them without checking dozens of
              government websites.
            </p>
            <Link
              to="/login?mode=register&next=/alerts"
              className="mt-6 inline-block rounded-md bg-[#8a2e2e] px-5 py-2.5 font-semibold text-white hover:bg-[#7a2626]"
            >
              Start watching — free
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <OfficialAlertsList limit={6} compact />
          </div>
        </div>
      </section>

      <section aria-labelledby="cadence-heading" className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="cadence-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            How fast you hear about it
          </h2>
          <Link to="/subscribe" className="text-sm font-medium text-[#8a2e2e] hover:underline">
            Compare all plans →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CADENCE.map((c) => (
            <div
              key={c.plan}
              className={`rounded-xl border p-5 ${
                c.highlight ? 'border-[#8a2e2e] bg-red-50/50 ring-1 ring-[#8a2e2e]' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-semibold text-slate-900">{c.plan}</p>
                <p className="text-sm text-slate-500">{c.price}</p>
              </div>
              <p className="mt-3 text-lg font-bold text-slate-900">{c.cadence}</p>
              <p className="text-sm text-slate-500">{c.profiles}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-500">
          ScamShield National is a private consumer-protection service, not a government agency. Unsubscribe or
          cancel any time.
        </p>
      </section>
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

  if (!user) return <AlertsLanding />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Alerts</h1>
      <p className="text-sm text-slate-500 mb-6">Tell us what to watch for, and how often to hear from us.</p>

      <div className="mb-6">
        <HomeAreaCard prominent />
      </div>
      <AlertPreferencesPanel />
      <WatchProfilesPanel />

      <div className="mt-10">
        <h2 className="font-semibold text-slate-900 mb-3">Real-time alert feed</h2>

        <label htmlFor="feed-state" className="sr-only">Filter by state</label>
        <select
          id="feed-state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="mb-6 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All states</option>
          {US_STATE_OPTIONS.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        {isForbidden && (
          <p className="text-slate-600">
            The real-time feed is included with every paid plan.{' '}
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
