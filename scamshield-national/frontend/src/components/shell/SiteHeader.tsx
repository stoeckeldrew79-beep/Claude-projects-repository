import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { roleFromToken } from '../../utils/tokenRole';
import { formatPhoneDisplay, PUBLIC_PHONE, telHref } from '../../utils/publicPhone';
import { ShieldLogo } from '../ShieldLogo';
import { MobileMenu } from '../MobileMenu';
import { SECTION_GROUPS } from './navConfig';
import { useDisclosure } from './useDisclosure';
import { useStats } from '../../hooks/useStats';

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

// The section bar: every section of the site in one dark row under the
// header, grouped, so visitors see the full scope at a glance. Fits on one
// line from 1280px; between 768 and 1280 it scrolls sideways (edges fade)
// rather than wrapping. Phones use the menu button instead.
function SectionBar() {
  // Where the bar scrolls (768–1279px), bring the current page's link into
  // view so the reader can always see where they are.
  const scroller = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const el = scroller.current;
    const active = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el || !active || el.scrollWidth <= el.clientWidth) return;
    el.scrollLeft = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);
  const sectionClass = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex h-10 items-center whitespace-nowrap px-2.5 text-[13px] font-medium transition-colors ${
      isActive
        ? 'text-white after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-red-500'
        : 'text-slate-300 hover:text-white'
    }`;
  return (
    <div className="hidden md:block bg-[#0f1a2b]">
      <div className="relative mx-auto max-w-7xl">
        <div ref={scroller} className="flex items-center overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] xl:[mask-image:none]">
          {SECTION_GROUPS.map((group, gi) => (
            <div key={group.heading} role="group" aria-label={group.heading} className="flex shrink-0 items-center">
              {gi > 0 && <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-white/15" />}
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={sectionClass}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Live scale of the database, shown beside the logo on wide screens — the
// first thing a visitor reads is how big this is. Real numbers only; hidden
// until they load.
function LiveScale() {
  const { data } = useStats();
  if (!data) return null;
  return (
    <Link
      to="/statistics"
      className="hidden lg:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 hover:border-slate-300"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      <span>
        <span className="font-semibold text-slate-900">{data.scams.toLocaleString()}</span> scams ·{' '}
        <span className="font-semibold text-slate-900">{data.countries.toLocaleString()}</span> countries ·{' '}
        <span className="font-semibold text-slate-900">{data.sources.toLocaleString()}</span> official sources
      </span>
    </Link>
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

      {/* Both rows stick together on desktop (56px + 40px section bar = the
          md:top-24 offset pages use for their own sticky bars); phones get
          just the first row (top-14). */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 md:border-b-0">
        <nav aria-label="Main" className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3 lg:gap-5">
          <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0 rounded-md" aria-label="ScamShield National — home">
            <ShieldLogo className="h-9 w-9 md:h-10 md:w-10 shrink-0" animated />
            <span
              className="font-bold text-base sm:text-lg text-slate-900 whitespace-nowrap"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              ScamShield National
            </span>
          </Link>

          <LiveScale />

          <div className="ml-auto flex items-center gap-1.5 md:gap-2 shrink-0">
            <Link
              to="/check-now"
              className="hidden md:inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 whitespace-nowrap hover:border-slate-400 hover:bg-slate-50"
            >
              Check a scam
            </Link>
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
        <nav aria-label="Sections">
          <SectionBar />
        </nav>
      </header>
    </>
  );
}
