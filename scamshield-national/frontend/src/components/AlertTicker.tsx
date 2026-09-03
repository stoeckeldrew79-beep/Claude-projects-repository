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
    <div className="flex items-stretch bg-red-700 text-white [--duration:28s]">
      <div className="hidden sm:flex items-center gap-1.5 shrink-0 px-4 py-2 bg-red-800 text-xs font-bold tracking-wider uppercase">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        Live Alerts
      </div>
      <Marquee pauseOnHover repeat={3} className="py-2">
        {highlighted.map((scam) => (
          <Link
            key={scam.id}
            to={`/scams/${scam.slug}`}
            className="text-sm whitespace-nowrap text-white/90 hover:text-white"
          >
            <span
              className={`font-bold mr-1.5 px-1.5 py-0.5 rounded ${scam.alert_level === 'critical' ? 'bg-white text-red-700' : 'bg-red-900 text-white'}`}
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
