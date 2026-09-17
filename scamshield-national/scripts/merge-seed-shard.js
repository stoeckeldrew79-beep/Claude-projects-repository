#!/usr/bin/env node
/**
 * Structure-aware git merge driver for the ScamShield seed-data shards.
 *
 * Why this exists
 * ---------------
 * The shard files are append-only from two independent writers (the content
 * routines on claude/scamshield-national-phase1, and the scheduled
 * generate-*.yml bots committing straight to main). A plain text merge sees
 * two appends at the same spot as a conflict, so .gitattributes used to mark
 * these files `merge=union`.
 *
 * union is line-based, and every entry is wrapped in the same boilerplate
 * ("{" ... "}," or "X.push({" ... "});"). When both sides append, the diff
 * matches that boilerplate as shared context and union emits ONE object
 * literal containing BOTH bodies, with every property duplicated. That is
 * what broke delivery on 2026-09-17: TS1117 ("An object literal cannot have
 * multiple properties with the same name") on four scams shards at once, and
 * 14 content commits stranded behind it.
 *
 * This driver merges by entry instead of by line, so "keep both appends" is
 * expressed structurally and can never interleave two entries. When it meets
 * anything it does not fully understand it exits non-zero, which makes git
 * record an ordinary conflict: a loud failure rather than a corrupt tree.
 *
 * Usage (as a git merge driver):
 *   git config merge.scamseed.name   "ScamShield seed-data shard merge"
 *   git config merge.scamseed.driver "node scamshield-national/scripts/merge-seed-shard.js %O %A %B %P"
 * with `merge=scamseed` in .gitattributes. If the driver is not configured,
 * git falls back to the default text merge, which conflicts instead of
 * corrupting, so an unconfigured checkout is safe, just noisier.
 */

'use strict';

const fs = require('fs');

function bail(why) {
  process.stderr.write('merge-seed-shard: ' + why + '\n');
  process.exit(1);
}

/**
 * Split a shard into an ordered list of chunks whose texts concatenate back
 * to the input exactly.
 *
 * A chunk is either {kind:'raw'} (imports, the `export const X = [` header,
 * the `];` that closes it, blank lines) or {kind:'entry'} carrying the
 * entry's slug and its zone: 'array' for an element of the exported array
 * literal, 'push' for an appended `X.push({ ... });`.
 *
 * The scan is character level and tracks strings, template literals and
 * comments, so a body paragraph that happens to start with a brace cannot be
 * mistaken for an entry boundary, and a `},];` line that closes both the last
 * entry and the array is split at the right character. parse() is verified by
 * round-tripping every shard byte for byte (npm run test:merge-driver).
 */
