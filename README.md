# 語楽道 (GoRakuDo)

[![Astro](https://img.shields.io/badge/Astro-5.13-purple?style=flat&logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

> **Platform pembelajaran bahasa Jepang berbasis sains linguistik modern dengan metode Comprehensible Input dan Immersion.**

**[🌐 Kunjungi Website Live](https://gorakudo.org)** | **[📚 Dokumentasi](https://gorakudo.org/docs)** | **[💬 Komunitas Discord](https://gorakudo.org/discord)**

---

## 🎯 Tentang Proyek

**GoRakuDo** (語楽道 - "Jalan Menyenangkan Bahasa") adalah platform pembelajaran bahasa Jepang komprehensif yang dibangun dengan prinsip **sains linguistik modern**. Terinspirasi dari teori **Second Language Acquisition (SLA)** Prof. Stephen Krashen, kami menyediakan:

- 📖 **Panduan Lengkap**: Metodologi immersion dari level pemula hingga mahir
- 🎓 **Dokumentasi**: Artikel mendalam tentang linguistik dan strategi belajar
- 🛠️ **Tutorial Tools**: Panduan aplikasi seperti Anki, Yomitan, Language Reactor
- 🔍 **Search Cerdas**: Pencarian dengan Fuse.js untuk navigasi cepat
- 👥 **Komunitas**: Akses ke komunitas Discord untuk dukungan dan praktik

---

## ✨ Fitur Utama

### 🏗️ Arsitektur Modern
- ⚡ **Static Site Generation (SSG)** dengan Astro 5.x
- 🎨 **Discord Dark Pop Design System** dengan OKLCH color space (Max Chroma 0.22)
- 🎴 **TCG Artifact Card Layouts** dengan vertical-rl typography
- 📱 **Floating Pill Navbar** & Transparent Mobile Header
- 🌊 **Cinematic WebP Backgrounds** pre-blurred untuk zero-lag scrolling
- ♿ **Accessibility-First**: WCAG-compliant, semantic HTML

### 🔧 Teknologi & Optimasi
- 🖼️ **Cloudinary Integration**: Optimasi gambar otomatis
- 🔍 **Fuse.js Search**: Fuzzy search dengan stopwords Indonesia & Jepang
- 📊 **SEO 2025 Optimized**: Structured data, OG images, sitemap
- 🚀 **Performance**: Brotli/Gzip compression, lazy loading, code splitting
- 🎯 **Type Safety**: TypeScript strict mode
- 🧪 **Quality Assurance**: Stylelint, ESLint, Prettier, Vitest

### 📝 Sistem Konten
- 📚 **Content Collections**: Type-safe MDX dengan Zod schema
- 🗓️ **Auto-Date Processing**: Sistem otomatis untuk publishedDate
- 🏷️ **Tag System**: Kategorisasi dan filtering konten
- 🔗 **Cross-References**: Related tools dan artikel

---

## 🛠️ Tech Stack

### Core Framework
- **Astro** `5.13.0` - Static Site Generator
- **TypeScript** `5.9.2` - Type safety
- **Tailwind CSS** `4.1.13` - Utility-first CSS
- **MDX** `4.3.6` - Markdown + JSX

### Integrations & Tools
- **astro-cloudinary** - Image optimization & CDN
- **@astrojs/sitemap** - Automatic sitemap generation
- **Fuse.js** - Fuzzy search engine
- **Chart.js** - Data visualization
- **DOMPurify** - XSS protection

### Development Tools
- **ESLint** + **Stylelint** - Code quality
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **tsx** - TypeScript execution

### Fonts
- **Gen Interface JP** - Primary Japanese sans-serif
- **Noto Serif JP** - Japanese serif untuk card titles (Cinematic contrast)
- **Pixelify Sans** - Pixel font untuk section markers (`/// GEARS_ACTIVATED ///`)
- **Yuji Syuku** - Decorative Japanese font untuk Logo & Accents

---

## 📂 Struktur Direktori

```
GoRakuDo/
├── src/
│   ├── components/          # Komponen Astro reusable
│   │   ├── animations/      # WaveAnimation, efek visual
│   │   ├── common/          # NavBar, Pagination, Breadcrumb, SearchPopover
│   │   ├── content/         # KrashenQuote, TableOfContents, FAQ
│   │   ├── docs/            # PostsGrid untuk halaman dokumentasi
│   │   ├── homepage/        # Hero, Features, Mission sections
│   │   ├── search/          # Search components
│   │   ├── tools/           # Tool grid, articles
│   │   ├── ui/              # Button, PageHeader, SearchForm
│   │   └── UnifiedSEO.astro # SEO management terpusat
│   ├── content/             # Content Collections (MDX)
│   │   ├── docs/            # 9 artikel dokumentasi
│   │   ├── pages/           # About Us, FAQ
│   │   └── tool-articles/   # Tutorial Anki, Yomitan
│   ├── data/                # JSON data files
│   │   ├── seo/pages/       # SEO data per halaman
│   │   ├── stopwords/       # Stopwords ID & JA
│   │   ├── tools.json       # Tool definitions
│   │   └── youtube-channels.json
│   ├── layouts/             # Layout templates
│   │   ├── ArticleLayout.astro
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/               # File-based routing
│   │   ├── docs/            # Dynamic routes untuk docs
│   │   ├── tools/           # Dynamic routes untuk tools
│   │   ├── search/          # Search interface
│   │   └── index.astro      # Homepage
│   ├── scripts/             # JavaScript utilities
│   │   └── type-scripts/    # TypeScript processors
│   ├── styles/              # Global & scoped CSS
│   │   ├── global.css       # CSS variables, base styles
│   │   ├── layouts/         # Layout-specific styles
│   │   └── pages/           # Page-specific styles
│   └── utils/               # Helper functions
│       ├── cloudinary.ts    # Image optimization
│       ├── content/         # Content processing
│       └── logging/         # Console utilities
├── public/                  # Static assets
│   ├── icon/                # Tool icons (WebP)
│   ├── img/                 # Images
│   └── favicon/             # Favicon assets
├── docs/                    # Project documentation
│   ├── architecture/        # Technical specs
│   └── context.md           # Project context
├── bmad-core/               # AI agent configurations
└── dist/                    # Build output
```

---

## 🚀 Quick Start

### Prasyarat
- **Node.js** `22.0+` ([Download](https://nodejs.org/))
- **npm** / **pnpm** / **yarn**
- **Git**

### Instalasi

1. **Clone repository:**
   ```bash
   git clone https://github.com/YoshiaKefasu/GoRakuDo.git
   cd GoRakuDo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables (opsional):**
   ```bash
   # Buat file .env.local untuk Cloudinary (opsional)
   # CLOUDINARY_CLOUD_NAME=your_cloud_name
   # CLOUDINARY_API_KEY=your_api_key
   # CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   
   Website akan berjalan di **`http://localhost:4321`** 🎉

---

## 📜 Perintah NPM

### Development

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Menjalankan development server dengan hot reload |
| `npm run dev:watch-dates` | Development dengan auto-date processing watcher |

### Build & Production

| Perintah | Fungsi |
|----------|--------|
| `npm run build` | Build production (dengan linting + type check) |
| `npm run build:quality` | Build dengan full quality checks |
| `npm run preview` | Preview build lokal sebelum deploy |

### Quality Assurance

| Perintah | Fungsi |
|----------|--------|
| `npm run quality` | Jalankan semua quality checks (lint + format + type) |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run stylelint` | Stylelint check & auto-fix |
| `npm run format` | Prettier formatting |
| `npm run format:check` | Check formatting tanpa modify |
| `npm run type-check` | TypeScript type checking |

### Testing

| Perintah | Fungsi |
|----------|--------|
| `npm run test` | Jalankan Vitest unit tests |
| `npm run test:coverage` | Test dengan coverage report |

### Content Processing

| Perintah | Fungsi |
|----------|--------|
| `npm run process-auto-dates` | Process publishedDate: 'auto' (basic) |
| `npm run process-auto-dates:fast` | Process dengan caching (efficient) |
| `npm run process-auto-dates:clear` | Clear cache dan reprocess |

---

## 🏗️ Fitur Teknis Lanjutan

### 1. Content Collections (Type-Safe)

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const docsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.union([z.string(), z.date()]),
    tags: z.array(z.string()).optional(),
    // ... more fields
  })
});
```

### 2. Auto-Date Processing System

File MDX dengan `publishedDate: 'auto'` akan otomatis diprocess menggunakan file stats:

```bash
npm run process-auto-dates:fast  # Dengan caching untuk efisiensi
```

### 3. Unified SEO Component

Semua halaman menggunakan `UnifiedSEO.astro` untuk:
- Meta tags otomatis (OG, Twitter Card, Schema.org)
- Image fallback system
- Canonical URLs
- Breadcrumb schema
- FAQ schema
- Structured data (Organization, WebSite, Article, etc.)

### 4. Dynamic Search with Fuse.js

Tiga endpoint search terpisah:
- `/search/Search.json` - Main search
- `/docs/DocsSearch.json` - Dokumentasi search
- `/tools/ToolsSearch.json` - Tools search

Dengan stopwords filtering untuk bahasa Indonesia dan Jepang.

### 5. Cloudinary Image Optimization

```typescript
import { buildCloudinaryUrl } from '@/utils/cloudinary';

// Auto-optimize image dengan transformations
const imageUrl = buildCloudinaryUrl('my-image-id');
// Result: https://res.cloudinary.com/.../w_600,q_auto,f_auto/my-image-id
```

### 6. Performance Optimizations

- ✅ **Brotli & Gzip compression** (threshold: 1KB)
- ✅ **Code splitting** dengan manual chunks
- ✅ **Image lazy loading** dengan Intersection Observer
- ✅ **WebP & AVIF** format otomatis
- ✅ **Critical CSS** inline untuk faster FCP
- ✅ **Preconnect & DNS-prefetch** untuk external resources

---

## 🎨 Desain System

### Color Palette (OKLCH)

```css
/* Primary Colors */
--token-purple-base: oklch(65% 0.18 280deg);
--token-purple-hover: oklch(70% 0.2 285deg);

/* Grayscale */
--clr-text-primary: oklch(95% 0.005 285deg);
--clr-text-secondary: oklch(75% 0.01 270deg);
--clr-background: oklch(5% 0.005 270deg);

/* Opacity System */
--opacity-step: 0.05;
--opacity-10: calc(var(--opacity-step) * 2);
--opacity-50: calc(var(--opacity-step-large) * 5);
```

### Typography Scale

```css
/* Responsive Typography dengan clamp() */
--font-size-xs: clamp(0.75rem, 1.5vw, 0.875rem);
--font-size-base: clamp(0.875rem, 2vw, 1rem);
--font-size-lg: clamp(1rem, 2.5vw, 1.25rem);
--font-size-xl: clamp(1.25rem, 3vw, 1.5rem);
--font-size-2xl: clamp(1.5rem, 4vw, 2rem);
```

### Spacing System (4px base)

```css
--spacing-sm: clamp(0.5rem, 2vw, 1rem);
--spacing-md: clamp(1rem, 3vw, 1.5rem);
--spacing-lg: clamp(1.5rem, 4vw, 2rem);
--spacing-xl: clamp(2rem, 5vw, 3rem);
```

---

## 🧪 Testing & Quality

### Linter Configuration

**Stylelint** - CSS quality enforcement:
- Max nesting depth: 3 levels
- Selector specificity: `0,3,0` max
- No `!important` allowed
- OKLCH color space required

**ESLint** - JavaScript/TypeScript quality:
- TypeScript strict mode
- No unused variables
- Consistent code style

### Testing dengan Vitest

```bash
npm run test              # Run unit tests
npm run test:coverage     # Dengan coverage report
```

### Quality Gates (Pre-Build)

```bash
npm run build
# Otomatis menjalankan:
# 1. Stylelint check & fix
# 2. ESLint check
# 3. Astro check (type checking)
# 4. Auto-date processing
# 5. Astro build
```

---

## 🚢 Deployment

### Build untuk Production

```bash
npm run build
```

Output akan berada di folder `dist/`.

### Deployment ke GitHub Pages

1. Push ke branch `main`
2. GitHub Actions akan otomatis build & deploy
3. Website live di `https://gorakudo.org`

### Manual Deployment

```bash
npm run build
npm run preview  # Test lokal dulu
# Upload folder dist/ ke hosting pilihan Anda
```

---

## 📝 Panduan Development

### Menambahkan Artikel Baru

1. **Dokumentasi** (`src/content/docs/`):
   ```bash
   # Buat file MDX baru
   touch src/content/docs/artikel-baru.mdx
   ```
   
   ```mdx
   ---
   title: "Judul Artikel"
   description: "Deskripsi singkat"
   publishedDate: 'auto'  # Otomatis dari file stats
   tags: ['tag1', 'tag2']
   status: 'published'
   ---
   
   Konten artikel di sini...
   ```

2. **Tutorial Tools** (`src/content/tool-articles/`):
   ```bash
   mkdir -p src/content/tool-articles/nama-tool
   touch src/content/tool-articles/nama-tool/artikel.mdx
   ```

### Menambahkan Tool Baru

Edit `src/data/tools.json`:

```json
{
  "id": "tool-baru",
  "name": "Tool Baru",
  "description": "Deskripsi tool...",
  "iconUrl": "/icon/tool-icon-240.webp",
  "icon": "🎯",
  "color": "var(--clr-purple)",
  "link": "/tools/tool-baru"
}
```

### Styling Guidelines

1. **Gunakan OKLCH** untuk semua warna
2. **Max 3 levels nesting** di CSS
3. **Mobile-First** responsive design
4. **Hindari `!important`** - gunakan specificity
5. **Gunakan CSS Variables** dari `global.css`
6. **Gunakan `clamp()`** untuk responsive values

---

## 🔍 Fitur Pencarian

### Search API Endpoints

- **Main Search**: `/search/Search.json`
- **Docs Search**: `/docs/DocsSearch.json`
- **Tools Search**: `/tools/ToolsSearch.json`

### Konfigurasi Fuse.js

```javascript
const fuseOptions = {
  keys: ['title', 'description', 'tags'],
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: true
};
```

---

## 🤝 Contributing

Kontribusi sangat diterima! Ikuti langkah berikut:

1. **Fork repository** ini
2. **Buat branch** untuk fitur Anda (`git checkout -b feature/AmazingFeature`)
3. **Jalankan quality checks** (`npm run quality`)
4. **Commit perubahan** (`git commit -m 'Add: Amazing Feature'`)
5. **Push ke branch** (`git push origin feature/AmazingFeature`)
6. **Buka Pull Request**

### Contribution Guidelines

- ✅ Pastikan semua quality checks pass
- ✅ Ikuti existing code style
- ✅ Tambahkan tests untuk fitur baru
- ✅ Update dokumentasi jika perlu
- ✅ Gunakan commit messages yang deskriptif

---

## 📊 Performance Metrics

### Core Web Vitals (Target)

| Metric | Target | Current Status |
|--------|--------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ ~456ms (avg) |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✅ 0.00 |
| **TTFB** (Time to First Byte) | < 200ms | ✅ ~39ms (avg) |

### Optimization Features

- ⚡ Static Site Generation (zero JS by default)
- 🖼️ Image optimization (WebP, AVIF, lazy loading)
- 📦 Code splitting & tree shaking
- 🗜️ Brotli & Gzip compression
- 🎯 Resource hints (preconnect, dns-prefetch)
- 💾 Browser caching strategy

---

## 📚 Dokumentasi Tambahan

- 📖 **Project Context**: `docs/context.md`
- 🏗️ **Architecture**: `docs/architecture/`
- 🎨 **Coding Bible**: `docs/architecture/coding-bible/coding-bible.md`
- 🔧 **Astro Patterns**: `docs/architecture/astro-development-patterns.md`
- ♿ **Accessibility**: `docs/architecture/astro-dev-toolbar-audit.md`
- 📊 **Performance**: `docs/performance/`

---

## 🐛 Troubleshooting

### Server Development Tidak Berjalan

```bash
# Clear cache dan restart
rm -rf node_modules/.vite
npm run dev
```

### Build Error

```bash
# Check linter errors
npm run stylelint
npm run lint

# Check type errors
npm run type-check
```

### Gambar Tidak Muncul

```bash
# Pastikan file ada di public/
ls public/icon/
ls public/img/

# Check browser console untuk 404 errors
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **[Mozilla Public License Version 2.0](./LICENSE)**.

```
Copyright © 2024-2025 GoRakuDo Team

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
```

---

## 💡 Filosofi Proyek

**GoRakuDo** dibangun dengan prinsip:

1. 🎯 **Evidence-Based Learning**: Berdasarkan riset SLA dan linguistik modern
2. 🌃 **Night Library Aesthetic**: Desain gelap, imersif, dan sinematik dengan "Discord Dark Pop" vibe
3. 🚀 **Performance-First**: Pre-blurred backgrounds dan optimasi aset untuk zero-lag experience
4. ♿ **Accessibility-First**: Website untuk semua orang dengan WCAG contrast compliance
5. 📱 **Mobile-First**: Mayoritas pengguna di mobile dengan pengalaman navigasi yang dioptimalkan

---

## 🙏 Acknowledgments

- **Prof. Stephen Krashen** - Teori Comprehensible Input
- **Astro Team** - Framework luar biasa
- **Komunitas Open Source** - Tools dan libraries yang amazing

---

## 📞 Kontak & Support

- 🌐 **Website**: [gorakudo.org](https://gorakudo.org)
- 💬 **Discord**: [Join Komunitas](https://gorakudo.org/discord)
- 🐛 **Issues**: [GitHub Issues](https://github.com/YoshiaKefasu/GoRakuDo/issues)

---

**Dibuat dengan ❤️ untuk komunitas pembelajar bahasa Jepang Indonesia**

*Versi terakhir diperbarui: Mei 2026*
