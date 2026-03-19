"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "Earn",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "var(--color-n-accent)" : "var(--color-n-muted)"}
        strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "var(--color-n-accent)" : "var(--color-n-muted)"}
        strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 pb-safe"
      style={{
        background: "var(--color-n-nav-bg)",
        borderTop: "1px solid var(--color-n-border)",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
      }}
    >
      <div className="flex items-stretch max-w-md mx-auto">
        {TABS.map(({ href, label, icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={(e) => {
                if (active) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 min-h-[56px] relative"
            >
              {/* Active indicator bar */}
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
                style={{
                  width: active ? "24px" : "0px",
                  height: "2px",
                  background: "var(--color-n-accent)",
                  opacity: active ? 1 : 0,
                  boxShadow: active ? "0 0 8px var(--color-n-accent)" : "none",
                }}
              />
              <span
                className="transition-all duration-200"
                style={{
                  filter: active ? "drop-shadow(0 0 5px var(--color-n-accent-glow))" : "none",
                }}
              >
                {icon(active)}
              </span>
              <span
                className="text-[10px] font-semibold tracking-wide transition-colors duration-200"
                style={{ color: active ? "var(--color-n-accent)" : "var(--color-n-muted)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
