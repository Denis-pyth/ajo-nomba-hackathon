import Image from "next/image";

const testimonials = [
  {
    quote:
      "Ajo completely changes how our savings group operates. Everyone can see who has contributed, and there's no more chasing people for payment updates. It's transparent, simple, and gives everyone peace of mind.",
    name: "Damiloju Abe",
    avatar: "/images/avatar4.png",
    featured: true,
  },
  {
    quote:
      "What impressed me most is the dedicated virtual account for each group. It removes the confusion we've always had with manual tracking.",
    name: "Jonathan Okeke",
    avatar: "/images/avatar1.png",
    featured: true,
  },
  {
    quote: "I love how everything is automated!",
    name: "Mirabel Philips",
    avatar: "/images/avatar2.png",
    featured: false,
  },
  {
    quote: "The experience feels modern and reliable.",
    name: "Mercy Ishola",
    avatar: "/images/avatar3.png",
    featured: false,
    highlighted: true,
  },
];

function NigeriaFlag() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="white" />
      <rect x="4" y="10" width="28" height="5.33" fill="#008751" />
      <rect x="4" y="15.33" width="28" height="5.33" fill="white" />
      <rect x="4" y="20.67" width="28" height="5.33" fill="#008751" />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section className="w-full py-24 md:py-32 px-4 sm:px-6 lg:px-16">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#0f9d58]">
            Testimonials
          </span>
          <h2 className="text-[40px] md:text-[56px] font-semibold text-[#0a0a0a] leading-[1.05] tracking-[-0.03em]">
            Trusted By People Who
            <br className="hidden md:block" /> Save Together.
          </h2>
          <p className="text-[17px] text-[#737373] font-normal max-w-xl leading-[1.6]">
            From families and friends to coworkers and community groups, Ajo helps Nigerians manage rotating savings with more transparency and less stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Left — large featured card */}
          <div className="flex flex-col justify-between p-8 md:p-10 rounded-2xl border border-[#f0f0f0] bg-white row-span-2">
            <div className="flex flex-col gap-6">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <path d="M10 24c-2.21 0-4-1.79-4-4V12h8v-4c0-4.42-3.58-8-8-8H4v4h2c2.21 0 4 1.79 4 4v4H6v8h4zm14 0c-2.21 0-4-1.79-4-4V12h8v-4c0-4.42-3.58-8-8-8h-2v4h2c2.21 0 4 1.79 4 4v4h-4v8h4z" fill="#0f9d58" />
              </svg>
              <p className="text-lg md:text-xl text-[#0a0a0a] leading-[1.6]">
                {testimonials[0].quote}
              </p>
            </div>
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={testimonials[0].avatar}
                    alt={testimonials[0].name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <p className="text-base font-semibold text-[#0a0a0a]">
                  {testimonials[0].name}
                </p>
              </div>
              <NigeriaFlag />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Top right */}
            <div className="flex flex-col justify-between p-8 md:p-10 rounded-2xl border border-[#f0f0f0] bg-white">
              <div className="flex flex-col gap-5">
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                  <path d="M10 24c-2.21 0-4-1.79-4-4V12h8v-4c0-4.42-3.58-8-8-8H4v4h2c2.21 0 4 1.79 4 4v4H6v8h4zm14 0c-2.21 0-4-1.79-4-4V12h8v-4c0-4.42-3.58-8-8-8h-2v4h2c2.21 0 4 1.79 4 4v4h-4v8h4z" fill="#0f9d58" />
                </svg>
                <p className="text-lg text-[#0a0a0a] leading-[1.6]">
                  {testimonials[1].quote}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={testimonials[1].avatar}
                      alt={testimonials[1].name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <p className="text-base font-semibold text-[#0a0a0a]">
                    {testimonials[1].name}
                  </p>
                </div>
                <NigeriaFlag />
              </div>
            </div>

            {/* Bottom two small */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col justify-between p-6 rounded-2xl border border-[#f0f0f0] bg-white">
                <div className="flex flex-col gap-4">
                  <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                    <path d="M10 24c-2.21 0-4-1.79-4-4V12h8v-4c0-4.42-3.58-8-8-8H4v4h2c2.21 0 4 1.79 4 4v4H6v8h4zm14 0c-2.21 0-4-1.79-4-4V12h8v-4c0-4.42-3.58-8-8-8h-2v4h2c2.21 0 4 1.79 4 4v4h-4v8h4z" fill="#0f9d58" />
                  </svg>
                  <p className="text-base text-[#0a0a0a] leading-[1.5]">
                    {testimonials[2].quote}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={testimonials[2].avatar}
                      alt={testimonials[2].name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                  <p className="text-sm font-semibold text-[#0a0a0a]">
                    {testimonials[2].name}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#0f9d58]">
                <div className="flex flex-col gap-4">
                  <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                    <path d="M10 24c-2.21 0-4-1.79-4-4V12h8v-4c0-4.42-3.58-8-8-8H4v4h2c2.21 0 4 1.79 4 4v4H6v8h4zm14 0c-2.21 0-4-1.79-4-4V12h8v-4c0-4.42-3.58-8-8-8h-2v4h2c2.21 0 4 1.79 4 4v4h-4v8h4z" fill="white" />
                  </svg>
                  <p className="text-base text-white leading-[1.5]">
                    {testimonials[3].quote}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={testimonials[3].avatar}
                      alt={testimonials[3].name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {testimonials[3].name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
