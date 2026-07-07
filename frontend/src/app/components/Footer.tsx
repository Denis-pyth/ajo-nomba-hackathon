import Image from "next/image";

const footerLinks = {
  products: {
    title: "Products",
    links: ["Features", "Dashboard", "Trust Score", "Pricing (Coming Soon)"],
  },
  resources: {
    title: "Resources",
    links: ["Help Center", "FAQs", "Blog", "Documentation"],
  },
  company: {
    title: "Company",
    links: ["About", "Contact", "Privacy Policy", "Terms of Service"],
  },
};

function SocialIcons() {
  return (
    <div className="flex items-center gap-5">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="cursor-pointer hover:opacity-70 transition-opacity">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="cursor-pointer hover:opacity-70 transition-opacity">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="cursor-pointer hover:opacity-70 transition-opacity">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="cursor-pointer hover:opacity-70 transition-opacity">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
      </svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="cursor-pointer hover:opacity-70 transition-opacity">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] pt-20 pb-10 px-4 sm:px-6 lg:px-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
        <div className="flex flex-col gap-6 w-full md:w-[260px]">
          <div className="relative h-10 w-[77px] shrink-0">
            <Image
              src="/logo.png"
              alt="Ajo"
              fill
              className="object-contain brightness-0 invert"
              priority
              sizes="77px"
            />
          </div>
          <p className="text-[15px] text-white/60 leading-[1.6]">
            Ajo is an automated communal savings platform that helps Nigerians manage Ajo and Esusu groups with real-time tracking, transparent ledgers, and automated payouts.
          </p>
          <SocialIcons />
        </div>

        <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16">
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/40">
              {footerLinks.products.title}
            </p>
            {footerLinks.products.links.map((link) => (
              <p
                key={link}
                className="text-[15px] text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                {link}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/40">
              {footerLinks.resources.title}
            </p>
            {footerLinks.resources.links.map((link) => (
              <p
                key={link}
                className="text-[15px] text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                {link}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/40">
              {footerLinks.company.title}
            </p>
            {footerLinks.company.links.map((link) => (
              <p
                key={link}
                className="text-[15px] text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                {link}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-white/10">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
          </svg>
          <p className="text-[13px] text-white/40">
            2026 Ajo. All rights reserved. Built for the DevCareer + Nomba Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}
