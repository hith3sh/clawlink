import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SKILLS_DIR = "/Users/hithesh/clawlink/clawhub-skills";
const CLAWHUB_TOKEN = process.env.CLAWHUB_TOKEN;

if (!CLAWHUB_TOKEN) {
  console.error("Need CLAWHUB_TOKEN in env");
  process.exit(1);
}

// Skipped: integrations we don't actually support
const SKIP_SLUGS = new Set(["twitter-posts", "stripe-payments"]);

// Renames for slug conflicts (local slug -> published slug)
const RENAME_MAP = {
  "notion-workspace": { slug: "clawlink-notion", name: "Notion by ClawLink" },
  "shopify-store": { slug: "clawlink-shopify", name: "Shopify by ClawLink" },
  "slack-messaging": { slug: "clawlink-slack", name: "Slack by ClawLink" },
  "youtube-channel": { slug: "clawlink-youtube", name: "YouTube by ClawLink" },
};

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

function publishSkill(localSlug, publishSlug, displayName) {
  const skillPath = join(SKILLS_DIR, localSlug);
  const args = [
    "skill", "publish", skillPath,
    "--slug", publishSlug,
    "--name", displayName,
    "--version", "0.1.0",
  ];
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

  const missing = [];
  for (const slug of dirs) {
    if (SKIP_SLUGS.has(slug)) continue;

    const publishSlug = RENAME_MAP[slug]?.slug || slug;
    process.stdout.write(`Checking ${slug} (publish as ${publishSlug}) … `);

    if (existsOnClawHub(publishSlug)) {
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
    const displayName = RENAME_MAP[slug]?.name || getDisplayName(skillPath);
    const publishSlug = RENAME_MAP[slug]?.slug || slug;

    console.log(`\nPublishing: ${slug} → ${publishSlug} (name: "${displayName}") …`);
    const result = publishSkill(slug, publishSlug, displayName);
    if (result.ok) {
      console.log("  ✅ SUCCESS");
      success.push({ local: slug, published: publishSlug });
    } else {
      console.log("  ❌ FAILED");
      console.log("   ", result.error || result.output);
      failed.push({ local: slug, published: publishSlug, reason: result.error || result.output });
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n=== DONE ===`);
  console.log(`Success: ${success.length}`);
  console.log(`Failed:  ${failed.length}`);

  if (success.length) {
    console.log(`\nPublished:`);
    success.forEach((s) => console.log(`  ✅ ${s.local} → ${s.published}`));
  }

  if (failed.length) {
    console.log(`\nFailed:`);
    failed.forEach((f) => console.log(`  ❌ ${f.local} → ${f.published}`));
  }

  // Save failed list for retry
  if (failed.length) {
    const failedSlugs = failed.map((f) => f.local);
    console.log(`\nTo retry later, run:\n  export CLAWHUB_TOKEN=...\n  node scripts/publish-remaining-skills.mjs`);
  }
}

main();
