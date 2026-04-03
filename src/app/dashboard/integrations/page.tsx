"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiChevronRight, FiLoader, FiSearch } from "react-icons/fi";

import { categories, integrations } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";

interface ConnectionRecord {
  integration: string;
}

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchConnectedIntegrations() {
      try {
        const response = await fetch("/api/integrations", { cache: "no-store" });
        const data = (await response.json()) as {
          integrations?: ConnectionRecord[];
        };

        if (!active) {
          return;
        }

        setConnectedIntegrations((data.integrations ?? []).map((item) => item.integration));
      } catch (error) {
        console.error("Failed to fetch integrations:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchConnectedIntegrations();

    return () => {
      active = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const filtered = integrations.filter((integration) => {
      const query = search.toLowerCase();
      const matchesSearch =
        integration.name.toLowerCase().includes(query) ||
        integration.description.toLowerCase().includes(query);
      const matchesCategory = !selectedCategory || integration.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return categories.reduce<Record<string, typeof integrations>>((accumulator, category) => {
      accumulator[category] = filtered.filter((integration) => integration.category === category);
      return accumulator;
    }, {});
  }, [search, selectedCategory]);

  const totalResults = Object.values(grouped).reduce((count, items) => count + items.length, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500">Browse the catalog, save credentials, and inspect worker coverage.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
          <FiLoader className="h-4 w-4 animate-spin" />
          Loading saved integrations
        </div>
      ) : null}

      {Object.entries(grouped).map(([category, items]) =>
        items.length > 0 ? (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((integration) => {
                const Icon = getIntegrationIcon(integration.icon);
                const isConnected = connectedIntegrations.includes(integration.slug);

                return (
                  <Link
                    key={integration.slug}
                    href={`/dashboard/integrations/${integration.slug}`}
                    className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-red-200 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${integration.color}15` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: integration.color }} />
                      </div>
                      {isConnected ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">
                          <FiCheck className="h-3 w-3" />
                          Connected
                        </span>
                      ) : (
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            integration.dashboardStatus === "available"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {integration.dashboardStatus === "available"
                            ? "Setup ready"
                            : "Setup pending"}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-red-500">
                        {integration.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-gray-500">{integration.description}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span
                        className={`rounded-full px-2 py-1 ${
                          integration.runtimeStatus === "live"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {integration.runtimeStatus === "live" ? "Worker live" : "Worker planned"}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                        {integration.setupMode === "oauth" ? "OAuth" : "Manual"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center text-sm font-medium text-red-500">
                      <span>{isConnected ? "Manage connection" : "Open details"}</span>
                      <FiChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null,
      )}

      {totalResults === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
          <p className="text-gray-500">No integrations match your current search.</p>
        </div>
      ) : null}
    </div>
  );
}
