# Technology Stack - GoRakuDo

**Last Updated:** 2025-10-13  
**Version:** 2.0  
**Status:** Active

## Overview

This document provides a comprehensive overview of the technology stack used in the GoRakuDo project, a modern Japanese language learning platform built with Astro, TypeScript, and modern web technologies. The stack emphasizes performance, SEO optimization, and developer experience through static site generation, OKLCH color space, and comprehensive tooling.

## Table of Contents

1. [Core Framework](#core-framework)
2. [Frontend Technologies](#frontend-technologies)
3. [Styling & UI](#styling--ui)
4. [Content Management](#content-management)
5. [SEO & Metadata Management](#seo--metadata-management)
6. [Image Optimization & CDN](#image-optimization--cdn)
7. [Development Tools](#development-tools)
8. [Testing Framework](#testing-framework)
9. [Build & Deployment](#build--deployment)
10. [Performance & Optimization](#performance--optimization)
11. [Browser Support](#browser-support)
12. [Architecture Decisions](#architecture-decisions)
13. [Project-Specific Features](#project-specific-features)

---

## Core Framework

### Astro 5.13.0
- **Purpose**: Static site generator and web framework
- **Why Astro**: Zero-JavaScript by default, optimal performance, component islands architecture
- **Key Features**:
  - Static site generation (SSG) - Astro Native Best Practice
  - **View Transitions API** - Astro 5.x native support for smooth page transitions
  - Built-in image optimization (Sharp with WebP/AVIF generation)
  - Content Collections for type-safe content management
  - File-based routing
  - MDX support for rich content authoring

#### Core Integrations

**@astrojs/mdx** (^4.3.6)
- **Purpose**: MDX support for component-based content
- **Features**: 
  - Custom rehype plugins (emoji wrapping)
  - Component usage within markdown
  - Type-safe frontmatter

**@astrojs/sitemap** (^3.6.0)
- **Purpose**: Automatic sitemap generation
- **Configuration**:
  - Filters out 404 pages
  - Weekly changefreq
  - Priority 0.7 default
  - Automatic lastmod dates

#### 実際の設定 (astro.config.mjs)
```javascript
export default defineConfig({
  site: 'https://gorakudo.org',
  output: 'static',
  viewTransitions: true, // Astro 5.x View Transitions

    build: {
    assets: '_astro',
    inlineStylesheets: 'never', // CSS順序を安定化
  },

  // Image optimization
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    formats: ['webp', 'avif'],
    sizes: [320, 640, 768, 1024, 1280, 1600, 1920],
    quality: 85,
    placeholder: 'blur',
  },

  integrations: [
    mdx({ rehypePlugins: [rehypeWrapEmoji] }),
    sitemap({
      filter: page => !page.includes('404'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
```

#### 使用例
```astro
---
// src/pages/docs/[slug].astro
import { getCollection } from 'astro:content';
import PostLayout from '@/layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('docs', ({ data }) => data.draft !== true);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<PostLayout {...post.data}>
  <Content />
</PostLayout>
```

### Vue.js 3.5.18
- **Purpose**: ~~Primary UI framework~~ → **Deprecated** (移行済み)
- **Status**: 現在のプロジェクトでは **使用されていません**
- **Migration**: すべてのコンポーネントがAstroネイティブに移行済み
- **Note**: `@astrojs/vue`統合はpackage.jsonに残存していますが、実際には使用されていません

---

## Frontend Technologies

### TypeScript 5.9.2
- **Configuration**: Strict mode enabled (extends `astro/tsconfigs/strict`)
- **Features**:
  - Strict null checks
  - No implicit any
  - Strict function types
  - No implicit returns
  - Strict property initialization
  - No unused locals/parameters
- **Target**: ES2020
- **Module System**: ES Modules (ESM) mandatory
- **Path Aliasing**: `@/*` mapped to `src/*`

#### 実際のtsconfig.json
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/types/*": ["src/scripts/type-scripts/*"]
    },
    "types": ["node"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

#### プロジェクト特有の型定義
```typescript
// Content Collection Types (Zod-based)
import { z } from 'astro:content';

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(280),
    keywords: z.array(z.string().max(60)).max(15).default([]),
    learningResourceType: z.union([z.string().max(50), z.array(z.string().max(50))]).optional(),
    educationalLevel: z.union([z.string().max(50), z.array(z.string().max(50))]).optional(),
    citation: z.array(z.object({
      type: z.string().max(50),
      author: z.union([z.string().max(100), z.array(z.string().max(100))]),
      datePublished: z.string().max(20),
      name: z.string().max(300),
      url: z.string().url().optional(),
    })).max(20).optional(),
  }),
});
```

### JavaScript Standards
- **ES Modules**: All JavaScript files use `import`/`export`
- **No CommonJS**: `require`/`module.exports` prohibited
- **Modern Syntax**: ES2020+ features enabled
- **Type**: `"type": "module"` in package.json (mandatory)

### TypeScript Execution
- **tsx** (^4.20.6): TypeScript execution engine for scripts
- **Use Case**: Auto-date processing, content generation scripts
- **Example**:
  ```bash
  npm run process-auto-dates:fast  # tsx src/scripts/type-scripts/auto-date/processor-efficient.ts
  ```

---

## Styling & UI

### Tailwind CSS 4.1.13
- **Integration**: Via `@tailwindcss/vite` (^4.1.13) plugin
- **Configuration**: Custom theme with GoRakuDo brand colors
- **Features**:
  - Utility-first CSS framework
  - **@tailwindcss/typography** (^0.5.19) for prose styling
  - Responsive design utilities
  - Custom animations and keyframes
  - Performance optimizations (disabled unused core plugins)
  - Purging enabled for production builds

#### Tailwind Typography Integration
```javascript
// tailwind.config.mjs
plugins: [
  require('@tailwindcss/typography')({
    target: 'modern',
    modifiers: {
      prose: {
        p: {
          'margin-bottom': '2.5rem',
          'line-height': 'var(--orphan-line-height)',
          'text-wrap': 'pretty',
          orphans: '3',
          widows: '3',
        },
        // ... more typography settings
      },
      'prose-go': { /* GoRakuDo custom prose variant */ },
      'prose-content': { /* Content-specific styling */ },
    },
  }),
],

// Performance optimization
corePlugins: {
  float: false,
  clear: false,
  skew: false,
  caretColor: false,
  resize: false,
  scrollSnap: false,
  scrollBehavior: false,
},
```

### Modern CSS Features

#### OKLCH Color Space
- **All colors** defined using `oklch()` for perceptual uniformity
- **Why OKLCH**: Perceptually uniform, better for design tokens
- **Example**:
  ```css
  background: oklch(from var(--token-black-base) l c h / 0.5);
  color: oklch(0.9 0 0); /* High lightness, zero chroma = white */
  ```

#### CSS Variables & Design Tokens
```css
/* Color Tokens */
--token-text-base: oklch(0.9 0 0);
--token-text-muted: oklch(0.7 0 0);
--token-black-base: oklch(0.05 0 0);

/* Responsive with clamp() */
--card-padding: clamp(1rem, 2vw, 1.5rem);
--title-font: clamp(1.25rem, 3vw, 1.75rem);
```

#### Opacity System
- **Consistent opacity levels**: `/0.05`, `/0.1`, `/0.2`, `/0.3`, `/0.5`, `/0.7`, `/0.9`
- **Usage**: `oklch(from var(--color) l c h / 0.5)` for 50% transparency

### Stylelint (^16.24.0)
- **Purpose**: CSS/SCSS linting and formatting
- **Configurations**:
  - `stylelint-config-standard` (^39.0.0)
  - `stylelint-config-recess-order` (^7.3.0) - Property ordering
  - `stylelint-config-html` (^1.1.0) - Astro/HTML support
  - `stylelint-config-tailwindcss` (^1.0.0)

#### Stylelint Rules
- **Property Order**: Enforced via `stylelint-config-recess-order`
- **!important Prohibition**: `declaration-no-important: true` (except global.css)
- **OKLCH Enforcement**: `hue-degree-notation: "angle"`, `alpha-value-notation: "number"`
- **Max Nesting**: 3 levels deep
- **Selector Specificity**: Max `0,3,0`

#### スクリプト
```bash
npm run stylelint        # Fix all CSS/SCSS/Astro files
npm run stylelint:css-only  # CSS files only
npm run stylelint:file   # Specific file
```

### Web Fonts
#### Variable Fonts
- **@fontsource-variable/roboto-flex** (^5.2.8) - Sans-serif variable
- **@fontsource-variable/roboto-serif** (^5.2.8) - Serif variable

#### Japanese Fonts
- **@fontsource/noto-sans-jp** (^5.2.8) - Sans-serif
- **@fontsource/noto-serif-jp** (^5.2.7) - Serif
- **@fontsource/yuji-syuku** (^5.2.7) - Display font

**Rationale**: Self-hosted fonts for performance, GDPR compliance, and offline support

### Custom CSS Architecture
- **Global Styles**: `src/styles/global.css`
- **Page Styles**: `src/styles/pages/*.css` (scoped to routes)
- **Layout Styles**: `src/styles/layouts/*.css`
- **Component Styles**: Scoped `<style>` in `.astro` files (default)
- **Responsive Strategy**: Mobile-first + `clamp()` to minimize media queries

---

## Content Management

### Astro Content Collections
- **Collections**:
  - `docs`: Main documentation content
  - `tool-articles`: Tool documentation
  - `pages`: Static page content
- **Schema**: Zod-based validation with extensive metadata
- **Features**:
  - Type-safe content access via `getCollection()`
  - Automatic path resolution
  - Content filtering (draft detection)
  - Rich frontmatter validation

### Content Schema (Zod)
```typescript
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic metadata
    title: z.string().max(LIMITS.TITLE_MAX),           // 120 chars
    description: z.string().max(LIMITS.DESC_MAX),      // 280 chars
    keywords: z.array(z.string().max(60)).max(15).default([]),
    
    // Educational metadata (Schema.org)
    learningResourceType: z.union([z.string().max(50), z.array(z.string().max(50))]).optional(),
    educationalLevel: z.union([z.string().max(50), z.array(z.string().max(50))]).optional(),
    
    // Citation (E-E-A-T enhancement)
    citation: z.array(z.object({
      type: z.string().max(50),
      author: z.union([z.string().max(100), z.array(z.string().max(100))]),
      datePublished: z.string().max(20),
      name: z.string().max(300),
      url: z.string().url().optional(),
    })).max(20).optional(),
    
    // Publishing workflow
    draft: z.boolean().default(false),
    publishedDate: z.string().optional(),
    modifiedDate: z.string().optional(),
  }),
});
```

### MDX Support
- **@astrojs/mdx** (^4.3.6): Component-based content authoring
- **rehype-wrap-emoji**: Custom plugin for emoji wrapping
- **unist-util-visit** (^5.0.0): AST traversal for MDX transformations
- **Features**:
  - Import Astro components in content
  - Custom rehype/remark plugins
  - Type-safe frontmatter

### Content Structure
- **Format**: MDX (Markdown + JSX)
- **Metadata**: Rich metadata system with educational and citation data
- **Organization**: Category, tag, and keyword-based classification
- **Search**: Full-text search with Fuse.js (^7.1.0) integration
- **Auto-Dates**: Automated publishedDate/modifiedDate processing via TypeScript scripts

---

## SEO & Metadata Management

### UnifiedSEO.astro Component
- **Purpose**: Centralized SEO and structured data management
- **Location**: `src/components/UnifiedSEO.astro`
- **Features**:
  - Automatic Schema.org JSON-LD generation
  - OG/Twitter meta tags
  - Canonical URLs
  - Pagination meta tags
  - Resource hints (preconnect, dns-prefetch, preload)

#### Supported Schema.org Types
1. **Article** - Blog posts and docs (with educational metadata)
2. **WebSite** - Site-level schema
3. **Organization** / **EducationalOrganization** - GoRakuDo entity
4. **BreadcrumbList** - Navigation breadcrumbs
5. **FAQPage** - FAQ structured data
6. **CollectionPage** - Content listing pages
7. **SoftwareApplication** - Tool documentation
8. **ScholarlyArticle** - Research-backed content with citations

#### Educational Metadata (Schema.org)
```typescript
// UnifiedSEO.astro Props
interface Props {
  // ... basic props
  learningResourceType?: string | string[]; // "Article", "Tutorial", "Guide"
  educationalLevel?: string | string[];     // "Beginner", "Intermediate"
  about?: string | Array<{                  // Topic definitions
    type: string;
    name: string;
    description?: string;
    sameAs?: string;
  }>;
  mentions?: string[] | Array<{             // Mentioned entities
    type: string;
    name: string;
    sameAs?: string;
  }>;
  citation?: Array<{                        // Academic citations
    type: string;
    author: string | string[];
    datePublished: string;
    name: string;
    url?: string;
  }>;
}
```

#### E-E-A-T Enhancement
- **Citation**: Academic references to boost expertise signals
- **Author**: Structured author data with credentials
- **Publisher**: EducationalOrganization schema
- **Educational Metadata**: Explicit learning resource classification

### JSON-Driven SEO Configuration
- **Config File**: `src/data/seo/unifiedSeo-config.json`
- **Page-Level SEO**: `src/data/seo/pages/*.json` (e.g., `about-us.json`)
- **Features**:
  - Centralized default values
  - Easy A/B testing
  - Version control for SEO changes
  - Separation of content and metadata

#### Example: about-us.json
```json
{
  "seoData": {
    "title": "Tentang Kami - Perjalanan GoRakuDo",
    "description": "Kenali perjalanan GoRakuDo dan komunitas...",
    "keywords": ["tentang gorakudo", "komunitas bahasa jepang"],
    "lang": "id"
  },
  "faqSchema": { /* FAQPage structured data */ },
  "breadcrumbData": { /* BreadcrumbList data */ }
}
```

### SEO Tools & Integrations
- **@astrojs/sitemap** (^3.6.0): Automatic sitemap.xml generation
- **robots.txt**: Custom robot directives
- **Canonical URLs**: Automatic generation with pagination support
- **Analytics**: Google Tag Manager integration (G-R4V6TV2BM3)

---

## Image Optimization & CDN

### Cloudinary Integration
- **astro-cloudinary** (^1.3.5): Cloudinary asset delivery
- **Purpose**: Image transformation, optimization, and CDN delivery
- **Features**:
  - Public ID-based image references
  - **Cloudinary Fetch**: Transform external/local images on-the-fly
  - Automatic format conversion (WebP, AVIF)
  - Responsive image generation

#### OG Image Optimization (1.91:1 Aspect Ratio)
```typescript
// UnifiedSEO.astro - Cloudinary transformation
const createFullImageUrl = (imagePath?: string, forOgImage = false): string => {
  // ... detection logic
  
  if (forOgImage) {
    // Cloudinary public ID
    return `https://res.cloudinary.com/dbvd1cm7u/image/upload/c_pad,w_1200,h_630,b_auto,f_auto,q_auto/${imagePath}`;
    
    // External/local image via Fetch
    return `https://res.cloudinary.com/dbvd1cm7u/image/fetch/c_pad,w_1200,h_630,b_auto,f_auto,q_auto/${fullUrl}`;
  }
};
```

**Transformation Parameters:**
- `c_pad`: Padding to 1.91:1 without cropping
- `w_1200,h_630`: Optimal OG image dimensions
- `b_auto`: Auto background color
- `f_auto`: Format auto-detection (WebP/AVIF)
- `q_auto`: Quality auto-optimization

#### Cost Analysis
- **Free Tier**: 25 GB storage, 25 GB bandwidth/month
- **Fetch Feature**: No extra cost (counts toward bandwidth)
- **Current Usage**: Well within free tier limits
- **Pricing**: $0.0008/GB for overages (extremely low)

**Reference**: See `docs/architecture/og-image-optimization.md` for detailed cost analysis

### Native Astro Image Service
- **Service**: Sharp (Node.js image processing)
- **Formats**: WebP, AVIF generation
- **Sizes**: [320, 640, 768, 1024, 1280, 1600, 1920]
- **Quality**: 85
- **Placeholder**: Blur effect for lazy loading

### Security & Content Sanitization
- **dompurify** (^3.2.7): HTML sanitization
- **@types/dompurify** (^3.0.5): TypeScript definitions
- **Use Case**: User-generated content sanitization, XSS prevention

---

## Development Tools

### ESLint 9.34.0
- **Configuration**: Flat config system (`eslint.config.js`)
- **Parser**: 
  - **@typescript-eslint/parser** (^8.42.0) for `.ts` files
  - **vue-eslint-parser** (^10.2.0) for `.vue` files
  - **espree** (^10.4.0) for `.js`/`.mjs` files
- **Plugins**:
  - **@typescript-eslint/eslint-plugin** (^8.42.0)
  - **eslint-plugin-astro** (^1.3.1)
  - **eslint-plugin-vue** (^10.4.0)
  - **eslint-plugin-prettier** (^5.5.4)
  - **eslint-config-prettier** (^10.1.8)
- **Rules**:
  - TypeScript: `no-unused-vars`, `no-explicit-any: warn`, `no-inferrable-types: warn`
  - Prefer `const` over `let`, `no-var` (error)
  - ES Modules mandatory (no CommonJS)

#### eslint.config.js (Flat Config)
```javascript
export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'dist/', '.astro/', 'public/', '*.config.js'],
  },
];
```

### Stylelint (^16.24.0)
**Already covered in [Styling & UI](#styling--ui) section**
- Property order enforcement
- OKLCH color space validation
- Tailwind CSS support
- Astro/HTML file linting

### Prettier 3.6.2
- **Configuration**: Consistent code formatting
- **Settings**:
  - 2 spaces indentation
  - Single quotes
  - Semicolons required
  - Trailing commas (ES5)
- **Integration**: Works with ESLint via `eslint-plugin-prettier`

### Astro Check 0.9.4
- **Purpose**: Type checking for Astro files
- **Integration**: Part of build process (`npm run build`)
- **Features**: 
  - TypeScript validation for Astro components
  - Props interface validation
  - Content collection type checking

### Auto-Date Processing
- **Purpose**: Automatic `publishedDate`/`modifiedDate` management
- **Tool**: Custom TypeScript scripts with **tsx** (^4.20.6)
- **Scripts**:
  - `npm run process-auto-dates` - Basic processor
  - `npm run process-auto-dates:fast` - Efficient processor with caching
  - `npm run process-auto-dates:clear` - Clear cache
  - `npm run dev:watch-dates` - File watcher for auto-updates

#### 実装例
```bash
# Build時に自動実行
npm run build
# → npm run stylelint && npm run lint && astro check && npm run process-auto-dates:fast && astro build
```

**Rationale**: Ensures frontmatter dates are always up-to-date without manual intervention

### Additional Dev Tools
- **@types/node** (^24.3.0): Node.js type definitions
- **@types/jest** (^30.0.0): Jest type definitions
- **dotenv** (^17.2.1): Environment variable management

---

## Testing Framework

### Vitest 3.2.4
- **Environment**: jsdom for browser simulation
- **Coverage**: V8 coverage reporting
- **Configuration**: Integrated with Vite
- **Setup**: Custom test setup files

### Testing Library
- **Jest DOM**: Custom matchers for DOM testing
- **Types**: TypeScript definitions for Jest

---

## Build & Deployment

### Vite (via Astro)
- **Build Tool**: Modern build system integrated with Astro
- **Features**:
  - Fast HMR (Hot Module Replacement)
  - **Islands Architecture** optimized chunking
  - Code splitting & tree shaking
  - Asset optimization with content hashing
  - Compression (gzip & brotli)

#### Vite Build Configuration
```javascript
// astro.config.mjs
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
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          'scripts-ui': ['./src/scripts/ui/docs-pagination.js'],
          'utils-core': [
            './src/utils/ai-content/content-analysis.js',
            './src/utils/ai-content/semantic-relationships.js',
          ],
          components: ['./src/components/ImageSlideshow.astro'],
        },
      },
    },
    minify: 'esbuild',      // Fast minification
    target: 'es2020',       // Browser target
    cssCodeSplit: true,     // CSS code splitting
    sourcemap: false,       // No sourcemaps in production
  },
},
```

### Build Process
```bash
npm run dev           # Development server
npm run build         # Full production build with all checks
npm run build:quality # Quality checks + build
npm run preview       # Preview production build locally
```

#### 実際のビルドスクリプト (package.json)
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "npm run stylelint && npm run lint && astro check && npm run process-auto-dates:fast && astro build",
    "build:quality": "npm run quality && astro build",
    "preview": "astro preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.js,.astro",
    "lint:fix": "eslint src --ext .ts,.js,.astro --fix",
    "stylelint": "stylelint \"src/**/*.{css,scss,vue,astro}\" --fix",
    "format": "prettier --write src/**/*.{ts,js,json,css,md}",
    "format:check": "prettier --check src/**/*.{ts,js,json,css,md}",
    "quality": "npm run lint && npm run format:check && npm run type-check",
    "process-auto-dates:fast": "tsx src/scripts/type-scripts/auto-date/processor-efficient.ts"
  }
}
```

