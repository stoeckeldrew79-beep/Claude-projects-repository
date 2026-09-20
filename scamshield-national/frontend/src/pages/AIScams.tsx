import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories, useInfiniteScams, useScamSearch } from '../hooks/useScams';
import { ScamCard } from '../components/ScamCard';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { timeAgo } from '../utils/timeAgo';

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
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scams.map((scam) => (
          <ScamCard key={scam.id} scam={scam} />
        ))}
      </div>
      {!isLoading && scams.length === 0 && !search && <p className="mt-6 text-slate-500">No AI-enabled scams documented yet.</p>}

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

      <p className="mt-10 pt-6 border-t border-slate-200 text-xs text-slate-400 max-w-2xl">
        Every entry here is checked against a real source before it's added — FTC, FBI/IC3, state attorneys general —
        no invented cases or statistics.
      </p>
    </div>
  );
}
