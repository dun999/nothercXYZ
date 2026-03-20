const vaults = [
  {
    id: "yoUSD",
    asset: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    description: "USD-pegged stablecoin vault. Lowest volatility, stable yield.",
    href: "/docs/vaults/usdc",
  },
  {
    id: "yoETH",
    asset: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    description: "Wrapped Ether vault. Earn ETH-denominated yield.",
    href: "/docs/vaults/eth",
  },
  {
    id: "yoBTC",
    asset: "cbBTC",
    address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    description: "Coinbase Bitcoin vault. BTC-denominated yield on Base.",
    href: "/docs/vaults/btc",
  },
  {
    id: "yoEUR",
    asset: "EURC",
    address: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
    description: "Euro stablecoin vault. EUR-denominated savings.",
    href: "/docs/vaults/eur",
  },
];

export default function VaultsPage() {
  return (
    <div>
      <h1 className="text-3xl font-black mb-2" style={{ color: "var(--color-n-text)" }}>
        Vaults
      </h1>
      <p className="text-base mb-8" style={{ color: "var(--color-n-muted)" }}>
        All vaults are ERC-4626 compliant and deployed on Base. APY is variable
        and updated every 7 days.
      </p>

      <div className="space-y-4 not-prose">
        {vaults.map(({ id, asset, address, description, href }) => (
          <a
            key={id}
            href={href}
            className="block p-5 rounded-2xl transition-colors"
            style={{
              background: "var(--color-n-surface)",
              border: "1px solid var(--color-n-border)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-base" style={{ color: "var(--color-n-text)" }}>
                    {id}
                  </span>
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: "var(--color-n-card)",
                      border: "1px solid var(--color-n-border)",
                      color: "var(--color-n-muted)",
                    }}
                  >
                    {asset}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--color-n-muted)" }}>
                  {description}
                </p>
                <p
                  className="text-[11px] font-mono mt-2"
                  style={{ color: "var(--color-n-muted)" }}
                >
                  {address}
                </p>
              </div>
              <span style={{ color: "var(--color-n-muted)" }}>→</span>
            </div>
          </a>
        ))}
      </div>

      <div
        className="mt-8 p-5 rounded-2xl not-prose"
        style={{
          background: "var(--color-n-surface)",
          border: "1px solid var(--color-n-border)",
        }}
      >
        <h2 className="font-bold text-base mb-2" style={{ color: "var(--color-n-text)" }}>
          ERC-4626 Standard
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-n-muted)" }}>
          All vaults follow the ERC-4626 Tokenized Vault Standard. When you
          deposit, you receive vault shares that represent your proportional
          ownership. As the vault accrues yield, the exchange rate between
          shares and underlying assets increases.
        </p>
      </div>
    </div>
  );
}
