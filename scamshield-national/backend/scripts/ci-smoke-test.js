#!/usr/bin/env node
// Checks that a running ScamShield API actually serves data, not just that
// its process is up. Exits non-zero, naming every failed check, if any fail.
//
//   node scripts/ci-smoke-test.js http://localhost:3000
//
// CI runs it against a freshly booted server. It takes any base URL so the
// same checks can be pointed at production.
//
// Plain Node (18+, for global fetch) with no dependencies, so it runs
// without an install or a build.

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '');
const TIMEOUT_MS = 15000;

async function getJson(path) {
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
const checks = [
  ['API and database are up', async () => {
    const body = await getJson('/health');
    if (body.status !== 'ok') throw new Error(`status is ${JSON.stringify(body.status)}`);
    return 'database connected';
  }],
  ['Scam database has entries', async () => nonEmptyList(await getJson('/v1/scams?sort=newest&page=1'), 'scams')],
  ['Categories load', async () => nonEmptyList(await getJson('/v1/categories'), 'categories')],
  ['Articles load', async () => nonEmptyList(await getJson('/v1/articles'), 'articles')],
  ['Site stats load', async () => {
    const body = await getJson('/v1/stats');
    if (!body || typeof body.data !== 'object' || body.data === null) throw new Error('no stats object');
    return 'ok';
  }],
];

(async () => {
  console.log(`Smoke test against ${base}`);
  let failed = 0;
  for (const [name, run] of checks) {
    try {
      const detail = await run();
      console.log(`  ok    ${name} (${detail})`);
    } catch (err) {
      failed += 1;
      console.log(`  FAIL  ${name}: ${err.message}`);
    }
  }
  if (failed) {
    console.log(`${failed} of ${checks.length} checks failed.`);
    process.exit(1);
  }
  console.log(`All ${checks.length} checks passed.`);
})();
