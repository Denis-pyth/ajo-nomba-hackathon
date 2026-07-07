export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[#0a0a0a]">Payments</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-[#e5e5e5]">
        <p className="text-sm text-[#737373]">Payment history will appear here.</p>
        <p className="text-xs text-[#a3a3a3] mt-1">All your deposits and payouts are tracked automatically.</p>
      </div>
    </div>
  );
}
