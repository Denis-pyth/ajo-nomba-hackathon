"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllGroups, Group } from "@/lib/api";
import { getUser } from "@/lib/auth";
import {
  IconPeople,
  IconCard,
  IconShield,
  IconWallet,
  IconArrowUpRight,
  IconMoreVertical,
} from "./icons";

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function frequencyLabel(freq: string): string {
  return freq === "WEEKLY" ? "Weekly" : freq === "MONTHLY" ? "Monthly" : freq;
}

function frequencyColor(freq: string): string {
  return freq === "WEEKLY" ? "text-[#3b82f6]" : "text-[#f59e0b]";
}

function frequencyBg(freq: string): string {
  return freq === "WEEKLY" ? "bg-[#3b82f6]/10" : "bg-[#f59e0b]/10";
}

function StatCard({
  label,
  value,
  subLabel,
  subColor,
  iconBg,
  iconColor,
  icon,
}: {
  label: string;
  value: string;
  subLabel?: string;
  subColor?: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-[#f0f0f0] bg-white hover:border-[#0f9d58]/20 hover:shadow-md hover:shadow-[#0f9d58]/5 transition-all duration-200">
      <div className={`flex items-center justify-center size-11 sm:size-[56px] rounded-2xl ${iconBg} ${iconColor} shrink-0`}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-medium text-[#737373] uppercase tracking-[0.04em]">{label}</span>
        <span className="text-base sm:text-lg font-semibold text-[#0a0a0a] tracking-[-0.01em] truncate">{value}</span>
        {subLabel && (
          <span className={`text-[10px] font-medium ${subColor} bg-[#0a0a0a]/[0.03] px-2 py-0.5 rounded-lg w-fit`}>
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function ActiveGroupCard({ group }: { group: Group }) {
  const freq = group.cycleFrequency;
  const freqColorClass = frequencyColor(freq);
  const freqBgClass = frequencyBg(freq);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white border border-[#f0f0f0] hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center size-12 sm:size-14 rounded-2xl ${freqBgClass} ${freqColorClass} shrink-0`}>
          <IconPeople className="size-6 sm:size-7" />
        </div>
        <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-sm font-semibold text-[#0a0a0a] truncate">{group.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg shrink-0 ${freqBgClass} ${freqColorClass}`}>
                {frequencyLabel(freq)}
              </span>
            </div>
            <button className="text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors cursor-pointer shrink-0">
              <IconMoreVertical className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-0 sm:items-center sm:justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-[#a3a3a3] font-medium uppercase">Contribution</span>
              <span className="text-sm font-semibold text-[#0a0a0a]">{formatCurrency(group.contributionAmount)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-[#a3a3a3] font-medium uppercase">Members</span>
              <span className="text-sm font-semibold text-[#0a0a0a]">{group.memberCount || group.members?.length || 0}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-[#a3a3a3] font-medium uppercase">Status</span>
              <span className="text-sm font-semibold text-[#0a0a0a]">{group.status}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-[#a3a3a3] font-medium uppercase">Slot</span>
              <span className="text-sm font-semibold text-[#0a0a0a]">{group.mySlot || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/ledger?group=${group.id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-[#737373] hover:text-[#0f9d58] transition-colors cursor-pointer"
        >
          View Ledger
          <IconArrowUpRight className="size-3.5" />
        </Link>
        <button className="bg-[#0f9d58] hover:bg-[#0e8f50] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 shadow-lg shadow-[#0f9d58]/15 hover:shadow-xl hover:shadow-[#0f9d58]/20 active:scale-[0.98] cursor-pointer">
          Make Payment
        </button>
      </div>
    </div>
  );
}

function UpcomingPayments({ groups }: { groups: Group[] }) {
  const activeGroups = groups.filter((g) => g.status === "ACTIVE" || g.status === "PENDING");
  const nextGroup = activeGroups[0];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-[#f0f0f0] bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#0a0a0a]">Upcoming Payments</h3>
      </div>
      {nextGroup ? (
        <div className="flex flex-col gap-4 rounded-2xl bg-[#ef4444]/5 border border-[#ef4444]/10 px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-14 rounded-2xl bg-[#ef4444]/10 text-[#ef4444]">
              <IconCard className="size-7" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-lg font-semibold text-[#0a0a0a]">{formatCurrency(nextGroup.contributionAmount)}</span>
              <span className="text-sm text-[#0a0a0a]">{nextGroup.name}</span>
              <span className="text-[10px] font-medium text-[#ef4444]">Due next {frequencyLabel(nextGroup.cycleFrequency).toLowerCase()} cycle</span>
            </div>
          </div>
          <button className="w-full bg-[#0f9d58] hover:bg-[#0e8f50] text-white py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 shadow-lg shadow-[#0f9d58]/15 hover:shadow-xl hover:shadow-[#0f9d58]/20 active:scale-[0.98] cursor-pointer">
            Pay Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 rounded-2xl bg-[#0f9d58]/5 border border-[#0f9d58]/10 px-5 py-6 text-center">
          <p className="text-sm text-[#737373]">No pending payments</p>
          <Link
            href="/dashboard/groups/new"
            className="text-sm font-medium text-[#0f9d58] hover:underline underline-offset-2"
          >
            Join or create a group
          </Link>
        </div>
      )}
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-[#f0f0f0] bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#0a0a0a]">Recent Activity</h3>
        <Link href="/dashboard/payments" className="text-xs font-medium text-[#0f9d58] hover:underline underline-offset-2 cursor-pointer">
          View All
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-[#737373]">No activity yet</p>
        <p className="text-xs text-[#a3a3a3] mt-1">Payments and payouts will appear here.</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const allGroups = await getAllGroups();
        const user = getUser();
        if (user) {
          const myGroups = allGroups.filter((g) =>
            g.members?.some((m) => m.userId === user.id)
          );
          setGroups(myGroups);
        } else {
          setGroups([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[88px] rounded-2xl bg-[#f0f0f0] animate-pulse" />
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 h-[300px] rounded-2xl bg-[#f0f0f0] animate-pulse" />
          <div className="w-full lg:w-[380px] flex flex-col gap-6">
            <div className="h-[180px] rounded-2xl bg-[#f0f0f0] animate-pulse" />
            <div className="h-[200px] rounded-2xl bg-[#f0f0f0] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-red-600 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-full bg-[#0f9d58] text-white text-sm font-medium hover:bg-[#0e8f50] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const activeGroupCount = groups.filter((g) => g.status === "ACTIVE").length;

  const stats = [
    {
      label: "Groups Joined",
      value: String(groups.length),
      subLabel: `${activeGroupCount} active`,
      subColor: "text-[#f59e0b]",
      iconBg: "bg-[#f59e0b]/10",
      iconColor: "text-[#f59e0b]",
      icon: <IconPeople className="size-7" />,
    },
    {
      label: "Pending Payment",
      value: groups.length > 0 ? formatCurrency(groups[0].contributionAmount) : "None",
      subLabel: groups.length > 0 ? "Next cycle" : "No groups",
      subColor: groups.length > 0 ? "text-[#ef4444]" : "text-[#737373]",
      iconBg: "bg-[#ef4444]/10",
      iconColor: "text-[#ef4444]",
      icon: <IconCard className="size-7" />,
    },
    {
      label: "Total Savings",
      value: "—",
      subLabel: "Coming soon",
      subColor: "text-[#737373]",
      iconBg: "bg-[#0f9d58]/10",
      iconColor: "text-[#0f9d58]",
      icon: <IconWallet className="size-7" />,
    },
    {
      label: "Trust Score",
      value: "—",
      subLabel: "Coming soon",
      subColor: "text-[#737373]",
      iconBg: "bg-[#3b82f6]/10",
      iconColor: "text-[#3b82f6]",
      icon: <IconShield className="size-7" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6 p-4 sm:p-5 rounded-2xl border border-[#f0f0f0] bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0a0a0a]">Active Groups</h3>
            <Link href="/dashboard/groups" className="text-xs font-medium text-[#0f9d58] hover:underline underline-offset-2 cursor-pointer">
              See All
            </Link>
          </div>
          <div className="flex flex-col gap-4 sm:gap-5">
            {groups.length === 0 && (
              <div className="flex flex-col gap-3 items-center py-10 text-center">
                <p className="text-sm text-[#737373]">You haven&apos;t joined any groups yet.</p>
                <p className="text-xs text-[#a3a3a3]">Use the New Group button in the top bar to create one.</p>
              </div>
            )}
            {groups.map((group) => (
              <ActiveGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0">
          <UpcomingPayments groups={groups} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
