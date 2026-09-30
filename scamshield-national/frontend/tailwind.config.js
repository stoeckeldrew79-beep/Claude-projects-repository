/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'shiny-text': {
          '0%, 90%, 100%': { backgroundPosition: 'calc(-100% - var(--shiny-width, 100px)) 0' },
          '30%, 60%': { backgroundPosition: 'calc(100% + var(--shiny-width, 100px)) 0' },
        },
        'glow-pulse': {
          '0%, 100%': { textShadow: '0 0 0px rgba(248, 113, 113, 0)' },
          '50%': { textShadow: '0 0 10px rgba(248, 113, 113, 0.85)' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'shiny-text': 'shiny-text 5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
