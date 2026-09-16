// Attaches real, licence-verified Wikimedia Commons photos to notorious
// profiles and guides that currently have none, and so fall back to the
// generated abstract cover art.
//
// Run:  npm run backfill-cover-photos            (writes)
//       npm run backfill-cover-photos -- --dry   (verifies only, writes nothing)
//
// The abstract art was always meant to be the exception - what a profile
// shows when no rights-cleared photo of anything relevant exists. It became
// the rule because photos were only ever attached by hand, a few profiles per
// sitting, while new profiles arrived faster than that.
//
// Two rules this script will not bend:
//
//   1. Nothing is written on an unverified licence. Every candidate has its
//      licence read off its own Commons file page, and anything that is not
//      public domain / CC0 / CC BY / CC BY-SA is dropped. A slug whose photo
//      cannot be verified keeps its abstract art - that is a correct outcome,
//      not a failure to work around.
//
//   2. No photo is presented as something it is not. For nearly all of these
//      people no free portrait exists, so the photo is of the place or the
//      thing the case turns on. Every entry therefore carries a caption
//      saying what the photo actually shows, rendered under the image, so a
//      courthouse is never mistaken for a defendant's portrait.

import * as fs from 'fs';
import * as path from 'path';
import { findPhoto, verifyFile, CommonsPhoto } from '../lib/commonsPhoto';
import { PHOTO_PLAN, PhotoPlanEntry } from './coverPhotoPlan';

const SEED_DIR = path.join(__dirname, '..', 'db', 'seed-data');
const SHARD_DIRS = ['notorious', 'guides'];

const DRY_RUN = process.argv.includes('--dry');
const REPORT_ONLY = process.argv.includes('--report');

// --only=slug[,slug] restricts the run to named entries. A full run re-checks
// every plan entry against Commons at one request per 350ms, which is around
// an hour - fine for the original backfill, wasteful when the daily content
// drop adds two profiles and those are all that need doing.
const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith('--only='));
  if (!arg) return null;
  const slugs = arg.slice('--only='.length).split(',').map((s) => s.trim()).filter(Boolean);
  return slugs.length ? new Set(slugs) : null;
})();

/** Finds which shard file physically contains a slug. */
function shardFor(slug: string): string | null {
  for (const dir of SHARD_DIRS) {
    const full = path.join(SEED_DIR, dir);
    if (!fs.existsSync(full)) continue;
    for (const file of fs.readdirSync(full)) {
      if (!file.endsWith('.ts') || file === 'index.ts') continue;
      const p = path.join(full, file);
      const text = fs.readFileSync(p, 'utf8');
      if (text.includes(`slug: '${slug}',`) || text.includes(`slug: "${slug}",`)) return p;
    }
  }
  return null;
}

/**
 * Inserts the cover fields immediately before the entry's `body:` line, which
 * is where every hand-written entry already puts them. Returns false rather
 * than guessing if the entry does not look the way it is expected to.
 */
function insertCoverFields(file: string, slug: string, photo: CommonsPhoto, position: number): boolean {
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  // Shards were written by more than one authoring pass, and they don't agree
  // on quoting: most entries use 'single', a later batch uses "double". The
  // first version of this matched single quotes only, so it silently found
  // nothing for six double-quoted entries. It failed safely - it refused to
  // write rather than writing to the wrong place - but it still skipped them.
  // Match either, and write back in whichever style the entry already uses so
  // the file stays internally consistent.
  const single = `slug: '${slug}',`;
  const double = `slug: "${slug}",`;
  const slugIdx = lines.findIndex((l) => {
    const t = l.trim();
    return t === single || t === double;
  });
  if (slugIdx === -1) return false;
  const q = lines[slugIdx].trim() === double ? '"' : "'";

  // Never double-write: if a later run re-reads a slug that already has a
  // photo, leave the existing (possibly hand-picked) one alone.
  let bodyIdx = -1;
  for (let i = slugIdx; i < Math.min(slugIdx + 12, lines.length); i++) {
    if (lines[i].trim().startsWith('coverImage:')) return false;
    if (lines[i].trim().startsWith('body:')) { bodyIdx = i; break; }
  }
  if (bodyIdx === -1) return false;

  // Escape backslashes first, then whichever quote character encloses the
  // literal - escaping in the other order would double-escape the backslashes
  // introduced by the quote pass.
  const esc = (v: string) =>
    v.replace(/\\/g, '\\\\').replace(new RegExp(q, 'g'), `\\${q}`);

  lines.splice(
    bodyIdx,
    0,
    `    coverImage: ${q}${esc(photo.url)}${q},`,
    `    coverImageCredit: ${q}${esc(photo.credit)}${q},`,
    `    coverImagePosition: ${position},`
  );
  fs.writeFileSync(file, lines.join('\n'));
  return true;
}

