"use client";

import { useState } from "react";
import { DocsSidebar } from "./DocsSidebar";

export function DocsHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 h-14 flex items-center"
        style={{
          background: "rgba(3,3,3,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-n-border)",
        }}
      >
        <div className="max-w-[1180px] mx-auto w-full px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.svg" alt="Notherc" width={26} height={26} style={{ borderRadius: 7 }} />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm" style={{ color: "var(--color-n-text)" }}>Notherc</span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--color-n-card)",
                  border: "1px solid var(--color-n-border)",
                  color: "var(--color-n-muted)",
                }}
              >
                docs
              </span>
            </div>
          </a>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "/getting-started", label: "Getting Started" },
              { href: "/vaults", label: "Vaults" },
              { href: "/sdk", label: "SDK Reference" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--color-n-muted)" }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://notherc.xyz"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "var(--color-n-surface)",
                border: "1px solid var(--color-n-border)",
                color: "var(--color-n-text)",
              }}
            >
              Launch App
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-1.5 rounded-lg"
              style={{ color: "var(--color-n-muted)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 pt-14 px-6 py-8 overflow-y-auto"
          style={{ background: "var(--color-n-bg)", borderTop: "1px solid var(--color-n-border)" }}
          onClick={() => setMobileOpen(false)}
        >
          <DocsSidebar />
        </div>
      )}
    </>
  );
}
