import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 text-gray-500 dark:text-gray-400 hover:bg-gray-100 
                 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 
                 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};
