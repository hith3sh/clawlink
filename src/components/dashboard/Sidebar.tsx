"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  Home,
  Link2,
  Activity,
  CreditCard,
  Settings,
  ExternalLink,
  LogOut,
  MessageSquareText,
  PlusCircle,
  type LucideIcon,
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

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
}

const platformNav: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/integrations", label: "Connections", icon: Link2 },
  { href: "/dashboard/logs", label: "Usage", icon: Activity },
  { href: "/dashboard/request-app", label: "Request App", icon: PlusCircle },
];

const resourceNav: NavItem[] = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquareText },
  { href: "https://docs.claw-link.dev", label: "Documentation", icon: ExternalLink, external: true },
];

function isActiveHref(pathname: string, item: NavItem): boolean {
  if (item.external) return false;
  if (item.href === "/dashboard") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SlidingNavMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const activeIndex = items.findIndex((item) => isActiveHref(pathname, item));
  const [pill, setPill] = useState<{ top: number; height: number } | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPill, setHoverPill] = useState<{ top: number; height: number } | null>(null);

  // Measuring DOM after layout is the documented use case for useLayoutEffect+setState.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (activeIndex < 0) {
      setPill(null);
      return;
    }
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    setPill({ top: el.offsetTop, height: el.offsetHeight });
  }, [activeIndex, pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => {
      if (activeIndex >= 0) {
        const el = itemRefs.current[activeIndex];
        if (el) setPill({ top: el.offsetTop, height: el.offsetHeight });
      }
      if (hoverIndex !== null) {
        const el = itemRefs.current[hoverIndex];
        if (el) setHoverPill({ top: el.offsetTop, height: el.offsetHeight });
      }
    });
    ro.observe(list);
    return () => ro.disconnect();
  }, [activeIndex, hoverIndex]);

  useLayoutEffect(() => {
    if (hoverIndex === null) {
      return;
    }
    const el = itemRefs.current[hoverIndex];
    if (!el) return;
    setHoverPill({ top: el.offsetTop, height: el.offsetHeight });
  }, [hoverIndex]);

  return (
    <SidebarMenu
      ref={listRef}
      className="relative mt-1 gap-0.5"
      onMouseLeave={() => setHoverIndex(null)}
    >
      {hoverPill ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 z-0 rounded-lg bg-sidebar-accent/40 shadow-sm ring-1 ring-black/5"
          initial={false}
          animate={{
            top: hoverPill.top,
            height: hoverPill.height,
            opacity: hoverIndex !== null && hoverIndex !== activeIndex ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 40, opacity: { duration: 0.15 } }}
        />
      ) : null}
      {pill ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 z-0 rounded-lg bg-sidebar-accent"
          initial={false}
          animate={{ top: pill.top, height: pill.height }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      ) : null}
      {items.map((item, index) => {
        const active = index === activeIndex;
        return (
          <SidebarMenuItem
            key={item.href}
            ref={(el: HTMLLIElement | null) => {
              itemRefs.current[index] = el;
            }}
            className="relative z-10"
            onMouseEnter={() => setHoverIndex(index)}
          >
            <SidebarMenuButton
              render={
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                />
              }
              isActive={active}
              className="h-10 rounded-lg px-3 text-[15px] bg-transparent! hover:bg-transparent! active:bg-transparent! data-active:bg-transparent! [&_svg]:size-[18px]"
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  const { user } = useUser();

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  return (
    <Sidebar variant="inset" className="border-none">
      <SidebarHeader className="px-3 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-sidebar-accent"
            >
              <Image
                src="/images/logo/clawlink.svg"
                alt="ClawLink"
                width={26}
                height={26}
                className="h-[26px] w-[26px] shrink-0"
              />
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                ClawLink
              </span>
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
            <SlidingNavMenu items={platformNav} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs text-muted-foreground">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SlidingNavMenu items={resourceNav} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-3">
        <SidebarMenu>
          {userEmail ? (
            <SidebarMenuItem>
              <div className="px-3 py-2 text-xs text-muted-foreground truncate">
                {userEmail}
              </div>
            </SidebarMenuItem>
          ) : null}
          <SidebarMenuItem>
            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-[15px] text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-[18px] w-[18px]" />
                <span>Sign Out</span>
              </button>
            </SignOutButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
