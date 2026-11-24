import type { Config } from 'tailwindcss';

// Tokens do Design System Óticas Veluzzi — os valores vivem em app/globals.css (:root)
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '480px', md: '768px', lg: '1024px', xl: '1280px' },
    extend: {
      colors: {
        primary: { DEFAULT: 'var(--color-primary)', hover: 'var(--color-primary-hover)', light: 'var(--color-primary-light)' },
        secondary: { DEFAULT: 'var(--color-secondary)', dark: 'var(--color-secondary-dark)' },
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-text)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
        line: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      fontFamily: { heading: 'var(--font-heading)', body: 'var(--font-body)' },
      fontSize: {
        display: ['var(--text-display)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h1: ['var(--text-h1)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['var(--text-h2)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h3: ['var(--text-h3)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h4: ['var(--text-h4)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        lg: ['var(--text-lg)', { lineHeight: '1.6' }],
        base: ['16px', { lineHeight: '1.6' }],
        sm: ['14px', { lineHeight: '1.6' }],
        xs: ['12px', { lineHeight: '1.5' }],
      },
      borderRadius: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
      boxShadow: { sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)', hover: 'var(--shadow-hover)' },
      maxWidth: { container: 'var(--container-max)' },
      transitionTimingFunction: { veluzzi: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      spacing: { header: 'var(--header-height)' },
    },
  },
  plugins: [],
};
export default config;
