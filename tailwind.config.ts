import type { Config } from 'tailwindcss';

// Tokens do Design System Óticas Veluzzi (espelham app/globals.css :root).
// Cores em hexadecimal para permitir modificadores de opacidade do Tailwind (ex.: bg-ink/50).
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '480px', md: '768px', lg: '1024px', xl: '1280px' },
    extend: {
      colors: {
        primary: { DEFAULT: '#D4AA3C', hover: '#C39A30', light: '#F4E8C5' },
        secondary: { DEFAULT: '#4E5146', dark: '#36392F' },
        background: '#F7F6F2',
        surface: '#FFFFFF',
        ink: '#20221E',
        accent: '#B89A65',
        muted: '#777B70',
        line: '#E2E3DD',
        success: '#38734C',
        warning: '#956300',
        error: '#B83C3C',
        info: '#426B8A',
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
