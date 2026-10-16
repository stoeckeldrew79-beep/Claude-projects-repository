import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { isFeedLive, useAgFeedStatus, useStateAgSources } from '../hooks/useStateAgSources';
import { useLatestAgByState } from '../hooks/useDailyNews';
import { LatestAgAlert, StateAgSource } from '../types';
import type { AgFeedStatus } from '../services/stateAgSources';
import { stateSlug } from '../utils/usStates';
import { timeAgo } from '../utils/timeAgo';

// Tile-grid US map: every state the same size, so Rhode Island is as easy to
// tap as Texas. [code, column, row] on an 11 x 8 grid.
const TILES: [string, number, number][] = [
  ['AK', 0, 0], ['ME', 10, 0],
  ['VT', 9, 1], ['NH', 10, 1],
  ['WA', 0, 2], ['ID', 1, 2], ['MT', 2, 2], ['ND', 3, 2], ['MN', 4, 2], ['IL', 5, 2], ['WI', 6, 2], ['MI', 7, 2], ['NY', 8, 2], ['RI', 9, 2], ['MA', 10, 2],
  ['OR', 0, 3], ['NV', 1, 3], ['WY', 2, 3], ['SD', 3, 3], ['IA', 4, 3], ['IN', 5, 3], ['OH', 6, 3], ['PA', 7, 3], ['NJ', 8, 3], ['CT', 9, 3],
  ['CA', 0, 4], ['UT', 1, 4], ['CO', 2, 4], ['NE', 3, 4], ['MO', 4, 4], ['KY', 5, 4], ['WV', 6, 4], ['VA', 7, 4], ['MD', 8, 4], ['DE', 9, 4],
  ['AZ', 1, 5], ['NM', 2, 5], ['KS', 3, 5], ['AR', 4, 5], ['TN', 5, 5], ['NC', 6, 5], ['SC', 7, 5], ['DC', 8, 5],
  ['OK', 3, 6], ['LA', 4, 6], ['MS', 5, 6], ['AL', 6, 6], ['GA', 7, 6],
  ['HI', 0, 7], ['TX', 3, 7], ['FL', 8, 7],
];

const DAY_MS = 24 * 60 * 60 * 1000;

function ageInDays(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, (Date.now() - t) / DAY_MS);
}

// Tile shade by how recently the state's AG published: the map reads as a
// heat map of official activity without claiming anything about scam volume.
function tileClass(days: number | null): string {
  if (days == null) return 'bg-slate-100 text-slate-500 hover:bg-slate-200';
  if (days <= 3) return 'bg-[#8a2e2e] text-white hover:bg-[#6f2424]';
  if (days <= 10) return 'bg-red-300 text-red-950 hover:bg-red-400';
  if (days <= 30) return 'bg-red-100 text-red-900 hover:bg-red-200';
  return 'bg-slate-100 text-slate-600 hover:bg-slate-200';
}

function LiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
      title="We read this office's own press releases directly, several times a day."
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Live feed
    </span>
  );
}

