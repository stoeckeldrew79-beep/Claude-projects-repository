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

const MODEL = process.env.SCAMSHIELD_MODEL ?? 'claude-opus-5';
const APPLY = process.argv.includes('--apply');
const COUNT = Number(process.env.SCAMSHIELD_BATCH_SIZE ?? 3);
// 'state' | 'international' | 'us'. Unset keeps the original mixed behaviour,
// so the existing schedule is unchanged; the state schedule sets this to
// 'state' rather than running a second copy of this job with its own guards.
const TARGET_MODE = process.env.SCAMSHIELD_TARGET;

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

function thinnestNonUs(): Target | null {
  const counts = new Map<string, number>();
  for (const s of SEED_SCAMS) counts.set(s.country ?? 'US', (counts.get(s.country ?? 'US') ?? 0) + 1);
  const nonUs = [...counts.entries()].filter(([c]) => c !== 'US').sort((a, b) => a[1] - b[1]);
  if (!nonUs.length) return null;
  const [country, n] = nonUs[0];
  return { country, note: `${country} currently has ${n} entries — the thinnest non-US coverage.` };
}

function usNational(): Target {
  const n = SEED_SCAMS.filter((s) => (s.country ?? 'US') === 'US').length;
  return { country: 'US', note: `The US has ${n} entries; find genuinely new patterns, not variants.` };
}

