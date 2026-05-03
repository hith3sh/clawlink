import type { IntegrationTool } from "../../../worker/integrations/base";
import type { ComposioToolExecutionSpec } from "../pipedream/manifest-types";
import { IntegrationRequestError } from "../../../worker/integrations/base";
import { executeComposioToolRequest } from "./backend-client";

export interface ExecuteComposioToolContext {
  requestId: string;
  externalUserId: string;
  credentials: Record<string, string>;
  env?: Record<string, unknown>;
}

export interface ExecuteComposioToolResult {
  data: unknown;
  providerRequestId?: string;
}

function safeTrim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function ensureComposioExecution(tool: IntegrationTool): ComposioToolExecutionSpec {
  if (tool.execution.kind !== "composio_tool") {
    throw new Error(`${tool.name} is not a Composio-backed tool.`);
  }

  return tool.execution;
}

export async function executeComposioTool(
  tool: IntegrationTool,
  args: Record<string, unknown>,
  context: ExecuteComposioToolContext,
): Promise<ExecuteComposioToolResult> {
  const execution = ensureComposioExecution(tool);
  const connectedAccountId = safeTrim(context.credentials.composioConnectedAccountId);

  if (!connectedAccountId) {
    throw new IntegrationRequestError(
      "This connection is missing a Composio connected account binding. Reconnect it and try again.",
      { status: 401, code: "missing_composio_connected_account" },
    );
  }

  return executeComposioToolRequest({
    env: context.env,
    toolSlug: execution.toolSlug,
    toolkit: execution.toolkit,
    integrationSlug: tool.integration,
    authConfigId: context.credentials.composioAuthConfigId ?? undefined,
    version: execution.version,
    userId: context.externalUserId,
    connectedAccountId,
    arguments: args,
  });
}
