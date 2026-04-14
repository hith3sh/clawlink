# Self-Hosted Nango

This repo now uses Nango as the OAuth backend for supported integrations.

## What lives where

- VPS deployment scaffolding: `infra/nango/`
- Frontend runtime config: `wrangler.toml`
- Worker runtime config: `worker/wrangler.worker.toml`
- D1 schema migration: `migrations/006_nango_connections.sql`

## VPS setup

1. Copy `infra/nango/.env.example` to `infra/nango/.env`.
2. Set a real Postgres password plus long random values for `NANGO_ENCRYPTION_KEY` and `NANGO_JWT_SECRET`.
3. Decide your public URLs:
   - `NANGO_SERVER_URL` is the API origin that ClawLink server routes and the worker call.
   - `NANGO_PUBLIC_CONNECT_URL` is the public Connect UI origin that the hosted `/connect/[slug]` page opens.
4. Start Nango:

```bash
cd infra/nango
docker compose up -d
```

5. Put TLS and a reverse proxy in front of the exposed ports before using production traffic.

## ClawLink runtime config

The repo expects these values in both production deploy targets:

- `NANGO_BASE_URL`
- `NANGO_PROVIDER_CONFIG_KEYS`

The frontend Worker also needs:

- `NEXT_PUBLIC_NANGO_BASE_URL`

For the current production split-host setup, use:

- `NANGO_BASE_URL=https://nango.claw-link.dev`
- `NEXT_PUBLIC_NANGO_BASE_URL=https://connect.nango.claw-link.dev`

And both deploy targets need the secret:

- `NANGO_SECRET_KEY`

Recommended provider map while the first migration slice only targets Gmail, Notion, and Outlook:

```json
{"gmail":"gmail","notion":"notion","outlook":"outlook"}
```

If your Nango integration ids differ, change the JSON before deploying.

## Cloudflare secrets

Set the Nango secret on both Workers:

```bash
wrangler secret put NANGO_SECRET_KEY
wrangler --cwd worker secret put NANGO_SECRET_KEY --config wrangler.worker.toml --experimental-autoconfig=false
```

## Current migration scope

- OAuth integrations should be treated as Nango-managed when a slug has a provider config mapping.
- Manual/API-key integrations stay on the existing local credential path.
- ClawLink now reconciles Nango completion through both webhook handling and backend session polling.
- Legacy per-provider OAuth routes for the initial Nango-managed providers are now disabled and should not be used.
