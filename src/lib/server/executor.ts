import "server-only";

import {
  getDatabase,
  getEnvBinding,
  type D1LikeDatabase,
} from "@/lib/server/integration-store";
import {
  describeRoutedTool,
  routeToolRequest,
  type RouteDecision,
} from "@/lib/server/router";
import { evaluateToolPolicy } from "@/lib/server/policy";
import type { ToolDescription } from "@/lib/server/tool-registry";
import { logToolExecution } from "@/lib/server/tool-execution-log";
import type {
  ExecutionMode,
  ToolExecutionMeta,
  ToolExecutionResult,
} from "@/lib/runtime/tool-runtime";
import { executePipedreamActionTool } from "@/lib/pipedream/action-executor";
import {
  classifyIntegrationError,
  getAllHandlers,
  isAuthenticationFailure,
} from "../../../worker/integrations";
import {
  loadConnectionCredentialsForIntegration,
  markConnectionNeedsReauthForIntegration,
  recordConnectionExecutionFailure,
  recordConnectionExecutionSuccess,
  refreshCredentialsForIntegration,
  updateConnectionExecutionMetadata,
  type CredentialBridgeEnv,
} from "../../../worker/credentials";

interface ToolSchema {
  type?: string;
  properties?: Record<string, ToolSchema>;
  required?: string[];
  items?: ToolSchema;
  enum?: unknown[];
}

export interface ExecuteToolRequest {
  userId: string;
  toolName: string;
  args: Record<string, unknown>;
  connectionId?: number;
  mode?: ExecutionMode;
  confirmed?: boolean;
  flowId?: string;
  stepId?: string;
}

export interface ToolExecutionPayload<T = unknown> extends ToolExecutionResult<T> {
  tool: ToolDescription | null;
  args: Record<string, unknown>;
  result?: T;
  details?: string[];
  requiresConfirmation?: boolean;
  policyReason?: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getCredentialBridgeEnv(): CredentialBridgeEnv | null {
  const db = getDatabase();

  if (!db) {
    return null;
  }

  return {
    DB: db,
    CREDENTIALS: getEnvBinding("CREDENTIALS") as CredentialBridgeEnv["CREDENTIALS"],
    CREDENTIAL_ENCRYPTION_KEY: getEnvBinding<string>("CREDENTIAL_ENCRYPTION_KEY"),
    NANGO_BASE_URL: getEnvBinding<string>("NANGO_BASE_URL"),
    NANGO_SECRET_KEY: getEnvBinding<string>("NANGO_SECRET_KEY"),
    NANGO_PROVIDER_CONFIG_KEYS: getEnvBinding<string>("NANGO_PROVIDER_CONFIG_KEYS"),
    PIPEDREAM_BASE_URL: getEnvBinding<string>("PIPEDREAM_BASE_URL"),
    PIPEDREAM_CLIENT_ID: getEnvBinding<string>("PIPEDREAM_CLIENT_ID"),
    PIPEDREAM_CLIENT_SECRET: getEnvBinding<string>("PIPEDREAM_CLIENT_SECRET"),
    PIPEDREAM_PROJECT_ID: getEnvBinding<string>("PIPEDREAM_PROJECT_ID"),
    PIPEDREAM_ENVIRONMENT: getEnvBinding<string>("PIPEDREAM_ENVIRONMENT"),
  };
}

function mergeWithDefaults(
  defaults: Record<string, unknown>,
  input: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...defaults };

  for (const [key, value] of Object.entries(input)) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = mergeWithDefaults(
        result[key] as Record<string, unknown>,
        value,
      );
      continue;
    }

    result[key] = value;
  }

  return result;
}

function coerceArgsToSchema(
  value: unknown,
  schema: ToolSchema | undefined,
): unknown {
  if (!schema) {
    return value;
  }

  if (schema.type === "array") {
    if (value === undefined || value === null) {
      return value;
    }

    if (!Array.isArray(value)) {
      const wrapped = [value];
      return wrapped.map((item) => coerceArgsToSchema(item, schema.items));
    }

    return value.map((item) => coerceArgsToSchema(item, schema.items));
  }

  if (schema.type === "object" && isPlainObject(value)) {
    const properties = schema.properties ?? {};
    const result: Record<string, unknown> = { ...value };
    for (const [key, propertySchema] of Object.entries(properties)) {
      if (result[key] !== undefined) {
        result[key] = coerceArgsToSchema(result[key], propertySchema);
      }
    }
    return result;
  }

  return value;
}

