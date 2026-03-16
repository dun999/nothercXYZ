"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useDeposit, usePreviewDeposit, useTokenBalance } from "@yo-protocol/react";
import { parseAmount, formatAmount, estimateYearlyEarnings, parseErrorMessage } from "@/lib/format";
import { VAULTS, BASE_CHAIN_ID } from "@/lib/constants";
import type { VaultId } from "@/lib/constants";

type TxStep = "idle" | "switching-chain" | "approving" | "depositing" | "waiting" | "success" | "error";

const STEP_LABEL: Record<TxStep, string> = {
  idle: "Deposit",
  "switching-chain": "Switching to Base…",
  approving: "Approving token…",
  depositing: "Depositing…",
  waiting: "Confirming on-chain…",
  success: "Deposit confirmed",
  error: "Transaction failed",
};

interface Props {
  open: boolean;
  onClose: () => void;
  vaultId: VaultId;
  apy: number;
}

export function DepositSheet({ open, onClose, vaultId, apy }: Props) {
  const vault = VAULTS.find((v) => v.id === vaultId)!;
  const [amount, setAmount] = useState("");
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const dragStartY = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);

  const { balance: tokenBal } = useTokenBalance(vault.assetAddress, address, {
    enabled: !!address && open,
  });

  const parsedAmount = amount ? parseAmount(amount, vault.decimals) : 0n;

  const { shares, isLoading: previewLoading } = usePreviewDeposit(vaultId, parsedAmount, {
    enabled: parsedAmount > 0n,
  });

  const { deposit, step, isLoading, isSuccess, hash, error, reset } = useDeposit({
    vault: vaultId,
    slippageBps: 50,
    onConfirmed: () => setAmount(""),
  });

  const wrongChain = chainId !== BASE_CHAIN_ID;
  const balanceLoaded = tokenBal !== undefined;
  const insufficientBalance = parsedAmount > 0n && balanceLoaded && parsedAmount > tokenBal!.balance;

  useEffect(() => {
    if (!open) { setAmount(""); reset?.(); setDragOffset(0); }
  }, [open, reset]);

  const onTouchStart = (e: React.TouchEvent) => { dragStartY.current = e.touches[0].clientY; };
  const onTouchMove = (e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0) setDragOffset(dy);
  };
  const onTouchEnd = () => { if (dragOffset > 120) onClose(); else setDragOffset(0); };

  const handleDeposit = useCallback(async () => {
    if (!parsedAmount || parsedAmount === 0n || insufficientBalance) return;
    if (wrongChain) { switchChain?.({ chainId: BASE_CHAIN_ID }); return; }
    await deposit({ token: vault.assetAddress, amount: parsedAmount, chainId: BASE_CHAIN_ID });
  }, [deposit, parsedAmount, vault.assetAddress, insufficientBalance, wrongChain, switchChain]);

  const maxBal = tokenBal
    ? (Number(tokenBal.balance) / 10 ** vault.decimals).toString()
    : "";

  const yearlyEarnings = parsedAmount > 0n
    ? estimateYearlyEarnings(Number(parsedAmount) / 10 ** vault.decimals, apy)
    : null;

  const txStep = (step as TxStep) ?? "idle";
  const isActive = txStep !== "idle" && txStep !== "success" && txStep !== "error";

  const buttonLabel = wrongChain
    ? "Switch to Base"
    : insufficientBalance
      ? `Insufficient ${vault.asset}`
      : STEP_LABEL[txStep];

  const buttonDisabled = isLoading || parsedAmount === 0n || (!!insufficientBalance && !wrongChain);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 sheet-backdrop transition-all duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.65)" }}
        onClick={onClose}
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl sheet-slide"
        style={{
          background: "var(--color-n-surface)",
          borderTop: "1px solid var(--color-n-border)",
          transform: open ? `translateY(${dragOffset}px)` : "translateY(100%)",
          minHeight: "62dvh",
          maxHeight: "92dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          className="flex justify-center pt-3 pb-2 shrink-0"
          style={{ touchAction: "none", cursor: "grab" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--color-n-border)" }} />
        </div>

        <div style={{ overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", flex: "1 1 auto", minHeight: 0, touchAction: "pan-y" }}>
          <div className="px-5 pt-1" style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}>

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-n-text)" }}>
                  Deposit {vault.asset}
                </h2>
                <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>
                  {vault.name}, Base network
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
                    <span className="text-sm" style={{ color: "var(--color-n-muted)" }}>Amount</span>
                    <button
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-n-accent)" }}
                      onClick={() => maxBal && setAmount(maxBal)}
                    >
                      Balance: {tokenBal ? formatAmount(tokenBal.balance, vault.decimals, 2) : "—"} {vault.asset}
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
                        border: `1.5px solid ${insufficientBalance ? "#EF4444" : "var(--color-n-border)"}`,
                        color: "var(--color-n-text)",
                      }}
                    />
                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-semibold"
                      style={{ color: "var(--color-n-muted)" }}
                    >
                      {vault.asset}
                    </span>
                  </div>
                  {insufficientBalance && (
                    <p className="text-red-400 text-xs mt-2">Insufficient {vault.asset} balance.</p>
                  )}
                </div>

                {parsedAmount > 0n && !insufficientBalance && (
                  <div
                    className="rounded-2xl p-4 mb-4 space-y-2.5"
                    style={{ background: "var(--color-n-card)" }}
                  >
                    <Row
                      label="You will receive"
                      value={previewLoading ? "Calculating…" : shares ? `~${formatAmount(shares, vault.decimals, 4)} ${vault.name}` : "—"}
                    />
                    <Row label="Current APY" value={apy > 0 ? `${apy.toFixed(2)}%` : "—"} accent />
                    {yearlyEarnings && (
                      <Row label="Estimated yearly earnings" value={`~${yearlyEarnings}`} accent />
                    )}
                    <Row label="Slippage tolerance" value="0.5%" />
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
                      {STEP_LABEL[txStep]}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleDeposit}
                  disabled={buttonDisabled}
                  className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] disabled:opacity-40"
                  style={{
                    background: isSuccess ? "#22C55E" : wrongChain ? "#3B82F6" : "var(--color-n-accent)",
                    color: "#000",
                    cursor: buttonDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  {buttonLabel}
                </button>

                {error && (
                  <div className="mt-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <p className="text-red-400 text-sm">{parseErrorMessage(error)}</p>
                    <button onClick={() => reset?.()} className="text-xs text-red-400/70 underline mt-1">
                      Try again
                    </button>
                  </div>
                )}

                {isSuccess && hash && (
                  <div className="mt-3 rounded-xl px-4 py-3 flex items-center justify-between"
                    style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <span className="text-sm text-emerald-400 font-medium">Deposit confirmed</span>
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
            <p className="text-xs text-center mt-4 mb-2" style={{ color: "var(--color-n-muted)" }}>
              ERC-4626 vault on Base. Non-custodial, the contract holds your funds.
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
