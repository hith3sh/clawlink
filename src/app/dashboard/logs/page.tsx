"use client";

import { useState } from "react";
import { Download, Inbox, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const integrationOptions = ["all", "gmail", "outlook", "slack", "github", "stripe", "notion", "hubspot", "discord"];
const actionOptions = ["all", "send_email", "send_message", "create_issue", "create_event", "list_events", "list_messages", "create_page", "list_contacts"];

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [filterIntegration, setFilterIntegration] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          View API request history for your workspace.
        </p>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Requests</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Success rate</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">-</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Avg latency</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">-</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_160px_140px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search integrations, methods, or errors"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filterIntegration} onValueChange={(value) => setFilterIntegration(value ?? "all")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All integrations" />
          </SelectTrigger>
          <SelectContent>
            {integrationOptions.map((integration) => (
              <SelectItem key={integration} value={integration}>
                {integration === "all" ? "All integrations" : integration}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterAction} onValueChange={(value) => setFilterAction(value ?? "all")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            {actionOptions.map((action) => (
              <SelectItem key={action} value={action}>
                {action === "all" ? "All actions" : action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value ?? "all")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">No usage events yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Connect an app and make your first request. Usage history will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
