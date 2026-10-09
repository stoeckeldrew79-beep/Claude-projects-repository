import { Link } from 'react-router-dom';
import { useDailyScamNews } from '../hooks/useDailyNews';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { timeAgo } from '../utils/timeAgo';

// How many live headlines to show before "see all" takes over — matches
// StateDetail's own preview length.
const NEWS_PREVIEW = 8;

export default function FederalWatch() {
  useDocumentMeta({
    title: 'Federal Watch — US Attorney General & FTC',
    description:
      "Live fraud-enforcement alerts straight from the US Department of Justice and the Federal Trade Commission, the two federal agencies that prosecute scams nationwide.",
    path: '/federal',
  });

  const { data: news, isLoading, isError } = useDailyScamNews('US');
  const previewNews = (news ?? []).slice(0, NEWS_PREVIEW);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link to="/state-attorneys-general" className="hover:text-slate-800 underline">
          State AGs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Federal Watch</span>
      </nav>

      <span className="mt-6 inline-block text-xs font-bold tracking-wider uppercase text-red-600">
        Federal Scam Intelligence
      </span>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
        The US Attorney General &amp; FTC, nationwide
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        The US Attorney General leads the Department of Justice, which prosecutes federal fraud cases nationwide. The
        Federal Trade Commission is the agency most consumer scam complaints should actually go to. Both publish
        their own enforcement news directly — this page watches both feeds and lists anything that reads as a real
        scam or fraud alert, updated as it's published.
      </p>

      {/* Who to actually contact leads the page, same as a state's own AG
          section on StateDetail — neither DOJ nor the AG takes individual
          complaints directly, so this points to where a complaint actually goes. */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Where to report fraud federally</h2>
        <p className="mt-2 text-sm text-slate-600">
          Neither the US Attorney General's office nor the DOJ takes individual fraud reports directly — they
          prosecute cases built from reports filed elsewhere. File with the FTC, and the FBI for anything involving
          the internet (phishing, romance scams, crypto, business email compromise).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Report to the FTC →
          </a>
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            Report to the FBI (IC3) →
          </a>
          <a
            href="https://www.justice.gov/news"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            DOJ press releases →
          </a>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          ScamShield National is a private service and cannot take enforcement action. If money is actively at risk,
          contact your bank first, then file with the FTC and your state Attorney General — see{' '}
          <Link to="/state-attorneys-general" className="underline">
            State Attorneys General
          </Link>
          .
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900">Latest federal alerts</h2>
        {isLoading && <p className="mt-2 text-sm text-slate-500">Loading…</p>}
        {isError && <p className="mt-2 text-sm text-red-700">Couldn't load federal alerts.</p>}
        {!isLoading && !isError && previewNews.length > 0 && (
          <>
            <p className="mt-2 text-sm text-slate-500">
              Fraud-related press releases from the Justice Department and the FTC's Consumer Protection Bureau.
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
                    <span className="mr-2 rounded bg-red-50 px-1.5 py-0.5 font-semibold text-red-700">
                      {item.source_name}
                    </span>
                    {item.published_at && <>{timeAgo(item.published_at)}</>}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              to="/todays-scams?state=US"
              className="mt-4 inline-block text-sm font-semibold text-red-700 underline hover:text-red-800"
            >
              All federal alerts →
            </Link>
          </>
        )}
        {!isLoading && !isError && previewNews.length === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            No federal alerts recorded in the current window. DOJ and FTC enforcement activity varies week to week —
            a quiet stretch isn't a gap in coverage.
          </p>
        )}
      </section>
    </div>
  );
}
