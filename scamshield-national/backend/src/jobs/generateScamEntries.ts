// Generates new scam-database entries through the Anthropic API, so content
// production runs on its own metered billing instead of consuming a Claude
// subscription's weekly allowance. Intended to run unattended on a schedule
// (see .github/workflows/), which is the whole point: the corpus keeps
// growing whether or not anyone is at a keyboard.
//
// Two calls per run, deliberately not one:
//   1. research  — web_search finds real, currently-reported scams and the
//                  agency pages documenting them.
//   2. extract   — messages.parse() turns those findings into schema-valid
//                  SeedScam objects.
// Mixing a server tool with structured output in a single call risks a
// pause_turn ending the turn with a silently truncated answer.
//
// A third source needs no search at all: 'doj' targets hand the extract call
// a batch of the Justice Department's own fraud press releases, which are
// primary sources by definition, so those entries cost one call and never
// come back empty for lack of a findable agency page.
//
// Writes nothing unless --apply is passed. The default is a dry run that
// prints what it would add, so the job can be exercised safely.
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { SEED_SCAMS } from '../db/seed-data/scams';
import { SEED_CATEGORIES } from '../db/seed-data/categories';
import { SEED_STATE_AG_SOURCES } from '../db/seed-data/state-ag-sources';
import { DojRelease, isFraudRelease, officeName, releaseSeconds, stateForComponent } from './dojArchive';
import { fetchDojPage, sleep } from './dojApi';
import { cleanText } from './agFeedParse';

const MODEL = process.env.SCAMSHIELD_MODEL ?? 'claude-opus-5';
const APPLY = process.argv.includes('--apply');
const COUNT = Number(process.env.SCAMSHIELD_BATCH_SIZE ?? 3);
// 'state' | 'international' | 'us' | 'doj' runs that one kind of target (the
// state schedule sets 'state'). Unset, a run works through SCAMSHIELD_PLAN —
// several targets per run, each its own research + extract, so one dead-end
// target no longer costs the whole run.
const TARGET_MODE = process.env.SCAMSHIELD_TARGET;
const PLAN = (process.env.SCAMSHIELD_PLAN ?? 'international,international,us,doj')
  .split(',')
  .map((x) => x.trim())
  .filter(Boolean);
// DOJ targets need no search, so they can carry a bigger batch cheaply.
const DOJ_COUNT = Number(process.env.SCAMSHIELD_DOJ_BATCH_SIZE ?? 6);
const SEARCH_USES = Number(process.env.SCAMSHIELD_SEARCH_USES ?? 15);

const SHARD_DIR = path.join(__dirname, '..', 'db', 'seed-data', 'scams');

// Mirrors SeedScam. Kept strict: a missing sourceUrl or an unknown category
// is a reason to reject an entry, not to paper over it.
const EntrySchema = z.object({
  name: z.string().min(8),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(120),
  categorySlug: z.string(),
  alertLevel: z.enum(['low', 'medium', 'high', 'critical']),
  sources: z.array(z.string()).min(1),
  sourceUrl: z.string().url(),
  country: z.string().length(2),
  state: z.string().length(2).optional(),
});
const BatchSchema = z.object({ entries: z.array(EntrySchema) });
type Entry = z.infer<typeof EntrySchema>;

// Names to tell the research call are already covered.
//
// This was SEED_SCAMS.slice(-120). SEED_SCAMS is the shards concatenated, so
// the last 120 all came from us-t-z: the model was shown 120 of 2,155 entries,
// every one of them starting t-w, and was blind to everything from a to s. It
// duly proposed entries that already existed and the run wrote nothing.
//
// Sampling at an even stride covers the whole alphabet, and entries for the
// country being targeted are the ones worth spending the tokens on.
function exclusionSample(target: { country: string; state?: string }, limit: number): string[] {
  // In state mode the entries that would collide are that state's own, and
  // there are only ever a handful — show all of them rather than a stride
  // sample of the whole corpus, which would omit most of them.
  if (target.state) {
    const inState = SEED_SCAMS.filter((s) => s.state === target.state);
    if (inState.length <= limit) return inState.map((s) => s.name);
  }
  const sameCountry = SEED_SCAMS.filter((s) => (s.country ?? 'US') === target.country);
  const source = sameCountry.length >= limit ? sameCountry : SEED_SCAMS;
  if (source.length <= limit) return source.map((s) => s.name);
  const stride = source.length / limit;
  const out: string[] = [];
  for (let i = 0; i < limit; i += 1) out.push(source[Math.floor(i * stride)].name);
  return out;
}

