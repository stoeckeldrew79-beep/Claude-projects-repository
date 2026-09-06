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

const MODEL = process.env.SCAMSHIELD_MODEL ?? 'claude-opus-5';
const APPLY = process.argv.includes('--apply');
const COUNT = Number(process.env.SCAMSHIELD_BATCH_SIZE ?? 3);

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

// Target the thinnest coverage, the same way the human-written routine did.
function pickTarget(): { country: string; note: string } {
  const counts = new Map<string, number>();
  for (const s of SEED_SCAMS) counts.set(s.country ?? 'US', (counts.get(s.country ?? 'US') ?? 0) + 1);
  const nonUs = [...counts.entries()].filter(([c]) => c !== 'US').sort((a, b) => a[1] - b[1]);
  // Two US entries for every international one: US consumers are the
  // primary audience, but coverage gaps abroad are wider.
  if (Math.random() < 0.34 && nonUs.length) {
    const [country, n] = nonUs[0];
    return { country, note: `${country} currently has ${n} entries — the thinnest non-US coverage.` };
  }
  return { country: 'US', note: `The US has ${counts.get('US') ?? 0} entries; find genuinely new patterns, not variants.` };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('generateScamEntries: ANTHROPIC_API_KEY is not set. This job bills the Anthropic API directly and cannot run without one.');
    process.exit(1);
  }
  const client = new Anthropic();
  const slugs = existingSlugs();
  const target = pickTarget();
  const categories = SEED_CATEGORIES.map((c) => c.slug).join(', ');

  console.log(`generateScamEntries: model=${MODEL} target=${target.country} batch=${COUNT} mode=${APPLY ? 'APPLY' : 'dry run'}`);

  // 1. Research — real, currently reported scams, with agency sources.
  const research = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }],
    messages: [
      {
        role: 'user',
        content:
          `Find ${COUNT} distinct consumer scams currently being reported in ${target.country}. ${target.note}\n\n` +
          `For each: what it is, exactly how it works, who reported it, and the URL of the reporting agency's page ` +
          `(a consumer-protection agency, police force, or financial regulator in that country — not a news aggregator).\n\n` +
          `Hard requirements: every scam must be real and documented; no invented statistics, companies, or individuals. ` +
          `If you can only verify fewer than ${COUNT}, return fewer — a short honest batch is correct, padding is not.\n\n` +
          `Avoid anything already covered by these existing entry names:\n` +
          SEED_SCAMS.slice(-120).map((s) => `- ${s.name}`).join('\n'),
      },
    ],
  });
  const findings = research.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('\n');
  if (!findings.trim()) {
    console.error('generateScamEntries: research call returned no text. Nothing to extract.');
    process.exit(1);
  }

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
          `- state: only for a scam genuinely tied to one US state; omit otherwise\n` +
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

  // 3. Reject anything that would corrupt the corpus, and say why.
  const validCategories = new Set(SEED_CATEGORIES.map((c) => c.slug));
  const accepted: Entry[] = [];
  for (const e of parsed.entries) {
    if (slugs.has(e.slug)) { console.log(`  reject ${e.slug}: slug already exists`); continue; }
    if (!validCategories.has(e.categorySlug)) { console.log(`  reject ${e.slug}: unknown category ${e.categorySlug}`); continue; }
    if (!findings.includes(new URL(e.sourceUrl).hostname)) { console.log(`  reject ${e.slug}: sourceUrl host not present in the research findings`); continue; }
    if (accepted.some((a) => a.slug === e.slug)) { console.log(`  reject ${e.slug}: duplicate within this batch`); continue; }
    accepted.push(e);
  }

  console.log(`generateScamEntries: ${accepted.length} of ${parsed.entries.length} entries accepted`);
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
  console.error(err);
  process.exit(1);
});
