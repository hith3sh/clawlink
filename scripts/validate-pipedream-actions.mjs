#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PipedreamClient, PipedreamError, ProjectEnvironment } from "@pipedream/sdk";
import overridesConfig from "../config/pipedream-action-overrides.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const generatedDir = path.join(repoRoot, "src/generated/pipedream-manifests");

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith("--")) {
      continue;
    }

    const key = current.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      parsed[key] = "true";
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

function parseEnvFile(contents) {
  const parsed = {};

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
      parsed[key] = value;
    }
  }

  return parsed;
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

function readEnvValue(env, key) {
  const processValue = typeof process.env[key] === "string" ? process.env[key].trim() : "";
  if (processValue) {
    return processValue;
  }

  const fileValue = typeof env[key] === "string" ? env[key].trim() : "";
  return fileValue || undefined;
}

function safeTrim(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function getProjectEnvironment(env) {
  const raw =
    readEnvValue(env, "PIPEDREAM_PROJECT_ENVIRONMENT") ??
    readEnvValue(env, "PIPEDREAM_ENVIRONMENT");

  if (!raw) {
    return undefined;
  }

  return raw.toLowerCase() === ProjectEnvironment.Development
    ? ProjectEnvironment.Development
    : ProjectEnvironment.Production;
}

function createClient(env) {
  const clientId = readEnvValue(env, "PIPEDREAM_CLIENT_ID");
  const clientSecret = readEnvValue(env, "PIPEDREAM_CLIENT_SECRET");
  const projectId = readEnvValue(env, "PIPEDREAM_PROJECT_ID");
  const baseUrl = readEnvValue(env, "PIPEDREAM_BASE_URL");

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

function toUpperSnakeCase(value) {
  return value.replace(/[^a-z0-9]+/giu, "_").replace(/^_+|_+$/gu, "").toUpperCase();
}

function parseBindingsJson(raw) {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    throw new Error("PIPEDREAM_TEST_ACCOUNTS_JSON must be valid JSON.");
  }
}

function getTestBinding(env, integration, cliArgs) {
  const inlineAccountId = safeTrim(cliArgs["account-id"]);
  const inlineExternalUserId = safeTrim(cliArgs["external-user-id"]);

  if (inlineAccountId) {
    return {
      accountId: inlineAccountId,
      externalUserId: inlineExternalUserId ?? "manifest-audit",
    };
  }

  const bindings = parseBindingsJson(readEnvValue(env, "PIPEDREAM_TEST_ACCOUNTS_JSON"));
  const fromJson = bindings[integration];

  if (fromJson && typeof fromJson === "object" && !Array.isArray(fromJson)) {
    const accountId =
      safeTrim(fromJson.accountId) ??
      safeTrim(fromJson.authProvisionId);
    const externalUserId = safeTrim(fromJson.externalUserId) ?? "manifest-audit";

    if (accountId) {
      return { accountId, externalUserId };
    }
  }

  const envPrefix = `PIPEDREAM_TEST_${toUpperSnakeCase(integration)}`;
  const accountId =
    readEnvValue(env, `${envPrefix}_ACCOUNT_ID`) ??
    readEnvValue(env, `${envPrefix}_AUTH_PROVISION_ID`);
  const externalUserId =
    readEnvValue(env, `${envPrefix}_EXTERNAL_USER_ID`) ??
    readEnvValue(env, "PIPEDREAM_TEST_EXTERNAL_USER_ID") ??
    "manifest-audit";

  if (!accountId) {
    return null;
  }

  return { accountId, externalUserId };
}

function loadManifestSource(source) {
  const open = source.indexOf("[");
  const close = source.indexOf("] satisfies");

  if (open < 0 || close < 0) {
    return null;
  }

  return JSON.parse(source.slice(open, close + 1));
}

async function loadGeneratedManifests() {
  const files = (await fs.readdir(generatedDir))
    .filter((file) => file.endsWith(".generated.ts"))
    .sort((left, right) => left.localeCompare(right));
  const manifests = [];

  for (const file of files) {
    const fullPath = path.join(generatedDir, file);
    const source = await fs.readFile(fullPath, "utf8");
    const parsed = loadManifestSource(source);

    if (!Array.isArray(parsed)) {
      continue;
    }

    for (const manifest of parsed) {
      manifests.push(manifest);
    }
  }

  return manifests;
}

function getActionOverride(tool) {
  return (
    overridesConfig.integrations?.[tool.integration]?.actionOverrides?.[tool.source?.componentKey] ??
    overridesConfig.integrations?.[tool.execution?.app]?.actionOverrides?.[tool.source?.componentKey] ??
    null
  );
}

function getValidationArgSets(tool) {
  const override = getActionOverride(tool);
  const fromOverride = override?.validationArgs;

  if (Array.isArray(fromOverride)) {
    return fromOverride.filter(
      (entry) => entry && typeof entry === "object" && !Array.isArray(entry),
    );
  }

  if (fromOverride && typeof fromOverride === "object" && !Array.isArray(fromOverride)) {
    return [fromOverride];
  }

  if (Array.isArray(tool.examples) && tool.examples.length > 0) {
    return tool.examples
      .map((example) => example?.args)
      .filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry));
  }

  return [];
}

