
'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { ThemeMode, ResolvedTheme, resolveTheme, applyTheme, getSystemTheme } from '@/lib/design-system/themes';
import { storage } from '@/lib/storage';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  systemTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'opuszero-theme-mode';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'auto',
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Get resolved theme based on mode and system preference
  const resolvedTheme = useMemo(() => resolveTheme(mode), [mode]);

  // Initialize theme from storage and system preference
  useEffect(() => {
    setMounted(true);
    
    // Get stored preference
    const stored = storage.local.get<ThemeMode>(storageKey);
    if (stored && ['light', 'dark', 'lowLight', 'auto'].includes(stored)) {
      setMode(stored);
    }

    // Get system preference
    setSystemTheme(getSystemTheme());
  }, [storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document when resolved theme changes
  useEffect(() => {
    if (!mounted) return;
    
    const themeToApply = mode === 'auto' ? systemTheme : mode;
    applyTheme(themeToApply as ResolvedTheme);
  }, [mode, systemTheme, mounted]);

  // Set theme and persist to storage
  const setTheme = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    storage.local.set(storageKey, newMode);
  }, [storageKey]);

  // Toggle between themes
  const toggleTheme = useCallback(() => {
    const themeOrder: ThemeMode[] = ['light', 'dark', 'lowLight', 'auto'];
    const currentIndex = themeOrder.indexOf(mode);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  }, [mode, setTheme]);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          mode: defaultTheme,
          resolvedTheme: 'light',
          setTheme: () => {},
          toggleTheme: () => {},
          systemTheme: 'light',
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedTheme: mode === 'auto' ? systemTheme : mode,
        setTheme,
        toggleTheme,
        systemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeContext };
