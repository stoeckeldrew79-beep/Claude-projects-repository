// The public launch page (served by middleware.js until launch day).
//
// Built to make an impression in the first second and to hold people long
// enough to sign up: a live dotted world map with a radar sweep and scam
// "detections" lighting up, real counts from the database counting up,
// a ticker of the newest official warnings, and a "be the first inside"
// email sign-up. Everything live comes from the public API and degrades
// quietly: if the API is asleep the page is still complete.
import { LAND_COLS, LAND_ROWS, LAND_HEX } from './landDots.js';

const API = 'https://scamshield-national-backend.onrender.com/v1';
const SITE = 'https://www.scamtitan.com';

const LOGO = `
<svg viewBox="0 0 64 64" aria-hidden="true" class="logo">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(-58 .5 .5)"><stop offset="0" stop-color="#ff3b36" stop-opacity="0"/><stop offset="1" stop-color="#ff3b36" stop-opacity=".8"/></linearGradient>
    <clipPath id="g"><circle cx="32" cy="30" r="11.2"/></clipPath>
  </defs>
  <path d="M32 3.5 L55.5 10.5 C56.5 24 55.5 36 51 44.5 C46.5 52.5 40 57.5 32 61 C24 57.5 17.5 52.5 13 44.5 C8.5 36 7.5 24 8.5 10.5 Z" fill="#0b1424" stroke="#4a5f86" stroke-width="1.4"/>
  <path d="M32 8.2 L51.2 13.9 C52 25.2 51.2 35 47.4 42.2 C43.7 49 38.4 53.3 32 56.3 C25.6 53.3 20.3 49 16.6 42.2 C12.8 35 12 25.2 12.8 13.9 Z" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".9"/>
  <g transform="rotate(45 32 30)"><circle cx="32" cy="30" r="15.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="20.4 4.1"/></g>
  <g clip-path="url(#g)" fill="none" stroke="#9fb3d6" stroke-opacity=".38" stroke-width=".7"><ellipse cx="32" cy="30" rx="4.6" ry="11.2"/><ellipse cx="32" cy="30" rx="8.6" ry="11.2"/><line x1="20.8" y1="30" x2="43.2" y2="30"/></g>
  <g class="sweep"><path d="M32 30 L32.98 18.84 A11.2 11.2 0 0 1 41.70 24.40 Z" fill="url(#s)"/><line x1="32" y1="30" x2="41.70" y2="24.40" stroke="#ff5a55" stroke-width=".9" stroke-linecap="round"/></g>
  <circle class="ping" cx="32" cy="30" r="3.4" fill="none" stroke="#ff3b36" stroke-width=".8"/>
  <circle cx="32" cy="30" r="11.2" fill="none" stroke="#fff" stroke-width="1.8"/>
  <circle class="core" cx="32" cy="30" r="5.6" fill="#e0312f" fill-opacity=".22"/>
  <circle cx="32" cy="30" r="3.4" fill="#ff3b36"/>
  <circle cx="31" cy="28.9" r=".9" fill="#fff" fill-opacity=".7"/>
</svg>`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function launchPage({ codeError = false } = {}) {
  const title = 'ScamTitan International — The world’s scam intelligence agency is almost here';
  const description =
    'Thousands of documented scams from 210 countries, live official warnings, a free scam checker and alerts before a scam reaches you. Be the first inside.';
  return `<!doctype html>
<html lang="en" data-scamshield-coming-soon>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="robots" content="noindex, nofollow" />
<meta name="theme-color" content="#050b16" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="ScamTitan International" />
<meta property="og:title" content="ScamTitan International — launching soon" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${SITE}/" />
<meta property="og:image" content="${SITE}/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="ScamTitan International — launching soon" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${SITE}/og.png" />
<style>
  *{box-sizing:border-box}
  html,body{margin:0;min-height:100%;background:#050b16}
  body{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;color:#e2e8f0;overflow-x:hidden;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
  #map{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
  .vignette{position:fixed;inset:0;z-index:1;pointer-events:none;
    background:radial-gradient(ellipse 60% 55% at 50% 42%,rgba(5,11,22,.82) 0%,rgba(5,11,22,.55) 45%,rgba(5,11,22,.15) 75%,rgba(5,11,22,.6) 100%),
               linear-gradient(180deg,rgba(5,11,22,.4),transparent 20%,transparent 75%,rgba(5,11,22,.95))}
  .wrap{position:relative;z-index:2;flex:1;display:flex;flex-direction:column}
  header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 24px}
  .brand{display:flex;align-items:center;gap:10px;font-weight:900;letter-spacing:-.02em;color:#fff;font-size:15px}
  .brand svg{width:28px;height:28px}
  .brand b{color:#ef4444}
  .status{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#86efac;white-space:nowrap}
  .dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,.6);animation:beat 1.8s infinite}
  @keyframes beat{70%{box-shadow:0 0 0 9px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
  main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 18px 22px}
  .logo{width:116px;height:116px;filter:drop-shadow(0 16px 40px rgba(0,0,0,.6)) drop-shadow(0 0 34px rgba(255,59,54,.28))}
  .sweep,.core,.ping{transform-box:view-box;transform-origin:32px 30px}
  .sweep{animation:spin 3.2s linear infinite}.core{animation:core 1.6s ease-in-out infinite}.ping{animation:ping 3.2s ease-out infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes core{50%{transform:scale(1.35);opacity:.55}}
  @keyframes ping{0%{transform:scale(1);opacity:.9}70%,100%{transform:scale(3.3);opacity:0}}
  .wordmark{margin:14px 0 0;font-size:clamp(46px,11vw,76px);font-weight:900;letter-spacing:-.04em;line-height:.95;color:#fff;
    text-shadow:0 6px 40px rgba(0,0,0,.6)}
  .wordmark span{color:#ef4444}
  .sub{margin:10px 0 0;font-size:12px;font-weight:800;letter-spacing:.5em;text-transform:uppercase;color:#94a3b8;padding-left:.5em}
  .eyebrow{display:inline-flex;align-items:center;gap:8px;margin:22px 0 0;padding:6px 14px;border:1px solid rgba(248,113,113,.35);border-radius:999px;
    background:rgba(239,68,68,.08);font-size:11px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;color:#fca5a5}
  .eyebrow i{width:6px;height:6px;border-radius:50%;background:#ef4444;animation:blink 1.2s steps(2) infinite}
  @keyframes blink{50%{opacity:.2}}
  h1{margin:14px auto 0;max-width:780px;font-size:clamp(28px,5.2vw,48px);line-height:1.06;font-weight:900;letter-spacing:-.03em;color:#fff}
  .lead{margin:16px auto 0;max-width:600px;font-size:clamp(15px,2.2vw,18px);line-height:1.6;color:#cbd5e1}
  .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;width:100%;max-width:640px;margin:24px auto 0;opacity:0;transition:opacity .6s}
  .stats.on{opacity:1}
  .stat{padding:14px 8px;border:1px solid rgba(148,163,184,.16);border-radius:14px;background:rgba(15,26,43,.55);backdrop-filter:blur(6px)}
  .stat b{display:block;font-size:clamp(24px,5vw,36px);font-weight:900;letter-spacing:-.03em;color:#fff;font-variant-numeric:tabular-nums}
  .stat span{display:block;margin-top:4px;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#94a3b8}
  .join{width:100%;max-width:520px;margin:22px auto 0}
  .join p{margin:0 0 10px;font-size:14px;font-weight:700;color:#fff}
  .row{display:flex;gap:8px;padding:6px;border:1px solid rgba(148,163,184,.22);border-radius:16px;background:rgba(10,18,32,.8);backdrop-filter:blur(8px);
    box-shadow:0 20px 60px rgba(0,0,0,.45)}
  input{flex:1;min-width:0;min-height:48px;padding:0 14px;border:0;border-radius:11px;background:transparent;color:#fff;font-size:16px}
  input::placeholder{color:#64748b}
  input:focus{outline:none}
  .row:focus-within{border-color:rgba(239,68,68,.7);box-shadow:0 0 0 4px rgba(239,68,68,.15),0 20px 60px rgba(0,0,0,.45)}
  button{min-height:48px;padding:0 20px;border:0;border-radius:11px;background:linear-gradient(180deg,#ef4444,#c62828);color:#fff;font-weight:800;font-size:15px;cursor:pointer;white-space:nowrap}
  button:hover{filter:brightness(1.08)}
  button:disabled{opacity:.6;cursor:default}
  .fine{margin:10px 0 0;font-size:12px;color:#64748b}
  .msg{margin:10px 0 0;font-size:14px;font-weight:600}
  .ok{color:#86efac}.bad{color:#fca5a5}
  .ticker{position:sticky;bottom:0;z-index:3;display:flex;align-items:center;border-top:1px solid rgba(148,163,184,.14);background:rgba(5,11,22,.9);backdrop-filter:blur(6px);height:44px;overflow:hidden;opacity:0;transition:opacity .6s}
  .viewport{flex:1;min-width:0;overflow:hidden}
  .ticker.on{opacity:1}
  .tag{position:relative;z-index:1;flex:none;display:flex;align-items:center;gap:8px;height:100%;padding:0 14px;background:#c62828;color:#fff;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}
  .tag i{width:7px;height:7px;border-radius:50%;background:#fff;animation:blink 1s steps(2) infinite}
  .track{display:inline-flex;gap:48px;white-space:nowrap;padding-left:24px;animation:scroll 80s linear infinite;font-size:13px;color:#cbd5e1}
  .track b{color:#fca5a5;font-weight:800;margin-right:8px}
  @keyframes scroll{to{transform:translateX(-50%)}}
  footer{position:relative;z-index:2;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:14px 24px 18px;font-size:12px;color:#64748b;background:rgba(5,11,22,.92)}
  footer a,footer summary{color:#94a3b8;cursor:pointer}
  details summary{list-style:none}
  details summary::-webkit-details-marker{display:none}
  .code{display:flex;gap:6px;margin-top:8px}
  .code input{min-height:38px;border:1px solid rgba(148,163,184,.25);border-radius:9px;background:#0b1424;font-size:14px}
  .code button{min-height:38px;padding:0 14px;font-size:13px}
  @media (max-width:560px){
    header{padding:14px 16px}.status span{display:none}
    .logo{width:104px;height:104px}
    .stats{gap:6px}.stat{padding:12px 4px}
    .row{flex-direction:column}button{width:100%}
    footer{padding:12px 16px 16px}
  }
  @media (prefers-reduced-motion:reduce){.sweep,.core,.ping,.dot,.eyebrow i,.tag i,.track{animation:none}.ping{display:none}}
</style>
</head>
<body>
<canvas id="map" aria-hidden="true"></canvas>
<div class="vignette" aria-hidden="true"></div>
<div class="wrap">
  <header>
    <div class="brand">${LOGO.replace('class="logo"', '')}<span>Scam<b>Titan</b></span></div>
    <div class="status"><i class="dot"></i><span>Systems online · </span>Scanning</div>
  </header>
  <main>
    ${LOGO}
    <p class="wordmark">Scam<span>Titan</span></p>
    <p class="sub">International</p>
    <p class="eyebrow"><i></i>Launching soon</p>
    <h1>The world&rsquo;s scam intelligence agency is almost here.</h1>
    <p class="lead">Every documented scam, every official warning, from every country &mdash; and a warning before it reaches you or your family.</p>
    <div class="stats" id="stats" aria-live="polite">
      <div class="stat"><b data-k="scams">0</b><span>Scams documented</span></div>
      <div class="stat"><b data-k="countries">0</b><span>Countries</span></div>
      <div class="stat"><b data-k="sources">0</b><span>Official sources</span></div>
    </div>
    <form class="join" id="join" novalidate>
      <p>Be the first inside.</p>
      <div class="row">
        <label for="email" style="position:absolute;left:-9999px">Email address</label>
        <input id="email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="Your email address" required />
        <button type="submit" id="joinBtn">Notify me</button>
      </div>
      <p class="fine">One email when we launch. No spam, ever.</p>
      <p class="msg" id="joinMsg" role="status"></p>
    </form>
  </main>
  <div class="ticker" id="ticker" aria-label="Latest official scam warnings"><div class="tag"><i></i>Live</div><div class="viewport"><div class="track" id="track"></div></div></div>
  <footer>
    <span>ScamTitan International is a private consumer-protection service &mdash; not a government agency.</span>
    <details${codeError ? ' open' : ''}>
      <summary>Have an access code?</summary>
      <form class="code" method="get" action="/__unlock">
        <input name="code" aria-label="Access code" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Access code" required />
        <button type="submit">Enter</button>
      </form>
      ${codeError ? '<p class="msg bad" role="alert">That code didn&rsquo;t work. Check it and try again.</p>' : ''}
    </details>
  </footer>
</div>
<script>
(function () {
  var API = ${JSON.stringify(API)};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Live dotted world map -------------------------------------------
  var COLS = ${LAND_COLS}, ROWS = ${LAND_ROWS}, HEX = ${JSON.stringify(LAND_HEX)};
  var land = [];
  for (var i = 0; i < HEX.length; i++) {
    var n = parseInt(HEX[i], 16);
    for (var b = 0; b < 4; b++) if (n & (8 >> b)) land.push(i * 4 + b);
  }
  var cv = document.getElementById('map'), cx = cv.getContext('2d');
  var W, H, cell, ox, oy, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = Math.max(W / COLS, (H * 0.9) / ROWS);
    ox = (W - cell * COLS) / 2; oy = (H - cell * ROWS) / 2 - H * 0.02;
  }
  size(); addEventListener('resize', size);
  var pings = [], last = 0, t0 = performance.now();
  function addPing(now) {
    var k = land[(Math.random() * land.length) | 0];
    pings.push({ c: k % COLS, r: (k / COLS) | 0, t: now });
    if (pings.length > 40) pings.shift();
  }
  function frame(now) {
    cx.clearRect(0, 0, W, H);
    var sweepX = ((now - t0) / 9000 % 1) * (W + 300) - 150;
    var rad = Math.max(1, cell * 0.2);
    for (var j = 0; j < land.length; j++) {
      var k = land[j], c = k % COLS, r = (k / COLS) | 0;
      var x = ox + c * cell + cell / 2, y = oy + r * cell + cell / 2;
      var d = Math.abs(x - sweepX), glow = d < 140 ? 1 - d / 140 : 0;
      cx.fillStyle = glow ? 'rgba(' + (120 + 135 * glow | 0) + ',' + (150 - 60 * glow | 0) + ',' + (200 - 110 * glow | 0) + ',' + (0.35 + 0.5 * glow) + ')' : 'rgba(100,128,180,0.32)';
      cx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // the sweep line itself
    var g = cx.createLinearGradient(sweepX - 160, 0, sweepX, 0);
    g.addColorStop(0, 'rgba(239,68,68,0)'); g.addColorStop(1, 'rgba(239,68,68,0.10)');
    cx.fillStyle = g; cx.fillRect(sweepX - 160, 0, 160, H);
    cx.fillStyle = 'rgba(255,90,85,0.35)'; cx.fillRect(sweepX, 0, 1.5, H);
    if (!reduce && now - last > 380) { last = now; addPing(now); }
    for (var p = 0; p < pings.length; p++) {
      var q = pings[p], age = (now - q.t) / 2600;
      if (age > 1) continue;
      var px = ox + q.c * cell + cell / 2, py = oy + q.r * cell + cell / 2;
      cx.beginPath(); cx.arc(px, py, 2 + age * cell * 3.2, 0, 6.283);
      cx.strokeStyle = 'rgba(255,59,54,' + (0.9 * (1 - age)) + ')'; cx.lineWidth = 1.4; cx.stroke();
      cx.beginPath(); cx.arc(px, py, Math.max(1.6, rad * 1.3), 0, 6.283);
      cx.fillStyle = 'rgba(255,80,75,' + (1 - age * 0.7) + ')'; cx.fill();
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  if (reduce) { for (var s = 0; s < 14; s++) addPing(performance.now()); }
  requestAnimationFrame(frame);

  // --- Real numbers, counting up ----------------------------------------
  function countUp(el, to) {
    if (reduce) { el.textContent = to.toLocaleString(); return; }
    var start = performance.now(), dur = 1800;
    (function step(now) {
      var p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  fetch(API + '/stats').then(function (r) { return r.json(); }).then(function (j) {
    var d = j && j.data; if (!d) return;
    document.getElementById('stats').classList.add('on');
    document.querySelectorAll('[data-k]').forEach(function (el) { countUp(el, Number(d[el.getAttribute('data-k')]) || 0); });
  }).catch(function () {});

  // --- Live ticker of official warnings ---------------------------------
  fetch(API + '/daily-news?kind=ag').then(function (r) { return r.json(); }).then(function (j) {
    var items = (j && j.data || []).slice(0, 14);
    if (items.length < 4) return;
    var html = items.map(function (it) {
      var where = (it.state || it.source_name || 'Official').toString();
      var h = String(it.headline).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
      return '<span><b>' + where.replace(/[&<>]/g, '') + '</b>' + h + '</span>';
    }).join('');
    var track = document.getElementById('track');
    track.innerHTML = html + html; // doubled so the loop is seamless
    document.getElementById('ticker').classList.add('on');
  }).catch(function () {});

  // --- Be the first inside -----------------------------------------------
  var form = document.getElementById('join'), btn = document.getElementById('joinBtn'), msg = document.getElementById('joinMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value.trim();
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(email)) { msg.className = 'msg bad'; msg.textContent = 'Please enter a valid email address.'; return; }
    btn.disabled = true; btn.textContent = 'Adding you…'; msg.textContent = '';
    fetch(API + '/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, source: 'launch' }) })
      .then(function (r) { if (!r.ok) throw r; })
      .then(function () {
        form.querySelector('.row').style.display = 'none'; form.querySelector('.fine').style.display = 'none';
        msg.className = 'msg ok'; msg.textContent = 'You’re on the list. You’ll be among the first to know when ScamTitan launches.';
      })
      .catch(function () { btn.disabled = false; btn.textContent = 'Notify me'; msg.className = 'msg bad'; msg.textContent = 'Something went wrong — please try again in a moment.'; });
  });
})();
</script>
</body>
</html>`;
}
