import type { Ref } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticleCount, useInfiniteArticles } from '../hooks/useArticles';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { NotoriousCoverArt } from '../components/NotoriousCoverArt';
import { CoverImage } from '../components/CoverImage';
import { BlurFade } from '../components/magicui/blur-fade';
import type { ArticleSort } from '../services/articles';

// Filter chips, each a tag the profiles actually carry. Narrowing happens on
// the server (tag=notorious&tags=<chip>) — the grid loads a window at a time,
// so a client-side filter would only ever see what had scrolled into view.
const THEMES: { tag?: string; label: string }[] = [
  { label: 'All' },
  { tag: 'ponzi-scheme', label: 'Ponzi schemes' },
  { tag: 'securities-fraud', label: 'Securities fraud' },
  { tag: 'accounting-fraud', label: 'Accounting fraud' },
  { tag: 'corruption', label: 'Corruption' },
  { tag: 'international', label: 'Outside the US' },
  { tag: 'historical', label: 'Historical' },
];

const SORTS: { key: ArticleSort | 'newest'; label: string }[] = [
  { key: 'photos-first', label: 'Featured' },
  { key: 'newest', label: 'Recently added' },
  { key: 'title', label: 'A–Z' },
];

// The single most specific theme a profile carries, for the card's corner
// badge — a scheme type beats "Outside the US" beats "Historical".
function cardTheme(tags: string[] | null): string | null {
  if (!tags) return null;
  for (const t of THEMES) if (t.tag && tags.includes(t.tag)) return t.label;
  return null;
}

// Cards fade in with a slight stagger, but the stagger has to reset. Keyed
// to the running index it grew without limit — card 300 waited 15 seconds
// before appearing, so scrolling deep into the collection meant scrolling
// into blank space. Cycling over a row's worth keeps the effect and caps
// the wait at a fifth of a second.
function cardDelay(index: number): number {
  return 0.06 + (index % 4) * 0.05;
}

// Stands in for a profile that has not loaded yet, at exactly the height of a
// real card. Without these the document is only as tall as what has arrived,
// so every batch makes it taller and the scrollbar thumb shrinks and slides —
// the page fights the reader precisely when they are moving through it. With
// them the height is right from the first paint and never changes.
function PlaceholderCard({ innerRef }: { innerRef?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      aria-hidden
      // There can be hundreds of these. content-visibility lets the browser
      // skip laying out the ones off screen while still reserving their
      // height, which is the whole point of them being here.
      style={{ contentVisibility: 'auto', containIntrinsicSize: '388px' }}
      className="overflow-hidden rounded-xl border border-slate-200"
    >
      <div className="h-56 bg-slate-100" />
      <div className="p-5">
        <div className="h-14 space-y-2">
          <div className="h-4 w-4/5 rounded bg-slate-100" />
          <div className="h-4 w-3/5 rounded bg-slate-100" />
        </div>
        <div className="mt-2 h-[3.75rem] space-y-2">
          <div className="h-3 w-full rounded bg-slate-50" />
          <div className="h-3 w-full rounded bg-slate-50" />
          <div className="h-3 w-2/3 rounded bg-slate-50" />
        </div>
      </div>
    </div>
  );
}

