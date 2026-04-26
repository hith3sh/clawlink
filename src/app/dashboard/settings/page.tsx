"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Check,
  Copy,
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiKeyRecord {
  id: number;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
}

type SettingsTab = "profile" | "api" | "security";

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
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    const tab = searchParams.get("tab");
    if (tab === "api") return "api";
    if (tab === "security") return "security";
    return "profile";
  });
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
  const [changingAvatar, setChangingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setChangingAvatar(true);
    try {
      await user.setProfileImage({ file });
    } catch (error) {
      console.error("Failed to update avatar:", error);
    } finally {
      setChangingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as SettingsTab)}
      className="w-full max-w-3xl space-y-6"
    >
      <TabsList className="grid w-full grid-cols-3 gap-2 rounded-2xl bg-card/70 p-1 ring-1 ring-border/60">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-full justify-center rounded-xl border border-transparent px-3 py-2.5 data-active:border-border data-active:bg-background"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <Card className="flex w-full h-[680px] flex-col overflow-hidden border-border/70 bg-card/80">
        <CardHeader className="shrink-0 min-h-28 border-b border-border/60">
          <CardTitle>{activeTabMeta.label}</CardTitle>
          <CardDescription>{activeTabMeta.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pt-6">
          <TabsContent value="profile" className="w-full space-y-6">
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
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={changingAvatar}
                  >
                    {changingAvatar ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Change avatar
                  </Button>
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

          <TabsContent value="api" className="w-full space-y-6">
              {apiKeyError ? (
                <Alert variant="destructive">
                  <AlertDescription>{apiKeyError}</AlertDescription>
                </Alert>
              ) : null}

              {apiKeySuccess ? (
                <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-100">
                  <AlertDescription className="text-emerald-800 dark:text-emerald-100">{apiKeySuccess}</AlertDescription>
                </Alert>
              ) : null}

              {apiKeyValue ? (
                <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="space-y-1">
                    <Label>Paste this into your OpenClaw chat</Label>
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

                  <details className="group rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm">
                    <summary className="cursor-pointer select-none text-muted-foreground group-open:mb-3 group-open:text-foreground">
                      Using a client with a plugin settings screen? Copy just the key
                    </summary>
                    <div className="space-y-2">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input readOnly value={apiKeyValue} className="flex-1 font-mono text-sm" />
                        <Button variant="outline" onClick={copyApiKey}>
                          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                          {copied ? "Copied" : "Copy key"}
                        </Button>
                      </div>
                    </div>
                  </details>
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
                    No API keys yet. Create one and paste the generated <span className="font-mono">/clawlink login ...</span> command into OpenClaw.
                  </div>
                )}
              </div>
          </TabsContent>

          <TabsContent value="security" className="w-full">
            <SecurityTab />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}

function SecurityTab() {
  const clerk = useClerk();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 py-2">
        <div>
          <p className="text-sm font-medium text-foreground">Account</p>
          <p className="text-sm text-muted-foreground">
            Password, email, and connected accounts
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => clerk.openUserProfile()}
        >
          Manage
        </Button>
      </div>
    </div>
  );
}
