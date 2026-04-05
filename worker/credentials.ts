import { decryptCredential, encryptCredential } from "./crypto";

interface D1Statement {
  bind(...values: unknown[]): {
    first<T = Record<string, unknown>>(): Promise<T | null>;
    run(): Promise<unknown>;
  };
}

interface D1LikeDatabase {
  prepare(query: string): D1Statement;
}

interface KVLikeNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface UserRow {
  id: string;
}

interface StoredIntegrationRow {
  credentials_encrypted: string;
}

export interface CredentialBridgeEnv {
  DB: D1LikeDatabase;
  CREDENTIALS?: KVLikeNamespace;
  CREDENTIAL_ENCRYPTION_KEY?: string;
  OUTLOOK_CLIENT_ID?: string;
  OUTLOOK_CLIENT_SECRET?: string;
}

interface OutlookTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

function cacheKey(userId: string, integration: string): string {
  return `cred:${userId}:${integration}`;
}

function safeTrim(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function shouldRefreshOutlookCredentials(credentials: Record<string, string>): boolean {
  if (!safeTrim(credentials.refreshToken)) {
    return false;
  }

  const accessToken = safeTrim(credentials.accessToken);
  const expiresAt = safeTrim(credentials.expiresAt);

  if (!accessToken || !expiresAt) {
    return true;
  }

  const expiresAtMs = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtMs)) {
    return true;
  }

  return expiresAtMs - Date.now() <= 5 * 60 * 1000;
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

async function loadCachedCredentials(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
): Promise<Record<string, string> | null> {
  const raw = await env.CREDENTIALS?.get(cacheKey(userId, integration));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}

async function cacheCredentials(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
  credentials: Record<string, string>,
): Promise<void> {
  if (!env.CREDENTIALS) {
    return;
  }

  await env.CREDENTIALS.put(
    cacheKey(userId, integration),
    JSON.stringify(credentials),
    { expirationTtl: 60 * 30 },
  );
}

async function persistCredentials(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
  credentials: Record<string, string>,
): Promise<void> {
  const encrypted = await encryptCredential(credentials, env.CREDENTIAL_ENCRYPTION_KEY);

  await env.DB
    .prepare(
      `
        UPDATE user_integrations
        SET credentials_encrypted = ?, updated_at = datetime('now')
        WHERE user_id = ? AND integration = ?
      `,
    )
    .bind(encrypted, userId, integration)
    .run();

  await cacheCredentials(env, userId, integration, credentials);
}

function getOutlookOAuthConfig(env: CredentialBridgeEnv): { clientId: string; clientSecret: string } {
  const clientId = safeTrim(env.OUTLOOK_CLIENT_ID);
  const clientSecret = safeTrim(env.OUTLOOK_CLIENT_SECRET);

  if (!clientId || !clientSecret) {
    throw new Error("Outlook OAuth is not configured on the worker.");
  }

  return { clientId, clientSecret };
}

async function refreshOutlookCredentials(
  env: CredentialBridgeEnv,
  credentials: Record<string, string>,
): Promise<Record<string, string>> {
  const refreshToken = safeTrim(credentials.refreshToken);

  if (!refreshToken) {
    throw new Error("Outlook credentials are missing a refresh token.");
  }

  const { clientId, clientSecret } = getOutlookOAuthConfig(env);
  const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  const payload = (await response.json().catch(() => null)) as OutlookTokenResponse | null;

  if (!response.ok) {
    const description = safeTrim(payload?.error_description) ?? safeTrim(payload?.error) ?? response.statusText;
    throw new Error(`Failed to refresh Outlook credentials: ${description}`);
  }

  const accessToken = safeTrim(payload?.access_token);

  if (!accessToken) {
    throw new Error("Microsoft token refresh succeeded but did not return an access token.");
  }

  const expiresIn = typeof payload?.expires_in === "number" ? payload.expires_in : 3600;

  return {
    ...credentials,
    accessToken,
    refreshToken: safeTrim(payload?.refresh_token) ?? refreshToken,
    tokenType: safeTrim(payload?.token_type) ?? credentials.tokenType ?? "Bearer",
    scope: safeTrim(payload?.scope) ?? credentials.scope ?? "",
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
  };
}

async function maybeRefreshCredentials(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
  credentials: Record<string, string>,
): Promise<Record<string, string>> {
  if (integration !== "outlook" || !shouldRefreshOutlookCredentials(credentials)) {
    return credentials;
  }

  const refreshed = await refreshOutlookCredentials(env, credentials);
  await persistCredentials(env, userId, integration, refreshed);
  return refreshed;
}

export async function loadCredentialsForIntegration(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
): Promise<Record<string, string>> {
  const cached = await loadCachedCredentials(env, userId, integration);

  if (cached) {
    const refreshedCachedCredentials = await maybeRefreshCredentials(env, userId, integration, cached);

    if (refreshedCachedCredentials !== cached) {
      await cacheCredentials(env, userId, integration, refreshedCachedCredentials);
    }

    return refreshedCachedCredentials;
  }

  const record = await env.DB
    .prepare(
      `
        SELECT credentials_encrypted
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        LIMIT 1
      `,
    )
    .bind(userId, integration)
    .first<StoredIntegrationRow>();

  if (!record?.credentials_encrypted) {
    throw new Error(`No credentials found for ${integration}. Please connect it first.`);
  }

  const decryptedCredentials = await decryptCredential(
    record.credentials_encrypted,
    env.CREDENTIAL_ENCRYPTION_KEY,
  );

  const credentials = await maybeRefreshCredentials(env, userId, integration, decryptedCredentials);
  await cacheCredentials(env, userId, integration, credentials);

  return credentials;
}
