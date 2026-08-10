import { useCheckout } from '../hooks/useSubscription';
import { SubscriptionTier } from '../services/subscriptions';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const TIERS: { tier: SubscriptionTier; name: string; price: string; features: string[] }[] = [
  { tier: 'basic', name: 'Basic', price: '$4/mo', features: ['Monthly digest email', 'Full database access'] },
  { tier: 'pro', name: 'Pro', price: '$9/mo', features: ['Everything in Basic', 'Real-time email alerts'] },
  {
    tier: 'family',
    name: 'Family',
    price: '$15/mo',
    features: ['Everything in Pro', 'Up to 5 members', 'SMS alerts'],
  },
  {
    tier: 'business',
    name: 'Business',
    price: '$49/mo',
    features: ['Everything in Family', 'API access', 'Priority support'],
  },
];

export default function Subscribe() {
  useDocumentMeta({
    title: 'Subscribe',
    description: 'Choose a ScamShield National plan for real-time scam alerts by SMS and email.',
    path: '/subscribe',
  });

  const checkout = useCheckout();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Choose your plan</h1>
      {checkout.isError && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          Couldn't start checkout. Please sign in and try again.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => (
          <div key={t.tier} className="rounded-lg border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">{t.name}</h2>
            <p className="text-2xl font-bold mt-1">{t.price}</p>
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              {t.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              onClick={() => checkout.mutate(t.tier)}
              disabled={checkout.isPending}
              className="mt-5 w-full py-2 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
            >
              {checkout.isPending && checkout.variables === t.tier ? 'Redirecting…' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
