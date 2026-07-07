import Image from "next/image";

export function GetStarted() {
  return (
    <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-16 bg-[#0f9d58]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
        <div className="flex flex-col gap-8 items-start w-full md:w-1/2">
          <span className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/70">
            Get Started
          </span>
          <h2 className="text-[40px] md:text-[56px] font-semibold text-white leading-[1.05] tracking-[-0.03em]">
            Ready to Transform Your Savings?
          </h2>
          <p className="text-[17px] text-white/80 leading-[1.6] max-w-md">
            Create your first Ajo group today and experience transparent, automated communal savings powered by dedicated virtual accounts.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="flex items-center gap-2 px-7 py-4 rounded-full bg-white text-[#0f9d58] font-semibold text-[15px] hover:bg-white/90 transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Start Saving
            </button>
            <button className="flex items-center gap-2 px-7 py-4 rounded-full border border-white/40 text-white font-semibold text-[15px] hover:bg-white/10 transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Learn More
            </button>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 aspect-square max-w-md rounded-2xl overflow-hidden bg-[#0a0a0a]/10 border border-white/10 flex items-center justify-center">
          <div className="relative w-[85%] h-[85%]">
            <div className="absolute top-[8%] left-[5%] w-[70%] h-[55%] rounded-xl overflow-hidden shadow-2xl z-10 rotate-[-6deg] bg-[#0a0a0a] border border-white/10">
              <Image
                src="/images/notifications.png"
                alt="Notifications"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 60vw, 30vw"
              />
            </div>
            <div className="absolute top-[18%] left-[15%] w-[75%] h-[60%] rounded-xl overflow-hidden shadow-2xl z-20 rotate-[3deg] bg-[#0a0a0a] border border-white/10">
              <Image
                src="/images/dashboard.png"
                alt="Dashboard"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 70vw, 35vw"
              />
            </div>
            <div className="absolute top-[28%] left-[0%] w-[80%] h-[65%] rounded-xl overflow-hidden shadow-2xl z-30 rotate-[-2deg] bg-[#0a0a0a] border border-white/10">
              <Image
                src="/images/group-ledger.png"
                alt="Group Ledger"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