**Build Pipeline:**
1. **Stylelint** → CSS/SCSS/Astro files
2. **ESLint** → TypeScript/JavaScript files
3. **Astro Check** → Type validation
4. **Auto-Date Processing** → Update content dates
5. **Astro Build** → Static site generation
6. **Compression** → gzip & brotli (post-build)

### Compression
- **vite-plugin-compression** (^0.5.1)
- **Algorithms**: gzip & brotli
- **Threshold**: 1024 bytes (1 KB)
- **Preservation**: Original files kept for fallback

### Output
- **Static Site**: Generated in `dist/` directory
- **Optimization**: Minified CSS/JS, optimized images, compressed assets
- **Deployment**: GitHub Pages compatible
- **Asset Hashing**: Content-based hashing for cache busting

---

## Performance & Optimization

### Image Optimization (Multi-layered)
**Layer 1: Cloudinary CDN**
- **astro-cloudinary** (^1.3.5): Primary image delivery
- **Transformation**: Format conversion (WebP/AVIF), quality optimization
- **OG Images**: Automatic 1.91:1 aspect ratio via `c_pad`
- **Fetch API**: Transform external/local images on-the-fly
- **Cost**: Free tier (25 GB storage + bandwidth)

**Layer 2: Native Astro/Sharp**
- **Service**: Sharp (Node.js)
- **Formats**: WebP, AVIF generation
- **Responsive Sizes**: [320, 640, 768, 1024, 1280, 1600, 1920]
- **Quality**: 85
- **Lazy Loading**: Built-in with blur placeholders

