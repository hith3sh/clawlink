# Local OpenClaw Plugin Testing

This repo now includes a native OpenClaw plugin package at `packages/openclaw-clawlink`.

## Published package

The plugin package is published as:

```bash
@useclawlink/openclaw-plugin
```

The OpenClaw plugin id is:

```bash
clawlink
```

## Link the local package into OpenClaw

From this repo:

```bash
openclaw plugins install -l /Users/hithesh/clawlink/packages/openclaw-clawlink
```

You can also pack the package first and install the tarball:

```bash
(cd packages/openclaw-clawlink && npm pack)
openclaw plugins install ./packages/openclaw-clawlink/useclawlink-openclaw-plugin-0.1.1.tgz
```

If a fresh chat doesn't pick up the local plugin, run `openclaw gateway restart`.

If you previously linked an older prerelease build, remove that local load path before testing the published npm package. Otherwise OpenClaw will load both copies and warn about duplicate plugin ids.

## Configure the plugin

The intended setup flow is chat-native. Paste this into OpenClaw:

```text
/clawlink login cllk_live_...
```

You can still configure the plugin manually if needed by adding the ClawLink API key to your OpenClaw config:

```json5
{
  plugins: {
    entries: {
      "clawlink": {
        enabled: true,
        config: {
          apiKey: "cllk_live_..."
        },
      },
    },
  },
}
```

## Smoke test

Inside OpenClaw:

1. Install or link the plugin.
2. Start a fresh chat (run `openclaw gateway restart` if the tools still don't appear).
3. Paste `/clawlink login cllk_live_...` into OpenClaw.
4. Confirm `/clawlink status` shows the key as configured.
5. Ask OpenClaw to connect an integration, for example: `connect my slack`.
6. Confirm the agent calls `clawlink_start_connection`.
7. Open the returned `connectUrl` and finish the hosted flow.
8. Confirm the agent polls `clawlink_get_connection_status` until it reports `connected`.

## Current coverage

- Manual hosted connections remain supported for non-OAuth integrations.
- Gmail, Notion, and Outlook are wired into the hosted Nango connection-session flow.
- Other OAuth providers still need Nango/provider wiring before the plugin can connect them successfully.
