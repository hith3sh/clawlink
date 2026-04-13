import type { ConnectionAuthState } from "../src/lib/connection-status";
import {
  encodeBasicAuthValue,
  getOAuthErrorMessage,
  getOAuthPayloadString,
  getOAuthRefreshConfig,
  safeTrim,
  type OAuthRefreshConfig,
} from "../src/lib/oauth/providers";
import {
  mapNangoConnectionToClawLinkCredentials,
  type NangoConnectionResponse,
} from "../src/lib/nango/credentials";
import { decryptCredential, encryptCredential } from "./crypto";
import { loadNangoCredentials, NangoConnectionError } from "./nango";

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

function authProviderToBackend(authProvider: string | null | undefined): "local" | "nango" {
  return authProvider === "nango" ? "nango" : "local";
}

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function shouldRefreshCredentials(
  refreshConfig: OAuthRefreshConfig,
  credentials: Record<string, string>,
): boolean {
  if (!refreshConfig.usesRefreshTokens) {
    return false;
  }

  const refreshToken = safeTrim(credentials[refreshConfig.credentialKeys.refreshToken]);

  if (!refreshToken) {
    return false;
  }

  const accessToken = safeTrim(credentials[refreshConfig.credentialKeys.accessToken]);
  const expiresAtKey = refreshConfig.credentialKeys.expiresAt;
  const expiresAt = expiresAtKey ? safeTrim(credentials[expiresAtKey]) : undefined;

  if (!accessToken) {
    return true;
  }

  if (!expiresAt) {
    return refreshConfig.refreshWithoutExpiry ?? false;
  }

  const expiresAtMs = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtMs)) {
    return refreshConfig.refreshWithoutExpiry ?? false;
  }

  return expiresAtMs - Date.now() <= (refreshConfig.refreshSkewMs ?? 5 * 60 * 1000);
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

function getOAuthClientConfig(
  env: CredentialBridgeEnv,
  refreshConfig: OAuthRefreshConfig,
): { clientId: string; clientSecret: string } {
  const clientId = getEnvString(env, refreshConfig.clientIdEnvKey);
  const clientSecret = getEnvString(env, refreshConfig.clientSecretEnvKey);

  if (!clientId || !clientSecret) {
    throw new Error(`${refreshConfig.displayName} OAuth is not configured on the worker.`);
  }

  return { clientId, clientSecret };
}

function buildRefreshRequest(
  refreshConfig: OAuthRefreshConfig,
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): RequestInit {
  const bodyFields = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    ...(refreshConfig.additionalRefreshParams ?? {}),
  };

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(refreshConfig.additionalHeaders ?? {}),
  };

  if (refreshConfig.clientAuthentication === "basic") {
    headers.Authorization = `Basic ${encodeBasicAuthValue(clientId, clientSecret)}`;
  }

  if (refreshConfig.requestEncoding === "json") {
    headers["Content-Type"] = "application/json";

    return {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...bodyFields,
        ...(refreshConfig.clientAuthentication === "body"
          ? { client_id: clientId, client_secret: clientSecret }
          : {}),
      }),
    };
  }

  headers["Content-Type"] = "application/x-www-form-urlencoded";

  return {
    method: "POST",
    headers,
    body: new URLSearchParams({
      ...bodyFields,
      ...(refreshConfig.clientAuthentication === "body"
        ? { client_id: clientId, client_secret: clientSecret }
        : {}),
    }).toString(),
  };
}

