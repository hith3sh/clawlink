#!/usr/bin/env node

import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
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

function loadApiKey() {
  if (isNonEmptyString(process.env.CLAWLINK_API_KEY)) {
    return process.env.CLAWLINK_API_KEY.trim();
  }

  const configPath = path.join(os.homedir(), ".openclaw", "openclaw.json");
  const raw = readFileSync(configPath, "utf8");
  const parsed = JSON.parse(raw);
  const key = parsed?.plugins?.entries?.["openclaw-plugin"]?.config?.apiKey;

  if (!isNonEmptyString(key)) {
    throw new Error("No ClawLink API key found in ~/.openclaw/openclaw.json.");
  }

  return key.trim();
}

function createFakeApi(apiKey) {
  const tools = new Map();

  return {
    id: "openclaw-plugin",
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

function buildPreset(name, cliArgs) {
  switch (name) {
    case "gmail-read":
      return [
        { tool: "clawlink_list_tools", params: {} },
        { tool: "clawlink_describe_tool", params: { tool: "gmail_get_current_user" } },
        { tool: "clawlink_call_tool", params: { tool: "gmail_get_current_user" } },
        {
          tool: "clawlink_call_tool",
          params: {
            tool: "gmail_find_email",
            q: cliArgs.query ?? "in:inbox",
            maxResults: cliArgs.maxResults ? Number(cliArgs.maxResults) : 1,
          },
        },
      ];
    case "gmail-send-preview": {
      const to = cliArgs.to;
      const subject = cliArgs.subject ?? "ClawLink smoke preview";
      const body = cliArgs.body ?? "Smoke preview only. Do not send.";

      if (!isNonEmptyString(to)) {
        throw new Error("--to is required for --preset gmail-send-preview");
      }

      return [
        { tool: "clawlink_describe_tool", params: { tool: "gmail_send_email" } },
        {
          tool: "clawlink_preview_tool",
          params: {
            tool: "gmail_send_email",
            to: to.split(/[,\n;]+/u).map((entry) => entry.trim()).filter(Boolean),
            subject,
            body,
          },
        },
      ];
    }
    default:
      throw new Error(`Unknown preset "${name}". Use gmail-read or gmail-send-preview.`);
  }
}

async function main() {
  const cliArgs = parseArgs(process.argv.slice(2));
  const preset = cliArgs.preset ?? "gmail-read";
  const apiKey = loadApiKey();
  const api = createFakeApi(apiKey);
  clawlinkPlugin.register(api);

  const steps = buildPreset(preset, cliArgs);
  console.log(`Running smoke preset: ${preset}`);

  for (const step of steps) {
    console.log(`\n>>> ${step.tool}`);
    const result = await runTool(api, step.tool, step.params);
    console.log(result.content);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
