/**
 * Integration tool registry index
 *
 * Import custom handler exceptions here and merge them with generated manifests.
 */

// Postiz is the only remaining custom handler. New integrations use generated
// Pipedream manifests instead of per-provider handler modules.
import "./postiz";

import {
  getAllPipedreamManifestTools,
  getPipedreamManifestToolByName,
  listPipedreamManifestToolsForIntegration,
} from "../../src/lib/pipedream/manifest-registry";
import {
  getAllComposioManifestTools,
  getComposioManifestToolByName,
  listComposioManifestToolsForIntegration,
} from "../../src/lib/composio/manifest-registry";
import { getAllHandlers, getIntegrationHandler } from "./base";
import type { IntegrationTool } from "./base";

const disabledPipedreamManifestIntegrations = new Set(["instantly", "outlook", "apollo", "postiz", "gmail", "google-search-console", "google-docs", "google-analytics", "onedrive", "google-ads", "hubspot", "google-calendar", "klaviyo", "airtable", "calendly", "clickup", "mailchimp", "notion", "salesforce", "xero", "twilio", "facebook", "linkedin", "youtube", "shopify", "sendgrid", "resend", "instagram", "google-drive", "google-sheets", "slack"]);

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

function filterEnabledPipedreamTools(tools: IntegrationTool[]): IntegrationTool[] {
  return tools.filter((tool) => !disabledPipedreamManifestIntegrations.has(tool.integration));
}

export function listHandlerToolsForIntegration(integration: string): IntegrationTool[] {
  const handler = getIntegrationHandler(integration);

  if (!handler?.getTools) {
    return [];
  }

  return sortTools(handler.getTools(integration));
}

export function listManifestToolsForIntegration(integration: string): IntegrationTool[] {
  return mergeTools(
    listPipedreamToolsForIntegration(integration),
    listComposioManifestToolsForIntegration(integration),
  );
}

export function listPipedreamToolsForIntegration(integration: string): IntegrationTool[] {
  if (disabledPipedreamManifestIntegrations.has(integration)) {
    return [];
  }

  return sortTools(listPipedreamManifestToolsForIntegration(integration));
}

export function listComposioToolsForIntegration(integration: string): IntegrationTool[] {
  return sortTools(listComposioManifestToolsForIntegration(integration));
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

  return mergeTools(
    mergeTools(handlerTools, filterEnabledPipedreamTools(getAllPipedreamManifestTools())),
    getAllComposioManifestTools(),
  );
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

  const pipedreamTool = getPipedreamManifestToolByName(toolName);

  if (pipedreamTool && !disabledPipedreamManifestIntegrations.has(pipedreamTool.integration)) {
    return pipedreamTool;
  }

  return getComposioManifestToolByName(toolName) ?? undefined;
}
