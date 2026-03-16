"use client";

import { useState } from "react";
import { useVaults } from "@yo-protocol/react";
import { formatPercent, formatUSD } from "@/lib/format";
import { VAULTS } from "@/lib/constants";
import { VaultIcon } from "./VaultIcon";
import type { VaultId } from "@/lib/constants";

type Step = "goal" | "amount" | "risk" | "result";
type RiskProfile = "low" | "medium" | "high";
type Goal = "stable" | "grow" | "max";

function calcProjection(principal: number, apy: number, years: number): number {
  return principal * Math.pow(1 + apy / 100, years) - principal;
}

const GOAL_OPTIONS: { id: Goal; title: string; sub: string }[] = [
  { id: "stable", title: "Preserve value", sub: "Stable, predictable returns with minimal volatility" },
  { id: "grow", title: "Grow my savings", sub: "Comfortable with some price movement for higher yield" },
  { id: "max", title: "Maximise growth", sub: "Accept higher volatility for maximum upside" },
];

const RISK_OPTIONS: { id: RiskProfile; title: string; sub: string }[] = [
  { id: "low", title: "Low, safety first", sub: "Stablecoin yield, no price exposure" },
  { id: "medium", title: "Medium, balanced", sub: "Some crypto exposure, healthy yield" },
  { id: "high", title: "High, go for it", sub: "Maximum upside, comfortable with swings" },
];

