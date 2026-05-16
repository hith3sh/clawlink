# ClawLink Blog

A minimal, reading-focused blog powered by Notion as CMS. Deployed as a Cloudflare Worker at `blog.claw-link.dev`.

## How it works

1. You write posts in a **Notion database**
2. Set the post status to "Published"
3. The blog fetches and renders it automatically (revalidates every 60s)

No redeploy needed for new posts.

## Notion Database Setup

Create a Notion database with these properties:

| Property | Type | Purpose |
|----------|------|---------|
| **Title** (or Name) | Title | Post title |
| **Slug** | Rich text | URL slug (e.g. `my-first-post`) |
| **Description** | Rich text | Short summary shown on index |
| **Status** | Select | Must be "Published" to appear |
| **Published** | Date | Publish date |
| **Tags** | Multi-select | Post categories |
| **Author** | Rich text | Author name |
| **Cover** | Page cover | Cover image (set via Notion's page cover) |

## Setup

1. Create a Notion integration at https://www.notion.so/my-integrations
2. Share your blog database with the integration
3. Copy `.env.example` to `.env.local` and fill in the values
4. Run `npm install && npm run dev`

## Deploy

```bash
npm run deploy
```

This builds with OpenNext and deploys to Cloudflare Workers.

## Local dev

```bash
npm run dev
# Opens at http://localhost:3001
```
