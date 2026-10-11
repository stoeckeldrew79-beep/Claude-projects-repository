import type { Ref } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories, useInfiniteScams, useScamSearch } from '../hooks/useScams';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { ScamCard } from '../components/ScamCard';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useAiTopicNews } from '../hooks/useDailyNews';
import { timeAgo } from '../utils/timeAgo';
import { Scam, DailyScamNews } from '../types';

const ALERT_DOT_COLORS: Record<string, string> = {
  low: 'bg-slate-400',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-600',
};

// This page's whole pitch is "added as soon as a real agency reports one" —
// a card grid can't actually show that, since nothing on a card says when it
// arrived. A dated, chronological row makes the freshness visible instead of
// just claimed in the subhead, the same way Today's Scams does for news.
function AiScamFeedRow({ scam }: { scam: Scam }) {
  const addedDate = new Date(scam.created_at);
  const addedDateLabel = addedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const firstRecordedYear = scam.first_recorded ? new Date(scam.first_recorded).getUTCFullYear() : null;

  return (
    <Link
      to={`/scams/${scam.slug}`}
      className="group block rounded-lg border border-slate-200 p-4 hover:border-slate-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold text-slate-900 group-hover:underline">{scam.name}</h2>
        <span className="shrink-0 text-right">
          <span className="block text-xs font-semibold text-blue-700 whitespace-nowrap">Added {addedDateLabel}</span>
          <span className="block text-[11px] text-slate-400 whitespace-nowrap">{timeAgo(scam.created_at)}</span>
        </span>
      </div>
      <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{scam.description}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {scam.alert_level && !scam.is_historical && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
            <span className={`h-1.5 w-1.5 rounded-full ${ALERT_DOT_COLORS[scam.alert_level]}`} />
            {scam.alert_level} alert
          </span>
        )}
        {scam.is_historical && (
          <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Historical
          </span>
        )}
        {firstRecordedYear && <span className="text-xs text-slate-400">First recorded {firstRecordedYear}</span>}
        {scam.category_name && (
          <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {scam.category_name}
          </span>
        )}
      </div>
    </Link>
  );
}

// Stands in for an AiScamFeedRow that hasn't loaded yet, at roughly that
// row's real height (see Notorious.tsx for the fuller explanation: without
// this the page is only as tall as what has arrived, so every batch makes
// it taller and the scrollbar thumb shrinks and slides).
function PlaceholderRow({ innerRef }: { innerRef?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      aria-hidden
      style={{ contentVisibility: 'auto', containIntrinsicSize: '128px' }}
      className="rounded-lg border border-slate-200 p-4"
    >
      <div className="h-5 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-full rounded bg-slate-50" />
      <div className="mt-1.5 h-4 w-2/3 rounded bg-slate-50" />
      <div className="mt-2 h-4 w-20 rounded bg-slate-50" />
    </div>
  );
}

