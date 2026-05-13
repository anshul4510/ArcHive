/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-dark': 'var(--bg-dark)',
        'accent-gold': 'var(--accent-gold)',
        'accent-gold-dim': 'var(--accent-gold-dim)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        surface: 'var(--surface)',
        'border-gold': 'var(--border)',
        glass: 'var(--glass)',
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0, 0, 0, 0.06)',
        elevated: '0 12px 48px rgba(0, 0, 0, 0.12)',
        'gold-glow': '0 0 32px rgba(200, 169, 106, 0.15)',
      },
      borderRadius: {
        cards: '12px',
        buttons: '6px',
        inputs: '8px',
        modals: '16px',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.4s infinite'
      }
    },
  },
  plugins: [],
}
