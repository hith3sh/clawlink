import "server-only";

import { getIntegrationBySlug } from "@/data/integrations";
import {
  getDatabase,
  getIntegrationConnectionByIdForUserId,
  getIntegrationConnectionForUserId,
  randomToken,
  saveNangoIntegrationConnectionForUserId,
  savePipedreamIntegrationConnectionForUserId,
  saveIntegrationConnectionForUserId,
  type SaveIntegrationConnectionOptions,
  type D1LikeDatabase,
  type IntegrationConnectionRecord,
  type UserRow,
} from "@/lib/server/integration-store";
import { validateManualIntegrationCredentials } from "@/lib/server/manual-credentials";
import {
  getNangoConnection,
  isNangoManagedIntegration,
  listNangoConnectionsForSession,
} from "@/lib/server/nango";
import type { PipedreamConnectionMetadata } from "@/lib/server/pipedream";

export type ConnectionSessionStatus =
  | "awaiting_user_action"
  | "connected"
  | "failed"
  | "expired";

interface StoredConnectionSessionRow {
  id: string;
  public_token: string;
  display_code: string;
  user_id: string;
  integration: string;
  connection_id: number | null;
  status: ConnectionSessionStatus;
  flow_type: string;
  error_message: string | null;
  expires_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ConnectionSessionRecord {
  id: string;
  token: string;
  userId: string;
  displayCode: string;
  integration: string;
  connectionId: number | null;
  status: ConnectionSessionStatus;
  flowType: string;
  errorMessage: string | null;
  expiresAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  connection: IntegrationConnectionRecord | null;
}

function mapSession(
  row: StoredConnectionSessionRow,
  connection: IntegrationConnectionRecord | null,
): ConnectionSessionRecord {
  return {
    id: row.id,
    token: row.public_token,
    userId: row.user_id,
    displayCode: row.display_code,
    integration: row.integration,
    connectionId: row.connection_id,
    status: row.status,
    flowType: row.flow_type,
    errorMessage: row.error_message,
    expiresAt: row.expires_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    connection,
  };
}

interface CreateConnectionSessionOptions {
  connectionId?: number | null;
}

function generateDisplayCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

async function loadSession(
  db: D1LikeDatabase,
  token: string,
): Promise<StoredConnectionSessionRow | null> {
  return db
    .prepare(
      `
        SELECT id, public_token, display_code, user_id, integration, connection_id, status, flow_type,
               error_message, expires_at, completed_at, created_at, updated_at
        FROM connection_sessions
        WHERE public_token = ?
      `,
    )
    .bind(token)
    .first<StoredConnectionSessionRow>();
}

async function loadSessionById(
  db: D1LikeDatabase,
  id: string,
): Promise<StoredConnectionSessionRow | null> {
  return db
    .prepare(
      `
        SELECT id, public_token, display_code, user_id, integration, connection_id, status, flow_type,
               error_message, expires_at, completed_at, created_at, updated_at
        FROM connection_sessions
        WHERE id = ?
      `,
    )
    .bind(id)
    .first<StoredConnectionSessionRow>();
}

async function loadSessionOwner(
  db: D1LikeDatabase,
  session: StoredConnectionSessionRow,
): Promise<UserRow | null> {
  return db
    .prepare(
      `
        SELECT id, clerk_id, email
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
    )
    .bind(session.user_id)
    .first<UserRow>();
}

async function loadConnectionForSession(
  db: D1LikeDatabase,
  session: StoredConnectionSessionRow,
): Promise<IntegrationConnectionRecord | null> {
  if (session.connection_id) {
    const exactConnection = await getIntegrationConnectionByIdForUserId(
      db,
      session.user_id,
      session.connection_id,
    );

    if (exactConnection) {
      return exactConnection;
    }

    return null;
  }

  if (session.status !== "awaiting_user_action") {
    return null;
  }

  return getIntegrationConnectionForUserId(db, session.user_id, session.integration);
}

async function expireIfNeeded(
  db: D1LikeDatabase,
  session: StoredConnectionSessionRow,
): Promise<StoredConnectionSessionRow> {
  if (session.status === "connected" || session.status === "failed" || session.status === "expired") {
    return session;
  }

  if (new Date(session.expires_at).getTime() > Date.now()) {
    return session;
  }

  await db
    .prepare(
      `
        UPDATE connection_sessions
        SET status = 'expired', updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(session.id)
    .run();

  return {
    ...session,
    status: "expired",
    updated_at: new Date().toISOString(),
  };
}

function safeTrim(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readNestedString(
  source: Record<string, unknown> | null,
  key: string,
): string | null {
  if (!source) {
    return null;
  }

  return safeTrim(source[key]);
}

function deriveNangoConnectionMetadata(
  integrationSlug: string,
  details: Awaited<ReturnType<typeof getNangoConnection>>,
): {
  connectionLabel: string | null;
  accountLabel: string | null;
  externalAccountId: string;
  expiresAt: string | null;
} {
  const integration = getIntegrationBySlug(integrationSlug);
  const metadata = details.metadata;
  const credentials = details.credentials;
  const fallbackLabel = integration?.name
    ? `${integration.name} connection`
    : "Connected account";
  const connectionLabel =
    readNestedString(metadata, "connection_label") ??
    readNestedString(metadata, "display_name") ??
    readNestedString(metadata, "workspace_name") ??
    readNestedString(metadata, "property_name") ??
    readNestedString(metadata, "account_name") ??
    readNestedString(metadata, "email") ??
    safeTrim(details.endUser?.displayName) ??
    safeTrim(details.endUser?.email) ??
    safeTrim(details.connectionId) ??
    fallbackLabel;
  const accountLabel =
    readNestedString(metadata, "account_label") ??
    readNestedString(metadata, "workspace_name") ??
    readNestedString(metadata, "account_name") ??
    readNestedString(metadata, "property_name") ??
    readNestedString(metadata, "email") ??
    safeTrim(details.endUser?.displayName) ??
    safeTrim(details.endUser?.email) ??
    connectionLabel;
  const externalAccountId =
    readNestedString(metadata, "external_account_id") ??
    readNestedString(metadata, "property_id") ??
    readNestedString(metadata, "account_id") ??
    safeTrim(details.connectionId) ??
    crypto.randomUUID();
  const expiresAt =
    safeTrim(credentials.expires_at) ??
    safeTrim(credentials.expiresAt) ??
    null;

  return {
    connectionLabel,
    accountLabel,
    externalAccountId,
    expiresAt,
  };
}

async function reconcileNangoSessionIfNeeded(
  db: D1LikeDatabase,
  session: StoredConnectionSessionRow,
): Promise<StoredConnectionSessionRow> {
  if (session.status !== "awaiting_user_action") {
    return session;
  }

  if (!isNangoManagedIntegration(session.integration)) {
    return session;
  }

  try {
    const matches = await listNangoConnectionsForSession({
      sessionId: session.id,
      userId: session.user_id,
      integrationSlug: session.integration,
    });
    const latest = matches[0];

    if (!latest) {
      return session;
    }

    const details = await getNangoConnection(
      latest.providerConfigKey,
      latest.connectionId,
      { forceRefresh: false, includeRefreshToken: false },
    );
    const metadata = deriveNangoConnectionMetadata(session.integration, details);
    const connection = await saveNangoIntegrationConnectionForUserId(
      db,
      session.user_id,
      session.integration,
      {
        mode: session.connection_id ? "upsert_default" : "create_or_match_account",
        connectionId: session.connection_id ?? undefined,
        setAsDefault: true,
        providerConfigKey: details.providerConfigKey,
        nangoConnectionId: details.connectionId,
        connectionLabel: metadata.connectionLabel,
        accountLabel: metadata.accountLabel,
        externalAccountId: metadata.externalAccountId,
        expiresAt: metadata.expiresAt,
      },
    );

    await db
      .prepare(
        `
          UPDATE connection_sessions
          SET connection_id = ?,
              status = 'connected',
              error_message = NULL,
              completed_at = datetime('now'),
              updated_at = datetime('now')
          WHERE id = ?
        `,
      )
      .bind(connection.id, session.id)
      .run();

    return {
      ...session,
      connection_id: connection.id,
      status: "connected",
      error_message: null,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to reconcile Nango session:", {
      sessionId: session.id,
      integration: session.integration,
      error,
    });
    return session;
  }
}

export async function createConnectionSession(
  user: UserRow,
  integrationSlug: string,
  options: CreateConnectionSessionOptions = {},
): Promise<ConnectionSessionRecord> {
  const db = getDatabase();
  const integration = getIntegrationBySlug(integrationSlug);

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  if (!integration) {
    throw new Error("Integration not found");
  }

  const id = crypto.randomUUID();
  const token = randomToken(24);
  const displayCode = generateDisplayCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await db
    .prepare(
      `
        INSERT INTO connection_sessions (
          id,
          public_token,
          display_code,
          user_id,
          integration,
          connection_id,
          status,
          flow_type,
          expires_at,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `,
    )
    .bind(
      id,
      token,
      displayCode,
      user.id,
      integration.slug,
      options.connectionId ?? null,
      "awaiting_user_action",
      integration.setupMode,
      expiresAt,
    )
    .run();

  return {
    id,
    token,
    userId: user.id,
    displayCode,
    integration: integration.slug,
    connectionId: options.connectionId ?? null,
    status: "awaiting_user_action",
    flowType: integration.setupMode,
    errorMessage: null,
    expiresAt,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    connection: null,
  };
}

async function hydrateConnectionSession(
  db: D1LikeDatabase,
  session: StoredConnectionSessionRow | null,
): Promise<ConnectionSessionRecord | null> {
  if (!session) {
    return null;
  }

  const normalized = await reconcileNangoSessionIfNeeded(
    db,
    await expireIfNeeded(db, session),
  );
  const connection = await loadConnectionForSession(db, normalized);

  return mapSession(normalized, connection);
}

export async function getConnectionSessionByToken(
  token: string,
): Promise<ConnectionSessionRecord | null> {
  const db = getDatabase();

  if (!db) {
    return null;
  }

  return hydrateConnectionSession(db, await loadSession(db, token));
}

export async function getConnectionSessionById(
  id: string,
): Promise<ConnectionSessionRecord | null> {
  const db = getDatabase();

  if (!db) {
    return null;
  }

  return hydrateConnectionSession(db, await loadSessionById(db, id));
}

export async function getConnectionSessionUserById(id: string): Promise<UserRow | null> {
  const db = getDatabase();

  if (!db) {
    return null;
  }

  const session = await loadSessionById(db, id);

  if (!session) {
    return null;
  }

  return loadSessionOwner(db, session);
}

export async function getLatestActiveConnectionSessionForUser(
  user: UserRow,
  integrationSlug: string,
): Promise<ConnectionSessionRecord | null> {
  const db = getDatabase();

  if (!db) {
    return null;
  }

  const session = await db
    .prepare(
      `
        SELECT id, public_token, display_code, user_id, integration, connection_id, status, flow_type,
               error_message, expires_at, completed_at, created_at, updated_at
        FROM connection_sessions
        WHERE user_id = ? AND integration = ?
          AND status IN ('awaiting_user_action')
        ORDER BY created_at DESC
        LIMIT 1
      `,
    )
    .bind(user.id, integrationSlug)
    .first<StoredConnectionSessionRow>();

  if (!session) {
    return null;
  }

  const normalized = await reconcileNangoSessionIfNeeded(
    db,
    await expireIfNeeded(db, session),
  );
  const connection = await loadConnectionForSession(db, normalized);

  return mapSession(normalized, connection);
}

export async function completeManualConnectionSession(
  token: string,
  credentials: Record<string, string>,
): Promise<ConnectionSessionRecord> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const session = await loadSession(db, token);

  if (!session) {
    throw new Error("Connection session not found");
  }

  const integration = getIntegrationBySlug(session.integration);

  if (!integration) {
    throw new Error("Integration not found");
  }

  const normalized = await expireIfNeeded(db, session);

  if (normalized.status === "expired") {
    throw new Error("This connection session has expired");
  }

  if (integration.setupMode !== "manual") {
    throw new Error(`${integration.name} requires a hosted OAuth flow that is not implemented yet`);
  }

  await validateManualIntegrationCredentials(normalized.integration, credentials);

  const connection = await saveIntegrationConnectionForUserId(
    db,
    normalized.user_id,
    normalized.integration,
    credentials,
    {
      mode: "create_or_match_account",
      setAsDefault: true,
    },
  );

  await db
    .prepare(
      `
        UPDATE connection_sessions
        SET connection_id = ?,
            status = 'connected',
            error_message = NULL,
            completed_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(connection.id, normalized.id)
    .run();

  const saved = await getConnectionSessionByToken(token);

  if (!saved) {
    throw new Error("Connection session was completed but could not be reloaded");
  }

  return saved;
}

async function completeOAuthConnectionSessionRecord(
  db: D1LikeDatabase,
  session: StoredConnectionSessionRow,
  credentials: Record<string, string>,
  saveOptions: SaveIntegrationConnectionOptions = {},
): Promise<ConnectionSessionRecord> {
  const integration = getIntegrationBySlug(session.integration);

  if (!integration) {
    throw new Error("Integration not found");
  }

  const normalized = await expireIfNeeded(db, session);

  if (normalized.status === "expired") {
    throw new Error("This connection session has expired");
  }

  if (integration.setupMode !== "oauth") {
    throw new Error(`${integration.name} does not use the hosted OAuth flow`);
  }

  const connection = await saveIntegrationConnectionForUserId(
    db,
    normalized.user_id,
    normalized.integration,
    credentials,
    {
      mode: "create_or_match_account",
      setAsDefault: true,
      ...saveOptions,
    },
  );

  await db
    .prepare(
      `
        UPDATE connection_sessions
        SET connection_id = ?,
            status = 'connected',
            error_message = NULL,
            completed_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(connection.id, normalized.id)
    .run();

  const saved = await getConnectionSessionById(normalized.id);

  if (!saved) {
    throw new Error("Connection session was completed but could not be reloaded");
  }

  return saved;
}

export async function completeOAuthConnectionSession(
  token: string,
  credentials: Record<string, string>,
  saveOptions: SaveIntegrationConnectionOptions = {},
): Promise<ConnectionSessionRecord> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const session = await loadSession(db, token);

  if (!session) {
    throw new Error("Connection session not found");
  }

  return completeOAuthConnectionSessionRecord(db, session, credentials, saveOptions);
}

export async function completeOAuthConnectionSessionById(
  id: string,
  credentials: Record<string, string>,
  saveOptions: SaveIntegrationConnectionOptions = {},
): Promise<ConnectionSessionRecord> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const session = await loadSessionById(db, id);

