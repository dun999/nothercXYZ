"use client";

import { useState } from "react";
import { useVaults } from "@yo-protocol/react";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { formatPercent, formatUSD } from "@/lib/format";
import { VAULTS } from "@/lib/constants";
import { VaultIcon } from "./VaultIcon";
import { DepositSheet } from "./DepositSheet";
import { RiskDisclosureModal, hasAcceptedRisk } from "./RiskDisclosureModal";
import type { VaultId } from "@/lib/constants";

/* ── Types ── */
type Step = "goal" | "amount" | "risk" | "result";
type RiskProfile = "low" | "medium" | "high";
type Goal = "stable" | "grow" | "max";

function calcProjection(principal: number, apy: number, years: number): number {
  return principal * Math.pow(1 + apy / 100, years) - principal;
}

function getVaultReason(vaultId: VaultId): string {
  if (vaultId === "yoUSD") return "Backed by USDC — no price exposure, steady on-chain yield";
  if (vaultId === "yoBTC") return "Bitcoin exposure plus yield — best for long-term conviction holders";
  if (vaultId === "yoEUR") return "Euro stablecoin yield — low risk and currency-stable";
  return "Balances Ethereum growth with yield — solid for medium-term savers";
}

/* ── Advisor quiz ── */
const GOAL_OPTIONS: { id: Goal; title: string; sub: string }[] = [
  { id: "stable", title: "Preserve value", sub: "Stable, predictable returns" },
  { id: "grow", title: "Grow my savings", sub: "Balanced yield with some exposure" },
  { id: "max", title: "Maximise growth", sub: "Higher upside, higher volatility" },
];

const RISK_OPTIONS: { id: RiskProfile; title: string; sub: string }[] = [
  { id: "low", title: "Low", sub: "Stablecoin only, no price risk" },
  { id: "medium", title: "Medium", sub: "Mixed crypto + yield" },
  { id: "high", title: "High", sub: "Max upside, comfortable with swings" },
];

