# Outlook integration gap notes

Saved for later so we can revisit without re-auditing Microsoft Graph from scratch.

## Current ClawLink Outlook tool surface

The current Outlook integration is intentionally small and exposes only:

- `list_messages`
- `get_message`
- `send_email`
- `list_events`
- `create_event`
- `list_contacts`

File: `worker/integrations/outlook.ts`

## What is missing compared to a broader Microsoft Graph / Outlook tool surface

### Mail

- update message state
  - mark read / unread
  - set importance
  - set categories
  - update subject / flags
- move / copy messages
- delete messages
- drafts flow
  - create draft
  - update draft
  - send draft
- reply flows
  - reply
  - reply all
  - forward
- attachments
  - list attachments
  - fetch attachment metadata/content
  - attach files to draft/message
- mail folders
  - list folders
  - get child folders
  - create / update / delete folders
- message rules
  - list / create / update / delete

### Calendar

- get single event
- update event
- delete/cancel event
- RSVP/respond to invite
- recurrence handling
- secondary calendars / calendar groups
- event extensions / open extensions

### Contacts

- get contact
- search contacts
- create contact
- update contact
- delete contact
- contact folders
- contact extensions / open extensions

### Advanced / enterprise Graph surface

- open extensions on messages, contacts, events
- inference classification override / focused inbox tuning
- `/users/{id}` delegated user-scoped endpoints
- delta sync / change tracking
- batching helpers
- broader nested resource coverage

## Recommendation

Do **not** try to mirror the entire Graph tool surface unless ClawLink intentionally wants to become a generic Microsoft Graph wrapper.

That path creates:

- too many tools
- permission complexity
- harder docs and UI
- worse UX for agents and users
- lots of edge-case endpoints with low product value

## Recommended next batch (high-value Outlook v2)

### Priority 1

- `update_message`
  - mark read/unread
  - set importance
  - set categories
- `reply_to_message`
- `forward_message`
- `move_message`
- `delete_message`

### Priority 2

- `create_draft`
- `list_folders`
- `get_event`
- `update_event`
- `delete_event`

### Priority 3

- `get_contact`
- `search_contacts`
- `create_contact`
- `update_contact`

## Suggested Outlook v2 tool surface

### Mail

- `list_messages`
- `get_message`
- `send_email`
- `create_draft`
- `reply_to_message`
- `forward_message`
- `update_message`
- `move_message`
- `delete_message`
- `list_folders`

### Calendar

- `list_events`
- `get_event`
- `create_event`
- `update_event`
- `delete_event`
- `respond_to_event`

### Contacts

- `list_contacts`
- `get_contact`
- `search_contacts`
- `create_contact`
- `update_contact`

## Probably skip for now

- open extensions
- inference classification override
- mail rules
- child-folder-specific bespoke tools
- `/users/{id}` enterprise/delegated actions
- obscure nested Graph endpoints

## Why the external Outlook tool list looked much larger

The external list appears to come from a much broader schema-derived Microsoft Graph surface where each nested endpoint becomes its own tool. That is technically comprehensive, but product-wise noisy.

ClawLink should stay curated unless there is a deliberate product decision to expose generic Graph coverage.
