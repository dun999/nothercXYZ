"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { authenticated, login, logout } = usePrivy();

  const TABS = [
    { href: "/", label: "Earn" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="relative">
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <button
        onClick={() => setOpen(!open)}
        className="relative z-50 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: "var(--color-n-card)",
          border: "1px solid var(--color-n-border)",
        }}
      >
        {open ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-n-muted)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-n-muted)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 rounded-2xl overflow-hidden animate-fade-in"
          style={{
            background: "var(--color-n-surface)",
            border: "1px solid var(--color-n-border)",
            minWidth: "160px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {TABS.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-sm font-semibold"
                style={{
                  color: active ? "var(--color-n-accent)" : "var(--color-n-text)",
                  borderBottom: "1px solid var(--color-n-border)",
                  background: active ? "var(--color-n-accent-glow)" : "transparent",
                }}
              >
                {label}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-n-accent)" }} />
                )}
              </Link>
            );
          })}

          {authenticated ? (
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm"
              style={{ color: "var(--color-n-muted)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Disconnect wallet
            </button>
          ) : (
            <button
              onClick={() => { login(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold"
              style={{ color: "var(--color-n-accent)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </div>
  );
}
