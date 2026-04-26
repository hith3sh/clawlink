import { PipedreamError } from "@pipedream/sdk";
import type { IntegrationTool } from "../../../worker/integrations/base";
import { IntegrationRequestError } from "../../../worker/integrations/base";
import type { PipedreamActionExecutionSpec, PipedreamToolProp } from "./manifest-types";
import { getPipedreamBackendClient } from "./backend-client";

export interface ExecutePipedreamActionContext {
  requestId: string;
  externalUserId: string;
  credentials: Record<string, string>;
  env?: Record<string, unknown>;
}

export interface ExecutePipedreamActionResult {
  data: unknown;
  providerRequestId?: string;
}

function safeTrim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function stringifyErrorBody(body: unknown): string | null {
  if (typeof body === "string" && body.trim().length > 0) {
    return body.trim();
  }

  if (body && typeof body === "object") {
    const message =
      typeof (body as { message?: unknown }).message === "string"
        ? (body as { message: string }).message
        : typeof (body as { error?: unknown }).error === "string"
          ? (body as { error: string }).error
          : null;

    if (message && message.trim().length > 0) {
      return message.trim();
    }

    try {
      return JSON.stringify(body);
    } catch {
      return null;
    }
  }

  return null;
}

function normalizeLabelValue(value: unknown): unknown {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "__lv" in value
  ) {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "label" in value &&
    "value" in value
  ) {
    const label = (value as { label?: unknown }).label;
    const innerValue = (value as { value?: unknown }).value;

    if (typeof label === "string") {
      return {
        __lv: {
          label,
          value: innerValue,
        },
      };
    }
  }

  return value;
}

function normalizePropValue(prop: PipedreamToolProp, value: unknown): unknown {
  if (prop.withLabel) {
    return normalizeLabelValue(value);
  }

  return value;
}

function buildConfiguredProps(
  execution: PipedreamActionExecutionSpec,
  args: Record<string, unknown>,
  credentials: Record<string, string>,
): Record<string, unknown> {
  const configuredProps: Record<string, unknown> = {};
  const accountId = safeTrim(credentials.pipedreamAccountId);

  for (const prop of execution.props) {
    if (prop.appAuth) {
      if (!accountId) {
        throw new IntegrationRequestError(
          "This connection is missing a Pipedream account binding. Reconnect it and try again.",
          { status: 401, code: "missing_pipedream_account" },
        );
      }

      configuredProps[prop.name] = { authProvisionId: accountId };
      continue;
    }

    if (!(prop.name in args) || args[prop.name] === undefined) {
      continue;
    }

    configuredProps[prop.name] = normalizePropValue(prop, args[prop.name]);
  }

  return configuredProps;
}

function getProviderRequestId(rawResponse: { headers?: Headers }): string | undefined {
  return (
    rawResponse.headers?.get("x-request-id") ??
    rawResponse.headers?.get("request-id") ??
    undefined
  );
}

function ensurePipedreamActionExecution(
  tool: IntegrationTool,
): PipedreamActionExecutionSpec {
  if (tool.execution.kind !== "pipedream_action") {
    throw new Error(`${tool.name} is not a Pipedream action-backed tool.`);
  }

  return tool.execution;
}

export async function executePipedreamActionTool(
  tool: IntegrationTool,
  args: Record<string, unknown>,
  context: ExecutePipedreamActionContext,
): Promise<ExecutePipedreamActionResult> {
  const execution = ensurePipedreamActionExecution(tool);
  const client = getPipedreamBackendClient(context.env);
  const configuredProps = buildConfiguredProps(execution, args, context.credentials);

  try {
    const response = await client.actions
      .run({
        id: execution.componentId,
        version: execution.version,
        externalUserId: context.externalUserId,
        configuredProps,
      })
      .withRawResponse();

    return {
      data: response.data.ret ?? response.data.exports ?? response.data,
      providerRequestId: getProviderRequestId(response.rawResponse),
    };
  } catch (error) {
    if (error instanceof PipedreamError) {
      throw new IntegrationRequestError(
        stringifyErrorBody(error.body) ?? error.message,
        {
          status: error.statusCode ?? 502,
        },
      );
    }

    throw error;
  }
}
