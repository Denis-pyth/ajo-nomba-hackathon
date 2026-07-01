import Image from "next/image";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#" },
  { label: "How It Works", href: "#" },
  { label: "FAQs", href: "#" },
  { label: "Log In", href: "#" },
  { label: "Register", href: "#" },
];

export function Nav() {
  return (
    <nav className="flex items-center justify-between w-full py-4">
      <div className="relative h-20 w-[110px] shrink-0">
        <Image
          src="/logo.png"
          alt="Ajo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="hidden md:flex items-center gap-5">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-black font-medium text-base px-1.5 py-1 hover:text-[#0f9d58] transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile menu placeholder — can be expanded later */}
      <button className="md:hidden p-2" aria-label="Open menu">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </nav>
  );
}
