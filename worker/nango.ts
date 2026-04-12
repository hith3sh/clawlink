import {
  safeTrim,
} from "../src/lib/oauth/providers";
import {
  getNangoBaseUrl,
  getNangoSecretKey,
} from "../src/lib/nango/config";

interface NangoManagedConnectionRow {
  id: number;
  nango_connection_id: string | null;
  nango_provider_config_key: string | null;
}

interface NangoConnectionResponse {
  credentials?: Record<string, unknown>;
}

export class NangoConnectionError extends Error {
  status: number;
  isAuthError: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NangoConnectionError";
    this.status = status;
    this.isAuthError = status === 400 || status === 401;
  }
}

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getEnvValue(
  env: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = env[key];
  return typeof value === "string" ? value : undefined;
}

function getNangoConfig(env: Record<string, unknown>): {
  baseUrl: string;
  secretKey: string;
} {
  const baseUrl = getNangoBaseUrl((key) => getEnvValue(env, key));
  const secretKey = getNangoSecretKey((key) => getEnvValue(env, key));

  if (!baseUrl || !secretKey) {
    throw new Error("Nango is not configured on the worker.");
  }

  return { baseUrl, secretKey };
}

function pickString(
  source: Record<string, unknown>,
  key: string,
): string | undefined {
  return safeTrim(source[key]) ?? undefined;
}

function mapNangoCredentials(
  integration: string,
  rawCredentials: Record<string, unknown>,
): Record<string, string> {
  const accessToken = pickString(rawCredentials, "access_token");
  const refreshToken = pickString(rawCredentials, "refresh_token");
  const expiresAt =
    pickString(rawCredentials, "expires_at") ??
    pickString(rawCredentials, "expiresAt");
  const tokenType =
    pickString(rawCredentials, "token_type") ??
    pickString(rawCredentials, "tokenType");
  const scope =
    pickString(rawCredentials, "scope") ??
    pickString(rawCredentials, "scopes");

  if (integration === "notion") {
    return Object.fromEntries(
      Object.entries({
        integrationToken: accessToken,
        refreshToken,
        expiresAt,
        tokenType,
      }).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
    );
  }

  return Object.fromEntries(
    Object.entries({
      accessToken,
      access_token: accessToken,
      refreshToken,
      expiresAt,
      tokenType,
      scope,
    }).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}

export async function loadNangoCredentials(
  env: Record<string, unknown>,
  integration: string,
  record: NangoManagedConnectionRow,
  options: { forceRefresh?: boolean } = {},
): Promise<Record<string, string>> {
  if (!record.nango_provider_config_key || !record.nango_connection_id) {
    throw new Error(`${integration} is missing its Nango connection mapping.`);
  }

  const { baseUrl, secretKey } = getNangoConfig(env);
  const query = new URLSearchParams({
    provider_config_key: record.nango_provider_config_key,
    refresh_token: "true",
    ...(options.forceRefresh ? { force_refresh: "true" } : {}),
  });
  const response = await fetch(
    `${baseUrl}/connection/${encodeURIComponent(record.nango_connection_id)}?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    },
  );
  const rawPayload = (await response.json().catch(() => null)) as unknown;
  const payload = isRecordObject(rawPayload) ? rawPayload : null;

  if (!response.ok) {
    const message =
      safeTrim(payload?.message) ??
      safeTrim(payload?.error) ??
      `Nango request failed with status ${response.status}.`;
    throw new NangoConnectionError(message, response.status);
  }

  const credentials = isRecordObject((payload as NangoConnectionResponse | null)?.credentials)
    ? ((payload as NangoConnectionResponse).credentials as Record<string, unknown>)
    : null;

  if (!credentials) {
    throw new Error("Nango did not return connection credentials.");
  }

  return mapNangoCredentials(integration, credentials);
}
