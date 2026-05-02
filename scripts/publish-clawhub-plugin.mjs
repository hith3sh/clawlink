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
import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync } from "node:fs";
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

const manualOverrideFlagIndex = args.indexOf("--manual-override-reason");
const manualOverrideReason =
  manualOverrideFlagIndex >= 0 ? args[manualOverrideFlagIndex + 1] : null;

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

// ClawHub uploads everything in the plugin folder — move test files out
// temporarily so they don't trigger static-scan false positives.
const EXCLUDE_PATTERNS = [/\.test\.mjs$/, /\.test\.js$/, /\.spec\.mjs$/, /\.spec\.js$/];
const stashedFiles = [];
for (const entry of readdirSync(PLUGIN_DIR)) {
  if (EXCLUDE_PATTERNS.some((re) => re.test(entry))) {
    const src = resolve(PLUGIN_DIR, entry);
    const tmp = resolve(REPO_ROOT, `.clawhub-stash-${entry}`);
    renameSync(src, tmp);
    stashedFiles.push({ src, tmp });
  }
}

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
if (manualOverrideReason) {
  publishArgs.push("--manual-override-reason", manualOverrideReason);
}
publishArgs.push("--json");

// Debug: check if GitHub Actions OIDC env vars are available
const hasOidc = !!(process.env.ACTIONS_ID_TOKEN_REQUEST_URL && process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN);
console.log(`OIDC env available: ${hasOidc} (URL set: ${!!process.env.ACTIONS_ID_TOKEN_REQUEST_URL}, TOKEN set: ${!!process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN})`);

// Debug: attempt OIDC mint directly so we can see the real error
if (hasOidc && !manualOverrideReason) {
  try {
    const url = new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
    url.searchParams.set("audience", "clawhub");
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` },
    });
    const data = await resp.json();
    const oidcJwt = data.value;
    console.log(`OIDC JWT obtained: ${!!oidcJwt} (length: ${oidcJwt?.length ?? 0})`);

    // Try minting a publish token
    const mintResp = await fetch("https://clawhub.ai/api/v1/publish-token/mint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageName: CLAWHUB_NAME, version, githubOidcToken: oidcJwt }),
    });
    const mintText = await mintResp.text();
    console.log(`Mint response: ${mintResp.status} ${mintText.substring(0, 500)}`);
  } catch (e) {
    console.log(`OIDC debug error: ${e.message}`);
  }
}

console.log(`Args: npx ${publishArgs.join(" ")}`);

let exitCode = 0;
try {
  execFileSync("npx", ["--yes", ...publishArgs], { cwd: REPO_ROOT, stdio: "inherit" });
} catch (err) {
  exitCode = err.status ?? 1;
} finally {
  writeFileSync(PACKAGE_JSON_PATH, originalContents, "utf8");
  console.log(`Restored package.json name to "${NPM_NAME}".`);
  for (const { src, tmp } of stashedFiles) {
    if (existsSync(tmp)) {
      renameSync(tmp, src);
    }
  }
  if (stashedFiles.length > 0) {
    console.log(`Restored ${stashedFiles.length} stashed test file(s).`);
  }
}

process.exit(exitCode);
