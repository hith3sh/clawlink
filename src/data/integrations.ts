export interface Integration {
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string; // key into iconMap
  color: string; // brand color for the icon
}

export const integrations: Integration[] = [
  // Communication
  { name: "Gmail", slug: "gmail", description: "Send, read, and manage emails", category: "Communication", icon: "SiGmail", color: "#EA4335" },
  { name: "Slack", slug: "slack", description: "Send messages and manage channels", category: "Communication", icon: "SiSlack", color: "#4A154B" },
  { name: "Discord", slug: "discord", description: "Send messages and manage servers", category: "Communication", icon: "SiDiscord", color: "#5865F2" },
  { name: "Microsoft Teams", slug: "microsoft-teams", description: "Send messages and manage teams", category: "Communication", icon: "FaMicrosoft", color: "#6264A7" },
  { name: "Telegram", slug: "telegram", description: "Send messages via Telegram Bot API", category: "Communication", icon: "SiTelegram", color: "#26A5E4" },

  // CRM & Sales
  { name: "Apollo", slug: "apollo", description: "Search leads and manage contacts", category: "CRM & Sales", icon: "SiApollographql", color: "#311C87" },
  { name: "HubSpot", slug: "hubspot", description: "Manage contacts, deals, and pipelines", category: "CRM & Sales", icon: "SiHubspot", color: "#FF7A59" },
  { name: "Salesforce", slug: "salesforce", description: "Manage CRM data and workflows", category: "CRM & Sales", icon: "SiSalesforce", color: "#00A1E0" },
  { name: "Pipedrive", slug: "pipedrive", description: "Manage deals and sales pipelines", category: "CRM & Sales", icon: "SiPiped", color: "#1A1A1A" },

  // Content & CMS
  { name: "WordPress", slug: "wordpress", description: "Create and manage posts and pages", category: "Content & CMS", icon: "SiWordpress", color: "#21759B" },
  { name: "Webflow", slug: "webflow", description: "Manage CMS collections and site content", category: "Content & CMS", icon: "SiWebflow", color: "#4353FF" },
  { name: "Ghost", slug: "ghost", description: "Publish and manage blog content", category: "Content & CMS", icon: "SiGhost", color: "#15171A" },
  { name: "Contentful", slug: "contentful", description: "Manage structured content entries", category: "Content & CMS", icon: "SiContentful", color: "#2478CC" },

  // Social Media
  { name: "YouTube", slug: "youtube", description: "Upload videos and manage channels", category: "Social Media", icon: "SiYoutube", color: "#FF0000" },
  { name: "Twitter / X", slug: "twitter", description: "Post tweets and manage account", category: "Social Media", icon: "SiX", color: "#000000" },
  { name: "LinkedIn", slug: "linkedin", description: "Post updates and manage connections", category: "Social Media", icon: "FaLinkedin", color: "#0A66C2" },
  { name: "Instagram", slug: "instagram", description: "Publish posts and manage media", category: "Social Media", icon: "SiInstagram", color: "#E4405F" },

  // Productivity
  { name: "Google Sheets", slug: "google-sheets", description: "Read and write spreadsheet data", category: "Productivity", icon: "SiGooglesheets", color: "#0F9D58" },
  { name: "Google Calendar", slug: "google-calendar", description: "Create and manage calendar events", category: "Productivity", icon: "SiGooglecalendar", color: "#4285F4" },
  { name: "Google Drive", slug: "google-drive", description: "Upload, search, and manage files", category: "Productivity", icon: "SiGoogledrive", color: "#4285F4" },
  { name: "Notion", slug: "notion", description: "Manage pages, databases, and blocks", category: "Productivity", icon: "SiNotion", color: "#000000" },
  { name: "Airtable", slug: "airtable", description: "Manage bases, tables, and records", category: "Productivity", icon: "SiAirtable", color: "#18BFFF" },
  { name: "Todoist", slug: "todoist", description: "Create and manage tasks and projects", category: "Productivity", icon: "SiTodoist", color: "#E44332" },

  // Developer Tools
  { name: "GitHub", slug: "github", description: "Manage repos, issues, and pull requests", category: "Developer Tools", icon: "SiGithub", color: "#181717" },
  { name: "GitLab", slug: "gitlab", description: "Manage repos and CI/CD pipelines", category: "Developer Tools", icon: "SiGitlab", color: "#FC6D26" },
  { name: "Jira", slug: "jira", description: "Create and manage issues and sprints", category: "Developer Tools", icon: "SiJira", color: "#0052CC" },
  { name: "Linear", slug: "linear", description: "Manage issues, projects, and cycles", category: "Developer Tools", icon: "SiLinear", color: "#5E6AD2" },
  { name: "Vercel", slug: "vercel", description: "Manage deployments and projects", category: "Developer Tools", icon: "SiVercel", color: "#000000" },

  // Payments & Finance
  { name: "Stripe", slug: "stripe", description: "Manage payments, customers, and invoices", category: "Payments & Finance", icon: "SiStripe", color: "#635BFF" },
  { name: "PayPal", slug: "paypal", description: "Process payments and manage transactions", category: "Payments & Finance", icon: "SiPaypal", color: "#003087" },
  { name: "QuickBooks", slug: "quickbooks", description: "Manage invoices and accounting", category: "Payments & Finance", icon: "SiQuickbooks", color: "#2CA01C" },

  // Data & Analytics
  { name: "Google Analytics", slug: "google-analytics", description: "Fetch analytics data and reports", category: "Data & Analytics", icon: "SiGoogleanalytics", color: "#E37400" },
  { name: "Mixpanel", slug: "mixpanel", description: "Track events and user analytics", category: "Data & Analytics", icon: "SiMixpanel", color: "#7856FF" },
  { name: "Segment", slug: "segment", description: "Manage event tracking and data routing", category: "Data & Analytics", icon: "SiSegment", color: "#52BD95" },

  // Storage & Databases
  { name: "AWS S3", slug: "aws-s3", description: "Upload and manage files in S3 buckets", category: "Storage & Databases", icon: "SiAws", color: "#FF9900" },
  { name: "Supabase", slug: "supabase", description: "Query and manage Postgres databases", category: "Storage & Databases", icon: "SiSupabase", color: "#3FCF8E" },
  { name: "Firebase", slug: "firebase", description: "Manage Firestore, Auth, and storage", category: "Storage & Databases", icon: "SiFirebase", color: "#FFCA28" },

  // E-commerce
  { name: "Shopify", slug: "shopify", description: "Manage products, orders, and customers", category: "E-commerce", icon: "SiShopify", color: "#7AB55C" },
  { name: "WooCommerce", slug: "woocommerce", description: "Manage store products and orders", category: "E-commerce", icon: "SiWoocommerce", color: "#96588A" },

  // AI & ML
  { name: "OpenAI", slug: "openai", description: "Generate text, images, and embeddings", category: "AI & ML", icon: "SiOpenai", color: "#412991" },
  { name: "Replicate", slug: "replicate", description: "Run ML models via API", category: "AI & ML", icon: "SiReplicate", color: "#000000" },
  { name: "ElevenLabs", slug: "elevenlabs", description: "Generate speech and voice cloning", category: "AI & ML", icon: "SiElevenlabs", color: "#000000" },
];

export const categories = [...new Set(integrations.map((i) => i.category))];
