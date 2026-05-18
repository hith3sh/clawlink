#!/usr/bin/env node
/**
 * Fetch the auth_scheme of every Composio auth config we use, so we can stamp
 * each integration in src/data/integrations.ts with its real upstream auth
 * type (OAuth, API key, bearer token, etc.).
 *
 * Usage:
 *   node scripts/import-composio-auth-schemes.mjs
 *   node scripts/import-composio-auth-schemes.mjs --json out/auth-schemes.json
 *
 * Reads COMPOSIO_API_KEY and COMPOSIO_AUTH_CONFIG_MAP from .env.local /
 * .env.production / process.env.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const DEFAULT_BASE_URL = "https://backend.composio.dev/api/v3.1";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function parseEnvFile(contents) {
  const env = {};
  for (const rawLine of contents.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/gu, "");
    if (key) env[key] = value;
  }
  return env;
}

async function loadLocalEnv() {
  const merged = {};
  for (const candidate of [path.join(repoRoot, ".env.local"), path.join(repoRoot, ".env.production")]) {
    try {
      const contents = await fs.readFile(candidate, "utf8");
      Object.assign(merged, parseEnvFile(contents));
    } catch (error) {
      if (error && error.code === "ENOENT") continue;
      throw error;
    }
  }
  return merged;
}

function getEnvValue(env, key) {
  const processValue = typeof process.env[key] === "string" ? process.env[key].trim() : "";
  if (processValue) return processValue;
  const fileValue = typeof env[key] === "string" ? env[key].trim() : "";
  return fileValue || undefined;
}

function parseMap(raw) {
  const map = new Map();
  if (!raw) return map;
  for (const pair of raw.split(",")) {
    const [key, ...rest] = pair.split("=");
    const k = key?.trim();
    const v = rest.join("=").trim();
    if (k && v) map.set(k, v);
  }
  return map;
}

async function composioGet(apiKey, baseUrl, pathSuffix) {
  const url = `${baseUrl}${pathSuffix}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json", "x-api-key": apiKey },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Composio ${pathSuffix} → ${response.status}: ${text.slice(0, 300)}`);
  }
  return JSON.parse(text);
}

function extractAuthScheme(detail) {
  return (
    detail?.auth_scheme ??
    detail?.authScheme ??
    detail?.auth_config?.auth_scheme ??
    detail?.credentials?.auth_scheme ??
    null
  );
}

function discoverAuthConfigEnvEntries(envFile) {
  const merged = { ...envFile, ...process.env };
  const entries = [];
  const seen = new Set();
  for (const [key, rawValue] of Object.entries(merged)) {
    const match = key.match(/^COMPOSIO_(.+)_AUTH_CONFIG_ID$/u);
    if (!match) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    const value = typeof rawValue === "string" ? rawValue.trim().replace(/^['"]|['"]$/gu, "") : "";
    if (!value) continue;
    const envSlug = match[1].toLowerCase();
    entries.push({ envKey: key, envSlug, configId: value });
  }
  entries.sort((a, b) => a.envSlug.localeCompare(b.envSlug));
  return entries;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const envFile = await loadLocalEnv();
  const apiKey = getEnvValue(envFile, "COMPOSIO_API_KEY");
  const baseUrl = getEnvValue(envFile, "COMPOSIO_BASE_URL") ?? DEFAULT_BASE_URL;

  if (!apiKey) {
    console.error("COMPOSIO_API_KEY missing — set it in .env.local or env.");
    process.exit(1);
  }

  // Two ways to discover auth configs: a single COMPOSIO_AUTH_CONFIG_MAP env,
  // or per-integration COMPOSIO_<SLUG>_AUTH_CONFIG_ID entries. Combine both.
  const mapEntries = parseMap(getEnvValue(envFile, "COMPOSIO_AUTH_CONFIG_MAP"));
  const perSlugEntries = discoverAuthConfigEnvEntries(envFile);
  const combined = new Map();
  for (const [slug, id] of mapEntries.entries()) {
    combined.set(slug, { configId: id, envKey: "COMPOSIO_AUTH_CONFIG_MAP", envSlug: slug });
  }
  for (const entry of perSlugEntries) {
    if (!combined.has(entry.envSlug)) {
      combined.set(entry.envSlug, entry);
    }
  }

  if (combined.size === 0) {
    console.error("No Composio auth configs found in env (neither COMPOSIO_AUTH_CONFIG_MAP nor per-slug entries).");
    process.exit(1);
  }

  console.error(`Probing ${combined.size} auth configs...`);
  const rows = [];
  let probedFirst = false;
  for (const [slug, info] of combined.entries()) {
    try {
      const detail = await composioGet(apiKey, baseUrl, `/auth_configs/${encodeURIComponent(info.configId)}`);
      if (!probedFirst) {
        probedFirst = true;
        console.error("First auth config response keys:", Object.keys(detail).join(", "));
      }
      const scheme = extractAuthScheme(detail);
      const managed = Boolean(detail?.is_composio_managed);
      const toolkitSlug = detail?.toolkit?.slug ?? detail?.toolkit_slug ?? null;
      rows.push({ slug, envKey: info.envKey, configId: info.configId, authScheme: scheme, managed, toolkitSlug });
      console.error(`  ${slug.padEnd(28)}  ${String(scheme ?? "<unknown>").padEnd(20)}  ${managed ? "managed" : "byo"}  ${toolkitSlug ?? ""}`);
    } catch (error) {
      console.error(`  ${slug.padEnd(28)}  ERROR  ${error.message}`);
      rows.push({ slug, envKey: info.envKey, configId: info.configId, authScheme: null, managed: null, toolkitSlug: null, error: error.message });
    }
  }

  rows.sort((a, b) => a.slug.localeCompare(b.slug));

  if (args.json) {
    const outPath = path.resolve(repoRoot, args.json);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(rows, null, 2), "utf8");
    console.error(`\nWrote ${rows.length} rows to ${path.relative(repoRoot, outPath)}`);
  }

  console.log(JSON.stringify(rows, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
