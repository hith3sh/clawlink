# ClawLink OpenClaw Plugin

Native OpenClaw plugin package for ClawLink hosted connection sessions and dynamic integration tooling.

## Install

Official first-party setup values:

- package: `@useclawlink/openclaw-plugin`
- install: `openclaw plugins install @useclawlink/openclaw-plugin`
- API settings: `https://claw-link.dev/dashboard/settings?tab=api`
- docs: `https://docs.claw-link.dev/openclaw`
- login command format: `/clawlink login cllk_live_...`
- verify: `/clawlink status`

```bash
openclaw plugins install @useclawlink/openclaw-plugin
openclaw gateway restart
```

Then paste the dashboard-generated login command into OpenClaw:

```text
/clawlink login cllk_live_...
```

Create your API key at `https://claw-link.dev/dashboard/settings?tab=api`.

Full setup docs: `https://docs.claw-link.dev/openclaw`

You can also manage config manually in `~/.openclaw/openclaw.json` under `plugins.entries.openclaw-plugin.config`, but the chat command is the intended setup flow.

## Tools

- `clawlink_start_connection`
- `clawlink_get_connection_status`
- `clawlink_list_integrations`
- `clawlink_list_tools`
- `clawlink_describe_tool`
- `clawlink_call_tool`

## Commands

- `/clawlink status`
- `/clawlink login <apiKey>`
- `/clawlink logout`

## Releases

This repo includes a GitHub Actions workflow at `.github/workflows/publish-openclaw-plugin.yml`.

Recommended release flow:

1. Bump the version in `package.json` and `openclaw.plugin.json`.
2. Commit the version change to `main`.
3. Create and push a matching tag:

```bash
git tag openclaw-plugin-v0.1.2
git push origin openclaw-plugin-v0.1.2
```

The workflow verifies that the tag version matches both package files, runs `npm pack --dry-run`, and then publishes to npm.

Before this will work, configure npm Trusted Publishing for the GitHub repository `hith3sh/clawlink` and this workflow file.

## Local development

See [docs/openclaw-plugin-local-testing.md](../../docs/openclaw-plugin-local-testing.md).
