"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEY_THEME } from "@/lib/config";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Read stored preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME) as Theme | null;
      if (stored === "light" || stored === "dark") setTheme(stored);
    } catch {}
  }, []);

  // Apply to <html data-theme="..."> and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY_THEME, theme); } catch {}
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
