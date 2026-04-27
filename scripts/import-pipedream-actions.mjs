import { promises as fs } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PipedreamClient, ProjectEnvironment } from "@pipedream/sdk";
import * as ts from "typescript";
import overridesConfig from "../config/pipedream-action-overrides.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const generatedDir = path.join(repoRoot, "src/generated/pipedream-manifests");
const indexPath = path.join(generatedDir, "index.ts");
const PIPEDREAM_REPO_OWNER = "PipedreamHQ";
const PIPEDREAM_REPO_NAME = "pipedream";
const PIPEDREAM_REPO_REF = "master";

const SOURCE_KIND_CONNECT = "connect";
const SOURCE_KIND_GITHUB = "github";

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      continue;
    }

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
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator < 0) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/gu, "");

    if (key) {
      env[key] = value;
    }
  }

  return env;
}

async function loadLocalEnv() {
  const merged = {};
  const candidatePaths = [
    path.join(repoRoot, ".env.local"),
    path.join(repoRoot, ".env.production"),
  ];

  for (const candidate of candidatePaths) {
    try {
      const contents = await fs.readFile(candidate, "utf8");
      Object.assign(merged, parseEnvFile(contents));
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }

  return merged;
}

function getEnvValue(env, key) {
  const processValue = typeof process.env[key] === "string" ? process.env[key].trim() : "";
  if (processValue) {
    return processValue;
  }

  const fileValue = typeof env[key] === "string" ? env[key].trim() : "";
  return fileValue || undefined;
}

function getProjectEnvironment(env) {
  const raw =
    getEnvValue(env, "PIPEDREAM_PROJECT_ENVIRONMENT") ??
    getEnvValue(env, "PIPEDREAM_ENVIRONMENT");

  if (!raw) {
    return undefined;
  }

  return raw.toLowerCase() === ProjectEnvironment.Development
    ? ProjectEnvironment.Development
    : ProjectEnvironment.Production;
}

function createClient(env) {
  const clientId = getEnvValue(env, "PIPEDREAM_CLIENT_ID");
  const clientSecret = getEnvValue(env, "PIPEDREAM_CLIENT_SECRET");
  const projectId = getEnvValue(env, "PIPEDREAM_PROJECT_ID");
  const baseUrl = getEnvValue(env, "PIPEDREAM_BASE_URL");

  if (!clientId || !clientSecret || !projectId) {
    throw new Error(
      "Missing PIPEDREAM_CLIENT_ID, PIPEDREAM_CLIENT_SECRET, or PIPEDREAM_PROJECT_ID.",
    );
  }

  return new PipedreamClient({
    clientId,
    clientSecret,
    projectId,
    baseUrl,
    projectEnvironment: getProjectEnvironment(env),
  });
}

function githubAuthHeader(url) {
  if (!/^https:\/\/(api|raw)\.githubusercontent\.com|^https:\/\/api\.github\.com/u.test(url)) {
    return undefined;
  }

  const token =
    process.env.GITHUB_TOKEN?.trim() ||
    process.env.GH_TOKEN?.trim() ||
    process.env.PIPEDREAM_IMPORTER_GITHUB_TOKEN?.trim() ||
    getGhAuthToken();

  return token ? `Bearer ${token}` : undefined;
}

let cachedGhAuthToken;

function getGhAuthToken() {
  if (cachedGhAuthToken !== undefined) {
    return cachedGhAuthToken;
  }

  try {
    cachedGhAuthToken = execFileSync("gh", ["auth", "token"], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    cachedGhAuthToken = "";
  }

  return cachedGhAuthToken;
}

async function fetchJson(url) {
  const headers = {
    Accept: "application/vnd.github+json, application/json",
    "User-Agent": "clawlink-pipedream-importer",
  };
  const auth = githubAuthHeader(url);
  if (auth) {
    headers.Authorization = auth;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchText(url) {
  const headers = {
    "User-Agent": "clawlink-pipedream-importer",
  };
  const auth = githubAuthHeader(url);
  if (auth) {
    headers.Authorization = auth;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function safeTrim(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function isConnectPlanBlocked(error) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const body = error.body;
  if (!body || typeof body !== "object") {
    return false;
  }

  const message =
    typeof body.error === "string"
      ? body.error
      : typeof body.message === "string"
        ? body.message
        : "";

  return /tool calling via pipedream connect/i.test(message) && /current plan/i.test(message);
}

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

function toToolAction(app, componentKey) {
  const normalizedApp = app.toLowerCase();
  const normalizedKey = componentKey.toLowerCase();

  if (normalizedKey.startsWith(`${normalizedApp}-`)) {
    return normalizedKey.slice(normalizedApp.length + 1).replace(/-/gu, "_");
  }

  return normalizedKey.replace(/-/gu, "_");
}

function mapMode(component, override) {
  if (override?.mode) {
    return override.mode;
  }

  const annotations = component.annotations ?? {};

  if (annotations.readOnlyHint) {
    return "read";
  }

  if (annotations.destructiveHint) {
    return "destructive";
  }

  return "write";
}

function mapRisk(mode, override) {
  if (override?.risk) {
    return override.risk;
  }

  if (mode === "read") {
    return "safe";
  }

  if (mode === "destructive") {
    return "high_impact";
  }

  return "confirm";
}

function normalizeOptionValue(value) {
  if (value == null) {
    return null;
  }

  if (["string", "number", "boolean"].includes(typeof value)) {
    return value;
  }

  return value;
}

function getEnumOptions(prop) {
  if (!Array.isArray(prop.options) || prop.type === "string[]") {
    return undefined;
  }

  const values = prop.options
    .map((option) => option?.value)
    .filter((value) => ["string", "number", "boolean"].includes(typeof value));

  return values.length > 0 ? values : undefined;
}

function toJsonSchema(prop, propOverride) {
  const schema = {};
  const type = propOverride?.type ?? prop.type;

  switch (type) {
    case "string":
      schema.type = "string";
      break;
    case "integer":
      schema.type = "number";
      break;
    case "boolean":
      schema.type = "boolean";
      break;
    case "string[]":
      schema.type = "array";
      schema.items = { type: "string" };
      break;
    case "object":
    case "sql":
    case "any":
      schema.type = "object";
      break;
    default:
      schema.type = "string";
      break;
  }

  if (propOverride?.label ?? prop.label) {
    schema.title = propOverride?.label ?? prop.label;
  }

  if (propOverride?.description ?? prop.description) {
    schema.description = propOverride?.description ?? prop.description;
  }

  const enumValues = getEnumOptions(prop);
  if (enumValues) {
    schema.enum = enumValues;
  }

  return schema;
}

function shouldExposeProp(prop, integrationOverride, actionOverride) {
  if (prop.type === "alert" || prop.type === "app") {
    return false;
  }

  const propOverride = actionOverride?.propOverrides?.[prop.name];
  const hiddenProps = new Set([
    ...(integrationOverride?.hiddenProps ?? []),
    ...(actionOverride?.hiddenProps ?? []),
  ]);

  if (hiddenProps.has(prop.name)) {
    return false;
  }

  if (prop.disabled || prop.readOnly) {
    return false;
  }

  if (prop.hidden && propOverride?.expose !== true) {
    return false;
  }

  return true;
}

function buildPropManifest(prop, propOverride, forcedHidden = false) {
  return {
    name: prop.name,
    type: propOverride?.type ?? prop.type,
    label: propOverride?.label ?? prop.label ?? undefined,
    description: propOverride?.description ?? prop.description ?? undefined,
    required: prop.optional !== true,
    hidden: forcedHidden || (prop.hidden === true && propOverride?.expose !== true),
    disabled: prop.disabled === true,
    readOnly: prop.readOnly === true,
    remoteOptions: prop.remoteOptions === true,
    useQuery: prop.useQuery === true,
    reloadProps: prop.reloadProps === true,
    withLabel: prop.withLabel === true,
    appAuth: prop.type === "app",
    options: Array.isArray(prop.options)
      ? prop.options
          .filter((option) => option && typeof option.label === "string")
          .map((option) => ({
            label: option.label,
            value: normalizeOptionValue(option.value),
          }))
      : undefined,
  };
}

function buildManifest(component, integration, app, integrationOverride) {
  const actionOverride = integrationOverride?.actionOverrides?.[component.key] ?? null;

  if (actionOverride?.enabled === false) {
    return null;
  }

  const mode = mapMode(component, actionOverride);
  const description =
    actionOverride?.description ??
    safeTrim(component.description) ??
    `${component.name} via Pipedream`;
  const toolName =
    actionOverride?.toolName ??
    `${integration}_${toToolAction(app, component.key)}`;
  const props = component.configurableProps ?? [];
  const hiddenProps = new Set([
    ...(integrationOverride?.hiddenProps ?? []),
    ...(actionOverride?.hiddenProps ?? []),
  ]);
  const manifestProps = props.map((prop) =>
    buildPropManifest(
      prop,
      actionOverride?.propOverrides?.[prop.name],
      hiddenProps.has(prop.name),
    ),
  );
  const inputProperties = {};
  const required = [];

  for (const prop of props) {
    const propOverride = actionOverride?.propOverrides?.[prop.name];

    if (!shouldExposeProp(prop, integrationOverride, actionOverride)) {
      continue;
    }

    inputProperties[prop.name] = toJsonSchema(prop, propOverride);

    if (prop.optional !== true) {
      required.push(prop.name);
    }
  }

  return {
    integration,
    name: toolName,
    description,
    inputSchema: {
      type: "object",
      properties: inputProperties,
      required,
    },
    accessLevel: mode,
    mode,
    risk: mapRisk(mode, actionOverride),
    tags: Array.from(
      new Set([
        integration,
        "pipedream",
        ...(actionOverride?.tags ?? []),
      ]),
    ),
    whenToUse: actionOverride?.whenToUse ?? [],
    askBefore: actionOverride?.askBefore ?? [],
    safeDefaults: actionOverride?.safeDefaults ?? {},
    examples: actionOverride?.examples ?? [],
    followups: actionOverride?.followups ?? [],
    requiresScopes: actionOverride?.requiresScopes ?? [],
    idempotent: actionOverride?.idempotent ?? (component.annotations?.idempotentHint ?? mode === "read"),
    supportsDryRun: actionOverride?.supportsDryRun ?? false,
    supportsBatch: actionOverride?.supportsBatch ?? false,
    maxBatchSize: actionOverride?.maxBatchSize,
    recommendedTimeoutMs: actionOverride?.recommendedTimeoutMs,
    execution: {
      kind: "pipedream_action",
      app,
      componentId: component.key,
      version: component.version,
      authPropNames: manifestProps.filter((prop) => prop.appAuth).map((prop) => prop.name),
      dynamicPropNames: manifestProps
        .filter((prop) => prop.remoteOptions || prop.reloadProps)
        .map((prop) => prop.name),
      props: manifestProps,
    },
    source: {
      app,
      componentKey: component.key,
      componentName: component.name,
    },
  };
}

async function listAllActions(client, app) {
  const items = [];
  let page = await client.actions.list({
    app,
    registry: "public",
    limit: 100,
  });

  items.push(...page.data);

  while (page.hasNextPage()) {
    page = await page.getNextPage();
    items.push(...page.data);
  }

  return items;
}

async function fetchDetailedActions(client, app) {
  const actions = await listAllActions(client, app);
  const detailed = [];

  for (const action of actions) {
    const retrieved = await client.actions.retrieve(action.key);
    detailed.push(retrieved.data);
  }

  return detailed;
}

function resolveImportUrl(moduleUrl, specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }

  return new URL(specifier, moduleUrl).toString();
}

function getPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return String(name.text);
  }

  return null;
}

function createUnknownFunctionMarker(kind) {
  return { __kind: "function", type: kind };
}

async function parseModule(moduleUrl, cache = new Map()) {
  if (cache.has(moduleUrl)) {
    return cache.get(moduleUrl);
  }

  const sourceText = await fetchText(moduleUrl);
  const sourceFile = ts.createSourceFile(
    moduleUrl,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );

  const imports = new Map();
  const locals = new Map();
  const moduleInfo = {
    moduleUrl,
    imports,
    locals,
    defaultExport: undefined,
  };
  cache.set(moduleUrl, moduleInfo);

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const target = resolveImportUrl(moduleUrl, statement.moduleSpecifier.text);
      if (!target || !statement.importClause) {
        continue;
      }

      if (statement.importClause.name) {
        imports.set(statement.importClause.name.text, target);
      }
    }

    if (
      ts.isVariableStatement(statement) &&
      statement.declarationList.flags & ts.NodeFlags.Const
    ) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          locals.set(declaration.name.text, declaration.initializer);
        }
      }
    }
  }

  moduleInfo.defaultExport = sourceFile.statements.find(ts.isExportAssignment)?.expression;
  return moduleInfo;
}