**Rationale**: Cloudinary for content images + OG, Sharp for build-time assets

### Bundle Optimization
- **Code Splitting**: Manual chunk configuration for Islands Architecture
  - `scripts-ui`: UI scripts
  - `utils-core`: AI content analysis utilities
  - `components`: Large components (e.g., ImageSlideshow)
- **Tree Shaking**: Dead code elimination via Vite/Rollup
- **Minification**: esbuild (fast, efficient)
- **CSS Code Splitting**: Enabled for per-route CSS
- **Asset Hashing**: Content-based hashing for cache busting

### Compression
- **gzip**: .gz files for browsers supporting gzip
- **Brotli**: .br files for modern browsers (better compression)
- **Threshold**: 1024 bytes (skip tiny files)
- **Fallback**: Original files preserved

### CSS Optimization
- **clamp()**: Responsive values without media queries
- **CSS Variables**: Centralized design tokens
- **Scoped Styles**: Component-level scoping (Astro default)
- **Tailwind Purging**: Unused classes removed in production
- **Property Ordering**: Enforced via Stylelint (predictable gzip compression)

### JavaScript Optimization
- **Zero-JS by Default**: Astro's core principle
- **Selective Hydration**: `client:visible`, `client:idle` for interactive components
- **ES2020 Target**: Modern syntax for smaller bundles
- **No CommonJS**: ES Modules only (better tree shaking)