function StateCard({
  source,
  latest,
  status,
}: {
  source: StateAgSource;
  latest: LatestAgAlert | undefined;
  status: AgFeedStatus | undefined;
}) {
  const slug = stateSlug(source.state);
  const live = isFeedLive(status);
  return (
    <div id={`state-${source.state}`} className="flex scroll-mt-24 flex-col rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/states/${slug}`}
            className="flex items-center gap-2 text-lg font-bold text-slate-900 hover:text-red-700"
          >
            <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white">
              {source.state}
            </span>
            {source.state_name}
          </Link>
          <p className="mt-0.5 text-sm text-slate-600">{source.agency_name}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {live && <LiveBadge />}
          {source.has_published_reports && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">Publishes reports</span>
          )}
        </div>
      </div>

      {latest && (
        <a
          href={latest.source_url}
          target="_blank"
          rel="noreferrer"
          className="group mt-3 block rounded-lg border border-red-100 bg-red-50/50 p-3 hover:border-red-200"
        >
          <p className="text-[11px] font-semibold tracking-wide text-red-700 uppercase">
            Latest official alert{latest.published_at && <> · {timeAgo(latest.published_at)}</>}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900 line-clamp-2 group-hover:underline">{latest.headline}</p>
        </a>
      )}

      <p className="mt-3 text-sm text-slate-500 line-clamp-2">{source.description}</p>

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <Link
          to={`/states/${slug}`}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          {source.state} scam activity
        </Link>
        <a
          href={source.consumer_protection_url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-400"
        >
          File a complaint ↗
        </a>
        {source.reports_url && (
          <a
            href={source.reports_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            Press releases ↗
          </a>
        )}
      </div>
    </div>
  );
}

type SortKey = 'name' | 'recent';

export default function StateAttorneysGeneralPage() {
  useDocumentMeta({
    title: 'State Attorneys General',
    description:
      "Every US state Attorney General's consumer protection office: the newest official scam alert from each, where to file a complaint, and published fraud reports.",
    path: '/state-attorneys-general',
  });

  const { data, isLoading, isError } = useStateAgSources();
  // Both are enrichment. Either can be missing (the latest-by-state endpoint
  // is newer than some deployments) and the page must read as complete
  // without them, so neither error is ever shown.
  const { data: latestRows } = useLatestAgByState();
  const { data: statusRows } = useAgFeedStatus();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [liveOnly, setLiveOnly] = useState(false);

  const latestByState = useMemo(
    () => new Map((latestRows ?? []).map((row) => [row.state, row])),
    [latestRows]
  );
  const statusByState = useMemo(() => new Map((statusRows ?? []).map((row) => [row.state, row])), [statusRows]);

  // Recency for the tile shading: the newest alert we hold, else what the
  // feed engine last saw on the state's own site.
  const newestAt = (code: string) =>
    latestByState.get(code)?.published_at ?? statusByState.get(code)?.newest_item_at ?? null;

  const liveCount = useMemo(
    () => (statusRows ?? []).filter((row) => isFeedLive(row)).length,
    [statusRows]
  );
  const activeThisWeek = useMemo(
    () =>
      (data ?? []).filter((s) => {
        const d = ageInDays(latestByState.get(s.state)?.published_at ?? statusByState.get(s.state)?.newest_item_at);
        return d != null && d <= 7;
      }).length,
    [data, latestByState, statusByState]
  );

  const recentAlerts = useMemo(
    () =>
      [...(latestRows ?? [])]
        .filter((row) => row.published_at)
        .sort((a, b) => new Date(b.published_at as string).getTime() - new Date(a.published_at as string).getTime())
        .slice(0, 6),
    [latestRows]
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    const list = data.filter(
      (s) =>
        (!q ||
          s.state_name.toLowerCase().includes(q) ||
          s.state.toLowerCase() === q ||
          s.agency_name.toLowerCase().includes(q)) &&
        (!liveOnly || isFeedLive(statusByState.get(s.state)))
    );
    if (sort === 'recent') {
      const ts = (code: string) => {
        const iso = latestByState.get(code)?.published_at ?? statusByState.get(code)?.newest_item_at;
        return iso ? new Date(iso).getTime() : 0;
      };
      return [...list].sort((a, b) => ts(b.state) - ts(a.state));
    }
    return [...list].sort((a, b) => a.state_name.localeCompare(b.state_name));
  }, [data, search, sort, liveOnly, latestByState, statusByState]);

  const reportCount = data?.filter((s) => s.has_published_reports).length ?? 0;
  const known = new Set((data ?? []).map((s) => s.state));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">State Consumer Protection</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        State Attorneys General, nationwide
      </h1>
      <p className="mt-3 max-w-3xl text-slate-600">
        Every state runs its own consumer protection office inside the Attorney General&apos;s office, separate from
        the FTC and FBI, and many take scam complaints directly. Each office below is linked straight to its own site;
        where we read an office&apos;s press releases directly, its newest official alert is shown with it.
      </p>

      {data && (
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Offices listed', data.length],
            ['Publish fraud reports', reportCount],
            ...(liveCount > 0 ? [['Read live, directly', liveCount] as const] : []),
            ...(activeThisWeek > 0 ? [['Issued an alert this week', activeThisWeek] as const] : []),
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <dd className="text-2xl font-bold tabular-nums text-slate-900">{value}</dd>
              <dt className="text-[11px] leading-tight text-slate-500">{label}</dt>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Quick picker. Each tile goes to the state's own page. */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">Pick a state</h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Last official alert:</span>
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#8a2e2e]" /> ≤3d
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-300" /> ≤10d
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-100" /> ≤30d
            </div>
          </div>
          <div
            className="mt-4 grid gap-1 sm:gap-1.5"
            style={{ gridTemplateColumns: 'repeat(11, minmax(0, 1fr))', gridTemplateRows: 'repeat(8, auto)' }}
          >
            {TILES.filter(([code]) => known.size === 0 || known.has(code)).map(([code, col, row]) => {
              const live = isFeedLive(statusByState.get(code));
              return (
                <Link
                  key={code}
                  to={`/states/${stateSlug(code)}`}
                  title={code}
                  style={{ gridColumn: col + 1, gridRow: row + 1 }}
                  className={`relative flex aspect-square items-center justify-center rounded-md text-[10px] font-bold transition-colors sm:text-xs ${tileClass(
                    ageInDays(newestAt(code))
                  )}`}
                >
                  {code}
                  {live && (
                    <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-white" />
                  )}
                </Link>
              );
            })}
          </div>
          {liveCount > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Green dot: we read this office&apos;s
              releases directly.
            </p>
          )}
        </section>

        {/* Across-the-country view of the newest official alerts. Only
            rendered when the latest-by-state feed has something to say. */}
        {recentAlerts.length > 0 ? (
          <section className="rounded-2xl bg-[#0f1a2b] p-4 text-white sm:p-5">
            <h2 className="text-base font-bold">Newest official alerts</h2>
            <p className="mt-0.5 text-xs text-slate-400">Straight from state Attorney General offices.</p>
            <ul className="mt-3 divide-y divide-white/10">
              {recentAlerts.map((row) => (
                <li key={`${row.state}-${row.source_url}`} className="py-2.5">
                  <a href={row.source_url} target="_blank" rel="noreferrer" className="group block">
                    <p className="text-[11px] font-semibold text-red-300">
                      {row.state} · {timeAgo(row.published_at)}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-100 line-clamp-2 group-hover:underline">{row.headline}</p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <Link
            to="/federal"
            className="flex flex-col justify-between rounded-2xl bg-[#0f1a2b] p-5 text-white hover:bg-[#16243a]"
          >
            <div>
              <p className="text-[11px] font-bold tracking-widest text-red-300 uppercase">Federal</p>
              <h2 className="mt-1 text-lg font-semibold">US Attorney General &amp; FTC — Federal Watch</h2>
              <p className="mt-2 text-sm text-slate-300">
                Live fraud-enforcement alerts from the Department of Justice and the FTC, nationwide.
              </p>
            </div>
            <span className="mt-4 text-sm font-semibold text-red-300">View Federal Watch →</span>
          </Link>
        )}
      </div>

      {/* Federal sits outside the state grid — it isn't a 51st jurisdiction,
          it's a different level of government. */}
      {recentAlerts.length > 0 && (
        <Link
          to="/federal"
          className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-red-300 hover:bg-red-50/50"
        >
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Federal</p>
            <p className="mt-0.5 font-semibold text-slate-900">US Attorney General &amp; FTC — Federal Watch</p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-red-700">View →</span>
        </Link>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by state or office…"
          aria-label="Search by state or office"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 sm:max-w-sm"
        />
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {liveCount > 0 && (
            <label className="flex items-center gap-2 text-slate-700">
              <input
                type="checkbox"
                checked={liveOnly}
                onChange={(e) => setLiveOnly(e.target.checked)}
                className="h-4 w-4 accent-red-700"
              />
              Live feeds only
            </label>
          )}
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {(
              [
                ['name', 'A–Z'],
                ['recent', 'Most recent alert'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  sort === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <p className="mt-8 text-sm text-slate-500">Loading…</p>}
      {isError && <p className="mt-8 text-sm text-red-700">Couldn&apos;t load state Attorney General sources.</p>}

      {data && filtered.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">No states match &quot;{search}&quot;.</p>
      )}

      {data && filtered.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((source) => (
            <StateCard
              key={source.id}
              source={source}
              latest={latestByState.get(source.state)}
              status={statusByState.get(source.state)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
