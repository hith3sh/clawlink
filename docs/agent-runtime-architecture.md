# ClawLink Agent Runtime Architecture

## Goal

Turn ClawLink from a hosted integration proxy into an **agent-native integration runtime** with four clean layers:

1. **Connection layer** — users connect accounts once
2. **Tool registry** — integrations expose structured tools with schemas and policy metadata
3. **Execution runtime** — agents call tools deterministically, safely, and resumably
4. **Flow/runtime layer** — multi-step jobs compose tools into useful work

This document is intentionally grounded in the current codebase:

- Next.js app handles dashboard, auth, sessions, and connection UX
- Cloudflare Worker handles MCP tool execution
- Integrations are already implemented as handlers in `worker/integrations/*`
- Tool metadata already exists in `worker/integrations/base.ts`
- Connection persistence already exists in `src/lib/server/integration-store.ts`
- Hosted/manual connect flows already exist in `src/lib/server/connection-sessions.ts`

The proposal below upgrades the current shape instead of replacing it.

---

## Existing strengths in the codebase

The current repo already has the right primitives:

### 1. Tool abstraction exists

`worker/integrations/base.ts` already defines:

- `IntegrationTool`
- `ToolAccessLevel = read | write | destructive`
- guidance fields:
  - `whenToUse`
  - `askBefore`
  - `safeDefaults`
  - `examples`
  - `followups`

This is unusually good. It means ClawLink already stores both:

- **machine-facing schema**
- **agent-facing behavioral hints**

### 2. Connection storage exists

`src/lib/server/integration-store.ts` already supports:

- multiple connections per integration
- default connection selection
- active / needs_reauth state
- Nango-managed and local credentials
- encrypted credential storage
- connection labels and external account ids

This is the correct basis for a serious integration platform.

### 3. Session-based connection UX exists

`src/lib/server/connection-sessions.ts` already gives:

- connection session lifecycle
- user-facing display codes / tokens
- expiry handling
- manual and OAuth completion flows
- Nango reconciliation

That means ClawLink already has the beginnings of a resumable auth system.

### 4. Runtime execution exists

`worker/index.ts` already supports:

- `tools/list`
- `tools/call`
- credential loading
- auth refresh retry
- reauth marking
- request logging

So the foundation is already there. The missing part is stronger system design around routing, policy, execution modes, and flows.

---

## Target product shape

ClawLink should expose four product surfaces.

### A. Connect
User links accounts once.

### B. Discover
Agent or user asks: “what can I do with my connected tools?”

### C. Execute
Agent runs one tool safely with structured validation.

### D. Flow
Agent chains tools into multi-step work with state, retries, and resumability.

---

## Proposed system architecture

```text
User / Agent
    |
    |  natural language or direct tool call
    v
ClawLink Router Layer
    |- intent resolution
    |- connection selection
    |- policy checks
    |- execution mode selection
    |
    +--------------------+
    |                    |
    v                    v
Direct Tool Runtime      Flow Runtime
    |- validate args      |- step graph / state machine
    |- apply defaults     |- retries / waits / resumability
    |- enforce policy     |- child tool calls
    |- execute handler    |- partial progress
    |
    v
Integration Handler Layer
    |- gmail
    |- notion
    |- github
    |- slack
    |- ...
    |
    v
Credential / Connection Layer
    |- local encrypted credentials
    |- Nango-backed credentials
    |- connection health / reauth state
    |
    v
Provider APIs
```

---

## Core modules

## 1. Connection Layer

### Responsibility
Manage account connections, credential retrieval, refresh, and health.

### Existing code
- `src/lib/server/integration-store.ts`
- `src/lib/server/connection-sessions.ts`
- `worker/credentials.ts`
- `src/lib/server/nango.ts`

### Keep
- multiple accounts per integration
- `isDefault`
- `authState`
- Nango/local split
- encrypted credential storage

### Add
- explicit connection capability state
- scope tracking
- connection health checks
- last successful use / last failed use

### Proposed record additions

Add columns to `user_integrations`:

