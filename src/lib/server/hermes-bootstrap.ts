import "server-only";

import {
  ensureUser,
  getDatabase,
  getEnvBinding,
  randomToken,
  sha256Hex,
  type D1LikeDatabase,
  type Identity,
} from "@/lib/server/integration-store";
import {
  createApiKeyForUserId,
  deleteApiKeyById,
} from "@/lib/server/api-keys";

export type HermesBootstrapSessionStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "expired"
  | "consumed"
  | "error";

interface StoredHermesBootstrapSessionRow {
  id: string;
  status: HermesBootstrapSessionStatus;
  agent_family: string;
  agent_version: string | null;
  client_label: string;
  hostname: string | null;
  platform: string | null;
  approval_return_hint: string | null;
  requested_transport: string | null;
  user_id: string | null;
  workspace_id: string | null;
  api_key_id: number | null;
  install_token_hash: string | null;
  issued_key_encrypted: string | null;
  expires_at: string;
  approved_at: string | null;
  consumed_at: string | null;
  created_at: string;
  updated_at: string | null;
  metadata_json: string | null;
}

export interface HermesBootstrapSessionRecord {
  id: string;
  status: HermesBootstrapSessionStatus;
  agentFamily: string;
  agentVersion: string | null;
  clientLabel: string;
  hostname: string | null;
  platform: string | null;
  approvalReturnHint: string | null;
  requestedTransport: string | null;
  userId: string | null;
  workspaceId: string | null;
  apiKeyId: number | null;
  expiresAt: string;
  approvedAt: string | null;
  consumedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateHermesBootstrapSessionInput {
  agent_family?: unknown;
  agent_version?: unknown;
  client_label?: unknown;
  hostname?: unknown;
  platform?: unknown;
  approval_return_hint?: unknown;
  requested_transport?: unknown;
  metadata?: unknown;
}

export interface HermesInstallConfig {
  server_name: "clawlink";
  url: string;
  headers: {
    "x-clawlink-api-key": string;
  };
  timeout: 180;
  connect_timeout: 60;
}

export const HERMES_BOOTSTRAP_TTL_MS = 15 * 60 * 1000;
export const HERMES_BOOTSTRAP_POLL_INTERVAL_MS = 3000;
export const HERMES_BOOTSTRAP_RATE_LIMIT_MAX = 20;

function safeTrim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function normalizeText(value: unknown, fallback: string, maxLength: number): string {
  return (safeTrim(value) ?? fallback).slice(0, maxLength);
}

function nullableText(value: unknown, maxLength: number): string | null {
  return safeTrim(value)?.slice(0, maxLength) ?? null;
}

function encodeBase64(bytes: Uint8Array): string {
  if (typeof btoa === "function") {
    return btoa(String.fromCharCode(...bytes));
  }

  return Buffer.from(bytes).toString("base64");
}

function decodeBase64(value: string): Uint8Array {
  if (typeof atob === "function") {
    return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
  }

  return Uint8Array.from(Buffer.from(value, "base64"));
}

function getEncryptionKey(): string {
  const encryptionKey = getEnvBinding<string>("CREDENTIAL_ENCRYPTION_KEY");

  if (!encryptionKey) {
    throw new Error("CREDENTIAL_ENCRYPTION_KEY is not configured");
  }

  return encryptionKey;
}

async function encryptIssuedKey(rawKey: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getEncryptionKey().padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify({ rawKey }));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  const combined = new Uint8Array(iv.length + encrypted.byteLength);

  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return encodeBase64(combined);
}

async function decryptIssuedKey(ciphertext: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getEncryptionKey().padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );

  const combined = decodeBase64(ciphertext);
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
  const payload = JSON.parse(new TextDecoder().decode(decrypted)) as {
    rawKey?: unknown;
  };
  const rawKey = safeTrim(payload.rawKey);

  if (!rawKey) {
    throw new Error("Issued Hermes bootstrap credential is invalid.");
  }

  return rawKey;
}

function getDatabaseOrThrow(): D1LikeDatabase {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  return db;
}

function mapSession(row: StoredHermesBootstrapSessionRow): HermesBootstrapSessionRecord {
  return {
    id: row.id,
    status: row.status,
    agentFamily: row.agent_family,
    agentVersion: row.agent_version,
    clientLabel: row.client_label,
    hostname: row.hostname,
    platform: row.platform,
    approvalReturnHint: row.approval_return_hint,
    requestedTransport: row.requested_transport,
    userId: row.user_id,
    workspaceId: row.workspace_id,
    apiKeyId: row.api_key_id,
    expiresAt: row.expires_at,
    approvedAt: row.approved_at,
    consumedAt: row.consumed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
  };
}

