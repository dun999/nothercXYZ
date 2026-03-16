"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRedeem, usePreviewRedeem, useShareBalance } from "@yo-protocol/react";
import { parseAmount, formatAmount, parseErrorMessage } from "@/lib/format";
import { VAULTS } from "@/lib/constants";
import type { VaultId } from "@/lib/constants";

type TxStep = "idle" | "approving" | "redeeming" | "waiting" | "success" | "error";

const STEP_LABEL: Record<TxStep, string> = {
  idle: "Withdraw",
  approving: "Approving…",
  redeeming: "Redeeming shares…",
  waiting: "Confirming on-chain…",
  success: "Withdrawal confirmed",
  error: "Transaction failed",
};

interface Props {
  open: boolean;
  onClose: () => void;
  vaultId: VaultId;
}

export function RedeemSheet({ open, onClose, vaultId }: Props) {
  const vault = VAULTS.find((v) => v.id === vaultId)!;
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const dragStartY = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);

  const { shares: shareBalance } = useShareBalance(vaultId, address!, {
    enabled: !!address && open,
  });

  const parsedAmount = amount ? parseAmount(amount, vault.decimals) : 0n;
  const insufficientShares = parsedAmount > 0n && shareBalance !== undefined && parsedAmount > shareBalance;

  const { assets: previewAssets, isLoading: previewLoading } = usePreviewRedeem(
    vaultId,
    parsedAmount,
    { enabled: parsedAmount > 0n && !insufficientShares }
  );

  const { redeem, step, isLoading, isSuccess, hash, instant, assetsOrRequestId, error, reset } =
    useRedeem({ vault: vaultId, onConfirmed: () => setAmount("") });

  useEffect(() => {
    if (!open) { setAmount(""); reset?.(); setDragOffset(0); }
  }, [open, reset]);

  const onTouchStart = (e: React.TouchEvent) => { dragStartY.current = e.touches[0].clientY; };
  const onTouchMove = (e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0) setDragOffset(dy);
  };
  const onTouchEnd = () => { if (dragOffset > 120) onClose(); else setDragOffset(0); };

  const handleRedeem = useCallback(async () => {
    if (!parsedAmount || parsedAmount === 0n || insufficientShares) return;
    await redeem(parsedAmount);
  }, [redeem, parsedAmount, insufficientShares]);

  const txStep = (step as TxStep) ?? "idle";
  const isActive = txStep !== "idle" && txStep !== "success" && txStep !== "error";

  const buttonDisabled = isLoading || parsedAmount === 0n || !!insufficientShares;
  const maxShares = shareBalance
    ? (Number(shareBalance) / 10 ** vault.decimals).toString()
    : "";

  return (
    <>
      <div
        className={`fixed inset-0 z-50 sheet-backdrop transition-all duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.65)" }}
        onClick={onClose}
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl transition-transform duration-300"
        style={{
          background: "var(--color-n-surface)",
          borderTop: "1px solid var(--color-n-border)",
          transform: open ? `translateY(${dragOffset}px)` : "translateY(100%)",
          maxHeight: "92dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Drag handle — satu-satunya area yang handle drag */}
        <div
          className="flex justify-center pt-3 pb-2 shrink-0"
          style={{ touchAction: "none", cursor: "grab" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--color-n-border)" }} />
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", flex: "1 1 auto", minHeight: 0, touchAction: "pan-y" }}>
        <div className="px-5 pt-1" style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}>
          {/* Title */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--color-n-text)" }}>
                Withdraw {vault.asset}
              </h2>
              <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>
                {vault.name}, redeem your shares
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "var(--color-n-card)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-n-muted)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Amount input */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm" style={{ color: "var(--color-n-muted)" }}>
                Amount to withdraw
              </span>
              <button
                className="text-xs font-semibold"
                style={{ color: "var(--color-n-accent)" }}
                onClick={() => maxShares && setAmount(maxShares)}
              >
                Max: {shareBalance ? formatAmount(shareBalance, vault.decimals, 2) : "—"} {vault.name}
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  if (/^\d*\.?\d*$/.test(e.target.value)) {
                    setAmount(e.target.value);
                    if (isSuccess || error) reset?.();
                  }
                }}
                className="w-full rounded-2xl px-4 py-4 text-2xl font-bold outline-none transition-all"
                style={{
                  background: "var(--color-n-card)",
                  border: `1.5px solid ${insufficientShares ? "#EF4444" : "var(--color-n-border)"}`,
                  color: "var(--color-n-text)",
                }}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                style={{ color: "var(--color-n-muted)" }}
              >
                {vault.name}
              </span>
            </div>
            {insufficientShares && (
              <p className="text-red-400 text-xs mt-2">
                Not enough {vault.name} shares.
              </p>
            )}
          </div>

          {/* Preview */}
          {parsedAmount > 0n && !insufficientShares && (
            <div
              className="rounded-2xl p-4 mb-4 space-y-2.5"
              style={{ background: "var(--color-n-card)" }}
            >
              <Row
                label="You will receive"
                value={
                  previewLoading
                    ? "Calculating…"
                    : previewAssets
                      ? `~${formatAmount(previewAssets, vault.decimals, 4)} ${vault.asset}`
                      : "—"
                }
                accent
              />
              <Row
                label="Network"
                value={
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live" />
                    Base
                  </span>
                }
              />
            </div>
          )}

          {/* Status */}
          {isActive && (
            <div
              className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
              style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "var(--color-n-accent)" }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style={{ background: "var(--color-n-accent)" }} />
              </span>
              <span className="text-sm" style={{ color: "var(--color-n-text)" }}>
                {STEP_LABEL[txStep]}
              </span>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleRedeem}
            disabled={buttonDisabled}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] disabled:opacity-40"
            style={{
              background: isSuccess ? "#22C55E" : "var(--color-n-card)",
              border: `1px solid ${isSuccess ? "#22C55E" : "var(--color-n-border)"}`,
              color: isSuccess ? "#000" : "var(--color-n-text)",
              cursor: buttonDisabled ? "not-allowed" : "pointer",
            }}
          >
            {STEP_LABEL[txStep]}
          </button>

          {/* Queued withdrawal */}
          {isSuccess && !instant && (
            <div className="mt-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <p className="text-amber-400 text-sm font-medium">Withdrawal queued</p>
              <p className="text-amber-400/70 text-xs mt-0.5">
                Request #{assetsOrRequestId?.toString()} available within 24 hours
              </p>
            </div>
          )}

          {/* Instant withdrawal */}
          {isSuccess && instant && hash && (
            <div className="mt-3 rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <span className="text-sm text-emerald-400 font-medium">Instant withdrawal complete</span>
              <a
                href={`https://basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold"
                style={{ color: "var(--color-n-accent)" }}
              >
                View tx
              </a>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-red-400 text-sm">{parseErrorMessage(error)}</p>
              <button onClick={() => reset?.()} className="text-xs text-red-400/70 underline mt-1">
                Try again
              </button>
            </div>
          )}

          <p className="text-xs text-center mt-4 mb-2" style={{ color: "var(--color-n-muted)" }}>
            No lock-up. Withdraw any time. Funds return to your wallet.
          </p>
        </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: "var(--color-n-muted)" }}>{label}</span>
      <span className="text-sm font-semibold"
        style={{ color: accent ? "var(--color-n-accent)" : "var(--color-n-text)" }}>
        {value}
      </span>
    </div>
  );
}
