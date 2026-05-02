# ClawLink OpenClaw Plugin

Third-party OpenClaw plugin that lets OpenClaw talk to external SaaS apps through [ClawLink](https://claw-link.dev)'s hosted integration layer.

> **Not affiliated with OpenClaw.** ClawLink is an independent service. This package is published by the ClawLink team under the npm scope [`@useclawlink`](https://www.npmjs.com/package/@useclawlink/openclaw-plugin). Source: [github.com/hith3sh/clawlink](https://github.com/hith3sh/clawlink). License: MIT.

## What it does

ClawLink stores OAuth tokens and API keys for a growing catalog of business apps on your behalf, then exposes a uniform set of tools so OpenClaw can read from and write to those apps without per-provider setup. Today that includes integrations like Google Docs, Google Sheets, Google Calendar, Google Drive, Twilio, and Google Search Console. The recommended setup flow is browser pairing: OpenClaw opens a ClawLink approval page, you approve the device once, and the plugin stores its local credential automatically.

## Install

```bash
openclaw plugins install @useclawlink/openclaw-plugin
openclaw gateway restart
```

## Configure

1. In OpenClaw, start browser pairing:
   - preferred: let the assistant call `clawlink_begin_pairing`
   - if your session started before the plugin was installed and the tools are not visible yet, start a fresh chat and retry pairing there
2. Open the returned ClawLink pairing URL in your browser and approve the device.
3. Let OpenClaw call `clawlink_get_pairing_status` to finish storing the local credential.

The resulting device credential is stored locally in `~/.openclaw/openclaw.json` under `plugins.entries.clawlink.config.apiKey` and is only sent to `claw-link.dev`.

Advanced/manual fallback: generate an API key at https://claw-link.dev/dashboard/settings?tab=api and paste the raw key into the **ClawLink API key** field if your client renders a plugin settings UI.

Full setup walkthrough: https://docs.claw-link.dev/openclaw

## Tools

The plugin registers nine tools. OpenClaw's assistant discovers available integrations dynamically — you don't need to configure individual apps here.

- `clawlink_begin_pairing` — start or resume browser pairing for this OpenClaw install
- `clawlink_get_pairing_status` — finish pairing after the browser approval is complete
- `clawlink_start_connection` — start a hosted OAuth/connect session for a new app
- `clawlink_get_connection_status` — poll an in-progress connect session
- `clawlink_list_integrations` — list apps already connected
- `clawlink_list_tools` — list callable tools across connected apps
- `clawlink_describe_tool` — fetch schema and usage guidance for one tool
- `clawlink_preview_tool` — preview a tool call before execution, especially for writes
- `clawlink_call_tool` — execute a tool against a connected app

## Support Commands

Normal onboarding should happen through tools and browser pairing. These commands remain as support/debug escape hatches:

- `/clawlink pair [deviceLabel]` — start or resume browser pairing from the plugin fast path
- `/clawlink pair-status` — check whether browser pairing has been approved yet
- `/clawlink login <apiKey>` — manual API key fallback
- `/clawlink status` — show whether pairing or an API key is configured
- `/clawlink logout` — remove the saved API key

## Security

- The plugin only makes outbound HTTPS requests to `https://claw-link.dev`.
- Browser pairing stores a local device credential under `~/.openclaw/openclaw.json`; advanced/manual API keys use the same local config path.
- The stored credential is sent only as the `X-ClawLink-API-Key` header to ClawLink.
- Rotate or revoke manually created keys any time at https://claw-link.dev/dashboard/settings?tab=api.
- Report security issues to security@claw-link.dev.

