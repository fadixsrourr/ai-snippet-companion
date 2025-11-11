/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './entry.tsx',
    './src/**/*.{ts,tsx,css}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:'#eef9ff',100:'#d9f0ff',200:'#bde5ff',300:'#91d5ff',400:'#5ac0ff',
          500:'#2aa8ff',600:'#158fe6',700:'#1173b4',800:'#115f91',900:'#124f77',
        },
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0,0,0,0.35)',
      },
      keyframes: {
        pingSoft: {
          '0%':   { transform: 'scale(0.9)', opacity: '0.55' },
          '70%':  { transform: 'scale(1.7)', opacity: '0' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
      },
      animation: {
        'ping-soft': 'pingSoft 2.8s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
