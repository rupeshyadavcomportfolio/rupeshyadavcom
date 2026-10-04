'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Strictly enforce clean white/light theme as requested ("black colour use mat karo")
    setThemeState('light');
    setResolvedTheme('light');
    const root = document.documentElement;
    root.classList.remove('dark');
    try {
      localStorage.removeItem('rupesh-theme');
      localStorage.setItem('rupesh-theme', 'light');
    } catch {}
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState('light');
    setResolvedTheme('light');
    const root = document.documentElement;
    root.classList.remove('dark');
    try {
      localStorage.setItem('rupesh-theme', 'light');
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
