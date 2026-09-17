#!/usr/bin/env node
/**
 * Tests for the seed-data merge driver.
 *
 * The driver is only trustworthy if its parser understands the shards
 * exactly, so the main test is a byte-for-byte round trip: every shard file
 * given on the command line (or every shard in the working tree by default)
 * must survive parse() -> render() unchanged. A single byte of drift means
 * the parser is guessing, and the driver must not be used.
 *
 * Run: node scripts/test-merge-seed-shard.js [file ...]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { parse, render, merge } = require('./merge-seed-shard');

let failures = 0;
const ok = (msg) => console.log('  ok   ' + msg);
const fail = (msg) => {
  console.log('  FAIL ' + msg);
  failures++;
};

function shardFiles() {
  const root = path.join(__dirname, '..', 'backend', 'src', 'db', 'seed-data');
  const out = [];
  for (const dir of ['scams', 'notorious', 'guides']) {
    const d = path.join(root, dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      if (f.endsWith('.ts') && f !== 'index.ts') out.push(path.join(d, f));
    }
  }
  return out;
}

console.log('round trip (parse -> render must be byte-identical)');
const files = process.argv.slice(2).length ? process.argv.slice(2) : shardFiles();
if (!files.length) fail('no shard files found to test');
let entryTotal = 0;
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const chunks = parse(text);
  const entries = chunks.filter((c) => c.kind === 'entry').length;
  entryTotal += entries;
  if (render(chunks) === text) ok(path.basename(f) + ' (' + entries + ' entries)');
  else fail(path.basename(f) + ' did not round trip');
  if (!entries) fail(path.basename(f) + ' parsed to zero entries');
}
console.log('  ' + entryTotal + ' entries parsed across ' + files.length + ' files');

// Synthetic merges. These are the shapes the driver exists to handle.
const base = [
  "import { SeedScam } from '../types';",
  '',
  'export const Demo: SeedScam[] = [',
  '{',
  "    name: 'One',",
  "    slug: 'one',",
  '  },',
  '];',
  '',
].join('\n');

const withA = base.replace(
  '];',
  ['{', "    name: 'Two',", "    slug: 'two',", '  },', '];'].join('\n')
);
const withB = base.replace(
  '];',
  ['{', "    name: 'Three',", "    slug: 'three',", '  },', '];'].join('\n')
);

console.log('both sides append a different array entry');
{
  const out = merge(base, withA, withB);
  const slugs = parse(out).filter((c) => c.kind === 'entry').map((c) => c.slug);
  if (slugs.join(',') === 'one,two,three') ok('kept both, in order: ' + slugs.join(', '));
  else fail('expected one,two,three but got ' + slugs.join(','));
  const dupes = out.match(/^\s*name:/gm).length !== 3;
  if (dupes) fail('property count is wrong, entries were interleaved');
  else ok('no interleaving: one name per entry');
}

console.log('both sides append a different push entry');
{
  const pushOf = (slug) =>
    ['', 'Demo.push({', "  name: '" + slug + "',", "  slug: '" + slug + "',", '});', ''].join('\n');
  const out = merge(base, base + pushOf('two'), base + pushOf('three'));
  const entries = parse(out).filter((c) => c.kind === 'entry');
  const slugs = entries.map((c) => c.slug);
  if (slugs.join(',') === 'one,two,three') ok('kept both: ' + slugs.join(', '));
  else fail('expected one,two,three but got ' + slugs.join(','));
  if (entries.filter((e) => e.zone === 'push').length === 2) ok('both landed in the push zone');
  else fail('a pushed entry did not land in the push zone');
}

console.log('one side appends, the other edits an existing entry');
{
  const edited = base.replace("    name: 'One',", "    name: 'One',\n    coverImage: 'x',");
  const out = merge(base, edited, withB);
  if (out.includes("coverImage: 'x'")) ok('kept the edit');
  else fail('lost the edit');
  if (out.includes("slug: 'three'")) ok('kept the append');
  else fail('lost the append');
}

console.log('a template-literal body containing a bare brace line');
{
  const tricky = base.replace(
    "    slug: 'one',",
    ["    slug: 'one',", '    body: `text', '{', 'more text`,'].join('\n')
  );
  const entries = parse(tricky).filter((c) => c.kind === 'entry');
  if (entries.length === 1) ok('brace inside a template literal is not an entry boundary');
  else fail('parsed ' + entries.length + ' entries, expected 1');
  if (render(parse(tricky)) === tricky) ok('round trips');
  else fail('did not round trip');
}

console.log('a cover-photo-only disagreement resolves to the published side');
{
  const withPhoto = (url) =>
    base.replace("    slug: 'one',", "    slug: 'one',\n    coverImage: '" + url + "',");
  const out = merge(base, withPhoto('ours.jpg'), withPhoto('theirs.jpg'));
  if (out.includes('ours.jpg') && !out.includes('theirs.jpg')) ok('kept our photo');
  else fail('did not keep the published photo');
  if (out.match(/coverImage:/g).length === 1) ok('exactly one coverImage');
  else fail('duplicated the cover fields');
}

console.log('a cover-photo disagreement PLUS a body change is still a conflict');
{
  const a2 = base.replace("    slug: 'one',", "    slug: 'one',\n    coverImage: 'ours.jpg',");
  const b2 = base
    .replace("    slug: 'one',", "    slug: 'one',\n    coverImage: 'theirs.jpg',")
    .replace("name: 'One'", "name: 'Renamed'");
  const child = require('child_process');
  const os = require('os');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mergetest2-'));
  const w = (n, t) => {
    const p = path.join(dir, n);
    fs.writeFileSync(p, t);
    return p;
  };
  const r = child.spawnSync(process.execPath, [
    path.join(__dirname, 'merge-seed-shard.js'),
    w('o.ts', base),
    w('a.ts', a2),
    w('b.ts', b2),
  ]);
  if (r.status !== 0) ok('refused: the difference is not only the photo');
  else fail('merged a conflict that went beyond the cover fields');
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log('conflicting edits to the same entry must refuse to merge');
{
  const child = require('child_process');
  const os = require('os');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mergetest-'));
  const w = (n, t) => {
    const p = path.join(dir, n);
    fs.writeFileSync(p, t);
    return p;
  };
  const o = w('o.ts', base);
  const a = w('a.ts', base.replace("name: 'One'", "name: 'Ours'"));
  const b = w('b.ts', base.replace("name: 'One'", "name: 'Theirs'"));
  const r = child.spawnSync(process.execPath, [path.join(__dirname, 'merge-seed-shard.js'), o, a, b]);
  if (r.status !== 0) ok('exited non-zero so git records a conflict');
  else fail('silently merged a real conflict');
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log(failures ? '\n' + failures + ' check(s) FAILED' : '\nall checks passed');
process.exit(failures ? 1 : 0);
