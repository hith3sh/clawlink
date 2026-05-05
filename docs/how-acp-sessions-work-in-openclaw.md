# How ACP Sessions Work in OpenClaw

*ACP sessions are one of those OpenClaw concepts that make sense once the pieces are in the right order. Until then, it mostly feels like the docs are assuming you already know what ACP means.*

If you are trying to use OpenClaw with external coding-style runtimes or ACP-backed agent flows, it helps to understand what an **ACP session** actually is.

Because a lot of setup confusion comes from this exact mistake:

> people think they are starting a normal OpenClaw chat, when they are really trying to use a different runtime path.

This page explains what ACP sessions are, how they differ from normal chats, what has to be enabled first, and why they sometimes seem to do nothing.

## Short version

An **ACP session** is a session where OpenClaw is using an **ACP-backed runtime path** instead of only behaving like the default model-driven assistant.

That usually means OpenClaw is:

- using ACP-related runtime support
- relying on ACPX or related runtime plumbing
- brokering work to an external agent/runtime path
- exposing tools or behaviors that depend on ACP support being available

So an ACP session is not just “a chat, but with better vibes.”

It is a different execution path.

## What happens in an ACP session

In plain English, the flow usually looks like this:

1. you ask OpenClaw to do something that belongs on an ACP-backed path
2. OpenClaw needs ACP support available in the current environment
3. ACPX or the relevant ACP runtime layer has to be enabled and loaded
4. OpenClaw starts or routes work through the ACP-backed session/runtime
5. the external runtime does the work
6. results come back into the OpenClaw conversation

That is the big picture.

## The mental model that helps

If normal OpenClaw usage is:

> “the assistant handles the request through its normal configured path”

then ACP session usage is closer to:

> “OpenClaw is acting as the coordinator for a different agent/runtime execution path.”

That is why ACP setup has extra moving parts.

## What an ACP session is not

It is **not** automatically created just because:

- you installed a coding CLI somewhere on the machine
- you saw ACP mentioned in a support thread
- you enabled a plugin and assumed every session became ACP-aware
- you are using OpenClaw normally and expected ACP behavior to appear by default

This is the source of a lot of confusion.

## ACP sessions vs normal OpenClaw chats

### Normal OpenClaw chat
Usually means:

- default assistant behavior
- configured model/provider path
- standard tool/runtime behavior for that environment
- no ACP-specific runtime required

### ACP session
Usually means:

- the requested workflow depends on ACP support
- ACPX or ACP runtime plumbing must be available
- OpenClaw may be coordinating work through an external runtime/backend
- the current environment has to expose the right ACP-related tools or session behavior

If you are just doing normal assistant tasks, you may never need ACP at all.

## What has to be true before ACP sessions work

## 1) ACP support has to be available in the install
This is the first gate.

If your current OpenClaw setup does not have ACP-related runtime support loaded, ACP sessions are not going to work because there is nothing there to route through.

## 2) ACPX may need to be allowed or enabled
If your setup uses a plugin allowlist, ACPX usually needs to be included.

A commonly referenced example is:

```bash
openclaw config set plugins.allow '["acpx"]' --strict-json
```

Then reload the gateway:

```bash
openclaw gateway restart
```

## 3) The gateway has to reload the new state
If ACPX was just enabled but the gateway never reloaded, OpenClaw can keep behaving like nothing changed.

## 4) The current chat may need to be replaced
This one gets people constantly.

If you enabled ACP support after the chat already started, the current session may still reflect the old tool/runtime catalog.

Start a **fresh chat** before concluding ACP is broken.

## Why ACP sessions sometimes look like they are not working

## Reason 1: ACPX is missing
If the ACPX plugin/runtime layer is not available, ACP-specific flows usually will not surface correctly.

## Reason 2: you are still in a stale session
The environment changed, but the current chat did not.

## Reason 3: you are expecting ACP behavior from a normal agent path
This is probably the biggest confusion point.

Installing a CLI or reading ACP docs does not mean every OpenClaw chat is now an ACP session.

## Reason 4: gateway config changed, but runtime did not reload
Also very common.

## Reason 5: the issue is really configuration, not ACP itself
Sometimes the problem is not the session model.
It is just:

- ACPX not allowed
- gateway not restarted
- version mismatch after upgrade or rollback
- current runtime not exposing the behavior you expected

## A practical ACP session checklist

If you think ACP sessions should work but they do not, use this order:

### 1. Confirm that the workflow actually depends on ACP
Not every OpenClaw task does.

### 2. Check whether ACPX is enabled or allowed
If needed, update the allowlist.

### 3. Restart the gateway
```bash
openclaw gateway restart
```

### 4. Check status
```bash
openclaw gateway status --json
```

### 5. Start a fresh chat
Do not keep retesting in the stale session forever.

### 6. Retry the ACP-specific workflow
Now you have a cleaner test.

## What users usually mean when they say “ACP session”

In practice, they usually mean one of these:

- “I want OpenClaw to use an external coding/runtime path”
- “I expected ACP-backed tools or behavior to appear”
- “I installed something ACP-related and do not know how OpenClaw is supposed to use it”
- “I am following a guide that depends on ACPX and I am not sure whether my session is actually ACP-backed”

That is why ACP session docs need to be more explicit than “it just works.”

## How to tell whether you are debugging the right thing

Ask yourself:

1. Am I trying to use a workflow that explicitly depends on ACP?
2. Did I enable ACPX only after this chat was already open?
3. Did I restart the gateway after changing config?
4. Am I mixing up normal agent behavior with ACP-backed behavior?

If those questions point to ACP, this page is the right place.

If not, your issue may be more basic than that.

## Common mistakes

### Treating every OpenClaw session as if it should be ACP-backed
It should not.

### Installing a CLI and assuming OpenClaw automatically adopts it
Still no.

### Forgetting the gateway reload step
A classic.

### Testing only in one old conversation
Also a classic.

## Final thought

ACP sessions in OpenClaw are easier to understand if you stop thinking of them as “special chats” and start thinking of them as **a different runtime path**.

Once that clicks, the setup logic becomes much clearer:

1. make ACP support available
2. enable ACPX if needed
3. restart gateway
4. start a fresh chat
5. run the ACP-specific workflow again

That is usually the difference between “nothing is happening” and “okay, now I see how this is supposed to work.”

## Related pages

- `ACP vs normal OpenClaw agents: what’s the difference?`
- `How to enable the ACPX plugin in OpenClaw`
- `Why ACPX isn’t showing up in OpenClaw`
- `How to fix “acpx plugin not found” after rolling back OpenClaw`