// Target the thinnest coverage, the same way the human-written routine did.
function pickTarget(): Target {
  if (TARGET_MODE === 'state') return thinnestState();
  if (TARGET_MODE === 'us') return usNational();
  if (TARGET_MODE === 'international') return thinnestNonUs() ?? usNational();
  // Two US entries for every international one: US consumers are the
  // primary audience, but coverage gaps abroad are wider.
  if (Math.random() < 0.34) {
    const intl = thinnestNonUs();
    if (intl) return intl;
  }
  return usNational();
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
  const target = pickTarget();
  const categories = SEED_CATEGORIES.map((c) => c.slug).join(', ');

  const targetLabel = target.state ? `${target.state} (${target.stateName})` : target.country;
  console.log(`generateScamEntries: model=${MODEL} target=${targetLabel} batch=${COUNT} mode=${APPLY ? 'APPLY' : 'dry run'}`);
  console.log(`generateScamEntries: ${target.note}`);

  // One full attempt: research, extract, then reject anything that would
  // corrupt the corpus. Separated out so a run whose every candidate already
  // existed can try again knowing what collided, rather than paying for a
  // search and writing nothing.
  async function attempt(collided: string[]) {
  // 1. Research — real, currently reported scams, with agency sources.
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
      `Avoid anything already covered by these existing ${target.stateName} entries:\n` +
      exclusionSample(target, EXCLUSION_SAMPLE_SIZE).map((n) => `- ${n}`).join('\n') +
      (collided.length
        ? `\n\nA previous attempt proposed these and every one already existed. ` +
          `Do not propose them or close variants again:\n` +
          collided.map((c) => `- ${c}`).join('\n')
        : '')
    : `Find ${COUNT} distinct consumer scams currently being reported in ${target.country}. ${target.note}\n\n` +
    `For each: what it is, exactly how it works, who reported it, and the URL of the reporting agency's page ` +
    `(a consumer-protection agency, police force, or financial regulator in that country — not a news aggregator).\n\n` +
    `Hard requirements: every scam must be real and documented; no invented statistics, companies, or individuals. ` +
    `If you can only verify fewer than ${COUNT}, return fewer — a short honest batch is correct, padding is not.\n\n` +
    `Avoid anything already covered by these existing entry names:\n` +
    exclusionSample(target, EXCLUSION_SAMPLE_SIZE).map((n) => `- ${n}`).join('\n') +
    (collided.length
      ? `\n\nA previous attempt proposed these and every one already existed. ` +
        `Do not propose them or close variants again:\n` +
        collided.map((c) => `- ${c}`).join('\n')
      : '');

  const researchMessages: Anthropic.MessageParam[] = [];
  let research = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }],
    messages: [{ role: 'user', content: researchPrompt }],
  });

  // A server tool can end the turn early with pause_turn when a search runs
  // long. Extracting from that half-finished answer is how a run quietly
  // produces nothing, so hand the turn back and let it finish.
  const collected = [...research.content];
  let resumes = 0;
  while (research.stop_reason === 'pause_turn' && resumes < 4) {
    resumes += 1;
    console.log(`generateScamEntries: research paused, resuming (${resumes})`);
    researchMessages.push({ role: 'assistant', content: research.content });
    research = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }],
      messages: [{ role: 'user', content: researchPrompt }, ...researchMessages],
    });
    collected.push(...research.content);
  }

  const findings = collected.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('\n');
  console.log(`generateScamEntries: research stop_reason=${research.stop_reason} findings=${findings.length} chars`);
  if (!findings.trim()) {
    console.error('generateScamEntries: research call returned no text. Nothing to extract.');
    process.exit(1);
  }
  // On a dry run the findings are the whole point of looking: without them a
  // "0 entries" result is unexplainable.
  if (!APPLY) console.log(`\n--- research findings ---\n${findings.slice(0, 4000)}\n--- end findings ---\n`);

  // 2. Extract — schema-valid entries, no free-form output to parse by hand.
  const extracted = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content:
          `Turn these verified findings into database entries.\n\n` +
          `Rules:\n` +
          `- categorySlug must be one of: ${categories}\n` +
          `- slug: lowercase, hyphenated, derived from the name\n` +
          `- country: ISO-3166 alpha-2, "${target.country}" for all of these\n` +
          (target.state
            ? `- state: "${target.state}" for every entry — these are all ${target.stateName} scams\n`
            : `- state: only for a scam genuinely tied to one US state; omit otherwise\n`) +
          `- sourceUrl: the agency URL from the findings, never invented\n` +
          `- description: 3-5 sentences, plain language, ending in what a reader should do\n\n` +
          `FINDINGS:\n${findings}`,
      },
    ],
    output_config: { format: zodOutputFormat(BatchSchema) },
  });

  const parsed = extracted.parsed_output;
  if (!parsed) {
    console.error('generateScamEntries: extraction did not parse against the schema. Nothing written.');
    process.exit(1);
  }
  // An empty batch after a successful research call means the extraction
  // rejected everything it was given — say so, rather than reporting "0 of 0"
  // and letting it read as a quiet success.
  if (!parsed.entries.length) {
    console.error('generateScamEntries: research returned findings but extraction produced no entries. The findings above are what it had to work with.');
    process.exit(1);
  }

  // 3. Reject anything that would corrupt the corpus, and say why.
  const validCategories = new Set(SEED_CATEGORIES.map((c) => c.slug));
  const accepted: Entry[] = [];
  const collisions: string[] = [];
  for (const e of parsed.entries) {
    if (slugs.has(e.slug)) { console.log(`  reject ${e.slug}: slug already exists`); collisions.push(e.name); continue; }
    if (!validCategories.has(e.categorySlug)) { console.log(`  reject ${e.slug}: unknown category ${e.categorySlug}`); continue; }
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
    if (!findings.includes(sourceUrl)) { console.log(`  reject ${e.slug}: sourceUrl is not in the research findings verbatim`); continue; }
    e.sourceUrl = sourceUrl;
    if (accepted.some((a) => a.slug === e.slug)) { console.log(`  reject ${e.slug}: duplicate within this batch`); continue; }
    accepted.push(e);
  }

    return { accepted, proposed: parsed.entries.length, collisions };
  }

  let { accepted, proposed, collisions } = await attempt([]);

  // Nothing accepted purely because every candidate already existed is a
  // solvable miss, not a dead end: the search worked, the corpus is simply
  // large enough now that the obvious answers are in it. One more attempt,
  // told what collided. Capped at one — a second empty result means the
  // search genuinely found nothing new today.
  if (!accepted.length && collisions.length) {
    console.log(`generateScamEntries: all ${collisions.length} proposed entries already existed — retrying once with those excluded.`);
    ({ accepted, proposed, collisions } = await attempt(collisions));
  }

  console.log(`generateScamEntries: ${accepted.length} of ${proposed} entries accepted`);
  for (const e of accepted) console.log(`  + [${e.categorySlug}] ${e.name}\n      ${e.sourceUrl}`);

  if (!APPLY) {
    console.log('\ngenerateScamEntries: dry run — nothing written. Re-run with --apply to write.');
    return;
  }
  if (!accepted.length) return;

  // 4. Append to the right shard, preserving the existing formatting.
  const byShard = new Map<string, Entry[]>();
  for (const e of accepted) {
    const s = shardFor(e);
    byShard.set(s, [...(byShard.get(s) ?? []), e]);
  }
  for (const [shard, entries] of byShard) {
    const file = path.join(SHARD_DIR, `${shard}.ts`);
    const src = fs.readFileSync(file, 'utf8');
    const literal = entries
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
        return `  {\n${lines.join('\n')}\n  },`;
      })
      .join('\n');
    const marker = src.lastIndexOf('\n];');
    if (marker === -1) { console.error(`generateScamEntries: could not find the array end in ${shard}.ts — skipped`); continue; }
    fs.writeFileSync(file, src.slice(0, marker + 1) + literal + src.slice(marker + 1));
    console.log(`  wrote ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} to scams/${shard}.ts`);
  }
  console.log('\ngenerateScamEntries: run `npx tsc --noEmit` and `npm run seed` before committing.');
}

main().catch((err) => {
  // A raw API error prints mostly response headers, which buries the one line
  // that says what went wrong. Lead with that, then the detail.
  const api = err?.error?.error;
  if (api?.type) console.error(`generateScamEntries: ${api.type} - ${api.message}`);
  console.error(err);
  process.exit(1);
});
