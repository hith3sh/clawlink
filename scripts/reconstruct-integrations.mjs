import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const integrationsPath = path.join(repoRoot, "src/data/integrations.ts");
const generatedDir = path.join(repoRoot, "src/generated/composio-manifests");

// Data for missing base integrations
const newIntegrations = [
  { slug: "affinity", name: "Affinity", description: "Manage contacts, organizations, and opportunities in Affinity", category: "CRM & Sales", icon: "TbPlugConnected", color: "#000000" },
  { slug: "agencyzoom", name: "AgencyZoom", description: "Manage insurance agency leads, clients, and workflows", category: "CRM & Sales", icon: "TbPlugConnected", color: "#2563EB" },
  { slug: "agent-mail", name: "AgentMail", description: "Send and manage emails through AgentMail", category: "Communication", icon: "TbPlugConnected", color: "#6366F1" },
  { slug: "amplitude", name: "Amplitude", description: "Query product analytics, events, and user behavior", category: "Data & Analytics", icon: "TbPlugConnected", color: "#1E0A3C" },
  { slug: "cal", name: "Cal.com", description: "Schedule and manage bookings through Cal.com", category: "Events & Scheduling", icon: "SiCaldotcom", color: "#292929" },
  { slug: "cloudflare", name: "Cloudflare", description: "Manage DNS, zones, workers, and security settings", category: "Developer Tools", icon: "SiCloudflare", color: "#F38020" },
  { slug: "databricks", name: "Databricks", description: "Run notebooks, manage clusters, and query Delta Lake", category: "AI & ML", icon: "TbPlugConnected", color: "#FF3621" },
  { slug: "datadog", name: "Datadog", description: "Query metrics, logs, dashboards, and monitors", category: "Developer Tools", icon: "SiDatadog", color: "#632CA6" },
  { slug: "discord", name: "Discord", description: "Send messages, manage channels, and automate server actions", category: "Communication", icon: "SiDiscord", color: "#5865F2" },
  { slug: "dynamics-365", name: "Dynamics 365", description: "Manage CRM and ERP data in Dynamics 365", category: "CRM & Sales", icon: "TbPlugConnected", color: "#0B53CE" },
  { slug: "eventbrite", name: "Eventbrite", description: "Create and manage events, tickets, and attendees", category: "Events & Scheduling", icon: "TbPlugConnected", color: "#F05537" },
  { slug: "freshservice", name: "Freshservice", description: "Manage tickets, assets, and IT service requests", category: "Support", icon: "TbPlugConnected", color: "#24B249" },
  { slug: "github", name: "GitHub", description: "Manage repositories, issues, pull requests, and workflows", category: "Developer Tools", icon: "SiGithub", color: "#181717" },
  { slug: "gitlab", name: "GitLab", description: "Manage repos, merge requests, issues, and CI/CD pipelines", category: "Developer Tools", icon: "SiGitlab", color: "#FC6D26" },
  { slug: "google-admin", name: "Google Admin", description: "Manage users, groups, and devices in Google Workspace", category: "Productivity", icon: "TbPlugConnected", color: "#4285F4" },
  { slug: "google-bigquery", name: "Google BigQuery", description: "Query and manage datasets, tables, and jobs in Google BigQuery", category: "Storage & Databases", icon: "TbPlugConnected", color: "#4285F4" },
  { slug: "google-chat", name: "Google Chat", description: "Send messages and manage Google Chat spaces", category: "Communication", icon: "TbPlugConnected", color: "#00897B" },
  { slug: "google-classroom", name: "Google Classroom", description: "Manage classes, coursework, and students", category: "Education", icon: "TbPlugConnected", color: "#34A853" },
  { slug: "google-contacts", name: "Google Contacts", description: "Read and manage Google Contacts", category: "Productivity", icon: "TbPlugConnected", color: "#4285F4" },
  { slug: "google-maps", name: "Google Maps", description: "Geocode addresses and query place details", category: "Productivity", icon: "TbPlugConnected", color: "#4285F4" },
  { slug: "google-tasks", name: "Google Tasks", description: "Create and manage Google Tasks lists and items", category: "Productivity", icon: "TbPlugConnected", color: "#4285F4" },
  { slug: "googlephotos", name: "Google Photos", description: "Upload, search, and manage photos and albums in Google Photos", category: "Storage & Databases", icon: "TbPlugConnected", color: "#4285F4" },
  { slug: "grafana", name: "Grafana", description: "Query dashboards, alerts, and metrics", category: "Developer Tools", icon: "SiGrafana", color: "#F46800" },
  { slug: "heygen", name: "HeyGen", description: "Create AI-generated videos, avatars, and voice content", category: "AI & ML", icon: "TbPlugConnected", color: "#000000" },
  { slug: "humanloop", name: "Humanloop", description: "Manage prompts, datasets, and evaluations for LLM apps", category: "AI & ML", icon: "TbPlugConnected", color: "#4F46E5" },
  { slug: "jotform", name: "Jotform", description: "Create forms, manage submissions, and build workflows", category: "Productivity", icon: "TbPlugConnected", color: "#FF6100" },
  { slug: "kibana", name: "Kibana", description: "Search and visualize Elasticsearch data", category: "Developer Tools", icon: "TbPlugConnected", color: "#E8478B" },
  { slug: "linear", name: "Linear", description: "Create and manage issues, cycles, and projects", category: "Developer Tools", icon: "TbPlugConnected", color: "#5E6AD2" },
  { slug: "lmnt", name: "LMNT", description: "Generate speech and voice from text using LMNT API", category: "AI & ML", icon: "TbPlugConnected", color: "#10B981" },
  { slug: "mem0", name: "Mem0", description: "Store and retrieve user memories and context for AI agents", category: "AI & ML", icon: "TbPlugConnected", color: "#8B5CF6" },
  { slug: "microsoft-excel", name: "Microsoft Excel", description: "Read and write Excel workbooks and worksheets", category: "Productivity", icon: "TbPlugConnected", color: "#217346" },
  { slug: "miro", name: "Miro", description: "Create and manage whiteboards, boards, and collaborative canvases", category: "Productivity", icon: "TbPlugConnected", color: "#FFD02F" },
  { slug: "mixpanel", name: "Mixpanel", description: "Query events, funnels, and cohort analytics", category: "Data & Analytics", icon: "TbPlugConnected", color: "#8B5CF6" },
  { slug: "new-relic", name: "New Relic", description: "Query application performance and infrastructure data", category: "Developer Tools", icon: "TbPlugConnected", color: "#1CE783" },
  { slug: "onenote", name: "OneNote", description: "Create and manage notebooks, sections, and pages", category: "Productivity", icon: "TbPlugConnected", color: "#7719AA" },
  { slug: "openai", name: "OpenAI", description: "Generate text, images, and embeddings via OpenAI API", category: "AI & ML", icon: "TbPlugConnected", color: "#10A37F" },
  { slug: "pagerduty", name: "PagerDuty", description: "Manage incidents, on-call schedules, and services", category: "Developer Tools", icon: "TbPlugConnected", color: "#06AC38" },
  { slug: "paystack", name: "Paystack", description: "Process payments, manage customers, and resolve transactions", category: "Payments & Finance", icon: "TbPlugConnected", color: "#00C3F7" },
  { slug: "perplexity-ai", name: "Perplexity AI", description: "Run web search and AI-powered answers through Perplexity AI", category: "AI & ML", icon: "TbPlugConnected", color: "#20808D" },
  { slug: "plausible-analytics", name: "Plausible Analytics", description: "Query privacy-focused web analytics and stats", category: "Data & Analytics", icon: "TbPlugConnected", color: "#5850EC" },
  { slug: "razorpay", name: "Razorpay", description: "Process payments, manage orders, and handle refunds", category: "Payments & Finance", icon: "TbPlugConnected", color: "#0D8DF2" },
  { slug: "recallai", name: "Recall.ai", description: "Record, transcribe, and analyze video meeting bots", category: "AI & ML", icon: "TbPlugConnected", color: "#000000" },
  { slug: "reddit", name: "Reddit", description: "Post content, manage subreddits, and browse discussions", category: "Social Media", icon: "SiReddit", color: "#FF4500" },
  { slug: "retellai", name: "Retell AI", description: "Build and manage voice AI agents and call workflows", category: "AI & ML", icon: "TbPlugConnected", color: "#000000" },
  { slug: "segment", name: "Segment", description: "Manage sources, destinations, and tracking plans", category: "Data & Analytics", icon: "TbPlugConnected", color: "#52B8B4" },
  { slug: "serpapi", name: "SerpApi", description: "Scrape Google search results, images, news, and more", category: "Data & Analytics", icon: "TbPlugConnected", color: "#2563EB" },
  { slug: "servicenow", name: "ServiceNow", description: "Manage incidents, requests, and CMDB records", category: "Support", icon: "TbPlugConnected", color: "#81B5A1" },
  { slug: "sharepoint", name: "SharePoint", description: "Browse sites, lists, and files in SharePoint", category: "Storage & Databases", icon: "TbPlugConnected", color: "#0078D4" },
  { slug: "snowflake", name: "Snowflake", description: "Query and manage data warehouses and databases", category: "Storage & Databases", icon: "TbPlugConnected", color: "#29B5E8" },
  { slug: "spotify", name: "Spotify", description: "Manage playlists, tracks, and podcast episodes", category: "Social Media", icon: "SiSpotify", color: "#1DB954" },
  { slug: "tally", name: "Tally", description: "Create forms and collect responses", category: "Productivity", icon: "TbPlugConnected", color: "#000000" },
  { slug: "tavily", name: "Tavily", description: "Search the web and retrieve structured AI research data", category: "Data & Analytics", icon: "TbPlugConnected", color: "#4F46E5" },
  { slug: "telegram", name: "Telegram Bot", description: "Automate Telegram chats and channels through a Telegram Bot. Requires a bot token from @BotFather.", category: "Communication", icon: "SiTelegram", color: "#26A5E4" },
  { slug: "tinypng", name: "TinyPNG", description: "Compress and optimize images via the TinyPNG API", category: "Developer Tools", icon: "TbPlugConnected", color: "#2563EB" },
  { slug: "twilio", name: "Twilio", description: "Send SMS, make calls, and manage phone numbers", category: "Communication", icon: "TbPlugConnected", color: "#F22F46" },
  { slug: "whatsapp", name: "WhatsApp Business", description: "Send messages and manage conversations through the WhatsApp Business API. Requires a Meta developer account and verified business.", category: "Communication", icon: "SiWhatsapp", color: "#25D366" },
  { slug: "yandex", name: "Yandex", description: "Search the web, translate text, and query Yandex services", category: "Data & Analytics", icon: "TbPlugConnected", color: "#FFCC00" },
];

