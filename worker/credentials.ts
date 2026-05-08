import type { ConnectionAuthState } from "../src/lib/connection-status";
import {
  getOAuthProviderDisplayName,
  safeTrim,
} from "../src/lib/oauth/providers";
import type { NormalizedToolError } from "../src/lib/runtime/tool-runtime";
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
  composio_connected_account_id: string | null;
  composio_auth_config_id: string | null;
  composio_toolkit: string | null;
}

export interface CredentialBridgeEnv {
  DB: D1LikeDatabase;
  CREDENTIALS?: KVLikeNamespace;
  CREDENTIAL_ENCRYPTION_KEY?: string;
  COMPOSIO_API_KEY?: string;
  COMPOSIO_BASE_URL?: string;
  COMPOSIO_TOOLKIT_MAP?: string;
  COMPOSIO_AUTH_CONFIG_MAP?: string;
  COMPOSIO_TOOLKIT_VERSION_MAP?: string;
  [key: string]: unknown;
}

interface CredentialLookupOptions {
  connectionId?: number;
}

export interface LoadedConnectionCredentials {
  connectionId: number;
  credentials: Record<string, string>;
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
            last_used_at = datetime('now'),
            last_error_at = datetime('now'),
            last_error_code = 'reauth_required',
            last_error_message = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(authError, authError.slice(0, 1000), connectionId)
    .run();

  await clearCachedCredentials(env, connectionId);
}

function truncateErrorMessage(message: string | null | undefined): string | null {
  const trimmed = safeTrim(message);
  return trimmed ? trimmed.slice(0, 1000) : null;
}

function serializeStringArray(values: string[] | null | undefined): string | null {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }

  return JSON.stringify(values.map((value) => value.trim()).filter(Boolean));
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
                 auth_provider, composio_connected_account_id, composio_auth_config_id, composio_toolkit
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
               auth_provider, composio_connected_account_id, composio_auth_config_id, composio_toolkit
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        ORDER BY is_default DESC, updated_at DESC, created_at DESC, id DESC
        LIMIT 1
      `,
    )
    .bind(userId, integration)
    .first<StoredIntegrationRow>();
}

function isComposioBackedConnection(record: StoredIntegrationRow): boolean {
  return record.auth_provider === "composio" || Boolean(record.composio_connected_account_id);
}

export async function loadCredentialsForIntegration(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
  options: CredentialLookupOptions = {},
): Promise<Record<string, string>> {
  const loaded = await loadConnectionCredentialsForIntegration(
    env,
    userId,
    integration,
    options,
  );

  return loaded.credentials;
}

export async function loadConnectionCredentialsForIntegration(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
  options: CredentialLookupOptions = {},
): Promise<LoadedConnectionCredentials> {
  const record = await loadConnectionRecord(env, userId, integration, options);

  if (!record) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }

  if (record.auth_state === "needs_reauth") {
    throw new Error(buildNeedsReauthMessage(integration, record.auth_error));
  }

  if (isComposioBackedConnection(record)) {
    const cached = await loadCachedCredentials(env, record.id);

    if (cached) {
      return {
        connectionId: record.id,
        credentials: cached,
      };
    }

    if (!record.credentials_encrypted) {
      throw new Error(`No credentials found for ${integration}. Please connect it first.`);
    }

    const credentials = await decryptCredential(
      record.credentials_encrypted,
      env.CREDENTIAL_ENCRYPTION_KEY,
    );

    await cacheCredentials(env, record.id, credentials);
    return {
      connectionId: record.id,
      credentials,
    };
  }

  const message = `${getOAuthProviderDisplayName(integration)} must be reconnected through ClawLink's hosted Composio flow.`;
  await markConnectionNeedsReauth(env, record.id, message);
  throw new Error(buildNeedsReauthMessage(integration, message));
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

  if (isComposioBackedConnection(record)) {
    if (!record.credentials_encrypted) {
      throw new Error(`No credentials found for ${integration}. Please connect it first.`);
    }

    const credentials = await decryptCredential(
      record.credentials_encrypted,
      env.CREDENTIAL_ENCRYPTION_KEY,
    );

    await cacheCredentials(env, record.id, credentials);
    return {
      connectionId: record.id,
      credentials,
    };
  }

  const message = `${getOAuthProviderDisplayName(integration)} must be reconnected through ClawLink's hosted Composio flow.`;
  await markConnectionNeedsReauth(env, record.id, message);
  throw new Error(buildNeedsReauthMessage(integration, message));
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

export async function recordConnectionExecutionSuccess(
  env: CredentialBridgeEnv,
  connectionId: number,
): Promise<void> {
  await env.DB
    .prepare(
      `
        UPDATE user_integrations
        SET last_used_at = datetime('now'),
            last_success_at = datetime('now'),
            last_error_at = NULL,
            last_error_code = NULL,
            last_error_message = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(connectionId)
    .run();
}

export async function recordConnectionExecutionFailure(
  env: CredentialBridgeEnv,
  connectionId: number,
  error: Pick<NormalizedToolError, "code" | "message">,
): Promise<void> {
  await env.DB
    .prepare(
      `
        UPDATE user_integrations
        SET last_used_at = datetime('now'),
            last_error_at = datetime('now'),
            last_error_code = ?,
            last_error_message = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(error.code ?? null, truncateErrorMessage(error.message), connectionId)
    .run();
}

export async function updateConnectionExecutionMetadata(
  env: CredentialBridgeEnv,
  connectionId: number,
  metadata: {
    scopes?: string[] | null;
    capabilities?: string[] | null;
  },
): Promise<void> {
  await env.DB
    .prepare(
      `
        UPDATE user_integrations
        SET scope_snapshot_json = COALESCE(?, scope_snapshot_json),
            capabilities_json = COALESCE(?, capabilities_json),
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(
      serializeStringArray(metadata.scopes),
      serializeStringArray(metadata.capabilities),
      connectionId,
    )
    .run();
}