function excerpt(text: string, length = 180): string {
  const plain = text.replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length - 1)}…` : plain;
}

export default function Notorious() {
  useDocumentMeta({
    title: 'Notorious Scams & Scammers',
    description:
      'The true stories behind history’s most infamous cons — from Charles Ponzi to Bernie Madoff — and the psychology that made them work.',
    path: '/notorious',
  });

  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<ArticleSort | 'newest'>('photos-first');
  const [search, setSearch] = useState('');
  // Searching hits the API, so wait for a pause in typing rather than firing
  // a request per keystroke.
  const [query, setQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  // By default ("Featured") profiles with a real, rights-cleared photo lead
  // and ones still waiting on the photo-hunt routine sort to the back. Every
  // ordering is the server's job — sorting here would only order the pages
  // already loaded, so the grid would alternate photo and no-photo blocks as
  // the reader scrolled.
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteArticles({
    tag: 'notorious',
    tags: theme,
    q: query || undefined,
    sort: sort === 'newest' ? undefined : sort,
  });
  // The scale of the collection is the point of it, and paging means the
  // grid can never show it. Counted separately and stated up front. The
  // filtered count takes the same tag/tags/q as the list, so the reserved
  // placeholder space matches what will actually arrive.
  const { data: grandTotal } = useArticleCount({ tag: 'notorious' });
  const { data: total } = useArticleCount({ tag: 'notorious', tags: theme, q: query || undefined });
  const isFiltered = Boolean(theme || query);

  const sortedArticles = useMemo(() => data?.pages.flat(), [data]);
  const sentinelRef = useInfiniteScroll(fetchNextPage, Boolean(hasNextPage) && !isFetchingNextPage);

  // Reserve a slot for every profile still to come, so the page is its full
  // height immediately. Falls back to none when the count has not arrived —
  // an unknown total is better than a wrong one.
  const placeholderCount = Math.max((total ?? 0) - (sortedArticles?.length ?? 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <BlurFade>
        <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Notorious</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Scams & Scammers</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          The true stories behind history's most infamous cons — how they worked, why they fooled so many people,
          and what happened when they finally fell apart.
        </p>
        {grandTotal !== undefined && (
          <p className="mt-4 text-sm font-medium text-slate-900">
            {grandTotal.toLocaleString()} profiles documented.
          </p>
        )}
      </BlurFade>

      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M8 3a5 5 0 103.2 8.9l3.4 3.4a1 1 0 001.4-1.4l-3.4-3.4A5 5 0 008 3zM5 8a3 3 0 116 0 3 3 0 01-6 0z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a name, scheme or country…"
              aria-label="Search notorious profiles"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as ArticleSort | 'newest')}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700"
            >
              {SORTS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {THEMES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTheme(t.tag)}
              aria-pressed={theme === t.tag}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                theme === t.tag
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {isFiltered && total !== undefined && (
        <p className="mt-4 text-sm text-slate-500" aria-live="polite">
          {total.toLocaleString()} matching {total === 1 ? 'profile' : 'profiles'}
          {query && <> for &ldquo;{query}&rdquo;</>}.
        </p>
      )}

      {isLoading && <p className="mt-8 text-slate-500">Loading…</p>}
      {isError && <p className="mt-8 text-red-700">Couldn't load this collection.</p>}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {sortedArticles?.map((article, i) => (
          <BlurFade key={article.id} delay={cardDelay(i)} inView>
            <Link
              to={`/articles/${article.slug}`}
              className="group block overflow-hidden rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                {cardTheme(article.tags) && (
                  <span className="absolute left-3 top-3 z-[1] rounded-full bg-[#0f1a2b]/85 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {cardTheme(article.tags)}
                  </span>
                )}
                {article.cover_image ? (
                  <CoverImage
                    src={article.cover_image}
                    alt={article.title}
                    slug={article.slug}
                    position={article.cover_image_position}
                    // The first few are above the fold and worth fetching at
                    // once; the rest would otherwise all download together and
                    // queue the ones being scrolled to behind the ones behind.
                    priority={i < 4}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <NotoriousCoverArt slug={article.slug} className="h-full transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              {/* Fixed heights, not min-heights: a card that shrinks to fit a
                  short title would change the page height as it loads, which
                  is what makes the scrollbar jump. h-14 is two lines of
                  text-lg, h-[3.75rem] three lines of text-sm. */}
              <div className="p-5">
                <h2 className="h-14 text-lg font-semibold text-slate-900 group-hover:underline line-clamp-2">
                  {article.title}
                </h2>
                <p className="mt-2 h-[3.75rem] text-sm text-slate-600 line-clamp-3">{excerpt(article.body)}</p>
              </div>
            </Link>
          </BlurFade>
        ))}
        {/* The trigger rides on the first placeholder. A sentinel after the
            grid sat below every placeholder — hundreds of cards down — so it
            never entered view and the next page never loaded. */}
        {Array.from({ length: placeholderCount }, (_, i) => (
          <PlaceholderCard key={`placeholder-${i}`} innerRef={i === 0 ? sentinelRef : undefined} />
        ))}
        {sortedArticles && sortedArticles.length === 0 && !placeholderCount && (
          <p className="text-slate-500 sm:col-span-2">
            {isFiltered ? 'No profiles match — try a different search or theme.' : 'No entries published yet.'}
          </p>
        )}
      </div>

      {placeholderCount === 0 && <div ref={sentinelRef} aria-hidden className="h-px" />}
      {isFetchingNextPage && <p className="mt-8 text-center text-sm text-slate-500">Loading more…</p>}
      {!hasNextPage && !isLoading && sortedArticles && sortedArticles.length > 0 && (
        <p className="mt-10 text-center text-sm text-slate-400">
          That's all {sortedArticles.length.toLocaleString()} {isFiltered ? 'matching ' : ''}profiles.
        </p>
      )}
    </div>
  );
}
