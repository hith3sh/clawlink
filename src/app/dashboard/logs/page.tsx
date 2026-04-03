"use client";

import { useState } from "react";
import { Search, Download, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const integrationOptions = ["all", "gmail", "slack", "github", "stripe", "notion", "hubspot", "discord"];
const actionOptions = ["all", "send_email", "send_message", "create_issue", "list_customers", "create_page", "list_emails", "create_contact"];

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [filterIntegration, setFilterIntegration] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Logs</h1>
          <p className="text-muted-foreground">Debug and monitor your API calls</p>
        </div>
        <Button>
          <Download className="mr-1.5 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold text-muted-foreground">-</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg Latency</p>
            <p className="text-2xl font-bold text-muted-foreground">-</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterIntegration} onValueChange={(v) => setFilterIntegration(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Integrations" />
          </SelectTrigger>
          <SelectContent>
            {integrationOptions.map((i) => (
              <SelectItem key={i} value={i}>
                {i === "all" ? "All Integrations" : i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterAction} onValueChange={(v) => setFilterAction(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            {actionOptions.map((a) => (
              <SelectItem key={a} value={a}>
                {a === "all" ? "All Actions" : a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <Inbox className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No logs yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Connect an integration and make your first request</p>
        </CardContent>
      </Card>
    </div>
  );
}

export const runtime = 'edge';