async function loadSession(
  db: D1LikeDatabase,
  sessionId: string,
): Promise<StoredHermesBootstrapSessionRow | null> {
  return db
    .prepare(
      `
        SELECT id, status, agent_family, agent_version, client_label, hostname,
               platform, approval_return_hint, requested_transport, user_id,
               workspace_id, api_key_id, install_token_hash, issued_key_encrypted,
               expires_at, approved_at, consumed_at, created_at, updated_at,
               metadata_json
        FROM hermes_bootstrap_sessions
        WHERE id = ?
      `,
    )
    .bind(sessionId)
    .first<StoredHermesBootstrapSessionRow>();
}

async function expireIfNeeded(
  db: D1LikeDatabase,
  row: StoredHermesBootstrapSessionRow,
): Promise<StoredHermesBootstrapSessionRow> {
  if (
    row.status === "expired" ||
    row.status === "rejected" ||
    row.status === "consumed" ||
    row.status === "error"
  ) {
    return row;
  }

  if (new Date(row.expires_at).getTime() > Date.now()) {
    return row;
  }

  if (row.api_key_id) {
    await deleteApiKeyById(db, row.api_key_id);
  }

  await db
    .prepare(
      `
        UPDATE hermes_bootstrap_sessions
        SET status = 'expired',
            api_key_id = NULL,
            issued_key_encrypted = NULL,
            install_token_hash = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(row.id)
    .run();

  return {
    ...row,
    status: "expired",
    api_key_id: null,
    issued_key_encrypted: null,
    install_token_hash: null,
    updated_at: new Date().toISOString(),
  };
}

async function reloadCurrentSession(
  db: D1LikeDatabase,
  sessionId: string,
): Promise<StoredHermesBootstrapSessionRow> {
  const row = await loadSession(db, sessionId);

  if (!row) {
    throw new Error("Hermes bootstrap session not found.");
  }

  return expireIfNeeded(db, row);
}

function buildApiKeyName(row: StoredHermesBootstrapSessionRow): string {
  const label = row.client_label || "Hermes Agent";
  const suffix = row.hostname ? ` (${row.hostname})` : "";

  return `Hermes MCP - ${label}${suffix}`.slice(0, 120);
}

function buildMcpUrl(): string {
  const configuredUrl = safeTrim(getEnvBinding<string>("CLAWLINK_MCP_URL"));

  return configuredUrl ?? "https://claw-link.dev/api/mcp";
}

function buildInstallConfig(rawKey: string): HermesInstallConfig {
  return {
    server_name: "clawlink",
    url: buildMcpUrl(),
    headers: {
      "x-clawlink-api-key": rawKey,
    },
    timeout: 180,
    connect_timeout: 60,
  };
}

export function getHermesBootstrapErrorStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : "";

  if (message === "Unauthorized") {
    return 401;
  }

  if (/not found/i.test(message)) {
    return 404;
  }

  if (/expired/i.test(message)) {
    return 410;
  }

  if (/already/i.test(message) || /not pending/i.test(message)) {
    return 409;
  }

  if (/rate limit/i.test(message) || /too many/i.test(message)) {
    return 429;
  }

  if (/invalid/i.test(message) || /required/i.test(message)) {
    return 400;
  }

  return 500;
}

export async function createHermesBootstrapSession(
  input: CreateHermesBootstrapSessionInput,
  requestIp: string | null,
): Promise<HermesBootstrapSessionRecord> {
  const db = getDatabaseOrThrow();
  const ipHash = requestIp ? await sha256Hex(requestIp) : null;

  if (ipHash) {
    const recent = await db
      .prepare(
        `
          SELECT COUNT(*) AS count
          FROM hermes_bootstrap_sessions
          WHERE ip_hash = ? AND created_at >= datetime('now', '-1 hour')
        `,
      )
      .bind(ipHash)
      .first<{ count: number }>();

    if ((recent?.count ?? 0) >= HERMES_BOOTSTRAP_RATE_LIMIT_MAX) {
      throw new Error("Too many Hermes bootstrap sessions. Try again later.");
    }
  }

  const id = `hbs_${randomToken(18)}`;
  const agentFamily = normalizeText(input.agent_family, "hermes", 40);

  if (agentFamily !== "hermes") {
    throw new Error("agent_family must be hermes");
  }

  const clientLabel = normalizeText(input.client_label, "Hermes Agent", 80);
  const metadataJson =
    input.metadata && typeof input.metadata === "object"
      ? JSON.stringify(input.metadata).slice(0, 4000)
      : null;
  const expiresAt = new Date(Date.now() + HERMES_BOOTSTRAP_TTL_MS).toISOString();

  await db
    .prepare(
      `
        INSERT INTO hermes_bootstrap_sessions (
          id,
          status,
          agent_family,
          agent_version,
          client_label,
          hostname,
          platform,
          approval_return_hint,
          requested_transport,
          ip_hash,
          expires_at,
          created_at,
          updated_at,
          metadata_json
        )
        VALUES (?, 'pending_approval', ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)
      `,
    )
    .bind(
      id,
      agentFamily,
      nullableText(input.agent_version, 80),
      clientLabel,
      nullableText(input.hostname, 120),
      nullableText(input.platform, 60),
      nullableText(input.approval_return_hint, 40),
      nullableText(input.requested_transport, 80),
      ipHash,
      expiresAt,
      metadataJson,
    )
    .run();

  const row = await loadSession(db, id);

  if (!row) {
    throw new Error("Hermes bootstrap session could not be reloaded.");
  }

  return mapSession(row);
}

export async function getHermesBootstrapSession(
  sessionId: string,
): Promise<HermesBootstrapSessionRecord | null> {
  const db = getDatabaseOrThrow();
  const row = await loadSession(db, sessionId);

  if (!row) {
    return null;
  }

  return mapSession(await expireIfNeeded(db, row));
}

export async function approveHermesBootstrapSession(
  sessionId: string,
  identity: Identity,
): Promise<HermesBootstrapSessionRecord> {
  const db = getDatabaseOrThrow();
  const row = await reloadCurrentSession(db, sessionId);

  if (row.status === "expired") {
    throw new Error("This Hermes approval link expired. Run the installer again.");
  }

  if (row.status === "rejected") {
    throw new Error("This Hermes bootstrap session was canceled.");
  }

  if (row.status === "consumed") {
    return mapSession(row);
  }

  const user = await ensureUser(db, identity);

  if (row.user_id && row.user_id !== user.id) {
    throw new Error("This Hermes bootstrap session is already approved for another ClawLink account.");
  }

  if (row.status === "approved" && row.api_key_id && row.issued_key_encrypted) {
    return mapSession(row);
  }

  if (row.status !== "pending_approval" && row.status !== "approved") {
    throw new Error("This Hermes bootstrap session is not pending approval.");
  }

  const created = await createApiKeyForUserId(db, user.id, buildApiKeyName(row));
  const issuedKeyEncrypted = await encryptIssuedKey(created.rawKey);
  const tokenHash = await sha256Hex(created.rawKey);

  await db
    .prepare(
      `
        UPDATE hermes_bootstrap_sessions
        SET status = 'approved',
            user_id = ?,
            workspace_id = ?,
            api_key_id = ?,
            install_token_hash = ?,
            issued_key_encrypted = ?,
            approved_at = COALESCE(approved_at, datetime('now')),
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(user.id, user.id, created.key.id, tokenHash, issuedKeyEncrypted, row.id)
    .run();

  const reloaded = await loadSession(db, sessionId);

  if (!reloaded) {
    throw new Error("Hermes bootstrap session could not be reloaded.");
  }

  return mapSession(reloaded);
}

export async function rejectHermesBootstrapSession(
  sessionId: string,
  identity: Identity,
): Promise<HermesBootstrapSessionRecord> {
  const db = getDatabaseOrThrow();
  const row = await reloadCurrentSession(db, sessionId);
  const user = await ensureUser(db, identity);

  if (row.status === "approved" && row.api_key_id) {
    await deleteApiKeyById(db, row.api_key_id);
  }

  await db
    .prepare(
      `
        UPDATE hermes_bootstrap_sessions
        SET status = 'rejected',
            user_id = COALESCE(user_id, ?),
            api_key_id = NULL,
            install_token_hash = NULL,
            issued_key_encrypted = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(user.id, row.id)
    .run();

  return mapSession(await reloadCurrentSession(db, sessionId));
}

export async function getHermesBootstrapInstall(
  sessionId: string,
): Promise<{ session: HermesBootstrapSessionRecord; install: HermesInstallConfig | null }> {
  const db = getDatabaseOrThrow();
  const row = await reloadCurrentSession(db, sessionId);

  if (row.status !== "approved" || !row.issued_key_encrypted) {
    return {
      session: mapSession(row),
      install: null,
    };
  }

  return {
    session: mapSession(row),
    install: buildInstallConfig(await decryptIssuedKey(row.issued_key_encrypted)),
  };
}

export async function consumeHermesBootstrapSession(
  sessionId: string,
): Promise<HermesBootstrapSessionRecord> {
  const db = getDatabaseOrThrow();
  const row = await reloadCurrentSession(db, sessionId);

  if (row.status === "consumed") {
    return mapSession(row);
  }

  if (row.status !== "approved") {
    throw new Error("This Hermes bootstrap session is not approved.");
  }

  await db
    .prepare(
      `
        UPDATE hermes_bootstrap_sessions
        SET status = 'consumed',
            issued_key_encrypted = NULL,
            consumed_at = COALESCE(consumed_at, datetime('now')),
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(row.id)
    .run();

  const reloaded = await loadSession(db, sessionId);

  if (!reloaded) {
    throw new Error("Hermes bootstrap session could not be reloaded.");
  }

  return mapSession(reloaded);
}
