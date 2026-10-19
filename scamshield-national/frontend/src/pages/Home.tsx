import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScams } from '../hooks/useScams';
import { useStats } from '../hooks/useStats';
import { ScamCard } from '../components/ScamCard';
import { AlertTicker } from '../components/AlertTicker';
import { StatsBar } from '../components/StatsBar';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { BlurFade } from '../components/magicui/blur-fade';
import { DotPattern } from '../components/magicui/dot-pattern';
import { IntelligenceBriefing } from '../components/home/IntelligenceBriefing';
import { QuickTools } from '../components/home/QuickTools';

function HeroCheck() {
  const navigate = useNavigate();
  const [text, setText] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = text.trim();
    navigate(q ? `/check-now?q=${encodeURIComponent(q.slice(0, 500))}` : '/check-now');
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="relative mx-auto mt-9 flex max-w-xl flex-col gap-2 rounded-xl bg-white/[0.06] p-2 ring-1 ring-white/15 backdrop-blur sm:flex-row"
    >
      <label htmlFor="hero-check" className="sr-only">
        Describe a call, text or message you're unsure about
      </label>
      <input
        id="hero-check"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Got a suspicious call, text or email? Describe it…"
        className="min-w-0 flex-1 rounded-lg bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-950/40 transition-colors hover:bg-red-500"
      >
        Check it
      </button>
    </form>
  );
}

export default function Home() {
  useDocumentMeta({
    title: 'Know the scam before it reaches you',
    description:
      'Global scam intelligence: search documented scams from around the world, follow official Attorney General and federal warnings as they are published, and get alerts for your area.',
    path: '/',
  });

  const { data: scams, isLoading } = useScams({ sort: 'newest', page: 1 });
  const { data: stats } = useStats();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#0f1a2b] to-slate-900 px-4 pt-16 pb-16 sm:pt-20 sm:pb-20 text-center text-white">
        <DotPattern
          fillClassName="fill-white/10"
          className="[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl"
        />

        <BlurFade>
          <span className="animate-badge-glow relative inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-600/15 px-3.5 py-1.5 text-[11px] sm:text-sm font-extrabold uppercase tracking-wider text-red-400">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
            </span>
            <span className="animate-glow-pulse">
              <span className="sm:hidden">Global scam intelligence · 24/7</span>
              <span className="hidden sm:inline">Global scam intelligence, updated around the clock</span>
            </span>
          </span>
        </BlurFade>

        <BlurFade delay={0.08}>
          <h1 className="relative mt-6 text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Know the scam.
            <br />
            <span className="text-red-500">Before it reaches you.</span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.16}>
          <p className="relative mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
            {stats ? (
              <>
                <strong className="font-semibold text-white">{stats.scams.toLocaleString()} documented scams</strong>{' '}
                across <strong className="font-semibold text-white">{stats.countries.toLocaleString()} countries</strong>,
                alongside live warnings from Attorneys General and federal agencies, and{' '}
                {stats.sources.toLocaleString()} official sources worldwide.
              </>
            ) : (
              <>
                Documented scams from around the world, alongside live warnings from Attorneys General, federal
                agencies and official sources worldwide.
              </>
            )}
          </p>
        </BlurFade>

        <BlurFade delay={0.24}>
          <HeroCheck />
        </BlurFade>

        <BlurFade delay={0.3}>
          <div className="relative mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/database" className="font-medium text-slate-200 hover:text-white">
              Browse the database →
            </Link>
            <Link to="/alerts" className="font-medium text-slate-200 hover:text-white">
              Get alerts for your area →
            </Link>
          </div>
        </BlurFade>
      </section>

      <AlertTicker />
      <StatsBar />

      <IntelligenceBriefing />

      <QuickTools />

      <section className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-end justify-between gap-4">
            <BlurFade inView>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Recently documented</h2>
              <p className="mt-1 text-sm text-slate-500">The newest entries added to the scam database.</p>
            </BlurFade>
            <Link to="/database" className="hidden sm:inline shrink-0 text-sm font-medium text-[#8a2e2e] hover:underline">
              View all →
            </Link>
          </div>
          {isLoading && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-36 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {scams?.slice(0, 4).map((scam, i) => (
              <BlurFade key={scam.id} delay={0.05 + i * 0.05} inView>
                <ScamCard scam={scam} />
              </BlurFade>
            ))}
          </div>
          <Link to="/database" className="mt-6 inline-block text-sm font-medium text-[#8a2e2e] hover:underline sm:hidden">
            View the full database →
          </Link>
        </div>
      </section>

      <section className="px-4">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#0f1a2b] px-6 py-10 sm:px-10 sm:py-12 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/25 blur-3xl"
          />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Get warned before the scam calls you.</h2>
              <p className="mt-2 max-w-xl text-slate-300">
                Pick your state and the scam types you care about. Members get an email or a text when new scams
                matching them are documented — as fast as within about 20 minutes. Plans from $19.99/month.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/alerts"
                className="rounded-md bg-red-600 px-5 py-3 text-center font-semibold text-white shadow-lg shadow-red-950/40 hover:bg-red-500"
              >
                Set up alerts
              </Link>
              <Link
                to="/subscribe"
                className="rounded-md border border-white/20 bg-white/5 px-5 py-3 text-center font-semibold text-white hover:bg-white/10"
              >
                See plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
