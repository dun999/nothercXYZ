"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { YieldProvider } from "@yo-protocol/react";
import { base } from "viem/chains";
import { http } from "wagmi";
import { ThemeProvider } from "./ThemeProvider";

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 2 },
  },
});

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

export function Providers({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          loginMethods: ["wallet"],
          appearance: {
            theme: "dark",
            accentColor: "#c8b485",
            walletList: [
              "detected_ethereum_wallets",
              "metamask",
              "coinbase_wallet",
              "rainbow",
              "zerion",
              "uniswap",
              "okx_wallet",
              "bybit_wallet",
              "binance",
              "safe",
              "base_account",
              "wallet_connect_qr",
            ],
            walletChainType: "ethereum-only",
          },
          defaultChain: base,
          supportedChains: [base],
        }}
      >
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <YieldProvider>{children}</YieldProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </ThemeProvider>
  );
}