export function Advisor() {
  const [step, setStep] = useState<Step>("goal");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [amount, setAmount] = useState("");
  const [risk, setRisk] = useState<RiskProfile | null>(null);

  const { vaults: vaultsList } = useVaults();

  function getApy(vaultId: string): number {
    const v = vaultsList?.find((v: { id: string }) => v.id.toLowerCase() === vaultId.toLowerCase());
    return v?.yield?.["7d"] ? parseFloat(v.yield["7d"]) : 0;
  }

  function getRecommendation(): { vaultId: VaultId; reason: string } {
    if (goal === "stable" || risk === "low") return {
      vaultId: "yoUSD",
      reason: "yoUSD is the lowest-risk option, stablecoin with no price volatility and steady on-chain yield.",
    };
    if (goal === "max" || risk === "high") return {
      vaultId: "yoBTC",
      reason: "yoBTC gives you Bitcoin price exposure with additional yield on top, suited for long-term conviction holders.",
    };
    return {
      vaultId: "yoETH",
      reason: "yoETH balances Ethereum growth potential with yield, a strong choice for medium-term savers.",
    };
  }

  const principal = parseFloat(amount.replace(/,/g, "")) || 0;

  function reset() {
    setStep("goal");
    setGoal(null);
    setAmount("");
    setRisk(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "var(--color-n-text)" }}>
          Savings Advisor
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-n-muted)" }}>
          Answer 3 quick questions for a personalised recommendation.
        </p>
      </div>

      {/* Progress bar */}
      {step !== "result" && (
        <div className="flex gap-2 mb-6">
          {(["goal", "amount", "risk"] as Step[]).map((s) => {
            const steps: Step[] = ["goal", "amount", "risk"];
            const isActive = steps.indexOf(s) <= steps.indexOf(step);
            return (
              <div
                key={s}
                className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{ background: isActive ? "var(--color-n-accent)" : "var(--color-n-border)" }}
              />
            );
          })}
        </div>
      )}

      {/* Step 1 — Goal */}
      {step === "goal" && (
        <div>
          <p className="text-lg font-bold mb-4" style={{ color: "var(--color-n-text)" }}>
            What is your savings goal?
          </p>
          <div className="space-y-3">
            {GOAL_OPTIONS.map(({ id, title, sub }) => (
              <button
                key={id}
                onClick={() => { setGoal(id); setStep("amount"); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-[0.98]"
                style={{
                  background: goal === id ? "var(--color-n-accent-glow)" : "var(--color-n-surface)",
                  border: `1.5px solid ${goal === id ? "var(--color-n-accent)" : "var(--color-n-border)"}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
                >
                  <span className="text-xs font-black" style={{ color: "var(--color-n-accent)" }}>
                    {id === "stable" ? "S" : id === "grow" ? "G" : "M"}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--color-n-text)" }}>{title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>{sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Amount */}
      {step === "amount" && (
        <div>
          <p className="text-lg font-bold mb-4" style={{ color: "var(--color-n-text)" }}>
            How much do you want to save?
          </p>
          <div className="relative mb-4">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold"
              style={{ color: "var(--color-n-muted)" }}
            >$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
              className="w-full rounded-2xl pl-9 pr-4 py-4 text-2xl font-bold outline-none"
              style={{
                background: "var(--color-n-surface)",
                border: "1.5px solid var(--color-n-border)",
                color: "var(--color-n-text)",
              }}
            />
          </div>

          <div className="flex gap-2 mb-6">
            {["500", "1000", "5000", "10000"].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: amount === v ? "var(--color-n-accent)" : "var(--color-n-surface)",
                  border: "1px solid var(--color-n-border)",
                  color: amount === v ? "#000" : "var(--color-n-muted)",
                }}
              >
                ${parseInt(v).toLocaleString()}
              </button>
            ))}
          </div>

          <button
            onClick={() => amount && setStep("risk")}
            disabled={!amount}
            className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-40 active:scale-[0.98]"
            style={{ background: "var(--color-n-accent)", color: "#000" }}
          >
            Continue
          </button>
          <button onClick={() => setStep("goal")}
            className="w-full mt-3 py-2 text-sm flex items-center justify-center gap-1.5"
            style={{ color: "var(--color-n-muted)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Back
          </button>
        </div>
      )}

      {/* Step 3 — Risk */}
      {step === "risk" && (
        <div>
          <p className="text-lg font-bold mb-4" style={{ color: "var(--color-n-text)" }}>
            How do you feel about risk?
          </p>
          <div className="space-y-3 mb-6">
            {RISK_OPTIONS.map(({ id, title, sub }) => (
              <button
                key={id}
                onClick={() => setRisk(id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-[0.98]"
                style={{
                  background: risk === id ? "var(--color-n-accent-glow)" : "var(--color-n-surface)",
                  border: `1.5px solid ${risk === id ? "var(--color-n-accent)" : "var(--color-n-border)"}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
                >
                  <span className="text-[10px] font-black" style={{ color: "var(--color-n-accent)" }}>
                    {id.toUpperCase()[0]}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--color-n-text)" }}>{title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>{sub}</div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => risk && setStep("result")}
            disabled={!risk}
            className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-40 active:scale-[0.98]"
            style={{ background: "var(--color-n-accent)", color: "#000" }}
          >
            See my recommendation
          </button>
          <button onClick={() => setStep("amount")}
            className="w-full mt-3 py-2 text-sm flex items-center justify-center gap-1.5"
            style={{ color: "var(--color-n-muted)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Back
          </button>
        </div>
      )}

      {/* Result */}
      {step === "result" && (() => {
        const rec = getRecommendation();
        const vault = VAULTS.find((v) => v.id === rec.vaultId)!;
        const apy = getApy(rec.vaultId);

        return (
          <div>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <VaultIcon id={vault.id} size={56} />
              </div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--color-n-muted)" }}>
                Recommended for you
              </p>
              <h2 className="text-2xl font-black" style={{ color: "var(--color-n-text)" }}>
                {vault.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-3xl font-black" style={{ color: "var(--color-n-accent)" }}>
                  {formatPercent(apy)}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--color-n-muted)" }}>APY</span>
              </div>
            </div>

            {/* Reason */}
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
            >
              <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>{rec.reason}</p>
            </div>

            {/* Projections */}
            {principal > 0 && (
              <div
                className="rounded-2xl p-5 mb-5"
                style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
              >
                <p className="text-xs uppercase tracking-wider mb-4 font-semibold"
                  style={{ color: "var(--color-n-muted)" }}>
                  If you deposit {formatUSD(principal)} today
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { period: "1 month", years: 1 / 12 },
                    { period: "6 months", years: 0.5 },
                    { period: "1 year", years: 1 },
                    { period: "5 years", years: 5 },
                  ].map(({ period, years }) => {
                    const earnings = calcProjection(principal, apy, years);
                    return (
                      <div
                        key={period}
                        className="rounded-xl px-3 py-3"
                        style={{ background: "var(--color-n-card)" }}
                      >
                        <div className="text-[10px] uppercase tracking-wider mb-1"
                          style={{ color: "var(--color-n-muted)" }}>
                          {period}
                        </div>
                        <div className="text-base font-black" style={{ color: "var(--color-n-accent)" }}>
                          +{formatUSD(earnings)}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>
                          Total: {formatUSD(principal + earnings)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] mt-3" style={{ color: "var(--color-n-muted)" }}>
                  Projections assume current APY stays constant. Rates fluctuate with market conditions.
                </p>
              </div>
            )}

            {/* Risk disclosures */}
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--color-n-muted)" }}>
                Before you deposit
              </p>
              <div className="space-y-2">
                {[
                  "Smart contract risk, funds are held by a contract not a company",
                  "APY is variable, rates change based on DeFi market conditions",
                  "YO Protocol vaults are ERC-4626 standard deployed on Base mainnet",
                ].map((note) => (
                  <div key={note} className="flex items-start gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="#d4a84b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4M12 17h.01" />
                    </svg>
                    <p className="text-xs" style={{ color: "var(--color-n-muted)" }}>{note}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full py-3 rounded-2xl font-semibold text-sm border transition-all active:scale-[0.98]"
              style={{
                borderColor: "var(--color-n-border)",
                color: "var(--color-n-text)",
                background: "transparent",
              }}
            >
              Start over
            </button>
          </div>
        );
      })()}
    </div>
  );
}
