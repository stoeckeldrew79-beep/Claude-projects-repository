#!/usr/bin/env node
// Production health check for ScamShield, run every 30 minutes by the
// "ScamShield production monitor" workflow. Writes a Markdown report and a
// JSON summary; the workflow turns a non-empty problem list into a GitHub
// issue (which notifies the repo owner) and closes it on recovery.
//
// Checks:
//   1. the live API serves real data (the same checks CI runs)
//   2. the live website loads
//   3. the "Today's Scams" feed has a recent headline (the scan cron runs),
//      and new scams and articles keep arriving (the content pipeline runs)
//   4. every configured state Attorney General source is still producing
//   5. the latest run of each automatic content/CI workflow didn't fail
//
// A failed API or website check is retried once after a pause, so a
// momentary blip doesn't page anyone.
//
// Env: API_URL, SITE_URL, GITHUB_REPOSITORY (check 4 is skipped without
// it) and GITHUB_TOKEN (optional on a public repo), REPORT_DIR (default: cwd), RETRY_DELAY_SECONDS.

const fs = require('fs');
const path = require('path');
const { getJson, apiChecks, runChecks } = require('./ci-smoke-test');

const API_URL = (process.env.API_URL || 'https://scamshield-national-backend.onrender.com').replace(/\/+$/, '');
const SITE_URL = (process.env.SITE_URL || 'https://claude-projects-repository.vercel.app').replace(/\/+$/, '');
const REPORT_DIR = process.env.REPORT_DIR || process.cwd();
const RETRY_DELAY_SECONDS = Number(process.env.RETRY_DELAY_SECONDS ?? 60);
// The news scan runs every 2 hours; a day's worth of runs finding nothing
// new across 26 searches means the scan itself has stopped.
const NEWS_MAX_AGE_HOURS = 12;
// Content jobs can all report "success" while adding nothing (a saturated
// generator, a routine feeding a stuck session). Growth is the real signal:
// no new scam or article for two days means the pipeline has stalled.
const CONTENT_MAX_AGE_HOURS = 48;

function ageCheck(label, times, maxHours, stalledMessage) {
  const valid = times.map((t) => Date.parse(t)).filter((t) => !Number.isNaN(t));
  if (valid.length === 0) throw new Error(`no ${label} returned`);
  const hours = (Date.now() - Math.max(...valid)) / 3600000;
  if (hours > maxHours) throw new Error(`newest ${label} is ${Math.round(hours)}h old — ${stalledMessage}`);
  return `newest ${label} ${hours < 1 ? 'under 1h' : `${Math.round(hours)}h`} old`;
}

// Workflows whose latest finished run must not be a failure. A workflow
// that doesn't exist (yet) on the default branch is skipped, not flagged.
const WATCHED_WORKFLOWS = [
  ['scamshield-ci.yml', 'ScamShield CI (daily check of main)'],
  ['generate-scam-entries.yml', 'Scam entry generator'],
  ['generate-state-scam-entries.yml', 'State scam entry generator'],
  ['deliver-content-to-main.yml', 'Content delivery to main'],
];
const FAILED = new Set(['failure', 'timed_out', 'startup_failure']);

function liveChecks() {
  return [
    ...apiChecks(API_URL).map(([name, run]) => [`Live API: ${name}`, run]),
    ['Live website loads', async () => {
      const res = await fetch(SITE_URL + '/', { signal: AbortSignal.timeout(15000) });
      const html = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!html.includes('id="root"')) throw new Error('page loaded but is not the ScamShield app');
      return `HTTP ${res.status}`;
    }],
    ["Today's Scams feed is fresh", async () => {
      const body = await getJson(API_URL, '/v1/daily-news');
      return ageCheck('headline', (body.data || []).map((n) => n.published_at), NEWS_MAX_AGE_HOURS,
        'the news scan has probably stopped running');
    }],
    ['New scams are still being added', async () => {
      const body = await getJson(API_URL, '/v1/scams?sort=newest&page=1');
      return ageCheck('scam', (body.data || []).map((s) => s.created_at), CONTENT_MAX_AGE_HOURS,
        'the scam generators have stopped adding entries');
    }],
    ['New articles are still being added', async () => {
      const body = await getJson(API_URL, '/v1/articles');
      return ageCheck('article', (body.data || []).map((a) => a.published_at || a.created_at), CONTENT_MAX_AGE_HOURS,
        'the guide/notorious routines have stopped adding articles');
    }],
  ];
}