function validateValue(
  value: unknown,
  schema: ToolSchema | undefined,
  path: string,
  errors: string[],
): void {
  if (!schema) {
    return;
  }

  if (schema.enum && !schema.enum.some((option) => option === value)) {
    errors.push(`${path} must be one of: ${schema.enum.join(", ")}`);
    return;
  }

  switch (schema.type) {
    case "string":
      if (typeof value !== "string") {
        errors.push(`${path} must be a string`);
      }
      return;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        errors.push(`${path} must be a finite number`);
      }
      return;
    case "boolean":
      if (typeof value !== "boolean") {
        errors.push(`${path} must be a boolean`);
      }
      return;
    case "array":
      if (!Array.isArray(value)) {
        errors.push(`${path} must be an array`);
        return;
      }

      value.forEach((item, index) => validateValue(item, schema.items, `${path}[${index}]`, errors));
      return;
    case "object": {
      if (!isPlainObject(value)) {
        errors.push(`${path} must be an object`);
        return;
      }

      const properties = schema.properties ?? {};
      const required = schema.required ?? [];

      for (const requiredKey of required) {
        if (value[requiredKey] === undefined) {
          errors.push(`${path}.${requiredKey} is required`);
        }
      }

      for (const [property, propertySchema] of Object.entries(properties)) {
        if (value[property] !== undefined) {
          validateValue(value[property], propertySchema, `${path}.${property}`, errors);
        }
      }

      return;
    }
    default:
      return;
  }
}

function validateToolArguments(
  schema: Record<string, unknown>,
  args: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  validateValue(args, schema as ToolSchema, "arguments", errors);
  return errors;
}

function toMeta(startedAt: number, requestId: string, providerRequestId?: string): ToolExecutionMeta {
  const endedAt = Date.now();

  return {
    startedAt: new Date(startedAt).toISOString(),
    endedAt: new Date(endedAt).toISOString(),
    durationMs: endedAt - startedAt,
    requestId,
    providerRequestId,
  };
}

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: "unserializable_payload" });
  }
}

async function describeDecisionTool(
  userId: string,
  decision: RouteDecision,
): Promise<ToolDescription | null> {
  if (!("tool" in decision)) {
    return null;
  }

  return describeRoutedTool(userId, decision.tool);
}

async function logExecutionResult(
  db: D1LikeDatabase,
  request: ExecuteToolRequest,
  payload: ToolExecutionPayload,
): Promise<void> {
  await logToolExecution(db, {
    id: payload.meta.requestId,
    userId: request.userId,
    flowId: request.flowId ?? null,
    stepId: request.stepId ?? null,
    integration: payload.integration,
    toolName: payload.toolName,
    connectionId: payload.connectionId,
    executionMode: payload.mode,
    status: payload.ok ? "success" : "error",
    error: payload.error ?? null,
    requestJson: safeJsonStringify({
      args: request.args,
      connectionId: request.connectionId ?? null,
      confirmed: request.confirmed ?? false,
    }),
    responseJson: payload.ok ? safeJsonStringify(payload.data ?? payload.result ?? null) : null,
    latencyMs: payload.meta.durationMs,
    providerRequestId: payload.meta.providerRequestId ?? null,
  });
}

