import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('panorama_theme');
    if (savedTheme === 'light') {
      localStorage.setItem('panorama_theme', 'dark');
      return 'dark';
    }
    if (savedTheme === 'dark') {
      return 'dark';
    }
    return 'dark'; // Always default to dark mode for the premium deep blue theme
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('panorama_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
};
