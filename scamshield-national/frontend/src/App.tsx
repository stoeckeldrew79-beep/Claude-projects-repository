import { Route, Routes } from 'react-router-dom';
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
import { SiteHeader } from './components/shell/SiteHeader';
import { SiteFooter } from './components/shell/SiteFooter';
import { ScrollToTop } from './components/shell/ScrollToTop';

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <SiteHeader />

      <main id="main" className="flex-1">
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
      </main>

      <SiteFooter />
    </div>
  );
}
