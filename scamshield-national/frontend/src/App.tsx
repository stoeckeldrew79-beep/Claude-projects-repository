import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Database from './pages/Database';
import ScamDetail from './pages/ScamDetail';
import Alerts from './pages/Alerts';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { useAuthStore } from './store/useAuthStore';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/database', label: 'Database' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/articles', label: 'Articles' },
  { to: '/subscribe', label: 'Subscribe' },
];

function AccountNav() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  if (!user) {
    return (
      <NavLink to="/login" className="text-sm text-slate-500 ml-auto">
        Sign in
      </NavLink>
    );
  }

  return (
    <div className="ml-auto flex items-center gap-4">
      <NavLink to="/dashboard" className="text-sm text-slate-500">
        {user.email}
      </NavLink>
      <button
        type="button"
        onClick={() => {
          clearSession();
          navigate('/');
        }}
        className="text-sm text-slate-500"
      >
        Sign out
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
          <span className="font-bold text-slate-900">ScamShield National</span>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm ${isActive ? 'text-slate-900 font-medium' : 'text-slate-500'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <AccountNav />
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/database" element={<Database />} />
        <Route path="/scams/:slug" element={<ScamDetail />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
