"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useVaults } from "@yo-protocol/react";
import { formatPercent } from "@/lib/format";
import { TWITTER_URL } from "@/lib/constants";
import { APP_NAME, APP_TAGLINE, TWITTER_HANDLE } from "@/lib/config";

function BestApy() {
  const { vaults } = useVaults();
  if (!vaults) return null;
  const best = vaults.reduce(
    (acc: number, v) => {
      const apy = v.yield?.["7d"] ? parseFloat(v.yield["7d"]) : 0;
      return apy > acc ? apy : acc;
    },
    0
  );
  if (!best) return null;
  return (
    <span style={{ color: "var(--color-n-accent)" }}>
      Up to {formatPercent(best)} APY
    </span>
  );
}

export function LoginGate() {
  const { login } = usePrivy();

  return (
    <div
      className="min-h-screen flex flex-col px-5"
      style={{ background: "var(--color-n-bg)" }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0, left: "50%", transform: "translateX(-50%)",
          width: "100vw", height: "50vh",
          background: "radial-gradient(ellipse 70% 60% at 50% -10%, var(--color-n-accent-glow) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div
            style={{
              position: "absolute", inset: "-10px",
              borderRadius: "32px",
              background: "radial-gradient(circle, var(--color-n-accent-glow) 0%, transparent 70%)",
            }}
          />
          <img src="/logo.svg" alt={APP_NAME} width={72} height={72} className="relative" style={{ borderRadius: 20 }} />
        </div>

        <h1
          className="text-4xl font-black tracking-tight mb-2"
          style={{ color: "var(--color-n-text)", letterSpacing: "-0.03em" }}
        >
          {APP_NAME}
        </h1>
        <p className="text-base mb-2 text-center" style={{ color: "var(--color-n-muted)" }}>
          {APP_TAGLINE}
        </p>
        <p className="text-sm mb-8 text-center font-semibold">
          <BestApy />
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["No lock-up", "Non-custodial", "ERC-4626 on Base"].map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                background: "var(--color-n-card)",
                border: "1px solid var(--color-n-border)",
                color: "var(--color-n-muted)",
              }}
            >
              {f}
            </span>
          ))}
        </div>

        <div
          className="w-full rounded-3xl p-6"
          style={{
            background: "var(--color-n-surface)",
            border: "1px solid var(--color-n-border)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
          }}
        >
          <p className="text-lg font-bold mb-1" style={{ color: "var(--color-n-text)" }}>
            Connect your wallet
          </p>
          <p className="text-sm mb-5" style={{ color: "var(--color-n-muted)" }}>
            Use MetaMask, Coinbase Wallet, or any EVM wallet.
          </p>

          <button
            onClick={() => login()}
            className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, var(--color-n-accent) 0%, var(--color-n-accent-dim) 100%)",
              color: "var(--color-n-on-accent)",
              boxShadow: "0 4px 20px var(--color-n-accent-glow)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
            Connect Wallet
          </button>
        </div>

        <p className="text-xs text-center mt-5 px-2" style={{ color: "var(--color-n-muted)" }}>
          Non-custodial. ERC-4626 on Base.{" "}
          <span style={{ color: "var(--color-n-accent)" }}>Powered by YO Protocol SDK</span>
        </p>

        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 mt-4 text-xs"
          style={{ color: "var(--color-n-muted)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.622 5.905-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          {TWITTER_HANDLE}
        </a>
      </div>
    </div>
  );
}
