# Self-Hosted Nango

This repo now includes a first-pass Nango migration path for OAuth integrations.

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

- OAuth integrations can be routed through Nango when a slug has a provider config mapping.
- Manual/API-key integrations stay on the existing local credential path.
- Free self-hosted Nango completion is reconciled by ClawLink polling Nango connections from the backend, not by Nango webhooks.
