"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Bell,
  Check,
  Copy,
  CreditCard,
  Key,
  Save,
  Shield,
  User,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const { user } = useUser();

  const userName = user?.fullName || user?.firstName || "";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const userImage = user?.imageUrl;

  function copyApiKey() {
    navigator.clipboard.writeText("sk_live_xxxxxxxxxxxxxxxxxxxx");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <section className="dashboard-panel p-6">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
          Workspace controls
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Keep keys, profile, billing, and security in one place.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          The goal here is not novelty. It is a predictable control surface for the parts of the
          product people revisit when something needs to be changed quickly.
        </p>
      </section>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex flex-wrap gap-2 bg-transparent p-0 ring-0">
          <TabsTrigger value="profile">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="dashboard-panel border-white/8 bg-transparent">
            <CardHeader>
              <CardTitle>Profile settings</CardTitle>
              <CardDescription>
                Basic account information shown across the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="dashboard-panel-soft flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {(user?.firstName?.[0] || userName?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <p className="text-base font-medium text-foreground">{userName || "ClawLink user"}</p>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                  <Button variant="outline" size="sm">Change avatar</Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={userName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={userEmail} disabled />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4" />
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="dashboard-panel border-white/8 bg-transparent">
            <CardHeader>
              <CardTitle>API keys</CardTitle>
              <CardDescription>
                Manage the secret ClawLink uses for gateway and hosted setup flows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Live API key</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    readOnly
                    value="sk_live_xxxxxxxxxxxxxxxxxxxx"
                    className="flex-1 font-mono text-sm"
                  />
                  <Button variant="outline" onClick={copyApiKey}>
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <Alert className="border-amber-400/15 bg-amber-400/10 text-amber-100">
                  <AlertDescription className="text-sm text-amber-100/90">
                    This key grants full workspace access. Rotate it immediately if it leaves your
                    trusted environment.
                  </AlertDescription>
                </Alert>
              </div>

              <Separator className="bg-white/8" />

              <Button variant="outline">Create new key</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="dashboard-panel border-white/8 bg-transparent">
            <CardHeader>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>Usage limits and upgrade controls for this workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">Free plan</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    1,000 requests per month and 5 connected apps.
                  </p>
                </div>
                <Button>Upgrade plan</Button>
              </div>

              <Separator className="my-6 bg-white/8" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Requests this month</span>
                  <span className="font-medium text-foreground">1,234 / 1,000</span>
                </div>
                <Progress value={100} className="h-2 bg-white/8" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-panel border-white/8 bg-transparent">
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
              <CardDescription>Add billing details before moving beyond the free tier.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="dashboard-panel-soft flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">No payment method</p>
                  <p className="text-sm text-muted-foreground">Add a card before upgrading.</p>
                </div>
                <Button variant="outline" size="sm">Add card</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="dashboard-panel border-white/8 bg-transparent">
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>
                Decide which operational events should interrupt you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Request failures", desc: "Get notified when an API call fails.", default: true },
                { label: "Rate limit warnings", desc: "Alert when a workspace approaches its limit.", default: true },
                { label: "Integration disconnections", desc: "Notify when a connection stops working.", default: true },
                { label: "Usage alerts", desc: "Send a warning when usage passes 80%.", default: false },
                { label: "Product updates", desc: "News about new features and integrations.", default: false },
              ].map((item) => (
                <div key={item.label} className="dashboard-panel-soft flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.default} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="dashboard-panel border-white/8 bg-transparent">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Review the basic account protections tied to this workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Password", desc: "Last changed 30 days ago", action: "Change" },
                { label: "Two-factor authentication", desc: "Not enabled", action: "Enable" },
                { label: "Active sessions", desc: "1 active session", action: "View" },
              ].map((item) => (
                <div key={item.label} className="dashboard-panel-soft flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Button variant="outline" size="sm">{item.action}</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
