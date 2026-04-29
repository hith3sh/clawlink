/**
 * Integration handlers index
 *
 * Import all integrations here to register them
 */

// Import and register handlers
import "./slack";
import "./github";
import "./apollo";
import "./postiz";
import "./google-sheets";
import "./motion";
import "./twilio";
// import "./stripe";
// etc.

import {
  getAllPipedreamManifestTools,
  getPipedreamManifestToolByName,
  listPipedreamManifestToolsForIntegration,
} from "../../src/lib/pipedream/manifest-registry";
import { getAllHandlers, getIntegrationHandler } from "./base";
import type { IntegrationTool } from "./base";

export {
  classifyIntegrationError,
  defineTool,
  getIntegrationHandler,
  getAllHandlers,
  isAuthenticationFailure,
  registerHandler,
} from "./base";
export type {
  IntegrationHandler,
  IntegrationTool,
  IntegrationToolExample,
  ToolAccessLevel,
} from "./base";

function sortTools(tools: IntegrationTool[]): IntegrationTool[] {
  return [...tools].sort((left, right) => left.name.localeCompare(right.name));
}

function mergeTools(
  primary: IntegrationTool[],
  secondary: IntegrationTool[],
): IntegrationTool[] {
  const merged = new Map<string, IntegrationTool>();

  for (const tool of primary) {
    merged.set(tool.name, tool);
  }

  for (const tool of secondary) {
    if (!merged.has(tool.name)) {
      merged.set(tool.name, tool);
    }
  }

  return sortTools(Array.from(merged.values()));
}

export function listHandlerToolsForIntegration(integration: string): IntegrationTool[] {
  const handler = getIntegrationHandler(integration);

  if (!handler?.getTools) {
    return [];
  }

  return sortTools(handler.getTools(integration));
}

export function listManifestToolsForIntegration(integration: string): IntegrationTool[] {
  return sortTools(listPipedreamManifestToolsForIntegration(integration));
}

export function listRegisteredToolsForIntegration(integration: string): IntegrationTool[] {
  return mergeTools(
    listHandlerToolsForIntegration(integration),
    listManifestToolsForIntegration(integration),
  );
}

export function getAllRegisteredTools(): IntegrationTool[] {
  const handlerTools: IntegrationTool[] = [];

  for (const [integration, handler] of getAllHandlers().entries()) {
    if (!handler?.getTools) {
      continue;
    }

    handlerTools.push(...handler.getTools(integration));
  }

  return mergeTools(handlerTools, getAllPipedreamManifestTools());
}

export function getRegisteredToolByName(toolName: string): IntegrationTool | undefined {
  const [integration] = toolName.split("_");

  if (integration) {
    const scoped = listRegisteredToolsForIntegration(integration).find(
      (tool) => tool.name === toolName,
    );

    if (scoped) {
      return scoped;
    }
  }

  return getPipedreamManifestToolByName(toolName) ?? undefined;
}
