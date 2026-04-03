# ClawLink OpenClaw Plugin

Native OpenClaw plugin package for ClawLink hosted connection sessions.

## Install

```bash
openclaw plugins install @useclawlink/openclaw-plugin
openclaw gateway restart
```

Then, in a private chat with OpenClaw, save the API key:

```text
/clawlink login cllk_live_...
```

For local or staging ClawLink deployments:

```text
/clawlink login cllk_live_... http://localhost:3000
```

You can also manage config manually in `~/.openclaw/openclaw.json` under `plugins.entries.clawlink.config`, but the chat command is the intended setup flow.

## Tools

- `clawlink_start_connection`
- `clawlink_get_connection_status`

## Commands

- `/clawlink status`
- `/clawlink login <apiKey> [baseUrl]`
- `/clawlink base-url <url|default>`
- `/clawlink logout`

## Local development

See [docs/openclaw-plugin-local-testing.md](../../docs/openclaw-plugin-local-testing.md).
