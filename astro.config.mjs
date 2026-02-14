import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import compress from 'vite-plugin-compression';

import mdx from '@astrojs/mdx';
import rehypeWrapEmoji from './src/plugins/rehype-wrap-emoji.mjs';
import { getLastModForUrl } from './src/utils/sitemap-dates';

// https://astro.build/config
export default defineConfig({
  site: 'https://gorakudo.org',

  // Static Site Generation (SSG) - Astro Native Best Practice
  output: 'static',

  // View Transitions API - Astro 5.x Native Support
  viewTransitions: true,

  // Build optimization
  build: {
    assets: '_astro', // Cleaner asset URLs
    inlineStylesheets: 'never', // CSS順序を安定させ、dev/preview差を抑制
  },

  // Public directory configuration
  publicDir: 'public',

  // Image optimization - Astro Native Best Practice
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    formats: ['webp', 'avif'],
    sizes: [320, 640, 768, 1024, 1280, 1600, 1920],
    quality: 85,
    placeholder: 'blur',
    domains: ['avatar.vercel.sh'],
  },

  // MDX support and Sitemap generation
  integrations: [
    mdx({
      rehypePlugins: [rehypeWrapEmoji],
    }),
    sitemap({
      filter: page =>
        !page.includes('404') &&
        !page.match(/\/page-\d+/) &&
        !page.includes('/search'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        // Set per-page lastmod from Git history
        const urlPath = new URL(item.url).pathname;
        item.lastmod = getLastModForUrl(urlPath).toISOString();

        // Homepage — highest priority
        if (item.url === 'https://gorakudo.org/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        // Major guide pages
        else if (
          item.url.includes('/panduan-immersion') ||
          item.url.includes('/panduan-lengkap')
        ) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        // Tool pages and YouTube recommendations
        else if (
          item.url.includes('/tools/') ||
          item.url.includes('/rekomendasi-channel-youtube')
        ) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }
        // Documentation pages
        else if (item.url.includes('/docs/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        }
        // Default: 0.7 / weekly (from top-level config)
        return item;
      },
    }),
  ],

  // Vite optimization - Astro Native Best Practice
  vite: {
    plugins: [
      tailwindcss(),
      compress({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        deleteOriginFile: false,
      }),
      compress({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        deleteOriginFile: false,
      }),
    ],
    // MIME type configuration for XSL files

    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Astro内部モジュールの未使用インポート警告を抑制
          if (
            warning.message?.includes('@astrojs/internal-helpers/remote') ||
            warning.message?.includes('matchHostname') ||
            warning.message?.includes('matchPathname') ||
            warning.message?.includes('matchPort') ||
            warning.message?.includes('matchProtocol')
          ) {
            return;
          }
          // その他の警告は通常通り表示
          warn(warning);
        },
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // Islands Architecture optimized chunking
          manualChunks: {
            'scripts-ui': ['./src/scripts/ui/docs-pagination.js'],
            'utils-core': [
              './src/utils/ai-content/content-analysis.js',
              './src/utils/ai-content/semantic-relationships.js',
              './src/utils/error-handling/discord-error-reporter.js',
            ],
            components: ['./src/components/ImageSlideshow.astro'],
          },
        },
      },
      minify: 'esbuild',
      target: 'es2020',
      cssCodeSplit: true,
      sourcemap: false,
    },
    css: {
      devSourcemap: false,
    },
    resolve: {
      alias: {
        '@': './src',
      },
      dedupe: ['astro', 'astro-cloudinary'],
    },
    server: {
      fs: {
        strict: false,
      },
      hmr: {
        overlay: true,
      },
      watch: {
        usePolling: false,
      },
    },
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    },
    optimizeDeps: {
      include: ['astro-cloudinary'],
    },
  },
});
