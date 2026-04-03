"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  FiBell,
  FiCheck,
  FiCopy,
  FiCreditCard,
  FiKey,
  FiLoader,
  FiSave,
  FiShield,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

interface ApiKeyRecord {
  id: number;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("OpenClaw");
  const [creatingKey, setCreatingKey] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState<number | null>(null);
  const { user } = useUser();

  const userName = user?.fullName || user?.firstName || "";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const userImage = user?.imageUrl;

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "api", label: "API Keys", icon: FiKey },
    { id: "billing", label: "Billing", icon: FiCreditCard },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "security", label: "Security", icon: FiShield },
  ];

  useEffect(() => {
    if (activeTab !== "api") {
      return;
    }

    let active = true;

    async function loadApiKeys() {
      setApiLoading(true);
      setApiError(null);

      try {
        const response = await fetch("/api/api-keys", { cache: "no-store" });
        const data = (await response.json()) as { keys?: ApiKeyRecord[]; error?: string };

        if (!active) {
          return;
        }

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load API keys");
        }

        setApiKeys(data.keys ?? []);
      } catch (requestError) {
        if (active) {
          setApiError(requestError instanceof Error ? requestError.message : "Failed to load API keys");
        }
      } finally {
        if (active) {
          setApiLoading(false);
        }
      }
    }

    loadApiKeys();

    return () => {
      active = false;
    };
  }, [activeTab]);

  async function copyApiKey(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function handleCreateKey() {
    setCreatingKey(true);
    setApiError(null);

    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      const data = (await response.json()) as {
        error?: string;
        rawKey?: string;
        key?: ApiKeyRecord;
      };

      if (!response.ok || !data.rawKey || !data.key) {
        throw new Error(data.error ?? "Failed to create API key");
      }

      setApiKeys((current) => [data.key as ApiKeyRecord, ...current]);
      setRevealedKey(data.rawKey);
    } catch (requestError) {
      setApiError(requestError instanceof Error ? requestError.message : "Failed to create API key");
    } finally {
      setCreatingKey(false);
    }
  }

  async function handleDeleteKey(id: number) {
    setDeletingKeyId(id);
    setApiError(null);

    try {
      const response = await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete API key");
      }

      setApiKeys((current) => current.filter((key) => key.id !== id));
    } catch (requestError) {
      setApiError(requestError instanceof Error ? requestError.message : "Failed to delete API key");
    } finally {
      setDeletingKeyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
              </div>
              <div className="space-y-6 p-6">
                <div className="flex items-center gap-6">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-2xl font-bold text-white">
                      {(user?.firstName?.[0] || userName?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                  <button className="rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50">
                    Change Avatar
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      defaultValue={userName}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      defaultValue={userEmail}
                      disabled
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 rounded-lg bg-red-500 px-6 py-2 font-medium text-white transition-colors hover:bg-red-600">
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
                  <p className="text-sm text-gray-500">
                    Use an API key in the ClawLink OpenClaw plugin so OpenClaw can start and poll
                    hosted connection sessions on your behalf.
                  </p>
                </div>
                <div className="space-y-6 p-6">
                  {revealedKey ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-sm font-medium text-emerald-900">New API key</p>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={revealedKey}
                          className="flex-1 rounded-lg border border-emerald-200 bg-white px-4 py-2 font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => copyApiKey(revealedKey)}
                          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm transition-colors hover:bg-emerald-100"
                        >
                          {copied ? <FiCheck className="h-4 w-4 text-emerald-600" /> : <FiCopy className="h-4 w-4" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-emerald-900">
                        This value is only shown once. Put it in the ClawLink OpenClaw plugin config.
                      </p>
                    </div>
                  ) : null}

                  {apiError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {apiError}
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-gray-100 p-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Key name</label>
                    <div className="flex flex-wrap gap-3">
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(event) => setNewKeyName(event.target.value)}
                        className="min-w-72 flex-1 rounded-lg border border-gray-200 px-4 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />
                      <button
                        type="button"
                        onClick={handleCreateKey}
                        disabled={creatingKey}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {creatingKey ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiKey className="h-4 w-4" />}
                        Create key
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">Existing keys</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {apiLoading ? (
                        <div className="flex items-center gap-2 px-4 py-6 text-sm text-gray-500">
                          <FiLoader className="h-4 w-4 animate-spin" />
                          Loading API keys
                        </div>
                      ) : apiKeys.length > 0 ? (
                        apiKeys.map((key) => (
                          <div key={key.id} className="flex items-center justify-between gap-4 px-4 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{key.name}</p>
                              <p className="text-sm text-gray-500">
                                Created {new Date(key.createdAt).toLocaleString()}
                                {key.lastUsedAt ? ` • Last used ${new Date(key.lastUsedAt).toLocaleString()}` : " • Never used"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteKey(key.id)}
                              disabled={deletingKeyId === key.id}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingKeyId === key.id ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiTrash2 className="h-4 w-4" />}
                              Delete
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-sm text-gray-500">
                          No API keys yet. Create one for the OpenClaw plugin.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">Free Plan</p>
                      <p className="text-gray-500">1,000 requests/month • 5 integrations</p>
                    </div>
                    <button className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600">
                      Upgrade
                    </button>
                  </div>
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <p className="mb-3 text-sm font-medium text-gray-700">Usage this month</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Requests</span>
                        <span className="font-medium">1,234 / 1,000</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div className="h-2 w-full rounded-full bg-red-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                    <FiCreditCard className="h-8 w-8 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">No payment method</p>
                      <p className="text-sm text-gray-500">Add a card to upgrade</p>
                    </div>
                    <button className="text-sm font-medium text-red-500 transition-colors hover:text-red-600">
                      Add Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              </div>
              <div className="space-y-4 p-6">
                {[
                  { label: "Request failures", desc: "Get notified when an API call fails" },
                  { label: "Rate limit warnings", desc: "Alert when approaching rate limits" },
                  { label: "Integration disconnections", desc: "Notify when an integration stops working" },
                  { label: "Usage alerts", desc: "Alert when usage exceeds 80% of limit" },
                  { label: "Product updates", desc: "News about new features and integrations" },
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked={index < 3} className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              </div>
              <div className="space-y-6 p-6">
                <div className="flex items-center justify-between border-b border-gray-50 py-3">
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                  </div>
                  <button className="text-sm font-medium text-red-500 transition-colors hover:text-red-600">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between border-b border-gray-50 py-3">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Not enabled</p>
                  </div>
                  <button className="text-sm font-medium text-red-500 transition-colors hover:text-red-600">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Active Sessions</p>
                    <p className="text-sm text-gray-500">1 active session</p>
                  </div>
                  <button className="text-sm font-medium text-red-500 transition-colors hover:text-red-600">
                    View
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
