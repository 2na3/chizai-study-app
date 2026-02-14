/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        mono: ['"M PLUS 1 Code"', 'monospace'],
      },
      colors: {
        // Material Design 3 Color System
        // Primary - Main brand color (Blue)
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
        // Surface - Background colors
        surface: {
          light: '#ffffff',
          'light-variant': '#f5f5f5',
          'light-container': '#e8eaed',
          dark: '#121212',
          'dark-variant': '#1e1e1e',
          'dark-container': '#2c2c2c',
        },
        // On-surface text colors
        'on-surface': {
          'light-primary': '#1f2937',
          'light-secondary': '#6b7280',
          'light-tertiary': '#9ca3af',
          'dark-primary': '#f9fafb',
          'dark-secondary': '#d1d5db',
          'dark-tertiary': '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}