function AdvisorQuiz() {
  const [step, setStep] = useState<Step>("goal");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [amount, setAmount] = useState("");
  const [risk, setRisk] = useState<RiskProfile | null>(null);

  const { vaults: vaultsList } = useVaults();
  const { address } = useAccount();
  const { login } = usePrivy();

  const [depositVaultId, setDepositVaultId] = useState<VaultId | null>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [disclosureOpen, setDisclosureOpen] = useState(false);

  function getApy(vaultId: string): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = vaultsList?.find((v: any) => v.id.toLowerCase() === vaultId.toLowerCase());
    return v?.yield?.["7d"] ? parseFloat(v.yield["7d"]) : 0;
  }

  function getRecommendedId(): VaultId {
    if (goal === "stable" || risk === "low") return "yoUSD";
    if (goal === "max" || risk === "high") return "yoBTC";
    return "yoETH";
  }

  function getRankedVaults() {
    return [...VAULTS]
      .map((v) => ({ ...v, apy: getApy(v.id) }))
      .sort((a, b) => b.apy - a.apy);
  }

  function handleDepositClick(vaultId: VaultId) {
    setDepositVaultId(vaultId);
    if (!address) { login(); return; }
    if (hasAcceptedRisk()) {
      setDepositOpen(true);
    } else {
      setDisclosureOpen(true);
    }
  }

  const principal = parseFloat(amount.replace(/,/g, "")) || 0;
  function reset() { setStep("goal"); setGoal(null); setAmount(""); setRisk(null); }

  return (
    <>
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--color-n-accent)" }}>
          Savings Advisor
        </p>

        {/* Progress */}
        {step !== "result" && (
          <div className="flex gap-1.5 mb-5">
            {(["goal", "amount", "risk"] as Step[]).map((s) => {
              const steps: Step[] = ["goal", "amount", "risk"];
              const active = steps.indexOf(s) <= steps.indexOf(step);
              return (
                <div key={s} className="flex-1 h-0.5 rounded-full transition-all duration-300"
                  style={{ background: active ? "var(--color-n-accent)" : "var(--color-n-border)" }} />
              );
            })}
          </div>
        )}

        {/* Step 1 */}
        {step === "goal" && (
          <div className="space-y-2">
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-n-text)" }}>What is your goal?</p>
            {GOAL_OPTIONS.map(({ id, title, sub }) => (
              <button key={id} onClick={() => { setGoal(id); setStep("amount"); }}
                className="w-full flex items-start gap-3 p-3.5 rounded-xl text-left active:scale-[0.98]"
                style={{
                  background: "var(--color-n-card)",
                  border: `1px solid ${goal === id ? "var(--color-n-accent)" : "var(--color-n-border)"}`,
                }}
              >
                <div className="mt-0.5 w-2 h-2 rounded-full shrink-0"
                  style={{ background: goal === id ? "var(--color-n-accent)" : "var(--color-n-border)" }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--color-n-text)" }}>{title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>{sub}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 */}
        {step === "amount" && (
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-n-text)" }}>How much to save?</p>
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold" style={{ color: "var(--color-n-muted)" }}>$</span>
              <input type="text" inputMode="numeric" placeholder="1,000"
                value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                className="w-full rounded-xl pl-9 pr-4 py-3.5 text-xl font-bold outline-none"
                style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)", color: "var(--color-n-text)" }}
              />
            </div>
            <div className="flex gap-2 mb-4">
              {["500", "1000", "5000", "10000"].map((v) => (
                <button key={v} onClick={() => setAmount(v)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold"
                  style={{
                    background: amount === v ? "var(--color-n-accent)" : "var(--color-n-card)",
                    border: "1px solid var(--color-n-border)",
                    color: amount === v ? "var(--color-n-on-accent)" : "var(--color-n-muted)",
                  }}
                >${parseInt(v).toLocaleString()}</button>
              ))}
            </div>
            <button onClick={() => amount && setStep("risk")} disabled={!amount}
              className="w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-40"
              style={{ background: "var(--color-n-accent)", color: "var(--color-n-on-accent)" }}>Continue</button>
            <button onClick={() => setStep("goal")} className="w-full mt-2 py-2 text-xs text-center" style={{ color: "var(--color-n-muted)" }}>← Back</button>
          </div>
        )}

        {/* Step 3 */}
        {step === "risk" && (
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-n-text)" }}>Risk tolerance?</p>
            <div className="space-y-2 mb-4">
              {RISK_OPTIONS.map(({ id, title, sub }) => (
                <button key={id} onClick={() => setRisk(id)}
                  className="w-full flex items-start gap-3 p-3.5 rounded-xl text-left active:scale-[0.98]"
                  style={{
                    background: "var(--color-n-card)",
                    border: `1px solid ${risk === id ? "var(--color-n-accent)" : "var(--color-n-border)"}`,
                  }}
                >
                  <div className="mt-0.5 w-2 h-2 rounded-full shrink-0"
                    style={{ background: risk === id ? "var(--color-n-accent)" : "var(--color-n-border)" }} />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--color-n-text)" }}>{title}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>{sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => risk && setStep("result")} disabled={!risk}
              className="w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-40"
              style={{ background: "var(--color-n-accent)", color: "var(--color-n-on-accent)" }}>See recommendation</button>
            <button onClick={() => setStep("amount")} className="w-full mt-2 py-2 text-xs text-center" style={{ color: "var(--color-n-muted)" }}>← Back</button>
          </div>
        )}

        {/* Result */}
        {step === "result" && (() => {
          const recId = getRecommendedId();
          const recApy = getApy(recId);
          const recConfig = VAULTS.find((v) => v.id === recId)!;
          const rankedVaults = getRankedVaults();

          return (
            <div>
              {/* Recommended vault highlight */}
              <div
                className="rounded-xl p-4 mb-4"
                style={{
                  background: `${recConfig.accent}10`,
                  border: `1px solid ${recConfig.accent}40`,
                }}
              >
                <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: recConfig.accent }}>
                  Best match for you
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <VaultIcon id={recConfig.id} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold" style={{ color: "var(--color-n-text)" }}>{recConfig.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>
                      {getVaultReason(recId)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black" style={{ color: "var(--color-n-accent)" }}>{formatPercent(recApy)}</div>
                    <div className="text-[10px]" style={{ color: "var(--color-n-muted)" }}>APY</div>
                  </div>
                </div>

                {/* Projections */}
                {principal > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[{ period: "1 month", years: 1 / 12 }, { period: "6 months", years: 0.5 }, { period: "1 year", years: 1 }, { period: "5 years", years: 5 }]
                      .map(({ period, years }) => {
                        const e = calcProjection(principal, recApy, years);
                        return (
                          <div key={period} className="rounded-xl px-3 py-2.5" style={{ background: "var(--color-n-card)" }}>
                            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--color-n-muted)" }}>{period}</div>
                            <div className="text-sm font-black" style={{ color: "var(--color-n-accent)" }}>+{formatUSD(e)}</div>
                            <div className="text-[10px]" style={{ color: "var(--color-n-muted)" }}>{formatUSD(principal + e)} total</div>
                          </div>
                        );
                      })}
                  </div>
                )}
                <p className="text-[10px] mb-3" style={{ color: "var(--color-n-muted)" }}>
                  Projections assume current APY · Rates are variable
                </p>

                <button
                  onClick={() => handleDepositClick(recId)}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
                  style={{ background: "var(--color-n-accent)", color: "var(--color-n-on-accent)" }}
                >
                  Deposit to {recConfig.name}
                </button>
              </div>

              {/* All vaults ranked */}
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-n-muted)" }}>
                All vaults by APY
              </p>
              <div className="space-y-2 mb-4">
                {rankedVaults.map((v, i) => {
                  const isRec = v.id === recId;
                  return (
                    <div
                      key={v.id}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{
                        background: "var(--color-n-card)",
                        border: `1px solid ${isRec ? v.accent + "50" : "var(--color-n-border)"}`,
                      }}
                    >
                      <span
                        className="text-sm font-black w-5 shrink-0 text-center"
                        style={{ color: i === 0 ? "var(--color-n-accent)" : "var(--color-n-muted)" }}
                      >
                        #{i + 1}
                      </span>
                      <VaultIcon id={v.id} size={28} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-semibold" style={{ color: "var(--color-n-text)" }}>{v.name}</span>
                          {isRec && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: v.accent + "20", color: v.accent }}
                            >
                              Best for you
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold" style={{ color: "var(--color-n-accent)" }}>
                          {formatPercent(v.apy, 2)} APY
                        </div>
                      </div>
                      <button
                        onClick={() => handleDepositClick(v.id as VaultId)}
                        className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
                        style={{ background: "var(--color-n-accent)", color: "var(--color-n-on-accent)" }}
                      >
                        Deposit
                      </button>
                    </div>
                  );
                })}
              </div>

              <button onClick={reset} className="w-full py-3 rounded-xl text-sm font-semibold border"
                style={{ borderColor: "var(--color-n-border)", color: "var(--color-n-muted)", background: "transparent" }}>
                Start over
              </button>
            </div>
          );
        })()}
      </div>

      {/* Deposit modals (triggered from result) */}
      {depositVaultId && (
        <>
          <RiskDisclosureModal
            open={disclosureOpen}
            onClose={() => setDisclosureOpen(false)}
            onAccept={() => { setDisclosureOpen(false); setDepositOpen(true); }}
          />
          <DepositSheet
            open={depositOpen}
            onClose={() => { setDepositOpen(false); setDepositVaultId(null); }}
            vaultId={depositVaultId}
            apy={getApy(depositVaultId)}
          />
        </>
      )}
    </>
  );
}


export function Advisor() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--color-n-text)" }}>
          Learn & Invest
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-n-muted)" }}>
          Get a personalised vault recommendation
        </p>
      </div>

      <AdvisorQuiz />
    </div>
  );
}
