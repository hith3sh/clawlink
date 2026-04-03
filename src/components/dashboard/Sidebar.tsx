"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const { signOut } = useClerk();
  const { user } = useUser();

  const userName = user?.fullName || user?.firstName || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const userInitials = user?.firstName?.[0] || user?.fullName?.[0] || "U";
  const userImage = user?.imageUrl;

  return (
    <Sidebar variant="inset" className="border-none">
      <SidebarHeader className="px-3 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/dashboard"
              className="dashboard-panel-soft flex items-center gap-3 px-3 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/18 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">
                  ClawLink
                </p>
                <p className="text-xs text-muted-foreground">Hosted app connections</p>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 pb-3">
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="px-3 text-[0.65rem] uppercase tracking-[0.26em] text-muted-foreground/80">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 gap-1">
              {platformNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    className="h-11 rounded-2xl px-3 text-sm text-muted-foreground hover:bg-white/[0.05] hover:text-sidebar-foreground data-[active=true]:bg-white/[0.08] data-[active=true]:text-sidebar-foreground data-[active=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
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

        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="px-3 text-[0.65rem] uppercase tracking-[0.26em] text-muted-foreground/80">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 gap-1">
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
                    className="h-11 rounded-2xl px-3 text-sm text-muted-foreground hover:bg-white/[0.05] hover:text-sidebar-foreground data-[active=true]:bg-white/[0.08] data-[active=true]:text-sidebar-foreground"
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
            <div className="dashboard-panel-soft flex items-center gap-3 px-3 py-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ redirectUrl: "/" })}
              className="h-11 rounded-2xl px-3 text-muted-foreground hover:bg-white/[0.05] hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
