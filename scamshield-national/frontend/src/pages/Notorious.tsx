import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useArticleCount, useInfiniteArticles } from '../hooks/useArticles';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { NotoriousCoverArt } from '../components/NotoriousCoverArt';
import { BlurFade } from '../components/magicui/blur-fade';

// Cards fade in with a slight stagger, but the stagger has to reset. Keyed
// to the running index it grew without limit — card 300 waited 15 seconds
// before appearing, so scrolling deep into the collection meant scrolling
// into blank space. Cycling over a row's worth keeps the effect and caps
// the wait at a fifth of a second.
function cardDelay(index: number): number {
  return 0.06 + (index % 4) * 0.05;
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

  // Profiles with a real, rights-cleared photo lead the collection; ones still
  // waiting on the photo-hunt routine sort to the back. That ordering is the
  // server's job now — sorting here would only order the pages already loaded,
  // so the grid would alternate photo and no-photo blocks as the reader
  // scrolled.
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteArticles({
    tag: 'notorious',
    sort: 'photos-first',
  });
  // The scale of the collection is the point of it, and paging means the
  // grid can never show it. Counted separately and stated up front.
  const { data: total } = useArticleCount('notorious');

  const sortedArticles = useMemo(() => data?.pages.flat(), [data]);
  const sentinelRef = useInfiniteScroll(fetchNextPage, Boolean(hasNextPage) && !isFetchingNextPage);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <BlurFade>
        <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Notorious</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Scams & Scammers</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          The true stories behind history's most infamous cons — how they worked, why they fooled so many people,
          and what happened when they finally fell apart.
        </p>
        {total !== undefined && (
          <p className="mt-4 text-sm font-medium text-slate-900">
            {total.toLocaleString()} profiles documented.
          </p>
        )}
      </BlurFade>

      {isLoading && <p className="mt-8 text-slate-500">Loading…</p>}
      {isError && <p className="mt-8 text-red-700">Couldn't load this collection.</p>}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {sortedArticles?.map((article, i) => (
          <BlurFade key={article.id} delay={cardDelay(i)} inView>
            <Link
              to={`/articles/${article.slug}`}
              className="group block overflow-hidden rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="h-56 overflow-hidden">
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: `50% ${article.cover_image_position}%` }}
                  />
                ) : (
                  <NotoriousCoverArt slug={article.slug} className="h-full transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-slate-900 group-hover:underline">{article.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{excerpt(article.body)}</p>
              </div>
            </Link>
          </BlurFade>
        ))}
        {sortedArticles && sortedArticles.length === 0 && (
          <p className="text-slate-500 col-span-2">No entries published yet.</p>
        )}
      </div>

      <div ref={sentinelRef} aria-hidden className="h-px" />
      {isFetchingNextPage && <p className="mt-8 text-center text-sm text-slate-500">Loading more…</p>}
      {!hasNextPage && !isLoading && sortedArticles && sortedArticles.length > 0 && (
        <p className="mt-10 text-center text-sm text-slate-400">
          That's all {sortedArticles.length.toLocaleString()} profiles.
        </p>
      )}
    </div>
  );
}
