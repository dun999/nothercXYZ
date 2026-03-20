import type { Metadata } from "next";

export const metadata: Metadata = { title: "Security & Audit" };

const contracts = [
  {
    label: "yoUSD vault",
    note: "Accepts USDC (6 dec)",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    explorer: "https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  {
    label: "yoETH vault",
    note: "Accepts WETH (18 dec)",
    address: "0x4200000000000000000000000000000000000006",
    explorer: "https://basescan.org/address/0x4200000000000000000000000000000000000006",
  },
  {
    label: "yoBTC vault",
    note: "Accepts cbBTC (8 dec)",
    address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    explorer: "https://basescan.org/address/0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
  },
  {
    label: "yoEUR vault",
    note: "Accepts EURC (6 dec)",
    address: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
    explorer: "https://basescan.org/address/0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
  },
];

const securityProps = [
  {
    title: "Non-custodial",
    desc: "User funds are held entirely in on-chain vault contracts. Notherc has no admin key or upgrade path over your deposited assets.",
  },
  {
    title: "ERC-4626 standard",
    desc: "All vaults implement the tokenized vault standard. The interface is audited, widely reviewed, and battle-tested across DeFi.",
  },
  {
    title: "No lock-up",
    desc: "Withdrawals are permissionless. There is no time-lock or withdrawal fee applied by Notherc. Some vaults may queue large withdrawals.",
  },
  {
    title: "Open-source protocol",
    desc: "YO Protocol's contracts are publicly verifiable on Basescan. The audit report is linked below.",
  },
];

export default function SecurityPage() {
  return (
    <div>
      <p className="text-xs font-mono mb-5" style={{ color: "var(--color-n-muted)" }}>
        docs / protocol / security
      </p>

      <h1
        className="text-[2rem] font-black tracking-tight mb-3 leading-tight"
        style={{ color: "var(--color-n-text)" }}
      >
        Security & Audit
      </h1>
      <p className="text-base leading-relaxed mb-10" style={{ color: "var(--color-n-muted)", maxWidth: 560 }}>
        YO Protocol's smart contracts were audited by Hunter Security. All vault
        contracts are publicly verifiable on Basescan.
      </p>

      {/* Audit callout */}
      <a
        href="https://www.yo.xyz/files/Yo-Protocol-Hunter-Security-Audit-Report.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-4 p-5 rounded-xl mb-10"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--color-n-text)" }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm mb-0.5" style={{ color: "var(--color-n-text)" }}>
              Hunter Security Audit Report
            </p>
            <p className="text-[13px]" style={{ color: "var(--color-n-muted)" }}>
              YO Protocol smart contract security audit — full PDF
            </p>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-n-muted)", flexShrink: 0 }}>
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"/>
        </svg>
      </a>

      {/* Security properties */}
      <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--color-n-text)" }}>
        Security properties
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {securityProps.map(({ title, desc }) => (
          <div
            key={title}
            className="p-4 rounded-xl"
            style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-n-text)" }} />
              <span className="font-semibold text-[13px]" style={{ color: "var(--color-n-text)" }}>{title}</span>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-n-muted)" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Contract addresses */}
      <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--color-n-text)" }}>
        Contract addresses <span className="font-mono text-[11px] ml-1" style={{ color: "var(--color-n-muted)" }}>Base · Chain ID 8453</span>
      </h2>
      <div
        className="rounded-xl overflow-hidden mb-6"
        style={{ border: "1px solid var(--color-n-border)" }}
      >
        {contracts.map(({ label, note, address, explorer }, i) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 px-5 py-4"
            style={{
              background: i % 2 === 0 ? "var(--color-n-surface)" : "var(--color-n-card)",
              borderBottom: i < contracts.length - 1 ? "1px solid var(--color-n-border)" : undefined,
            }}
          >
            <div className="shrink-0">
              <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--color-n-text)" }}>{label}</p>
              <p className="text-[11px] font-mono" style={{ color: "var(--color-n-muted)" }}>{note}</p>
            </div>
            <a
              href={explorer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-right truncate max-w-[200px]"
              style={{ color: "var(--color-n-muted)", textDecoration: "underline", textUnderlineOffset: 3 }}
              title={address}
            >
              {address.slice(0, 10)}…{address.slice(-8)} ↗
            </a>
          </div>
        ))}
      </div>

      <div
        className="p-4 rounded-xl flex gap-3 text-[13px]"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <span style={{ color: "var(--color-n-muted)" }}>ℹ</span>
        <p style={{ color: "var(--color-n-muted)" }}>
          Notherc is a front-end interface. Smart contract risk is inherited from YO Protocol.
          Always verify contract addresses on Basescan before interacting on-chain.
        </p>
      </div>
    </div>
  );
}
