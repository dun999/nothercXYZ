"use client";

/**
 * Provider stack:
 *   ThemeProvider           ← dark / light mode
 *     PrivyProvider         ← email + wallet auth (Privy SDK)
 *       QueryClientProvider ← react-query
 *         WagmiProvider     ← @privy-io/wagmi (wagmi v2 compatible)
 *           YieldProvider   ← @yo-protocol/react — yield vault hooks
 */

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

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "clpispdty00ycl80fpueukbhl";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          // Email OTP + injected wallets only (no WalletConnect modal)
          loginMethods: ["email", "wallet"],
          appearance: {
            theme: "dark",
            accentColor: "#c8b485",
            showWalletLoginFirst: false,
          },
          embeddedWallets: {
            // Auto-create embedded wallet for email users — powers YO SDK hooks
            createOnLogin: "users-without-wallets",
            requireUserPasswordOnCreate: false,
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
