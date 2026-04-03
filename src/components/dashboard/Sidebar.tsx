"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { SiGmail, SiSlack, SiGithub, SiStripe } from "react-icons/si";
import { 
  FiHome, FiGrid, FiActivity, FiSettings, FiLogOut,
  FiZap
} from "react-icons/fi";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: FiHome },
  { href: "/dashboard/integrations", label: "Integrations", icon: FiGrid },
  { href: "/dashboard/logs", label: "Request Logs", icon: FiActivity },
  { href: "/dashboard/settings", label: "Settings", icon: FiSettings },
];

const quickIntegrations = [
  { name: "Gmail", icon: SiGmail, color: "#EA4335", connected: false },
  { name: "Slack", icon: SiSlack, color: "#4A154B", connected: false },
  { name: "GitHub", icon: SiGithub, color: "#181717", connected: false },
  { name: "Stripe", icon: SiStripe, color: "#635BFF", connected: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();

  const userName = user?.fullName || user?.firstName || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const userInitials = user?.firstName?.[0] || user?.fullName?.[0] || "U";
  const userImage = user?.imageUrl;

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <FiZap className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">ClawLink</span>
        </Link>
      </div>

      {/* Quick Connect */}
      <div className="p-4 border-b border-gray-800">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Quick Connect</p>
        <div className="flex gap-2">
          {quickIntegrations.map((item) => (
            <button
              key={item.name}
              className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              style={{ color: item.color }}
              title={item.name}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-red-500/10 text-red-400" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          {userImage ? (
            <Image
              src={userImage} 
              alt={userName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
              {userInitials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{userEmail || "Free Plan"}</p>
          </div>
        </div>
        <button 
          onClick={() => signOut({ redirectUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-sm"
        >
          <FiLogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
