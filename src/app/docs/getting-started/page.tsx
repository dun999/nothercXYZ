export default function GettingStartedPage() {
  return (
    <div>
      <h1 className="text-3xl font-black mb-2" style={{ color: "var(--color-n-text)" }}>
        Getting Started
      </h1>
      <p className="text-base mb-8" style={{ color: "var(--color-n-muted)" }}>
        Start earning yield on your crypto in a few simple steps.
      </p>

      <div className="space-y-8 not-prose">
        {[
          {
            step: "1",
            title: "Connect your wallet",
            desc: "Open the Notherc app and connect via Privy. You can use an email, social login, or any Ethereum wallet. A Base-compatible wallet is created for you automatically if needed.",
          },
          {
            step: "2",
            title: "Choose a vault",
            desc: "Pick one of the four vaults: yoUSD (USDC), yoETH (WETH), yoBTC (cbBTC), or yoEUR (EURC). Each vault shows a live 7-day APY.",
          },
          {
            step: "3",
            title: "Deposit",
            desc: "Enter the amount you want to deposit. The app will show a preview of the shares you'll receive. Confirm the two transactions: token approval and deposit.",
          },
          {
            step: "4",
            title: "Earn automatically",
            desc: "Your position accrues yield every block. Check your portfolio at any time to see the current value of your position.",
          },
          {
            step: "5",
            title: "Withdraw any time",
            desc: "Go to your portfolio, tap Withdraw on any vault, and redeem your shares. Instant withdrawals are settled on-chain. Some assets may queue (available within 24h).",
          },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex gap-4">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 mt-0.5"
              style={{
                background: "var(--color-n-card)",
                color: "var(--color-n-accent)",
                border: "1px solid var(--color-n-border)",
              }}
            >
              {step}
            </div>
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: "var(--color-n-text)" }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-n-muted)" }}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-10 p-5 rounded-2xl not-prose"
        style={{
          background: "var(--color-n-accent-glow)",
          border: "1px solid var(--color-n-accent)",
        }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--color-n-accent)" }}>
          Network: Base (Chain ID 8453)
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--color-n-muted)" }}>
          Make sure your wallet is connected to the Base network before depositing.
        </p>
      </div>
    </div>
  );
}
