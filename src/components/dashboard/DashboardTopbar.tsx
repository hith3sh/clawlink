"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, MessageSquareText } from "lucide-react";

import { DashboardPlanBadge } from "@/components/dashboard/DashboardPlanBadge";
import { buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TITLES: Array<{ match: (p: string) => boolean; title: string }> = [
  { match: (p) => p === "/dashboard", title: "Home" },
  { match: (p) => p === "/dashboard/integrations", title: "Connections" },
  { match: (p) => p.startsWith("/dashboard/integrations/"), title: "Connection Setup" },
  { match: (p) => p === "/dashboard/logs", title: "Usage" },
  { match: (p) => p === "/dashboard/settings", title: "Settings" },
  { match: (p) => p === "/dashboard/feedback", title: "Feedback" },
  { match: (p) => p === "/dashboard/request-app", title: "Request App" },
];

export function DashboardTopbar() {
  const pathname = usePathname();
  const title = TITLES.find((entry) => entry.match(pathname))?.title ?? "Dashboard";

  return (
    <div className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <h1 className="text-sm font-medium text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <DashboardPlanBadge />

          <div className="hidden items-center gap-1 sm:flex">
          <Link
            href="/dashboard/feedback"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <MessageSquareText className="h-4 w-4" />
            Feedback
          </Link>
          <Link
            href="https://docs.claw-link.dev"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <BookOpen className="h-4 w-4" />
            Docs
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
