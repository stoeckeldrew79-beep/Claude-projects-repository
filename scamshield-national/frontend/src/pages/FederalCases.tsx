import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFederalArchiveStats, useFederalCases } from '../hooks/useFederalCases';
import { useDebounce } from '../hooks/useDebounce';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { stateName, stateSlug, US_STATE_OPTIONS, US_STATE_NAMES } from '../utils/usStates';
import { FederalArchiveStats, FederalCase } from '../types';

const NATIONAL = 'national';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function placeLabel(state: string | null) {
  if (!state) return 'National';
  return US_STATE_NAMES[state] ? stateName(state) : state;
}

function CaseRow({ c }: { c: FederalCase }) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 transition-shadow hover:shadow-sm">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
        <time dateTime={c.published_at} className="font-medium text-slate-700">
          {formatDate(c.published_at)}
        </time>
        <span aria-hidden="true">·</span>
        <span>{c.office ?? 'U.S. Department of Justice'}</span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">{c.theme}</span>
      </div>
      <h3 className="mt-2 font-semibold leading-snug text-slate-900">
        <a href={c.url} target="_blank" rel="noreferrer" className="hover:underline">
          {c.title}
          <span className="sr-only"> (opens justice.gov)</span>
        </a>
      </h3>
      {c.summary && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.summary}</p>}
      <a
        href={c.url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs font-semibold text-[#8a2e2e] hover:underline"
      >
        Full release on justice.gov →
      </a>
    </li>
  );
}

function RowSkeleton() {
  return (
    <li aria-hidden="true" className="rounded-xl border border-slate-200 p-5">
      <div className="h-3 w-1/3 rounded bg-slate-100" />
      <div className="mt-3 h-4 w-5/6 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-full rounded bg-slate-100" />
      <div className="mt-1.5 h-3 w-2/3 rounded bg-slate-100" />
    </li>
  );
}

