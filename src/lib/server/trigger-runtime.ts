import "server-only";

import { getEnvBinding, getDatabase, type D1LikeDatabase } from "@/lib/server/integration-store";
import {
  getAvailableFlowTemplates,
  resumeReadyWaitingFlows,
  startFlow,
} from "@/lib/server/flow-runtime";

export type TriggerType = "webhook" | "schedule" | "manual";
export type TriggerLogStatus = "success" | "error";

interface StoredTriggerRow {
  id: string;
  user_id: string;
  integration: string | null;
  type: TriggerType;
  config_json: string;
  target_flow_template: string;
  enabled: number;
  last_fired_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

interface StoredTriggerLogRow {
  id: string;
  trigger_id: string;
  user_id: string;
  status: TriggerLogStatus;
  message: string | null;
  payload_json: string | null;
  flow_id: string | null;
  created_at: string;
}

export interface TriggerRecord {
  id: string;
  userId: string;
  integration: string | null;
  type: TriggerType;
  config: Record<string, unknown>;
  targetFlowTemplate: string;
  enabled: boolean;
  lastFiredAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TriggerLogRecord {
  id: string;
  triggerId: string;
  userId: string;
  status: TriggerLogStatus;
  message: string | null;
  payload: Record<string, unknown> | null;
  flowId: string | null;
  createdAt: string;
}

interface CreateTriggerInput {
  userId: string;
  integration?: string | null;
  type: TriggerType;
  targetFlowTemplate: string;
  config?: Record<string, unknown>;
  enabled?: boolean;
}

interface UpdateTriggerInput {
  integration?: string | null;
  targetFlowTemplate?: string;
  config?: Record<string, unknown>;
  enabled?: boolean;
}

interface ScheduleTriggerConfig {
  everyMinutes: number;
  defaultInput?: Record<string, unknown>;
  startAt?: string;
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: "unserializable_payload" });
  }
}

