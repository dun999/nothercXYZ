import type { Metadata } from "next";

export const metadata: Metadata = { title: "Introduction" };

const quicklinks = [
  {
    href: "/getting-started",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Getting Started",
    desc: "Connect wallet, pick a vault, make your first deposit.",
    badge: null,
  },
  {
    href: "/vaults",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    title: "Vaults",
    desc: "ERC-4626 vaults for USDC, ETH, BTC, and EUR on Base.",
    badge: "4 vaults",
  },
  {
    href: "/sdk",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: "SDK Reference",
    desc: "React hooks from @yo-protocol/react for deposits & withdrawals.",
    badge: null,
  },
  {
    href: "/protocol/security",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Security",
    desc: "Audit report, contract addresses, and security model.",
    badge: "Audited",
  },
];

const highlights = [
  { label: "Network", value: "Base (Chain ID 8453)" },
  { label: "Vault Standard", value: "ERC-4626" },
  { label: "Auth", value: "Privy (email / social / EOA)" },
  { label: "Custody", value: "Non-custodial" },
  { label: "Lock-up", value: "None" },
  { label: "Auditor", value: "Hunter Security" },
];

export default function DocsIntroPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <p className="text-xs font-mono mb-5" style={{ color: "var(--color-n-muted)" }}>
        docs
      </p>

      <h1
        className="text-[2rem] font-black tracking-tight mb-3 leading-tight"
        style={{ color: "var(--color-n-text)" }}
      >
        Notherc Documentation
      </h1>
      <p className="text-base leading-relaxed mb-10" style={{ color: "var(--color-n-muted)", maxWidth: 560 }}>
        Notherc is a non-custodial savings app on the{" "}
        <a href="https://base.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-n-text)", textDecoration: "underline", textUnderlineOffset: 3 }}>Base</a>{" "}
        network. Deposits go into ERC-4626 yield vaults powered by{" "}
        <a href="https://yo.xyz" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-n-text)", textDecoration: "underline", textUnderlineOffset: 3 }}>YO Protocol</a>
        . No lock-ups, no custody — earn yield and withdraw any time.
      </p>

      {/* Quick stats */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-px mb-10 rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--color-n-border)", background: "var(--color-n-border)" }}
      >
        {highlights.map(({ label, value }) => (
          <div
            key={label}
            className="px-4 py-3"
            style={{ background: "var(--color-n-surface)" }}
          >
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "var(--color-n-muted)" }}>
              {label}
            </p>
            <p className="text-sm font-semibold font-mono" style={{ color: "var(--color-n-text)" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
        {quicklinks.map(({ href, icon, title, desc, badge }) => (
          <a
            key={href}
            href={href}
            className="group flex items-start gap-4 p-5 rounded-xl transition-colors"
            style={{
              background: "var(--color-n-surface)",
              border: "1px solid var(--color-n-border)",
            }}
          >
            <div
              className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--color-n-card)", color: "var(--color-n-text)" }}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm" style={{ color: "var(--color-n-text)" }}>
                  {title}
                </span>
                {badge && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                    style={{ background: "var(--color-n-card)", color: "var(--color-n-muted)" }}
                  >
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-n-muted)" }}>
                {desc}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Architecture note */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <h2 className="font-semibold text-sm mb-3" style={{ color: "var(--color-n-text)" }}>
          Provider stack
        </h2>
        <div className="font-mono text-xs space-y-1" style={{ color: "var(--color-n-muted)" }}>
          {[
            "PrivyProvider          ← wallet auth (email, social, EOA)",
            "  QueryClientProvider  ← TanStack Query cache",
            "    WagmiProvider       ← @privy-io/wagmi adapter",
            "      YieldProvider     ← @yo-protocol/react context",
            "        <App />",
          ].map((line, i) => (
            <div key={i} style={{ paddingLeft: `${line.match(/^\s*/)?.[0].length ?? 0}ch` }}>
              {line.trimStart()}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs" style={{ color: "var(--color-n-muted)" }}>
        Ready to build?{" "}
        <a href="/getting-started" style={{ color: "var(--color-n-text)", textDecoration: "underline", textUnderlineOffset: 3 }}>
          Start here →
        </a>
      </p>
    </div>
  );
}
