import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pouch UI Neutrals
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        cloud: 'rgb(var(--color-cloud) / <alpha-value>)',
        stone: 'rgb(var(--color-stone) / <alpha-value>)',
        graphite: 'rgb(var(--color-graphite) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        
        // Pouch UI Primary (Mint)
        'soft-mint': {
          light: '#F0FDF4',
          DEFAULT: '#22C55E',
          dark: '#166534'
        },
        
        // Pouch UI Secondary (Coral)
        'warm-coral': {
          light: '#FFF1F2',
          DEFAULT: '#F43F5E',
          dark: '#881337'
        },
        
        // Pouch UI Accents
        'lavender': {
          light: '#F5F3FF',
          DEFAULT: '#8B5CF6',
          dark: '#5B21B6'
        },
        'sky-blue': {
          light: '#F0F9FF',
          DEFAULT: '#0EA5E9',
          dark: '#0C4A6E'
        },
        'lemon': {
          light: '#FEFCE8',
          DEFAULT: '#EAB308',
          dark: '#713F12'
        },
        
        // Keep existing for compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#22C55E',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: '#F43F5E',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      boxShadow: {
        'soft': '0 4px 12px 0 rgba(0,0,0,0.05)',
        'soft-md': '0 6px 16px 0 rgba(0,0,0,0.07)',
        'soft-lg': '0 10px 24px 0 rgba(0,0,0,0.08)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'sheet-in': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'modal-in': 'modal-in 0.2s ease-out',
        'sheet-in': 'sheet-in 0.3s ease-out',
        'toast-in': 'toast-in 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
