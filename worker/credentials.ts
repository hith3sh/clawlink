import type { ConnectionAuthState } from "../src/lib/connection-status";
import {
  getOAuthProviderDisplayName,
  safeTrim,
} from "../src/lib/oauth/providers";
import {
  mapNangoConnectionToClawLinkCredentials,
  type NangoConnectionResponse,
} from "../src/lib/nango/credentials";
import { decryptCredential, encryptCredential } from "./crypto";

interface D1RunResult {
  meta?: {
    changes?: number;
  };
}

interface D1Statement {
  bind(...values: unknown[]): {
    first<T = Record<string, unknown>>(): Promise<T | null>;
    run(): Promise<D1RunResult | unknown>;
  };
}

interface D1LikeDatabase {
  prepare(query: string): D1Statement;
}

interface KVLikeNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete?(key: string): Promise<void>;
}

interface UserRow {
  id: string;
}

interface StoredIntegrationRow {
  id: number;
  credentials_encrypted: string;
  auth_state: ConnectionAuthState;
  auth_error: string | null;
  auth_provider: string;
  nango_connection_id: string | null;
  nango_provider_config_key: string | null;
}

export interface CredentialBridgeEnv {
  DB: D1LikeDatabase;
  CREDENTIALS?: KVLikeNamespace;
  CREDENTIAL_ENCRYPTION_KEY?: string;
  NANGO_BASE_URL?: string;
  NANGO_SECRET_KEY?: string;
  [key: string]: unknown;
}

interface CredentialLookupOptions {
  connectionId?: number;
}

function cacheKey(connectionId: number): string {
  return `cred:${connectionId}`;
}

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getEnvString(env: CredentialBridgeEnv, key: string): string | undefined {
  return safeTrim(env[key]);
}

function getNangoConfig(
  env: CredentialBridgeEnv,
): { baseUrl: string; secretKey: string } | null {
  const baseUrl = getEnvString(env, "NANGO_BASE_URL")?.replace(/\/+$/, "");
  const secretKey = getEnvString(env, "NANGO_SECRET_KEY");

  if (!baseUrl || !secretKey) {
    return null;
  }

  return { baseUrl, secretKey };
}

function isOAuthIntegration(integration: string): boolean {
  return integration === "apollo" || integration === "gmail" || integration === "notion" || integration === "outlook";
}

function buildNeedsReauthMessage(
  integration: string,
  detail?: string | null,
): string {
  const providerName = getOAuthProviderDisplayName(integration);
  const reason = safeTrim(detail);

  if (reason) {
    return `${providerName} needs to be reconnected. ${reason}`;
  }

  return `${providerName} needs to be reconnected in ClawLink before it can be used again.`;
}

async function loadCachedCredentials(
  env: CredentialBridgeEnv,
  connectionId: number,
): Promise<Record<string, string> | null> {
  const raw = await env.CREDENTIALS?.get(cacheKey(connectionId));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecordObject(parsed)
      ? Object.fromEntries(
          Object.entries(parsed).map(([key, value]) => [key, String(value)]),
        )
      : null;
  } catch {
    return null;
  }
}

async function cacheCredentials(
  env: CredentialBridgeEnv,
  connectionId: number,
  credentials: Record<string, string>,
): Promise<void> {
  if (!env.CREDENTIALS) {
    return;
  }

  await env.CREDENTIALS.put(cacheKey(connectionId), JSON.stringify(credentials), {
    expirationTtl: 60 * 30,
  });
}

async function clearCachedCredentials(
  env: CredentialBridgeEnv,
  connectionId: number,
): Promise<void> {
  await env.CREDENTIALS?.delete?.(cacheKey(connectionId));
}

