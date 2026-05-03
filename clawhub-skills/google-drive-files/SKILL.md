---
name: google-drive-files
description: Search Drive, inspect metadata, create folders, upload or download files, and manage sharing, comments, and revisions — powered by ClawLink.
---

# Google Drive via ClawLink

Work with Google Drive from chat — search files, inspect metadata, create folders, upload or download files, and manage sharing details.

Powered by [ClawLink](https://claw-link.dev), an integration hub for OpenClaw that handles hosted connection flows and credentials so you don't need to configure Google Drive API access yourself.

## Quick start

1. Install the verified ClawLink plugin: `openclaw plugins install clawhub:clawlink-plugin`
2. Start a fresh OpenClaw chat if the plugin was just installed and ClawLink tools are not visible yet
3. If ClawLink is not configured, call `clawlink_begin_pairing`
4. Tell the user to open the returned pairing URL, sign in to ClawLink if needed, and approve the device
5. After the user confirms approval, call `clawlink_get_pairing_status`
6. Tell the user to connect Google Drive at [claw-link.dev/dashboard?add=google-drive](https://claw-link.dev/dashboard?add=google-drive)
7. When the user confirms Google Drive is connected, call `clawlink_list_integrations` and then `clawlink_list_tools` with the `google-drive` integration slug

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

### Connecting Google Drive

Tell the user to open https://claw-link.dev/dashboard?add=google-drive and connect Google Drive there. The page opens the add-connection panel filtered to Google Drive. ClawLink's hosted page runs the Google account connection flow — the user clicks through Google sign-in and consent. When they confirm it is done, call `clawlink_list_integrations` to verify, then call `clawlink_list_tools` with integration `google-drive`.

## Using Google Drive tools

ClawLink provides tools dynamically based on what the user has connected. You do not need to know tool names or schemas in advance.

### Discovery

1. Call `clawlink_list_integrations` to confirm Google Drive is connected.
2. Call `clawlink_list_tools` with integration `google-drive`.
3. Treat the returned list as the source of truth. Do not guess or assume what tools exist.
4. If the user describes a capability but the exact tool is unclear, call `clawlink_search_tools` with a short query and integration `google-drive`.
5. If no Google Drive tools appear, direct the user to https://claw-link.dev/dashboard?add=google-drive.

### Execution

1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or when the request is ambiguous.
2. Use the returned schema, `whenToUse`, `askBefore`, `safeDefaults`, `examples`, and `followups`.
3. Prefer search, list, and metadata reads before writes.
4. For uploads, folder creation, sharing changes, moves, copies, deletes, or anything marked as requiring confirmation, call `clawlink_preview_tool` first, then confirm with the user.
5. Execute with `clawlink_call_tool`.
6. If it fails, report the real error. Do not invent results or restate the failure as a missing capability unless the live catalog supports that conclusion.

## What you can do

Typical Google Drive tasks (actual availability depends on the user's connected account, permissions, scopes, and current ClawLink tool catalog):

- Search for files or folders by name, type, or query
- Inspect file metadata, storage quota, shared drive info, and permission details
- List comments, replies, and revision history
- Create folders, shared drives, files, and shortcuts after confirmation
- Upload files directly or fetch from a URL into Drive after confirmation
- Download files or export supported content
- Move or copy files between folders after confirmation
- Review sharing state before collaboration changes

## Rules

- Always use ClawLink tools for Google Drive. Do not ask the user for separate Google credentials.
- Do not claim a capability is missing without checking the live ClawLink catalog in the current turn.
- Do not invent slash commands or ask the user to paste raw credentials.
- Ask for confirmation before uploads, file creation, sharing changes, moves, copies, or deletes.
- If Google Drive is not connected, direct the user to https://claw-link.dev/dashboard?add=google-drive.
- Never echo or repeat the user's ClawLink credential.

## Resources

- ClawLink: https://claw-link.dev
- ClawLink Docs: https://docs.claw-link.dev/openclaw
- ClawLink Verification: https://claw-link.dev/verify
- ClawLink Source: https://github.com/hith3sh/clawlink
- Google Drive API: https://developers.google.com/workspace/drive/api/guides/about-sdk
