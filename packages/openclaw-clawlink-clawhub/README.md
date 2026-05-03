# ClawLink OpenClaw Plugin

Third-party OpenClaw plugin that lets OpenClaw talk to external SaaS apps through [ClawLink](https://claw-link.dev)'s hosted integration layer.

> **Not affiliated with OpenClaw.** ClawLink is an independent service. This package is published by the ClawLink team under the npm scope [`@useclawlink`](https://www.npmjs.com/package/@useclawlink/openclaw-plugin). Source: [public GitHub repository](https://github.com/hith3sh/clawlink). License: MIT.

## What it does

ClawLink stores provider OAuth tokens and API credentials on ClawLink servers, encrypted at rest, for a growing catalog of business apps on your behalf. It then exposes a uniform set of tools so OpenClaw can read from and write to those apps without per-provider setup. Today that includes integrations like Google Docs, Google Sheets, Google Calendar, Google Drive, Twilio, and Google Search Console. Setup is browser pairing: OpenClaw opens a ClawLink approval page, you approve the device once, and the plugin stores its local ClawLink device credential automatically.

## Install

```bash
openclaw plugins install clawhub:clawlink-plugin
```

Or directly from npm:

```bash
openclaw plugins install @useclawlink/openclaw-plugin
```

## Configure

1. In OpenClaw, start browser pairing:
   - let the assistant call `clawlink_begin_pairing`
   - if your session started before the plugin was installed and the tools are not visible yet, start a fresh chat and retry pairing there
   - if a fresh chat still doesn't show the tools, contact your OpenClaw admin or ClawLink support to reload the gateway
2. Open the returned ClawLink pairing URL in your browser and approve the device.
3. Let OpenClaw call `clawlink_get_pairing_status` to finish storing the local credential.

The resulting device credential is stored locally in `~/.openclaw/openclaw.json` under `plugins.entries.clawlink-plugin.config.apiKey` and is only sent to `claw-link.dev`.

Full setup walkthrough: https://docs.claw-link.dev/openclaw

## Tools

The plugin registers ten tools. OpenClaw's assistant discovers available integrations dynamically — you don't need to configure individual apps here.

- `clawlink_begin_pairing` — start or resume browser pairing for this OpenClaw install
- `clawlink_get_pairing_status` — finish pairing after the browser approval is complete
- `clawlink_start_connection` — start a hosted OAuth/connect session for a new app
- `clawlink_get_connection_status` — poll an in-progress connect session
- `clawlink_list_integrations` — list apps already connected
- `clawlink_list_tools` — list callable tools for one connected app
- `clawlink_search_tools` — search connected tools by capability or keyword
- `clawlink_describe_tool` — fetch schema and usage guidance for one tool
- `clawlink_preview_tool` — preview a tool call before execution, especially for writes
- `clawlink_call_tool` — execute a tool against a connected app

## Support Commands

Normal onboarding should happen through tools and browser pairing. These commands remain as support/debug escape hatches:

- `/clawlink pair [deviceLabel]` — start or resume browser pairing from the plugin fast path
- `/clawlink pair-status` — check whether browser pairing has been approved yet
- `/clawlink status` — show whether the plugin is paired
- `/clawlink logout` — remove the saved credential

## Security

- ClawHub package: `clawlink-plugin`
- npm package: `@useclawlink/openclaw-plugin`
- ClawHub publishes are source-linked to the public GitHub repository and the latest ClawHub security scan is clean.
- npm releases are published from GitHub Actions with npm provenance.
- ClawHub verification includes source-linked release metadata for the published artifact.
- The plugin only makes outbound HTTPS requests to `https://claw-link.dev`.
- Browser pairing stores only a local ClawLink device credential under `~/.openclaw/openclaw.json`.
- Provider tokens and API keys are not written to OpenClaw config or shown to the assistant; they stay on ClawLink servers encrypted at rest.
- The local device credential is sent only as the `X-ClawLink-API-Key` header to ClawLink.
- Report security issues to security@claw-link.dev.
