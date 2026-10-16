import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCategories, useCountries, useInfiniteScamsWithTotal, useScamTags } from '../hooks/useScams';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDebounce } from '../hooks/useDebounce';
import { useLiveStats, useStats } from '../hooks/useStats';
import { ScamListParams, SeverityLevel } from '../services/scams';
import { ScamCard, ScamCardSkeleton, SEVERITY_STYLES } from '../components/ScamCard';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { TrendWatch } from '../components/TrendWatch';
import { tagLabel } from '../utils/scamTags';
import { countryName } from '../utils/countries';
import { stateName } from '../utils/usStates';

type Sort = NonNullable<ScamListParams['sort']>;
type View = NonNullable<ScamListParams['view']>;

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: 'alert_level', label: 'Most urgent' },
  { value: 'newest', label: 'Newest added' },
  { value: 'name_asc', label: 'A–Z' },
  { value: 'chronological', label: 'First recorded' },
];

const VIEW_OPTIONS: { value: View; label: string; short: string }[] = [
  { value: 'recent', label: 'Last 30 days', short: '30 days' },
  { value: 'historical', label: 'Historical archive', short: 'Archive' },
  { value: 'all', label: 'Full history', short: 'All' },
];

const SEVERITIES: SeverityLevel[] = ['critical', 'high', 'medium', 'low'];

// Urgency is meaningless for the archive (most entries carry no alert level);
// chronological is what browsing history is for.
function defaultSortFor(view: View): Sort {
  return view === 'recent' || view === 'current' ? 'alert_level' : 'chronological';
}

const TREND_PREF_KEY = 'ssn.database.trendOpen';
function readTrendPref(): boolean {
  try {
    const v = localStorage.getItem(TREND_PREF_KEY);
    if (v !== null) return v === '1';
  } catch {
    /* storage blocked */
  }
  return typeof window !== 'undefined' && window.matchMedia?.('(min-width: 1024px)').matches;
}

