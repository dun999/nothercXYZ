"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useUserPosition, useVaultState, useVaults } from "@yo-protocol/react";
import { VAULTS, VAULT_ADDRESSES } from "@/lib/constants";
import { formatAmount, formatPercent } from "@/lib/format";
import { RedeemSheet } from "./RedeemSheet";
import { VaultIcon } from "./VaultIcon";
import type { VaultId } from "@/lib/constants";

function PositionCard({ vaultId }: { vaultId: VaultId }) {
  const { address } = useAccount();
  const vault = VAULTS.find((v) => v.id === vaultId)!;
  const [redeemOpen, setRedeemOpen] = useState(false);

  const { position, isLoading: posLoading } = useUserPosition(vaultId, address!, {
    enabled: !!address,
  });
  const { vaultState } = useVaultState(vaultId);
  const { vaults: vaultsList } = useVaults();

  if (posLoading) {
    return (
      <div className="rounded-2xl p-5 animate-pulse mb-3"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}>
        <div className="h-5 w-32 rounded-lg mb-3" style={{ background: "var(--color-n-card)" }} />
        <div className="h-8 w-24 rounded-lg" style={{ background: "var(--color-n-card)" }} />
      </div>
    );
  }

  const shares = position?.shares ?? 0n;
  if (shares === 0n) return null;

  const assets = position?.assets ?? 0n;
  const exchangeRate = vaultState?.exchangeRate
    ? Number(vaultState.exchangeRate) / 1e18
    : 1;

  const assetValue = Number(assets) / 10 ** vault.decimals;

  const vaultStats = vaultsList?.find(
    (v: { id: string }) => v.id.toLowerCase() === vaultId.toLowerCase()
  );
  const apy = vaultStats?.yield?.["7d"] ? parseFloat(vaultStats.yield["7d"]) : 0;
  const monthlyYield = (assetValue * (apy / 100)) / 12;

  return (
    <>
      <div
        className="rounded-2xl p-5 mb-3"
        style={{
          background: "var(--color-n-surface)",
          border: "1px solid var(--color-n-border)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <VaultIcon id={vault.id} size={40} />
            <div>
              <span className="font-bold text-sm" style={{ color: "var(--color-n-text)" }}>
                {vault.name}
              </span>
              <div className="text-xs" style={{ color: "var(--color-n-muted)" }}>
                {vault.asset} on Base
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black" style={{ color: "var(--color-n-text)" }}>
              {formatAmount(assets, vault.decimals, 4)} {vault.asset}
            </div>
            <div className="text-xs" style={{ color: "var(--color-n-accent)" }}>
              {formatPercent(apy)} APY
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCell label="Deposited">
            {formatAmount(assets, vault.decimals, 4)} {vault.asset}
          </StatCell>
          <StatCell label="Shares held">
            {formatAmount(shares, vault.decimals, 4)}
          </StatCell>
          <StatCell label="Share price">
            {exchangeRate.toFixed(6)}
          </StatCell>
          <StatCell label="Est. monthly yield" accent>
            +{monthlyYield > 0 ? `${monthlyYield.toFixed(vault.decimals > 8 ? 4 : 6)} ${vault.asset}` : "—"}
          </StatCell>
        </div>

        {/* Withdraw CTA */}
        <button
          onClick={() => setRedeemOpen(true)}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] border"
          style={{
            borderColor: "var(--color-n-border)",
            color: "var(--color-n-text)",
            background: "transparent",
          }}
        >
          Withdraw
        </button>

        {/* Basescan link */}
        <div className="text-center mt-3">
          <a
            href={`https://basescan.org/address/${VAULT_ADDRESSES[vaultId]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs"
            style={{ color: "var(--color-n-muted)" }}
          >
            View contract on BaseScan
          </a>
        </div>
      </div>

      <RedeemSheet
        open={redeemOpen}
        onClose={() => setRedeemOpen(false)}
        vaultId={vaultId}
      />
    </>
  );
}

function StatCell({
  label,
  children,
  accent,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--color-n-card)" }}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--color-n-muted)" }}>
        {label}
      </div>
      <div
        className="text-sm font-bold"
        style={{ color: accent ? "var(--color-n-accent)" : "var(--color-n-text)" }}
      >
        {children}
      </div>
    </div>
  );
}

export function Portfolio() {
  const { address } = useAccount();

  if (!address) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--color-n-card)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-n-muted)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
        </div>
        <p className="font-semibold mb-1" style={{ color: "var(--color-n-text)" }}>No wallet connected</p>
        <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>Connect a wallet to see your positions.</p>
      </div>
    );
  }

  return (
    <div>
      {VAULTS.map((v) => (
        <PositionCard key={v.id} vaultId={v.id} />
      ))}
    </div>
  );
}
