"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { useDeposit, usePreviewDeposit, useTokenBalance } from "@yo-protocol/react";
import { parseAmount, formatAmount, formatUSD, estimateYearlyEarnings, parseErrorMessage } from "@/lib/format";
import { VAULTS, BASE_CHAIN_ID } from "@/lib/constants";
import {
  APPROVAL_TIMEOUT_MS, DEPOSIT_SLIPPAGE_BPS,
  MODAL_BACKDROP, MODAL_SHADOW,
  COLOR_SUCCESS, COLOR_ERROR, COLOR_CHAIN_SWITCH,
  COLOR_SUCCESS_BG, COLOR_SUCCESS_BORDER,
  COLOR_ERROR_BG, COLOR_ERROR_BORDER,
  basescanTx,
} from "@/lib/config";
import type { VaultId } from "@/lib/constants";

type TxStep = "idle" | "switching-chain" | "approving" | "depositing" | "waiting" | "success" | "error";

const STEP_LABEL: Record<TxStep, string> = {
  idle: "Deposit",
  "switching-chain": "Switching to Base",
  approving: "Approving token",
  depositing: "Depositing",
  waiting: "Confirming on-chain",
  success: "Deposit confirmed",
  error: "Transaction failed",
};

interface Props {
  open: boolean;
  onClose: () => void;
  vaultId: VaultId;
  apy: number;
}

function calcProjection(principal: number, apyPct: number, years: number): number {
  return principal * Math.pow(1 + apyPct / 100, years) - principal;
}

