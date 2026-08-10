// Subscriber-only real-time alert feed — full implementation lands in
// Phase 3 alongside the Twilio/SendGrid alert broadcast (spec section 7).
export default function Alerts() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
      <p className="mt-2 text-slate-600">Real-time scam alerts for subscribers. Coming in Phase 3.</p>
    </div>
  );
}