// The curated cards below are the substance of this page but only grow a
// few times a week — nothing about them signals "check back today." This
// strip is the opposite trade: raw news headlines, filtered to AI/deepfake/
// voice-clone mentions out of the same feed Today's Scams reads (now
// re-scanned every 2 hours, see render.yaml), refreshed in-session. It's
// deliberately visually distinct from AiScamFeedRow below — outbound links
// to the original source, not internal links to a reviewed database entry —
// so a reader never mistakes a raw headline for a vetted pattern.
function AiActivityStrip() {
  const { data: items, isLoading } = useAiTopicNews();

  if (isLoading || !items || items.length === 0) return null;

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 border-l-4 border-l-red-300">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-extrabold tracking-wider uppercase text-slate-700">Recent AI Scam Activity</span>
        <span className="text-xs font-medium text-slate-400">— live news, not yet reviewed for the database below</span>
      </div>
      <ul className="divide-y divide-slate-200">
        {items.map((item: DailyScamNews) => (
          <li key={item.id}>
            <a
              href={item.source_url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start justify-between gap-4 px-4 py-3 hover:bg-white transition-colors"
            >
              <span className="text-sm font-semibold text-slate-900 group-hover:underline">{item.headline}</span>
              <span className="shrink-0 text-right">
                <span className="block text-xs font-semibold text-slate-500 whitespace-nowrap">
                  {timeAgo(item.published_at ?? item.scanned_at)}
                </span>
                <span className="block text-[11px] font-medium text-slate-400 whitespace-nowrap">{item.source_name}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// This is the same category the general Database page can already filter
// to (categorySlug: 'ai-deepfake-scams' in seed-data/categories.ts) — this
// page isn't a second copy of that content, it's a dedicated front door for
// it: editorial framing, a real freshness signal, and a direct line into
// the "Check This Now" tool, none of which the generic filtered database
// view has room for.
const CATEGORY_SLUG = 'ai-deepfake-scams';

export default function AIScams() {
  useDocumentMeta({
    title: 'AI-Enabled Scams',
    description:
      'Voice cloning, deepfake video calls, and AI chatbot personas are changing how scams feel from the inside. Track how they work and what to do about them.',
    path: '/ai-scams',
  });

  const [search, setSearch] = useState('');
  const { data: categories } = useCategories();
  const category = categories?.find((c) => c.slug === CATEGORY_SLUG);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteScams({ category: CATEGORY_SLUG, search: search || undefined, sort: 'newest' });

  const scams = data?.pages.flat() ?? [];
  const mostRecent = scams[0];

  const setTrigger = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    Boolean(hasNextPage) && !isFetchingNextPage
  );
  // category.scam_count is the category's true total, which only applies to
  // the unfiltered feed — mid-search there's no cheap way to know how many
  // results exist ahead of fetching them, so reservation is skipped there
  // and the plain sentinel below carries the scroll trigger instead.
  const placeholderCount = search ? 0 : Math.max((category?.scam_count ?? 0) - scams.length, 0);

  // Someone typing a real description of what happened into this box
  // doesn't know or care that it's scoped to the AI category — they just
  // want an answer. Rather than dead-ending on "no AI-enabled scams match
  // that search" when the real match just isn't an AI scam, fall back to
  // the same full-database search "Check This Now" uses once the
  // in-category search comes up empty for a non-trivial query.
  const noInCategoryMatch = !isLoading && scams.length === 0 && search.trim().length > 2;
  const { data: fallbackResults, isFetching: isFetchingFallback } = useScamSearch(noInCategoryMatch ? search : '');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <span className="inline-block text-xs font-bold tracking-wider uppercase text-red-600">
        National Scam Intelligence
      </span>
      <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">AI-Enabled Scams</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Cloned voices, deepfake video calls, and chatbot personas are changing how scams feel from the inside. This
        section exists to track the mechanisms as they're documented — added as soon as a real agency reports one,
        not on the same yearly cycle as the rest of the database.
      </p>
      {category && (
        <p className="mt-2 text-sm text-slate-500">
          {category.scam_count} pattern{category.scam_count === 1 ? '' : 's'} documented so far
          {mostRecent && <> · most recent added {timeAgo(mostRecent.created_at)}</>}
        </p>
      )}

      <AiActivityStrip />

      {/* The checker is the highest-value thing on this page for someone who
          arrived scared rather than browsing — it goes above the fold, not
          buried under the card grid. */}
      <Link
        to="/check-now"
        className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-orange-200 bg-orange-50 px-5 py-4 hover:border-orange-300 transition-colors"
      >
        <div>
          <div className="font-semibold text-slate-900">Got a call, text, or video right now?</div>
          <div className="text-sm text-slate-600 mt-0.5">
            Describe what happened and we'll check it against documented patterns in about 30 seconds.
          </div>
        </div>
        <span className="shrink-0 px-4 py-2 rounded-md bg-[#8a2e2e] text-white text-sm font-semibold whitespace-nowrap">
          Check it now →
        </span>
      </Link>

      <div className="mt-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search, or ask a real question — e.g. a call about a debt you don't recognize…"
          className="w-full max-w-2xl rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {isLoading && <p className="mt-8 text-slate-500">Loading…</p>}
      <div className="mt-6 space-y-3">
        {scams.map((scam) => (
          <AiScamFeedRow key={scam.id} scam={scam} />
        ))}
        {/* The trigger rides on the first placeholder — see Notorious.tsx for
            why a sentinel placed after the full reserved height never fires. */}
        {Array.from({ length: placeholderCount }, (_, i) => (
          <PlaceholderRow key={`placeholder-${i}`} innerRef={i === 0 ? setTrigger : undefined} />
        ))}
        {placeholderCount === 0 && hasNextPage && <div ref={setTrigger} aria-hidden className="h-px" />}
        {isFetchingNextPage && <p className="pt-2 text-sm text-slate-500">Loading more…</p>}
      </div>
      {!isLoading && scams.length === 0 && !search && <p className="mt-6 text-slate-500">No AI-enabled scams documented yet.</p>}
      {!isLoading && !hasNextPage && !isFetchingNextPage && scams.length > 0 && (
        <p className="mt-6 text-center text-sm text-slate-400">You're caught up — that's every documented pattern{search ? ' matching that search' : ''}.</p>
      )}

      {noInCategoryMatch && (
        <div className="mt-6">
          {isFetchingFallback && <p className="text-slate-500">Checking the full database…</p>}
          {!isFetchingFallback && fallbackResults && fallbackResults.length > 0 && (
            <>
              <p className="text-sm text-slate-600 mb-4">
                Nothing in AI-enabled scams matches that — but this isn't an AI scam site, it's a scam site. Here's
                what we found in the full database:
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {fallbackResults.slice(0, 6).map((scam) => (
                  <ScamCard key={scam.id} scam={scam} />
                ))}
              </div>
            </>
          )}
          {!isFetchingFallback && fallbackResults && fallbackResults.length === 0 && (
            <div>
              <p className="text-slate-500">Nothing in the database matches that closely yet.</p>
              <Link
                to={`/report?description=${encodeURIComponent(search.slice(0, 500))}`}
                className="mt-3 inline-block px-4 py-2 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
              >
                Tell us what happened →
              </Link>
            </div>
          )}
        </div>
      )}

      <p className="mt-10 pt-6 border-t border-slate-200 text-xs text-slate-400 max-w-2xl">
        Every entry here is checked against a real source before it's added — FTC, FBI/IC3, state attorneys general —
        no invented cases or statistics.
      </p>
    </div>
  );
}
