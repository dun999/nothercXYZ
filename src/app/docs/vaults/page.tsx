import type { Metadata } from "next";

export const metadata: Metadata = { title: "Vaults" };

const vaults = [
  {
    id: "yoUSD",
    asset: "USDC",
    token: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    desc: "USD-pegged stablecoin. Lowest volatility, stable yield denominated in USDC.",
    href: "/vaults/usdc",
    tag: "Stablecoin",
  },
  {
    id: "yoETH",
    asset: "WETH",
    token: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    desc: "ETH-denominated yield. Your position grows in ETH terms.",
    href: "/vaults/eth",
    tag: "ETH",
  },
  {
    id: "yoBTC",
    asset: "cbBTC",
    token: "Coinbase BTC",
    address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    decimals: 8,
    desc: "Bitcoin-denominated vault using Coinbase's cbBTC on Base.",
    href: "/vaults/btc",
    tag: "BTC",
  },
  {
    id: "yoEUR",
    asset: "EURC",
    token: "Euro Coin",
    address: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
    decimals: 6,
    desc: "Euro stablecoin vault. Earn EUR-denominated yield on Base.",
    href: "/vaults/eur",
    tag: "Stablecoin",
  },
];

export default function VaultsPage() {
  return (
    <div>
      <p className="text-xs font-mono mb-5" style={{ color: "var(--color-n-muted)" }}>
        docs / vaults
      </p>

      <h1
        className="text-[2rem] font-black tracking-tight mb-3 leading-tight"
        style={{ color: "var(--color-n-text)" }}
      >
        Vaults
      </h1>
      <p className="text-base leading-relaxed mb-10" style={{ color: "var(--color-n-muted)", maxWidth: 560 }}>
        All vaults are ERC-4626 Tokenized Vaults deployed on Base. Each vault
        accepts a specific underlying token and issues shares representing
        proportional ownership of the pool.
      </p>

      {/* Vault cards */}
      <div className="space-y-3 mb-12">
        {vaults.map(({ id, asset, token, address, decimals, desc, href, tag }) => (
          <a
            key={id}
            href={href}
            className="group flex items-start gap-5 p-5 rounded-xl transition-colors"
            style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
          >
            {/* Vault label */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-[10px] font-black font-mono shrink-0"
              style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)", color: "var(--color-n-text)" }}
            >
              {asset}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-sm" style={{ color: "var(--color-n-text)" }}>
                  {id}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                  style={{ background: "var(--color-n-card)", color: "var(--color-n-muted)" }}
                >
                  {tag}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                  style={{ background: "var(--color-n-card)", color: "var(--color-n-muted)" }}
                >
                  {decimals} decimals
                </span>
              </div>
              <p className="text-[13px] mb-2" style={{ color: "var(--color-n-muted)" }}>{desc}</p>
              <p
                className="text-[11px] font-mono break-all"
                style={{ color: "var(--color-n-muted)" }}
              >
                {address}
              </p>
            </div>

            <svg
              className="shrink-0 mt-1"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              style={{ color: "var(--color-n-muted)" }}
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        ))}
      </div>

      {/* ERC-4626 explainer */}
      <div
        className="p-5 rounded-xl mb-6"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <h2 className="font-semibold text-sm mb-3" style={{ color: "var(--color-n-text)" }}>
          How ERC-4626 works
        </h2>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--color-n-muted)" }}>
          When you deposit <code className="font-mono text-[12px] px-1 rounded" style={{ background: "var(--color-n-card)" }}>X</code> underlying tokens,
          you receive <code className="font-mono text-[12px] px-1 rounded" style={{ background: "var(--color-n-card)" }}>Y</code> shares where
          the exchange rate <code className="font-mono text-[12px] px-1 rounded" style={{ background: "var(--color-n-card)" }}>Y/X</code> rises over time as
          the vault accrues yield. Redeeming shares returns underlying assets at the current rate.
        </p>
        <pre
          className="text-[11px] leading-relaxed p-4 rounded-lg overflow-x-auto"
          style={{ background: "var(--color-n-card)", color: "var(--color-n-text)", fontFamily: "'SF Mono', monospace" }}
        >
{`// Simplified ERC-4626 interface
function deposit(uint256 assets, address receiver) → uint256 shares
function redeem(uint256 shares, address receiver, address owner) → uint256 assets
function previewDeposit(uint256 assets) → uint256 shares
function previewRedeem(uint256 shares) → uint256 assets
function convertToAssets(uint256 shares) → uint256   // ← current exchange rate`}
        </pre>
      </div>

      <div
        className="p-4 rounded-xl flex gap-3 text-[13px]"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <span style={{ color: "var(--color-n-muted)" }}>ℹ</span>
        <p style={{ color: "var(--color-n-muted)" }}>
          APY is displayed as a 7-day trailing average. Actual yield is variable and depends on
          YO Protocol liquidity dynamics. There is no guaranteed minimum APY.
        </p>
      </div>
    </div>
  );
}
