"use client";

import { useState } from "react";
import { STORAGE_KEY_RISK_ACCEPTED, MODAL_BACKDROP, MODAL_SHADOW } from "@/lib/config";

export function hasAcceptedRisk(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY_RISK_ACCEPTED) === "1";
}

interface Props {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
}

const RISKS = [
  {
    title: "Smart contract risk",
    body: "Funds are held in audited on-chain vaults. No custodian, but contracts carry inherent risk",
  },
  {
    title: "Variable yield",
    body: "APY reflects recent performance and is not guaranteed. Rates change with market conditions",
  },
  {
    title: "Withdrawal queue",
    body: "Some vaults may take up to 24 hours to process redemptions rather than settling instantly",
  },
];

export function RiskDisclosureModal({ open, onAccept, onClose }: Props) {
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY_RISK_ACCEPTED, "1");
    onAccept();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 sheet-backdrop animate-fade-in"
        style={{ background: MODAL_BACKDROP }}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
        <div
          className="w-full max-w-sm rounded-3xl pointer-events-auto animate-modal"
          style={{
            background: "var(--color-n-surface)",
            border: "1px solid var(--color-n-border)",
            boxShadow: MODAL_SHADOW,
          }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-n-text)" }}>
                  Before you deposit
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "var(--color-n-muted)" }}>
                  A few things to be aware of
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-3"
                style={{ background: "var(--color-n-card)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="var(--color-n-muted)" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Risk items */}
            <div
              className="rounded-2xl divide-y mb-5"
              style={{
                background: "var(--color-n-card)",
                border: "1px solid var(--color-n-border)",
                borderColor: "var(--color-n-border)",
              }}
            >
              {RISKS.map(({ title, body }) => (
                <div key={title} className="px-4 py-3.5">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-n-text)" }}>
                    {title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-n-muted)" }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>

            {/* Checkbox */}
            <label
              className="flex items-start gap-3 mb-4 cursor-pointer select-none"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-4.5 h-4.5 rounded flex items-center justify-center transition-colors"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    background: checked ? "var(--color-n-accent)" : "var(--color-n-bg)",
                    border: `1.5px solid ${checked ? "var(--color-n-accent)" : "var(--color-n-border)"}`,
                  }}
                >
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="var(--color-n-on-accent)" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm" style={{ color: "var(--color-n-muted)" }}>
                I understand these risks
              </span>
            </label>

            <button
              onClick={handleAccept}
              disabled={!checked}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-40"
              style={{
                background: "var(--color-n-accent)",
                color: "var(--color-n-on-accent)",
                cursor: checked ? "pointer" : "not-allowed",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
