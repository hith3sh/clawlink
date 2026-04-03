"use client";

import { useState } from "react";
import { FiSearch, FiFilter, FiDownload, FiInbox } from "react-icons/fi";

const integrations = ["all", "gmail", "slack", "github", "stripe", "notion", "hubspot", "discord"];
const actions = ["all", "send_email", "send_message", "create_issue", "list_customers", "create_page", "list_emails", "create_contact"];

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
          <h1 className="text-2xl font-bold text-gray-900">Request Logs</h1>
          <p className="text-gray-500">Debug and monitor your API calls</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors">
          <FiDownload className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats - Empty State */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-2xl font-bold text-gray-400">-</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Avg Latency</p>
          <p className="text-2xl font-bold text-gray-400">-</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
          />
        </div>
        <select
          value={filterIntegration}
          onChange={(e) => setFilterIntegration(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-red-500 outline-none"
        >
          {integrations.map((i) => (
            <option key={i} value={i}>
              {i === "all" ? "All Integrations" : i}
            </option>
          ))}
        </select>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-red-500 outline-none"
        >
          {actions.map((a) => (
            <option key={a} value={a}>
              {a === "all" ? "All Actions" : a}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-red-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <FiInbox className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-900">No logs yet</p>
          <p className="text-sm mt-1">Connect an integration and make your first request</p>
        </div>
      </div>
    </div>
  );
}

export const runtime = 'edge';