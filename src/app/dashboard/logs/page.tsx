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

const integrationOptions = ["all", "gmail", "slack", "github", "stripe", "notion", "hubspot", "discord"];
const actionOptions = ["all", "send_email", "send_message", "create_issue", "list_customers", "create_page", "list_emails", "create_contact"];

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [filterIntegration, setFilterIntegration] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="space-y-6">
      <section className="dashboard-panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
              Request stream
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Inspect usage without fighting the interface.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Filters stay visible, the summary is compact, and the log area is reserved for the
              requests that matter instead of decorative KPI tiles.
            </p>
          </div>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="dashboard-panel-soft p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Requests</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">0</p>
            <p className="mt-2 text-sm text-muted-foreground">No API activity yet for this workspace.</p>
          </div>
          <div className="dashboard-panel-soft p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Success rate</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">-</p>
            <p className="mt-2 text-sm text-muted-foreground">A rate appears after the first successful call.</p>
          </div>
          <div className="dashboard-panel-soft p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Average latency</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">-</p>
            <p className="mt-2 text-sm text-muted-foreground">Latency tracking starts once requests are flowing.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search integrations, methods, or errors"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 border-white/8 bg-white/[0.03] pl-11 pr-4"
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
      </section>

      <Card className="dashboard-panel border-white/8 bg-transparent">
        <CardContent className="flex min-h-80 flex-col items-center justify-center py-20 text-center">
          <div className="dashboard-panel-soft flex h-16 w-16 items-center justify-center rounded-[24px]">
            <Inbox className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mt-5 text-lg font-medium text-foreground">No usage events yet</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Connect an app from the Connections page and make your first request. This view will
            turn into the audit trail for the workspace once traffic starts coming through.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export const runtime = "edge";
