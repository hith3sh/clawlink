#!/usr/bin/env node
/**
 * Find Composio-backed integrations marked dashboardStatus="available" that
 * lack a working Composio auth config — either no COMPOSIO_<SLUG>_AUTH_CONFIG_ID
 * env entry, or the entry points at an auth config Composio rejects.
 *
 * These integrations should be marked "coming-soon" until their auth config is
 * fixed; otherwise the dashboard offers Connect on something the user can't
 * actually complete.
 *
 * Reads:
 *   - src/data/integrations.ts (via tsx import)
 *   - .env.local (env entries)
 *   - audit/auth-schemes.json (must be fresh; re-run import-composio-auth-schemes.mjs first)
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function envKeyForSlug(slug) {
  return `COMPOSIO_${slug.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase()}_AUTH_CONFIG_ID`;
}

function parseEnvFile(contents) {
  const env = {};
  for (const rawLine of contents.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim().replace(/^['"]|['"]$/gu, "");
    if (key) env[key] = value;
  }
  return env;
}

async function main() {
  const integrations = (await import("../src/data/integrations.ts")).integrations;
  const envContents = await fs.readFile(path.join(repoRoot, ".env.local"), "utf8");
  const env = parseEnvFile(envContents);
  const authRows = JSON.parse(
    await fs.readFile(path.join(repoRoot, "audit/auth-schemes.json"), "utf8"),
  );

  const validSlugs = new Set();
  const erroredSlugs = new Set();
  for (const row of authRows) {
    if (row.error || !row.authScheme) {
      erroredSlugs.add(row.slug);
    } else {
      validSlugs.add(row.slug);
      if (row.toolkitSlug) validSlugs.add(row.toolkitSlug);
    }
  }

  const composioAvailable = integrations.filter(
    (i) =>
      i.setupMode === "composio" &&
      i.dashboardStatus === "available",
  );

  const needsComingSoon = [];
  for (const integration of composioAvailable) {
    const envKey = envKeyForSlug(integration.slug);
    const envValue = (env[envKey] ?? "").trim();
    const envSlug = integration.slug.replace(/-/g, "_");
    const auditValid = validSlugs.has(envSlug) || validSlugs.has(integration.slug);
    const auditErrored = erroredSlugs.has(envSlug) || erroredSlugs.has(integration.slug);

    const reasons = [];
    if (!envValue) reasons.push(`no ${envKey} in .env.local`);
    if (envValue && auditErrored) reasons.push(`Composio returned 404 for the auth config (stale)`);
    if (envValue && !auditValid && !auditErrored) reasons.push(`not present in audit/auth-schemes.json — re-run the import script`);

    if (reasons.length > 0) {
      needsComingSoon.push({ slug: integration.slug, name: integration.name, reasons });
    }
  }

  needsComingSoon.sort((a, b) => a.slug.localeCompare(b.slug));

  console.log(`Composio integrations currently "available" in the dashboard: ${composioAvailable.length}`);
  console.log(`Integrations that should be flipped to "coming-soon": ${needsComingSoon.length}`);
  console.log("");
  for (const entry of needsComingSoon) {
    console.log(`  ${entry.slug.padEnd(26)}  ${entry.name}`);
    for (const reason of entry.reasons) {
      console.log(`    - ${reason}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
