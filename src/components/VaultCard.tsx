"use client";

import { useState } from "react";
import { useVaultState, useVaults, useUserPosition } from "@yo-protocol/react";
import { useAccount } from "wagmi";
import { formatAmount, formatTVL, formatPercent, estimateYearlyEarnings } from "@/lib/format";
import { DepositSheet } from "./DepositSheet";
import { RedeemSheet } from "./RedeemSheet";
import { VaultIcon } from "./VaultIcon";
import type { VaultConfig } from "@/lib/constants";

export function VaultCard({ vault }: { vault: VaultConfig }) {
  const { address } = useAccount();
  const { vaultState, isLoading: stateLoading } = useVaultState(vault.id);
  const { vaults: vaultsList, isLoading: vaultsLoading } = useVaults();
  const { position } = useUserPosition(vault.id, address!, { enabled: !!address });

  const [depositOpen, setDepositOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);

  const isLoading = stateLoading || vaultsLoading;

  const tvl = vaultState ? Number(vaultState.totalAssets) / 10 ** vault.decimals : 0;
  const vaultStats = vaultsList?.find(
    (v: { id: string }) => v.id.toLowerCase() === vault.id.toLowerCase()
  );
  const apy = vaultStats?.yield?.["7d"] ? parseFloat(vaultStats.yield["7d"]) : 0;

  const userShares = position?.shares ?? 0n;
  const userAssets = position?.assets ?? 0n;
  const hasPosition = userShares > 0n;

  const earningsOn1k = estimateYearlyEarnings(1000, apy);

  return (
    <>
      <div
        className="rounded-2xl p-5 mb-3"
        style={{
          background: "var(--color-n-surface)",
          border: "1px solid var(--color-n-border)",
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <VaultIcon id={vault.id} size={44} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base" style={{ color: "var(--color-n-text)" }}>
                  {vault.name}
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--color-n-card)",
                    color: vault.riskColor,
                    border: "1px solid var(--color-n-border)",
                  }}
                >
                  {vault.riskLevel} risk
                </span>
              </div>
              <span className="text-xs" style={{ color: "var(--color-n-muted)" }}>
                {vault.description}
              </span>
            </div>
          </div>

          {/* APY badge */}
          <div className="text-right">
            {isLoading ? (
              <div className="h-8 w-16 rounded-lg animate-pulse"
                style={{ background: "var(--color-n-card)" }} />
            ) : (
              <span
                className="text-2xl font-black"
                style={{ color: apy > 0 ? "var(--color-n-accent)" : "var(--color-n-muted)" }}
              >
                {formatPercent(apy, 2)}
              </span>
            )}
            <div className="text-[10px] font-medium" style={{ color: "var(--color-n-muted)" }}>
              APY
            </div>
          </div>
        </div>

        {/* Earnings preview */}
        {apy > 0 && !isLoading && (
          <div
            className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between"
            style={{ background: "var(--color-n-card)" }}
          >
            <span className="text-sm" style={{ color: "var(--color-n-muted)" }}>
              $1,000 deposited earns
            </span>
            <span className="text-sm font-bold" style={{ color: "var(--color-n-accent)" }}>
              {earningsOn1k}/year
            </span>
          </div>
        )}

        {/* Stats row */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 rounded-xl px-3 py-2.5"
            style={{ background: "var(--color-n-card)" }}>
            <div className="text-[10px] uppercase tracking-wider mb-0.5"
              style={{ color: "var(--color-n-muted)" }}>TVL</div>
            {isLoading ? (
              <div className="h-5 w-16 rounded animate-pulse"
                style={{ background: "var(--color-n-border)" }} />
            ) : (
              <div className="text-sm font-bold" style={{ color: "var(--color-n-text)" }}>
                {vault.id === "yoUSD"
                  ? formatTVL(tvl)
                  : `${tvl.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${vault.asset}`}
              </div>
            )}
          </div>

          {hasPosition && (
            <div
              className="flex-1 rounded-xl px-3 py-2.5"
              style={{
                background: "var(--color-n-card)",
                border: `1px solid ${vault.accent}30`,
              }}
            >
              <div className="text-[10px] uppercase tracking-wider mb-0.5"
                style={{ color: "var(--color-n-muted)" }}>Your deposit</div>
              <div className="text-sm font-bold" style={{ color: vault.accent }}>
                {formatAmount(userAssets, vault.decimals, 2)} {vault.asset}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setDepositOpen(true)}
            className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
            style={{
              background: "var(--color-n-accent)",
              color: "#000",
            }}
          >
            Deposit
          </button>
          {hasPosition && (
            <button
              onClick={() => setRedeemOpen(true)}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] border"
              style={{
                borderColor: "var(--color-n-border)",
                color: "var(--color-n-text)",
                background: "transparent",
              }}
            >
              Withdraw
            </button>
          )}
        </div>
      </div>

      <DepositSheet
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        vaultId={vault.id}
        apy={apy}
      />
      <RedeemSheet
        open={redeemOpen}
        onClose={() => setRedeemOpen(false)}
        vaultId={vault.id}
      />
    </>
  );
}
