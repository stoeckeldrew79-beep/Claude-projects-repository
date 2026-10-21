import { useState } from 'react';
import { useCategoryTrends } from '../hooks/useCategoryTrends';
import { CategoryTrend, CategoryTrendsMeta } from '../services/trends';
import { countryName } from '../utils/countries';

// What this shows, exactly (see backend/src/models/categories.ts):
// curated database ENTRIES — one per documented scam pattern — whose
// created_at falls in the last 30 days, against the 30 days before, by
// category. It is not victim-report volume and not scam incidence. It used
// to be labelled "real report volume", which a figure like "Government
// Impersonation 704" (704 entries added in a batch) plainly wasn't.
const MIN_TOTAL_FOR_CHART = 5;
const COLLAPSED_ROWS = 8;

type Tone = 'up' | 'down' | 'flat' | 'none';

function delta(current: number, prior: number, comparable: boolean): { label: string; tone: Tone; pct: number | null } {
  if (!comparable) return { label: '—', tone: 'none', pct: null };
  if (prior === 0) return current > 0 ? { label: 'new', tone: 'up', pct: null } : { label: '0%', tone: 'flat', pct: 0 };
  const pct = Math.round(((current - prior) / prior) * 100);
  if (pct === 0) return { label: '0%', tone: 'flat', pct };
  return { label: `${pct > 0 ? '+' : ''}${pct}%`, tone: pct > 0 ? 'up' : 'down', pct };
}

const TONE_STYLE: Record<Tone, string> = {
  up: 'bg-red-50 text-red-700 ring-red-200',
  down: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  flat: 'bg-slate-50 text-slate-600 ring-slate-200',
  none: 'bg-slate-50 text-slate-400 ring-slate-200',
};

function Arrow({ tone }: { tone: Tone }) {
  if (tone === 'up') return <span aria-hidden>▲</span>;
  if (tone === 'down') return <span aria-hidden>▼</span>;
  return null;
}

// The prior window is only a fair comparison if the database already existed
// for all of it. If the earliest entry is younger than 60 days, "0 before"
// means "the database didn't exist yet", not "this category was quiet".
function priorWindowComplete(meta: CategoryTrendsMeta | null): boolean {
  if (!meta?.first_entry_at) return true;
  return Date.now() - new Date(meta.first_entry_at).getTime() >= 60 * 24 * 60 * 60 * 1000;
}

