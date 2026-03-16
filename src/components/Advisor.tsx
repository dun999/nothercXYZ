"use client";

import { useState } from "react";
import { useVaults } from "@yo-protocol/react";
import { formatPercent, formatUSD } from "@/lib/format";
import { VAULTS } from "@/lib/constants";
import { VaultIcon } from "./VaultIcon";
import type { VaultId } from "@/lib/constants";

/* ── Types ── */
type Step = "goal" | "amount" | "risk" | "result";
type RiskProfile = "low" | "medium" | "high";
type Goal = "stable" | "grow" | "max";

function calcProjection(principal: number, apy: number, years: number): number {
  return principal * Math.pow(1 + apy / 100, years) - principal;
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

  function getApy(vaultId: string): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = vaultsList?.find((v: any) => v.id.toLowerCase() === vaultId.toLowerCase());
    return v?.yield?.["7d"] ? parseFloat(v.yield["7d"]) : 0;
  }

  function getRecommendation(): { vaultId: VaultId; reason: string } {
    if (goal === "stable" || risk === "low") return {
      vaultId: "yoUSD",
      reason: "yoUSD is backed by USDC — no price exposure, steady on-chain yield.",
    };
    if (goal === "max" || risk === "high") return {
      vaultId: "yoBTC",
      reason: "yoBTC gives Bitcoin exposure plus yield — best for long-term conviction holders.",
    };
    return {
      vaultId: "yoETH",
      reason: "yoETH balances Ethereum growth with yield — a solid choice for medium-term savers.",
    };
  }

  const principal = parseFloat(amount.replace(/,/g, "")) || 0;
  function reset() { setStep("goal"); setGoal(null); setAmount(""); setRisk(null); }

  return (
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
                  color: amount === v ? "#000" : "var(--color-n-muted)",
                }}
              >${parseInt(v).toLocaleString()}</button>
            ))}
          </div>
          <button onClick={() => amount && setStep("risk")} disabled={!amount}
            className="w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-40"
            style={{ background: "var(--color-n-accent)", color: "#000" }}>Continue</button>
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
            style={{ background: "var(--color-n-accent)", color: "#000" }}>See recommendation</button>
          <button onClick={() => setStep("amount")} className="w-full mt-2 py-2 text-xs text-center" style={{ color: "var(--color-n-muted)" }}>← Back</button>
        </div>
      )}

      {/* Result */}
      {step === "result" && (() => {
        const rec = getRecommendation();
        const vault = VAULTS.find((v) => v.id === rec.vaultId)!;
        const apy = getApy(rec.vaultId);
        return (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <VaultIcon id={vault.id} size={40} />
              <div>
                <div className="text-xs uppercase tracking-widest" style={{ color: "var(--color-n-muted)" }}>Recommended</div>
                <div className="font-bold" style={{ color: "var(--color-n-text)" }}>{vault.name}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-black" style={{ color: "var(--color-n-accent)" }}>{formatPercent(apy)}</div>
                <div className="text-[10px]" style={{ color: "var(--color-n-muted)" }}>APY</div>
              </div>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--color-n-muted)" }}>{rec.reason}</p>

            {principal > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[{ period: "1 month", years: 1/12 }, { period: "6 months", years: 0.5 }, { period: "1 year", years: 1 }, { period: "5 years", years: 5 }]
                  .map(({ period, years }) => {
                    const e = calcProjection(principal, apy, years);
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
            <p className="text-[10px] mb-4" style={{ color: "var(--color-n-muted)" }}>Projections assume current APY. Rates are variable.</p>
            <button onClick={reset} className="w-full py-3 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "var(--color-n-border)", color: "var(--color-n-muted)", background: "transparent" }}>
              Start over
            </button>
          </div>
        );
      })()}
    </div>
  );
}

/* ── FAQ ── */
const FAQS = [
  {
    q: "Where does the yield come from?",
    a: "Yield is generated by YO Protocol, which deploys deposited assets into on-chain strategies — primarily lending markets and liquidity pools on Base. All activity is verifiable on-chain.",
  },
  {
    q: "Who holds my funds?",
    a: "No one. Your funds are held by an ERC-4626 smart contract on Base — not by Notherc, not by YO Protocol, not by any company. Only you can redeem your shares.",
  },
  {
    q: "Can I withdraw anytime?",
    a: "Yes. Most withdrawals are instant. In rare high-demand periods, funds may be queued for up to 24 hours. There is no lock-up period.",
  },
  {
    q: "Is the APY fixed?",
    a: "No. APY is variable and changes based on DeFi market conditions. The rate shown is the trailing 7-day average.",
  },
  {
    q: "Are the contracts audited?",
    a: "YO Protocol smart contracts have been audited. Notherc is a front-end interface — it holds no funds and has no admin keys.",
  },
  {
    q: "What is ERC-4626?",
    a: "ERC-4626 is an Ethereum standard for tokenised vaults. It guarantees that deposit, withdrawal, and share accounting follow a public, predictable specification — no custom logic that could hide risks.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--color-n-border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-left gap-4"
      >
        <span className="text-sm font-semibold" style={{ color: "var(--color-n-text)" }}>{q}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-n-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <p className="text-xs pb-4 animate-fade-in" style={{ color: "var(--color-n-muted)", lineHeight: 1.7 }}>{a}</p>
      )}
    </div>
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
          Get a personalised vault recommendation, or read the FAQ.
        </p>
      </div>

      <AdvisorQuiz />

      {/* FAQ */}
      <div>
        <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--color-n-accent)" }}>
          Transparency FAQ
        </p>
        <div
          className="rounded-2xl px-5"
          style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
        >
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
        <p className="text-[10px] mt-3 text-center" style={{ color: "var(--color-n-muted)" }}>
          All vault data is on-chain and verifiable via BaseScan.
        </p>
      </div>
    </div>
  );
}
