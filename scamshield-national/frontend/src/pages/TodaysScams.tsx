import type { Ref } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useInfiniteDailyScamNews,
  useDailyNewsStates,
  useDailyScamNewsCount,
  useDailyNewsSummary,
} from '../hooks/useDailyNews';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { DailyScamNews, DailyNewsKind, DailyNewsSummary } from '../types';
import { NumberTicker } from '../components/magicui/number-ticker';
import { BlurFade } from '../components/magicui/blur-fade';
import { timeAgo } from '../utils/timeAgo';
import { stateName } from '../utils/usStates';

// Stands in for a headline that has not loaded yet, at exactly the height of
// a real row (see Notorious.tsx for the fuller explanation of why this
// exists: without it the page is only as tall as what has arrived, so every
// batch makes it taller and the scrollbar thumb shrinks and slides).
function PlaceholderRow({ innerRef }: { innerRef?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      aria-hidden
      style={{ contentVisibility: 'auto', containIntrinsicSize: '96px' }}
      className="rounded-lg border border-slate-200 p-4"
    >
      <div className="h-5 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-full rounded bg-slate-50" />
      <div className="mt-2 h-3 w-1/3 rounded bg-slate-50" />
    </div>
  );
}

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
        {item.source_kind === 'federal' && (
          <span className="rounded-sm bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-800">
            Official federal release
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

// Headline numbers for the whole 30-day window, from GET /daily-news/summary.
// Real counts only; the strip simply does not render until they arrive.
function SummaryStrip({ summary }: { summary: DailyNewsSummary }) {
  const tiles = [
    { value: summary.last_24h, label: 'Headlines in the last 24 hours' },
    {
      value: summary.official_ag,
      label: `Official alerts from ${summary.ag_states} state AG${summary.ag_states === 1 ? '' : 's'}`,
    },
    { value: summary.federal, label: 'Federal DOJ & FTC releases' },
    { value: summary.states_covered, label: 'US states with coverage' },
  ];
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {tiles.map((t, i) => (
        <div
          key={t.label}
          className={`px-4 py-4 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${
            i === 2 ? 'sm:border-l' : ''
          } border-slate-200`}
        >
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            <NumberTicker value={t.value} delay={0.05 * i} />
          </div>
          <div className="mt-1 text-xs font-medium leading-snug text-slate-500">{t.label}</div>
        </div>
      ))}
    </div>
  );
}

const KIND_CHIPS: { value: DailyNewsKind | ''; label: string }[] = [
  { value: '', label: 'All sources' },
  { value: 'ag', label: 'Official AG' },
  { value: 'federal', label: 'Federal' },
  { value: 'news', label: 'News coverage' },
];

export default function TodaysScams() {
  useDocumentMeta({
    title: "Today's Scams",
    description:
      'Live scam intelligence: news from US and international outlets plus official state Attorney General and federal DOJ/FTC alerts, scanned around the clock.',
    path: '/todays-scams',
  });

  // Arriving from the Global Map (/todays-scams?state=TX) preselects that
  // state. Read once on mount — the dropdown owns the value afterwards, so
  // changing it does not need to round-trip through the URL.
  const [searchParams] = useSearchParams();
  const initialState = (searchParams.get('state') ?? '').toUpperCase();
  const initialKind = searchParams.get('kind');
  // ?state=US is the federal feed (older Federal Watch links use it): that
  // is a source type, not a state, so it maps onto the Federal chip.
  const [state, setState] = useState<string>(
    /^[A-Z]{2}$/.test(initialState) && initialState !== 'US' ? initialState : ''
  );
  const [kind, setKind] = useState<DailyNewsKind | ''>(
    initialState === 'US'
      ? 'federal'
      : initialKind === 'ag' || initialKind === 'federal' || initialKind === 'news'
        ? initialKind
        : ''
  );
  // Federal releases are national, never tagged to a state, so the two
  // filters are mutually exclusive: picking one clears the other.
  const chooseKind = (k: DailyNewsKind | '') => {
    setKind(k);
    if (k === 'federal') setState('');
  };
  const chooseState = (st: string) => {
    setState(st);
    if (st && kind === 'federal') setKind('');
  };
  // A country axis, not a state axis — same "US Only / All Countries" split
  // as the Database page. Only meaningful without a state selected, since
  // every state-tagged row is already US; picking a state implicitly scopes
  // to it regardless of this toggle.
  const [usOnly, setUsOnly] = useState(false);
  const scope = usOnly ? 'us' : undefined;
  const {
    data: newsPages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDailyScamNews(state || undefined, scope, kind || undefined);
  const news = newsPages?.pages.flat();
  const setTrigger = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    Boolean(hasNextPage) && !isFetchingNextPage
  );
  const { data: stateCounts } = useDailyNewsStates();
  // Same state/scope/kind as the list: the backend builds both from one query,
  // so the placeholder count matches the rows the list will return exactly.
  const { data: total } = useDailyScamNewsCount(state || undefined, scope, kind || undefined);
  const { data: summary } = useDailyNewsSummary();
  // Official-only views are all US by construction; the country toggle is moot.
  const scopeLocked = Boolean(state) || kind === 'ag' || kind === 'federal';

  // Reserve a row for every headline still to come, so the page is its full
  // height immediately rather than growing (and the scrollbar thumb shrinking
  // and sliding) with every batch.
  const placeholderCount = Math.max((total ?? 0) - (news?.length ?? 0), 0);

  const selected = stateCounts?.find((s) => s.state === state);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BlurFade>
        <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-red-700 uppercase">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
          </span>
          Live feed
          {summary?.last_scanned_at && (
            <span className="font-medium normal-case tracking-normal text-slate-500">
              · last scan {timeAgo(summary.last_scanned_at)}
            </span>
          )}
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Today's Scams</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Scam intelligence scanned around the clock: news from US and international outlets every two hours, and
          official alerts straight from state Attorneys General and the federal DOJ and FTC every few hours. Every
          headline links directly to the original source — nothing here is written or verified by hand, so always
          read the full story before acting on it.
        </p>
      </BlurFade>

      {summary && <SummaryStrip summary={summary} />}

      {/* Source type first: "show me only what the authorities said" is the
          most common way to cut this feed. */}
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by source type">
        {KIND_CHIPS.map((chip) => {
          const active = kind === chip.value;
          return (
            <button
              key={chip.label}
              type="button"
              aria-pressed={active}
              onClick={() => chooseKind(chip.value)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {/* Only offer states that actually have alerts — all 51 with most of
            them empty would be a menu of dead ends. */}
        {stateCounts && stateCounts.length > 0 && (
          <>
            <label htmlFor="state-filter" className="text-sm font-medium text-slate-700">
              Filter by state
            </label>
            <select
              id="state-filter"
              value={state}
              onChange={(e) => chooseState(e.target.value)}
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
                onClick={() => chooseState('')}
                className="text-sm font-medium text-red-700 hover:underline"
              >
                Clear
              </button>
            )}
          </>
        )}

        {/* Disabled rather than hidden while a state is picked, so the toggle
            doesn't visually jump out of the layout — a state selection is
            already US-only regardless of this control's own value. */}
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
          <button
            type="button"
            disabled={scopeLocked}
            onClick={() => setUsOnly(true)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              usOnly && !scopeLocked ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            United States Only
          </button>
          <button
            type="button"
            disabled={scopeLocked}
            onClick={() => setUsOnly(false)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              !usOnly || scopeLocked ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Countries
          </button>
        </div>
      </div>

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
          // The stagger is per-screenful, not per-item: on an infinite list a
          // delay of i * 0.02 means the three-hundredth row waits six seconds
          // before it appears, which reads as the page having stopped loading.
          <BlurFade key={item.id} delay={0.03 + (i % 8) * 0.02} inView>
            <NewsRow item={item} />
          </BlurFade>
        ))}
        {/* The trigger rides on the first placeholder — see Notorious.tsx for
            why a sentinel placed after the full reserved height never fires. */}
        {Array.from({ length: placeholderCount }, (_, i) => (
          <PlaceholderRow key={`placeholder-${i}`} innerRef={i === 0 ? setTrigger : undefined} />
        ))}
        {placeholderCount === 0 && <div ref={setTrigger} aria-hidden className="h-px" />}
        {isFetchingNextPage && <p className="pt-2 text-sm text-slate-500">Loading more…</p>}
        {news && news.length === 0 && !placeholderCount && (
          <p className="text-slate-500">
            {state
              ? `No recent ${kind === 'ag' ? 'official alerts' : kind === 'news' ? 'news coverage' : 'alerts'} for ${stateName(state)} — try another state or clear the filter.`
              : kind
                ? 'Nothing from this source type in the last 30 days — try All sources.'
                : 'No scam news scanned yet — check back soon.'}
          </p>
        )}
      </div>
    </div>
  );
}
