# ClawLink Activation Dashboard Plan

## Goal

Build a small internal dashboard that explains where users drop off in the ClawLink activation funnel using data that already exists in the current ClawLink database.

This is **not** a full analytics warehouse project.

The purpose is to answer practical questions like:
- How many real pairing attempts are happening?
- How many pairing attempts complete successfully?
- How many paired users connect at least one integration?
- How many connected users actually execute tools?
- How many users reach first successful execution?
- Which integrations succeed most, and which ones fail most?

---

## Why this dashboard exists

We currently have a mismatch between:
- high ClawHub skill download counts
- relatively low ClawLink activated-user counts

The repo review suggests that **download counts are not reliably attributable to unique ClawLink users** with the current schema.

However, we **can** reliably measure the funnel from **pairing onward**.

So this dashboard should focus on the metrics we can trust today.

---

## What we can measure today

Based on the current schema/codebase, we can already measure:

### 1. Pairing intent
Table: `openclaw_pairing_sessions`
- pairing session created
- pairing approved in browser
- pairing completed (`status = 'paired'`)
- pairing expired

### 2. Integration setup
Table: `user_integrations`
- users with at least one connected integration
- integrations connected per user
- auth state / auth errors
- last success / last error / last used

### 3. Real usage
Table: `tool_executions`
- users with executions
- users with successful executions
- executions by integration
- execution success/error rate
- top errors

---

## What we cannot reliably measure today

Do **not** overpromise these in v1:
- skill download -> unique user attribution
- plugin install counts
- source skill slug for pairing sessions
- exact ClawHub listing -> ClawLink conversion

These may be added later with extra instrumentation, but they are out of scope for this dashboard v1.

---

## Product scope for v1

Build a **lean internal admin dashboard** inside ClawLink.

### Required v1 sections

#### A. Date range filter
Allow selecting a date range, at minimum:
- Last 7 days
- Last 30 days
- Last 90 days
- All time

Optional:
- custom start/end date

#### B. Funnel summary cards
For the selected date range, show:
1. Pairing sessions created
2. Pairing sessions approved
3. Pairing sessions completed (`paired`)
4. Unique users with >= 1 integration connected
5. Unique users with >= 1 tool execution
6. Unique users with >= 1 successful tool execution

Also show derived conversion rates:
- pairing created -> pairing approved
- pairing created -> pairing completed
- paired user -> connected user
- connected user -> user with first execution
- connected user -> user with first successful execution

#### C. Daily trend chart
Simple daily time-series showing some or all of:
- pairings created
- pairings completed
- newly connected users
- users with first successful execution

#### D. Integration performance table
Columns:
- integration slug
- unique connected users
- unique active users (>=1 execution)
- successful executions
- failed executions
- success rate
- last activity

This table should help identify:
- high-usage integrations
- high-failure integrations
- integrations with many connections but low actual use

#### E. Error breakdown table
Columns:
- integration
- error_type
- error_code
- count
- last_seen_at

This should highlight recurring failure patterns.

---

## Strong recommendation on scope

Keep this dashboard deliberately small.

Do **not** add in v1:
- cohorts
- attribution modeling
- marketing source tracking
- deep per-user drilldowns
- event ingestion pipelines
- external BI tooling
- skill-download correlation logic

If v1 works, we can add those later.

---

## Suggested funnel definition

This dashboard should use the following practical funnel:

1. **Pairing started**  
   `openclaw_pairing_sessions.created_at`

2. **Pairing approved**  
   `openclaw_pairing_sessions.approved_at IS NOT NULL`

3. **Pairing completed**  
   `openclaw_pairing_sessions.status = 'paired'` or `paired_at IS NOT NULL`

4. **Connected**  
   user has at least one row in `user_integrations`

5. **Executed**  
   user has at least one row in `tool_executions`

6. **Succeeded**  
   user has at least one `tool_executions.status = 'success'`

Important: for steps 4-6, be explicit whether the dashboard is showing:
- all-time user state
- or only events first occurring inside the selected date range

For v1, prefer a simple, consistent rule and document it in the UI.

Recommended rule for v1:
- pairing steps filtered by their event timestamps
- connected/executed/succeeded counted by whether the user reached that step within the selected period

---

## Implementation notes

### Likely place in app
Add a new internal/admin route in the ClawLink app.

Suggested route names:
- `/admin/activation`
- `/dashboard/admin/activation`
- `/internal/metrics/activation`

