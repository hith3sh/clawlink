"use client";


import { useState } from "react";
import { FiUser, FiKey, FiCreditCard, FiBell, FiShield, FiSave, FiCopy, FiCheck } from "react-icons/fi";

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const copyApiKey = () => {
    navigator.clipboard.writeText("sk_live_xxxxxxxxxxxxxxxxxxxx");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "api", label: "API Keys", icon: FiKey },
    { id: "billing", label: "Billing", icon: FiCreditCard },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "security", label: "Security", icon: FiShield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                    H
                  </div>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Change Avatar
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      defaultValue="Hithesh"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="hithesh@example.com"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === "api" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
                <p className="text-sm text-gray-500">Manage your API keys for programmatic access</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Live Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Live API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="sk_live_xxxxxxxxxxxxxxxxxxxx"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 font-mono text-sm"
                    />
                    <button
                      onClick={copyApiKey}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      {copied ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiCopy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
                    ⚠️ This key provides full access to your account. Keep it secure!
                  </p>
                </div>

                {/* Create New Key */}
                <div className="pt-4 border-t border-gray-100">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    + Create New Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              {/* Current Plan */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">Free Plan</p>
                      <p className="text-gray-500">1,000 requests/month • 5 integrations</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                      Upgrade
                    </button>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3">Usage this month</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Requests</span>
                        <span className="font-medium">1,234 / 1,000</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "100%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <FiCreditCard className="w-8 h-8 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">No payment method</p>
                      <p className="text-sm text-gray-500">Add a card to upgrade</p>
                    </div>
                    <button className="text-red-500 hover:text-red-600 font-medium text-sm">
                      Add Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Request failures", desc: "Get notified when an API call fails" },
                  { label: "Rate limit warnings", desc: "Alert when approaching rate limits" },
                  { label: "Integration disconnections", desc: "Notify when an integration stops working" },
                  { label: "Usage alerts", desc: "Alert when usage exceeds 80% of limit" },
                  { label: "Product updates", desc: "News about new features and integrations" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                  </div>
                  <button className="text-red-500 hover:text-red-600 font-medium text-sm">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Not enabled</p>
                  </div>
                  <button className="text-red-500 hover:text-red-600 font-medium text-sm">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Active Sessions</p>
                    <p className="text-sm text-gray-500">1 active session</p>
                  </div>
                  <button className="text-red-500 hover:text-red-600 font-medium text-sm">
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
}// edge runtime
