# Local OpenClaw Plugin Testing

This repo now includes a native OpenClaw plugin package at `packages/openclaw-clawlink`.

## Temporary package name

Until a final registry name is locked, the plugin package is published as:

```bash
@clawlink/openclaw-plugin
```

The OpenClaw plugin id remains:

```bash
clawlink
```

## Link the local package into OpenClaw

From this repo:

```bash
openclaw plugins install -l /Users/hithesh/clawlink/packages/openclaw-clawlink
openclaw gateway restart
```

You can also pack the package first and install the tarball:

```bash
(cd packages/openclaw-clawlink && npm pack)
openclaw plugins install ./packages/openclaw-clawlink/clawlink-openclaw-plugin-0.1.0.tgz
openclaw gateway restart
```

## Configure the plugin

The intended setup flow is chat-native. In a private chat with OpenClaw:

```text
/clawlink login cllk_live_...
```

For local or staging ClawLink deployments:

```text
/clawlink login cllk_live_... http://localhost:3000
```

You can still configure the plugin manually if needed by adding the ClawLink API key and optional base URL override to your OpenClaw config:

```json5
{
  plugins: {
    entries: {
      clawlink: {
        enabled: true,
        config: {
          apiKey: "cllk_live_...",
          baseUrl: "http://localhost:3000",
        },
      },
    },
  },
}
```

Use `https://claw-link.dev` for production or a local/staging URL when testing this repo.

## Smoke test

Inside OpenClaw:

1. Install or link the plugin.
2. Restart the OpenClaw gateway.
3. Send `/clawlink login cllk_live_...` in a private chat.
4. Confirm `/clawlink status` shows the key as configured.
5. Ask OpenClaw to connect an integration, for example: `connect my slack`.
6. Confirm the agent calls `clawlink_start_connection`.
7. Open the returned `connectUrl` and finish the hosted flow.
8. Confirm the agent polls `clawlink_get_connection_status` until it reports `connected`.

## Current coverage

- Manual hosted connections are the only end-to-end flow currently ready.
- OAuth providers such as Notion still need provider-specific hosted callback and token exchange work on the ClawLink backend before the plugin can connect them successfully.
