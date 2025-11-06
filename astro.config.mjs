import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mcp from 'astro-mcp';
import sitemap from '@astrojs/sitemap';
import compress from 'vite-plugin-compression';

import mdx from '@astrojs/mdx';
import rehypeWrapEmoji from './src/plugins/rehype-wrap-emoji.mjs';

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
  },

  // MDX support and Sitemap generation
  integrations: [
    mdx({
      rehypePlugins: [rehypeWrapEmoji],
    }),
    sitemap({
      filter: page => !page.includes('404'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
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
    server: {
      fs: {
        strict: false,
      },
    },
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
