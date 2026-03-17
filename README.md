# Notherc

On-chain savings app built on [YO Protocol](https://yo.xyz). Deposit USDC, ETH, BTC, or EUR into ERC-4626 yield vaults on Base — no lock-up, non-custodial.

[@nothercxyz](https://x.com/nothercxyz?s=21)

---

## Stack

| | |
|---|---|
| Auth | Privy — wallet login |
| Chain | Base (8453) |
| Yield | `@yo-protocol/react` |
| UI | Next.js 15 · Tailwind v4 |

---

## YO SDK Integration

Provider order: `PrivyProvider → QueryClientProvider → WagmiProvider → YieldProvider`

Privy's `@privy-io/wagmi` is used as the wagmi adapter — wallet addresses are exposed as standard `useAccount()`, no special handling needed for YO hooks.

**Deposit** (`src/components/DepositSheet.tsx`)
- `useTokenBalance` — live balance check, powers the MAX button
- `usePreviewDeposit` — simulates shares received as user types
- `useDeposit` — executes approval + deposit, tracks steps: `approving → depositing → waiting → success`

**Withdraw** (`src/components/RedeemSheet.tsx`)
- `useShareBalance` — share balance for MAX button
- `usePreviewRedeem` — simulates underlying assets received
- `useRedeem` — executes redemption; `instant: boolean` determines if settled on-chain or queued (shown as "Request #X · Available within 24h")

**Vault data** (`src/components/VaultCard.tsx`, `Portfolio.tsx`)
- `useVaults` — live 7d APY
- `useVaultState` — TVL, exchange rate
- `useUserPosition` — user shares + asset value

**Vaults** (`src/lib/constants.ts`)

| id | asset | address |
|---|---|---|
| `yoUSD` | USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| `yoETH` | WETH | `0x4200000000000000000000000000000000000006` |
| `yoBTC` | cbBTC | `0x0555E30da8f98308EdB960aa94C0Db47230d2B9c` |
| `yoEUR` | EURC | `0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42` |

---

## Setup

```bash
npm install
echo "NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id" > .env.local
npm run dev
```
