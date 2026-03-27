"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ACTIVE_THEME, type ThemeName } from "@/config/theme";

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeNames: ThemeName[] = ["default", "luxury", "minimal"];

function isThemeName(value: string): value is ThemeName {
  return themeNames.includes(value as ThemeName);
}

const themes: Record<ThemeName, Record<string, string>> = {
  default: {
    "--color-primary": "#111111",
    "--color-bg": "#ffffff",
    "--color-text": "#222222",
    "--radius": "10px",
  },
  luxury: {
    "--color-primary": "#0f172a",
    "--color-bg": "#020617",
    "--color-text": "#e5e7eb",
    "--radius": "16px",
  },
  minimal: {
    "--color-primary": "#0b1220",
    "--color-bg": "#f7f7f8",
    "--color-text": "#0f172a",
    "--radius": "6px",
  },
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(ACTIVE_THEME);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("flexi-theme");
      if (storedTheme && isThemeName(storedTheme)) {
        setThemeState(storedTheme);
      }
    } catch {}
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const root = document.documentElement;
    const vars = themes[theme] || themes.default;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("flexi-theme", theme);
    } catch {}
  }, [theme, isHydrated]);

  const setTheme = (t: ThemeName) => setThemeState(t);
  const toggle = () => setThemeState((s) => (s === "default" ? "luxury" : "default"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}