"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Bell,
  Check,
  Copy,
  CreditCard,
  Key,
  Loader2,
  Save,
  Shield,
  Trash2,
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

interface ApiKeyRecord {
  id: number;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
}

type SettingsTab = "profile" | "api" | "billing" | "notifications" | "security";

const settingsTabs: Array<{
  value: SettingsTab;
  label: string;
  description: string;
  icon: typeof User;
}> = [
  {
    value: "profile",
    label: "Profile",
    description: "Basic account information shown across the dashboard.",
    icon: User,
  },
  {
    value: "api",
    label: "API Keys",
    description: "Create the ClawLink secret OpenClaw uses for hosted connection sessions and worker calls.",
    icon: Key,
  },
  {
    value: "billing",
    label: "Billing",
    description: "Usage limits, payment details, and upgrade controls for this workspace.",
    icon: CreditCard,
  },
  {
    value: "notifications",
    label: "Notifications",
    description: "Decide which operational events should interrupt you.",
    icon: Bell,
  },
  {
    value: "security",
    label: "Security",
    description: "Review the basic account protections tied to this workspace.",
    icon: Shield,
  },
];

function formatTimestamp(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [copied, setCopied] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [apiKeyName, setApiKeyName] = useState("OpenClaw");
  const [apiKeyValue, setApiKeyValue] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [apiKeySuccess, setApiKeySuccess] = useState<string | null>(null);
  const [loadingApiKeys, setLoadingApiKeys] = useState(true);
  const [creatingApiKey, setCreatingApiKey] = useState(false);
  const [deletingApiKeyId, setDeletingApiKeyId] = useState<number | null>(null);
  const { user, isLoaded } = useUser();

  const userName = user?.fullName || user?.firstName || "";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const userImage = user?.imageUrl;
  const activeTabMeta = settingsTabs.find((tab) => tab.value === activeTab) ?? settingsTabs[0];

  useEffect(() => {
    let active = true;

    async function loadApiKeys() {
      if (!isLoaded) {
        return;
      }

      if (!user) {
        if (active) {
          setApiKeys([]);
          setLoadingApiKeys(false);
        }
        return;
      }

      try {
        const response = await fetch("/api/api-keys", { cache: "no-store" });
        const data = (await response.json()) as {
          error?: string;
          keys?: ApiKeyRecord[];
        };

        if (!active) {
          return;
        }

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load API keys");
        }

        setApiKeys(data.keys ?? []);
      } catch (error) {
        if (active) {
          setApiKeyError(error instanceof Error ? error.message : "Failed to load API keys");
        }
      } finally {
        if (active) {
          setLoadingApiKeys(false);
        }
      }
    }

    void loadApiKeys();

    return () => {
      active = false;
    };
  }, [isLoaded, user]);

  function copyApiKey() {
    if (!apiKeyValue) {
      return;
    }

    navigator.clipboard.writeText(apiKeyValue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function copyLoginCommand() {
    if (!apiKeyValue) {
      return;
    }

    navigator.clipboard.writeText(`/clawlink login ${apiKeyValue}`);
    setCopiedCommand(true);
    window.setTimeout(() => setCopiedCommand(false), 2000);
  }

  async function handleCreateApiKey() {
    const name = apiKeyName.trim() || "OpenClaw";

    setApiKeyError(null);
    setApiKeySuccess(null);
    setCreatingApiKey(true);

    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = (await response.json()) as {
        error?: string;
        key?: ApiKeyRecord;
        rawKey?: string;
      };

      if (!response.ok || !data.key || !data.rawKey) {
        throw new Error(data.error ?? "Failed to create API key");
      }

      setApiKeys((current) => [data.key!, ...current.filter((entry) => entry.id !== data.key!.id)]);
      setApiKeyValue(data.rawKey);
      setCopied(false);
      setCopiedCommand(false);
      setApiKeyName("OpenClaw");
      setApiKeySuccess(`Created API key "${data.key.name}". Copy the OpenClaw command now because the raw key will not be shown again.`);
    } catch (error) {
      setApiKeyError(error instanceof Error ? error.message : "Failed to create API key");
    } finally {
      setCreatingApiKey(false);
    }
  }

  async function handleDeleteApiKey(key: ApiKeyRecord) {
    setApiKeyError(null);
    setApiKeySuccess(null);
    setDeletingApiKeyId(key.id);

    try {
      const response = await fetch(`/api/api-keys/${key.id}`, {
        method: "DELETE",
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to revoke API key");
      }

      setApiKeys((current) => current.filter((entry) => entry.id !== key.id));
      setApiKeySuccess(`Revoked API key "${key.name}".`);
    } catch (error) {
      setApiKeyError(error instanceof Error ? error.message : "Failed to revoke API key");
    } finally {
      setDeletingApiKeyId(null);
    }
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as SettingsTab)}
      className="gap-6 xl:grid xl:grid-cols-[240px_minmax(0,1fr)] xl:items-start"
    >
      <Card className="border-border/70 bg-card/70 xl:sticky xl:top-6">
        <CardContent className="p-3">
          <TabsList className="!grid w-full grid-cols-2 gap-2 bg-transparent p-0 ring-0 md:grid-cols-3 xl:grid-cols-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="w-full justify-start rounded-xl border border-border/60 bg-muted/20 px-3 py-3 text-left data-active:border-border data-active:bg-background"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </CardContent>
      </Card>

      <Card className="min-h-[680px] border-border/70 bg-card/80">
        <CardHeader className="min-h-28 border-b border-border/60">
          <CardTitle>{activeTabMeta.label}</CardTitle>
          <CardDescription>{activeTabMeta.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <TabsContent value="profile" className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="text-lg">
                    {(user?.firstName?.[0] || userName?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{userName || "ClawLink user"}</p>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                  <Button variant="outline" size="sm">Change avatar</Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
              {apiKeyError ? (
                <Alert variant="destructive">
                  <AlertDescription>{apiKeyError}</AlertDescription>
                </Alert>
              ) : null}

              {apiKeySuccess ? (
                <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-100">
                  <AlertDescription className="text-emerald-100">{apiKeySuccess}</AlertDescription>
                </Alert>
              ) : null}

              {apiKeyValue ? (
                <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="space-y-1">
                    <Label>Paste this into OpenClaw</Label>
                    <p className="text-sm text-muted-foreground">
                      This raw key is only shown once. The easiest path is to copy the full command below and paste it into OpenClaw.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      readOnly
                      value={`/clawlink login ${apiKeyValue}`}
                      className="flex-1 font-mono text-sm"
                    />
                    <Button variant="outline" onClick={copyLoginCommand}>
                      {copiedCommand ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      {copiedCommand ? "Copied" : "Copy command"}
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input readOnly value={apiKeyValue} className="flex-1 font-mono text-sm" />
                    <Button variant="outline" onClick={copyApiKey}>
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy raw key"}
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="api-key-name">Create a new key</Label>
                  <p className="text-sm text-muted-foreground">
                    Name the key by where it will be used. `OpenClaw` is a sensible default.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="api-key-name"
                    value={apiKeyName}
                    onChange={(event) => setApiKeyName(event.target.value)}
                    placeholder="OpenClaw"
                    className="flex-1"
                  />
                  <Button onClick={handleCreateApiKey} disabled={creatingApiKey}>
                    {creatingApiKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                    {creatingApiKey ? "Creating..." : "Create API key"}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-foreground">Existing keys</h3>
                  <p className="text-sm text-muted-foreground">
                    Raw key values are never shown again after creation. Revoke and recreate a key if you need a new copy.
                  </p>
                </div>

                {loadingApiKeys ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading API keys...
                  </div>
                ) : apiKeys.length > 0 ? (
                  <div className="space-y-3">
                    {apiKeys.map((key) => (
                      <div
                        key={key.id}
                        className="flex flex-col gap-4 rounded-2xl border border-border/70 p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{key.name}</p>
                            <span className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                              cllk_live_...
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created {formatTimestamp(key.createdAt) ?? "just now"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Last used {formatTimestamp(key.lastUsedAt) ?? "never"}
                          </p>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => void handleDeleteApiKey(key)}
                          disabled={deletingApiKeyId === key.id}
                        >
                          {deletingApiKeyId === key.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          {deletingApiKeyId === key.id ? "Revoking..." : "Revoke"}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
                    No API keys yet. Create one and paste the generated `/clawlink login ...` command into OpenClaw.
                  </div>
                )}
              </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="rounded-2xl border border-border/70 bg-muted/10 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-foreground">Free plan</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    1,000 requests per month and 5 connected apps.
                  </p>
                </div>
                <Button>Upgrade plan</Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Requests this month</span>
                  <span className="font-medium text-foreground">1,234 / 1,000</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/10 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-foreground">Payment method</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add billing details before moving beyond the free tier.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">No payment method</p>
                  <p className="text-sm text-muted-foreground">Add a card before upgrading.</p>
                </div>
                <Button variant="outline" size="sm">Add card</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-3">
              {[
                { label: "Request failures", desc: "Get notified when an API call fails.", default: true },
                { label: "Rate limit warnings", desc: "Alert when a workspace approaches its limit.", default: true },
                { label: "Integration disconnections", desc: "Notify when a connection stops working.", default: true },
                { label: "Usage alerts", desc: "Send a warning when usage passes 80%.", default: false },
                { label: "Product updates", desc: "News about new features and integrations.", default: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
          </TabsContent>

          <TabsContent value="security" className="space-y-3">
              {[
                { label: "Password", desc: "Last changed 30 days ago", action: "Change" },
                { label: "Two-factor authentication", desc: "Not enabled", action: "Enable" },
                { label: "Active sessions", desc: "1 active session", action: "View" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                    <Button variant="outline" size="sm">{item.action}</Button>
                  </div>
                ))}
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