async function evaluateNode(node, moduleInfo, cache) {
  if (!node) {
    return undefined;
  }

  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) {
    return evaluateNode(node.expression, moduleInfo, cache);
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (ts.isObjectLiteralExpression(node)) {
    const object = {};

    for (const property of node.properties) {
      if (ts.isSpreadAssignment(property)) {
        const spreadValue = await evaluateNode(property.expression, moduleInfo, cache);
        if (spreadValue && typeof spreadValue === "object" && !Array.isArray(spreadValue)) {
          Object.assign(object, spreadValue);
        }
        continue;
      }

      if (ts.isMethodDeclaration(property)) {
        const name = getPropertyName(property.name);
        if (name) {
          object[name] = createUnknownFunctionMarker("method");
        }
        continue;
      }

      if (ts.isPropertyAssignment(property)) {
        const name = getPropertyName(property.name);
        if (!name) {
          continue;
        }

        object[name] = await evaluateNode(property.initializer, moduleInfo, cache);
        continue;
      }

      if (ts.isShorthandPropertyAssignment(property)) {
        object[property.name.text] = await evaluateNode(property.name, moduleInfo, cache);
      }
    }

    return object;
  }

  if (ts.isArrayLiteralExpression(node)) {
    const values = [];

    for (const element of node.elements) {
      values.push(await evaluateNode(element, moduleInfo, cache));
    }

    return values;
  }

  if (ts.isIdentifier(node)) {
    if (node.text === "undefined") {
      return undefined;
    }

    if (moduleInfo.imports.has(node.text)) {
      return {
        __kind: "import",
        name: node.text,
        moduleUrl: moduleInfo.imports.get(node.text),
      };
    }

    if (moduleInfo.locals.has(node.text)) {
      return evaluateNode(moduleInfo.locals.get(node.text), moduleInfo, cache);
    }

    return {
      __kind: "identifier",
      name: node.text,
    };
  }

  if (
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isFunctionDeclaration(node)
  ) {
    return createUnknownFunctionMarker("function");
  }

  if (ts.isCallExpression(node)) {
    return {
      __kind: "call",
      text: node.getText(),
    };
  }

  if (ts.isPropertyAccessExpression(node)) {
    const base = await evaluateNode(node.expression, moduleInfo, cache);

    if (isImportReference(base)) {
      const imported = await getDefaultExportValue(base.moduleUrl, cache);
      if (imported && typeof imported === "object" && !Array.isArray(imported)) {
        return imported[node.name.text];
      }
    }

    if (base && typeof base === "object" && !Array.isArray(base)) {
      return base[node.name.text];
    }

    return {
      __kind: "propertyAccess",
      text: node.getText(),
    };
  }

  if (ts.isTemplateExpression(node)) {
    return node.getText();
  }

  return {
    __kind: "unknown",
    text: node.getText(),
  };
}

