"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useRedeem, usePreviewRedeem, useShareBalance } from "@yo-protocol/react";
import { parseAmount, formatAmount, parseErrorMessage } from "@/lib/format";
import { VAULTS } from "@/lib/constants";
import type { VaultId } from "@/lib/constants";

type TxStep = "idle" | "approving" | "redeeming" | "waiting" | "success" | "error";

const STEP_LABEL: Record<TxStep, string> = {
  idle: "Withdraw",
  approving: "Approving",
  redeeming: "Redeeming shares",
  waiting: "Confirming on-chain",
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

  const { shares: shareBalance } = useShareBalance(vaultId, address as `0x${string}`, {
    enabled: !!address && open,
  });

  const parsedAmount = amount ? parseAmount(amount, vault.decimals) : 0n;
  const insufficientShares = parsedAmount > 0n && shareBalance !== undefined && parsedAmount > shareBalance;

  const { assets: previewAssets, isLoading: previewLoading } = usePreviewRedeem(
    vaultId,
    parsedAmount,
    { enabled: parsedAmount > 0n && !insufficientShares }
  );

  const { redeem, step, isLoading, isSuccess, hash, instant, assetsOrRequestId, error, reset, approveHash } =
    useRedeem({ vault: vaultId, onConfirmed: () => setAmount("") });

  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash as `0x${string}` | undefined,
    query: { enabled: !!approveHash },
  });

  // Fallback: if approval hash is set but wagmi hasn't confirmed after 30s,
  // the RPC is likely slow — unlock the button so the user can retry.
  const [approveTimedOut, setApproveTimedOut] = useState(false);
  useEffect(() => {
    if (!approveHash || step !== "approving") { setApproveTimedOut(false); return; }
    const t = setTimeout(() => setApproveTimedOut(true), 30_000);
    return () => clearTimeout(t);
  }, [approveHash, step]);

  useEffect(() => {
    if (!open) { setAmount(""); reset?.(); }
  }, [open, reset]);

  const handleRedeem = useCallback(async () => {
    if (!parsedAmount || parsedAmount === 0n || insufficientShares) return;
    await redeem(parsedAmount);
  }, [redeem, parsedAmount, insufficientShares]);

  const txStep = (step as TxStep) ?? "idle";
  const isActive = txStep !== "idle" && txStep !== "success" && txStep !== "error";

  // Approval tx confirmed on-chain but hook still waiting (stuck) — allow manual retry
  const approvalStuck = (approveConfirmed || approveTimedOut) && txStep === "approving";

  const buttonDisabled = (isLoading && !approvalStuck) || parsedAmount === 0n || !!insufficientShares;
  const maxShares = shareBalance
    ? (Number(shareBalance) / 10 ** vault.decimals).toString()
    : "";

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 sheet-backdrop animate-fade-in"
        style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Centered modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
        <div
          className="w-full max-w-sm rounded-3xl pointer-events-auto animate-modal"
          style={{
            background: "var(--color-n-surface)",
            border: "1px solid var(--color-n-border)",
            maxHeight: "88dvh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
        <div style={{ overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
          <div className="px-5 py-5">

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
                  Not enough {vault.name} shares
                </p>
              )}
            </div>

            {parsedAmount > 0n && !insufficientShares && (
              <div
                className="rounded-2xl p-4 mb-4 space-y-2.5"
                style={{ background: "var(--color-n-card)" }}
              >
                <Row
                  label="You will receive"
                  value={
                    previewLoading
                      ? "Calculating"
                      : previewAssets
                        ? `~${formatAmount(previewAssets, vault.decimals, 4)} ${vault.asset}`
                        : "—"
                  }
                  accent
                />
                <Row
                  label="Destination"
                  value={
                    <span className="font-mono text-xs">
                      {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—"}
                    </span>
                  }
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
                  {approvalStuck ? "Approval confirmed, tap Withdraw to continue" : STEP_LABEL[txStep]}
                </span>
              </div>
            )}

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
              {approvalStuck ? STEP_LABEL.idle : STEP_LABEL[txStep]}
            </button>

            {isSuccess && !instant && (
              <div className="mt-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <p className="text-amber-400 text-sm font-medium">Withdrawal queued</p>
                <p className="text-amber-400/70 text-xs mt-0.5">
                  Request #{assetsOrRequestId?.toString()} available within 24 hours
                </p>
              </div>
            )}

            {isSuccess && instant && hash && (
              <div className="mt-3 rounded-xl px-4 py-3 flex items-center justify-between"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <span className="text-sm text-emerald-400 font-medium">Withdrawal complete</span>
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
              No lock-up · Funds return to your wallet on Base
            </p>
          </div>
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
