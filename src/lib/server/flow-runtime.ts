import "server-only";

import {
  getDatabase,
  type D1LikeDatabase,
} from "@/lib/server/integration-store";
import {
  getFlowTemplate,
  listFlowTemplates,
  type FlowStepSeed,
  type FlowStepType,
  type FlowTemplateDefinition,
} from "@/lib/server/flow-templates";
import { executeToolForUser } from "@/lib/server/tooling";

export type FlowStatus =
  | "pending"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "cancelled";

export type FlowTriggerType = "agent" | "manual" | "webhook" | "schedule";
export type FlowStepStatus =
  | "pending"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "skipped";

interface StoredFlowRow {
  id: string;
  user_id: string;
  name: string;
  template_key: string;
  status: FlowStatus;
  trigger_type: FlowTriggerType;
  input_json: string;
  context_json: string;
  current_step: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

interface StoredFlowStepRow {
  id: string;
  flow_id: string;
  step_key: string;
  step_index: number;
  step_type: FlowStepType;
  status: FlowStepStatus;
  input_json: string;
  output_json: string | null;
  error_json: string | null;
  attempt_count: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FlowRecord {
  id: string;
  userId: string;
  name: string;
  templateKey: string;
  status: FlowStatus;
  triggerType: FlowTriggerType;
  input: Record<string, unknown>;
  context: Record<string, unknown>;
  currentStep: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface FlowStepRecord {
  id: string;
  flowId: string;
  stepKey: string;
  stepIndex: number;
  stepType: FlowStepType;
  status: FlowStepStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: Record<string, unknown> | null;
  attemptCount: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FlowContextState {
  steps: Record<
    string,
    {
      status: FlowStepStatus;
      output?: unknown;
      error?: unknown;
    }
  >;
}

interface FlowExecutionScope {
  input: Record<string, unknown>;
  steps: Record<string, { output?: unknown; status: FlowStepStatus }>;
  item?: unknown;
  index?: number;
}

interface FlowStepResult {
  status: "completed" | "waiting" | "failed";
  output?: Record<string, unknown>;
  error?: { message: string; retryable?: boolean; details?: unknown };
}

interface ToolCallStepInput {
  toolName: string;
  args?: Record<string, unknown>;
  connectionId?: unknown;
  confirmed?: boolean;
  iterateOver?: string;
  itemName?: string;
}

interface TransformStepInput {
  operation: string;
  [key: string]: unknown;
}

interface WaitStepInput {
  until?: string;
  durationMs?: number;
  label?: string;
}

interface ApprovalStepInput {
  message: string;
  approved?: boolean;
  approvedAt?: string;
  approvedBy?: string | null;
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

function mapFlow(row: StoredFlowRow): FlowRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    templateKey: row.template_key,
    status: row.status,
    triggerType: row.trigger_type,
    input: parseJson<Record<string, unknown>>(row.input_json, {}),
    context: parseJson<Record<string, unknown>>(row.context_json, { steps: {} }),
    currentStep: row.current_step,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}

function mapFlowStep(row: StoredFlowStepRow): FlowStepRecord {
  return {
    id: row.id,
    flowId: row.flow_id,
    stepKey: row.step_key,
    stepIndex: row.step_index,
    stepType: row.step_type,
    status: row.status,
    input: parseJson<Record<string, unknown>>(row.input_json, {}),
    output: parseJson<Record<string, unknown> | null>(row.output_json, null),
    error: parseJson<Record<string, unknown> | null>(row.error_json, null),
    attemptCount: row.attempt_count,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parsePathSegments(path: string): string[] {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function getPathValue(root: unknown, path: string): unknown {
  const segments = parsePathSegments(path);
  let current: unknown = root;

  for (const segment of segments) {
    if (Array.isArray(current)) {
      const index = Number.parseInt(segment, 10);
      current = Number.isInteger(index) ? current[index] : undefined;
      continue;
    }

    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function resolveRef(path: string, scope: FlowExecutionScope): unknown {
  if (path === "item") {
    return scope.item;
  }

  if (path.startsWith("item.")) {
    return getPathValue(scope.item, path.slice("item.".length));
  }

  if (path.startsWith("input.")) {
    return getPathValue(scope.input, path.slice("input.".length));
  }

  if (path === "steps") {
    return scope.steps;
  }

  if (path.startsWith("steps.")) {
    return getPathValue(scope.steps, path.slice("steps.".length));
  }

  return undefined;
}

function resolveTemplateValue(value: unknown, scope: FlowExecutionScope): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => resolveTemplateValue(item, scope));
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.$ref === "string" && Object.keys(record).length === 1) {
    return resolveRef(record.$ref, scope);
  }

  return Object.fromEntries(
    Object.entries(record).map(([key, entryValue]) => [
      key,
      resolveTemplateValue(entryValue, scope),
    ]),
  );
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractGmailHeader(message: Record<string, unknown>, name: string): string | null {
  const payload = message.payload;

  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const headers = (payload as { headers?: unknown }).headers;

  if (!Array.isArray(headers)) {
    return null;
  }

  for (const header of headers) {
    if (typeof header !== "object" || header === null) {
      continue;
    }

    const typedHeader = header as { name?: unknown; value?: unknown };

    if (
      typeof typedHeader.name === "string" &&
      typedHeader.name.toLowerCase() === name.toLowerCase() &&
      typeof typedHeader.value === "string"
    ) {
      return typedHeader.value;
    }
  }

  return null;
}

function summarizeGmailMessage(message: Record<string, unknown>): Record<string, unknown> {
  const snippet =
    typeof message.snippet === "string" && message.snippet.trim().length > 0
      ? message.snippet.trim()
      : null;
  const subject = extractGmailHeader(message, "Subject");
  const from = extractGmailHeader(message, "From");
  const internalDate =
    typeof message.internalDate === "string" && message.internalDate
      ? new Date(Number.parseInt(message.internalDate, 10)).toISOString()
      : null;

  return {
    id: typeof message.id === "string" ? message.id : null,
    threadId: typeof message.threadId === "string" ? message.threadId : null,
    subject,
    from,
    snippet,
    receivedAt: internalDate,
  };
}

function buildNotionTaskFromGmailMessage(message: Record<string, unknown>): Record<string, unknown> {
  const summary = summarizeGmailMessage(message);
  const subject =
    typeof summary.subject === "string" && summary.subject.trim().length > 0
      ? summary.subject.trim()
      : "Follow up on Gmail message";
  const from = typeof summary.from === "string" ? summary.from : "Unknown sender";
  const snippet = typeof summary.snippet === "string" ? summary.snippet : "";
  const receivedAt = typeof summary.receivedAt === "string" ? summary.receivedAt : null;

  return {
    title: subject,
    content: [
      `# ${subject}`,
      "",
      `- From: ${from}`,
      ...(receivedAt ? [`- Received: ${receivedAt}`] : []),
      "",
      snippet ? stripHtml(snippet) : "No snippet available.",
    ].join("\n"),
    source: summary,
  };
}

function buildExecutionScope(flow: FlowRecord): FlowExecutionScope {
  const context = flow.context as unknown as FlowContextState;
  return {
    input: flow.input,
    steps: context.steps ?? {},
  };
}

async function loadFlowRow(
  db: D1LikeDatabase,
  flowId: string,
): Promise<StoredFlowRow | null> {
  return db
    .prepare(
      `
        SELECT id, user_id, name, template_key, status, trigger_type, input_json, context_json,
               current_step, created_at, updated_at, completed_at
        FROM flows
        WHERE id = ?
        LIMIT 1
      `,
    )
    .bind(flowId)
    .first<StoredFlowRow>();
}

async function loadFlowStepsRows(
  db: D1LikeDatabase,
  flowId: string,
): Promise<StoredFlowStepRow[]> {
  const result = await db
    .prepare(
      `
        SELECT id, flow_id, step_key, step_index, step_type, status, input_json, output_json, error_json,
               attempt_count, started_at, completed_at, created_at, updated_at
        FROM flow_steps
        WHERE flow_id = ?
        ORDER BY step_index ASC
      `,
    )
    .bind(flowId)
    .all<StoredFlowStepRow>();

  return result.results ?? [];
}

async function saveFlowContext(
  db: D1LikeDatabase,
  flowId: string,
  context: FlowContextState,
): Promise<void> {
  await db
    .prepare(
      `
        UPDATE flows
        SET context_json = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(safeJsonStringify(context), flowId)
    .run();
}

async function setFlowStatus(
  db: D1LikeDatabase,
  flowId: string,
  status: FlowStatus,
  currentStep: string | null,
): Promise<void> {
  await db
    .prepare(
      `
        UPDATE flows
        SET status = ?,
            current_step = ?,
            updated_at = datetime('now'),
            completed_at = CASE
              WHEN ? IN ('completed', 'failed', 'cancelled') THEN datetime('now')
              ELSE completed_at
            END
        WHERE id = ?
      `,
    )
    .bind(status, currentStep, status, flowId)
    .run();
}

async function updateStepStatus(
  db: D1LikeDatabase,
  stepId: string,
  status: FlowStepStatus,
  options: {
    output?: Record<string, unknown> | null;
    error?: Record<string, unknown> | null;
    started?: boolean;
    completed?: boolean;
    incrementAttempt?: boolean;
  } = {},
): Promise<void> {
  await db
    .prepare(
      `
        UPDATE flow_steps
        SET status = ?,
            output_json = COALESCE(?, output_json),
            error_json = ?,
            attempt_count = attempt_count + ?,
            started_at = CASE
              WHEN ? = 1 THEN COALESCE(started_at, datetime('now'))
              ELSE started_at
            END,
            completed_at = CASE
              WHEN ? = 1 THEN datetime('now')
              ELSE completed_at
            END,
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(
      status,
      options.output === undefined ? null : safeJsonStringify(options.output),
      options.error ? safeJsonStringify(options.error) : null,
      options.incrementAttempt ? 1 : 0,
      options.started ? 1 : 0,
      options.completed ? 1 : 0,
      stepId,
    )
    .run();
}

function ensureContext(flow: FlowRecord): FlowContextState {
  const raw = flow.context as unknown as FlowContextState;

  if (!raw.steps || typeof raw.steps !== "object") {
    return { steps: {} };
  }

  return raw;
}

async function executeToolCallStep(
  flow: FlowRecord,
  step: FlowStepRecord,
  scope: FlowExecutionScope,
): Promise<FlowStepResult> {
  const input = step.input as unknown as ToolCallStepInput;
  const toolName = typeof input.toolName === "string" ? input.toolName : "";

  if (!toolName) {
    return {
      status: "failed",
      error: { message: `${step.stepKey} is missing toolName` },
    };
  }

  const confirmed = input.confirmed === true;

  if (typeof input.iterateOver === "string" && input.iterateOver.trim().length > 0) {
    const items = resolveRef(input.iterateOver, scope);

    if (!Array.isArray(items)) {
      return {
        status: "failed",
        error: { message: `${step.stepKey} expected an array at ${input.iterateOver}` },
      };
    }

    const results: Array<Record<string, unknown>> = [];

    for (const [index, item] of items.entries()) {
      const itemScope: FlowExecutionScope = {
        ...scope,
        item,
        index,
      };
      const args = resolveTemplateValue(input.args ?? {}, itemScope);
      const connectionIdValue = resolveTemplateValue(input.connectionId, itemScope);
      const connectionId =
        typeof connectionIdValue === "number"
          ? connectionIdValue
          : typeof connectionIdValue === "string"
            ? Number.parseInt(connectionIdValue, 10)
            : undefined;

      const execution = await executeToolForUser({
        userId: flow.userId,
        toolName,
        args:
          typeof args === "object" && args !== null && !Array.isArray(args)
            ? (args as Record<string, unknown>)
            : {},
        connectionId: Number.isInteger(connectionId) ? connectionId : undefined,
        confirmed,
        mode: "flow_step",
        flowId: flow.id,
        stepId: step.id,
      });

      if (!execution.ok) {
        return {
          status: "failed",
          error: {
            message: execution.error?.message ?? `${toolName} failed`,
            details: execution,
            retryable: execution.error?.retryable,
          },
        };
      }

      results.push({
        index,
        item,
        data: execution.data ?? execution.result ?? null,
        meta: execution.meta,
      });
    }

    return {
      status: "completed",
      output: {
        toolName,
        count: results.length,
        items: results,
      },
    };
  }

  const args = resolveTemplateValue(input.args ?? {}, scope);
  const connectionIdValue = resolveTemplateValue(input.connectionId, scope);
  const connectionId =
    typeof connectionIdValue === "number"
      ? connectionIdValue
      : typeof connectionIdValue === "string"
        ? Number.parseInt(connectionIdValue, 10)
        : undefined;

  const execution = await executeToolForUser({
    userId: flow.userId,
    toolName,
    args:
      typeof args === "object" && args !== null && !Array.isArray(args)
        ? (args as Record<string, unknown>)
        : {},
    connectionId: Number.isInteger(connectionId) ? connectionId : undefined,
    confirmed,
    mode: "flow_step",
    flowId: flow.id,
    stepId: step.id,
  });

  if (!execution.ok) {
    return {
      status: "failed",
      error: {
        message: execution.error?.message ?? `${toolName} failed`,
        details: execution,
        retryable: execution.error?.retryable,
      },
    };
  }

  return {
    status: "completed",
    output: {
      toolName,
      connectionId: execution.connectionId,
      data: execution.data ?? execution.result ?? null,
      meta: execution.meta,
    },
  };
}

async function executeTransformStep(
  flow: FlowRecord,
  step: FlowStepRecord,
  scope: FlowExecutionScope,
): Promise<FlowStepResult> {
  const input = step.input as unknown as TransformStepInput;

  switch (input.operation) {
    case "summarize_gmail_messages": {
      const source = typeof input.messagesRef === "string" ? resolveRef(input.messagesRef, scope) : null;
      const items = Array.isArray(source) ? source : [];
      const summaries = items
        .map((entry) => {
          if (typeof entry !== "object" || entry === null) {
            return null;
          }
          // iterateOver wraps each result in {data}; direct tool output is the message object itself.
          const wrapped = (entry as { data?: Record<string, unknown> }).data;
          const message = (wrapped ?? entry) as Record<string, unknown>;
          return summarizeGmailMessage(message);
        })
        .filter(Boolean);

      return {
        status: "completed",
        output: {
          count: summaries.length,
          summaries,
        },
      };
    }
    case "gmail_messages_to_notion_tasks": {
      const source = typeof input.messagesRef === "string" ? resolveRef(input.messagesRef, scope) : null;
      const items = Array.isArray(source) ? source : [];
      const tasks = items
        .map((entry) => {
          if (typeof entry !== "object" || entry === null) {
            return null;
          }
          const wrapped = (entry as { data?: Record<string, unknown> }).data;
          const message = (wrapped ?? entry) as Record<string, unknown>;
          return buildNotionTaskFromGmailMessage(message);
        })
        .filter(Boolean);

      return {
        status: "completed",
        output: {
          count: tasks.length,
          tasks,
        },
      };
    }
    default:
      return {
        status: "failed",
        error: { message: `Unknown transform operation: ${input.operation}` },
      };
  }
}

function getWaitUntil(step: FlowStepRecord): string | null {
  const outputWaitUntil =
    step.output && typeof step.output.waitUntil === "string"
      ? step.output.waitUntil
      : null;

  if (outputWaitUntil) {
    return outputWaitUntil;
  }

  const input = step.input as unknown as WaitStepInput;

  if (typeof input.until === "string" && input.until.trim().length > 0) {
    return input.until;
  }

  if (typeof input.durationMs === "number" && Number.isFinite(input.durationMs) && input.durationMs > 0) {
    return new Date(Date.now() + input.durationMs).toISOString();
  }

  return null;
}

async function executeWaitStep(
  flow: FlowRecord,
  step: FlowStepRecord,
): Promise<FlowStepResult> {
  void flow;
  const waitUntil = getWaitUntil(step);

  if (!waitUntil) {
    return {
      status: "completed",
      output: { waitUntil: null },
    };
  }

  if (new Date(waitUntil).getTime() <= Date.now()) {
    return {
      status: "completed",
      output: { waitUntil },
    };
  }

  return {
    status: "waiting",
    output: { waitUntil },
  };
}

async function executeApprovalStep(
  flow: FlowRecord,
  step: FlowStepRecord,
): Promise<FlowStepResult> {
  void flow;
  const input = step.input as unknown as ApprovalStepInput;

  if (input.approved === true) {
    return {
      status: "completed",
      output: {
        message: input.message,
        approvedAt: input.approvedAt ?? new Date().toISOString(),
        approvedBy: input.approvedBy ?? null,
      },
    };
  }

  return {
    status: "waiting",
    output: {
      message: input.message,
      approved: false,
    },
  };
}

async function executeFlowStep(
  flow: FlowRecord,
  step: FlowStepRecord,
  scope: FlowExecutionScope,
): Promise<FlowStepResult> {
  switch (step.stepType) {
    case "tool_call":
      return executeToolCallStep(flow, step, scope);
    case "transform":
      return executeTransformStep(flow, step, scope);
    case "wait":
      return executeWaitStep(flow, step);
    case "approval":
      return executeApprovalStep(flow, step);
    default:
      return {
        status: "failed",
        error: { message: `Unsupported step type: ${step.stepType}` },
      };
  }
}

function isTerminalFlowStatus(status: FlowStatus): boolean {
  return status === "completed" || status === "failed" || status === "cancelled";
}

function findCurrentStep(steps: FlowStepRecord[]): FlowStepRecord | null {
  return (
    steps.find((step) => step.status === "running") ??
    steps.find((step) => step.status === "waiting") ??
    steps.find((step) => step.status === "pending") ??
    null
  );
}

async function runFlow(db: D1LikeDatabase, flow: FlowRecord): Promise<FlowRecord> {
  if (isTerminalFlowStatus(flow.status)) {
    return flow;
  }

  let currentFlow = flow;
  const currentContext = ensureContext(flow);

  while (true) {
    const steps = (await loadFlowStepsRows(db, currentFlow.id)).map(mapFlowStep);
    const nextStep = findCurrentStep(steps);

    if (!nextStep) {
      await setFlowStatus(db, currentFlow.id, "completed", null);
      const completedRow = await loadFlowRow(db, currentFlow.id);

      if (!completedRow) {
        throw new Error("Flow completed but could not be reloaded");
      }

      return mapFlow(completedRow);
    }

    if (nextStep.status === "waiting") {
      if (nextStep.stepType === "approval") {
        const approvalInput = nextStep.input as unknown as ApprovalStepInput;

        if (approvalInput.approved !== true) {
          await setFlowStatus(db, currentFlow.id, "waiting", nextStep.stepKey);
          const waitingRow = await loadFlowRow(db, currentFlow.id);

          if (!waitingRow) {
            throw new Error("Flow waiting state could not be reloaded");
          }

          return mapFlow(waitingRow);
        }

        await updateStepStatus(db, nextStep.id, "pending");
        continue;
      }

      if (nextStep.stepType === "wait") {
        const waitUntil = getWaitUntil(nextStep);

        if (waitUntil && new Date(waitUntil).getTime() > Date.now()) {
          await setFlowStatus(db, currentFlow.id, "waiting", nextStep.stepKey);
          const waitingRow = await loadFlowRow(db, currentFlow.id);

          if (!waitingRow) {
            throw new Error("Flow waiting state could not be reloaded");
          }

          return mapFlow(waitingRow);
        }

        await updateStepStatus(db, nextStep.id, "completed", {
          output: nextStep.output ?? { waitUntil },
          completed: true,
        });
        currentContext.steps[nextStep.stepKey] = {
          status: "completed",
          output: nextStep.output ?? { waitUntil },
        };
        await saveFlowContext(db, currentFlow.id, currentContext);
        continue;
      }

      await setFlowStatus(db, currentFlow.id, "waiting", nextStep.stepKey);
      const waitingRow = await loadFlowRow(db, currentFlow.id);

      if (!waitingRow) {
        throw new Error("Flow waiting state could not be reloaded");
      }

      return mapFlow(waitingRow);
    }

    await setFlowStatus(db, currentFlow.id, "running", nextStep.stepKey);
    await updateStepStatus(db, nextStep.id, "running", {
      started: true,
      incrementAttempt: true,
    });

    const scope = buildExecutionScope({
      ...currentFlow,
      context: currentContext as unknown as Record<string, unknown>,
    });
    const result = await executeFlowStep(currentFlow, nextStep, scope);

    if (result.status === "completed") {
      await updateStepStatus(db, nextStep.id, "completed", {
        output: result.output ?? {},
        completed: true,
      });
      currentContext.steps[nextStep.stepKey] = {
        status: "completed",
        output: result.output ?? {},
      };
      await saveFlowContext(db, currentFlow.id, currentContext);
      const updatedRow = await loadFlowRow(db, currentFlow.id);

      if (!updatedRow) {
        throw new Error("Flow could not be reloaded after completing a step");
      }

      currentFlow = mapFlow(updatedRow);
      continue;
    }

    if (result.status === "waiting") {
      await updateStepStatus(db, nextStep.id, "waiting", {
        output: result.output ?? {},
      });
      currentContext.steps[nextStep.stepKey] = {
        status: "waiting",
        output: result.output ?? {},
      };
      await saveFlowContext(db, currentFlow.id, currentContext);
      await setFlowStatus(db, currentFlow.id, "waiting", nextStep.stepKey);
      const waitingRow = await loadFlowRow(db, currentFlow.id);

      if (!waitingRow) {
        throw new Error("Flow waiting state could not be reloaded");
      }

      return mapFlow(waitingRow);
    }

    await updateStepStatus(db, nextStep.id, "failed", {
      error: {
        message: result.error?.message ?? "Flow step failed",
        retryable: Boolean(result.error?.retryable),
        details: result.error?.details ?? null,
      },
      completed: true,
    });
    currentContext.steps[nextStep.stepKey] = {
      status: "failed",
      error: result.error ?? { message: "Flow step failed" },
    };
    await saveFlowContext(db, currentFlow.id, currentContext);
    await setFlowStatus(db, currentFlow.id, "failed", nextStep.stepKey);
    const failedRow = await loadFlowRow(db, currentFlow.id);

    if (!failedRow) {
      throw new Error("Failed flow could not be reloaded");
    }

    return mapFlow(failedRow);
  }
}

function createInitialContext(): FlowContextState {
  return {
    steps: {},
  };
}

async function insertFlowSteps(
  db: D1LikeDatabase,
  flowId: string,
  steps: FlowStepSeed[],
): Promise<void> {
  for (const [index, step] of steps.entries()) {
    await db
      .prepare(
        `
          INSERT INTO flow_steps (
            id,
            flow_id,
            step_key,
            step_index,
            step_type,
            status,
            input_json,
            output_json,
            error_json,
            attempt_count,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, 'pending', ?, NULL, NULL, 0, datetime('now'), datetime('now'))
        `,
      )
      .bind(
        crypto.randomUUID(),
        flowId,
        step.stepKey,
        index,
        step.stepType,
        safeJsonStringify(step.input),
      )
      .run();
  }
}

export async function startFlow(input: {
  userId: string;
  flowTemplate: string;
  input?: Record<string, unknown>;
  triggerType: FlowTriggerType;
}): Promise<{ flowId: string }> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const template = getFlowTemplate(input.flowTemplate);

  if (!template) {
    throw new Error(`Unknown flow template: ${input.flowTemplate}`);
  }

  const normalizedInput = input.input ?? {};
  const flowId = crypto.randomUUID();
  const context = createInitialContext();
  const steps = template.buildSteps(normalizedInput);

  await db
    .prepare(
      `
        INSERT INTO flows (
          id,
          user_id,
          name,
          template_key,
          status,
          trigger_type,
          input_json,
          context_json,
          current_step,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, NULL, datetime('now'), datetime('now'))
      `,
    )
    .bind(
      flowId,
      input.userId,
      template.name,
      template.key,
      input.triggerType,
      safeJsonStringify(normalizedInput),
      safeJsonStringify(context),
    )
    .run();

  await insertFlowSteps(db, flowId, steps);
  const flow = await getFlowForUser(input.userId, flowId);

  if (!flow) {
    throw new Error("Flow was created but could not be reloaded");
  }

  await runFlow(db, flow.flow);
  return { flowId };
}

export async function getFlowForUser(
  userId: string,
  flowId: string,
): Promise<{ flow: FlowRecord; steps: FlowStepRecord[] } | null> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const row = await db
    .prepare(
      `
        SELECT id, user_id, name, template_key, status, trigger_type, input_json, context_json,
               current_step, created_at, updated_at, completed_at
        FROM flows
        WHERE id = ? AND user_id = ?
        LIMIT 1
      `,
    )
    .bind(flowId, userId)
    .first<StoredFlowRow>();

  if (!row) {
    return null;
  }

  const stepRows = await loadFlowStepsRows(db, flowId);

  return {
    flow: mapFlow(row),
    steps: stepRows.map(mapFlowStep),
  };
}

export async function listFlowsForUser(
  userId: string,
  limit = 50,
): Promise<FlowRecord[]> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const result = await db
    .prepare(
      `
        SELECT id, user_id, name, template_key, status, trigger_type, input_json, context_json,
               current_step, created_at, updated_at, completed_at
        FROM flows
        WHERE user_id = ?
        ORDER BY updated_at DESC, created_at DESC
        LIMIT ?
      `,
    )
    .bind(userId, limit)
    .all<StoredFlowRow>();

  return (result.results ?? []).map(mapFlow);
}

export async function resumeFlowForUser(
  userId: string,
  flowId: string,
): Promise<{ flow: FlowRecord; steps: FlowStepRecord[] } | null> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const loaded = await getFlowForUser(userId, flowId);

  if (!loaded) {
    return null;
  }

  await runFlow(db, loaded.flow);
  return getFlowForUser(userId, flowId);
}

export async function approveFlowStepForUser(input: {
  userId: string;
  flowId: string;
  stepKey?: string;
}): Promise<{ flow: FlowRecord; steps: FlowStepRecord[] } | null> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const loaded = await getFlowForUser(input.userId, input.flowId);

  if (!loaded) {
    return null;
  }

  const approvalStep =
    loaded.steps.find((step) => step.stepType === "approval" && step.stepKey === input.stepKey) ??
    loaded.steps.find((step) => step.stepType === "approval" && step.status === "waiting");

  if (!approvalStep) {
    throw new Error("No waiting approval step was found for this flow");
  }

  const approvalInput = approvalStep.input as unknown as ApprovalStepInput;
  const nextInput: ApprovalStepInput = {
    ...approvalInput,
    approved: true,
    approvedAt: new Date().toISOString(),
    approvedBy: input.userId,
  };

  await db
    .prepare(
      `
        UPDATE flow_steps
        SET input_json = ?,
            status = 'pending',
            updated_at = datetime('now')
        WHERE id = ?
      `,
    )
    .bind(safeJsonStringify(nextInput), approvalStep.id)
    .run();

  return resumeFlowForUser(input.userId, input.flowId);
}

export async function cancelFlowForUser(
  userId: string,
  flowId: string,
): Promise<{ flow: FlowRecord; steps: FlowStepRecord[] } | null> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const loaded = await getFlowForUser(userId, flowId);

  if (!loaded) {
    return null;
  }

  await setFlowStatus(db, flowId, "cancelled", loaded.flow.currentStep);
  return getFlowForUser(userId, flowId);
}

export async function resumeReadyWaitingFlows(): Promise<{
  resumed: number;
  flowIds: string[];
}> {
  const db = getDatabase();

  if (!db) {
    throw new Error("DB binding is not configured");
  }

  const result = await db
    .prepare(
      `
        SELECT DISTINCT f.id
        FROM flows f
        INNER JOIN flow_steps s
          ON s.flow_id = f.id
        WHERE f.status = 'waiting'
          AND f.current_step = s.step_key
          AND s.status = 'waiting'
          AND s.step_type = 'wait'
      `,
    )
    .bind()
    .all<{ id: string }>();

  const flowIds: string[] = [];

  for (const row of result.results ?? []) {
    const loaded = await loadFlowRow(db, row.id);

    if (!loaded) {
      continue;
    }

    const flow = mapFlow(loaded);
    const steps = (await loadFlowStepsRows(db, flow.id)).map(mapFlowStep);
    const current = steps.find((step) => step.stepKey === flow.currentStep);

    if (!current || current.stepType !== "wait") {
      continue;
    }

    const waitUntil = getWaitUntil(current);

    if (waitUntil && new Date(waitUntil).getTime() > Date.now()) {
      continue;
    }

    await runFlow(db, flow);
    flowIds.push(flow.id);
  }

  return {
    resumed: flowIds.length,
    flowIds,
  };
}

export function getAvailableFlowTemplates(): Array<{
  key: string;
  name: string;
  description: string;
}> {
  return listFlowTemplates().map((template: FlowTemplateDefinition) => ({
    key: template.key,
    name: template.name,
    description: template.description,
  }));
}
