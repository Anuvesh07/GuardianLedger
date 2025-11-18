'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimatedThemeTogglerProps {
  className?: string;
  duration?: number;
}

export function AnimatedThemeToggler({ 
  className = '', 
  duration = 400 
}: AnimatedThemeTogglerProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          rotate: isDark ? 90 : 0,
        }}
        transition={{ duration: duration / 1000 }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-orange-500" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90,
        }}
        transition={{ duration: duration / 1000 }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-blue-500" />
      </motion.div>
    </button>
  );
}
