"use client";

import { usePathname } from "next/navigation";

const nav = [
  {
    section: "Overview",
    links: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/getting-started", label: "Getting Started" },
    ],
  },
  {
    section: "Vaults",
    links: [
      { href: "/docs/vaults", label: "Vault Overview" },
      { href: "/docs/vaults/usdc", label: "yoUSD (USDC)" },
      { href: "/docs/vaults/eth", label: "yoETH (WETH)" },
      { href: "/docs/vaults/btc", label: "yoBTC (cbBTC)" },
      { href: "/docs/vaults/eur", label: "yoEUR (EURC)" },
    ],
  },
  {
    section: "SDK",
    links: [
      { href: "/docs/sdk", label: "YO Protocol SDK" },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {nav.map(({ section, links }) => (
        <div key={section}>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--color-n-muted)" }}
          >
            {section}
          </p>
          <ul className="space-y-0.5">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    className="block px-2 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: active ? "var(--color-n-accent)" : "var(--color-n-text)",
                      background: active ? "var(--color-n-accent-glow)" : "transparent",
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
    </nav>
  );
}
