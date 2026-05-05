# How to Reduce Token Usage in OpenClaw

*If OpenClaw is chewing through tokens like a raccoon in a garbage bin, the fix usually isn’t one magical switch. It’s a few boring habits that stop context bloat, repeated work, and oversized prompts from quietly lighting money on fire.*

If you are trying to reduce token usage in OpenClaw, there are really two goals:

1. make runs cheaper
2. keep the assistant useful while doing it

Because “save tokens” by making the assistant useless is not exactly a win.

This guide covers the practical ways to cut waste without wrecking the experience.

## Why token usage gets high

Token burn usually comes from one or more of these:

- long chat history
- repeated context being re-sent every turn
- giant pasted logs or files
- overlong system/project context
- tool-heavy loops that keep adding transcript weight
- using a more expensive model than the task needs
- asking one conversation to carry too many unrelated jobs

In other words, it is often a **context discipline** problem more than a model problem.

## Biggest ways to reduce token usage

## 1) Start fresh chats more often
This is the most boring advice, and also one of the most effective.

If a conversation has grown huge and the current task is basically unrelated to the old one, start a fresh chat.

Why it helps:

- less old context gets dragged forward
- less transcript baggage
- fewer irrelevant turns in the model window

If you keep one chat alive forever, you are basically paying rent for ancient history.

## 2) Split unrelated work into separate sessions
Do not use one monster chat for:

- debugging
- writing docs
- planning marketing
- shell troubleshooting
- product ideation

That is how context turns into soup.

Separate sessions keep prompts smaller and the assistant more accurate.

## 3) Stop pasting giant blobs unless they matter
If you paste:

- huge logs
- full config dumps
- giant stack traces
- entire source files

…when only 10 lines matter, you are feeding the furnace for no reason.

Prefer:

- the exact error
- the relevant snippet
- the command output around the failure
- the minimal file section needed

## 4) Use targeted file reads instead of dumping everything into chat
If the environment supports tool-based reads, use those instead of pasting giant files manually.

That keeps the working context tighter and easier to reason over.

## 5) Use cheaper/faster models for routine work
Not every task needs the fanciest brain in the building.

Use lighter models for:

- formatting
- simple summaries
- list cleanup
- repetitive transformation work
- low-risk drafting

Reserve heavier models for:

- architecture
- tricky debugging
- ambiguous reasoning
- high-value writing where quality matters

## 6) Keep project/reference context lean
Sometimes token burn is coming from the environment itself:

- giant always-loaded instructions
- bloated project docs
- duplicated memory/context files
- oversized startup context

You do want enough context to be useful.
You do **not** want every session dragging a novel behind it.

## 7) Avoid repeated re-explaining inside the same thread
If the assistant already knows the local objective in the current session, avoid re-pasting the whole backstory every few messages unless the context genuinely changed.

## 8) Summarize long work before continuing
If a thread became long but you still need continuity, make or use a summary instead of carrying every raw turn forever.

A good compact summary beats endless transcript drag.

## 9) Be careful with tool loops
Tool use is useful, but repeated loops can quietly inflate the transcript.

Common examples:

- checking status too often
- re-reading the same files repeatedly
- repeated retries with long outputs
- verbose command output copied back into context again and again

Use fewer, more targeted actions where possible.

## 10) Keep prompts specific
A vague request often creates more back-and-forth than a specific one.

Compare:

### vague
“help with this project”

### better
“draft a troubleshooting article for the error `Origin not allowed` in OpenClaw, keep it practical and SEO-friendly”

More specific input often means fewer turns and fewer tokens overall.

## Practical habits that save tokens fast

## Good habit: fresh thread per major task
One chat for docs. One for debugging. One for marketing.

## Good habit: only include relevant snippets
Do not send 500 lines when 20 lines prove the point.

## Good habit: use summaries when handing off or resuming
A compact state summary is much cheaper than raw history.

## Good habit: pick the right model for the job
Do not use a sledgehammer to crack a peanut.

## Good habit: stop retrying blindly
If something failed three times the same way, new information matters more than more repetition.

## Common mistakes

### Keeping one immortal chat forever
Comforting. Expensive.

### Treating every task like it needs the full backstory
Usually false.

### Pasting giant files instead of relevant excerpts
Classic token bonfire.

### Using premium reasoning for routine cleanup work
Overkill.

### Repeating tool calls with nearly identical output
Also expensive.

## If you are debugging unusually high usage
Check these first:

- is the thread too long?
- are there giant tool outputs in history?
- is startup/project context oversized?
- are unrelated tasks mixed together?
- is the selected model heavier than needed?

Usually one of those is the real culprit.

## A simple low-waste workflow

If you want a sane default approach:

1. start a fresh chat for each major task
2. include only the minimum necessary context
3. use targeted reads/snippets
4. summarize before long handoffs
5. switch to lighter models for routine work

That alone cuts a lot of waste.

## Final thought

Reducing token usage in OpenClaw is usually not about becoming weirdly stingy.

It is about removing junk context, splitting work cleanly, and not paying the model to repeatedly remember things that no longer matter.

Which, honestly, is a decent life lesson too.

## Related pages to link later

- `Why exec tools may not appear on Windows or WSL1 in OpenClaw`
- `ACP vs normal OpenClaw agents: what’s the difference?`
- `OpenClaw not responding after an update? Start here`
- `How to enable the ACPX plugin in OpenClaw`
