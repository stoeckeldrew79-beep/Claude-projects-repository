import { timeAgo } from '../../utils/timeAgo';
import { stateName } from '../../utils/usStates';
import { useOfficialAlerts } from './useOfficialAlerts';

function KindBadge({ kind, state }: { kind: 'ag' | 'federal'; state: string | null }) {
  if (kind === 'federal') {
    return (
      <span className="inline-flex items-center rounded bg-[#0f1a2b] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
        Federal
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8a2e2e] ring-1 ring-inset ring-red-200"
      title={state ? `${stateName(state)} Attorney General` : 'State Attorney General'}
    >
      State AG{state ? ` · ${state}` : ''}
    </span>
  );
}

// Newest official (state AG + federal) alerts, linking straight to the
// publisher. Everything shown is real data from the public API; when the
// feed is empty or unavailable the list says so rather than padding.
export function OfficialAlertsList({ limit = 6, compact = false }: { limit?: number; compact?: boolean }) {
  const { items, isLoading, isError } = useOfficialAlerts(limit);

  if (isLoading) {
    return (
      <ul className="divide-y divide-slate-100" aria-busy="true" aria-label="Loading official alerts">
        {Array.from({ length: Math.min(limit, 4) }).map((_, i) => (
          <li key={i} className="py-4">
            <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
            <div className="mt-2 h-4 w-11/12 rounded bg-slate-100 animate-pulse" />
            <div className="mt-1.5 h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
          </li>
        ))}
      </ul>
    );
  }

  if (isError || items.length === 0) {
    return (
      <p className="py-6 text-sm text-slate-500">
        No official alerts to show right now — the feeds are checked throughout the day.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((a) => (
        <li key={a.key}>
          <a
            href={a.source_url}
            target="_blank"
            rel="noreferrer"
            className={`group block rounded-md ${compact ? 'py-3' : 'py-4'} -mx-2 px-2 hover:bg-slate-50 transition-colors`}
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <KindBadge kind={a.kind} state={a.state} />
              <span className="truncate max-w-[14rem]">{a.source_name}</span>
              {a.published_at && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={a.published_at}>{timeAgo(a.published_at)}</time>
                </>
              )}
            </div>
            <p
              className={`mt-1.5 font-medium leading-snug text-slate-900 group-hover:text-[#8a2e2e] ${
                compact ? 'text-sm line-clamp-2' : 'text-[15px] line-clamp-2'
              }`}
            >
              {a.headline}
              <span className="sr-only"> (opens the official source in a new tab)</span>
              <span aria-hidden="true" className="ml-1 text-slate-400 group-hover:text-[#8a2e2e]">
                ↗
              </span>
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
