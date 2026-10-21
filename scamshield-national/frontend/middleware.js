// Vercel Routing Middleware: the private-preview curtain.
//
// While the site is under construction, every page shows a "launching soon"
// screen unless the visitor has entered the access code once on this
// device (remembered for a year in an HttpOnly cookie). Search engines get
// noindex and a robots.txt that disallows everything.
//
// This is a curtain, not a vault: the API and the built JavaScript are
// still reachable, and the code's hash is in a public repository. It keeps
// the unfinished site out of sight; it doesn't protect secrets.
//
// LAUNCH: set PUBLIC_LAUNCH to true (or delete this file) and redeploy.
const PUBLIC_LAUNCH = false;

// scamtitan.com is live (Oct 21, 2026): visitors to the old *.vercel.app
// address are sent to the same page on the real domain. www is canonical —
// Vercel already redirects the bare domain there.
const REDIRECT_TO_CANONICAL = true;
const CANONICAL_HOST = 'www.scamtitan.com';
const OLD_PRODUCTION_HOST = 'claude-projects-repository.vercel.app';

// SHA-256 of the access code. The code itself is never stored here.
const CODE_SHA256 = '2cd200be4aed90a282e22d81a4241d0fc8e6bf4254b4eb0201fd59ee342493ae';
const COOKIE = 'ss_preview';
const YEAR = 60 * 60 * 24 * 365;

import { launchPage } from './launch/page.js';

export const config = {
  // Pages only — built assets and the icon pass straight through so the
  // curtain page itself can use the favicon.
  matcher: ['/((?!assets/|favicon\\.svg|og\\.png).*)'],
};

async function sha256(text) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const normalise = (code) => (code || '').trim().toLowerCase();

async function isValid(code) {
  return Boolean(code) && (await sha256(normalise(code))) === CODE_SHA256;
}

function cookieValue(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

const NOINDEX = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' };

function comingSoon(error) {
  return new Response(launchPage({ codeError: error }), {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...NOINDEX },
  });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  if (REDIRECT_TO_CANONICAL && url.hostname === OLD_PRODUCTION_HOST) {
    return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 308);
  }
  if (PUBLIC_LAUNCH) return;

  if (url.pathname === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain', ...NOINDEX } });
  }

  if (url.pathname === '/__unlock') {
    const code = url.searchParams.get('code');
    if (!(await isValid(code))) return comingSoon(true);
    return new Response(null, {
      status: 303,
      headers: {
        Location: '/',
        'Set-Cookie': `${COOKIE}=${encodeURIComponent(normalise(code))}; Path=/; Max-Age=${YEAR}; HttpOnly; Secure; SameSite=Lax`,
        ...NOINDEX,
      },
    });
  }

  if (await isValid(cookieValue(request, COOKIE))) return; // carry on to the site

  return comingSoon(false);
}
