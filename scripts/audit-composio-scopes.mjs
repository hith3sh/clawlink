#!/usr/bin/env node
/**
 * Composio scope-coverage audit.
 *
 * For each integration we ship in `src/generated/composio-manifests/*.generated.ts`,
 * compare:
 *   - the OAuth scopes enabled on each Composio auth_config we use for that toolkit
 *   - the scopes Composio's tool catalog claims each imported tool requires
 *
 * Output a Markdown report flagging tools whose required scopes are not in the
 * enabled set ("scope gap"). Those tools are likely to fail at runtime with a
 * provider scope error even though they appear in `clawlink_list_tools`.
 *
 * Usage:
 *   node scripts/audit-composio-scopes.mjs
 *   node scripts/audit-composio-scopes.mjs --integration figma
 *   node scripts/audit-composio-scopes.mjs --out audit/custom-name.md
 *
 * Reads COMPOSIO_API_KEY from .env.local / .env.production / process.env.
 *
 * Caveats this script intentionally does NOT solve:
 *   - Composio's per-tool `scopes` metadata is sometimes stale (e.g. claims a
 *     deprecated scope name like `files:read` even when the tool runs fine on
 *     the modern `file_content:read`). Treat the gap report as a candidate
 *     list, not a verdict — verify ambiguous cases with a real /tools/execute call.
 *   - Provider tier-gates (Enterprise-only scopes) look identical to Composio
 *     scope-coverage gaps in the diff. Cross-check the provider's scope docs
 *     before deciding whether to drop, BYO-migrate, or gate at runtime.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const generatedDir = path.join(repoRoot, "src/generated/composio-manifests");
const auditDir = path.join(repoRoot, "audit");

const DEFAULT_BASE_URL = "https://backend.composio.dev/api/v3.1";

// ---------------------------------------------------------------------------
// CLI / env
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Local manifest parsing
// ---------------------------------------------------------------------------

/**
 * Parse a `*.generated.ts` manifest and return:
 *   - integrationSlug (from the `integration: "..."` line in the factory)
 *   - imported toolSlugs (list of `toolSlug: "..."` strings)
 */
async function parseManifest(filePath) {
  const contents = await fs.readFile(filePath, "utf8");
  const integrationMatch = contents.match(/integration:\s*"([^"]+)"/u);
  const integrationSlug = integrationMatch?.[1] ?? path.basename(filePath, ".generated.ts");
  const toolSlugs = Array.from(contents.matchAll(/toolSlug:\s*"([^"]+)"/gu), (m) => m[1]);
  return { integrationSlug, toolSlugs, file: path.relative(repoRoot, filePath) };
}

async function listManifests() {
  const entries = await fs.readdir(generatedDir);
  const files = entries.filter((entry) => entry.endsWith(".generated.ts")).sort();
  const manifests = [];
  for (const file of files) {
    manifests.push(await parseManifest(path.join(generatedDir, file)));
  }
  return manifests;
}

// ---------------------------------------------------------------------------
// Composio API
// ---------------------------------------------------------------------------

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

async function fetchAllAuthConfigs(apiKey, baseUrl) {
  const items = [];
  let cursor = null;
  for (let page = 0; page < 20; page += 1) {
    const params = new URLSearchParams({ limit: "100" });
    if (cursor) params.set("cursor", cursor);
    const data = await composioGet(apiKey, baseUrl, `/auth_configs?${params.toString()}`);
    const pageItems = data.items ?? [];
    items.push(...pageItems);
    cursor = data.next_cursor ?? data.cursor ?? null;
    if (!cursor || pageItems.length === 0) break;
  }
  return items;
}

