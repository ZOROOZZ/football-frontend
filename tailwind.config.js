/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-bg': '#0f1419',
        'dark-card': '#1a2332',
        'dark-card-hover': '#1e2936',
        'dark-border': '#2a3647',
        'primary-blue': '#2196f3',
        'primary-blue-dark': '#1976d2',
        'success-green': '#10b981',
        'warning-orange': '#f59e0b',
        'error-red': '#ef4444',
        'text-secondary': '#8b92a7',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