function escapeDescription(desc) {
  // Replace any double quotes inside the description with single quotes to avoid breaking TS strings
  return desc.replace(/"/g, "'");
}

async function getToolsFromManifest(slug) {
  const filePath = path.join(generatedDir, `${slug}.generated.ts`);
  try {
    const content = await fs.readFile(filePath, "utf8");
    // Extract tool entries from the manifest
    // Each tool is: composioTool({ name: "...", description: "...", ... })
    const tools = [];
    const regex = /composioTool\(\s*\{[\s\S]*?name:\s*"((?:\\.|[^"\\])*)"[\s\S]*?description:\s*"((?:\\.|[^"\\])*)"[\s\S]*?\}\s*\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      tools.push({ name: match[1], description: match[2] });
      if (tools.length >= 12) break;
    }
    return tools;
  } catch (error) {
    console.error(`Error reading manifest for ${slug}:`, error.message);
    return [];
  }
}

function renderBaseEntry(integration) {
  const desc = escapeDescription(integration.description);
  return `  { name: "${integration.name}", slug: "${integration.slug}", description: "${desc}", category: "${integration.category}", icon: "${integration.icon}", color: "${integration.color}" },`;
}

function renderMetadataEntry(slug, tools) {
  const toolEntries = tools.map(t => {
    const desc = escapeDescription(t.description);
    return `      { name: "${t.name}", description: "${desc}" }`;
  }).join(",\n");

  return `  "${slug}": {
    setupMode: "composio",
    dashboardStatus: "available",
    runtimeStatus: "live",
    setupGuide: "Connect ${slug} through ClawLink's hosted Composio setup.",
    credentialFields: [],
    tools: [
${toolEntries}
    ],
  },`;
}

async function main() {
  const content = await fs.readFile(integrationsPath, "utf8");
  const lines = content.split("\n");

  // Find the line with `];` that ends baseIntegrations
  const baseEndIndex = lines.findIndex(line => line.trim() === "];" && lines[lines.indexOf(line) - 1]?.includes("Replicate"));
  // Actually find the exact line
  let baseEndLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "];") {
      baseEndLine = i;
      break;
    }
  }

  if (baseEndLine === -1) {
    throw new Error("Could not find end of baseIntegrations array");
  }

  // Find the line with `};` that ends integrationMetadata
  // This is the `};` that comes after the `replicate` block and before `defaultMetadata`
  let metaEndLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "};") {
      // Check if the next non-empty line starts `const defaultMetadata`
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (!nextLine) continue;
        if (nextLine.startsWith("const defaultMetadata")) {
          metaEndLine = i;
          break;
        }
        break; // If next non-empty line is not defaultMetadata, keep looking
      }
      if (metaEndLine !== -1) break;
    }
  }

  if (metaEndLine === -1) {
    throw new Error("Could not find end of integrationMetadata object");
  }

  console.log(`baseIntegrations ends at line ${baseEndLine + 1}`);
  console.log(`integrationMetadata ends at line ${metaEndLine + 1}`);

  // Sort new integrations alphabetically by name
  const sortedNew = [...newIntegrations].sort((a, b) => a.name.localeCompare(b.name));

  // Generate base entries
  const baseEntries = sortedNew.map(renderBaseEntry);

  // Generate metadata entries with tools
  const metadataEntries = [];
  for (const integration of sortedNew) {
    const tools = await getToolsFromManifest(integration.slug);
    metadataEntries.push(renderMetadataEntry(integration.slug, tools));
  }

  // Insert base entries before baseEndLine
  const newLines = [
    ...lines.slice(0, baseEndLine),
    ...baseEntries,
    ...lines.slice(baseEndLine, metaEndLine),
    ...metadataEntries,
    ...lines.slice(metaEndLine),
  ];

  await fs.writeFile(integrationsPath, newLines.join("\n"), "utf8");
  console.log(`Added ${sortedNew.length} integrations to ${integrationsPath}`);
}

main().catch(console.error);
