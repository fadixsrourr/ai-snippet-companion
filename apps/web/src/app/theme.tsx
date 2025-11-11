// src/app/theme.tsx
import { createContext, useContext, useEffect, useMemo } from "react";

type ThemeContextValue = {
  theme: "dark";
  setTheme: (_: "dark") => void; // no-op
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force dark once and forever.
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: "dark", setTheme: () => {} }),
    []
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

// No ThemeToggleButton exported anymore (we removed it).
