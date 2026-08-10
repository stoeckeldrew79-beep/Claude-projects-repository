import { useAuthStore } from '../store/useAuthStore';

// Subscriber portal — full billing/alert-preferences wiring lands in
// Phase 2 alongside the Stripe billing portal (spec section 5.1).
export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      {user ? (
        <p className="mt-2 text-slate-600">Signed in as {user.email}.</p>
      ) : (
        <p className="mt-2 text-slate-600">Sign in to manage your alerts and billing.</p>
      )}
    </div>
  );
}
