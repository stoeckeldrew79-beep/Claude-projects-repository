import { Link } from 'react-router-dom';
import { useScams } from '../hooks/useScams';
import { ScamCard } from '../components/ScamCard';
import { AlertTicker } from '../components/AlertTicker';
import { StatsBar } from '../components/StatsBar';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { BlurFade } from '../components/magicui/blur-fade';
import { DotPattern } from '../components/magicui/dot-pattern';

export default function Home() {
  useDocumentMeta({
    title: 'Know the scam before it reaches you',
    description:
      'Search the national scam intelligence database covering recorded U.S. scam activity from the 1800s to today. Get real-time alerts and protect yourself.',
    path: '/',
  });

  const { data: scams, isLoading } = useScams({ sort: 'newest', page: 1 });

  return (
    <div>
      <section className="relative overflow-hidden text-center px-4 py-20 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <DotPattern
          fillClassName="fill-white/10"
          className="[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        />

        <BlurFade>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/15 border border-red-500/30 px-3 py-1 text-xs font-bold tracking-wider uppercase text-red-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
            </span>
            National scam intelligence, updated in real time
          </span>
        </BlurFade>

        <BlurFade delay={0.08}>
          <h1 className="relative mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight">
            Know the scam.
            <br />
            <span className="text-red-500">Before it reaches you.</span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.16}>
          <p className="relative mt-5 max-w-xl mx-auto text-slate-300 text-lg">
            Search the national database of recorded scam activity, from historical fraud to today's alerts.
          </p>
        </BlurFade>

        <BlurFade delay={0.24}>
          <div className="relative mt-9 flex items-center justify-center gap-3">
            <Link
              to="/database"
              className="inline-block px-6 py-3 rounded-md bg-red-600 text-white font-semibold shadow-lg shadow-red-950/50 transition-transform hover:scale-[1.03] hover:bg-red-500 active:scale-[0.98]"
            >
              Browse the database
            </Link>
            <Link
              to="/subscribe"
              className="inline-block px-6 py-3 rounded-md border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Get real-time alerts
            </Link>
          </div>
        </BlurFade>
      </section>

      <AlertTicker />
      <StatsBar />

      <section className="max-w-5xl mx-auto px-4 py-12">
        <BlurFade delay={0.08} inView>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recently added</h2>
        </BlurFade>
        {isLoading && <p className="text-slate-500">Loading…</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {scams?.slice(0, 4).map((scam, i) => (
            <BlurFade key={scam.id} delay={0.08 + i * 0.05} inView>
              <ScamCard scam={scam} />
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  );
}
