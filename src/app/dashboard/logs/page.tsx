"use client";


import { useState } from "react";
import { FiSearch, FiFilter, FiCheckCircle, FiXCircle, FiClock, FiDownload } from "react-icons/fi";

// Mock logs data
const mockLogs = [
  { id: 1, time: "2026-04-01 21:04:32", integration: "gmail", action: "send_email", status: "success", latency: "145ms", user: "user_123" },
  { id: 2, time: "2026-04-01 21:03:15", integration: "slack", action: "send_message", status: "success", latency: "89ms", user: "user_123" },
  { id: 3, time: "2026-04-01 21:02:45", integration: "github", action: "create_issue", status: "success", latency: "234ms", user: "user_123" },
  { id: 4, time: "2026-04-01 21:01:22", integration: "stripe", action: "list_customers", status: "error", latency: "0ms", user: "user_123", error: "Rate limited" },
  { id: 5, time: "2026-04-01 20:58:10", integration: "notion", action: "create_page", status: "success", latency: "312ms", user: "user_123" },
  { id: 6, time: "2026-04-01 20:55:33", integration: "gmail", action: "list_emails", status: "success", latency: "178ms", user: "user_123" },
  { id: 7, time: "2026-04-01 20:52:18", integration: "hubspot", action: "create_contact", status: "success", latency: "445ms", user: "user_123" },
  { id: 8, time: "2026-04-01 20:48:55", integration: "discord", action: "send_message", status: "success", latency: "67ms", user: "user_123" },
  { id: 9, time: "2026-04-01 20:45:12", integration: "github", action: "get_pull_request", status: "success", latency: "123ms", user: "user_123" },
  { id: 10, time: "2026-04-01 20:42:00", integration: "gmail", action: "get_email", status: "success", latency: "98ms", user: "user_123" },
];

const integrations = ["all", "gmail", "slack", "github", "stripe", "notion", "hubspot", "discord"];
const actions = ["all", "send_email", "send_message", "create_issue", "list_customers", "create_page", "list_emails", "create_contact"];

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [filterIntegration, setFilterIntegration] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLog, setSelectedLog] = useState<typeof mockLogs[0] | null>(null);

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = search === "" || 
      log.integration.includes(search) || 
      log.action.includes(search) ||
      log.error?.toLowerCase().includes(search.toLowerCase());
    const matchesIntegration = filterIntegration === "all" || log.integration === filterIntegration;
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    
    return matchesSearch && matchesIntegration && matchesAction && matchesStatus;
  });

  const totalRequests = mockLogs.length;
  const successRate = Math.round((mockLogs.filter(l => l.status === "success").length / totalRequests) * 100);
  const avgLatency = Math.round(mockLogs.reduce((acc, l) => acc + parseInt(l.latency), 0) / totalRequests);

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">{successRate}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Avg Latency</p>
          <p className="text-2xl font-bold text-gray-900">{avgLatency}ms</p>
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

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Integration</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Latency</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.time}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.integration}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.action}</td>
                  <td className="px-6 py-4">
                    {log.status === "success" ? (
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <FiCheckCircle className="w-4 h-4" /> Success
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-red-600">
                        <FiXCircle className="w-4 h-4" /> Error
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" /> {log.latency}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-red-500">
                    {log.error || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No logs found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}// edge runtime
