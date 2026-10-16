import { Link } from 'react-router-dom';
import { ShieldLogo } from '../ShieldLogo';
import { formatPhoneDisplay, PUBLIC_PHONE, telHref } from '../../utils/publicPhone';

const COLUMNS: { heading: string; links: { to: string; label: string }[] }[] = [
  {
    heading: 'Intelligence',
    links: [
      { to: '/todays-scams', label: "Today's scams" },
      { to: '/ai-scams', label: 'AI-enabled scams' },
      { to: '/database', label: 'Scam database' },
      { to: '/global-map', label: 'Global map' },
      { to: '/statistics', label: 'Statistics' },
    ],
  },
  {
    heading: 'Sources & learning',
    links: [
      { to: '/state-attorneys-general', label: 'State Attorneys General' },
      { to: '/federal', label: 'Federal Watch' },
      { to: '/global-sources', label: 'Global sources' },
      { to: '/notorious', label: 'Notorious scams & scammers' },
      { to: '/articles', label: 'Articles' },
    ],
  },
  {
    heading: 'Protect yourself',
    links: [
      { to: '/check-now', label: 'Check something now' },
      { to: '/report', label: 'Report a scam' },
      { to: '/report-status', label: 'Check report status' },
      { to: '/alerts', label: 'Scam alerts' },
      { to: '/subscribe', label: 'Plans & pricing' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#0f1a2b] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-md">
            <ShieldLogo className="h-8 w-8" />
            <span className="font-bold text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              ScamShield National
            </span>
          </Link>
          <p className="mt-4 text-sm max-w-sm leading-relaxed">
            Scam intelligence from official enforcement sources, news coverage and public reports — documented,
            searchable and free to read.
          </p>
          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 max-w-sm">
            <p className="text-sm font-semibold text-white">If money is at risk right now</p>
            <p className="mt-1.5 text-sm leading-relaxed">
              Call your bank first. In the U.S., then report to the FTC at{' '}
              <a href="https://reportfraud.ftc.gov" target="_blank" rel="noreferrer" className="text-slate-200 underline hover:text-white">
                reportfraud.ftc.gov
              </a>
              .
              {PUBLIC_PHONE && (
                <>
                  {' '}
                  Or talk to a real person:{' '}
                  <a href={telHref(PUBLIC_PHONE)} className="font-medium text-slate-200 underline hover:text-white">
                    {formatPhoneDisplay(PUBLIC_PHONE)}
                  </a>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ScamShield National. All rights reserved.</p>
          <p>
            A private consumer-protection service. Not a government agency, and not affiliated with or endorsed by
            any government body.
          </p>
        </div>
      </div>
    </footer>
  );
}
