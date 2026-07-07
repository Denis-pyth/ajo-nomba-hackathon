export default function TrustPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[#0a0a0a]">Trust Score</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-[#e5e5e5]">
        <p className="text-sm text-[#737373]">Trust score tracking will appear here.</p>
        <p className="text-xs text-[#a3a3a3] mt-1">Consistent payments improve your trust score over time.</p>
      </div>
    </div>
  );
}
