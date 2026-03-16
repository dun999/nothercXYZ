"use client";

import { useState, useEffect, useRef } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useTokenBalance } from "@yo-protocol/react";
import { encodeFunctionData, isAddress, parseUnits, formatUnits } from "viem";
import { VAULTS, BASE_CHAIN_ID } from "@/lib/constants";
import { formatAmount, parseErrorMessage } from "@/lib/format";
import type { VaultId } from "@/lib/constants";

const ERC20_TRANSFER_ABI = [{
  name: "transfer",
  type: "function",
  inputs: [
    { name: "to", type: "address" },
    { name: "amount", type: "uint256" },
  ],
  outputs: [{ type: "bool" }],
  stateMutability: "nonpayable",
}] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

type TxState = "idle" | "sending" | "success" | "error";

export function SendSheet({ open, onClose }: Props) {
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");

  const [selectedVaultId, setSelectedVaultId] = useState<VaultId>("yoUSD");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txState, setTxState] = useState<TxState>("idle");
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef(0);

  const vault = VAULTS.find((v) => v.id === selectedVaultId)!;

  const { balance: tokenBal } = useTokenBalance(
    vault.assetAddress,
    embeddedWallet?.address as `0x${string}` | undefined,
    { enabled: !!embeddedWallet && open }
  );

  useEffect(() => {
    if (!open) {
      setToAddress("");
      setAmount("");
      setTxState("idle");
      setTxHash("");
      setErrorMsg("");
      setDragOffset(0);
    }
  }, [open]);

  const onTouchStart = (e: React.TouchEvent) => { dragStartY.current = e.touches[0].clientY; };
  const onTouchMove = (e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0) setDragOffset(dy);
  };
  const onTouchEnd = () => { if (dragOffset > 120) onClose(); else setDragOffset(0); };

  const maxBal = tokenBal ? Number(formatUnits(tokenBal.balance, vault.decimals)) : 0;
  const parsedAmount = amount ? parseFloat(amount) : 0;
  const isValidAddress = isAddress(toAddress);
  const isValidAmount = parsedAmount > 0 && parsedAmount <= maxBal;
  const canSend = isValidAddress && isValidAmount && txState === "idle" && !!embeddedWallet;

  async function handleSend() {
    if (!canSend || !embeddedWallet) return;
    setTxState("sending");
    setErrorMsg("");
    try {
      const provider = await embeddedWallet.getEthereumProvider();
      const amountBigInt = parseUnits(amount, vault.decimals);
      const data = encodeFunctionData({
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [toAddress as `0x${string}`, amountBigInt],
      });
      const hash = await provider.request({
        method: "eth_sendTransaction",
        params: [{
          from: embeddedWallet.address,
          to: vault.assetAddress,
          data,
          chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
        }],
      });
      setTxHash(hash as string);
      setTxState("success");
    } catch (e) {
      setErrorMsg(parseErrorMessage(e as Error));
      setTxState("error");
    }
  }

  if (!embeddedWallet) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
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

        <div style={{ overflowY: "auto", flex: "1 1 auto", minHeight: 0, touchAction: "pan-y" }}>
          <div className="px-5 pt-1 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-n-text)" }}>
                  Send tokens
                </h2>
                <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>
                  From your Notherc wallet · Base network
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

            {/* Asset selector */}
            <div className="mb-4">
              <p className="text-sm mb-2" style={{ color: "var(--color-n-muted)" }}>Asset</p>
              <div className="flex gap-2">
                {VAULTS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVaultId(v.id); setAmount(""); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: selectedVaultId === v.id ? "var(--color-n-accent)" : "var(--color-n-card)",
                      color: selectedVaultId === v.id ? "#000" : "var(--color-n-muted)",
                      border: `1px solid ${selectedVaultId === v.id ? "transparent" : "var(--color-n-border)"}`,
                    }}
                  >
                    {v.asset}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2 text-right" style={{ color: "var(--color-n-muted)" }}>
                Balance:{" "}
                <span style={{ color: "var(--color-n-accent)" }}>
                  {tokenBal ? formatAmount(tokenBal.balance, vault.decimals, 4) : "—"} {vault.asset}
                </span>
              </p>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>Amount</p>
                <button
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-n-accent)" }}
                  onClick={() => maxBal > 0 && setAmount(maxBal.toString())}
                >
                  Max
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
                  }}
                  className="w-full rounded-2xl px-4 py-4 text-2xl font-bold outline-none"
                  style={{
                    background: "var(--color-n-card)",
                    border: `1.5px solid ${amount && !isValidAmount ? "#EF4444" : "var(--color-n-border)"}`,
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
              {amount && !isValidAmount && (
                <p className="text-red-400 text-xs mt-1">
                  {parsedAmount <= 0 ? "Enter a valid amount" : "Insufficient balance"}
                </p>
              )}
            </div>

            {/* Destination address */}
            <div className="mb-5">
              <p className="text-sm mb-2" style={{ color: "var(--color-n-muted)" }}>
                To address (MetaMask / exchange deposit)
              </p>
              <input
                type="text"
                placeholder="0x..."
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value.trim())}
                className="w-full rounded-2xl px-4 py-3.5 text-sm font-mono outline-none"
                style={{
                  background: "var(--color-n-card)",
                  border: `1.5px solid ${toAddress && !isValidAddress ? "#EF4444" : "var(--color-n-border)"}`,
                  color: "var(--color-n-text)",
                }}
              />
              {toAddress && !isValidAddress && (
                <p className="text-red-400 text-xs mt-1">Invalid address</p>
              )}
            </div>

            {/* CTA */}
            {txState !== "success" && (
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] disabled:opacity-40"
                style={{
                  background: "var(--color-n-accent)",
                  color: "#000",
                  cursor: !canSend ? "not-allowed" : "pointer",
                }}
              >
                {txState === "sending" ? "Sending…" : `Send ${vault.asset}`}
              </button>
            )}

            {/* Error */}
            {txState === "error" && errorMsg && (
              <div className="mt-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-red-400 text-sm">{errorMsg}</p>
                <button onClick={() => setTxState("idle")} className="text-xs text-red-400/70 underline mt-1">
                  Try again
                </button>
              </div>
            )}

            {/* Success */}
            {txState === "success" && (
              <div className="rounded-xl px-4 py-4"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <p className="text-emerald-400 font-bold mb-1">Sent successfully</p>
                <p className="text-xs mb-3" style={{ color: "var(--color-n-muted)" }}>
                  {amount} {vault.asset} sent to {toAddress.slice(0, 6)}…{toAddress.slice(-4)}
                </p>
                {txHash && (
                  <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-n-accent)" }}
                  >
                    View on BaseScan →
                  </a>
                )}
              </div>
            )}

            <p className="text-xs text-center mt-4" style={{ color: "var(--color-n-muted)" }}>
              Only send on Base network. Transactions are irreversible.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
