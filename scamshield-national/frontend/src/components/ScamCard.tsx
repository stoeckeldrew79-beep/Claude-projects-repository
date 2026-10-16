import { Link } from 'react-router-dom';
import { Scam } from '../types';
import { countryName } from '../utils/countries';
import { tagShortLabel } from '../utils/scamTags';
import { timeAgo } from '../utils/timeAgo';

// One severity language for every card on the site: a coloured edge you can
// scan down a grid, plus a labelled badge so colour is never the only cue.
export const SEVERITY_STYLES: Record<string, { badge: string; edge: string; dot: string; label: string }> = {
  critical: { badge: 'bg-red-600 text-white', edge: 'before:bg-red-600', dot: 'bg-red-600', label: 'Critical' },
  high: { badge: 'bg-orange-100 text-orange-800 ring-1 ring-orange-200', edge: 'before:bg-orange-500', dot: 'bg-orange-500', label: 'High' },
  medium: { badge: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', edge: 'before:bg-amber-400', dot: 'bg-amber-400', label: 'Medium' },
  low: { badge: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200', edge: 'before:bg-slate-300', dot: 'bg-slate-400', label: 'Low' },
};

export function ScamCard({ scam, showAdded = false }: { scam: Scam; showAdded?: boolean }) {
  const sev = !scam.is_historical && scam.alert_level ? SEVERITY_STYLES[scam.alert_level] : undefined;
  const edge = scam.is_historical ? 'before:bg-slate-400' : (sev?.edge ?? 'before:bg-slate-200');
  const firstRecordedYear = scam.first_recorded ? new Date(scam.first_recorded).getUTCFullYear() : null;

  const meta: string[] = [];
  if (scam.country) meta.push(countryName(scam.country));
  if (firstRecordedYear) meta.push(`First recorded ${firstRecordedYear}`);
  if (showAdded && !scam.is_historical && scam.created_at) meta.push(`Added ${timeAgo(scam.created_at)}`);

  return (
    <Link
      to={`/scams/${scam.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 pl-5 transition-all before:absolute before:inset-y-0 before:left-0 before:w-1 ${edge} hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug text-slate-900 group-hover:text-red-800">{scam.name}</h3>
        {scam.is_historical ? (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
            Historical
          </span>
        ) : (
          sev && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${sev.badge}`}>
              {sev.label}
            </span>
          )
        )}
      </div>
      {scam.category_name && (
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{scam.category_name}</p>
      )}
      <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">{scam.description}</p>
      {/* Who it targets, when the source says so. Quieter than severity: it
          is context, not urgency. */}
      {scam.tags && scam.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {scam.tags.map((t) => (
            <span
              key={t}
              className="rounded-sm bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-800"
            >
              {tagShortLabel(t)}
            </span>
          ))}
        </div>
      )}
      {meta.length > 0 && (
        <p className="mt-auto pt-3 text-xs text-slate-400">
          {meta.map((m, i) => (
            <span key={m} className={scam.is_historical && m.startsWith('First recorded') ? 'font-semibold text-blue-700' : undefined}>
              {i > 0 && ' · '}
              {m}
            </span>
          ))}
        </p>
      )}
    </Link>
  );
}

// Same footprint as a ScamCard, for first loads.
export function ScamCardSkeleton() {
  return (
    <div aria-hidden className="relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 pl-5">
      <div className="absolute inset-y-0 left-0 w-1 bg-slate-200" />
      <div className="animate-pulse">
        <div className="flex justify-between gap-3">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-4 w-12 rounded-full bg-slate-100" />
        </div>
        <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
        <div className="mt-3 h-3 w-full rounded bg-slate-100" />
        <div className="mt-1.5 h-3 w-4/5 rounded bg-slate-100" />
        <div className="mt-4 h-3 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  );
}
