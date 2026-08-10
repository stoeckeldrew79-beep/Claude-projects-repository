import { useScams } from '../hooks/useScams';

// Home page "live ticker" per spec section 6. Deliberately built from
// public scam data (not GET /alerts, which is subscriber-gated) so
// anonymous visitors don't get the paid real-time alert feature for
// free — this is a teaser that drives the Subscribe CTA, not the feed.
export function AlertTicker() {
  const { data: scams } = useScams({ sort: 'alert_level', page: 1 });
  const highlighted = scams?.filter((s) => s.alert_level === 'high' || s.alert_level === 'critical');

  if (!highlighted || highlighted.length === 0) return null;

  return (
    <div className="border-y border-slate-200 bg-slate-50 py-2 overflow-x-auto">
      <div className="flex gap-6 px-4 text-sm whitespace-nowrap">
        {highlighted.map((scam) => (
          <span key={scam.id} className="text-slate-700">
            <span className="font-semibold text-red-700 mr-1">{scam.alert_level?.toUpperCase()}</span>
            {scam.name}
          </span>
        ))}
      </div>
    </div>
  );
}
