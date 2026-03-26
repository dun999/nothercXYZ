import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AppShell } from "@/components/AppShell";
import { Metadata } from 'next';


export default function Home()

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  other: {
    'base:app_id': '69c576f886d9e93182f6ffd3',
  }, 
  title: "Notherc, on-chain savings",
  description:
    "Earn yield on USDC, ETH, BTC and EUR. Non-custodial, no lock-up. Deposit and earn on Base.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Notherc",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#030303",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host") ?? "";
  const isDocs = host.startsWith("docs.");

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {isDocs ? (
          children
        ) : (
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        )}
      </body>
    </html>
  );
}