function LiveCount({ value, label, accent }: { value: number | undefined; label: string; accent?: string }) {
  return (
    <div className="min-w-0">
      <div className={`text-xl font-extrabold tabular-nums sm:text-2xl ${accent ?? 'text-white'}`}>
        {value === undefined ? <span className="inline-block h-6 w-14 animate-pulse rounded bg-white/10 align-middle" /> : value.toLocaleString()}
      </div>
      <div className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

const selectClass =
  'h-9 max-w-[11.5rem] shrink-0 truncate rounded-full border-0 bg-white py-1 pl-3 pr-8 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 focus:ring-2 focus:ring-red-300';

export default function Database() {
  useDocumentMeta({
    title: 'Scam Database',
    description: 'Search thousands of documented scams by category, severity, country and state — updated as agencies report them.',
    path: '/database',
  });

  // The URL is the single source of truth for every filter, so any view is a
  // shareable link, Back works, and links from elsewhere (?country=US from the
  // globe, ?state=CA from the state map, ?category=…, ?tag=…) keep working —
  // including when one arrives while this page is already open.
  const [params, setParams] = useSearchParams();
  const view = (params.get('view') as View | null) ?? 'recent';
  const sort = (params.get('sort') as Sort | null) ?? defaultSortFor(view);
  const category = params.get('category') ?? undefined;
  const tag = params.get('tag') ?? undefined;
  const country = params.get('country') ?? undefined;
  const state = params.get('state') ?? undefined;
  const urlQuery = params.get('q') ?? '';
  const severity = useMemo(
    () =>
      (params.get('severity') ?? '')
        .split(',')
        .filter((s): s is SeverityLevel => (SEVERITIES as string[]).includes(s)),
    [params]
  );

  function update(patch: Record<string, string | undefined>) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [k, v] of Object.entries(patch)) {
          if (v === undefined || v === '') next.delete(k);
          else next.set(k, v);
        }
        return next;
      },
      { replace: true }
    );
  }

  // Typing is instant locally; the request (and URL) follow 250ms later.
  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedSearch = useDebounce(searchInput.trim(), 250);
  useEffect(() => {
    if (debouncedSearch !== urlQuery) update({ q: debouncedSearch || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  // Keep the box in step when the URL changes underneath (Back, a link).
  const lastUrlQuery = useRef(urlQuery);
  useEffect(() => {
    if (urlQuery !== lastUrlQuery.current) {
      lastUrlQuery.current = urlQuery;
      if (urlQuery !== debouncedSearch) setSearchInput(urlQuery);
    }
  }, [urlQuery, debouncedSearch]);

  const searchRef = useRef<HTMLInputElement>(null);
  // "/" jumps to search, like most data consoles.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (e.key === '/' && t && !['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const { data: categories } = useCategories();
  const { data: countries } = useCountries();
  const { data: scamTags } = useScamTags();
  const { data: siteStats } = useStats();
  const { data: live } = useLiveStats();

  const { data, isLoading, isError, isPlaceholderData, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteScamsWithTotal({
      search: urlQuery || undefined,
      category,
      tag,
      country,
      state,
      sort,
      view,
      severity: severity.length ? severity : undefined,
    });

  const scams = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? null;

  const setTrigger = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    Boolean(hasNextPage) && !isFetchingNextPage && !isPlaceholderData
  );

  const [trendOpen, setTrendOpen] = useState(readTrendPref);
  function toggleTrend() {
    setTrendOpen((v) => {
      try {
        localStorage.setItem(TREND_PREF_KEY, v ? '0' : '1');
      } catch {
        /* storage blocked */
      }
      return !v;
    });
  }

  function setView(next: View) {
    // Keep an explicitly chosen sort unless it was the old view's default.
    const keepSort = params.get('sort') && params.get('sort') !== defaultSortFor(view) ? params.get('sort')! : undefined;
    update({ view: next === 'recent' ? undefined : next, sort: keepSort && keepSort !== defaultSortFor(next) ? keepSort : undefined });
  }
  function toggleSeverity(level: SeverityLevel) {
    const next = severity.includes(level) ? severity.filter((s) => s !== level) : [...severity, level];
    update({ severity: next.length ? SEVERITIES.filter((s) => next.includes(s)).join(',') : undefined });
  }
  function clearAll() {
    setSearchInput('');
    setParams(view === 'recent' ? {} : { view }, { replace: true });
  }

  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (urlQuery) activeFilters.push({ key: 'q', label: `“${urlQuery}”`, clear: () => { setSearchInput(''); update({ q: undefined }); } });
  if (category)
    activeFilters.push({
      key: 'category',
      label: categories?.find((c) => c.slug === category)?.name ?? category,
      clear: () => update({ category: undefined }),
    });
  if (tag) activeFilters.push({ key: 'tag', label: tagLabel(tag), clear: () => update({ tag: undefined }) });
  if (country) activeFilters.push({ key: 'country', label: countryName(country), clear: () => update({ country: undefined }) });
  if (state) activeFilters.push({ key: 'state', label: `State: ${stateName(state)}`, clear: () => update({ state: undefined }) });
  for (const s of severity) activeFilters.push({ key: `sev-${s}`, label: SEVERITY_STYLES[s].label, clear: () => toggleSeverity(s) });

  const showSkeleton = isLoading && !data;
  const viewLabel = VIEW_OPTIONS.find((v) => v.value === view)?.label ?? 'Results';

  return (
    <div className="pb-16">
      {/* ---------- Console header ---------- */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-red-600/25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-8 sm:pb-8 sm:pt-12">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-300">Live intelligence database</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">Scam Database</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
            Every documented scam pattern, sourced from regulators, law enforcement and attorneys general worldwide.
            Search it like you'd describe what happened.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <LiveCount value={siteStats?.scams} label="Entries documented" />
            <LiveCount value={live?.activeCriticalCount} label="Critical, active" accent="text-red-400" />
            <LiveCount value={live?.activeHighCount} label="High, active" accent="text-orange-300" />
            <LiveCount value={siteStats?.countries} label="Countries covered" />
          </div>

          <div className="relative mt-6">
            <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-slate-400">
              <path d="M8.5 3a5.5 5.5 0 014.38 8.83l3.65 3.64a.75.75 0 11-1.06 1.06l-3.64-3.65A5.5 5.5 0 118.5 3zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  update({ q: searchInput.trim() || undefined });
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="Search: toll text, IRS call, voice clone…"
              aria-label="Search the scam database"
              className="h-14 w-full rounded-2xl border-0 bg-white pl-12 pr-24 text-base text-slate-900 shadow-xl shadow-black/30 ring-1 ring-white/10 placeholder:text-slate-400 focus:ring-4 focus:ring-red-500/40"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {(isPlaceholderData || (isLoading && !!urlQuery)) && (
                <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-600" />
              )}
              {searchInput ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    update({ q: undefined });
                    searchRef.current?.focus();
                  }}
                  className="rounded-full px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Clear
                </button>
              ) : (
                <kbd className="hidden rounded border border-slate-200 px-1.5 text-xs text-slate-400 sm:inline">/</kbd>
              )}
            </div>
          </div>

          <div className="mt-5 flex gap-1 overflow-x-auto rounded-xl bg-white/5 p-1 ring-1 ring-white/10 sm:inline-flex" role="tablist">
            {VIEW_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={view === opt.value}
                onClick={() => setView(opt.value)}
                className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
                  view === opt.value ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="sm:hidden">{opt.short}</span>
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Sticky filter rail ---------- */}
      <div className="sticky top-14 z-30 border-b border-slate-200 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/80 md:top-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {view !== 'historical' &&
              SEVERITIES.map((level) => (
                <Chip key={level} active={severity.includes(level)} onClick={() => toggleSeverity(level)} title={`Show ${level} severity`}>
                  <span className={`h-2 w-2 rounded-full ${SEVERITY_STYLES[level].dot}`} />
                  {SEVERITY_STYLES[level].label}
                </Chip>
              ))}
            {view !== 'historical' && <span className="mx-1 h-5 w-px shrink-0 bg-slate-300" aria-hidden />}
            <Chip active={country === 'US'} onClick={() => update({ country: country === 'US' ? undefined : 'US' })}>
              US only
            </Chip>
            {countries && countries.length > 1 && (
              <select
                value={country && country !== 'US' ? country : ''}
                onChange={(e) => update({ country: e.target.value || undefined })}
                className={selectClass}
                aria-label="Filter by country"
              >
                <option value="">{country && country !== 'US' ? 'All countries' : 'Any country'}</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {countryName(c)}
                  </option>
                ))}
              </select>
            )}
            <select
              value={category ?? ''}
              onChange={(e) => update({ category: e.target.value || undefined })}
              className={selectClass}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {scamTags && scamTags.length > 0 && (
              <select
                value={tag ?? ''}
                onChange={(e) => update({ tag: e.target.value || undefined })}
                className={selectClass}
                aria-label="Filter by who the scam targets"
              >
                <option value="">Anyone targeted</option>
                {scamTags.map((t) => (
                  <option key={t.tag} value={t.tag}>
                    {tagLabel(t.tag)} ({t.count})
                  </option>
                ))}
              </select>
            )}
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value === defaultSortFor(view) ? undefined : e.target.value })}
              className={selectClass}
              aria-label="Sort by"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {/* ---------- Result summary ---------- */}
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-sm text-slate-600" aria-live="polite">
            {showSkeleton ? (
              'Loading…'
            ) : total !== null ? (
              <>
                <span className="text-lg font-extrabold text-slate-900 tabular-nums">{total.toLocaleString()}</span>{' '}
                {total === 1 ? 'result' : 'results'} · {viewLabel.toLowerCase()}
              </>
            ) : (
              <>
                Showing <span className="font-semibold text-slate-900">{scams.length.toLocaleString()}</span>
                {hasNextPage ? '+' : ''} · {viewLabel.toLowerCase()}
              </>
            )}
          </p>
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={f.clear}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800 ring-1 ring-red-200 hover:bg-red-100"
            >
              {f.label}
              <span aria-hidden>×</span>
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
          {activeFilters.length > 1 && (
            <button type="button" onClick={clearAll} className="text-xs font-semibold text-slate-500 underline hover:text-slate-800">
              Clear all
            </button>
          )}
          {view !== 'historical' && !state && (
            <button
              type="button"
              onClick={toggleTrend}
              aria-expanded={trendOpen}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
            >
              <svg aria-hidden viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
                <path d="M3 15h2V9H3v6zm4 0h2V5H7v10zm4 0h2v-4h-2v4zm4 0h2V7h-2v8z" />
              </svg>
              {trendOpen ? 'Hide Trend Watch' : 'Trend Watch'}
            </button>
          )}
        </div>

        {/* Follows the page's own country filter so it reads as that scope's
            trend. Stands down for a state filter, where it would read as that
            state's numbers and bury the entries the reader came for. */}
        {view !== 'historical' && !state && trendOpen && (
          <div className="mt-4">
            <TrendWatch country={country} onCategorySelect={(slug) => update({ category: slug })} />
          </div>
        )}
        {view === 'historical' && (
          <p className="mt-3 text-sm text-slate-500">
            Real, documented frauds from history — not active threats. See{' '}
            <Link to="/notorious" className="underline hover:text-slate-700">
              Notorious Scams &amp; Scammers
            </Link>{' '}
            for the full stories behind some of these.
          </p>
        )}

        {/* ---------- Results ---------- */}
        {isError && !data && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            Couldn't reach the database.{' '}
            <button type="button" onClick={() => refetch()} className="font-semibold underline">
              Try again
            </button>
          </div>
        )}

        <div
          className={`mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 transition-opacity duration-150 ${isPlaceholderData ? 'opacity-50' : ''}`}
          aria-busy={isLoading || isPlaceholderData}
        >
          {showSkeleton && Array.from({ length: 9 }, (_, i) => <ScamCardSkeleton key={i} />)}
          {scams.map((scam) => (
            <ScamCard key={scam.id} scam={scam} showAdded={view !== 'historical'} />
          ))}
          {isFetchingNextPage && Array.from({ length: 3 }, (_, i) => <ScamCardSkeleton key={`more-${i}`} />)}
        </div>

        {!isLoading && !isPlaceholderData && scams.length === 0 && !isError && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="text-lg font-bold text-slate-900">No scams match {urlQuery ? `“${urlQuery}”` : 'these filters'}</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              {view === 'recent'
                ? 'Nothing matching was added in the last 30 days — older entries may still match.'
                : 'Try fewer filters or different words.'}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {view === 'recent' && (
                <button type="button" onClick={() => setView('all')} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  Search full history
                </button>
              )}
              {activeFilters.length > 0 && (
                <button type="button" onClick={clearAll} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
                  Clear filters
                </button>
              )}
              <Link to="/check-now" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
                Describe what happened →
              </Link>
            </div>
          </div>
        )}

        {hasNextPage && !isPlaceholderData && <div ref={setTrigger} aria-hidden className="h-px" />}
        {!isLoading && !hasNextPage && !isFetchingNextPage && scams.length > 0 && (
          <p className="mt-8 text-center text-sm text-slate-400">
            That's all {total !== null ? total.toLocaleString() : scams.length.toLocaleString()} matching{' '}
            {(total ?? scams.length) === 1 ? 'entry' : 'entries'}.
          </p>
        )}
      </div>
    </div>
  );
}
