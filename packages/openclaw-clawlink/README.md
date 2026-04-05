# ClawLink OpenClaw Plugin

Native OpenClaw plugin package for ClawLink hosted connection sessions.

## Install

```bash
openclaw plugins install @useclawlink/openclaw-plugin
openclaw gateway restart
```

Then paste this command into OpenClaw:

```text
/clawlink login cllk_live_...
```

You can also manage config manually in `~/.openclaw/openclaw.json` under `plugins.entries.openclaw-plugin.config`, but the chat command is the intended setup flow.

## Tools

- `clawlink_start_connection`
- `clawlink_get_connection_status`

## Commands

- `/clawlink status`
- `/clawlink login <apiKey>`
- `/clawlink logout`

## Local development

See [docs/openclaw-plugin-local-testing.md](../../docs/openclaw-plugin-local-testing.md).
