import { Link } from 'react-router-dom';
import { useScams } from '../hooks/useScams';
import { ScamCard } from '../components/ScamCard';
import { AlertTicker } from '../components/AlertTicker';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { BlurFade } from '../components/magicui/blur-fade';
import { DotPattern } from '../components/magicui/dot-pattern';
import { AnimatedShinyText } from '../components/magicui/animated-shiny-text';

export default function Home() {
  useDocumentMeta({
    title: 'Know the scam before it reaches you',
    description:
      'Search the national scam intelligence database covering recorded U.S. scam activity from the 1800s to today. Get real-time alerts and protect yourself.',
    path: '/',
  });

  const { data: scams, isLoading } = useScams({ sort: 'newest', page: 1 });

  return (
    <div className="max-w-5xl mx-auto">
      <AlertTicker />

      <section className="relative overflow-hidden text-center px-4 py-16">
        <DotPattern className="[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

        <BlurFade>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium">
            <AnimatedShinyText>National scam intelligence, updated in real time</AnimatedShinyText>
          </span>
        </BlurFade>

        <BlurFade delay={0.08}>
          <h1 className="relative mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Know the scam before it reaches you.
          </h1>
        </BlurFade>

        <BlurFade delay={0.16}>
          <p className="relative mt-4 max-w-xl mx-auto text-slate-600">
            Search the national database of recorded scam activity, from historical fraud to today's alerts.
          </p>
        </BlurFade>

        <BlurFade delay={0.24}>
          <div className="relative mt-8 flex items-center justify-center gap-3">
            <Link
              to="/database"
              className="inline-block px-5 py-2.5 rounded-md bg-slate-900 text-white font-medium transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Browse the database
            </Link>
            <Link
              to="/subscribe"
              className="inline-block px-5 py-2.5 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
            >
              Get real-time alerts
            </Link>
          </div>
        </BlurFade>
      </section>

      <section className="px-4 pb-12">
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
