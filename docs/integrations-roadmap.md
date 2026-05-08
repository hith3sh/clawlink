# Integration Coverage Roadmap

**Goal:** Close the gap between ClawLink and Maton so ClawLink supports every integration that Maton offers.

## Current State (as of 2026-05-08)

| Platform | Integration Count |
|----------|-----------------|
| Maton    | 150             |
| ClawLink | ~85             |

## Missing in ClawLink (from Maton)

These **100 integrations** are available in Maton but not yet in ClawLink.

### Productivity & Workspace
- Asana (ClawLink has)
- Basecamp
- Baserow
- ClickUp (ClawLink has)
- Clockify
- Coda
- Confluence
- Monday (ClawLink has)
- Motion (ClawLink has)
- Netlify
- Notion (ClawLink has)
- Sunsama
- Todoist
- Trello (ClawLink has)
- Wrike

### Communication
- Buffer
- Cal.com
- ClickSend
- Front
- Mailgun
- Slack (ClawLink has)
- Telegram Bot
- Twilio (ClawLink has)
- WATI
- WhatsApp Business

### CRM & Sales
- ActiveCampaign (ClawLink has)
- Apollo (ClawLink has)
- Attio
- Clio
- HubSpot (ClawLink has)
- Keap
- Pipedrive
- Salesforce (ClawLink has)
- Twenty
- Zoho Bigin
- Zoho Bookings
- Zoho Calendar
- Zoho CRM
- Zoho People
- Zoho Projects
- Zoho Recruit

### Marketing & Email
- Beehiiv
- Brevo (ClawLink has)
- Constant Contact
- GetResponse
- Instantly (ClawLink has)
- Klaviyo (ClawLink has)
- Kit (ClawLink has)
- Lemlist (ClawLink has)
- Mailchimp (ClawLink has)
- MailerLite (ClawLink has)
- ManyChat
- Omnisend (ClawLink has)
- Postmark (ClawLink has)
- Resend (ClawLink has)
- SendGrid (ClawLink has)
- Systeme.io

### Accounting & Finance
- Chargebee
- QuickBooks (ClawLink has)
- Square
- Stripe (ClawLink has)
- Xero (ClawLink has)
- Zoho Books (ClawLink has)
- Zoho Inventory

### Google (Additional / Split)
- Google Analytics Admin *(Maton splits Admin/Data; ClawLink has combined)*
- Google Analytics Data *(see above)*
- Google Apps Script
- Google BigQuery
- Google Calendar (ClawLink has)
- Google Classroom
- Google Contacts
- Google Docs (ClawLink has)
- Google Drive (ClawLink has)
- Google Forms (ClawLink has)
- Google Merchant Center
- Google Meet (ClawLink has)
- Google Play
- Google Search Console (ClawLink has)
- Google Sheets (ClawLink has)
- Google Slides (ClawLink has)
- Google Tag Manager
- Google Tasks
- Google Workspace Admin
- YouTube (ClawLink has)
- YouTube Analytics *(Maton split)*
- YouTube Reporting *(Maton split)*
- Gmail (ClawLink has)

### Social Media
- LinkedIn (ClawLink has)
- Snapchat (ClawLink has)
- TikTok (ClawLink has)
- Twitter (ClawLink has)
- YouTube *(see Google)*

### Advertising
- Facebook (ClawLink has)
- Google Ads (ClawLink has)
- Instagram (ClawLink has)
- Meta Ads (ClawLink has)
- Reddit Ads (ClawLink has)

### Storage & Files
- Box (ClawLink has)
- Dropbox (ClawLink has)
- Dropbox Business *(Maton separate; ClawLink only has Dropbox)*
- OneDrive (ClawLink has)
- SharePoint

### Video & Audio
- ElevenLabs (ClawLink has)
- Fathom
- Fireflies
- Vimeo

### Website Builders & Hosting
- Squarespace
- Vercel
- WooCommerce
- WordPress

### Databases & Developer Tools
- Apify
- Firebase
- GitHub
- Kaggle
- Supabase
- Vercex *(Maton "Vercex" is likely a typo for Vercel; see above)*

### Events & Scheduling
- Acuity Scheduling
- Cal.com *(see Communication)*
- Calendly (ClawLink has)
- Eventbrite

### Forms & Surveys
- Cognito Forms
- Google Forms (ClawLink has)
- Jotform
- Tally
- Typeform

### Support & HR
- BambooHR (ClawLink has)
- CompanyCam
- Freshdesk (ClawLink has)
- Intercom (ClawLink has)
- Jobber
- Zendesk (ClawLink has)

### Search, Data & AI
- Brave Search
- DataForSEO (ClawLink has)
- Exa
- Firecrawl
- Granola
- Grafana
- Make
- Manus
- Memelord
- Semrush (ClawLink has)
- Tavily

### Other Tools
- Ahrefs (ClawLink has)
- Canva (ClawLink has)
- fal
- Gumroad (ClawLink has)
- HighLevel (ClawLink has)
- Kibana
- Linear
- Microsoft Excel
- Microsoft Teams
- Microsoft To Do
- OneNote
- PDF.co
- Podio
- PostHog
- Quo
- Reducto
- Sentry
- SignNow

## Extras in ClawLink (not in Maton)

These **27 integrations** are unique to ClawLink today and should be preserved.

- Ahrefs
- BambooHR
- Bitbucket
- Canva
- DataForSEO
- DocuSign
- Facebook
- Figma
- FreeAgent
- FreshBooks
- Freshdesk
- Instagram
- Intercom
- Meta Ads
- Omnisend
- PandaDoc
- PhantomBuster
- Postiz
- Postmark
- Reddit Ads
- Replicate
- Semrush
- Shopify
- TikTok
- Twitter
- Webflow
- Zendesk

## Naming / Coverage Differences

| Topic | Maton | ClawLink |
|-------|-------|----------|
| Google Analytics | Split into `Analytics Admin` + `Analytics Data` | Combined into `google-analytics` |
| YouTube | Split into `YouTube`, `YouTube Analytics`, `YouTube Reporting` | Combined into `youtube` |
| Dropbox | `Dropbox` + `Dropbox Business` | Only `dropbox` |
| Zoho | 10 separate apps (Bigin, Books, Bookings, Calendar, CRM, Inventory, Mail, People, Projects, Recruit) | Only `zoho-books` |
