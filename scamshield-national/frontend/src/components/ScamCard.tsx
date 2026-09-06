import { Link } from 'react-router-dom';
import { Scam } from '../types';
import { countryName } from '../utils/countries';
import { tagShortLabel } from '../utils/scamTags';

const ALERT_COLORS: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const ALERT_BORDER_COLORS: Record<string, string> = {
  low: 'border-l-slate-300',
  medium: 'border-l-yellow-400',
  high: 'border-l-orange-500',
  critical: 'border-l-red-600',
};

export function ScamCard({ scam }: { scam: Scam }) {
  const borderColor = scam.is_historical
    ? 'border-l-slate-400'
    : scam.alert_level
      ? ALERT_BORDER_COLORS[scam.alert_level]
      : 'border-l-slate-200';
  const firstRecordedYear = scam.first_recorded ? new Date(scam.first_recorded).getUTCFullYear() : null;

  return (
    <Link
      to={`/scams/${scam.slug}`}
      className={`block rounded-lg border border-slate-200 border-l-4 ${borderColor} p-4 hover:shadow-sm transition-all`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{scam.name}</h3>
        {scam.is_historical ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
            Historical
          </span>
        ) : (
          scam.alert_level && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${ALERT_COLORS[scam.alert_level]}`}>
              {scam.alert_level}
            </span>
          )
        )}
      </div>
      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{scam.description}</p>
      {/* Who it targets, when the source says so. Kept visually quieter than
          the alert level: it is context, not severity. */}
      {scam.tags && scam.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {scam.tags.map((t) => (
            <span
              key={t}
              className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600"
            >
              {tagShortLabel(t)}
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-400 mt-2">
        {firstRecordedYear && <>First recorded {firstRecordedYear}</>}
        {firstRecordedYear && scam.country && ' · '}
        {scam.country && countryName(scam.country)}
      </p>
    </Link>
  );
}