async function getDefaultExportValue(moduleUrl, cache) {
  const moduleInfo = await parseModule(moduleUrl, cache);
  return evaluateNode(moduleInfo.defaultExport, moduleInfo, cache);
}

async function listGitHubDirectory(pathname) {
  const url = `https://api.github.com/repos/${PIPEDREAM_REPO_OWNER}/${PIPEDREAM_REPO_NAME}/contents/${pathname}?ref=${PIPEDREAM_REPO_REF}`;
  return fetchJson(url);
}

async function getGitHubActionSources(app) {
  const entries = await listGitHubDirectory(`components/${app}/actions`);
  const sources = [];

  for (const entry of entries) {
    if (entry.type !== "dir" || entry.name === "common") {
      continue;
    }

    const files = await listGitHubDirectory(entry.path);
    const actionFile = files.find((file) => file.type === "file" && file.name.endsWith(".mjs"));

    if (!actionFile?.download_url) {
      continue;
    }

    sources.push({
      actionSlug: entry.name,
      fileUrl: actionFile.download_url,
    });
  }

  return sources;
}

async function getGitHubAppFileUrl(app) {
  const entries = await listGitHubDirectory(`components/${app}`);
  const appFile = entries.find((entry) => entry.type === "file" && entry.name.endsWith(".app.mjs"));

  if (!appFile?.download_url) {
    throw new Error(`Could not find ${app}.app.mjs in the public Pipedream repo.`);
  }

  return appFile.download_url;
}

