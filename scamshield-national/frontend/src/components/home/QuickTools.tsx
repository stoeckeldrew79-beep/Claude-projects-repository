import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface Tool {
  to: string;
  title: string;
  body: string;
  icon: ReactNode;
}

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const TOOLS: Tool[] = [
  {
    to: '/check-now',
    title: 'Check something now',
    body: 'Describe a call, text or message and compare it with documented scam patterns.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    to: '/todays-scams',
    title: "Today's scams",
    body: 'The newest warnings from Attorneys General, federal agencies and the press.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M4 5h13v14H6a2 2 0 01-2-2V5z" />
        <path d="M17 9h3v8a2 2 0 01-2 2" />
        <path d="M8 9h5M8 13h5M8 17h3" />
      </svg>
    ),
  },
  {
    to: '/database',
    title: 'Scam database',
    body: 'Search documented scams by category, country, state and who they target.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    ),
  },
  {
    to: '/global-map',
    title: 'Global map',
    body: 'See where scams are documented around the world, country by country.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
      </svg>
    ),
  },
];

export function QuickTools() {
  return (
    <section aria-labelledby="tools-heading" className="max-w-7xl mx-auto px-4 py-14">
      <h2 id="tools-heading" className="text-2xl font-bold tracking-tight text-slate-900">
        Tools to protect yourself
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md motion-reduce:hover:translate-y-0"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-[#8a2e2e] ring-1 ring-inset ring-red-100">
              {t.icon}
            </span>
            <span className="mt-4 font-semibold text-slate-900">{t.title}</span>
            <span className="mt-1 text-sm leading-relaxed text-slate-500">{t.body}</span>
            <span className="mt-4 text-sm font-medium text-[#8a2e2e]" aria-hidden="true">
              Open <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
