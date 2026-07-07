import Image from "next/image";
import Link from "next/link";

const products = [
  {
    image: "/images/dashboard-card.png",
    imageAlt: "Ajo Classic Dashboard",
    title: "Ajo Classic",
    badge: "Live",
    badgeColor: "bg-white/10 text-white",
    description:
      "Automated rotating savings and target contributions for everyone-from close friends to community groups.",
    cardColor: "bg-[#0f9d58]",
    borderColor: "border-[#0f9d58]",
  },
  {
    image: "/images/b2c-phone.png",
    imageAlt: "Ajo B2C App",
    title: "Ajo B2C",
    badge: "Coming Soon",
    badgeColor: "bg-white/10 text-white",
    description:
      "Individuals and groups can save directly toward purchases from verified Nomba merchants.",
    cardColor: "bg-[#3b82f6]",
    borderColor: "border-[#3b82f6]",
  },
  {
    image: "/images/pos-terminal.png",
    imageAlt: "Ajo Offline POS Terminal",
    title: "Ajo Offline",
    badge: "Coming Soon",
    badgeColor: "bg-white/10 text-white",
    description:
      "No smartphone? No problem. Contribution with cash instantly through the trusted Nomba POS agent network.",
    cardColor: "bg-[#f4b400]",
    borderColor: "border-[#f4b400]",
  },
];

function ArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function WaysToSave() {
  return (
    <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 text-center max-w-3xl">
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#0f9d58]/10 shadow-[0_7px_30px_rgba(34,197,94,0.3)]">
            <span className="text-[#0f9d58] text-[13px] font-semibold uppercase tracking-[0.05em]">
              Designed for Everyone
            </span>
          </div>
          <h2 className="text-[40px] md:text-[48px] font-semibold text-[#0a0a0a] leading-[1.05] tracking-[-0.03em]">
            One Platform, Three Powerful Ways to Save.
          </h2>
          <p className="text-[17px] md:text-lg text-[#808080] font-normal max-w-xl leading-[1.6]">
            Ajo gives you the flexibility to save your way. Choose the mode that works for you today.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {products.map((product) => (
            <div
              key={product.title}
              className="flex flex-col items-center justify-between rounded-3xl bg-white shadow-[2px_20px_48px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              {/* Image area */}
              <div className="relative w-full flex items-center justify-center pt-9 px-4">
                <div className="relative w-full h-[228px] md:h-[260px]">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>

              {/* Card body */}
              <div className={`w-full ${product.cardColor} rounded-3xl p-6 md:p-8 flex flex-col gap-6`}>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl md:text-2xl font-medium text-white">
                      {product.title}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-sm bg-white/10 text-white font-normal">
                      {product.badge}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-white/90 leading-[1.5]">
                    {product.description}
                  </p>
                </div>
                <Link
                  href="/register"
                  className="group flex items-center justify-center gap-3 px-5 py-3 md:px-7 md:py-5 rounded-full border border-white text-white font-medium text-[15px] hover:bg-white/10 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <ArrowIcon />
                  Start Saving Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
