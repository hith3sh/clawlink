# Tool-Call Testing Plan

The hosted connect flow is only half the product. If OpenClaw can't actually invoke a tool through ClawLink end-to-end, the integration is broken from the user's perspective. Today our coverage is uneven — Gmail has a smoke preset, most others have nothing — and each new integration ships without a repeatable way to prove tool calls work.

This doc is the playbook. When we add a new integration, we follow this end-to-end.

## What "the tool call works" means

Five layers, in order. An integration is not done until all five pass.

1. **Connect flow** — `claw-link.dev/connect/<slug>` opens, the user finishes the hosted flow, the connection lands as `auth_state = active`. Already covered by the manual flow in `docs/adding-an-integration.md`.
2. **Tool listing** — `clawlink_list_tools` returns the integration's tools for that user. If the registry doesn't include them (wrong `auth_backend`, manifest not registered, or the Postiz custom handler missing), nothing else matters.
3. **Tool describe** — `clawlink_describe_tool` returns the schema. Confirms argument shape is what the model will actually see.
4. **Read call** — A safe, idempotent read tool actually executes against the provider and returns real data. This is where most regressions show up: missing `pipedreamAccountId` plumbing, wrong slug→app mapping, hidden Pipedream props, scope gaps.
5. **Write call (preview or sandboxed)** — Either a `clawlink_preview_tool` call that returns the request payload without side effects, or a low-risk write into a test resource (a draft, a test list, a dummy spreadsheet). This catches issues that don't show up on read paths (write-only scopes, validators that reject empty bodies).

## How we test today

Three scripts already exist, each covers a different layer:

| Script | What it covers | Talks to live provider? |
|---|---|---|
| `npm run audit:manifests -- --strict` | Static check of generated manifests | No |
| `npm run validate:pipedream-actions -- --integration <slug> --strict` | Runs each manifest action against Pipedream with `safeDefaults` | Yes (Pipedream only) |
| `npm run test:openclaw-plugin-contract` | Verifies the OpenClaw plugin forwards args correctly | No (mocked fetch) |
| `npm run smoke:openclaw-plugin -- --preset <preset>` | Loads the actual plugin code, calls live ClawLink API with the user's key, ClawLink calls the live provider | **Yes — full path** |

Only the smoke runner exercises the actual call chain OpenClaw uses in production. It's the right tool. The problem is preset coverage — `scripts/smoke-openclaw-plugin-live.mjs` currently hardcodes two Gmail presets and rejects everything else.

## The wrapper exists and now loads presets

`scripts/smoke-openclaw-plugin-live.mjs` already:
- Loads the API key and smoke fixture values from `.env.local` / `.env.production` / `CLAWLINK_API_KEY` / `~/.openclaw/openclaw.json`.
- Instantiates `clawlinkPlugin` against a fake OpenClaw `api` object.
- Calls `clawlink_list_tools`, `clawlink_describe_tool`, `clawlink_call_tool`, `clawlink_preview_tool` through the plugin's real code paths.
- Loads per-integration presets from `scripts/smoke-presets/<slug>.mjs`.
- Supports `--integration`, `--all`, and `--connected` summary runs.

This is the "OpenClaw simulator." Don't build a new one.

Current remaining gap: the test account still needs active connections and fixture IDs for resource-specific reads such as a Google Docs document id or Search Console site URL.

## Proposed structure

### Per-integration preset files

Replace the hardcoded `buildPreset()` switch with one file per integration at `scripts/smoke-presets/<slug>.mjs`:

```js
// scripts/smoke-presets/gmail.mjs
export default {
  slug: "gmail",
  // Always-safe identity / read calls. Run on every smoke pass.
  read: [
    { tool: "gmail_get_current_user" },
    { tool: "gmail_find_email", args: { q: "in:inbox", maxResults: 1 } },
  ],
  // Preview-only writes. Safe to run, no side effects on the provider.
  preview: [
    {
      tool: "gmail_send_email",
      args: ({ to }) => ({ to: [to], subject: "ClawLink preview", body: "preview" }),
      requires: ["to"],
    },
  ],
  // Real writes. Off by default; needs --write to run. Each step must
  // describe how to clean up or target a known-disposable resource.
  write: [],
};
```

