#!/usr/bin/env node
/**
 * Audit generated Pipedream manifests for required props that look like
 * Pipedream-internal display/control flags rather than real provider API
 * concepts. These props cause LLM-driven calls to fail validation because
 * the LLM has no business knowing about Pipedream UI toggles.
 *
 * Run before each release:
 *   npm run audit:manifests
 *
 * Add --strict to fail with non-zero exit for CI:
 *   npm run audit:manifests -- --strict
 *
 * Fix surfaced findings by adding to config/pipedream-action-overrides.mjs:
 *   "<component-key>": {
 *     hiddenProps: ["<propName>"],
 *     safeDefaults: { <propName>: <defaultValue> },
 *   }
 * Then re-run the importer (or hand-patch the generated manifest until you do).
 */

import { readFileSync } from "node:fs";
import { glob } from "glob";

const args = new Set(process.argv.slice(2));
const STRICT = args.has("--strict");

const SUSPECT_PROP_NAMES = new Set([
  "withTextPayload",
  "metadataOnly",
  "outputFormat",
  "responseType",
  "syncDir",
  "outputDir",
  "outputPath",
  "stream",
  "dir",
  "pretty",
  "stringify",
  "rawResponse",
  "asText",
  "asJson",
  "raw",
  "format",
]);

const SUSPECT_DESC_KEYWORDS = [
  "payload",
  "plaintext",
  "easier for llm",
  "metadata only",
  "convert the payload",
  "filesystem",
  "/tmp",
  "syncdir",
  "writes to a file",
  "writes to /",
  "reduces the size",
  "pipedream",
  "$.flow",
];

const KNOWN_REAL_OBJECT_PROPS = new Set([
  "lineItems",
  "properties",
  "filter",
  "labelFilters",
  "fields",
]);

function loadManifest(file) {
  const src = readFileSync(file, "utf8");
  const open = src.indexOf("[");
  const closeIdx = src.indexOf("] satisfies");
  if (open < 0 || closeIdx < 0) {
    return null;
  }
  return JSON.parse(src.slice(open, closeIdx + 1));
}

function classify(prop, propName, requiredList, execProp) {
  const required = requiredList.includes(propName);
  if (!required) {
    return null;
  }

  const desc = (prop.description ?? "").toLowerCase();
  const title = (prop.title ?? "").toLowerCase();
  const reasons = [];

  if (SUSPECT_PROP_NAMES.has(propName)) {
    reasons.push(`name "${propName}" matches known Pipedream-internal flag list`);
  }

  for (const kw of SUSPECT_DESC_KEYWORDS) {
    if (desc.includes(kw) || title.includes(kw)) {
      reasons.push(`description/title contains "${kw}"`);
      break;
    }
  }

  if (prop.type === "boolean") {
    reasons.push(`required boolean (almost always has a default; LLMs should not need to set this)`);
  }

  if (prop.type === "object" && !KNOWN_REAL_OBJECT_PROPS.has(propName)) {
    reasons.push(`required object — verify the LLM-shaped JSON matches what Pipedream expects (esp. withLabel { __lv: { label, value } } shapes)`);
  }

  if (execProp?.withLabel) {
    reasons.push(`prop is withLabel — Pipedream expects { __lv: { label, value } } wrapper, LLMs will pass a flat value`);
  }

  return reasons.length > 0 ? reasons : null;
}

async function main() {
  const files = await glob("src/generated/pipedream-manifests/*.generated.ts");
  if (files.length === 0) {
    console.error("No generated manifest files found. Run npm run import:pipedream-actions first.");
    process.exit(2);
  }

  const findings = [];

  for (const file of files) {
    let manifests;
    try {
      manifests = loadManifest(file);
    } catch (err) {
      console.error(`Failed to parse ${file}: ${err.message}`);
      process.exit(2);
    }

    if (!manifests) continue;

    for (const tool of manifests) {
      const requiredList = tool.inputSchema?.required ?? [];
      const props = tool.inputSchema?.properties ?? {};
      const execProps = tool.execution?.props ?? [];

      for (const propName of Object.keys(props)) {
        const execProp = execProps.find((p) => p.name === propName);
        const reasons = classify(props[propName], propName, requiredList, execProp);
        if (reasons) {
          findings.push({
            file,
            integration: tool.integration,
            tool: tool.name,
            componentKey: tool.source?.componentKey ?? tool.execution?.componentId,
            prop: propName,
            type: props[propName].type,
            title: props[propName].title ?? "",
            reasons,
          });
        }
      }
    }
  }

  if (findings.length === 0) {
    console.log("✅ No suspicious required props found. Manifests look LLM-safe.");
    process.exit(0);
  }

  console.log(`⚠️  Found ${findings.length} required prop(s) that may be Pipedream-internal:\n`);
  for (const f of findings) {
    console.log(`  ${f.tool}.${f.prop}  (${f.type})`);
    console.log(`    integration:    ${f.integration}`);
    console.log(`    componentKey:   ${f.componentKey}`);
    console.log(`    title:          ${f.title || "—"}`);
    console.log(`    reasons:`);
    for (const r of f.reasons) {
      console.log(`      - ${r}`);
    }
    console.log(`    fix in config/pipedream-action-overrides.mjs:`);
    console.log(`      "${f.componentKey}": {`);
    console.log(`        hiddenProps: ["${f.prop}"],`);
    console.log(`        safeDefaults: { ${f.prop}: <value> },`);
    console.log(`      }`);
    console.log();
  }

  if (STRICT) {
    console.log(`Exiting non-zero because --strict is set.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
