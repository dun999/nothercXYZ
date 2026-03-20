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

/* ── My Targets ── */
type EarnTarget = {
  id: string;
  name: string;
  targetUsd: number;
};

const TARGETS_KEY = "notherc-earn-targets";

function loadTargets(): EarnTarget[] {
  try {
    const raw = localStorage.getItem(TARGETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTargets(targets: EarnTarget[]) {
  localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
}

function MyTargets({ totalUsd }: { totalUsd: number }) {
  const [targets, setTargets] = useState<EarnTarget[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");

  useEffect(() => {
    setTargets(loadTargets());
  }, []);

  function addTarget() {
    const t = parseFloat(newTarget.replace(/,/g, ""));
    if (!newName.trim() || !t || t <= 0) return;
    const updated = [...targets, { id: Date.now().toString(), name: newName.trim(), targetUsd: t }];
    setTargets(updated);
    saveTargets(updated);
    setAdding(false);
    setNewName("");
    setNewTarget("");
  }

  function removeTarget(id: string) {
    const updated = targets.filter((t) => t.id !== id);
    setTargets(updated);
    saveTargets(updated);
  }

  return (
    <div
      className="rounded-2xl p-5 mb-3"
      style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--color-n-accent)" }}>
            My Targets
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--color-n-muted)" }}>
            Track your savings milestones
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
            style={{ background: "var(--color-n-accent)", color: "var(--color-n-on-accent)" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add
          </button>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div
          className="rounded-xl p-4 mb-4 animate-fade-in"
          style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-n-text)" }}>New target</p>
          <input
            type="text"
            placeholder="e.g. Emergency Fund"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={32}
            className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold outline-none mb-2"
            style={{
              background: "var(--color-n-surface)",
              border: "1px solid var(--color-n-border)",
              color: "var(--color-n-text)",
            }}
          />
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold"
              style={{ color: "var(--color-n-muted)" }}>$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="10,000"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value.replace(/[^0-9.,]/g, ""))}
              className="w-full rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold outline-none"
              style={{
                background: "var(--color-n-surface)",
                border: "1px solid var(--color-n-border)",
                color: "var(--color-n-text)",
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addTarget}
              disabled={!newName.trim() || !newTarget}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 transition-all active:scale-[0.98]"
              style={{ background: "var(--color-n-accent)", color: "var(--color-n-on-accent)" }}
            >
              Save
            </button>
            <button
              onClick={() => { setAdding(false); setNewName(""); setNewTarget(""); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "var(--color-n-border)", color: "var(--color-n-muted)", background: "transparent" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Target list */}
      {targets.length === 0 && !adding ? (
        <div className="text-center py-4">
          <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>No targets yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-n-muted)" }}>
            Set a goal to track your progress
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {targets.map((t) => {
            const progress = t.targetUsd > 0 ? Math.min((totalUsd / t.targetUsd) * 100, 100) : 0;
            const reached = progress >= 100;
            return (
              <div key={t.id} className="rounded-xl px-4 py-3"
                style={{ background: "var(--color-n-card)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {reached && (
                      <span style={{ color: "var(--color-n-accent)" }}>★</span>
                    )}
                    <span className="text-sm font-semibold" style={{ color: "var(--color-n-text)" }}>
                      {t.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeTarget(t.id)}
                    className="text-xs px-2 py-0.5 rounded-lg"
                    style={{ color: "var(--color-n-muted)", background: "var(--color-n-surface)" }}
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span style={{ color: "var(--color-n-muted)" }}>
                    {formatUSD(totalUsd)} of {formatUSD(t.targetUsd)}
                  </span>
                  <span className="font-bold" style={{ color: reached ? "var(--color-n-accent)" : "var(--color-n-text)" }}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--color-n-border)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: reached ? "var(--color-n-accent)" : `linear-gradient(90deg, var(--color-n-accent) 0%, var(--color-n-accent-dim) 100%)`,
                    }}
                  />
                </div>
                {reached && (
                  <p className="text-[10px] mt-1.5 font-semibold" style={{ color: "var(--color-n-accent)" }}>
                    Target reached!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
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
  const [confirmedEmpty, setConfirmedEmpty] = useState(false);

  // Restore empty-state from sessionStorage when address changes / on mount
  useEffect(() => {
    setVaultStatus({});
    setConfirmedEmpty(false);
    if (address) {
      setConfirmedEmpty(sessionStorage.getItem(`notherc-empty-${address}`) === "1");
    }
  }, [address]);

  const handleLoaded = useCallback((vaultId: string, hasPosition: boolean, usdValue: number) => {
    setVaultStatus((prev) => ({ ...prev, [vaultId]: { hasPosition, usdValue } }));
  }, []);

  const loadedCount = Object.keys(vaultStatus).length;
  const positionCount = Object.values(vaultStatus).filter((v) => v.hasPosition).length;
  const totalUsd = Object.values(vaultStatus).reduce((sum, v) => sum + v.usdValue, 0);
  const allLoaded = loadedCount >= VAULTS.length;
  const isEmpty = allLoaded && positionCount === 0;

  // Persist empty state to sessionStorage so it survives navigation re-mounts
  useEffect(() => {
    if (!address) return;
    const key = `notherc-empty-${address}`;
    if (isEmpty) {
      sessionStorage.setItem(key, "1");
      setConfirmedEmpty(true);
    } else if (allLoaded && positionCount > 0) {
      sessionStorage.removeItem(key);
      setConfirmedEmpty(false);
    }
  }, [isEmpty, allLoaded, positionCount, address]);

  const showEmptyCTA = confirmedEmpty || isEmpty;

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

      {showEmptyCTA && (
        <div
          className="rounded-2xl p-8 text-center mt-2"
          style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
        >
          <p className="text-lg font-black mb-1" style={{ color: "var(--color-n-text)" }}>
            Looking for APY?
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--color-n-muted)" }}>
            No deposits yet. Pick a vault and start earning in seconds — no lock-up.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: "var(--color-n-accent)", color: "var(--color-n-on-accent)" }}
          >
            Explore vaults
          </Link>
        </div>
      )}

      {/* My Targets — shown for connected wallets */}
      <MyTargets totalUsd={totalUsd} />
    </div>
  );
}
