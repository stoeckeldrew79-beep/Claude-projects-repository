import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TodaysScams from './pages/TodaysScams';
import AIScams from './pages/AIScams';
import CheckNow from './pages/CheckNow';
import Database from './pages/Database';
import ScamDetail from './pages/ScamDetail';
import Alerts from './pages/Alerts';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Notorious from './pages/Notorious';
import GlobalMap from './pages/GlobalMap';
import GlobalSources from './pages/GlobalSources';
import StateAttorneysGeneral from './pages/StateAttorneysGeneral';
import FederalWatch from './pages/FederalWatch';
import Statistics from './pages/Statistics';
import StateDetail from './pages/StateDetail';
import NotFound from './pages/NotFound';
import Report from './pages/Report';
import ReportStatus from './pages/ReportStatus';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { ShieldLogo } from './components/ShieldLogo';
import { SiteHeader } from './components/shell/SiteHeader';
import { formatPhoneDisplay, PUBLIC_PHONE, telHref } from './utils/publicPhone';

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
              <Link to="/check-now" className="hover:text-slate-900">
                Check something now
              </Link>
            </li>
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
          <Route path="/todays-scams" element={<TodaysScams />} />
          <Route path="/ai-scams" element={<AIScams />} />
          <Route path="/check-now" element={<CheckNow />} />
          <Route path="/database" element={<Database />} />
          <Route path="/scams/:slug" element={<ScamDetail />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/notorious" element={<Notorious />} />
          <Route path="/global-map" element={<GlobalMap />} />
          <Route path="/global-sources" element={<GlobalSources />} />
          <Route path="/state-attorneys-general" element={<StateAttorneysGeneral />} />
          <Route path="/federal" element={<FederalWatch />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/states/:slug" element={<StateDetail />} />
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
