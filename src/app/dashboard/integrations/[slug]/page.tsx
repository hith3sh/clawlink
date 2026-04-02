"use client";

import { useParams, useRouter } from "next/navigation";
import { integrations } from "@/data/integrations";
import Link from "next/link";
import { FiArrowLeft, FiCheck, FiKey, FiRefreshCw, FiTrash2, FiSave } from "react-icons/fi";
import { 
  SiGmail, SiSlack, SiGithub, SiStripe, SiNotion, SiGoogleanalytics,
  SiHubspot, SiDiscord, SiWordpress, SiShopify, SiOpenai
} from "react-icons/si";
import { useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  SiGmail, SiSlack, SiGithub, SiStripe, SiNotion, SiGoogleanalytics,
  SiHubspot, SiDiscord, SiWordpress, SiShopify, SiOpenai
};

// Mock connection status
const mockConnection = {
  connected: true,
  lastSync: "2 hours ago",
  status: "healthy",
  expiresAt: "2026-05-01",
};

export default function IntegrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const integration = integrations.find((i) => i.slug === slug);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");

  if (!integration) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Integration not found</p>
        <Link href="/dashboard/integrations" className="text-red-500 hover:underline">
          Back to integrations
        </Link>
      </div>
    );
  }

  const Icon = iconMap[integration.icon] || FiCheck;
  const isConnected = mockConnection.connected;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back Button */}
      <Link 
        href="/dashboard/integrations" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to integrations
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${integration.color}15` }}
        >
          <span style={{ color: integration.color }}>
            <Icon className="w-8 h-8" />
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{integration.name}</h1>
            {isConnected && (
              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <FiCheck className="w-3 h-3" /> Connected
              </span>
            )}
          </div>
          <p className="text-gray-500">{integration.description}</p>
        </div>
      </div>

      {/* Connection Status Card */}
      {isConnected && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-900">Connection Status: Healthy</p>
              <p className="text-sm text-green-700">Last synced: {mockConnection.lastSync}</p>
            </div>
            <button className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors">
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Connect/Configure Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isConnected ? "Configure" : "Connect"} {integration.name}
          </h2>
          <p className="text-sm text-gray-500">
            {isConnected 
              ? "Manage your connection credentials" 
              : "Enter your API credentials to connect"}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key / OAuth Credentials
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiKey className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={isConnected ? "••••••••••••••••" : `Enter your ${integration.name} API key`}
                className="block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Get your API key from{" "}
              <a 
                href={`https://${integration.slug}.com/developers`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-500 hover:underline"
              >
                {integration.name} Developer Portal
              </a>
            </p>
          </div>

          {/* OAuth Option */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">Or connect with OAuth</p>
            <button className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              Connect with {integration.name}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          {isConnected ? (
            <>
              <button className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <FiTrash2 className="w-4 h-4" />
                Disconnect
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors ml-auto">
              <FiCheck className="w-4 h-4" />
              Connect {integration.name}
            </button>
          )}
        </div>
      </div>

      {/* Available Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Available Actions</h2>
          <p className="text-sm text-gray-500">What you can do with this integration</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {integration.slug === "gmail" && (
              <>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">send_email</p>
                  <p className="text-sm text-gray-500">Send an email</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">list_emails</p>
                  <p className="text-sm text-gray-500">List recent emails</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">get_email</p>
                  <p className="text-sm text-gray-500">Get email by ID</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">create_draft</p>
                  <p className="text-sm text-gray-500">Create email draft</p>
                </div>
              </>
            )}
            {integration.slug === "github" && (
              <>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">create_issue</p>
                  <p className="text-sm text-gray-500">Create a new issue</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">list_repos</p>
                  <p className="text-sm text-gray-500">List repositories</p>
                </div>
              </>
            )}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">+ More actions</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}