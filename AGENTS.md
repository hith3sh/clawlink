<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Product Context

ClawLink is a SaaS for OpenClaw users who want to skip the hassle of manually wiring integrations.

Core product direction:

- Make integration setup dramatically easier than manual provider setup inside OpenClaw.
- The product should feel simple enough that even a non-technical user can understand it quickly.
- Favor clear language, obvious actions, minimal steps, and low-friction connection flows.
- Hosted setup, OAuth, and connection-session UX should be optimized for simplicity over flexibility.
- Avoid exposing unnecessary staging, base URL, or developer-only setup concepts in normal user flows.

Target user experience:

- Install the OpenClaw plugin once.
- Connect apps with as few steps as possible.
- Use hosted flows, dialogs, popups, and guided copy to reduce confusion.
- Prefer UX patterns that keep the user oriented while waiting for OAuth/session completion.
- Future product education will include short videos and simple onboarding content.

Business context:

- Users get their first integration free.
- After the first integration, the user should be prompted toward a paid subscription.
- Current pricing direction is roughly `$5/month` for integrations access.
- Monetization and upgrade prompts should be implemented in a way that feels lightweight and understandable.

Roadmap context:

- The near-term goal is to support at least 40 integrations.
- Future agents should favor reusable connection architecture that scales across many providers.
- OpenClaw compatibility is a primary focus.
- ClawLink should help users attach useful external skills/services to OpenClaw so they can do real work.

Agent guidance:

- When making product or UX decisions, prioritize simplicity, clarity, and fewer user steps.
- When in doubt, choose the flow that is easier for non-technical users to understand.
- Keep developer-oriented escape hatches out of primary UX unless the user explicitly asks for them.

# OpenClaw Plugin Release Workflow

This repo contains a publish workflow for the npm package `@useclawlink/openclaw-plugin` at:

- `.github/workflows/publish-openclaw-plugin.yml`

Rules for agents:

- Do not suggest or implement npm publish on every commit or push. npm package versions are immutable, so repeated publishes require a new version each time.
- The supported release flow is tag-based publishing through GitHub Actions.
- When changing the OpenClaw plugin package in `packages/openclaw-clawlink`, keep these versions in sync:
  - `packages/openclaw-clawlink/package.json`
  - `packages/openclaw-clawlink/openclaw.plugin.json`
- The publish tag format is:
  - `openclaw-plugin-v<version>`
  - example: `openclaw-plugin-v0.1.2`
- Before telling the user to publish, prefer this sequence:
  1. bump both plugin version files
  2. commit and push to `main`
  3. create and push the matching git tag
- The workflow is designed for npm Trusted Publishing with GitHub Actions. Prefer that over long-lived npm tokens.
- If the user asks how to release the plugin, point them to the workflow above and the tag-based release flow.
