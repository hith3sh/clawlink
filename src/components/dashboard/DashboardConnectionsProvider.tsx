"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { IntegrationConnectionSummary } from "@/lib/server/integration-store";

interface DashboardConnectionsContextValue {
  connections: IntegrationConnectionSummary[];
  connectedSlugs: Set<string>;
  connectionsBySlug: Map<string, IntegrationConnectionSummary[]>;
  loading: boolean;
  refetch: () => Promise<void>;
}

const DashboardConnectionsContext =
  createContext<DashboardConnectionsContextValue | null>(null);

export function DashboardConnectionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const [connections, setConnections] = useState<IntegrationConnectionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/integrations?summary=true");
      const data = (await response.json()) as {
        integrations?: IntegrationConnectionSummary[];
      };

      if (data.integrations) {
        setConnections(data.integrations);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConnections();
  }, [fetchConnections]);

  const connectedSlugs = useMemo(
    () => new Set(connections.filter((c) => c.authState === "active").map((c) => c.integration)),
    [connections],
  );

  const connectionsBySlug = useMemo(() => {
    const map = new Map<string, IntegrationConnectionSummary[]>();
    for (const c of connections) {
      const existing = map.get(c.integration);
      if (existing) {
        existing.push(c);
      } else {
        map.set(c.integration, [c]);
      }
    }
    return map;
  }, [connections]);

  return (
    <DashboardConnectionsContext.Provider
      value={{
        connections,
        connectedSlugs,
        connectionsBySlug,
        loading,
        refetch: fetchConnections,
      }}
    >
      {children}
    </DashboardConnectionsContext.Provider>
  );
}

export function useDashboardConnections() {
  const ctx = useContext(DashboardConnectionsContext);
  if (!ctx) {
    throw new Error(
      "useDashboardConnections must be used within DashboardConnectionsProvider",
    );
  }
  return ctx;
}
