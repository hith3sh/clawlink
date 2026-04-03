import "server-only";

import {
  ensureUser,
  getAuthenticatedIdentity,
  getDatabase,
  getUserForCurrentIdentity,
  type D1LikeDatabase,
  randomToken,
  sha256Hex,
  type UserRow,
} from "@/lib/server/integration-store";

interface StoredApiKeyRow {
  id: number;
  user_id: string;
  name: string;
  last_used_at: string | null;
  created_at: string;
}

export interface ApiKeyRecord {
  id: number;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface CreatedApiKey {
  key: ApiKeyRecord;
  rawKey: string;
}

function mapApiKey(row: StoredApiKeyRow): ApiKeyRecord {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
  };
}

export async function listApiKeys(): Promise<ApiKeyRecord[]> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db || !user) {
    return [];
  }

  return listApiKeysForUserId(db, user.id);
}

export async function listApiKeysForUserId(
  db: D1LikeDatabase,
  userId: string,
): Promise<ApiKeyRecord[]> {
  const result = await db
    .prepare(
      `
        SELECT id, user_id, name, last_used_at, created_at
        FROM api_keys
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
    )
    .bind(userId)
    .all<StoredApiKeyRow>();

  return (result.results ?? []).map(mapApiKey);
}

export async function createApiKey(name: string): Promise<CreatedApiKey> {
  const db = getDatabase();
  const identity = await getAuthenticatedIdentity();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  if (!identity) {
    throw new Error("Unauthorized");
  }

  const user = await ensureUser(db, identity);
  const rawKey = `cllk_live_${randomToken(24)}`;
  const keyHash = await sha256Hex(rawKey);

  await db
    .prepare(
      `
        INSERT INTO api_keys (user_id, key_hash, name, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `,
    )
    .bind(user.id, keyHash, name)
    .run();

  const created = await db
    .prepare(
      `
        SELECT id, user_id, name, last_used_at, created_at
        FROM api_keys
        WHERE key_hash = ?
      `,
    )
    .bind(keyHash)
    .first<StoredApiKeyRow>();

  if (!created) {
    throw new Error("API key was created but could not be reloaded");
  }

  return {
    key: mapApiKey(created),
    rawKey,
  };
}

export async function deleteApiKey(id: number): Promise<void> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db
    .prepare("DELETE FROM api_keys WHERE id = ? AND user_id = ?")
    .bind(id, user.id)
    .run();
}

export async function authenticateApiKey(rawKey: string): Promise<UserRow | null> {
  const db = getDatabase();

  if (!db || !rawKey.startsWith("cllk_live_")) {
    return null;
  }

  const keyHash = await sha256Hex(rawKey);
  const row = await db
    .prepare(
      `
        SELECT users.id, users.clerk_id, users.email
        FROM api_keys
        INNER JOIN users ON users.id = api_keys.user_id
        WHERE api_keys.key_hash = ?
      `,
    )
    .bind(keyHash)
    .first<UserRow>();

  if (!row) {
    return null;
  }

  await db
    .prepare("UPDATE api_keys SET last_used_at = datetime('now') WHERE key_hash = ?")
    .bind(keyHash)
    .run();

  return row;
}
