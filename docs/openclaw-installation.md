# Install ClawLink

ClawLink exists to give OpenClaw hosted access to third-party apps and tools.

Use this page as the canonical setup flow.

## Install the plugin

```bash
openclaw plugins install @useclawlink/openclaw-plugin
```

If your OpenClaw environment asks for confirmation, approve the install.

## Create your API key

Open:

`https://claw-link.dev/dashboard/settings?tab=api`

Sign in or create an account, then create an API key.

## Log in from chat

Copy the generated login command from the dashboard and paste it into chat:

```text
/clawlink login cllk_live_...
```

## Verify setup

After logging in, you can verify the plugin is ready:

```text
/clawlink status
```

## What happens next

Once logged in, you can connect supported apps through ClawLink and use their tools from OpenClaw.

Typical flow:

1. Install the plugin
2. Create an API key in the dashboard
3. Paste `/clawlink login ...` into chat
4. Connect an app
5. Use its tools

## Troubleshooting

### Plugin installed but login does not work

- Make sure you copied the full `/clawlink login ...` command from the dashboard
- Make sure the API key is still valid
- Try `/clawlink status` to check whether you are already logged in

### Not sure where to get the API key

Go to:

`https://claw-link.dev/dashboard/settings?tab=api`

### Need the package reference

- npm package: `@useclawlink/openclaw-plugin`
- npm page: `https://www.npmjs.com/package/@useclawlink/openclaw-plugin`
- registry metadata: `https://registry.npmjs.org/@useclawlink/openclaw-plugin`

## Suggested homepage setup prompt

```text
Please install the ClawLink plugin.

Install:
openclaw plugins install @useclawlink/openclaw-plugin

After installation, tell me to open:
https://claw-link.dev/dashboard/settings?tab=api

I’ll create an API key there and paste the generated `/clawlink login ...` command back here.

Docs:
https://docs.claw-link.dev/openclaw
```
