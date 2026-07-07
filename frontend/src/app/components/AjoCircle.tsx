"use client";

export function AjoCircle({ className = "" }: { className?: string }) {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const r = 140;
    const x = 150 + r * Math.cos(angle);
    const y = 150 + r * Math.sin(angle);
    return {
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
      key: i,
    };
  });

  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} animate-spin-slow`}
      aria-hidden="true"
    >
      <circle cx="150" cy="150" r="140" stroke="#0f9d58" strokeWidth="1" opacity="0.12" />
      <circle cx="150" cy="150" r="100" stroke="#0f9d58" strokeWidth="1" strokeDasharray="6 6" opacity="0.10" />
      <circle cx="150" cy="150" r="60" stroke="#0f9d58" strokeWidth="1" opacity="0.08" />
      {dots.map((dot, i) => (
        <circle
          key={dot.key}
          cx={dot.x}
          cy={dot.y}
          r={i % 3 === 0 ? 5 : 3}
          fill={i % 3 === 0 ? "#0f9d58" : "#0f9d58"}
          opacity={i % 3 === 0 ? 0.20 : 0.12}
        />
      ))}
      <circle cx="150" cy="150" r="24" fill="#0f9d58" opacity="0.04" />
      <circle cx="150" cy="150" r="12" fill="#0f9d58" opacity="0.08" />
    </svg>
  );
}
