import { IntegrationRequestError } from "../../../worker/integrations/base";

const DEFAULT_BASE_URL = "https://backend.composio.dev/api/v3.1";
const DEFAULT_INSTANTLY_TOOLKIT_VERSION = "20260429_00";

export interface ComposioConfig {
  apiKey: string;
  baseUrl: string;
  toolkit: string;
  authConfigId: string;
  toolkitVersion?: string;
}

export interface CreateComposioConnectLinkParams {
  env?: Record<string, unknown>;
  integrationSlug: string;
  userId: string;
  callbackUrl: string;
  alias?: string | null;
}

export interface ComposioConnectLink {
  linkToken: string | null;
  redirectUrl: string;
  expiresAt: string | null;
  connectedAccountId: string;
}

export interface ComposioConnectedAccountMetadata {
  connectedAccountId: string;
  authConfigId: string;
  toolkit: string;
  connectionLabel: string | null;
  accountLabel: string | null;
  externalAccountId: string;
}

export interface ComposioConnectedAccountDetails extends ComposioConnectedAccountMetadata {
  status: string | null;
  statusReason: string | null;
}

interface ComposioConnectedAccountResponse {
  id?: unknown;
  nanoid?: unknown;
  word_id?: unknown;
  alias?: unknown;
  user_id?: unknown;
  status?: unknown;
  status_reason?: unknown;
  toolkit?: {
    slug?: unknown;
  };
  auth_config?: {
    id?: unknown;
  };
  state?: {
    val?: Record<string, unknown>;
  };
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export interface ExecuteComposioToolParams {
  env?: Record<string, unknown>;
  toolSlug: string;
  toolkit: string;
  version?: string;
  userId: string;
  connectedAccountId: string;
  arguments: Record<string, unknown>;
}

export interface ExecuteComposioToolResult {
  data: unknown;
  providerRequestId?: string;
}

function safeTrim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function humanizeSlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function readNestedAccountString(
  account: ComposioConnectedAccountResponse,
  key: string,
): string | null {
  return (
    safeTrim(account.data?.[key]) ??
    safeTrim(account.params?.[key]) ??
    safeTrim(account.state?.val?.[key]) ??
    null
  );
}

function normalizeBaseUrl(value: unknown): string {
  return (safeTrim(value) ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function parseMap(value: unknown): Map<string, string> {
  const map = new Map<string, string>();
  const raw = safeTrim(value);

  if (!raw) {
    return map;
  }

  for (const pair of raw.split(",")) {
    const [key, ...rest] = pair.split("=");
    const normalizedKey = key?.trim();
    const normalizedValue = rest.join("=").trim();

    if (normalizedKey && normalizedValue) {
      map.set(normalizedKey, normalizedValue);
    }
  }

  return map;
}

function getEnvValue(env: Record<string, unknown> | undefined, key: string): string | null {
  return safeTrim(env?.[key]) ?? safeTrim(process.env[key]);
}

function getSlugEnvKey(prefix: string, slug: string, suffix: string): string {
  return `${prefix}_${slug.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase()}_${suffix}`;
}

export function getComposioConfig(
  env: Record<string, unknown> | undefined,
  integrationSlug: string,
): ComposioConfig {
  const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");

  if (!apiKey) {
    throw new Error("COMPOSIO_API_KEY is not configured.");
  }

  const toolkitMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_MAP"));
  const authConfigMap = parseMap(getEnvValue(env, "COMPOSIO_AUTH_CONFIG_MAP"));
  const versionMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_VERSION_MAP"));
  const authConfigId =
    authConfigMap.get(integrationSlug) ??
    getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "AUTH_CONFIG_ID"));
  const toolkit =
    toolkitMap.get(integrationSlug) ??
    getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT")) ??
    integrationSlug.replace(/-/g, "_");

  if (!authConfigId) {
    throw new Error(`Composio auth config is not configured for ${integrationSlug}.`);
  }

  return {
    apiKey,
    baseUrl: normalizeBaseUrl(getEnvValue(env, "COMPOSIO_BASE_URL")),
    toolkit,
    authConfigId,
    toolkitVersion:
      versionMap.get(integrationSlug) ??
      getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT_VERSION")) ??
      (integrationSlug === "instantly" ? DEFAULT_INSTANTLY_TOOLKIT_VERSION : undefined),
  };
}

interface ParsedComposioValidationError {
  isValidation: boolean;
  missingFields: string[];
  invalidFields: string[];
}

function parseComposioValidationError(message: string): ParsedComposioValidationError {
  const lower = message.toLowerCase();
  const isValidation =
    lower.includes("invalid request data") ||
    lower.includes("validation error") ||
    lower.includes("following fields are missing") ||
    /\bfield required\b/.test(lower) ||
    /\bvalue is not a valid\b/.test(lower);

  const missingFields: string[] = [];
  const invalidFields: string[] = [];

  const missingMatch = message.match(/[Ff]ollowing fields are missing:\s*\{([^}]+)\}/);
  if (missingMatch) {
    for (const raw of missingMatch[1].split(",")) {
      const field = raw.trim().replace(/^['"]|['"]$/g, "");
      if (field && !missingFields.includes(field)) {
        missingFields.push(field);
      }
    }
  }

  for (const match of message.matchAll(/(^|\n)([A-Za-z_][A-Za-z0-9_.]*)\s*\n\s*Field required/g)) {
    const field = match[2];
    if (field && !missingFields.includes(field)) {
      missingFields.push(field);
    }
  }

  for (const match of message.matchAll(/(^|\n)([A-Za-z_][A-Za-z0-9_.]*)\s*\n\s*[Vv]alue is not a valid/g)) {
    const field = match[2];
    if (field && !invalidFields.includes(field)) {
      invalidFields.push(field);
    }
  }

  for (const match of message.matchAll(/on parameter\s+`([A-Za-z_][A-Za-z0-9_.]*)`/g)) {
    const field = match[1];
    if (field && !invalidFields.includes(field)) {
      invalidFields.push(field);
    }
  }

  for (const match of message.matchAll(/parameter\s+'([A-Za-z_][A-Za-z0-9_.]*)'/g)) {
    const field = match[1];
    if (field && !invalidFields.includes(field)) {
      invalidFields.push(field);
    }
  }

  return { isValidation, missingFields, invalidFields };
}

function stringifyComposioError(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const error = (payload as { error?: unknown }).error;

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (error && typeof error === "object") {
    const message = (error as { message?: unknown }).message;
    const suggestedFix = (error as { suggested_fix?: unknown }).suggested_fix;

    if (typeof message === "string" && message.trim()) {
      return typeof suggestedFix === "string" && suggestedFix.trim()
        ? `${message.trim()} ${suggestedFix.trim()}`
        : message.trim();
    }
  }

  const message = (payload as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) {
    return message.trim();
  }

  try {
    return JSON.stringify(payload);
  } catch {
    return fallback;
  }
}

function toComposioRequestError(
  payload: unknown,
  fallback: string,
  status: number,
): IntegrationRequestError {
  const message = stringifyComposioError(payload, fallback);
  const parsed = parseComposioValidationError(message);

  if (parsed.isValidation || status === 400) {
    return new IntegrationRequestError(message, {
      status: 400,
      kind: "validation",
      code: "invalid_arguments",
      missingFields: parsed.missingFields,
      invalidFields: parsed.invalidFields,
    });
  }

  return new IntegrationRequestError(message, { status });
}

async function composioFetch<T>(
  config: Pick<ComposioConfig, "apiKey" | "baseUrl">,
  path: string,
  init: RequestInit,
): Promise<{ data: T; headers: Headers }> {
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      ...init.headers,
    },
  });
  const payload = (await response.json().catch(() => null)) as T;

  if (!response.ok) {
    throw toComposioRequestError(
      payload,
      `${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return { data: payload, headers: response.headers };
}

export async function createComposioConnectLink(
  params: CreateComposioConnectLinkParams,
): Promise<ComposioConnectLink> {
  const config = getComposioConfig(params.env, params.integrationSlug);
  const response = await composioFetch<{
    link_token?: unknown;
    linkToken?: unknown;
    redirect_url?: unknown;
    redirectUrl?: unknown;
    expires_at?: unknown;
    expiresAt?: unknown;
    connected_account_id?: unknown;
    connectedAccountId?: unknown;
  }>(config, "/connected_accounts/link", {
    method: "POST",
    body: JSON.stringify({
      auth_config_id: config.authConfigId,
      user_id: params.userId,
      alias: params.alias ?? undefined,
      callback_url: params.callbackUrl,
    }),
  });

  const redirectUrl =
    safeTrim(response.data.redirect_url) ?? safeTrim(response.data.redirectUrl);
  const connectedAccountId =
    safeTrim(response.data.connected_account_id) ??
    safeTrim(response.data.connectedAccountId);

  if (!redirectUrl) {
    throw new Error("Composio did not return a setup URL.");
  }

  if (!connectedAccountId) {
    throw new Error("Composio did not return a connected account id.");
  }

  return {
    linkToken: safeTrim(response.data.link_token) ?? safeTrim(response.data.linkToken),
    redirectUrl,
    expiresAt: safeTrim(response.data.expires_at) ?? safeTrim(response.data.expiresAt),
    connectedAccountId,
  };
}

export async function getComposioConnectedAccountDetails(params: {
  env?: Record<string, unknown>;
  integrationSlug: string;
  connectedAccountId: string;
  expectedUserId?: string | null;
}): Promise<ComposioConnectedAccountDetails> {
  const config = getComposioConfig(params.env, params.integrationSlug);
  const response = await composioFetch<ComposioConnectedAccountResponse>(
    config,
    `/connected_accounts/${encodeURIComponent(params.connectedAccountId)}`,
    { method: "GET" },
  );
  const connectedAccountId =
    safeTrim(response.data.id) ??
    safeTrim(response.data.nanoid) ??
    params.connectedAccountId;
  const userId = safeTrim(response.data.user_id);

  if (params.expectedUserId && userId && userId !== params.expectedUserId) {
    throw new Error("Composio returned a connected account for a different user.");
  }

  const authConfigId = safeTrim(response.data.auth_config?.id) ?? config.authConfigId;
  const toolkit = safeTrim(response.data.toolkit?.slug) ?? config.toolkit;
  const fallbackLabel = `${humanizeSlug(params.integrationSlug)} account`;
  const accountLabel =
    readNestedAccountString(response.data, "account_label") ??
    readNestedAccountString(response.data, "workspace_name") ??
    readNestedAccountString(response.data, "account_name") ??
    readNestedAccountString(response.data, "email") ??
    fallbackLabel;
  const externalAccountId =
    readNestedAccountString(response.data, "external_account_id") ??
    readNestedAccountString(response.data, "account_id") ??
    connectedAccountId;

  return {
    connectedAccountId,
    authConfigId,
    toolkit,
    connectionLabel: accountLabel,
    accountLabel,
    externalAccountId,
    status: safeTrim(response.data.status),
    statusReason: safeTrim(response.data.status_reason),
  };
}

export async function waitForComposioConnectedAccountActive(params: {
  env?: Record<string, unknown>;
  integrationSlug: string;
  connectedAccountId: string;
  expectedUserId?: string | null;
  timeoutMs?: number;
  intervalMs?: number;
}): Promise<ComposioConnectedAccountMetadata> {
  const timeoutMs = params.timeoutMs ?? 10_000;
  const intervalMs = params.intervalMs ?? 750;
  const deadline = Date.now() + timeoutMs;
  let latest: ComposioConnectedAccountDetails | null = null;

  do {
    latest = await getComposioConnectedAccountDetails(params);
    const normalizedStatus = latest.status?.toUpperCase() ?? null;

    if (!normalizedStatus || normalizedStatus === "ACTIVE") {
      return latest;
    }

    if (
      normalizedStatus === "FAILED" ||
      normalizedStatus === "EXPIRED" ||
      normalizedStatus === "INACTIVE"
    ) {
      throw new Error(
        latest.statusReason ??
          `Composio connection is ${normalizedStatus.toLowerCase()}.`,
      );
    }

    await sleep(intervalMs);
  } while (Date.now() < deadline);

  throw new Error(
    latest?.status
      ? `Composio connection is still ${latest.status.toLowerCase()}.`
      : "Composio connection is not ready yet.",
  );
}

export async function deleteComposioConnectedAccount(
  connectedAccountId: string,
  env?: Record<string, unknown>,
): Promise<void> {
  const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");
  const baseUrl = normalizeBaseUrl(getEnvValue(env, "COMPOSIO_BASE_URL"));

  if (!apiKey) {
    return;
  }

  await composioFetch<unknown>(
    { apiKey, baseUrl },
    `/connected_accounts/${encodeURIComponent(connectedAccountId)}`,
    { method: "DELETE" },
  );
}

export async function executeComposioToolRequest(
  params: ExecuteComposioToolParams,
): Promise<ExecuteComposioToolResult> {
  const config = getComposioConfig(params.env, params.toolkit.replace(/_/g, "-"));
  const response = await composioFetch<{
    data?: unknown;
    error?: unknown;
    successful?: boolean;
    log_id?: string;
  }>(
    config,
    `/tools/execute/${encodeURIComponent(params.toolSlug)}`,
    {
      method: "POST",
      body: JSON.stringify({
        connected_account_id: params.connectedAccountId,
        user_id: params.userId,
        version: params.version ?? config.toolkitVersion,
        arguments: params.arguments,
      }),
    },
  );

  if (response.data.successful === false) {
    throw toComposioRequestError(
      response.data,
      `${params.toolSlug} failed in Composio.`,
      502,
    );
  }

  return {
    data: response.data.data ?? response.data,
    providerRequestId:
      safeTrim(response.data.log_id) ??
      safeTrim(response.headers.get("x-request-id")) ??
      undefined,
  };
}

// ---------------------------------------------------------------------------
// Runtime schema fetching
// ---------------------------------------------------------------------------

interface ComposioToolItem {
  slug?: string;
  input_parameters?: Record<string, unknown>;
}

interface ComposioToolsResponse {
  items?: ComposioToolItem[];
  total_items?: number;
}

function simplifySchemaNode(node: unknown): Record<string, unknown> {
  if (!node || typeof node !== "object") {
    return { type: "string" };
  }

  const record = node as Record<string, unknown>;

  if (record.$ref) {
    return { type: "object", additionalProperties: true };
  }

  const result: Record<string, unknown> = {};

  if (record.type === "array") {
    result.type = "array";
    result.items = record.items
      ? simplifySchemaNode(record.items)
      : { type: "object", additionalProperties: true };
  } else if (record.type === "object") {
    result.type = "object";
    result.additionalProperties = true;
    if (record.properties && typeof record.properties === "object") {
      const simplified: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(record.properties as Record<string, unknown>)) {
        simplified[key] = simplifySchemaNode(value);
      }
      result.properties = simplified;
    }
  } else if (record.type) {
    result.type = record.type;
  } else {
    result.type = "string";
  }

  if (record.description) result.description = record.description;
  if (record.enum) result.enum = record.enum;

  return result;
}

function convertInputSchema(
  inputParams: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!inputParams || typeof inputParams !== "object") {
    return { type: "object", additionalProperties: true, properties: {} };
  }

  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  const rawProps = (inputParams.properties ?? {}) as Record<string, Record<string, unknown>>;

  for (const [name, prop] of Object.entries(rawProps)) {
    const schema: Record<string, unknown> = {};
    const propType = prop.type;

    if (propType === "array") {
      schema.type = "array";
      schema.items = prop.items
        ? simplifySchemaNode(prop.items)
        : { type: "object", additionalProperties: true };
    } else if (propType === "object") {
      schema.type = "object";
      schema.additionalProperties = true;
      if (prop.properties && typeof prop.properties === "object") {
        const nested: Record<string, unknown> = {};
        for (const [nestedName, nestedProp] of Object.entries(
          prop.properties as Record<string, unknown>,
        )) {
          nested[nestedName] = simplifySchemaNode(nestedProp);
        }
        schema.properties = nested;
      }
    } else if (propType === "integer") {
      schema.type = "integer";
    } else if (propType === "number") {
      schema.type = "number";
    } else if (propType === "boolean") {
      schema.type = "boolean";
    } else {
      schema.type = "string";
    }

    if (prop.description) schema.description = prop.description;
    if (prop.enum) schema.enum = prop.enum;

    properties[name] = schema;
  }

  if (Array.isArray(inputParams.required)) {
    required.push(...(inputParams.required as string[]));
  }

  const result: Record<string, unknown> = {
    type: "object",
    additionalProperties: true,
    properties,
  };

  if (required.length > 0) {
    result.required = required;
  }

  return result;
}

/**
 * Fetch input schemas for all tools in a Composio toolkit.
 *
 * Returns a map from uppercase tool slug (e.g. "GMAIL_SEND_EMAIL") to
 * simplified JSON Schema objects suitable for MCP inputSchema.
 *
 * The response uses the same schema conversion logic as the import script
 * so the runtime schemas are identical to what was previously statically
 * generated.
 */
export async function fetchComposioToolSchemas(
  env: Record<string, unknown> | undefined,
  integrationSlug: string,
): Promise<Map<string, Record<string, unknown>>> {
  const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");
  const baseUrl = normalizeBaseUrl(getEnvValue(env, "COMPOSIO_BASE_URL"));

  if (!apiKey) {
    throw new Error("COMPOSIO_API_KEY is not configured.");
  }

  const toolkitMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_MAP"));
  const versionMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_VERSION_MAP"));
  const toolkit =
    toolkitMap.get(integrationSlug) ??
    getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT")) ??
    integrationSlug.replace(/-/g, "_");
  const version =
    versionMap.get(integrationSlug) ??
    getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT_VERSION"));

  const url = new URL(`${baseUrl}/tools`);
  url.searchParams.set("toolkit_slug", toolkit);
  if (version) {
    url.searchParams.set("toolkit_versions", version);
  } else {
    url.searchParams.set("toolkit_versions", "latest");
  }
  url.searchParams.set("limit", "1000");
  url.searchParams.set("include_deprecated", "false");

  const response = await composioFetch<ComposioToolsResponse>(
    { apiKey, baseUrl },
    url.pathname + url.search,
    { method: "GET" },
  );

  const schemas = new Map<string, Record<string, unknown>>();

  for (const item of response.data.items ?? []) {
    if (!item.slug) continue;
    schemas.set(
      item.slug,
      convertInputSchema(item.input_parameters as Record<string, unknown> | null),
    );
  }

  return schemas;
}
