import type { Metadata } from "next";
import { DocsSidebar } from "./DocsSidebar";
import { DocsHeader } from "./DocsHeader";

export const metadata: Metadata = {
  title: { default: "Notherc Docs", template: "%s — Notherc Docs" },
  description: "Technical documentation for Notherc — on-chain savings on Base powered by YO Protocol.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-n-bg)", color: "var(--color-n-text)" }}
    >
      <DocsHeader />

      <div className="max-w-[1180px] mx-auto flex">
        {/* Sidebar */}
        <aside
          className="hidden lg:block w-60 shrink-0 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4"
          style={{ borderRight: "1px solid var(--color-n-border)" }}
        >
          <DocsSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-6 lg:px-12 py-10 max-w-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}
