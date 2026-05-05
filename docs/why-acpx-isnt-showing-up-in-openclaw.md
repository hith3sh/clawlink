# Why ACPX Isn’t Showing Up in OpenClaw

*If ACPX is missing, the fix is usually not exotic. It is usually a boring little chain of cause and effect that got interrupted somewhere.*

If you expected **ACPX** to show up in OpenClaw and it does not, the most likely causes are:

- ACPX is not allowed by the current plugin config
- the gateway has not been restarted since config changed
- the current chat started before ACPX became available
- you are mixing up normal OpenClaw agent behavior with ACP-backed behavior
- the version you are running does not match the config you kept

This page is the short, practical version of how to check those in the right order.

## What “ACPX isn’t showing up” usually means

People usually say this when one of the following is true:

- ACP-related tools do not appear
- a guide says ACPX should exist, but the current session cannot use it
- ACP-backed session behavior is missing
- OpenClaw appears to ignore ACP-specific setup work

In other words, users are usually not asking whether the letters A-C-P-X exist.

They are asking why the ACP runtime path does not seem available.

## First: make sure you actually need ACPX
This matters more than it sounds.

If you are using OpenClaw as a normal assistant and not trying to run ACP-backed workflows, ACPX may not be relevant to what you are doing.

ACPX matters when you are trying to use:

- ACP-backed sessions
- external coding/runtime agent paths
- workflows that explicitly depend on ACP support

If your workflow does not depend on ACP, you may be debugging the wrong thing.

## The most common reasons ACPX does not appear

## 1) ACPX is not in the plugin allowlist
If your config uses `plugins.allow`, ACPX has to be included.

A commonly referenced example is:

```bash
openclaw config set plugins.allow '["acpx"]' --strict-json
```

If ACPX is not allowed, OpenClaw may never expose it.

## 2) The gateway was not restarted
After changing plugin config, reload the gateway:

```bash
openclaw gateway restart
```

If you skip that step, you may just be staring at old runtime state.

## 3) You are testing in a stale chat
This one causes a lot of fake failures.

Even if ACPX is enabled correctly, a chat that started before the change may still have the old tool/runtime catalog.

So after enabling ACPX:

- start a fresh chat
- test there

## 4) You are expecting ACP behavior from a normal agent path
This is probably the biggest source of confusion.

Installing a coding CLI or reading ACP docs does **not** mean every OpenClaw chat is now ACP-backed.

If the workflow is not actually using the ACP path, ACPX may feel absent even when the deeper issue is just expectation mismatch.

## 5) You rolled back or changed versions
If a newer version wrote ACPX-related config and an older version is now running, you can get version/config mismatch behavior.

That can make ACPX appear missing when the real problem is compatibility.

If that happened recently, inspect:

```text
~/.openclaw/openclaw.json
```

## Fast troubleshooting checklist

Use this order.

### 1. Confirm the workflow really depends on ACPX
If not, stop here and debug the actual workflow instead.

### 2. Check the allowlist
If you use one, make sure ACPX is included.

### 3. Restart the gateway
```bash
openclaw gateway restart
```

### 4. Check gateway status
```bash
openclaw gateway status --json
```

You are looking for signs that:

- config validation passed
- the gateway is healthy
- ACPX is not blocked by config

### 5. Start a fresh chat
This is not optional if you just changed plugin/runtime state.

### 6. Retry the ACP-specific task
Now you have a cleaner test.

## How to think about the problem correctly

The easiest useful mental model is:

- **normal chat behavior** does not automatically prove ACPX is loaded
- **missing ACP behavior** does not automatically mean ACPX is broken
- **plugin state + gateway state + session freshness** usually explain the gap

That is why random trial-and-error is less useful than the boring checklist above.

## When the problem is probably configuration
It is probably config-related if:

- ACPX used to appear and suddenly stopped
- you changed plugin config recently
- the gateway was never restarted
- the current chat started before the config change
- the issue appeared after upgrade or rollback

## When the problem is probably expectation mismatch
It is probably expectation mismatch if:

- you installed a CLI and thought ACPX would automatically surface
- you are following ACP-oriented docs for a normal assistant workflow
- you are not actually using an ACP-dependent path

## Common mistakes

### Enabling ACPX and staying in the same old chat
Very common.

### Changing config without restarting the gateway
Also very common.

### Confusing ACPX with normal assistant functionality
Probably the biggest one.

### Assuming “plugin missing” and “plugin not allowed” are the same problem
They are not.

## Final thought

When ACPX is not showing up in OpenClaw, the fix is usually:

1. confirm you actually need ACPX
2. allow it if needed
3. restart the gateway
4. check status
5. start a fresh chat
6. retry the ACP-specific workflow

That is not glamorous, but it is how a lot of these issues actually get resolved.

## Related pages

- `How to enable the ACPX plugin in OpenClaw`
- `How ACP sessions work in OpenClaw`
- `ACP vs normal OpenClaw agents: what’s the difference?`
- `How to fix “acpx plugin not found” after rolling back OpenClaw`
