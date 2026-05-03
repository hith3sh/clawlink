# Pipedream Provider Import Flow

This is the execution flow for adding one provider at a time to ClawLink's
manifest-backed Pipedream action system.

Use this when delegating a single provider migration or addition to another
agent.

Read this together with:

- [docs/pipedream-migration.md](/Users/hithesh/clawlink/docs/pipedream-migration.md:1)
- [CLAUDE.md](/Users/hithesh/clawlink/CLAUDE.md:1)
- [AGENTS.md](/Users/hithesh/clawlink/AGENTS.md:1)

## Goal

Given one provider slug, the agent should:

1. import the provider's Pipedream actions into ClawLink manifests
2. add the provider to ClawLink integration metadata if needed
3. clean up the imported actions with overrides
4. validate that the generated tools compile and are safe enough to expose

This flow is intentionally one-provider-at-a-time.

## Current Architecture

The platform pieces already exist:

- importer: [scripts/import-pipedream-actions.mjs](/Users/hithesh/clawlink/scripts/import-pipedream-actions.mjs:1)
- override layer: [config/pipedream-action-overrides.mjs](/Users/hithesh/clawlink/config/pipedream-action-overrides.mjs:1)
- generated manifests: [src/generated/pipedream-manifests/index.ts](/Users/hithesh/clawlink/src/generated/pipedream-manifests/index.ts:1)
- manifest registry: [src/lib/pipedream/manifest-registry.ts](/Users/hithesh/clawlink/src/lib/pipedream/manifest-registry.ts:1)
- generic executor: [src/lib/pipedream/action-executor.ts](/Users/hithesh/clawlink/src/lib/pipedream/action-executor.ts:1)

The web runtime is already wired to use generated manifest-backed tools.

## Important Rules

The agent should follow these rules unless explicitly told otherwise:

- Do not create a new `worker/integrations/<provider>.ts` custom handler just to add the provider.
- Do not add provider-specific proxy logic.
- Do not replace the generic executor with custom runtime code.
- Prefer fixing bad tools with overrides, not with manual handler code.
- Disable actions that are obviously unusable in ClawLink right now.
- Favor read actions and simple write actions first.
- Leave destructive actions enabled only if their input shape is clear enough.

## Current Platform Limits

The agent must account for these current limits:

- dynamic props are not fully configured at runtime yet
- `reloadProps` / `configureProp` dependent actions may import, but some will be awkward or incomplete
- local file system style actions should usually be disabled
- some upstream action metadata is not ideal for LLM-facing tools and needs overrides

Because of this, the first pass for a provider is:

- import broadly
- keep the clean actions
- disable obviously bad actions
- do not over-engineer one provider

## Input To Give The Agent

When delegating, provide:

- provider slug in ClawLink, for example `notion`
- Pipedream app slug, for example `notion`
- whether the provider already exists in [src/data/integrations.ts](/Users/hithesh/clawlink/src/data/integrations.ts:1)
- whether this provider should use hosted Pipedream connect in the dashboard now

In most cases, `integration slug == Pipedream app slug`.

## Exact Workflow

### 1. Inspect provider capability first

Check the public Pipedream component repo shape for the provider:

- `components/<app>/actions`
- `components/<app>/sources`

The point is to understand:

- how many actions exist
- which are read vs write vs destructive
- which ones obviously depend on dynamic props
- which ones involve file upload or local paths

Do not start by writing custom provider code.

### 2. Decide if this provider is ready for first-pass import

Good first-pass provider signs:

- many simple actions like list/get/search/create/update
- few or no local-file actions
- limited dynamic prop complexity

Bad first-pass provider signs:

- most useful actions depend on generated additional props
- heavy upload / filesystem flows
- awkward nested schema everywhere

If the provider looks too dynamic, still import it, but disable the worst
actions instead of trying to solve the whole provider in one pass.

### 3. Ensure the integration exists in ClawLink metadata

Check [src/data/integrations.ts](/Users/hithesh/clawlink/src/data/integrations.ts:1).

If the provider does not exist yet:

- add a base integration entry
- add metadata entry
- set the correct dashboard/runtime status
- set `setupMode: "pipedream"` if this provider should use hosted Pipedream connect now

If it already exists:

- update `setupMode` if needed
- update displayed tool summaries if needed

Do not rename the integration slug casually.

### 4. Ensure the provider is connect-enabled if needed

If the provider should be connectable from the dashboard now:

- add it to `PIPEDREAM_CONNECT_SLUGS` in [wrangler.toml](/Users/hithesh/clawlink/wrangler.toml:1)

If the project uses explicit app mapping, update that env/config too.

