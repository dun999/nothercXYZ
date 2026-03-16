"use client";

import { useState } from "react";

interface FAQItem {
  q: string;
  a: React.ReactNode;
}

const ITEMS: FAQItem[] = [
  {
    q: "Is it safe and transparent?",
    a: (
      <div className="space-y-3 text-sm" style={{ color: "var(--color-n-muted)" }}>
        <p>
          Yes. Notherc is fully non-custodial, your funds are held exclusively by audited
          ERC-4626 smart contracts deployed on Base, not by Notherc or any intermediary.
          No company can freeze, move, or access your assets.
        </p>
        <p>
          Every deposit and withdrawal is an on-chain transaction publicly verifiable on{" "}
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-n-accent)", textDecoration: "underline" }}
          >
            BaseScan
          </a>
          . The vault contract addresses are displayed on every position card so you can
          independently verify at any time.
        </p>
        <p>
          YO Protocol, the underlying yield infrastructure, is built on the ERC-4626
          standard, the widely-adopted open-source vault interface for on-chain yield.
        </p>
      </div>
    ),
  },
  {
    q: "Are users clearly informed about what happens on-chain?",
    a: (
      <div className="space-y-3 text-sm" style={{ color: "var(--color-n-muted)" }}>
        <p>
          Before every transaction, Notherc shows a preview panel with the exact outcome:
          token amount, shares to receive, estimated yearly earnings, slippage tolerance,
          and the network (Base). No transaction is signed without your explicit approval.
        </p>
        <p>
          On withdrawal, you see exactly how many underlying tokens you will receive back,
          and whether the redemption is instant or queued. If a redemption is queued,
          the request ID and expected availability window are shown.
        </p>
        <p>
          Every confirmed transaction links directly to its BaseScan receipt. Key risks
          like variable APY, smart contract risk, and market volatility are summarised
          in the FAQ below before you deposit.
        </p>
      </div>
    ),
  },
  {
    q: "Who controls the smart contracts?",
    a: (
      <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>
        The vault contracts are deployed and managed by YO Protocol. Notherc is a front-end
        interface only, it reads on-chain state and submits signed transactions to the
        public blockchain. Notherc has zero administrative access to the contracts and
        cannot alter balances, pause withdrawals or change fee parameters.
      </p>
    ),
  },
  {
    q: "What are the risks?",
    a: (
      <div className="space-y-2 text-sm" style={{ color: "var(--color-n-muted)" }}>
        <p>All yield-bearing products carry risk. Key risks include:</p>
        <ul className="space-y-1 pl-4">
          <li>
            <span style={{ color: "var(--color-n-text)" }}>Smart contract risk,</span>{" "}
            bugs in contract code, however unlikely with audited ERC-4626 vaults.
          </li>
          <li>
            <span style={{ color: "var(--color-n-text)" }}>Variable APY,</span>{" "}
            yield rates change based on DeFi market conditions and cannot be guaranteed.
          </li>
          <li>
            <span style={{ color: "var(--color-n-text)" }}>Asset price risk,</span>{" "}
            ETH and BTC vaults are subject to market price movements.
          </li>
        </ul>
        <p>USDC (yoUSD) carries the lowest risk, stablecoin with no price exposure.</p>
      </div>
    ),
  },
  {
    q: "Can I withdraw at any time?",
    a: (
      <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>
        Yes, with no lock-up period. Most withdrawals are instant. In high-demand periods,
        a small number may be queued and processed within 24 hours by the YO Protocol vault.
        You will always be informed which type of withdrawal applies before you confirm.
      </p>
    ),
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4" style={{ color: "var(--color-n-text)" }}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: "var(--color-n-surface)",
                border: `1px solid ${isOpen ? "var(--color-n-accent)" : "var(--color-n-border)"}`,
              }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="text-sm font-semibold pr-4" style={{ color: "var(--color-n-text)" }}>
                  {item.q}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-n-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    flexShrink: 0,
                    transition: "transform 0.2s ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  <div
                    className="pt-3"
                    style={{ borderTop: "1px solid var(--color-n-border)" }}
                  >
                    {item.a}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
