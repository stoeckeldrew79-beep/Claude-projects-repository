import { useState } from 'react';
import { AxiosError } from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStateDetail } from '../hooks/useStates';
import { isFeedLive, useAgFeedStatus } from '../hooks/useStateAgSources';
import { US_STATE_OPTIONS, stateSlug } from '../utils/usStates';
import { useInfiniteScams } from '../hooks/useScams';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDailyScamNews } from '../hooks/useDailyNews';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { ScamCard } from '../components/ScamCard';
import { timeAgo } from '../utils/timeAgo';
import NotFound from './NotFound';

// How many live AG headlines to show before the "see all" link takes over.
const NEWS_PREVIEW = 6;

export default function StateDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: state, isLoading, isError, error } = useStateDetail(slug);
  // Only a real 404 means "no such state". A network failure or a 500 must
  // not render as "page not found" — that would tell the reader Florida
  // doesn't exist when the truth is the API is unreachable.
  const isMissing = isError && (error as AxiosError | null)?.response?.status === 404;

  // "Current" mirrors the map's own count (active, non-historical). "Full
  // timeline" additionally pulls in this state's historical entries — which
  // otherwise exist in the database but are never shown anywhere for a
  // given state — sorted earliest-first by first_recorded, so a state's
  // page can answer "how far back does this go" instead of only "what's
  // active right now".
  const [showTimeline, setShowTimeline] = useState(false);

  // Both lists are keyed off the two-letter code, which only arrives with the
  // state record, so they stay disabled until it does.
  const code = state?.state;
  const {
    data: scamPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteScams(
    showTimeline ? { state: code, view: 'all', sort: 'chronological' } : { state: code },
    Boolean(code)
  );
  const { data: news } = useDailyScamNews(code, Boolean(code));
  // Feed health is a badge, nothing more: missing data just hides it.
  const { data: feedStatus } = useAgFeedStatus();
  const navigate = useNavigate();

  const scams = scamPages?.pages.flat() ?? [];

  // No per-state, per-view (current vs. full timeline) total is fetched
  // separately here, so — same as the Database page — there's no cheap
  // number to reserve placeholder grid height against; the grid just grows
  // a row at a time as batches arrive, same as it always did.
  const setTrigger = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    Boolean(hasNextPage) && !isFetchingNextPage
  );

  useDocumentMeta({
    title: state ? `${state.state_name} Scams & Fraud Alerts` : 'State scams',
    description: state
      ? `Documented scams recorded in ${state.state_name}, live alerts from the ${state.agency_name}, and how to report fraud in ${state.state_name}.`
      : 'Scam activity recorded by US state.',
    path: `/states/${slug}`,
  });

  if (isMissing) return <NotFound />;

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Couldn&apos;t load this state</h1>
        <p className="mt-2 text-slate-600">
          The state data didn&apos;t come back. This is a problem on our end, not a missing page — try again in a
          moment.
        </p>
        <Link to="/global-map" className="mt-4 inline-block text-sm font-semibold text-red-700 underline">
          Back to the threat map →
        </Link>
      </div>
    );
  }

  if (isLoading || !state) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  const agNews = (news ?? []).filter((n) => n.source_kind === 'ag');
  const previewNews = (news ?? []).slice(0, NEWS_PREVIEW);
  const feed = feedStatus?.find((row) => row.state === state.state);
  const live = isFeedLive(feed);
  // The newest item the office itself published leads the alerts list as a
  // feature, rather than being one line among press coverage.
  const leadAlert = agNews[0];
  const restNews = previewNews.filter((n) => n.id !== leadAlert?.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="text-sm text-slate-500">
          <Link to="/state-attorneys-general" className="hover:text-slate-800 underline">
            State AGs
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{state.state_name}</span>
        </nav>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          <span className="hidden sm:inline">Jump to</span>
          <select
            value={state.state}
            onChange={(e) => navigate(`/states/${stateSlug(e.target.value)}`)}
            aria-label="Jump to another state"
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700"
          >
            {US_STATE_OPTIONS.map(([c, name]) => (
              <option key={c} value={c}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <span className="mt-6 inline-block text-xs font-bold tracking-wider uppercase text-red-600">
        State Scam Intelligence
      </span>
      <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
        Scams &amp; fraud in {state.state_name}
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Documented scams recorded in {state.state_name}, alongside consumer alerts published by the state&apos;s
        Attorney General. Updated as new activity is recorded.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <dd className="text-2xl font-bold tabular-nums text-slate-900">{state.scam_count.toLocaleString()}</dd>
          <dt className="text-[11px] leading-tight text-slate-500">Documented scams</dt>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <dd className="text-2xl font-bold tabular-nums text-slate-900">{state.ag_news_count.toLocaleString()}</dd>
          <dt className="text-[11px] leading-tight text-slate-500">Official AG alerts (30 days)</dt>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <dd className="text-2xl font-bold tabular-nums text-slate-900">{state.news_count.toLocaleString()}</dd>
          <dt className="text-[11px] leading-tight text-slate-500">Alerts &amp; coverage (30 days)</dt>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <dd className="text-2xl font-bold tabular-nums text-slate-900">{state.categories.length}</dd>
          <dt className="text-[11px] leading-tight text-slate-500">Scam categories seen</dt>
        </div>
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* Live AG activity. Sparse by nature — a quiet month is quiet, not a
            gap in coverage — so it says so rather than rendering an empty box. */}
        <section className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900">Latest alerts in {state.state_name}</h2>
            {live && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                title={`We read the ${state.agency_name}'s own releases directly.`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live feed{feed?.last_success_at && <> · checked {timeAgo(feed.last_success_at)}</>}
              </span>
            )}
          </div>
          {previewNews.length > 0 ? (
            <>
              <p className="mt-2 text-sm text-slate-500">
                {agNews.length > 0
                  ? `${agNews.length} published directly by the ${state.agency_name}.`
                  : `Coverage of ${state.state_name} consumer-protection activity.`}
              </p>
              {leadAlert && (
                <a
                  href={leadAlert.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 block rounded-xl bg-[#0f1a2b] p-5 text-white hover:bg-[#16243a]"
                >
                  <p className="text-[11px] font-bold tracking-widest text-red-300 uppercase">
                    Newest official alert{leadAlert.published_at && <> · {timeAgo(leadAlert.published_at)}</>}
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-snug group-hover:underline">{leadAlert.headline}</p>
                  {leadAlert.summary && (
                    <p className="mt-2 text-sm text-slate-300 line-clamp-3">{leadAlert.summary}</p>
                  )}
                  <p className="mt-3 text-xs text-slate-400">{leadAlert.source_name} ↗</p>
                </a>
              )}
              {restNews.length > 0 && (
                <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
                  {restNews.map((item) => (
                    <li key={item.id} className="p-4">
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-900 hover:text-red-700"
                      >
                        {item.headline}
                      </a>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.source_kind === 'ag' && (
                          <span className="mr-2 rounded bg-red-50 px-1.5 py-0.5 font-semibold text-red-700">
                            Attorney General
                          </span>
                        )}
                        {item.source_name}
                        {item.published_at && <> · {timeAgo(item.published_at)}</>}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to={`/todays-scams?state=${state.state}`}
                className="mt-4 inline-block text-sm font-semibold text-red-700 underline hover:text-red-800"
              >
                All {state.state_name} alerts →
              </Link>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              No alerts recorded for {state.state_name} in the current window. The documented scams below still
              apply — a quiet month means no new press activity, not that {state.state_name} is uncovered.
            </p>
          )}
        </section>

        {/* The AG office is the part of this page a resident can act on, so it
            sits beside the alerts (above them on a phone) rather than under
            the list. Every one of the 51 was verified live, so it's never empty. */}
        <aside className="order-first rounded-xl border border-slate-200 bg-slate-50 p-5 lg:order-none lg:sticky lg:top-24">
          <h2 className="text-base font-semibold text-slate-900">Report a {state.state_name} scam</h2>
          <p className="mt-1 font-medium text-slate-800">{state.agency_name}</p>
          <p className="mt-2 text-sm text-slate-600">{state.description}</p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={state.consumer_protection_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-red-700 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-red-800"
            >
              File a complaint with the AG ↗
            </a>
            {state.has_published_reports && state.reports_url && (
              <a
                href={state.reports_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                Consumer alerts &amp; press releases ↗
              </a>
            )}
            <Link
              to="/report"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Report it to ScamShield too
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            ScamShield National is a private service and cannot take enforcement action. If money is actively at
            risk, contact your bank first, then file with your state Attorney General and the FTC at{' '}
            <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="underline">
              reportfraud.ftc.gov
            </a>
            .
          </p>
        </aside>
      </div>

      {state.categories.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">What {state.state_name} sees most</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {state.categories.map((c) => (
              <Link
                key={c.slug}
                to={`/database?category=${c.slug}&state=${state.state}`}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-slate-400"
              >
                {c.name} <span className="font-semibold text-slate-900">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {showTimeline ? `${state.state_name}'s scam history` : `Documented scams in ${state.state_name}`}
          </h2>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setShowTimeline(false)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !showTimeline ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Current threats
            </button>
            <button
              type="button"
              onClick={() => setShowTimeline(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                showTimeline ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full timeline
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {showTimeline ? (
            <>
              Every entry documented for {state.state_name}, current and historical, ordered earliest-first by first
              recorded date. Entries without a specific documented date are listed last, not omitted.
            </>
          ) : (
            <>
              Recorded entries tied to {state.state_name} — state agency impersonations, state AG enforcement
              actions, and scams run against {state.state_name} residents.
            </>
          )}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scams.map((scam) => (
            <ScamCard key={scam.id} scam={scam} />
          ))}
        </div>
        {scams.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">No documented entries recorded for {state.state_name} yet.</p>
        )}
        {hasNextPage && <div ref={setTrigger} aria-hidden className="h-px" />}
        {isFetchingNextPage && <p className="mt-6 text-center text-sm text-slate-500">Loading more…</p>}
        {!hasNextPage && !isFetchingNextPage && scams.length > 0 && (
          <p className="mt-8 text-center text-sm text-slate-400">
            You're caught up — that's every documented entry for {state.state_name}.
          </p>
        )}
      </section>
    </div>
  );
}
