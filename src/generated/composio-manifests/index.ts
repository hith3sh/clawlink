import type { IntegrationTool } from "../../../worker/integrations/base";
import type { ToolMode, ToolRisk } from "../../lib/runtime/tool-runtime";
import manifestData from "./manifests.json";

interface CompactToolData {
  i: string;  // integration
  tk: string; // toolkit
  v: string;  // version
  n: string;  // name
  s: string;  // toolSlug
  m: string;  // mode
  r: string;  // risk
}

function buildToolFromData(data: CompactToolData): IntegrationTool {
  const mode = (data.m === "read" ? "read" : "write") as ToolMode;
  const risk = (data.r === "high_impact" ? "high_impact" : data.r === "safe" ? "safe" : "confirm") as ToolRisk;

  return {
    integration: data.i,
    name: data.n,
    description: "",
    inputSchema: { type: "object", properties: {} },
    outputSchema: undefined,
    accessLevel: mode,
    mode,
    risk,
    tags: ["composio", data.i, mode === "read" ? "read" : "write"],
    whenToUse: [],
    askBefore: risk === "high_impact"
      ? [`This action is destructive and cannot be undone. Confirm before executing ${data.n}.`]
      : mode === "write"
        ? [`Confirm the parameters before executing ${data.n}.`]
        : [],
    safeDefaults: {},
    examples: [],
    followups: [],
    requiresScopes: [],
    idempotent: mode === "read",
    supportsDryRun: false,
    supportsBatch: false,
    execution: {
      kind: "composio_tool",
      toolkit: data.tk,
      toolSlug: data.s,
      version: data.v,
    },
  };
}

export const composioToolManifests: IntegrationTool[] = (manifestData as unknown as CompactToolData[]).map(buildToolFromData);
