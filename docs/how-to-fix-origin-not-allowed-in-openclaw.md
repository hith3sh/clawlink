# How to Fix “Origin not allowed” in OpenClaw

*This is one of those errors that sounds vague, but usually means something pretty specific: the UI, plugin, proxy, or remote client is reaching OpenClaw from a web origin your setup is not willing to trust.*

If you hit an **`Origin not allowed`** error in OpenClaw, the short version is:

- the request is coming from a browser/app/webview origin
- OpenClaw or a related service is checking whether that origin is allowed
- your current hostname, port, tunnel, proxy URL, or app URL does not match what the server expects

Annoying, yes. Usually fixable, also yes.

This guide walks through the common causes, how to verify them, and how to fix the problem without blindly punching holes in your config.

## What “Origin not allowed” usually means

Browsers send an **Origin** header for many cross-origin requests.

That header helps a server decide whether it should accept the request from a specific site or app.

So when OpenClaw or a service in front of it says **`Origin not allowed`**, it typically means one of these is true:

- you opened the app from a different URL than the backend expects
- a reverse proxy is rewriting or mismatching the public URL
- a local dev port changed
- a mobile/web companion is using a different origin than your config allows
- a plugin or integration callback is landing on the wrong host
- a stale environment variable or deployment setting still points at an old domain

## Common situations that trigger it

### 1. You changed domains, tunnels, or ports
Classic example:

- yesterday you used `http://localhost:3000`
- today you opened the UI through a tunnel, VPS domain, or different local port
- backend still expects the old origin

### 2. A reverse proxy is in front of OpenClaw
If Nginx, Caddy, Cloudflare, or another proxy is involved, the public URL users see may not match the backend’s expected origin settings.

### 3. You have mixed local and remote URLs
For example:

- frontend is loaded from one hostname
- API/gateway is configured for another
- plugin callback or companion app points somewhere else entirely

That split is exactly where origin validation starts getting grumpy.

### 4. A plugin or connection flow is returning to the wrong host
This can happen during browser-based pairing or integration setup if the public callback/base URL is out of date.

## First: don’t “fix” this by disabling checks blindly
The worst response is usually:

> “Cool, I’ll just disable origin protection.”

Bad instinct.

If origin checks exist, they exist for a reason. The right fix is almost always to make your **public URL and configured URL agree**, not to make security lazier.

## Step-by-step checklist

## 1) Confirm the exact URL you are opening
Write down the exact origin in the browser.

That means the full:

- protocol (`http` or `https`)
- hostname
- port if present

Examples:

- `http://localhost:3000`
- `https://openclaw.example.com`
- `https://abc123.ngrok-free.app`

Even a port mismatch can matter.

## 2) Check whether your deployment recently changed
Ask yourself:

- did I move from localhost to a tunnel?
- did I switch to a new domain?
- did I add Cloudflare / Nginx / Caddy?
- did I change a plugin/public URL setting?
- did I update the app and keep old config around?

If the answer is yes to any of those, that’s probably the scent trail.

## 3) Check OpenClaw status first
Run:

```bash
openclaw status
```

If you’re specifically working with the gateway or suspect plugin/runtime config issues, also inspect gateway status:

```bash
openclaw gateway status
```

If JSON output is available in your environment and you want more detail:

```bash
openclaw gateway status --json
```

You’re looking for clues around:

- configured public/base URLs
- plugin state
- gateway health
- paired node/device state

## 4) Verify your public URL / callback-related config
This part depends on your setup, but the rule is simple:

**the browser origin, the public URL, and any callback/base URL settings need to agree**.

Places to inspect:

- OpenClaw config
- gateway config
- reverse proxy config
- companion/node pairing config
- plugin public URL settings
- environment variables in your deployment

If you recently changed domains, search your config for the old hostname.

That old hostname tends to linger like a curse.

## 5) If you use a reverse proxy, confirm forwarded host/proto are sane
A proxy should forward the real public request context correctly.

Typical things to verify:

- original host is preserved
- HTTPS termination is handled consistently
- forwarded protocol headers are correct
- backend is not constructing callbacks with an internal-only host

If the browser sees `https://your-domain.com` but the backend thinks the request came from `http://localhost:xxxx`, you’ve found the mismatch.

## 6) If this happens during plugin pairing or integration setup, verify the plugin/app public URL
This matters a lot for browser-based approval flows.

If the user starts at one domain but the callback returns through another, origin validation can fail.

That means you should verify:

- the app’s configured public URL
- the callback/redirect URL registered for the integration
- any environment variables controlling the external host

## 7) Clear stale browser state if config was just fixed
After fixing config:

- hard refresh the page
- retry in an incognito window
- if applicable, log out and restart the pairing/setup flow

Sometimes the config is fixed but the browser is still replaying stale session state.

## Practical examples

## Scenario A: localhost port changed
You were using:

- `http://localhost:3000`

Now you’re on:

- `http://localhost:3001`

If your backend or app config still expects `3000`, you can get `Origin not allowed`.

## Scenario B: tunnel/domain changed
You used an old tunnel or temp URL yesterday.

Today you opened a new one.

But your app still has callback/public URL settings for the old domain.

Result: origin mismatch.

## Scenario C: reverse proxy mismatch
Public site:

- `https://openclaw.example.com`

Backend thinks request origin is:

- `http://127.0.0.1:xxxx`

That is exactly the kind of thing that causes this error.

## What to fix, concretely

Depending on your setup, the fix usually looks like one of these:

- update the configured public/base URL to match the actual domain
- update callback/redirect URLs for plugin or integration flows
- fix reverse proxy host/proto forwarding
- remove stale localhost/dev URLs from config
- restart the OpenClaw gateway after config changes
- restart the browser-based pairing/setup flow after the URL mismatch is fixed

If you changed config, reload the relevant service cleanly:

```bash
openclaw gateway restart
```

Then retry from the real public URL you intend to use.

## How to verify the fix

You know it’s fixed when:

- the same action no longer returns `Origin not allowed`
- browser-based setup/pairing completes normally
- requests from your intended domain succeed consistently
- status checks no longer suggest stale URL/config mismatch issues

## Common mistakes

### Disabling protection instead of fixing the URL mismatch
Fast, dumb, risky.

### Forgetting the port
`localhost:3000` and `localhost:3001` are different origins.

### Fixing the frontend URL but not the backend callback URL
Half-fix. Still broken.

### Updating config but not restarting the relevant service
Also a classic.

## If you want a fast troubleshooting flow
Use this order:

1. confirm the exact browser origin
2. run `openclaw status`
3. run `openclaw gateway status`
4. compare actual public URL vs configured URL/callbacks
5. check reverse proxy forwarding if applicable
6. restart gateway
7. retry in a fresh browser session

## Final thought

`Origin not allowed` usually isn’t random.

It’s OpenClaw telling you:

> “The URL you’re using and the URL I trust are not the same story.”

Make those two stories match, and the error usually disappears.

## Related troubleshooting ideas

If you’re building out a support/SEO hub, this page should eventually link to:

- OpenClaw installation/setup docs
- reverse proxy deployment guidance
- plugin pairing/setup docs
- device pairing / node connection troubleshooting
- specific integration callback troubleshooting pages
