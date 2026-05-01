import type { IntegrationTool } from "../../../worker/integrations/base";
import { composioToolManifests } from "@/generated/composio-manifests";

let cachedTools: IntegrationTool[] | null = null;
let cachedByName: Map<string, IntegrationTool> | null = null;

function buildCache(): { tools: IntegrationTool[]; byName: Map<string, IntegrationTool> } {
  const tools = composioToolManifests
    .map((tool) => tool)
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

export function getAllComposioManifestTools(): IntegrationTool[] {
  return ensureCache().tools;
}

export function getComposioManifestToolByName(toolName: string): IntegrationTool | null {
  return ensureCache().byName.get(toolName) ?? null;
}

export function listComposioManifestToolsForIntegration(
  integration: string,
): IntegrationTool[] {
  return getAllComposioManifestTools().filter((tool) => tool.integration === integration);
}
