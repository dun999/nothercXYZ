"use client";

import { useState } from "react";
import { useVaultState, useVaults, useUserPosition, usePrices } from "@yo-protocol/react";
import { useAccount } from "wagmi";
import { formatAmount, formatUSD, formatPercent } from "@/lib/format";
import { DepositSheet } from "./DepositSheet";
import { RedeemSheet } from "./RedeemSheet";
import { VaultIcon } from "./VaultIcon";
import { RiskDisclosureModal, hasAcceptedRisk } from "./RiskDisclosureModal";
import { useInView } from "@/hooks/useInView";
import type { VaultConfig } from "@/lib/constants";

export function VaultCard({ vault, index = 0 }: { vault: VaultConfig; index?: number }) {
  const { address } = useAccount();
  const [cardRef, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vaultStateResult = useVaultState(vault.id) as any;
  const { vaultState, isLoading: stateLoading, error: stateError, refetch: refetchState } = vaultStateResult;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vaultsResult = useVaults() as any;
  const { vaults: vaultsList, isLoading: vaultsLoading, error: vaultsError, refetch: refetchVaults } = vaultsResult;
  const { position } = useUserPosition(vault.id, address!, { enabled: !!address });

  const [depositOpen, setDepositOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [disclosureOpen, setDisclosureOpen] = useState(false);

  const handleDepositClick = () => {
    if (hasAcceptedRisk()) {
      setDepositOpen(true);
    } else {
      setDisclosureOpen(true);
    }
  };

  const isLoading = stateLoading || vaultsLoading;
  const hasError = !isLoading && (!!stateError || !!vaultsError);

  const { prices } = usePrices();
  const nativeAmount = vaultState ? Number(vaultState.totalAssets) / 10 ** vault.decimals : 0;
  const price = prices?.[vault.coingeckoId] ?? 0;
  const tvlUsd = nativeAmount * price;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vaultStats = vaultsList?.find((v: any) => v.id.toLowerCase() === vault.id.toLowerCase());
  const apy = vaultStats?.yield?.["7d"] ? parseFloat(vaultStats.yield["7d"]) : 0;

  const userShares = position?.shares ?? 0n;
  const userAssets = position?.assets ?? 0n;
  const hasPosition = userShares > 0n;

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`rounded-2xl p-5 mb-3${inView ? " animate-slide-up" : " opacity-0"}`}
        style={{
          background: "var(--color-n-surface)",
          border: `1px solid ${hovered ? "var(--color-n-accent-dim)" : "var(--color-n-border)"}`,
          transform: hovered ? "translateY(-1px)" : "translateY(0)",
          transition: "transform 0.18s ease, border-color 0.18s ease",
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
              <div className="h-8 w-16 rounded-lg animate-shimmer mb-0.5" />
            ) : hasError ? (
              <span className="text-lg font-black" style={{ color: "var(--color-n-muted)" }}>—</span>
            ) : (
              <span
                className="text-2xl font-black animate-num-pop"
                style={{ color: apy > 0 ? "var(--color-n-accent)" : "var(--color-n-muted)" }}
              >
                {formatPercent(apy, 2)}
              </span>
            )}
            <div className="text-[10px] font-medium" style={{ color: "var(--color-n-muted)" }}>APY</div>
          </div>
        </div>

        {/* Error state */}
        {hasError && (
          <div
            className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between animate-fade-in"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}
          >
            <span className="text-xs text-red-400">Failed to load vault data</span>
            <button
              onClick={() => { refetchState?.(); refetchVaults?.(); }}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}
            >
              Retry
            </button>
          </div>
        )}


        {/* Stats row */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 rounded-xl px-3 py-2.5" style={{ background: "var(--color-n-card)" }}>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--color-n-muted)" }}>
              TVL
            </div>
            {isLoading ? (
              <div className="h-5 w-16 rounded animate-shimmer" />
            ) : hasError ? (
              <div className="text-sm font-bold" style={{ color: "var(--color-n-muted)" }}>—</div>
            ) : (
              <div className="text-sm font-bold animate-fade-in" style={{ color: "var(--color-n-text)" }}>
                {tvlUsd > 0 ? formatUSD(tvlUsd) : "—"}
              </div>
            )}
          </div>

          {hasPosition && (
            <div
              className="flex-1 rounded-xl px-3 py-2.5 animate-fade-in"
              style={{ background: "var(--color-n-card)", border: `1px solid ${vault.accent}30` }}
            >
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--color-n-muted)" }}>
                Your deposit
              </div>
              <div className="text-sm font-bold" style={{ color: vault.accent }}>
                {formatAmount(userAssets, vault.decimals, 2)} {vault.asset}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDepositClick}
            className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
            style={{ background: "var(--color-n-accent)", color: "var(--color-n-on-accent)" }}
          >
            Deposit
          </button>
          {hasPosition && (
            <button
              onClick={() => setRedeemOpen(true)}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
              style={{
                background: "var(--color-n-card)",
                color: "var(--color-n-text)",
                border: "1px solid var(--color-n-border)",
              }}
            >
              Withdraw
            </button>
          )}
        </div>
      </div>

      <RiskDisclosureModal
        open={disclosureOpen}
        onClose={() => setDisclosureOpen(false)}
        onAccept={() => { setDisclosureOpen(false); setDepositOpen(true); }}
      />
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