```ts
last_used_at: string | null
last_success_at: string | null
last_error_at: string | null
last_error_code: string | null
last_error_message: string | null
scope_snapshot_json: string | null
capabilities_json: string | null
```

### Why
This lets the router answer:
- which of several Gmail accounts should be used?
- is this connection healthy?
- is the failure auth-related or provider-related?
- do we have the scopes needed for this action?

### Design rule
A connection is not just “saved credentials.”
It is a **stateful execution target**.

---

## 2. Tool Registry Layer

### Responsibility
Describe all tools in a provider-agnostic format.

### Existing code
- `worker/integrations/base.ts`
- `src/lib/server/tooling.ts`

### Problem today
Tool metadata is good, but still a bit thin for routing and policy.

### Proposed canonical tool contract

```ts
export type ToolRisk = "safe" | "confirm" | "high_impact";
export type ToolMode = "read" | "write" | "destructive";

export interface ToolDefinition {
  integration: string;
  name: string;
  description: string;
  inputSchema: JsonSchema;
  outputSchema?: JsonSchema;

  mode: ToolMode;
  risk: ToolRisk;
  tags: string[];

  whenToUse: string[];
  askBefore: string[];
  safeDefaults: Record<string, unknown>;
  examples: Array<{
    user: string;
    args: Record<string, unknown>;
  }>;
  followups: string[];

  requiresScopes?: string[];
  idempotent?: boolean;
  supportsDryRun?: boolean;
  supportsBatch?: boolean;
  maxBatchSize?: number;
  recommendedTimeoutMs?: number;
}
```

### Notes
- `accessLevel` should remain but map into richer policy metadata
- add `outputSchema` over time for downstream flow composition
- add `supportsDryRun` for preview/confirm UX
- add `requiresScopes` so missing scope failures become deterministic

### Router outcome
The router should not need provider-specific logic for common decisions.
It should be able to inspect registry metadata and decide:
- safe to run immediately?
- needs confirmation?
- missing scopes?
- should use preview mode?

---

## 3. Router Layer

### Responsibility
Take an execution request and choose the best path.

This can start as library code before becoming a separate service.

### Proposed file
- `src/lib/server/router.ts`

### Inputs
```ts
interface RouteToolRequest {
  userId: string;
  toolName?: string;
  integration?: string;
  task?: string;
  args?: Record<string, unknown>;
  preferredConnectionId?: number;
  allowSearch?: boolean;
}
```

### Outputs
```ts
type RouteDecision =
  | { kind: "execute_direct"; tool: ToolDefinition; connectionId: number }
  | { kind: "needs_connection"; integration: string }
  | { kind: "needs_reauth"; connectionId: number }
  | { kind: "needs_scope_upgrade"; connectionId: number; missingScopes: string[] }
  | { kind: "needs_confirmation"; tool: ToolDefinition; connectionId: number }
  | { kind: "ambiguous_connection"; integration: string; options: ToolConnectionSummary[] }
  | { kind: "tool_not_found"; suggestions: string[] };
```

### Routing algorithm

#### If tool name is already known
1. Load tool definition
2. Load user connections for that integration
3. Select connection:
   - preferred connection
   - default connection
   - latest healthy matching account
4. Check auth state
5. Check scopes if known
6. Check policy/risk
7. Return route decision

#### If tool name is not known
1. Search tool registry by tags / description / integration
2. If one strong match, continue
3. If many, return candidates
4. Avoid semantic guesswork when deterministic metadata is enough

### Important product rule
**Known tool > search**.
Do not push everything through fuzzy LLM routing.

---

## 4. Execution Runtime

### Responsibility
Actually run one tool safely.

### Existing code
- `src/lib/server/tooling.ts`
- `worker/index.ts`

### Proposed execution modes

```ts
type ExecutionMode =
  | "direct"
  | "preview"
  | "batch"
  | "flow_step";
```

### Proposed execution pipeline

```text
resolve tool
  -> select connection
  -> merge safe defaults
  -> validate input schema
  -> check policy/risk
  -> check auth/scopes
  -> run handler
  -> classify result
  -> persist execution log
  -> return normalized output
```

### New normalized response envelope