### Resource Hints
```html
<!-- UnifiedSEO.astro automatic generation -->
<link rel="preconnect" href="https://res.cloudinary.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
<link rel="preload" href="/fonts/roboto-flex.woff2" as="font" type="font/woff2" crossorigin />
```

### Core Web Vitals Optimizations
- **LCP (Largest Contentful Paint)**:
  - Cloudinary CDN for fast image delivery
  - Preload critical fonts
  - Inline critical CSS (when needed)
  - WebP/AVIF for smaller image sizes
  
- **FID (First Input Delay)**:
  - Zero JavaScript by default
  - Deferred script loading
  - Minimal main thread work
  
- **CLS (Cumulative Layout Shift)**:
  - Explicit image dimensions (width/height)
  - Blur placeholders for lazy-loaded images
  - CSS `inlineStylesheets: 'never'` for stable CSS order

### View Transitions (Astro 5.x)
- **Native API**: Smooth page transitions without JavaScript
- **Configuration**: `viewTransitions: true` in `astro.config.mjs`
- **Performance**: Hardware-accelerated CSS animations

---

## Browser Support

### Target Browsers
- **Modern Browsers**: ES2020+ support
- **Mobile**: Responsive design
- **Accessibility**: WCAG compliance

### Progressive Enhancement
- **Core Functionality**: Works without JavaScript
- **Enhanced Features**: JavaScript for interactivity
- **Fallbacks**: Graceful degradation

