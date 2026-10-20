import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { ScamCard } from '../components/ScamCard';
import { checkMessage, CheckResult, CheckVerdict } from '../services/scamCheck';

// Real scam messages, so a first-time visitor can see the checker work
// before they have anything of their own to paste.
const EXAMPLES: { label: string; text: string }[] = [
  {
    label: 'Toll text',
    text: 'E-ZPass: You have an unpaid toll balance of $4.15. Pay within 24 hours to avoid a late fee: https://ezpass-tollpay.top/pay',
  },
  {
    label: 'Bank alert',
    text: 'Chase Alert: Unusual sign-in activity detected. Your account will be locked. Verify your identity now: chase-secure-verify.com',
  },
  {
    label: '"Grandma, it\'s me"',
    text: "Grandma it's me, I had an accident and I'm in jail. I need bail money right away. Please don't tell mom and dad.",
  },
  {
    label: 'Tech support',
    text: 'Microsoft Support: your computer has a virus. Call us immediately and install AnyDesk so we can remove it.',
  },
];

const VERDICT: Record<CheckVerdict, { label: string; blurb: string; shell: string; badge: string }> = {
  high_risk: {
    label: 'High risk: this looks like a scam',
    blurb: 'It has the hallmarks of a scam. Don\'t click, pay, call back or reply. Use the steps below.',
    shell: 'border-red-300 bg-red-50',
    badge: 'bg-red-600 text-white',
  },
  suspicious: {
    label: 'Be careful: warning signs found',
    blurb: 'Some parts of this are common in scams. Verify it yourself before doing anything it asks.',
    shell: 'border-amber-300 bg-amber-50',
    badge: 'bg-amber-500 text-white',
  },
  no_signs: {
    label: 'No common warning signs found',
    blurb: 'That doesn\'t make it safe — new scams appear every day. If money or personal details are involved, verify it independently first.',
    shell: 'border-slate-300 bg-slate-50',
    badge: 'bg-slate-700 text-white',
  },
};

const SEVERITY_DOT = { high: 'bg-red-600', medium: 'bg-amber-500', low: 'bg-slate-400' } as const;

const AI_LABEL: Record<NonNullable<CheckResult['ai']>['verdict'], string> = {
  likely_scam: 'Likely a scam',
  suspicious: 'Suspicious',
  likely_legitimate: 'Probably legitimate',
  not_enough_information: 'Not enough to tell',
};

// Steps for someone who has already acted. Each is specific to how the
// money or information left, because that decides who can still stop it.
const ALREADY_ACTED: { title: string; steps: string[] }[] = [
  {
    title: 'Paid by card, bank transfer, Zelle or wire',
    steps: [
      'Call your bank or card issuer now, on the number on the back of your card — ask them to stop or reverse the payment and flag it as fraud.',
      'Speed matters most here: transfers are often recoverable only in the first hours.',
    ],
  },
  {
    title: 'Paid with gift cards',
    steps: [
      'Contact the company that issued the gift card (the brand on the card) right away and tell them it was used in a scam. Keep the cards and receipts.',
    ],
  },
  {
    title: 'Sent crypto',
    steps: [
      'Contact the exchange or ATM operator you used and report the transaction.',
      'Report it to the FBI at ic3.gov with the wallet address and transaction ID. Beware of anyone offering to "recover" it for a fee — that is a second scam.',
    ],
  },
  {
    title: 'Shared a password, code or let them on your computer',
    steps: [
      'Disconnect the device from the internet, then change your email and bank passwords from a different device.',
      'Turn on two-step verification and check your accounts for changes you didn\'t make.',
    ],
  },
  {
    title: 'Gave your Social Security number or ID',
    steps: [
      'Go to IdentityTheft.gov for a personal recovery plan.',
      'Freeze your credit for free at Equifax, Experian and TransUnion.',
    ],
  },
];

function VerdictMeter({ score, verdict }: { score: number; verdict: CheckVerdict }) {
  const color = verdict === 'high_risk' ? 'bg-red-600' : verdict === 'suspicious' ? 'bg-amber-500' : 'bg-slate-400';
  return (
    <div className="mt-4" aria-hidden="true">
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/70 ring-1 ring-black/5">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.max(6, score)}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-medium text-slate-500">
        <span>Fewer warning signs</span>
        <span>More warning signs</span>
      </div>
    </div>
  );
}

