import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Database from './pages/Database';
import ScamDetail from './pages/ScamDetail';
import Alerts from './pages/Alerts';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Notorious from './pages/Notorious';
import GlobalMap from './pages/GlobalMap';
import GlobalSources from './pages/GlobalSources';
import Statistics from './pages/Statistics';
import NotFound from './pages/NotFound';
import Report from './pages/Report';
import ReportStatus from './pages/ReportStatus';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { useAuthStore } from './store/useAuthStore';
import { ShieldLogo } from './components/ShieldLogo';
import { formatPhoneDisplay, PUBLIC_PHONE, telHref } from './utils/publicPhone';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/database', label: 'Database' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/articles', label: 'Articles' },
  { to: '/notorious', label: 'Notorious' },
  { to: '/global-map', label: 'Global Map' },
  { to: '/global-sources', label: 'Global Sources' },
  { to: '/statistics', label: 'Statistics' },
  { to: '/subscribe', label: 'Subscribe' },
];

function AccountNav() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  if (!user) {
    return (
      <NavLink to="/login" className="text-sm text-slate-500">
        Sign in
      </NavLink>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <NavLink to="/dashboard" className="text-sm text-slate-500 whitespace-nowrap truncate max-w-[12rem]">
        {user.email}
      </NavLink>
      <button
        type="button"
        onClick={() => {
          clearSession();
          navigate('/');
        }}
        className="text-sm text-slate-500 whitespace-nowrap flex-shrink-0"
      >
        Sign out
      </button>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      {/* Institutional identity bar — this is where the "which agency" signal lives.
          Deliberately says "private" here, plainly, rather than leaving it ambiguous. */}
      <div className="bg-[#0f1a2b] text-slate-300 text-xs">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span>A private consumer-protection service — not a government agency</span>
          <div className="hidden sm:flex items-center gap-4">
            {PUBLIC_PHONE && (
              <a href={telHref(PUBLIC_PHONE)} className="hover:text-white">
                Call {formatPhoneDisplay(PUBLIC_PHONE)}
              </a>
            )}
            <Link to="/report" className="hover:text-white">
              Report a scam online, 24/7 →
            </Link>
          </div>
        </div>
      </div>

      <nav className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <ShieldLogo className="h-9 w-9" />
          <span className="font-bold text-lg text-slate-900 whitespace-nowrap" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            ScamShield National
          </span>
        </Link>

        <div className="hidden md:flex items-center flex-wrap gap-x-6 gap-y-2 flex-1 min-w-0">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm whitespace-nowrap ${isActive ? 'text-slate-900 font-medium' : 'text-slate-500'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-5 flex-shrink-0">
          <Link
            to="/report"
            className="px-4 py-2 rounded-md bg-[#8a2e2e] text-white text-sm font-semibold whitespace-nowrap flex-shrink-0 hover:bg-[#7a2626] transition-colors"
          >
            Report a Scam
          </Link>
          <AccountNav />
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldLogo className="h-6 w-6" />
            <span className="font-semibold text-slate-900">ScamShield National</span>
          </div>
          <p className="mt-3 text-sm text-slate-500 max-w-xs">
            ScamShield National is a private consumer-protection service. It is not a government agency and is not
            affiliated with, endorsed by, or acting on behalf of any government body.
          </p>
          {PUBLIC_PHONE && (
            <p className="mt-3 text-sm text-slate-500">
              Call us:{' '}
              <a href={telHref(PUBLIC_PHONE)} className="underline hover:text-slate-900">
                {formatPhoneDisplay(PUBLIC_PHONE)}
              </a>
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Resources</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link to="/database" className="hover:text-slate-900">
                Scam database
              </Link>
            </li>
            <li>
              <Link to="/notorious" className="hover:text-slate-900">
                Notorious scams &amp; scammers
              </Link>
            </li>
            <li>
              <Link to="/report" className="hover:text-slate-900">
                Report a scam
              </Link>
            </li>
            <li>
              <Link to="/report-status" className="hover:text-slate-900">
                Check report status
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">If you're a victim right now</h3>
          <p className="mt-3 text-sm text-slate-500">
            If you're in the U.S. and money is actively at risk, contact your bank immediately, then file a report
            with the FTC at{' '}
            <a href="https://reportfraud.ftc.gov" target="_blank" rel="noreferrer" className="underline">
              reportfraud.ftc.gov
            </a>{' '}
            — the official U.S. government reporting site.
          </p>
          {PUBLIC_PHONE && (
            <p className="mt-2 text-sm text-slate-500">
              Or talk to a real person right now:{' '}
              <a href={telHref(PUBLIC_PHONE)} className="underline font-medium">
                {formatPhoneDisplay(PUBLIC_PHONE)}
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ScamShield National. A private service, not a government agency.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/database" element={<Database />} />
          <Route path="/scams/:slug" element={<ScamDetail />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/notorious" element={<Notorious />} />
          <Route path="/global-map" element={<GlobalMap />} />
          <Route path="/global-sources" element={<GlobalSources />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/report" element={<Report />} />
          <Route path="/report-status" element={<ReportStatus />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <SiteFooter />
    </div>
  );
}
