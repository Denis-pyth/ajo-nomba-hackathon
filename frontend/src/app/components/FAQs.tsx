"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Ajo?",
    answer:
      "Ajo is a digital platform that helps Nigerians manage rotating savings groups (Ajo and Esusu) with automated tracking, virtual accounts, and transparent payouts.",
  },
  {
    question: "How do I make a contribution?",
    answer:
      "Each group gets a dedicated virtual account. You simply transfer money from your bank app to the group account using the provided account number.",
  },
  {
    question: "Is my money secure?",
    answer:
      "Yes. All group funds are held in dedicated virtual accounts powered by Nomba. No single person has access to withdraw funds without the group's automated payout cycle.",
  },
  {
    question: "What if someone misses a payment?",
    answer:
      "The group ledger shows all payment statuses in real time. Group members can see who is pending and follow up accordingly. Missed payments do not stop the cycle for others.",
  },
  {
    question: "What is a trust score?",
    answer:
      "Your trust score reflects your payment history and reliability. Consistent contributions improve your score, making you eligible for larger groups and better opportunities.",
  },
  {
    question: "When are payouts made?",
    answer:
      "Payouts are automated once all members in a cycle complete their contributions. The next beneficiary in the rotation receives the funds directly to their bank account.",
  },
];

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-16">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#0f9d58]">
            Frequently Asked Questions
          </span>
          <h2 className="text-[40px] md:text-[56px] font-semibold text-[#0a0a0a] leading-[1.05] tracking-[-0.03em]">
            Questions Before Joining.
          </h2>
          <p className="text-[17px] text-[#737373] font-normal max-w-xl leading-[1.6]">
            Everything you need to know about creating groups, making payments, handling missed contributions, and receiving payouts securely.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-3xl">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="flex flex-col gap-0 p-6 rounded-2xl border border-[#f0f0f0] cursor-pointer hover:border-[#0f9d58]/20 transition-colors"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-base font-semibold text-[#0a0a0a] leading-tight tracking-[-0.01em]">
                  {faq.question}
                </p>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-[#0a0a0a] shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              {openIndex === index && (
                <p className="text-[15px] text-[#737373] leading-[1.6] mt-4 animate-fade-in">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
