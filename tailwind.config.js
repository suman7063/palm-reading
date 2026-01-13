/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,jsx,ts,tsx}",
    "./**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        secondary: '#1e293b',
        mint: '#7DD3C0',
        purple: '#9B7FDB',
        blue: '#60A5FA',
        text: '#f1f5f9',
        'text-dim': '#94a3b8',
        'card-bg': 'rgba(30, 41, 59, 0.7)',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        spectral: ['Spectral', 'serif'],
      },
      animation: {
        'twinkle': 'twinkle 3s infinite',
        'fadeIn': 'fadeIn 0.8s ease-out',
        'slideDown': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}