export function TrendWatch({
  country,
  onCategorySelect,
}: { country?: string; onCategorySelect?: (slug: string) => void } = {}) {
  const { data, isLoading, isError } = useCategoryTrends(country);
  const [tableView, setTableView] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const trends: CategoryTrend[] = data?.trends ?? [];
  const meta = data?.meta ?? null;
  const totalNow = meta?.total_last_30d ?? trends.reduce((sum, t) => sum + t.count_last_30d, 0);
  const totalPrior = meta?.total_prior_30d ?? trends.reduce((sum, t) => sum + t.count_prior_30d, 0);
  // Without meta (an older API) an all-zero prior window is the same tell.
  const comparable = meta ? priorWindowComplete(meta) : totalPrior > 0;
  const overall = delta(totalNow, totalPrior, comparable);
  const maxCount = Math.max(1, ...trends.map((t) => Math.max(t.count_last_30d, t.count_prior_30d)));
  const rows = expanded ? trends : trends.slice(0, COLLAPSED_ROWS);
  const scope = country ? countryName(country) : 'worldwide';
  const firstEntry = meta?.first_entry_at
    ? new Date(meta.first_entry_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-red-700">Trend Watch · {scope}</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">New database entries by category</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Scam patterns added to the ScamTitan database in the last 30 days, compared with the 30 days before. Each
            entry is one documented scam, not one victim report — entries arrive in batches as sources are reviewed.
          </p>
        </div>
        {trends.length > 0 && totalNow + totalPrior >= MIN_TOTAL_FOR_CHART && (
          <button
            type="button"
            onClick={() => setTableView((v) => !v)}
            className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            {tableView ? 'Chart view' : 'Table view'}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-6 space-y-3" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 w-1/3 rounded bg-slate-100" />
              <div className="mt-2 h-2.5 rounded bg-slate-100" style={{ width: `${90 - i * 14}%` }} />
            </div>
          ))}
        </div>
      )}
      {isError && <p className="mt-6 text-sm text-red-700">Couldn't load trend data.</p>}

      {data && totalNow + totalPrior < MIN_TOTAL_FOR_CHART && (
        <p className="mt-6 text-sm text-slate-500">
          Not enough entries in these two windows to show a meaningful comparison yet.
        </p>
      )}

      {data && totalNow + totalPrior >= MIN_TOTAL_FOR_CHART && (
        <>
          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center sm:max-w-md">
            <div>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums">{totalNow.toLocaleString()}</div>
              <div className="text-[11px] text-slate-500">Last 30 days</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-400 tabular-nums">{comparable ? totalPrior.toLocaleString() : '—'}</div>
              <div className="text-[11px] text-slate-500">Prior 30 days</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-bold ring-1 ${TONE_STYLE[overall.tone]}`}>
                <Arrow tone={overall.tone} />
                {overall.label}
              </span>
              <div className="mt-0.5 text-[11px] text-slate-500">Change</div>
            </div>
          </div>

          {!comparable && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {firstEntry
                ? `The earliest current entry was added ${firstEntry}, less than 60 days ago, so the prior window doesn't`
                : 'Nothing was added in the prior window, so it likely doesn\'t'}{' '}
              cover a full 30 days of the database. Change percentages are withheld until it does — a jump from zero
              here would only mean the database is new.
            </p>
          )}

          {tableView ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500">
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 text-right font-medium">Last 30d</th>
                    <th className="pb-2 text-right font-medium">Prior 30d</th>
                    <th className="pb-2 text-right font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map((t) => {
                    const d = delta(t.count_last_30d, t.count_prior_30d, comparable);
                    return (
                      <tr key={t.category_id} className="border-t border-slate-100">
                        <td className="py-2 pr-2 text-slate-900">{t.name}</td>
                        <td className="py-2 text-right font-semibold text-slate-900 tabular-nums">{t.count_last_30d}</td>
                        <td className="py-2 text-right text-slate-500 tabular-nums">{comparable ? t.count_prior_30d : '—'}</td>
                        <td className="py-2 text-right tabular-nums">
                          <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold ring-1 ${TONE_STYLE[d.tone]}`}>
                            <Arrow tone={d.tone} />
                            {d.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {rows.map((t) => {
                const d = delta(t.count_last_30d, t.count_prior_30d, comparable);
                const Row = onCategorySelect ? 'button' : 'div';
                return (
                  <li key={t.category_id}>
                    <Row
                      {...(onCategorySelect ? { type: 'button' as const, onClick: () => onCategorySelect(t.slug) } : {})}
                      className={`block w-full text-left ${onCategorySelect ? 'group rounded-md -mx-1 px-1 py-0.5 hover:bg-slate-50' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="min-w-0 truncate font-medium text-slate-900 group-hover:underline">{t.name}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="font-bold text-slate-900 tabular-nums">{t.count_last_30d.toLocaleString()}</span>
                          {comparable && (
                            <span className="hidden text-xs text-slate-400 tabular-nums sm:inline">vs {t.count_prior_30d.toLocaleString()}</span>
                          )}
                          <span
                            className={`inline-flex min-w-[3.5rem] items-center justify-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ring-1 ${TONE_STYLE[d.tone]}`}
                          >
                            <Arrow tone={d.tone} />
                            {d.label}
                          </span>
                        </span>
                      </div>
                      <div className="mt-1.5 space-y-0.5" aria-hidden>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-red-600" style={{ width: `${Math.max(1.5, (t.count_last_30d / maxCount) * 100)}%` }} />
                        </div>
                        {comparable && (
                          <div className="h-1 overflow-hidden rounded-full">
                            <div className="h-full rounded-full bg-slate-300" style={{ width: `${(t.count_prior_30d / maxCount) * 100}%` }} />
                          </div>
                        )}
                      </div>
                    </Row>
                  </li>
                );
              })}
            </ul>
          )}

          {!tableView && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-4 rounded-full bg-red-600" /> Last 30 days
                </span>
                {comparable && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-4 rounded-full bg-slate-300" /> Prior 30 days
                  </span>
                )}
              </span>
              {trends.length > COLLAPSED_ROWS && (
                <button type="button" onClick={() => setExpanded((v) => !v)} className="font-semibold text-red-700 hover:underline">
                  {expanded ? 'Show top categories' : `Show all ${trends.length} categories`}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