  if (!session) {
    throw new Error("Connection session not found");
  }

  return completeOAuthConnectionSessionRecord(db, session, credentials, saveOptions);
}

export async function completePipedreamConnectionSession(
  token: string,
  params: {
    pipedreamAccountId: string;
    metadata: PipedreamConnectionMetadata;
  },
): Promise<ConnectionSessionRecord> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const session = await loadSession(db, token);

  if (!session) {
    throw new Error("Connection session not found");
  }

  const integration = getIntegrationBySlug(session.integration);

  if (!integration) {
    throw new Error("Integration not found");
  }

  const normalized = await expireIfNeeded(db, session);

  if (normalized.status === "expired") {
    throw new Error("This connection session has expired");
  }

  if (integration.setupMode !== "pipedream") {
    throw new Error(`${integration.name} does not use the hosted Pipedream flow`);
  }

  const connection = await savePipedreamIntegrationConnectionForUserId(
    db,
    normalized.user_id,
    normalized.integration,
    {
      mode: normalized.connection_id ? "upsert_default" : "create_or_match_account",
      connectionId: normalized.connection_id ?? undefined,
      setAsDefault: true,
      pipedreamAccountId: params.pipedreamAccountId,
      connectionLabel: params.metadata.connectionLabel,
      accountLabel: params.metadata.accountLabel,
      externalAccountId: params.metadata.externalAccountId,
      expiresAt: params.metadata.expiresAt,
    },
  );

  await db
    .prepare(
      `
        UPDATE connection_sessions
        SET connection_id = ?,
            status = 'connected',
            error_message = NULL,
            completed_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(connection.id, normalized.id)
    .run();

  const saved = await getConnectionSessionById(normalized.id);

  if (!saved) {
    throw new Error("Connection session was completed but could not be reloaded");
  }

  return saved;
}

export async function failConnectionSession(token: string, message: string): Promise<void> {
  const db = getDatabase();

  if (!db) {
    return;
  }

  await db
    .prepare(
      `
        UPDATE connection_sessions
        SET status = 'failed', error_message = ?, updated_at = datetime('now')
        WHERE public_token = ?
      `,
    )
    .bind(message, token)
    .run();
}

export async function failConnectionSessionById(id: string, message: string): Promise<void> {
  const db = getDatabase();

  if (!db) {
    return;
  }

  await db
    .prepare(
      `
        UPDATE connection_sessions
        SET status = 'failed', error_message = ?, updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(message, id)
    .run();
}
