"use client";


import { useState, useEffect, use } from "react";
import { integrations, categories } from "@/data/integrations";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FiSearch, FiCheck, FiChevronRight } from "react-icons/fi";
import { 
  SiGmail, SiSlack, SiDiscord, SiTelegram, SiApollographql, SiHubspot, 
  SiSalesforce, SiPiped, SiWordpress, SiWebflow, SiGhost, SiContentful,
  SiYoutube, SiX, SiInstagram, SiGooglesheets, SiGooglecalendar,
  SiGoogledrive, SiNotion, SiAirtable, SiTodoist, SiGithub, SiGitlab, SiJira,
  SiLinear, SiVercel, SiStripe, SiPaypal, SiQuickbooks, SiGoogleanalytics,
  SiMixpanel, SiSupabase, SiFirebase, SiShopify, SiWoocommerce, SiOpenai,
  SiReplicate, SiElevenlabs
} from "react-icons/si";


const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  SiGmail, SiSlack, SiDiscord, SiTelegram, SiApollographql, SiHubspot,
  SiSalesforce, SiPiped, SiWordpress, SiWebflow, SiGhost, SiContentful,
  SiYoutube, SiX, SiInstagram, SiGooglesheets, SiGooglecalendar,
  SiGoogledrive, SiNotion, SiAirtable, SiTodoist, SiGithub, SiGitlab, SiJira,
  SiLinear, SiVercel, SiStripe, SiPaypal, SiQuickbooks, SiGoogleanalytics,
  SiMixpanel, SiSupabase, SiFirebase, SiShopify, SiWoocommerce,
  SiOpenai, SiReplicate, SiElevenlabs
};

// TODO: Fetch from database based on logged-in user
// const connectedIntegrations = ["gmail", "slack", "github"];

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function fetchConnectedIntegrations() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/integrations");
        const data = await res.json() as { integrations?: Array<{ integration: string }> };
        
        if (data.integrations) {
          const connected = data.integrations.map((i) => i.integration);
          setConnectedIntegrations(connected);
        }
      } catch (error) {
        console.error("Failed to fetch integrations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConnectedIntegrations();
  }, [user, isLoaded]);

  const filtered = integrations.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
                          i.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = filtered.filter((i) => i.category === cat);
    return acc;
  }, {} as Record<string, typeof integrations>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500">Browse and connect API integrations</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory 
                ? "bg-red-500 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      {Object.entries(grouped).map(([category, items]) => items.length > 0 && (
        <div key={category} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((integration) => {
              const Icon = iconMap[integration.icon] || FiCheck;
              const isConnected = connectedIntegrations.includes(integration.slug);

              return (
                <Link
                  key={integration.slug}
                  href={`/dashboard/integrations/${integration.slug}`}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${integration.color}15` }}
                    >
                      <span style={{ color: integration.color }}>
                        <Icon className="w-6 h-6" />
                      </span>
                    </div>
                    {isConnected && (
                      <span className="flex items-center gap-1 text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                        <FiCheck className="w-3 h-3" /> Connected
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-500 transition-colors">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{integration.description}</p>
                  <div className="mt-4 flex items-center text-sm text-red-500 font-medium">
                    <span>{isConnected ? "Manage" : "Connect"}</span>
                    <FiChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No integrations found matching your search</p>
        </div>
      )}
    </div>
  );
}// edge runtime
