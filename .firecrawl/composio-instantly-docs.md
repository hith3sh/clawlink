\# Instantly

Instantly is a platform designed to streamline cold email outreach by automating campaigns, managing leads, and enhancing email deliverability.

\- \*\*Category:\*\* drip emails
\- \*\*Auth:\*\* API\_KEY
\- \*\*Composio Managed App Available?\*\* N/A
\- \*\*Tools:\*\* 117
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`INSTANTLY\`
\- \*\*Version:\*\* 20260414\_00

\## Frequently Asked Questions

\### How do I set up custom OAuth credentials for Instantly?

For a step-by-step guide on creating and configuring your own Instantly OAuth credentials with Composio, see \[How to create OAuth credentials for Instantly\](https://composio.dev/auth/instantly).

\## Tools

\### Check Custom Tracking Domain Status

\*\*Slug:\*\* \`INSTANTLY\_ACCOUNTS\_CTD\_STATUS\_GET\`

Tool to check Custom Tracking Domain (CTD) status for email accounts. Use to verify SSL configuration and CNAME records for a specified domain/host.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`host\` \| string \| Yes \| The domain/host to check CTD status for. Verifies SSL configuration and CNAME records. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Activate Campaign

\*\*Slug:\*\* \`INSTANTLY\_ACTIVATE\_CAMPAIGN\`

Tool to activate or resume a paused campaign. Use when you need to start sending operations for a specific campaign. Prerequisites: Campaign must have at least one sender account, one lead, email sequences, and schedule configured.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the campaign to activate \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add Leads in Bulk

\*\*Slug:\*\* \`INSTANTLY\_ADD\_LEADS\_BULK\`

Tool to add multiple leads in bulk to a campaign or list. Use when you need to import several leads at once to an Instantly campaign or list. Supports duplicate handling options and lead verification.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`leads\` \| array \| Yes \| List of leads to add. Each lead must have at least an email address. \|
\| \`verify\` \| boolean \| No \| Verify leads on import \|
\| \`list\_id\` \| string \| No \| UUID of the list to add leads to. Either campaign\_id or list\_id is required. \|
\| \`campaign\_id\` \| string \| No \| UUID of the campaign to add leads to. Either campaign\_id or list\_id is required. \|
\| \`blocklist\_id\` \| string \| No \| Blocklist ID to check against when adding leads \|
\| \`skip\_if\_in\_list\` \| boolean \| No \| Skip adding the lead if it already exists in the list \|
\| \`verify\_leadfinder\` \| boolean \| No \| Verify leads for the lead finder \|
\| \`skip\_if\_in\_campaign\` \| boolean \| No \| Skip adding the lead if it already exists in the campaign \|
\| \`skip\_if\_in\_workspace\` \| boolean \| No \| Skip adding the lead if it already exists in the workspace \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get API Keys

\*\*Slug:\*\* \`INSTANTLY\_API\_KEYS\_GET\`

Tool to retrieve paginated list of API keys for organization. Use when you need to list all API keys with their names, scopes, and timestamps.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of API keys to return per page, between 1 and 100 \|
\| \`starting\_after\` \| string \| No \| UUID cursor for pagination - pass the next\_starting\_after value from previous response to get next page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Bulk Assign Leads

\*\*Slug:\*\* \`INSTANTLY\_BULK\_ASSIGN\_LEADS\`

Tool to bulk assign leads to organization users. Use when you need to assign multiple leads to specific organization members.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`lead\_ids\` \| array \| Yes \| List of lead UUIDs to assign to organization users \|
\| \`organization\_user\_ids\` \| array \| Yes \| List of organization user UUIDs to assign the leads to \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Campaigns Analytics Overview

\*\*Slug:\*\* \`INSTANTLY\_CAMPAIGNS\_ANALYTICS\_OVERVIEW\_GET\`

Tool to get analytics overview for one or multiple campaigns. Use when you need comprehensive performance metrics including leads, emails, replies, opens, clicks, and CRM events.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| No \| Campaign UUID to retrieve analytics for a single campaign. Leave empty for all campaigns. \|
\| \`ids\` \| array \| No \| List of campaign UUIDs to retrieve analytics for multiple campaigns. \|
\| \`end\_date\` \| string \| No \| End date for analytics range in YYYY-MM-DD format. \|
\| \`start\_date\` \| string \| No \| Start date for analytics range in YYYY-MM-DD format. \|
\| \`campaign\_status\` \| integer \| No \| Filter by campaign status (e.g., 1 = active). \|
\| \`expand\_crm\_events\` \| boolean \| No \| When true, calculates total of all lead interest status events instead of only first occurrence. Affects: total\_opportunities, total\_interested, total\_meeting\_booked, total\_meeting\_completed, total\_closed. Default: false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Import Campaign from Export

\*\*Slug:\*\* \`INSTANTLY\_CAMPAIGNS\_FROM\_EXPORT\_POST\`

Tool to import a campaign from exported data. Use when you need to recreate a campaign from previously exported configuration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID identifier from the exported campaign data \|
\| \`name\` \| string \| Yes \| Name of the campaign being imported \|
\| \`status\` \| integer \| Yes \| Status code of the campaign; e.g., 0=Draft, 1=Active, 2=Paused, 3=Completed, 4=Running Subsequences, -99=Account Suspended, -1=Accounts Unhealthy, -2=Bounce Protect \|
\| \`campaign\_id\` \| string \| Yes \| UUID of the campaign to import the exported data into \|
\| \`organization\` \| string \| Yes \| UUID of the organization that owns the campaign \|
\| \`campaign\_schedule\` \| object \| Yes \| Campaign schedule configuration including schedules, start\_date, and end\_date \|
\| \`timestamp\_created\` \| string \| Yes \| ISO 8601 timestamp when the campaign was originally created \|
\| \`timestamp\_updated\` \| string \| Yes \| ISO 8601 timestamp when the campaign was last updated \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check DFY Email Account Order Domains

\*\*Slug:\*\* \`INSTANTLY\_CHECK\_DFY\_EMAIL\_ACCOUNT\_ORDER\_DOMAINS\`

Tool to check domain availability for DFY email account orders. Use when you need to validate domains before creating DFY email account orders.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`domains\` \| array \| Yes \| List of domain names to check for DFY email account order availability or validation. At least one domain is required. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check Email Verification Status

\*\*Slug:\*\* \`INSTANTLY\_CHECK\_EMAIL\_VERIFICATION\_STATUS\`

Tool to check status of an email verification job. Use after submitting a verification request to retrieve the current status of a specific email address.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`email\` \| string \| Yes \| Email address to check verification status \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Count Launched Campaigns

\*\*Slug:\*\* \`INSTANTLY\_COUNT\_LAUNCHED\_CAMPAIGNS\`

Tool to retrieve the count of launched campaigns. Use when you need to know the total number of campaigns that have been launched in the workspace.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Count Leads from SuperSearch

\*\*Slug:\*\* \`INSTANTLY\_COUNT\_LEADS\_FROM\_SUPERSEARCH\`

Tool to count leads matching supersearch filter criteria. Use when you need to preview how many leads match your search criteria before creating an enrichment job.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of leads to count \|
\| \`search\_filters\` \| object \| Yes \| Filter criteria object containing professional attributes, company characteristics, and data source filters to count matching leads \|
\| \`skip\_already\_owned\` \| boolean \| No \| When true, exclude leads previously acquired by your workspace \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Count Unread Emails

\*\*Slug:\*\* \`INSTANTLY\_COUNT\_UNREAD\_EMAILS\`

Tool to retrieve the count of unread emails. Use when you need to know how many unread messages are in your inbox before sending new emails.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create AI Enrichment

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_AI\_ENRICHMENT\`

Tool to create an AI enrichment job for a campaign or lead list. Use when you need to enrich a resource with AI-driven insights.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of leads to enrich (1–1,000,000) \|
\| \`prompt\` \| string \| No \| Custom prompt to use (when template\_id is not provided) \|
\| \`status\` \| integer \| No \| Filter by job status: 1=pending, 2=processing, 3=completed, 4=failed \|
\| \`overwrite\` \| boolean \| No \| Whether to overwrite existing values in the output column \|
\| \`show\_state\` \| boolean \| No \| Return the current state of the enrichment job in the response \|
\| \`auto\_update\` \| boolean \| No \| Automatically enrich new leads added after job creation \|
\| \`resource\_id\` \| string \| Yes \| UUID of the resource (campaign or list) to enrich \|
\| \`template\_id\` \| integer \| No \| ID of a pre-defined prompt template to use \|
\| \`input\_columns\` \| array \| No \| List of input column names to feed into the model \|
\| \`model\_version\` \| string \| Yes \| Model version to use. Allowed values: 3.5, 4.0, gpt-4o, gpt-5, gpt-5-mini, gpt-5-nano, o3, gpt-4.1, claude-3.7-sonnet, claude-3.5-sonnet \|
\| \`output\_column\` \| string \| Yes \| Column name to store the AI enrichment result \|
\| \`resource\_type\` \| integer \| Yes \| Type of resource: 1 = List, 2 = Campaign \|
\| \`use\_instantly\_account\` \| boolean \| No \| Whether to use Instantly's own account for API calls \|
\| \`skip\_leads\_without\_email\` \| boolean \| No \| Skip leads that do not have an email address \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create API Key

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_API\_KEY\`

Creates a new API key with specified permissions for the Instantly API. Use this tool to generate credentials for programmatic access. Each API key can be scoped with granular permissions (e.g., 'campaigns:read', 'leads:create') to limit access to specific resources and operations. The generated key value is returned in the response and should be stored securely. Common use cases: - Create integration keys with limited scopes for third-party applications - Generate read-only keys for reporting/analytics tools - Set up automation keys with specific resource access

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Human-readable name to identify this API key. Should be descriptive of its purpose or the application/integration using it. This name will appear in API key listings. \|
\| \`scopes\` \| array \| Yes \| List of permission scopes for the API key. Each scope follows the format 'resource:action' (e.g., 'campaigns:read', 'leads:create'). Use 'all:all' for full access to all resources. Common resources include: campaigns, leads, accounts, webhooks, api\_keys, workspaces, subsequences, lead\_lists, custom\_tags, block\_list\_entries, emails, and more. Common actions include: create, read, update, delete, all. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Block List Entry

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_BLOCK\_LIST\_ENTRY\`

Tool to create a new block list entry for a specific email or domain. Use when you need to prevent campaigns from sending emails to a specific address or domain.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`bl\_value\` \| string \| Yes \| The email address or domain to block (e.g., 'user@example.com' or 'example.com'). The API automatically determines if it's a domain or email. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Campaign

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_CAMPAIGN\`

Tool to create a new campaign. Use when you have campaign details ready and want to launch.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the campaign \|
\| \`cc\_list\` \| array \| No \| CC list \|
\| \`bcc\_list\` \| array \| No \| BCC list \|
\| \`owned\_by\` \| string \| No \| Owner ID \|
\| \`pl\_value\` \| number \| No \| Value of every positive lead \|
\| \`email\_gap\` \| number \| No \| Gap between emails in minutes \|
\| \`sequences\` \| array \| No \| Email sequences. Only the first element is used by the API. Each sequence contains steps, where each step must have: (1) type='email', (2) delay (days before NEXT email, defaults to 0 if omitted), (3) variants list with subject and body for each variant. \|
\| \`text\_only\` \| boolean \| No \| Send as text-only \|
\| \`email\_list\` \| array \| No \| Email addresses of pre-configured sending accounts in your Instantly workspace. These must be accounts already added to your workspace, not arbitrary email addresses. Use the INSTANTLY\_LIST\_ACCOUNTS action to discover valid email addresses. \|
\| \`daily\_limit\` \| integer \| No \| Daily sending limit \|
\| \`is\_evergreen\` \| boolean \| No \| Whether the campaign is evergreen \|
\| \`link\_tracking\` \| boolean \| No \| Track link clicks \|
\| \`open\_tracking\` \| boolean \| No \| Track opens \|
\| \`stop\_on\_reply\` \| boolean \| No \| Stop campaign on reply \|
\| \`email\_tag\_list\` \| array \| No \| Tag IDs to use for sending \|
\| \`match\_lead\_esp\` \| boolean \| No \| Match lead by ESP \|
\| \`daily\_max\_leads\` \| integer \| No \| Max new leads to contact daily \|
\| \`random\_wait\_max\` \| number \| No \| Max random wait in minutes \|
\| \`stop\_for\_company\` \| boolean \| No \| Stop for company on reply \|
\| \`campaign\_schedule\` \| object \| Yes \| Schedule configuration for the campaign \|
\| \`stop\_on\_auto\_reply\` \| boolean \| No \| Stop on auto-reply \|
\| \`auto\_variant\_select\` \| object \| No \| Auto variant select settings \|
\| \`allow\_risky\_contacts\` \| boolean \| No \| Allow risky contacts \|
\| \`prioritize\_new\_leads\` \| boolean \| No \| Prioritize new leads \|
\| \`first\_email\_text\_only\` \| boolean \| No \| First email as text-only \|
\| \`disable\_bounce\_protect\` \| boolean \| No \| Disable bounce protect \|
\| \`provider\_routing\_rules\` \| array \| No \| Provider routing rules \|
\| \`insert\_unsubscribe\_header\` \| boolean \| No \| Insert unsubscribe header \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Custom Tag

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_CUSTOM\_TAG\`

Tool to create a new custom tag for organizing accounts and campaigns. Use when you need to create a new tag for categorization purposes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`label\` \| string \| Yes \| The label/name for the custom tag \|
\| \`description\` \| string \| No \| A description for the tag to provide additional context \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Inbox Placement Test

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_INBOX\_PLACEMENT\_TEST\`

Tool to create an inbox placement test. Use when you need to measure deliverability across providers with your prepared email and recipient list.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the inbox placement test \|
\| \`tags\` \| array \| No \| List of tag UUIDs to apply to the test \|
\| \`type\` \| integer ("1" \| "2") \| Yes \| Test type: 1=one-time, 2=automated \|
\| \`emails\` \| array \| Yes \| List of recipient email addresses for the test \|
\| \`status\` \| integer ("1" \| "2" \| "3") \| No \| Initial status: 1=Active, 2=Paused, 3=Completed \|
\| \`schedule\` \| object \| No \| Schedule settings for automated inbox placement tests. \|
\| \`test\_code\` \| string \| No \| External identifier for tests sent from outside Instantly \|
\| \`text\_only\` \| boolean \| No \| If true, send plain-text only and disable open tracking \|
\| \`email\_body\` \| string \| Yes \| HTML body of the test email \|
\| \`automations\` \| array \| No \| Automations to trigger based on test results or schedule \|
\| \`campaign\_id\` \| string \| No \| UUID of the campaign to associate with the test \|
\| \`description\` \| string \| No \| Optional description of the test \|
\| \`delivery\_mode\` \| integer ("1" \| "2") \| No \| Delivery mode: 1=one by one, 2=all together \|
\| \`email\_subject\` \| string \| Yes \| Subject line for the test email \|
\| \`sending\_method\` \| integer ("1" \| "2") \| Yes \| Sending method: 1=From Instantly, 2=From outside Instantly \|
\| \`run\_immediately\` \| boolean \| No \| If true, trigger the test immediately in addition to schedule \|
\| \`recipients\_labels\` \| array \| No \| Label settings for email service providers; fetch options via GET /inbox-placement-tests/email-service-provider-options \|
\| \`not\_sending\_status\` \| string ("daily\_limits\_hit" \| "other") \| No \| Reason for not sending: 'daily\_limits\_hit' or 'other' \|
\| \`timestamp\_next\_run\` \| string \| No \| Next run timestamp in ISO 8601 format \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Lead

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_LEAD\`

Tool to create a new lead. Use when you need to add an individual lead to a campaign.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`email\` \| string \| No \| Email address of the lead \|
\| \`phone\` \| string \| No \| Phone number of the lead \|
\| \`website\` \| string \| No \| Website URL of the lead \|
\| \`campaign\` \| string \| No \| UUID of the campaign to associate the lead with \|
\| \`last\_name\` \| string \| No \| Last name of the lead \|
\| \`first\_name\` \| string \| No \| First name of the lead \|
\| \`company\_name\` \| string \| No \| Company name of the lead \|
\| \`personalization\` \| string \| No \| Personalized note or message for the lead \|
\| \`custom\_variables\` \| object \| No \| Custom variables for the lead as a key/value map. Values must be scalars (string, number, boolean, or null); nested objects or arrays are not allowed. These will be stored on the lead's payload and can be used in campaigns. \|
\| \`lt\_interest\_status\` \| integer ("-3" \| "-2" \| "-1" \| "0" \| "1" \| "2" \| "3" \| "4") \| No \| Lead interest status; allowed values: 0=Out of Office, 1=Interested, 2=Meeting Booked, 3=Meeting Completed, 4=Closed, -1=Not Interested, -2=Wrong Person, -3=Lost \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Lead List

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_LEAD\_LIST\`

Tool to create a new lead list. Use when you need to organize leads into a dedicated list before importing them into campaigns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the lead list \|
\| \`owned\_by\` \| string \| No \| Owner user ID (UUID); defaults to creator if not provided \|
\| \`has\_enrichment\_task\` \| boolean \| No \| Whether to run enrichment on added leads \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Subsequence

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_SUBSEQUENCE\`

Creates an automated follow-up subsequence for a campaign. Subsequences are triggered when leads meet specific conditions (CRM status changes, activities, or reply keywords). Use this tool when you need to: - Set up automatic follow-ups for interested leads (CRM status = 1) - Send targeted sequences when leads reply with specific keywords - Create different follow-up paths based on meeting status or lead activities - Implement A/B testing with multiple email variants Key features: - Condition-based triggering (CRM status, lead activity, or reply keywords) - Flexible scheduling with timezone support and active days - Multi-step email sequences with configurable delays - A/B testing support with multiple email variants per step

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Descriptive name for the subsequence to identify its purpose \|
\| \`sequences\` \| array \| Yes \| List of sequences containing email steps. Important: Only the first sequence element is used by the API; additional elements are ignored. \|
\| \`conditions\` \| object \| Yes \| Trigger conditions that determine when leads enter the subsequence. At least one of crm\_status, lead\_activity, or reply\_contains must be provided (non-empty). \|
\| \`parent\_campaign\` \| string \| Yes \| UUID of the parent campaign that this subsequence belongs to. Must be a valid existing campaign ID. \|
\| \`subsequence\_schedule\` \| object \| Yes \| Scheduling configuration including timing windows, active days, timezone, and optional start/end dates \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create SuperSearch Enrichment

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_SUPERSEARCH\_ENRICHMENT\`

Tool to create a supersearch enrichment job for a list or campaign. Use when you need to enrich leads with data such as email verification, work email, profile information, job listings, technologies, news, or funding details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string ("work\_email\_enrichment" \| "fully\_enriched\_profile" \| "email\_verification" \| "joblisting" \| "technologies" \| "news" \| "funding" \| "ai\_enrichment") \| Yes \| Type of enrichment to create \|
\| \`limit\` \| integer \| No \| Maximum number of leads to enrich \|
\| \`lead\_ids\` \| array \| No \| List of specific lead IDs to enrich (1-10000 items) \|
\| \`auto\_update\` \| boolean \| No \| When true, automatically enriches new leads added to the campaign/list \|
\| \`resource\_id\` \| string \| Yes \| UUID of the resource (list or campaign) to run enrichments for \|
\| \`input\_columns\` \| array \| No \| List of column names to use as input data for AI enrichment from your leads \|
\| \`model\_version\` \| string \| No \| Version of the AI model to use for enrichment \|
\| \`enrichment\_payload\` \| object \| No \| Configuration options for enrichment types. \|
\| \`overwrite\_existing\` \| boolean \| No \| When true, overwrites existing values; when false, only enriches empty fields \|
\| \`use\_instantly\_credits\` \| boolean \| No \| When true, uses Instantly's account for API calls; when false, uses your own API keys \|
\| \`skip\_leads\_without\_email\` \| boolean \| No \| When true, leads without an email will be skipped \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Webhook

\*\*Slug:\*\* \`INSTANTLY\_CREATE\_WEBHOOK\`

Tool to create a new webhook endpoint. Use when you need to receive Instantly event notifications via HTTP callbacks.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`campaign\` \| string \| No \| Filter webhook events to a specific campaign by its UUID; null for all campaigns \|
\| \`event\_type\` \| string \| No \| Event that triggers the webhook; use 'all\_events' to subscribe to all events. See GET /webhooks/event-types for valid values \|
\| \`target\_hook\_url\` \| string \| Yes \| Target URL to send webhook payloads; must start with http:// or https:// \|
\| \`custom\_interest\_value\` \| integer \| No \| Custom interest value for custom label events; corresponds to LeadLabel.interest\_status \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete API Key

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_API\_KEY\`

Tool to delete an API key. Use when you need to remove a specific API key by its ID after confirming its existence.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the API key to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Block List Entry

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_BLOCK\_LIST\_ENTRY\`

Tool to delete a blocked email or domain entry by its ID. Use when you need to remove a specific block list entry.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the block list entry to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Campaign

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_CAMPAIGN\`

Tool to delete a campaign. Use when you need to remove a specific campaign by ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the campaign to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Custom Tag

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_CUSTOM\_TAG\`

Tool to delete a custom tag by its ID. Use when you need to remove a specific custom tag used for organizing and categorizing accounts and campaigns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the custom tag to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Lead

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_LEAD\`

Tool to delete a lead by its ID. Use when you need to remove a specific lead after confirming its existence.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Lead Label

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_LEAD\_LABEL\`

Tool to delete a lead label by ID. Use when you need to remove a custom label for categorizing and managing leads.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead label to delete \|
\| \`reassigned\_status\` \| integer \| No \| The interest status to reassign leads and emails to when deleting this label \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Lead List

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_LEAD\_LIST\`

Tool to delete a lead list by ID. Use when you need to remove a specific lead list after confirming its existence.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead list to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Subsequence

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_SUBSEQUENCE\`

Delete a subsequence from a campaign by its UUID. A subsequence is an automated follow-up sequence triggered by specific conditions (e.g., CRM status changes, lead activity, or reply content). Use this action when you need to permanently remove a subsequence that is no longer needed or was created in error. The deletion is permanent and cannot be undone. Returns the complete subsequence data including its configuration, schedule, and email sequences for reference before deletion.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the subsequence to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Webhook

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_WEBHOOK\`

Tool to delete a webhook. Use when you need to remove a specific webhook by its UUID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the webhook to delete \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Whitelabel Domain

\*\*Slug:\*\* \`INSTANTLY\_DELETE\_WHITELABEL\_DOMAIN\`

Tool to delete the whitelabel domain from current workspace. Use when you need to remove the whitelabel domain configuration from a workspace.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Pre-warmed Up DFY Domains

\*\*Slug:\*\* \`INSTANTLY\_DFY\_EMAIL\_ACCOUNT\_ORDERS\_DOMAINS\_PRE\_WARMED\_UP\`

Tool to retrieve a list of pre-warmed up domains ready for DFY email account orders. Use when you need to check available domains that come pre-configured with SPF, DKIM, DMARC, and warmup already completed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`search\` \| string \| No \| Search string to filter domains by partial or full domain name match \|
\| \`domain\_extensions\` \| array \| No \| List of domain extensions (TLDs) to filter results. Only .com, .org, and .co are supported. Defaults to \['com', 'org', 'co'\] if not provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Disable Account Warmup

\*\*Slug:\*\* \`INSTANTLY\_DISABLE\_ACCOUNT\_WARMUP\`

Tool to disable the warm-up process for email accounts. Use when you need to stop warmup for specific or all accounts before sending critical campaigns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\` \| array \| No \| List of emails to disable warmup for (max 100). \|
\| \`excluded\_emails\` \| array \| No \| List of emails to exclude when \`include\_all\_emails\` is true (max 100). \|
\| \`include\_all\_emails\` \| boolean \| No \| If true, disable warmup on all accounts. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Duplicate Campaign

\*\*Slug:\*\* \`INSTANTLY\_DUPLICATE\_CAMPAIGN\`

Tool to duplicate an existing campaign. Use when you need to create a copy of a campaign with the same configuration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the campaign to duplicate \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Duplicate Subsequence

\*\*Slug:\*\* \`INSTANTLY\_DUPLICATE\_SUBSEQUENCE\`

Tool to duplicate an existing subsequence to a specified parent campaign. Use when you need to create a copy of a subsequence with the same trigger conditions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the subsequence to duplicate \|
\| \`name\` \| string \| Yes \| Name for the duplicated subsequence \|
\| \`parent\_campaign\` \| string \| Yes \| UUID of the campaign to duplicate the subsequence to \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Enable Account Warmup

\*\*Slug:\*\* \`INSTANTLY\_ENABLE\_ACCOUNT\_WARMUP\`

Tool to enable the warm-up process for email accounts. Use when you want to start warming up one or more accounts to improve deliverability.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\` \| array \| No \| List of email addresses to enable warmup for; max 100 items \|
\| \`excluded\_emails\` \| array \| No \| List of email addresses to exclude when include\_all\_emails is true; max 100 items \|
\| \`include\_all\_emails\` \| boolean \| No \| If true, enable warmup for all email accounts in the workspace \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Export Campaign

\*\*Slug:\*\* \`INSTANTLY\_EXPORT\_CAMPAIGN\`

Tool to export campaign data to JSON format. Use when you need to retrieve complete campaign configuration for backup or migration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the campaign to export \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Account Campaign Mappings

\*\*Slug:\*\* \`INSTANTLY\_GET\_ACCOUNT\_CAMPAIGN\_MAPPINGS\`

Tool to retrieve campaigns associated with an email account. Use when you need to find which campaigns are mapped to a specific email address.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`email\` \| string \| Yes \| Email address to query for campaign associations \|
\| \`limit\` \| integer \| No \| Number of results to return for pagination \|
\| \`starting\_after\` \| string \| No \| Pagination cursor that accepts UUID, timestamp (ISO 8601 format), or email for retrieving subsequent results \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Daily Account Analytics

\*\*Slug:\*\* \`INSTANTLY\_GET\_ACCOUNTS\_ANALYTICS\_DAILY\`

Tool to retrieve daily account analytics showing emails sent per day for each account. Use when you need per-day performance metrics for email accounts.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\` \| array \| No \| Filter by specific email accounts. If not provided, returns data for all accounts in workspace \|
\| \`end\_date\` \| string \| No \| End date for analytics period in YYYY-MM-DD format. If not provided, defaults to current date \|
\| \`start\_date\` \| string \| No \| Start date for analytics period in YYYY-MM-DD format. If not provided, returns data for the last 30 days \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Accounts Warmup Analytics

\*\*Slug:\*\* \`INSTANTLY\_GET\_ACCOUNTS\_WARMUP\_ANALYTICS\`

Tool to retrieve warmup analytics for specified email accounts. Use when you need daily and aggregate warmup statistics including health scores.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`emails\` \| array \| Yes \| List of email addresses to retrieve warmup analytics for. The emails must be attached to accounts in your workspace \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Audit Logs

\*\*Slug:\*\* \`INSTANTLY\_GET\_AUDIT\_LOGS\`

Tool to retrieve audit log records for tracking system activities. Use when you need to review account activity history or monitor changes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of audit log entries to return, between 1 and 100 \|
\| \`starting\_after\` \| string \| No \| Cursor for pagination. Use 'next\_starting\_after' from previous response \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Block List Entry

\*\*Slug:\*\* \`INSTANTLY\_GET\_BLOCK\_LIST\_ENTRY\`

Tool to retrieve a specific blocked email or domain entry by its ID. Use when you have a block list entry UUID and need to check block details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the block list entry to retrieve \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Campaign

\*\*Slug:\*\* \`INSTANTLY\_GET\_CAMPAIGN\`

Tool to retrieve campaign details. Use when you need full campaign configuration for a given campaign ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the campaign to retrieve \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Campaign Analytics

\*\*Slug:\*\* \`INSTANTLY\_GET\_CAMPAIGN\_ANALYTICS\`

Tool to retrieve analytics for campaigns. Use when you need performance metrics for one or multiple campaigns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| No \| Campaign UUID to retrieve analytics for a single campaign \|
\| \`ids\` \| array \| No \| List of campaign UUIDs to retrieve analytics for multiple campaigns \|
\| \`end\_date\` \| string \| No \| End date filter (YYYY-MM-DD) \|
\| \`start\_date\` \| string \| No \| Start date filter (YYYY-MM-DD) \|
\| \`exclude\_total\_leads\_count\` \| boolean \| No \| If true, exclude total leads count to speed response \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Campaign Sending Status

\*\*Slug:\*\* \`INSTANTLY\_GET\_CAMPAIGN\_SENDING\_STATUS\`

Tool to retrieve campaign sending status diagnostics explaining why a campaign may not be sending emails or is sending slower than expected. Use when troubleshooting campaign delivery issues or understanding campaign health.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the campaign to retrieve sending status for \|
\| \`with\_ai\_summary\` \| boolean \| No \| If true, includes an AI-generated summary of the sending status in the response. Defaults to false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Campaign Steps Analytics

\*\*Slug:\*\* \`INSTANTLY\_GET\_CAMPAIGN\_STEPS\_ANALYTICS\`

Tool to retrieve analytics data broken down by campaign steps and variants. Use when you need detailed performance metrics for each step in a campaign sequence.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`end\_date\` \| string \| Yes \| End date for analytics period in YYYY-MM-DD format (e.g., '2024-01-01') \|
\| \`start\_date\` \| string \| Yes \| Start date for analytics period in YYYY-MM-DD format (e.g., '2024-01-01') \|
\| \`campaign\_id\` \| string \| No \| Campaign ID in UUID format (e.g., '019b0aee-b8b9-7e26-ab5f-4fca02ce11f8'). Leave empty to get analytics for all campaigns \|
\| \`include\_opportunities\_count\` \| boolean \| No \| Whether to include opportunities count per step. When true, 'opportunities' and 'unique\_opportunities' fields will be included in the response \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Current Workspace

\*\*Slug:\*\* \`INSTANTLY\_GET\_CURRENT\_WORKSPACE\`

Tool to retrieve current workspace details based on API key. Use when you need workspace information like plan details, owner, or organization settings.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Custom Tag

\*\*Slug:\*\* \`INSTANTLY\_GET\_CUSTOM\_TAG\`

Tool to retrieve a specific custom tag by ID. Use when you need details about a custom tag used for organizing accounts and campaigns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the custom tag to retrieve \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Custom Tag Mappings

\*\*Slug:\*\* \`INSTANTLY\_GET\_CUSTOM\_TAG\_MAPPINGS\`

Tool to retrieve custom tag mappings that connect tags to resources like campaigns and email accounts. Use when you need to see which tags are assigned to which resources.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of custom tag mappings to return, between 1 and 100 \|
\| \`tag\_ids\` \| string \| No \| Comma-separated tag IDs to filter mappings by \|
\| \`resource\_ids\` \| string \| No \| Comma-separated resource IDs (account or campaign) to filter mappings by \|
\| \`starting\_after\` \| string \| No \| Cursor ID to start listing after for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Daily Campaign Analytics

\*\*Slug:\*\* \`INSTANTLY\_GET\_DAILY\_CAMPAIGN\_ANALYTICS\`

Tool to retrieve daily analytics for a campaign. Use when you need per-day performance metrics for campaigns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`end\_date\` \| string \| No \| End date (inclusive) for analytics in YYYY-MM-DD format \|
\| \`start\_date\` \| string \| No \| Start date (inclusive) for analytics in YYYY-MM-DD format \|
\| \`campaign\_id\` \| string \| No \| Campaign ID (UUID); omit to retrieve analytics for all campaigns \|
\| \`campaign\_status\` \| integer ("0" \| "1" \| "2" \| "3" \| "4" \| "-99" \| "-1" \| "-2") \| No \| Filter by campaign status. Allowed values: 0=Draft, 1=Active, 2=Paused, 3=Completed, 4=Running Subsequences, -99=Account Suspended, -1=Accounts Unhealthy, -2=Bounce Protect \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get DFY Email Account Order Accounts

\*\*Slug:\*\* \`INSTANTLY\_GET\_DFY\_EMAIL\_ACCOUNT\_ORDER\_ACCOUNTS\`

Tool to retrieve DFY (Done-For-You) email account order accounts. Use when you need to fetch accounts from DFY email account orders with optional pagination and password inclusion.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of accounts to return, between 1 and 100. Default is 10. \|
\| \`starting\_after\` \| string \| No \| ID of the last item in the previous page for pagination. Can be UUID, timestamp, or email. \|
\| \`with\_passwords\` \| boolean \| No \| When set to true, the password of the account is returned. Can be empty if accounts are not ready yet. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Email Service Provider Options

\*\*Slug:\*\* \`INSTANTLY\_GET\_EMAIL\_SERVICE\_PROVIDER\_OPTIONS\`

Tool to retrieve email service provider options for inbox placement tests. Use when you need valid recipients\_labels options.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Inbox Placement Analytics Stats By Date

\*\*Slug:\*\* \`INSTANTLY\_GET\_INBOX\_PLACEMENT\_ANALYTICS\_STATS\_BY\_DATE\`

Tool to retrieve time-series statistics for inbox placement test results by date. Use when you need daily analytics showing how emails were distributed across inbox, spam, and category folders.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`test\_id\` \| string \| Yes \| The unique identifier (UUID format) of the inbox placement test \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Inbox Placement Test

\*\*Slug:\*\* \`INSTANTLY\_GET\_INBOX\_PLACEMENT\_TEST\`

Tool to retrieve inbox placement test results. Use when you need details for a specific inbox placement test by ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the inbox placement test \|
\| \`with\_metadata\` \| boolean \| No \| Whether to include campaign and tags metadata in response \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Lead

\*\*Slug:\*\* \`INSTANTLY\_GET\_LEAD\`

Tool to retrieve details of a specific lead by its ID. Use when you have the lead UUID and need full lead metadata.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Lead Label

\*\*Slug:\*\* \`INSTANTLY\_GET\_LEAD\_LABEL\`

Tool to retrieve a specific lead label by ID. Use when you need details about a custom label for categorizing and managing leads.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead label to retrieve \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Lead Label by ID (Deprecated)

\*\*Slug:\*\* \`INSTANTLY\_GET\_LEAD\_LABELS\`

DEPRECATED: Use INSTANTLY\_GET\_LEAD\_LABEL instead. Tool to retrieve a specific lead label by ID. Use when you need details about a custom label for categorizing and managing leads.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead label to retrieve \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Lead List

\*\*Slug:\*\* \`INSTANTLY\_GET\_LEAD\_LIST\`

Tool to retrieve details of a specific lead list by its ID. Use when you have the lead list UUID and need list metadata.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead list \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get CRM Phone Numbers

\*\*Slug:\*\* \`INSTANTLY\_GET\_PHONE\_NUMBERS\`

Tool to retrieve all phone numbers associated with your organization. Use when you need to list phone numbers configured for CRM actions.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Similar DFY Email Account Order Domains

\*\*Slug:\*\* \`INSTANTLY\_GET\_SIMILAR\_DFY\_EMAIL\_ACCOUNT\_ORDER\_DOMAINS\`

Tool to generate similar available domain suggestions for DFY email account orders. Use when you need to find available domain alternatives based on a provided domain. Returns maximum of 66 suggestions per extension (TLD) requested.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`domain\` \| string \| Yes \| The base domain name to find similar alternatives for (e.g., 'example.com') \|
\| \`extensions\` \| array \| No \| Array of TLD extensions to use for generating similar domains. Supported values: 'com', 'org'. Default: \['com', 'org'\] if not specified. Maximum of 66 suggestions per extension. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Subsequence

\*\*Slug:\*\* \`INSTANTLY\_GET\_SUBSEQUENCE\`

Tool to retrieve a specific subsequence by its ID. Use when you need full details of a follow-up sequence entity.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the subsequence to retrieve \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get SuperSearch Enrichment

\*\*Slug:\*\* \`INSTANTLY\_GET\_SUPERSEARCH\_ENRICHMENT\`

Tool to retrieve supersearch enrichment configuration and status for a list or campaign. Use this to check enrichment settings, progress status, and configuration details for a specific list or campaign resource.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`resource\_id\` \| string \| Yes \| UUID of the list or campaign to retrieve enrichment configuration and status for \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Lead List Verification Stats

\*\*Slug:\*\* \`INSTANTLY\_GET\_VERIFICATION\_STATS\_FOR\_LEAD\_LIST\`

Tool to retrieve verification statistics for a lead list. Use when you need summary counts by verification status for a specific lead list.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead list \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Webhook

\*\*Slug:\*\* \`INSTANTLY\_GET\_WEBHOOK\`

Tool to retrieve details of a specific webhook subscription. Use when you have the webhook ID and need full webhook configuration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the webhook \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Webhook Event

\*\*Slug:\*\* \`INSTANTLY\_GET\_WEBHOOK\_EVENT\`

Tool to retrieve details of a specific webhook event. Use when you need to inspect a particular webhook event by its ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the webhook event to retrieve \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Webhook Events Summary

\*\*Slug:\*\* \`INSTANTLY\_GET\_WEBHOOK\_EVENTS\_SUMMARY\`

Tool to retrieve webhook events summary with success and failure statistics. Use when you need aggregated webhook delivery metrics for a date range.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`to\_date\` \| string \| Yes \| Inclusive end date of the date range in YYYY-MM-DD format \|
\| \`from\_date\` \| string \| Yes \| Inclusive start date of the date range in YYYY-MM-DD format \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Webhook Events Summary By Date

\*\*Slug:\*\* \`INSTANTLY\_GET\_WEBHOOK\_EVENTS\_SUMMARY\_BY\_DATE\`

Tool to retrieve webhook event summaries grouped by date. Use when you need aggregated webhook event statistics over a date range.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`to\_date\` \| string \| Yes \| End date (inclusive) in YYYY-MM-DD format for the summary period \|
\| \`from\_date\` \| string \| Yes \| Start date (inclusive) in YYYY-MM-DD format for the summary period \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Webhook Event Types

\*\*Slug:\*\* \`INSTANTLY\_GET\_WEBHOOK\_EVENT\_TYPES\`

Tool to retrieve all available webhook event types. Use when you need to see valid event types for webhook subscriptions.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Workspace Billing Plan Details

\*\*Slug:\*\* \`INSTANTLY\_GET\_WORKSPACE\_BILLING\_PLAN\_DETAILS\`

Tool to retrieve workspace billing plan details. Use when you need to view billing plan information for various services like lead finder, verification, CRM, website visitor tracking, and inbox placement.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Inbox Placement Deliverability Insights

\*\*Slug:\*\* \`INSTANTLY\_INBOX\_PLACEMENT\_ANALYTICS\_DELIVERABILITY\_INSIGHTS\`

Tool to retrieve deliverability insights for inbox placement tests. Use when you need detailed percentage breakdowns of emails landing in spam, inbox, and category folders with optional date range filtering and previous period comparison.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`date\_to\` \| string \| No \| End date for filtering results in ISO 8601 format \|
\| \`test\_id\` \| string \| Yes \| The unique identifier for the inbox placement test (UUID) \|
\| \`date\_from\` \| string \| No \| Start date for filtering results in ISO 8601 format \|
\| \`recipient\_esp\` \| array \| No \| Filter by recipient email service providers \|
\| \`recipient\_geo\` \| array \| No \| Filter by recipient geographic locations \|
\| \`show\_previous\` \| boolean \| No \| Whether to include previous period data in response \|
\| \`recipient\_type\` \| array \| No \| Filter by recipient types \|
\| \`previous\_date\_to\` \| string \| No \| End date for previous period comparison in ISO 8601 format \|
\| \`previous\_date\_from\` \| string \| No \| Start date for previous period comparison in ISO 8601 format \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Inbox Placement Analytics Stats By Test ID

\*\*Slug:\*\* \`INSTANTLY\_INBOX\_PLACEMENT\_ANALYTICS\_STATS\_BY\_TEST\_ID\`

Tool to retrieve aggregated inbox placement analytics statistics for specified test IDs. Use when you need consolidated inbox, spam, and category counts across multiple tests with optional filtering by date range, recipient geo, type, ESP, or sender email.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`date\_to\` \| string \| No \| End date for filtering results in ISO 8601 format \|
\| \`test\_ids\` \| array \| Yes \| Array of test IDs (UUIDs) to retrieve statistics for. Must be non-empty. \|
\| \`date\_from\` \| string \| No \| Start date for filtering results in ISO 8601 format \|
\| \`sender\_email\` \| string \| No \| Filter by sender email address \|
\| \`recipient\_esp\` \| array \| No \| Filter by recipient email service provider \|
\| \`recipient\_geo\` \| array \| No \| Filter by recipient geographic locations \|
\| \`recipient\_type\` \| array \| No \| Filter by recipient type \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Lead Label

\*\*Slug:\*\* \`INSTANTLY\_LEAD\_LABELS\_POST\`

Tool to create a custom lead label for categorizing leads. Use when you need to create a new label to organize and manage leads with specific interest status categories.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`label\` \| string \| Yes \| The display name for the custom lead label \|
\| \`description\` \| string \| No \| Detailed description of the lead label's purpose \|
\| \`use\_with\_ai\` \| boolean \| No \| Whether this label should be used with AI features \|
\| \`interest\_status\_label\` \| string ("positive" \| "negative" \| "neutral") \| Yes \| Interest status category for this label. Must be one of: 'positive', 'negative', 'neutral' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Email Accounts

\*\*Slug:\*\* \`INSTANTLY\_LIST\_ACCOUNTS\`

Tool to list all email accounts for the authenticated user. Use after obtaining auth credentials to retrieve available accounts.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of items to return, between 1 and 100 \|
\| \`search\` \| string \| No \| Search string to filter accounts, e.g., domain or email substring \|
\| \`status\` \| integer \| No \| Filter by account status: 1 Active; 2 Paused; -1 Connection Error; -2 Soft Bounce Error; -3 Sending Error \|
\| \`tag\_ids\` \| string \| No \| Comma-separated list of tag UUIDs to filter accounts \|
\| \`provider\_code\` \| integer \| No \| Filter by email provider: 1 Custom IMAP/SMTP; 2 Google; 3 Microsoft; 4 AWS \|
\| \`starting\_after\` \| string \| No \| Cursor for pagination. Use 'next\_starting\_after' from previous response \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List API Keys (Deprecated)

\*\*Slug:\*\* \`INSTANTLY\_LIST\_API\_KEYS\`

DEPRECATED: Use INSTANTLY\_INSTANTLY\_API\_KEYS\_GET instead. Tool to list all API keys. Use when you need to retrieve your API keys with optional pagination after authentication.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of API keys to return, between 1 and 100 \|
\| \`starting\_after\` \| string \| No \| ID of the last API key from previous page for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Block List Entries

\*\*Slug:\*\* \`INSTANTLY\_LIST\_BLOCK\_LIST\_ENTRIES\`

Tool to list blocked emails or domains from blocklist. Use when you need to retrieve multiple block list entries with optional filtering by domains only or search terms. Supports pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of items per page (1-100) \|
\| \`search\` \| string \| No \| Search filter by email or domain value \|
\| \`domains\_only\` \| boolean \| No \| Filter to return only domain blocks (true) or include both domains and specific emails (false/null) \|
\| \`starting\_after\` \| string \| No \| Cursor for pagination - ID of last item from previous page (UUID format) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Campaigns

\*\*Slug:\*\* \`INSTANTLY\_LIST\_CAMPAIGNS\`

Tool to list all campaigns. Use when you need to fetch your campaigns list with optional filters and pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of campaigns to return, between 1 and 100 \|
\| \`search\` \| string \| No \| Search text to filter campaign names \|
\| \`tag\_ids\` \| string \| No \| Comma-separated tag UUIDs to filter campaigns \|
\| \`starting\_after\` \| string \| No \| UUID cursor to start listing after for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Custom Tags

\*\*Slug:\*\* \`INSTANTLY\_LIST\_CUSTOM\_TAGS\`

Tool to list custom tags. Use when you need to retrieve custom tags with optional pagination and filtering.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of custom tags to return, between 1 and 100 \|
\| \`search\` \| string \| No \| Search text to filter custom tags by label or description \|
\| \`tag\_ids\` \| string \| No \| Comma-separated tag IDs to filter by \|
\| \`resource\_ids\` \| string \| No \| Comma-separated resource IDs (account or campaign) to filter by \|
\| \`starting\_after\` \| string \| No \| Cursor ID to start listing after for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List DFY Email Account Orders

\*\*Slug:\*\* \`INSTANTLY\_LIST\_DFY\_EMAIL\_ACCOUNT\_ORDERS\`

Tool to list DFY email account orders. Use when you need to fetch your DFY email account orders with pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of DFY Email Account Orders to return, between 1 and 100 \|
\| \`starting\_after\` \| string \| No \| ID of the last order from the previous page for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Emails

\*\*Slug:\*\* \`INSTANTLY\_LIST\_EMAILS\`

Tool to list emails. Use when you need to retrieve emails with optional filters and pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`lead\` \| string \| No \| Filter by lead email address \|
\| \`mode\` \| string ("emode\_focused" \| "emode\_others" \| "emode\_all") \| No \| Unibox mode filter: emode\_focused, emode\_others, or emode\_all \|
\| \`limit\` \| integer \| No \| Number of items to return, between 1 and 100 \|
\| \`search\` \| string \| No \| Search by lead email or 'thread:' to filter by thread \|
\| \`eaccount\` \| string \| No \| Email account used to send the email \|
\| \`i\_status\` \| integer \| No \| Email status to filter by \|
\| \`is\_unread\` \| boolean \| No \| Filter only unread emails \|
\| \`email\_type\` \| string ("received" \| "sent" \| "manual") \| No \| Filter by email type: received, sent, or manual \|
\| \`sort\_order\` \| string ("asc" \| "desc") \| No \| Sort order: asc or desc \|
\| \`assigned\_to\` \| string \| No \| Filter by assignee user ID \|
\| \`campaign\_id\` \| string \| No \| Campaign ID (UUID) to filter emails \|
\| \`has\_reminder\` \| boolean \| No \| Filter emails that have a reminder set \|
\| \`preview\_only\` \| boolean \| No \| Filter preview-only emails \|
\| \`company\_domain\` \| string \| No \| Filter by lead company domain \|
\| \`marked\_as\_done\` \| boolean \| No \| Filter emails marked as done \|
\| \`scheduled\_only\` \| boolean \| No \| Return only scheduled emails \|
\| \`starting\_after\` \| string \| No \| Cursor ID to start listing from for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Inbox Placement Blacklist & SpamAssassin Reports

\*\*Slug:\*\* \`INSTANTLY\_LIST\_INBOX\_PLACEMENT\_BLACKLIST\_SPAM\_ASSASSIN\`

Tool to list inbox placement blacklist & SpamAssassin reports. Use when you need to retrieve spam and blacklist analytics after running an inbox placement test.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of items to return, between 1 and 100 \|
\| \`date\_to\` \| string \| No \| Filter items created at or before this timestamp (ISO 8601) \|
\| \`test\_id\` \| string \| Yes \| Inbox Placement Test ID to filter by \|
\| \`date\_from\` \| string \| No \| Filter items created at or after this timestamp (ISO 8601) \|
\| \`starting\_after\` \| string \| No \| Cursor of last item from previous page for pagination \|
\| \`skip\_blacklist\_report\` \| boolean \| No \| If true, omit blacklist\_report from each item \|
\| \`skip\_spam\_assassin\_report\` \| boolean \| No \| If true, omit spam\_assassin\_report from each item \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Inbox Placement Tests

\*\*Slug:\*\* \`INSTANTLY\_LIST\_INBOX\_PLACEMENT\_TESTS\`

Tool to list inbox placement tests. Use when you need a paginated overview of tests with optional filtering and sort order.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of tests to return, between 1 and 100 \|
\| \`search\` \| string \| No \| Search term to filter tests by name or content \|
\| \`status\` \| integer ("1" \| "2" \| "3") \| No \| Filter by status: 1=Active, 2=Paused, 3=Completed \|
\| \`sort\_order\` \| string ("asc" \| "desc") \| No \| Sort order by id (UUIDv7 timestamp); asc or desc \|
\| \`starting\_after\` \| string \| No \| UUID cursor to start listing after for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Lead Lists

\*\*Slug:\*\* \`INSTANTLY\_LIST\_LEAD\_LISTS\`

Tool to list all lead lists. Use when you need to fetch the lead lists with optional filters and pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of lead lists to return, between 1 and 100 \|
\| \`search\` \| string \| No \| Search text to filter lead list names \|
\| \`starting\_after\` \| string \| No \| Cursor timestamp (ISO 8601) to start listing after for pagination \|
\| \`has\_enrichment\_task\` \| boolean \| No \| Filter lists that have an enrichment task \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Leads

\*\*Slug:\*\* \`INSTANTLY\_LIST\_LEADS\`

Tool to list leads. Use when you need to retrieve leads with optional filters like search, status filters, and pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| array \| No \| Only include these lead IDs (UUID strings) \|
\| \`limit\` \| integer \| No \| Page size limit between 1 and 100 \|
\| \`filter\` \| string \| No \| Lead filter status; allowed values: FILTER\_VAL\_CONTACTED, FILTER\_VAL\_NOT\_CONTACTED, FILTER\_VAL\_COMPLETED, FILTER\_VAL\_UNSUBSCRIBED, FILTER\_VAL\_ACTIVE, FILTER\_LEAD\_INTERESTED, FILTER\_LEAD\_NOT\_INTERESTED, FILTER\_LEAD\_MEETING\_BOOKED \|
\| \`search\` \| string \| No \| Search by first name, last name, or email \|
\| \`in\_list\` \| boolean \| No \| Whether the lead is in any list \|
\| \`list\_id\` \| string \| No \| Lead list ID to filter leads \|
\| \`queries\` \| array \| No \| Advanced query conditions as raw JSON objects \|
\| \`campaign\` \| string \| No \| Campaign ID to filter leads \|
\| \`contacts\` \| array \| No \| Only include leads with these emails \|
\| \`in\_campaign\` \| boolean \| No \| Whether the lead is in any campaign \|
\| \`excluded\_ids\` \| array \| No \| Exclude these lead IDs (UUID strings) \|
\| \`starting\_after\` \| string \| No \| Cursor of last item from previous page for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Webhook Events

\*\*Slug:\*\* \`INSTANTLY\_LIST\_WEBHOOK\_EVENTS\`

Tool to list webhook events. Use when you need to view received webhook events with optional pagination and filters.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of items to return, between 1 and 100 \|
\| \`search\` \| string \| No \| Exact match on webhook URL or lead email \|
\| \`success\` \| boolean \| No \| Filter events by success status \|
\| \`to\_date\` \| string \| No \| Inclusive end date filter in YYYY-MM-DD format \|
\| \`from\_date\` \| string \| No \| Inclusive start date filter in YYYY-MM-DD format \|
\| \`starting\_after\` \| string \| No \| Cursor for pagination. ID of the last item from the previous page \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Webhooks

\*\*Slug:\*\* \`INSTANTLY\_LIST\_WEBHOOKS\`

Tool to list configured webhooks. Use when you need to retrieve your webhook configurations with optional filters and pagination.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of webhooks to return, between 1 and 100 \|
\| \`campaign\` \| string \| No \| Filter webhooks by campaign UUID \|
\| \`event\_type\` \| string \| No \| Filter webhooks by event type. Allowed: all\_events, email\_sent, email\_opened, email\_link\_clicked, reply\_received, email\_bounced, lead\_unsubscribed, campaign\_completed, account\_error, lead\_neutral, etc. \|
\| \`starting\_after\` \| string \| No \| Cursor (webhook ID) to start listing after for pagination \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Mark Thread As Read

\*\*Slug:\*\* \`INSTANTLY\_MARK\_THREAD\_AS\_READ\`

Tool to mark all emails in a specific thread as read. Use when you want to update the read status of an email thread after processing.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`thread\_id\` \| string \| Yes \| UUID of the email thread to mark as read \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Merge Leads

\*\*Slug:\*\* \`INSTANTLY\_MERGE\_LEADS\`

Tool to merge multiple leads into a single lead. Use after confirming both source and destination lead IDs exist.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`lead\_id\` \| string \| Yes \| UUID of the source lead to be merged \|
\| \`destination\_lead\_id\` \| string \| Yes \| UUID of the destination lead that will receive merged data \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Move Leads

\*\*Slug:\*\* \`INSTANTLY\_MOVE\_LEADS\`

Tool to move leads from one campaign to another. Use when you need to transfer specific leads between campaigns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| array \| Yes \| List of lead UUIDs to move to the destination campaign \|
\| \`campaign\` \| string \| Yes \| UUID of the source campaign from which leads will be moved \|
\| \`to\_campaign\_id\` \| string \| Yes \| UUID of the destination campaign to which leads will be moved \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Lead Label

\*\*Slug:\*\* \`INSTANTLY\_PATCH\_LEAD\_LABEL\`

Tool to update an existing lead label by ID. Use when you need to modify a custom label for categorizing and managing leads.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead label to update \|
\| \`label\` \| string \| No \| Display label/name for the custom lead label (e.g., 'Hot Lead') \|
\| \`description\` \| string \| No \| Detailed description of the custom lead label purpose \|
\| \`use\_with\_ai\` \| boolean \| No \| Whether this label should be used with AI features \|
\| \`interest\_status\_label\` \| string \| No \| Interest status label associated with this label (e.g., 'positive', 'negative', 'neutral') \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch SuperSearch Enrichment Settings

\*\*Slug:\*\* \`INSTANTLY\_PATCH\_SUPERSEARCH\_ENRICHMENT\_SETTINGS\`

Tool to update auto-update and skip settings for SuperSearch enrichment. Use when you need to configure enrichment behavior for leads in a list or campaign, including automatic enrichment of new leads, skipping leads without emails, evergreen updates, and overwrite settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`overwrite\` \| boolean \| No \| When true, will overwrite existing values in the output column. When false, only empty fields will be enriched. Default is false \|
\| \`auto\_update\` \| boolean \| No \| When true, new leads added to the campaign/list will be automatically enriched using these same settings. Allows you to auto-update existing rows and keeps outputs fresh over time \|
\| \`resource\_id\` \| string \| Yes \| Unique identifier (UUID) for the resource (list or campaign) to update enrichment settings for \|
\| \`is\_evergreen\` \| boolean \| No \| Whether the enrichment is evergreen (automatically updates over time) \|
\| \`skip\_rows\_without\_email\` \| boolean \| No \| When true, leads without an email will be skipped. Enabled by default to ensure only leads with work email will be enriched, preventing credit waste for leads without work emails \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Patch Webhook

\*\*Slug:\*\* \`INSTANTLY\_PATCH\_WEBHOOK\`

Tool to update an existing webhook configuration. Use when you need to modify webhook properties like name, event type, or target URL.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the webhook to update. \|
\| \`name\` \| string \| No \| Name for the webhook, or null to clear. \|
\| \`headers\` \| object \| No \| Custom headers to include in webhook requests (key-value pairs). \|
\| \`campaign\` \| string \| No \| Campaign UUID to associate with the webhook, or null to clear. \|
\| \`event\_type\` \| string \| No \| Type of event to trigger the webhook. Options include: 'all\_events' (subscribes to all events including custom label events), 'email\_sent', 'email\_opened', 'email\_link\_clicked', 'reply\_received', 'email\_bounced', 'lead\_unsubscribed', 'campaign\_completed', 'account\_error', 'lead\_neutral', and additional event types. Set to null for custom label events. \|
\| \`target\_hook\_url\` \| string \| No \| The URL where webhook events will be sent; must start with http:// or https:// \|
\| \`custom\_interest\_value\` \| integer \| No \| Integer value for custom interest; corresponds to LeadLabel.interest\_status. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Pause Campaign

\*\*Slug:\*\* \`INSTANTLY\_PAUSE\_CAMPAIGN\`

Tool to pause an active campaign. Use when you need to suspend sending operations for a specific campaign.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the campaign to pause \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Pause Subsequence

\*\*Slug:\*\* \`INSTANTLY\_PAUSE\_SUBSEQUENCE\`

Tool to pause an active campaign subsequence. Use when you need to temporarily suspend a follow-up sequence.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the subsequence to pause \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove Lead From Subsequence

\*\*Slug:\*\* \`INSTANTLY\_REMOVE\_LEAD\_FROM\_SUBSEQUENCE\`

Tool to remove a lead from a campaign subsequence. Use when you need to stop a lead from receiving subsequence emails.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier (UUID format) of the lead to remove from the subsequence \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Resume Subsequence

\*\*Slug:\*\* \`INSTANTLY\_RESUME\_SUBSEQUENCE\`

Tool to resume a paused campaign subsequence. Use when you need to restart a previously paused follow-up sequence.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the subsequence to resume \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Campaigns by Lead Email

\*\*Slug:\*\* \`INSTANTLY\_SEARCH\_CAMPAIGNS\_BY\_LEAD\_EMAIL\`

Tool to search campaigns by a lead's email address. Use when you need to find campaigns containing a specific lead by their email.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`search\` \| string \| Yes \| Lead email to search \|
\| \`sort\_order\` \| string ("asc" \| "desc") \| No \| Sort direction, either 'asc' or 'desc' (default 'asc') \|
\| \`sort\_column\` \| string \| No \| Column to sort by, default 'timestamp\_created' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set Whitelabel Domain

\*\*Slug:\*\* \`INSTANTLY\_SET\_WHITELABEL\_DOMAIN\`

Tool to set whitelabel agency domain for current workspace. Use when you need to configure custom branding with your own domain name for the workspace.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`domain\` \| string \| Yes \| The agency domain to set for the workspace whitelabel configuration \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Share Campaign

\*\*Slug:\*\* \`INSTANTLY\_SHARE\_CAMPAIGN\`

Tool to share a campaign. Use when you need to share a campaign template for 7 days.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the campaign to share \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Run SuperSearch Enrichment

\*\*Slug:\*\* \`INSTANTLY\_SUPERSEARCH\_ENRICHMENT\_RUN\_POST\`

Tool to run all enrichments for resource leads or unenriched leads. Use when you need to trigger enrichment processes for a list or campaign.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`resource\_id\` \| string \| Yes \| The unique identifier (UUID) of the list or campaign to run enrichment for \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Test Accounts Vitals

\*\*Slug:\*\* \`INSTANTLY\_TEST\_ACCOUNTS\_VITALS\`

Tool to test IMAP/SMTP connectivity and account vitals for email accounts. Use when you need to verify email account health and connectivity status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`accounts\` \| array \| Yes \| Array of email addresses to test for IMAP/SMTP connectivity and account vitals \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Test Webhook

\*\*Slug:\*\* \`INSTANTLY\_TEST\_WEBHOOK\`

Tool to send a test payload to verify a webhook is working. Use when you need to verify a webhook configuration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the webhook to test \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Toggle Resource

\*\*Slug:\*\* \`INSTANTLY\_TOGGLE\_RESOURCE\`

Tool to assign or unassign custom tags to resources like accounts and campaigns. Use when you need to manage custom tag associations with resources by either assigning or unassigning tags.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`assign\` \| boolean \| Yes \| Whether to assign (true) or unassign (false) the tags to the specified resources \|
\| \`filter\` \| object \| No \| Filter criteria to apply to resources. Only used when selected\_all is true \|
\| \`tag\_ids\` \| array \| Yes \| Array of tag IDs to assign or unassign to resources \|
\| \`resource\_ids\` \| array \| Yes \| Array of resource IDs (account IDs or campaign IDs) to apply the tags to \|
\| \`selected\_all\` \| boolean \| No \| Whether to select all resources. When true, the filter parameter is used \|
\| \`resource\_type\` \| integer \| Yes \| Type of resource to apply tags to. Value: 1 for accounts or campaigns \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Block List Entry

\*\*Slug:\*\* \`INSTANTLY\_UPDATE\_BLOCK\_LIST\_ENTRY\`

Tool to update a blocked email or domain entry. Use when you need to modify the bl\_value of an existing block list entry.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the block list entry to update \|
\| \`bl\_value\` \| string \| Yes \| The email address or domain to block (e.g., 'example@domain.com' or 'example.com') \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Campaign

\*\*Slug:\*\* \`INSTANTLY\_UPDATE\_CAMPAIGN\`

Tool to update details of a campaign. Use when you need to modify campaign settings after verifying its ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the campaign to update \|
\| \`name\` \| string \| No \| New campaign name \|
\| \`cc\_list\` \| array \| No \| List of email addresses to CC \|
\| \`bcc\_list\` \| array \| No \| List of email addresses to BCC \|
\| \`owned\_by\` \| string \| No \| UUID of the new owner; null to unset \|
\| \`pl\_value\` \| number \| No \| Value for each positive lead; null to unset \|
\| \`email\_gap\` \| integer \| No \| Gap between emails in minutes; null to unset \|
\| \`sequences\` \| array \| No \| List of sequence objects; only first is honored; include steps inside \|
\| \`text\_only\` \| boolean \| No \| Send emails as text-only; null to unset \|
\| \`email\_list\` \| array \| No \| List of sender email addresses to use for this campaign. Must be email addresses of sender accounts that already exist in your Instantly workspace. Use INSTANTLY\_LIST\_ACCOUNTS to retrieve available sender email addresses. \|
\| \`daily\_limit\` \| integer \| No \| Daily send limit; null for unlimited \|
\| \`is\_evergreen\` \| boolean \| No \| Whether the campaign is evergreen; null to unset \|
\| \`link\_tracking\` \| boolean \| No \| Enable link click tracking; null to unset \|
\| \`open\_tracking\` \| boolean \| No \| Enable open tracking; null to unset \|
\| \`stop\_on\_reply\` \| boolean \| No \| Stop campaign when a lead replies; null to unset \|
\| \`email\_tag\_list\` \| array \| No \| List of email tag UUIDs to apply \|
\| \`match\_lead\_esp\` \| boolean \| No \| Match leads by ESP; null to unset \|
\| \`daily\_max\_leads\` \| integer \| No \| Max new leads to contact per day; null to unset \|
\| \`random\_wait\_max\` \| integer \| No \| Maximum random wait in minutes; null to unset \|
\| \`stop\_for\_company\` \| boolean \| No \| Stop for company on reply; null to unset \|
\| \`campaign\_schedule\` \| object \| No \| Raw campaign schedule configuration \|
\| \`stop\_on\_auto\_reply\` \| boolean \| No \| Stop on auto-reply; null to unset \|
\| \`auto\_variant\_select\` \| object \| No \| Settings for auto variant selection \|
\| \`allow\_risky\_contacts\` \| boolean \| No \| Allow sending to risky contacts; null to unset \|
\| \`prioritize\_new\_leads\` \| boolean \| No \| Prioritize new leads; null to unset \|
\| \`first\_email\_text\_only\` \| boolean \| No \| Send only the first email as text-only; null to unset \|
\| \`disable\_bounce\_protect\` \| boolean \| No \| Disable bounce protection; null to unset \|
\| \`provider\_routing\_rules\` \| array \| No \| Custom provider routing rule objects \|
\| \`insert\_unsubscribe\_header\` \| boolean \| No \| Insert unsubscribe header; null to unset \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Custom Tag

\*\*Slug:\*\* \`INSTANTLY\_UPDATE\_CUSTOM\_TAG\`

Tool to update an existing custom tag's label or description. Use when you need to modify a custom tag used for organizing accounts and campaigns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the custom tag to update \|
\| \`label\` \| string \| No \| The label/name for the custom tag. Include only if you want to update it. \|
\| \`description\` \| string \| No \| A description for the tag to provide additional context. Include only if you want to update it. Set to empty string to clear. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Inbox Placement Test

\*\*Slug:\*\* \`INSTANTLY\_UPDATE\_INBOX\_PLACEMENT\_TEST\`

Tool to update an inbox placement test. Use when you need to modify an existing inbox placement test by its ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the inbox placement test to update \|
\| \`name\` \| string \| No \| Name of the inbox placement test \|
\| \`tags\` \| array \| No \| List of tag UUIDs to apply to the test \|
\| \`type\` \| integer ("1" \| "2") \| No \| Test type: 1=one-time, 2=automated \|
\| \`emails\` \| array \| No \| List of recipient email addresses for the test \|
\| \`status\` \| integer ("1" \| "2" \| "3") \| No \| Status: 1=Active, 2=Paused, 3=Completed \|
\| \`schedule\` \| object \| No \| Schedule settings for automated inbox placement tests. \|
\| \`test\_code\` \| string \| No \| External identifier for tests sent from outside Instantly \|
\| \`text\_only\` \| boolean \| No \| If true, send plain-text only and disable open tracking \|
\| \`email\_body\` \| string \| No \| HTML body of the test email \|
\| \`automations\` \| array \| No \| Automations to trigger based on test results or schedule \|
\| \`campaign\_id\` \| string \| No \| UUID of the campaign to associate with the test \|
\| \`description\` \| string \| No \| Optional description of the test \|
\| \`delivery\_mode\` \| integer ("1" \| "2") \| No \| Delivery mode: 1=one by one, 2=all together \|
\| \`email\_subject\` \| string \| No \| Subject line for the test email \|
\| \`sending\_method\` \| integer ("1" \| "2") \| No \| Sending method: 1=From Instantly, 2=From outside Instantly \|
\| \`recipients\_labels\` \| array \| No \| Label settings for email service providers; fetch options via GET /inbox-placement-tests/email-service-provider-options \|
\| \`not\_sending\_status\` \| string ("daily\_limits\_hit" \| "other") \| No \| Reason for not sending: 'daily\_limits\_hit' or 'other' \|
\| \`timestamp\_next\_run\` \| string \| No \| Next run timestamp in ISO 8601 format \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Lead

\*\*Slug:\*\* \`INSTANTLY\_UPDATE\_LEAD\`

Tool to update a lead's details. Use when you need to modify fields of an existing lead after identifying its ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead to update. \|
\| \`phone\` \| string \| No \| Phone number of the lead, or null to clear. \|
\| \`website\` \| string \| No \| Website URL of the lead, or null to clear. \|
\| \`last\_name\` \| string \| No \| Last name of the lead, or null to clear. \|
\| \`first\_name\` \| string \| No \| First name of the lead, or null to clear. \|
\| \`company\_name\` \| string \| No \| Company name of the lead, or null to clear. \|
\| \`personalization\` \| string \| No \| Personalization content for the lead, or null to clear. \|
\| \`lt\_interest\_status\` \| integer \| No \| Lead interest status. Static values: 0=Out of Office, 1=Interested, 2=Meeting Booked, 3=Meeting Completed, 4=Closed, -1=Not Interested, -2=Wrong Person, -3=Lost; or custom status. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Lead Interest Status

\*\*Slug:\*\* \`INSTANTLY\_UPDATE\_LEAD\_INTEREST\_STATUS\`

Tool to update a lead's interest status. Use when you need to set or reset a lead’s interest status for follow-up actions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`list\_id\` \| string \| No \| Optional list ID to scope the update \|
\| \`lead\_email\` \| string \| Yes \| Email address of the lead whose interest status to update \|
\| \`campaign\_id\` \| string \| No \| Optional campaign ID to scope the update \|
\| \`interest\_value\` \| string \| Yes \| Interest status code. Set to null to reset to 'Lead'. Valid values: 0=Out of Office, 1=Interested, 2=Meeting Booked, 3=Meeting Completed, 4=Closed, -1=Not Interested, -2=Wrong Person, -3=Lost \|
\| \`ai\_interest\_value\` \| integer \| No \| Optional AI interest value for the lead \|
\| \`disable\_auto\_interest\` \| boolean \| No \| Disable Instantly's automatic interest updates when set to true \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Lead List

\*\*Slug:\*\* \`INSTANTLY\_UPDATE\_LEAD\_LIST\`

Tool to update details of a specific lead list by its ID. Use after verifying the list ID exists.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the lead list to update \|
\| \`name\` \| string \| No \| New name for the lead list \|
\| \`owned\_by\` \| string \| No \| User ID of the new owner (UUID) \|
\| \`has\_enrichment\_task\` \| boolean \| No \| Whether this list runs the enrichment process on every added lead \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Subsequence

\*\*Slug:\*\* \`INSTANTLY\_UPDATE\_SUBSEQUENCE\`

Tool to update a campaign subsequence entity. Use when you need to modify subsequence settings such as name, schedule, or triggered CRM statuses.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| UUID of the subsequence to update \|
\| \`name\` \| string \| No \| Name of the subsequence \|
\| \`sequences\` \| array \| No \| List of sequences containing email steps. Important: Only the first array element is processed, so provide only one array item with steps inside it. \|
\| \`crm\_statuses\` \| array \| No \| Lead CRM statuses that trigger the subsequence \|
\| \`parent\_campaign\` \| string \| No \| UUID of the campaign this subsequence belongs to \|
\| \`subsequence\_schedule\` \| object \| No \| Schedule configuration for the subsequence. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Current Workspace

\*\*Slug:\*\* \`INSTANTLY\_UPDATE\_WORKSPACE\_CURRENT\`

Tool to update the current workspace details. Use when you need to modify workspace settings such as name or logo URL.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| Name of the workspace \|
\| \`org\_logo\_url\` \| string \| No \| URL to the workspace logo. Set to null to remove the logo. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Verify Email

\*\*Slug:\*\* \`INSTANTLY\_VERIFY\_EMAIL\`

Tool to initiate email verification. Use when you need to verify an email's deliverability before sending emails.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`email\` \| string \| Yes \| Email address to verify in RFC 5322 format. \|
\| \`webhook\_url\` \| string \| No \| Optional webhook URL to receive verification results asynchronously if the process takes longer than 10 seconds. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Admin Workspace Group Member

\*\*Slug:\*\* \`INSTANTLY\_WORKSPACE\_GROUP\_MEMBERS\_ADMIN\_GET\`

Tool to retrieve admin workspace details for the current sub workspace. Use when you need to get information about the admin workspace relationship, including workspace IDs and status.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Workspace Member by ID

\*\*Slug:\*\* \`INSTANTLY\_WORKSPACE\_MEMBERS\_GET\`

Tool to retrieve details of a specific workspace member by ID. Use when you need information about a member of a workspace with associated user details.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The unique identifier of the workspace member to retrieve (UUID format) \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add Workspace Member

\*\*Slug:\*\* \`INSTANTLY\_WORKSPACE\_MEMBERS\_POST\`

Tool to add a new member to workspace with email and role. Use when you need to invite a new team member to the workspace with specific role and permissions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`role\` \| string ("editor" \| "admin") \| Yes \| The role of the workspace member defining their access level. Available values: 'editor', 'admin'. Note: 'owner' role cannot be created via API \|
\| \`email\` \| string \| Yes \| Email address of the user to be added as a workspace member \|
\| \`permissions\` \| array \| No \| Permissions for this workspace member used to restrict access to certain sections (e.g., \['unibox.all'\]). Can be null or omitted \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|