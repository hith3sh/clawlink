## 1. Meta App Setup

- [ ] 1.1 Confirm whether ClawLink's existing Meta app can be used for WhatsApp Embedded Signup, or create a dedicated Meta app for WhatsApp onboarding.
- [ ] 1.2 Configure the WhatsApp / "Connect with customers through WhatsApp" use case.
- [ ] 1.3 Configure Facebook Login for Business and create a WhatsApp Embedded Signup login configuration.
- [ ] 1.4 Record the Embedded Signup `config_id`.
- [ ] 1.5 Configure allowed domains and redirect settings for production `https://claw-link.dev` and local development.
- [ ] 1.6 Identify production review requirements: Tech Provider status, app review, business verification, and advanced access permissions.
- [ ] 1.7 Rotate any Meta app secret or access token that was pasted into chat/logs during investigation.

## 2. Environment And Secrets

- [ ] 2.1 Add production bindings/secrets for Meta app ID, app secret, Embedded Signup config ID, and Graph API version.
- [ ] 2.2 Add local `.env.example` documentation without real secrets.
- [ ] 2.3 Ensure Meta app secret is server-only and never exposed to client bundles.
- [ ] 2.4 Add deployment notes for `npm run deploy:web` after setting Cloudflare Worker secrets.

## 3. Connection Data Model

- [ ] 3.1 Decide whether existing `user_integrations` metadata/credential fields can store WhatsApp metadata without migration.
- [ ] 3.2 If needed, add a D1 migration for connection metadata fields:
  `waba_id`, `phone_number_id`, `display_phone_number`, `verified_name`, `setup_source`, `health_status`.
- [ ] 3.3 Preserve row-level connection semantics: create/update by `connection_id`, not provider slug.
- [ ] 3.4 Ensure multiple WhatsApp connections per user can each store their own WABA and phone number ID.

## 4. Hosted Embedded Signup UI

- [ ] 4.1 Add a WhatsApp-specific hosted connect route or branch inside `HostedConnectPage`.
- [ ] 4.2 Load the Meta JavaScript SDK only on the WhatsApp embedded signup page.
- [ ] 4.3 Launch `FB.login` with `config_id`, `response_type: "code"`, `override_default_response_type: true`, and Embedded Signup `extras`.
- [ ] 4.4 Listen for Meta `postMessage` session info and capture WABA ID and phone number ID.
- [ ] 4.5 Show plain-language progress states:
  "Opening Meta", "Choose your business", "Verify your number", "Finishing connection".
- [ ] 4.6 Handle cancel/error states with a retry button and support-friendly copy.

## 5. Backend Completion Route

- [ ] 5.1 Add an API route that accepts the connection session token, Meta authorization code, WABA ID, and phone number ID.
- [ ] 5.2 Validate the connection session belongs to the current signed-in user.
- [ ] 5.3 Exchange the Meta authorization code server-side using the app secret.
- [ ] 5.4 Store the returned token in encrypted credentials.
- [ ] 5.5 Save WABA ID and phone number ID on the exact connection row being created or updated.
- [ ] 5.6 Complete the connection session as `connected`.
- [ ] 5.7 Return a compact connection summary to the hosted connect page.

## 6. Post-Connect WhatsApp Health Check

- [ ] 6.1 Call Meta Graph API for the connected phone number after completion.
- [ ] 6.2 Store display phone number, verified name, quality rating, platform type, and verification status.
- [ ] 6.3 If the phone number is not ready to send, mark the connection as degraded without forcing OAuth reconnect.
- [ ] 6.4 Surface degraded state in the WhatsApp integration detail page with a clear next step.
- [ ] 6.5 Keep the existing short-term dashboard card warning until the embedded flow is proven reliable.

## 7. Direct WhatsApp Runtime

- [ ] 7.1 Add a WhatsApp direct execution adapter for Meta Cloud API calls.
- [ ] 7.2 Implement `whatsapp_get_phone_numbers` using stored WABA ID and token.
- [ ] 7.3 Implement `whatsapp_get_phone_number` using stored phone number ID and token.
- [ ] 7.4 Implement `whatsapp_send_message` using stored phone number ID when the tool args omit one.
- [ ] 7.5 Map Meta errors into ClawLink canonical error types with helpful hints:
  outside 24-hour window, recipient not on WhatsApp, phone number not ready, missing permissions, token expired.
- [ ] 7.6 Record execution success/failure on the correct connection row.

## 8. Dashboard UX

- [ ] 8.1 Make WhatsApp's primary Connect action launch Embedded Signup instead of the Composio WABA-ID flow.
- [ ] 8.2 On the WhatsApp detail page, show the connected phone number and setup health.
- [ ] 8.3 If an old Composio WhatsApp connection exists and has `whatsapp_phone_not_registered`, show a guided prompt to reconnect with the new WhatsApp setup.
- [ ] 8.4 Keep copy simple: "Connect WhatsApp", "Verify your number in Meta", "Ready to send".

## 9. Migration / Compatibility

- [ ] 9.1 Keep existing Composio WhatsApp connections working during rollout.
- [ ] 9.2 Decide whether new WhatsApp connections should always use the direct adapter, even if a Composio connection exists.
- [ ] 9.3 Add a rollback switch or feature flag if Meta review blocks production use.
- [ ] 9.4 Document the fallback path for support: existing WABA-ID Composio setup is advanced/manual.

## 10. Testing

- [ ] 10.1 Local test: complete Embedded Signup with a test business and a fresh phone number.
- [ ] 10.2 Confirm the backend stores WABA ID, phone number ID, and encrypted token.
- [ ] 10.3 Confirm `whatsapp_get_phone_number` returns the expected connected number.
- [ ] 10.4 Send a free-form test message inside the 24-hour customer-service window.
- [ ] 10.5 Send an approved template message outside the 24-hour window if template support is included in V1.
- [ ] 10.6 Negative test: user cancels Meta popup.
- [ ] 10.7 Negative test: Meta returns a WABA but no phone number ID.
- [ ] 10.8 Negative test: token exchange fails.
- [ ] 10.9 Negative test: connected number is not send-ready.

## 11. Validation And Deploy

- [ ] 11.1 Run `npm run lint` on touched files.
- [ ] 11.2 Run `npm run build:web`.
- [ ] 11.3 Run WhatsApp MVP validation in two layers:
  hosted connect / OAuth / credential capture, then hosted runtime tool execution.
- [ ] 11.4 Deploy with `npm run deploy:web`.
- [ ] 11.5 Verify production on `https://claw-link.dev` with a real WhatsApp connection.

## 12. Documentation

- [ ] 12.1 Add internal docs explaining WhatsApp Embedded Signup architecture and Meta app setup.
- [ ] 12.2 Update customer-facing WhatsApp setup copy to remove manual WABA-ID instructions from the primary path.
- [ ] 12.3 Add support notes for Business App / SMB / coexistence limitations.
