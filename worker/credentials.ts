import { decryptCredential } from "./crypto";

interface D1Statement {
  bind(...values: unknown[]): {
    first<T = Record<string, unknown>>(): Promise<T | null>;
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
}

function cacheKey(userId: string, integration: string): string {
  return `cred:${userId}:${integration}`;
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

export async function loadCredentialsForIntegration(
  env: CredentialBridgeEnv,
  userId: string,
  integration: string,
): Promise<Record<string, string>> {
  const cached = await loadCachedCredentials(env, userId, integration);

  if (cached) {
    return cached;
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

  const credentials = await decryptCredential(
    record.credentials_encrypted,
    env.CREDENTIAL_ENCRYPTION_KEY,
  );

  await cacheCredentials(env, userId, integration, credentials);

  return credentials;
}
