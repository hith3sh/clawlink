#!/usr/bin/env node
// Publish the OpenClaw plugin to ClawHub under the name "clawlink-plugin".
//
// ClawHub requires `package.json` `name` to equal the published name. We keep
// the npm name as "@useclawlink/openclaw-plugin" but publish to ClawHub as
// "clawlink-plugin". This script swaps the name field in place, runs
// `clawhub package publish`, then restores the original name regardless of
// outcome.
//
// Usage:
//   node scripts/publish-clawhub-plugin.mjs [--dry-run] [--commit <sha>]
//
// If --commit is omitted, uses `git rev-parse HEAD`.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const PLUGIN_DIR = resolve(REPO_ROOT, "packages/openclaw-clawlink");
const PACKAGE_JSON_PATH = resolve(PLUGIN_DIR, "package.json");

const NPM_NAME = "@useclawlink/openclaw-plugin";
const CLAWHUB_NAME = "clawlink-plugin";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const commitFlagIndex = args.indexOf("--commit");
const commit =
  commitFlagIndex >= 0
    ? args[commitFlagIndex + 1]
    : execFileSync("git", ["rev-parse", "HEAD"], { cwd: REPO_ROOT })
        .toString()
        .trim();

if (!commit || !/^[0-9a-f]{40}$/i.test(commit)) {
  console.error(`Invalid commit sha: ${commit}`);
  process.exit(1);
}

const originalContents = readFileSync(PACKAGE_JSON_PATH, "utf8");
const pkg = JSON.parse(originalContents);

if (pkg.name !== NPM_NAME) {
  console.error(
    `Expected package.json name to be "${NPM_NAME}" before swap, got "${pkg.name}". Aborting.`,
  );
  process.exit(1);
}

const version = pkg.version;
console.log(`Publishing ${CLAWHUB_NAME}@${version} (commit ${commit})`);

const swapped = { ...pkg, name: CLAWHUB_NAME };
writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(swapped, null, 2) + "\n", "utf8");

const publishArgs = [
  "clawhub",
  "package",
  "publish",
  PLUGIN_DIR,
  "--family",
  "code-plugin",
  "--display-name",
  "ClawLink",
  "--version",
  version,
  "--source-repo",
  "hith3sh/clawlink",
  "--source-commit",
  commit,
  "--source-path",
  "packages/openclaw-clawlink",
];
if (dryRun) publishArgs.push("--dry-run");

let exitCode = 0;
try {
  execFileSync("npx", publishArgs, { cwd: REPO_ROOT, stdio: "inherit" });
} catch (err) {
  exitCode = err.status ?? 1;
} finally {
  writeFileSync(PACKAGE_JSON_PATH, originalContents, "utf8");
  console.log(`Restored package.json name to "${NPM_NAME}".`);
}

process.exit(exitCode);
