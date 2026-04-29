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

function loadDotEnvLocalKey() {
  const envPath = path.resolve(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    return null;
  }

  const raw = readFileSync(envPath, "utf8");

  for (const line of raw.split(/\r?\n/u)) {
    if (line.startsWith("CLAWLINK_API_KEY=")) {
      const value = line.slice("CLAWLINK_API_KEY=".length).trim();
      return isNonEmptyString(value) ? value : null;
    }
  }

  return null;
}

function loadApiKey() {
  if (isNonEmptyString(process.env.CLAWLINK_API_KEY)) {
    return process.env.CLAWLINK_API_KEY.trim();
  }

  const envLocalKey = loadDotEnvLocalKey();
  if (isNonEmptyString(envLocalKey)) {
    return envLocalKey.trim();
  }

  const configPath = path.join(os.homedir(), ".openclaw", "openclaw.json");
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

function summarizeContent(result) {
  const text = result?.content?.find?.((entry) => entry?.type === "text")?.text ?? "";
  return text.length > 600 ? `${text.slice(0, 600)}...` : text;
}

async function runTool(api, name, params) {
  const tool = api.getTool(name);
  const result = await tool.execute("smoke", params);
  return {
    content: summarizeContent(result),
    details: result?.details ?? null,
  };
}

async function loadPreset(slug) {
  const presetPath = path.resolve(process.cwd(), "scripts", "smoke-presets", `${slug}.mjs`);

  if (!existsSync(presetPath)) {
    throw new Error(`No smoke preset found for integration \"${slug}\" at ${presetPath}`);
  }

  const module = await import(pathToFileURL(presetPath).href);
  const preset = module.default ?? module;

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

function buildContext(cliArgs) {
  return {
    cliArgs,
    env: process.env,
    require(key, description = key) {
      const direct = cliArgs[key];
      if (isNonEmptyString(direct)) {
        return direct.trim();
      }

      const envKey = key
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/-/g, "_")
        .toUpperCase();
      const envValue = process.env[envKey];
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

      const envKey = key
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/-/g, "_")
        .toUpperCase();
      const envValue = process.env[envKey];
      return isNonEmptyString(envValue) ? envValue.trim() : undefined;
    },
    csv(key) {
      return parseCsv(cliArgs[key] ?? process.env[key.toUpperCase()]);
    },
    number(key, fallback) {
      const raw = cliArgs[key] ?? process.env[key.toUpperCase()];
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
  const readSteps = normalizeArray(preset.read);
  const firstReadTool = readSteps[0]?.tool;

  const steps = [
    {
      label: "list",
      tool: "clawlink_list_tools",
      params: {},
    },
  ];

  if (isNonEmptyString(firstReadTool)) {
    steps.push({
      label: "describe",
      tool: "clawlink_describe_tool",
      params: { tool: firstReadTool },
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

function buildExecutionPlan(preset, context, options) {
  const plan = [...buildBaseSteps(preset)];

  for (const step of normalizeArray(preset.read)) {
    plan.push(materializeStep(step, context, "read"));
  }

  if (options.preview) {
    for (const step of normalizeArray(preset.preview)) {
      plan.push(materializeStep(step, context, "preview"));
    }
  }

  if (options.write) {
    for (const step of normalizeArray(preset.write)) {
      plan.push(materializeStep(step, context, "write"));
    }
  }

  return plan;
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

async function runIntegration(api, slug, cliArgs, options) {
  const preset = await loadPreset(slug);
  const context = buildContext(cliArgs);
  const plan = buildExecutionPlan(preset, context, options);
  const statuses = {
    list: "-",
    describe: "-",
    read: normalizeArray(preset.read).length > 0 ? "pass" : "n/a",
    preview: options.preview ? (normalizeArray(preset.preview).length > 0 ? "pass" : "n/a") : "-",
    write: options.write ? (normalizeArray(preset.write).length > 0 ? "pass" : "n/a") : "-",
  };

  console.log(`\n=== ${slug} ===`);

  for (const step of plan) {
    console.log(`\n>>> ${step.label}: ${step.tool}`);
    try {
      const result = await runTool(api, step.tool, step.params);
      console.log(result.content);

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

      if (step.label === "list") {
        statuses.list = "FAIL";
      } else if (step.label === "describe") {
        statuses.describe = "FAIL";
      } else if (step.tool === "clawlink_preview_tool") {
        statuses.preview = "FAIL";
      } else if (step.tool === "clawlink_call_tool" && step.params?.tool) {
        if (normalizeArray(preset.read).some((entry) => entry.tool === step.params.tool)) {
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

async function main() {
  const cliArgs = parseArgs(process.argv.slice(2));
  const apiKey = loadApiKey();
  const api = createFakeApi(apiKey);
  clawlinkPlugin.register(api);

  const options = {
    preview: asBooleanFlag(cliArgs.preview),
    write: asBooleanFlag(cliArgs.write),
  };

  const integrations = asBooleanFlag(cliArgs.all)
    ? listAvailablePresetSlugs()
    : [cliArgs.integration ?? cliArgs.preset ?? "gmail"];

  if (integrations.length === 0) {
    throw new Error("No smoke presets found. Add files under scripts/smoke-presets/*.mjs first.");
  }

  const results = [];

  for (const slug of integrations) {
    results.push(await runIntegration(api, slug, cliArgs, options));
  }

  printSummary(results);

  const failed = results.filter((entry) => !entry.ok);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
