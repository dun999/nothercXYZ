import type { Metadata } from "next";
import "../globals.css";
import { DocsNav } from "./DocsNav";

export const metadata: Metadata = {
  title: "Notherc Docs",
  description: "Documentation for Notherc — on-chain savings built on YO Protocol.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ background: "var(--color-n-bg)", color: "var(--color-n-text)" }}>
        <div className="min-h-screen flex flex-col">
          <header
            className="sticky top-0 z-50 border-b"
            style={{ background: "var(--color-n-surface)", borderColor: "var(--color-n-border)" }}
          >
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
              <a href="/docs" className="flex items-center gap-2">
                <img src="/logo.svg" alt="Notherc" width={28} height={28} style={{ borderRadius: 8 }} />
                <span className="font-bold text-sm" style={{ color: "var(--color-n-text)" }}>
                  Notherc <span style={{ color: "var(--color-n-muted)" }}>Docs</span>
                </span>
              </a>
              <a
                href="https://notherc.xyz"
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: "var(--color-n-accent)",
                  color: "#000",
                }}
              >
                Open App ↗
              </a>
            </div>
          </header>

          <div className="max-w-5xl mx-auto w-full flex flex-1 px-6 py-8 gap-8">
            <aside className="w-52 shrink-0 hidden md:block">
              <DocsNav />
            </aside>
            <main className="flex-1 min-w-0">
              <article className="prose prose-invert max-w-none">{children}</article>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
