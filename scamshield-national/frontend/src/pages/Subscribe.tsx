import { Link } from 'react-router-dom';
import { useCheckout, useSubscriptionStatus } from '../hooks/useSubscription';
import { SubscriptionTier } from '../services/subscriptions';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useAuthStore } from '../store/useAuthStore';

// Every feature listed here is something the backend actually enforces or
// delivers (see backend/src/config/alertTiers.ts for digest frequency and
// watch-profile limits, models/users.ts for who receives real-time email and
// SMS, and middleware/subscription.ts for the subscriber-only alert feed).
const TIERS: {
  tier: SubscriptionTier;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  recommended?: boolean;
}[] = [
  {
    tier: 'basic',
    name: 'Basic',
    price: '$19.99',
    tagline: 'Real-time warnings for your area, by email.',
    features: [
      'Real-time email alerts for your state',
      'Weekly email digest',
      '1 watch profile (state and/or category)',
      'Real-time alert feed on the site',
    ],
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: '$29.99',
    tagline: 'Warnings on your phone the day they land.',
    features: ['Everything in Basic', 'SMS text alerts', 'Daily email digest'],
    recommended: true,
  },
  {
    tier: 'family',
    name: 'Family',
    price: '$39.99',
    tagline: 'Protect the people you worry about.',
    features: [
      'Everything in Pro',
      'Instant digest — within about 20 minutes',
      'Up to 5 watch profiles (e.g. your state and Mom’s)',
    ],
  },
  {
    tier: 'business',
    name: 'Business',
    price: '$99.99',
    tagline: 'Watch every location you operate in.',
    features: ['Everything in Family', 'Up to 20 watch profiles', 'Priority support'],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Is the scam database free?',
    a: 'Yes. Searching the database, Today’s Scams, the Global Map and every article are free for everyone. Email and text alerts are for members — that is what a plan pays for.',
  },
  {
    q: 'Can I cancel any time?',
    a: 'Yes. Manage or cancel your plan from your account page — billing is handled securely by Stripe.',
  },
  {
    q: 'What is a watch profile?',
    a: 'A state and/or scam category you want alerts about — for example “Florida, any category” or “Nationwide, investment scams”. Family and Business plans can hold several, all delivered in one digest.',
  },
  {
    q: 'Where do the alerts come from?',
    a: 'We monitor state Attorney General and federal (DOJ, FTC) publications and news coverage, plus reports from the public, and document new scams in our database. Your alerts are the new entries that match your watch profiles.',
  },
  {
    q: 'Is ScamShield National a government agency?',
    a: 'No. We are a private consumer-protection service, not affiliated with or endorsed by any government body. To report fraud officially in the U.S., use reportfraud.ftc.gov.',
  },
];

function Check({ className = 'text-[#8a2e2e]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`mt-0.5 h-4 w-4 shrink-0 ${className}`} fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Subscribe() {
  useDocumentMeta({
    title: 'Plans & Pricing',
    description:
      'Choose a ScamShield National plan for scam alerts by email and SMS — from a weekly digest to instant alerts for your whole family.',
    path: '/subscribe',
  });

  const user = useAuthStore((s) => s.user);
  const { data: subscription } = useSubscriptionStatus(Boolean(user));
  const currentTier = subscription && subscription.status === 'active' ? subscription.tier : null;
  const checkout = useCheckout();

  return (
    <div>
      <section className="bg-gradient-to-b from-slate-950 to-[#0f1a2b] px-4 pt-14 pb-28 sm:pt-16 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-red-400">Plans &amp; pricing</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl sm:text-5xl font-extrabold tracking-tight">
          Get warned before the scam reaches you — or your family.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300 sm:text-lg">
          The database is free for everyone. A plan delivers new scams matching your state and interests straight to
          your inbox — or your phone.
        </p>
      </section>

      <div className="mx-auto -mt-20 max-w-7xl px-4">
        {checkout.isError && (
          <p
            role="alert"
            className="mx-auto mb-4 max-w-2xl rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700"
          >
            Couldn't start checkout. Please{' '}
            <Link to="/login?next=/subscribe" className="font-medium underline">
              sign in
            </Link>{' '}
            and try again.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
          {TIERS.map((t) => {
            const isCurrent = currentTier === t.tier;
            return (
              <div
                key={t.tier}
                className={`relative flex flex-col rounded-2xl bg-white p-6 shadow-sm ${
                  t.recommended
                    ? 'border-2 border-[#8a2e2e] shadow-xl shadow-red-900/10 lg:-mt-3 lg:pb-9'
                    : 'border border-slate-200'
                }`}
              >
                {t.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#8a2e2e] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    Recommended
                  </span>
                )}
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">{t.name}</h2>
                  {isCurrent && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800">
                      Your plan
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">{t.tagline}</p>
                <p className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">{t.price}</span>
                  <span className="text-sm text-slate-500">/month</span>
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-700">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => checkout.mutate(t.tier)}
                  disabled={checkout.isPending || isCurrent}
                  className={`mt-7 w-full rounded-md py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                    t.recommended
                      ? 'bg-[#8a2e2e] text-white hover:bg-[#7a2626]'
                      : 'border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {checkout.isPending && checkout.variables === t.tier
                    ? 'Redirecting…'
                    : isCurrent
                      ? 'Current plan'
                      : `Choose ${t.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {!user && (
          <p className="mt-6 text-center text-sm text-slate-500">
            You'll need a free account to subscribe.{' '}
            <Link to="/login?next=/subscribe" className="font-medium text-slate-800 underline">
              Sign in
            </Link>{' '}
            or{' '}
            <Link to="/login?mode=register&next=/subscribe" className="font-medium text-slate-800 underline">
              create one
            </Link>{' '}
            first.
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Not ready for a plan? Start free.</h2>
            <p className="mt-1 text-sm text-slate-600">
              A free account opens the full scam database and every live feed. Alerts by email and text start when
              you choose a plan.
            </p>
          </div>
          <Link
            to={user ? '/database' : '/login?mode=register&next=/database'}
            className="shrink-0 rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-800"
          >
            {user ? 'Browse the database' : 'Create free account'}
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
          <li className="flex gap-2.5">
            <Check className="text-slate-500" />
            <span>
              <strong className="font-semibold text-slate-900">Cancel any time.</strong> No contracts — manage your plan
              from your account.
            </span>
          </li>
          <li className="flex gap-2.5">
            <Check className="text-slate-500" />
            <span>
              <strong className="font-semibold text-slate-900">Secure checkout.</strong> Payments are processed by
              Stripe; we never see your card number.
            </span>
          </li>
          <li className="flex gap-2.5">
            <Check className="text-slate-500" />
            <span>
              <strong className="font-semibold text-slate-900">Independent.</strong> A private service — not a
              government agency.
            </span>
          </li>
        </ul>

        <section aria-labelledby="faq-heading" className="mx-auto mt-16 max-w-3xl">
          <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-slate-900 text-center">
            Questions, answered
          </h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {FAQ.map((item) => (
              <details key={item.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-xl leading-none text-slate-400 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
