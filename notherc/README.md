# Notherc — On-Chain Savings App

Notherc is a mobile-first savings app built on [YO Protocol](https://yo.xyz), enabling users to deposit crypto assets into ERC-4626 yield vaults on Base and earn automatically. Email login is powered by [Privy](https://privy.io), making it accessible to non-crypto users without sacrificing full on-chain composability.

Twitter: [@nothercxyz](https://x.com/nothercxyz?s=21)

---

## How YO Protocol SDK is Used

### 1. Provider Setup

The YO SDK requires a wagmi v2 context. Notherc uses `@privy-io/wagmi` as the wagmi provider (a drop-in compatible replacement) so that email-login embedded wallets are automatically available as standard wagmi accounts. `YieldProvider` wraps the entire app inside the wagmi context:

```tsx
// src/components/Providers.tsx
import { YieldProvider } from "@yo-protocol/react";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";

<PrivyProvider ...>
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={wagmiConfig}>
      <YieldProvider>          {/* YO SDK context */}
        {children}
      </YieldProvider>
    </WagmiProvider>
  </QueryClientProvider>
</PrivyProvider>
```

The full provider order is: `PrivyProvider → QueryClientProvider → WagmiProvider → YieldProvider`.

---

### 2. Reading Vault Data

#### `useVaults` — Live APY and vault list

Returns all vaults with live yield data (7d APY, etc.).

```tsx
// src/components/VaultCard.tsx
import { useVaults } from "@yo-protocol/react";

const { vaults: vaultsList } = useVaults();
const vaultStats = vaultsList?.find((v) => v.id.toLowerCase() === vault.id.toLowerCase());
const apy = vaultStats?.yield?.["7d"] ? parseFloat(vaultStats.yield["7d"]) : 0;
```

Used in `VaultCard`, `Portfolio`, `Advisor`, and the home page `BestApy` pill.

#### `useVaultState` — On-chain vault state (TVL, exchange rate)

```tsx
// src/components/VaultCard.tsx
import { useVaultState } from "@yo-protocol/react";

const { vaultState } = useVaultState(vault.id);
const tvl = vaultState ? Number(vaultState.totalAssets) / 10 ** vault.decimals : 0;
```

#### `useUserPosition` — User's shares and underlying asset value

```tsx
// src/components/VaultCard.tsx
import { useUserPosition } from "@yo-protocol/react";

const { position } = useUserPosition(vault.id, address!, { enabled: !!address });
const userShares = position?.shares ?? 0n;
const userAssets = position?.assets ?? 0n;
const hasPosition = userShares > 0n;
```

The Withdraw button is only shown when `hasPosition` is true. The Portfolio page lists all vaults where the user holds a position.

---

### 3. Deposit Flow

The deposit flow lives in `DepositSheet` — a mobile bottom sheet with drag-to-close. Three YO hooks are used:

#### `useTokenBalance` — Check user's token balance before depositing

```tsx
// src/components/DepositSheet.tsx
import { useTokenBalance } from "@yo-protocol/react";

const { balance: tokenBal } = useTokenBalance(vault.assetAddress, address, {
  enabled: !!address && open,
});
```

Displayed as "Balance: X USDC" with a MAX button that fills the input.

#### `usePreviewDeposit` — Simulate shares received before signing

```tsx
import { usePreviewDeposit } from "@yo-protocol/react";

const parsedAmount = parseAmount(amount, vault.decimals); // bigint
const { shares, isLoading: previewLoading } = usePreviewDeposit(vaultId, parsedAmount, {
  enabled: parsedAmount > 0n,
});
// shows: "You will receive ~0.9982 yoUSD"
```

Called live as the user types — gives them confidence in the exact shares they will receive before confirming.

#### `useDeposit` — Execute the deposit transaction

```tsx
import { useDeposit } from "@yo-protocol/react";

const { deposit, step, isLoading, isSuccess, hash, error, reset } = useDeposit({
  vault: vaultId,
  slippageBps: 50,           // 0.5% slippage tolerance
  onConfirmed: () => setAmount(""),
});

// Called on button press:
await deposit({
  token: vault.assetAddress,
  amount: parsedAmount,
  chainId: BASE_CHAIN_ID,
});
```

The `step` field tracks the multi-stage transaction lifecycle (`approving → depositing → waiting → success`), shown as a live status indicator in the UI. If the user is on the wrong network, `useSwitchChain` switches them to Base before proceeding.

---

### 4. Withdrawal (Redeem) Flow

The redeem flow lives in `RedeemSheet`. Three YO hooks are used:

#### `useShareBalance` — Check user's vault share balance

```tsx
// src/components/RedeemSheet.tsx
import { useShareBalance } from "@yo-protocol/react";

const { shares: shareBalance } = useShareBalance(vaultId, address!, {
  enabled: !!address && open,
});
```

Displayed as the MAX shares available to redeem.

#### `usePreviewRedeem` — Simulate underlying assets received

```tsx
import { usePreviewRedeem } from "@yo-protocol/react";

const { assets: previewAssets } = usePreviewRedeem(vaultId, parsedAmount, {
  enabled: parsedAmount > 0n && !insufficientShares,
});
// shows: "You will receive ~100.12 USDC"
```

#### `useRedeem` — Execute the redemption

```tsx
import { useRedeem } from "@yo-protocol/react";

const { redeem, step, isLoading, isSuccess, hash, instant, assetsOrRequestId, error, reset } =
  useRedeem({ vault: vaultId, onConfirmed: () => setAmount("") });

// Called on button press:
await redeem(parsedAmount); // bigint shares
```

The response includes `instant: boolean` — if `true`, the withdrawal was processed immediately and `hash` points to the on-chain transaction. If `false`, the withdrawal is queued and `assetsOrRequestId` contains the request ID (shown as "Withdrawal queued · Request #X · Available within 24h").

---

### 5. Vault IDs and Addresses

Vault constants are defined in `src/lib/constants.ts`. Each vault has an `id` (string used in all YO hooks), an `assetAddress` (ERC-20 token on Base), `decimals`, and display metadata.

```ts
// src/lib/constants.ts
export const VAULTS = [
  {
    id: "yoUSD",
    asset: "USDC",
    assetAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
    decimals: 6,
  },
  {
    id: "yoETH",
    asset: "WETH",
    assetAddress: "0x4200000000000000000000000000000000000006", // WETH on Base
    decimals: 18,
  },
  {
    id: "yoBTC",
    asset: "cbBTC",
    assetAddress: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c", // cbBTC on Base
    decimals: 8,
  },
];
```

The vault `id` (e.g. `"yoUSD"`) is passed directly to all YO hooks: `useVaultState(id)`, `useUserPosition(id, address)`, `useDeposit({ vault: id })`, etc.

---

## Email Login + YO SDK Integration

Users who log in via email OTP (Privy) receive an **embedded wallet** automatically:

```tsx
// src/components/Providers.tsx
embeddedWallets: {
  createOnLogin: "users-without-wallets",
},
```

This embedded wallet becomes a standard `wagmi` account — `useAccount()` returns its address just like any injected wallet. All YO SDK hooks call `useAccount()` internally, so they work seamlessly for email users without any special handling.

**Flow:** Email OTP → Privy creates embedded wallet → wagmi exposes address → YO hooks read balance/position/deposit/redeem as normal.

---

## Tech Stack

| Layer | Library |
|---|---|
| Auth | `@privy-io/react-auth` — email OTP + wallet login |
| Wagmi | `@privy-io/wagmi` — wagmi v2 compatible, exposes embedded wallets |
| YO Protocol | `@yo-protocol/react` — yield vault hooks |
| Network | Base (chain ID 8453) |
| UI Framework | Next.js 15 + Tailwind v4 |
| Theme | Dark / light mode via CSS custom properties + `ThemeProvider` |

---

## Setup

```bash
cd vireon
npm install

# Set your Privy App ID
echo "NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id" > .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — log in with email or a wallet, then deposit into any vault.
