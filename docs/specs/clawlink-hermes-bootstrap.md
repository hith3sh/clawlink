---
name: clawlink-hermes-bootstrap
summary: Install ClawLink into Hermes from chat without manual config editing.
status: draft
---

# ClawLink Hermes Bootstrap

Status: draft
Owner: ClawLink
Audience: ClawLink product/backend/web, Hermes-facing onboarding, installer/runtime

## Problem

The current ClawLink MCP surface works with Hermes once it is configured, but first-run setup is still too manual:

- Hermes users must effectively know what MCP is
- a user or operator must edit `~/.hermes/config.yaml`
- Hermes may not have the Python `mcp` package installed
- API key header setup is too technical for Telegram and WhatsApp users
- the current marketing-page prompt is doing operational work that should live in product code

This is especially bad for messaging-first Hermes users. A Telegram or WhatsApp user can ask Hermes to install ClawLink, but the install path should not depend on the model inventing shell commands or hand-editing YAML correctly.

## Goal

Make ClawLink installable into Hermes from chat with one natural-language instruction:

> Install ClawLink into yourself and test that it works.

Hermes should be able to complete setup itself by running one official ClawLink bootstrap installer. The user may still need to approve account access in a browser, but must not need to edit config files or paste auth headers manually.

## Non-goals

- Replace Hermes's native MCP client
- Build a Hermes fork or plugin inside the Hermes repo
- Support arbitrary third-party MCP clients in this spec
- Solve full OAuth-native MCP auth in v1

This spec targets Hermes bootstrap first. Native MCP OAuth can be added later as a cleaner auth mode.

## Product principles

- Installer, not prose, owns setup logic
- Chat-first and mobile-friendly
- Idempotent and safe to rerun
- Minimal user decisions
- Explicit verification before claiming success
- No manual YAML editing in normal user flows

## Primary user stories

### 1. Telegram/WhatsApp user

1. User messages Hermes: "Install ClawLink."
2. Hermes runs the official ClawLink bootstrap installer with its terminal tool.
3. Installer creates a bootstrap session with ClawLink.
4. Hermes replies with an approval link.
5. User taps the link on their phone, signs in to ClawLink if needed, and approves.
6. Installer finishes local Hermes setup.
7. Installer runs `hermes mcp test clawlink`.
8. Hermes replies: "ClawLink is installed and ready."

### 2. Desktop CLI user

1. User says: "Set up ClawLink for Hermes."
2. Hermes runs the same installer.
3. If a browser is available, user approves in the browser.
4. Installer writes config, tests MCP, and reports success.

### 3. Repeat install / repair

1. User says: "Fix my ClawLink connection."
2. Hermes reruns the installer.
3. Installer detects existing config and either:
   - validates it and exits cleanly, or
   - rotates the token and repairs the config

## Proposed solution

Ship a ClawLink-managed Hermes bootstrap system with four parts:

1. **Bootstrap installer**
   - Hosted by ClawLink at a stable URL
   - Run by Hermes via terminal
   - Owns all local Hermes config mutations

2. **Bootstrap session API**
   - Creates a short-lived install session
   - Produces a user approval URL
   - Returns a scoped MCP access token once approved

3. **Approval web flow**
   - Mobile-friendly ClawLink page
   - User signs in and approves Hermes access
   - No manual secret copying

4. **Verification flow**
   - Installer updates `~/.hermes/config.yaml`
   - Installer runs `hermes mcp test clawlink`
   - Installer reports structured success or failure

## Why this design

The key bottleneck is bootstrap, not the MCP protocol itself.

Hermes already supports:

- MCP servers defined in `~/.hermes/config.yaml`
- HTTP MCP servers with request headers
- `hermes mcp test <name>`
- dynamic MCP tool discovery

What is missing is a ClawLink-owned install path that Hermes can execute deterministically from chat.

## v1 auth model

### Decision

Use a **ClawLink-issued scoped MCP bootstrap token** in v1, stored under the ClawLink MCP server headers in Hermes config.

Example installed config:

```yaml
mcp_servers:
  clawlink:
    url: "https://claw-link.dev/api/mcp"
    headers:
      x-clawlink-api-key: "cllk_live_..."
    timeout: 180
    connect_timeout: 60
```

### Why not MCP OAuth in v1

Hermes supports `auth: oauth` for remote MCP servers, but a browser-driven PKCE flow is weaker for messaging-first onboarding:

- Telegram/WhatsApp users may be on mobile while Hermes runs elsewhere
- some Hermes installs are semi-headless
- v1 needs deterministic behavior with clear repair semantics

The bootstrap-session model gives ClawLink full control over:

- approval UX
- device handoff
- scoped token issuance
- installation retries
- future migration to native OAuth later

### Token requirements

The issued token must be:

- scoped to one ClawLink user/workspace
- usable only for ClawLink MCP/API operations
- revocable
- rotatable
- labelable for audit, e.g. `Hermes MCP`

Optional but recommended:

- include a local `client_label`
- store `agent_family = hermes`
- store `install_id`

## API contract

## 1. `POST /api/hermes/bootstrap-sessions`

Create a short-lived install session.

Request:

```json
{
  "agent_family": "hermes",
  "agent_version": "0.12.0",
  "client_label": "Hermes Agent",
  "hostname": "optional-local-hostname",
  "platform": "darwin",
  "approval_return_hint": "chat",
  "requested_transport": "mcp_http_header"
}
```

Response:

```json
{
  "session_id": "hbs_123",
  "status": "pending_approval",
  "approval_url": "https://claw-link.dev/hermes/approve/hbs_123",
  "poll_url": "https://claw-link.dev/api/hermes/bootstrap-sessions/hbs_123",
  "expires_at": "2026-05-14T12:00:00Z",
  "display": {
    "title": "Approve ClawLink for Hermes",
    "summary": "Open this link to connect your ClawLink account."
  }
}
```

Rules:

- no authentication required to create a pending session
- rate limit by IP
- short TTL, e.g. 15 minutes
- no token returned before approval

## 2. `GET /api/hermes/bootstrap-sessions/:sessionId`

Poll bootstrap status.

Pending response:

```json
{
  "session_id": "hbs_123",
  "status": "pending_approval",
  "expires_at": "2026-05-14T12:00:00Z"
}
```

Approved response:

```json
{
  "session_id": "hbs_123",
  "status": "approved",
  "install": {
    "server_name": "clawlink",
    "url": "https://claw-link.dev/api/mcp",
    "headers": {
      "x-clawlink-api-key": "cllk_live_..."
    },
    "timeout": 180,
    "connect_timeout": 60
  },
  "display": {
    "title": "ClawLink approved",
    "summary": "Finish local Hermes setup now."
  }
}
```

Rejected/expired response:

```json
{
  "session_id": "hbs_123",
  "status": "expired"
}
```

Rules:

- approved payload should be returned only once if possible
- after token handoff, session may move to `consumed`
- installer must handle both `approved` and `consumed` safely

## 3. `GET /hermes/approve/:sessionId`

Browser approval page for end users.

Behavior:

- if signed out, require ClawLink sign-in
- show clear copy: "Allow Hermes on this device to access your ClawLink integrations"
- on approve:
  - attach session to current user/workspace
  - mint scoped token
  - mark session approved
- on reject:
  - mark session rejected

## 4. Optional: `POST /api/hermes/bootstrap-sessions/:sessionId/cancel`

Useful if installer aborts or user explicitly cancels.

## Installer contract

Stable URL:

```text
https://claw-link.dev/hermes/install.py
```

Stable invocation:

```bash
curl -fsSL https://claw-link.dev/hermes/install.py | python3 -
```

Optional flags:

```bash
python3 install.py --yes
python3 install.py --repair
python3 install.py --print-approval-url-only
```

## Installer responsibilities

### 1. Detect Hermes

- find `hermes` on `PATH`
- resolve Hermes home:
  - `HERMES_HOME` if set
  - else `~/.hermes`
- locate Hermes Python runtime from the `hermes` launcher shebang when possible

### 2. Ensure MCP dependency

Installer must verify Hermes can load the Python `mcp` package.

Recommended check:

```bash
<hermes-python> -c "import importlib.util; print(importlib.util.find_spec('mcp') is not None)"
```

If missing:

- bootstrap `pip` if needed via `python -m ensurepip --upgrade`
- install `mcp` into the Hermes venv

### 3. Create bootstrap session

- call `POST /api/hermes/bootstrap-sessions`
- render the approval URL clearly for chat contexts

### 4. Wait for approval

- poll `GET /api/hermes/bootstrap-sessions/:id`
- default timeout: 15 minutes
- print progress every few seconds

### 5. Back up config

Before writing:

- back up `~/.hermes/config.yaml` to `config.yaml.bak.<timestamp>`

### 6. Upsert ClawLink MCP config

Required behavior:

- preserve unrelated config
- create `mcp_servers` if absent
- write or replace only `mcp_servers.clawlink`
- keep write idempotent

### 7. Verify install

Run:

```bash
hermes mcp test clawlink
```

Success condition:

- connects successfully
- discovers the expected ClawLink tools

Minimum expected tool count in v1:

- `10`

### 8. Activate for running sessions

Preferred order:

1. if installer is invoked inside an active Hermes chat that supports slash commands, tell user to run `/reload-mcp`
2. if local gateway restart is safe and available, run `hermes gateway restart`
3. if neither is safe, report that ClawLink will be available in new Hermes sessions immediately after restart/reload

