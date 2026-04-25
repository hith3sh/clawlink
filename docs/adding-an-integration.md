# Adding a new integration

This is the short how-to for wiring any new third-party integration into ClawLink. It applies to both Nango-managed OAuth providers (most cases) and manual-credential providers (API key / token).

For the contract between ClawLink and a Nango provider, see `nango-provider-contracts/postiz.md` — that file is the template for any new provider contract doc you might also want to write.

## What you need before you start

- A `slug` you'll use everywhere in the codebase. Lowercase, hyphenated. Example: `linkedin`, `mailchimp`, `google-ads`.
- For OAuth providers: the Nango provider config key (set up on the Nango side first).
- For manual providers: the credential fields you need from the user (API key, account id, etc.).

## Step 1 — Register the integration in `src/data/integrations.ts`

Two entries, both keyed by `slug`.

**Base entry** (top half of the file): name, slug, description, category, icon name (from `react-icons`), brand color.

**Metadata entry** (bottom half): `setupMode`, `dashboardStatus`, `runtimeStatus`, `setupGuide`, `credentialFields`, and `tools`.

| Field | OAuth via Nango | Manual credentials |
|---|---|---|
| `setupMode` | `"oauth"` | `"manual"` |
| `dashboardStatus` | `"available"` once shippable, else `"coming-soon"` | same |
| `runtimeStatus` | `"live"` once worker handler exists, else `"planned"` | same |
| `credentialFields` | `[]` (Nango handles capture) | one entry per field the user must paste |
| `setupGuide` | One-line user-facing copy explaining the hosted flow | One-line copy explaining where to find the credentials |
| `tools` | One entry per tool the worker exposes; mirrors the handler | same |

Keep `tools[]` honest — it's what the dashboard advertises. Don't list a tool you haven't implemented in the worker.

## Step 2 — Map the slug to a Nango provider config key (OAuth only)

Add an entry to the `NANGO_PROVIDER_CONFIG_KEYS` JSON map in **both** wrangler files:

- `wrangler.toml` (frontend Worker)
- `worker/wrangler.worker.toml` (backend Worker)

```toml
NANGO_PROVIDER_CONFIG_KEYS = "{...,\"<slug>\":\"<nango-provider-config-key>\"}"
```

Both files must agree. The right-hand value must match the provider config key registered on the Nango side exactly.

If you forget this step, the connect flow will fall through to the manual path (or fail to start the Nango session) and the worker won't be able to load credentials.

## Step 3 — Write the worker handler

Create `worker/integrations/<slug>.ts`. Use `worker/integrations/postiz.ts` as the OAuth template, or `worker/integrations/twilio.ts` as the manual-credentials template.

Pattern:

```ts
import { BaseIntegration, defineTool, registerHandler, type IntegrationTool } from "./base";

class MySlugHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "list_things", { /* schema, accessLevel, etc. */ }),
      defineTool(integrationSlug, "create_thing", { /* ... */ }),
    ];
  }

  async execute(action, args, credentials, ctx) {
    switch (action) {
      case "list_things": return this.listThings(credentials);
      case "create_thing": return this.createThing(credentials, args);
      default: throw new Error(`Unknown action: ${action}`);
    }
  }
}

registerHandler("<slug>", new MySlugHandler());
```

The runtime injects `credentials` for you — for Nango providers this is loaded via `worker/credentials.ts` from the user's stored Nango connection; for manual providers it's whatever was captured by `credentialFields`.

Then add the import to `worker/integrations/index.ts`:

```ts
import "./<slug>";
```

That single import is what registers the handler. Skipping it means the slug works in the dashboard but every tool call returns "no handler".

## Step 4 — (OAuth only, optional) Write a Nango provider contract doc

If the provider doesn't exist in the Nango fork yet, write a sibling to `docs/nango-provider-contracts/postiz.md` so whoever implements the Nango side knows:

- the expected provider config key
- the metadata fields ClawLink will use for connection labels (see `src/lib/server/connection-sessions.ts:236-265` for the lookup order — it's generic across all providers)
- the API base URL and any verification endpoint

Skip this if the Nango side is already done.

## Step 5 — Deploy both Workers

A new integration always touches both deploy targets:

```
npm run deploy:web      # frontend / Next routes / dashboard
npm run deploy:worker   # tool execution backend
```

Frontend-only or backend-only deploys will leave the integration half-broken.

## Step 6 — Verify (two layers)

Per `AGENTS.md` integration MVP testing:

1. **Connection flow.** Start the dashboard connect, complete OAuth (or paste the manual credentials), confirm the connection session ends in `connected` and the row appears in `/dashboard/integrations`.
2. **Tool execution.** From the OpenClaw worker (or `curl` against `api.claw-link.dev`), call a read-only tool first (`<slug>_list_*`), then a write tool. Read first, write second.

If step 1 fails: check the Nango provider config key mapping (Step 2), the redirect URIs registered with the upstream provider, and the connect callback flow.

If step 1 succeeds but step 2 fails: check scopes/permissions on the Nango side, then the worker handler request shape.

## Per-integration checklist

Copy this when adding a new one:

- [ ] Base entry in `src/data/integrations.ts`
- [ ] Metadata entry in `src/data/integrations.ts` (setupMode, status, tools, setupGuide)
- [ ] Slug added to `NANGO_PROVIDER_CONFIG_KEYS` in `wrangler.toml`
- [ ] Slug added to `NANGO_PROVIDER_CONFIG_KEYS` in `worker/wrangler.worker.toml`
- [ ] Handler file at `worker/integrations/<slug>.ts`
- [ ] Import added to `worker/integrations/index.ts`
- [ ] (OAuth) Nango provider contract doc at `docs/nango-provider-contracts/<slug>.md` if the Nango side is new
- [ ] `npm run deploy:web`
- [ ] `npm run deploy:worker`
- [ ] Hosted connect flow ends in `connected`
- [ ] At least one read tool succeeds end-to-end
- [ ] At least one write tool succeeds end-to-end

## Things to avoid

- Don't add a slug to the dashboard before the worker handler exists — `runtimeStatus` should stay `planned` until the handler is shipped.
- Don't list tools in `src/data/integrations.ts` that aren't implemented in the worker. The dashboard treats this list as truth.
- Don't introduce a second OAuth/credential path for a Nango provider — let Nango own the auth lifecycle (see the `postiz.md` "Non-goals" section).
- Don't update only one wrangler file — the slug must be in both.
