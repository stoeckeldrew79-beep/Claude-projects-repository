import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useScam } from '../hooks/useScams';
import { fetchScams } from '../services/scams';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { ScamCard } from '../components/ScamCard';
import { ShareButton } from '../components/ShareButton';
import { tagLabel } from '../utils/scamTags';
import { countryName } from '../utils/countries';
import { stateName, stateSlug } from '../utils/usStates';
import type { AlertLevel } from '../types';

function excerpt(text: string, length = 155): string {
  const plain = text.replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length - 1)}…` : plain;
}

const SEVERITY: Record<AlertLevel, { label: string; badge: string; bar: string; note: string }> = {
  critical: {
    label: 'Critical alert',
    badge: 'bg-red-700 text-white',
    bar: 'bg-red-700',
    note: 'Active, widespread and causing serious losses right now.',
  },
  high: {
    label: 'High alert',
    badge: 'bg-orange-100 text-orange-800 ring-1 ring-orange-200',
    bar: 'bg-orange-500',
    note: 'Actively circulating and costly for the people it reaches.',
  },
  medium: {
    label: 'Medium alert',
    badge: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
    bar: 'bg-yellow-400',
    note: 'Documented and circulating; stay alert to it.',
  },
  low: {
    label: 'Low alert',
    badge: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    bar: 'bg-slate-400',
    note: 'Documented, with limited current activity.',
  },
};
const LEVEL_ORDER: AlertLevel[] = ['low', 'medium', 'high', 'critical'];

// Abbreviations that end in a period but don't end a sentence, so "U.S.
// Postal Service" or "Dr. Smith" isn't split in two.
const NON_TERMINAL = /(?:\b[A-Z]\.|\b(?:Mr|Mrs|Ms|Dr|St|Jr|Sr|Inc|Co|Corp|Ltd|No|vs|etc|e\.g|i\.e|U\.S|Gov|Dept|approx)\.)$/;

function sentences(text: string): string[] {
  const out: string[] = [];
  // No lookbehind: older Safari can't parse one, and a regex literal it
  // can't parse takes the whole bundle down. The capture group keeps the
  // terminal punctuation, which is glued back onto the sentence before it.
  const raw = text.replace(/\s+/g, ' ').trim().split(/([.!?]["”’)]?)\s+(?=["“(]?[A-Z0-9])/);
  const parts: string[] = [];
  for (let i = 0; i < raw.length; i += 2) parts.push(raw[i] + (raw[i + 1] ?? ''));
  for (const part of parts) {
    if (out.length && NON_TERMINAL.test(out[out.length - 1])) out[out.length - 1] += ` ${part}`;
    else out.push(part);
  }
  return out;
}

// A sentence that tells the reader what to do, rather than describing the
// scam. Descriptions are written as "how it works", then advice — so this
// only re-shelves the entry's own sentences; nothing is added or reworded.
const ADVICE =
  /^(?:never|don['’]t|do not|report|verify|contact|call|hang up|check|if (?:you|someone|anyone)|when (?:you|in doubt)|before (?:you|paying|sending|clicking|signing)|ignore|dispute|always|be (?:wary|cautious|skeptical|suspicious)|treat|look up|talk to|ask|search|delete|block|freeze|stop|go directly|reach out|confirm|instead|to protect|protect|watch for|slow down|no legitimate|legitimate (?:\w+ )?(?:never|will never|do not|don['’]t|won['’]t))\b/i;

// Advice phrased mid-sentence: "Consumers should…", "INSS urged the public
// to verify…", "A real employer will never…".
const ADVICE_INLINE =
  /\b(?:you|victims|consumers|anyone|residents|people|buyers|investors|parents|seniors|families|the public) (?:should|can protect|can report)\b|\b(?:urged|urges|advised|advises|encouraged|encourages|recommends|recommended) (?:the public|consumers|residents|people|anyone|victims|investors|parents)\b|\breport (?:it|them|this|the (?:scam|attempt|approach|call|message|incident|fraud))\b|\b(?:legitimate|real|genuine) [\w ]{0,40}(?:will never|never|do not|don['’]t|won['’]t)\b/i;

function isAdvice(sentence: string): boolean {
  if (/^instead of\b/i.test(sentence)) return false;
  return ADVICE.test(sentence) || ADVICE_INLINE.test(sentence);
}

function splitDescription(text: string): { how: string[]; todo: string[] } {
  const how: string[] = [];
  const todo: string[] = [];
  for (const s of sentences(text)) (isAdvice(s) ? todo : how).push(s);
  return { how, todo };
}

function formatYear(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : String(d.getUTCFullYear());
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function ScamDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: scam, isLoading } = useScam(slug);
  // Same-category neighbours. Disabled until the entry says which category
  // it is, so the first render doesn't fetch the whole database.
  const { data: categoryScams } = useQuery({
    queryKey: ['scams', { category: scam?.category_slug, sort: 'alert_level' }],
    queryFn: () => fetchScams({ category: scam?.category_slug as string, sort: 'alert_level' }),
    enabled: Boolean(scam?.category_slug),
  });

  useDocumentMeta({
    title: scam?.name ?? 'Scam Detail',
    description: scam ? excerpt(scam.description) : 'Scam details from the ScamShield National database.',
    path: `/scams/${slug}`,
  });

  const related = useMemo(
    () => (scam?.category_slug ? (categoryScams ?? []).filter((s) => s.id !== scam.id).slice(0, 6) : []),
    [categoryScams, scam]
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10" aria-busy>
        <div className="h-4 w-40 rounded bg-slate-100" />
        <div className="mt-4 h-9 w-3/4 rounded bg-slate-100" />
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 rounded bg-slate-50" />
          ))}
        </div>
      </div>
    );
  }
  if (!scam) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Scam not found</h1>
        <p className="mt-2 text-slate-600">It may have been merged into another entry.</p>
        <Link to="/database" className="mt-4 inline-block text-sm font-semibold text-red-700 underline">
          Search the scam database →
        </Link>
      </div>
    );
  }

  const severity = scam.alert_level && !scam.is_historical ? SEVERITY[scam.alert_level] : null;
  const { how, todo } = splitDescription(scam.description);
  // Only worth structuring when the entry has both halves; otherwise the
  // description reads best as written.
  const structured = how.length > 0 && todo.length > 0;
  const firstYear = formatYear(scam.first_recorded);
  const states = (scam.locations ?? []).filter((l) => l.state && !l.is_nationwide).map((l) => l.state as string);
  const nationwide = (scam.locations ?? []).some((l) => l.is_nationwide);
  const reportHref = `/report?name=${encodeURIComponent(scam.name)}${
    scam.category_id ? `&category=${encodeURIComponent(scam.category_id)}` : ''
  }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <nav className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
        <Link to="/database" className="hover:text-slate-800 hover:underline">
          Scam database
        </Link>
        {scam.category_name && scam.category_slug && (
          <>
            <span>/</span>
            <Link to={`/database?category=${scam.category_slug}`} className="hover:text-slate-800 hover:underline">
              {scam.category_name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {severity && (
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase ${severity.badge}`}>
            {severity.label}
          </span>
        )}
        {scam.is_historical && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold tracking-wide text-slate-600 uppercase">
            Historical
          </span>
        )}
        {scam.category_name && (
          <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
            {scam.category_name}
          </span>
        )}
      </div>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{scam.name}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {[
          scam.country ? countryName(scam.country) : null,
          firstYear ? `First recorded ${firstYear}` : null,
          scam.sources?.length ? `${scam.sources.length} official ${scam.sources.length === 1 ? 'source' : 'sources'}` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
      </p>

      {/* Targeting is a filterable axis, so each chip links into the database
          filtered to that audience rather than being decoration. */}
      {scam.tags && scam.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {scam.tags.map((t) => (
            <Link
              key={t}
              to={`/database?tag=${encodeURIComponent(t)}`}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              Targets: {tagLabel(t)}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to={reportHref} className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">
          Report this scam
        </Link>
        <ShareButton title={scam.name} text={`Scam warning: ${scam.name}`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0 space-y-6">
          {structured ? (
            <>
              <section>
                <h2 className="text-xl font-bold text-slate-900">How it works</h2>
                <div className="mt-3 space-y-4 text-[17px] leading-8 text-slate-700">
                  <p>{how.join(' ')}</p>
                </div>
              </section>
              <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <svg viewBox="0 0 20 20" className="h-5 w-5 text-emerald-700" fill="currentColor" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M10 1.5l7 3v5c0 4.3-3 7.9-7 9-4-1.1-7-4.7-7-9v-5l7-3zm3.7 6.2a1 1 0 00-1.4-1.4L9 9.6 7.7 8.3a1 1 0 10-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  What to do
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {todo.map((t, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-7 text-slate-800">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <section>
              <h2 className="text-xl font-bold text-slate-900">{scam.is_historical ? 'The story' : 'How it works'}</h2>
              <p className="mt-3 whitespace-pre-line text-[17px] leading-8 text-slate-700">{scam.description}</p>
            </section>
          )}

          {(states.length > 0 || nationwide) && (
            <section>
              <h2 className="text-lg font-bold text-slate-900">Where it&apos;s been reported</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {nationwide && (
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">Nationwide</span>
                )}
                {states.map((code) => (
                  <Link
                    key={code}
                    to={`/states/${stateSlug(code)}`}
                    className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:border-red-300 hover:text-red-700"
                  >
                    {stateName(code)}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          {severity && scam.alert_level && (
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Threat level</p>
              <div className="mt-2 flex gap-1" aria-hidden>
                {LEVEL_ORDER.map((lvl, i) => (
                  <span
                    key={lvl}
                    className={`h-2 flex-1 rounded-full ${
                      i <= LEVEL_ORDER.indexOf(scam.alert_level as AlertLevel) ? severity.bar : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 font-semibold text-slate-900">{severity.label}</p>
              <p className="text-sm text-slate-600">{severity.note}</p>
            </div>
          )}

          {(scam.source_url || (scam.sources && scam.sources.length > 0)) && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Official source</p>
              {scam.sources && scam.sources.length > 0 && (
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {scam.sources.map((s) => (
                    <li key={s} className="leading-snug">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              {scam.source_url && (
                <a
                  href={scam.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400"
                >
                  <span className="truncate">Read on {hostname(scam.source_url)}</span>
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          )}

          <div className="rounded-xl bg-[#0f1a2b] p-4 text-white">
            <p className="font-semibold">Targeted by this scam?</p>
            <p className="mt-1 text-sm text-slate-300">
              If money has left your account, call your bank first. Then report it — to us, and to the FTC at{' '}
              <a href="https://reportfraud.ftc.gov" target="_blank" rel="noreferrer" className="underline">
                reportfraud.ftc.gov
              </a>
              .
            </p>
            <Link
              to={reportHref}
              className="mt-3 block rounded-lg bg-red-700 px-3 py-2 text-center text-sm font-semibold hover:bg-red-600"
            >
              Report a sighting
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && scam.category_slug && (
        <section className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900">More {scam.category_name ?? 'related'} scams</h2>
            <Link
              to={`/database?category=${scam.category_slug}`}
              className="text-sm font-semibold text-red-700 hover:text-red-800"
            >
              See all →
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ScamCard key={s.id} scam={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
