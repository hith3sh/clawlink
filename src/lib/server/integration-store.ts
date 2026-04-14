import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ConnectionAuthState } from "@/lib/connection-status";
import { deleteNangoConnection } from "@/lib/server/nango";

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

export type IntegrationAuthProvider = "clawlink" | "nango";

export interface UserRow {
  id: string;
  clerk_id?: string;
  email?: string;
}

interface StoredIntegrationRow {
  id: number;
  integration: string;
  connection_label: string | null;
  account_label: string | null;
  external_account_id: string | null;
  credentials_encrypted: string;
  is_default: number;
  auth_state: ConnectionAuthState;
  auth_error: string | null;
  auth_provider: string;
  nango_connection_id: string | null;
  nango_provider_config_key: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface IntegrationConnectionRecord {
  id: number;
  integration: string;
  connectionLabel: string | null;
  accountLabel: string | null;
  externalAccountId: string | null;
  isDefault: boolean;
  authState: ConnectionAuthState;
  authError: string | null;
  authBackend: "local" | "nango";
  nangoConnectionId: string | null;
  nangoProviderConfigKey: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Identity {
  clerkId: string;
  email: string;
}

export type ConnectionSaveMode = "upsert_default" | "create_or_match_account";

export interface SaveIntegrationConnectionOptions {
  mode?: ConnectionSaveMode;
  connectionId?: number;
  setAsDefault?: boolean;
  authProvider?: IntegrationAuthProvider;
  nangoConnectionId?: string;
  nangoProviderConfigKey?: string;
}

export interface SaveNangoIntegrationConnectionOptions {
  mode?: ConnectionSaveMode;
  connectionId?: number;
  setAsDefault?: boolean;
  providerConfigKey: string;
  nangoConnectionId: string;
  connectionLabel?: string | null;
  accountLabel?: string | null;
  externalAccountId?: string | null;
  expiresAt?: string | null;
}

interface DerivedConnectionMetadata {
  accountLabel: string | null;
  connectionLabel: string | null;
  externalAccountId: string | null;
  expiresAt: string | null;
}

function authProviderToBackend(authProvider: string | null | undefined): "local" | "nango" {
  return authProvider === "nango" ? "nango" : "local";
}

function getOptionalRequestContext():
  | { env?: Record<string, unknown> }
  | undefined {
  try {
    return getCloudflareContext({ async: false }) as unknown as {
      env?: Record<string, unknown>;
    };
  } catch {
    return undefined;
  }
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

function safeTrim(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function formatCombinedLabel(primary: string | undefined, secondary: string | undefined): string | null {
  if (primary && secondary && primary !== secondary) {
    return `${primary} (${secondary})`;
  }

  return primary ?? secondary ?? null;
}

function deriveConnectionMetadata(
  slug: string,
  credentials: Record<string, string>,
): DerivedConnectionMetadata {
  const primaryEmail = safeTrim(credentials.primaryEmail) ?? safeTrim(credentials.email);
  const userPrincipalName = safeTrim(credentials.userPrincipalName);
  const displayName = safeTrim(credentials.displayName);
  const workspaceName = safeTrim(credentials.workspaceName);
  const workspaceId = safeTrim(credentials.workspaceId);
  const botId = safeTrim(credentials.botId);
  const username = safeTrim(credentials.username);
  const accountId = safeTrim(credentials.accountId);
  const email = safeTrim(credentials.email);
  const expiresAt = safeTrim(credentials.expiresAt) ?? null;

  if (slug === "outlook") {
    return {
      accountLabel: formatCombinedLabel(displayName, primaryEmail ?? userPrincipalName),
      connectionLabel: primaryEmail ?? userPrincipalName ?? displayName ?? "Outlook account",
      externalAccountId: safeTrim(credentials.graphUserId) ?? primaryEmail ?? userPrincipalName ?? null,
      expiresAt,
    };
  }

  if (slug === "notion") {
    return {
      accountLabel: workspaceName ?? "Notion workspace",
      connectionLabel: workspaceName ?? "Notion workspace",
      externalAccountId: workspaceId ?? botId ?? null,
      expiresAt,
    };
  }

  if (slug === "apollo") {
    return {
      accountLabel: workspaceName ?? displayName ?? email ?? "Apollo workspace",
      connectionLabel: workspaceName ?? displayName ?? email ?? "Apollo account",
      externalAccountId: workspaceId ?? accountId ?? email ?? null,
      expiresAt,
    };
  }

  return {
    accountLabel:
      formatCombinedLabel(displayName, primaryEmail) ??
      workspaceName ??
      username ??
      accountId ??
      null,
    connectionLabel:
      workspaceName ??
      primaryEmail ??
      username ??
      displayName ??
      accountId ??
      null,
    externalAccountId: accountId ?? primaryEmail ?? null,
    expiresAt,
  };
}

function mapConnection(row: StoredIntegrationRow): IntegrationConnectionRecord {
  return {
    id: row.id,
    integration: row.integration,
    connectionLabel: row.connection_label,
    accountLabel: row.account_label,
    externalAccountId: row.external_account_id,
    isDefault: Boolean(row.is_default),
    authState: row.auth_state,
    authError: row.auth_error,
    authBackend: authProviderToBackend(row.auth_provider),
    nangoConnectionId: row.nango_connection_id ?? null,
    nangoProviderConfigKey: row.nango_provider_config_key ?? null,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
  };
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

async function encryptNangoPlaceholderCredentials(params: {
  providerConfigKey: string;
  connectionId: string;
}): Promise<string> {
  return encryptCredentials({
    managedBy: "nango",
    providerConfigKey: params.providerConfigKey,
    nangoConnectionId: params.connectionId,
  });
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

export async function getIntegrationConnectionByIdForUserId(
  db: D1LikeDatabase,
  userId: string,
  connectionId: number,
): Promise<IntegrationConnectionRecord | null> {
  const result = await db
    .prepare(
      `
        SELECT id, integration, connection_label, account_label, external_account_id,
               credentials_encrypted, is_default, auth_state, auth_error, auth_provider,
               nango_connection_id, nango_provider_config_key, expires_at, created_at, updated_at
        FROM user_integrations
        WHERE user_id = ? AND id = ?
      `,
    )
    .bind(userId, connectionId)
    .first<StoredIntegrationRow>();

  return result ? mapConnection(result) : null;
}

async function findConnectionIdByExternalAccountId(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
  externalAccountId: string,
): Promise<number | null> {
  const row = await db
    .prepare(
      `
        SELECT id
        FROM user_integrations
        WHERE user_id = ? AND integration = ? AND external_account_id = ?
        LIMIT 1
      `,
    )
    .bind(userId, slug, externalAccountId)
    .first<{ id: number }>();

  return row?.id ?? null;
}

async function hasDefaultConnection(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
): Promise<boolean> {
  const row = await db
    .prepare(
      `
        SELECT id
        FROM user_integrations
        WHERE user_id = ? AND integration = ? AND is_default = 1
        LIMIT 1
      `,
    )
    .bind(userId, slug)
    .first<{ id: number }>();

  return Boolean(row?.id);
}

async function findConnectionIdByNangoConnectionId(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
  nangoConnectionId: string,
): Promise<number | null> {
  const row = await db
    .prepare(
      `
        SELECT id
        FROM user_integrations
        WHERE user_id = ? AND integration = ? AND nango_connection_id = ?
        LIMIT 1
      `,
    )
    .bind(userId, slug, nangoConnectionId)
    .first<{ id: number }>();

  return row?.id ?? null;
}

async function clearDefaultConnectionFlags(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
): Promise<void> {
  await db
    .prepare(
      `
        UPDATE user_integrations
        SET is_default = 0, updated_at = datetime('now')
        WHERE user_id = ? AND integration = ? AND is_default = 1
      `,
    )
    .bind(userId, slug)
    .run();
}

async function promoteLatestConnectionToDefault(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
): Promise<void> {
  const latestRemaining = await db
    .prepare(
      `
        SELECT id
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        ORDER BY updated_at DESC, created_at DESC, id DESC
        LIMIT 1
      `,
    )
    .bind(userId, slug)
    .first<{ id: number }>();

  if (!latestRemaining?.id) {
    return;
  }

  await db
    .prepare(
      `
        UPDATE user_integrations
        SET is_default = 1, updated_at = datetime('now')
        WHERE id = ?
      `,
    )
      .bind(latestRemaining.id)
      .run();
}

async function clearConnectionSessionReferences(
  db: D1LikeDatabase,
  userId: string,
  connectionId: number,
): Promise<void> {
  await db
    .prepare(
      `
        UPDATE connection_sessions
        SET connection_id = NULL,
            updated_at = datetime('now')
        WHERE user_id = ? AND connection_id = ?
      `,
    )
    .bind(userId, connectionId)
    .run();
}

export async function listIntegrationConnections(): Promise<IntegrationConnectionRecord[]> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db || !user) {
    return [];
  }

  return listIntegrationConnectionsForUserId(db, user.id);
}

export async function listIntegrationConnectionsForUserId(
  db: D1LikeDatabase,
  userId: string,
): Promise<IntegrationConnectionRecord[]> {
  const result = await db
    .prepare(
      `
        SELECT id, integration, connection_label, account_label, external_account_id,
               credentials_encrypted, is_default, auth_state, auth_error, auth_provider,
               nango_connection_id, nango_provider_config_key, expires_at, created_at, updated_at
        FROM user_integrations
        WHERE user_id = ?
        ORDER BY is_default DESC, created_at DESC, id DESC
      `,
    )
    .bind(userId)
    .all<StoredIntegrationRow>();

  return (result.results ?? []).map(mapConnection);
}

export async function listIntegrationConnectionsForSlug(
  slug: string,
): Promise<IntegrationConnectionRecord[]> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db || !user) {
    return [];
  }

  const result = await db
    .prepare(
      `
        SELECT id, integration, connection_label, account_label, external_account_id,
               credentials_encrypted, is_default, auth_state, auth_error, auth_provider,
               nango_connection_id, nango_provider_config_key, expires_at, created_at, updated_at
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        ORDER BY is_default DESC, created_at DESC, id DESC
      `,
    )
    .bind(user.id, slug)
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
        SELECT id, integration, connection_label, account_label, external_account_id,
               credentials_encrypted, is_default, auth_state, auth_error, auth_provider,
               nango_connection_id, nango_provider_config_key, expires_at, created_at, updated_at
        FROM user_integrations
        WHERE user_id = ? AND integration = ?
        ORDER BY is_default DESC, updated_at DESC, created_at DESC, id DESC
        LIMIT 1
      `,
    )
    .bind(userId, slug)
    .first<StoredIntegrationRow>();

  return result ? mapConnection(result) : null;
}

export async function getIntegrationConnectionById(
  connectionId: number,
): Promise<IntegrationConnectionRecord | null> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db || !user) {
    return null;
  }

  return getIntegrationConnectionByIdForUserId(db, user.id, connectionId);
}

export async function saveIntegrationConnection(
  slug: string,
  credentials: Record<string, string>,
  options: SaveIntegrationConnectionOptions = {},
): Promise<IntegrationConnectionRecord> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  return saveIntegrationConnectionForUserId(db, user.id, slug, credentials, options);
}

export async function saveIntegrationConnectionForUserId(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
  credentials: Record<string, string>,
  options: SaveIntegrationConnectionOptions = {},
): Promise<IntegrationConnectionRecord> {
  const encrypted = await encryptCredentials(credentials);
  const metadata = deriveConnectionMetadata(slug, credentials);
  const mode = options.mode ?? "upsert_default";
  let targetConnectionId = options.connectionId;
  const authProvider = options.authProvider ?? "clawlink";
  const nangoConnectionId = safeTrim(options.nangoConnectionId) ?? null;
  const nangoProviderConfigKey = safeTrim(options.nangoProviderConfigKey) ?? null;

  if (!targetConnectionId && nangoConnectionId) {
    targetConnectionId = await findConnectionIdByNangoConnectionId(db, userId, slug, nangoConnectionId) ?? undefined;
  }

  if (!targetConnectionId && mode === "create_or_match_account" && metadata.externalAccountId) {
    targetConnectionId = await findConnectionIdByExternalAccountId(
      db,
      userId,
      slug,
      metadata.externalAccountId,
    ) ?? undefined;
  }

  if (!targetConnectionId && mode === "upsert_default") {
    targetConnectionId = (await getIntegrationConnectionForUserId(db, userId, slug))?.id;
  }

  const shouldBeDefault = options.setAsDefault ?? true;
  const needsDefault = shouldBeDefault || !(await hasDefaultConnection(db, userId, slug));

  if (needsDefault) {
    await clearDefaultConnectionFlags(db, userId, slug);
  }

  if (targetConnectionId) {
    await db
      .prepare(
        `
          UPDATE user_integrations
          SET credentials_encrypted = ?,
              connection_label = ?,
              account_label = ?,
              external_account_id = ?,
              is_default = ?,
              auth_state = 'active',
              auth_error = NULL,
              auth_provider = ?,
              nango_connection_id = ?,
              nango_provider_config_key = ?,
              expires_at = ?,
              updated_at = datetime('now')
          WHERE id = ? AND user_id = ?
        `,
      )
      .bind(
        encrypted,
        metadata.connectionLabel,
        metadata.accountLabel,
        metadata.externalAccountId,
        needsDefault ? 1 : 0,
        authProvider,
        nangoConnectionId,
        nangoProviderConfigKey,
        metadata.expiresAt,
        targetConnectionId,
        userId,
      )
      .run();
  } else {
    await db
      .prepare(
        `
          INSERT INTO user_integrations (
            user_id,
            integration,
            connection_label,
            account_label,
            external_account_id,
            credentials_encrypted,
            is_default,
            auth_state,
            auth_error,
            auth_provider,
            nango_connection_id,
            nango_provider_config_key,
            expires_at,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NULL, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `,
      )
      .bind(
        userId,
        slug,
        metadata.connectionLabel,
        metadata.accountLabel,
        metadata.externalAccountId,
        encrypted,
        needsDefault ? 1 : 0,
        authProvider,
        nangoConnectionId,
        nangoProviderConfigKey,
        metadata.expiresAt,
      )
      .run();

    if (nangoConnectionId) {
      targetConnectionId = await findConnectionIdByNangoConnectionId(db, userId, slug, nangoConnectionId) ?? undefined;
    } else if (metadata.externalAccountId) {
      targetConnectionId = await findConnectionIdByExternalAccountId(
        db,
        userId,
        slug,
        metadata.externalAccountId,
      ) ?? undefined;
    }
  }

  const saved = targetConnectionId
    ? await getIntegrationConnectionByIdForUserId(db, userId, targetConnectionId)
    : await getIntegrationConnectionForUserId(db, userId, slug);

  if (!saved) {
    throw new Error("Integration was saved but could not be reloaded");
  }

  return saved;
}

export async function saveNangoIntegrationConnectionForUserId(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
  options: SaveNangoIntegrationConnectionOptions,
): Promise<IntegrationConnectionRecord> {
  const placeholderCredentials = await encryptNangoPlaceholderCredentials({
    providerConfigKey: options.providerConfigKey,
    connectionId: options.nangoConnectionId,
  });
  let targetConnectionId = options.connectionId;

  if (!targetConnectionId) {
    targetConnectionId =
      (await findConnectionIdByNangoConnectionId(
        db,
        userId,
        slug,
        options.nangoConnectionId,
      )) ?? undefined;
  }

  if (
    !targetConnectionId &&
    options.mode === "create_or_match_account" &&
    options.externalAccountId
  ) {
    targetConnectionId =
      (await findConnectionIdByExternalAccountId(
        db,
        userId,
        slug,
        options.externalAccountId,
      )) ?? undefined;
  }

  if (!targetConnectionId && options.mode === "upsert_default") {
    targetConnectionId =
      (await getIntegrationConnectionForUserId(db, userId, slug))?.id;
  }

  const shouldBeDefault = options.setAsDefault ?? true;
  const needsDefault =
    shouldBeDefault || !(await hasDefaultConnection(db, userId, slug));

  if (needsDefault) {
    await clearDefaultConnectionFlags(db, userId, slug);
  }

  if (targetConnectionId) {
    await db
      .prepare(
        `
          UPDATE user_integrations
          SET credentials_encrypted = ?,
              connection_label = ?,
              account_label = ?,
              external_account_id = ?,
              is_default = ?,
              auth_state = 'active',
              auth_error = NULL,
              auth_provider = 'nango',
              nango_connection_id = ?,
              nango_provider_config_key = ?,
              expires_at = ?,
              updated_at = datetime('now')
          WHERE id = ? AND user_id = ?
        `,
      )
      .bind(
        placeholderCredentials,
        options.connectionLabel ?? null,
        options.accountLabel ?? null,
        options.externalAccountId ?? null,
        needsDefault ? 1 : 0,
        options.nangoConnectionId,
        options.providerConfigKey,
        options.expiresAt ?? null,
        targetConnectionId,
        userId,
      )
      .run();
  } else {
    await db
      .prepare(
        `
          INSERT INTO user_integrations (
            user_id,
            integration,
            connection_label,
            account_label,
            external_account_id,
            credentials_encrypted,
            is_default,
            auth_state,
            auth_error,
            auth_provider,
            nango_connection_id,
            nango_provider_config_key,
            expires_at,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NULL, 'nango', ?, ?, ?, datetime('now'), datetime('now'))
        `,
      )
      .bind(
        userId,
        slug,
        options.connectionLabel ?? null,
        options.accountLabel ?? null,
        options.externalAccountId ?? null,
        placeholderCredentials,
        needsDefault ? 1 : 0,
        options.nangoConnectionId,
        options.providerConfigKey,
        options.expiresAt ?? null,
      )
      .run();

    targetConnectionId =
      (await findConnectionIdByNangoConnectionId(
        db,
        userId,
        slug,
        options.nangoConnectionId,
      )) ?? undefined;
  }

  const saved = targetConnectionId
    ? await getIntegrationConnectionByIdForUserId(db, userId, targetConnectionId)
    : await getIntegrationConnectionForUserId(db, userId, slug);

  if (!saved) {
    throw new Error("Nango connection was saved but could not be reloaded");
  }

  return saved;
}

export async function deleteIntegrationConnection(
  slug: string,
  connectionId?: number,
): Promise<void> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (connectionId) {
    await deleteIntegrationConnectionForUserId(db, user.id, slug, connectionId);
    return;
  }

  const connection = await getIntegrationConnectionForUserId(db, user.id, slug);

  if (!connection) {
    return;
  }

  await deleteIntegrationConnectionForUserId(db, user.id, slug, connection.id);
}

export async function deleteIntegrationConnectionById(connectionId: number): Promise<void> {
  const db = getDatabase();
  const user = await getUserForCurrentIdentity();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  const connection = await getIntegrationConnectionByIdForUserId(db, user.id, connectionId);

  if (!connection) {
    return;
  }

  await deleteIntegrationConnectionForUserId(db, user.id, connection.integration, connectionId);
}

export async function deleteIntegrationConnectionForUserId(
  db: D1LikeDatabase,
  userId: string,
  slug: string,
  connectionId: number,
): Promise<void> {
  const connection = await getIntegrationConnectionByIdForUserId(db, userId, connectionId);

  if (!connection || connection.integration !== slug) {
    return;
  }

  await clearConnectionSessionReferences(db, userId, connectionId);

  if (
    connection.authBackend === "nango" &&
    connection.nangoProviderConfigKey &&
    connection.nangoConnectionId
  ) {
    try {
      await deleteNangoConnection(
        connection.nangoProviderConfigKey,
        connection.nangoConnectionId,
      );
    } catch (error) {
      console.error("Failed to delete Nango connection:", error);
    }
  }

  await db
    .prepare("DELETE FROM user_integrations WHERE id = ? AND user_id = ?")
    .bind(connectionId, userId)
    .run();

  if (connection.isDefault) {
    await promoteLatestConnectionToDefault(db, userId, slug);
  }
}

export async function markIntegrationConnectionNeedsReauthByNangoConnectionId(
  db: D1LikeDatabase,
  nangoConnectionId: string,
  authError: string,
): Promise<void> {
  await db
    .prepare(
      `
        UPDATE user_integrations
        SET auth_state = 'needs_reauth',
            auth_error = ?,
            updated_at = datetime('now')
        WHERE nango_connection_id = ?
      `,
    )
    .bind(authError, nangoConnectionId)
    .run();
}