async function buildDecisionFailurePayload(
  request: ExecuteToolRequest,
  decision: Exclude<RouteDecision, { kind: "execute_direct" }>,
  requestId: string,
  startedAt: number,
): Promise<ToolExecutionPayload> {
  const tool = await describeDecisionTool(request.userId, decision);
  const base = {
    ok: false,
    toolName: "tool" in decision ? decision.tool.name : request.toolName,
    integration:
      "tool" in decision ? decision.tool.integration : request.toolName.split("_")[0] ?? "unknown",
    connectionId:
      "connectionId" in decision ? decision.connectionId : null,
    mode: request.mode ?? "direct",
    tool,
    args: request.args,
    requiresConfirmation: decision.kind === "needs_confirmation",
    policyReason:
      decision.kind === "needs_confirmation"
        ? evaluateToolPolicy({
            tool: decision.tool,
            confirmed: false,
          }).reason
        : undefined,
    meta: toMeta(startedAt, requestId),
  } satisfies Omit<ToolExecutionPayload, "error">;

  switch (decision.kind) {
    case "tool_not_found":
      return {
        ...base,
        error: {
          type: "unknown",
          code: "tool_not_found",
          message: "Tool not found",
          retryable: false,
        },
        details: decision.suggestions,
      };
    case "needs_connection":
      return {
        ...base,
        integration: decision.integration,
        error: {
          type: "auth",
          code: "needs_connection",
          message: `No ${decision.integration} connection is available. Connect it first.`,
          retryable: false,
        },
      };
    case "needs_reauth":
      return {
        ...base,
        error: {
          type: "reauth_required",
          code: "needs_reauth",
          message: `Connection ${decision.connectionId} needs to be reconnected before ${decision.tool.name} can run.`,
          retryable: false,
        },
      };
    case "needs_scope_upgrade":
      return {
        ...base,
        error: {
          type: "missing_scopes",
          code: "needs_scope_upgrade",
          message: `Connection ${decision.connectionId} is missing required scopes for ${decision.tool.name}.`,
          retryable: false,
        },
        details: decision.missingScopes,
      };
    case "ambiguous_connection":
      return {
        ...base,
        error: {
          type: "unknown",
          code: "ambiguous_connection",
          message: `Multiple ${decision.integration} connections match this request. Specify a connectionId.`,
          retryable: false,
        },
        details: decision.options.map((option) => String(option.id)),
      };
    case "needs_confirmation":
      return {
        ...base,
        error: {
          type: "unknown",
          code: "confirmation_required",
          message: `${decision.tool.name} requires explicit confirmation before execution.`,
          retryable: false,
        },
      };
  }
}

