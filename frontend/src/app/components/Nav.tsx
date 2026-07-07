"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQs", href: "/#faqs" },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  function handleLogout() {
    clearAuth();
    setLoggedIn(false);
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-b from-[#0f9d58]/[0.1] via-transparent to-transparent backdrop-blur-md border-b border-[#f0f0f0]/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-16 py-4">
        <Link href="/" className="relative h-10 w-[90px] shrink-0">
          <Image
            src="/logo.png"
            alt="Ajo"
            fill
            className="object-contain"
            priority
            sizes="90px"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium tracking-[0.02em] text-[#0a0a0a] hover:text-[#0f9d58] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] font-medium text-[#0a0a0a] hover:text-[#0f9d58] transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-full bg-[#0f9d58] text-white text-[13px] font-semibold hover:bg-[#0e8f50] transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium text-[#0a0a0a] hover:text-[#0f9d58] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-full bg-[#0f9d58] text-white text-[13px] font-semibold hover:bg-[#0e8f50] transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#f0f0f0]/50 bg-gradient-to-b from-[#0f9d58]/[0.1] via-transparent to-transparent backdrop-blur-md px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[17px] font-medium text-center text-[#0a0a0a] hover:text-[#0f9d58] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-4 pt-6 border-t border-[#f0f0f0]">
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-[17px] font-medium text-center text-[#0a0a0a] hover:text-[#0f9d58] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="px-5 py-3 rounded-full bg-[#0f9d58] text-white text-[17px] font-semibold hover:bg-[#0e8f50] transition-colors text-center cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[17px] font-medium text-center text-[#0a0a0a] hover:text-[#0f9d58] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-3 rounded-full bg-[#0f9d58] text-white text-[17px] font-semibold hover:bg-[#0e8f50] transition-colors text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
