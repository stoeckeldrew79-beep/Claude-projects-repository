// Pricing table + Stripe Checkout — full implementation lands in Phase 2
// (spec section 5.1) once STRIPE_PRICE_* env vars are configured.
const TIERS = [
  { name: 'Basic', price: '$4/mo', features: ['Monthly digest email', 'Full database access'] },
  { name: 'Pro', price: '$9/mo', features: ['Everything in Basic', 'Real-time email alerts'] },
  { name: 'Family', price: '$15/mo', features: ['Everything in Pro', 'Up to 5 members', 'SMS alerts'] },
  { name: 'Business', price: '$49/mo', features: ['Everything in Family', 'API access', 'Priority support'] },
];

export default function Subscribe() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Choose your plan</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">{tier.name}</h2>
            <p className="text-2xl font-bold mt-1">{tier.price}</p>
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              {tier.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button className="mt-5 w-full py-2 rounded-md bg-slate-900 text-white text-sm font-medium">
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
