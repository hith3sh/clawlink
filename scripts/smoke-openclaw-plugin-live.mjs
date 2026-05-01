#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import clawlinkPlugin from "../packages/openclaw-clawlink/index.js";

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

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function asBooleanFlag(value) {
  return value === true || value === "true";
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

function loadEnvFiles() {
  const merged = {};
  const candidates = [
    path.resolve(process.cwd(), ".env.production"),
    path.resolve(process.cwd(), ".env.local"),
  ];

  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }

    Object.assign(merged, parseEnvFile(readFileSync(candidate, "utf8")));
  }

  return merged;
}

function readEnvValue(envFiles, key) {
  const processValue = process.env[key];
  if (isNonEmptyString(processValue)) {
    return processValue.trim();
  }

  const fileValue = envFiles[key];
  return isNonEmptyString(fileValue) ? fileValue.trim() : undefined;
}

function loadApiKey(envFiles) {
  const directKey = readEnvValue(envFiles, "CLAWLINK_API_KEY");
  if (isNonEmptyString(directKey)) {
    return directKey.trim();
  }

  const configPath = path.join(os.homedir(), ".openclaw", "openclaw.json");
  if (!existsSync(configPath)) {
    throw new Error("No ClawLink API key found in .env.local, CLAWLINK_API_KEY, or ~/.openclaw/openclaw.json.");
  }

  const raw = readFileSync(configPath, "utf8");
  const parsed = JSON.parse(raw);
  const key =
    parsed?.plugins?.entries?.["clawlink"]?.config?.apiKey ??
    parsed?.plugins?.entries?.["openclaw-plugin"]?.config?.apiKey;

  if (!isNonEmptyString(key)) {
    throw new Error("No ClawLink API key found in .env.local, CLAWLINK_API_KEY, or ~/.openclaw/openclaw.json.");
  }

  return key.trim();
}

function createFakeApi(apiKey) {
  const tools = new Map();

  return {
    id: "clawlink",
    pluginConfig: {
      apiKey,
    },
    registerCommand() {},
    registerTool(definition) {
      tools.set(definition.name, definition);
    },
    getTool(name) {
      const tool = tools.get(name);
      if (!tool) {
        throw new Error(`Tool ${name} is not registered.`);
      }
      return tool;
    },
  };
}

function getTextContent(result) {
  return result?.content?.find?.((entry) => entry?.type === "text")?.text ?? "";
}

function summarizeContent(result) {
  const text = getTextContent(result);
  return text.length > 600 ? `${text.slice(0, 600)}...` : text;
}

async function runTool(api, name, params) {
  const tool = api.getTool(name);
  const result = await tool.execute("smoke", params);
  return {
    content: summarizeContent(result),
    text: getTextContent(result),
    details: result?.details ?? null,
  };
}

async function loadPreset(slug) {
  const presetPath = path.resolve(process.cwd(), "scripts", "smoke-presets", `${slug}.mjs`);

  if (!existsSync(presetPath)) {
    throw new Error(`No smoke preset found for integration \"${slug}\" at ${presetPath}`);
  }

  const importedPreset = await import(pathToFileURL(presetPath).href);
  const preset = importedPreset.default ?? importedPreset;

  if (!preset || typeof preset !== "object") {
    throw new Error(`Preset ${slug} does not export a valid object.`);
  }

  return preset;
}

