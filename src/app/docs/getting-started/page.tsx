import type { Metadata } from "next";

export const metadata: Metadata = { title: "Getting Started" };

const steps = [
  {
    n: "01",
    title: "Connect your wallet",
    body: "Open notherc.xyz and tap Connect. Notherc uses Privy for auth — sign in with email, Google, X, or bring your own EOA. If you don't have a wallet, Privy creates an embedded Base wallet automatically.",
    code: null,
    callout: null,
  },
  {
    n: "02",
    title: "Bridge or fund your wallet on Base",
    body: "You need tokens on the Base network (Chain ID 8453). Bridge from Ethereum via the official Base bridge, or buy directly on Base through Coinbase.",
    code: null,
    callout: {
      type: "info",
      text: "Supported assets: USDC, WETH, cbBTC, EURC. Gas fees on Base are typically < $0.01.",
    },
  },
  {
    n: "03",
    title: "Choose a vault",
    body: "From the home screen, pick one of the four vaults. Each card shows the live 7-day APY. Tap a card to open the deposit sheet.",
    code: null,
    callout: null,
  },
  {
    n: "04",
    title: "Deposit",
    body: "Enter an amount (tap MAX to use your full balance). The preview shows the exact vault shares you'll receive. Confirm — this triggers two transactions: an ERC-20 approval, then the deposit call to the vault.",
    code: `// Under the hood — useDeposit hook
const { deposit, status } = useDeposit(vaultId);
// status: "idle" | "approving" | "depositing" | "waiting" | "success"
await deposit({ amount: parseUnits("100", 6) });`,
    callout: null,
  },
  {
    n: "05",
    title: "Track your position",
    body: "Go to the Portfolio tab. You'll see your share balance and the current asset value in real-time. As the vault accrues yield the exchange rate rises, so your shares become worth more.",
    code: null,
    callout: null,
  },
  {
    n: "06",
    title: "Withdraw any time",
    body: "Tap Withdraw on any position. Enter a share amount (or tap MAX), preview the assets you'll receive, and confirm. Most vaults settle instantly on-chain. Some assets queue and are available within 24 hours.",
    code: `// useRedeem hook — instant flag
const { redeem } = useRedeem(vaultId);
await redeem({ shares: shareAmount, instant: true });`,
    callout: {
      type: "warn",
      text: "If instant: false, a withdrawal request is queued. You'll see \"Request #X · Available within 24h\" in your portfolio.",
    },
  },
];

export default function GettingStartedPage() {
  return (
    <div>
      <p className="text-xs font-mono mb-5" style={{ color: "var(--color-n-muted)" }}>
        docs / getting-started
      </p>

      <h1
        className="text-[2rem] font-black tracking-tight mb-3 leading-tight"
        style={{ color: "var(--color-n-text)" }}
      >
        Getting Started
      </h1>
      <p className="text-base leading-relaxed mb-10" style={{ color: "var(--color-n-muted)", maxWidth: 560 }}>
        From zero to earning yield on Base in under five minutes.
      </p>

      <div className="space-y-1 mb-12">
        {steps.map(({ n, title, body, code, callout }) => (
          <div key={n} className="flex gap-6">
            {/* Step number column */}
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black font-mono shrink-0"
                style={{
                  background: "var(--color-n-card)",
                  border: "1px solid var(--color-n-border)",
                  color: "var(--color-n-text)",
                }}
              >
                {n}
              </div>
              <div className="w-px flex-1 mt-2 mb-2" style={{ background: "var(--color-n-border)", minHeight: 24 }} />
            </div>

            {/* Content column */}
            <div className="flex-1 pb-6 min-w-0">
              <h2 className="font-semibold text-base mb-2 mt-1" style={{ color: "var(--color-n-text)" }}>
                {title}
              </h2>
              <p className="text-[13.5px] leading-relaxed mb-3" style={{ color: "var(--color-n-muted)" }}>
                {body}
              </p>

              {code && (
                <pre
                  className="text-xs leading-relaxed p-4 rounded-xl overflow-x-auto mb-3"
                  style={{
                    background: "var(--color-n-card)",
                    border: "1px solid var(--color-n-border)",
                    color: "var(--color-n-text)",
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                  }}
                >
                  {code}
                </pre>
              )}

              {callout && (
                <div
                  className="flex gap-3 p-3.5 rounded-xl text-[13px]"
                  style={{
                    background: callout.type === "warn" ? "rgba(255,200,0,0.05)" : "var(--color-n-surface)",
                    border: `1px solid ${callout.type === "warn" ? "rgba(255,200,0,0.2)" : "var(--color-n-border)"}`,
                  }}
                >
                  <span style={{ color: callout.type === "warn" ? "#FFD600" : "var(--color-n-muted)" }}>
                    {callout.type === "warn" ? "⚠" : "ℹ"}
                  </span>
                  <p style={{ color: "var(--color-n-muted)" }}>{callout.text}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Next step CTA */}
      <div
        className="flex items-center justify-between p-5 rounded-xl"
        style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
      >
        <div>
          <p className="font-semibold text-sm mb-1" style={{ color: "var(--color-n-text)" }}>
            Next: explore the vaults
          </p>
          <p className="text-[13px]" style={{ color: "var(--color-n-muted)" }}>
            Learn about ERC-4626, APY mechanics, and vault addresses.
          </p>
        </div>
        <a
          href="/vaults"
          className="shrink-0 text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)", color: "var(--color-n-text)" }}
        >
          Vaults →
        </a>
      </div>
    </div>
  );
}