function mapTrigger(row: StoredTriggerRow): TriggerRecord {
  return {
    id: row.id,
    userId: row.user_id,
    integration: row.integration,
    type: row.type,
    config: parseJson<Record<string, unknown>>(row.config_json, {}),
    targetFlowTemplate: row.target_flow_template,
    enabled: Boolean(row.enabled),
    lastFiredAt: row.last_fired_at,
    nextRunAt: row.next_run_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTriggerLog(row: StoredTriggerLogRow): TriggerLogRecord {
  return {
    id: row.id,
    triggerId: row.trigger_id,
    userId: row.user_id,
    status: row.status,
    message: row.message,
    payload: parseJson<Record<string, unknown> | null>(row.payload_json, null),
    flowId: row.flow_id,
    createdAt: row.created_at,
  };
}

function getDb(): D1LikeDatabase {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  return db;
}

function generateWebhookSecret(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function normalizeEveryMinutes(value: unknown): number {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : NaN;

  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error("schedule triggers require a positive everyMinutes value");
  }

  return Math.min(60 * 24 * 30, Math.floor(numeric));
}

function computeNextRunAt(config: ScheduleTriggerConfig): string {
  if (typeof config.startAt === "string" && config.startAt.trim().length > 0) {
    const startAt = new Date(config.startAt);
    if (!Number.isNaN(startAt.getTime()) && startAt.getTime() > Date.now()) {
      return startAt.toISOString();
    }
  }

  return new Date(Date.now() + config.everyMinutes * 60 * 1000).toISOString();
}

function validateTriggerTemplate(templateKey: string): void {
  const exists = getAvailableFlowTemplates().some((template) => template.key === templateKey);

  if (!exists) {
    throw new Error(`Unknown flow template: ${templateKey}`);
  }
}

function normalizeTriggerConfig(
  type: TriggerType,
  config: Record<string, unknown> | undefined,
  existing?: Record<string, unknown>,
): { config: Record<string, unknown>; nextRunAt: string | null } {
  const merged = {
    ...(existing ?? {}),
    ...(config ?? {}),
  };

  if (type === "webhook") {
    const webhookSecret =
      typeof merged.webhookSecret === "string" && merged.webhookSecret.trim().length > 0
        ? merged.webhookSecret.trim()
        : generateWebhookSecret();

    return {
      config: {
        ...merged,
        webhookSecret,
      },
      nextRunAt: null,
    };
  }

  if (type === "schedule") {
    const normalizedConfig: ScheduleTriggerConfig = {
      ...merged,
      everyMinutes: normalizeEveryMinutes(merged.everyMinutes),
      defaultInput:
        typeof merged.defaultInput === "object" && merged.defaultInput !== null && !Array.isArray(merged.defaultInput)
          ? (merged.defaultInput as Record<string, unknown>)
          : {},
      startAt:
        typeof merged.startAt === "string" && merged.startAt.trim().length > 0
          ? merged.startAt.trim()
          : undefined,
    };

    return {
      config: normalizedConfig as unknown as Record<string, unknown>,
      nextRunAt: computeNextRunAt(normalizedConfig),
    };
  }

  return {
    config: merged,
    nextRunAt: null,
  };
}

async function logTriggerRun(
  db: D1LikeDatabase,
  entry: {
    triggerId: string;
    userId: string;
    status: TriggerLogStatus;
    message?: string | null;
    payload?: Record<string, unknown> | null;
    flowId?: string | null;
  },
): Promise<void> {
  await db
    .prepare(
      `
        INSERT INTO trigger_logs (
          id,
          trigger_id,
          user_id,
          status,
          message,
          payload_json,
          flow_id,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `,
    )
    .bind(
      crypto.randomUUID(),
      entry.triggerId,
      entry.userId,
      entry.status,
      entry.message ?? null,
      entry.payload ? safeJsonStringify(entry.payload) : null,
      entry.flowId ?? null,
    )
    .run();
}

function buildFlowInput(
  trigger: TriggerRecord,
  payload?: Record<string, unknown>,
): Record<string, unknown> {
  const defaultInput =
    typeof trigger.config.defaultInput === "object" &&
    trigger.config.defaultInput !== null &&
    !Array.isArray(trigger.config.defaultInput)
      ? (trigger.config.defaultInput as Record<string, unknown>)
      : {};

  if (!payload || Object.keys(payload).length === 0) {
    return { ...defaultInput };
  }

  return {
    ...defaultInput,
    event: payload,
  };
}

export async function listTriggersForUser(userId: string): Promise<TriggerRecord[]> {
  const db = getDb();
  const result = await db
    .prepare(
      `
        SELECT id, user_id, integration, type, config_json, target_flow_template, enabled,
               last_fired_at, next_run_at, created_at, updated_at
        FROM triggers
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
    )
    .bind(userId)
    .all<StoredTriggerRow>();

  return (result.results ?? []).map(mapTrigger);
}

export async function getTriggerForUser(
  userId: string,
  triggerId: string,
): Promise<TriggerRecord | null> {
  const db = getDb();
  const row = await db
    .prepare(
      `
        SELECT id, user_id, integration, type, config_json, target_flow_template, enabled,
               last_fired_at, next_run_at, created_at, updated_at
        FROM triggers
        WHERE user_id = ? AND id = ?
        LIMIT 1
      `,
    )
    .bind(userId, triggerId)
    .first<StoredTriggerRow>();

  return row ? mapTrigger(row) : null;
}

export async function getTriggerLogsForUser(
  userId: string,
  triggerId: string,
  limit = 50,
): Promise<TriggerLogRecord[]> {
  const db = getDb();
  const result = await db
    .prepare(
      `
        SELECT id, trigger_id, user_id, status, message, payload_json, flow_id, created_at
        FROM trigger_logs
        WHERE user_id = ? AND trigger_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `,
    )
    .bind(userId, triggerId, limit)
    .all<StoredTriggerLogRow>();

  return (result.results ?? []).map(mapTriggerLog);
}

export async function createTriggerForUser(input: CreateTriggerInput): Promise<TriggerRecord> {
  const db = getDb();
  validateTriggerTemplate(input.targetFlowTemplate);
  const normalized = normalizeTriggerConfig(input.type, input.config);
  const id = crypto.randomUUID();

  await db
    .prepare(
      `
        INSERT INTO triggers (
          id,
          user_id,
          integration,
          type,
          config_json,
          target_flow_template,
          enabled,
          last_fired_at,
          next_run_at,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, NULL, datetime(?), datetime('now'), datetime('now'))
      `,
    )
    .bind(
      id,
      input.userId,
      input.integration ?? null,
      input.type,
      safeJsonStringify(normalized.config),
      input.targetFlowTemplate,
      input.enabled === false ? 0 : 1,
      normalized.nextRunAt,
    )
    .run();

  const created = await getTriggerForUser(input.userId, id);

  if (!created) {
    throw new Error("Trigger was created but could not be reloaded");
  }

  return created;
}

export async function updateTriggerForUser(
  userId: string,
  triggerId: string,
  patch: UpdateTriggerInput,
): Promise<TriggerRecord | null> {
  const db = getDb();
  const existing = await getTriggerForUser(userId, triggerId);

  if (!existing) {
    return null;
  }

  if (
    typeof patch.targetFlowTemplate === "string" &&
    patch.targetFlowTemplate.trim().length > 0 &&
    patch.targetFlowTemplate !== existing.targetFlowTemplate
  ) {
    validateTriggerTemplate(patch.targetFlowTemplate);
  }

  const normalized = normalizeTriggerConfig(existing.type, patch.config, existing.config);
  const enabled = patch.enabled === undefined ? existing.enabled : patch.enabled;
  const nextRunAt =
    existing.type === "schedule"
      ? enabled
        ? normalized.nextRunAt
        : null
      : null;

  await db
    .prepare(
      `
        UPDATE triggers
        SET integration = ?,
            target_flow_template = ?,
            config_json = ?,
            enabled = ?,
            next_run_at = datetime(?),
            updated_at = datetime('now')
        WHERE id = ? AND user_id = ?
      `,
    )
    .bind(
      patch.integration === undefined ? existing.integration : patch.integration,
      patch.targetFlowTemplate === undefined
        ? existing.targetFlowTemplate
        : patch.targetFlowTemplate.trim(),
      safeJsonStringify(normalized.config),
      enabled ? 1 : 0,
      nextRunAt,
      triggerId,
      userId,
    )
    .run();

  return getTriggerForUser(userId, triggerId);
}

export async function deleteTriggerForUser(
  userId: string,
  triggerId: string,
): Promise<boolean> {
  const db = getDb();
  const existing = await getTriggerForUser(userId, triggerId);

  if (!existing) {
    return false;
  }

  await db.prepare("DELETE FROM trigger_logs WHERE trigger_id = ?").bind(triggerId).run();
  await db.prepare("DELETE FROM triggers WHERE id = ? AND user_id = ?").bind(triggerId, userId).run();
  return true;
}

async function fireTriggerRecord(
  trigger: TriggerRecord,
  payload?: Record<string, unknown>,
): Promise<{ flowId: string | null; status: TriggerLogStatus; message: string }> {
  if (!trigger.enabled) {
    return {
      flowId: null,
      status: "error",
      message: "Trigger is disabled",
    };
  }

  try {
    const flowInput = buildFlowInput(trigger, payload);
    const result = await startFlow({
      userId: trigger.userId,
      flowTemplate: trigger.targetFlowTemplate,
      input: flowInput,
      triggerType: trigger.type === "schedule" ? "schedule" : trigger.type === "webhook" ? "webhook" : "manual",
    });

    const db = getDb();
    await db
      .prepare(
        `
          UPDATE triggers
          SET last_fired_at = datetime('now'),
              next_run_at = CASE
                WHEN type = 'schedule' THEN datetime(?)
                ELSE next_run_at
              END,
              updated_at = datetime('now')
          WHERE id = ?
        `,
      )
      .bind(
        trigger.type === "schedule"
          ? computeNextRunAt({
              everyMinutes: normalizeEveryMinutes(trigger.config.everyMinutes),
              defaultInput:
                typeof trigger.config.defaultInput === "object" &&
                trigger.config.defaultInput !== null &&
                !Array.isArray(trigger.config.defaultInput)
                  ? (trigger.config.defaultInput as Record<string, unknown>)
                  : {},
            })
          : null,
        trigger.id,
      )
      .run();

    await logTriggerRun(db, {
      triggerId: trigger.id,
      userId: trigger.userId,
      status: "success",
      message: "Trigger fired successfully",
      payload: payload ?? null,
      flowId: result.flowId,
    });

    return {
      flowId: result.flowId,
      status: "success",
      message: "Trigger fired successfully",
    };
  } catch (error) {
    const db = getDb();
    const message = error instanceof Error ? error.message : "Trigger failed";
    await logTriggerRun(db, {
      triggerId: trigger.id,
      userId: trigger.userId,
      status: "error",
      message,
      payload: payload ?? null,
    });

    return {
      flowId: null,
      status: "error",
      message,
    };
  }
}

export async function fireTriggerForUser(
  userId: string,
  triggerId: string,
  payload?: Record<string, unknown>,
): Promise<{ trigger: TriggerRecord; flowId: string | null; status: TriggerLogStatus; message: string } | null> {
  const trigger = await getTriggerForUser(userId, triggerId);

  if (!trigger) {
    return null;
  }

  const result = await fireTriggerRecord(trigger, payload);
  const refreshed = await getTriggerForUser(userId, triggerId);

  if (!refreshed) {
    throw new Error("Trigger fired but could not be reloaded");
  }

  return {
    trigger: refreshed,
    ...result,
  };
}

export async function processWebhookTrigger(input: {
  triggerId: string;
  secret: string;
  payload?: Record<string, unknown>;
}): Promise<{ trigger: TriggerRecord; flowId: string | null; status: TriggerLogStatus; message: string } | null> {
  const db = getDb();
  const row = await db
    .prepare(
      `
        SELECT id, user_id, integration, type, config_json, target_flow_template, enabled,
               last_fired_at, next_run_at, created_at, updated_at
        FROM triggers
        WHERE id = ? AND type = 'webhook'
        LIMIT 1
      `,
    )
    .bind(input.triggerId)
    .first<StoredTriggerRow>();

  if (!row) {
    return null;
  }

  const trigger = mapTrigger(row);
  const webhookSecret =
    typeof trigger.config.webhookSecret === "string" ? trigger.config.webhookSecret : "";

  if (!webhookSecret || webhookSecret !== input.secret) {
    await logTriggerRun(db, {
      triggerId: trigger.id,
      userId: trigger.userId,
      status: "error",
      message: "Invalid webhook secret",
      payload: input.payload ?? null,
    });
    throw new Error("Invalid webhook secret");
  }

  const result = await fireTriggerRecord(trigger, input.payload);
  const refreshed = await getTriggerForUser(trigger.userId, trigger.id);

  if (!refreshed) {
    throw new Error("Trigger fired but could not be reloaded");
  }

  return {
    trigger: refreshed,
    ...result,
  };
}

export async function runDueScheduledTriggers(): Promise<{
  fired: number;
  triggerIds: string[];
}> {
  const db = getDb();
  const result = await db
    .prepare(
      `
        SELECT id, user_id, integration, type, config_json, target_flow_template, enabled,
               last_fired_at, next_run_at, created_at, updated_at
        FROM triggers
        WHERE type = 'schedule'
          AND enabled = 1
          AND next_run_at IS NOT NULL
          AND datetime(next_run_at) <= datetime('now')
        ORDER BY next_run_at ASC
      `,
    )
    .bind()
    .all<StoredTriggerRow>();

  const triggerIds: string[] = [];

  for (const row of result.results ?? []) {
    const trigger = mapTrigger(row);
    const fired = await fireTriggerRecord(trigger);

    if (fired.status === "success") {
      triggerIds.push(trigger.id);
    }
  }

  return {
    fired: triggerIds.length,
    triggerIds,
  };
}

export async function runDueTriggerWork(): Promise<{
  scheduled: { fired: number; triggerIds: string[] };
  resumedFlows: { resumed: number; flowIds: string[] };
}> {
  const scheduled = await runDueScheduledTriggers();
  const resumedFlows = await resumeReadyWaitingFlows();
  return { scheduled, resumedFlows };
}

export function getTriggerCronSecret(): string | undefined {
  const secret = getEnvBinding<string>("TRIGGER_CRON_SECRET");
  return typeof secret === "string" && secret.trim().length > 0 ? secret.trim() : undefined;
}
