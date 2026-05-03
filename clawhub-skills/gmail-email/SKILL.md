---
name: gmail-email
description: Search Gmail messages, read threads, manage drafts and labels, and send or reply to email — powered by ClawLink.
---

# Gmail via ClawLink

Work with Gmail from chat — search messages, read threads, manage drafts and labels, and send or reply to email.

Powered by [ClawLink](https://claw-link.dev), an integration hub for OpenClaw that handles hosted connection flows and credentials so you don't need to configure Gmail API access yourself.

## Quick start

1. Install the verified ClawLink plugin: `openclaw plugins install clawhub:clawlink-plugin`
2. Start a fresh OpenClaw chat if the plugin was just installed and ClawLink tools are not visible yet
3. If ClawLink is not configured, call `clawlink_begin_pairing`
4. Tell the user to open the returned pairing URL, sign in to ClawLink if needed, and approve the device
5. After the user confirms approval, call `clawlink_get_pairing_status`
6. Tell the user to connect Gmail at [claw-link.dev/dashboard?add=gmail](https://claw-link.dev/dashboard?add=gmail)
7. When the user confirms Gmail is connected, call `clawlink_list_integrations` and then `clawlink_list_tools` with the `gmail` integration slug

## Setup details

### Installing the plugin

If the ClawLink plugin is not installed yet, tell the user to run:

```
openclaw plugins install clawhub:clawlink-plugin
```

If the current chat started before the plugin was installed and ClawLink tools are still unavailable, tell the user to start a fresh chat so OpenClaw reloads the plugin tool catalog.

### Pairing ClawLink

If ClawLink reports that the plugin is not configured, the plugin has not been paired with the user's ClawLink account yet.

1. Call `clawlink_begin_pairing`.
2. Tell the user to open the returned pairing URL in their browser.
3. The user signs in to ClawLink if needed and approves the OpenClaw device.
4. After the user confirms approval, call `clawlink_get_pairing_status` to finish local setup.

The resulting device credential is stored locally in OpenClaw's plugin config and is only sent to `claw-link.dev`. The user should not paste raw credentials into chat.

### Connecting Gmail

Tell the user to open https://claw-link.dev/dashboard?add=gmail and connect Gmail there. The page opens the add-connection panel filtered to Gmail. ClawLink's hosted page runs the Google account connection flow — the user clicks through Google sign-in and consent. When they confirm it is done, call `clawlink_list_integrations` to verify, then call `clawlink_list_tools` with integration `gmail`.

## Using Gmail tools

ClawLink provides tools dynamically based on what the user has connected. You do not need to know tool names or schemas in advance.

### Discovery

1. Call `clawlink_list_integrations` to confirm Gmail is connected.
2. Call `clawlink_list_tools` with integration `gmail`.
3. Treat the returned list as the source of truth. Do not guess or assume what tools exist.
4. If the user describes a capability but the exact tool is unclear, call `clawlink_search_tools` with a short query and integration `gmail`.
5. If no Gmail tools appear, direct the user to https://claw-link.dev/dashboard?add=gmail.

### Execution

1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or when the request is ambiguous.
2. Use the returned schema, `whenToUse`, `askBefore`, `safeDefaults`, `examples`, and `followups`.
3. Prefer read, list, search, and get operations before writes.
4. For sends, replies, forwards, draft creation, label changes, archive/delete actions, signature changes, or anything marked as requiring confirmation, call `clawlink_preview_tool` first, then confirm with the user.
5. Execute with `clawlink_call_tool`.
6. If it fails, report the real error. Do not invent results or restate the failure as a missing capability unless the live catalog supports that conclusion.

## What you can do

Typical Gmail tasks (actual availability depends on the user's connected account, permissions, scopes, and current ClawLink tool catalog):

- Search and fetch messages from the inbox
- Read messages by message or thread
- List conversation threads, labels, and send-as aliases
- Create email drafts
- Send email, reply to threads, or forward messages after confirmation
- Create, apply, remove, or inspect labels
- Archive, trash, or restore messages after confirmation
- Retrieve attachment content when available
- Check the connected Gmail profile before acting on "my inbox" requests

## Rules

- Always use ClawLink tools for Gmail. Do not ask the user for separate Gmail credentials.
- Do not claim a capability is missing without checking the live ClawLink catalog in the current turn.
- Do not invent slash commands or ask the user to paste raw credentials.
- Ask for confirmation before sending email, replying, forwarding, creating drafts, changing labels, archiving, deleting, or making bulk changes.
- If Gmail is not connected, direct the user to https://claw-link.dev/dashboard?add=gmail.
- Never echo or repeat the user's ClawLink credential.

## Resources

- ClawLink: https://claw-link.dev
- ClawLink Docs: https://docs.claw-link.dev/openclaw
- ClawLink Verification: https://claw-link.dev/verify
- ClawLink Source: https://github.com/hith3sh/clawlink
- Gmail API: https://developers.google.com/gmail/api