// Cases per year, as a row of bars; clicking a year filters to it.
function YearBars({
  stats,
  year,
  onPick,
}: {
  stats: FederalArchiveStats;
  year: number | undefined;
  onPick: (y: number | undefined) => void;
}) {
  if (stats.by_year.length < 2) return null;
  // Every year in the range gets a bar, so a year with no cases shows as a
  // gap instead of silently disappearing.
  const counts = new Map(stats.by_year.map((y) => [y.year, y.count]));
  const firstYear = stats.by_year[0].year;
  const lastYear = stats.by_year[stats.by_year.length - 1].year;
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => ({
    year: firstYear + i,
    count: counts.get(firstYear + i) ?? 0,
  }));
  const max = Math.max(1, ...years.map((y) => y.count));
  return (
    <div className="mt-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cases by year</p>
      <div className="mt-3 flex h-24 items-end gap-1" role="group" aria-label="Filter by year">
        {years.map((y) => {
          const active = year === y.year;
          return (
            <button
              key={y.year}
              type="button"
              onClick={() => onPick(active ? undefined : y.year)}
              aria-pressed={active}
              title={`${y.year}: ${y.count.toLocaleString()} cases`}
              className="group flex h-full flex-1 flex-col justify-end"
            >
              <span
                className={`block w-full rounded-t transition-colors ${
                  active ? 'bg-red-500' : 'bg-white/25 group-hover:bg-white/50'
                }`}
                style={{ height: y.count ? `${Math.max(4, (y.count / max) * 100)}%` : '2px' }}
              />
              <span className="sr-only">
                {y.year}: {y.count} cases
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>{firstYear}</span>
        <span>{lastYear}</span>
      </div>
    </div>
  );
}

export default function FederalCases() {
  useDocumentMeta({
    title: 'Federal Fraud Case Archive',
    description:
      'Search every fraud and scam case the U.S. Department of Justice has announced since 2009 — by state, year and type, linked to the official release.',
    path: '/federal/cases',
  });

  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const debouncedQuery = useDebounce(query.trim(), 300);
  const state = params.get('state') ?? '';
  const theme = params.get('theme') ?? '';
  const yearParam = Number(params.get('year'));
  const year = Number.isInteger(yearParam) && yearParam > 2000 ? yearParam : undefined;

  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  // The search box writes to the URL only once typing pauses.
  const filters = useMemo(
    () => ({ q: debouncedQuery || undefined, state: state || undefined, theme: theme || undefined, year }),
    [debouncedQuery, state, theme, year]
  );
  useEffect(() => {
    if ((params.get('q') ?? '') !== debouncedQuery) setParam('q', debouncedQuery || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const { data: stats } = useFederalArchiveStats();
  const { data, isLoading, isError, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useFederalCases(filters);
  const cases = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total;

  const setTrigger = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    Boolean(hasNextPage) && !isFetchingNextPage
  );

  const activeFilters = [
    state && { key: 'state', label: state === NATIONAL ? 'National' : placeLabel(state) },
    theme && { key: 'theme', label: theme },
    year && { key: 'year', label: String(year) },
  ].filter(Boolean) as { key: string; label: string }[];

  const firstYear = stats?.first_date ? new Date(stats.first_date).getUTCFullYear() : 2009;
  // Right after a deploy the archive can be empty for a few minutes while
  // its first import runs; say so rather than showing a row of zeros.
  const importing = stats !== undefined && stats.total === 0;

  return (
    <div>
      <section className="bg-gradient-to-b from-slate-950 to-[#0f1a2b] text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <nav className="text-xs text-slate-400" aria-label="Breadcrumb">
            <Link to="/federal" className="hover:text-white">
              Federal Watch
            </Link>{' '}
            / Case archive
          </nav>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-red-400">Federal fraud case archive</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Every fraud case the Justice Department has announced since {firstYear}.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Fraud and scam cases announced by the U.S. Department of Justice and the 94 U.S. Attorneys' offices —
            searchable by state, year and type, each linked to the official release.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: stats && !importing ? stats.total.toLocaleString() : '—', label: 'Federal cases' },
              {
                value: stats?.by_year.length ? `${stats.by_year[0].year}–${stats.by_year[stats.by_year.length - 1].year}` : '—',
                label: 'Years covered',
              },
              { value: stats && !importing ? stats.states_covered.toLocaleString() : '—', label: 'States & territories' },
              { value: stats?.last_date ? formatDate(stats.last_date) : '—', label: 'Newest case' },
            ].map((t) => (
              <div key={t.label}>
                <p className="text-2xl font-bold sm:text-3xl">{t.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{t.label}</p>
              </div>
            ))}
          </div>

          {importing && (
            <p className="mt-6 flex items-center gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-amber-200/30 border-t-amber-200" aria-hidden="true" />
              The first federal cases are being imported from the Justice Department right now — they will start
              appearing here within minutes, with the full history back to 2009 following over the next day.
            </p>
          )}
          {stats && !importing && !stats.backfill_complete && (
            <p className="mt-6 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              The archive is still being assembled from the Justice Department's records — older cases are added
              continuously until the full collection back to 2009 is in. Today's cases are already here.
            </p>
          )}

          {stats && <YearBars stats={stats} year={year} onPick={(y) => setParam('year', y ? String(y) : undefined)} />}
        </div>
      </section>

      <div className="sticky top-16 z-30 md:top-32 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
          <label htmlFor="case-search" className="sr-only">
            Search federal cases
          </label>
          <input
            id="case-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: ponzi, romance, medicare, a company or person…"
            className="w-full flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          />
          <div className="flex gap-2 overflow-x-auto">
            <select
              aria-label="State"
              value={state}
              onChange={(e) => setParam('state', e.target.value || undefined)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-2.5 text-sm"
            >
              <option value="">All states</option>
              <option value={NATIONAL}>National (Main Justice)</option>
              {US_STATE_OPTIONS.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
              <option value="PR">Puerto Rico</option>
            </select>
            <select
              aria-label="Type of fraud"
              value={theme}
              onChange={(e) => setParam('theme', e.target.value || undefined)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-2.5 text-sm"
            >
              <option value="">All types</option>
              {stats?.by_theme.map((t) => (
                <option key={t.theme} value={t.theme}>
                  {t.theme} ({t.count.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-2" aria-live="polite">
          <p className="text-sm text-slate-600">
            {total !== undefined ? (
              <>
                <span className="text-lg font-bold text-slate-900">{total.toLocaleString()}</span>{' '}
                {total === 1 ? 'case' : 'cases'}
                {debouncedQuery && <> matching “{debouncedQuery}”</>}
              </>
            ) : (
              'Loading cases…'
            )}
          </p>
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setParam(f.key, undefined)}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              {f.label} ✕<span className="sr-only"> (remove filter)</span>
            </button>
          ))}
          {state && state !== NATIONAL && US_STATE_NAMES[state] && (
            <Link to={`/states/${stateSlug(state)}`} className="ml-auto text-xs font-semibold text-[#8a2e2e] hover:underline">
              More on scams in {stateName(state)} →
            </Link>
          )}
        </div>

        {isError && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Couldn't load the archive.{' '}
            <button type="button" onClick={() => refetch()} className="font-semibold underline">
              Try again
            </button>
          </div>
        )}

        <ul className={`mt-6 space-y-3 transition-opacity ${isFetching && !isFetchingNextPage ? 'opacity-60' : ''}`}>
          {isLoading && Array.from({ length: 6 }, (_, i) => <RowSkeleton key={i} />)}
          {cases.map((c) => (
            <CaseRow key={c.id} c={c} />
          ))}
          {isFetchingNextPage && Array.from({ length: 3 }, (_, i) => <RowSkeleton key={`more-${i}`} />)}
        </ul>
        {hasNextPage && <div ref={setTrigger} aria-hidden="true" className="h-px" />}

        {!isLoading && total === 0 && !importing && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-semibold text-slate-900">No federal cases match that.</p>
            <p className="mt-1 text-sm text-slate-600">Try fewer words, or clear a filter.</p>
          </div>
        )}

        <p className="mt-10 text-xs leading-relaxed text-slate-500">
          Every case here is taken from a press release published by the U.S. Department of Justice and links to
          the original on justice.gov. Releases about charges describe allegations: a person who is charged is
          presumed innocent unless and until proven guilty in court. ScamTitan International is a private service and
          is not affiliated with the Department of Justice.
        </p>
      </div>
    </div>
  );
}
