import { useState } from 'react';
import { useDailyScamNews, useDailyNewsStates } from '../hooks/useDailyNews';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { DailyScamNews } from '../types';
import { BlurFade } from '../components/magicui/blur-fade';
import { timeAgo } from '../utils/timeAgo';
import { stateName } from '../utils/usStates';

function NewsRow({ item }: { item: DailyScamNews }) {
  const isAgAlert = item.source_kind === 'ag';
  return (
    <a
      href={item.source_url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-lg border border-slate-200 p-4 hover:border-slate-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold text-slate-900 group-hover:underline">{item.headline}</h2>
        <span className="shrink-0 text-xs text-slate-400 whitespace-nowrap">
          {timeAgo(item.published_at ?? item.scanned_at)}
        </span>
      </div>
      {item.summary && <p className="mt-1.5 text-sm text-slate-600">{item.summary}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className="text-xs font-medium text-red-700">{item.source_name}</p>
        {/* An alert straight from the state's own Attorney General carries more
            weight than press coverage about it, so it is labelled as such. */}
        {isAgAlert && (
          <span className="rounded-sm bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-800">
            Official AG alert
          </span>
        )}
        {item.state && (
          <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {item.state}
          </span>
        )}
      </div>
    </a>
  );
}

export default function TodaysScams() {
  useDocumentMeta({
    title: "Today's Scams",
    description:
      'Real scam-related news headlines from US and international outlets, plus official state Attorney General alerts, scanned automatically and updated daily.',
    path: '/todays-scams',
  });

  const [state, setState] = useState<string>('');
  const { data: news, isLoading, isError } = useDailyScamNews(state || undefined);
  const { data: stateCounts } = useDailyNewsStates();

  const selected = stateCounts?.find((s) => s.state === state);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BlurFade>
        <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Live feed</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Today's Scams</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Real scam-related news from US and international outlets, scanned automatically and updated daily. Every headline
          links directly to the original story at its source — nothing here is written or verified by hand, so
          always read the full article before acting on it.
        </p>
      </BlurFade>

      {/* Only offer states that actually have alerts — all 51 with most of them
          empty would be a menu of dead ends. */}
      {stateCounts && stateCounts.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label htmlFor="state-filter" className="text-sm font-medium text-slate-700">
            Filter by state
          </label>
          <select
            id="state-filter"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All states &amp; international</option>
            {stateCounts.map((s) => (
              <option key={s.state} value={s.state}>
                {stateName(s.state)} ({s.total})
              </option>
            ))}
          </select>
          {state && (
            <button
              type="button"
              onClick={() => setState('')}
              className="text-sm font-medium text-red-700 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {selected && (
        <p className="mt-3 text-sm text-slate-600">
          {selected.ag_count > 0 ? (
            <>
              {selected.ag_count} official alert{selected.ag_count === 1 ? '' : 's'} published directly by the{' '}
              {stateName(selected.state)} Attorney General, plus news coverage.
            </>
          ) : (
            // Deliberately not phrased as "this AG publishes no feed": several
            // offices do publish one that is simply empty right now, and the
            // count alone cannot tell those two cases apart.
            <>
              No official {stateName(selected.state)} Attorney General alerts in the last 30 days — these are news
              reports mentioning that office.
            </>
          )}
        </p>
      )}

      {isLoading && <p className="mt-8 text-slate-500">Loading…</p>}
      {isError && <p className="mt-8 text-red-700">Couldn't load today's scam news.</p>}

      <div className="mt-8 space-y-3">
        {news?.map((item, i) => (
          <BlurFade key={item.id} delay={0.03 + i * 0.02} inView>
            <NewsRow item={item} />
          </BlurFade>
        ))}
        {news && news.length === 0 && (
          <p className="text-slate-500">
            {state
              ? `No recent alerts for ${stateName(state)} — try another state or clear the filter.`
              : 'No scam news scanned yet — check back soon.'}
          </p>
        )}
      </div>
    </div>
  );
}
