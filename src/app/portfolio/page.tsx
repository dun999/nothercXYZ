"use client";

import { useAccount } from "wagmi";
import { Portfolio } from "@/components/Portfolio";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { ThemeSlide } from "@/components/ThemeSlide";
import { shortenAddress } from "@/lib/format";

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
    </div>
  );
}
