import type { IntegrationTool } from "../../../worker/integrations/base";
import { pipedreamToolManifests } from "@/generated/pipedream-manifests";
import type { PipedreamActionToolManifest } from "./manifest-types";

let cachedTools: IntegrationTool[] | null = null;
let cachedByName: Map<string, IntegrationTool> | null = null;

function buildTool(manifest: PipedreamActionToolManifest): IntegrationTool {
  return {
    integration: manifest.integration,
    name: manifest.name,
    description: manifest.description,
    inputSchema: manifest.inputSchema,
    outputSchema: manifest.outputSchema,
    accessLevel: manifest.accessLevel,
    mode: manifest.mode,
    risk: manifest.risk,
    tags: manifest.tags,
    whenToUse: manifest.whenToUse,
    askBefore: manifest.askBefore,
    safeDefaults: manifest.safeDefaults,
    examples: manifest.examples,
    followups: manifest.followups,
    requiresScopes: manifest.requiresScopes,
    idempotent: manifest.idempotent,
    supportsDryRun: manifest.supportsDryRun,
    supportsBatch: manifest.supportsBatch,
    maxBatchSize: manifest.maxBatchSize,
    recommendedTimeoutMs: manifest.recommendedTimeoutMs,
    execution: manifest.execution,
  };
}

function buildCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
  const tools = pipedreamToolManifests
    .map(buildTool)
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    tools,
    byName: new Map(tools.map((tool) => [tool.name, tool])),
  };
}

function ensureCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
  if (cachedTools && cachedByName) {
    return {
      tools: cachedTools,
      byName: cachedByName,
    };
  }

  const built = buildCache();
  cachedTools = built.tools;
  cachedByName = built.byName;
  return built;
}

export function getAllPipedreamManifestTools(): IntegrationTool[] {
  return ensureCache().tools;
}

export function getPipedreamManifestToolByName(toolName: string): IntegrationTool | null {
  return ensureCache().byName.get(toolName) ?? null;
}

export function listPipedreamManifestToolsForIntegration(
  integration: string,
): IntegrationTool[] {
  return getAllPipedreamManifestTools().filter((tool) => tool.integration === integration);
}
