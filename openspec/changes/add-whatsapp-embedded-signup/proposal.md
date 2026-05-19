## Why

ClawLink's current WhatsApp connection path uses Composio Managed OAuth and then asks the user for a WhatsApp Business Account ID (WABA ID). That creates a confusing half-connected state:

- ClawLink can authenticate the user's WhatsApp integration.
- Composio can list phone numbers under the WABA.
- Sending can still fail because the selected phone number is not registered for WhatsApp Cloud API.

Empirical evidence from May 19, 2026:

```
WABA ID: 1435651904565404
Phone Number ID: 981416798384762
Display number: +94 72 408 0267
code_verification_status: NOT_VERIFIED
platform_type: ON_PREMISE

WHATSAPP_SEND_MESSAGE -> whatsapp_phone_not_registered
Meta register endpoint -> "Register endpoint is not available for SMB businesses."
```

This is not acceptable for ClawLink's target UX. Non-technical OpenClaw users should not need to understand WABA IDs, Phone Number IDs, Meta apps, access tokens, two-step PINs, Graph API registration, or Business App vs Cloud API states just to send a WhatsApp message.

Meta's intended product path for this is WhatsApp Embedded Signup. It lets a user click Connect WhatsApp, log into Meta, choose or create the business/WABA, add or verify a phone number, grant permissions, and return to ClawLink with the assets needed to send.

## What Changes

- Add a custom WhatsApp connection flow in ClawLink that launches Meta WhatsApp Embedded Signup instead of Composio's WABA-ID form.
- Capture the Embedded Signup result on the frontend:
  - authorization `code`
  - WABA ID
  - phone number ID
  - business ID / phone display data where available
- Exchange the authorization code on the backend using ClawLink's Meta app credentials.
- Store WhatsApp credentials and connection metadata in ClawLink's existing encrypted credential store.
- Add a WhatsApp direct executor path that sends through Meta Cloud API using the stored phone number ID and token.
- Keep the existing Composio WhatsApp flow as a fallback or migration bridge until the embedded flow is stable.
- Add post-connect validation so the dashboard can show whether the connected phone number is ready to send.

## Capabilities

### New Capabilities

- `whatsapp-embedded-signup`: ClawLink SHALL provide a hosted WhatsApp connection flow using Meta Embedded Signup. Users SHALL be able to connect or create a WhatsApp Business Account and verify/select a phone number without manually entering a WABA ID.
- `whatsapp-direct-runtime`: ClawLink SHALL be able to execute core WhatsApp messaging actions directly against Meta Cloud API using credentials captured through Embedded Signup.

### Modified Capabilities

- `dashboard-integrations`: The WhatsApp integration card and detail page SHALL explain that sending requires a Cloud API-ready phone number. Once Embedded Signup is available, the primary WhatsApp Connect button SHALL launch the embedded flow.
- `connection-lifecycle`: WhatsApp connections SHALL store WABA ID, phone number ID, display phone number, verification state, and token metadata at the connection row level. This must preserve the multiple-connections-per-provider model.

## Impact

- Modified frontend:
  - Dashboard WhatsApp connect flow.
  - Hosted connect page or a WhatsApp-specific connect page.
  - Post-connect validation status on WhatsApp detail page.
- New backend routes:
  - Start/finalize WhatsApp Embedded Signup session.
  - Exchange Meta authorization code.
  - Optional phone-number health check.
- Modified executor:
  - Route WhatsApp tools to direct Meta Cloud API for supported actions, or introduce a WhatsApp-specific execution adapter.
- New configuration:
  - Meta app ID.
  - Meta app secret.
  - Meta WhatsApp Embedded Signup login configuration ID.
  - Meta Graph API version.
- D1 migrations likely required:
  - Store WhatsApp-specific connection metadata if current credential/metadata fields are insufficient.
- Credential storage:
  - Store Meta access token encrypted in `CREDENTIALS`.
  - Store WABA ID and phone number ID as connection metadata.
- Deploy:
  - Requires `npm run build:web` and `npm run deploy:web`.
  - Meta app settings must include production domain `claw-link.dev`.

## Out Of Scope For V1

- Full WhatsApp template-management UI.
- Inbound webhook inbox.
- Marketing broadcast UX.
- Migration tooling for every existing Composio WhatsApp connection.
- Business App coexistence support beyond whatever Embedded Signup supports out of the box.
- Becoming a full Meta Tech Provider if not strictly required for a controlled first release. This must be re-evaluated during Meta app setup and review.
