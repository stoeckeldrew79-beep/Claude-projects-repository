import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Database from './pages/Database';
import ScamDetail from './pages/ScamDetail';
import Alerts from './pages/Alerts';
import Articles from './pages/Articles';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/database', label: 'Database' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/articles', label: 'Articles' },
  { to: '/subscribe', label: 'Subscribe' },
];

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
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/database" element={<Database />} />
        <Route path="/scams/:slug" element={<ScamDetail />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}