```ts
interface ToolExecutionResult<T = unknown> {
  ok: boolean;
  tool: string;
  integration: string;
  connectionId: number | null;
  mode: ExecutionMode;

  data?: T;
  error?: {
    type:
      | "validation"
      | "auth"
      | "reauth_required"
      | "missing_scopes"
      | "rate_limit"
      | "provider"
      | "network"
      | "unknown";
    code?: string;
    message: string;
    retryable: boolean;
  };

  meta: {
    startedAt: string;
    endedAt: string;
    durationMs: number;
    requestId: string;
    providerRequestId?: string;
  };
}
```

### Why this matters
Right now handlers mostly return provider-shaped results. That is fine internally, but flows and agents work better when failures are normalized.

### Design rule
Normalize error classes even when outputs stay provider-specific.

---

## 5. Flow Runtime

### Responsibility
Support multi-step jobs like:
- check latest unread Gmail messages
- summarize important ones
- create Notion tasks
- ping Slack if urgent

### Current state
Not really first-class yet.

### Proposed first version
Build a lightweight state machine, not a full workflow builder UI.

### Proposed tables

#### `flows`
```ts
id: string
user_id: string
name: string
status: "pending" | "running" | "waiting" | "completed" | "failed" | "cancelled"
trigger_type: "agent" | "manual" | "webhook" | "schedule"
input_json: string
context_json: string
current_step: string | null
created_at: string
updated_at: string
completed_at: string | null
```

#### `flow_steps`
```ts
id: string
flow_id: string
step_key: string
step_type: "tool_call" | "transform" | "branch" | "wait" | "approval"
status: "pending" | "running" | "waiting" | "completed" | "failed" | "skipped"
input_json: string
output_json: string | null
error_json: string | null
attempt_count: number
started_at: string | null
completed_at: string | null
created_at: string
updated_at: string
```

### Minimal flow engine API

```ts
interface FlowStepContext {
  flowId: string;
  userId: string;
  state: Record<string, unknown>;
}

interface FlowStepResult {
  status: "completed" | "waiting" | "failed";
  output?: Record<string, unknown>;
  waitUntil?: string;
  error?: { message: string; retryable?: boolean };
}
```

### Why this matters
This is where ClawLink stops being “a bunch of tools” and becomes an execution substrate.

### Recommended scope
Do **not** build Zapier first.
Build:
- durable state
- resumable steps
- approval pauses
- retries
- child tool calls

That’s enough.

---

## 6. Policy Layer

### Responsibility
Decide when a tool may run automatically vs requiring user confirmation.

### Existing signals
- `accessLevel`
- `askBefore`

### Proposed policy model

```ts
interface PolicyDecision {
  allow: boolean;
  requiresConfirmation: boolean;
  reason?: string;
}
```

### Suggested default rules

#### Auto-run
- read actions
- low-risk writes with explicit arguments and strong user intent

#### Confirm first
- destructive actions
- broad fan-out actions
- external communication
- actions with money, publishing, deletes, or account/security changes

### Example policy mapping
- `gmail_fetch_emails` -> auto-run
- `gmail_send_email` -> confirm unless explicitly asked and recipient/body are clear
- `google-calendar_create_event` -> usually okay if user directly asked and the calendar is explicit
- `notion_create_page` -> usually okay if destination is explicit
- `stripe_refund_payment` -> always confirm

### Architecture point
Policy should not live only in agent prompt text.
It should exist as code.

---

## 7. Logging and Observability Layer

### Responsibility
Make every execution inspectable.

### Existing code
- `worker/logger.ts`
- request log concept already exists

### Expand to support
- route decision logs
- connection selection logs
- provider request ids
- retry attempts
- normalized error class
- dry-run vs live-run distinction

### Proposed `tool_executions` table

```ts
id: string
user_id: string
flow_id: string | null
step_id: string | null
integration: string
tool_name: string
connection_id: number | null
execution_mode: string
status: "success" | "error"
error_type: string | null
error_code: string | null
request_json: string
response_json: string | null
latency_ms: number
provider_request_id: string | null
created_at: string
```

