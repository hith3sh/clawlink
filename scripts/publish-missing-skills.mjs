#!/usr/bin/env node
/**
 * Batch-publish missing ClawLink skills to ClawHub.
 *
 * Usage:
 *   node scripts/publish-missing-skills.mjs
 *
 * Reads clawhub-skills/ directories and publishes any that don't
 * already exist on ClawHub under the authenticated account.
 */

import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SKILLS_DIR = "/Users/hithesh/clawlink/clawhub-skills";
const CLAWHUB_TOKEN = process.env.CLAWHUB_TOKEN;

if (!CLAWHUB_TOKEN) {
  console.error("Need CLAWHUB_TOKEN in env");
  process.exit(1);
}

function getDisplayName(skillPath) {
  const md = readFileSync(join(skillPath, "SKILL.md"), "utf-8");
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : skillPath.split("/").pop();
}

function existsOnClawHub(slug) {
  try {
    const out = execSync(`clawhub package inspect ${slug}`, {
      encoding: "utf-8",
      env: { ...process.env, CLAWHUB_TOKEN },
      timeout: 15000,
    });
    return out.includes("Owner: hith3sh");
  } catch {
    return false;
  }
}

function publishSkill(slug, displayName) {
  const skillPath = join(SKILLS_DIR, slug);
  const args = [
    "skill", "publish", skillPath,
    "--slug", slug,
    "--name", displayName,
    "--version", "0.1.0",
  ];
  // quote any arg containing spaces or shell-special chars
  const cmd = "clawhub " + args.map((a) => {
    if (/[\s'"()&|;<>$`]/.test(a)) return '"' + a.replace(/"/g, '\\"') + '"';
    return a;
  }).join(" ");

  try {
    const out = execSync(cmd, {
      encoding: "utf-8",
      env: { ...process.env, CLAWHUB_TOKEN },
      timeout: 30000,
    });
    return { ok: true, output: out };
  } catch (err) {
    return { ok: false, output: err.stdout || "", error: err.stderr || err.message };
  }
}

async function main() {
  const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name)
    .sort();

  console.log(`Found ${dirs.length} local skill directories\n`);

  const missing = [];
  for (const slug of dirs) {
    process.stdout.write(`Checking ${slug} … `);
    if (existsOnClawHub(slug)) {
      console.log("ALREADY EXISTS");
    } else {
      console.log("MISSING");
      missing.push(slug);
    }
  }

  console.log(`\n${missing.length} skills need publishing:\n${missing.join("\n")}\n`);

  const success = [];
  const failed = [];

  for (const slug of missing) {
    const skillPath = join(SKILLS_DIR, slug);
    const displayName = getDisplayName(skillPath);
    console.log(`\nPublishing: ${slug} (name: "${displayName}") …`);
    const result = publishSkill(slug, displayName);
    if (result.ok) {
      console.log("  ✅ SUCCESS");
      success.push(slug);
    } else {
      console.log("  ❌ FAILED");
      console.log("   ", result.error || result.output);
      failed.push(slug);
    }
    // small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n=== DONE ===`);
  console.log(`Success: ${success.length}`);
  console.log(`Failed:  ${failed.length}`);
  if (failed.length) {
    console.log(`\nFailed slugs:`);
    failed.forEach((s) => console.log(`  - ${s}`));
  }
}

main();