async function resolve(entry: PhotoPlanEntry): Promise<CommonsPhoto | null> {
  // An explicitly named file is used as given (still licence-checked);
  // otherwise search. Naming a file is how a case gets a specific photo
  // rather than whatever a search ranks first.
  if (entry.file) return verifyFile(`File:${entry.file}`, entry.caption);
  return findPhoto(entry.query!, { caption: entry.caption });
}

/**
 * Lists photoless entries that no plan entry covers. This is the part that
 * keeps the problem from rebuilding itself: profiles are written by hand, a
 * new one arrives with no photo, and nothing ever says so - which is exactly
 * how 147 of them accumulated behind the abstract art. Running this after
 * adding profiles names the ones still needing a photo chosen.
 */
function reportUnplanned(): number {
  // Required lazily: this pulls in every seed shard, which is megabytes of
  // article bodies that a normal backfill run has no reason to load.
  const { GUIDE_ARTICLES } = require('../db/seed-data/guides/index');
  const { NOTORIOUS_ARTICLES } = require('../db/seed-data/notorious/index');

  const planned = new Set(PHOTO_PLAN.map((p) => p.slug));
  const unplanned = [...NOTORIOUS_ARTICLES, ...GUIDE_ARTICLES]
    .filter((a: any) => !a.coverImage && !planned.has(a.slug));

  if (unplanned.length === 0) {
    console.log('Every entry without a cover photo has a plan entry. Nothing to choose.');
    return 0;
  }

  console.log(
    `${unplanned.length} entr${unplanned.length === 1 ? 'y has' : 'ies have'} no cover photo ` +
      `and no entry in coverPhotoPlan.ts:\n`
  );
  for (const a of unplanned) console.log(`  ${a.slug}\n    ${a.title}`);
  console.log(
    `\nAdd a { slug, query, caption } for each to src/jobs/coverPhotoPlan.ts, ` +
      `then run: npm run backfill-cover-photos`
  );
  return unplanned.length;
}

async function main() {
  if (REPORT_ONLY) {
    reportUnplanned();
    return;
  }

  const plan = ONLY ? PHOTO_PLAN.filter((p) => ONLY.has(p.slug)) : PHOTO_PLAN;

  if (ONLY) {
    const unknown = [...ONLY].filter((s) => !PHOTO_PLAN.some((p) => p.slug === s));
    // Naming a slug that has no plan entry is a typo, not a no-op: carrying on
    // would report success having silently done nothing for it.
    if (unknown.length) {
      console.error(`No plan entry for: ${unknown.join(', ')}`);
      process.exitCode = 1;
      return;
    }
  }

  console.log(
    `backfillCoverPhotos: ${plan.length} planned${ONLY ? ` (of ${PHOTO_PLAN.length}, --only)` : ''}` +
      `${DRY_RUN ? ' (dry run - nothing will be written)' : ''}\n`
  );

  let written = 0;
  let unverified = 0;
  let skipped = 0;

  for (const entry of plan) {
    let photo: CommonsPhoto | null = null;
    try {
      photo = await resolve(entry);
    } catch (err) {
      console.log(`  ! ${entry.slug}: lookup failed - ${(err as Error).message}`);
    }

    if (!photo) {
      console.log(`  - ${entry.slug}: no verifiable free photo, keeping abstract art`);
      unverified++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  ✓ ${entry.slug}\n      ${photo.title}  [${photo.license}]`);
      written++;
      continue;
    }

    const file = shardFor(entry.slug);
    if (!file) {
      console.log(`  ! ${entry.slug}: not found in any shard`);
      skipped++;
      continue;
    }

    if (insertCoverFields(file, entry.slug, photo, entry.position ?? 50)) {
      console.log(`  ✓ ${entry.slug} -> ${path.basename(file)}  [${photo.license}]`);
      written++;
    } else {
      console.log(`  - ${entry.slug}: already has a photo, or entry shape unrecognised`);
      skipped++;
    }
  }

  console.log(
    `\ndone: ${written} ${DRY_RUN ? 'verified' : 'written'}, ${unverified} with no free photo, ${skipped} skipped`
  );

  const outstanding = reportUnplanned();
  if (outstanding > 0) {
    console.log(`\n(${outstanding} of those are waiting on a photo choice, not on this script.)`);
  }
}

main().catch((err) => {
  console.error('backfillCoverPhotos failed:', err);
  process.exit(1);
});
