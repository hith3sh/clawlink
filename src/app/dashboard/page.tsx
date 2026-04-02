
import { FiActivity, FiZap, FiCheckCircle, FiAlertCircle, FiClock } from "react-icons/fi";
import { SiGmail, SiSlack, SiGithub, SiStripe, SiNotion, SiGoogleanalytics } from "react-icons/si";
import Link from "next/link";

const stats = [
  { label: "Total Requests", value: "1,234", change: "+12%", icon: FiActivity, color: "blue" },
  { label: "Success Rate", value: "98.2%", change: "+0.3%", icon: FiCheckCircle, color: "green" },
  { label: "Avg Latency", value: "234ms", change: "-15%", icon: FiClock, color: "orange" },
  { label: "Active Integrations", value: "4", change: "+1", icon: FiZap, color: "red" },
];

const colorMap: Record<string, string> = {
  blue: "text-blue-500 bg-blue-50",
  green: "text-green-500 bg-green-50",
  orange: "text-orange-500 bg-orange-50",
  red: "text-red-500 bg-red-50",
};

const connectedIntegrations = [
  { name: "Gmail", icon: SiGmail, color: "#EA4335", status: "connected", lastUsed: "2 min ago" },
  { name: "Slack", icon: SiSlack, color: "#4A154B", status: "connected", lastUsed: "1 hour ago" },
  { name: "GitHub", icon: SiGithub, color: "#181717", status: "connected", lastUsed: "3 hours ago" },
  { name: "Stripe", icon: SiStripe, color: "#635BFF", status: "error", lastUsed: "1 day ago" },
];

const recentLogs = [
  { time: "2 min ago", integration: "gmail", action: "send_email", status: "success", latency: "145ms" },
  { time: "5 min ago", integration: "slack", action: "send_message", status: "success", latency: "89ms" },
  { time: "12 min ago", integration: "github", action: "create_issue", status: "success", latency: "234ms" },
  { time: "1 hour ago", integration: "stripe", action: "list_customers", status: "error", latency: "0ms" },
  { time: "2 hours ago", integration: "notion", action: "create_page", status: "success", latency: "312ms" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Monitor your API integrations and usage</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colorMap[stat.color]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm text-green-500 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connected Integrations */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Connected Integrations</h2>
            <Link 
              href="/dashboard/integrations" 
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {connectedIntegrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${integration.color}15` }}
                  >
                    <integration.icon className="w-5 h-5" style={{ color: integration.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{integration.name}</p>
                    <p className="text-xs text-gray-400">Last used {integration.lastUsed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integration.status === "connected" ? (
                    <span className="flex items-center gap-1 text-sm text-green-500">
                      <FiCheckCircle className="w-4 h-4" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-red-500">
                      <FiAlertCircle className="w-4 h-4" /> Error
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
            <Link 
              href="/dashboard/logs" 
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${log.status === "success" ? "bg-green-500" : "bg-red-500"}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        <span className="text-gray-500">{log.integration}</span>/{log.action}
                      </p>
                      <p className="text-xs text-gray-400">{log.time}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{log.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MCP Command Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Your MCP Command</h2>
        <p className="text-gray-400 text-sm mb-4">Paste this into OpenClaw to connect all your integrations</p>
        <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-4">
          <code className="flex-1 font-mono text-sm text-green-400">
            npx @clawlink/mcp --api-key sk_live_xxxx
          </code>
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors">
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}