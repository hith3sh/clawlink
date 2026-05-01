# ClawLink

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/hith3sh/clawlink/badge)](https://scorecard.dev/viewer/?uri=github.com/hith3sh/clawlink)
[![npm](https://img.shields.io/npm/v/%40useclawlink%2Fopenclaw-plugin?label=npm%20%40useclawlink%2Fopenclaw-plugin)](https://www.npmjs.com/package/@useclawlink/openclaw-plugin)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Install once. Connect with one click.**

ClawLink is an open-source integration platform that gives [OpenClaw](https://github.com/openclaw/openclaw) instant access to 100+ APIs — Gmail, Slack, Stripe, GitHub, Notion, and more.

- **Website:** [claw-link.dev](https://claw-link.dev)
- **Docs:** [docs.claw-link.dev](https://docs.claw-link.dev)
- **Verify:** [claw-link.dev/verify](https://claw-link.dev/verify)

<p align="left">
  <a href="https://x.com/clawlinkdev">X / Twitter</a> ·
  <a href="https://discord.gg/KjN3xcTvw4">Discord</a> ·
  <a href="https://www.linkedin.com/company/claw-link/">LinkedIn</a>
</p>

---

## Why ClawLink?

Managing OAuth apps, refreshing tokens, and storing API credentials securely is a pain — especially when you just want your AI agent to send an email or create a GitHub issue.

ClawLink handles the messy parts so you don't have to:

- **One-click OAuth** — connect Gmail, Slack, Notion, and dozens more without writing provider-specific auth code
- **Credentials stay in the cloud** — encrypted at rest, never touch your local machine
- **Request logs** — see every API call, success, failure, and latency from the dashboard
- **Built-in reliability** — rate limiting, retries, and edge caching included
- **Usage-based pricing** — generous free tier, pay only when you scale

## Get started in 30 seconds

1. **Install** the plugin in OpenClaw:
   ```bash
   openclaw plugins install @useclawlink/openclaw-plugin
   ```
2. **Pair** ClawLink with this OpenClaw device:
   - ask OpenClaw to set up ClawLink or start pairing
   - if the plugin was just installed and the tools are not visible yet, start a fresh chat and ask again
3. **Approve** the pairing prompt in your browser
4. **Connect** an integration in the ClawLink dashboard and start using it

Then just ask OpenClaw to do things:

- "Send an email to sarah@example.com"
- "Create a Slack message in #general"
- "Add a row to my Google Sheet"
- "Create a new GitHub issue"

## ClawLink vs Composio

| | **ClawLink** | **Composio** |
|---|---|---|
| **Built for** | OpenClaw users first | Multi-agent frameworks (LangChain, CrewAI, AutoGen, etc.) |
| **Experience** | Native plugin — install once, use everywhere in OpenClaw | Agent toolkit — wire actions into your agent code |
| **Auth** | Hosted OAuth — click "Connect Slack," we handle the rest | Bring-your-own OAuth or self-managed connections |
| **Where credentials live** | Encrypted on our edge — never on your machine | Agent-side or self-hosted infrastructure |
| **How you use it** | Chat naturally: "send an email to sarah" | Programmatic: define tools and call them in code |
| **Logs & debugging** | Dashboard with request history, latency, and errors | Developer-facing logging and tracing |
| **Best for** | Non-technical users who want integrations working in OpenClaw without code | Developers building custom agents across multiple frameworks |

**Bottom line:** If you use OpenClaw and want 100+ integrations to "just work" through chat, ClawLink is purpose-built for that. If you are writing Python agents across multiple frameworks, Composio is the broader toolkit.

## Supported integrations

| Category | Integrations |
|---|---|
| Communication | Gmail, Outlook, Slack, Discord, Microsoft Teams, Telegram |
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

> ClawLink is a **third-party** integration hub for OpenClaw — not affiliated with or endorsed by the OpenClaw project.

## Contributing

We welcome contributions — especially new integrations.

1. Fork the repo
2. Add your integration handler in `worker/integrations/`
3. Add the integration to `src/data/integrations.ts`
4. Open a pull request

Please read our [Contributing Guide](CONTRIBUTING.md) (if available) and ensure your changes pass the existing test suite.

## License

MIT

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hith3sh/clawlink&type=Date)](https://star-history.com/#hith3sh/clawlink&Date)