function listAvailablePresetSlugs() {
  const presetDir = path.resolve(process.cwd(), "scripts", "smoke-presets");
  if (!existsSync(presetDir)) {
    return [];
  }

  return readdirSync(presetDir)
    .filter((entry) => entry.endsWith(".mjs"))
    .map((entry) => entry.replace(/\.mjs$/u, ""))
    .sort();
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function parseCsv(value) {
  if (!isNonEmptyString(value)) {
    return [];
  }

  return value
    .split(/[,\n;]/u)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toEnvKey(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/-/g, "_")
    .toUpperCase();
}

function buildContext(cliArgs, envFiles) {
  return {
    cliArgs,
    env: {
      ...envFiles,
      ...process.env,
    },
    require(key, description = key) {
      const direct = cliArgs[key];
      if (isNonEmptyString(direct)) {
        return direct.trim();
      }

      const envKey = toEnvKey(key);
      const envValue = readEnvValue(envFiles, envKey);
      if (isNonEmptyString(envValue)) {
        return envValue.trim();
      }

      throw new Error(`Missing required value for ${description}. Pass --${key} or set ${envKey}.`);
    },
    optional(key) {
      const direct = cliArgs[key];
      if (isNonEmptyString(direct)) {
        return direct.trim();
      }

      const envKey = toEnvKey(key);
      const envValue = readEnvValue(envFiles, envKey);
      return isNonEmptyString(envValue) ? envValue.trim() : undefined;
    },
    csv(key) {
      return parseCsv(cliArgs[key] ?? readEnvValue(envFiles, toEnvKey(key)));
    },
    number(key, fallback) {
      const raw = cliArgs[key] ?? readEnvValue(envFiles, toEnvKey(key));
      if (!isNonEmptyString(raw)) {
        return fallback;
      }
      const parsed = Number(raw);
      if (!Number.isFinite(parsed)) {
        throw new Error(`Expected numeric value for ${key}, got ${raw}`);
      }
      return parsed;
    },
  };
}

function buildBaseSteps(preset) {
  const firstTool =
    normalizeArray(preset.read)[0]?.tool ??
    normalizeArray(preset.preview)[0]?.tool ??
    normalizeArray(preset.write)[0]?.tool;

  const steps = [
    {
      label: "list",
      tool: "clawlink_list_tools",
      params: {},
    },
  ];

  if (isNonEmptyString(firstTool)) {
    steps.push({
      label: "describe",
      tool: "clawlink_describe_tool",
      params: { tool: firstTool },
    });
  }

  return steps;
}

function materializeParams(rawParams, context) {
  if (typeof rawParams === "function") {
    return rawParams(context);
  }

  return rawParams ?? {};
}

function materializeStep(step, context, mode) {
  const params = materializeParams(step.args ?? step.params ?? {}, context);

  return {
    label: step.label ?? step.tool,
    tool:
      mode === "preview"
        ? "clawlink_preview_tool"
        : mode === "write"
          ? "clawlink_call_tool"
          : "clawlink_call_tool",
    params: {
      tool: step.tool,
      ...(params ?? {}),
    },
  };
}

function pad(value, width) {
  return String(value).padEnd(width, " ");
}

function printSummary(results) {
  if (results.length === 0) {
    return;
  }

  console.log("\nSummary");
  console.log(pad("Integration", 24) + pad("List", 8) + pad("Describe", 10) + pad("Read", 8) + pad("Preview", 10) + pad("Write", 8));

  for (const result of results) {
    console.log(
      pad(result.slug, 24) +
      pad(result.statuses.list, 8) +
      pad(result.statuses.describe, 10) +
      pad(result.statuses.read, 8) +
      pad(result.statuses.preview, 10) +
      pad(result.statuses.write, 8),
    );
  }
}

function emptyStatuses() {
  return {
    list: "-",
    describe: "-",
    read: "-",
    preview: "-",
    write: "-",
  };
}

async function runIntegration(api, slug, cliArgs, envFiles, options) {
  let preset;

  try {
    preset = await loadPreset(slug);
  } catch (error) {
    console.error(`\n=== ${slug} ===`);
    console.error(error instanceof Error ? error.message : String(error));
    return {
      slug,
      statuses: {
        ...emptyStatuses(),
        read: "FAIL",
      },
      ok: false,
    };
  }

  const context = buildContext(cliArgs, envFiles);
  const statuses = {
    list: "-",
    describe: "-",
    read: normalizeArray(preset.read).length > 0 ? "pass" : "n/a",
    preview: options.preview ? (normalizeArray(preset.preview).length > 0 ? "pass" : "n/a") : "-",
    write: options.write ? (normalizeArray(preset.write).length > 0 ? "pass" : "n/a") : "-",
  };

  console.log(`\n=== ${slug} ===`);

  const baseSteps = buildBaseSteps(preset);
  const readSteps = normalizeArray(preset.read).map((step) => ({ raw: step, mode: "read" }));
  const previewSteps = options.preview
    ? normalizeArray(preset.preview).map((step) => ({ raw: step, mode: "preview" }))
    : [];
  const writeSteps = options.write
    ? normalizeArray(preset.write).map((step) => ({ raw: step, mode: "write" }))
    : [];
  const plan = [
    ...baseSteps.map((step) => ({ step })),
    ...readSteps,
    ...previewSteps,
    ...writeSteps,
  ];

  for (const entry of plan) {
    let step;

    try {
      step = entry.step ?? materializeStep(entry.raw, context, entry.mode);
      console.log(`\n>>> ${step.label}: ${step.tool}`);
      const result = await runTool(api, step.tool, step.params);
      console.log(options.verbose ? result.content : "ok");

      if (step.label === "list") {
        statuses.list = "pass";
      } else if (step.label === "describe") {
        statuses.describe = "pass";
      } else if (step.tool === "clawlink_call_tool") {
        statuses.read = "pass";
      } else if (step.tool === "clawlink_preview_tool") {
        statuses.preview = "pass";
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(message);
      const failedTool = step?.params?.tool ?? entry.raw?.tool;

      if (step?.label === "list") {
        statuses.list = "FAIL";
      } else if (step?.label === "describe") {
        statuses.describe = "FAIL";
      } else if (entry.mode === "preview" || step?.tool === "clawlink_preview_tool") {
        statuses.preview = "FAIL";
      } else if (entry.mode === "write") {
        statuses.write = "FAIL";
      } else if (entry.mode === "read" || step?.tool === "clawlink_call_tool") {
        if (normalizeArray(preset.read).some((presetStep) => presetStep.tool === failedTool)) {
          statuses.read = "FAIL";
        } else {
          statuses.write = "FAIL";
        }
      }

      return { slug, statuses, ok: false };
    }
  }

  return { slug, statuses, ok: true };
}

function parseJsonPayloadFromText(text) {
  const starts = [text.indexOf("["), text.indexOf("{")].filter((index) => index >= 0);
  if (starts.length === 0) {
    return null;
  }

  const start = Math.min(...starts);
  try {
    return JSON.parse(text.slice(start));
  } catch {
    return null;
  }
}

async function listConnectedPresetSlugs(api) {
  const result = await runTool(api, "clawlink_list_tools", {});
  const parsed = parseJsonPayloadFromText(result.text);
  const tools = Array.isArray(parsed) ? parsed : [];
  const connected = new Set();
  const presetSlugs = new Set(listAvailablePresetSlugs());
  const missing = new Set();

  for (const tool of tools) {
    if (!isNonEmptyString(tool?.integration)) {
      continue;
    }

    if (presetSlugs.has(tool.integration)) {
      connected.add(tool.integration);
    } else {
      missing.add(tool.integration);
    }
  }

  return {
    connected: Array.from(connected).sort(),
    missing: Array.from(missing).sort(),
  };
}

async function main() {
  const cliArgs = parseArgs(process.argv.slice(2));
  const envFiles = loadEnvFiles();
  const apiKey = loadApiKey(envFiles);
  const api = createFakeApi(apiKey);
  clawlinkPlugin.register(api);

  const options = {
    preview: asBooleanFlag(cliArgs.preview),
    verbose: asBooleanFlag(cliArgs.verbose),
    write: asBooleanFlag(cliArgs.write),
  };

  let integrations;
  const missingConnectedPresets = [];

  if (asBooleanFlag(cliArgs.connected)) {
    const connected = await listConnectedPresetSlugs(api);
    integrations = connected.connected;
    missingConnectedPresets.push(...connected.missing);
  } else if (asBooleanFlag(cliArgs.all)) {
    integrations = listAvailablePresetSlugs();
  } else {
    integrations = [cliArgs.integration ?? cliArgs.preset ?? "gmail"];
  }

  if (integrations.length === 0) {
    throw new Error(
      asBooleanFlag(cliArgs.connected)
        ? "No connected integrations with smoke presets found for this API key."
        : "No smoke presets found. Add files under scripts/smoke-presets/*.mjs first.",
    );
  }

  const results = [];

  for (const slug of integrations) {
    results.push(await runIntegration(api, slug, cliArgs, envFiles, options));
  }

  for (const slug of missingConnectedPresets) {
    results.push({
      slug,
      statuses: {
        ...emptyStatuses(),
        read: "FAIL",
      },
      ok: false,
    });
  }

  printSummary(results);

  if (missingConnectedPresets.length > 0) {
    console.error(`\nMissing smoke preset(s): ${missingConnectedPresets.join(", ")}`);
  }

  const failed = results.filter((entry) => !entry.ok);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
