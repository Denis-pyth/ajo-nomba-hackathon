"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import Image from "next/image";

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );
}

function DecorativeBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#0f9d58]/[0.03] blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#0f9d58]/[0.04] blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#0f9d58]/[0.02] to-transparent blur-3xl" />
      <div className="absolute top-20 right-10 w-2 h-2 rounded-full bg-[#0f9d58]/20" />
      <div className="absolute top-40 left-20 w-1.5 h-1.5 rounded-full bg-[#0f9d58]/15" />
      <div className="absolute bottom-32 right-1/4 w-1 h-1 rounded-full bg-[#0f9d58]/20" />
      <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-[#0f9d58]/10" />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      setAuth(response.access_token, response.user);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-full flex flex-col bg-white overflow-hidden">
      <DecorativeBlobs />

      <nav className="relative z-10 w-full px-4 sm:px-6 lg:px-16 py-4">
        <Link href="/" className="relative inline-block h-10 w-[90px]">
          <Image
            src="/logo.png"
            alt="Ajo"
            fill
            className="object-contain"
            priority
            sizes="90px"
          />
        </Link>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center gap-2 mb-10">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f9d58]/10 mb-1">
              <span className="size-1.5 rounded-full bg-[#0f9d58] animate-pulse" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#0f9d58]">
                Welcome Back
              </span>
            </div>
            <h1 className="text-[32px] md:text-[40px] font-semibold text-[#0a0a0a] leading-[1.05] tracking-[-0.03em] text-center">
              Log in to Ajo
            </h1>
            <p className="text-[15px] text-[#737373] text-center leading-[1.6] max-w-sm">
              Continue managing your savings groups with confidence.
            </p>
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
              <label htmlFor="email" className="text-[13px] font-semibold text-[#0a0a0a]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="desire@example.com"
                className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder:text-[#a3a3a3] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[13px] font-semibold text-[#0a0a0a]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 pr-12 text-[15px] text-[#0a0a0a] placeholder:text-[#a3a3a3] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors cursor-pointer rounded-lg hover:bg-[#f5f5f5]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center rounded-full bg-[#0f9d58] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#0e8f50] hover:shadow-lg hover:shadow-[#0f9d58]/20 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[15px] text-[#737373]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#0f9d58] hover:underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
