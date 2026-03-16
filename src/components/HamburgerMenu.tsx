"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useTheme } from "./ThemeProvider";
import { TWITTER_URL } from "@/lib/constants";

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = usePrivy();
  const { theme, toggle } = useTheme();

  const TABS = [
    { href: "/", label: "Earn" },
    { href: "/portfolio", label: "Portfolio" },
  ];

  return (
    <div className="relative">
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative z-50 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: "var(--color-n-card)",
          border: "1px solid var(--color-n-border)",
        }}
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-n-muted)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-n-muted)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-11 z-50 rounded-2xl overflow-hidden"
          style={{
            background: "var(--color-n-surface)",
            border: "1px solid var(--color-n-border)",
            minWidth: "180px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {TABS.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold"
                style={{
                  color: active ? "var(--color-n-accent)" : "var(--color-n-text)",
                  borderBottom: "1px solid var(--color-n-border)",
                  background: active ? "var(--color-n-accent-glow)" : "transparent",
                }}
              >
                {label}
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--color-n-accent)" }}
                  />
                )}
              </Link>
            );
          })}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm"
            style={{
              color: "var(--color-n-muted)",
              borderBottom: "1px solid var(--color-n-border)",
            }}
          >
            {theme === "dark" ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
                Light mode
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                Dark mode
              </>
            )}
          </button>

          {/* X / Twitter */}
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3.5 text-sm"
            style={{
              color: "var(--color-n-muted)",
              borderBottom: "1px solid var(--color-n-border)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.622 5.905-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @nothercxyz
          </a>

          {/* Sign out */}
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm"
            style={{ color: "var(--color-n-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
