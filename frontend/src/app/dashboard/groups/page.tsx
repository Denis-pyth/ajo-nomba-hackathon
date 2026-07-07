"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllGroups, joinGroup, Group } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { IconPeople, IconArrowUpRight } from "../icons";

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function frequencyLabel(freq: string): string {
  return freq === "WEEKLY" ? "Weekly" : freq === "MONTHLY" ? "Monthly" : freq;
}

export default function GroupsPage() {
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const allData = await getAllGroups();
        const user = getUser();
        if (user) {
          const myData = allData.filter((g) => g.members?.some((m) => m.userId === user.id));
          setMyGroups(myData);
          const myIds = new Set(myData.map((g) => g.id));
          setAllGroups(allData.filter((g) => !myIds.has(g.id)));
        } else {
          setMyGroups([]);
          setAllGroups(allData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load groups");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleJoin(groupId: string) {
    const user = getUser();
    if (!user) return;
    setJoining(groupId);
    try {
      await joinGroup(groupId, { userId: user.id });
      const allData = await getAllGroups();
      const myData = allData.filter((g) => g.members?.some((m) => m.userId === user.id));
      setMyGroups(myData);
      const myIds = new Set(myData.map((g) => g.id));
      setAllGroups(allData.filter((g) => !myIds.has(g.id)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to join group");
    } finally {
      setJoining(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-[#f0f0f0] rounded animate-pulse" />
          <div className="h-10 w-32 bg-[#f0f0f0] rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[180px] rounded-2xl bg-[#f0f0f0] animate-pulse" />
          ))}
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

  function GroupCard({ group, isMember }: { group: Group; isMember: boolean }) {
    return (
      <div className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 rounded-2xl bg-white border border-[#f0f0f0] hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-semibold text-[#0a0a0a] truncate">{group.name}</span>
            <span className="text-[11px] text-[#737373]">
              {frequencyLabel(group.cycleFrequency)} · {formatCurrency(group.contributionAmount)} per cycle
            </span>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg shrink-0 ${
            group.status === "ACTIVE" ? "bg-[#0f9d58]/10 text-[#0f9d58]" :
            group.status === "PENDING" ? "bg-[#f59e0b]/10 text-[#f59e0b]" :
            "bg-[#737373]/10 text-[#737373]"
          }`}>
            {group.status}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#737373]">
          <span className="flex items-center gap-1">
            <IconPeople className="size-3.5" />
            {group.memberCount || group.members?.length || 0} members
          </span>
          <span className="truncate">Mode: {group.mode.replace("_", " ")}</span>
        </div>

        {group.nombaVirtualAccountId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#f5f5f5]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium text-[#737373] uppercase">Bank</span>
              <span className="text-sm font-semibold text-[#0a0a0a]">Nomba Bank MFB</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium text-[#737373] uppercase">Account Number</span>
              <span className="text-sm font-semibold text-[#0a0a0a] tracking-wider">{group.nombaVirtualAccountId}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          {isMember ? (
            <Link
              href={`/dashboard/ledger?group=${group.id}`}
              className="flex items-center gap-1.5 text-sm font-medium text-[#0f9d58] hover:underline underline-offset-2"
            >
              View Ledger
              <IconArrowUpRight className="size-3.5" />
            </Link>
          ) : (
            <button
              onClick={() => handleJoin(group.id)}
              disabled={joining === group.id}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0f9d58] text-white text-sm font-medium hover:bg-[#0e8f50] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {joining === group.id ? "Joining..." : "Join Group"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-[#0a0a0a]">My Groups</h1>
        <p className="text-sm text-[#737373] mt-0.5">{myGroups.length} group{myGroups.length !== 1 ? "s" : ""} you belong to</p>
      </div>

      {myGroups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {myGroups.map((group) => (
            <GroupCard key={group.id} group={group} isMember />
          ))}
        </div>
      )}

      {myGroups.length === 0 && (
        <div className="flex flex-col gap-3 items-center py-12 text-center rounded-2xl border border-dashed border-[#e5e5e5]">
          <p className="text-sm text-[#737373]">You haven&apos;t joined any groups yet.</p>
          <p className="text-xs text-[#a3a3a3]">Create a new group from the top bar.</p>
        </div>
      )}

      {allGroups.length > 0 && (
        <>
          <div className="h-px bg-[#f0f0f0]" />
          <div>
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-1">Available Groups</h2>
            <p className="text-sm text-[#737373] mb-5">Groups you can join</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {allGroups.map((group) => (
                <GroupCard key={group.id} group={group} isMember={false} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
