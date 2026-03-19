"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { useUserPosition, useVaultState, useVaults, usePrices } from "@yo-protocol/react";
import { VAULTS, VAULT_ADDRESSES } from "@/lib/constants";
import { basescanAddress } from "@/lib/config";
import { formatAmount, formatUSD, formatPercent, shortenAddress } from "@/lib/format";
import { RedeemSheet } from "./RedeemSheet";
import { VaultIcon } from "./VaultIcon";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import type { VaultId } from "@/lib/constants";

function ExploreVaultsSection() {
  const { vaults: vaultsList } = useVaults();

  return (
    <div className="mt-2 animate-fade-in">
      <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--color-n-accent)" }}>
        Explore Vaults
      </p>
      <div className="space-y-2">
        {VAULTS.map((vault) => {
          const stats = vaultsList?.find((v: { id: string }) => v.id.toLowerCase() === vault.id.toLowerCase());
          const apy = stats?.yield?.["7d"] ? parseFloat(stats.yield["7d"]) : null;
          return (
            <Link
              key={vault.id}
              href="/"
              className="flex items-center gap-3 rounded-2xl p-4 active:scale-[0.98] transition-all"
              style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
            >
              <VaultIcon id={vault.id} size={40} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: "var(--color-n-text)" }}>{vault.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>{vault.description}</div>
                <div
                  className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1.5"
                  style={{ background: "var(--color-n-card)", color: "var(--color-n-muted)" }}
                >
                  {vault.riskLevel} risk
                </div>
              </div>
              <div className="text-right shrink-0">
                {apy !== null ? (
                  <div className="text-xl font-black" style={{ color: "var(--color-n-accent)" }}>
                    {formatPercent(apy)}
                  </div>
                ) : (
                  <div className="w-14 h-7 rounded-lg animate-pulse" style={{ background: "var(--color-n-card)" }} />
                )}
                <div className="text-[10px]" style={{ color: "var(--color-n-muted)" }}>APY</div>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="text-center text-xs mt-4" style={{ color: "var(--color-n-muted)" }}>
        No lock-up period · Withdraw anytime
      </p>
    </div>
  );
}

function PositionCard({ vaultId, address, onLoaded }: { vaultId: VaultId; address: string; onLoaded: (vaultId: string, hasPosition: boolean, usdValue: number) => void }) {
  const vault = VAULTS.find((v) => v.id === vaultId)!;
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [cardRef, inView] = useInView();

  const { position, isLoading: posLoading } = useUserPosition(vaultId, address as `0x${string}`, {
    enabled: !!address,
  });
  const { vaultState } = useVaultState(vaultId);
  const { vaults: vaultsList } = useVaults();
  const { prices } = usePrices();
  const earlyAssetValue = position ? Number(position.assets) / 10 ** vault.decimals : 0;
  const positionUsd = earlyAssetValue * (prices?.[vault.coingeckoId] ?? 0);

  useEffect(() => {
    if (!posLoading) {
      onLoaded(vaultId, (position?.shares ?? 0n) > 0n, positionUsd);
    }
  }, [posLoading, position, onLoaded, vaultId, positionUsd]);

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
        ref={cardRef}
        className={`rounded-2xl p-5 mb-3${inView ? " animate-slide-up" : " opacity-0"}`}
        style={{
          background: "var(--color-n-surface)",
          border: "1px solid var(--color-n-border)",
        }}
      >
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
            {positionUsd > 0 && (
              <div className="text-xs font-semibold" style={{ color: "var(--color-n-muted)" }}>
                ≈ {formatUSD(positionUsd)}
              </div>
            )}
            <div className="text-xs" style={{ color: "var(--color-n-accent)" }}>
              {formatPercent(apy)} APY
            </div>
          </div>
        </div>

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

        <div className="text-center mt-3">
          <a
            href={basescanAddress(VAULT_ADDRESSES[vaultId])}
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
  const { login } = usePrivy();
  const [vaultStatus, setVaultStatus] = useState<Record<string, { hasPosition: boolean; usdValue: number }>>({});

  useEffect(() => {
    setVaultStatus({});
  }, [address]);

  const handleLoaded = useCallback((vaultId: string, hasPosition: boolean, usdValue: number) => {
    setVaultStatus((prev) => ({ ...prev, [vaultId]: { hasPosition, usdValue } }));
  }, []);

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
        <p className="font-semibold mb-4" style={{ color: "var(--color-n-text)" }}>No wallet connected</p>
        <button
          onClick={() => login()}
          className="px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
          style={{ background: "var(--color-n-accent)", color: "var(--color-n-on-accent)" }}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const loadedCount = Object.keys(vaultStatus).length;
  const positionCount = Object.values(vaultStatus).filter((v) => v.hasPosition).length;
  const totalUsd = Object.values(vaultStatus).reduce((sum, v) => sum + v.usdValue, 0);
  const allLoaded = loadedCount >= VAULTS.length;
  const isEmpty = allLoaded && positionCount === 0;

  return (
    <div>
      <div
        className="rounded-xl px-3 py-2 mb-4 flex items-center gap-2"
        style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <span className="text-xs font-mono" style={{ color: "var(--color-n-muted)" }}>
          {shortenAddress(address)}
        </span>
        {totalUsd > 0 && (
          <span className="text-xs font-bold" style={{ color: "var(--color-n-accent)" }}>
            {formatUSD(totalUsd)}
          </span>
        )}
        <a
          href={basescanAddress(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs shrink-0"
          style={{ color: "var(--color-n-muted)" }}
        >
          BaseScan ↗
        </a>
      </div>

      {VAULTS.map((v) => (
        // key includes address so cards remount on wallet switch, resetting reported state
        <PositionCard key={`${v.id}-${address}`} vaultId={v.id} address={address} onLoaded={handleLoaded} />
      ))}

      {isEmpty && (
        <div className="animate-fade-in">
          <div
            className="rounded-2xl px-6 py-5 mb-4 text-center"
            style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--color-n-accent)" }}>
              No deposits yet
            </p>
            <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>
              Pick a vault below and start earning yield in seconds.
            </p>
          </div>
          <ExploreVaultsSection />
        </div>
      )}
    </div>
  );
}
