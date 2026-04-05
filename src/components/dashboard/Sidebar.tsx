"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  Home,
  Link2,
  Activity,
  Settings,
  ExternalLink,
  LogOut,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const platformNav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/integrations", label: "Connections", icon: Link2 },
  { href: "/dashboard/logs", label: "Usage", icon: Activity },
];

const resourceNav = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "https://docs.claw-link.dev", label: "Documentation", icon: ExternalLink, external: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  return (
    <Sidebar variant="inset" className="border-none">
      <SidebarHeader className="px-3 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2">
              <Zap className="h-4 w-4 text-foreground" />
              <span className="text-sm font-semibold text-foreground">ClawLink</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs text-muted-foreground">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-1 gap-0.5">
              {platformNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    className="h-9 rounded-lg px-3 text-sm"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs text-muted-foreground">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-1 gap-0.5">
              {resourceNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      />
                    }
                    isActive={!item.external && pathname === item.href}
                    className="h-9 rounded-lg px-3 text-sm"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </SignOutButton>
          </SidebarMenuItem>
          {userEmail ? (
            <SidebarMenuItem>
              <div className="px-3 py-2 text-xs text-muted-foreground truncate">
                {userEmail}
              </div>
            </SidebarMenuItem>
          ) : null}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
