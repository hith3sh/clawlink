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

export type OpenClawPairingSessionStatus =
  | "awaiting_browser"
  | "ready_for_device"
  | "awaiting_local_save"
  | "paired"
  | "expired"
  | "failed";

interface StoredPairingSessionRow {
  id: string;
  public_token: string;
  display_code: string;
  device_label: string;
  verifier_hash: string;
  approved_user_id: string | null;
  api_key_id: number | null;
  issued_key_encrypted: string | null;
  status: OpenClawPairingSessionStatus;
  expires_at: string;
  approved_at: string | null;
  paired_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface OpenClawPairingSessionRecord {
  id: string;
  token: string;
  displayCode: string;
  deviceLabel: string;
  approvedUserId: string | null;
  approvedUserHint: string | null;
  apiKeyId: number | null;
  status: OpenClawPairingSessionStatus;
  expiresAt: string;
  approvedAt: string | null;
  pairedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface OpenClawPairingStartResult {
  session: OpenClawPairingSessionRecord;
  verifier: string;
}

export interface OpenClawPairingExchangeResult {
  session: OpenClawPairingSessionRecord;
  rawKey: string;
  keyId: number;
}

export const OPENCLAW_PAIRING_TTL_MS = 15 * 60 * 1000;
export const OPENCLAW_PAIRING_POLL_INTERVAL_MS = 3000;

function safeTrim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function normalizeDeviceLabel(value: unknown): string {
  const trimmed = safeTrim(value);

  if (!trimmed) {
    return "OpenClaw device";
  }

  return trimmed.slice(0, 80);
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

function generateDisplayCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
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
    throw new Error("Issued pairing credential is invalid.");
  }

  return rawKey;
}

function maskEmail(email: string | null): string | null {
  const trimmed = safeTrim(email);

  if (!trimmed) {
    return null;
  }

  const [localPart, domain] = trimmed.split("@");

  if (!localPart || !domain) {
    return trimmed;
  }

  const visibleLocal =
    localPart.length <= 2
      ? `${localPart.slice(0, 1)}*`
      : `${localPart.slice(0, 2)}***`;

  return `${visibleLocal}@${domain}`;
}

function mapSession(
  row: StoredPairingSessionRow,
  approvedUserHint: string | null,
): OpenClawPairingSessionRecord {
  return {
    id: row.id,
    token: row.public_token,
    displayCode: row.display_code,
    deviceLabel: row.device_label,
    approvedUserId: row.approved_user_id,
    approvedUserHint,
    apiKeyId: row.api_key_id,
    status: row.status,
    expiresAt: row.expires_at,
    approvedAt: row.approved_at,
    pairedAt: row.paired_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
  };
}

async function loadSession(
  db: D1LikeDatabase,
  token: string,
): Promise<StoredPairingSessionRow | null> {
  return db
    .prepare(
      `
        SELECT id, public_token, display_code, device_label, verifier_hash, approved_user_id,
               api_key_id, issued_key_encrypted, status, expires_at, approved_at, paired_at,
               created_at, updated_at
        FROM openclaw_pairing_sessions
        WHERE public_token = ?
      `,
    )
    .bind(token)
    .first<StoredPairingSessionRow>();
}

async function loadApprovedUserHint(
  db: D1LikeDatabase,
  userId: string | null,
): Promise<string | null> {
  if (!userId) {
    return null;
  }

  const user = await db
    .prepare("SELECT email FROM users WHERE id = ? LIMIT 1")
    .bind(userId)
    .first<{ email?: string | null }>();

  return maskEmail(safeTrim(user?.email) ?? null);
}

async function loadSessionRecord(
  db: D1LikeDatabase,
  row: StoredPairingSessionRow,
): Promise<OpenClawPairingSessionRecord> {
  const approvedUserHint = await loadApprovedUserHint(db, row.approved_user_id);
  return mapSession(row, approvedUserHint);
}

async function expireIfNeeded(
  db: D1LikeDatabase,
  row: StoredPairingSessionRow,
): Promise<StoredPairingSessionRow> {
  if (row.status === "paired" || row.status === "expired" || row.status === "failed") {
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
        UPDATE openclaw_pairing_sessions
        SET status = 'expired',
            api_key_id = NULL,
            issued_key_encrypted = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(row.id)
    .run();

  return {
    ...row,
    api_key_id: null,
    issued_key_encrypted: null,
    status: "expired",
    updated_at: new Date().toISOString(),
  };
}

async function verifySessionAndVerifier(
  db: D1LikeDatabase,
  token: string,
  verifier: string,
): Promise<StoredPairingSessionRow> {
  const row = await loadSession(db, token);

  if (!row) {
    throw new Error("Pairing session not found.");
  }

  const current = await expireIfNeeded(db, row);
  const verifierHash = await sha256Hex(verifier);

  if (verifierHash !== current.verifier_hash) {
    throw new Error("Pairing verifier is invalid.");
  }

  return current;
}

function getDatabaseOrThrow(): D1LikeDatabase {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  return db;
}

function buildDeviceKeyName(deviceLabel: string): string {
  return `OpenClaw - ${deviceLabel}`;
}

export function getOpenClawPairingErrorStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : "";

  if (message === "Unauthorized") {
    return 401;
  }

  if (/not found/i.test(message)) {
    return 404;
  }

  if (/already approved for another/i.test(message)) {
    return 409;
  }

  if (/already complete/i.test(message)) {
    return 409;
  }

  if (/not ready/i.test(message) || /not approved/i.test(message)) {
    return 409;
  }

  if (/has not issued a local credential/i.test(message)) {
    return 409;
  }

  if (/expired/i.test(message)) {
    return 410;
  }

  if (/invalid/i.test(message)) {
    return 400;
  }

  return 500;
}

export async function createOpenClawPairingSession(
  deviceLabel: unknown,
): Promise<OpenClawPairingStartResult> {
  const db = getDatabaseOrThrow();
  const id = randomToken(16);
  const token = randomToken(24);
  const verifier = randomToken(32);
  const verifierHash = await sha256Hex(verifier);
  const displayCode = generateDisplayCode();
  const normalizedLabel = normalizeDeviceLabel(deviceLabel);
  const expiresAt = new Date(Date.now() + OPENCLAW_PAIRING_TTL_MS).toISOString();

  await db
    .prepare(
      `
        INSERT INTO openclaw_pairing_sessions (
          id,
          public_token,
          display_code,
          device_label,
          verifier_hash,
          status,
          expires_at,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, 'awaiting_browser', ?, datetime('now'), datetime('now'))
      `,
    )
    .bind(id, token, displayCode, normalizedLabel, verifierHash, expiresAt)
    .run();

  const row = await loadSession(db, token);

  if (!row) {
    throw new Error("Pairing session could not be reloaded.");
  }

  return {
    session: await loadSessionRecord(db, row),
    verifier,
  };
}

export async function getOpenClawPairingSessionByToken(
  token: string,
): Promise<OpenClawPairingSessionRecord | null> {
  const db = getDatabaseOrThrow();
  const row = await loadSession(db, token);

  if (!row) {
    return null;
  }

  const current = await expireIfNeeded(db, row);
  return loadSessionRecord(db, current);
}

export async function approveOpenClawPairingSession(
  token: string,
  identity: Identity,
): Promise<OpenClawPairingSessionRecord> {
  const db = getDatabaseOrThrow();
  const currentRow = await loadSession(db, token);

  if (!currentRow) {
    throw new Error("Pairing session not found.");
  }

  const session = await expireIfNeeded(db, currentRow);

  if (session.status === "expired") {
    throw new Error("This pairing link expired. Start a new pairing flow from OpenClaw.");
  }

  const approvedUser = await ensureUser(db, identity);

  if (session.approved_user_id && session.approved_user_id !== approvedUser.id) {
    throw new Error("This pairing session is already approved for another ClawLink account.");
  }

  if (session.status === "paired") {
    return loadSessionRecord(db, session);
  }

  const nextStatus: OpenClawPairingSessionStatus =
    session.api_key_id && session.issued_key_encrypted
      ? "awaiting_local_save"
      : "ready_for_device";

  await db
    .prepare(
      `
        UPDATE openclaw_pairing_sessions
        SET approved_user_id = ?,
            status = ?,
            approved_at = COALESCE(approved_at, datetime('now')),
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(approvedUser.id, nextStatus, session.id)
    .run();

  const reloaded = await loadSession(db, token);

  if (!reloaded) {
    throw new Error("Pairing session could not be reloaded.");
  }

  return loadSessionRecord(db, reloaded);
}

export async function issueOpenClawPairingCredential(
  token: string,
  verifier: string,
): Promise<OpenClawPairingExchangeResult> {
  const db = getDatabaseOrThrow();
  const session = await verifySessionAndVerifier(db, token, verifier);

  if (session.status === "expired") {
    throw new Error("This pairing session expired. Start a new pairing flow from OpenClaw.");
  }

  if (session.status === "paired") {
    throw new Error("This pairing session is already complete.");
  }

  if (!session.approved_user_id) {
    throw new Error("The user has not approved this pairing session yet.");
  }

  if (
    session.status !== "ready_for_device" &&
    session.status !== "awaiting_local_save"
  ) {
    throw new Error("This pairing session is not ready for device exchange.");
  }

  if (session.issued_key_encrypted && session.api_key_id) {
    return {
      session: await loadSessionRecord(db, session),
      rawKey: await decryptIssuedKey(session.issued_key_encrypted),
      keyId: session.api_key_id,
    };
  }

  const created = await createApiKeyForUserId(
    db,
    session.approved_user_id,
    buildDeviceKeyName(session.device_label),
  );
  const issuedKeyEncrypted = await encryptIssuedKey(created.rawKey);

  await db
    .prepare(
      `
        UPDATE openclaw_pairing_sessions
        SET api_key_id = ?,
            issued_key_encrypted = ?,
            status = 'awaiting_local_save',
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(created.key.id, issuedKeyEncrypted, session.id)
    .run();

  const reloaded = await loadSession(db, token);

  if (!reloaded) {
    throw new Error("Pairing session could not be reloaded.");
  }

  return {
    session: await loadSessionRecord(db, reloaded),
    rawKey: created.rawKey,
    keyId: created.key.id,
  };
}

export async function finalizeOpenClawPairingSession(
  token: string,
  verifier: string,
): Promise<OpenClawPairingSessionRecord> {
  const db = getDatabaseOrThrow();
  const session = await verifySessionAndVerifier(db, token, verifier);

  if (session.status === "paired") {
    return loadSessionRecord(db, session);
  }

  if (session.status !== "awaiting_local_save" || !session.api_key_id) {
    throw new Error("This pairing session has not issued a local credential yet.");
  }

  await db
    .prepare(
      `
        UPDATE openclaw_pairing_sessions
        SET issued_key_encrypted = NULL,
            status = 'paired',
            paired_at = COALESCE(paired_at, datetime('now')),
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(session.id)
    .run();

  const reloaded = await loadSession(db, token);

  if (!reloaded) {
    throw new Error("Pairing session could not be reloaded.");
  }

  return loadSessionRecord(db, reloaded);
}
