import Image from "next/image";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-12 w-full max-w-5xl mx-auto py-8 md:py-12">
      <div className="flex flex-col items-center gap-9">
        {/* Badge */}
        <div className="flex items-center gap-2.5 px-5 py-3.5 rounded-[40px] bg-[rgba(15,157,88,0.1)]">
          <Image
            src="/wallet-icon.svg"
            alt=""
            width={24}
            height={24}
            className="shrink-0"
          />
          <span className="text-[#0f9d58] font-medium text-base whitespace-nowrap">
            Built for Digital Ajo and Esusu Savings
          </span>
        </div>

        {/* Text block */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-[40px] md:text-5xl lg:text-[64px] font-bold text-black leading-[1.1] tracking-tight">
            Save Together,
            <br />
            <span className="text-[#0f9d58]">Grow Together,</span>
            <br />
            Without the Fear of Fraud.
          </h1>
          <p className="text-lg md:text-2xl text-[#808080] font-semibold max-w-3xl leading-relaxed">
            Ajo helps families, friends, coworkers, and communities manage
            rotating savings digitally. Every group gets a dedicated virtual
            account, every payment is tracked automatically, and every payout
            happens transparently.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <button className="flex items-center gap-3 px-9 py-5 rounded-[60px] border border-solid border-[#0f9d58] text-[#0f9d58] font-semibold text-xl md:text-2xl hover:bg-[#0f9d58]/5 transition-colors cursor-pointer">
          <Image
            src="/saving-pot-icon.svg"
            alt=""
            width={24}
            height={24}
            className="shrink-0"
          />
          Start Saving
        </button>
        <button className="flex items-center gap-3 px-9 py-5 rounded-[60px] bg-[#0f9d58] text-white font-semibold text-xl md:text-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),0px_16px_48px_0px_rgba(34,197,94,0.25)] hover:bg-[#0e8f50] transition-colors cursor-pointer">
          <Image
            src="/play-icon.svg"
            alt=""
            width={24}
            height={24}
            className="shrink-0"
          />
          See How It Works
        </button>
      </div>
    </section>
  );
}
