import Image from "next/image";
import Link from "next/link";
import { AjoCircle } from "./AjoCircle";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] w-full py-24 md:py-32 px-4 sm:px-6 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f9d58]/[0.1] via-transparent to-transparent pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <AjoCircle className="w-[600px] h-[600px] md:w-[700px] md:h-[700px] opacity-50" />
      </div>

      <div className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full bg-[#0f9d58]/[0.1] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-[10%] w-48 h-48 rounded-full bg-[#0f9d58]/[0.1] blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-10 max-w-5xl mx-auto text-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f9d58]/10 ring-1 ring-[#0f9d58]/20">
          <Image
            src="/wallet-icon.svg"
            alt=""
            width={16}
            height={16}
            className="shrink-0"
          />
          <span className="text-[#0f9d58] text-[13px] font-semibold uppercase tracking-[0.05em]">
            Built for Digital Ajo & Esusu
          </span>
        </div>

        <div className="flex flex-col items-center gap-6">
          <h1 className="flex flex-col gap-4 text-[56px] sm:text-[64px] md:text-[80px] font-semibold text-[#0a0a0a] leading-[1.0] tracking-[-0.04em]">
            Save Together,
            <br />
            <span className="text-[#0f9d58]">Grow Together.</span>
          </h1>
          <p className="text-[17px] md:text-lg text-[#737373] font-normal max-w-xl leading-[1.6]">
            Ajo helps families, friends, and communities manage rotating savings
            with a dedicated virtual account for every group, automatic tracking
            for every payment, and transparent payouts for every member.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/register"
            className="group flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#0f9d58] text-white font-semibold text-[15px] hover:bg-[#0e8f50] hover:shadow-xl hover:shadow-[#0f9d58]/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Image
              src="/saving-pot-icon.svg"
              alt=""
              width={18}
              height={18}
              className="shrink-0 brightness-0 invert group-hover:scale-110 transition-transform duration-200"
            />
            Start Saving
          </Link>
          <Link
            href="/register"
            className="group flex items-center gap-2.5 px-7 py-4 rounded-full border border-[#0f9d58]/30 text-[#0f9d58] font-semibold text-[15px] hover:border-[#0f9d58] hover:bg-[#0f9d58]/5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Image
              src="/play-icon.svg"
              alt=""
              width={18}
              height={18}
              className="shrink-0 brightness-0 group-hover:scale-110 transition-transform duration-200"
            />
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
