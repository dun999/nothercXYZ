"use client";

import { usePathname } from "next/navigation";

// Hrefs are root-relative for docs.notherc.xyz
// Middleware rewrites: docs.notherc.xyz/vaults → /docs/vaults
const nav = [
  {
    section: "Overview",
    links: [
      { href: "/", label: "Introduction" },
      { href: "/getting-started", label: "Getting Started" },
    ],
  },
  {
    section: "Vaults",
    links: [
      { href: "/vaults", label: "All Vaults" },
      { href: "/vaults/usdc", label: "yoUSD · USDC" },
      { href: "/vaults/eth", label: "yoETH · WETH" },
      { href: "/vaults/btc", label: "yoBTC · cbBTC" },
      { href: "/vaults/eur", label: "yoEUR · EURC" },
    ],
  },
  {
    section: "SDK Reference",
    links: [
      { href: "/sdk", label: "YO Protocol Hooks" },
      { href: "/sdk/deposit", label: "Deposit Flow" },
      { href: "/sdk/withdraw", label: "Withdraw Flow" },
    ],
  },
  {
    section: "Protocol",
    links: [
      { href: "/protocol/erc4626", label: "ERC-4626 Standard" },
      { href: "/protocol/security", label: "Security & Audit" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-7">
      {nav.map(({ section, links }) => (
        <div key={section}>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2 px-2"
            style={{ color: "var(--color-n-muted)" }}
          >
            {section}
          </p>
          <ul className="space-y-px">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors"
                    style={{
                      color: active ? "var(--color-n-text)" : "var(--color-n-muted)",
                      background: active ? "var(--color-n-card)" : "transparent",
                      fontWeight: active ? 600 : 400,
                      borderLeft: active ? "2px solid var(--color-n-accent)" : "2px solid transparent",
                    }}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Footer links */}
      <div className="pt-4" style={{ borderTop: "1px solid var(--color-n-border)" }}>
        <a
          href="https://www.yo.xyz/files/Yo-Protocol-Hunter-Security-Audit-Report.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px]"
          style={{ color: "var(--color-n-muted)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Audit Report ↗
        </a>
        <a
          href="https://basescan.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px]"
          style={{ color: "var(--color-n-muted)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          Base Explorer ↗
        </a>
      </div>
    </nav>
  );
}
