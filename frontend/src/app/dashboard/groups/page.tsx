"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAllGroups, joinGroup, Group, getGroupStatementUrl, reconcileGroup, closeGroupVirtualAccount } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { IconPeople, IconArrowUpRight, IconDocument, IconRefund, IconClose, IconMoreVertical } from "../icons";
import ConfirmModal from "../../components/ConfirmModal";

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

  async function handleJoin(groupId: string, onError: (msg: string) => void) {
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
      onError(err instanceof Error ? err.message : "Failed to join group");
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
    const [menuOpen, setMenuOpen] = useState(false);
    const [reconciling, setReconciling] = useState(false);
    const [reconcileMsg, setReconcileMsg] = useState<string | null>(null);
    const [closing, setClosing] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [joinError, setJoinError] = useState<string | null>(null);
    const [closeError, setCloseError] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setMenuOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleReconcile() {
      setReconciling(true);
      setReconcileMsg(null);
      try {
        await reconcileGroup(group.id);
        setReconcileMsg("Balance reconciled successfully!");
        setTimeout(() => setReconcileMsg(null), 4000);
      } catch (err) {
        setReconcileMsg(err instanceof Error ? err.message : "Reconciliation failed");
      } finally {
        setReconciling(false);
      }
    }

    function handleClose() {
      setMenuOpen(false);
      setConfirmOpen(true);
    }

    async function handleConfirmClose() {
      setClosing(true);
      setCloseError(null);
      try {
        await closeGroupVirtualAccount(group.id);
        window.location.href = "/dashboard";
      } catch (err) {
        setCloseError(err instanceof Error ? err.message : "Failed to close group");
      } finally {
        setClosing(false);
        setConfirmOpen(false);
      }
    }

    return (
      <div className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 rounded-2xl bg-white border border-[#f0f0f0] hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-semibold text-[#0a0a0a] truncate">{group.name}</span>
            <span className="text-[11px] text-[#737373]">
              {frequencyLabel(group.cycleFrequency)} · {formatCurrency(group.contributionAmount)} per cycle
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg shrink-0 ${
              group.status === "ACTIVE" ? "bg-[#0f9d58]/10 text-[#0f9d58]" :
              group.status === "PENDING" ? "bg-[#f59e0b]/10 text-[#f59e0b]" :
              "bg-[#737373]/10 text-[#737373]"
            }`}>
              {group.status}
            </span>
            {isMember && group.status !== "COMPLETED" && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors cursor-pointer shrink-0"
                >
                  <IconMoreVertical className="size-4" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#f0f0f0] shadow-lg p-2 z-10 flex flex-col gap-1">
                    <a
                      href={getGroupStatementUrl(group.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#0f9d58] hover:bg-[#0f9d58]/8 transition-colors"
                    >
                      <IconDocument className="size-4" />
                      Download Statement
                    </a>
                    <button
                      onClick={() => { setMenuOpen(false); handleReconcile(); }}
                      disabled={reconciling}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#3b82f6] hover:bg-[#3b82f6]/8 transition-colors disabled:opacity-60 text-left cursor-pointer"
                    >
                      {reconciling ? (
                        <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                          <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <IconRefund className="size-4" />
                      )}
                      {reconciling ? "Reconciling..." : "Reconcile Balance"}
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); handleClose(); }}
                      disabled={closing}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#ef4444] hover:bg-[#ef4444]/8 transition-colors disabled:opacity-60 text-left cursor-pointer"
                    >
                      {closing ? (
                        <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                          <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <IconClose className="size-4" />
                      )}
                      {closing ? "Closing..." : "Close Group"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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

        {reconcileMsg && (
          <div className={`text-xs font-medium px-3 py-2 rounded-xl ${
            reconcileMsg.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {reconcileMsg}
          </div>
        )}

        {joinError && (
          <div className="text-xs font-medium px-3 py-2 rounded-xl bg-red-50 text-red-700">
            {joinError}
          </div>
        )}

        {closeError && (
          <div className="text-xs font-medium px-3 py-2 rounded-xl bg-red-50 text-red-700">
            {closeError}
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
              onClick={() => {
                setJoinError(null);
                handleJoin(group.id, (msg) => setJoinError(msg));
              }}
              disabled={joining === group.id}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0f9d58] text-white text-sm font-medium hover:bg-[#0e8f50] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {joining === group.id ? "Joining..." : "Join Group"}
            </button>
          )}
        </div>

        <ConfirmModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmClose}
          title="Close Group"
          message="Close this group and expire its virtual account? This action cannot be undone."
          confirmLabel="Close Group"
          cancelLabel="Cancel"
          isLoading={closing}
          danger
        />
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
