import type { Metadata } from "next";

export const metadata: Metadata = { title: "Withdraw Flow" };

export default function WithdrawFlowPage() {
  return (
    <div>
      <p className="text-xs font-mono mb-5" style={{ color: "var(--color-n-muted)" }}>docs / sdk / withdraw</p>
      <h1 className="text-[2rem] font-black tracking-tight mb-3 leading-tight" style={{ color: "var(--color-n-text)" }}>
        Withdraw Flow
      </h1>
      <p className="text-base leading-relaxed mb-10" style={{ color: "var(--color-n-muted)", maxWidth: 560 }}>
        Withdrawals burn vault shares and return the underlying token.
        The <code className="font-mono text-[13px] px-1" style={{ background: "var(--color-n-card)" }}>instant</code> flag
        controls whether the redemption settles on-chain immediately or is queued.
      </p>

      {[
        {
          step: "1",
          title: "Check share balance",
          code: `const { balance: shareBalance } = useShareBalance(vaultId);`,
        },
        {
          step: "2",
          title: "Preview underlying assets",
          code: `const shares = parseUnits(inputValue, shareDecimals);
const { assets } = usePreviewRedeem(vaultId, shares);
// Show 'assets' to user — actual tokens they'll receive`,
        },
        {
          step: "3",
          title: "Execute redemption",
          code: `const { redeem, status } = useRedeem(vaultId);

// Instant: settles on-chain immediately
await redeem({ shares, instant: true });

// Queued: shown as "Request #X · Available within 24h"
await redeem({ shares, instant: false });`,
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

      <div className="p-4 rounded-xl flex gap-3 text-[13px] mt-4" style={{ background: "rgba(255,200,0,0.05)", border: "1px solid rgba(255,200,0,0.2)" }}>
        <span style={{ color: "#FFD600" }}>⚠</span>
        <p style={{ color: "var(--color-n-muted)" }}>
          Queued withdrawals (<code className="font-mono" style={{ color: "var(--color-n-text)" }}>instant: false</code>) are not immediately available.
          The request is tracked on-chain and fulfilled within 24 hours.
        </p>
      </div>
    </div>
  );
}
