import Image from "next/image";

const steps = [
  {
    image: "/images/create-group.png",
    title: "Create a Group",
    description:
      "Set your contribution amount, payment frequency and invite members to join your group.",
  },
  {
    customContent: true,
    title: "Get a Group Account",
    description:
      "Ajo instantly creates a dedicated virtual account for your group.",
  },
  {
    customContent: true,
    title: "Track Progress",
    description:
      "Watch contributions update in real time. Everyone stays informed and accountable.",
  },
  {
    image: "/images/payout.png",
    title: "Get Payout",
    description:
      "Once all contributions are made, the beneficiary receives the funds automatically.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-16 bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#0f9d58]">
            How It Works
          </span>
          <h2 className="text-[40px] md:text-[56px] font-semibold text-[#0a0a0a] leading-[1.05] tracking-[-0.03em]">
            Simple Steps. Powerful Results.
          </h2>
          <p className="text-[17px] text-[#737373] font-normal max-w-xl leading-[1.6]">
            Ajo makes group savings transparent, automated, and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col gap-5 p-6 rounded-2xl bg-white border border-[#e5e5e5]"
            >
              <span className="text-[13px] font-semibold text-[#0f9d58] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>

              {step.image ? (
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#f5f5f5]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ) : index === 1 ? (
                <div className="flex flex-col gap-3 w-full bg-[#f5f5f5] rounded-xl p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">Bank</p>
                    <p className="text-sm font-semibold text-[#0a0a0a]">Nomba Bank</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">Account Number</p>
                      <p className="text-sm font-semibold text-[#0a0a0a]">2039485756</p>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#0a0a0a] cursor-pointer hover:text-[#0f9d58] transition-colors"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full bg-[#f5f5f5] rounded-xl p-4">
                  {[
                    { name: "Jonathan Okeke", status: "Paid", color: "#0f9d58" },
                    { name: "Mirabel Philips", status: "Paid", color: "#0f9d58" },
                    { name: "Mercy Ishola", status: "Partial", color: "#F59E0B" },
                    { name: "Damiloju Abe", status: "Pending", color: "#3B82F6" },
                  ].map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#0f9d58]/15 flex items-center justify-center text-[10px] font-bold text-[#0f9d58]">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <p className="text-sm font-medium text-[#0a0a0a]">
                          {member.name}
                        </p>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${member.color}15`,
                          color: member.color,
                        }}
                      >
                        {member.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-[#0a0a0a] tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#737373] leading-[1.5]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
