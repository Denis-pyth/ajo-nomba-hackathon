const features = [
  {
    title: "Dedicated Group Accounts",
    description:
      "Every savings group gets a unique virtual account powered by Nomba. Members pay directly from their bank apps.",
  },
  {
    title: "Automated Reconciliation",
    description:
      "Every payment is automatically verified and updated. No more manual tracking or confusion.",
  },
  {
    title: "Build Your Trust Score",
    description:
      "Consistent and punctual payments improve your trust score and unlock better opportunities.",
  },
  {
    title: "Real-Time Group Ledger",
    description:
      "See exactly who has paid, who is pending, and who has outstanding payments in real time.",
  },
  {
    title: "Automatic Payouts",
    description:
      "Once all members complete their contributions, the system automatically pays the beneficiary.",
  },
  {
    title: "Detailed Statements",
    description:
      "Access your transaction history, group statements, and payout records anytime, any day.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-16">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#0f9d58]">
            Features
          </span>
          <h2 className="text-[40px] md:text-[56px] font-semibold text-[#0a0a0a] leading-[1.05] tracking-[-0.03em]">
            Everything You Need For
            <br className="hidden md:block" /> Smarter, Safer Savings.
          </h2>
          <p className="text-[17px] text-[#737373] font-normal max-w-xl leading-[1.6]">
            Ajo automates your savings process, tracks every contribution, and ensures transparent payouts for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 p-8 rounded-2xl border border-[#f0f0f0] hover:border-[#0f9d58]/30 transition-colors group"
            >
              <span className="text-[13px] font-semibold text-[#0f9d58] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold text-[#0a0a0a] tracking-[-0.01em]">
                {feature.title}
              </h3>
              <p className="text-[15px] text-[#737373] leading-[1.6]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