---

## Architecture Decisions

### Why Astro 5?
1. **Performance**: Zero JavaScript by default, optimal Core Web Vitals
2. **View Transitions**: Native smooth page transitions (no framework needed)
3. **Content Collections**: Type-safe content with Zod validation
4. **Islands Architecture**: Selective hydration for interactive components
5. **SEO**: Static generation for optimal SEO and crawlability
6. **Developer Experience**: Great TypeScript support, fast HMR

### Why NOT Vue.js? (Migration Rationale)
1. **Zero-JS Philosophy**: Astro components are sufficient for static content
2. **Performance**: Removing Vue reduced bundle size by ~75 kB
3. **Simplicity**: One less framework to maintain
4. **SSG-First**: Educational content doesn't require client-side reactivity
5. **Migration**: All Vue components successfully migrated to pure Astro

**Status**: Vue.js deprecated, all components now Astro-native

### Why Tailwind CSS + Custom CSS?
1. **Utility-First**: Rapid prototyping and consistent spacing/sizing
2. **Typography Plugin**: Rich prose styling for educational content
3. **Performance**: Purging unused styles (minimal CSS in production)
4. **OKLCH Colors**: Custom CSS for perceptually uniform color system
5. **clamp()**: Custom CSS for responsive design without media queries
6. **Hybrid Approach**: Tailwind for utilities, custom CSS for design tokens

