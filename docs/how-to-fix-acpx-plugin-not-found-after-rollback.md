# How to Fix “acpx plugin not found” After Rolling Back OpenClaw

*This error is usually not mysterious. It’s a version mismatch wearing a fake moustache.*

If you rolled OpenClaw back to an older version and now you’re seeing a config validation failure like:

```text
acpx plugin not found
```

…the usual cause is simple:

- a newer OpenClaw version wrote ACPX-related plugin config
- the older version you rolled back to does not support or ship that plugin in the same way
- your config is now newer than your binary

That mismatch is what breaks startup or validation.

## Why this happens

Rollback problems often happen because the **application binary** changed, but the **saved config** did not.

So you end up with something like:

- config still references `acpx`
- older OpenClaw version does not recognize or load it
- startup or validation fails

In other words, the rollback reverted the code but not the assumptions living in your config file.

## Where to check

The first place to inspect is your local OpenClaw config:

```text
~/.openclaw/openclaw.json
```

Look for a `plugins` section or entries that reference `acpx`.

## The usual fix

If you intentionally rolled back to a version that does not support the ACPX plugin configuration you currently have, remove the ACPX entry from the config and restart the gateway.

In plain terms:

1. open `~/.openclaw/openclaw.json`
2. find the `plugins` section
3. remove the `acpx` entry that the older version cannot handle
4. save the file
5. restart OpenClaw gateway

## Example flow

Open the config file with your editor of choice and remove the incompatible ACPX plugin reference.

Then restart:

```bash
openclaw gateway restart
```

After that, check status:

```bash
openclaw gateway status
```

If your environment supports it and you want more detail:

```bash
openclaw gateway status --json
```

## What you’re fixing, exactly

You are not “repairing ACPX” here.

You are making your config match the older version you chose to run.

That’s the key idea.

## Safe troubleshooting flow

## 1) Confirm you actually rolled back
Ask:

- what version was running before?
- what version am I on now?
- did the error start immediately after rollback?

If yes, config/binary mismatch is the leading suspect.

## 2) Inspect `~/.openclaw/openclaw.json`
Check whether `acpx` is referenced under plugin settings.

## 3) Remove only the incompatible ACPX entry
Do **not** randomly delete unrelated config unless you enjoy making tomorrow worse.

## 4) Restart the gateway
```bash
openclaw gateway restart
```

## 5) Re-check status
```bash
openclaw gateway status --json
```

## 6) Start a fresh chat if needed
If startup is fixed but the session still acts weird, start a fresh chat after the rollback cleanup.

## Common mistakes

### Rolling back the binary but keeping forward-only config
That’s the root problem most of the time.

### Editing too much at once
If you change ten things, you learn nothing.

### Forgetting to restart the gateway
Also classic.

### Assuming the plugin package is missing when the real problem is config compatibility
Very common.

## When this article’s fix is the right one
This guide is the right match when:

- the error started after a rollback
- the error explicitly mentions `acpx plugin not found`
- an older version is now reading config produced by a newer one

## When it might be something else
It might be a different issue if:

- you did not roll back anything
- you are on a current version and ACPX should be supported
- the plugin is blocked by allowlist/config rather than missing from that version
- startup is failing for broader config validation reasons unrelated to ACPX

In those cases, also check:

- plugin allowlist settings
- current gateway status
- whether ACPX is actually enabled for your version/setup

## Preventing this next time

If you think you may roll back OpenClaw in the future:

- note which version introduced new plugin/runtime config
- back up `~/.openclaw/openclaw.json` before major upgrades
- keep a clean rollback checklist
- expect config cleanup when reverting across feature boundaries

Boring? Yes.
Helpful? Also yes.

## Final thought

`acpx plugin not found` after rollback usually means:

> your config remembers the future, but your binary moved back to the past.

Make them agree again, and the error normally goes away.

## Related pages to link later

- `How to enable the ACPX plugin in OpenClaw`
- `ACP vs normal OpenClaw agents: what’s the difference?`
- `OpenClaw not responding after an update? Start here`
- `Why ACPX isn’t showing up in OpenClaw`
