import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScamSearch } from '../hooks/useScams';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useDebounce } from '../hooks/useDebounce';
import { ScamCard } from '../components/ScamCard';

interface QuickChip {
  key: string;
  label: string;
  starter: string;
}

const CHIPS: QuickChip[] = [
  { key: 'family', label: 'A call sounded like family', starter: 'I got a call that sounded exactly like my ' },
  { key: 'video', label: 'A video call looked off', starter: 'I was on a video call and something about their face or voice seemed ' },
  { key: 'crypto', label: 'Told to move money to crypto fast', starter: 'Someone I was talking to online is telling me to move money into crypto right away because ' },
  { key: 'text', label: 'A text about a toll or package', starter: 'I got a text saying I owe money for a ' },
  { key: 'stranger', label: 'A stranger online got serious fast', starter: 'Someone I met online a few weeks ago is already talking about ' },
];

export default function CheckNow() {
  useDocumentMeta({
    title: 'Check This Now',
    description: 'Describe a call, text, or video you\'re unsure about and check it against documented scam patterns in about 30 seconds.',
    path: '/check-now',
  });

  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState<string | null>(null);
  // Real-time-feeling without hammering the search endpoint on every
  // keystroke: the query only actually updates 400ms after typing stops.
  const debouncedDraft = useDebounce(draft, 400);
  // isLoading (not isFetching): with placeholderData on useScamSearch, a
  // background refetch on a new keystroke should keep the previous matches
  // on screen instead of blanking back to "Checking…" — isLoading is only
  // true when there's no data at all yet.
  const { data: results, isLoading } = useScamSearch(query || debouncedDraft);

  const effectiveQuery = query || debouncedDraft;
  const hasSearched = effectiveQuery.trim().length > 2;
  const topMatch = results?.[0];
  const otherMatches = results?.slice(1, 4) ?? [];

  function pickChip(chip: QuickChip) {
    setActiveChip(chip.key);
    setDraft(chip.starter);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(draft);
  }

  function reset() {
    setDraft('');
    setQuery('');
    setActiveChip(null);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center">
        <span className="inline-block text-xs font-bold tracking-wider uppercase text-red-600">
          Take a breath — let's check
        </span>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Not sure if this is a scam?
        </h1>
        <p className="mt-3 text-slate-600">
          Tell us what happened, in your own words. We'll check it against real, source-checked patterns already in
          the database.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {CHIPS.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => pickChip(chip)}
            className={`text-sm px-3.5 py-2 rounded-full border transition-colors ${
              activeChip === chip.key
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Paste the message, or describe the call or video in your own words…"
          rows={5}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="submit"
            disabled={draft.trim().length < 3}
            className="px-6 py-3 rounded-md bg-[#8a2e2e] text-white font-semibold hover:bg-[#7a2626] disabled:opacity-40 transition-colors"
          >
            Check this →
          </button>
        </div>
      </form>
      <p className="mt-3 text-center text-xs text-slate-400">
        Nothing typed here is saved or shared. This only looks for matching patterns — it can't be certain, so trust
        your gut too.
      </p>

      {hasSearched && (
        <div className="mt-10">
          {isLoading && <p className="text-center text-slate-500">Checking…</p>}

          {!isLoading && topMatch && (
            <>
              <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                Closest match
              </p>
              <ScamCard scam={topMatch} />

              {otherMatches.length > 0 && (
                <>
                  <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400 mt-8 mb-3">
                    Other possible matches
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {otherMatches.map((s) => (
                      <ScamCard key={s.id} scam={s} />
                    ))}
                  </div>
                </>
              )}

              <div className="mt-8 text-center">
                <button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                  Check something else
                </button>
              </div>
            </>
          )}

          {!isLoading && results && results.length === 0 && (
            <div className="text-center">
              <p className="text-slate-700 font-medium">Nothing in the database matches that closely yet.</p>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                That doesn't mean it's safe — it may just be a pattern we haven't documented. If money or personal
                information is on the line, stop and verify independently before doing anything else: hang up and
                call the person or company back on a number you already have, never one given to you in the message.
              </p>
              <Link
                to={`/report?description=${encodeURIComponent(effectiveQuery.slice(0, 500))}`}
                className="mt-4 inline-block px-5 py-2.5 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
              >
                Tell us what happened →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
