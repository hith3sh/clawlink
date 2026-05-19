import type { IntegrationTool, IntegrationToolExample } from "../../../worker/integrations/base";
import { IntegrationRequestError } from "../../../worker/integrations/base";
import composioToolOverrides from "../../../config/composio-tool-overrides.mjs";

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
  integrationSlug?: string;
  authConfigId?: string;
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

const NOTION_ID_FIELDS = new Set([
  "page_id",
  "block_id",
  "database_id",
  "row_id",
  "data_source_id",
  "parent_id",
]);

function hyphenateUuid(value: string): string {
  const normalized = value.replace(/-/g, "").toLowerCase();
  return [
    normalized.slice(0, 8),
    normalized.slice(8, 12),
    normalized.slice(12, 16),
    normalized.slice(16, 20),
    normalized.slice(20, 32),
  ].join("-");
}

function normalizeFacebookPageIdValue(value: unknown): unknown {
  const trimmed = safeTrim(value);
  if (!trimmed) {
    return value;
  }

  const candidate = trimmed.replace(/^page_id:/i, "").trim();
  if (/^[0-9]+$/.test(candidate)) {
    return candidate;
  }

  if (/^[0-9-]+$/.test(candidate)) {
    return candidate.replace(/-/g, "");
  }

  return value;
}