async function getAppPropDefinitions(app, cache) {
  const appFileUrl = await getGitHubAppFileUrl(app);
  const appModule = await getDefaultExportValue(appFileUrl, cache);
  return appModule?.propDefinitions ?? {};
}

function isImportReference(value) {
  return value && typeof value === "object" && value.__kind === "import";
}

function mergePropDefinition(baseDefinition, localDefinition) {
  if (!baseDefinition) {
    return localDefinition ?? {};
  }

  if (!localDefinition || typeof localDefinition !== "object" || Array.isArray(localDefinition)) {
    return baseDefinition;
  }

  return {
    ...baseDefinition,
    ...localDefinition,
  };
}

function resolvePropDefinition(propValue, appFileUrl, appPropDefinitions) {
  if (!propValue || typeof propValue !== "object" || Array.isArray(propValue)) {
    return null;
  }

  if (isImportReference(propValue)) {
    if (propValue.moduleUrl === appFileUrl) {
      return {
        type: "app",
        label: "Account",
        description: undefined,
        optional: false,
      };
    }

    return null;
  }

  const propDefinition = Array.isArray(propValue.propDefinition)
    ? propValue.propDefinition
    : null;

  if (
    propDefinition &&
    propDefinition.length >= 2 &&
    isImportReference(propDefinition[0]) &&
    propDefinition[0].moduleUrl === appFileUrl &&
    typeof propDefinition[1] === "string"
  ) {
    return mergePropDefinition(appPropDefinitions[propDefinition[1]], {
      ...propValue,
      propDefinition: undefined,
    });
  }

  return propValue;
}

