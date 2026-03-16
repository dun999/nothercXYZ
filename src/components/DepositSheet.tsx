"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useDeposit, usePreviewDeposit, useTokenBalance } from "@yo-protocol/react";
import { useFundWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { base } from "viem/chains";
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
  const [copied, setCopied] = useState(false);
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { fundWallet } = useFundWallet();
  const dragStartY = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);

  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
  const isEmailUser = !!user?.email && !!embeddedWallet;

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
  const hasBalance = tokenBal && tokenBal.balance > 0n;
  const insufficientBalance = parsedAmount > 0n && tokenBal && parsedAmount > tokenBal.balance;

  useEffect(() => {
    if (!open) { setAmount(""); reset?.(); setDragOffset(0); setCopied(false); }
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

  const handleCopyAddress = () => {
    if (!embeddedWallet?.address) return;
    navigator.clipboard.writeText(embeddedWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFundWallet = () => {
    if (!embeddedWallet?.address) return;
    fundWallet(embeddedWallet.address, {
      chain: base,
      // Fund with the vault's native asset where possible
      asset: vault.asset === "USDC" ? "USDC" : "native-currency",
    });
  };

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

  // Show fund wallet UI for email users with zero balance
  const showFundUI = isEmailUser && !hasBalance;

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
        {/* Drag handle */}
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
        <div className="px-5 pt-1" style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}>
          {/* Title */}
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

          {/* Fund wallet UI — email users with zero balance */}
          {showFundUI ? (
            <div className="space-y-3">
              <div
                className="rounded-2xl p-4"
                style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-n-text)" }}>
                  Your wallet has no {vault.asset}
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--color-n-muted)" }}>
                  Send {vault.asset} to your Notherc wallet on Base, or buy directly with a card.
                </p>

                {/* Wallet address */}
                <div
                  className="rounded-xl px-3 py-2.5 mb-3 flex items-center justify-between gap-2"
                  style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
                >
                  <span
                    className="text-xs font-mono truncate"
                    style={{ color: "var(--color-n-muted)" }}
                  >
                    {embeddedWallet?.address}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg"
                    style={{
                      background: copied ? "rgba(34,197,94,0.15)" : "var(--color-n-card)",
                      color: copied ? "#22C55E" : "var(--color-n-accent)",
                      border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "var(--color-n-border)"}`,
                    }}
                  >
                    {copied ? (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] mb-3" style={{ color: "var(--color-n-muted)" }}>
                  Make sure to send on the <span style={{ color: "var(--color-n-accent)" }}>Base network</span> only.
                </p>

                {/* Buy with card */}
                <button
                  onClick={handleFundWallet}
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, var(--color-n-accent) 0%, var(--color-n-accent-dim) 100%)",
                    color: "#000",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                  Buy {vault.asset} with card
                </button>
              </div>

              <p className="text-xs text-center" style={{ color: "var(--color-n-muted)" }}>
                Already funded?{" "}
                <button
                  onClick={() => {/* force balance refresh by toggling — noop, balance auto-refreshes */}}
                  style={{ color: "var(--color-n-accent)", textDecoration: "underline" }}
                >
                  Refresh balance
                </button>
              </p>
            </div>
          ) : (
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

              {/* Preview card */}
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
                onClick={handleDeposit}
                disabled={buttonDisabled}
                className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] disabled:opacity-40"
                style={{
                  background: isSuccess ? "#22C55E"
                    : wrongChain ? "#3B82F6"
                      : "var(--color-n-accent)",
                  color: "#000",
                  cursor: buttonDisabled ? "not-allowed" : "pointer",
                }}
              >
                {buttonLabel}
              </button>

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

              {/* Success */}
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
            </>
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

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: "var(--color-n-muted)" }}>{label}</span>
      <span
        className="text-sm font-semibold"
        style={{ color: accent ? "var(--color-n-accent)" : "var(--color-n-text)" }}
      >
        {value}
      </span>
    </div>
  );
}
