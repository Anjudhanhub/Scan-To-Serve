
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

interface Theme {
  name: string;
  colors: { [key: string]: string };
}

interface ThemeContextType {
  theme: string;
  setTheme: (themeName: string) => void;
  themes: { [key: string]: Theme };
}

const themes: { [key: string]: Theme } = {
  default: {
    name: 'Default Orange',
    colors: {
      '--color-primary': '249 115 22',
      '--color-secondary': '251 191 36',
      '--color-accent': '239 68 68',
      '--color-background': '255 245 242',
      '--color-text-primary': '75 42 42',
      '--color-text-secondary': '120 90 90',
    }
  },
  ocean: {
    name: 'Ocean Blue',
    colors: {
      '--color-primary': '14 165 233', // sky-500
      '--color-secondary': '59 130 246', // blue-500
      '--color-accent': '239 68 68',
      '--color-background': '240 249 255', // sky-50
      '--color-text-primary': '12 74 110', // sky-900
      '--color-text-secondary': '30 64 175', // blue-800
    }
  },
  forest: {
    name: 'Forest Green',
    colors: {
        '--color-primary': '34 197 94', // green-500
        '--color-secondary': '251 191 36',
        '--color-accent': '239 68 68',
        '--color-background': '240 253 244', // green-50
        '--color-text-primary': '20 83 45', // green-900
        '--color-text-secondary': '21 128 61', // green-700
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'default';
    }
    return 'default';
  });

  useEffect(() => {
    const selectedTheme = themes[theme];
    if (selectedTheme) {
      const root = window.document.documentElement;
      Object.entries(selectedTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setThemeState(themeName);
    }
  };
  
  const value = useMemo(() => ({ theme, setTheme, themes }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