Installer must not claim immediate availability if reload has not happened.

## Installer output contract

The installer should print short machine- and model-friendly milestones:

```text
[clawlink] Found Hermes at /Users/alice/.local/bin/hermes
[clawlink] MCP dependency already installed
[clawlink] Approval required: https://claw-link.dev/hermes/approve/hbs_123
[clawlink] Waiting for approval...
[clawlink] Approval received
[clawlink] Updated ~/.hermes/config.yaml
[clawlink] MCP test passed
[clawlink] Done
```

This allows Hermes to summarize progress naturally in chat.

## Hermes-facing prompt strategy

Replace the current long-form marketing-page prompt with a short bootstrap instruction.

Recommended copy:

> Ask Hermes: "Install ClawLink into yourself using the official installer from claw-link.dev, finish approval, and test the MCP connection."

Do not embed YAML or API keys in user-facing prompts.

## Website UX changes

## Marketing page

Add a Hermes-specific install section with:

- `Install in Hermes` heading
- one short copyable prompt
- explanation that Hermes will handle setup itself
- mobile note: "Hermes will send you a link to approve ClawLink"

## Optional dedicated page

Suggested route:

```text
/install/hermes
```

Content:

- what this does
- exact prompt to send Hermes
- fallback shell command for CLI users
- troubleshooting link

## Approval page UX

The approval page must be optimized for mobile:

- clear title: `Approve ClawLink for Hermes`
- explain what Hermes gains:
  - browse supported integrations
  - check connection health
  - execute actions you approve
- clear primary CTA: `Approve`
- secondary CTA: `Cancel`
- success page copy:
  - `Return to Hermes. Setup will continue automatically.`

## Security requirements

- bootstrap sessions expire quickly
- approval pages require authenticated ClawLink user identity
- bootstrap token is issued only after approval
- token should be revocable from ClawLink dashboard later
- token should be visible/auditable as a Hermes install credential
- installer never prints the full token after writing config
- rate limit bootstrap-session creation

## Failure modes

### Hermes binary missing

Installer returns a clear message:

```text
Hermes CLI was not found on this machine. Install Hermes first.
```

### MCP dependency install fails

Installer returns:

- detected Hermes python path
- attempted command
- next step

### Approval expires

Installer returns:

```text
Approval expired. Run the installer again to generate a new link.
```

### Config write fails

Installer restores backup if possible and prints failure.

### MCP test fails

Installer returns:

- connection error
- tool discovery failure
- auth failure
- suggested repair path: rerun installer with `--repair`

## Data model additions

Suggested table: `hermes_bootstrap_sessions`

Fields:

- `id`
- `status` (`pending_approval`, `approved`, `rejected`, `expired`, `consumed`, `error`)
- `agent_family`
- `agent_version`
- `client_label`
- `install_token_hash`
- `user_id`
- `workspace_id`
- `approval_token`
- `expires_at`
- `approved_at`
- `consumed_at`
- `created_at`
- `updated_at`

Optional:

- `hostname`
- `platform`
- `metadata_json`

## Acceptance criteria

### Product

- a Hermes user can install ClawLink from chat without hand-editing config
- a Telegram/WhatsApp user can complete approval from a phone
- website copy no longer depends on long technical prompts

### Backend

- bootstrap session API exists and is rate-limited
- approval page mints a scoped token on approve
- session polling returns install config after approval

### Installer

- detects Hermes reliably
- installs `mcp` when missing
- backs up config
- upserts `mcp_servers.clawlink`
- passes `hermes mcp test clawlink`

### Verification

Fresh machine or profile:

1. user messages Hermes to install ClawLink
2. Hermes runs installer
3. user approves in browser
4. installer finishes
5. `hermes mcp test clawlink` succeeds
6. a real Hermes prompt can call `clawlink.whoami`

## Rollout plan

### Phase 1

- bootstrap session API
- approval page
- hosted installer
- website Hermes install section
- token-in-header config install

### Phase 2

- dashboard view for Hermes-issued credentials
- repair/reconnect button
- optional gateway restart automation

### Phase 3

- evaluate migration to native MCP OAuth for Hermes
- keep installer flow, but reduce local credential storage if Hermes OAuth proves robust enough

## Open questions

- Should ClawLink issue a dedicated new token per install or reuse an existing user API key abstraction internally?
- Should the installer always restart the Hermes gateway when present, or default to `/reload-mcp` guidance?
- Do we want a separate token type for `agent_family = hermes` for easier revocation and analytics?
- Should approval page support QR code display for desktop-to-mobile handoff?

## Implementation recommendation

Implement this spec in one vertical slice:

1. backend bootstrap-session API
2. approval page
3. `install.py`
4. Hermes install section on the website

Do not start with prompt tuning. The installer is the product.
