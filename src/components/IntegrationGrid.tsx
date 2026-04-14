"use client";

import { useState, useMemo } from "react";
import { integrations } from "@/data/integrations";
import { getIntegrationIcon } from "@/lib/integration-icons";
import { getBrandLogoSrc, hasBrandLogo } from "@/lib/brand-logos";
import SearchBar from "./SearchBar";

export default function IntegrationGrid() {
  const [search, setSearch] = useState("");

  const isSearching = search.length > 0;

  const filtered = useMemo(() => {
    if (!isSearching) {
      return integrations;
    }
    const q = search.toLowerCase();
    return integrations.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }, [search, isSearching]);

  return (
    <div className="w-full space-y-8">
      <div className="text-center mb-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          40+ integrations ready to go
        </h2>
        <p className="text-gray-500 mt-3 text-lg">
          Search for any app — if we support it, it shows up
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} resultCount={filtered.length} />

      {/* Integration cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((integration) => {
          const Icon = getIntegrationIcon(integration.icon);
          return (
            <div
              key={integration.slug}
              className="group rounded-2xl border border-gray-100 bg-white/80 p-4 sm:p-5 transition-all hover:border-[#ffe4cc]/60 hover:shadow-lg hover:shadow-[#e8915a]/5 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                {hasBrandLogo(integration.slug) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getBrandLogoSrc(integration.slug, "light")}
                    alt=""
                    aria-hidden="true"
                    className="w-7 h-7 shrink-0 object-contain"
                  />
                ) : (
                  <Icon className="w-7 h-7 shrink-0" style={{ color: integration.color }} />
                )}
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                    {integration.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {integration.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No integrations found for &ldquo;{search}&rdquo;</p>
          <p className="text-gray-300 text-sm mt-2">
            Request an integration on GitHub
          </p>
        </div>
      )}
    </div>
  );
}
