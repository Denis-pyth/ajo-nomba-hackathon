import { AjoCircle } from "./AjoCircle";

const problems = [
  {
    title: "Coordinator Fraud",
    description:
      "One person controls everyone's money. If they disappear, the savings disappear too.",
  },
  {
    title: "Manual Tracking",
    description:
      "WhatsApp chats and notebooks lead to mistakes and disputes.",
  },
  {
    title: "No Records",
    description:
      "Years of disciplined savings never become part of your financial history.",
  },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative w-full bg-[#0a0a0a] py-24 md:py-32 px-4 sm:px-6 lg:px-16 overflow-hidden"
    >
      {/* Large ambient watermark circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07]">
        <AjoCircle className="w-[600px] h-[600px] md:w-[900px] md:h-[900px]" />
      </div>

      <div className="relative max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#0f9d58]">
            The Problem
          </span>
          <h2 className="text-[40px] md:text-[56px] font-semibold text-white leading-[1.05] tracking-[-0.03em]">
            Traditional Savings Shouldn&apos;t
            <br className="hidden md:block" /> Depend on Trust Alone.
          </h2>
          <p className="text-[17px] text-[#a3a3a3] font-normal max-w-xl leading-[1.6]">
            Millions of Nigerians rely on Ajo and Esusu every month, but managing
            contributions manually creates confusion, delays, and fraud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="flex flex-col gap-4 p-8 rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <h3 className="text-xl font-semibold text-[#0f9d58] tracking-[-0.01em]">
                {problem.title}
              </h3>
              <p className="text-[15px] text-[#a3a3a3] leading-[1.6]">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
