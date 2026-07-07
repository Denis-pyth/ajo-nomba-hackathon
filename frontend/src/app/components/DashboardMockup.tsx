import Image from "next/image";

export function DashboardMockup() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-16 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <div className="relative w-full rounded-2xl overflow-hidden aspect-16/10 border border-[#f0f0f0] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
          <Image
            src="/images/dashboard.png"
            alt="Ajo Dashboard Preview"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1024px"
          />
        </div>
      </div>
    </section>
  );
}
