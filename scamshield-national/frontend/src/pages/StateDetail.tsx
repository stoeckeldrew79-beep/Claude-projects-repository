import { AxiosError } from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useStateDetail } from '../hooks/useStates';
import { useInfiniteScams } from '../hooks/useScams';
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

  // Both lists are keyed off the two-letter code, which only arrives with the
  // state record, so they stay disabled until it does.
  const code = state?.state;
  const {
    data: scamPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteScams({ state: code }, Boolean(code));
  const { data: news } = useDailyScamNews(code, Boolean(code));

  const scams = scamPages?.pages.flat() ?? [];

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link to="/global-map" className="hover:text-slate-800 underline">
          Threat map
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{state.state_name}</span>
      </nav>

      <span className="mt-6 inline-block text-xs font-bold tracking-wider uppercase text-red-600">
        State Scam Intelligence
      </span>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
        Scams &amp; fraud in {state.state_name}
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {state.scam_count.toLocaleString()} documented {state.scam_count === 1 ? 'scam' : 'scams'} recorded in{' '}
        {state.state_name}, alongside live consumer alerts from the state&apos;s Attorney General. Updated as new
        activity is recorded.
      </p>

      {/* The AG office is the part of this page a resident can act on, so it
          leads rather than sitting under the list. Every one of the 51 was
          verified live, so this block is never empty. */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Who to report a {state.state_name} scam to</h2>
        <p className="mt-1 font-medium text-slate-800">{state.agency_name}</p>
        <p className="mt-2 text-sm text-slate-600">{state.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={state.consumer_protection_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            File a complaint →
          </a>
          {state.has_published_reports && state.reports_url && (
            <a
              href={state.reports_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Consumer alerts &amp; press releases →
            </a>
          )}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          ScamShield National is a private service and cannot take enforcement action. If money is actively at risk,
          contact your bank first, then file with your state Attorney General and the FTC at{' '}
          <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="underline">
            reportfraud.ftc.gov
          </a>
          .
        </p>
      </section>

      {/* Live AG activity. Sparse by nature — a quiet month is quiet, not a
          gap in coverage — so it says so rather than rendering an empty box. */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900">Latest alerts in {state.state_name}</h2>
        {previewNews.length > 0 ? (
          <>
            <p className="mt-2 text-sm text-slate-500">
              {agNews.length > 0
                ? `${agNews.length} published directly by the ${state.agency_name}.`
                : `Coverage of ${state.state_name} consumer-protection activity.`}
            </p>
            <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
              {previewNews.map((item) => (
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
            <Link
              to={`/todays-scams?state=${state.state}`}
              className="mt-4 inline-block text-sm font-semibold text-red-700 underline hover:text-red-800"
            >
              All {state.state_name} alerts →
            </Link>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            No alerts recorded for {state.state_name} in the current window. The documented scams below still apply —
            a quiet month means no new press activity, not that {state.state_name} is uncovered.
          </p>
        )}
      </section>

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
        <h2 className="text-2xl font-bold text-slate-900">Documented scams in {state.state_name}</h2>
        <p className="mt-2 text-sm text-slate-500">
          Recorded entries tied to {state.state_name} — state agency impersonations, state AG enforcement actions, and
          scams run against {state.state_name} residents.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scams.map((scam) => (
            <ScamCard key={scam.id} scam={scam} />
          ))}
        </div>
        {scams.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">No documented entries recorded for {state.state_name} yet.</p>
        )}
        {hasNextPage && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-md border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
