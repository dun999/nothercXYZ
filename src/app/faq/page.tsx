"use client";

import { HamburgerMenu } from "@/components/HamburgerMenu";
import { ThemeSlide } from "@/components/ThemeSlide";
import { FAQ } from "@/components/FAQ";

export default function FaqPage() {
  return (
    <div className="px-4 pt-safe pb-safe">
      <div className="flex items-center justify-between py-4 mb-4">
        <h1 className="text-2xl font-black" style={{ color: "var(--color-n-text)" }}>FAQ</h1>
        <div className="flex items-center gap-2">
          <ThemeSlide />
          <HamburgerMenu />
        </div>
      </div>
      <FAQ />
    </div>
  );
}
