import { Component, ReactNode, Suspense, useEffect } from 'react';
import { lazyPage, preloadPages, reloadForNewVersion } from './utils/lazyPage';
import { Route, Routes, useLocation } from 'react-router-dom';
// Home loads with the app; every other page is its own chunk, fetched on
// first visit, so a phone opening one page doesn't download all 23.
import Home from './pages/Home';
const TodaysScams = lazyPage(() => import('./pages/TodaysScams'));
const AIScams = lazyPage(() => import('./pages/AIScams'));
const CheckNow = lazyPage(() => import('./pages/CheckNow'));
const ScammedHelp = lazyPage(() => import('./pages/ScammedHelp'));
const Database = lazyPage(() => import('./pages/Database'));
const ScamDetail = lazyPage(() => import('./pages/ScamDetail'));
const Alerts = lazyPage(() => import('./pages/Alerts'));
const Articles = lazyPage(() => import('./pages/Articles'));
const ArticleDetail = lazyPage(() => import('./pages/ArticleDetail'));
const Notorious = lazyPage(() => import('./pages/Notorious'));
const GlobalMap = lazyPage(() => import('./pages/GlobalMap'));
const GlobalSources = lazyPage(() => import('./pages/GlobalSources'));
const StateAttorneysGeneral = lazyPage(() => import('./pages/StateAttorneysGeneral'));
const FederalWatch = lazyPage(() => import('./pages/FederalWatch'));
const FederalCases = lazyPage(() => import('./pages/FederalCases'));
const Statistics = lazyPage(() => import('./pages/Statistics'));
const StateDetail = lazyPage(() => import('./pages/StateDetail'));
const NotFound = lazyPage(() => import('./pages/NotFound'));
const Report = lazyPage(() => import('./pages/Report'));
const ReportStatus = lazyPage(() => import('./pages/ReportStatus'));
const Subscribe = lazyPage(() => import('./pages/Subscribe'));
const Dashboard = lazyPage(() => import('./pages/Dashboard'));
const Admin = lazyPage(() => import('./pages/Admin'));
const Login = lazyPage(() => import('./pages/Login'));
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

// Last line of defence: if a page still fails to load (or crashes), show a
// way out instead of a blank white screen.
class PageErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false });
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">This page didn't load</h1>
        <p className="mt-2 text-slate-600">The site was probably just updated. Reloading picks up the new version.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-md bg-[#8a2e2e] px-5 py-2.5 font-semibold text-white hover:bg-[#7a2626]"
        >
          Reload
        </button>
      </div>
    );
  }
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    preloadPages();
    // Vite reports a failed preload of a page's shared pieces this way.
    const onPreloadError = (e: Event) => {
      if (reloadForNewVersion()) e.preventDefault();
    };
    window.addEventListener('vite:preloadError', onPreloadError);
    return () => window.removeEventListener('vite:preloadError', onPreloadError);
  }, []);

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
        <PageErrorBoundary resetKey={pathname}>
        <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todays-scams" element={<TodaysScams />} />
          <Route path="/ai-scams" element={<AIScams />} />
          <Route path="/check-now" element={<CheckNow />} />
          <Route path="/help" element={<ScammedHelp />} />
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
          <Route path="/federal/cases" element={<FederalCases />} />
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
        </PageErrorBoundary>
      </main>

      <SiteFooter />
    </div>
  );
}
