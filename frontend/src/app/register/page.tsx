"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import Image from "next/image";

type PasswordStrength = "idle" | "weak" | "fair" | "good" | "strong";

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return "idle";
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return "weak";
  if (score === 3) return "fair";
  if (score === 4) return "good";
  return "strong";
}

const strengthConfig: Record<
  PasswordStrength,
  { label: string; color: string; width: string }
> = {
  idle: { label: "", color: "", width: "0%" },
  weak: { label: "Weak", color: "bg-[#ef4444]", width: "25%" },
  fair: { label: "Fair", color: "bg-[#f59e0b]", width: "50%" },
  good: { label: "Good", color: "bg-[#3b82f6]", width: "75%" },
  strong: { label: "Strong", color: "bg-[#0f9d58]", width: "100%" },
};

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthMeta = strengthConfig[strength];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (strength === "weak") {
      setError(
        "Password is too weak. Use at least 8 characters with a mix of letters, numbers, and symbols.",
      );
      return;
    }

    setLoading(true);
    try {
      await registerUser({ fullName, email, password });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
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
                Get Started
              </span>
            </div>
            <h1 className="text-[32px] md:text-[40px] font-semibold text-[#0a0a0a] leading-[1.05] tracking-[-0.03em] text-center">
              Create your account
            </h1>
            <p className="text-[15px] text-[#737373] text-center leading-[1.6] max-w-sm">
              Join thousands of Nigerians saving together with transparency and
              trust.
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-[#0f9d58]/20 bg-gradient-to-b from-[#0f9d58]/5 to-transparent px-8 py-12 text-center animate-fade-in">
              <div className="flex items-center justify-center size-16 rounded-full bg-[#0f9d58] shadow-lg shadow-[#0f9d58]/25">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#0a0a0a]">
                Account Created!
              </h2>
              <p className="text-[15px] text-[#737373] leading-[1.6]">
                Redirecting you to login...
              </p>
              <div className="w-full h-1.5 rounded-full bg-[#e5e5e5] overflow-hidden">
                <div className="h-full rounded-full bg-[#0f9d58] animate-[shrink_1.5s_ease-in-out_forwards]" />
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in flex items-start gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="shrink-0 mt-0.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="fullName"
                    className="text-[13px] font-semibold text-[#0a0a0a]"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Desire Denis"
                    className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 text-[15px] text-[#0a0a0a] placeholder:text-[#a3a3a3] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-[13px] font-semibold text-[#0a0a0a]"
                  >
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
                  <label
                    htmlFor="password"
                    className="text-[13px] font-semibold text-[#0a0a0a]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3.5 pr-12 text-[15px] text-[#0a0a0a] placeholder:text-[#a3a3a3] outline-none transition-all duration-200 focus:border-[#0f9d58] focus:ring-4 focus:ring-[#0f9d58]/8 hover:border-[#d1d1d1]"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors cursor-pointer rounded-lg hover:bg-[#f5f5f5]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>

                  {password && (
                    <div className="flex flex-col gap-1.5 mt-1 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-[#e5e5e5] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${strengthMeta.color}`}
                            style={{ width: strengthMeta.width }}
                          />
                        </div>
                        <span
                          className={`text-[11px] font-semibold ${strengthMeta.color.replace("bg", "text")}`}
                        >
                          {strengthMeta.label}
                        </span>
                      </div>
                      <ul className="flex flex-wrap gap-x-4 gap-y-0.5">
                        {[
                          { met: password.length >= 8, label: "8+ characters" },
                          { met: /[a-z]/.test(password), label: "Lowercase" },
                          { met: /[A-Z]/.test(password), label: "Uppercase" },
                          { met: /[0-9]/.test(password), label: "Number" },
                          {
                            met: /[^A-Za-z0-9]/.test(password),
                            label: "Special char",
                          },
                        ].map((rule) => (
                          <li
                            key={rule.label}
                            className={`flex items-center gap-1 text-[11px] transition-colors duration-200 ${
                              rule.met ? "text-[#0f9d58]" : "text-[#a3a3a3]"
                            }`}
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {rule.met ? (
                                <polyline points="20 6 9 17 4 12" />
                              ) : (
                                <line x1="18" y1="6" x2="6" y2="18" />
                              )}
                            </svg>
                            {rule.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center rounded-full bg-[#0f9d58] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#0e8f50] hover:shadow-lg hover:shadow-[#0f9d58]/20 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          opacity="0.25"
                        />
                        <path
                          d="M4 12a8 8 0 0 1 8-8"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-[15px] text-[#737373]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#0f9d58] hover:underline underline-offset-2"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
