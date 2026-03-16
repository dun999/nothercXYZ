"use client";

import { Advisor } from "@/components/Advisor";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { ThemeSlide } from "@/components/ThemeSlide";

export default function AdvisorPage() {
  return (
    <div className="px-4 pt-safe pb-safe">
      <div className="flex items-center justify-between py-4 mb-2">
        <h1 className="text-2xl font-black" style={{ color: "var(--color-n-text)" }}>Advisor</h1>
        <div className="flex items-center gap-2">
          <ThemeSlide />
          <HamburgerMenu />
        </div>
      </div>
      <Advisor />
    </div>
  );
}
