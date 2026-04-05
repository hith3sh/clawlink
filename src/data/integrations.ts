export type IntegrationSetupMode = "manual" | "oauth";
export type IntegrationDashboardStatus = "available" | "coming-soon";
export type IntegrationRuntimeStatus = "live" | "planned";

export interface IntegrationCredentialField {
  key: string;
  label: string;
  type: "text" | "password" | "textarea";
  placeholder: string;
  required?: boolean;
  description?: string;
}

export interface IntegrationToolDefinition {
  name: string;
  description: string;
}

export interface Integration {
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  setupMode: IntegrationSetupMode;
  dashboardStatus: IntegrationDashboardStatus;
  runtimeStatus: IntegrationRuntimeStatus;
  setupGuide: string;
  credentialFields: IntegrationCredentialField[];
  tools: IntegrationToolDefinition[];
}

type BaseIntegration = Omit<
  Integration,
  "setupMode" | "dashboardStatus" | "runtimeStatus" | "setupGuide" | "credentialFields" | "tools"
>;

type IntegrationMetadata = Pick<
  Integration,
  "setupMode" | "dashboardStatus" | "runtimeStatus" | "setupGuide" | "credentialFields" | "tools"
>;

const apiKeyField = (
  key = "apiKey",
  label = "API Key",
  placeholder = "Paste your API key",
  description?: string,
): IntegrationCredentialField => ({
  key,
  label,
  type: "password",
  placeholder,
  required: true,
  description,
});

const tokenField = (
  key = "accessToken",
  label = "Access Token",
  placeholder = "Paste your access token",
  description?: string,
): IntegrationCredentialField => ({
  key,
  label,
  type: "password",
  placeholder,
  required: true,
  description,
});

const textField = (
  key: string,
  label: string,
  placeholder: string,
  description?: string,
): IntegrationCredentialField => ({
  key,
  label,
  type: "text",
  placeholder,
  required: true,
  description,
});

const textareaField = (
  key: string,
  label: string,
  placeholder: string,
  description?: string,
): IntegrationCredentialField => ({
  key,
  label,
  type: "textarea",
  placeholder,
  required: true,
  description,
});

