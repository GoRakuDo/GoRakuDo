import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import mcp from 'astro-mcp';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

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

  // Vite optimization - Astro Native Best Practice
  vite: {
    plugins: [tailwindcss()],
    // MIME type configuration for XSL files
    server: {
      fs: {
        strict: false,
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // Islands Architecture optimized chunking
          manualChunks: {
            'vue-core': ['vue'],
            'vue-runtime': ['vue/dist/runtime-dom.esm-bundler.js'],
            'vue-components': ['@astrojs/vue'],
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
      dedupe: ['vue', 'astro'],
    },
    optimizeDeps: {
      include: ['vue'],
      exclude: [],
      force: false,
      esbuildOptions: {
        target: 'es2020',
        supported: {
          'top-level-await': true,
        },
      },
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
  },

  integrations: [
    vue({
      // Vue configuration for Islands Architecture
      include: ['**/*.vue'],
      experimentalReactivityTransform: false,
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('ion-'),
        },
      },
    }),
    mcp(),
    mdx(),
    sitemap(),
  ],
});
