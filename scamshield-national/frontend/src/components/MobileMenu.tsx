import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { roleFromToken } from '../utils/tokenRole';
import { ShieldLogo } from './ShieldLogo';
import { MOBILE_NAV_GROUPS } from './shell/navConfig';

// The desktop nav is hidden below `md`, and until this existed nothing
// replaced it — on a phone the header offered only the logo and "Report a
// Scam", so every other page was unreachable from the header. This is the
// phone navigation: a menu button that opens a full-screen panel.
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const clearSession = useAuthStore((s) => s.clearSession);
  const isAdmin = roleFromToken(token) === 'admin';

  // Close on navigation (including the browser back button).
  useEffect(() => setOpen(false), [location.pathname, location.search]);

  // While open: Escape closes it, and the page behind doesn't scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    // Move focus into the panel so keyboard and screen-reader users land in it.
    closeRef.current?.focus();
    const opener = openerRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between rounded-lg px-4 py-3 text-base transition-colors ${
      isActive ? 'bg-red-500/10 text-white font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="md:hidden -mr-1 inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-slate-950 shadow-2xl animate-slide-in motion-reduce:animate-none">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <Link to="/" className="flex items-center gap-2">
                <ShieldLogo className="h-8 w-8" />
                <span className="font-bold text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  ScamShield National
                </span>
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <Link
                to="/report"
                className="mb-4 flex items-center justify-center rounded-lg bg-red-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-red-950/40 hover:bg-red-500"
              >
                Report a Scam
              </Link>

              <nav aria-label="Main" className="space-y-5">
                {MOBILE_NAV_GROUPS.map((group) => (
                  <div key={group.heading}>
                    <p className="px-4 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {group.heading}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.end} className={itemClass}>
                          {link.label}
                          <span aria-hidden="true" className="text-slate-600">
                            ›
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-6 space-y-1 border-t border-white/10 pt-4">
                {user ? (
                  <>
                    {isAdmin && (
                      <NavLink to="/admin" className={itemClass}>
                        Admin
                      </NavLink>
                    )}
                    <NavLink to="/dashboard" className={itemClass}>
                      <span className="truncate">My account · {user.email}</span>
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => {
                        clearSession();
                        setOpen(false);
                        navigate('/');
                      }}
                      className="w-full rounded-lg px-4 py-3.5 text-left text-base text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" end className={itemClass}>
                      Sign in
                    </NavLink>
                    <Link
                      to="/login?mode=register"
                      className="mt-2 flex items-center justify-center rounded-lg border border-white/15 px-4 py-3 text-base font-semibold text-white hover:bg-white/5"
                    >
                      Create a free account
                    </Link>
                  </>
                )}
              </div>
            </div>

            <p className="border-t border-white/10 px-4 py-3 text-xs text-slate-500">
              A private consumer-protection service — not a government agency.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
