"use client";

import { useState } from "react";
import { Activity, CheckCircle, Clock, Zap, AlertCircle, Copy, RotateCcw, Eye, EyeOff } from "lucide-react";
import { SiGmail, SiSlack, SiGithub, SiStripe } from "react-icons/si";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

const stats = [
  { label: "Total Requests", value: "1,234", change: "+12%", icon: Activity },
  { label: "Success Rate", value: "98.2%", change: "+0.3%", icon: CheckCircle },
  { label: "Avg Latency", value: "234ms", change: "-15%", icon: Clock },
  { label: "Active Integrations", value: "4", change: "+1", icon: Zap },
];

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
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const apiKey = "sk_live_xxxxxxxxxxxxxxxxxxxx";

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Home</h1>
        <p className="text-muted-foreground">Monitor your API integrations and usage</p>
      </div>

      {/* API Key Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">API Key</p>
              <p className="text-xs text-muted-foreground">
                Your API key for using ClawLink services. Use this with the MCP command.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm sm:flex-initial">
                {showKey ? apiKey : "sk_live_•••••••••••••••"}
              </code>
              <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={copyApiKey}>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs font-medium text-green-400">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Connected Integrations */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Connected Integrations</CardTitle>
            <Link href="/dashboard/integrations" className={buttonVariants({ variant: "link", size: "sm" }) + " text-primary"}>
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectedIntegrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${integration.color}20` }}
                  >
                    <integration.icon className="h-5 w-5" style={{ color: integration.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">Last used {integration.lastUsed}</p>
                  </div>
                </div>
                {integration.status === "connected" ? (
                  <Badge variant="secondary" className="text-green-400">
                    <CheckCircle className="mr-1 h-3 w-3" /> Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="mr-1 h-3 w-3" /> Error
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Recent Requests</CardTitle>
            <Link href="/dashboard/logs" className={buttonVariants({ variant: "link", size: "sm" }) + " text-primary"}>
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${log.status === "success" ? "bg-green-500" : "bg-destructive"}`} />
                    <div>
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">{log.integration}</span>/{log.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{log.latency}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MCP Command Section */}
      <Card className="bg-gradient-to-r from-card to-secondary border-border">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-1">Your MCP Command</h2>
          <p className="text-sm text-muted-foreground mb-4">Paste this into OpenClaw to connect all your integrations</p>
          <div className="flex items-center gap-3 rounded-lg bg-background/50 p-4">
            <code className="flex-1 font-mono text-sm text-primary">
              npx @clawlink/mcp --api-key sk_live_xxxx
            </code>
            <Button size="sm">
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