### Why TypeScript Strict Mode?
1. **Type Safety**: Catch errors at compile time (zero `any` types)
2. **Developer Experience**: Better IDE support (autocomplete, refactoring)
3. **Maintainability**: Self-documenting code with interfaces
4. **Refactoring**: Safe code changes with compile-time validation
5. **Content Collections**: Type-safe frontmatter with Zod integration

### Why Stylelint?
1. **CSS Quality**: Property ordering, OKLCH validation, no !important
2. **Consistency**: Recess order for predictable gzip compression
3. **Tailwind Integration**: Validate Tailwind-specific syntax
4. **Astro Support**: Lint `<style>` blocks in .astro files
5. **Performance**: Enforced best practices (e.g., max nesting depth)

### Why Cloudinary?
1. **Performance**: Global CDN with automatic format optimization
2. **Fetch API**: Transform external/local images without re-uploading
3. **Cost**: Free tier (25 GB storage + bandwidth) sufficient for project
4. **OG Images**: Automatic 1.91:1 aspect ratio transformation
5. **Developer Experience**: Simple public ID-based references

### Why OKLCH Color Space?
1. **Perceptual Uniformity**: Equal lightness steps look equally different
2. **Design Tokens**: Better for programmatic color manipulation
3. **Accessibility**: Easier to calculate WCAG contrast ratios
4. **Future-Proof**: Modern CSS standard, wider gamut support
5. **Developer Experience**: `oklch(from var(--color) l c h / alpha)` for opacity

### Why UnifiedSEO.astro?
1. **DRY Principle**: Single source of truth for all SEO metadata
2. **Structured Data**: Automatic JSON-LD generation (8+ Schema.org types)
3. **E-E-A-T**: Educational metadata and citations for expertise signals
4. **Maintainability**: Centralized updates, A/B testing capability
5. **Type Safety**: TypeScript Props interface for compile-time validation

### Why Auto-Date Processing?
1. **Accuracy**: Automated `modifiedDate` based on git history
2. **Developer Experience**: No manual date updates
3. **SEO**: Accurate `dateModified` for search engines
4. **Build Integration**: Runs automatically in build pipeline
5. **Caching**: Efficient processor only updates changed files

---

## File Structure

```
src/
├── components/          # Reusable UI components
│   ├── public-components/  # Public-facing components
│   ├── search/         # Search functionality
│   └── homepage/       # Homepage components
├── pages/              # Astro pages and routes
├── layouts/            # Page layouts
├── content/            # Content collections
├── utils/              # Utility functions
├── scripts/            # Client-side scripts
├── styles/             # Global styles
├── types/              # TypeScript definitions
└── data/               # Static data
```

---

## Configuration Files

### Core Configuration
- `astro.config.mjs`: Astro framework configuration
- `tailwind.config.mjs`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `eslint.config.js`: ESLint configuration
- `vitest.config.ts`: Testing configuration

### Package Management
- `package.json`: Dependencies and scripts
- `package-lock.json`: Exact dependency versions

---

## Development Workflow

### Local Development
```bash
npm run dev                    # Start development server (http://localhost:4321)
npm run dev:watch-dates        # File watcher for auto-date updates
npm run type-check             # TypeScript validation (tsc --noEmit)
npm run lint                   # ESLint (TypeScript/JavaScript/Astro)
npm run lint:fix               # ESLint with auto-fix
npm run stylelint              # Stylelint (CSS/SCSS/Astro) with auto-fix
npm run format                 # Prettier formatting
npm run format:check           # Check formatting without changes
```

### Quality Assurance
```bash
npm run quality                # Lint + Format + Type Check (comprehensive)
npm run test                   # Run Vitest tests
npm run test:coverage          # Run tests with coverage report
```

