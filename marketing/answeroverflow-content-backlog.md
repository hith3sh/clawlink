# Answer Overflow → ClawLink Content Backlog

Source target: public Answer Overflow pages for the **Friends of the Crustacean** Discord archive.

## Why this exists

These topics come from real public user questions and issue phrasing rather than invented marketing ideas. The goal is to turn recurring support pain into:

- SEO-friendly blog posts
- troubleshooting docs
- FAQ pages
- integration/setup guides

## Current collection constraints

Direct page fetches from Answer Overflow are currently intermittently blocked by a Vercel security checkpoint, so this first pass is based on public search-indexed thread titles/snippets. That is still useful for topic mining, but individual thread details should be verified manually when writing the final post.

## Confirmed issue/topic leads from indexed public threads

### 1) ACPX plugin setup and enablement
- Public thread title: `ACPX Plugin`
- Public snippet indicates confusion around:
  - `openclaw config set plugins.allow '["acpx"]' --strict-json`
  - `openclaw gateway restart`
  - plugin discovery / allowlist startup warnings
  - checking `openclaw gateway status --json`

**Content angle**
- Blog: `How to enable the ACPX plugin in OpenClaw`
- FAQ: `Why ACPX isn’t showing up in OpenClaw`
- Troubleshooting: `ACPX plugin installed but tools don’t appear`

**Intent class**
- setup
- plugin configuration
- troubleshooting

---

### 2) Origin not allowed / CORS-style errors
- Public thread title: `Origin not allowed`

**Content angle**
- Blog: `How to fix “Origin not allowed” in OpenClaw`
- Troubleshooting: explain likely causes, allowed origins, proxy/config mismatch, and safe checks

**Intent class**
- error resolution
- deployment troubleshooting
- high SEO value because users search exact error text

---

### 3) OpenClaw not responding / response regressions after updates
- Public thread title: `V.2026.4.26 Response issue`
- Public thread title: `Openclaw help`
- Snippets suggest users may experience behavior regressions, missed execution, or confusing promise-vs-action responses

**Content angle**
- Blog: `OpenClaw not responding after an update? Start here`
- Blog: `Why OpenClaw says it will act but doesn’t complete the task`
- Docs: `Post-update troubleshooting checklist`

**Intent class**
- update troubleshooting
- reliability
- debugging

---

### 4) ACP agent configuration confusion
- Public thread title: `ACP agent configuration`
- Snippet indicates confusion between:
  - standard OpenClaw model-backed agents
  - ACP / CLI-backed agents
  - installed CLIs not automatically wiring ACP runtime

**Content angle**
- Blog: `ACP vs normal OpenClaw agents: what’s the difference?`
- Docs: `How to configure CLI-backed agents in OpenClaw`
- FAQ: `Why installing Codex/Claude Code/Gemini CLI doesn’t automatically enable ACP`

**Intent class**
- architecture confusion
- setup
- onboarding

---

### 5) Rollback causing config validation failure / acpx plugin not found
- Public thread title: `Rolled back and now getting a config validation failure. acpx plugin not found. Off to research.`
- Public snippet suggests:
  - newer version wrote `acpx` into config
  - older version doesn’t support it
  - fix involved editing `~/.openclaw/openclaw.json`

**Content angle**
- Blog: `How to fix “acpx plugin not found” after rolling back OpenClaw`
- Troubleshooting: version mismatch between config and binary
- FAQ: `Why rollback broke my plugin config`

**Intent class**
- rollback issues
- version mismatch
- exact-error SEO

---

### 6) Exec capabilities missing on Windows / WSL1
- Public thread title: `Is there a way to enable exec capabilities on native Windows or WSL1? Any config option or workaround`
- Snippet indicates:
  - user enabled allowlist and plugin config
  - exec tools still didn’t appear
  - Windows Server / WSL1 environment matters

