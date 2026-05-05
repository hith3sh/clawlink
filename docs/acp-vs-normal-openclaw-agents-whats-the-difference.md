# ACP vs Normal OpenClaw Agents: What’s the Difference?

*This is one of those confusing OpenClaw topics where the words sound similar enough to blur together, and then you lose an hour wondering why the thing you installed is not behaving like the thing you expected.*

If you are confused about the difference between **ACP-backed flows** and **normal OpenClaw agents**, you are not being dumb.

This is a real point of confusion.

And it matters, because it affects:

- how sessions run
- what tools are available
- whether external coding CLIs can be used
- what setup steps are required
- why something works in one mode but not another

So here’s the clean version.

## Short answer

**Normal OpenClaw agents** are the standard assistant/runtime path using the configured model/provider setup inside OpenClaw.

**ACP-backed flows** are for cases where OpenClaw is talking to an external ACP-style runtime or coding-agent backend instead of just behaving like a normal built-in model-driven agent.

That’s the core split.

If you remember nothing else, remember this:

> normal agents are the default assistant path
> ACP is for external agent/runtime integration paths

## What a normal OpenClaw agent is

A normal OpenClaw agent is the standard thing most users interact with.

It usually means:

- OpenClaw is using its configured model/provider setup
- the agent responds in the usual chat flow
- tool availability depends on the active runtime and config
- no ACP bridge is required just to have a normal assistant

For many users, this is enough.

If your goal is:

- chat with the assistant
- use standard tools
- do normal support/research/productivity tasks

…then you may not need ACP at all.

## What ACP is for

ACP matters when you want OpenClaw to work with **external agent runtimes or coding-style backends**.

That can include flows where OpenClaw needs to:

- start ACP-backed sessions
- connect to coding-agent style runtimes
- use an external CLI/agent harness through the ACP path
- manage workflows that depend on the ACP runtime layer rather than the default model-only assistant path

So ACP is not “the normal assistant, but fancier.”

It is more like:

- a bridge
- a runtime path
- an integration layer for a different class of agent execution

## Why people get confused

There are a few recurring reasons.

### 1. They assume installing a CLI means OpenClaw now uses ACP automatically
Nope.

Having a coding CLI on the machine is not the same thing as OpenClaw being configured to use ACP-backed flows.

### 2. They assume ACP is required for everything agent-related
Also no.

A normal OpenClaw assistant can work perfectly fine without ACP if you are not trying to use ACP-specific workflows.

### 3. They see ACPX mentioned in docs or support threads and think it applies to every setup
It doesn’t.

Some docs/issues are specifically about ACP-enabled setups, not every possible OpenClaw installation.

### 4. They expect current chat sessions to update magically after enabling ACPX
That is also a classic.

Even if ACPX is correctly enabled, the current chat may still reflect an older tool/runtime state until you start a fresh one.

## When you probably need ACP

You probably need ACP if you are trying to do things like:

- run ACP-backed sessions
- connect OpenClaw to an external coding-agent runtime
- use thread/session workflows that explicitly depend on ACP runtime support
- follow a setup guide that specifically references ACPX or ACP harness behavior

## When you probably do not need ACP

You probably do **not** need ACP if your goal is just:

- standard OpenClaw assistant usage
- normal tool use
- general chat, summarization, drafting, or research
- ordinary plugin use that does not depend on ACP runtime integration

## Where ACPX fits in

ACPX is the plugin/runtime piece that exposes or supports ACP-related behavior inside OpenClaw.

So when people talk about:

- enabling ACPX
- ACPX not showing up
- `acpx plugin not found`

…they are talking about the ACP integration layer, not the basic existence of a normal assistant.

That’s an important distinction.

## Practical difference in setup

### Normal OpenClaw agent setup usually looks like:
- install/configure OpenClaw
- choose model/provider settings
- use the assistant normally

### ACP-backed setup usually looks more like:
- ensure ACPX/plugin/runtime support is available
- allow or enable ACPX if needed
- restart gateway after config changes
- start a fresh chat/session
- use the ACP-specific flow or runtime path you actually intended

That extra setup is why ACP confusion causes friction.

## A simple mental model

Use this mental shortcut:

### Normal agents
“OpenClaw is acting like OpenClaw.”

### ACP-backed agents
“OpenClaw is brokering work to an ACP-style external runtime path.”

Not perfect, but useful.

## Common failure modes caused by mixing them up

### Expecting ACP behavior from a normal agent
You wait for tools, session behavior, or runtime features that were never enabled.

### Enabling ACPX when the workflow did not require it
Now you are debugging complexity you didn’t need.

### Following ACP docs for a normal setup
Easy way to confuse yourself.

### Thinking a CLI install equals ACP runtime integration
Still no.

## How to tell which path your issue belongs to

Ask these questions:

1. Am I just using the normal assistant?
2. Am I trying to use an external coding/runtime agent backend?
3. Does the guide/workflow explicitly mention ACP or ACPX?
4. Is the problem about plugin/runtime enablement rather than normal assistant behavior?

If 2–4 are yes, you are probably in ACP territory.

If not, you may be overcomplicating it.

## Related problems you might actually be hitting

If this page sounds close but not exact, your real issue may be one of these:

- `How to enable the ACPX plugin in OpenClaw`
- `How to fix “acpx plugin not found” after rolling back OpenClaw`
- `Why ACPX isn’t showing up in OpenClaw`
- `How ACP sessions work in OpenClaw`
- `How to connect Claude Code to OpenClaw`

## Final thought

Most ACP confusion comes from treating all “agents” as one bucket.

They’re not.

**Normal OpenClaw agents** are the default assistant path.
**ACP-backed flows** are the external runtime/integration path.

Once you separate those in your head, a lot of OpenClaw docs suddenly stop feeling like they were written by a sleep-deprived wizard.
