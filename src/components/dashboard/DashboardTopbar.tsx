"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, MessageSquareText } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TITLES = [
  { match: (pathname: string) => pathname === "/dashboard", title: "Home", eyebrow: "Workspace" },
  { match: (pathname: string) => pathname === "/dashboard/integrations", title: "Connections", eyebrow: "Workspace" },
  { match: (pathname: string) => pathname.startsWith("/dashboard/integrations/"), title: "Connection Setup", eyebrow: "Workspace" },
  { match: (pathname: string) => pathname === "/dashboard/logs", title: "Usage", eyebrow: "Workspace" },
  { match: (pathname: string) => pathname === "/dashboard/settings", title: "Settings", eyebrow: "Workspace" },
];

function resolveTitle(pathname: string) {
  return TITLES.find((entry) => entry.match(pathname)) ?? {
    title: "Dashboard",
    eyebrow: "Workspace",
  };
}

export function DashboardTopbar() {
  const pathname = usePathname();
  const { title, eyebrow } = resolveTitle(pathname);

  return (
    <div className="dashboard-content sticky top-0 z-20 border-b border-white/6 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <SidebarTrigger className="rounded-xl border border-white/8 bg-white/[0.03]" />
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.26em] text-muted-foreground">
              {eyebrow}
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="mailto:hello@claw-link.dev"
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
  );
}