#### 品質チェック実行例
```bash
$ npm run quality
> gorakudo-astro@0.0.1 quality
> npm run lint && npm run format:check && npm run type-check

> gorakudo-astro@0.0.1 lint
> eslint src --ext .ts,.js,.astro

✅ ESLint: No errors

> gorakudo-astro@0.0.1 format:check
> prettier --check src/**/*.{ts,js,json,css,md}

✅ Prettier: All files formatted correctly

> gorakudo-astro@0.0.1 type-check
> tsc --noEmit

✅ TypeScript: No type errors

✅ All quality checks passed!
```

### Production Build
```bash
npm run build                  # Full production build with all checks
npm run build:quality          # Quality checks + build (alternative)
npm run preview                # Preview production build locally
```

#### 本番ビルド実行例
```bash
$ npm run build
> gorakudo-astro@0.0.1 build
> npm run stylelint && npm run lint && astro check && npm run process-auto-dates:fast && astro build

🎨 [Stylelint] Checking CSS/SCSS/Astro files...
✅ [Stylelint] All files pass

🔍 [ESLint] Linting TypeScript/JavaScript/Astro...
✅ [ESLint] No errors

🔎 [Astro Check] Type checking...
✅ [Astro Check] All types valid

📅 [Auto-Dates] Processing content dates...
✅ [Auto-Dates] 23 files updated

🚀 [Astro Build] Building static site...
20:23:15 [build] output: "static"
20:23:15 [build] mode: "static"
20:23:15 [build] directory: R:\GoRakuDo\dist\
20:23:15 [build] ✓ Completed in 512ms.
20:23:21 [build] 17 page(s) built in 6.66s
20:23:21 [build] Complete!

📦 [Compression] Generating gzip & brotli files...
✅ [Compression] 45 files compressed

✨ Build successful!
```

### Content Processing Scripts
```bash
npm run process-auto-dates           # Basic auto-date processor
npm run process-auto-dates:fast      # Efficient processor with caching
npm run process-auto-dates:clear     # Clear cache and reprocess
```

---

## Dependencies Summary

### Production Dependencies (Core)
- **astro**: ^5.13.0 - Core framework & SSG
- **typescript**: ^5.9.2 - Type system
- **@astrojs/check**: ^0.9.4 - Type checking
- **dotenv**: ^17.2.1 - Environment variables

### Astro Integrations
- **@astrojs/mdx**: ^4.3.6 - MDX support
- **@astrojs/sitemap**: ^3.6.0 - Sitemap generation
- **@astrojs/vue**: ^5.1.0 - Vue integration (deprecated, not used)

### Styling
- **tailwindcss**: ^4.1.13 - CSS framework
- **@tailwindcss/vite**: ^4.1.13 - Tailwind Vite integration
- **@tailwindcss/typography**: ^0.5.19 - Prose styling

### Fonts (Self-hosted)
- **@fontsource-variable/roboto-flex**: ^5.2.8
- **@fontsource-variable/roboto-serif**: ^5.2.8
- **@fontsource/noto-sans-jp**: ^5.2.8
- **@fontsource/noto-serif-jp**: ^5.2.7
- **@fontsource/yuji-syuku**: ^5.2.7

### Image & CDN
- **astro-cloudinary**: ^1.3.5 - Cloudinary integration

### Content & Data
- **fuse.js**: ^7.1.0 - Full-text search
- **chart.js**: ^4.5.0 - Data visualization
- **unist-util-visit**: ^5.0.0 - MDX AST traversal

### Security & Utilities
- **dompurify**: ^3.2.7 - HTML sanitization
- **@types/dompurify**: ^3.0.5

### Development Dependencies

#### Linting & Formatting
- **eslint**: ^9.34.0 - JavaScript/TypeScript linting
- **@typescript-eslint/eslint-plugin**: ^8.42.0
- **@typescript-eslint/parser**: ^8.42.0
- **eslint-plugin-astro**: ^1.3.1
- **eslint-plugin-vue**: ^10.4.0
- **eslint-plugin-prettier**: ^5.5.4
- **eslint-config-prettier**: ^10.1.8
- **prettier**: ^3.6.2 - Code formatting
- **stylelint**: ^16.24.0 - CSS linting
- **stylelint-config-standard**: ^39.0.0
- **stylelint-config-recess-order**: ^7.3.0
- **stylelint-config-html**: ^1.1.0
- **stylelint-config-tailwindcss**: ^1.0.0
- **postcss-html**: ^1.8.0

#### Testing
- **vitest**: ^3.2.4 - Testing framework
- **@vitest/coverage-v8**: ^3.2.4 - Coverage reporting
- **@testing-library/jest-dom**: ^6.8.0 - DOM matchers
- **jsdom**: ^26.1.0 - DOM simulation
- **@types/jest**: ^30.0.0

#### Build & Tooling
- **vite-plugin-compression**: ^0.5.1 - gzip & brotli compression
- **tsx**: ^4.20.6 - TypeScript execution
- **espree**: ^10.4.0 - JavaScript parser
- **vue-eslint-parser**: ^10.2.0
- **@types/node**: ^24.3.0

### Total Package Count
- **Production**: 30 packages
- **Development**: 30 packages
- **Total**: 60 packages

