# ClawLink Content Publishing Workflow

This is the operating system for publishing more issue-driven content fast enough to matter.

Goal: **publish consistently enough that ClawLink gets discovered by more OpenClaw users through search, docs browsing, community sharing, and exact-problem queries.**

This workflow is intentionally biased toward:

- real user problems
- search intent
- practical fixes
- fast iteration
- reusable templates
- compounding internal links

Not toward generic AI content sludge.

---

## Core strategy

We are publishing three content types in parallel:

### 1) Exact-problem troubleshooting posts
These come from real user pain.

Examples:
- `How to fix “Origin not allowed” in OpenClaw`
- `How to fix “acpx plugin not found” after rolling back OpenClaw`
- `Why exec tools may not appear on Windows or WSL1 in OpenClaw`

**Why these matter**
- easier to rank
- highly targeted
- useful immediately
- strong trust builders

### 2) Setup / integration guides
These capture users who know what they want to connect.

Examples:
- `How to connect OpenClaw to Gmail`
- `How to connect OpenClaw to Slack`
- `How to connect OpenClaw to Google Calendar`
- `How to connect OpenClaw to HubSpot`

**Why these matter**
- high commercial intent
- good conversion surface for ClawLink
- reusable in community replies and docs

### 3) Architecture / explanation posts
These reduce confusion that blocks adoption.

Examples:
- `ACP vs normal OpenClaw agents: what’s the difference?`
- `How ACP sessions work in OpenClaw`
- `Do I need ACP to use coding CLIs with OpenClaw?`

**Why these matter**
- reduces onboarding friction
- supports support volume reduction
- creates authoritative docs/blog content

---

## Content machine: weekly workflow

## Step 1 — Mine real problems
Primary sources:

- public Answer Overflow threads
- OpenClaw Discord/community questions
- repeated setup friction from docs/support
- ClawLink install/pairing pain points
- exact error messages users paste

### Output of this step
For each problem, capture:
- exact user phrasing
- issue category
- likely fix category
- target page type: blog / docs / FAQ
- internal links to add later

Store topic ideas in:
- `marketing/answeroverflow-content-backlog.md`
- or a future queue file if needed

## Step 2 — Score topics before writing
Every topic gets a simple score from 1–5 in each category:

- **Search intent** — would someone actually Google this?
- **Pain level** — is this blocking usage?
- **Conversion relevance** — does it naturally lead to ClawLink/OpenClaw setup?
- **Ease of writing** — can we publish this fast?
- **Specificity** — is this concrete, not vague?

### Prioritize topics that are:
- exact errors
- setup blockers
- integration connection guides
- recurring confusion topics

### Deprioritize topics that are:
- broad opinion pieces
- generic AI trend takes
- content with weak user intent
- fluffy “future of agents” nonsense

## Step 3 — Draft fast using templates
Use a repeatable structure so drafts happen quickly.

### Exact-problem troubleshooting template
1. What this error means
2. Why it happens
3. Step-by-step fix
4. How to verify the fix
5. Common mistakes
6. Related pages

### Integration/setup template
1. Why connect X to OpenClaw
2. What problem this solves
3. Step-by-step setup
4. Example prompts / use cases
5. Why use ClawLink instead of rolling your own
6. Security/trust note
7. CTA

### Architecture/explainer template
1. What this thing is
2. How it differs from similar things
3. When to use it
4. Common confusion points
5. Practical setup implications
6. Related troubleshooting pages

## Step 4 — Add conversion paths before publishing
Every page should link somewhere useful.

Each article should ideally include:

- 2–5 internal links to related docs/posts
- a clear path to ClawLink setup or verification
- one strong CTA near the end
- one soft CTA earlier if appropriate

### CTA examples
- install ClawLink
- verify the plugin
- connect Gmail / Slack / HubSpot
- read the setup docs
- troubleshoot related issues

## Step 5 — Publish in clusters, not randomly
Single articles are nice. Clusters are better.

### Example cluster: ACP / runtime confusion
- `How to enable the ACPX plugin in OpenClaw`
- `How to fix “acpx plugin not found” after rolling back OpenClaw`
- `ACP vs normal OpenClaw agents: what’s the difference?`
- `How ACP sessions work in OpenClaw`
- `How to connect Claude Code to OpenClaw`

### Example cluster: setup + integration
- `How to connect OpenClaw to Gmail`
- `How to connect OpenClaw to Google Calendar`
- `How to connect OpenClaw to HubSpot`
- `How to connect OpenClaw to Slack`
- `Build an OpenClaw sales assistant with Gmail + HubSpot`

Clusters create better internal linking and make the site feel intentional instead of random.

## Step 6 — Reuse every article as distribution fuel
Each published piece should also become:

- a Discord/community help answer
- a short X/Twitter post if desired
- a GitHub/docs reference link
- an internal support macro
- a follow-up link from related articles

One article should do multiple jobs.

---

## Publishing velocity target

Initial realistic target:

- **3 articles per week minimum**
- **5 articles per week ideal** while momentum is high

Suggested mix per week:

- 2 exact-problem posts
- 1 setup/integration guide
- optional 1 explainer/use-case page
- optional 1 FAQ/support-matrix page

That’s enough volume to matter without turning quality into soup.

---

## Publishing standards

Before an article goes live, check:

### SEO basics
- clear boring URL
- exact-problem or exact-intent title
- strong H1
- meta title/description if the site supports it
- no accidental `noindex`
- page is included in navigation or internal links somewhere