export function DepositSheet({ open, onClose, vaultId, apy }: Props) {
  const vault = VAULTS.find((v) => v.id === vaultId)!;
  const [amount, setAmount] = useState("");
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const queryClient = useQueryClient();

  const { balance: tokenBal } = useTokenBalance(vault.assetAddress, address, {
    enabled: !!address && open,
  });

  const parsedAmount = amount ? parseAmount(amount, vault.decimals) : 0n;

  const { shares, isLoading: previewLoading } = usePreviewDeposit(vaultId, parsedAmount, {
    enabled: parsedAmount > 0n,
  });

  const { deposit, step, isLoading, isSuccess, hash, error, reset, approveHash } = useDeposit({
    vault: vaultId,
    slippageBps: DEPOSIT_SLIPPAGE_BPS,
    onConfirmed: () => setAmount(""),
  });

  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash as `0x${string}` | undefined,
    query: { enabled: !!approveHash },
  });

  const [approveTimedOut, setApproveTimedOut] = useState(false);
  useEffect(() => {
    if (!approveHash || step !== "approving") { setApproveTimedOut(false); return; }
    const t = setTimeout(() => setApproveTimedOut(true), APPROVAL_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [approveHash, step]);

  const wrongChain = chainId !== BASE_CHAIN_ID;
  const balanceLoaded = tokenBal !== undefined;
  const insufficientBalance = parsedAmount > 0n && balanceLoaded && parsedAmount > tokenBal!.balance;

  const resetRef = useRef(reset);
  resetRef.current = reset;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) { setAmount(""); resetRef.current?.(); }
  }, [open]);

  useEffect(() => {
    if (!address && open) onCloseRef.current();
  }, [address, open]);

  useEffect(() => {
    if (isSuccess) queryClient.invalidateQueries();
  }, [isSuccess, queryClient]);

  const handleDeposit = useCallback(async () => {
    if (!address || !parsedAmount || parsedAmount === 0n || insufficientBalance) return;
    if (wrongChain) { switchChain?.({ chainId: BASE_CHAIN_ID }); return; }
    await deposit({ token: vault.assetAddress, amount: parsedAmount, chainId: BASE_CHAIN_ID });
  }, [address, deposit, parsedAmount, vault.assetAddress, insufficientBalance, wrongChain, switchChain]);

  const maxBal = tokenBal
    ? (Number(tokenBal.balance) / 10 ** vault.decimals).toString()
    : "";

  const yearlyEarnings = parsedAmount > 0n
    ? estimateYearlyEarnings(Number(parsedAmount) / 10 ** vault.decimals, apy)
    : null;

  // Projected earnings for success screen
  const depositedUsd = parsedAmount > 0n
    ? Number(parsedAmount) / 10 ** vault.decimals
    : 0;

  const txStep = (step as TxStep) ?? "idle";
  const isActive = txStep !== "idle" && txStep !== "success" && txStep !== "error";
  const approvalStuck = (approveConfirmed || approveTimedOut) && txStep === "approving";

  const buttonLabel = wrongChain
    ? "Switch to Base"
    : insufficientBalance
      ? `Insufficient ${vault.asset}`
      : approvalStuck
        ? STEP_LABEL.idle
        : STEP_LABEL[txStep];

  const buttonDisabled = (isLoading && !approvalStuck) || parsedAmount === 0n || (!!insufficientBalance && !wrongChain);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 sheet-backdrop animate-fade-in"
        style={{ background: MODAL_BACKDROP, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
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
            boxShadow: MODAL_SHADOW,
          }}
        >
          <div style={{ overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
            <div className="p-5">

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--color-n-text)" }}>
                    Deposit {vault.asset}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>
                    {vault.name} · Base
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "var(--color-n-card)" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="var(--color-n-muted)" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {address && (
                <>
                  {/* Amount input */}
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
                        className="w-full rounded-2xl px-4 py-4 text-2xl font-bold outline-none"
                        style={{
                          background: "var(--color-n-card)",
                          border: `1.5px solid ${insufficientBalance ? COLOR_ERROR : "var(--color-n-border)"}`,
                          color: "var(--color-n-text)",
                        }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                        style={{ color: "var(--color-n-muted)" }}>
                        {vault.asset}
                      </span>
                    </div>
                    {insufficientBalance && (
                      <p className="text-red-400 text-xs mt-1.5">Insufficient {vault.asset} balance</p>
                    )}
                  </div>

                  {/* Preview */}
                  {parsedAmount > 0n && !insufficientBalance && (
                    <div className="rounded-2xl p-4 mb-4 space-y-2" style={{ background: "var(--color-n-card)" }}>
                      <Row label="You will receive"
                        value={previewLoading ? "Calculating" : shares ? `~${formatAmount(shares, vault.decimals, 4)} ${vault.name}` : "—"} />
                      <Row label="Current APY" value={apy > 0 ? `${apy.toFixed(2)}%` : "—"} accent />
                      {yearlyEarnings && <Row label="Est. yearly earnings" value={`~${yearlyEarnings}`} accent />}
                      <Row label="Slippage" value="0.5%" />
                      <Row label="Network" value={
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live" />
                          Base
                        </span>
                      } />
                    </div>
                  )}

                  {/* Active tx status */}
                  {isActive && (
                    <div className="rounded-xl px-4 py-3 mb-4"
                      style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}>
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ background: "var(--color-n-accent)" }} />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5"
                            style={{ background: "var(--color-n-accent)" }} />
                        </span>
                        <div className="flex-1">
                          <span className="text-sm" style={{ color: "var(--color-n-text)" }}>
                            {approvalStuck ? "Approval confirmed, tap Deposit to continue" : STEP_LABEL[txStep]}
                          </span>
                          {txStep === "approving" && !approvalStuck && (
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>
                              Step 1 of 2 · only needed once per vault
                            </p>
                          )}
                          {txStep === "depositing" && (
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>
                              Step 2 of 2 · confirm in your wallet
                            </p>
                          )}
                          {txStep === "waiting" && (
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>
                              Usually under 5 seconds on Base
                            </p>
                          )}
                          {/* Approval tx link */}
                          {txStep === "approving" && approveHash && (
                            <a
                              href={basescanTx(approveHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs mt-0.5 block"
                              style={{ color: "var(--color-n-accent)" }}
                            >
                              View approval tx ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {!isSuccess && (
                    <button
                      onClick={handleDeposit}
                      disabled={buttonDisabled}
                      className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] disabled:opacity-40"
                      style={{
                        background: wrongChain ? COLOR_CHAIN_SWITCH : "var(--color-n-accent)",
                        color: wrongChain ? "#fff" : "var(--color-n-on-accent)",
                        cursor: buttonDisabled ? "not-allowed" : "pointer",
                      }}
                    >
                      {buttonLabel}
                    </button>
                  )}

                  {error && (
                    <div className="mt-3 rounded-xl px-4 py-3"
                      style={{ background: COLOR_ERROR_BG, border: `1px solid ${COLOR_ERROR_BORDER}` }}>
                      <p className="text-red-400 text-sm">{parseErrorMessage(error)}</p>
                      <button onClick={() => reset?.()} className="text-xs text-red-400/70 underline mt-1">Try again</button>
                    </div>
                  )}

                  {/* Enhanced success screen */}
                  {isSuccess && hash && (
                    <div className="animate-fade-in">
                      {/* Success header */}
                      <div
                        className="rounded-2xl p-5 mb-3 text-center"
                        style={{ background: COLOR_SUCCESS_BG, border: `1px solid ${COLOR_SUCCESS_BORDER}` }}
                      >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ background: "rgba(34,197,94,0.15)" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke={COLOR_SUCCESS} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                        <p className="text-base font-black mb-0.5" style={{ color: "var(--color-n-text)" }}>
                          Now earning {apy > 0 ? `${apy.toFixed(2)}%` : ""} APY
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-n-muted)" }}>
                          Your money is working for you
                        </p>
                      </div>

                      {/* Projected earnings */}
                      {depositedUsd > 0 && apy > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {[
                            { label: "1 month", years: 1 / 12 },
                            { label: "6 months", years: 0.5 },
                            { label: "1 year", years: 1 },
                          ].map(({ label, years }) => {
                            const earned = calcProjection(depositedUsd, apy, years);
                            return (
                              <div key={label} className="rounded-xl px-2 py-2.5 text-center"
                                style={{ background: "var(--color-n-card)" }}>
                                <div className="text-[10px] mb-1" style={{ color: "var(--color-n-muted)" }}>{label}</div>
                                <div className="text-sm font-black" style={{ color: "var(--color-n-accent)" }}>
                                  +{formatUSD(earned)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <p className="text-[10px] text-center mb-3" style={{ color: "var(--color-n-muted)" }}>
                        Projected at current APY · Rates are variable
                      </p>

                      {/* TX link */}
                      <a
                        href={basescanTx(hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 text-sm font-semibold mb-2 py-2"
                        style={{ color: "var(--color-n-accent)" }}
                      >
                        View transaction on BaseScan ↗
                      </a>

                      {/* Portfolio button */}
                      <Link
                        href="/portfolio"
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-bold text-sm text-center block transition-all active:scale-[0.98]"
                        style={{
                          background: "var(--color-n-accent)",
                          color: "var(--color-n-on-accent)",
                        }}
                      >
                        View Portfolio →
                      </Link>
                    </div>
                  )}

                  {!isSuccess && (
                    <p className="text-xs text-center mt-4" style={{ color: "var(--color-n-muted)" }}>
                      Non-custodial · Withdraw any time
                    </p>
                  )}
                </>
              )}

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
