#!/usr/bin/env node
// Checks that a running ScamShield API actually serves data, not just that
// its process is up. Exits non-zero, naming every failed check, if any fail.
//
//   node scripts/ci-smoke-test.js http://localhost:3000
//
// CI runs it against a freshly booted server; scripts/monitor.js reuses
// these checks against production.
//
// Plain Node (18+, for global fetch) with no dependencies, so it runs
// without an install or a build.

const TIMEOUT_MS = 15000;

async function getJson(base, path) {
  const res = await fetch(base + path, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`HTTP ${res.status}, not JSON: ${text.slice(0, 120)}`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  return body;
}

function nonEmptyList(body, label) {
  const list = Array.isArray(body) ? body : body && body.data;
  if (!Array.isArray(list)) throw new Error(`${label}: expected a list, got ${JSON.stringify(body).slice(0, 120)}`);
  if (list.length === 0) throw new Error(`${label}: list is empty`);
  return `${list.length} returned`;
}

// Each check returns a short detail string on success and throws on failure.
function apiChecks(base) {
  const get = (path) => getJson(base, path);
  return [
    ['API and database are up', async () => {
      const body = await get('/health');
      if (body.status !== 'ok') throw new Error(`status is ${JSON.stringify(body.status)}`);
      return 'database connected';
    }],
    ['Scam database has entries', async () => nonEmptyList(await get('/v1/scams?sort=newest&page=1'), 'scams')],
    ['Categories load', async () => nonEmptyList(await get('/v1/categories'), 'categories')],
    ['Articles load', async () => nonEmptyList(await get('/v1/articles'), 'articles')],
    ['Site stats load', async () => {
      const body = await get('/v1/stats');
      if (!body || typeof body.data !== 'object' || body.data === null) throw new Error('no stats object');
      return 'ok';
    }],
  ];
}

// Runs every check and returns [{ name, ok, detail }] — never throws.
async function runChecks(checks) {
  const results = [];
  for (const [name, run] of checks) {
    try {
      results.push({ name, ok: true, detail: await run() });
    } catch (err) {
      results.push({ name, ok: false, detail: err.message });
    }
  }
  return results;
}

module.exports = { getJson, apiChecks, runChecks };

if (require.main === module) {
  const base = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '');
  (async () => {
    console.log(`Smoke test against ${base}`);
    const results = await runChecks(apiChecks(base));
    for (const r of results) console.log(r.ok ? `  ok    ${r.name} (${r.detail})` : `  FAIL  ${r.name}: ${r.detail}`);
    const failed = results.filter((r) => !r.ok).length;
    if (failed) {
      console.log(`${failed} of ${results.length} checks failed.`);
      process.exit(1);
    }
    console.log(`All ${results.length} checks passed.`);
  })();
}
