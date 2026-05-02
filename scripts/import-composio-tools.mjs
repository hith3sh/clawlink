import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const generatedDir = path.join(repoRoot, "src/generated/composio-manifests");
const indexPath = path.join(generatedDir, "index.ts");

const DEFAULT_BASE_URL = "https://backend.composio.dev/api/v3.1";

// ---------------------------------------------------------------------------
// CLI arg parsing
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

function safeTrim(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

// ---------------------------------------------------------------------------
// Env loading
// ---------------------------------------------------------------------------

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
  const candidates = [
    path.join(repoRoot, ".env.local"),
    path.join(repoRoot, ".env.production"),
  ];

  for (const candidate of candidates) {
    try {
      const contents = await fs.readFile(candidate, "utf8");
      Object.assign(merged, parseEnvFile(contents));
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") continue;
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

// ---------------------------------------------------------------------------
// Composio API client
// ---------------------------------------------------------------------------

async function fetchComposioTools(apiKey, toolkitSlug, baseUrl) {
  const url = new URL(`${baseUrl}/tools`);
  url.searchParams.set("toolkit_slug", toolkitSlug);
  url.searchParams.set("toolkit_versions", "latest");
  url.searchParams.set("limit", "1000");
  url.searchParams.set("include_deprecated", "true");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Composio API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  return data;
}

// ---------------------------------------------------------------------------
// Mode / risk classification
// ---------------------------------------------------------------------------

// Composio tags that map directly to mode/risk.
const HINT_TAG_READ = "readOnlyHint";
const HINT_TAG_CREATE = "createHint";
const HINT_TAG_UPDATE = "updateHint";
const HINT_TAG_DESTRUCTIVE = "destructiveHint";
const HINT_TAG_IDEMPOTENT = "idempotentHint";

// Slug-based fallback patterns when Composio doesn't provide hint tags.
const READ_SLUG_PATTERNS = /(?:^|_)(?:GET|LIST|COUNT|CHECK|EXPORT|SEARCH|FIND|ENUM|STATUS|ANALYTICS|STATS|VITALS|OVERVIEW)(?:_|$)/i;
const DESTRUCTIVE_SLUG_PATTERNS = /(?:^|_)(?:DELETE|REMOVE)(?:_|$)/i;

function classifyTool(composioTool) {
  const tags = new Set(composioTool.tags ?? []);
  const slug = composioTool.slug ?? "";

  // Use Composio hint tags first.
  // ToolRisk type is "safe" | "confirm" | "high_impact".
  if (tags.has(HINT_TAG_DESTRUCTIVE)) {
    return { mode: "write", risk: "high_impact" };
  }

  if (tags.has(HINT_TAG_READ)) {
    return { mode: "read", risk: "safe" };
  }

  if (tags.has(HINT_TAG_CREATE) || tags.has(HINT_TAG_UPDATE)) {
    return { mode: "write", risk: "confirm" };
  }

  // Fallback: slug pattern matching.
  if (READ_SLUG_PATTERNS.test(slug)) {
    return { mode: "read", risk: "safe" };
  }

  if (DESTRUCTIVE_SLUG_PATTERNS.test(slug)) {
    return { mode: "write", risk: "high_impact" };
  }

  // Default to write/confirm.
  return { mode: "write", risk: "confirm" };
}

// ---------------------------------------------------------------------------
// Input schema conversion
// ---------------------------------------------------------------------------

function convertInputSchema(inputParams) {
  if (!inputParams || typeof inputParams !== "object") {
    return { type: "object", additionalProperties: true, properties: {} };
  }

  const properties = {};
  const required = [];

  const rawProps = inputParams.properties ?? {};

  for (const [name, prop] of Object.entries(rawProps)) {
    const schema = {};
    const propType = prop.type;

    if (propType === "array") {
      schema.type = "array";
      if (prop.items) {
        schema.items = simplifySchemaNode(prop.items);
      } else {
        schema.items = { type: "object", additionalProperties: true };
      }
    } else if (propType === "object") {
      schema.type = "object";
      schema.additionalProperties = true;
      if (prop.properties) {
        schema.properties = {};
        for (const [nestedName, nestedProp] of Object.entries(prop.properties)) {
          schema.properties[nestedName] = simplifySchemaNode(nestedProp);
        }
      }
    } else if (propType === "integer") {
      schema.type = "integer";
    } else if (propType === "number") {
      schema.type = "number";
    } else if (propType === "boolean") {
      schema.type = "boolean";
    } else {
      schema.type = "string";
    }

    if (prop.description) {
      schema.description = prop.description;
    }

    if (prop.enum) {
      schema.enum = prop.enum;
    }

    properties[name] = schema;
  }

  if (Array.isArray(inputParams.required)) {
    required.push(...inputParams.required);
  }

  const result = {
    type: "object",
    additionalProperties: true,
    properties,
  };

  if (required.length > 0) {
    result.required = required;
  }

  return result;
}

function simplifySchemaNode(node) {
  if (!node || typeof node !== "object") {
    return { type: "string" };
  }

  // Handle $ref by treating as flexible object.
  if (node.$ref) {
    return { type: "object", additionalProperties: true };
  }

  const result = {};

  if (node.type === "array") {
    result.type = "array";
    result.items = node.items ? simplifySchemaNode(node.items) : { type: "object", additionalProperties: true };
  } else if (node.type === "object") {
    result.type = "object";
    result.additionalProperties = true;
    if (node.properties) {
      result.properties = {};
      for (const [k, v] of Object.entries(node.properties)) {
        result.properties[k] = simplifySchemaNode(v);
      }
    }
  } else if (node.type) {
    result.type = node.type;
  } else {
    result.type = "string";
  }

  if (node.description) result.description = node.description;
  if (node.enum) result.enum = node.enum;

  return result;
}

// ---------------------------------------------------------------------------
// Tool name derivation
// ---------------------------------------------------------------------------

function toClawlinkToolName(composioSlug) {
  // INSTANTLY_LIST_CAMPAIGNS → instantly_list_campaigns
  return composioSlug.toLowerCase();
}

function humanizeToolName(composioName) {
  // "List Campaigns" stays as-is. Used for askBefore prompts.
  return composioName ?? composioName;
}

// ---------------------------------------------------------------------------
// askBefore generation
// ---------------------------------------------------------------------------

function buildAskBefore(mode, risk, humanName) {
  if (mode === "read") return [];

  if (risk === "high_impact") {
    return [`This action is destructive and cannot be undone. Confirm before executing ${humanName}.`];
  }

  return [`Confirm the parameters before executing ${humanName}.`];
}

// ---------------------------------------------------------------------------
// Tag generation
// ---------------------------------------------------------------------------

function buildTags(integration, mode, composioTags) {
  const tags = ["composio", integration];

  tags.push(mode === "read" ? "read" : "write");

  // Pull in Composio category tags (the non-hint ones).
  for (const tag of composioTags ?? []) {
    if (
      tag.endsWith("Hint") ||
      tag === "important" ||
      tag === "deprecated" ||
      tag === "openWorldHint"
    ) {
      continue;
    }

    const normalized = tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

    if (normalized && !tags.includes(normalized)) {
      tags.push(normalized);
    }
  }

  return tags;
}

// ---------------------------------------------------------------------------
// TypeScript source renderer
// ---------------------------------------------------------------------------

function indent(depth) {
  return "  ".repeat(depth);
}

function renderValue(value, depth = 0) {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";

    const items = value
      .map((item) => `${indent(depth + 1)}${renderValue(item, depth + 1)}`)
      .join(",\n");

    return `[\n${items},\n${indent(depth)}]`;
  }

  const entries = Object.entries(value).filter(([, v]) => v !== undefined);

  if (entries.length === 0) return "{}";

  const lines = entries
    .map(([key, v]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      return `${indent(depth + 1)}${safeKey}: ${renderValue(v, depth + 1)}`;
    })
    .join(",\n");

  return `{\n${lines},\n${indent(depth)}}`;
}

function renderToolCall(tool, depth = 1) {
  const obj = {};

  obj.name = tool.name;
  obj.description = tool.description;
  obj.toolSlug = tool.toolSlug;
  obj.mode = tool.mode;
  obj.risk = tool.risk;

  // inputSchema is intentionally omitted. It is fetched at runtime from
  // Composio's API and cached in KV. See src/lib/composio/schema-cache.ts.

  if (tool.tags && tool.tags.length > 0) {
    obj.tags = tool.tags;
  }

  if (tool.askBefore && tool.askBefore.length > 0) {
    obj.askBefore = tool.askBefore;
  }

  if (tool.idempotent !== undefined && tool.idempotent !== (tool.mode === "read")) {
    obj.idempotent = tool.idempotent;
  }

  return `${indent(depth)}composioTool(${renderValue(obj, depth)})`;
}

// ---------------------------------------------------------------------------
// File generation
// ---------------------------------------------------------------------------

function sanitizeFileSlug(value) {
  return value.replace(/[^a-z0-9-]+/giu, "-").replace(/^-+|-+$/gu, "");
}

function toPascalCase(value) {
  return value
    .split(/[^a-z0-9]+/iu)
    .filter(Boolean)
    .map((token) => token[0].toUpperCase() + token.slice(1))
    .join("");
}

function toCamelCase(value) {
  const pascal = toPascalCase(value);
  return pascal[0].toLowerCase() + pascal.slice(1);
}

function generateManifestSource(integration, composioToolkit, version, tools) {
  const exportName = `${toCamelCase(integration)}ComposioTools`;

  const toolEntries = tools
    .map((tool) => renderToolCall(tool, 1))
    .join(",\n");

  return `import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
    accessLevel?: IntegrationTool["accessLevel"];
    tags?: string[];
    whenToUse?: string[];
    askBefore?: string[];
    safeDefaults?: Record<string, unknown>;
    examples?: IntegrationTool["examples"];
    requiresScopes?: string[];
    idempotent?: boolean;
    supportsDryRun?: boolean;
    supportsBatch?: boolean;
    toolSlug: string;
  },
): IntegrationTool {
  return {
    integration: ${JSON.stringify(integration)},
    name: partial.name,
    description: partial.description,
    inputSchema: { type: "object", properties: {} },
    outputSchema: partial.outputSchema,
    accessLevel: partial.accessLevel ?? partial.mode,
    mode: partial.mode,
    risk: partial.risk,
    tags: partial.tags ?? [],
    whenToUse: partial.whenToUse ?? [],
    askBefore: partial.askBefore ?? [],
    safeDefaults: partial.safeDefaults ?? {},
    examples: partial.examples ?? [],
    followups: [],
    requiresScopes: partial.requiresScopes ?? [],
    idempotent: partial.idempotent ?? partial.mode === "read",
    supportsDryRun: partial.supportsDryRun ?? false,
    supportsBatch: partial.supportsBatch ?? false,
    execution: {
      kind: "composio_tool",
      toolkit: ${JSON.stringify(composioToolkit)},
      toolSlug: partial.toolSlug,
      version: ${JSON.stringify(version)},
    },
  };
}

export const ${exportName}: IntegrationTool[] = [
${toolEntries},
];
`;
}

async function writeManifestFile(integration, composioToolkit, version, tools) {
  await fs.mkdir(generatedDir, { recursive: true });

  const fileSlug = sanitizeFileSlug(integration);
  const filePath = path.join(generatedDir, `${fileSlug}.generated.ts`);
  const source = generateManifestSource(integration, composioToolkit, version, tools);

  await fs.writeFile(filePath, source, "utf8");

  return { filePath, fileSlug };
}

async function rewriteIndex() {
  await fs.mkdir(generatedDir, { recursive: true });

  const files = (await fs.readdir(generatedDir))
    .filter((file) => file.endsWith(".generated.ts"))
    .sort((left, right) => left.localeCompare(right));

  const imports = [];
  const spreadEntries = [];

  for (const file of files) {
    const fileSlug = file.replace(/\.generated\.ts$/u, "");
    const exportName = `${toCamelCase(fileSlug)}ComposioTools`;
    imports.push(`import { ${exportName} } from "./${fileSlug}.generated";`);
    spreadEntries.push(`  ...${exportName},`);
  }

  const source = `import type { IntegrationTool } from "../../../worker/integrations/base";
${imports.length > 0 ? `${imports.join("\n")}\n` : ""}
export const composioToolManifests: IntegrationTool[] = [
${spreadEntries.join("\n")}
];
`;

  await fs.writeFile(indexPath, source, "utf8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const toolkit = safeTrim(args.toolkit);
  const integration = safeTrim(args.integration) ?? toolkit;
  const dryRun = args["dry-run"] === "true";

  if (!toolkit) {
    console.error(
      "Usage: node scripts/import-composio-tools.mjs --toolkit <composio_toolkit_slug> [--integration <clawlink_slug>] [--dry-run]",
    );
    console.error("");
    console.error("Examples:");
    console.error("  node scripts/import-composio-tools.mjs --toolkit instantly --integration instantly");
    console.error("  node scripts/import-composio-tools.mjs --toolkit gmail --integration gmail");
    console.error("  node scripts/import-composio-tools.mjs --toolkit clickup --integration clickup --dry-run");
    process.exitCode = 1;
    return;
  }

  const env = await loadLocalEnv();
  const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");

  if (!apiKey) {
    throw new Error("COMPOSIO_API_KEY is not set. Add it to .env.local or set it as an env var.");
  }

  const baseUrl = getEnvValue(env, "COMPOSIO_BASE_URL") ?? DEFAULT_BASE_URL;

  console.log(`Fetching tools for toolkit "${toolkit}" from Composio...`);
  const response = await fetchComposioTools(apiKey, toolkit, baseUrl);

  const totalItems = response.total_items ?? response.items?.length ?? 0;
  console.log(`Composio returned ${totalItems} tools.`);

  if (!response.items || response.items.length === 0) {
    throw new Error(`No tools found for toolkit "${toolkit}". Check the toolkit slug.`);
  }

  // Determine version from the first tool.
  const toolkitVersion = response.items[0]?.version ?? "latest";
  const composioToolkitSlug = response.items[0]?.toolkit?.slug ?? toolkit;
  console.log(`Toolkit version: ${toolkitVersion}`);
  console.log(`Composio toolkit slug: ${composioToolkitSlug}`);

  // Filter out deprecated tools.
  const activeTools = response.items.filter((item) => !item.is_deprecated);
  const deprecatedCount = response.items.length - activeTools.length;

  if (deprecatedCount > 0) {
    const deprecatedSlugs = response.items
      .filter((item) => item.is_deprecated)
      .map((item) => item.slug);
    console.log(`Skipping ${deprecatedCount} deprecated tool(s): ${deprecatedSlugs.join(", ")}`);
  }

  // Build manifest entries.
  // inputSchema is intentionally omitted from static manifests to keep bundle
  // size small (~80-90% reduction). Schemas are fetched at runtime from
  // Composio's API and cached in KV. See src/lib/composio/schema-cache.ts.
  const tools = activeTools
    .map((item) => {
      const { mode, risk } = classifyTool(item);
      const name = toClawlinkToolName(item.slug);
      const tags = buildTags(integration, mode, item.tags);
      const humanName = humanizeToolName(item.name);
      const askBefore = buildAskBefore(mode, risk, humanName);
      const idempotent = (item.tags ?? []).includes(HINT_TAG_IDEMPOTENT) ? true : undefined;

      return {
        name,
        description: item.description,
        toolSlug: item.slug,
        mode,
        risk,
        tags,
        askBefore,
        idempotent,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Stats.
  const readCount = tools.filter((t) => t.mode === "read").length;
  const writeConfirmCount = tools.filter((t) => t.mode === "write" && t.risk === "confirm").length;
  const writeDangerousCount = tools.filter((t) => t.mode === "write" && t.risk === "high_impact").length;

  console.log(`\nTool breakdown for ${integration}:`);
  console.log(`  Read (safe):         ${readCount}`);
  console.log(`  Write (confirm):     ${writeConfirmCount}`);
  console.log(`  Write (high_impact): ${writeDangerousCount}`);
  console.log(`  Total:             ${tools.length}`);

  if (dryRun) {
    console.log("\n[Dry run] Would generate the following tools:");
    for (const tool of tools) {
      const riskLabel = tool.risk === "high_impact" ? " ⚠️" : tool.risk === "confirm" ? " ✏️" : "";
      console.log(`  ${tool.mode.padEnd(5)} ${tool.name}${riskLabel}`);
    }
    console.log(`\n[Dry run] No files written.`);
    return;
  }

  // Write manifest file.
  const { filePath } = await writeManifestFile(integration, composioToolkitSlug, toolkitVersion, tools);
  console.log(`\nWrote ${tools.length} tools to ${path.relative(repoRoot, filePath)}`);

  // Update barrel index.
  await rewriteIndex();
  console.log(`Updated ${path.relative(repoRoot, indexPath)}`);

  console.log(`\nDone. Imported ${tools.length} Composio tools for ${integration}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
