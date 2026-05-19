# ClawLink Credits Billing

## Overview

Some integrations (starting with X/Twitter) have upstream per-call API costs that can't be absorbed into the flat subscription. These integrations use a **prepaid credits** model on top of the existing subscription.

## How it coexists with the subscription

- The $2.99/mo subscription remains unchanged for all "included" integrations (Gmail, Slack, Notion, etc.)
- Premium integrations require **both** an active subscription AND sufficient credit balance
- Credits are a shared pool — one balance works across all premium integrations

## User journey

1. User subscribes to ClawLink → unlocks all included integrations
2. User wants to connect Twitter → prompted to add credits before first use
3. Each Twitter tool call deducts credits from their balance
4. When balance is low/zero → friendly error with link to top up

## Credit packs

| Pack | Price | Credits | Bonus |
|------|-------|---------|-------|
| Starter | $5 | 500 | — |
| Standard | $10 | 1,100 | 10% |
| Power | $20 | 2,400 | 20% |

Base unit: 1 credit ≈ $0.01

## Integration config

Integrations declare their billing mode and cost table:

```typescript
twitter: {
  setupMode: "composio",
  billingMode: "credits",       // "included" (default) | "credits"
  creditCosts: {
    read: 1,                    // 1 credit per read
    write: 2,                   // 2 credits per write (e.g. tweet without URL)
    premium: 25,                // 25 credits for expensive ops (URL posts, archive search)
  },
}
```

Integrations without `billingMode: "credits"` work exactly as today — covered by the subscription.

## Per-tool cost overrides

Each tool already has a `mode` field (`read` / `write`). The executor maps:

```
tool.mode → integration.creditCosts[mode] → deduct from balance
```

For special cases (e.g. Twitter's URL-post surcharge), override at the tool level:

```typescript
{ name: "twitter_creation_of_a_post", creditCost: 2 }
{ name: "twitter_full_archive_search", creditCost: 25 }
```

If a tool doesn't declare its own `creditCost`, it falls back to the integration-level `creditCosts[mode]`.

## Execution flow

```
User calls a tool
  → Router resolves integration
  → Is billingMode === "credits"?
     No  → proceed (subscription covers it)
     Yes → resolve credit cost for this tool
          → check user balance >= cost
             No  → return { error: "Insufficient credits", topUpUrl: "/dashboard/credits" }
             Yes → deduct, execute, log
```

## Adding future premium integrations

To add any new pay-per-use integration:

1. Set `billingMode: "credits"` on the integration
2. Define `creditCosts: { read: X, write: Y }`
3. Deploy

No new tables, no new billing flows, no new UI needed.

## Implementation components

| Component | Description |
|-----------|-------------|
| DB migration | `user_credits` table (user_id, balance, updated_at) + `credit_transactions` ledger |
| Config types | `billingMode` + `creditCosts` fields on the `Integration` type |
| Executor gate | Credit check + deduction before premium tool execution |
| Top-up endpoint | Polar one-time checkout → webhook adds credits to balance |
| Dashboard UI | Credit balance display + "Add Credits" button on premium integration pages |

## Twitter (X) cost mapping

Based on X API pay-per-use pricing (as of May 2026):

| Operation | X API cost | ClawLink credits |
|-----------|-----------|-----------------|
| Read own data (bookmarks, followers, lists) | $0.001/resource | 1 |
| Read third-party posts | $0.005/resource | 1 |
| Read user/followers/following | $0.010/resource | 1 |
| Post tweet (no URL) | $0.015/request | 2 |
| Post with URL | $0.20/request | 25 |
| Send DM | $0.015/request | 2 |
| Block/mute | $0.015/request | 2 |
| Full archive search | $0.01+/resource | 25 |

## Limitations from X API (April 2026)

- Following accounts, liking posts, and quote-posting are Enterprise-only ($42k+/mo) — not available on pay-per-use. These tools should be removed from the manifest.
- 2 million post reads/month hard cap per developer app.