### 5. Add override scaffold for the provider

Edit [config/pipedream-action-overrides.mjs](/Users/hithesh/clawlink/config/pipedream-action-overrides.mjs:1).

Create a provider section like:

```js
const overrides = {
  integrations: {
    providerSlug: {
      excludeActionIds: [],
      hiddenProps: [],
      actionOverrides: {
        "provider-action-id": {
          enabled: true,
          toolName: "provider_custom_name",
          mode: "read",
          risk: "safe",
          idempotent: true,
          hiddenProps: [],
        },
      },
    },
  },
};
```

Use overrides for:

- renaming tool names
- fixing read/write/destructive mode
- fixing risk
- disabling unusable actions
- hiding props that should not be exposed

### 6. Run the importer

Run:

```bash
npm run import:pipedream-actions -- --app <app-slug> --integration <provider-slug> --source github
```

Notes:

- `--source github` is the safe default right now
- Connect catalog import may be blocked depending on the Pipedream plan
- this will generate or rewrite:
  - `src/generated/pipedream-manifests/<provider>.generated.ts`
  - [src/generated/pipedream-manifests/index.ts](/Users/hithesh/clawlink/src/generated/pipedream-manifests/index.ts:1)

### 7. Review the generated manifest

Inspect:

- `src/generated/pipedream-manifests/<provider>.generated.ts`

Check for:

- obviously bad tool names
- read actions incorrectly marked as write
- local path or directory props
- weird hidden props leaking into the public input schema
- dynamic-only actions that should be disabled for now
- dangerous destructive tools that need `high_impact`

### 8. Apply override pass

Repeat this loop:

1. edit overrides
2. rerun importer
3. inspect generated file

Stop when the provider manifest is "good enough", which means:

- names are stable enough
- read tools are marked `read`
- obviously bad actions are disabled
- unusable props are removed or hidden
- the remaining set is coherent enough for first exposure

Do not chase perfection on the first provider pass.

### 9. Validate the repo

Run:

```bash
npx eslint config/pipedream-action-overrides.mjs scripts/import-pipedream-actions.mjs src/generated/pipedream-manifests/*.ts --max-warnings=0
npx tsc --noEmit --pretty false
```

If these fail, fix the provider changes before stopping.

### 10. Sanity-check runtime exposure

At minimum, confirm:

- the provider's generated manifest is exported from [src/generated/pipedream-manifests/index.ts](/Users/hithesh/clawlink/src/generated/pipedream-manifests/index.ts:1)
- the provider tools will be picked up by [src/lib/pipedream/manifest-registry.ts](/Users/hithesh/clawlink/src/lib/pipedream/manifest-registry.ts:1)
- the generic executor path will handle them through [src/lib/pipedream/action-executor.ts](/Users/hithesh/clawlink/src/lib/pipedream/action-executor.ts:1)

If the provider is `postiz`, remember that it still has the only retained
custom handler. All other providers should rely on generated manifests.

## What The Agent Should Not Do

Do not do these unless explicitly asked:

- rewrite a provider to a custom handler
- implement dynamic prop runtime support
- deploy both workers
- test every destructive action
- redesign OpenClaw tool names for the whole provider

## Recommended First-Pass Enablement Policy

Enable first:

- list
- get
- search
- retrieve
- simple create
- simple update

Be cautious with:

- append / batch operations
- property-schema mutation
- large nested object inputs
- file upload flows

Usually disable on first pass:

- local file path based actions
- actions that only make sense with full dynamic prop configuration
- actions whose public schema is obviously broken after import

## Expected Output From The Agent

For each provider, the agent should report:

1. imported provider and app slugs
2. generated manifest file path
3. which actions were disabled
4. which action modes or risks were corrected
5. whether the provider was added to `src/data/integrations.ts`
6. whether `PIPEDREAM_CONNECT_SLUGS` was updated
7. whether the provider is affected by the Postiz custom-handler exception
8. whether `eslint` and `tsc` passed
9. any known limitations that remain

## Copy-Paste Delegation Prompt

Use this prompt when handing one provider to another agent:

```text
Integrate the provider <provider-slug> into ClawLink using the one-provider workflow in docs/pipedream-provider-import-flow.md.

Rules:
- use the existing manifest-backed Pipedream platform
- do not add a custom worker handler just to make this provider work
- use config/pipedream-action-overrides.mjs for cleanup
- import via:
  npm run import:pipedream-actions -- --app <app-slug> --integration <provider-slug> --source github
- validate with eslint and tsc

Deliver:
- the generated manifest
- required integration metadata/config changes
- a short summary of disabled actions, corrected risk/mode metadata, and remaining limitations
```
