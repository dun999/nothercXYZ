export default function DocsHomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-4xl font-black mb-3"
          style={{ color: "var(--color-n-text)" }}
        >
          Notherc Documentation
        </h1>
        <p className="text-lg" style={{ color: "var(--color-n-muted)" }}>
          On-chain savings built on YO Protocol. Deposit USDC, ETH, BTC, or EUR
          — earn automatically, withdraw any time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
        {[
          {
            href: "/docs/getting-started",
            title: "Getting Started",
            desc: "Connect your wallet and make your first deposit in minutes.",
            icon: "⚡",
          },
          {
            href: "/docs/vaults",
            title: "Vaults",
            desc: "Explore the four ERC-4626 yield vaults available on Base.",
            icon: "🏦",
          },
          {
            href: "/docs/sdk",
            title: "YO Protocol SDK",
            desc: "React hooks used to power deposits, withdrawals, and live APY.",
            icon: "🔧",
          },
        ].map(({ href, title, desc, icon }) => (
          <a
            key={href}
            href={href}
            className="block p-5 rounded-2xl transition-colors"
            style={{
              background: "var(--color-n-surface)",
              border: "1px solid var(--color-n-border)",
            }}
          >
            <div className="text-2xl mb-2">{icon}</div>
            <h2 className="font-bold text-base mb-1" style={{ color: "var(--color-n-text)" }}>
              {title}
            </h2>
            <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>{desc}</p>
          </a>
        ))}
      </div>

      <div
        className="mt-8 p-5 rounded-2xl not-prose"
        style={{
          background: "var(--color-n-surface)",
          border: "1px solid var(--color-n-border)",
        }}
      >
        <h2 className="font-bold text-base mb-3" style={{ color: "var(--color-n-text)" }}>
          What is Notherc?
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-n-muted)" }}>
          Notherc is a non-custodial savings app on the Base network. Deposits
          go into ERC-4626 yield vaults powered by{" "}
          <a
            href="https://yo.xyz"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-n-accent)" }}
          >
            YO Protocol
          </a>
          . There are no lock-ups — you can withdraw at any time. The protocol
          has been independently audited by Hunter Security.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            "Non-custodial",
            "ERC-4626 Vaults",
            "Base Network",
            "Hunter Security Audited",
          ].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-full font-medium"
              style={{
                background: "var(--color-n-card)",
                border: "1px solid var(--color-n-border)",
                color: "var(--color-n-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
