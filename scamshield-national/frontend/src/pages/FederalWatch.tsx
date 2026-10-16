import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDailyScamNews, useFederalWatch } from '../hooks/useDailyNews';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { timeAgo } from '../utils/timeAgo';
import { FederalStory, FederalWatchData } from '../types';
import { BlurFade } from '../components/magicui/blur-fade';

// Stories shown before "Show all" — enough to fill a screen and a half.
const STORY_PREVIEW = 10;

type Agency = 'all' | 'DOJ' | 'FTC';

const AGENCY_STYLE: Record<'DOJ' | 'FTC', string> = {
  DOJ: 'bg-blue-50 text-blue-800 ring-blue-200',
  FTC: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
};
const AGENCY_NAME: Record<'DOJ' | 'FTC', string> = {
  DOJ: 'Department of Justice',
  FTC: 'Federal Trade Commission',
};

function AgencyBadge({ agency }: { agency: 'DOJ' | 'FTC' }) {
  return (
    <span
      title={AGENCY_NAME[agency]}
      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${AGENCY_STYLE[agency]}`}
    >
      {agency}
    </span>
  );
}

function StatTiles({ stats }: { stats: FederalWatchData['stats'] }) {
  const tiles = [
    { value: stats.releases_7d, label: 'Federal releases this week' },
    { value: stats.releases_30d, label: 'Releases in the last 30 days' },
    { value: stats.stories_30d, label: 'Distinct stories in 30 days, re-posts merged' },
    { value: stats.offices, label: 'DOJ offices reporting' },
  ];
  return (
    <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
      {tiles.map((t, i) => (
        <BlurFade key={t.label} delay={0.05 * i}>
          <div className="h-full rounded-xl border border-slate-200 bg-white px-4 py-4">
            <div className="text-3xl font-bold text-slate-900 tabular-nums">
              {t.value.toLocaleString('en-US')}
            </div>
            <div className="mt-1 text-xs font-medium leading-snug text-slate-500">{t.label}</div>
          </div>
        </BlurFade>
      ))}
    </div>
  );
}

// Single-series magnitude: one hue, values written in text ink beside the bar,
// so nothing is read from color alone. Clicking a theme filters the list.
function ThemeBars({
  themes,
  active,
  onPick,
}: {
  themes: FederalWatchData['stats']['themes'];
  active: string | null;
  onPick: (theme: string | null) => void;
}) {
  const max = Math.max(1, ...themes.map((t) => t.count));
  return (
    <ul className="mt-3 space-y-1">
      {themes.slice(0, 7).map((t) => {
        const isActive = active === t.theme;
        return (
          <li key={t.theme}>
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => onPick(isActive ? null : t.theme)}
              title={`${t.count} ${t.count === 1 ? 'story' : 'stories'} — click to ${isActive ? 'clear' : 'filter'}`}
              className={`group w-full rounded-md px-2 py-1.5 text-left transition-colors ${
                isActive ? 'bg-red-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className={`font-medium ${isActive ? 'text-red-800' : 'text-slate-700'}`}>{t.theme}</span>
                <span className="tabular-nums text-slate-500">{t.count}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                <div
                  className={`h-1.5 rounded-full ${isActive ? 'bg-red-700' : 'bg-red-500 group-hover:bg-red-600'}`}
                  style={{ width: `${Math.max(4, (t.count / max) * 100)}%` }}
                />
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function StoryRow({ story }: { story: FederalStory }) {
  const [open, setOpen] = useState(false);
  const more = story.related.length;
  return (
    <li className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <AgencyBadge agency={story.agency} />
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">{story.theme}</span>
        {story.office && <span className="truncate">{story.office}</span>}
        {story.published_at && (
          <span className="ml-auto whitespace-nowrap">{timeAgo(story.published_at)}</span>
        )}
      </div>
      <a
        href={story.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block font-semibold leading-snug text-slate-900 hover:text-red-700 hover:underline"
      >
        {story.headline}
      </a>
      {more > 0 && (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-200 hover:bg-amber-100"
          >
            +{more} more {more === 1 ? 'office' : 'offices'} reported this
            <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </button>
          {open && (
            <ul className="mt-3 space-y-2 border-l-2 border-amber-200 pl-3">
              {story.related.map((r) => (
                <li key={r.id} className="text-sm">
                  <a
                    href={r.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-800 hover:text-red-700 hover:underline"
                  >
                    {r.office ?? r.source_name}
                  </a>
                  <p className="text-xs text-slate-500 line-clamp-2">{r.headline}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
}

export default function FederalWatch() {
  useDocumentMeta({
    title: 'Federal Watch — US Attorney General & FTC',
    description:
      'Live fraud-enforcement intelligence from the US Department of Justice and the Federal Trade Commission: weekly counts, top fraud themes, and every release, with re-posts by US Attorney offices merged into one story.',
    path: '/federal',
  });

  const federal = useFederalWatch();
  // Fallback for the window where this page is deployed ahead of the API's
  // /daily-news/federal endpoint: the plain federal list, unclustered and
  // without stats, rather than an error.
  const plain = useDailyScamNews('US', federal.isError);
  const data: FederalWatchData | undefined = useMemo(() => {
    if (federal.data) return federal.data;
    if (!plain.data) return undefined;
    return {
      clusters: plain.data.map((r) => {
        const agency = /trade commission/i.test(r.source_name) ? ('FTC' as const) : ('DOJ' as const);
        return { ...r, agency, office: null, theme: 'Fraud enforcement', related: [] };
      }),
      stats: undefined as unknown as FederalWatchData['stats'],
    };
  }, [federal.data, plain.data]);
  const isLoading = federal.isLoading || (federal.isError && plain.isLoading);
  const isError = federal.isError && plain.isError;
  const [agency, setAgency] = useState<Agency>('all');
  const [theme, setTheme] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () =>
      (data?.clusters ?? []).filter(
        (c) => (agency === 'all' || c.agency === agency) && (!theme || c.theme === theme)
      ),
    [data, agency, theme]
  );
  const visible = showAll ? filtered : filtered.slice(0, STORY_PREVIEW);
  const stats = data?.stats;
  const mergedReposts = (data?.clusters ?? []).reduce((n, c) => n + c.related.length, 0);

  const agencyTabs: { value: Agency; label: string; count?: number }[] = [
    { value: 'all', label: 'All agencies', count: data?.clusters.length },
    { value: 'DOJ', label: 'DOJ', count: data?.clusters.filter((c) => c.agency === 'DOJ').length },
    { value: 'FTC', label: 'FTC', count: data?.clusters.filter((c) => c.agency === 'FTC').length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link to="/state-attorneys-general" className="hover:text-slate-800 underline">
          State AGs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Federal Watch</span>
      </nav>

      <BlurFade>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-red-600">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
          </span>
          Federal Scam Intelligence · Live
        </span>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Federal Watch: DOJ &amp; FTC fraud enforcement
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          The US Attorney General leads the Department of Justice, which prosecutes fraud in all 94 federal
          districts. The Federal Trade Commission shuts down deceptive businesses and returns money to consumers.
          We read both agencies' own press feeds every few hours and keep anything that reads as a scam or fraud
          action. When one national case is re-announced by a dozen US Attorney offices, it is shown once here, with
          every office's copy one click away.
        </p>
      </BlurFade>

      {stats && <StatTiles stats={stats} />}

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="federal-stories">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="federal-stories" className="text-2xl font-bold text-slate-900">
                Latest federal actions
              </h2>
              {mergedReposts > 0 && (
                <p className="mt-1 text-sm text-slate-500">
                  {mergedReposts} duplicate re-post{mergedReposts === 1 ? '' : 's'} by US Attorney offices merged into
                  their original story.
                </p>
              )}
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1" role="group" aria-label="Filter by agency">
              {agencyTabs.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  aria-pressed={agency === t.value}
                  onClick={() => {
                    setAgency(t.value);
                    setShowAll(false);
                  }}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    agency === t.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                  {t.count !== undefined && <span className="ml-1 tabular-nums text-slate-400">{t.count}</span>}
                </button>
              ))}
            </div>
          </div>

          {theme && (
            <p className="mt-3 text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{theme}</span> only.{' '}
              <button type="button" onClick={() => setTheme(null)} className="font-medium text-red-700 hover:underline">
                Clear
              </button>
            </p>
          )}

          {isLoading && <p className="mt-4 text-sm text-slate-500">Loading federal actions…</p>}
          {isError && <p className="mt-4 text-sm text-red-700">Couldn't load federal alerts.</p>}
          {data && filtered.length > 0 && (
            <>
              <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {visible.map((story) => (
                  <StoryRow key={story.id} story={story} />
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {filtered.length > STORY_PREVIEW && (
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
                  >
                    {showAll ? 'Show fewer' : `Show all ${filtered.length} stories`}
                  </button>
                )}
                <Link
                  to="/todays-scams?kind=federal"
                  className="text-sm font-semibold text-red-700 underline hover:text-red-800"
                >
                  Federal releases in the live feed →
                </Link>
              </div>
            </>
          )}
          {data && filtered.length === 0 && (
            <p className="mt-4 text-sm text-slate-500">
              {data.clusters.length
                ? 'Nothing matches this filter in the last 30 days.'
                : "No federal alerts recorded in the current window. DOJ and FTC enforcement activity varies week to week — a quiet stretch isn't a gap in coverage."}
            </p>
          )}
        </section>

        <aside className="space-y-6">
          {stats && stats.themes.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">Top fraud themes</h2>
              <p className="mt-1 text-xs text-slate-500">
                Stories in the last 30 days, by what the headline describes. Click to filter.
              </p>
              <ThemeBars themes={stats.themes} active={theme} onPick={setTheme} />
              <div className="mt-4 flex gap-4 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <AgencyBadge agency="DOJ" />
                  <span className="tabular-nums text-slate-700">{stats.doj_releases} releases</span>
                </div>
                <div className="flex items-center gap-2">
                  <AgencyBadge agency="FTC" />
                  <span className="tabular-nums text-slate-700">{stats.ftc_releases} releases</span>
                </div>
              </div>
            </section>
          )}

          {/* Neither DOJ nor the AG takes individual complaints directly, so
              this points to where a complaint actually goes. */}
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-semibold text-slate-900">Where to report fraud federally</h2>
            <p className="mt-2 text-sm text-slate-600">
              The DOJ prosecutes cases built from reports filed elsewhere. File with the FTC, and with the FBI for
              anything online (phishing, romance scams, crypto, business email compromise).
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href="https://reportfraud.ftc.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-red-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-red-800"
              >
                Report to the FTC →
              </a>
              <a
                href="https://www.ic3.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                Report to the FBI (IC3) →
              </a>
              <a
                href="https://www.justice.gov/news"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                DOJ press releases →
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              ScamShield National is a private service and cannot take enforcement action. If money is actively at
              risk, contact your bank first, then file with the FTC and your{' '}
              <Link to="/state-attorneys-general" className="underline">
                state Attorney General
              </Link>
              .
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