function getExposedPropNames(tool) {
  return new Set(Object.keys(tool.inputSchema?.properties ?? {}));
}

function getRequiredPropNames(tool) {
  return new Set(tool.inputSchema?.required ?? []);
}

function buildAuditArgs(tool) {
  const safeDefaults =
    tool.safeDefaults && typeof tool.safeDefaults === "object" && !Array.isArray(tool.safeDefaults)
      ? tool.safeDefaults
      : {};
  const validationArgSets = getValidationArgSets(tool);
  const firstSample = validationArgSets[0] ?? {};
  const exposedProps = getExposedPropNames(tool);
  const merged = { ...safeDefaults, ...firstSample };
  const filtered = {};

  for (const [key, value] of Object.entries(merged)) {
    if (exposedProps.has(key)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

function listMissingRequiredProps(tool, args) {
  const required = getRequiredPropNames(tool);
  const missing = [];

  for (const propName of required) {
    if (args[propName] === undefined) {
      missing.push(propName);
    }
  }

  return missing;
}

function buildConfiguredProps(tool, args, binding) {
  const configuredProps = {};

  for (const prop of tool.execution?.props ?? []) {
    if (prop.appAuth) {
      configuredProps[prop.name] = {
        authProvisionId: binding.accountId,
      };
      continue;
    }

    if (args[prop.name] !== undefined) {
      configuredProps[prop.name] = args[prop.name];
    }
  }

  return configuredProps;
}

function stringifyErrorBody(body) {
  if (typeof body === "string" && body.trim().length > 0) {
    return body.trim();
  }

  if (body && typeof body === "object") {
    if (typeof body.message === "string" && body.message.trim().length > 0) {
      return body.message.trim();
    }

    if (typeof body.error === "string" && body.error.trim().length > 0) {
      return body.error.trim();
    }

    try {
      return JSON.stringify(body);
    } catch {
      return null;
    }
  }

  return null;
}

function extractMissingPropNames(message) {
  if (!message) {
    return [];
  }

  const patterns = [
    /(?:missing|required)[^"'`]*["'`]([a-zA-Z0-9_]+)["'`]/gu,
    /["'`]([a-zA-Z0-9_]+)["'`][^.!?\n]* is required/gu,
    /required (?:property|parameter|field|prop)[^"'`]*["'`]([a-zA-Z0-9_]+)["'`]/gu,
  ];
  const found = new Set();

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(message)) !== null) {
      found.add(match[1]);
    }
  }

  return Array.from(found);
}

function classifyFailure(tool, errorText) {
  const missingProps = extractMissingPropNames(errorText);
  const exposedProps = getExposedPropNames(tool);
  const executionProps = new Set((tool.execution?.props ?? []).map((prop) => prop.name));
  const hiddenMissing = missingProps.filter(
    (propName) => executionProps.has(propName) && !exposedProps.has(propName),
  );
  const exposedMissing = missingProps.filter((propName) => exposedProps.has(propName));

  if (hiddenMissing.length > 0) {
    return {
      kind: "hidden_required_prop",
      props: hiddenMissing,
    };
  }

  if (exposedMissing.length > 0) {
    return {
      kind: "sample_missing_exposed_prop",
      props: exposedMissing,
    };
  }

  return {
    kind: "provider_or_input_error",
    props: missingProps,
  };
}

async function executeValidation(client, tool, binding, args) {
  const configuredProps = buildConfiguredProps(tool, args, binding);

  try {
    await client.actions.run({
      id: tool.execution.componentId,
      version: tool.execution.version,
      externalUserId: binding.externalUserId,
      configuredProps,
    });

    return {
      ok: true,
    };
  } catch (error) {
    if (error instanceof PipedreamError) {
      const errorText = stringifyErrorBody(error.body) ?? error.message;
      return {
        ok: false,
        status: error.statusCode ?? null,
        errorText,
        classification: classifyFailure(tool, errorText),
      };
    }

    return {
      ok: false,
      status: null,
      errorText: error instanceof Error ? error.message : String(error),
      classification: {
        kind: "provider_or_input_error",
        props: [],
      },
    };
  }
}

async function main() {
  const cliArgs = parseArgs(process.argv.slice(2));
  const strict = cliArgs.strict === "true";
  const includeWrites = cliArgs.all === "true";
  const requestedIntegration = safeTrim(cliArgs.integration);
  const requestedTool = safeTrim(cliArgs.tool);
  const env = await loadLocalEnv();
  const client = createClient(env);
  const manifests = await loadGeneratedManifests();

  const selected = manifests.filter((tool) => {
    if (requestedIntegration && tool.integration !== requestedIntegration) {
      return false;
    }

    if (requestedTool && tool.name !== requestedTool) {
      return false;
    }

    if (!includeWrites && tool.mode !== "read") {
      return false;
    }

    return true;
  });

  if (selected.length === 0) {
    throw new Error("No matching generated manifests found for validation.");
  }

  const results = [];

  for (const tool of selected) {
    const binding = getTestBinding(env, tool.integration, cliArgs);

    if (!binding) {
      results.push({
        tool,
        status: "skipped",
        reason: "missing_test_binding",
        detail:
          `No test binding for ${tool.integration}. Set PIPEDREAM_TEST_ACCOUNTS_JSON or ` +
          `PIPEDREAM_TEST_${toUpperSnakeCase(tool.integration)}_ACCOUNT_ID.`,
      });
      continue;
    }

    const args = buildAuditArgs(tool);
    const missingRequired = listMissingRequiredProps(tool, args);

    if (missingRequired.length > 0) {
      results.push({
        tool,
        status: "skipped",
        reason: "missing_validation_args",
        detail: `Missing exposed required props: ${missingRequired.join(", ")}`,
      });
      continue;
    }

    const execution = await executeValidation(client, tool, binding, args);

    if (execution.ok) {
      results.push({
        tool,
        status: "passed",
        args,
      });
      continue;
    }

    results.push({
      tool,
      status: "failed",
      reason: execution.classification.kind,
      detail: execution.errorText,
      failedProps: execution.classification.props,
      httpStatus: execution.status,
      args,
    });
  }

  const passed = results.filter((entry) => entry.status === "passed");
  const failed = results.filter((entry) => entry.status === "failed");
  const skipped = results.filter((entry) => entry.status === "skipped");

  console.log(
    `Validated ${selected.length} Pipedream manifest tool(s): ` +
      `${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped.`,
  );

  for (const entry of failed) {
    console.log(`\nFAIL  ${entry.tool.name}`);
    console.log(`  integration: ${entry.tool.integration}`);
    console.log(`  component:   ${entry.tool.source?.componentKey ?? entry.tool.execution?.componentId}`);
    console.log(`  reason:      ${entry.reason}`);
    if (entry.httpStatus) {
      console.log(`  httpStatus:  ${entry.httpStatus}`);
    }
    if (entry.failedProps?.length) {
      console.log(`  props:       ${entry.failedProps.join(", ")}`);
    }
    console.log(`  detail:      ${entry.detail}`);
  }

  for (const entry of skipped) {
    console.log(`\nSKIP  ${entry.tool.name}`);
    console.log(`  integration: ${entry.tool.integration}`);
    console.log(`  reason:      ${entry.reason}`);
    console.log(`  detail:      ${entry.detail}`);
  }

  if (!strict) {
    return;
  }

  const blockingFailures = failed.filter(
    (entry) =>
      entry.reason === "hidden_required_prop" ||
      entry.reason === "sample_missing_exposed_prop",
  );
  const blockingSkips = skipped.filter(
    (entry) =>
      entry.reason === "missing_test_binding" ||
      entry.reason === "missing_validation_args",
  );

  if (blockingFailures.length > 0 || blockingSkips.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 2;
});
