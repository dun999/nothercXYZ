import type { Metadata } from "next";

export const metadata: Metadata = { title: "SDK Reference" };

const sections = [
  {
    title: "Vault data",
    hooks: [
      {
        name: "useVaults",
        sig: "useVaults() → { vaults: Vault[] }",
        desc: "Returns the full list of available vaults with live 7-day APY data. Re-fetches on a configurable interval.",
        example: `const { vaults } = useVaults();
const bestApy = vaults?.reduce((acc, v) => {
  const apy = parseFloat(v.yield?.["7d"] ?? "0");
  return apy > acc.apy ? { apy, id: v.id } : acc;
}, { apy: 0, id: "" });`,
      },
      {
        name: "useVaultState",
        sig: "useVaultState(vaultId: string) → { tvl, exchangeRate }",
        desc: "Returns TVL and current share/asset exchange rate for a specific vault.",
        example: `const { tvl, exchangeRate } = useVaultState("yoUSD");`,
      },
      {
        name: "useUserPosition",
        sig: "useUserPosition(vaultId: string) → { shares, assetValue }",
        desc: "Returns the connected wallet's share balance and current underlying asset value for a vault.",
        example: `const { shares, assetValue } = useUserPosition("yoUSD");`,
      },
    ],
  },
  {
    title: "Deposit",
    hooks: [
      {
        name: "useTokenBalance",
        sig: "useTokenBalance(tokenAddress: Address) → { balance: bigint }",
        desc: "Returns live ERC-20 balance for the connected wallet. Used to populate the MAX button.",
        example: `const { balance } = useTokenBalance("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");`,
      },
      {
        name: "usePreviewDeposit",
        sig: "usePreviewDeposit(vaultId, amount: bigint) → { shares: bigint }",
        desc: "Simulates the vault's previewDeposit — shows exactly how many shares the user would receive. Called on every keystroke for live preview.",
        example: `const { shares } = usePreviewDeposit("yoUSD", parseUnits(inputValue, 6));`,
      },
      {
        name: "useDeposit",
        sig: "useDeposit(vaultId) → { deposit, status, error }",
        desc: "Executes an ERC-20 approval followed by an ERC-4626 deposit. Exposes step-level status for UX feedback.",
        example: `const { deposit, status } = useDeposit("yoUSD");
// status: "idle" | "approving" | "depositing" | "waiting" | "success" | "error"
await deposit({ amount: parseUnits("100", 6) });`,
      },
    ],
  },
  {
    title: "Withdraw",
    hooks: [
      {
        name: "useShareBalance",
        sig: "useShareBalance(vaultId: string) → { balance: bigint }",
        desc: "Returns the user's current share token balance for a vault. Used for the MAX button on the withdraw sheet.",
        example: `const { balance: shareBalance } = useShareBalance("yoUSD");`,
      },
      {
        name: "usePreviewRedeem",
        sig: "usePreviewRedeem(vaultId, shares: bigint) → { assets: bigint }",
        desc: "Simulates previewRedeem — shows the underlying asset amount the user would receive for a given share amount.",
        example: `const { assets } = usePreviewRedeem("yoUSD", shareAmount);`,
      },
      {
        name: "useRedeem",
        sig: "useRedeem(vaultId) → { redeem, status, error }",
        desc: "Executes a vault redemption. The instant flag controls whether the withdrawal settles on-chain immediately or is queued.",
        example: `const { redeem, status } = useRedeem("yoUSD");
await redeem({ shares: parseUnits("50", 6), instant: true });
// instant: false → queued withdrawal, shown as "Request #X · Available within 24h"`,
      },
    ],
  },
];

export default function SdkPage() {
  return (
    <div>
      <p className="text-xs font-mono mb-5" style={{ color: "var(--color-n-muted)" }}>
        docs / sdk
      </p>

      <h1
        className="text-[2rem] font-black tracking-tight mb-3 leading-tight"
        style={{ color: "var(--color-n-text)" }}
      >
        SDK Reference
      </h1>
      <p className="text-base leading-relaxed mb-4" style={{ color: "var(--color-n-muted)", maxWidth: 560 }}>
        Notherc is built on{" "}
        <code
          className="text-[13px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: "var(--color-n-card)", color: "var(--color-n-text)" }}
        >
          @yo-protocol/react
        </code>
        . All on-chain reads and writes go through the hooks below.
      </p>

      {/* Provider setup */}
      <div
        className="p-5 rounded-xl mb-10"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <p className="text-[11px] uppercase tracking-widest font-bold mb-3" style={{ color: "var(--color-n-muted)" }}>
          Required provider setup
        </p>
        <pre
          className="text-xs leading-relaxed overflow-x-auto"
          style={{ color: "var(--color-n-text)", fontFamily: "'SF Mono', 'Fira Code', monospace" }}
        >
{`<PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={wagmiConfig}>  {/* @privy-io/wagmi */}
      <YieldProvider>
        <App />
      </YieldProvider>
    </WagmiProvider>
  </QueryClientProvider>
</PrivyProvider>`}
        </pre>
        <p className="text-[12px] mt-3" style={{ color: "var(--color-n-muted)" }}>
          Privy's <code className="font-mono" style={{ color: "var(--color-n-text)" }}>@privy-io/wagmi</code> adapter exposes wallet addresses
          as standard <code className="font-mono" style={{ color: "var(--color-n-text)" }}>useAccount()</code> — no special handling needed for YO hooks.
        </p>
      </div>

      {/* Hook sections */}
      {sections.map(({ title, hooks }) => (
        <div key={title} className="mb-12">
          <h2
            className="text-[11px] uppercase tracking-widest font-bold mb-5 pb-3"
            style={{ color: "var(--color-n-muted)", borderBottom: "1px solid var(--color-n-border)" }}
          >
            {title}
          </h2>
          <div className="space-y-6">
            {hooks.map(({ name, sig, desc, example }) => (
              <div
                key={name}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid var(--color-n-border)" }}
              >
                {/* Hook header */}
                <div
                  className="px-5 py-3 flex items-center gap-3"
                  style={{ background: "var(--color-n-surface)", borderBottom: "1px solid var(--color-n-border)" }}
                >
                  <code
                    className="text-sm font-bold font-mono"
                    style={{ color: "var(--color-n-text)" }}
                  >
                    {name}
                  </code>
                </div>
                {/* Signature */}
                <div
                  className="px-5 py-3"
                  style={{ background: "var(--color-n-card)", borderBottom: "1px solid var(--color-n-border)" }}
                >
                  <code className="text-[11px] font-mono" style={{ color: "var(--color-n-muted)" }}>
                    {sig}
                  </code>
                </div>
                {/* Description */}
                <div className="px-5 py-4" style={{ background: "var(--color-n-surface)" }}>
                  <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--color-n-muted)" }}>
                    {desc}
                  </p>
                  <pre
                    className="text-[11px] leading-relaxed p-4 rounded-lg overflow-x-auto"
                    style={{
                      background: "var(--color-n-card)",
                      border: "1px solid var(--color-n-border)",
                      color: "var(--color-n-text)",
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                    }}
                  >
                    {example}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
