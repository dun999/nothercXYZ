import type { Metadata } from "next";

export const metadata: Metadata = { title: "Deposit Flow" };

export default function DepositFlowPage() {
  return (
    <div>
      <p className="text-xs font-mono mb-5" style={{ color: "var(--color-n-muted)" }}>docs / sdk / deposit</p>
      <h1 className="text-[2rem] font-black tracking-tight mb-3 leading-tight" style={{ color: "var(--color-n-text)" }}>
        Deposit Flow
      </h1>
      <p className="text-base leading-relaxed mb-10" style={{ color: "var(--color-n-muted)", maxWidth: 560 }}>
        The deposit flow involves two on-chain transactions: an ERC-20 approval and the
        actual vault deposit. The <code className="font-mono text-[13px] px-1" style={{ background: "var(--color-n-card)" }}>useDeposit</code> hook
        handles both sequentially.
      </p>

      {[
        {
          step: "1",
          title: "Check balance",
          code: `const { balance } = useTokenBalance(tokenAddress);
// balance is a bigint (raw units)
// For USDC: parseUnits("100", 6) = 100_000_000n`,
        },
        {
          step: "2",
          title: "Preview shares",
          code: `const amount = parseUnits(inputValue, decimals);
const { shares } = usePreviewDeposit(vaultId, amount);
// Show 'shares' to user before confirmation`,
        },
        {
          step: "3",
          title: "Execute deposit",
          code: `const { deposit, status } = useDeposit(vaultId);

await deposit({ amount });
// Watch status for UX feedback:
// "idle" → "approving" → "depositing" → "waiting" → "success"`,
        },
        {
          step: "4",
          title: "Invalidate queries",
          code: `// After success, invalidate cached data so UI reflects
// updated share balance and position value
queryClient.invalidateQueries({ queryKey: ["userPosition", vaultId] });
queryClient.invalidateQueries({ queryKey: ["shareBalance", vaultId] });`,
        },
      ].map(({ step, title, code }) => (
        <div key={step} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono font-bold w-5 h-5 rounded flex items-center justify-center" style={{ background: "var(--color-n-card)", color: "var(--color-n-text)" }}>{step}</span>
            <h2 className="font-semibold text-sm" style={{ color: "var(--color-n-text)" }}>{title}</h2>
          </div>
          <pre className="text-[11px] leading-relaxed p-4 rounded-xl overflow-x-auto" style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)", color: "var(--color-n-text)", fontFamily: "'SF Mono', monospace" }}>
            {code}
          </pre>
        </div>
      ))}
    </div>
  );
}
