"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated, clearAuth, getUser, StoredUser } from "@/lib/auth";
import {
  IconDashboard,
  IconPeople,
  IconCard,
  IconClipboard,
  IconDocument,
  IconShield,
  IconBell,
  IconSettings,
  IconHelp,
  IconSearch,
  IconMessage,
  IconMoreVertical,
  IconPlus,
  IconVerified,
  IconChevronRight,
  IconLogout,
} from "./icons";

const mainMenu = [
  { label: "Dashboard", icon: IconDashboard, href: "/dashboard" },
  { label: "My Groups", icon: IconPeople, href: "/dashboard/groups" },
  { label: "Payments", icon: IconCard, href: "/dashboard/payments" },
  { label: "Group Ledger", icon: IconClipboard, href: "/dashboard/ledger" },
  { label: "Statements", icon: IconDocument, href: "/dashboard/statements" },
  { label: "Trust Score", icon: IconShield, href: "/dashboard/trust" },
  { label: "Notifications", icon: IconBell, badge: 0, href: "/dashboard/notifications" },
];

const otherTools = [
  { label: "Settings", icon: IconSettings, href: "/dashboard/settings" },
  { label: "Need Help?", icon: IconHelp, href: "/dashboard/help" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const u = getUser();
    if (u) {
      setUser(u);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="size-10 border-[3px] border-[#0f9d58]/20 border-t-[#0f9d58] rounded-full animate-spin" />
        <p className="text-sm text-[#737373] font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fafafa]">
      {/* Sidebar */}
      <aside className="w-[280px] min-h-screen flex flex-col justify-between p-6 sticky top-0 left-0 shrink-0 bg-gradient-to-b from-[#0f9d58]/[0.04] via-[#0f9d58]/[0.02] to-transparent border-r border-[#0f9d58]/10">
        <div className="mb-8">
          <Link href="/" className="relative inline-block h-10 w-[77px]">
            <Image src="/logo.png" alt="Ajo" fill className="object-contain" priority sizes="77px" />
          </Link>
        </div>

        <div className="flex-1 flex flex-col gap-9 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <IconChevronRight className="size-3 text-[#0a0a0a]" />
              <span className="text-[11px] font-semibold tracking-[0.06em] text-[#737373] uppercase">Main Menu</span>
            </div>
            <nav className="flex flex-col gap-1">
              {mainMenu.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 h-12 px-4 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#0f9d58] text-white shadow-lg shadow-[#0f9d58]/20"
                        : "text-[#0a0a0a] hover:bg-[#0f9d58]/8"
                    }`}
                  >
                    <Icon />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-[#ef4444] text-white text-[11px] font-semibold px-1.5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <IconChevronRight className="size-3 text-[#0a0a0a]" />
              <span className="text-[11px] font-semibold tracking-[0.06em] text-[#737373] uppercase">Other Tools</span>
            </div>
            <nav className="flex flex-col gap-1">
              {otherTools.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 h-12 px-4 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#0f9d58] text-white shadow-lg shadow-[#0f9d58]/20"
                        : "text-[#0a0a0a] hover:bg-[#0f9d58]/8"
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => {
              clearAuth();
              router.push("/login");
            }}
            className="flex items-center gap-3 h-12 px-4 rounded-2xl text-sm font-medium text-[#737373] hover:bg-[#ef4444]/8 hover:text-[#ef4444] transition-all duration-200 cursor-pointer"
          >
            <IconLogout className="size-5" />
            <span>Log Out</span>
          </button>

          <div className="flex items-center justify-between py-2.5 px-3 rounded-[56px] hover:bg-[#0f9d58]/8 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="relative size-10 rounded-full overflow-hidden shrink-0 ring-2 ring-[#0f9d58]/20">
                <Image src="/logo.png" alt="User" fill className="object-cover" sizes="40px" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium text-[#0a0a0a] truncate">{user?.email || "Member"}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-[#737373]">Verified Member</span>
                  <IconVerified className="size-3.5 text-[#0f9d58]" />
                </div>
              </div>
            </div>
            <IconMoreVertical className="size-5 text-[#a3a3a3] shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 min-w-0">
        {/* TopNav */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#e5e5e5] w-[387px] bg-white shadow-sm transition-all duration-200 focus-within:border-[#0f9d58] focus-within:shadow-[0_0_0_4px_rgba(15,157,88,0.06)]">
            <IconSearch className="size-5 text-[#a3a3a3]" />
            <input
              type="text"
              placeholder="Search groups, payments, members..."
              className="bg-transparent outline-none text-sm text-[#0a0a0a] placeholder:text-[#a3a3a3] w-full"
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <button className="relative size-10 flex items-center justify-center rounded-xl text-[#0a0a0a] hover:text-[#0f9d58] hover:bg-[#0f9d58]/8 transition-all duration-200 cursor-pointer">
                <IconMessage className="size-[22px]" />
              </button>
              <div className="relative size-10 rounded-full overflow-hidden ring-2 ring-[#0f9d58]/20">
                <Image src="/logo.png" alt="User" fill className="object-cover" sizes="40px" />
              </div>
              <button className="relative size-10 flex items-center justify-center rounded-xl text-[#0a0a0a] hover:text-[#0f9d58] hover:bg-[#0f9d58]/8 transition-all duration-200 cursor-pointer">
                <IconBell className="size-[22px]" />
              </button>
            </div>
            <Link
              href="/dashboard/groups/new"
              className="flex items-center gap-1.5 bg-[#0f9d58] hover:bg-[#0e8f50] text-white px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 shadow-lg shadow-[#0f9d58]/20 hover:shadow-xl hover:shadow-[#0f9d58]/25 active:scale-[0.98] cursor-pointer"
            >
              <IconPlus className="size-4" />
              New Group
            </Link>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
