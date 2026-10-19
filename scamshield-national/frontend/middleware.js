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

// SHA-256 of the access code. The code itself is never stored here.
const CODE_SHA256 = '2cd200be4aed90a282e22d81a4241d0fc8e6bf4254b4eb0201fd59ee342493ae';
const COOKIE = 'ss_preview';
const YEAR = 60 * 60 * 24 * 365;

export const config = {
  // Pages only — built assets and the icon pass straight through so the
  // curtain page itself can use the favicon.
  matcher: ['/((?!assets/|favicon\\.svg).*)'],
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
  const html = `<!doctype html>
<html lang="en" data-scamshield-coming-soon>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<meta name="theme-color" content="#0f1a2b" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<title>Launching soon</title>
<style>
  *{box-sizing:border-box}
  html,body{margin:0;min-height:100%}
  body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px 16px;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#e2e8f0;
    background:radial-gradient(ellipse at 50% -10%,rgba(220,38,38,.22),transparent 55%),linear-gradient(180deg,#020617,#0f1a2b)}
  main{width:100%;max-width:520px;text-align:center}
  .logo{width:96px;height:96px;filter:drop-shadow(0 12px 30px rgba(0,0,0,.5))}
  .sweep{transform-origin:32px 30px;animation:spin 4s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  @media (prefers-reduced-motion:reduce){.sweep{animation:none}}
  .eyebrow{margin:28px 0 0;font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#f87171}
  h1{margin:12px 0 0;font-size:clamp(30px,7vw,44px);line-height:1.08;font-weight:800;letter-spacing:-.02em;color:#fff}
  p.lead{margin:16px auto 0;max-width:440px;font-size:17px;line-height:1.55;color:#cbd5e1}
  form{margin:40px auto 0;max-width:360px;padding:20px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(255,255,255,.04)}
  label{display:block;text-align:left;font-size:13px;font-weight:600;color:#94a3b8}
  .row{display:flex;gap:8px;margin-top:8px}
  input{flex:1;min-width:0;min-height:44px;padding:0 12px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:#0b1424;color:#fff;font-size:16px}
  input:focus{outline:2px solid #dc2626;outline-offset:1px}
  button{min-height:44px;padding:0 18px;border:0;border-radius:10px;background:#dc2626;color:#fff;font-weight:700;font-size:15px;cursor:pointer}
  button:hover{background:#ef4444}
  .err{margin:10px 0 0;text-align:left;font-size:13px;color:#fca5a5}
  footer{margin-top:36px;font-size:12px;color:#64748b}
</style>
</head>
<body>
<main>
  <svg class="logo" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <linearGradient id="s" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(-58 .5 .5)"><stop offset="0" stop-color="#ff3b36" stop-opacity="0"/><stop offset="1" stop-color="#ff3b36" stop-opacity=".75"/></linearGradient>
      <clipPath id="g"><circle cx="32" cy="30" r="11.2"/></clipPath>
    </defs>
    <path d="M32 3.5 L55.5 10.5 C56.5 24 55.5 36 51 44.5 C46.5 52.5 40 57.5 32 61 C24 57.5 17.5 52.5 13 44.5 C8.5 36 7.5 24 8.5 10.5 Z" fill="#0b1424" stroke="#4a5f86" stroke-width="1.4"/>
    <path d="M32 8.2 L51.2 13.9 C52 25.2 51.2 35 47.4 42.2 C43.7 49 38.4 53.3 32 56.3 C25.6 53.3 20.3 49 16.6 42.2 C12.8 35 12 25.2 12.8 13.9 Z" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".9"/>
    <g transform="rotate(45 32 30)"><circle cx="32" cy="30" r="15.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="20.4 4.1"/></g>
    <g clip-path="url(#g)" fill="none" stroke="#9fb3d6" stroke-opacity=".38" stroke-width=".7"><ellipse cx="32" cy="30" rx="4.6" ry="11.2"/><ellipse cx="32" cy="30" rx="8.6" ry="11.2"/></g>
    <path class="sweep" d="M32 30 L32.98 18.84 A11.2 11.2 0 0 1 41.70 24.40 Z" fill="url(#s)"/>
    <circle cx="32" cy="30" r="11.2" fill="none" stroke="#fff" stroke-width="1.8"/>
    <circle cx="32" cy="30" r="3.4" fill="#ff3b36"/>
  </svg>
  <p class="eyebrow">Launching soon</p>
  <h1>The world's scam intelligence database is almost here.</h1>
  <p class="lead">Thousands of documented scams, live official warnings from across the country and around the globe, and alerts before a scam reaches you or your family.</p>
  <form method="get" action="/__unlock">
    <label for="code">Have an access code?</label>
    <div class="row">
      <input id="code" name="code" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Access code" required />
      <button type="submit">Enter</button>
    </div>
    ${error ? '<p class="err" role="alert">That code didn\'t work. Check it and try again.</p>' : ''}
  </form>
  <footer>A private consumer-protection service — not a government agency.</footer>
</main>
</body>
</html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...NOINDEX },
  });
}

export default async function middleware(request) {
  if (PUBLIC_LAUNCH) return;
  const url = new URL(request.url);

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