async function fetchToolkitTools(apiKey, baseUrl, toolkitSlug) {
  const params = new URLSearchParams({
    toolkit_slug: toolkitSlug,
    toolkit_versions: "latest",
    limit: "200",
    include_deprecated: "false",
  });
  const data = await composioGet(apiKey, baseUrl, `/tools?${params.toString()}`);
  return (data.items ?? []).map((item) => ({
    slug: item.slug,
    scopes: Array.isArray(item.scopes) ? item.scopes : [],
    deprecated: Boolean(item.deprecated),
  }));
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Scope hierarchy / superset rules
// ---------------------------------------------------------------------------
//
// Some providers (Google in particular) ship "full access" scopes that are
// supersets of granular scopes. Composio's tool metadata typically claims the
// granular form while a managed auth config often grants the superset. Naive
// set difference flags every tool as a gap when it's actually fine.
//
// SUPERSET_RULES[grantedScope] = [scopes implied by it]
//
// If a tool needs `X` and the auth config grants `Y` where X ∈ SUPERSET_RULES[Y],
// the tool is OK. Add new rules here as they're discovered while spot-checking.

const SUPERSET_RULES = {
  // Gmail full mailbox access — Google's docs explicitly list this as the
  // superset of all granular gmail.* scopes.
  // https://developers.google.com/gmail/api/auth/scopes
  "https://mail.google.com/": [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.insert",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://www.googleapis.com/auth/gmail.metadata",
    "https://www.googleapis.com/auth/gmail.settings.basic",
    "https://www.googleapis.com/auth/gmail.settings.sharing",
    "https://www.googleapis.com/auth/gmail.addons.current.action.compose",
  ],
  // Drive full access implies the granular and metadata variants.
  "https://www.googleapis.com/auth/drive": [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.metadata",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/drive.scripts",
  ],
  // Sheets full implies readonly.
  "https://www.googleapis.com/auth/spreadsheets": [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ],
  // Docs full implies readonly.
  "https://www.googleapis.com/auth/documents": [
    "https://www.googleapis.com/auth/documents.readonly",
  ],
  // Slides full implies readonly.
  "https://www.googleapis.com/auth/presentations": [
    "https://www.googleapis.com/auth/presentations.readonly",
  ],
  // Calendar full implies readonly + events.
  "https://www.googleapis.com/auth/calendar": [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.events.readonly",
  ],
  // Contacts full implies readonly + other.readonly.
  "https://www.googleapis.com/auth/contacts": [
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/contacts.other.readonly",
  ],
  // Slack-style: not currently covered. Add as needed.
};

function expandScopesWithSupersets(enabledScopes) {
  const expanded = new Set(enabledScopes);
  for (const granted of enabledScopes) {
    const implied = SUPERSET_RULES[granted];
    if (implied) for (const s of implied) expanded.add(s);
  }
  return expanded;
}

function categorizeGap(missingScopes) {
  // Best-effort labeling. The categorization is heuristic and intended to
  // help triage; always cross-check provider docs before acting on it.
  const flags = new Set();
  for (const scope of missingScopes) {
    const lower = scope.toLowerCase();
    if (
      lower.includes("variables") ||
      lower.includes("library_analytics") ||
      lower.startsWith("org:") ||
      lower.includes("activity_log") ||
      lower.includes("admin")
    ) {
      flags.add("likely_provider_tier_gate");
    }
    if (
      lower === "files:read" ||
      lower === "file_read" ||
      lower.includes("deprecated")
    ) {
      flags.add("possibly_stale_metadata");
    }
  }
  if (flags.size === 0) flags.add("composio_managed_scope_gap");
  return [...flags];
}

async function fetchAuthConfigDetail(apiKey, baseUrl, id) {
  const data = await composioGet(apiKey, baseUrl, `/auth_configs/${encodeURIComponent(id)}`);
  // Scopes live under credentials.scopes for OAuth configs (managed and BYO).
  // user_scopes is sometimes used for per-user-extra scopes; merge both.
  const credScopes = Array.isArray(data?.credentials?.scopes) ? data.credentials.scopes : [];
  const userScopes = Array.isArray(data?.credentials?.user_scopes) ? data.credentials.user_scopes : [];
  const topScopes = Array.isArray(data?.scopes) ? data.scopes : [];
  return Array.from(new Set([...credScopes, ...userScopes, ...topScopes]));
}

async function auditIntegration({ apiKey, baseUrl, manifest, authConfigsForToolkit }) {
  const toolkitSlug = manifest.integrationSlug;
  let toolkitTools;
  try {
    toolkitTools = await fetchToolkitTools(apiKey, baseUrl, toolkitSlug);
  } catch (error) {
    return {
      integration: manifest.integrationSlug,
      file: manifest.file,
      error: error instanceof Error ? error.message : String(error),
      authConfigs: [],
      perTool: [],
    };
  }

  const toolBySlug = new Map(toolkitTools.map((t) => [t.slug, t]));
  const importedSlugs = manifest.toolSlugs;

  // Bulk /auth_configs response omits `scopes`. Fetch the primary config detail
  // (the one with the most connections) to get its scopes. Skip detail-fetching
  // for the long tail of unused configs to keep the audit cheap.
  const sortedConfigs = authConfigsForToolkit
    .slice()
    .sort((a, b) => Number(b.no_of_connections ?? 0) - Number(a.no_of_connections ?? 0));
  const primary = sortedConfigs[0] ?? null;
  let primaryScopes = [];
  if (primary?.id) {
    try {
      primaryScopes = await fetchAuthConfigDetail(apiKey, baseUrl, primary.id);
    } catch (error) {
      // Non-fatal — fall through with empty scope set; the report flags every tool
      // as scope_gap, which is the correct signal that we couldn't read scopes.
      console.error(`    (warn: could not load scopes for ${primary.id}: ${error.message})`);
    }
  }

  const authConfigSummaries = sortedConfigs.map((cfg) => ({
    id: cfg.id,
    name: cfg.name,
    isComposioManaged: Boolean(cfg.is_composio_managed),
    scopes: cfg.id === primary?.id ? primaryScopes : null, // null = not fetched
    connectionCount: Number(cfg.no_of_connections ?? 0),
  }));

  const enabledScopes = expandScopesWithSupersets(primaryScopes);

  // If the auth config declares zero OAuth scopes, the provider almost
  // certainly doesn't use OAuth scopes for authorization (e.g. Notion uses
  // per-page/database resource sharing; some providers use API keys with
  // implicit access). In that case Composio's per-tool `scopes` metadata is
  // descriptive at best and meaningless at worst — flagging everything as
  // a scope gap produces pure noise. Mark all tools as `not_scope_modeled`
  // so the report makes the situation legible instead of misleading.
  const noScopeModel = primaryScopes.length === 0 && Boolean(primary?.id);

  const perTool = importedSlugs.map((slug) => {
    const meta = toolBySlug.get(slug);
    if (!meta) {
      return { slug, status: "not_in_catalog", missing: [], category: [] };
    }
    if (noScopeModel) {
      return { slug, status: "not_scope_modeled", missing: [], category: [] };
    }
    if (meta.scopes.length === 0) {
      return { slug, status: "no_scopes_declared", missing: [], category: [] };
    }
    const missing = meta.scopes.filter((s) => !enabledScopes.has(s));
    if (missing.length === 0) {
      return { slug, status: "ok", missing: [], category: [] };
    }
    return {
      slug,
      status: "scope_gap",
      missing,
      category: categorizeGap(missing),
    };
  });

  return {
    integration: manifest.integrationSlug,
    file: manifest.file,
    importedToolCount: importedSlugs.length,
    catalogToolCount: toolkitTools.length,
    authConfigs: authConfigSummaries,
    primaryAuthConfigId: primary?.id ?? null,
    enabledScopeCount: enabledScopes.size,
    perTool,
  };
}

// ---------------------------------------------------------------------------
// Report rendering
// ---------------------------------------------------------------------------

function renderReport({ generatedAt, results }) {
  const lines = [];
  lines.push("# Composio scope-coverage audit");
  lines.push("");
  lines.push(`Generated: ${generatedAt}`);
  lines.push("");
  lines.push("## How to read this report");
  lines.push("");
  lines.push("- **scope_gap** — Composio's tool metadata claims this tool needs scopes that aren't enabled on the auth config. Likely fails at runtime. Verify by calling `POST /tools/execute/<slug>` directly with the Composio API key before acting.");
  lines.push("- **likely_provider_tier_gate** — the missing scope appears Enterprise/Org/admin-only. A BYO OAuth app probably won't help unless app owner + connecting user are both on the higher tier. Most often: drop.");
  lines.push("- **composio_managed_scope_gap** — the missing scope exists on the provider but Composio's managed OAuth client doesn't request it. BYO migration unlocks the tool.");
  lines.push("- **possibly_stale_metadata** — Composio claims a deprecated scope name (e.g. `files:read`). Tool often works fine on the modern scope we already have. Verify before dropping.");
  lines.push("- **no_scopes_declared** — Composio metadata lists no scopes for this specific tool. Usually means the tool either uses no OAuth scope, or Composio hasn't documented it. Treat as needs-verification.");
  lines.push("- **not_scope_modeled** — the integration's auth config declares zero OAuth scopes overall. The provider doesn't authorize via OAuth scopes (e.g. Notion grants per-page/database access on share; many API-key integrations have no scope concept at all). Composio's per-tool `scopes` metadata is descriptive only and should be ignored for this provider.");
  lines.push("- **not_in_catalog** — we imported a toolSlug that Composio's `/tools` endpoint no longer returns for `latest`. Likely renamed or removed upstream — drop or re-import.");
  lines.push("");

  // Summary table
  let totalGap = 0;
  let totalImported = 0;
  for (const r of results) {
    if (r.error) continue;
    const gapCount = r.perTool.filter((t) => t.status === "scope_gap").length;
    totalGap += gapCount;
    totalImported += r.importedToolCount;
  }
  lines.push("## Summary");
  lines.push("");
  lines.push(`Integrations audited: ${results.length}`);
  lines.push(`Total imported tools: ${totalImported}`);
  lines.push(`Total scope-gap tools: ${totalGap}`);
  lines.push("");
  lines.push("| Integration | Imported | Catalog | Auth configs | Scope gaps | Notes |");
  lines.push("| --- | ---: | ---: | ---: | ---: | --- |");
  for (const r of results) {
    if (r.error) {
      lines.push(`| ${r.integration} | — | — | — | — | error: ${r.error.replace(/\|/g, " ")} |`);
      continue;
    }
    const gapCount = r.perTool.filter((t) => t.status === "scope_gap").length;
    const notInCatalog = r.perTool.filter((t) => t.status === "not_in_catalog").length;
    const notes = [];
    if (notInCatalog > 0) notes.push(`${notInCatalog} not in catalog`);
    if (r.authConfigs.length === 0) notes.push("no auth config found");
    lines.push(
      `| \`${r.integration}\` | ${r.importedToolCount} | ${r.catalogToolCount} | ${r.authConfigs.length} | ${gapCount} | ${notes.join("; ") || "—"} |`,
    );
  }
  lines.push("");

  // Per-integration detail
  lines.push("## Per-integration detail");
  lines.push("");
  for (const r of results) {
    lines.push(`### \`${r.integration}\``);
    lines.push("");
    if (r.error) {
      lines.push(`Error fetching catalog: ${r.error}`);
      lines.push("");
      continue;
    }
    lines.push(`Manifest: \`${r.file}\``);
    lines.push("");
    if (r.authConfigs.length === 0) {
      lines.push(`No Composio auth_config found for toolkit \`${r.integration}\`. Tools cannot be audited until an auth config exists.`);
      lines.push("");
      continue;
    }
    lines.push(`Auth configs (most-used first):`);
    for (const cfg of r.authConfigs) {
      const managed = cfg.isComposioManaged ? "Managed" : "BYO";
      const scopesNote = cfg.scopes === null
        ? "scopes not fetched (non-primary)"
        : `${cfg.scopes.length} scopes`;
      lines.push(`- \`${cfg.id}\` "${cfg.name}" — ${managed}, ${cfg.connectionCount} connections, ${scopesNote}`);
    }
    lines.push("");
    lines.push(`Audited against primary auth config \`${r.primaryAuthConfigId}\` (${r.enabledScopeCount} scopes).`);
    lines.push("");

    const gaps = r.perTool.filter((t) => t.status === "scope_gap");
    const notInCatalog = r.perTool.filter((t) => t.status === "not_in_catalog");
    const noScopes = r.perTool.filter((t) => t.status === "no_scopes_declared");
    const notScopeModeled = r.perTool.filter((t) => t.status === "not_scope_modeled");
    const ok = r.perTool.filter((t) => t.status === "ok");

    if (notScopeModeled.length > 0) {
      lines.push(`Status: ${notScopeModeled.length} not_scope_modeled (auth config has 0 OAuth scopes — provider doesn't use OAuth scope authorization)`);
      lines.push("");
      continue;
    }

    lines.push(`Status: ${ok.length} ok, ${gaps.length} scope_gap, ${noScopes.length} no_scopes_declared, ${notInCatalog.length} not_in_catalog`);
    lines.push("");

    if (gaps.length > 0) {
      lines.push("**Scope gaps (likely fail at runtime):**");
      lines.push("");
      lines.push("| Tool | Missing scopes | Category |");
      lines.push("| --- | --- | --- |");
      for (const t of gaps) {
        lines.push(`| \`${t.slug}\` | ${t.missing.map((s) => `\`${s}\``).join(", ")} | ${t.category.join(", ")} |`);
      }
      lines.push("");
    }

    if (notInCatalog.length > 0) {
      lines.push("**Imported but not in current Composio catalog:**");
      lines.push("");
      for (const t of notInCatalog) lines.push(`- \`${t.slug}\``);
      lines.push("");
    }

    if (noScopes.length > 0) {
      lines.push(`**No scopes declared in metadata** (${noScopes.length} tools — verify with a real call before assuming OK):`);
      lines.push("");
      for (const t of noScopes) lines.push(`- \`${t.slug}\``);
      lines.push("");
    }
  }

  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = await loadLocalEnv();
  const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");
  const baseUrl = (getEnvValue(env, "COMPOSIO_BASE_URL") ?? DEFAULT_BASE_URL).replace(/\/+$/, "");

  if (!apiKey) {
    console.error("COMPOSIO_API_KEY is not set. Add it to .env.local or export it.");
    process.exit(1);
  }

  // Optional integration filter for fast iteration
  const integrationFilter = args.integration ? new Set(args.integration.split(",")) : null;

  // Manifests we ship
  const allManifests = await listManifests();
  const manifests = integrationFilter
    ? allManifests.filter((m) => integrationFilter.has(m.integrationSlug))
    : allManifests;

  console.error(`Auditing ${manifests.length} integration manifest(s)…`);

  // All Composio auth configs in our project — group by toolkit slug
  console.error("Fetching auth configs from Composio…");
  const authConfigs = await fetchAllAuthConfigs(apiKey, baseUrl);
  const configsByToolkit = new Map();
  for (const cfg of authConfigs) {
    const toolkitSlug = (cfg.toolkit && cfg.toolkit.slug) || null;
    if (!toolkitSlug) continue;
    const existing = configsByToolkit.get(toolkitSlug) ?? [];
    existing.push(cfg);
    configsByToolkit.set(toolkitSlug, existing);
  }
  console.error(`Found ${authConfigs.length} auth configs across ${configsByToolkit.size} toolkits.`);

  // Walk integrations sequentially — Composio rate-limits aggressive parallel
  // /tools fetches on some plans. ~50ms per integration is fine at this scale.
  const results = [];
  for (const manifest of manifests) {
    process.stderr.write(`  ${manifest.integrationSlug}… `);
    const authConfigsForToolkit = configsByToolkit.get(manifest.integrationSlug) ?? [];
    try {
      const result = await auditIntegration({
        apiKey,
        baseUrl,
        manifest,
        authConfigsForToolkit,
      });
      results.push(result);
      const gapCount = result.perTool.filter((t) => t.status === "scope_gap").length;
      console.error(`${result.importedToolCount} imported, ${gapCount} scope_gap`);
    } catch (error) {
      results.push({
        integration: manifest.integrationSlug,
        file: manifest.file,
        error: error instanceof Error ? error.message : String(error),
        perTool: [],
        authConfigs: [],
      });
      console.error(`ERROR: ${error instanceof Error ? error.message : error}`);
    }
  }

  const generatedAt = new Date().toISOString();
  const datestamp = generatedAt.slice(0, 10);
  const outPath = args.out
    ? path.resolve(repoRoot, args.out)
    : path.join(auditDir, `composio-scopes-${datestamp}.md`);

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const report = renderReport({ generatedAt, results });
  await fs.writeFile(outPath, report, "utf8");

  // Console summary
  const totalGaps = results.reduce(
    (n, r) => n + (r.perTool ? r.perTool.filter((t) => t.status === "scope_gap").length : 0),
    0,
  );
  const errored = results.filter((r) => r.error).length;
  console.error("");
  console.error(`Report written to ${path.relative(repoRoot, outPath)}`);
  console.error(`${results.length} integrations audited, ${totalGaps} scope_gap tools flagged, ${errored} errored.`);
}

main().catch((error) => {
  console.error("audit-composio-scopes failed:", error);
  process.exit(1);
});
