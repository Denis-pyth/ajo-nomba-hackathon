"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LedgerPage() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/groups" className="text-sm text-[#737373] hover:text-[#0f9d58] transition-colors">
          ← Groups
        </Link>
      </div>
      <h1 className="text-xl font-semibold text-[#0a0a0a]">Group Ledger</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-[#e5e5e5]">
        <p className="text-sm text-[#737373]">
          {groupId ? `Ledger for group ${groupId} will appear here.` : "Select a group to view its ledger."}
        </p>
        <p className="text-xs text-[#a3a3a3] mt-1">All contributions and payouts are tracked in real time.</p>
      </div>
    </div>
  );
}
