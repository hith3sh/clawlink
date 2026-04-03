# Slack Integration

Learn how to connect Slack to OpenClaw using ClawLink.

## Getting Your Slack API Credentials

### Step 1: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App**
3. Choose "From scratch"
4. Select your workspace
5. Name your app (e.g., "ClawLink")

### Step 2: Enable Bot Token Scopes

1. Go to **OAuth & Permissions**
2. Add these scopes:
   - `chat:write`
   - `channels:read`
   - `channels:history`
   - `groups:read`
   - `users:read`
   - `incoming-webhook` (optional, for webhooks)

### Step 3: Install App to Workspace

1. Scroll to the top of **OAuth & Permissions**
2. Click **Install to Workspace**
3. Review and allow permissions

### Step 4: Get Your Bot Token

After installation, you'll see a **Bot User OAuth Token** starting with `xoxb-`

Copy this token - this is what you'll use with ClawLink!

## Required Scopes

| Scope | Description |
|-------|-------------|
| `chat:write` | Send messages |
| `channels:read` | List channels |
| `channels:history` | Read channel messages |
| `users:read` | List users |

## Connect to ClawLink

Run the setup command and enter your Slack Bot Token:
```
npx clawlink@latest init
```

That's it! You can now ask OpenClaw to send Slack messages!