function readExpiresInSeconds(
  refreshConfig: OAuthRefreshConfig,
  payload: Record<string, unknown> | null,
): number | null {
  const fieldName = refreshConfig.responseFields.expiresIn;

  if (!payload || !fieldName) {
    return refreshConfig.defaultExpiresInSeconds ?? null;
  }

  const rawValue = payload[fieldName];

  if (typeof rawValue === "number" && Number.isFinite(rawValue) && rawValue > 0) {
    return rawValue;
  }

  if (typeof rawValue === "string") {
    const parsed = Number.parseInt(rawValue, 10);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return refreshConfig.defaultExpiresInSeconds ?? null;
}

function mergeRefreshedCredentials(
  refreshConfig: OAuthRefreshConfig,
  currentCredentials: Record<string, string>,
  payload: Record<string, unknown> | null,
): Record<string, string> {
  const accessToken = getOAuthPayloadString(payload, refreshConfig.responseFields.accessToken);

  if (!accessToken) {
    throw new Error(
      `${refreshConfig.displayName} token refresh succeeded but did not return an access token.`,
    );
  }

  const nextCredentials: Record<string, string> = {
    ...currentCredentials,
    [refreshConfig.credentialKeys.accessToken]: accessToken,
  };

  const refreshedToken = getOAuthPayloadString(payload, refreshConfig.responseFields.refreshToken);
  nextCredentials[refreshConfig.credentialKeys.refreshToken] =
    refreshedToken ?? currentCredentials[refreshConfig.credentialKeys.refreshToken];

  if (refreshConfig.credentialKeys.tokenType && refreshConfig.responseFields.tokenType) {
    const tokenType = getOAuthPayloadString(payload, refreshConfig.responseFields.tokenType);

    if (tokenType) {
      nextCredentials[refreshConfig.credentialKeys.tokenType] = tokenType;
    }
  }

  if (refreshConfig.credentialKeys.scope && refreshConfig.responseFields.scope) {
    const scope = getOAuthPayloadString(payload, refreshConfig.responseFields.scope);

    if (scope) {
      nextCredentials[refreshConfig.credentialKeys.scope] = scope;
    }
  }

  if (refreshConfig.credentialKeys.expiresAt) {
    const expiresInSeconds = readExpiresInSeconds(refreshConfig, payload);

    if (expiresInSeconds) {
      nextCredentials[refreshConfig.credentialKeys.expiresAt] = new Date(
        Date.now() + expiresInSeconds * 1000,
      ).toISOString();
    } else if (!(refreshConfig.refreshWithoutExpiry ?? false)) {
      delete nextCredentials[refreshConfig.credentialKeys.expiresAt];
    }
  }

  for (const [payloadField, credentialKey] of Object.entries(
    refreshConfig.additionalResponseCredentialMappings ?? {},
  )) {
    const value = getOAuthPayloadString(payload, payloadField);

    if (value) {
      nextCredentials[credentialKey] = value;
    }
  }

  return nextCredentials;
}

function isTerminalRefreshFailure(
  refreshConfig: OAuthRefreshConfig,
  payload: Record<string, unknown> | null,
): boolean {
  const errorCode = getOAuthPayloadString(payload, refreshConfig.responseFields.error);

  if (!errorCode) {
    return false;
  }

  return (refreshConfig.terminalErrorCodes ?? ["invalid_grant"]).includes(errorCode);
}

function buildNeedsReauthMessage(
  integration: string,
  detail?: string | null,
): string {
  const providerName = getOAuthRefreshConfig(integration)?.displayName ?? integration;
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

async function persistCredentialsOptimistically(
  env: CredentialBridgeEnv,
  record: StoredIntegrationRow,
  credentials: Record<string, string>,
): Promise<boolean> {
  const encrypted = await encryptCredential(credentials, env.CREDENTIAL_ENCRYPTION_KEY);
  const result = await env.DB
    .prepare(
      `
        UPDATE user_integrations
        SET credentials_encrypted = ?,
            expires_at = ?,
            auth_state = 'active',
            auth_error = NULL,
            updated_at = datetime('now')
        WHERE id = ? AND credentials_encrypted = ?
      `,
    )
    .bind(
      encrypted,
      safeTrim(credentials.expiresAt) ?? null,
      record.id,
      record.credentials_encrypted,
    )
    .run();

  const changes =
    isRecordObject(result) && isRecordObject(result.meta) && typeof result.meta.changes === "number"
      ? result.meta.changes
      : 0;

  if (changes > 0) {
    await cacheCredentials(env, record.id, credentials);
    return true;
  }

  return false;
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

async function loadConnectionById(
  env: CredentialBridgeEnv,
  connectionId: number,
): Promise<StoredIntegrationRow | null> {
  return env.DB
    .prepare(
      `
        SELECT id, credentials_encrypted, auth_state, auth_error,
               auth_provider, nango_connection_id, nango_provider_config_key
        FROM user_integrations
        WHERE id = ?
        LIMIT 1
      `,
    )
    .bind(connectionId)
    .first<StoredIntegrationRow>();
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
  const providerName = getOAuthRefreshConfig(integration)?.displayName ?? integration;
  const reason = safeTrim(detail);

  if (reason) {
    return `${providerName} needs to be reconnected in Nango. ${reason}`;
  }

  return `${providerName} needs to be reconnected in Nango before it can be used again.`;
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
    `${config.baseUrl}/connections/${encodeURIComponent(nangoConnectionId)}?${params.toString()}`,
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
      await markConnectionNeedsReauth(env, record.id, buildNeedsReauthMessageFromNango(integration, detail));
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

async function refreshCredentials(
  env: CredentialBridgeEnv,
  record: StoredIntegrationRow,
  integration: string,
  credentials: Record<string, string>,
  refreshConfig: OAuthRefreshConfig,
): Promise<Record<string, string>> {
  const refreshToken = safeTrim(credentials[refreshConfig.credentialKeys.refreshToken]);

  if (!refreshToken) {
    throw new Error(`${refreshConfig.displayName} credentials are missing a refresh token.`);
  }

  const { clientId, clientSecret } = getOAuthClientConfig(env, refreshConfig);
  const response = await fetch(
    refreshConfig.tokenEndpoint,
    buildRefreshRequest(refreshConfig, clientId, clientSecret, refreshToken),
  );
  const rawPayload = (await response.json().catch(() => null)) as unknown;
  const payload = isRecordObject(rawPayload) ? rawPayload : null;

  if (!response.ok) {
    const detail = getOAuthErrorMessage(refreshConfig.displayName, refreshConfig, payload, response);

    if (isTerminalRefreshFailure(refreshConfig, payload)) {
      await markConnectionNeedsReauth(env, record.id, detail);
      throw new Error(buildNeedsReauthMessage(integration, detail));
    }

    throw new Error(`Failed to refresh ${refreshConfig.displayName} credentials. ${detail}`);
  }

  const refreshed = mergeRefreshedCredentials(refreshConfig, credentials, payload);
  const didPersist = await persistCredentialsOptimistically(env, record, refreshed);

  if (didPersist) {
    return refreshed;
  }

  const latestRecord = await loadConnectionById(env, record.id);

  if (!latestRecord?.credentials_encrypted) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }

  if (latestRecord.auth_state === "needs_reauth") {
    throw new Error(buildNeedsReauthMessage(integration, latestRecord.auth_error));
  }

  const latestCredentials = await decryptCredential(
    latestRecord.credentials_encrypted,
    env.CREDENTIAL_ENCRYPTION_KEY,
  );
  await cacheCredentials(env, latestRecord.id, latestCredentials);
  return latestCredentials;
}

async function maybeRefreshCredentials(
  env: CredentialBridgeEnv,
  record: StoredIntegrationRow,
  integration: string,
  credentials: Record<string, string>,
): Promise<Record<string, string>> {
  if (isNangoBackedConnection(record)) {
    return fetchNangoConnection(env, integration, record);
  }

  const refreshConfig = getOAuthRefreshConfig(integration);

  if (!refreshConfig || !shouldRefreshCredentials(refreshConfig, credentials)) {
    return credentials;
  }

  return refreshCredentials(env, record, integration, credentials, refreshConfig);
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
      isNangoBackedConnection(record)
        ? buildNeedsReauthMessageFromNango(integration, record.auth_error)
        : buildNeedsReauthMessage(integration, record.auth_error),
    );
  }

  if (isNangoBackedConnection(record)) {
    return fetchNangoConnection(env, integration, record);
  }

  const refreshConfig = getOAuthRefreshConfig(integration);
  const cached = await loadCachedCredentials(env, record.id);

  if (cached && (!refreshConfig || !shouldRefreshCredentials(refreshConfig, cached))) {
    return cached;
  }

  if (authProviderToBackend(record.auth_provider) === "nango") {
    const credentials = await loadNangoCredentials(
      env as Record<string, unknown>,
      integration,
      record,
      { forceRefresh: false },
    );
    await cacheCredentials(env, record.id, credentials);
    return credentials;
  }

  if (!record.credentials_encrypted) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }

  const decryptedCredentials = await decryptCredential(
    record.credentials_encrypted,
    env.CREDENTIAL_ENCRYPTION_KEY,
  );

  const credentials = await maybeRefreshCredentials(env, record, integration, decryptedCredentials);

  if (credentials !== decryptedCredentials) {
    return credentials;
  }

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
    throw new Error(buildNeedsReauthMessage(integration, record.auth_error));
  }

  if (authProviderToBackend(record.auth_provider) === "nango") {
    try {
      const credentials = await loadNangoCredentials(
        env as Record<string, unknown>,
        integration,
        record,
        { forceRefresh: true },
      );
      await cacheCredentials(env, record.id, credentials);
      return {
        connectionId: record.id,
        credentials,
      };
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message
          : `Failed to refresh ${integration} credentials through Nango.`;

      if (error instanceof NangoConnectionError && error.isAuthError) {
        await markConnectionNeedsReauth(env, record.id, detail);
        throw new Error(buildNeedsReauthMessage(integration, detail));
      }

      throw new Error(detail);
    }
  }

  if (!record.credentials_encrypted) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }

  const refreshConfig = getOAuthRefreshConfig(integration);

  if (!refreshConfig) {
    throw new Error(`${integration} does not support token refresh.`);
  }

  const credentials = await decryptCredential(
    record.credentials_encrypted,
    env.CREDENTIAL_ENCRYPTION_KEY,
  );
  const refreshToken = safeTrim(credentials[refreshConfig.credentialKeys.refreshToken]);

  if (!refreshToken) {
    const detail = `${refreshConfig.displayName} credentials are missing a refresh token.`;
    await markConnectionNeedsReauth(env, record.id, detail);
    throw new Error(buildNeedsReauthMessage(integration, detail));
  }

  const refreshed = await refreshCredentials(env, record, integration, credentials, refreshConfig);

  return {
    connectionId: record.id,
    credentials: refreshed,
  };
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