const baseIntegrations: BaseIntegration[] = [
  { name: "Gmail", slug: "gmail", description: "Send, read, and manage emails", category: "Communication", icon: "SiGmail", color: "#EA4335" },
  { name: "Slack", slug: "slack", description: "Send messages and manage channels", category: "Communication", icon: "SiSlack", color: "#4A154B" },
  { name: "Discord", slug: "discord", description: "Send messages and manage servers", category: "Communication", icon: "SiDiscord", color: "#5865F2" },
  { name: "Microsoft Teams", slug: "microsoft-teams", description: "Chat, meetings, and team collaboration", category: "Communication", icon: "FaMicrosoft", color: "#6264A7" },
  { name: "Outlook", slug: "outlook", description: "Read mail, manage calendar, and browse contacts", category: "Communication", icon: "PiMicrosoftOutlookLogo", color: "#0078D4" },
  { name: "Telegram", slug: "telegram", description: "Send messages via Telegram Bot API", category: "Communication", icon: "SiTelegram", color: "#26A5E4" },
  { name: "WhatsApp Business", slug: "whatsapp-business", description: "Send messages via WhatsApp Business API", category: "Communication", icon: "SiWhatsapp", color: "#25D366" },
  { name: "Twilio", slug: "twilio", description: "Send SMS, make calls, and manage messaging", category: "Communication", icon: "SiTwilio", color: "#F22F46" },
  { name: "Resend", slug: "resend", description: "Send transactional and marketing emails", category: "Communication", icon: "SiResend", color: "#000000" },
  { name: "SendGrid", slug: "sendgrid", description: "Deliver transactional and marketing emails", category: "Communication", icon: "SiSendgrid", color: "#50B146" },
  { name: "Front", slug: "front", description: "Customer communication and collaboration", category: "Communication", icon: "SiFront", color: "#1E88E5" },
  { name: "Google Meet", slug: "google-meet", description: "Schedule and manage video meetings", category: "Communication", icon: "SiGooglemeet", color: "#00897B" },
  { name: "HubSpot", slug: "hubspot", description: "Manage contacts, deals, and pipelines", category: "CRM & Sales", icon: "SiHubspot", color: "#FF7A59" },
  { name: "Salesforce", slug: "salesforce", description: "Manage CRM data and workflows", category: "CRM & Sales", icon: "SiSalesforce", color: "#00A1E0" },
  { name: "Pipedrive", slug: "pipedrive", description: "Manage deals and sales pipelines", category: "CRM & Sales", icon: "SiPiped", color: "#1A1A1A" },
  { name: "Apollo", slug: "apollo", description: "Search leads and manage contacts", category: "CRM & Sales", icon: "SiApollographql", color: "#311C87" },
  { name: "Notion", slug: "notion", description: "Manage pages, databases, and blocks", category: "Productivity", icon: "SiNotion", color: "#000000" },
  { name: "Google Sheets", slug: "google-sheets", description: "Read and write spreadsheet data", category: "Productivity", icon: "SiGooglesheets", color: "#0F9D58" },
  { name: "Google Calendar", slug: "google-calendar", description: "Create and manage calendar events", category: "Productivity", icon: "SiGooglecalendar", color: "#4285F4" },
  { name: "Google Drive", slug: "google-drive", description: "Upload, search, and manage files", category: "Productivity", icon: "SiGoogledrive", color: "#4285F4" },
  { name: "Google Docs", slug: "google-docs", description: "Create and edit documents online", category: "Productivity", icon: "SiGoogledocs", color: "#4285F4" },
  { name: "Google Slides", slug: "google-slides", description: "Create and share presentations", category: "Productivity", icon: "SiGoogleslides", color: "#FBBC04" },
  { name: "Airtable", slug: "airtable", description: "Manage bases, tables, and records", category: "Productivity", icon: "SiAirtable", color: "#18BFFF" },
  { name: "Todoist", slug: "todoist", description: "Create and manage tasks and projects", category: "Productivity", icon: "SiTodoist", color: "#E44332" },
  { name: "Trello", slug: "trello", description: "Manage boards, lists, and cards", category: "Productivity", icon: "SiTrello", color: "#0079BF" },
  { name: "Asana", slug: "asana", description: "Track tasks, projects, and workflows", category: "Productivity", icon: "SiAsana", color: "#F06A6A" },
  { name: "ClickUp", slug: "clickup", description: "Manage tasks, docs, goals, and sprints", category: "Productivity", icon: "SiClickup", color: "#7B68EE" },
  { name: "Monday", slug: "monday", description: "Plan, track, and deliver team projects", category: "Productivity", icon: "SiMondaydotcom", color: "#FF3D57" },
  { name: "Confluence", slug: "confluence", description: "Create and organize team documentation", category: "Productivity", icon: "SiConfluence", color: "#0052CC" },
  { name: "Calendly", slug: "calendly", description: "Schedule meetings and manage bookings", category: "Productivity", icon: "SiCalendly", color: "#006BFF" },
  { name: "Cal.com", slug: "cal-com", description: "Open-source scheduling and booking", category: "Productivity", icon: "SiCaldotcom", color: "#292929" },
  { name: "Typeform", slug: "typeform", description: "Create interactive forms and surveys", category: "Productivity", icon: "SiTypeform", color: "#262627" },
  { name: "Coda", slug: "coda", description: "Collaborative docs, spreadsheets, and apps", category: "Productivity", icon: "SiCoda", color: "#F46B4E" },
  { name: "GitHub", slug: "github", description: "Manage repos, issues, and pull requests", category: "Developer Tools", icon: "SiGithub", color: "#181717" },
  { name: "GitLab", slug: "gitlab", description: "Manage repos and CI/CD pipelines", category: "Developer Tools", icon: "SiGitlab", color: "#FC6D26" },
  { name: "Jira", slug: "jira", description: "Create and manage issues and sprints", category: "Developer Tools", icon: "SiJira", color: "#0052CC" },
  { name: "Linear", slug: "linear", description: "Manage issues, projects, and cycles", category: "Developer Tools", icon: "SiLinear", color: "#5E6AD2" },
  { name: "Vercel", slug: "vercel", description: "Manage deployments and projects", category: "Developer Tools", icon: "SiVercel", color: "#000000" },
  { name: "Sentry", slug: "sentry", description: "Monitor errors and application performance", category: "Developer Tools", icon: "SiSentry", color: "#362D59" },
  { name: "Netlify", slug: "netlify", description: "Deploy and host web applications", category: "Developer Tools", icon: "SiNetlify", color: "#00C7B7" },
  { name: "Stripe", slug: "stripe", description: "Manage payments, customers, and invoices", category: "Payments & Finance", icon: "SiStripe", color: "#635BFF" },
  { name: "PayPal", slug: "paypal", description: "Process payments and manage transactions", category: "Payments & Finance", icon: "SiPaypal", color: "#003087" },
  { name: "QuickBooks", slug: "quickbooks", description: "Manage invoices and accounting", category: "Payments & Finance", icon: "SiQuickbooks", color: "#2CA01C" },
  { name: "Xero", slug: "xero", description: "Manage accounting, invoices, and expenses", category: "Payments & Finance", icon: "SiXero", color: "#13B5EA" },
  { name: "Square", slug: "square", description: "Process payments and manage POS", category: "Payments & Finance", icon: "SiSquare", color: "#3E4348" },
  { name: "Mailchimp", slug: "mailchimp", description: "Create email campaigns and manage audiences", category: "Marketing", icon: "SiMailchimp", color: "#FFE01B" },
  { name: "Klaviyo", slug: "klaviyo", description: "Email and SMS marketing automation", category: "Marketing", icon: "SiKlaviyo", color: "#F5C518" },
  { name: "Buffer", slug: "buffer", description: "Schedule and publish social media content", category: "Marketing", icon: "SiBuffer", color: "#232323" },
  { name: "YouTube", slug: "youtube", description: "Upload videos and manage channels", category: "Social Media", icon: "SiYoutube", color: "#FF0000" },
  { name: "LinkedIn", slug: "linkedin", description: "Post updates and manage connections", category: "Social Media", icon: "FaLinkedin", color: "#0A66C2" },
  { name: "Instagram", slug: "instagram", description: "Publish posts and manage media", category: "Social Media", icon: "SiInstagram", color: "#E4405F" },
  { name: "Vimeo", slug: "vimeo", description: "Upload, manage, and share videos", category: "Social Media", icon: "SiVimeo", color: "#1AB7EA" },
  { name: "Shopify", slug: "shopify", description: "Manage products, orders, and customers", category: "E-commerce", icon: "SiShopify", color: "#7AB55C" },
  { name: "WooCommerce", slug: "woocommerce", description: "Manage store products and orders", category: "E-commerce", icon: "SiWoocommerce", color: "#96588A" },
  { name: "Dropbox", slug: "dropbox", description: "Store, sync, and share files", category: "Storage & Databases", icon: "SiDropbox", color: "#0061FF" },
  { name: "Supabase", slug: "supabase", description: "Query and manage Postgres databases", category: "Storage & Databases", icon: "SiSupabase", color: "#3FCF8E" },
  { name: "Firebase", slug: "firebase", description: "Manage Firestore, Auth, and storage", category: "Storage & Databases", icon: "SiFirebase", color: "#FFCA28" },
  { name: "OpenAI", slug: "openai", description: "Generate text, images, and embeddings", category: "AI & ML", icon: "SiOpenai", color: "#412991" },
  { name: "ElevenLabs", slug: "elevenlabs", description: "Generate speech and voice cloning", category: "AI & ML", icon: "SiElevenlabs", color: "#000000" },
  { name: "PostHog", slug: "posthog", description: "Track user behavior and feature flags", category: "Data & Analytics", icon: "SiPosthog", color: "#000000" },
];

