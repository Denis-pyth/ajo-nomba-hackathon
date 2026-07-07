"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createGroup, CreateGroupRequest } from "@/lib/api";

export default function NewGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mode, setMode] = useState<CreateGroupRequest["mode"]>("CLASSIC");
  const [contributionAmount, setContributionAmount] = useState("");
  const [cycleFrequency, setCycleFrequency] = useState<CreateGroupRequest["cycleFrequency"]>("MONTHLY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !contributionAmount.trim()) {
      setError("All fields are required");
      return;
    }

    const amount = Number(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Contribution amount must be a positive number");
      return;
    }

    setLoading(true);
    try {
      await createGroup({
        name: name.trim(),
        mode,
        contributionAmount: amount,
        cycleFrequency,
      });
      router.push("/dashboard/groups");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/groups" className="text-sm text-[#737373] hover:text-[#0f9d58] transition-colors">
          ← Back to Groups
        </Link>
        <h1 className="text-xl font-semibold text-[#0a0a0a] mt-2">Create a New Group</h1>
        <p className="text-sm text-[#737373] mt-0.5">Set up your Ajo group and get a dedicated virtual account.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-[13px] font-semibold text-[#0a0a0a]">Group Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Friends Monthly Savings"
            className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder:text-[#a3a3a3] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="mode" className="text-[13px] font-semibold text-[#0a0a0a]">Group Mode</label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as CreateGroupRequest["mode"])}
            className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
          >
            <option value="CLASSIC">Classic (Rotating Savings)</option>
            <option value="PURPOSE_BOUND">Purpose Bound (Save toward a purchase)</option>
            <option value="AGENT_LED">Agent Led (Offline savings)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contributionAmount" className="text-[13px] font-semibold text-[#0a0a0a]">Contribution Amount (₦)</label>
          <input
            id="contributionAmount"
            type="number"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            placeholder="e.g. 20000"
            className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder:text-[#a3a3a3] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
            required
            min="1"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cycleFrequency" className="text-[13px] font-semibold text-[#0a0a0a]">Cycle Frequency</label>
          <select
            id="cycleFrequency"
            value={cycleFrequency}
            onChange={(e) => setCycleFrequency(e.target.value as CreateGroupRequest["cycleFrequency"])}
            className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center rounded-full bg-[#0f9d58] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#0e8f50] hover:shadow-lg hover:shadow-[#0f9d58]/20 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Creating...
              </span>
            ) : (
              "Create Group"
            )}
          </button>
          <Link
            href="/dashboard/groups"
            className="px-7 py-4 rounded-full border border-[#e5e5e5] text-[#0a0a0a] text-[15px] font-medium hover:bg-[#f5f5f5] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
