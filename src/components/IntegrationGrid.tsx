"use client";

import { useState, useMemo } from "react";
import { integrations } from "@/data/integrations";
import SearchBar from "./SearchBar";
import {
  SiGmail, SiSlack, SiDiscord, SiTelegram,
  SiApollographql, SiHubspot, SiSalesforce,
  SiWordpress, SiWebflow, SiGhost, SiContentful,
  SiYoutube, SiX, SiInstagram,
  SiGooglesheets, SiGooglecalendar, SiGoogledrive, SiNotion, SiAirtable, SiTodoist,
  SiGithub, SiGitlab, SiJira, SiLinear, SiVercel,
  SiStripe, SiPaypal, SiQuickbooks,
  SiGoogleanalytics, SiMixpanel,
  SiSupabase, SiFirebase,
  SiShopify, SiWoocommerce,
  SiOpenai, SiReplicate, SiElevenlabs,
} from "react-icons/si";
import { FaAws, FaLinkedin, FaMicrosoft } from "react-icons/fa";
import { TbBrandFunimation, TbArrowsSplit } from "react-icons/tb";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  SiGmail, SiSlack, SiDiscord, FaMicrosoft, SiTelegram,
  SiApollographql, SiHubspot, SiSalesforce, FaPipedrive: TbBrandFunimation,
  SiWordpress, SiWebflow, SiGhost, SiContentful,
  SiYoutube, SiX, FaLinkedin, SiInstagram,
  SiGooglesheets, SiGooglecalendar, SiGoogledrive, SiNotion, SiAirtable, SiTodoist,
  SiGithub, SiGitlab, SiJira, SiLinear, SiVercel,
  SiStripe, SiPaypal, SiQuickbooks,
  SiGoogleanalytics, SiMixpanel, FaSegment: TbArrowsSplit,
  FaAws, SiSupabase, SiFirebase,
  SiShopify, SiWoocommerce,
  SiOpenai, SiReplicate, SiElevenlabs,
};

// Featured integrations shown by default (most popular ones)
const FEATURED_SLUGS = [
  "gmail", "slack", "github", "stripe", "notion", "google-sheets",
  "wordpress", "youtube", "shopify", "discord", "hubspot", "openai",
];

export default function IntegrationGrid() {
  const [search, setSearch] = useState("");

  const isSearching = search.length > 0;

  const filtered = useMemo(() => {
    if (!isSearching) {
      return integrations.filter((i) => FEATURED_SLUGS.includes(i.slug));
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
    <div className="w-full space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-3xl font-bold text-gray-900">
          40+ integrations ready to go
        </h2>
        <p className="text-gray-500 mt-2">
          Search for any app — if we support it, it shows up
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} resultCount={filtered.length} />

      {/* Integration cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((integration) => {
          const Icon = iconMap[integration.icon];
          return (
            <div
              key={integration.slug}
              className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                {Icon ? (
                  <Icon className="w-6 h-6 shrink-0" style={{ color: integration.color }} />
                ) : (
                  <span className="text-2xl">{integration.icon}</span>
                )}
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {integration.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">
                    {integration.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show count when not searching */}
      {!isSearching && (
        <p className="text-center text-sm text-gray-400">
          Showing {filtered.length} popular integrations.{" "}
          <button
            onClick={() => {
              const el = document.querySelector<HTMLInputElement>("input[type='text']");
              if (el) { el.focus(); el.value = " "; }
              setSearch(" ");
            }}
            className="text-red-500 hover:text-red-600 underline cursor-pointer"
          >
            View all {integrations.length}
          </button>
        </p>
      )}

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