Rules for preset files:
- **`read` steps must be truly idempotent** — `get_current_user`, `list_*`, `find_*` with `maxResults: 1`. Never anything that touches state.
- **`preview` steps use `clawlink_preview_tool`**, not `clawlink_call_tool`. This is the contract the OpenClaw plugin already supports for showing the request without executing it.
- **`write` steps default off**. They run only with `--write` and should target test resources (a folder named `clawlink-smoke`, a list named `ClawLink Test`, etc.). Each step states its cleanup expectation.
- **Manifest-backed integrations and the Postiz custom handler use the same preset format** — the runner just calls the plugin, which routes appropriately.

### Runner changes

```bash
npm run smoke:openclaw-plugin -- --integration gmail              # safe reads only
npm run smoke:openclaw-plugin -- --integration gmail --preview    # reads + previews
npm run smoke:openclaw-plugin -- --integration gmail --write      # everything (dangerous)
npm run smoke:openclaw-plugin -- --connected                      # safe reads, connected integrations with presets
npm run smoke:openclaw-plugin -- --all                            # safe reads, every preset on disk
npm run smoke:openclaw-plugin -- --all --preview                  # safe reads + previews
```

Output: pass/fail per step, plus a final summary table:

```
Integration         List  Describe  Read  Preview
gmail               ok    ok        ok    ok
google-sheets       ok    ok        FAIL  -
slack               ok    ok        ok    ok
...
2 of 24 integrations failing.
```

Exit non-zero if any step fails so it can gate a deploy.

### What to run when

| When | Command |
|---|---|
| Adding a new integration (per-integration validation) | `--integration <slug> --preview` |
| Before any release that changes worker / executor / credentials code | `--connected` on the connected test account |
| Fully connected release sweep | `--all` |
| Weekly / scheduled regression | `--connected --preview` |
| Manual deep test (rare, gated) | `--integration <slug> --write` |

## Per-integration testing checklist (new integrations)

When adding a new integration, do these in order. Don't skip steps.

1. **Connect flow works manually.**
   - Catalog entry exists in `src/data/integrations.ts` with the right `setupMode`.
   - For Pipedream: slug is in `PIPEDREAM_CONNECT_SLUGS` in *both* `wrangler.toml` and `worker/wrangler.worker.toml`.
   - For Pipedream with a hyphen in the slug, or a non-matching app name: slug is in `PIPEDREAM_APP_MAP` in both wrangler files (see CLAUDE.md "Pipedream slug → app name mapping").
   - Open `claw-link.dev/connect/<slug>` and finish the flow as a test user.
2. **Manifest is wired in.**
   - Pipedream manifest path: `src/generated/pipedream-manifests/<slug>.generated.ts` exists, `index.ts` exports it, `npm run audit:manifests -- --strict` passes, `npm run validate:pipedream-actions -- --integration <slug> --strict` passes.
   - Do not add a new `worker/integrations/<slug>.ts` handler. `postiz` is the only current custom-handler exception.
3. **Plugin contract test passes.** `npm run test:openclaw-plugin-contract`.
4. **Add a smoke preset.** Create `scripts/smoke-presets/<slug>.mjs` with at least one `read` step. Add a `preview` step if the integration has any write tool. The preset must reflect the real tool names the plugin will resolve.
5. **Smoke read passes.** `npm run smoke:openclaw-plugin -- --integration <slug>` with a real connection on the test account. This is the gate that proves OpenClaw → ClawLink → provider works for this integration.
6. **Smoke preview passes** (if the integration has writes). `--integration <slug> --preview`.
7. **Update the per-integration coverage table** in this doc (below).
8. **Update CLAUDE.md** if the integration introduced anything other agents need to know (a new auth backend, a non-obvious app name, a quirky scope requirement).

## Per-integration coverage status

Tracked here so we know what's actually verified end-to-end. Update this table as part of the checklist above.

Statuses: `pass`, `fail`, `n/a` (no such tool kind for this integration), `untested`.

