# Adding a new integration

New ClawLink integrations should use Pipedream Connect plus generated Pipedream action manifests. Do not add a new per-provider worker handler unless the user explicitly asks for a custom exception. The only current custom-handler exception is `postiz`.

For the detailed import mechanics, read `docs/pipedream-provider-import-flow.md` together with this checklist.

## What you need before you start

- A ClawLink `slug` used everywhere in the codebase. Lowercase, hyphenated. Examples: `linkedin`, `google-ads`, `mailchimp`.
- The Pipedream app name. This often differs from the slug, for example `google-calendar` maps to `google_calendar`.
- A connected test account or a planned test account binding for runtime validation.
- At least one safe read action that can be used for smoke testing.

## Step 1 - Register catalog metadata

Update `src/data/integrations.ts` in both places:

- Add or update the base catalog entry with name, slug, description, category, icon, and brand color.
- Add or update the metadata entry with `setupMode: "pipedream"`, dashboard/runtime status, user-facing setup copy, and honest tool descriptions.

Keep `tools[]` aligned with the generated manifest tools you intend to expose. Do not advertise tools that are not imported and validated.

## Step 2 - Configure Pipedream Connect

Add the slug to `PIPEDREAM_CONNECT_SLUGS` in:

- `wrangler.toml`

If the Pipedream app name is not exactly the same as the slug, add a mapping to `PIPEDREAM_APP_MAP` there too:

```toml
PIPEDREAM_APP_MAP = "...,<slug>=<pipedream_app_name>"
```

The hosted connect flow and runtime execution both read these values from the same deploy surface now.

## Step 3 - Import the Pipedream actions

Use the importer instead of creating `worker/integrations/<slug>.ts`:

```bash
npm run import:pipedream-actions -- --app <pipedream_app_name> --integration <slug> --source github
```

Then inspect `src/generated/pipedream-manifests/<slug>.generated.ts` and add overrides in `config/pipedream-action-overrides.mjs` as needed.

Common fixes:

- Hide Pipedream-internal props with `hiddenProps`.
- Supply stable hidden values with `safeDefaults`.
- Add `validationArgs` when a required business argument is needed to exercise a safe action.

## Step 4 - Validate the integration

Run the required validation sequence:

```bash
npm run audit:manifests -- --strict
npm run validate:pipedream-actions -- --integration <slug> --strict
npm run test:openclaw-plugin-contract
npm run smoke:openclaw-plugin -- --integration <slug>
```

Runtime validation needs a Pipedream test account binding through `PIPEDREAM_TEST_ACCOUNTS_JSON` or a per-integration variable such as `PIPEDREAM_TEST_GMAIL_ACCOUNT_ID`.

## Step 5 - Add a smoke preset

Create `scripts/smoke-presets/<slug>.mjs` with at least one safe `read` step. Add `preview` steps for write tools only when the preview path is low-risk and repeatable. Real writes belong behind the smoke runner's explicit write mode.

The preset must use the actual tool names from the manifest-backed registry.

## Step 6 - Verify hosted connect

From the integration page or `claw-link.dev/connect/<slug>`:

1. Start the hosted Pipedream flow.
2. Complete provider login and consent.
3. Confirm the connection session ends in `connected`.
4. Confirm the row is stored with Pipedream account metadata.
5. Run the smoke preset with the ClawLink API key for that test account.

## Step 7 - Deploy the runtime

Most new integrations require a fresh `clawlink-web` deploy:

```bash
npm run deploy:web
```

`clawlink-web` serves hosted connect, dashboard routes, and tool execution.

## Per-integration checklist

- [ ] Catalog entry in `src/data/integrations.ts`
- [ ] Metadata entry uses `setupMode: "pipedream"`
- [ ] Slug added to `PIPEDREAM_CONNECT_SLUGS` in `wrangler.toml`
- [ ] App-name mapping added to `PIPEDREAM_APP_MAP` in `wrangler.toml` when needed
- [ ] Manifest imported at `src/generated/pipedream-manifests/<slug>.generated.ts`
- [ ] Overrides added for hidden/internal props and safe validation args
- [ ] `npm run audit:manifests -- --strict`
- [ ] `npm run validate:pipedream-actions -- --integration <slug> --strict`
- [ ] `npm run test:openclaw-plugin-contract`
- [ ] Smoke preset added under `scripts/smoke-presets/<slug>.mjs`
- [ ] Hosted connect flow ends in `connected`
- [ ] `npm run smoke:openclaw-plugin -- --integration <slug>`
- [ ] `npm run smoke:openclaw-plugin -- --integration <slug> --preview` if the integration exposes writes

## Things to avoid

- Do not add a new `worker/integrations/<slug>.ts` handler or a new `registerHandler()` call for normal integrations.
- Do not use the old Nango/manual setup path for new providers unless the product direction explicitly changes.
- Do not list tools in the dashboard metadata before the generated manifest exposes them.
- Do not forget `wrangler.toml`. Hosted connect and execution now share the same config surface.
- Do not mark the integration ready until static audit, runtime validation, plugin contract tests, hosted connect, and live smoke all pass.
