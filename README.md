# clawlink-hermes-plugin

> [ClawLink](https://claw-link.dev) for [Hermes Agent](https://hermes-agent.nousresearch.com).
> Connect 100+ third-party apps — Gmail, Slack, Notion, GitHub, Stripe, and more — through one Hermes plugin.

ClawLink manages OAuth and API credentials for you. Install the plugin once, pair it with your ClawLink account in the browser, and Hermes can immediately call any app you connect in the [ClawLink dashboard](https://claw-link.dev/dashboard).

## Why this exists

Hermes connects to external apps through MCP servers, but the bootstrap is manual: editing `~/.hermes/config.yaml`, generating an API key, pasting headers. This plugin owns that setup so you never see the YAML.

The plugin is the recommended install path because it avoids `curl … | python3` patterns that Hermes's `tirith` security scanner flags.

## Install

```bash
hermes plugins install claw-link/hermes-plugin --enable
hermes clawlink setup
```

`setup` will:

1. Check whether ClawLink is already configured. If so, validate it and exit.
2. Create a one-time approval session and print a URL.
3. Wait for you to approve the device in your browser (sign in to ClawLink if needed).
4. Write `mcp_servers.clawlink` into `~/.hermes/config.yaml` with a scoped MCP token.
5. Run `hermes mcp test clawlink` to verify the install.

After setup, run `/reload-mcp` in active Hermes chats — or start a fresh session — to pick up the new tools.

## Commands

CLI subcommands (run from your terminal):

| Command | What it does |
| --- | --- |
| `hermes clawlink setup` | Pair this Hermes with your ClawLink account |
| `hermes clawlink test` | Run `hermes mcp test clawlink` against the current config |
| `hermes clawlink repair` | Rotate the ClawLink token and rewrite the config |
| `hermes clawlink status` | Show whether ClawLink is configured |

In-session slash commands (use these from inside a Hermes chat):

| Slash command | Equivalent |
| --- | --- |
| `/clawlink setup` | `hermes clawlink setup` |
| `/clawlink test` | `hermes clawlink test` |
| `/clawlink repair` | `hermes clawlink repair` |
| `/clawlink status` | `hermes clawlink status` |

## What the plugin writes

A single block under `mcp_servers` in `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  clawlink:
    url: "https://claw-link.dev/api/mcp"
    headers:
      x-clawlink-api-key: "<scoped token issued by ClawLink>"
    timeout: 180
    connect_timeout: 60
```

Existing config is backed up to `config.yaml.bak.<timestamp>` before any change. If the write fails, the backup is restored automatically.

## Requirements

- Hermes Agent installed and on `PATH`.
- The Python `mcp` package available in Hermes's interpreter (Hermes installs this for you when MCP servers are configured; the plugin gives a clear `pip install` instruction if it is missing).
- A ClawLink account at [claw-link.dev](https://claw-link.dev).

## Troubleshooting

- **`Hermes CLI was not found on PATH`** — the plugin is loaded but cannot run `hermes mcp test clawlink`. Make sure the `hermes` launcher is on `PATH`, then rerun setup.
- **`The mcp Python package is not installed`** — install it into the Hermes interpreter with the command the plugin prints (`<python> -m pip install --upgrade mcp`), then rerun setup.
- **Approval timed out / expired / canceled** — the approval link has a 15-minute lifetime. Run `hermes clawlink setup` again to generate a fresh one.
- **Tools do not appear after setup** — run `/reload-mcp` in your active chat, or start a new Hermes session so the tool catalog reloads.

## Development

This package mirrors the production code at [`hith3sh/clawlink`](https://github.com/hith3sh/clawlink) under `packages/clawlink-hermes-plugin/`. Releases are cut from this repo (`claw-link/hermes-plugin`) so `hermes plugins install` can fetch them directly from GitHub.

To test locally without publishing:

```bash
hermes plugins install /absolute/path/to/clawlink-hermes-plugin --enable
hermes clawlink setup
```

Run unit tests:

```bash
python3 -m pytest tests
```

## Security

- Tokens are stored only in `~/.hermes/config.yaml` and are sent only to `https://claw-link.dev` (or the `CLAWLINK_BASE_URL` you configure for self-hosted setups).
- The plugin makes no outbound network calls during normal Hermes operation — only during `setup`, `repair`, or `test`.
- See [`claw-link.dev/verify`](https://claw-link.dev/verify) for build provenance.

## License

MIT
