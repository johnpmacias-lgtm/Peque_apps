import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useTema() {
  const tema = useStore(s => s.tema);
  const toggleTema = useStore(s => s.toggleTema);
  const setTema = useStore(s => s.setTema);

  useEffect(() => {
    const root = document.documentElement;
    if (tema === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [tema]);

  return { tema, toggleTema, setTema };
}

// Clases condicionales para tema
export const themeClasses = {
  bg: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800/50',
    tertiary: 'bg-gray-100 dark:bg-gray-900/50',
    card: 'bg-white dark:bg-gray-800/50',
    input: 'bg-white dark:bg-gray-700/50',
    modal: 'bg-white dark:bg-gray-800',
    sidebar: 'bg-gray-100 dark:bg-gray-900',
  },
  border: {
    primary: 'border-gray-200 dark:border-gray-700/50',
    secondary: 'border-gray-300 dark:border-gray-600/50',
    input: 'border-gray-300 dark:border-gray-600/50',
  },
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-400',
    tertiary: 'text-gray-500 dark:text-gray-500',
    muted: 'text-gray-400 dark:text-gray-500',
  },
  hover: {
    bg: 'hover:bg-gray-100 dark:hover:bg-gray-700/50',
    border: 'hover:border-gray-400 dark:hover:border-gray-500',
  }
};