**Content angle**
- Blog: `Why exec tools may not appear on Windows or WSL1 in OpenClaw`
- Docs: `OpenClaw exec capability support matrix`
- FAQ: `How to check whether exec is supported on your host`

**Intent class**
- platform limitations
- troubleshooting
- expectation-setting

---

### 7) Connecting Claude Code / Codex / CLI agents
- Public thread title: `where can i read about how to connect claud code with ...`

**Content angle**
- Blog: `How to connect Claude Code to OpenClaw`
- Blog: `How ACP sessions work in OpenClaw`
- FAQ: `Do I need ACP to use coding CLIs with OpenClaw?`

**Intent class**
- onboarding
- ACP education
- high-intent technical traffic

---

### 8) OpenCode serve password / environment variable confusion
- Public thread title: `Using the opencode serve ACP with a password via OPENCODE_SERVER_PASSWORD environment variable.`
- Snippet suggests guidance around:
  - not setting variables globally
  - protecting the server at the network layer
  - keeping OpenClaw/gateway environment clean

**Content angle**
- Blog: `How to secure OpenCode ACP in OpenClaw`
- Docs: `Environment variables vs network-layer protection for ACP servers`
- FAQ: `Why global env vars can break ACP setups`

**Intent class**
- security
- advanced setup
- troubleshooting

---

### 9) Token usage / cost reduction
- Public thread title: `how can I lower the amount of tokens my openclaw uses`

**Content angle**
- Blog: `How to reduce token usage in OpenClaw`
- Docs: `Practical ways to lower OpenClaw costs`
- FAQ: `Why your OpenClaw session is using so many tokens`

**Intent class**
- cost optimization
- usage tuning
- very searchable

---

### 10) Device visibility / device management confusion
- Public thread title: `openclaw devices list`

**Content angle**
- Blog: `How device management works in OpenClaw`
- FAQ: `Why a device may not appear in OpenClaw`
- Docs: `Checking paired devices and connection state`

**Intent class**
- device pairing
- operational troubleshooting

## Recommended first publishing wave

These look strongest because they map to real pain, are likely to attract exact-match searches, and can be answered cleanly:

1. `How to fix “Origin not allowed” in OpenClaw`
2. `How to enable the ACPX plugin in OpenClaw`
3. `How to fix “acpx plugin not found” after rolling back OpenClaw`
4. `ACP vs normal OpenClaw agents: what’s the difference?`
5. `How to reduce token usage in OpenClaw`
6. `Why exec tools may not appear on Windows or WSL1 in OpenClaw`

## Suggested page types

### Best as blog posts
- exact error fixes
- rollback / update issues
- architecture explanations for confused users
- cost/token tuning

### Best as docs pages
- ACPX setup
- support matrix pages
- device management
- CLI/ACP setup walkthroughs

### Best as FAQ
- short exact-match problem questions
- definitions / differences
- one-command or one-setting fixes

## Writing template for each issue-driven post

### Title
Use the exact user phrasing where possible.

Examples:
- `How to fix “Origin not allowed” in OpenClaw`
- `Why ACPX isn’t showing up in OpenClaw`
- `How to fix “acpx plugin not found” after rolling back OpenClaw`

### Structure
1. What this error means
2. Why it happens
3. Step-by-step fix
4. How to verify the fix
5. Common variations of the problem
6. Related docs / related issues

## Next research steps

1. Verify each shortlisted thread manually in a browser session outside the current fetch checkpoint when possible.
2. Capture exact user wording and the accepted or most useful answer.
3. Convert repeated problems into canonical docs pages and leave blog posts for search-oriented troubleshooting queries.
4. Cross-link every post to ClawLink / OpenClaw setup docs and relevant integration pages.

## Immediate next deliverables

- Turn the top 3 topics into draft posts
- Build a reusable Q&A/troubleshooting template for the docs/blog
- Continue mining more Answer Overflow threads through search results and additional indexed pages