### Dashboard benefit
This becomes the debugging panel users actually need.

---

## 8. Trigger Layer

### Responsibility
Allow external events to start flows.

### Version 1 trigger types
- webhook received
- scheduled poll
- provider webhook relayed by Nango or custom handler
- manual agent request

### Proposed table `triggers`

```ts
id: string
user_id: string
integration: string | null
type: "webhook" | "schedule" | "manual"
config_json: string
target_flow_template: string
enabled: boolean
created_at: string
updated_at: string
```

### Example
- Gmail new email trigger
- GitHub issue created trigger
- Notion database item changed trigger

### Important warning
Do not block core architecture on triggers. They come after direct execution and flow state are solid.

---

## Concrete TypeScript interfaces

## Integration handler contract v2

```ts
export interface IntegrationHandlerV2 {
  getTools(integrationSlug: string): ToolDefinition[];

  execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
    context?: {
      requestId: string;
      dryRun?: boolean;
      timeoutMs?: number;
      connectionId?: number;
      userId?: string;
    },
  ): Promise<unknown>;

  validateCredentials?(credentials: Record<string, string>): Promise<boolean>;

  checkHealth?(
    credentials: Record<string, string>,
  ): Promise<{
    ok: boolean;
    scopes?: string[];
    account?: { id?: string; label?: string };
    expiresAt?: string | null;
  }>;
}
```

## Router API

```ts
export interface ToolRouter {
  route(request: RouteToolRequest): Promise<RouteDecision>;
}
```

## Execution service API

```ts
export interface ToolExecutor {
  execute(request: {
    userId: string;
    toolName: string;
    args: Record<string, unknown>;
    connectionId?: number;
    mode?: ExecutionMode;
    requireConfirmation?: boolean;
  }): Promise<ToolExecutionResult>;
}
```

## Flow service API

```ts
export interface FlowRuntime {
  start(input: {
    userId: string;
    flowTemplate: string;
    input?: Record<string, unknown>;
    triggerType: "agent" | "manual" | "webhook" | "schedule";
  }): Promise<{ flowId: string }>;

  resume(flowId: string): Promise<void>;
  cancel(flowId: string): Promise<void>;
}
```

---

## API surface proposal

## 1. Tool catalog

### `GET /api/tools`
List tools available for current user.

Response:
```json
{
  "tools": [
    {
      "name": "gmail_fetch_emails",
      "integration": "gmail",
      "description": "Fetch recent emails",
      "mode": "read",
      "risk": "safe",
      "connectionCount": 2,
      "defaultConnectionId": 14
    }
  ]
}
```

## 2. Tool description

### `GET /api/tools/:name`
Return full schema + examples + guidance.

## 3. Tool execution

### `POST /api/tools/:name/execute`

Request:
```json
{
  "args": {
    "query": "in:inbox newer_than:7d"
  },
  "connectionId": 14,
  "mode": "direct"
}
```

Response:
```json
{
  "ok": true,
  "data": { "messages": [] },
  "meta": {
    "requestId": "req_123",
    "durationMs": 812
  }
}
```

## 4. Dry-run / preview

### `POST /api/tools/:name/preview`
Validate args, resolve connection, and return execution plan without performing side effects.

## 5. Connection session

### Keep current session pattern
This part is already on the right track.

## 6. Flow execution

### `POST /api/flows/start`
Kick off a saved or inline flow.

### `GET /api/flows/:id`
View flow state and step results.

---

## Database roadmap

## Keep current tables
- `users`
- `user_integrations`
- `connection_sessions`

## Add tables
- `tool_executions`
- `flows`
- `flow_steps`
- `triggers`

## Suggested migration order

### Phase 1
- add execution log table
- add richer columns to `user_integrations`

### Phase 2
- add `flows`
- add `flow_steps`

### Phase 3
- add `triggers`

---

## Recommended implementation plan

## Phase 1 — make current runtime solid

### Objectives
- normalize execution responses
- add router layer
- enrich tool metadata
- improve logs

### Concrete tasks
1. Create `src/lib/server/router.ts`
2. Create `src/lib/server/executor.ts`
3. Extend `IntegrationTool` with:
   - `risk`
   - `supportsDryRun`
   - `requiresScopes`
   - `idempotent`