// Each configured state AG source must have produced releases within the
// last 30h (the scan runs every 4h, so that is several missed runs). A
// missing endpoint (an older deploy) is skipped, not flagged.
const AG_SOURCE_MAX_AGE_HOURS = 30;

async function agFeedChecks() {
  let body;
  try {
    const res = await fetch(API_URL + '/v1/daily-news/ag-status', { signal: AbortSignal.timeout(15000) });
    if (res.status === 404) return [];
    body = await res.json();
  } catch (err) {
    return [{ name: 'State AG feeds', ok: false, detail: `could not read feed status: ${err.message}` }];
  }
  const rows = body.data || [];
  if (rows.length === 0) return [];
  const cutoff = Date.now() - AG_SOURCE_MAX_AGE_HOURS * 3600000;
  const broken = rows.filter((r) => !r.last_success_at || Date.parse(r.last_success_at) < cutoff);
  if (broken.length === 0) {
    return [{ name: 'State AG feeds', ok: true, detail: `all ${rows.length} official state sources answering` }];
  }
  const list = broken.map((r) => `${r.state} (${r.last_error || 'no releases'})`).join(', ');
  return [{
    name: 'State AG feeds',
    ok: false,
    detail: `${broken.length} of ${rows.length} official state sources have produced nothing for ${AG_SOURCE_MAX_AGE_HOURS}h+: ${list}`,
  }];
}

async function workflowChecks() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) return [];
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'scamshield-monitor', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const results = [];
  for (const [file, label] of WATCHED_WORKFLOWS) {
    const name = `Automation: ${label}`;
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/actions/workflows/${file}/runs?status=completed&per_page=20`,
        { headers, signal: AbortSignal.timeout(15000) }
      );
      if (res.status === 404) continue;
      if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);
      const { workflow_runs: runs = [] } = await res.json();
      // PR runs are a change being tested, not the automation itself;
      // cancelled runs were superseded or stopped on purpose.
      const latest = runs.find((r) => r.event !== 'pull_request' && r.conclusion !== 'cancelled' && r.conclusion !== 'skipped');
      if (!latest) continue;
      if (FAILED.has(latest.conclusion)) {
        results.push({ name, ok: false, detail: `last run ${latest.conclusion} (${latest.created_at}) — ${latest.html_url}` });
      } else {
        results.push({ name, ok: true, detail: `last run ${latest.conclusion}` });
      }
    } catch (err) {
      results.push({ name, ok: false, detail: `could not check: ${err.message}` });
    }
  }
  return results;
}

function report(results) {
  const problems = results.filter((r) => !r.ok);
  const lines = [
    problems.length
      ? `**${problems.length} problem${problems.length === 1 ? '' : 's'} found** at ${new Date().toISOString()}`
      : `All ${results.length} checks passed at ${new Date().toISOString()}`,
    '',
    ...results.map((r) => `- ${r.ok ? '✅' : '❌'} **${r.name}** — ${r.detail}`),
    '',
    `API: ${API_URL} · Website: ${SITE_URL}`,
  ];
  return { problems, markdown: lines.join('\n') };
}

(async () => {
  let live = await runChecks(liveChecks());
  if (live.some((r) => !r.ok) && RETRY_DELAY_SECONDS > 0) {
    console.log(`Live check failed; retrying in ${RETRY_DELAY_SECONDS}s to rule out a blip...`);
    await new Promise((r) => setTimeout(r, RETRY_DELAY_SECONDS * 1000));
    live = await runChecks(liveChecks());
  }
  const results = [...live, ...(await agFeedChecks()), ...(await workflowChecks())];
  const { problems, markdown } = report(results);

  console.log(markdown);
  fs.writeFileSync(path.join(REPORT_DIR, 'monitor-report.md'), markdown + '\n');
  fs.writeFileSync(
    path.join(REPORT_DIR, 'monitor-status.json'),
    JSON.stringify({ problems: problems.map((p) => p.name) }) + '\n'
  );
})().catch((err) => {
  // The monitor itself breaking is a problem worth an issue too.
  const markdown = `**The monitor itself crashed**: ${err.stack || err.message}`;
  console.error(markdown);
  fs.writeFileSync(path.join(REPORT_DIR, 'monitor-report.md'), markdown + '\n');
  fs.writeFileSync(path.join(REPORT_DIR, 'monitor-status.json'), JSON.stringify({ problems: ['Monitor crashed'] }) + '\n');
});
