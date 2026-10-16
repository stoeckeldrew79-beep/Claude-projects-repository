import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
// Home loads with the app; every other page is its own chunk, fetched on
// first visit, so a phone opening one page doesn't download all 23.
import Home from './pages/Home';
const TodaysScams = lazy(() => import('./pages/TodaysScams'));
const AIScams = lazy(() => import('./pages/AIScams'));
const CheckNow = lazy(() => import('./pages/CheckNow'));
const Database = lazy(() => import('./pages/Database'));
const ScamDetail = lazy(() => import('./pages/ScamDetail'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Notorious = lazy(() => import('./pages/Notorious'));
const GlobalMap = lazy(() => import('./pages/GlobalMap'));
const GlobalSources = lazy(() => import('./pages/GlobalSources'));
const StateAttorneysGeneral = lazy(() => import('./pages/StateAttorneysGeneral'));
const FederalWatch = lazy(() => import('./pages/FederalWatch'));
const Statistics = lazy(() => import('./pages/Statistics'));
const StateDetail = lazy(() => import('./pages/StateDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Report = lazy(() => import('./pages/Report'));
const ReportStatus = lazy(() => import('./pages/ReportStatus'));
const Subscribe = lazy(() => import('./pages/Subscribe'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
import { SiteHeader } from './components/shell/SiteHeader';
import { SiteFooter } from './components/shell/SiteFooter';
import { ScrollToTop } from './components/shell/ScrollToTop';

function PageLoading() {
  return (
    <div className="flex justify-center py-24" role="status" aria-label="Loading page">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-red-600" />
    </div>
  );
}

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
        <Suspense fallback={<PageLoading />}>
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
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}
