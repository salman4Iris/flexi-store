"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ACTIVE_THEME, type ThemeName } from "@/config/theme";

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeNames: ThemeName[] = ["default", "luxury", "minimal"];

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

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

const isThemeName = (value: string): value is ThemeName => {
  return themeNames.includes(value as ThemeName);
};

const getStoredTheme = (): ThemeName => {
  if (typeof window === "undefined") {
    return ACTIVE_THEME;
  }

  try {
    const storedTheme = localStorage.getItem("flexi-theme");
    if (storedTheme && isThemeName(storedTheme)) {
      return storedTheme;
    }
  } catch {
    // Silently fail for localStorage errors
  }

  return ACTIVE_THEME;
};

const ThemeProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [themeState, setThemeState] = useState<ThemeName | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const theme = themeState ?? ACTIVE_THEME;

  // Initialize theme after hydration to prevent hydration mismatch
  useEffect((): void => {
    const storedTheme = getStoredTheme();
    if (storedTheme !== ACTIVE_THEME) {
      setThemeState(storedTheme);
    }
    setIsMounted(true);
  }, []);

  // Apply theme to DOM after hydration
  useEffect(() => {
    if (!isMounted) return;

    const root = document.documentElement;
    const vars = themes[theme] ?? themes.default;
    
    Object.entries(vars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
    
    root.setAttribute("data-theme", theme);
    
    try {
      localStorage.setItem("flexi-theme", theme);
    } catch {
      // Silently fail for localStorage errors
    }
  }, [theme, isMounted]);

  const setTheme = useCallback((t: ThemeName): void => {
    setThemeState(t);
  }, []);

  const toggle = useCallback((): void => {
    setThemeState((s) => (s === "default" ? "luxury" : "default"));
  }, []);

  const value: ThemeContextType = { theme, setTheme, toggle };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;