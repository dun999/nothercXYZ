"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useVaults } from "@yo-protocol/react";
import { VaultCard } from "@/components/VaultCard";
import { FAQ } from "@/components/FAQ";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VAULTS, TWITTER_URL } from "@/lib/constants";
import { formatPercent, shortenAddress } from "@/lib/format";

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
  const { user, logout } = usePrivy();
  const { address } = useAccount();

  const displayName = user?.email?.address
    ? user.email.address.split("@")[0]
    : address
      ? shortenAddress(address)
      : "there";

  return (
    <div className="px-4 pt-safe mb-nav">
      {/* Top bar */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--color-n-accent) 0%, var(--color-n-accent-dim) 100%)",
            }}
          >
            <span className="text-xs font-black" style={{ color: "#000", fontStyle: "italic" }}>N</span>
          </div>
          <div>
            <span className="text-xs" style={{ color: "var(--color-n-muted)" }}>
              Hey, {displayName}
            </span>
            <div className="text-sm font-bold" style={{ color: "var(--color-n-text)" }}>
              Notherc
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-full border transition-all"
            style={{
              borderColor: "var(--color-n-border)",
              color: "var(--color-n-muted)",
              background: "transparent",
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Hero */}
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
          {["Non-custodial", "APY variable", "ERC-4626 on Base"].map((tag) => (
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

      {/* How it works */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "var(--color-n-surface)",
          border: "1px solid var(--color-n-border)",
        }}
      >
        <div className="flex justify-between gap-3">
          {[
            { step: "1", label: "Deposit", sub: "USDC, ETH or BTC" },
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

      {/* Vault cards */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold" style={{ color: "var(--color-n-text)" }}>
            Choose a vault
          </h2>
          <span className="text-xs" style={{ color: "var(--color-n-muted)" }}>
            Live on Base
          </span>
        </div>
        {VAULTS.map((vault) => (
          <VaultCard key={vault.id} vault={vault} />
        ))}
      </div>

      {/* FAQ */}
      <div className="mb-6">
        <FAQ />
      </div>

      {/* Trust footer */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "var(--color-n-surface)",
          border: "1px solid var(--color-n-border)",
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-n-text)" }}>
          Non-custodial and transparent
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-n-muted)" }}>
          Your funds are held by ERC-4626 smart contracts on Base, not by Notherc.
          YO Protocol rebalances continuously across DeFi protocols for the best
          risk-adjusted yield.{" "}
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-n-accent)", textDecoration: "underline" }}
          >
            Verify on BaseScan
          </a>
        </p>
      </div>

      {/* Footer links */}
      <div className="flex items-center justify-between pb-2">
        <p className="text-xs" style={{ color: "var(--color-n-muted)" }}>
          Notherc, built on Base
        </p>
        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--color-n-muted)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.622 5.905-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @nothercxyz
        </a>
      </div>
    </div>
  );
}
