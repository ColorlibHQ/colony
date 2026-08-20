#!/usr/bin/env node
/**
 * Scaffolder for Colony.
 *
 * Zero dependencies on purpose: `npm create` runs this before the user has
 * agreed to anything, so it should not pull a prompt library and a colour
 * library down first. Everything here is Node built-ins.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { mkdtemp, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, argv, exit } from 'node:process';

const REPO = 'https://github.com/ColorlibHQ/colony.git';

const ESC = '[';
/** Only emit colour when the output is a terminal — piped logs stay readable. */
const tty = stdout.isTTY;
const paint = (code, s) => (tty ? `${ESC}${code}m${s}${ESC}0m` : s);
const bold = (s) => paint('1', s);
const dim = (s) => paint('2', s);
const red = (s) => paint('31', s);
const green = (s) => paint('32', s);

function fail(message, hint) {
  console.error(`\n${red('x')} ${message}`);
  if (hint) console.error(`  ${dim(hint)}`);
  exit(1);
}

/**
 * npm rejects some names outright; catching it here beats a confusing failure
 * at the user's first `npm install`.
 */
function validateName(name) {
  if (!name) return 'A project name is required.';
  if (name.length > 214)
    return 'Name is longer than npm allows (214 characters).';
  if (name.startsWith('.') || name.startsWith('_'))
    return 'Name cannot start with a dot or underscore.';
  if (!/^[a-z0-9._@/-]+$/.test(name))
    return 'Use lowercase letters, digits, dashes, dots or underscores.';
  return null;
}

function detectPackageManager() {
  const ua = process.env.npm_config_user_agent ?? '';
  if (ua.startsWith('pnpm')) return 'pnpm';
  if (ua.startsWith('yarn')) return 'yarn';
  if (ua.startsWith('bun')) return 'bun';
  return 'npm';
}

function hasGit() {
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log(
    `\n${bold('Colony')} ${dim('- Ant Design admin, without the lock-in')}\n`,
  );

  let target = argv[2];
  if (!target) {
    const rl = createInterface({ input: stdin, output: stdout });
    target =
      (await rl.question(`${bold('Project name')} ${dim('(colony-admin)')} `))
        .trim() || 'colony-admin';
    rl.close();
  }

  const dir = resolve(process.cwd(), target);
  const name = basename(dir);

  const invalid = validateName(name);
  if (invalid) fail(invalid);

  if (existsSync(dir)) {
    fail(
      `${target} already exists.`,
      'Choose another name, or remove the directory first.',
    );
  }
  if (!hasGit()) {
    fail('git is required to fetch the template.', 'Install git and try again.');
  }

  console.log(`\n${dim('Fetching template...')}`);

  // Clone to a temp dir, then copy only what a project needs. Cloning straight
  // into the target would leave the user with our git history and our CI.
  const tmp = await mkdtemp(join(tmpdir(), 'colony-'));
  try {
    execFileSync('git', ['clone', '--depth', '1', '--quiet', REPO, tmp], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
  } catch {
    await rm(tmp, { recursive: true, force: true });
    fail(
      'Could not clone the template.',
      `Check your network, or clone manually: git clone ${REPO}`,
    );
  }

  const EXCLUDE = new Set([
    '.git',
    '.github',
    'docs',
    'packages',
    'node_modules',
    'dist',
    'playwright-report',
    'test-results',
  ]);

  await cp(tmp, dir, {
    recursive: true,
    filter: (src) => {
      const rel = src.slice(tmp.length + 1);
      if (!rel) return true;
      return !EXCLUDE.has(rel.split('/')[0]);
    },
  });
  await rm(tmp, { recursive: true, force: true });

  // Make the copy the user's own rather than a fork still wearing our name.
  const pkgPath = join(dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.name = name;
  pkg.version = '0.1.0';
  pkg.private = true;
  delete pkg.description;
  delete pkg.keywords;
  delete pkg.homepage;
  delete pkg.repository;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  for (const f of ['README.zh-CN.md', 'CHANGELOG.md']) {
    rmSync(join(dir, f), { force: true });
  }

  const pm = detectPackageManager();
  const run = pm === 'npm' ? 'npm run' : pm;

  console.log(`\n${green('ok')} Created ${bold(name)}\n`);
  console.log(`  ${dim('cd')} ${target}`);
  console.log(`  ${dim(pm)} install`);
  console.log(`  ${dim(run)} dev\n`);
  console.log(`  ${dim('Docs:')} https://colony.colorlib.com\n`);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
