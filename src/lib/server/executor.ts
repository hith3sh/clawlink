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
import {
  buildValidationHint,
  prepareToolArguments,
} from "@/lib/tool-arguments";
import { evaluateToolPolicy } from "@/lib/server/policy";
import type { ToolDescription } from "@/lib/server/tool-registry";
import { logToolExecution } from "@/lib/server/tool-execution-log";
import type {
  ExecutionMode,
  ToolExecutionMeta,
  ToolExecutionResult,
} from "@/lib/runtime/tool-runtime";
import { executeComposioTool } from "@/lib/composio/tool-executor";
import { isStubSchema } from "@/lib/composio/schema-cache";
import { detectPlaceholderArgs, validateFieldArgs } from "@/lib/server/arg-guards";
import {
  collectFileUploadablePaths,
  resolveFileUploadables,
  type FileUploadAttachment,
  type UploadedFileMetadata,
} from "@/lib/server/file-upload-relay";
import {
  classifyIntegrationError,
  getAllHandlers,
  isAuthenticationFailure,
} from "../../../worker/integrations";
import { IntegrationRequestError } from "../../../worker/integrations/base";
import {
  loadConnectionCredentialsForIntegration,
  markConnectionNeedsReauthForIntegration,
  recordConnectionExecutionFailure,
  recordConnectionExecutionSuccess,
  refreshCredentialsForIntegration,
  updateConnectionExecutionMetadata,
  type CredentialBridgeEnv,
} from "../../../worker/credentials";

export interface ExecuteToolRequest {
  userId: string;
  toolName: string;
  args: Record<string, unknown>;
  connectionId?: number;
  mode?: ExecutionMode;
  confirmed?: boolean;
  flowId?: string;
  stepId?: string;
  /**
   * Optional file attachments for tools whose schema declares
   * `file_uploadable: true` properties. The OpenClaw plugin (>= 0.2.0) walks
   * the agent's arguments and includes one entry per FileUploadable shape
   * found, with `pointer` matching the FileUploadable's s3key value. The
   * executor's relay stage uploads each file to Composio and rewrites the
   * matching s3key argument before forwarding to the upstream tool.
   */
  files?: FileUploadAttachment[];
}

export interface ToolExecutionPayload<T = unknown> extends ToolExecutionResult<T> {
  tool: ToolDescription | null;
  args: Record<string, unknown>;
  result?: T;
  details?: string[];
  requiresConfirmation?: boolean;
  policyReason?: string;
  missingFields?: string[];
  invalidFields?: string[];
  inputSchema?: Record<string, unknown>;
  hint?: string;
  /**
   * Metadata for any FileUploadable arguments that were resolved through the
   * Composio file-upload relay. Populated when the tool's hydrated schema
   * declared `file_uploadable: true` paths AND the agent attached matching
   * bytes via the request's `files` envelope. Empty/absent otherwise.
   */
  uploadedFiles?: UploadedFileMetadata[];
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
    COMPOSIO_API_KEY: getEnvBinding<string>("COMPOSIO_API_KEY"),
    COMPOSIO_BASE_URL: getEnvBinding<string>("COMPOSIO_BASE_URL"),
    COMPOSIO_TOOLKIT_MAP: getEnvBinding<string>("COMPOSIO_TOOLKIT_MAP"),
    COMPOSIO_AUTH_CONFIG_MAP: getEnvBinding<string>("COMPOSIO_AUTH_CONFIG_MAP"),
    COMPOSIO_TOOLKIT_VERSION_MAP: getEnvBinding<string>("COMPOSIO_TOOLKIT_VERSION_MAP"),
  };
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

const MAX_TRANSIENT_RETRIES = 2;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryTransientExecution(error: unknown): boolean {
  const classified = classifyIntegrationError(error);

  if (!classified.retryable) {
    return false;
  }

  return (
    classified.type === "rate_limit" ||
    classified.type === "provider" ||
    classified.type === "network"
  );
}