function Results({ result, text, onReset }: { result: CheckResult; text: string; onReset: () => void }) {
  const v = VERDICT[result.verdict];
  const riskyLinks = result.links.filter((l) => l.issues.length > 0);

  return (
    <div className="mt-10 space-y-6" aria-live="polite">
      <section className={`rounded-2xl border-2 p-5 sm:p-6 ${v.shell}`}>
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${v.badge}`}>
          Result
        </span>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{v.label}</h2>
        <p className="mt-2 text-slate-700">{v.blurb}</p>
        <VerdictMeter score={result.score} verdict={result.verdict} />
      </section>

      {(result.reportedContacts.length > 0 || result.mentionedIn.length > 0) && (
        <section className="rounded-2xl border border-red-200 bg-white p-5">
          <h3 className="font-bold text-red-800">Already reported</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {result.reportedContacts.map((c) => (
              <li key={`${c.kind}-${c.value}`} className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono font-semibold text-slate-900">{c.value}</span>
                <span>
                  has been named in {c.reports} {c.reports === 1 ? 'report' : 'reports'} to ScamShield
                  {c.lastReportedAt ? `, most recently ${new Date(c.lastReportedAt).toLocaleDateString()}` : ''}.
                </span>
              </li>
            ))}
            {result.mentionedIn.map((m) => (
              <li key={`${m.host}-${m.slug}`}>
                <span className="font-mono font-semibold text-slate-900">{m.host}</span> appears in a documented scam:{' '}
                <Link to={`/scams/${m.slug}`} className="font-medium text-[#8a2e2e] underline">
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.signals.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-900">What we found</h3>
          <ul className="mt-3 divide-y divide-slate-100">
            {result.signals.map((s) => (
              <li key={s.id} className="flex gap-3 py-3">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${SEVERITY_DOT[s.severity]}`} aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-900">{s.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{s.why}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {riskyLinks.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-900">Links in this message</h3>
          <ul className="mt-3 space-y-3">
            {riskyLinks.map((l) => (
              <li key={l.url}>
                <p className="break-all font-mono text-sm font-semibold text-red-800">{l.host}</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
                  {l.issues.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">Don&apos;t open these links. We only read the address — we never visit it.</p>
        </section>
      )}

      {result.ai && (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900">AI second opinion</h3>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-indigo-800 ring-1 ring-indigo-200">
              {AI_LABEL[result.ai.verdict]}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-700">{result.ai.summary}</p>
          {result.ai.red_flags.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {result.ai.red_flags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="rounded-2xl bg-[#0f1a2b] p-5 text-white sm:p-6">
        <h3 className="text-lg font-bold">What to do now</h3>
        {result.verdict === 'no_signs' ? (
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-200">
            <li>
              If it asks for money, a code, or personal details, check with the person or company yourself using a
              number or website you look up independently.
            </li>
            <li>Never pay anyone with gift cards, crypto or a wire transfer because a message told you to.</li>
            <li>
              Still unsure? Describe what happened in more detail above, or{' '}
              <Link to={`/report?description=${encodeURIComponent(text.slice(0, 500))}`} className="font-semibold underline">
                tell us about it
              </Link>
              .
            </li>
          </ol>
        ) : (
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-200">
          <li>Don&apos;t click links, call numbers or reply to the message.</li>
          <li>
            If it claims to be a company, bank or agency, contact them yourself using a number or website you look up
            independently — the back of your card, a statement, or the official app.
          </li>
          {result.ai?.next_steps.slice(0, 2).map((s) => <li key={s}>{s}</li>)}
          <li>
            Forward scam texts to <strong>7726</strong> (SPAM) — your carrier blocks the sender — then delete them.
          </li>
          <li>
            Report it to the FTC at{' '}
            <a href="https://reportfraud.ftc.gov" target="_blank" rel="noreferrer" className="font-semibold underline">
              reportfraud.ftc.gov
            </a>{' '}
            and{' '}
            <Link to={`/report?description=${encodeURIComponent(text.slice(0, 500))}`} className="font-semibold underline">
              to ScamShield
            </Link>{' '}
            so we can warn others.
          </li>
        </ol>
        )}
      </section>

      <details className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm">
        <summary className="cursor-pointer list-none font-bold text-slate-900">
          <span className="flex items-center justify-between gap-2">
            Already paid, or shared information?
            <span className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true">
              ▾
            </span>
          </span>
        </summary>
        <p className="mt-2 text-sm text-slate-600">Act quickly — what you can recover depends on how fast you move.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ALREADY_ACTED.map((a) => (
            <div key={a.title} className="rounded-xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{a.title}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {a.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      {result.similarScams.length > 0 && (
        <section>
          <h3 className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
            Similar scams in our database
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {result.similarScams.map((s) => (
              <ScamCard key={s.id} scam={s} />
            ))}
          </div>
        </section>
      )}

      <div className="text-center">
        <button type="button" onClick={onReset} className="text-sm font-medium text-slate-500 hover:text-slate-800">
          Check something else
        </button>
      </div>
    </div>
  );
}

export default function CheckNow() {
  useDocumentMeta({
    title: 'Scam Checker',
    description:
      'Paste a suspicious text, email, link or phone number and get an instant scam check: warning signs, community reports and exactly what to do next. Free.',
    path: '/check-now',
  });

  // Arriving from the home page's hero box carries the visitor's text as
  // ?q=, so it's checked straight away instead of being retyped.
  const [params] = useSearchParams();
  const initial = (params.get('q') ?? '').slice(0, 5000);
  const [text, setText] = useState(initial);
  const [checkedText, setCheckedText] = useState('');
  const check = useMutation({ mutationFn: checkMessage });
  const resultsRef = useRef<HTMLDivElement>(null);

  const run = (value: string) => {
    if (value.trim().length < 3) return;
    setCheckedText(value);
    check.mutate(value.trim(), {
      onSuccess: () => setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50),
    });
  };

  useEffect(() => {
    if (initial.trim().length >= 3) run(initial);
    // Only on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(text);
  };

  const reset = () => {
    setText('');
    setCheckedText('');
    check.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const errorMessage = (check.error as { response?: { status?: number; data?: { error?: string } } } | null)?.response;

  return (
    <div>
      <section className="bg-gradient-to-b from-slate-950 to-[#0f1a2b] px-4 pb-24 pt-12 text-center text-white sm:pt-16">
        <p className="text-xs font-bold uppercase tracking-widest text-red-400">Free scam checker</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">
          Is this a scam? Check it in seconds.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-300 sm:text-lg">
          Paste the text, email, link or phone number. We check it for the warning signs real scams use, against
          scams people have reported, and tell you exactly what to do.
        </p>
      </section>

      <div className="mx-auto -mt-16 max-w-2xl px-4 pb-16">
        <form onSubmit={submit} className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200 sm:p-5">
          <label htmlFor="check-text" className="sr-only">
            Paste the message, link, phone number or email
          </label>
          <textarea
            id="check-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the message, link, phone number or email — or describe the call in your own words…"
            rows={6}
            maxLength={5000}
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-[15px] focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-red-100"
          />
          <button
            type="submit"
            disabled={text.trim().length < 3 || check.isPending}
            className="mt-3 w-full rounded-xl bg-[#8a2e2e] px-6 py-3.5 text-base font-bold text-white shadow-sm hover:bg-[#7a2626] disabled:opacity-40"
          >
            {check.isPending ? 'Checking…' : 'Check it now'}
          </button>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Try an example:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => {
                  setText(ex.text);
                  run(ex.text);
                }}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </form>
        <p className="mt-3 text-center text-xs text-slate-500">
          Private: nothing you paste is saved. We never open links you paste — we only read the address.
        </p>

        <div ref={resultsRef} className="scroll-mt-24">
          {check.isPending && (
            <div className="mt-10 space-y-3" aria-label="Checking">
              <div className="h-36 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          )}
          {check.isError && (
            <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-800">
              {errorMessage?.status === 429
                ? 'You\'ve run a lot of checks in a short time. Please wait a few minutes and try again.'
                : errorMessage?.data?.error ?? "We couldn't run the check just now. Please try again."}
            </p>
          )}
          {check.data && !check.isPending && <Results result={check.data} text={checkedText} onReset={reset} />}
        </div>
      </div>
    </div>
  );
}
