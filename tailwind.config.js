/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'line-bg':      '#0A0A0A',
        'line-surface': '#111111',
        'line-border':  '#1E1E1E',
        'line-text':    '#F0EDE6',
        'line-muted':   '#666666',
        'line-accent':  '#C8A96E',
        'line-ghost':   '#1A1A1A',
        'line-hover':   '#E8E8E8',
      },
      fontFamily: {
        display: ['Canela', 'Georgia', 'serif'],
        sans:    ['Sohne', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-xl':  ['clamp(2rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg':  ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        'content': '1440px',
      },
      animation: {
        'fade-up':      'fadeUp 0.6s ease-out forwards',
        'fade-in':      'fadeIn 0.4s ease-out forwards',
        'shimmer':      'shimmer 1.5s infinite',
        'pulse-line':   'pulseLine 2s ease-in-out infinite',
        'count-up':     'countUp 0.8s ease-out forwards',
        'scroll-hint':  'scrollHint 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseLine: {
          '0%, 100%': { opacity: '0.4', transform: 'scaleY(1)' },
          '50%':      { opacity: '1',   transform: 'scaleY(1.3)' },
        },
        scrollHint: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%':      { transform: 'translateY(8px)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'gallery': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