const integrationMetadata: Record<string, IntegrationMetadata> = {
  gmail: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "live",
    setupGuide: "Gmail needs Google OAuth. The worker handler is live, but the dashboard OAuth handshake is not wired yet.",
    credentialFields: [],
    tools: [
      { name: "send_email", description: "Send a Gmail message" },
      { name: "list_emails", description: "List recent inbox messages" },
      { name: "get_email", description: "Fetch a single message by ID" },
      { name: "create_draft", description: "Create a draft in Gmail" },
      { name: "delete_email", description: "Move a message to trash" },
    ],
  },
  slack: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Create a Slack app, install it to your workspace, and paste the bot token here.",
    credentialFields: [
      tokenField("botToken", "Bot Token", "xoxb-...", "Use the Bot User OAuth token from your Slack app."),
    ],
    tools: [
      { name: "send_message", description: "Post a message to a Slack channel" },
      { name: "list_channels", description: "List channels visible to the bot" },
    ],
  },
  discord: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Create a Discord bot, invite it to your server, and store the bot token here.",
    credentialFields: [
      tokenField("botToken", "Bot Token", "Paste your Discord bot token"),
    ],
    tools: [],
  },
  "microsoft-teams": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Microsoft Teams requires Microsoft OAuth and tenant-aware setup, which is not wired yet.",
    credentialFields: [],
    tools: [],
  },
  outlook: {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect Outlook with Microsoft OAuth to grant ClawLink access to your email, calendar, and contacts.",
    credentialFields: [],
    tools: [
      { name: "list_messages", description: "List recent Outlook messages" },
      { name: "get_message", description: "Fetch a single Outlook message by ID" },
      { name: "send_email", description: "Send an email from Outlook" },
      { name: "list_events", description: "List upcoming Outlook calendar events" },
      { name: "create_event", description: "Create an Outlook calendar event" },
      { name: "list_contacts", description: "List Outlook contacts" },
    ],
  },
  telegram: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Create a bot with BotFather and paste the Telegram bot token here.",
    credentialFields: [
      tokenField("botToken", "Bot Token", "123456:ABCDEF...", "Telegram bot token from BotFather."),
    ],
    tools: [],
  },
  "whatsapp-business": {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "WhatsApp Business requires the WhatsApp Business API and a verified phone number.",
    credentialFields: [],
    tools: [],
  },
  twilio: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Twilio requires an Account SID and Auth Token from your Twilio console.",
    credentialFields: [],
    tools: [],
  },
  resend: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Resend requires an API key from your Resend dashboard.",
    credentialFields: [],
    tools: [],
  },
  sendgrid: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "SendGrid requires an API key from your SendGrid dashboard.",
    credentialFields: [],
    tools: [],
  },
  front: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Front requires a personal API token from your Front settings.",
    credentialFields: [],
    tools: [],
  },
  "google-meet": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Google Meet requires Google OAuth with calendar scopes.",
    credentialFields: [],
    tools: [],
  },
  hubspot: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use a HubSpot private app token to connect your portal.",
    credentialFields: [
      tokenField("privateAppToken", "Private App Token", "pat-...", "Create a private app in HubSpot and copy its access token."),
    ],
    tools: [],
  },
  salesforce: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Salesforce will require OAuth plus instance discovery. This route is reserved for that flow.",
    credentialFields: [],
    tools: [],
  },
  pipedrive: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Create a personal API token in Pipedrive and store it here.",
    credentialFields: [apiKeyField("apiToken", "API Token", "Paste your Pipedrive API token")],
    tools: [],
  },
  apollo: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Create an Apollo API key and store it here for future worker support.",
    credentialFields: [apiKeyField()],
    tools: [],
  },
  notion: {
    setupMode: "oauth",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect your Notion workspace through the hosted OAuth flow and approve the pages ClawLink can access.",
    credentialFields: [],
    tools: [
      { name: "notion_search", description: "Search pages and databases in Notion" },
      { name: "notion_get_page", description: "Get a page by ID" },
      { name: "notion_create_page", description: "Create a new page" },
      { name: "notion_query_database", description: "Query a database" },
      { name: "notion_create_database", description: "Create a new database" },
      { name: "notion_append_blocks", description: "Append blocks to a page" },
    ],
  },
  "google-sheets": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Google Sheets uses Google OAuth. The connect flow will land alongside the broader Google setup.",
    credentialFields: [],
    tools: [],
  },
  "google-calendar": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Google Calendar uses Google OAuth. The dashboard flow is planned but not implemented.",
    credentialFields: [],
    tools: [],
  },
  "google-drive": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Google Drive uses Google OAuth. The dashboard flow is planned but not implemented.",
    credentialFields: [],
    tools: [],
  },
  "google-docs": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Google Docs uses Google OAuth. The dashboard flow is planned but not implemented.",
    credentialFields: [],
    tools: [],
  },
  "google-slides": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Google Slides uses Google OAuth. The dashboard flow is planned but not implemented.",
    credentialFields: [],
    tools: [],
  },
  airtable: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use a personal access token and the Airtable base you want the worker to operate on.",
    credentialFields: [
      tokenField("personalAccessToken", "Personal Access Token", "pat..."),
      textField("baseId", "Base ID", "appXXXXXXXXXXXXXX"),
    ],
    tools: [],
  },
  todoist: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Create a Todoist API token and store it here.",
    credentialFields: [tokenField("apiToken", "API Token", "Paste your Todoist API token")],
    tools: [],
  },
  trello: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Trello requires an API key and token from your Trello account settings.",
    credentialFields: [],
    tools: [],
  },
  asana: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Asana requires a personal access token from your As account settings.",
    credentialFields: [],
    tools: [],
  },
  clickup: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "ClickUp requires a personal API token from your ClickUp settings.",
    credentialFields: [],
    tools: [],
  },
  monday: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Monday.com requires an API token from your account settings.",
    credentialFields: [],
    tools: [],
  },
  confluence: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Confluence requires an API token and site URL from your Atlassian account.",
    credentialFields: [],
    tools: [],
  },
  calendly: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Calendly requires a personal access token from your Calendly account.",
    credentialFields: [],
    tools: [],
  },
  "cal-com": {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Cal.com requires an API key from your account settings.",
    credentialFields: [],
    tools: [],
  },
  typeform: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Typeform requires a personal access token from your account settings.",
    credentialFields: [],
    tools: [],
  },
  coda: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Coda requires an API token from your Coda account settings.",
    credentialFields: [],
    tools: [],
  },
  github: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Use a GitHub personal access token with repo access for issues and repository actions.",
    credentialFields: [tokenField("accessToken", "Personal Access Token", "ghp_...")],
    tools: [
      { name: "list_repos", description: "List repositories visible to the token" },
      { name: "list_issues", description: "List issues from a repository" },
      { name: "create_issue", description: "Create a repository issue" },
    ],
  },
  gitlab: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use a GitLab personal access token.",
    credentialFields: [tokenField("accessToken", "Personal Access Token", "glpat-...")],
    tools: [],
  },
  jira: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use a Jira API token together with your Atlassian email and site URL.",
    credentialFields: [
      textField("siteUrl", "Site URL", "https://your-org.atlassian.net"),
      textField("email", "Atlassian Email", "name@example.com"),
      tokenField("apiToken", "API Token", "Paste your Atlassian API token"),
    ],
    tools: [],
  },
  linear: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use a Linear personal API key.",
    credentialFields: [apiKeyField("apiKey", "API Key", "lin_api_...")],
    tools: [],
  },
  vercel: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use a Vercel access token created from your account settings.",
    credentialFields: [tokenField("accessToken", "Access Token", "Paste your Vercel access token")],
    tools: [],
  },
  sentry: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Sentry requires an auth token from your Sentry account settings.",
    credentialFields: [],
    tools: [],
  },
  netlify: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Netlify requires a personal access token from your Netlify account.",
    credentialFields: [],
    tools: [],
  },
  stripe: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use your Stripe secret key for server-side access.",
    credentialFields: [apiKeyField("secretKey", "Secret Key", "sk_live_...")],
    tools: [],
  },
  paypal: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use a PayPal client ID and secret from your developer dashboard.",
    credentialFields: [
      textField("clientId", "Client ID", "Paste your PayPal client ID"),
      tokenField("clientSecret", "Client Secret", "Paste your PayPal client secret"),
    ],
    tools: [],
  },
  quickbooks: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "QuickBooks uses OAuth and company selection. That flow is planned but not built.",
    credentialFields: [],
    tools: [],
  },
  xero: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Xero uses OAuth 2.0. The dashboard flow is planned but not built.",
    credentialFields: [],
    tools: [],
  },
  square: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Square requires an access token from your Square Developer Dashboard.",
    credentialFields: [],
    tools: [],
  },
  mailchimp: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Mailchimp requires an API key from your account settings.",
    credentialFields: [],
    tools: [],
  },
  klaviyo: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Klaviyo requires a private API key from your account settings.",
    credentialFields: [],
    tools: [],
  },
  buffer: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Buffer requires an access token from your Buffer account.",
    credentialFields: [],
    tools: [],
  },
  youtube: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "YouTube actions require Google OAuth because the API scopes are tied to a Google account.",
    credentialFields: [],
    tools: [],
  },
  linkedin: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "LinkedIn posting requires OAuth with user scopes. That dashboard flow is not ready yet.",
    credentialFields: [],
    tools: [],
  },
  instagram: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Instagram uses Meta OAuth and page linkage, which is not wired into the dashboard yet.",
    credentialFields: [],
    tools: [],
  },
  vimeo: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Vimeo requires OAuth 2.0 authentication.",
    credentialFields: [],
    tools: [],
  },
  shopify: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use the shop domain and Admin API access token from your custom app.",
    credentialFields: [
      textField("storeDomain", "Store Domain", "your-store.myshopify.com"),
      tokenField("adminApiToken", "Admin API Token", "shpat_..."),
    ],
    tools: [],
  },
  woocommerce: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use your WooCommerce store URL plus consumer key and secret.",
    credentialFields: [
      textField("storeUrl", "Store URL", "https://shop.example.com"),
      textField("consumerKey", "Consumer Key", "ck_..."),
      tokenField("consumerSecret", "Consumer Secret", "cs_..."),
    ],
    tools: [],
  },
  dropbox: {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Dropbox uses OAuth 2.0. The dashboard flow is planned but not built.",
    credentialFields: [],
    tools: [],
  },
  supabase: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use your Supabase project URL and service role key for backend automation.",
    credentialFields: [
      textField("projectUrl", "Project URL", "https://xyzcompany.supabase.co"),
      apiKeyField("serviceRoleKey", "Service Role Key", "Paste your Supabase service role key"),
    ],
    tools: [],
  },
  firebase: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Paste the Firebase service account JSON so the worker can authenticate server-side.",
    credentialFields: [
      textareaField("serviceAccountJson", "Service Account JSON", "{ ... }", "Paste the full service account JSON payload."),
    ],
    tools: [],
  },
  openai: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Store your OpenAI API key for future model and embeddings calls.",
    credentialFields: [apiKeyField("apiKey", "API Key", "sk-...")],
    tools: [],
  },
  elevenlabs: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use your ElevenLabs API key.",
    credentialFields: [apiKeyField("apiKey", "API Key", "Paste your ElevenLabs API key")],
    tools: [],
  },
  posthog: {
    setupMode: "manual",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "PostHog requires a personal API key from your instance settings.",
    credentialFields: [],
    tools: [],
  },
};

const defaultMetadata: IntegrationMetadata = {
  setupMode: "manual",
  dashboardStatus: "coming-soon",
  runtimeStatus: "planned",
  setupGuide: "Dashboard setup for this integration is not configured yet.",
  credentialFields: [],
  tools: [],
};

export const integrations: Integration[] = baseIntegrations.map((integration) => ({
  ...integration,
  ...(integrationMetadata[integration.slug] ?? defaultMetadata),
}));

export const categories = [...new Set(integrations.map((integration) => integration.category))];

export function getIntegrationBySlug(slug: string): Integration | undefined {
  return integrations.find((integration) => integration.slug === slug);
}
