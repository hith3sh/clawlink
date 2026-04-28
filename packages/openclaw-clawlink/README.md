# ClawLink OpenClaw Plugin

Third-party OpenClaw plugin that lets OpenClaw talk to external SaaS apps through [ClawLink](https://claw-link.dev)'s hosted integration layer.

> **Not affiliated with OpenClaw.** ClawLink is an independent service. This package is published by the ClawLink team under the npm scope [`@useclawlink`](https://www.npmjs.com/package/@useclawlink/openclaw-plugin). Source: [github.com/hith3sh/clawlink](https://github.com/hith3sh/clawlink). License: MIT.

## What it does

ClawLink stores OAuth tokens and API keys for a growing catalog of business apps on your behalf, then exposes a uniform set of tools so OpenClaw can read from and write to those apps without per-provider setup. Today that includes integrations like Google Docs, Google Sheets, Google Calendar, Google Drive, Twilio, and Google Search Console. You authenticate once in the ClawLink dashboard; OpenClaw calls into ClawLink over HTTPS with a single API key.

## Install

```bash
openclaw plugins install @useclawlink/openclaw-plugin
openclaw gateway restart
```

## Configure

1. Generate an API key at https://claw-link.dev/dashboard/settings?tab=api.
2. Paste the generated `/clawlink login <key>` command into your OpenClaw chat as a standalone message. OpenClaw's gateway routes slash commands directly to the ClawLink plugin handler on the fast path (see [docs.openclaw.ai/tools/slash-commands](https://docs.openclaw.ai/tools/slash-commands.md)), so the AI model never sees the command or the key.
3. Optional — if your OpenClaw client renders a plugin settings UI, you can instead paste the raw key into the **ClawLink API key** field there.

Either way, the key is stored locally in `~/.openclaw/openclaw.json` under `plugins.entries.clawlink.config.apiKey` and is only sent to `claw-link.dev`.

Full setup walkthrough: https://docs.claw-link.dev/openclaw

## Tools

The plugin registers seven tools. OpenClaw's assistant discovers available integrations dynamically — you don't need to configure individual apps here.

- `clawlink_start_connection` — start a hosted OAuth/connect session for a new app
- `clawlink_get_connection_status` — poll an in-progress connect session
- `clawlink_list_integrations` — list apps already connected
- `clawlink_list_tools` — list callable tools across connected apps
- `clawlink_describe_tool` — fetch schema and usage guidance for one tool
- `clawlink_preview_tool` — preview a tool call before execution, especially for writes
- `clawlink_call_tool` — execute a tool against a connected app

## Commands

- `/clawlink login <apiKey>` — save an API key. Routed by OpenClaw's gateway directly to the plugin on the fast path; the AI model never sees the command or the key.
- `/clawlink status` — show whether an API key is configured
- `/clawlink logout` — remove the saved API key

## Security

- The plugin only makes outbound HTTPS requests to `https://claw-link.dev`.
- Your API key is stored locally under `~/.openclaw/openclaw.json` and sent only as the `X-ClawLink-API-Key` header to ClawLink.
- Rotate or revoke keys any time at https://claw-link.dev/dashboard/settings?tab=api.
- Report security issues to security@claw-link.dev.

## Releases

Tag-based publish via GitHub Actions — see `.github/workflows/publish-openclaw-plugin.yml`.

1. Bump the version in `package.json` and `openclaw.plugin.json`.
2. Commit the version bump to `main`.
3. Create and push a matching tag:

```bash
git tag openclaw-plugin-v0.1.11
git push origin openclaw-plugin-v0.1.11
```

The workflow verifies that the tag version matches both package files, runs `npm pack --dry-run`, and publishes to npm via Trusted Publishing.

## Local development

See [docs/openclaw-plugin-local-testing.md](../../docs/openclaw-plugin-local-testing.md).
