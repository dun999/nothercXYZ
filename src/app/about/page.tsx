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

      {/* Built on YO Protocol */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--color-n-text)" }}>Built on YO Protocol</p>
            <a
              href={YO_PROTOCOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs"
              style={{ color: "var(--color-n-accent)" }}
            >
              yo.xyz ↗
            </a>
          </div>
        </div>

        <div
          className="rounded-xl divide-y text-xs"
          style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
        >
          {[
            { label: "Deposit", hooks: "useDeposit · usePreviewDeposit · useTokenBalance" },
            { label: "Withdraw", hooks: "useRedeem · usePreviewRedeem · useShareBalance" },
            { label: "Vault data", hooks: "useVaultState · useUserPosition · useVaults" },
          ].map(({ label, hooks }) => (
            <div key={label} className="flex items-start justify-between gap-4 px-3.5 py-2.5">
              <span className="font-semibold shrink-0" style={{ color: "var(--color-n-muted)" }}>{label}</span>
              <span className="text-right font-mono leading-relaxed" style={{ color: "var(--color-n-text)", fontSize: 10 }}>{hooks}</span>
            </div>
          ))}
        </div>

        <p className="text-[10px] mt-3" style={{ color: "var(--color-n-muted)" }}>
          ERC-4626 on Base · Chain ID 8453
        </p>
      </div>

      {/* Documentation */}
      <a
        href="https://docs.notherc.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-2xl p-5 mb-6"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--color-n-text)" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--color-n-text)" }}>Documentation</p>
            <p className="text-xs" style={{ color: "var(--color-n-muted)" }}>docs.notherc.xyz</p>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ color: "var(--color-n-muted)", flexShrink: 0 }}>
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>

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
