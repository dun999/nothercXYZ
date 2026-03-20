const hooks = [
  {
    name: "useVaults",
    pkg: "@yo-protocol/react",
    desc: "Returns live vault list including 7-day APY for each vault.",
    usage: "const { vaults } = useVaults();",
  },
  {
    name: "useVaultState",
    pkg: "@yo-protocol/react",
    desc: "TVL and share exchange rate for a specific vault.",
    usage: "const { tvl, exchangeRate } = useVaultState(vaultId);",
  },
  {
    name: "useUserPosition",
    pkg: "@yo-protocol/react",
    desc: "User's share balance and current asset value for a vault.",
    usage: "const { shares, assetValue } = useUserPosition(vaultId);",
  },
  {
    name: "useTokenBalance",
    pkg: "@yo-protocol/react",
    desc: "Live token balance for the connected wallet. Used for MAX button.",
    usage: "const { balance } = useTokenBalance(tokenAddress);",
  },
  {
    name: "usePreviewDeposit",
    pkg: "@yo-protocol/react",
    desc: "Simulates shares received for a given deposit amount.",
    usage: "const { shares } = usePreviewDeposit(vaultId, amount);",
  },
  {
    name: "useDeposit",
    pkg: "@yo-protocol/react",
    desc: "Executes approval + deposit. Tracks steps: approving → depositing → waiting → success.",
    usage: "const { deposit, status } = useDeposit(vaultId);",
  },
  {
    name: "useShareBalance",
    pkg: "@yo-protocol/react",
    desc: "Share token balance for the connected wallet. Used for MAX button on withdraw.",
    usage: "const { balance } = useShareBalance(vaultId);",
  },
  {
    name: "usePreviewRedeem",
    pkg: "@yo-protocol/react",
    desc: "Simulates underlying assets received for a given share amount.",
    usage: "const { assets } = usePreviewRedeem(vaultId, shares);",
  },
  {
    name: "useRedeem",
    pkg: "@yo-protocol/react",
    desc: "Executes redemption. instant: boolean determines on-chain settlement or queued.",
    usage: "const { redeem, status } = useRedeem(vaultId);",
  },
];

export default function SdkPage() {
  return (
    <div>
      <h1 className="text-3xl font-black mb-2" style={{ color: "var(--color-n-text)" }}>
        YO Protocol SDK
      </h1>
      <p className="text-base mb-2" style={{ color: "var(--color-n-muted)" }}>
        Notherc uses <code style={{ color: "var(--color-n-accent)" }}>@yo-protocol/react</code> for all on-chain interactions.
      </p>
      <p className="text-sm mb-8" style={{ color: "var(--color-n-muted)" }}>
        Provider order:{" "}
        <code style={{ color: "var(--color-n-accent)" }}>
          PrivyProvider → QueryClientProvider → WagmiProvider → YieldProvider
        </code>
      </p>

      <div className="space-y-4 not-prose">
        {hooks.map(({ name, pkg, desc, usage }) => (
          <div
            key={name}
            className="p-5 rounded-2xl"
            style={{
              background: "var(--color-n-surface)",
              border: "1px solid var(--color-n-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono font-bold text-sm" style={{ color: "var(--color-n-accent)" }}>
                {name}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: "var(--color-n-card)",
                  color: "var(--color-n-muted)",
                }}
              >
                {pkg}
              </span>
            </div>
            <p className="text-sm mb-3" style={{ color: "var(--color-n-muted)" }}>
              {desc}
            </p>
            <pre
              className="text-xs p-3 rounded-lg overflow-x-auto"
              style={{
                background: "var(--color-n-card)",
                color: "var(--color-n-text)",
                border: "1px solid var(--color-n-border)",
              }}
            >
              {usage}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
