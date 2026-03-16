"use client";

import { useAccount } from "wagmi";
import { Portfolio } from "@/components/Portfolio";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { ThemeSlide } from "@/components/ThemeSlide";
import { shortenAddress } from "@/lib/format";
import Link from "next/link";

function EmptyState() {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ background: "var(--color-n-surface)", border: "1px solid var(--color-n-border)" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "var(--color-n-card)", border: "1px solid var(--color-n-border)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-n-muted)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      </div>
      <p className="text-lg font-bold mb-1" style={{ color: "var(--color-n-text)" }}>
        No deposits yet
      </p>
      <p className="text-sm mb-5" style={{ color: "var(--color-n-muted)" }}>
        Start earning by depositing into a vault.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 rounded-xl font-bold text-sm"
        style={{ background: "var(--color-n-accent)", color: "var(--color-n-bg)" }}
      >
        Explore vaults
      </Link>
    </div>
  );
}

export default function PortfolioPage() {
  const { address } = useAccount();

  return (
    <div className="px-4 pt-safe pb-safe">
      <div className="flex items-center justify-between py-4 mb-2">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--color-n-text)" }}>Portfolio</h1>
          {address && (
            <p className="text-xs mt-0.5" style={{ color: "var(--color-n-muted)" }}>
              {shortenAddress(address)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeSlide />
          <HamburgerMenu />
        </div>
      </div>

      <Portfolio />
      {!address && <EmptyState />}
    </div>
  );
}
