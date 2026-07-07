"use client";

import { useEffect, useState, FormEvent } from "react";
import { getMe, updateBankDetails, UserProfile } from "@/lib/api";

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bankCode, setBankCode] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getMe()
      .then((u) => {
        setUser(u);
        setBankCode(u.bankCode || "");
        setBankAccountNumber(u.bankAccountNumber || "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!bankCode.trim() || !bankAccountNumber.trim()) {
      setError("Both bank code and account number are required");
      return;
    }

    setSaving(true);
    try {
      await updateBankDetails({ bankCode: bankCode.trim(), bankAccountNumber: bankAccountNumber.trim() });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update bank details");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-40 bg-[#f0f0f0] rounded animate-pulse" />
        <div className="h-[300px] rounded-2xl bg-[#f0f0f0] animate-pulse" />
      </div>
    );
  }

  if (error && !user) {
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

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-[#0a0a0a] mb-6">Settings</h1>

      <div className="flex flex-col gap-8">
        <div className="p-6 rounded-2xl border border-[#f0f0f0] bg-white">
          <h2 className="text-sm font-semibold text-[#0a0a0a] mb-4">Profile</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#737373]">Full Name</span>
              <span className="text-[15px] font-medium text-[#0a0a0a]">{user?.fullName}</span>
            </div>
            <div className="h-px bg-[#f0f0f0]" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#737373]">Email</span>
              <span className="text-[15px] font-medium text-[#0a0a0a]">{user?.email}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-[#f0f0f0] bg-white flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-[#0a0a0a]">Bank Details for Payouts</h2>

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

          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 animate-fade-in flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Bank details updated successfully.</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="bankCode" className="text-[13px] font-semibold text-[#0a0a0a]">Bank Code</label>
            <input
              id="bankCode"
              type="text"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              placeholder="e.g. 058 (GTBank)"
              className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder:text-[#a3a3a3] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
              required
            />
            <p className="text-[11px] text-[#a3a3a3]">Enter your NIBSS bank code.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="bankAccountNumber" className="text-[13px] font-semibold text-[#0a0a0a]">Account Number</label>
            <input
              id="bankAccountNumber"
              type="text"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="10-digit NUBAN account number"
              className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder:text-[#a3a3a3] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
              required
              maxLength={10}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 flex items-center justify-center rounded-full bg-[#0f9d58] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#0e8f50] hover:shadow-lg hover:shadow-[#0f9d58]/20 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Bank Details"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