---

## Performance Metrics

### Build Performance
- **Build Time**: ~6.66s for 17 pages
- **Bundle Size**: Optimized chunks (largest: 74.69kB)
- **Asset Optimization**: Automatic image optimization

### Runtime Performance
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **JavaScript**: Minimal runtime JavaScript
- **Caching**: Service worker caching strategy

---

## Security Considerations

### Content Security
- **Input Validation**: Zod schema validation
- **XSS Prevention**: Astro's built-in protection
- **HTTPS**: Enforced in production

### Dependencies
- **Regular Updates**: Dependencies kept current
- **Vulnerability Scanning**: npm audit integration
- **Minimal Attack Surface**: Few external dependencies

---

## Future Considerations

### Potential Upgrades
- **Astro**: Keep updated with latest versions
- **Vue**: Monitor Vue 3 ecosystem updates
- **Tailwind**: Consider Tailwind CSS v4 migration
- **TypeScript**: Stay current with TypeScript releases

### Scalability
- **Content**: Content Collections scale well
- **Performance**: Static generation handles traffic
- **Maintenance**: Clear architecture for team growth

---

## Project-Specific Features

### Auto-Date Processing System
- **Purpose**: Automate `publishedDate`/`modifiedDate` management
- **Implementation**: TypeScript scripts with file watching
- **Integration**: Part of build pipeline
- **Benefits**: No manual date updates, accurate modification tracking

### Search Functionality
- **Engine**: Fuse.js (^7.1.0) - Fuzzy full-text search
- **Indexed Fields**: title, description, tags, keywords
- **Features**:
  - Typo-tolerant search
  - Multi-field matching
  - Weighted scoring
  - Real-time filtering

### Educational Metadata System
- **Purpose**: Enhance SEO with educational structured data
- **Schema.org Types**: Article, LearningResource, ScholarlyArticle
- **Fields**:
  - `learningResourceType`: "Tutorial", "Guide", "Article"
  - `educationalLevel`: "Beginner", "Intermediate", "Advanced"
  - `citation`: Academic references for E-E-A-T
  - `about`: Topic definitions with external links (sameAs)
  - `mentions`: Entities mentioned in content

### Content Workflow
1. **Draft System**: `draft: true/false` in frontmatter
2. **Auto-Dates**: Automated via TypeScript scripts
3. **Validation**: Zod schema validation at build time
4. **SEO Generation**: UnifiedSEO.astro automatic JSON-LD
5. **Sitemap**: Auto-generated from published content

### Multi-language Support
- **Current**: Indonesian (id) and Japanese (ja)
- **Implementation**: `lang` field in frontmatter
- **SEO**: Language-specific structured data
- **Fonts**: Language-specific font loading (Noto Sans/Serif JP)

---

## Conclusion

The GoRakuDo technology stack represents a modern, performance-focused, and SEO-optimized approach to educational web development. By leveraging Astro 5's static generation capabilities, OKLCH color space, Cloudinary CDN, and comprehensive tooling (Stylelint, ESLint, TypeScript), the project achieves:

### Key Strengths
- **Performance**: 
  - Zero-JS by default
  - Multi-layered image optimization (Cloudinary + Sharp)
  - Core Web Vitals optimized
  - gzip & brotli compression
  
- **SEO Excellence**:
  - UnifiedSEO.astro with 8+ Schema.org types
  - Educational metadata for learning content
  - Citation system for E-E-A-T enhancement
  - OG images auto-optimized to 1.91:1 (1200x630px)
  
- **Developer Experience**:
  - TypeScript strict mode
  - Comprehensive linting (ESLint, Stylelint)
  - Auto-date processing
  - Hot module replacement
  - Type-safe content collections
  
- **Maintainability**:
  - OKLCH color system (perceptually uniform)
  - Design tokens via CSS variables
  - Minimalist code principles (5-line rule)
  - clamp() for responsive design (minimal media queries)
  - Comprehensive documentation

### Technology Evolution
| Aspect | Old Approach | Current Approach |
|---|---|---|
| **Framework** | HTML/CSS/JS | Astro 5 (SSG) |
| **UI Library** | Vue.js | Pure Astro (Zero-JS) |
| **Colors** | RGB/Hex | OKLCH |
| **Responsive** | Media queries | clamp() + Mobile-first |
| **SEO** | Manual meta tags | UnifiedSEO + JSON-LD |
| **Images** | Local files | Cloudinary CDN + Sharp |
| **Linting** | ESLint only | ESLint + Stylelint |

### Future Roadmap
- ✅ Astro 5.x View Transitions (Implemented)
- ✅ OKLCH Color Space (Implemented)
- ✅ Educational Metadata (Implemented)
- ✅ Cloudinary Integration (Implemented)
- 🔄 Chart.js Integration (Partial - ready for data visualization)
- 📋 Performance monitoring (Planned)
- 📋 A/B testing for SEO (Planned)

For questions about the technology stack or suggestions for improvements, please open an issue or discuss with the development team.

### Related Documentation
- `astro-development-patterns.md` - Astro-specific patterns
- `coding-standards.md` - Code quality standards
- `og-image-optimization.md` - Image optimization details
- `source-tree.md` - Project structure
