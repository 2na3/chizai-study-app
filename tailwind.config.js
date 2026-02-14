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
        // Custom Color Palette - Indigo & Slate (Sophisticated & Intellectual)
        // Primary - Indigo for actions and links
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Secondary - Slate for text and subdued elements
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Accent - Cyan for emphasis and success
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Surface - Warm neutral backgrounds
        surface: {
          light: '#fafaf9',
          'light-variant': '#f5f5f4',
          'light-container': '#e7e5e4',
          dark: '#1c1917',
          'dark-variant': '#292524',
          'dark-container': '#44403c',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