async function fetchDetailedActionsFromGitHub(app) {
  const cache = new Map();
  const appFileUrl = await getGitHubAppFileUrl(app);
  const appPropDefinitions = await getAppPropDefinitions(app, cache);
  const actionSources = await getGitHubActionSources(app);
  const detailed = [];

  for (const source of actionSources) {
    const actionModule = await getDefaultExportValue(source.fileUrl, cache);
    const props = actionModule?.props ?? {};
    const configurableProps = Object.entries(props).map(([name, value]) => {
      const resolved = resolvePropDefinition(value, appFileUrl, appPropDefinitions) ?? {};

      return {
        name,
        ...(resolved && typeof resolved === "object" && !Array.isArray(resolved) ? resolved : {}),
      };
    });

    detailed.push({
      key: actionModule?.key ?? `${app}-${source.actionSlug}`,
      name: actionModule?.name ?? source.actionSlug,
      description: actionModule?.description,
      version: actionModule?.version,
      annotations: actionModule?.annotations ?? {},
      configurableProps,
    });
  }

  return detailed;
}

function renderSource(value, indent = 0) {
  const space = " ".repeat(indent);

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    return `[\n${value
      .map((item) => `${" ".repeat(indent + 2)}${renderSource(item, indent + 2)}`)
      .join(",\n")}\n${space}]`;
  }

  const entries = Object.entries(value).filter(([, entry]) => entry !== undefined);

  if (entries.length === 0) {
    return "{}";
  }

  return `{\n${entries
    .map(([key, entry]) => `${" ".repeat(indent + 2)}${JSON.stringify(key)}: ${renderSource(entry, indent + 2)}`)
    .join(",\n")}\n${space}}`;
}

