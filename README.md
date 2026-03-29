# ClawLink

**One command. Every API. Zero config.**

ClawLink is an open-source MCP server that gives [OpenClaw](https://github.com/openclaw/openclaw) instant access to 40+ API integrations — Gmail, Slack, Stripe, GitHub, Notion, and more. No boilerplate, no config files, no OAuth headaches.

```bash
npx clawlink@latest init
```

That's it. Paste that into OpenClaw and start using any integration.

## How it works

1. Run `npx clawlink@latest init`
2. Pick your integrations and paste your API keys when prompted
3. ClawLink spins up a local MCP server that OpenClaw connects to automatically

Then just ask OpenClaw things like:
- "Send an email to sarah@example.com"
- "Create a Slack message in #general"
- "Add a row to my Google Sheet"
- "Create a new GitHub issue"

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

## Local development

```bash
# Clone the repo
git clone https://github.com/hith3sh/clawlink.git
cd clawlink

# Install dependencies
npm install

# Run the dev server (landing page)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Project structure

```
clawlink/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components (hero, search, FAQ, etc.)
│   └── data/             # Integration definitions
├── public/               # Static assets (logos, icons)
└── package.json
```

## Roadmap

### v1 — MVP (current)
- [x] Landing page with integration search
- [ ] CLI tool (`npx clawlink@latest init`)
- [ ] MCP server with config store
- [ ] 10 integrations using API keys (Gmail, Slack, GitHub, Stripe, Notion, Google Sheets, WordPress, YouTube, Discord, HubSpot)
- [ ] Local encrypted credential storage

### v2 — Usable product
- [ ] OAuth flow support (Gmail, Google Sheets, Google Calendar, etc.)
- [ ] Token refresh handling
- [ ] 25+ integrations
- [ ] Request logging and error dashboard
- [ ] Cloud deploy option via claw-link.dev

### v3 — Platform
- [ ] Plugin system for community integrations
- [ ] Integration marketplace
- [ ] Team/multi-user configs with access controls
- [ ] Rate limiting, retries, and reliability layer
- [ ] Audit logs
- [ ] Usage analytics dashboard

## Contributing

ClawLink is open source and contributions are welcome. To add a new integration:

1. Fork the repo
2. Add your integration file in `src/tools/`
3. Register it in the integration data
4. Open a PR

## License

MIT
