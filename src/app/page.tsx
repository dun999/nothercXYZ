"use client";

import { useAccount } from "wagmi";
import { useVaults } from "@yo-protocol/react";
import { VaultCard } from "@/components/VaultCard";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { ThemeSlide } from "@/components/ThemeSlide";
import { VAULTS } from "@/lib/constants";
import { formatPercent, shortenAddress } from "@/lib/format";
import { Metadata } from 'next';


export const metadata: Metadata = {
  other: {
    'base:app_id': '69c576f886d9e93182f6ffd3',
  },
};
export default function Home()
function BestApy() {
  const { vaults: vaultsList } = useVaults();
  if (!vaultsList) return null;

  const best = vaultsList.reduce(
    (acc: { apy: number; name: string }, v) => {
      const raw = v.yield?.["7d"];
      const apy = raw ? parseFloat(raw) : 0;
      return apy > acc.apy ? { apy, name: v.id } : acc;
    },
    { apy: 0, name: "" } as { apy: number; name: string }
  );

  if (!best.apy) return null;

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{
        background: "var(--color-n-accent-glow)",
        border: "1px solid var(--color-n-accent)",
        color: "var(--color-n-accent)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-live"
        style={{ background: "var(--color-n-accent)" }} />
      Best rate: {formatPercent(best.apy)} APY
    </div>
  );
}

export default function HomePage() {
  const { address } = useAccount();

  return (
    <div className="px-4 pt-safe pb-safe">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Notherc" width={32} height={32} style={{ borderRadius: 10 }} />
          <div>
            <span className="text-xs font-mono" style={{ color: "var(--color-n-muted)" }}>
              {address ? shortenAddress(address) : "Earn, automatically"}
            </span>
            <div className="text-sm font-bold" style={{ color: "var(--color-n-text)" }}>
              Notherc
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSlide />
          <HamburgerMenu />
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-black leading-tight mb-2" style={{ color: "var(--color-n-text)" }}>
          Your crypto{" "}
          <span style={{ color: "var(--color-n-accent)" }}>savings account</span>
        </h1>
        <p className="text-sm mb-4" style={{ color: "var(--color-n-muted)" }}>
          Deposit once. Earn automatically. Withdraw any time.
        </p>
        <BestApy />
        <div className="flex flex-wrap gap-2 mt-3">
          {["Non-custodial", "Variable APY", "On Base network"].map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2.5 py-1 rounded-full"
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

      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "var(--color-n-surface)",
          border: "1px solid var(--color-n-border)",
        }}
      >
        <div className="flex justify-between gap-3">
          {[
            { step: "1", label: "Deposit", sub: "USDC, ETH, BTC or EUR" },
            { step: "2", label: "Earn", sub: "Auto-rebalanced yield" },
            { step: "3", label: "Withdraw", sub: "Any time, no lock-up" },
          ].map(({ step, label, sub }) => (
            <div key={step} className="flex-1 text-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mx-auto mb-1.5"
                style={{
                  background: "var(--color-n-card)",
                  color: "var(--color-n-accent)",
                  border: "1px solid var(--color-n-border)",
                }}
              >
                {step}
              </div>
              <p className="text-xs font-bold" style={{ color: "var(--color-n-text)" }}>{label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--color-n-muted)" }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold" style={{ color: "var(--color-n-text)" }}>
            Choose a vault
          </h2>
          <a
            href="https://www.yo.xyz/files/Yo-Protocol-Hunter-Security-Audit-Report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-semibold"
            style={{ color: "var(--color-n-muted)" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Audited ↗
          </a>
        </div>
        {VAULTS.map((vault, i) => (
          <VaultCard key={vault.id} vault={vault} index={i} />
        ))}
      </div>

    </div>
  );
}