async function persistCredentials(
  env: CredentialBridgeEnv,
  connectionId: number,
  credentials: Record<string, string>,
): Promise<void> {
  const encrypted = await encryptCredential(credentials, env.CREDENTIAL_ENCRYPTION_KEY);

  await env.DB
    .prepare(
      `
        UPDATE user_integrations
        SET credentials_encrypted = ?,
            expires_at = ?,
            auth_state = 'active',
            auth_error = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(encrypted, safeTrim(credentials.expiresAt) ?? null, connectionId)
    .run();

  await cacheCredentials(env, connectionId, credentials);
}

async function markConnectionNeedsReauth(
  env: CredentialBridgeEnv,
  connectionId: number,
  authError: string,
): Promise<void> {
  await env.DB
    .prepare(
      `
        UPDATE user_integrations
        SET auth_state = 'needs_reauth',
            auth_error = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(authError, connectionId)
    .run();

  await clearCachedCredentials(env, connectionId);
}

export async function resolveInternalUserId(
  db: D1LikeDatabase,
  authSubject: string,
): Promise<string | null> {
  const trimmed = authSubject.trim();

  if (!trimmed) {
    return null;
  }

  const row = await db
    .prepare(
      `
        SELECT id
        FROM users
        WHERE clerk_id = ? OR id = ?
        LIMIT 1
      `,
    )
    .bind(trimmed, trimmed)
    .first<UserRow>();

  return row?.id ?? null;
}

async function loadConnectionRecord(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
  options: CredentialLookupOptions,
): Promise<StoredIntegrationRow | null> {
  if (options.connectionId) {
    return env.DB
      .prepare(
        `
          SELECT id, credentials_encrypted, auth_state, auth_error,
                 auth_provider, nango_connection_id, nango_provider_config_key
          FROM user_integrations
          WHERE id = ? AND user_id = ? AND integration = ?
          LIMIT 1
        `,
      )
      .bind(options.connectionId, userId, integration)
      .first<StoredIntegrationRow>();
  }

  return env.DB
    .prepare(
      `
        SELECT id, credentials_encrypted, auth_state, auth_error,
               auth_provider, nango_connection_id, nango_provider_config_key
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        ORDER BY is_default DESC, updated_at DESC, created_at DESC, id DESC
        LIMIT 1
      `,
    )
    .bind(userId, integration)
    .first<StoredIntegrationRow>();
}

function isNangoBackedConnection(record: StoredIntegrationRow): boolean {
  return Boolean(record.nango_connection_id && record.nango_provider_config_key);
}

function buildNeedsReauthMessageFromNango(
  integration: string,
  detail?: string | null,
): string {
  const providerName = getOAuthProviderDisplayName(integration);
  const reason = safeTrim(detail);

  if (reason) {
    return `${providerName} needs to be reconnected in Nango. ${reason}`;
  }

  return `${providerName} needs to be reconnected in Nango before it can be used again.`;
}

async function markLegacyOAuthConnectionNeedsReauth(
  env: CredentialBridgeEnv,
  record: StoredIntegrationRow,
  integration: string,
): Promise<never> {
  const message = `${getOAuthProviderDisplayName(integration)} must be reconnected through the Nango-managed flow.`;
  await markConnectionNeedsReauth(env, record.id, message);
  throw new Error(buildNeedsReauthMessageFromNango(integration, message));
}

async function fetchNangoConnection(
  env: CredentialBridgeEnv,
  integration: string,
  record: StoredIntegrationRow,
  options: { forceRefresh?: boolean } = {},
): Promise<Record<string, string>> {
  const nangoConnectionId = safeTrim(record.nango_connection_id);
  const providerConfigKey = safeTrim(record.nango_provider_config_key);
  const config = getNangoConfig(env);

  if (!nangoConnectionId || !providerConfigKey || !config) {
    throw new Error(`Nango is not configured for ${integration}.`);
  }

  const params = new URLSearchParams({
    provider_config_key: providerConfigKey,
    refresh_token: "true",
  });

  if (options.forceRefresh) {
    params.set("force_refresh", "true");
  }

  const response = await fetch(
    `${config.baseUrl}/connection/${encodeURIComponent(nangoConnectionId)}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        Accept: "application/json",
      },
    },
  );

  const rawPayload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const payloadRecord = isRecordObject(rawPayload) ? rawPayload : null;
    const errorRecord = payloadRecord && isRecordObject(payloadRecord.error) ? payloadRecord.error : null;
    const detail =
      typeof errorRecord?.message === "string"
        ? errorRecord.message
        : typeof payloadRecord?.message === "string"
          ? payloadRecord.message
          : `${response.status} ${response.statusText}`;

    if (response.status >= 400 && response.status < 500) {
      await markConnectionNeedsReauth(
        env,
        record.id,
        buildNeedsReauthMessageFromNango(integration, detail),
      );
      throw new Error(buildNeedsReauthMessageFromNango(integration, detail));
    }

    throw new Error(`Failed to fetch Nango connection for ${integration}. ${detail}`);
  }

  const connection = rawPayload as NangoConnectionResponse;
  const credentials = mapNangoConnectionToClawLinkCredentials(integration, connection);

  if (!safeTrim(credentials.accessToken) && !safeTrim(credentials.access_token)) {
    throw new Error(`Nango did not return an access token for ${integration}.`);
  }

  await persistCredentials(env, record.id, credentials);
  return credentials;
}

export async function loadCredentialsForIntegration(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
  options: CredentialLookupOptions = {},
): Promise<Record<string, string>> {
  const record = await loadConnectionRecord(env, userId, integration, options);

  if (!record) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }

  if (record.auth_state === "needs_reauth") {
    throw new Error(
      isOAuthIntegration(integration)
        ? buildNeedsReauthMessageFromNango(integration, record.auth_error)
        : buildNeedsReauthMessage(integration, record.auth_error),
    );
  }

  if (isOAuthIntegration(integration)) {
    if (!isNangoBackedConnection(record)) {
      await markLegacyOAuthConnectionNeedsReauth(env, record, integration);
    }

    return fetchNangoConnection(env, integration, record);
  }

  const cached = await loadCachedCredentials(env, record.id);

  if (cached) {
    return cached;
  }

  if (!record.credentials_encrypted) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }

  const credentials = await decryptCredential(
    record.credentials_encrypted,
    env.CREDENTIAL_ENCRYPTION_KEY,
  );

  await cacheCredentials(env, record.id, credentials);
  return credentials;
}

export async function refreshCredentialsForIntegration(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
  options: CredentialLookupOptions = {},
): Promise<{ connectionId: number; credentials: Record<string, string> }> {
  const record = await loadConnectionRecord(env, userId, integration, options);

  if (!record) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }

  if (record.auth_state === "needs_reauth") {
    throw new Error(
      isOAuthIntegration(integration)
        ? buildNeedsReauthMessageFromNango(integration, record.auth_error)
        : buildNeedsReauthMessage(integration, record.auth_error),
    );
  }

  if (isOAuthIntegration(integration)) {
    if (!isNangoBackedConnection(record)) {
      await markLegacyOAuthConnectionNeedsReauth(env, record, integration);
    }

    const credentials = await fetchNangoConnection(env, integration, record, {
      forceRefresh: true,
    });

    return {
      connectionId: record.id,
      credentials,
    };
  }

  throw new Error(`${integration} does not support token refresh.`);
}

export async function markConnectionNeedsReauthForIntegration(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
  reason: string,
  options: CredentialLookupOptions = {},
): Promise<void> {
  const record = await loadConnectionRecord(env, userId, integration, options);

  if (!record) {
    return;
  }

  await markConnectionNeedsReauth(env, record.id, reason);
}

export async function updateConnectionCredentials(
  env: CredentialBridgeEnv,
  connectionId: number,
  credentials: Record<string, string>,
): Promise<void> {
  await persistCredentials(env, connectionId, credentials);
}
