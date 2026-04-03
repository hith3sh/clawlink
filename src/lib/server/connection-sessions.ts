import "server-only";

import { getIntegrationBySlug } from "@/data/integrations";
import {
  getDatabase,
  getIntegrationConnectionForUserId,
  randomToken,
  saveIntegrationConnectionForUserId,
  type D1LikeDatabase,
  type IntegrationConnectionRecord,
  type UserRow,
} from "@/lib/server/integration-store";

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
  displayCode: string;
  integration: string;
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
    displayCode: row.display_code,
    integration: row.integration,
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
        SELECT id, public_token, display_code, user_id, integration, status, flow_type,
               error_message, expires_at, completed_at, created_at, updated_at
        FROM connection_sessions
        WHERE public_token = ?
      `,
    )
    .bind(token)
    .first<StoredConnectionSessionRow>();
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

export async function createConnectionSession(
  user: UserRow,
  integrationSlug: string,
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
          status,
          flow_type,
          expires_at,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `,
    )
    .bind(
      id,
      token,
      displayCode,
      user.id,
      integration.slug,
      "awaiting_user_action",
      integration.setupMode,
      expiresAt,
    )
    .run();

  return {
    id,
    token,
    displayCode,
    integration: integration.slug,
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

export async function getConnectionSessionByToken(
  token: string,
): Promise<ConnectionSessionRecord | null> {
  const db = getDatabase();

  if (!db) {
    return null;
  }

  const session = await loadSession(db, token);

  if (!session) {
    return null;
  }

  const normalized = await expireIfNeeded(db, session);
  const connection = await getIntegrationConnectionForUserId(
    db,
    normalized.user_id,
    normalized.integration,
  );

  return mapSession(normalized, connection);
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
        SELECT id, public_token, display_code, user_id, integration, status, flow_type,
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

  const normalized = await expireIfNeeded(db, session);
  const connection = await getIntegrationConnectionForUserId(db, user.id, integrationSlug);

  if (normalized.status === "expired") {
    return mapSession(normalized, connection);
  }

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

  await saveIntegrationConnectionForUserId(db, normalized.user_id, normalized.integration, credentials);

  await db
    .prepare(
      `
        UPDATE connection_sessions
        SET status = 'connected',
            error_message = NULL,
            completed_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(normalized.id)
    .run();

  const saved = await getConnectionSessionByToken(token);

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
