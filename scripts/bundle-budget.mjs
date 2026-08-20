#!/usr/bin/env node
/**
 * Bundle budget.
 *
 * Fails the build when the shipped JavaScript grows past an agreed ceiling, so
 * a regression is caught in review rather than discovered by a user on a slow
 * connection. Numbers are gzip, because that is what actually crosses the wire.
 *
 * Budgets are set a little above today's figures — tight enough to catch a
 * careless import, loose enough that ordinary feature work does not trip them.
 * Raise them deliberately, in a commit that says why.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist', 'assets');

const BUDGETS = {
  /** Everything the browser must have before the first route can render. */
  entryKB: 260,
  /** Total JS in dist — a proxy for "did something huge get added". */
  totalKB: 900,
  /** No single chunk should dominate. */
  largestChunkKB: 120,
};

async function gzipKB(path) {
  const buf = await readFile(path);
  return gzipSync(buf, { level: 9 }).length / 1024;
}

const files = (await readdir(DIST)).filter((f) => f.endsWith('.js'));
if (files.length === 0) {
  console.error('bundle-budget: no JS found in dist/assets — run `pnpm build` first.');
  process.exit(1);
}

const sized = [];
for (const f of files) {
  const p = join(DIST, f);
  if (!(await stat(p)).isFile()) continue;
  sized.push({ file: f, kb: await gzipKB(p) });
}
sized.sort((a, b) => b.kb - a.kb);

const total = sized.reduce((a, f) => a + f.kb, 0);
const largest = sized[0];

/** The entry graph: index + react + the i18n runtime are always fetched. */
const entryish = sized.filter((f) =>
  /^(index|react|useTranslation|common|rolldown-runtime)-/.test(f.file),
);
const entry = entryish.reduce((a, f) => a + f.kb, 0);

const rows = [
  ['entry (always fetched)', entry, BUDGETS.entryKB],
  ['total dist JS', total, BUDGETS.totalKB],
  [`largest chunk (${largest.file})`, largest.kb, BUDGETS.largestChunkKB],
];

let failed = false;
console.log('\nBundle budget (gzip)\n');
for (const [label, actual, budget] of rows) {
  const ok = actual <= budget;
  if (!ok) failed = true;
  const pct = Math.round((actual / budget) * 100);
  console.log(
    `  ${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(34)} ${actual.toFixed(1).padStart(7)} kB / ${String(budget).padStart(4)} kB  (${pct}%)`,
  );
}

console.log('\n  Top chunks:');
for (const f of sized.slice(0, 8)) {
  console.log(`    ${f.kb.toFixed(1).padStart(7)} kB  ${f.file}`);
}
console.log('');

if (failed) {
  console.error(
    'Bundle budget exceeded. Either trim the import that caused it, or raise\n' +
      'the budget in scripts/bundle-budget.mjs in a commit that explains why.\n',
  );
  process.exit(1);
}
