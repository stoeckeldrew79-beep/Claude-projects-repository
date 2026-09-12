import type { Ref } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticleCount, useInfiniteArticles } from '../hooks/useArticles';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { Article } from '../types';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { NotoriousCoverArt } from '../components/NotoriousCoverArt';
import { CoverImage } from '../components/CoverImage';
import { BlurFade } from '../components/magicui/blur-fade';

function excerpt(text: string, length = 160): string {
  const plain = text.replace(/[#*_`]/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length - 1)}…` : plain;
}

// Small edit-distance check so a near-miss (typo, singular/plural, a
// dropped letter) can still land a match against a title word — a
// consumer searching this site is unlikely to know an article's exact
// wording.
function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Scores an article against each typed search term, favoring hits in the
// title over tags over the body, with a fuzzy fallback against title
// words for near-misses. Returns 0 for no match at all so the caller can
// filter articles out entirely.
// See Notorious: a stagger keyed to the running index grows without limit
// once the list pages, leaving later cards blank for many seconds.
function cardDelay(index: number): number {
  return 0.04 + (index % 4) * 0.04;
}

// A slot for an article that has not loaded yet, at exactly a card's height.
// See Notorious: without these the document grows with every batch and the
// scrollbar rescales under the reader mid-scroll.
function PlaceholderCard({ innerRef }: { innerRef?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      aria-hidden
      style={{ contentVisibility: 'auto', containIntrinsicSize: '360px' }}
      className="overflow-hidden rounded-xl border border-slate-200"
    >
      <div className="h-40 bg-slate-100 sm:h-48" />
      <div className="p-5">
        <div className="h-14 space-y-2">
          <div className="h-4 w-4/5 rounded bg-slate-100" />
          <div className="h-4 w-3/5 rounded bg-slate-100" />
        </div>
        <div className="mt-0.5 h-4" />
        <div className="mt-2 h-[3.75rem] space-y-2">
          <div className="h-3 w-full rounded bg-slate-50" />
          <div className="h-3 w-full rounded bg-slate-50" />
          <div className="h-3 w-2/3 rounded bg-slate-50" />
        </div>
      </div>
    </div>
  );
}

function relevanceScore(article: Article, terms: string[]): number {
  const title = article.title.toLowerCase();
  const titleWords = title.split(/[^a-z0-9]+/).filter(Boolean);
  const tags = (article.tags ?? []).map((t) => t.toLowerCase());
  const author = article.author?.toLowerCase() ?? '';
  const body = article.body.toLowerCase();

  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) {
      score += 10;
    } else if (tags.some((t) => t.includes(term))) {
      score += 6;
    } else if (author.includes(term)) {
      score += 4;
    } else if (body.includes(term)) {
      score += 2;
    } else {
      const maxDistance = term.length <= 4 ? 1 : 2;
      const hasCloseTitleWord = titleWords.some((w) => Math.abs(w.length - term.length) <= maxDistance && levenshtein(w, term) <= maxDistance);
      if (hasCloseTitleWord) score += 3;
    }
  }
  return score;
}

const FILTERS = [
  { tag: undefined, label: 'All' },
  { tag: 'guide', label: 'Guides' },
  { tag: 'notorious', label: 'Notorious' },
] as const;

export default function Articles() {
  useDocumentMeta({
    title: 'Articles',
    description: 'Historical scam features, fraud news, and how-to guides from ScamShield National.',
    path: '/articles',
  });

  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  // Searching hits the API, so wait for a pause in typing rather than firing
  // a request per keystroke.
  const [query, setQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteArticles({
    tag: filter,
    q: query || undefined,
  });
  const articles = useMemo(() => data?.pages.flat(), [data]);
  const sentinelRef = useInfiniteScroll(fetchNextPage, Boolean(hasNextPage) && !isFetchingNextPage);

  // Counted with the same tag and search the list uses, so the reserved space
  // matches what will actually arrive.
  const { data: total } = useArticleCount({ tag: filter, q: query || undefined });
  const placeholderCount = Math.max((total ?? 0) - (articles?.length ?? 0), 0);

  // The server decides what matches; this only orders what it returned, so a
  // title hit outranks a passing mention in a body. Ranking the accumulated
  // pages means a later page can reshuffle earlier results, which is worth
  // it because most searches fit in one page anyway.
  const filteredArticles = useMemo(() => {
    if (!articles) return articles;
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return articles;
    return articles
      .map((a) => ({ article: a, score: relevanceScore(a, terms) }))
      .sort((a, b) => b.score - a.score)
      .map((r) => r.article);
  }, [articles, query]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Articles</h1>
      <p className="text-slate-600 mb-2">
        How-to guides for recognizing common scams, plus the historical stories behind them.
      </p>
      {total !== undefined && (
        <p className="mb-6 text-sm font-medium text-slate-900">
          {query
            ? `${total.toLocaleString()} matching ${total === 1 ? 'article' : 'articles'}.`
            : `${total.toLocaleString()} articles published.`}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles…"
          className="flex-1 min-w-[200px] rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setFilter(f.tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                filter === f.tag
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-slate-500">Loading…</p>}
      {isError && <p className="text-red-700">Couldn't load articles.</p>}

      <div className="grid gap-6 sm:grid-cols-2">
        {filteredArticles?.map((article, i) => (
          <BlurFade key={article.id} delay={cardDelay(i)} inView>
            <Link
              to={`/articles/${article.slug}`}
              className="group block overflow-hidden rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="h-40 sm:h-48 overflow-hidden bg-slate-100">
                {article.cover_image ? (
                  <CoverImage
                    src={article.cover_image}
                    alt={article.title}
                    slug={article.slug}
                    position={article.cover_image_position ?? 50}
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
              {/* Fixed heights, not min-heights, and the author line is
                  reserved whether or not there is an author: a card that
                  changes size as it loads is what makes the scrollbar jump. */}
              <div className="p-5">
                <h2 className="h-14 text-lg font-semibold text-slate-900 group-hover:underline line-clamp-2">
                  {article.title}
                </h2>
                <p className="mt-0.5 h-4 text-xs text-slate-400 truncate">
                  {article.author ? `By ${article.author}` : '\u00a0'}
                </p>
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
        {articles && articles.length === 0 && !placeholderCount && !query && (
          <p className="text-slate-500 col-span-2">No articles published yet.</p>
        )}
        {articles && articles.length === 0 && !placeholderCount && query && (
          <p className="text-slate-500 col-span-2">No articles match "{query}".</p>
        )}
      </div>

      {placeholderCount === 0 && <div ref={sentinelRef} aria-hidden className="h-px" />}
      {isFetchingNextPage && <p className="mt-8 text-center text-sm text-slate-500">Loading more…</p>}
      {!hasNextPage && !isLoading && articles && articles.length > 0 && (
        <p className="mt-10 text-center text-sm text-slate-400">
          That's all {articles.length} {query ? 'matching ' : ''}articles.
        </p>
      )}
    </div>
  );
}