function getTransientRetryDelayMs(attempt: number, error: unknown): number {
  const classified = classifyIntegrationError(error);
  const baseDelayMs = classified.type === "rate_limit" ? 1000 : 500;
  return baseDelayMs * 2 ** (attempt - 1);
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
      filePointers: request.files?.map((file) => ({
        pointer: file.pointer,
        name: file.name,
        mimetype: file.mimetype,
        md5: file.md5,
      })) ?? [],
      uploadedFiles: payload.uploadedFiles ?? [],
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
    case "tool_not_found": {
      const requested = request.toolName ? `'${request.toolName}'` : "the requested tool";
      const suggestionMessage =
        decision.suggestions.length > 0
          ? ` Did you mean: ${decision.suggestions.slice(0, 3).map((s) => `'${s}'`).join(", ")}?`
          : "";
      return {
        ...base,
        error: {
          type: "unknown",
          code: "tool_not_found",
          message: `Tool ${requested} not found.${suggestionMessage}`,
          retryable: false,
        },
        details: decision.suggestions,
        hint:
          decision.suggestions.length > 0
            ? `Retry with one of: ${decision.suggestions.slice(0, 3).join(", ")}.`
            : "Use `clawlink_search_tools` to discover available tool names.",
      };
    }
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

  // Guard: a Composio tool whose schema was never hydrated would forward
  // unvalidated args to Composio and trip a confusing pydantic "field required"
  // error from inside Mercury — refuse and surface a retryable error instead.
  // Use the explicit `schemaHydrated` flag rather than `isStubSchema` because
  // genuinely parameterless tools (e.g. LINKEDIN_GET_MY_INFO) have a hydrated
  // schema indistinguishable from the static stub.
  if (
    decision.tool.execution.kind === "composio_tool" &&
    !decision.tool.schemaHydrated &&
    isStubSchema(decision.tool.inputSchema)
  ) {
    const payload: ToolExecutionPayload = {
      ok: false,
      toolName: decision.tool.name,
      integration: decision.tool.integration,
      connectionId: decision.connectionId,
      mode,
      tool: describedTool,
      args: request.args,
      requiresConfirmation: policy.requiresConfirmation,
      policyReason: policy.reason,
      error: {
        type: "provider",
        code: "schema_unavailable",
        message: `Tool schema for ${decision.tool.name} is not loaded yet. Retry the call in a moment.`,
        retryable: true,
      },
      meta: toMeta(startedAt, requestId),
    };
    await logExecutionResult(db, request, payload);
    return payload;
  }

  const preparedArgs = prepareToolArguments({
    toolName: decision.tool.name,
    schema: decision.tool.inputSchema,
    defaults: decision.tool.safeDefaults,
    args: request.args,
  });
  let mergedArgs = preparedArgs.args;

  if (preparedArgs.errors.length > 0) {
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
        message: preparedArgs.errors[0] ?? "Invalid tool arguments",
        retryable: false,
      },
      details: preparedArgs.errors,
      missingFields: preparedArgs.missingFields,
      invalidFields: preparedArgs.invalidFields,
      inputSchema: decision.tool.inputSchema,
      hint: preparedArgs.hint,
      meta: toMeta(startedAt, requestId),
    };
    await logExecutionResult(db, request, payload);
    return payload;
  }

  const placeholderCheck = detectPlaceholderArgs(decision.tool.name, mergedArgs);
  if (placeholderCheck.errors.length > 0) {
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
        code: "placeholder_argument",
        message: placeholderCheck.errors[0],
        retryable: false,
      },
      details: placeholderCheck.errors,
      missingFields: placeholderCheck.missingFields,
      invalidFields: placeholderCheck.invalidFields,
      inputSchema: decision.tool.inputSchema,
      hint: placeholderCheck.hint,
      meta: toMeta(startedAt, requestId),
    };
    await logExecutionResult(db, request, payload);
    return payload;
  }

  const composioToolSlug =
    decision.tool.execution.kind === "composio_tool"
      ? decision.tool.execution.toolSlug
      : undefined;
  const fieldValidatorCheck = validateFieldArgs(
    composioToolSlug,
    decision.tool.name,
    mergedArgs,
  );
  if (fieldValidatorCheck.errors.length > 0) {
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
        code: "invalid_field_value",
        message: fieldValidatorCheck.errors[0],
        retryable: false,
      },
      details: fieldValidatorCheck.errors,
      missingFields: fieldValidatorCheck.missingFields,
      invalidFields: fieldValidatorCheck.invalidFields,
      inputSchema: decision.tool.inputSchema,
      hint: fieldValidatorCheck.hint,
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

  // File-upload relay: when the tool's hydrated schema declares any
  // `file_uploadable: true` paths and the agent's args contain a
  // FileUploadable shape there, upload the bytes attached on the request's
  // `files` envelope to Composio's `/files/upload/request` endpoint and
  // rewrite the s3key with the returned Apollo key. This converts an
  // OpenClaw-local path (which Mercury cannot resolve) into a real Composio
  // storage reference before forwarding the tool call. No-op when the schema
  // has no uploadable paths, when the args have no FileUploadable shapes, or
  // when every shape already carries an Apollo-key s3key (idempotent against
  // retry).
  let uploadedFiles: UploadedFileMetadata[] = [];
  if (
    decision.tool.execution.kind === "composio_tool" &&
    decision.tool.schemaHydrated === true &&
    collectFileUploadablePaths(decision.tool.inputSchema).length > 0
  ) {
    try {
      const composioExecution = decision.tool.execution;
      const runRelayWithRetries = async () => {
        let attempt = 0;

        while (true) {
          try {
            return await resolveFileUploadables({
              toolSlug: composioExecution.toolSlug,
              toolkitSlug: composioExecution.toolkit,
              args: mergedArgs,
              files: request.files ?? [],
              schema: decision.tool.inputSchema,
              env,
            });
          } catch (error) {
            if (attempt >= MAX_TRANSIENT_RETRIES || !shouldRetryTransientExecution(error)) {
              throw error;
            }

            attempt += 1;
            await sleep(getTransientRetryDelayMs(attempt, error));
          }
        }
      };

      const relayResult = await runRelayWithRetries();
      mergedArgs = relayResult.rewrittenArgs;
      uploadedFiles = relayResult.uploadedFiles;
    } catch (error) {
      const classified = classifyIntegrationError(error);
      const requestErr = error instanceof IntegrationRequestError ? error : null;
      const isValidationError = classified.type === "validation";
      const validationDetails = isValidationError ? [classified.message] : undefined;
      const validationHint = isValidationError
        ? requestErr?.hint ?? buildValidationHint(
            decision.tool.name,
            requestErr?.missingFields ?? [],
            requestErr?.invalidFields ?? [],
          )
        : undefined;

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
        error: classified,
        ...(isValidationError && {
          details: validationDetails,
          missingFields: requestErr?.missingFields,
          invalidFields: requestErr?.invalidFields,
          inputSchema: decision.tool.inputSchema,
          hint: validationHint,
        }),
        meta: toMeta(startedAt, requestId),
      };
      await logExecutionResult(db, request, payload);
      return payload;
    }
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
      if (decision.tool.execution.kind === "composio_tool") {
        const execution = await executeComposioTool(
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

    const runToolWithRetries = async (
      credentials: Record<string, string>,
    ): Promise<unknown> => {
      let attempt = 0;

      while (true) {
        try {
          return await runTool(credentials);
        } catch (error) {
          if (attempt >= MAX_TRANSIENT_RETRIES || !shouldRetryTransientExecution(error)) {
            throw error;
          }

          attempt += 1;
          await sleep(getTransientRetryDelayMs(attempt, error));
        }
      }
    };

    try {
      const result = await runToolWithRetries(currentCredentials);

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
        ...(uploadedFiles.length > 0 && { uploadedFiles }),
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
        const result = await runToolWithRetries(currentCredentials);

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
          ...(uploadedFiles.length > 0 && { uploadedFiles }),
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

    const requestErr = error instanceof IntegrationRequestError ? error : null;
    const isValidationError = classified.type === "validation";
    const isConfigurationError = classified.type === "configuration";
    const validationDetails = isValidationError ? [classified.message] : undefined;
    const validationHint = isValidationError
      ? requestErr?.hint ?? buildValidationHint(
          decision.tool.name,
          requestErr?.missingFields ?? [],
          requestErr?.invalidFields ?? [],
        )
      : undefined;

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
      ...(isValidationError && {
        details: validationDetails,
        missingFields: requestErr?.missingFields,
        invalidFields: requestErr?.invalidFields,
        inputSchema: decision.tool.inputSchema,
        hint: validationHint,
      }),
      ...(isConfigurationError && {
        details: [classified.message],
        hint: requestErr?.hint,
      }),
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