| Integration | Auth | Manifest | Connect | List | Read | Preview | Last verified |
|---|---|---|---|---|---|---|---|
| gmail | pipedream | yes | pass | pass | pass | pass | 2026-04-29 |
| google-sheets | pipedream | **no** | n/a | n/a | n/a | n/a | — |
| slack | pipedream | **no** | n/a | n/a | n/a | n/a | — |
| google-calendar | pipedream | yes | untested | untested | untested | untested | — |
| google-drive | pipedream | yes | untested | untested | untested | untested | — |
| google-docs | pipedream | yes | pass | pass | **fail** (missing `GOOGLE_DOCS_DOCUMENT_ID`) | untested | 2026-04-29 |
| google-analytics | pipedream | yes | untested | untested | untested | untested | — |
| google-search-console | pipedream | yes | pass | pass | **fail** (missing `GOOGLE_SEARCH_CONSOLE_SITE_URL`) | untested | 2026-04-29 |
| google-ads | pipedream | yes | untested | untested | untested | untested | — |
| notion | pipedream | yes | pass | pass | pass | untested | 2026-04-29 |
| outlook | pipedream | yes | pass | pass | pass | untested | 2026-04-29 |
| onedrive | pipedream | yes | pass | pass | pass | untested | 2026-04-29 |
| facebook | pipedream | yes | untested | untested | untested | untested | — |
| linkedin | pipedream | yes | pass | pass | pass | untested | 2026-04-29 |
| youtube | pipedream | yes | pass | pass | pass | untested | 2026-04-29 |
| mailchimp | pipedream | yes | pass | pass | pass | untested | 2026-04-29 |
| klaviyo | pipedream | yes | untested | untested | untested | untested | — |
| instantly | pipedream | yes | untested | untested | untested | untested | — |
| postiz | pipedream | yes | untested | untested | untested | untested | — |
| hubspot | pipedream | yes | untested | untested | untested | untested | — |
| salesforce | pipedream | yes | untested | untested | untested | untested | — |
| apollo | pipedream | yes | untested | untested | untested | untested | — |
| airtable | pipedream | yes | untested | untested | untested | untested | — |
| clickup | pipedream | yes | untested | untested | untested | untested | — |
| calendly | pipedream | yes | untested | untested | untested | untested | — |
| xero | pipedream | yes | pass | pass | pass | untested | 2026-04-29 |

Known migration work right now:
- **Custom handlers removed except Postiz** — manifest coverage and smoke presets are the source of truth for normal integrations.
- **`google-sheets` and `slack`** — both have Pipedream connect config but no generated manifest, so they are marked coming soon and currently expose no tools. Import manifests before adding smoke presets or marking tool execution ready.
- **`apollo`** — now uses the generated manifest path only; validate the manifest-backed tools before marking it ready.

## Implementation roadmap

This is what someone needs to do to get the runner to the shape this doc describes. Order matters — earlier steps unblock later ones.

1. **Done:** refactor `scripts/smoke-openclaw-plugin-live.mjs` to load presets from `scripts/smoke-presets/*.mjs`.
2. **Done:** add `--integration`, `--all`, and `--connected` modes with summary table output and non-zero exit on failure.
3. **Done:** write smoke presets for current manifest-backed integrations and Postiz.
4. **Run `--all` against the production worker once** with a fully-connected test account to fill in the coverage table.
5. **Import `google-sheets` and `slack` manifests** before adding smoke presets or live verification for those integrations.
6. **Add preview steps** for integrations whose writes are common and safely previewable.
7. **Wire `--all` (read mode) into a pre-deploy check** — even just a manual command in the deploy runbook is fine to start. Add it to CI later.
8. **Add this checklist to `CLAUDE.md` / `AGENTS.md`** so future agents follow it without being told.

## Notes for future agents

- **Do not invent a new test wrapper.** The smoke runner is the real OpenClaw code path. Anything else won't catch plugin-side regressions (argument forwarding, auth header, retries).
- **Read paths must be safe.** A `read` preset that mutates state is a footgun — it'll silently pollute the test account on every CI run.
- **Preview paths must use `clawlink_preview_tool`.** Calling `clawlink_call_tool` for a write tool is a real write, regardless of intent.
- **The test account must have the integration connected.** The runner does not create connections — the user runs the connect flow once per integration on the test account, and the runner reuses those connections forever.
- **`CLAWLINK_API_KEY` must point at the test account, not your personal account.** A failing `--all` run will hit every connected provider on whatever account owns that key.
