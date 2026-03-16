"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeSlide() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "relative",
        width: 48,
        height: 26,
        borderRadius: 13,
        background: "var(--color-n-card)",
        border: "1px solid var(--color-n-border)",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {/* Icons track */}
      <span style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 6px",
        pointerEvents: "none",
      }}>
        {/* Moon — left */}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-n-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: isDark ? 0 : 1, transition: "opacity 0.2s" }}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        {/* Sun — right */}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-n-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: isDark ? 1 : 0, transition: "opacity 0.2s" }}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </span>

      {/* Sliding pill */}
      <span style={{
        position: "absolute",
        top: 3,
        left: 3,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "var(--color-n-accent)",
        transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isDark ? "translateX(0px)" : "translateX(22px)",
      }} />
    </button>
  );
}
