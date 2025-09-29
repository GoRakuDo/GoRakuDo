// tailwind.config.mjs
// GoRakuDo Project - Updated Tailwind Configuration

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    /* === Astro Files === */
    './src/**/*.astro',
    './src/pages/**/*.astro',
    './src/components/**/*.astro',
    './src/layouts/**/*.astro',

    /* === Content Collections === */
    './src/content/**/*.{md,mdx}',

    /* === Utilities === */
    './src/utils/**/*.ts',
    './src/scripts/**/*.ts',
  ],

  /* === 📦 Plugins - GoRakuDo Optimized === */
  plugins: [
    require('@tailwindcss/typography')({
      target: 'modern',
      modifiers: {
        prose: {
          /* === TYPOGRAPHY ELEMENTS === */
          p: {
            'margin-bottom': '2.5rem',
            'margin-top': '0.5rem',
            'line-height': 'var(--orphan-line-height)',
            'text-wrap': 'pretty',
            'word-spacing': 'var(--orphan-word-spacing)',
            orphans: '3',
            widows: '3',
            hyphens: 'auto',
            'hyphenate-limit-chars': '6 3 3',
          },
          'h1, h2, h3, h4, h5, h6': {
            'margin-top': '3rem',
            'margin-bottom': '1.5rem',
          },
          'h1, h2, h3': {
            'font-weight': 'bold',
          },
          'ul, ol': {
            'margin-bottom': '2.5rem',
            'margin-top': '1rem',
            'text-wrap': 'pretty',
            'word-spacing': 'var(--orphan-word-spacing)',
            orphans: '3',
            widows: '3',
          },
          li: {
            'line-height': 'var(--orphan-line-height)',
            'text-wrap': 'pretty',
            'word-spacing': 'var(--orphan-word-spacing)',
            orphans: '3',
            widows: '3',
            hyphens: 'auto',
            'hyphenate-limit-chars': '6 3 3',
          },
          blockquote: {
            'margin-top': '2rem',
            'margin-bottom': '2rem',
          },
          /* === CODE ELEMENTS === */
          pre: {
            'background-color': 'oklch(0.05 0 0)',
            'border-radius': '0.5rem',
            padding: '1.5rem',
          },
          code: {
            'background-color': 'oklch(0.1 0 0)',
            padding: '0.25rem 0.5rem',
            'border-radius': '0.25rem',
            'font-size': '0.875rem',
          },
        },
        /* === PROSE VARIANTS === */
        'prose-go': {
          color: 'oklch(0.9 0 0)',
          'max-width': 'none',
          'text-wrap': 'pretty',
          'word-spacing': 'var(--orphan-word-spacing)',
          'line-height': 'var(--orphan-line-height)',
          orphans: '3',
          widows: '3',
        },
        'prose-mobile': {
          'text-wrap': 'pretty',
          'word-spacing': 'var(--orphan-word-spacing)',
          'line-height': '1.6',
          orphans: '2',
          widows: '2',
        },
        'prose-desktop': {
          'text-wrap': 'pretty',
          'word-spacing': 'var(--orphan-word-spacing)',
          'line-height': 'var(--orphan-line-height)',
          orphans: '4',
          widows: '4',
        },
        'prose-content': {
          color: 'oklch(0.9 0 0)',
          'max-width': '65ch',
          '--tw-prose-body': 'oklch(0.9 0 0)',
          '--tw-prose-headings': 'oklch(1 0 0)',
          '--tw-prose-links': 'oklch(0.65 0.25 280)',
          '--tw-prose-code': 'oklch(0.8 0 0)',
          '--tw-prose-pre-bg': 'oklch(0.05 0 0)',
          '--tw-prose-th-borders': 'oklch(0.2 0.01 280)',
          '--tw-prose-td-borders': 'oklch(0.2 0.01 280)',
        },
      },
    }),
  ],

  /* === ⚡ Performance Optimization === */
  corePlugins: {
    float: false,
    clear: false,
    skew: false,
    caretColor: false,
    resize: false,
    scrollSnap: false,
    scrollBehavior: false,
  },

  /* === 🔧 Future Features === */
  future: {
    hoverOnlyWhenSupported: true,
  },

  /* === 🚀 Experimental === */
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
