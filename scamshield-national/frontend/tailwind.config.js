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
        'badge-glow': {
          '0%, 100%': {
            boxShadow: '0 0 0px 0px rgba(248, 113, 113, 0)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 24px 6px rgba(248, 113, 113, 0.55)',
            borderColor: 'rgba(248, 113, 113, 0.9)',
          },
        },
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'shiny-text': 'shiny-text 5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'badge-glow': 'badge-glow 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