4. Add normalized error classification utility
5. Add `tool_executions` migration
6. Update worker execution path to emit structured logs

### Result
ClawLink becomes deterministic and debuggable.

---

## Phase 2 — add preview and approval-aware execution

### Objectives
- support dry-run / preview for writes
- encode policy decisions in code

### Concrete tasks
1. Add `preview` execution mode
2. Add policy evaluator
3. Surface `requires_confirmation` in API responses
4. Add UI affordance in dashboard for dangerous tools

### Result
Safer agent execution and better UX.

---

## Phase 3 — introduce flow runtime

### Objectives
- durable multi-step jobs
- resumable execution
- approval pauses

### Concrete tasks
1. Add `flows` and `flow_steps`
2. Build minimal flow runner in worker or shared server module
3. Support step kinds:
   - tool call
   - transform
   - wait
   - approval
4. Build first canned flows:
   - summarize unread Gmail
   - Gmail -> Notion task sync
   - GitHub issue -> Slack notify

### Result
ClawLink becomes a real runtime, not just a proxy.

---

## Phase 4 — triggers and event-driven flows

### Objectives
- webhook/poll based automation
- provider event emergence

### Concrete tasks
1. Add trigger registration
2. Support webhook -> flow start
3. Add scheduled re-entry / polling jobs
4. Expose trigger logs

### Result
ClawLink supports autonomous workflows cleanly.

---

## Recommended code organization

```text
src/lib/server/
  router.ts              # route decision engine
  executor.ts            # normalized single-tool runtime
  policy.ts              # confirmation / risk rules
  tool-registry.ts       # tool lookup and search
  flow-runtime.ts        # flow start/resume/cancel
  flow-steps/
    tool-call.ts
    transform.ts
    approval.ts
    wait.ts

worker/
  index.ts               # transport / MCP entrypoint only
  integrations/          # provider-specific logic only
  errors.ts              # normalized error helpers
  logger.ts              # execution logging
```

### Key principle
Keep the worker thin.
Do not let transport concerns become business logic.

---

## How this differs from Composio

ClawLink should copy the good parts, not the whole shape.

### Copy
- direct execute when tool is known
- schema-first contracts
- auth repair path
- raw/provider escape hatches where needed
- programmable multi-step composition

### Do not copy blindly
- over-reliance on search
- CLI-first mental model
- documentation-only policy

### ClawLink’s advantage
ClawLink can be more agent-native by making:
- tool policy
- routing
- resumability
- approval states
- flow emergence

all first-class in the product itself.

---

## Opinionated recommendation

If building this incrementally, the best next move is:

### Build these 3 things next
1. **router.ts**
2. **executor.ts with normalized result envelope**
3. **tool_executions logging table**

That gives immediate payoff without overbuilding.

After that:
4. **policy.ts**
5. **preview mode**
6. **flows**

If you do flows before router/executor cleanup, the system will get messy fast.

---

## Example end-to-end execution

User says:
> Check my latest gmails

### Desired ClawLink behavior
1. Agent resolves intent to `gmail_fetch_emails`
2. Router selects default healthy Gmail connection
3. Executor applies safe defaults:
   - `max_results=10`
   - `include_payload=false`
4. Executor validates args
5. Policy allows auto-run because this is read-only
6. Worker executes Gmail handler
7. Result is normalized + logged
8. Agent summarizes output

### If auth is broken
1. handler returns auth failure
2. executor classifies as `reauth_required`
3. connection marked `needs_reauth`
4. response includes resumable connect action

That is the exact UX loop ClawLink should optimize for.

---

## Final summary

ClawLink should evolve into:

- **Nango-backed connection manager**
- **tool registry with schemas + policy metadata**
- **deterministic execution runtime**
- **durable flow engine for multi-step jobs**

In short:

- Nango handles credential plumbing
- integration handlers speak provider APIs
- router chooses the path
- executor normalizes and logs execution
- flow runtime composes tools into useful work

That is the concrete architecture worth building.
