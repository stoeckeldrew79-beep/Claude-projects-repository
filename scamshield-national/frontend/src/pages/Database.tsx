import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCategories, useCountries, useInfiniteScams } from '../hooks/useScams';
import { ScamListParams } from '../services/scams';
import { ScamCard } from '../components/ScamCard';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { TrendWatch } from '../components/TrendWatch';
import { countryName } from '../utils/countries';

const SORT_OPTIONS: { value: NonNullable<ScamListParams['sort']>; label: string }[] = [
  { value: 'alert_level', label: 'Most urgent first' },
  { value: 'name_asc', label: 'A–Z' },
  { value: 'newest', label: 'Newest first' },
  { value: 'chronological', label: 'Chronological (by date)' },
];

const VIEW_OPTIONS: { value: NonNullable<ScamListParams['view']>; label: string }[] = [
  { value: 'current', label: 'Current threats' },
  { value: 'historical', label: 'Historical archive' },
  { value: 'all', label: 'All eras' },
];

export default function Database() {
  useDocumentMeta({
    title: 'Scam Database',
    description: 'Browse and search the full national database of recorded scam activity by category, state, and date.',
    path: '/database',
  });

  // Lets the Global Map's "click a country marker" link land here pre-filtered
  // (e.g. /database?country=US). Read once on mount — the select below still
  // drives all further changes locally.
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(searchParams.get('country') ?? undefined);
  const [sort, setSort] = useState<NonNullable<ScamListParams['sort']>>('alert_level');
  const [view, setView] = useState<NonNullable<ScamListParams['view']>>('current');
  const { data: categories } = useCategories();
  const { data: countries } = useCountries();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteScams({ search: search || undefined, category, country, sort, view });

  function handleViewChange(next: NonNullable<ScamListParams['view']>) {
    setView(next);
    // Urgency sort is meaningless for historical entries (no alert_level);
    // chronological sort by date is meaningless for current-only entries
    // (no first_recorded). Switch to whichever actually makes sense.
    if (next === 'historical' && sort === 'alert_level') setSort('chronological');
    if (next === 'current' && sort === 'chronological') setSort('alert_level');
  }

  const scams = data?.pages.flat() ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <span className="inline-block text-xs font-bold tracking-wider uppercase text-red-600">
        National Scam Intelligence
      </span>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">Scam Database</h1>
      <p className="mt-2 text-slate-600 max-w-2xl">
        Search and browse recorded scam activity. Sort by what's most urgent right now, alphabetically, or by what's
        newest to the database.
      </p>

      <div className="mt-8 flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {VIEW_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleViewChange(opt.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === opt.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {view !== 'historical' && (
        <div className="mt-6 mb-8">
          <TrendWatch />
        </div>
      )}
      {view === 'historical' && (
        <p className="mt-6 mb-8 text-sm text-slate-500">
          Real, documented frauds from history — not active threats. See{' '}
          <Link to="/notorious" className="underline hover:text-slate-700">
            Notorious Scams &amp; Scammers
          </Link>{' '}
          for the full stories behind some of these.
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scams…"
          className="flex-1 min-w-[200px] rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={category ?? ''}
          onChange={(e) => setCategory(e.target.value || undefined)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {countries && countries.length > 1 && (
          <select
            value={country ?? ''}
            onChange={(e) => setCountry(e.target.value || undefined)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {countryName(c)}
              </option>
            ))}
          </select>
        )}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as NonNullable<ScamListParams['sort']>)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-slate-500">Loading…</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scams.map((scam) => (
          <ScamCard key={scam.id} scam={scam} />
        ))}
      </div>
      {!isLoading && scams.length === 0 && <p className="text-slate-500">No scams match your filters.</p>}

      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-5 py-2.5 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
