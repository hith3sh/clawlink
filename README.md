# ClawLink

**One command. Every API. Zero config.**

ClawLink is an open-source platform that gives [OpenClaw](https://github.com/openclaw/openclaw) instant access to 40+ API integrations — Gmail, Slack, Stripe, GitHub, Notion, and more. Connect once from the dashboard, and every API call is proxied securely through our edge network.

**Website:** [claw-link.dev](https://claw-link.dev)

## How it works

```
OpenClaw (your machine)
    │
    │  MCP protocol
    ▼
ClawLink Edge (Cloudflare Workers — 300+ locations)
    ├── Authenticates you
    ├── Decrypts your credentials
    ├── Calls Gmail / Slack / Stripe / etc.
    ├── Logs the request
    └── Returns the result
```

1. **Sign up** at [claw-link.dev](https://claw-link.dev) and connect your integrations
2. **Copy** your personal MCP command
3. **Paste** it into OpenClaw — done

Then just ask OpenClaw things like:
- "Send an email to sarah@example.com"
- "Create a Slack message in #general"
- "Add a row to my Google Sheet"
- "Create a new GitHub issue"

## Why ClawLink proxies every call

- **OAuth handled for you** — click "Connect Gmail," we handle the entire OAuth dance. No tokens, no refresh logic.
- **Credentials never touch your machine** — encrypted at rest, decrypted only at execution time on the edge.
- **Request logs** — see every API call, success/failure, latency. Debug from the dashboard.
- **Rate limiting and retries** — built-in reliability so your agent doesn't get throttled.
- **Usage-based pricing** — free tier included, pay only when you scale.

## Supported integrations

| Category | Integrations |
|---|---|
| Communication | Gmail, Slack, Discord, Microsoft Teams, Telegram |
| CRM & Sales | Apollo, HubSpot, Salesforce, Pipedrive |
| Content & CMS | WordPress, Webflow, Ghost, Contentful |
| Social Media | YouTube, Twitter/X, LinkedIn, Instagram |
| Productivity | Google Sheets, Google Calendar, Google Drive, Notion, Airtable, Todoist |
| Developer Tools | GitHub, GitLab, Jira, Linear, Vercel |
| Payments & Finance | Stripe, PayPal, QuickBooks |
| Data & Analytics | Google Analytics, Mixpanel, Segment |
| Storage & Databases | AWS S3, Supabase, Firebase |
| E-commerce | Shopify, WooCommerce |
| AI & ML | OpenAI, Replicate, ElevenLabs |

## Architecture

```
claw-link.dev (Cloudflare)
│
├── /dashboard          Cloudflare Pages (Next.js)
│   ├── Auth            Clerk
│   ├── Connect integrations
│   ├── View request logs
│   └── Manage account
│
├── /api/mcp/*          Cloudflare Worker (MCP proxy)
│   ├── Durable Objects   Per-user MCP session state
│   ├── KV                Credential cache
│   └── Proxy             Third-party API calls
│
├── D1                  Database (users, integrations, logs)
└── Rate Limiting       Built-in Cloudflare
```

### Tech stack

| Layer | Technology |
|---|---|
| Frontend / Dashboard | Next.js on Cloudflare Pages |
| Auth | Clerk |
| API Proxy / MCP Server | Cloudflare Workers |
| Session State | Cloudflare Durable Objects |
| Database | Cloudflare D1 (SQLite at edge) |
| Credential Cache | Cloudflare Workers KV |
| Credential Encryption | AES-256-GCM |
| DNS + CDN | Cloudflare |

## Local development

```bash
# Clone the repo
git clone https://github.com/hith3sh/clawlink.git
cd clawlink

# Install dependencies
npm install

# Run the landing page
npm run dev

# Run the worker locally
npx wrangler dev
```

## Project structure

```
clawlink/
├── src/
│   ├── app/              # Next.js app router (dashboard + landing)
│   ├── components/       # React components
│   └── data/             # Integration definitions
├── worker/
│   ├── index.ts          # Cloudflare Worker entry (MCP proxy)
│   ├── integrations/     # Per-integration API handlers
│   ├── auth.ts           # Clerk JWT verification
│   ├── crypto.ts         # Credential encryption/decryption
│   └── logger.ts         # Request logging to D1
├── migrations/           # D1 database migrations
├── public/               # Static assets
├── wrangler.toml         # Cloudflare Worker config
└── package.json
```

## Roadmap

### v1 — MVP (current)
- [x] Landing page with integration search
- [ ] Cloudflare Worker + D1 setup
- [ ] Clerk auth + dashboard
- [ ] Connect integrations UI (API key input)
- [ ] MCP proxy server on Workers
- [ ] 10 integrations (Gmail, Slack, GitHub, Stripe, Notion, Google Sheets, WordPress, YouTube, Discord, HubSpot)
- [ ] Encrypted credential storage
- [ ] Request logging

### v2 — Growth
- [ ] OAuth flow support (Gmail, Google Sheets, Google Calendar, etc.)
- [ ] Token refresh handling
- [ ] 25+ integrations
- [ ] Error dashboard with alerts
- [ ] Usage analytics
- [ ] Free + paid tier billing (Stripe)

### v3 — Platform
- [ ] Plugin system for community integrations
- [ ] Integration marketplace
- [ ] Team accounts with role-based access
- [ ] Retry engine with circuit breakers
- [ ] Audit logs
- [ ] Webhook triggers ("when new email arrives, notify agent")
- [ ] Self-host option for enterprise

## Contributing

ClawLink is open source and contributions are welcome. To add a new integration:

1. Fork the repo
2. Add your integration handler in `worker/integrations/`
3. Add the integration to `src/data/integrations.ts`
4. Open a PR

## License

MIT