export async function executeToolForUser(
  request: ExecuteToolRequest,
): Promise<ToolExecutionPayload> {
  const db = getDatabase();
  const env = getCredentialBridgeEnv();
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const mode = request.mode ?? "direct";

  if (!db || !env) {
    throw new Error("DB binding is not configured");
  }

  const decision = await routeToolRequest({
    userId: request.userId,
    toolName: request.toolName,
    preferredConnectionId: request.connectionId,
    args: request.args,
    confirmed: request.confirmed === true || mode === "preview",
  });

  if (decision.kind !== "execute_direct") {
    const payload = await buildDecisionFailurePayload(request, decision, requestId, startedAt);
    await logExecutionResult(db, request, payload);
    return payload;
  }

  const tool = describeRoutedTool(request.userId, decision.tool);
  const describedTool = await tool;
  const policy = evaluateToolPolicy({
    tool: decision.tool,
    confirmed: request.confirmed,
    executionMode: mode,
  });
  const mergedArgs = coerceArgsToSchema(
    mergeWithDefaults(decision.tool.safeDefaults, request.args),
    decision.tool.inputSchema as ToolSchema,
  ) as Record<string, unknown>;
  const validationErrors = validateToolArguments(decision.tool.inputSchema, mergedArgs);

  if (validationErrors.length > 0) {
    const payload: ToolExecutionPayload = {
      ok: false,
      toolName: decision.tool.name,
      integration: decision.tool.integration,
      connectionId: decision.connectionId,
      mode,
      tool: describedTool,
      args: mergedArgs,
      requiresConfirmation: policy.requiresConfirmation,
      policyReason: policy.reason,
      error: {
        type: "validation",
        code: "invalid_arguments",
        message: validationErrors[0] ?? "Invalid tool arguments",
        retryable: false,
      },
      details: validationErrors,
      meta: toMeta(startedAt, requestId),
    };
    await logExecutionResult(db, request, payload);
    return payload;
  }

  if (mode === "preview") {
    const payload: ToolExecutionPayload = {
      ok: true,
      toolName: decision.tool.name,
      integration: decision.tool.integration,
      connectionId: decision.connectionId,
      mode,
      tool: describedTool,
      args: mergedArgs,
      requiresConfirmation: policy.requiresConfirmation,
      policyReason: policy.reason,
      data: {
        preview: true,
        willExecute: false,
        confirmationRequired: evaluateToolPolicy({
          tool: decision.tool,
          executionMode: "preview",
        }).requiresConfirmation,
        connectionId: decision.connectionId,
        tool: decision.tool.name,
        policyReason: policy.reason,
      },
      meta: toMeta(startedAt, requestId),
    };
    await logExecutionResult(db, request, payload);
    return payload;
  }

  const action = decision.tool.name.startsWith(`${decision.tool.integration}_`)
    ? decision.tool.name.slice(decision.tool.integration.length + 1)
    : decision.tool.name;
  const handler =
    decision.tool.execution.kind === "custom"
      ? getAllHandlers().get(decision.tool.integration)
      : null;

  if (decision.tool.execution.kind === "custom" && !handler) {
    throw new Error(`No handler registered for ${decision.tool.integration}`);
  }

  let resolvedConnectionId = decision.connectionId;

  try {
    const loaded = await loadConnectionCredentialsForIntegration(
      env,
      request.userId,
      decision.tool.integration,
      { connectionId: decision.connectionId },
    );
    resolvedConnectionId = loaded.connectionId;
    let currentCredentials = loaded.credentials;
    let providerRequestId: string | undefined;

    const runTool = async (
      credentials: Record<string, string>,
    ): Promise<unknown> => {
      if (decision.tool.execution.kind === "pipedream_action") {
        const execution = await executePipedreamActionTool(
          decision.tool,
          mergedArgs,
          {
            requestId,
            externalUserId: request.userId,
            credentials,
            env,
          },
        );
        providerRequestId = execution.providerRequestId;
        return execution.data;
      }

      return handler!.execute(action, mergedArgs, credentials, {
        requestId,
        dryRun: false,
        timeoutMs: decision.tool.recommendedTimeoutMs,
        connectionId: resolvedConnectionId,
        userId: request.userId,
        env,
      });
    };

    try {
      const result = await runTool(currentCredentials);

      await recordConnectionExecutionSuccess(env, resolvedConnectionId);

      if (handler && typeof handler.checkHealth === "function") {
        const health = await handler.checkHealth(currentCredentials);
        await updateConnectionExecutionMetadata(env, resolvedConnectionId, {
          scopes: health.scopes ?? null,
        });
      }

      const payload: ToolExecutionPayload = {
        ok: true,
        toolName: decision.tool.name,
        integration: decision.tool.integration,
        connectionId: resolvedConnectionId,
        mode,
        tool: describedTool,
        args: mergedArgs,
        requiresConfirmation: policy.requiresConfirmation,
        policyReason: policy.reason,
        data: result,
        result,
        meta: toMeta(startedAt, requestId, providerRequestId),
      };
      await logExecutionResult(db, request, payload);
      return payload;
    } catch (error) {
      if (!isAuthenticationFailure(error)) {
        throw error;
      }

      const refreshed = await refreshCredentialsForIntegration(
        env,
        request.userId,
        decision.tool.integration,
        { connectionId: resolvedConnectionId },
      );
      resolvedConnectionId = refreshed.connectionId;
      currentCredentials = refreshed.credentials;

      try {
        const result = await runTool(currentCredentials);

        await recordConnectionExecutionSuccess(env, resolvedConnectionId);

        if (handler && typeof handler.checkHealth === "function") {
          const health = await handler.checkHealth(currentCredentials);
          await updateConnectionExecutionMetadata(env, resolvedConnectionId, {
            scopes: health.scopes ?? null,
          });
        }

        const payload: ToolExecutionPayload = {
          ok: true,
          toolName: decision.tool.name,
          integration: decision.tool.integration,
          connectionId: resolvedConnectionId,
          mode,
          tool: describedTool,
          args: mergedArgs,
          requiresConfirmation: policy.requiresConfirmation,
          policyReason: policy.reason,
          data: result,
          result,
          meta: toMeta(startedAt, requestId, providerRequestId),
        };
        await logExecutionResult(db, request, payload);
        return payload;
      } catch (retryError) {
        if (isAuthenticationFailure(retryError)) {
          const detail =
            retryError instanceof Error
              ? retryError.message
              : `Authentication failed after refreshing ${decision.tool.integration} credentials.`;
          await markConnectionNeedsReauthForIntegration(
            env,
            request.userId,
            decision.tool.integration,
            detail,
            { connectionId: resolvedConnectionId },
          );
        }

        throw retryError;
      }
    }
  } catch (error) {
    const classified = classifyIntegrationError(error);

    if (resolvedConnectionId) {
      await recordConnectionExecutionFailure(env, resolvedConnectionId, classified);
    }

    const payload: ToolExecutionPayload = {
      ok: false,
      toolName: decision.tool.name,
      integration: decision.tool.integration,
      connectionId: resolvedConnectionId,
      mode,
      tool: describedTool,
      args: mergedArgs,
      requiresConfirmation: policy.requiresConfirmation,
      policyReason: policy.reason,
      error: classified,
      meta: toMeta(startedAt, requestId),
    };
    await logExecutionResult(db, request, payload);
    return payload;
  }
}

export async function previewToolForUser(
  request: Omit<ExecuteToolRequest, "mode">,
): Promise<ToolExecutionPayload> {
  return executeToolForUser({
    ...request,
    mode: "preview",
  });
}