Use whatever route structure best fits the current app.

### Access control
This page should **not** be public.

At minimum, protect it so only authorized internal/admin users can access it.
If there is already an admin gating pattern in the app, reuse it.
If not, add a minimal allowlist or environment-variable-based admin guard.

### Data loading
Prefer **server-side queries** directly against the existing DB.
No need to build a separate analytics pipeline for v1.

If query logic gets noisy, create a dedicated server module, for example:
- `src/lib/server/admin-activation-metrics.ts`

This module should:
- accept a date range
- return dashboard-ready aggregates
- keep SQL in one place

---

## Suggested query outputs

The implementation agent should create query helpers roughly like:

- `getActivationSummary(range)`
- `getActivationDailySeries(range)`
- `getIntegrationPerformance(range)`
- `getActivationErrorBreakdown(range)`

Optional later:
- `getPairingStageBreakdown(range)`
- `getUsersStuckAfterPairing(range)`

---

## SQL / metrics guidance

### 1. Pairing summary
Use `openclaw_pairing_sessions` to count:
- created count
- approved count
- paired count
- expired count

Also compute:
- approval rate = approved / created
- pairing completion rate = paired / created

### 2. Connected users
Use `user_integrations` to count:
- unique users with at least one integration row created in range
- unique integrations connected

Optional:
- connection count by integration

### 3. Execution summary
Use `tool_executions` to count:
- unique users with >=1 execution in range
- unique users with >=1 success in range
- total executions
- total successes
- total errors

### 4. Integration performance
Aggregate `tool_executions` by `integration` and join where helpful to `user_integrations`.

### 5. Error breakdown
Group `tool_executions` where `status = 'error'` by:
- integration
- error_type
- error_code

---

## UX guidance

The UI should be boring and readable.

Good enough for v1:
- simple cards
- simple line chart or bar chart
- sortable tables
- empty states
- loading/error state

No fancy animations needed.
No overdesigned “growth dashboard” nonsense.

Make it useful for answering product questions quickly.

---

## Edge cases / caveats

The implementation agent should account for these:

1. **Pairing rows may exist without user identity yet**
   - pairing starts before approval
   - that is normal

2. **Connected users may predate the selected range**
   - decide whether to count by `created_at` or current state
   - document the choice clearly

3. **One user can connect multiple integrations**
   - be explicit when counts are per-user vs per-connection

4. **One user can have multiple executions**
   - do not confuse execution count with user count

5. **Old migrated data may not perfectly reflect new product flows**
   - that is acceptable for v1 as long as definitions are documented

---

## Nice-to-have additions after v1

Only do these after the basic dashboard works:

### v1.1 / v2 ideas
- “users stuck after pairing” report
- “connected but never succeeded” report
- first-success time-to-value metric
- auth-state breakdown from `user_integrations.auth_state`
- per-integration connection -> first-success funnel
- export CSV
- compare current period vs previous period

### Future instrumentation ideas
If we want better attribution later, consider adding:
- `source_skill_slug` to `openclaw_pairing_sessions`
- `source_skill_version`
- `source_surface`
- plugin/version metadata on pairing start

But **do not block v1 on this**.

---

## Deliverables expected from the implementation agent

1. Add a protected internal activation dashboard page to ClawLink
2. Add server-side query helpers for the required metrics
3. Implement the v1 cards, chart, integration table, and error table
4. Document metric definitions in code or page copy
5. Ensure the page works with current production schema

---

## Acceptance criteria

The work is complete when:

- an internal user can open the dashboard and choose a date range
- the dashboard shows funnel summary cards
- the dashboard shows a daily trend view
- the dashboard shows per-integration performance
- the dashboard shows top error breakdowns
- the definitions are clear enough that the numbers are interpretable later
- no fake or inferred download-attribution metrics are shown

---

## Recommended implementation order

1. Create server-side metrics module
2. Implement summary queries
3. Implement daily series query
4. Implement integration table query
5. Implement error breakdown query
6. Add protected route/page
7. Add date filter UI
8. Polish copy / empty states / loading states

---

## Final note for the next agent

This project should optimize for **truth and usefulness**, not analytics theater.

The point is to help answer:
> Where are real users dropping off after they begin trying to use ClawLink?

Do not try to reverse-engineer ClawHub download attribution in this task.
Use only the signals ClawLink currently tracks reliably.
