'use client';

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

const themeConfig = {
  light: {
    '--color-parchment': '#f9f9fb',
    '--color-canvas': '#ffffff',
    '--color-canvas-glass': 'rgba(255, 255, 255, 0.7)',
    '--color-ink-base': '#111111',
    '--color-muted-base': '#888888',
    '--color-border-base': 'rgba(0, 0, 0, 0.06)',
    '--color-border-hover': 'rgba(0, 0, 0, 0.12)',
  },
  dark: {
    '--color-parchment': '#0a0a0a',
    '--color-canvas': '#141414',
    '--color-canvas-glass': 'rgba(20, 20, 20, 0.7)',
    '--color-ink-base': '#ffffff',
    '--color-muted-base': '#a1a1aa',
    '--color-border-base': 'rgba(255, 255, 255, 0.1)',
    '--color-border-hover': 'rgba(255, 255, 255, 0.2)',
  }
};

const accentConfig = {
  ink: { '--color-primary-base': 'var(--color-ink-base)' },
  blue: { '--color-primary-base': '#0066cc' },
  orange: { '--color-primary-base': '#ff9500' },
  green: { '--color-primary-base': '#34c759' }
};

export function ThemeProvider({ children }) {
  const { theme, accentColor } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const currentTheme = themeConfig[theme] || themeConfig.light;
    const currentAccent = accentConfig[accentColor] || accentConfig.ink;

    // Apply Theme
    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply Accent
    Object.entries(currentAccent).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set class for tailwind dark mode if needed
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

  }, [theme, accentColor, mounted]);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
}
