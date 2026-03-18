"use client";

import { HamburgerMenu } from "@/components/HamburgerMenu";
import { ThemeSlide } from "@/components/ThemeSlide";
import { TWITTER_URL } from "@/lib/constants";
import { APP_NAME, YO_PROTOCOL_URL } from "@/lib/config";

export default function AboutPage() {
  return (
    <div className="px-4 pt-safe pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between py-4 mb-4">
        <h1 className="text-2xl font-black" style={{ color: "var(--color-n-text)" }}>About</h1>
        <div className="flex items-center gap-2">
          <ThemeSlide />
          <HamburgerMenu />
        </div>
      </div>

      {/* About Notherc */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.svg" alt={APP_NAME} width={44} height={44} className="shrink-0" style={{ borderRadius: 12 }} />
          <div>
            <div className="font-bold" style={{ color: "var(--color-n-text)" }}>{APP_NAME}</div>
            <div className="text-xs" style={{ color: "var(--color-n-muted)" }}>Mobile-first savings on Base</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-n-muted)" }}>
          Notherc is a mobile-first on-chain savings app built on Base. Connect your wallet,
          deposit USDC, WETH, cbBTC, or EURC, and earn real DeFi yield — automatically,
          non-custodially, with no lock-up period.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--color-n-muted)" }}>
          Powered by YO Protocol's ERC-4626 vaults, every deposit stays fully on-chain
          and under your control. No companies hold your funds. No hidden fees.
          Withdraw any time.
        </p>
      </div>

      {/* Your money, your rules */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <p className="font-bold text-sm mb-4" style={{ color: "var(--color-n-text)" }}>Your money, your rules</p>
        <div
          className="rounded-xl divide-y"
          style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
        >
          {[
            { title: "Non-custodial", body: "Your funds live in on-chain vaults. No company can freeze, move, or access your assets." },
            { title: "Audited contracts", body: "Open-source vaults on Base, fully verifiable on BaseScan at any time." },
            { title: "No lock-up", body: "Withdraw any time, no penalties, no fixed terms. Your money moves when you want." },
          ].map(({ title, body }) => (
            <div key={title} className="px-4 py-3.5">
              <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--color-n-text)" }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-n-muted)" }}>{body}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] mt-3" style={{ color: "var(--color-n-muted)" }}>
          Powered by{" "}
          <a href={YO_PROTOCOL_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-n-accent)" }}>
            YO Protocol ↗
          </a>
        </p>
      </div>

      {/* Follow on X */}
      <div
        className="rounded-2xl p-5 mb-6 flex flex-col items-center text-center gap-4"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>
          Stay up to date with updates, new vaults, and announcements
        </p>
        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm active:scale-[0.97] transition-all"
          style={{
            background: "var(--color-n-accent)",
            color: "var(--color-n-bg)",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.622 5.905-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Follow us on X
        </a>
      </div>
    </div>
  );
}
