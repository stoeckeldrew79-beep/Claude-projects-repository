import { Link } from 'react-router-dom';
import { useScams } from '../hooks/useScams';
import { Marquee } from './magicui/marquee';

// Home page "live ticker" per spec section 6. Deliberately built from
// public scam data (not GET /alerts, which is subscriber-gated) so
// anonymous visitors don't get the paid real-time alert feature for
// free — this is a teaser that drives the Subscribe CTA, not the feed.
export function AlertTicker() {
  const { data: scams } = useScams({ sort: 'alert_level', page: 1 });
  const highlighted = scams?.filter((s) => s.alert_level === 'high' || s.alert_level === 'critical');

  if (!highlighted || highlighted.length === 0) return null;

  return (
    <div className="border-y border-slate-200 bg-slate-50 [--duration:28s]">
      <Marquee pauseOnHover repeat={3} className="py-2">
        {highlighted.map((scam) => (
          <Link
            key={scam.id}
            to={`/scams/${scam.slug}`}
            className="text-sm whitespace-nowrap text-slate-700 hover:text-slate-900"
          >
            <span
              className={`font-semibold mr-1.5 ${scam.alert_level === 'critical' ? 'text-red-700' : 'text-orange-700'}`}
            >
              {scam.alert_level?.toUpperCase()}
            </span>
            {scam.name}
          </Link>
        ))}
      </Marquee>
    </div>
  );
}