function parse(text) {
  const chunks = [];
  let rawStart = 0;
  let i = 0;
  let depth = 0;
  let atLineStart = true;

  const flushRaw = (end) => {
    if (end > rawStart) chunks.push({ kind: 'raw', text: text.slice(rawStart, end) });
  };

  while (i < text.length) {
    if (atLineStart) {
      const eol = text.indexOf('\n', i);
      const line = text.slice(i, eol === -1 ? text.length : eol);
      const trimmed = line.trim();
      const isArrayEntry = depth === 1 && trimmed === '{';
      const isPushEntry = depth === 0 && /^[A-Za-z_$][\w$]*\.push\(\{$/.test(trimmed);
      if (isArrayEntry || isPushEntry) {
        const end = entryEnd(text, i, depth);
        const body = text.slice(i, end);
        // Entries are written with single, double or backtick quotes, so all
        // three count. An interpolated slug would not be a stable identity,
        // so it is refused rather than guessed at.
        const m = body.match(/^\s*slug:\s*(['"`])((?:(?!\1)[^\\])*)\1\s*,\s*$/m);
        if (!m) bail('an entry has no plain-string slug, refusing to guess its identity');
        flushRaw(i);
        chunks.push({
          kind: 'entry',
          slug: m[2],
          zone: isPushEntry ? 'push' : 'array',
          text: body,
        });
        i = end;
        rawStart = end;
        atLineStart = text[i - 1] === '\n';
        continue;
      }
    }
    const step = advance(text, i, depth);
    atLineStart = text[i] === '\n';
    depth = step.depth;
    i = step.i;
  }
  flushRaw(text.length);
  return chunks;
}

/**
 * Consume one syntactic unit starting at i, returning the next index and the
 * bracket depth after it. Strings, template literals (including ${...}) and
 * comments are consumed whole so their contents never affect depth.
 */
function advance(text, i, depth) {
  const c = text[i];
  if (c === "'" || c === '"') {
    for (i++; i < text.length; i++) {
      if (text[i] === '\\') i++;
      else if (text[i] === c) break;
    }
    return { i: i + 1, depth };
  }
  if (c === '`') {
    for (i++; i < text.length; i++) {
      if (text[i] === '\\') i++;
      else if (text[i] === '`') break;
      else if (text[i] === '$' && text[i + 1] === '{') {
        let d = 1;
        i += 2;
        while (i < text.length && d > 0) {
          const step = advance(text, i, d);
          d = step.depth;
          i = step.i;
        }
        i--;
      }
    }
    return { i: i + 1, depth };
  }
  if (c === '/' && text[i + 1] === '/') {
    const eol = text.indexOf('\n', i);
    return { i: eol === -1 ? text.length : eol, depth };
  }
  if (c === '/' && text[i + 1] === '*') {
    const end = text.indexOf('*/', i + 2);
    return { i: end === -1 ? text.length : end + 2, depth };
  }
  if (c === '{' || c === '[' || c === '(') return { i: i + 1, depth: depth + 1 };
  if (c === '}' || c === ']' || c === ')') return { i: i + 1, depth: depth - 1 };
  return { i: i + 1, depth };
}

/**
 * Index just past the end of the entry that opens at `start`. The entry ends
 * where bracket depth returns to baseDepth, plus the trailing "," or ";" that
 * belongs to it. Anything further on that line (such as the array's own `];`)
 * stays outside the entry.
 */
function entryEnd(text, start, baseDepth) {
  let i = start;
  let depth = baseDepth;
  let opened = false;
  while (i < text.length) {
    const step = advance(text, i, depth);
    if (step.depth > depth) opened = true;
    depth = step.depth;
    i = step.i;
    if (opened && depth <= baseDepth) break;
  }
  if (!opened) bail('an entry never opened a brace');
  if (depth !== baseDepth) bail('an entry closed to an unexpected bracket depth');
  if (text[i] === ',' || text[i] === ';') i++;
  return i;
}

/** Reassemble chunks into file text. Round-trips parse() exactly. */
function render(chunks) {
  return chunks.map((c) => c.text).join('');
}

function entryMap(chunks, side) {
  const map = new Map();
  for (const c of chunks) {
    if (c.kind !== 'entry') continue;
    if (map.has(c.slug)) bail('duplicate slug "' + c.slug + '" in ' + side);
    map.set(c.slug, c);
  }
  return map;
}

/**
 * The file's scaffolding: its non-entry text, ignoring the blank lines and
 * indentation that merely separate entries. Appending an entry adds a
 * separator, so those have to be ignored or every append would look like a
 * scaffolding change.
 */
function skeleton(chunks) {
  return chunks
    .filter((c) => c.kind === 'raw')
    .map((c) => c.text.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n<<SEP>>\n');
}

const same = (a, b) => !!a && !!b && a.text === b.text;

/** The three cover-photo fields, the only ones both passes write independently. */
const COVER_FIELD = /^\s*coverImage(?:Credit|Position)?:/;

/**
 * The entry with its cover-photo block removed: the cover fields themselves,
 * plus any comment-only line sitting directly against them, since a note like
 * "representative photo, replace with an exact match if found" is part of the
 * photo choice rather than part of the entry's content.
 */
function withoutCoverFields(entry) {
  const lines = entry.text.split('\n');
  const isCover = lines.map((l) => COVER_FIELD.test(l));
  return lines
    .filter((l, i) => {
      if (isCover[i]) return false;
      const commentOnly = /^\s*\/\//.test(l);
      return !(commentOnly && (isCover[i - 1] || isCover[i + 1]));
    })
    .join('\n');
}

/**
 * Two photo passes run over the profiles and guides (this branch's
 * backfill-cover-photos job, and the content routines' own picks), so the
 * same entry can arrive with a different but equally valid photo on each
 * side. That is an editorial disagreement, not a merge error, and it must not
 * hold up unrelated content: when the ONLY difference is the cover fields,
 * keep the side already published and say so. Any other difference is still a
 * real conflict for a human.
 */
function coverOnlyDisagreement(eA, eB) {
  return (
    withoutCoverFields(eA) === withoutCoverFields(eB) &&
    eA.text !== eB.text
  );
}

function merge(oText, aText, bText) {
  const o = parse(oText);
  const a = parse(aText);
  const b = parse(bText);

  // The scaffolding is import lines and array syntax. Appends never touch it,
  // so if both sides changed it differently that is a genuine conflict for a
  // human, not something to merge entry by entry.
  const sO = skeleton(o);
  const sA = skeleton(a);
  const sB = skeleton(b);
  if (sA !== sB && sA !== sO && sB !== sO) bail('both sides changed the file scaffolding');
  const base = sA === sO && sB !== sO ? b : a;

  const mO = entryMap(o, 'the merge base');
  const mA = entryMap(a, 'our side');
  const mB = entryMap(b, 'their side');

  const resolved = new Map();
  for (const slug of new Set([...mA.keys(), ...mB.keys()])) {
    const eO = mO.get(slug);
    const eA = mA.get(slug);
    const eB = mB.get(slug);
    if (eA && eB) {
      if (same(eA, eB)) resolved.set(slug, eA);
      else if (same(eO, eA)) resolved.set(slug, eB); // only their side edited it
      else if (same(eO, eB)) resolved.set(slug, eA); // only our side edited it
      else if (coverOnlyDisagreement(eA, eB)) {
        const keep = base === a ? eA : eB;
        resolved.set(slug, keep);
        process.stderr.write(
          'merge-seed-shard: "' + slug + '" has a different cover photo on each side; ' +
            'keeping the published one\n'
        );
      } else bail('both sides edited entry "' + slug + '" differently');
    } else if (eA) {
      // Missing from their side: either new here, or they deleted it. A
      // delete is deliberate (a de-duplication), so honour it.
      if (!eO) resolved.set(slug, eA);
    } else if (!eO) {
      resolved.set(slug, eB);
    }
  }

  // Entries the base side does not carry are appends from the other side.
  // They go at the end of their own zone, so a pushed entry never lands
  // inside the array literal.
  const inBase = new Set(base.filter((c) => c.kind === 'entry').map((c) => c.slug));
  const tail = { array: [], push: [] };
  const seen = new Set();
  for (const slug of [...mA.keys(), ...mB.keys()]) {
    if (!resolved.has(slug) || inBase.has(slug) || seen.has(slug)) continue;
    seen.add(slug);
    const e = resolved.get(slug);
    if (!tail[e.zone]) bail('entry "' + slug + '" has an unknown zone');
    tail[e.zone].push(e);
  }

  const lastOf = (zone) => {
    let idx = -1;
    base.forEach((c, i) => {
      if (c.kind === 'entry' && c.zone === zone) idx = i;
    });
    return idx;
  };
  const lastArray = lastOf('array');
  if (tail.array.length && lastArray === -1) {
    bail('new array entries but no array zone to put them in');
  }
  const lastPush = lastOf('push');
  const pushTailAt = lastPush !== -1 ? lastPush : base.length - 1;

  const out = [];
  base.forEach((c, i) => {
    if (c.kind === 'raw') out.push(c.text);
    else if (resolved.has(c.slug)) out.push(resolved.get(c.slug).text);
    // Array elements sit flush against each other; pushed blocks are
    // separated by a blank line. Match each zone's own house style.
    if (i === lastArray) for (const e of tail.array) out.push('\n' + e.text);
    if (i === pushTailAt) for (const e of tail.push) out.push('\n\n' + e.text);
  });

  return out.join('');
}

function main() {
  const [oPath, aPath, bPath] = process.argv.slice(2);
  if (!oPath || !aPath || !bPath) bail('usage: merge-seed-shard.js %O %A %B [%P]');
  const read = (p) => fs.readFileSync(p, 'utf8');
  fs.writeFileSync(aPath, merge(read(oPath), read(aPath), read(bPath)));
}

if (require.main === module) main();

module.exports = { parse, render, merge };
