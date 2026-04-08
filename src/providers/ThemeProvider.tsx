"use client";

import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from "react";
import { ACTIVE_THEME, type ThemeName } from "@/config/theme";

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_EVENT = "flexi-theme-change";
const THEME_STORAGE_KEY = "flexi-theme";
const FALLBACK_THEME: ThemeName = ACTIVE_THEME;

const themeNames: ThemeName[] = ["default", "luxury", "minimal"];

let cachedTheme: ThemeName = FALLBACK_THEME;
let cachedRawTheme: string | null = null;

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

const getThemeFromStorage = (rawTheme: string | null): ThemeName => {
  if (rawTheme === cachedRawTheme) {
    return cachedTheme;
  }

  const nextTheme: ThemeName = rawTheme && isThemeName(rawTheme) ? rawTheme : FALLBACK_THEME;
  cachedRawTheme = rawTheme;
  cachedTheme = nextTheme;

  return nextTheme;
};

const getThemeServerSnapshot = (): ThemeName => {
  return FALLBACK_THEME;
};

const getThemeSnapshot = (): ThemeName => {
  try {
    return getThemeFromStorage(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    // Silently fail for localStorage errors
    cachedRawTheme = null;
    cachedTheme = FALLBACK_THEME;
    return FALLBACK_THEME;
  }
};

const subscribeTheme = (callback: () => void): (() => void) => {
  window.addEventListener(THEME_EVENT, callback);

  return (): void => {
    window.removeEventListener(THEME_EVENT, callback);
  };
};

const dispatchThemeChange = (): void => {
  window.dispatchEvent(new Event(THEME_EVENT));
};

const ThemeProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  // Apply theme to DOM after hydration
  useEffect(() => {
    const root = document.documentElement;
    const vars = themes[theme] ?? themes.default;
    
    Object.entries(vars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
    
    root.setAttribute("data-theme", theme);
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Silently fail for localStorage errors
    }
  }, [theme]);

  const setTheme = useCallback((t: ThemeName): void => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
      cachedRawTheme = t;
      cachedTheme = t;
    } catch {
      // Silently fail for localStorage errors
    }
    dispatchThemeChange();
  }, []);

  const toggle = useCallback((): void => {
    const currentIndex = themeNames.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    const nextTheme = themeNames[nextIndex];
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const value: ThemeContextType = { theme, setTheme, toggle };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;