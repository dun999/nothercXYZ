import type { Metadata } from "next";

export const metadata: Metadata = { title: "yoUSD — USDC Vault" };

export default function YoUsdPage() {
  return (
    <div>
      <p className="text-xs font-mono mb-5" style={{ color: "var(--color-n-muted)" }}>docs / vaults / yoUSD</p>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black font-mono" style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)", color: "var(--color-n-text)" }}>USD</div>
        <div>
          <h1 className="text-[2rem] font-black tracking-tight leading-tight" style={{ color: "var(--color-n-text)" }}>yoUSD</h1>
          <p className="text-sm font-mono" style={{ color: "var(--color-n-muted)" }}>USDC · ERC-4626 · Base</p>
        </div>
      </div>

      <p className="text-base leading-relaxed mb-8" style={{ color: "var(--color-n-muted)", maxWidth: 560 }}>
        USD-pegged stablecoin vault. Deposit USDC to earn yield denominated in USDC.
        No exposure to crypto price volatility — your balance always tracks USD.
      </p>

      <div className="grid grid-cols-2 gap-px rounded-xl overflow-hidden mb-8" style={{ border: "1px solid var(--color-n-border)", background: "var(--color-n-border)" }}>
        {[
          { label: "Underlying token", value: "USDC" },
          { label: "Token decimals", value: "6" },
          { label: "Network", value: "Base (8453)" },
          { label: "Standard", value: "ERC-4626" },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3" style={{ background: "var(--color-n-surface)" }}>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "var(--color-n-muted)" }}>{label}</p>
            <p className="text-sm font-semibold font-mono" style={{ color: "var(--color-n-text)" }}>{value}</p>
          </div>
        ))}
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-n-muted)" }}>Token address</p>
      <div className="p-4 rounded-xl font-mono text-[12px] break-all mb-8" style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)", color: "var(--color-n-text)" }}>
        0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
      </div>
    </div>
  );
}
