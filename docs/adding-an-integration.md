# Adding a new integration

New ClawLink integrations should use Composio Connect. Do not add a new per-provider worker handler unless the user explicitly asks for a custom exception. The only current custom-handler exception is `postiz`.

For the detailed import mechanics, read `docs/composio-integration-setup-guide.md` together with this checklist.

## What you need before you start

- A ClawLink `slug` used everywhere in the codebase. Lowercase, hyphenated. Examples: `linkedin`, `google-ads`, `mailchimp`.
- The Composio toolkit slug for the integration (often identical to the ClawLink slug, but confirm in the Composio docs).
- A connected test account or a planned test account binding for runtime validation.
- At least one safe read action that can be used for smoke testing.

## Step 1 - Register catalog metadata

Update `src/data/integrations.ts` in both places:

- Add or update the base catalog entry with name, slug, description, category, icon, and brand color.
- Add or update the metadata entry with `setupMode: "composio"`, dashboard/runtime status, user-facing setup copy, and honest tool descriptions.

Keep `tools[]` aligned with the generated Composio tools you intend to expose. Do not advertise tools that are not imported and validated.

## Step 2 - Configure Composio

Add the slug and toolkit mapping to `wrangler.toml` in the Composio maps:

```toml
COMPOSIO_ENABLED_SLUGS = "...,<slug>"
COMPOSIO_TOOLKIT_MAP = "...,<slug>=<composio_toolkit_slug>"
COMPOSIO_TOOLKIT_VERSION_MAP = "...,<slug>=<version>"
```

The hosted connect flow and runtime execution both read these values from the same deploy surface now.

Also set the Composio auth config ID as a Cloudflare secret:

```bash
AUTH_CONFIG_ID=$(grep COMPOSIO_<SLUG>_AUTH_CONFIG_ID .env.local | cut -d= -f2 | tr -d '"')
echo "$AUTH_CONFIG_ID" | wrangler secret put COMPOSIO_<SLUG>_AUTH_CONFIG_ID
```

## Step 3 - Import the Composio tools

Use the importer:

```bash
npm run import:composio-tools -- --toolkit <composio_toolkit_slug> --integration <slug>
```

Then inspect `src/generated/composio-manifests/<slug>.generated.ts` and verify read tools are classified as `risk: "safe"` and destructive tools as `risk: "high_impact"`.

## Step 4 - Validate the integration

Run the required validation sequence:

```bash
npm run test:openclaw-plugin-contract
npm run smoke:openclaw-plugin -- --integration <slug>
```

Runtime validation needs a Composio test account binding. Prefer safe read tools first.

## Step 5 - Add a smoke preset

Create `scripts/smoke-presets/<slug>.mjs` with at least one safe `read` step. Add `preview` steps for write tools only when the preview path is low-risk and repeatable. Real writes belong behind the smoke runner's explicit write mode.

The preset must use the actual tool names from the Composio manifest registry.

## Step 6 - Verify hosted connect

From the integration page or `claw-link.dev/connect/<slug>`:

1. Start the hosted Composio flow.
2. Complete provider login and consent.
3. Confirm the connection session ends in `connected`.
4. Confirm the row is stored with Composio connected account metadata.
5. Run the smoke preset with the ClawLink API key for that test account.

## Step 7 - Deploy the runtime

Most new integrations require a fresh `clawlink-web` deploy:

```bash
npm run deploy:web
```

`clawlink-web` serves hosted connect, dashboard routes, and tool execution.

## Per-integration checklist

- [ ] Catalog entry in `src/data/integrations.ts`
- [ ] Metadata entry uses `setupMode: "composio"`
- [ ] Slug added to `COMPOSIO_ENABLED_SLUGS` in `wrangler.toml`
- [ ] Toolkit mapping added to `COMPOSIO_TOOLKIT_MAP` in `wrangler.toml`
- [ ] Version added to `COMPOSIO_TOOLKIT_VERSION_MAP` in `wrangler.toml`
- [ ] Manifest imported at `src/generated/composio-manifests/<slug>.generated.ts`
- [ ] Auth config ID secret set on `clawlink-web`
- [ ] `npm run test:openclaw-plugin-contract`
- [ ] Smoke preset added under `scripts/smoke-presets/<slug>.mjs`
- [ ] Hosted connect flow ends in `connected`
- [ ] `npm run smoke:openclaw-plugin -- --integration <slug>`
- [ ] `npm run smoke:openclaw-plugin -- --integration <slug> --preview` if the integration exposes writes

## Things to avoid

- Do not add a new `worker/integrations/<slug>.ts` handler or a new `registerHandler()` call for normal integrations.
- Do not list tools in the dashboard metadata before the generated manifest exposes them.
- Do not forget `wrangler.toml` and Cloudflare secrets. Hosted connect and execution share the same config surface.
- Do not mark the integration ready until Composio import, plugin contract test, hosted connect, and live smoke all pass.
