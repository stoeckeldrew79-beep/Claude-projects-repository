import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { roleFromToken } from '../../utils/tokenRole';
import { formatPhoneDisplay, PUBLIC_PHONE, telHref } from '../../utils/publicPhone';
import { ShieldLogo } from '../ShieldLogo';
import { MobileMenu } from '../MobileMenu';
import { MORE_NAV, NavItem, PRIMARY_NAV } from './navConfig';
import { useDisclosure } from './useDisclosure';

// Literal class strings (Tailwind only generates classes it can see in source).
// A primary link is in the header row from its breakpoint up, and listed in
// "More" below it — so the row never wraps, at any width from 768px up.
const ROW_VISIBILITY: Record<NonNullable<NavItem['showFrom']>, string> = {
  md: 'inline-flex',
  lg: 'hidden lg:inline-flex',
  xl: 'hidden xl:inline-flex',
};
const MORE_VISIBILITY: Record<NonNullable<NavItem['showFrom']>, string> = {
  md: 'hidden',
  lg: 'lg:hidden',
  xl: 'xl:hidden',
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const linkBase =
  'relative items-center whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors';

function primaryClass(isActive: boolean) {
  return `${linkBase} ${
    isActive
      ? 'text-slate-950 after:absolute after:inset-x-2.5 after:-bottom-[9px] after:h-0.5 after:rounded-full after:bg-[#8a2e2e]'
      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
  }`;
}

function MoreMenu() {
  const d = useDisclosure();
  const { pathname } = useLocation();
  const folded = PRIMARY_NAV.filter((l) => l.showFrom !== 'md');
  // Highlight "More" when the current page lives inside it, so the active
  // page is never invisible in the header.
  const activeInside = MORE_NAV.some((l) => pathname.startsWith(l.to));

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `group flex flex-col rounded-lg px-3 py-2.5 transition-colors ${
      isActive ? 'bg-red-50' : 'hover:bg-slate-50 focus-visible:bg-slate-50'
    }`;

  const renderItem = (item: NavItem, extra = '') => (
    <NavLink key={item.to} to={item.to} end={item.end} className={(s) => `${itemClass(s)} ${extra}`}>
      {({ isActive }) => (
        <>
          <span className={`text-sm font-semibold ${isActive ? 'text-[#8a2e2e]' : 'text-slate-900'}`}>
            {item.label}
          </span>
          {item.hint && <span className="text-xs text-slate-500">{item.hint}</span>}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="relative">
      <button
        ref={d.buttonRef}
        type="button"
        aria-expanded={d.open}
        aria-controls="more-nav"
        onClick={d.toggle}
        onKeyDown={d.onButtonKeyDown}
        className={`${linkBase} inline-flex gap-1 ${
          d.open || activeInside ? 'text-slate-950 bg-slate-100' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
        }`}
      >
        More
        <Chevron open={d.open} />
      </button>

      {d.open && (
        <div
          ref={d.panelRef}
          id="more-nav"
          onKeyDown={d.onPanelKeyDown}
          onBlur={d.onPanelBlur}
          className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 animate-dropdown-in motion-reduce:animate-none"
        >
          {folded.map((item) => renderItem(item, MORE_VISIBILITY[item.showFrom ?? 'md']))}
          {folded.length > 0 && <div className="my-1 h-px bg-slate-100 xl:hidden" aria-hidden="true" />}
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Official sources &amp; data
          </p>
          {MORE_NAV.map((item) => renderItem(item))}
          <div className="mt-1 border-t border-slate-100 pt-1">
            {renderItem({ to: '/check-now', label: 'Check something now', hint: 'Is this call, text or link a scam?' })}
          </div>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const clearSession = useAuthStore((s) => s.clearSession);
  const d = useDisclosure();
  // Admin is deliberately absent from the public nav; shown only to an admin
  // token. The page and every write behind it are enforced server-side.
  const isAdmin = roleFromToken(token) === 'admin';

  if (!user) {
    return (
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `${linkBase} inline-flex ${isActive ? 'text-slate-950' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'}`
        }
      >
        Sign in
      </NavLink>
    );
  }

  const initial = user.email.charAt(0).toUpperCase();
  const item = 'block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950';

  return (
    <div className="relative">
      <button
        ref={d.buttonRef}
        type="button"
        aria-expanded={d.open}
        aria-controls="account-nav"
        aria-label={`Account menu for ${user.email}`}
        onClick={d.toggle}
        onKeyDown={d.onButtonKeyDown}
        className="inline-flex items-center gap-1 rounded-full p-0.5 pr-1.5 text-slate-600 hover:bg-slate-100"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0f1a2b] text-sm font-semibold text-white">
          {initial}
        </span>
        <Chevron open={d.open} />
      </button>
      {d.open && (
        <div
          ref={d.panelRef}
          id="account-nav"
          onKeyDown={d.onPanelKeyDown}
          onBlur={d.onPanelBlur}
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 animate-dropdown-in motion-reduce:animate-none"
        >
          <div className="px-3 py-2">
            <p className="text-xs text-slate-500">Signed in as</p>
            <p className="truncate text-sm font-medium text-slate-900">{user.email}</p>
          </div>
          <div className="my-1 h-px bg-slate-100" aria-hidden="true" />
          <Link to="/dashboard" className={item}>
            My account
          </Link>
          <Link to="/alerts" className={item}>
            My alerts
          </Link>
          {isAdmin && (
            <Link to="/admin" className={item}>
              Admin
            </Link>
          )}
          <div className="my-1 h-px bg-slate-100" aria-hidden="true" />
          <button
            type="button"
            onClick={() => {
              clearSession();
              d.setOpen(false);
              navigate('/');
            }}
            className={`${item} w-full text-left`}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  return (
    <>
      {/* Institutional identity bar — where the "which agency" signal lives.
          Deliberately says "private" here, plainly. */}
      <div className="bg-[#0f1a2b] text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
          <span className="truncate">
            <span className="sm:hidden">Private service · not a government agency</span>
            <span className="hidden sm:inline">A private consumer-protection service — not a government agency</span>
          </span>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {PUBLIC_PHONE && (
              <a href={telHref(PUBLIC_PHONE)} className="hover:text-white">
                Call {formatPhoneDisplay(PUBLIC_PHONE)}
              </a>
            )}
            <Link to="/report-status" className="hover:text-white">
              Report status
            </Link>
            <Link to="/report" className="hover:text-white">
              Report a scam online, 24/7 →
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <nav aria-label="Main" className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center gap-2 lg:gap-4">
          <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0 rounded-md" aria-label="ScamShield National — home">
            <ShieldLogo className="h-8 w-8 md:h-9 md:w-9 shrink-0" />
            <span
              className="font-bold text-base sm:text-lg text-slate-900 whitespace-nowrap md:max-lg:hidden"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              ScamShield National
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5 xl:gap-1 flex-1 min-w-0 md:ml-2 lg:ml-4">
            {PRIMARY_NAV.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `${primaryClass(isActive)} ${ROW_VISIBILITY[link.showFrom ?? 'md']}`}
              >
                {link.label}
              </NavLink>
            ))}
            <MoreMenu />
          </div>

          <div className="ml-auto flex items-center gap-1.5 md:gap-2 shrink-0">
            <div className="hidden md:block">
              <AccountMenu />
            </div>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-md bg-[#8a2e2e] text-white text-sm font-semibold whitespace-nowrap shadow-sm hover:bg-[#7a2626] transition-colors"
            >
              <span className="sm:hidden">Report</span>
              <span className="hidden sm:inline">Report a Scam</span>
            </Link>
            <MobileMenu />
          </div>
        </nav>
      </header>
    </>
  );
}
