## Context

The current WhatsApp connection path is Composio-backed:

1. User clicks Connect in ClawLink.
2. Hosted connect session opens Composio's WhatsApp auth UI.
3. Composio asks for WABA ID.
4. ClawLink stores the Composio connected account.
5. Tool execution calls Composio's WhatsApp tools.

This flow works only when the user's WABA already has a Cloud API-ready phone number. It fails poorly for users who only have a WhatsApp Business App / SMB setup. In that case Composio can see the WABA and phone number, but Meta rejects sending because the number is not registered for Cloud API.

Embedded Signup is the better onboarding primitive because it is intended to collect business information, grant app permissions, create/select the WABA, add/verify the phone number, and return the WABA ID, phone number ID, and authorization code to the product.

## Goals / Non-Goals

**Goals:**

- Replace manual WABA-ID entry for the primary WhatsApp connection path.
- Let non-technical users complete WhatsApp setup through Meta's guided popup.
- Store enough metadata to choose a default sender without asking agents for IDs.
- Detect and explain non-sendable phone-number states immediately after connect.
- Support the core MVP action: send a text message through WhatsApp Cloud API.
- Preserve existing row-level connection semantics: `user_integrations.id` remains the stable connection ID, and a user can have multiple WhatsApp connections.

**Non-Goals:**

- Building a full WhatsApp CRM/inbox.
- Replacing every Composio WhatsApp tool in the first pass.
- Solving all Business App coexistence edge cases.
- Asking users to generate Meta access tokens or run Graph API commands.

## Proposed Flow

### 1. Meta Configuration

Configure the ClawLink Meta app for Embedded Signup:

- Add or configure the WhatsApp / "Connect with customers through WhatsApp" use case.
- Configure Facebook Login for Business.
- Create a WhatsApp Embedded Signup login configuration and record its `config_id`.
- Add `https://claw-link.dev` and local development origins to allowed domains/redirect settings as required by Meta.
- Request/apply for required production permissions after the prototype works:
  - `business_management`
  - `whatsapp_business_management`
  - `whatsapp_business_messaging`

Exact permission and Tech Provider requirements must be verified against Meta's current review flow before production rollout.

### 2. Frontend Launch

On the WhatsApp connect page, load the Meta JavaScript SDK and call `FB.login` with the Embedded Signup config.

Representative shape:

```ts
FB.login(handleEmbeddedSignupResult, {
  config_id: process.env.NEXT_PUBLIC_META_WHATSAPP_CONFIG_ID,
  response_type: "code",
  override_default_response_type: true,
  extras: {
    feature: "whatsapp_embedded_signup",
    sessionInfoVersion: "3",
  },
});
```

The frontend also listens for Meta's `postMessage` session payload and extracts:

- `waba_id`
- `phone_number_id`
- business ID / phone display data if returned

The frontend sends the authorization `code`, WABA ID, phone number ID, and connection session token to ClawLink's backend. The frontend must not receive or store the app secret.

### 3. Backend Code Exchange

The backend exchanges the authorization code with Meta using the ClawLink Meta app credentials.

Store returned credentials in the existing encrypted credential store. Store non-secret metadata on the connection row or connection metadata structure:

- WABA ID.
- Phone number ID.
- display phone number.
- verified name.
- setup source: `meta_embedded_signup`.
- connection health/status fields if available.

The saved connection must be tied to `connection_sessions.connection_id` when reconnecting/updating an existing row.

### 4. Post-Connect Health Check

Immediately after saving credentials, call Meta Graph API to inspect the phone number.

At minimum capture:

- display phone number.
- verified name.
- code verification status.
- quality rating.
- platform type.
- throughput.

If the number is not send-ready, mark the connection as active but degraded, and show a dashboard warning with a concrete next step. Do not send the user back through generic reconnect unless the OAuth token itself is invalid.

### 5. Direct Runtime Adapter

Implement a WhatsApp direct adapter for the MVP actions rather than forwarding these calls through Composio:

- `whatsapp_get_phone_numbers`
- `whatsapp_get_phone_number`
- `whatsapp_send_message`
- optionally `whatsapp_send_template_message` if templates are needed for first-contact tests

For `whatsapp_send_message`, use:

```text
POST https://graph.facebook.com/v{version}/{phone_number_id}/messages
```

Payload:

```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "<to_number>",
  "type": "text",
  "text": {
    "preview_url": false,
    "body": "<text>"
  }
}
```

If a tool call omits `phone_number_id`, use the default connection's stored phone number ID. This is important for OpenClaw UX: agents should not need to ask users for IDs after connection.

### 6. Existing Composio Fallback

Keep the existing Composio WhatsApp connection path during transition, but do not promote it as the primary non-technical path.

Migration behavior:

- Existing Composio WhatsApp connections continue to work if they already work.
- New primary WhatsApp connect launches Embedded Signup.
- If a user has a Composio WhatsApp connection with `whatsapp_phone_not_registered`, the dashboard should suggest reconnecting through the new guided WhatsApp setup once available.

## Risks / Trade-offs

- **Meta review risk:** Production Embedded Signup may require Tech Provider / app review / advanced access before customers can use it broadly.
- **Business App coexistence complexity:** Some users want to keep their WhatsApp Business App number. Embedded Signup may support coexistence, but eligibility and restrictions vary. V1 should surface Meta's guidance rather than trying to bypass it.
- **Token lifecycle:** Need to confirm whether the exchanged token is long-lived enough for production use and how refresh/reconnection should work.
- **Webhook requirements:** Meta may require webhook subscription/configuration for app review or full messaging lifecycle. V1 can send messages without a full inbox, but production readiness may require webhook handling.
- **Tool coverage:** Direct adapter may initially support fewer WhatsApp tools than Composio's catalog. This is acceptable if the primary user promise is reliable sending.

## References

- Meta Embedded Signup overview: https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview
- Meta Embedded Signup implementation: https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/implementation
- Meta WhatsApp Cloud API messages: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
- Meta phone-number registration docs: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/registration/