### Readability
- short sections
- no fake hype voice
- plain language
- practical commands/examples where useful
- easy scanning

### Conversion
- links to setup/docs
- links to related posts
- CTA exists
- article naturally points to ClawLink where relevant

### Credibility
- do not overclaim
- say when something depends on environment/version
- prefer exact commands/errors over vague theory

---

## Publishing roadmap

## Phase 1 — Immediate attention grabbers (next 7–10 days)
Publish the strongest exact-problem and setup pages first.

### Must-publish first
1. `How to fix “Origin not allowed” in OpenClaw`
2. `How to enable the ACPX plugin in OpenClaw`
3. `How to fix “acpx plugin not found” after rolling back OpenClaw`
4. `ACP vs normal OpenClaw agents: what’s the difference?`
5. `How to reduce token usage in OpenClaw`
6. `Why exec tools may not appear on Windows or WSL1 in OpenClaw`

### Strong support articles to pair with them
7. `How ACP sessions work in OpenClaw`
8. `How to connect Claude Code to OpenClaw`
9. `Why ACPX isn’t showing up in OpenClaw`
10. `OpenClaw not responding after an update? Start here`

### Goal of Phase 1
Capture exact pain searches and make the docs/blog look alive and helpful.

---

## Phase 2 — High-intent integration pages (next 2–3 weeks)
These are for users who already know what they want connected.

### Priority order
1. `How to connect OpenClaw to Gmail`
2. `How to connect OpenClaw to Google Calendar`
3. `How to connect OpenClaw to HubSpot`
4. `How to connect OpenClaw to Slack`
5. `How to connect OpenClaw to Airtable`
6. `How to connect OpenClaw to Notion`

### Then add workflow posts
7. `Build an OpenClaw sales assistant with Gmail + HubSpot`
8. `Use OpenClaw to triage email and schedule follow-ups`
9. `Best ClawLink integrations for OpenClaw users`
10. `How to turn OpenClaw into a lightweight ops assistant`

### Goal of Phase 2
Capture commercial/setup intent and convert readers into ClawLink/OpenClaw users.

---

## Phase 3 — Authority and support moat (weeks 3–6)
Build pages that make the site the answer hub.

### Candidate pages
- `OpenClaw exec capability support matrix`
- `OpenClaw plugin troubleshooting checklist`
- `OpenClaw setup mistakes that waste the most time`
- `Do I need ACP to use coding CLIs with OpenClaw?`
- `How device pairing works in OpenClaw`
- `Why your OpenClaw session is using so many tokens`

### Goal of Phase 3
Turn the docs/blog into a self-reinforcing support + discovery asset.

---

## Recommended backlog order right now

If we want attention fastest, I’d publish in this order:

1. `How to fix “Origin not allowed” in OpenClaw`
2. `How to enable the ACPX plugin in OpenClaw`
3. `How to fix “acpx plugin not found” after rolling back OpenClaw`
4. `ACP vs normal OpenClaw agents: what’s the difference?`
5. `How to reduce token usage in OpenClaw`
6. `Why exec tools may not appear on Windows or WSL1 in OpenClaw`
7. `How to connect OpenClaw to Gmail`
8. `How to connect OpenClaw to Google Calendar`
9. `How to connect OpenClaw to HubSpot`
10. `How to connect OpenClaw to Slack`
11. `How ACP sessions work in OpenClaw`
12. `OpenClaw not responding after an update? Start here`

That order is practical: first pain, then onboarding, then conversion.

---

## Editorial workflow by role

Even if one person is doing everything, think in stages.

### Stage A — Research
- mine threads
- capture exact wording
- choose topic
- assign page type

### Stage B — Draft
- use template
- write fast
- avoid over-polish on first pass

### Stage C — Enrich
- add internal links
- add CTA
- add screenshots/examples later if available
- align terminology with docs

### Stage D — Publish
- push to docs/blog
- verify live URL
- verify indexing basics

### Stage E — Distribute
- share in relevant communities when helpful
- reuse in support replies
- link from homepage/docs sections
- cross-link from future articles

---

## Metrics to watch

You do not need a giant analytics religion. Just watch the useful stuff.

Primary metrics:
- published articles per week
- organic clicks/impressions by article
- which exact-problem titles get traffic
- signups / installs / pairing starts from content
- which integration pages convert best

Secondary metrics:
- support questions answered by linking an article
- community engagement on shared posts
- time-to-publish per article

---

## What to do next, concretely

### This week
1. publish/refine the 3 drafted troubleshooting posts
2. draft the next 3 posts:
   - `ACP vs normal OpenClaw agents: what’s the difference?`
   - `How to reduce token usage in OpenClaw`
   - `Why exec tools may not appear on Windows or WSL1 in OpenClaw`
3. add internal links between all 6
4. publish `How to connect OpenClaw to Google Calendar`
5. publish `How to connect OpenClaw to HubSpot`

### Next week
1. publish Slack + Airtable + Notion connection guides
2. publish one workflow post
3. add a support-matrix or troubleshooting hub page
4. start measuring which titles get impressions first

---

## Blunt opinion

If the goal is attention, the winning move is not “write more content” in the abstract.

It is:

- publish **specific pages for problems users already have**
- publish **specific pages for integrations they already want**
- interlink them hard
- keep shipping every week

That’s the compounding part.

Not vibes. Pages.