const EXCLUSION_SAMPLE_SIZE = 500;

// A URL lifted out of prose picks up whatever punctuation followed it. The
// first good run produced ".../electricity-sales-scams-on-social-media/','"
// — and z.string().url() accepts it, because quotes and commas are legal path
// characters. Written as-is it becomes a "Read more" link that 404s, which is
// worse for a database whose value is that its sources check out than having
// no link at all.
function tidyUrl(url: string): string {
  return url.trim().replace(/[\"'`,.;:)\]}\s]+$/, '');
}

function existingSlugs(): Set<string> {
  return new Set(SEED_SCAMS.map((s) => s.slug));
}

// Which shard a new entry belongs in — must match the scheme in
// seed-data/scams/index.ts, or the entry lands somewhere it will not be found.
function shardFor(entry: Entry): string {
  if (entry.country !== 'US') return 'international';
  const c = entry.slug[0].toLowerCase();
  if (c <= 'f') return 'us-a-f';
  if (c <= 'm') return 'us-g-m';
  if (c <= 's') return 'us-n-s';
  return 'us-t-z';
}

// "a Arkansas agency impersonation" in the prompt is the kind of wrongness a
// model reproduces in the prose it writes. A, I and O states take "an";
// Utah is the one vowel-initial state that does not, because it is spoken
// "yoo-tah". No state begins with E.
function article(stateName: string): string {
  return /^[AIO]/.test(stateName) ? 'an' : 'a';
}

interface Target {
  country: string;
  note: string;
  // Set only for a DOJ target: the press releases are the findings.
  doj?: DojCandidate[];
  // Set only in state mode. Everything downstream keys off this: the research
  // prompt, the required state on every entry, and the exclusion sample.
  state?: string;
  stateName?: string;
  agency?: string;
  agencyUrl?: string;
}

// Whichever state has the fewest documented entries, alphabetical on a tie.
// Deliberately derived from the corpus rather than a stored rotation cursor:
// there is no position to drift, a failed run costs nothing, and coverage
// self-levels instead of depending on every scheduled run having fired. The
// 51 come from the AG source table, so a state with zero entries is still a
// candidate — it sorts first, which is what should happen.
function thinnestState(): Target {
  const counts = new Map<string, number>();
  for (const src of SEED_STATE_AG_SOURCES) counts.set(src.state, 0);
  for (const s of SEED_SCAMS) {
    if (s.state && counts.has(s.state)) counts.set(s.state, (counts.get(s.state) ?? 0) + 1);
  }
  const [state, n] = [...counts.entries()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))[0];
  const src = SEED_STATE_AG_SOURCES.find((x) => x.state === state)!;
  return {
    country: 'US',
    state,
    stateName: src.state_name,
    agency: src.agency_name,
    agencyUrl: src.reports_url ?? src.consumer_protection_url,
    note: `${src.state_name} currently has ${n} documented ${n === 1 ? 'entry' : 'entries'} — the thinnest state coverage.`,
  };
}

// Countries with no meaningful public fraud-reporting infrastructure to
// research. They stay permanently "thinnest" no matter how many runs target
// them, so excluding them here is what actually stops the repeat failures —
// downgrading a fruitless run to a non-error (below) only stops it from
// being reported as one. LA (Laos) emptied every international run from
// Oct 16 to 18: no agency publishes scam warnings it can find.
const THIN_COVERAGE_DEAD_ENDS = new Set(['NU', 'LA']);

// How many of the thinnest countries a run chooses among. Always taking the
// single thinnest is what jammed the job: a country with no findable
// sources stays thinnest forever and every run retries it. A random pick
// from the thin end still steers growth to the gaps, but one dead end can
// only ever cost the occasional target, not every run.
const THIN_POOL = 15;

function thinnestNonUs(exclude: Set<string> = new Set()): Target | null {
  const counts = new Map<string, number>();
  for (const s of SEED_SCAMS) counts.set(s.country ?? 'US', (counts.get(s.country ?? 'US') ?? 0) + 1);
  const nonUs = [...counts.entries()]
    .filter(([c]) => c !== 'US' && !THIN_COVERAGE_DEAD_ENDS.has(c) && !exclude.has(c))
    .sort((a, b) => a[1] - b[1]);
  if (!nonUs.length) return null;
  const pool = nonUs.slice(0, THIN_POOL);
  const [country, n] = pool[Math.floor(Math.random() * pool.length)];
  return { country, note: `${country} currently has ${n} entries — among the thinnest non-US coverage.` };
}

function usNational(): Target {
  const n = SEED_SCAMS.filter((s) => (s.country ?? 'US') === 'US').length;
  return { country: 'US', note: `The US has ${n} entries; find genuinely new patterns, not variants.` };
}

interface DojCandidate {
  url: string;
  title: string;
  office: string | null;
  state: string | null;
  date: string;
  text: string;
}

const DOJ_TEXT_MAX = 1800;
const DOJ_CANDIDATES = 24;

function dojText(release: DojRelease): string {
  const text = cleanText((release.body || release.teaser || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  return text.length > DOJ_TEXT_MAX ? `${text.slice(0, DOJ_TEXT_MAX)}…` : text;
}

// Recent DOJ fraud releases the corpus doesn't already cite. Starts at a
// random page in the last few months so consecutive runs see different
// cases rather than racing each other for the newest handful.
export async function dojTarget(): Promise<Target | null> {
  const cited = new Set(SEED_SCAMS.map((s) => (s.sourceUrl ?? '').replace(/\/+$/, '')));
  const start = Math.floor(Math.random() * 40);
  const out: DojCandidate[] = [];
  for (let page = start; page < start + 6 && out.length < DOJ_CANDIDATES; page++) {
    let releases: DojRelease[];
    try {
      releases = await fetchDojPage({ sort: 'created', direction: 'DESC', page });
    } catch (err) {
      console.log(`generateScamEntries: DOJ API unavailable (${(err as Error).message}); skipping the DOJ target.`);
      break;
    }
    for (const r of releases) {
      if (!r.url || !isFraudRelease(r) || cited.has(r.url.replace(/\/+$/, ''))) continue;
      const components = Array.isArray(r.component) ? (r.component as { name: string }[]).map((c) => c.name) : [];
      const usao = components.find((c) => /^USAO\s*-/i.test(c));
      const secs = releaseSeconds(r);
      out.push({
        url: r.url,
        title: cleanText(r.title).replace(/\s+/g, ' ').trim(),
        office: usao ? officeName(usao) : components[0] ?? null,
        state: usao ? stateForComponent(usao) : null,
        date: secs ? new Date(secs * 1000).toISOString().slice(0, 10) : 'unknown',
        text: dojText(r),
      });
      if (out.length >= DOJ_CANDIDATES) break;
    }
    await sleep(250);
  }
  if (!out.length) return null;
  return {
    country: 'US',
    doj: out,
    note: `${out.length} recent Justice Department fraud releases not yet cited by any entry.`,
  };
}

// The targets one run works through.
async function pickTargets(): Promise<Target[]> {
  const modes = TARGET_MODE ? [TARGET_MODE] : PLAN;
  const targets: Target[] = [];
  const chosen = new Set<string>();
  for (const mode of modes) {
    if (mode === 'state') targets.push(thinnestState());
    else if (mode === 'us') targets.push(usNational());
    else if (mode === 'doj') {
      const t = await dojTarget();
      if (t) targets.push(t);
    } else if (mode === 'international') {
      const t = thinnestNonUs(chosen);
      if (t) {
        chosen.add(t.country);
        targets.push(t);
      } else targets.push(usNational());
    } else console.log(`generateScamEntries: unknown target mode "${mode}" ignored`);
  }
  return targets;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('generateScamEntries: ANTHROPIC_API_KEY is not set. This job bills the Anthropic API directly and cannot run without one.');
    process.exit(1);
  }
  // The API returns a retryable "overloaded" error under load, and this job
  // runs unattended: an unretried blip silently costs a whole batch. The SDK
  // backs off between attempts, so a generous count is cheap - a run that
  // waits is strictly better than one that produces nothing.
  const client = new Anthropic({ maxRetries: 8 });
  const slugs = existingSlugs();
  const targets = await pickTargets();
  const categories = SEED_CATEGORIES.map((c) => c.slug).join(', ');
  const validCategories = new Set(SEED_CATEGORIES.map((c) => c.slug));

  console.log(
    `generateScamEntries: model=${MODEL} targets=${targets.length} batch=${COUNT} mode=${APPLY ? 'APPLY' : 'dry run'}`
  );

  // Research only — returns the findings text the extract call works from.
  async function research(target: Target, collided: string[]): Promise<string> {
    const avoid = (heading: string) =>
      `${heading}\n` +
      exclusionSample(target, EXCLUSION_SAMPLE_SIZE).map((n) => `- ${n}`).join('\n') +
      (collided.length
        ? `\n\nA previous attempt proposed these and every one already existed. ` +
          `Do not propose them or close variants again:\n` +
          collided.map((c) => `- ${c}`).join('\n')
        : '');
    const researchPrompt = target.state
      ? `Find ${COUNT} distinct consumer scams currently being reported in ${target.stateName}. ${target.note}\n\n` +
        `Start from the ${target.agency} and its published consumer alerts (${target.agencyUrl}); also use that state's ` +
        `local news coverage of scams and any state agency that warns consumers there.\n\n` +
        `Each scam must be genuinely tied to ${target.stateName} — ${article(target.stateName!)} ${target.stateName} ` +
        `agency impersonation, an enforcement action or alert by the ${target.agency}, a scam targeting ` +
        `${article(target.stateName!)} ${target.stateName} benefit program, or a fraud operating against ` +
        `${target.stateName} residents. A nationwide scam that merely also happens there does not qualify; ` +
        `return fewer entries instead.\n\n` +
        `For each: what it is, exactly how it works, who reported it, and the URL of the reporting agency's page ` +
        `(the state Attorney General, another state agency, or a federal regulator — not a news aggregator).\n\n` +
        `Hard requirements: every scam must be real and documented; no invented statistics, companies, or individuals. ` +
        `If you can only verify fewer than ${COUNT}, return fewer — a short honest batch is correct, padding is not.\n\n` +
        avoid(`Avoid anything already covered by these existing ${target.stateName} entries:`)
      : `Find ${COUNT} distinct consumer scams currently being reported in ${target.country} (ISO 3166 country code). ${target.note}\n\n` +
        `For each: what it is, exactly how it works, who reported it, and the URL of the source page. Prefer the ` +
        `reporting agency's own page (a consumer-protection agency, police force, central bank or financial regulator ` +
        `in that country). Where the agency's site is not reachable or not indexed, a report by an established national ` +
        `news outlet that names the agency and quotes its warning is acceptable — never a blog, forum or aggregator. ` +
        `Search in the country's own language as well as English.\n\n` +
        `Hard requirements: every scam must be real and documented; no invented statistics, companies, or individuals. ` +
        `If you can only verify fewer than ${COUNT}, return fewer — a short honest batch is correct, padding is not.\n\n` +
        avoid('Avoid anything already covered by these existing entry names:');

    const tools: Anthropic.Messages.ToolUnion[] = [{ type: 'web_search_20260209', name: 'web_search', max_uses: SEARCH_USES }];
    const researchMessages: Anthropic.MessageParam[] = [];
    let res = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      tools,
      messages: [{ role: 'user', content: researchPrompt }],
    });

    // A server tool can end the turn early with pause_turn when a search runs
    // long. Extracting from that half-finished answer is how a run quietly
    // produces nothing, so hand the turn back and let it finish.
    const collected = [...res.content];
    let resumes = 0;
    while (res.stop_reason === 'pause_turn' && resumes < 4) {
      resumes += 1;
      console.log(`generateScamEntries: research paused, resuming (${resumes})`);
      researchMessages.push({ role: 'assistant', content: res.content });
      res = await client.messages.create({
        model: MODEL,
        max_tokens: 16000,
        thinking: { type: 'adaptive' },
        tools,
        messages: [{ role: 'user', content: researchPrompt }, ...researchMessages],
      });
      collected.push(...res.content);
    }
    const findings = collected.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('\n');
    console.log(`generateScamEntries: research stop_reason=${res.stop_reason} findings=${findings.length} chars`);
    return findings;
  }

  function dojFindings(target: Target): string {
    return target
      .doj!.map(
        (c, i) =>
          `[${i + 1}] ${c.title}\nURL: ${c.url}\nOffice: ${c.office ?? 'Department of Justice'}\n` +
          `State: ${c.state ?? 'none (national)'}\nDate: ${c.date}\n${c.text}`
      )
      .join('\n\n');
  }

  // One full attempt for one target: findings, extract, then reject anything
  // that would corrupt the corpus. Never exits the process — in a run of
  // several targets, one bad target must not cost the others.
  async function attempt(target: Target, collided: string[]) {
    const empty = { accepted: [] as Entry[], proposed: 0, collisions: [] as string[] };
    const count = target.doj ? DOJ_COUNT : COUNT;
    const findings = target.doj ? dojFindings(target) : await research(target, collided);
    if (!findings.trim()) {
      console.log('generateScamEntries: research call returned no text. Nothing to extract.');
      return empty;
    }
    // On a dry run the findings are the whole point of looking: without them a
    // "0 entries" result is unexplainable.
    if (!APPLY) console.log(`\n--- findings ---\n${findings.slice(0, 4000)}\n--- end findings ---\n`);

    const dojRules = target.doj
      ? `These findings are U.S. Justice Department press releases about fraud cases. Choose up to ${count} that ` +
        `reveal a scam pattern ordinary people, small businesses or benefit programs should watch for (impersonation, ` +
        `romance, investment, elder, lottery, tech-support, crypto, identity theft, benefit or disaster fraud and the ` +
        `like). Skip cases that teach a consumer nothing — pure billing or procurement fraud by insiders, tax evasion ` +
        `by the defendant, bribery — and skip any that duplicate this list of existing names:\n` +
        exclusionSample(target, EXCLUSION_SAMPLE_SIZE).map((n) => `- ${n}`).join('\n') +
        `\n\nName each entry after the scheme, not the defendant (e.g. "Fake Bank Investigator Gold Courier Scam (Ohio)"). ` +
        `The description explains how the scheme worked on its victims, cites the outcome (charged, convicted, ` +
        `sentenced) without naming private individuals, and ends with what a reader should do. ` +
        `sources: ["U.S. Department of Justice", the office]. Never use facts that are not in the release.\n\n`
      : '';
    const extracted = await client.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content:
            `Turn these verified findings into database entries.\n\n` +
            dojRules +
            `Rules:\n` +
            `- categorySlug must be one of: ${categories}\n` +
            `- slug: lowercase, hyphenated, derived from the name\n` +
            `- country: ISO-3166 alpha-2, "${target.country}" for all of these\n` +
            (target.state
              ? `- state: "${target.state}" for every entry — these are all ${target.stateName} scams\n`
              : target.doj
                ? `- state: the release's State when it has one; omit it for "none (national)"\n`
                : `- state: only for a scam genuinely tied to one US state; omit otherwise\n`) +
            `- sourceUrl: the source URL from the findings, never invented\n` +
            `- description: 3-5 sentences, plain language, ending in what a reader should do\n\n` +
            `FINDINGS:\n${findings}`,
        },
      ],
      output_config: { format: zodOutputFormat(BatchSchema) },
    });

    const parsed = extracted.parsed_output;
    if (!parsed) {
      console.log('generateScamEntries: extraction did not parse against the schema. Nothing taken from this target.');
      return empty;
    }
    // An empty batch is a legitimate result, not a bug: refusing to fabricate
    // an entry when nothing verifiable turned up is the intended behavior.
    if (!parsed.entries.length) {
      console.log('generateScamEntries: findings produced no entries for this target — nothing verifiable to add.');
      // Without the findings an empty target is unexplainable from the log
      // (the dry-run print above is skipped under --apply), so show them here.
      if (APPLY) console.log(`\n--- findings (why nothing was extracted) ---\n${findings.slice(0, 4000)}\n--- end findings ---\n`);
      return empty;
    }

    const dojState = new Map((target.doj ?? []).map((c) => [c.url, c.state]));
    const accepted: Entry[] = [];
    const collisions: string[] = [];
    for (const e of parsed.entries.slice(0, count)) {
      if (slugs.has(e.slug)) { console.log(`  reject ${e.slug}: slug already exists`); collisions.push(e.name); continue; }
      if (!validCategories.has(e.categorySlug)) { console.log(`  reject ${e.slug}: unknown category ${e.categorySlug}`); continue; }
      if (e.country !== target.country) { console.log(`  reject ${e.slug}: country is ${e.country}, expected ${target.country}`); continue; }
      // A state run exists to deepen one state. An entry that comes back
      // untagged, or tagged to a different state, is a nationwide scam that
      // slipped the prompt — writing it would grow the corpus while leaving
      // the state's coverage exactly where it was, and quietly skew the map.
      if (target.state && e.state !== target.state) {
        console.log(`  reject ${e.slug}: state is ${e.state ?? 'unset'}, expected ${target.state}`);
        continue;
      }
      // The whole URL has to appear in the findings verbatim, not just its
      // host. A matching hostname only proves the domain was mentioned
      // somewhere; it does not stop a plausible-looking path being invented on
      // a real agency's domain.
      const sourceUrl = tidyUrl(e.sourceUrl);
      if (!findings.includes(sourceUrl)) { console.log(`  reject ${e.slug}: sourceUrl is not in the findings verbatim`); continue; }
      e.sourceUrl = sourceUrl;
      if (target.doj) {
        // A DOJ release's state comes from the U.S. Attorney's office that
        // issued it — take that, not whatever the model wrote.
        if (!dojState.has(sourceUrl)) { console.log(`  reject ${e.slug}: sourceUrl is not one of the releases`); continue; }
        const st = dojState.get(sourceUrl);
        if (st && st.length === 2) e.state = st;
        else delete e.state;
      }
      accepted.push(e);
      slugs.add(e.slug);
    }
    return { accepted, proposed: parsed.entries.length, collisions };
  }

  const accepted: Entry[] = [];
  let proposedTotal = 0;
  for (const target of targets) {
    const label = target.doj ? 'DOJ releases' : target.state ? `${target.state} (${target.stateName})` : target.country;
    console.log(`\ngenerateScamEntries: target ${label} — ${target.note}`);
    try {
      let r = await attempt(target, []);
      // Nothing accepted purely because every candidate already existed is a
      // solvable miss: one more attempt, told what collided.
      if (!r.accepted.length && r.collisions.length && !target.doj) {
        console.log(`generateScamEntries: all ${r.collisions.length} proposed entries already existed — retrying once with those excluded.`);
        r = await attempt(target, r.collisions);
      }
      console.log(`generateScamEntries: ${label}: ${r.accepted.length} of ${r.proposed} entries accepted`);
      accepted.push(...r.accepted);
      proposedTotal += r.proposed;
    } catch (err) {
      const api = (err as { error?: { error?: { type?: string; message?: string } } })?.error?.error;
      console.log(`generateScamEntries: ${label} failed (${api?.type ? `${api.type} - ${api.message}` : (err as Error).message}); continuing with the next target.`);
    }
  }

  console.log(`\ngenerateScamEntries: ${accepted.length} of ${proposedTotal} entries accepted across ${targets.length} targets`);
  for (const e of accepted) console.log(`  + [${e.categorySlug}] ${e.name}\n      ${e.sourceUrl}`);

  if (!APPLY) {
    console.log('\ngenerateScamEntries: dry run — nothing written. Re-run with --apply to write.');
    return;
  }
  if (!accepted.length) return;

  // 4. Append to the right shard as `Var.push({...});` blocks — the shards
  // stopped being one big array literal a while back (six routines editing
  // the same array made every addition a merge conflict), so each file is
  // now its initial array followed by a long tail of individual .push()
  // calls. There is no reliable "array end" to splice before any more; the
  // only insertion point every shard actually supports is its own end.
  const SHARD_VAR: Record<string, string> = {
    'us-a-f': 'UsAF',
    'us-g-m': 'UsGM',
    'us-n-s': 'UsNS',
    'us-t-z': 'UsTZ',
    international: 'International',
  };
  const byShard = new Map<string, Entry[]>();
  for (const e of accepted) {
    const s = shardFor(e);
    byShard.set(s, [...(byShard.get(s) ?? []), e]);
  }
  for (const [shard, entries] of byShard) {
    const file = path.join(SHARD_DIR, `${shard}.ts`);
    const varName = SHARD_VAR[shard];
    const blocks = entries
      .map((e) => {
        const lines = [
          `    name: ${JSON.stringify(e.name)},`,
          `    slug: ${JSON.stringify(e.slug)},`,
          `    description:`,
          `      ${JSON.stringify(e.description)},`,
          `    categorySlug: ${JSON.stringify(e.categorySlug)},`,
          `    alertLevel: ${JSON.stringify(e.alertLevel)},`,
          `    sources: ${JSON.stringify(e.sources)},`,
          `    sourceUrl: ${JSON.stringify(e.sourceUrl)},`,
          `    country: ${JSON.stringify(e.country)},`,
        ];
        if (e.state) lines.push(`    state: ${JSON.stringify(e.state)},`);
        return `\n${varName}.push({\n${lines.join('\n')}\n});\n`;
      })
      .join('');
    fs.appendFileSync(file, blocks);
    console.log(`  wrote ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} to scams/${shard}.ts`);
  }
  console.log('\ngenerateScamEntries: run `npx tsc --noEmit` and `npm run seed` before committing.');
}

if (require.main === module) {
  main().catch((err) => {
    // A raw API error prints mostly response headers, which buries the one line
    // that says what went wrong. Lead with that, then the detail.
    const api = err?.error?.error;
    if (api?.type) console.error(`generateScamEntries: ${api.type} - ${api.message}`);
    console.error(err);
    process.exit(1);
  });
}
