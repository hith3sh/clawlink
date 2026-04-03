import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

export interface D1Statement {
  bind(...values: unknown[]): {
    all<T = Record<string, unknown>>(): Promise<{ results?: T[] }>;
    first<T = Record<string, unknown>>(): Promise<T | null>;
    run(): Promise<unknown>;
  };
}

export interface D1LikeDatabase {
  prepare(query: string): D1Statement;
}

export interface UserRow {
  id: string;
  clerk_id?: string;
  email?: string;
}

interface StoredIntegrationRow {
  integration: string;
  expires_at: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface IntegrationConnectionRecord {
  integration: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Identity {
  clerkId: string;
  email: string;
}

export function getEnvBinding<T>(key: string): T | undefined {
  const context = getOptionalRequestContext();
  const contextValue = (context?.env as Record<string, unknown> | undefined)?.[key];
  if (contextValue !== undefined) {
    return contextValue as T;
  }

  return (process.env as Record<string, unknown>)[key] as T | undefined;
}

export function getDatabase(): D1LikeDatabase | undefined {
  return getEnvBinding<D1LikeDatabase>("DB");
}

function getEncryptionKey(): string | undefined {
  return getEnvBinding<string>("CREDENTIAL_ENCRYPTION_KEY");
}

function encodeBase64(bytes: Uint8Array): string {
  if (typeof btoa === "function") {
    return btoa(String.fromCharCode(...bytes));
  }

  return Buffer.from(bytes).toString("base64");
}

export function randomToken(bytes = 24): string {
  return encodeBase64(crypto.getRandomValues(new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function encryptCredentials(credentials: Record<string, string>): Promise<string> {
  const encryptionKey = getEncryptionKey();

  if (!encryptionKey) {
    throw new Error("CREDENTIAL_ENCRYPTION_KEY is not configured");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(credentials));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  const combined = new Uint8Array(iv.length + encrypted.byteLength);

  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return encodeBase64(combined);
}

export async function getAuthenticatedIdentity(): Promise<Identity | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    `${userId}@clawlink.local`;

  return {
    clerkId: userId,
    email,
  };
}

export async function ensureUser(db: D1LikeDatabase, identity: Identity): Promise<UserRow> {
  const existingUser = await db
    .prepare("SELECT id, clerk_id, email FROM users WHERE clerk_id = ?")
    .bind(identity.clerkId)
    .first<UserRow>();

  if (existingUser) {
    return existingUser;
  }

  const userId = crypto.randomUUID();

  await db
    .prepare(
      `
        INSERT INTO users (id, clerk_id, email, created_at, updated_at)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `,
    )
    .bind(userId, identity.clerkId, identity.email)
    .run();

  return {
    id: userId,
    clerk_id: identity.clerkId,
    email: identity.email,
  };
}

export async function getUserForCurrentIdentity(): Promise<UserRow | null> {
  const db = getDatabase();
  const identity = await getAuthenticatedIdentity();

  if (!db || !identity) {
    return null;
  }

  return ensureUser(db, identity);
}

function mapConnection(row: StoredIntegrationRow): IntegrationConnectionRecord {
  return {
    integration: row.integration,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
  };
}

export async function listIntegrationConnections(): Promise<IntegrationConnectionRecord[]> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db || !user) {
    return [];
  }

  const result = await db
    .prepare(
      `
        SELECT integration, expires_at, created_at, updated_at
        FROM user_integrations
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
    )
    .bind(user.id)
    .all<StoredIntegrationRow>();

  return (result.results ?? []).map(mapConnection);
}

export async function getIntegrationConnection(slug: string): Promise<IntegrationConnectionRecord | null> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db || !user) {
    return null;
  }

  return getIntegrationConnectionForUserId(db, user.id, slug);
}

export async function getIntegrationConnectionForUserId(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
): Promise<IntegrationConnectionRecord | null> {
  const result = await db
    .prepare(
      `
        SELECT integration, expires_at, created_at, updated_at
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
      `,
    )
    .bind(userId, slug)
    .first<StoredIntegrationRow>();

  return result ? mapConnection(result) : null;
}

export async function saveIntegrationConnection(
  slug: string,
  credentials: Record<string, string>,
): Promise<IntegrationConnectionRecord> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  return saveIntegrationConnectionForUserId(db, user.id, slug, credentials);
}

export async function saveIntegrationConnectionForUserId(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
  credentials: Record<string, string>,
): Promise<IntegrationConnectionRecord> {
  const encrypted = await encryptCredentials(credentials);

  await db
    .prepare(
      `
        INSERT INTO user_integrations (user_id, integration, credentials_encrypted, created_at, updated_at)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(user_id, integration)
        DO UPDATE SET
          credentials_encrypted = excluded.credentials_encrypted,
          updated_at = datetime('now')
      `,
    )
    .bind(userId, slug, encrypted)
    .run();

  const saved = await getIntegrationConnectionForUserId(db, userId, slug);

  if (!saved) {
    throw new Error("Integration was saved but could not be reloaded");
  }

  return saved;
}

export async function deleteIntegrationConnection(slug: string): Promise<void> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db
    .prepare("DELETE FROM user_integrations WHERE user_id = ? AND integration = ?")
    .bind(user.id, slug)
    .run();
}
