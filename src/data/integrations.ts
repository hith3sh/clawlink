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
  { name: "Microsoft Teams", slug: "microsoft-teams", description: "Send messages and manage teams", category: "Communication", icon: "FaMicrosoft", color: "#6264A7" },
  { name: "Telegram", slug: "telegram", description: "Send messages via Telegram Bot API", category: "Communication", icon: "SiTelegram", color: "#26A5E4" },
  { name: "Apollo", slug: "apollo", description: "Search leads and manage contacts", category: "CRM & Sales", icon: "SiApollographql", color: "#311C87" },
  { name: "HubSpot", slug: "hubspot", description: "Manage contacts, deals, and pipelines", category: "CRM & Sales", icon: "SiHubspot", color: "#FF7A59" },
  { name: "Salesforce", slug: "salesforce", description: "Manage CRM data and workflows", category: "CRM & Sales", icon: "SiSalesforce", color: "#00A1E0" },
  { name: "Pipedrive", slug: "pipedrive", description: "Manage deals and sales pipelines", category: "CRM & Sales", icon: "SiPiped", color: "#1A1A1A" },
  { name: "WordPress", slug: "wordpress", description: "Create and manage posts and pages", category: "Content & CMS", icon: "SiWordpress", color: "#21759B" },
  { name: "Webflow", slug: "webflow", description: "Manage CMS collections and site content", category: "Content & CMS", icon: "SiWebflow", color: "#4353FF" },
  { name: "Ghost", slug: "ghost", description: "Publish and manage blog content", category: "Content & CMS", icon: "SiGhost", color: "#15171A" },
  { name: "Contentful", slug: "contentful", description: "Manage structured content entries", category: "Content & CMS", icon: "SiContentful", color: "#2478CC" },
  { name: "YouTube", slug: "youtube", description: "Upload videos and manage channels", category: "Social Media", icon: "SiYoutube", color: "#FF0000" },
  { name: "Twitter / X", slug: "twitter", description: "Post tweets and manage account", category: "Social Media", icon: "SiX", color: "#000000" },
  { name: "LinkedIn", slug: "linkedin", description: "Post updates and manage connections", category: "Social Media", icon: "FaLinkedin", color: "#0A66C2" },
  { name: "Instagram", slug: "instagram", description: "Publish posts and manage media", category: "Social Media", icon: "SiInstagram", color: "#E4405F" },
  { name: "Google Sheets", slug: "google-sheets", description: "Read and write spreadsheet data", category: "Productivity", icon: "SiGooglesheets", color: "#0F9D58" },
  { name: "Google Calendar", slug: "google-calendar", description: "Create and manage calendar events", category: "Productivity", icon: "SiGooglecalendar", color: "#4285F4" },
  { name: "Google Drive", slug: "google-drive", description: "Upload, search, and manage files", category: "Productivity", icon: "SiGoogledrive", color: "#4285F4" },
  { name: "Notion", slug: "notion", description: "Manage pages, databases, and blocks", category: "Productivity", icon: "SiNotion", color: "#000000" },
  { name: "Airtable", slug: "airtable", description: "Manage bases, tables, and records", category: "Productivity", icon: "SiAirtable", color: "#18BFFF" },
  { name: "Todoist", slug: "todoist", description: "Create and manage tasks and projects", category: "Productivity", icon: "SiTodoist", color: "#E44332" },
  { name: "GitHub", slug: "github", description: "Manage repos, issues, and pull requests", category: "Developer Tools", icon: "SiGithub", color: "#181717" },
  { name: "GitLab", slug: "gitlab", description: "Manage repos and CI/CD pipelines", category: "Developer Tools", icon: "SiGitlab", color: "#FC6D26" },
  { name: "Jira", slug: "jira", description: "Create and manage issues and sprints", category: "Developer Tools", icon: "SiJira", color: "#0052CC" },
  { name: "Linear", slug: "linear", description: "Manage issues, projects, and cycles", category: "Developer Tools", icon: "SiLinear", color: "#5E6AD2" },
  { name: "Vercel", slug: "vercel", description: "Manage deployments and projects", category: "Developer Tools", icon: "SiVercel", color: "#000000" },
  { name: "Stripe", slug: "stripe", description: "Manage payments, customers, and invoices", category: "Payments & Finance", icon: "SiStripe", color: "#635BFF" },
  { name: "PayPal", slug: "paypal", description: "Process payments and manage transactions", category: "Payments & Finance", icon: "SiPaypal", color: "#003087" },
  { name: "QuickBooks", slug: "quickbooks", description: "Manage invoices and accounting", category: "Payments & Finance", icon: "SiQuickbooks", color: "#2CA01C" },
  { name: "Google Analytics", slug: "google-analytics", description: "Fetch analytics data and reports", category: "Data & Analytics", icon: "SiGoogleanalytics", color: "#E37400" },
  { name: "Mixpanel", slug: "mixpanel", description: "Track events and user analytics", category: "Data & Analytics", icon: "SiMixpanel", color: "#7856FF" },
  { name: "Segment", slug: "segment", description: "Manage event tracking and data routing", category: "Data & Analytics", icon: "SiSegment", color: "#52BD95" },
  { name: "AWS S3", slug: "aws-s3", description: "Upload and manage files in S3 buckets", category: "Storage & Databases", icon: "SiAws", color: "#FF9900" },
  { name: "Supabase", slug: "supabase", description: "Query and manage Postgres databases", category: "Storage & Databases", icon: "SiSupabase", color: "#3FCF8E" },
  { name: "Firebase", slug: "firebase", description: "Manage Firestore, Auth, and storage", category: "Storage & Databases", icon: "SiFirebase", color: "#FFCA28" },
  { name: "Shopify", slug: "shopify", description: "Manage products, orders, and customers", category: "E-commerce", icon: "SiShopify", color: "#7AB55C" },
  { name: "WooCommerce", slug: "woocommerce", description: "Manage store products and orders", category: "E-commerce", icon: "SiWoocommerce", color: "#96588A" },
  { name: "OpenAI", slug: "openai", description: "Generate text, images, and embeddings", category: "AI & ML", icon: "SiOpenai", color: "#412991" },
  { name: "Replicate", slug: "replicate", description: "Run ML models via API", category: "AI & ML", icon: "SiReplicate", color: "#000000" },
  { name: "ElevenLabs", slug: "elevenlabs", description: "Generate speech and voice cloning", category: "AI & ML", icon: "SiElevenlabs", color: "#000000" },
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
  apollo: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Create an Apollo API key and store it here for future worker support.",
    credentialFields: [apiKeyField()],
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
  wordpress: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use a WordPress application password with your site URL and username.",
    credentialFields: [
      textField("siteUrl", "Site URL", "https://example.com"),
      textField("username", "Username", "wordpress-admin"),
      tokenField("applicationPassword", "Application Password", "Paste your WordPress application password"),
    ],
    tools: [],
  },
  webflow: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Create a Webflow API token and store it here.",
    credentialFields: [tokenField("accessToken", "API Token", "wf_...")],
    tools: [],
  },
  ghost: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use a Ghost Admin API key and your site URL.",
    credentialFields: [
      textField("siteUrl", "Site URL", "https://your-publication.com"),
      tokenField("adminApiKey", "Admin API Key", "Paste your Ghost Admin API key"),
    ],
    tools: [],
  },
  contentful: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Store a Contentful management token and the target space ID.",
    credentialFields: [
      tokenField("managementToken", "Management Token", "Paste your Contentful token"),
      textField("spaceId", "Space ID", "Your Contentful space ID"),
    ],
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
  twitter: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Provide the X API bearer token from your developer app.",
    credentialFields: [tokenField("bearerToken", "Bearer Token", "Paste your X API bearer token")],
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
  "google-analytics": {
    setupMode: "oauth",
    dashboardStatus: "coming-soon",
    runtimeStatus: "planned",
    setupGuide: "Google Analytics uses Google OAuth and property selection. The dashboard flow is not ready yet.",
    credentialFields: [],
    tools: [],
  },
  mixpanel: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Store a Mixpanel service account username and secret or a project token, depending on your setup.",
    credentialFields: [
      textField("projectId", "Project ID", "Your Mixpanel project ID"),
      apiKeyField("serviceAccountSecret", "Service Account Secret", "Paste your Mixpanel secret"),
    ],
    tools: [],
  },
  segment: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Store your Segment API access token here.",
    credentialFields: [tokenField("accessToken", "Access Token", "Paste your Segment access token")],
    tools: [],
  },
  "aws-s3": {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Store the IAM access key pair plus the target AWS region.",
    credentialFields: [
      textField("accessKeyId", "Access Key ID", "AKIA..."),
      tokenField("secretAccessKey", "Secret Access Key", "Paste your AWS secret"),
      textField("region", "Region", "us-east-1"),
      textField("bucket", "Default Bucket", "optional-bucket-name", "Optional, but useful if you want a default bucket."),
    ],
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
  openai: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Store your OpenAI API key for future model and embeddings calls.",
    credentialFields: [apiKeyField("apiKey", "API Key", "sk-...")],
    tools: [],
  },
  replicate: {
    setupMode: "manual",
    dashboardStatus: "available",
    runtimeStatus: "planned",
    setupGuide: "Use your Replicate API token.",
    credentialFields: [tokenField("apiToken", "API Token", "r8_...")],
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
