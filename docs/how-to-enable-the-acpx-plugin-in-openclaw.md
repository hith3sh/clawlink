# How to Enable the ACPX Plugin in OpenClaw

*If ACPX is installed but not showing up, the problem is usually not magic. It’s usually one of three things: the plugin isn’t allowed, the gateway hasn’t reloaded, or the current chat started before OpenClaw refreshed its tool catalog.*

If you want OpenClaw to use ACP-backed tooling and sessions, you need the **ACPX plugin** available and loaded correctly.

This guide covers the normal setup path and the most common reasons ACPX seems to be missing.

## What ACPX is, in plain English

ACPX is the bridge that helps OpenClaw work with ACP-style agent backends and related flows.

If you’re trying to use things like:

- ACP-backed sessions
- coding-agent style flows
- external coding/runtime agent backends
- thread/session workflows that depend on ACP runtime

…then ACPX being present matters.

## The most common symptoms

People usually land here because one of these is happening:

- ACPX tools don’t appear
- config mentions ACPX but the runtime doesn’t seem to load it
- a setup guide says ACPX should exist, but the current session can’t use it
- OpenClaw warns about plugin discovery or allowlists

## Normal setup flow

## 1) Check whether ACPX is allowed
If your setup uses a plugin allowlist, ACPX needs to be included.

A commonly referenced command is:

```bash
openclaw config set plugins.allow '["acpx"]' --strict-json
```

If your environment also depends on bundled runtime tooling exposure, make sure you have not accidentally excluded other required built-in pieces.

## 2) Reload the gateway
After changing plugin config, restart the gateway:

```bash
openclaw gateway restart
```

If you skip this, OpenClaw may continue running with the old plugin state.

## 3) Check gateway status
Now verify what the gateway believes is loaded:

```bash
openclaw gateway status
```

If your environment supports JSON output and you want more detail:

```bash
openclaw gateway status --json
```

You’re looking for signs that:

- the gateway is healthy
- config validation passed
- ACPX is no longer blocked by the current config

## 4) Start a fresh chat if the plugin was just enabled
This is the part people forget.

Even if ACPX is now available, the **current chat session** may still reflect the older tool catalog.

So if you just installed or enabled ACPX and still don’t see the expected tools:

- start a fresh OpenClaw chat
- retry the task there

That alone fixes a surprising number of “it still isn’t there” moments.

## Why ACPX may not appear

## Reason 1: the plugin allowlist blocks it
If `plugins.allow` is set and ACPX is not included, OpenClaw may refuse to expose it.

## Reason 2: gateway wasn’t restarted
You updated config, but runtime is still using the old state.

## Reason 3: current session is stale
The plugin is fine now, but the current chat was started before the plugin catalog refreshed.

## Reason 4: plugin discovery warnings are being misread
Some setups emit startup warnings around discovery behavior when allowlists and non-bundled plugins are involved.

That does **not always** mean the world is on fire.

It does mean you should check actual gateway status instead of guessing.

## Reason 5: you are mixing up ACP runtime with normal model-backed agents
This one happens a lot.

Installing a CLI somewhere on the machine does **not** automatically mean OpenClaw is now using ACP-backed flows.

OpenClaw has a difference between:

- standard model/API-backed agent configuration
- ACP/CLI-backed runtime flows

If you’re expecting ACP behavior from a normal agent config, you may be looking in the wrong place.

## Minimal troubleshooting checklist

Use this in order:

### 1. Check whether ACPX is in the allowlist
If not, add it.

### 2. Restart the gateway
```bash
openclaw gateway restart
```

### 3. Check gateway status
```bash
openclaw gateway status --json
```

### 4. Start a fresh chat
Do not keep testing in the stale session forever.

### 5. Re-run the task that should surface ACP behavior
If it still fails, now you have a cleaner reproduction.

## Example setup commands

A simple flow often looks like this:

```bash
openclaw config set plugins.allow '["acpx"]' --strict-json
openclaw gateway restart
openclaw gateway status --json
```

Then open a **fresh chat** and test again.

## If ACPX still doesn’t show up
At that point, collect evidence instead of random experimentation.

Useful things to inspect:

- current plugin allowlist
- gateway status output
- whether config validation is failing
- whether the current chat predates the config change
- whether your expected workflow actually requires ACPX, or something else

## Common mistakes

### Installing or enabling ACPX and expecting the current chat to magically update
It often won’t.

### Restarting nothing
Config changes are not wishes.

### Confusing normal agent model config with ACP runtime setup
Very common. Very fixable.

### Assuming a warning equals a fatal failure
Sometimes it does. Sometimes it doesn’t. Check status.

## Final thought

If ACPX is missing, don’t flail.

Use the boring path:

1. allow it
2. restart gateway
3. inspect status
4. start a fresh chat
5. retry

That solves a lot more than people want to admit.

## Related follow-up pages to link later

- `Why ACPX isn’t showing up in OpenClaw`
- `ACP vs normal OpenClaw agents: what’s the difference?`
- `How to connect Claude Code or other CLI agents to OpenClaw`
- `How to fix “acpx plugin not found” after rolling back OpenClaw`