function normalizeNotionObjectIdValue(value: unknown): unknown {
  const trimmed = safeTrim(value);
  if (!trimmed) {
    return value;
  }

  const matches = [
    ...trimmed.matchAll(
      /\b([0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/gi,
    ),
  ];
  const rawMatch = matches.at(-1)?.[1];

  if (!rawMatch) {
    return value;
  }

  return hyphenateUuid(rawMatch);
}

function preprocessComposioArguments(
  toolSlug: string,
  args: Record<string, unknown>,
): Record<string, unknown> {
  const normalizedArgs = { ...args };

  if ("page_id" in normalizedArgs && toolSlug.startsWith("FACEBOOK_")) {
    normalizedArgs.page_id = normalizeFacebookPageIdValue(normalizedArgs.page_id);
  }

  if (toolSlug.startsWith("NOTION_")) {
    for (const fieldName of NOTION_ID_FIELDS) {
      if (!(fieldName in normalizedArgs)) {
        continue;
      }

      normalizedArgs[fieldName] = normalizeNotionObjectIdValue(normalizedArgs[fieldName]);
    }
  }

  return normalizedArgs;
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

export function getComposioToolkitVersion(
  env: Record<string, unknown> | undefined,
  integrationSlug: string,
): string {
  const versionMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_VERSION_MAP"));

  return (
    versionMap.get(integrationSlug) ??
    getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT_VERSION")) ??
    (integrationSlug === "instantly" ? DEFAULT_INSTANTLY_TOOLKIT_VERSION : "latest")
  );
}

export function getComposioConfig(
  env: Record<string, unknown> | undefined,
  integrationSlug: string,
  authConfigIdOverride?: string,
): ComposioConfig {
  const apiKey = getEnvValue(env, "COMPOSIO_API_KEY");

  if (!apiKey) {
    throw new Error("COMPOSIO_API_KEY is not configured.");
  }

  const toolkitMap = parseMap(getEnvValue(env, "COMPOSIO_TOOLKIT_MAP"));
  const authConfigMap = parseMap(getEnvValue(env, "COMPOSIO_AUTH_CONFIG_MAP"));
  const authConfigId =
    authConfigIdOverride ??
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
    toolkitVersion: getComposioToolkitVersion(env, integrationSlug),
  };
}

interface ComposioToolOverrideExample {
  label?: string;
  user?: string;
  args?: Record<string, unknown>;
}

interface ComposioToolOverride {
  descriptionPrefix?: string;
  descriptionSuffix?: string;
  fieldDescriptions?: Record<string, string>;
  prerequisites?: string[];
  whenToUse?: string[];
  askBefore?: string[];
  safeDefaults?: Record<string, unknown>;
  examples?: ComposioToolOverrideExample[];
  followups?: string[];
  requiresScopes?: string[];
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [
    ...new Set(
      values
        .map((value) => safeTrim(value))
        .filter((value): value is string => Boolean(value)),
    ),
  ];
}

function getComposioToolOverride(toolSlug: string | null | undefined): ComposioToolOverride | null {
  if (!toolSlug) {
    return null;
  }

  const override = (composioToolOverrides as Record<string, ComposioToolOverride | undefined>)[
    toolSlug
  ];
  return override ?? null;
}

function appendDescription(
  current: string,
  value: string | null | undefined,
  { prepend = false }: { prepend?: boolean } = {},
): string {
  const trimmed = safeTrim(value);

  if (!trimmed) {
    return current;
  }

  if (!current) {
    return trimmed;
  }

  return prepend ? `${trimmed} ${current}` : `${current} ${trimmed}`;
}

function toExampleList(
  examples: ComposioToolOverrideExample[] | undefined,
): IntegrationToolExample[] {
  if (!Array.isArray(examples)) {
    return [];
  }

  return examples
    .filter(
      (example) =>
        example &&
        typeof example === "object" &&
        example.args &&
        typeof example.args === "object",
    )
    .map((example) => ({
      user: safeTrim(example.user) ?? safeTrim(example.label) ?? "Example",
      args: example.args as Record<string, unknown>,
    }));
}

function mergeToolExamples(
  existing: IntegrationToolExample[],
  additions: IntegrationToolExample[],
): IntegrationToolExample[] {
  if (additions.length === 0) {
    return existing;
  }

  const merged = [...existing];
  const seen = new Set(existing.map((example) => JSON.stringify(example)));

  for (const example of additions) {
    const key = JSON.stringify(example);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    merged.push(example);
  }

  return merged;
}

export function applyComposioToolFieldDescriptionOverrides(tool: IntegrationTool): void {
  if (tool.execution.kind !== "composio_tool") return;

  const override = getComposioToolOverride(tool.execution.toolSlug);
  const fieldDescriptions = override?.fieldDescriptions;

  if (!fieldDescriptions) return;

  const properties = (tool.inputSchema as { properties?: Record<string, unknown> }).properties;
  if (!properties || typeof properties !== "object") return;

  for (const [name, descriptionOverride] of Object.entries(fieldDescriptions)) {
    const trimmed = safeTrim(descriptionOverride);
    if (!trimmed) continue;

    const property = properties[name];
    if (!property || typeof property !== "object") continue;

    (property as Record<string, unknown>).description = trimmed;
  }
}

export function applyComposioToolMetadataOverrides(tool: IntegrationTool): void {
  const override =
    tool.execution.kind === "composio_tool"
      ? getComposioToolOverride(tool.execution.toolSlug)
      : null;

  if (!override) {
    tool.prerequisites ??= [];
    return;
  }

  tool.description = appendDescription(tool.description, override.descriptionPrefix, {
    prepend: true,
  });
  tool.description = appendDescription(tool.description, override.descriptionSuffix);
  tool.whenToUse = uniqueStrings([...tool.whenToUse, ...(override.whenToUse ?? [])]);
  tool.askBefore = uniqueStrings([...tool.askBefore, ...(override.askBefore ?? [])]);
  tool.followups = uniqueStrings([...tool.followups, ...(override.followups ?? [])]);
  tool.requiresScopes = uniqueStrings([...tool.requiresScopes, ...(override.requiresScopes ?? [])]);
  tool.prerequisites = uniqueStrings([
    ...(tool.prerequisites ?? []),
    ...(override.prerequisites ?? []),
  ]);
  tool.safeDefaults = {
    ...override.safeDefaults,
    ...tool.safeDefaults,
  };
  tool.examples = mergeToolExamples(tool.examples, toExampleList(override.examples));
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

interface ComposioConfigurationError {
  code: string;
  message: string;
  hint: string;
}

/**
 * Detects upstream-provider errors that signal a one-time setup step the
 * customer (not the agent) must complete on the provider's side. These look
 * like ordinary 400s to Composio, but reconnecting/retrying/fixing args won't
 * change anything until the provider account is reconfigured. We classify
 * them as `configuration` so the executor surfaces an actionable hint and
 * the agent stops retrying.
 *
 * Add new entries here when we discover similar provider-setup-required
 * errors elsewhere in the catalog. Match on stable provider error codes, not
 * free-form wording.
 */
function detectComposioConfigurationError(
  message: string,
): ComposioConfigurationError | null {
  // WhatsApp Cloud API #133010: phone number exists on the WhatsApp Business
  // Account but has not been registered for Cloud API sending (requires a
  // 6-digit PIN + a one-time POST to /{phone_number_id}/register on Meta's
  // side). Connection itself is healthy; reconnecting does not fix it.
  if (/\(#?133010\)|\bAccount not registered\b/i.test(message)) {
    return {
      code: "whatsapp_phone_not_registered",
      message:
        "WhatsApp phone number is not registered for Cloud API. Account owner must set a 6-digit two-step verification PIN in Meta Business Manager and register the number on Meta before any messages can be sent. Reconnecting in ClawLink will not fix this — it is a one-time Meta-side setup.",
      hint:
        "Tell the user this requires a one-time setup on their WhatsApp Business Account in Meta Business Manager: (1) WhatsApp Manager → Phone Numbers → select the number → set a 6-digit two-step verification PIN, (2) register the number via POST https://graph.facebook.com/v22.0/{phone_number_id}/register with {messaging_product: \"whatsapp\", pin: \"<PIN>\"}. Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#register-a-phone-number. Do not retry the tool call — the connection itself is healthy but the provider account needs configuration.",
    };
  }

  return null;
}

function isComposioRateLimit(message: string, status: number): boolean {
  return (
    status === 429 ||
    /\brate.?limit|too many requests|retry-after|userratelimitexceeded|ratelimitexceeded\b/i.test(
      message,
    )
  );
}

function isComposioMissingScope(message: string, status: number): boolean {
  return (
    status === 403 &&
    /\binsufficient permissions?|insufficient[_\s-]?scope|missing[_\s-]?scope|forbidden|permission denied\b/i.test(
      message,
    )
  );
}

function isComposioAccountInactive(message: string, status: number): boolean {
  return (
    status === 401 ||
    /\breauth required|re-auth required|connected account not active|account inactive|token expired|invalid[_\s-]?token|unauthorized\b/i.test(
      message,
    )
  );
}

function isComposioNotFound(message: string, status: number): boolean {
  return status === 404 || /\bnot found|does not exist|unknown resource\b/i.test(message);
}

function isComposioTransient(message: string, status: number): boolean {
  return (
    status >= 500 ||
    /\btimeout|timed out|temporar(?:y|ily)|unavailable|try again|network|socket hang up|econnreset|etimedout\b/i.test(
      message,
    )
  );
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

  const configurationError = detectComposioConfigurationError(message);
  if (configurationError) {
    return new IntegrationRequestError(configurationError.message, {
      status: 422,
      kind: "configuration",
      code: configurationError.code,
      hint: configurationError.hint,
    });
  }

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

  if (isComposioRateLimit(message, status)) {
    return new IntegrationRequestError(message, {
      status: 429,
      kind: "rate_limit",
      code: "rate_limit",
    });
  }

  if (isComposioMissingScope(message, status)) {
    return new IntegrationRequestError(message, {
      status: 403,
      kind: "scope_missing",
      code: "missing_scopes",
    });
  }

  if (isComposioAccountInactive(message, status)) {
    return new IntegrationRequestError(message, {
      status: 401,
      kind: "account_inactive",
      code: "reauth_required",
    });
  }

  if (isComposioNotFound(message, status)) {
    return new IntegrationRequestError(message, {
      status: 404,
      kind: "not_found",
      code: "not_found",
    });
  }

  if (isComposioTransient(message, status)) {
    return new IntegrationRequestError(message, {
      status: status >= 500 ? status : 502,
      kind: "transient",
      code: "provider_unavailable",
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

async function executeComposioToolRequestOnce(
  config: ComposioConfig,
  params: ExecuteComposioToolParams,
  args: Record<string, unknown>,
): Promise<ExecuteComposioToolResult> {
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
        arguments: args,
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
  const config = getComposioConfig(
    params.env,
    params.integrationSlug ?? params.toolkit.replace(/_/g, "-"),
    params.authConfigId,
  );
  const normalizedArgs = preprocessComposioArguments(params.toolSlug, params.arguments);
  return executeComposioToolRequestOnce(config, params, normalizedArgs);
}

// ---------------------------------------------------------------------------
// File upload relay
// ---------------------------------------------------------------------------

export interface RequestComposioFileUploadParams {
  env?: Record<string, unknown>;
  toolkitSlug: string;
  toolSlug: string;
  filename: string;
  mimetype: string;
  md5: string;
}

export interface ComposioFileUploadRequest {
  /** Composio file record id. */
  id: string;
  /** The Apollo s3key to plug into the FileUploadable's s3key field. */
  key: string;
  /** Presigned PUT URL. Empty string when type === "existing". */
  presignedUrl: string;
  /** "new" → caller must PUT bytes to presignedUrl. "existing" → md5 dedup hit, skip the PUT. */
  type: "new" | "existing";
}

/**
 * Request a presigned upload URL from Composio for a file_uploadable argument.
 *
 * Composio dedup happens on md5: if the same hash already exists for the same
 * (toolkit, tool) pair, `type === "existing"` and `presignedUrl` is empty —
 * caller skips the PUT step and uses the returned `key` directly.
 */
export async function requestComposioFileUpload(
  params: RequestComposioFileUploadParams,
): Promise<ComposioFileUploadRequest> {
  const apiKey = getEnvValue(params.env, "COMPOSIO_API_KEY");

  if (!apiKey) {
    throw new Error("COMPOSIO_API_KEY is not configured.");
  }

  const baseUrl = normalizeBaseUrl(getEnvValue(params.env, "COMPOSIO_BASE_URL"));
  const response = await composioFetch<{
    id?: unknown;
    key?: unknown;
    new_presigned_url?: unknown;
    newPresignedUrl?: unknown;
    type?: unknown;
  }>({ apiKey, baseUrl }, "/files/upload/request", {
    method: "POST",
    body: JSON.stringify({
      toolkit_slug: params.toolkitSlug,
      tool_slug: params.toolSlug,
      filename: params.filename,
      mimetype: params.mimetype,
      md5: params.md5,
    }),
  });

  const id = safeTrim(response.data.id);
  const key = safeTrim(response.data.key);
  const presignedUrl =
    safeTrim(response.data.new_presigned_url) ?? safeTrim(response.data.newPresignedUrl) ?? "";
  const rawType = safeTrim(response.data.type);
  const type = rawType === "existing" ? "existing" : "new";

  if (!id || !key) {
    throw new IntegrationRequestError(
      "Composio upload-request response was missing id or key.",
      { status: 502, kind: "transient", code: "provider_unavailable" },
    );
  }

  if (type === "new" && !presignedUrl) {
    throw new IntegrationRequestError(
      "Composio upload-request response was missing presigned URL.",
      { status: 502, kind: "transient", code: "provider_unavailable" },
    );
  }

  return { id, key, presignedUrl, type };
}

/**
 * Upload raw file bytes to a Composio presigned URL via PUT.
 *
 * The presigned URL bakes the Content-Type into its query string, so the
 * Content-Type header on the PUT must match the mimetype passed to
 * `requestComposioFileUpload`. Network errors and 5xx responses bubble up as
 * transient IntegrationRequestErrors so the executor's retry loop applies.
 */
export async function putComposioFile(
  presignedUrl: string,
  mimetype: string,
  bytes: ArrayBuffer,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": mimetype,
      },
      body: bytes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error during file upload.";
    throw new IntegrationRequestError(`File upload PUT failed: ${message}`, {
      status: 502,
      kind: "transient",
      code: "provider_unavailable",
    });
  }

  if (!response.ok) {
    const status = response.status;
    const text = await response.text().catch(() => "");
    const detail = text.slice(0, 500);
    const messageBase = `File upload PUT returned ${status}`;
    const message = detail ? `${messageBase}: ${detail}` : messageBase;

    if (status >= 500) {
      throw new IntegrationRequestError(message, {
        status,
        kind: "transient",
        code: "provider_unavailable",
      });
    }

    throw new IntegrationRequestError(message, { status });
  }
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

function simplifyUnionNode(variants: unknown[]): Record<string, unknown> | null {
  const normalizedVariants = variants.filter(
    (variant): variant is Record<string, unknown> =>
      Boolean(variant) &&
      typeof variant === "object" &&
      (variant as Record<string, unknown>).type !== "null",
  );

  if (normalizedVariants.length === 0) {
    return null;
  }

  const objectVariants = normalizedVariants.filter(
    (variant) =>
      variant.type === "object" ||
      typeof variant.properties === "object" ||
      Array.isArray(variant.required),
  );

  if (objectVariants.length > 0) {
    if (objectVariants.length === 1) {
      return simplifySchemaNode(objectVariants[0]);
    }

    return { type: "object", additionalProperties: true };
  }

  const arrayVariant = normalizedVariants.find((variant) => variant.type === "array");
  if (arrayVariant) {
    return simplifySchemaNode(arrayVariant);
  }

  const typedVariant = normalizedVariants.find((variant) => typeof variant.type === "string");
  if (typedVariant) {
    return simplifySchemaNode(typedVariant);
  }

  return { type: "string" };
}

function simplifySchemaNode(node: unknown): Record<string, unknown> {
  if (!node || typeof node !== "object") {
    return { type: "string" };
  }

  const record = node as Record<string, unknown>;

  if (record.$ref) {
    return { type: "object", additionalProperties: true };
  }

  if (Array.isArray(record.oneOf)) {
    return simplifyUnionNode(record.oneOf) ?? { type: "string" };
  }

  if (Array.isArray(record.anyOf)) {
    return simplifyUnionNode(record.anyOf) ?? { type: "string" };
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
  } else if (record.properties && typeof record.properties === "object") {
    result.type = "object";
    result.additionalProperties = true;
    const simplified: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record.properties as Record<string, unknown>)) {
      simplified[key] = simplifySchemaNode(value);
    }
    result.properties = simplified;
  } else if (record.type) {
    result.type = record.type;
  } else {
    result.type = "string";
  }

  if (record.description) result.description = record.description;
  if (record.enum) result.enum = record.enum;
  if (Array.isArray(record.examples) && record.examples.length > 0) {
    result.examples = record.examples;
  } else if (record.example !== undefined) {
    result.examples = [record.example];
  }

  // Preserve the `file_uploadable: true` marker so the executor's file-upload
  // relay can identify which arguments paths require relay handling. The raw
  // Composio schema marks affected properties with this boolean (e.g.
  // `INSTAGRAM_POST_IG_USER_MEDIA.image_file`). Without preservation here, the
  // simplified schema strips the marker and the relay cannot find uploadable
  // paths without re-fetching the raw schema.
  if (record.file_uploadable === true) result.file_uploadable = true;

  return result;
}

function convertInputSchema(
  inputParams: Record<string, unknown> | null | undefined,
  toolSlug?: string,
): Record<string, unknown> {
  if (!inputParams || typeof inputParams !== "object") {
    return { type: "object", additionalProperties: true, properties: {} };
  }

  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  const rawProps = (inputParams.properties ?? {}) as Record<string, Record<string, unknown>>;
  const override = getComposioToolOverride(toolSlug);
  const fieldDescriptionOverrides = override?.fieldDescriptions ?? {};

  for (const [name, prop] of Object.entries(rawProps)) {
    const schema: Record<string, unknown> = simplifySchemaNode(prop);

    const descriptionOverride = safeTrim(fieldDescriptionOverrides[name]);
    if (descriptionOverride) {
      schema.description = descriptionOverride;
    }

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
  const toolkit =
    toolkitMap.get(integrationSlug) ??
    getEnvValue(env, getSlugEnvKey("COMPOSIO", integrationSlug, "TOOLKIT")) ??
    integrationSlug.replace(/-/g, "_");
  const version = getComposioToolkitVersion(env, integrationSlug);

  const params = new URLSearchParams();
  params.set("toolkit_slug", toolkit);
  params.set("toolkit_versions", version ?? "latest");
  params.set("limit", "1000");
  params.set("include_deprecated", "false");

  const response = await composioFetch<ComposioToolsResponse>(
    { apiKey, baseUrl },
    `/tools?${params.toString()}`,
    { method: "GET" },
  );

  const schemas = new Map<string, Record<string, unknown>>();

  for (const item of response.data.items ?? []) {
    if (!item.slug) continue;
    schemas.set(
      item.slug,
      convertInputSchema(item.input_parameters as Record<string, unknown> | null, item.slug),
    );
  }

  return schemas;
}
