import { Link } from 'react-router-dom';
import { Scam } from '../types';
import { countryName } from '../utils/countries';

const ALERT_COLORS: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export function ScamCard({ scam }: { scam: Scam }) {
  return (
    <Link
      to={`/scams/${scam.slug}`}
      className="block rounded-lg border border-slate-200 p-4 hover:border-slate-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{scam.name}</h3>
        {scam.alert_level && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ALERT_COLORS[scam.alert_level]}`}>
            {scam.alert_level}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{scam.description}</p>
      {scam.country && (
        <p className="text-xs text-slate-400 mt-2">{countryName(scam.country)}</p>
      )}
    </Link>
  );
}