async function writeManifestFile(integration, manifests) {
  await fs.mkdir(generatedDir, { recursive: true });

  const fileSlug = sanitizeFileSlug(integration);
  const exportName = `${toPascalCase(fileSlug)}PipedreamToolManifests`;
  const filePath = path.join(generatedDir, `${fileSlug}.generated.ts`);
  const contents = `import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const ${exportName} = ${renderSource(manifests, 0)} satisfies PipedreamActionToolManifest[];
`;

  await fs.writeFile(filePath, contents, "utf8");
  return { filePath, exportName, fileSlug };
}

async function rewriteIndex() {
  const files = (await fs.readdir(generatedDir))
    .filter((file) => file.endsWith(".generated.ts"))
    .sort((left, right) => left.localeCompare(right));

  const imports = [];
  const spreadEntries = [];

  for (const file of files) {
    const fileSlug = file.replace(/\.generated\.ts$/u, "");
    const exportName = `${toPascalCase(fileSlug)}PipedreamToolManifests`;
    imports.push(`import { ${exportName} } from "./${fileSlug}.generated";`);
    spreadEntries.push(`  ...${exportName},`);
  }

  const contents = `import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";
${imports.length > 0 ? `${imports.join("\n")}\n` : ""}
export const pipedreamToolManifests: PipedreamActionToolManifest[] = [
${spreadEntries.join("\n")}
];
`;

  await fs.writeFile(indexPath, contents, "utf8");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const app = safeTrim(args.app);
  const integration = safeTrim(args.integration) ?? app;
  const requestedSource = safeTrim(args.source);

  if (!app || !integration) {
    throw new Error("Usage: node scripts/import-pipedream-actions.mjs --app <app> [--integration <slug>]");
  }

  const env = await loadLocalEnv();
  const integrationOverride =
    overridesConfig.integrations?.[integration] ??
    overridesConfig.integrations?.[app] ??
    {};
  const excludeActionIds = new Set(integrationOverride.excludeActionIds ?? []);
  let components;
  let sourceKind = requestedSource;

  if (!sourceKind || sourceKind === SOURCE_KIND_CONNECT) {
    try {
      const client = createClient(env);
      components = await fetchDetailedActions(client, app);
      sourceKind = SOURCE_KIND_CONNECT;
    } catch (error) {
      if (requestedSource === SOURCE_KIND_CONNECT || !isConnectPlanBlocked(error)) {
        throw error;
      }

      components = await fetchDetailedActionsFromGitHub(app);
      sourceKind = SOURCE_KIND_GITHUB;
    }
  } else if (sourceKind === SOURCE_KIND_GITHUB) {
    components = await fetchDetailedActionsFromGitHub(app);
  } else {
    throw new Error(`Unsupported source "${sourceKind}". Use "connect" or "github".`);
  }

  const manifests = components
    .filter((component) => !excludeActionIds.has(component.key))
    .map((component) => buildManifest(component, integration, app, integrationOverride))
    .filter(Boolean)
    .sort((left, right) => left.name.localeCompare(right.name));

  await writeManifestFile(integration, manifests);
  await rewriteIndex();

  console.log(`Imported ${manifests.length} Pipedream actions for ${integration} using ${sourceKind}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
