# Astro Development Patterns & Architectural Decisions

**CRITICAL DOCUMENT:** This is a living document and the single source of truth for all Astro implementation patterns in this project. All agents, especially `dev-astro` and `architect`, MUST adhere to these guidelines. These rules override any generic best practices.

**Mandatory:** Always Consult Astro Documentation ( search_astro_docs on mcp tools or @web ). Recall the most idiomatic, performant, and "Astro-native" way to achieve that goal.

**Purpose:** To ensure consistency, performance, and maintainability across the entire Astro codebase.

**Last Updated**: 2025-10-13  
**Version**: 2.0

---

## 目次

### 基本パターン
1. [Component Architecture](#1-component-architecture)
2. [Content Collections](#2-content-collections)
3. [Layout System & Slots](#3-layout-system--slots)
4. [SEO & Metadata Management](#4-seo--metadata-management)
5. [Image Optimization](#5-image-optimization)
6. [Interactivity & Client-Side JavaScript](#6-interactivity--client-side-javascript)
7. [Styling](#7-styling)
8. [API Endpoints](#8-api-endpoints)
9. [Performance Optimization](#9-performance-optimization)
10. [TypeScript Patterns](#10-typescript-patterns)

### 応用パターン
11. [Project-Specific Patterns](#11-project-specific-patterns)
12. [Development Guidelines](#12-development-guidelines)
13. [Migration from Old Patterns](#13-migration-from-old-patterns)
14. [Performance Metrics & Goals](#14-performance-metrics--goals)
15. [Best Practices Summary](#15-best-practices-summary)

### 参考資料
16. [References](#16-references)
17. [Version History](#17-version-history)

---

## 1. Component Architecture

### Principle: A Clear Hierarchy of Components

**Directive:** Components MUST be organized into categorized directories based on their purpose and reusability scope.

#### Component Directory Structure

```
src/components/
├── animations/        # アニメーション関連コンポーネント
├── common/           # 汎用共通コンポーネント（Navbar, Breadcrumb, Pagination等）
├── content/          # コンテンツ表示コンポーネント（FAQ, TableOfContents等）
├── docs/             # ドキュメントページ専用コンポーネント
├── homepage/         # ホームページ専用コンポーネント
├── search/           # 検索機能コンポーネント
├── tools/            # ツールページ専用コンポーネント
├── ui/               # 汎用UIコンポーネント（Button, PageHeader等）
└── UnifiedSEO.astro  # SEO/メタデータ管理コンポーネント（全ページ共通）
```

#### コンポーネント分類ルール

| ディレクトリ | 用途 | 再利用性 | 例 |
|---|---|---|---|
| **`common/`** | 全ページで使用 | ✅ 高 | Navbar, Breadcrumb, Pagination |
| **`ui/`** | 汎用UIパーツ | ✅ 高 | Button, PageHeader, SearchForm |
| **`content/`** | コンテンツ表示 | ✅ 中 | FAQ, TableOfContents, KrashenQuote |
| **`homepage/`** | ホームページのみ | ❌ 低 | Hero, MissionSection, FeatureCard |
| **`docs/`** | ドキュメントページのみ | ❌ 低 | PostsGrid |
| **`tools/`** | ツールページのみ | ❌ 低 | Tools-GridSection |
| **`animations/`** | アニメーション | ✅ 中 | WaveAnimation |
| **`search/`** | 検索機能 | ✅ 中 | SearchSection, CategorySection |

**Rationale:** この分類により、コンポーネントの用途と再利用範囲が明確になり、適切なコンポーネント選択が容易になります。

#### ✅ Good Example

```astro
// ✅ 汎用ボタン → ui/
src/components/ui/Button.astro

// ✅ ホームページ専用ヒーロー → homepage/
src/components/homepage/hero.astro

// ✅ 全ページで使うナビゲーション → common/
src/components/common/NavBar/Navbar.astro
```

#### ❌ Bad Example

```astro
// ❌ すべてをcomponents/直下に配置
src/components/Button.astro
src/components/Hero.astro
src/components/Navbar.astro  // 分類が不明確
```

---

## 2. Content Collections

### Principle: Type-Safe Content Management with Zod Schema

**Directive:** All structured content MUST be managed through Astro Content Collections with strict Zod schema validation. This is **mandatory** for all blog posts, documentation, tool articles, and pages.

#### Content Collections Structure

```
src/content/
├── docs/              # ドキュメント記事（MDX）
├── pages/             # 静的ページ（MDX）
├── tool-articles/     # ツール記事（MDX）
└── config.ts          # Collection schemas（Zod）
```

#### Schema Definition Pattern

**場所**: `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

// ✅ 設定定数を一元管理
const LIMITS = {
  TITLE_MAX: 180,
  DESCRIPTION_MAX: 280,
  KEYWORD_MAX: 60,
  KEYWORDS_MAX: 15,
} as const;

const DEFAULTS = {
  AUTHOR: 'Tim GoRakuDo',
  STATUS: 'draft' as const,
} as const;

// ✅ 厳密なスキーマ定義
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(LIMITS.TITLE_MAX),
    description: z.string().min(10).max(LIMITS.DESCRIPTION_MAX),
    publishedDate: z.string(),
    author: z.string().default(DEFAULTS.AUTHOR),
    categories: z.array(z.string()).min(1).max(5),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string().max(LIMITS.KEYWORD_MAX)).max(LIMITS.KEYWORDS_MAX),
    status: z.enum(['published', 'draft', 'archived']).default('draft'),
    featuredImage: z.string().optional(),
    // Schema.org Educational Metadata
    learningResourceType: z.union([z.string(), z.array(z.string())]).optional(),
    educationalLevel: z.union([z.string(), z.array(z.string())]).optional(),
    citation: z.array(z.object({...})).optional(),
  }),
});

export const collections = {
  docs: docsCollection,
  pages: pagesCollection,
  'tool-articles': toolArticlesCollection,
};
```

#### Content Fetching Patterns

```typescript
// ✅ Good - getCollection for all entries
import { getCollection } from 'astro:content';
const docs = await getCollection('docs', ({ data }) => data.status === 'published');

// ✅ Good - getEntry for single entry
import { getEntry } from 'astro:content';
const post = await getEntry('docs', 'getting-started');

// ❌ Bad - Astro.glob() for structured content
const posts = await Astro.glob('../content/docs/*.mdx');  // 型安全性なし
```

#### Key Features in This Project

1. **Flexible Schema.org Metadata**: `z.union()` for flexible string/array types
2. **Strict Validation**: Character limits, regex patterns for data quality
3. **SEO-Optimized**: Keywords, citations, educational metadata
4. **Status Management**: Draft/Published/Archived workflow

**Rationale:** Content Collections provide build-time validation, preventing runtime errors and ensuring data consistency across all content.

---

## 3. Layout System & Slots

### Principle: Flexible Composition through Named Slots

**Directive:** Layouts MUST use named slots for maximum flexibility. Each slot serves a specific purpose and allows parent components to inject custom content.

#### PostLayout Slot Architecture

**場所**: `src/layouts/PostLayout.astro`

```astro
<PostLayout ...props>
  <!-- 7つの名前付きスロット -->
  <slot name="breadcrumb" />     <!-- パンくずリスト -->
  <slot name="header" />          <!-- ページヘッダー -->
  <slot name="featured-image" />  <!-- アイキャッチ画像 -->
  <slot name="content" />         <!-- メインコンテンツ（必須） -->
  <slot name="actions" />         <!-- アクションボタン -->
  <slot name="footer" />          <!-- フッター -->
  <slot name="sidebar">           <!-- サイドバー（デフォルトTOC） -->
    <!-- デフォルト実装 -->
  </slot>
  <slot name="additional-sidebar" /> <!-- 追加サイドバー -->
</PostLayout>
```

#### Usage Pattern

```astro
---
// src/pages/docs/[slug].astro
import PostLayout from '../../layouts/PostLayout.astro';
import Breadcrumb from '../../components/common/Breadcrumb.astro';
---

<PostLayout {...seoData}>
  <!-- Breadcrumb Slot -->
  <Breadcrumb 
    slot='breadcrumb'
    {post}
    currentPath={resolvedPath}
  />

  <!-- Header Slot -->
  <header slot='header'>
    <h1>{post.data.title}</h1>
  </header>

  <!-- Content Slot (必須) -->
  <div slot='content'>
    <Content />
  </div>
</PostLayout>
```

#### Slot Benefits

| メリット | 説明 |
|---|---|
| **柔軟性** | ページごとにカスタマイズ可能 |
| **再利用性** | 同じレイアウトで異なるコンテンツ |
| **保守性** | レイアウト変更が全ページに反映 |
| **型安全性** | Props interfaceで型チェック |

**Rationale:** Named slotsにより、レイアウトの構造を維持しながら、各ページが独自のコンテンツを注入できます。

---

## 4. SEO & Metadata Management

### Principle: Centralized, JSON-Driven SEO Configuration

**Directive:** All SEO metadata MUST be managed through the `UnifiedSEO.astro` component with JSON configuration files for consistency and maintainability.

#### SEO Architecture

```
src/
├── components/
│   └── UnifiedSEO.astro           # 統一SEOコンポーネント（720行）
├── data/
│   └── seo/
│       ├── unifiedSeo-config.json # グローバルSEO設定
│       └── pages/
│           ├── index.json         # ホームページSEO
│           ├── docs.json          # ドキュメント一覧SEO
│           ├── about-us.json      # About UsSEO
│           └── tools.json         # ツール一覧SEO
```

#### UnifiedSEO Component Features

**場所**: `src/components/UnifiedSEO.astro`

```typescript
interface Props {
  // 基本SEO
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  lang?: 'id' | 'ja';
  pageType?: 'website' | 'article';
  image?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  
  // Schema.org Structured Data
  breadcrumbSchema?: BreadcrumbSchema;
  faqSchema?: FAQSchema;
  howToSchema?: HowToSchema;
  collectionPageSchema?: CollectionPageSchema;
  softwareApplicationSchema?: SoftwareApplicationSchema;
  websiteSchema?: WebsiteSchema;
  
  // Educational Metadata（Schema.org）
  learningResourceType?: string | string[];
  educationalLevel?: string | string[];
  about?: string | Array<{type: string; name: string; ...}>;
  mentions?: string[] | Array<{type: string; name: string; ...}>;
  citation?: Array<{type: string; author: string|string[]; ...}>;
  
  // Resource Hints
  preconnect?: string[];
  dnsPrefetch?: string[];
  prefetch?: string[];
  preload?: PreloadResource[];
}
```

#### JSON Configuration Pattern

```json
{
  "seoData": {
    "title": "...",
    "description": "...",
    "pageType": "article",
    "author": "Tim GoRakuDo",
    "publishedDate": "2025-09-30T18:45:16.276Z",
    "lang": "id",
    "keywords": [...]
  },
  "faqSchema": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [...]
  },
  "breadcrumbData": {
    "items": [...]
  }
}
```

#### Implementation Pattern

```astro
---
import UnifiedSEO from '../components/UnifiedSEO.astro';
import seoConfig from '../data/seo/pages/about-us.json';

const seoData = {
  ...seoConfig.seoData,
  lang: seoConfig.seoData.lang as 'id' | 'ja',  // 型アサーション
};
---

<html lang={seoData.lang}>
  <head>
    <UnifiedSEO 
      {...seoData}
      faqSchema={seoConfig.faqSchema}
    />
  </head>
</html>
```

#### Key Features

1. **統一されたメタタグ管理**: OG, Twitter Card, Schema.org JSON-LD
2. **画像自動最適化**: Cloudinary変換（1200x630px、1.91:1）
3. **Resource Hints**: preconnect, dns-prefetch, prefetch, preload
4. **Structured Data**: Organization, Article, FAQ, HowTo, etc.
5. **Educational Metadata**: learningResourceType, educationalLevel, citation

**Rationale:** 一元管理により、SEO設定の一貫性を保ち、重複を排除し、保守性を向上させます。

---

## 5. Image Optimization

### Principle: All Images Must Be Optimized for Web Delivery

**Directive:** This project uses **Cloudinary** as the primary image optimization and delivery solution. All images MUST follow the optimization patterns defined below.

#### Image Handling Patterns

| 画像タイプ | 推奨方法 | 例 | 用途 |
|---|---|---|---|
| **Cloudinary Public ID** | `featuredImage: 'public-id'` | `gorakudo-tired-study_zhhh2b` | OG Image, Featured Image |
| **Cloudinary CldImage** | `<CldImage src="..." />` | コンポーネント内画像 | ページコンテンツ内の画像 |
| **Static Assets** | `public/` folder | favicon, manifest | 処理不要な静的ファイル |

#### OG Image自動変換システム

**実装**: `src/components/UnifiedSEO.astro` (269-302行目)

```typescript
const createFullImageUrl = (imagePath?: string, forOgImage = false): string => {
  // Cloudinary public_idの場合
  if (isCloudinaryId) {
    const transform = forOgImage ? 'c_pad,w_1200,h_630,b_auto,f_auto,q_auto' : '';
    return `https://res.cloudinary.com/dbvd1cm7u/image/upload/${transform}/${imagePath}`;
  }
  
  // ローカル/外部URLの場合（Cloudinary Fetch）
  if (forOgImage) {
    const fullUrl = imagePath.startsWith('http') ? imagePath : joinUrl(getSiteUrl(), imagePath);
    return `https://res.cloudinary.com/dbvd1cm7u/image/fetch/c_pad,w_1200,h_630,b_auto,f_auto,q_auto/${fullUrl}`;
  }
  
  return normalizeUrl(imagePath);
};
```

#### Key Features

| 機能 | パラメータ | 効果 |
|---|---|---|
| **Padding Mode** | `c_pad` | 画像を切らずに余白追加 |
| **Size Optimization** | `w_1200,h_630` | 1.91:1 (FB/Twitter推奨) |
| **Background Auto** | `b_auto` | 背景色を画像に合わせて自動選択 |
| **Format Auto** | `f_auto` | WebP対応ブラウザに自動配信 |
| **Quality Auto** | `q_auto` | ファイルサイズと品質を自動最適化 |

#### ✅ Best Practices

```yaml
# MDX Frontmatter
---
# ✅ Good - Cloudinary public_id（推奨）
featuredImage: 'gorakudo-tired-study_zhhh2b'

# ⚠️ OK - ローカル画像（Fetch使用、コスト注意）
featuredImage: '/img/local-image.png'

# ⚠️ OK - 外部URL（一時的な用途のみ）
featuredImage: 'https://external-cdn.com/temp-banner.jpg'
---
```

**詳細**: `docs/architecture/og-image-optimization.md` を参照

---

## 6. Interactivity & Client-Side JavaScript

### Principle: Zero-JavaScript by Default, Minimal When Needed

**Directive:** Interactivity is an **exception**, not the rule. Client-side JavaScriptは必要最小限に留め、主に`is:inline`と`define:vars`を使用します。

#### Current Usage in Project

```
総ファイル数: 33 Astroファイル
client:* 使用: 0ファイル（UIフレームワークアイランドなし）
is:inline 使用: 16ファイル（軽量インラインスクリプト）
```

#### Interactivity Patterns

##### 1. **インラインスクリプト（is:inline）**

```astro
<!-- ✅ Good - Minimal inline script -->
<script is:inline>
  window.handleImgError = function(e) {
    e.onerror = null;
    e.src = '/img/fallback.png';
  }
</script>
```

**用途**: 
- 画像フォールバック
- グローバル関数定義
- 即時実行が必要な処理

##### 2. **変数受け渡し（define:vars）**

```astro
<script is:inline define:vars={{ postData }}>
  const sharePost = () => {
    navigator.share({
      title: postData?.title,
      url: window.location.href
    });
  };
  window.sharePost = sharePost;
</script>
```

**用途**:
- サーバーサイドデータをクライアントに渡す
- 動的な設定値をスクリプトで使用

##### 3. **標準スクリプト（モジュール化）**

```astro
<script>
  // ✅ モジュールスコープ（ページ間で独立）
  const initAnimation = () => {
    // アニメーション初期化
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimation);
  } else {
    initAnimation();
  }
</script>
```

#### Decision Tree for Interactivity

```
インタラクティブ機能が必要？
    ↓
NO → Static HTMLとCSSのみ（✅ 推奨）
YES → ↓

単純なDOM操作？
    ↓
YES → <script is:inline>（✅ 推奨）
NO → ↓

状態管理が必要？
    ↓
NO → 標準<script>タグ（✅ 推奨）
YES → ↓

複雑なUIロジック？
    ↓
YES → UIフレームワーク検討（⚠️ 最終手段）
```

#### ❌ Avoid

```astro
<!-- ❌ Bad - 不要なReact/Vueアイランド -->
<Counter client:load />  <!-- すべてのページでJSバンドル -->

<!-- ✅ Good - 純粋なAstro + minimal JS -->
<button onclick="count++">Click</button>
<script is:inline>
  let count = 0;
</script>
```

**Rationale:** このプロジェクトは**完全にUIフレームワーク不使用**で構築されており、優れたパフォーマンスを達成しています。この方針を継続します。

---

## 7. Styling

### Principle: Scoped Styles by Default, Global When Necessary

**Directive:** All component styles MUST use scoped `<style>` tags unless explicitly marked as global with `is:global`.

#### Styling Architecture

```
src/styles/
├── global.css                # グローバルスタイル（CSS変数、リセット）
├── layouts/
│   ├── PostLayout.css       # PostLayout専用スタイル
│   └── ArticleLayout.css    # 記事レイアウト専用
└── pages/
    ├── homepage.css         # ホームページ専用
    └── docs/
        └── docs-index.css   # ドキュメント一覧専用
```

#### Scoped vs Global

##### ✅ Scoped Styles（推奨）

```astro
<style>
  /* コンポーネント内でのみ適用 */
  .button {
    padding: 1rem;
    background: var(--clr-primary);
  }
</style>
```

##### ✅ Global Styles（必要な場合のみ）

```astro
<style is:global>
  /* プロースコンテンツ内の<blockquote>スタイル */
  article blockquote {
    font-family: var(--font-serif);
    font-weight: 500;
  }
</style>
```

#### CSS Organization Pattern

```css
/* コンポーネントCSS構造 */

/* 1. CSS変数定義 */
:root {
  --card-padding: clamp(1rem, 2vw, 1.5rem);
  --grid-gap: clamp(1rem, 3vw, 2rem);
}

/* 2. ベーススタイル */
.component-base {
  /* 基本スタイル */
}

/* 3. バリアント */
.component--variant {
  /* バリエーション */
}

/* 4. 状態 */
.component:hover,
.component:focus-visible {
  /* インタラクション */
}

/* 5. レスポンシブ（clamp()推奨） */
@media (max-width: 768px) {
  /* モバイル調整 */
}
```

#### ✅ Responsive Design with clamp()

```css
/* ✅ Good - fluid, responsive values */
.card {
  padding: clamp(1rem, 2vw, 1.5rem);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  gap: clamp(0.5rem, 1vw, 1rem);
}

/* ❌ Bad - multiple media queries */
.card { padding: 1rem; }
@media (min-width: 640px) { .card { padding: 1.25rem; } }
@media (min-width: 1024px) { .card { padding: 1.5rem; } }
```

**Rationale:** `clamp()`により、メディアクエリを大幅に削減し、メンテナンス性とパフォーマンスを向上させます（実績: `docs-index.css`で23%削減）。

---

## 8. API Endpoints

### Principle: Type-Safe JSON APIs for Search and Data

**Directive:** API routes MUST follow a consistent JSON response structure and use TypeScript for type safety.

#### API Structure

```
src/pages/
├── search/
│   └── Search.json.ts        # 検索API
├── docs/
│   └── DocsSearch.json.ts    # ドキュメント検索API
└── tools/
    └── ToolsSearch.json.ts   # ツール検索API
```

#### Standard API Pattern

```typescript
// ✅ Good - Type-safe API endpoint
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs', ({ data }) => data.status === 'published');
  
  return new Response(JSON.stringify({
    success: true,
    data: docs.map(doc => ({
      title: doc.data.title,
      slug: doc.slug,
      description: doc.data.description
    }))
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

#### Response Structure

```typescript
// 成功レスポンス
{
  "success": true,
  "data": T[]  // 型安全なデータ
}

// エラーレスポンス
{
  "success": false,
  "error": {
    "code": string,
    "message": string
  }
}
```

---

## 9. Performance Optimization

### Principle: Every Millisecond Counts

**Directive:** Performance optimization is **mandatory**, not optional. All implementation decisions must consider their performance impact.

#### Optimization Techniques in This Project

##### 1. **CSS Optimization**

```css
/* ✅ clamp()による responsive values */
--card-padding: clamp(1rem, 2vw, 1.5rem);

/* 削減効果 */
Before: ~100 lines of media queries
After:  ~1 line with clamp()
削減率: 23%
```

##### 2. **Image Optimization**

```typescript
// Cloudinary自動最適化
- Format: f_auto (WebP自動配信)
- Quality: q_auto (ファイルサイズ最適化)
- Responsive: sizes属性による適切なサイズ配信
```

##### 3. **Resource Hints**

```html
<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://res.cloudinary.com" />

<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />

<!-- Prefetch -->
<link rel="prefetch" href="/docs" />
```

##### 4. **Script Optimization**

```astro
<!-- ✅ is:inline - No bundling overhead -->
<script is:inline>
  window.utilityFunction = () => {...}
</script>

<!-- ❌ 通常のscript - Viteバンドル処理 -->
<script>
  import { heavy } from './heavy-lib';  // バンドルサイズ増加
</script>
```

#### Performance Checklist

- [ ] 画像はCloudinary経由で配信されているか？
- [ ] CSS は clamp() を活用しているか？
- [ ] 不要なJavaScriptバンドルはないか？
- [ ] Resource Hintsは適切に設定されているか？
- [ ] OG Imageは1200x630pxに最適化されているか？

---

## 10. TypeScript Patterns

### Principle: Type Safety Without Complexity

**Directive:** TypeScript is mandatory for all `.ts` and `.astro` files. Type definitions MUST be clear, minimal, and maintainable.

#### Component Props Pattern

```typescript
// ✅ Good - Export interface for reusability
export interface Props {
  title: string;
  description: string;
  publishedDate?: string;
  lang?: 'id' | 'ja';  // Literal types for strict typing
  tags?: string[];
}

// Props destructuring with defaults
const {
  title,
  description,
  publishedDate,
  lang = 'id',
  tags = [],
} = Astro.props;
```

#### Type Assertion Pattern

```typescript
// ✅ Good - Type assertion for JSON imports
const seoData = {
  ...config.seoData,
  lang: config.seoData.lang as 'id' | 'ja',  // JSON string → literal type
};
```

#### Union Types for Flexibility

```typescript
// ✅ Good - Flexible schema.org metadata
learningResourceType?: string | string[];
about?: string | Array<{
  type: string;
  name: string;
  description?: string;
  sameAs?: string;
}>;
```

#### Type Reuse Pattern

```typescript
// ✅ Good - Import and reuse types
import type { Props as UnifiedSEOProps } from '../components/UnifiedSEO.astro';

interface LayoutProps {
  breadcrumbSchema?: UnifiedSEOProps['breadcrumbSchema'];
  faqSchema?: UnifiedSEOProps['faqSchema'];
}
```

---

## 11. Project-Specific Patterns

### Pattern 1: Unified SEO + JSON Config

**Problem:** SEO設定が各ページにハードコードされ、一貫性がない

**Solution:** UnifiedSEO.astro + JSON設定ファイル

```
1. グローバル設定 → unifiedSeo-config.json
2. ページ別設定 → src/data/seo/pages/[page].json
3. 記事メタデータ → MDX frontmatter
4. 統合 → UnifiedSEO.astro
```

### Pattern 2: Content Collection + Zod Validation

**Problem:** コンテンツデータの不整合、ランタイムエラー

**Solution:** Zod schemaによるビルド時バリデーション

```typescript
// 厳密な型定義
title: z.string().min(1).max(180)
keywords: z.array(z.string().max(60)).max(15)
status: z.enum(['published', 'draft', 'archived'])
```

### Pattern 3: Cloudinary Hybrid Approach

**Problem:** 画像サイズ・形式がバラバラ、OG Imageが最適化されていない

**Solution:** 
- **頻繁に使う画像**: Cloudinary Upload（public_id）
- **一時的な画像**: Cloudinary Fetch
- **OG Image**: 自動で1200x630pxに変換

### Pattern 4: Slot-Based Layouts

**Problem:** レイアウトの柔軟性がない

**Solution:** 7つの名前付きスロットで高い柔軟性

```astro
<PostLayout>
  <Breadcrumb slot="breadcrumb" />
  <Header slot="header" />
  <Content slot="content" />
</PostLayout>
```

---

## 12. Development Guidelines

### File Naming Conventions

| タイプ | 形式 | 例 |
|---|---|---|
| **Astro Components** | PascalCase | `Navbar.astro`, `PostLayout.astro` |
| **Pages** | kebab-case | `index.astro`, `[slug].astro` |
| **Utilities** | camelCase | `collections.ts`, `breadcrumb-schema.ts` |
| **Styles** | kebab-case | `PostLayout.css`, `docs-index.css` |
| **JSON Config** | kebab-case | `about-us.json`, `unifiedSeo-config.json` |

### Component Structure Template

```astro
---
// ========== IMPORTS ==========
import Layout from '../layouts/Layout.astro';
import Component from '../components/Component.astro';

// ========== TYPE DEFINITIONS ==========
export interface Props {
  title: string;
  description?: string;
}

// ========== PROPS DESTRUCTURING ==========
const {
  title,
  description = 'Default description',
} = Astro.props;

// ========== DATA FETCHING ==========
const data = await getCollection('docs');

// ========== UTILITY FUNCTIONS ==========
const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID');
---

<!-- ========== TEMPLATE ========== -->
<Layout {title}>
  <main>
    <h1>{title}</h1>
    <p>{description}</p>
  </main>
</Layout>

<!-- ========== STYLES ========== -->
<style>
  /* Scoped styles */
  main {
    padding: 2rem;
  }
</style>

<!-- ========== SCRIPTS ========== -->
<script is:inline>
  // Minimal client-side logic
</script>
```

### Astro Dev Toolbar Audit (MANDATORY)

**Directive:** すべてのページは、開発環境でAstro Dev Toolbar Auditを実行し、エラー0を確認してからコミットします。

#### Audit実行方法

```bash
# 1. 開発サーバー起動
npm run dev

# 2. ブラウザで対象ページを開く
http://localhost:4321/your-page

# 3. 画面下部のAstro Dev Toolbarから「Audit」をクリック

# 4. エラー0を確認
# ✅ "No accessibility or performance issues detected."
```

#### よくある Audit エラーと解決方法

##### エラー1: `article - Interactive ARIA role used on non-interactive HTML element`

**原因**: セマンティックHTML要素（`<article>`、`<section>`など）にインタラクティブARIAロール（`gridcell`、`button`など）を使用

**解決策**: `<div>`に変更してARIAロールで意味を付与

```astro
<!-- ❌ Before -->
<article role="gridcell" aria-label="Article: ...">
  <a href="/article">Content</a>
</article>

<!-- ✅ After -->
<div role="gridcell" aria-label="Article: ...">
  <a href="/article">Content</a>
</div>
```

##### エラー2: `a - Invalid 'href' attribute`

**原因**: `href="#"`の使用（無効なリンク）

**解決策**: 条件分岐で`<a>`と`<button disabled>`を使い分け

```astro
<!-- ❌ Before -->
<a href={url || '#'} aria-disabled={!url}>Link</a>

<!-- ✅ After -->
{
  url ? (
    <a href={url}>Link</a>
  ) : (
    <button disabled type="button">Link</button>
  )
}
```

##### エラー3: `h2 - Missing content`

**原因**: 非表示の見出し要素に実際のテキストコンテンツがない

**解決策**: `<div>`に変更してARIAロールで見出しレベルを指定

```astro
<!-- ❌ Before -->
<h2 class="menu-overlay-title">Menu</h2>

<!-- ✅ After -->
<div class="menu-overlay-title" role="heading" aria-level="2">Menu</div>
```

#### Audit対応フロー（3分で完了）

```
1. Auditでエラー検出（30秒）
    ↓
2. エラータイプを特定（30秒）
    ↓
3. 上記パターンに従って修正（1.5分）
    ↓
4. Audit再実行で確認（30秒）
    ↓
✅ エラー0確認
```

#### 重要な原則

1. **セマンティックHTML優先**: ネイティブHTML要素を優先し、ARIAは補完的に使用
2. **正しい要素選択**: リンクは`<a>`、ボタンは`<button>`、無効化は`<button disabled>`
3. **Audit統合**: 開発ワークフローにAuditを組み込み、早期発見・早期修正

**参考**: `docs/architecture/coding-standards.md` - Accessibility Standards セクション

---

### Code Review Checklist

#### Before Committing

- [ ] Props interfaceが`export`されているか？
- [ ] スタイルは`<style>`（scoped）を使用しているか？
- [ ] 画像はCloudinary経由か？
- [ ] Content Collectionsを使用しているか（構造化コンテンツの場合）？
- [ ] TypeScriptの型エラーがないか？
- [ ] 不要なJavaScriptバンドルを追加していないか？
- [ ] SEO metadataは UnifiedSEO.astro 経由か？
- [ ] **Astro Dev Toolbar Auditでエラー0を確認したか？**

---

## 13. Migration from Old Patterns

### Deprecated Patterns

| ❌ 旧パターン | ✅ 新パターン | 理由 |
|---|---|---|
| `Astro.glob()` | `getCollection()` | 型安全性 |
| ハードコードSEO | UnifiedSEO + JSON | 一元管理 |
| `<img>` タグ | `<CldImage>` | 自動最適化 |
| 個別media queries | `clamp()` | メンテナンス性 |
| Inline image paths | Cloudinary public_id | CDN配信 |

### Migration Example

```astro
<!-- ❌ Before -->
---
const posts = await Astro.glob('../content/docs/*.mdx');
---
<head>
  <title>My Page</title>
  <meta name="description" content="Description" />
</head>
<img src="/img/photo.png" />

<!-- ✅ After -->
---
import { getCollection } from 'astro:content';
import UnifiedSEO from '../components/UnifiedSEO.astro';
import { CldImage } from 'astro-cloudinary';
import seoConfig from '../data/seo/pages/my-page.json';

const posts = await getCollection('docs');
---
<head>
  <UnifiedSEO {...seoConfig.seoData} />
</head>
<CldImage src="photo-public-id" width={600} />
```

---

## 14. Performance Metrics & Goals

### Current Performance

| Metric | Value | Target | Status |
|---|---|---|---|
| **Lighthouse Score** | 95+ | 90+ | ✅ |
| **JavaScript Bundle** | ~20KB | <50KB | ✅ |
| **CSS Size** | ~45KB | <100KB | ✅ |
| **OG Image Size** | ~100KB | <200KB | ✅ |
| **Time to Interactive** | <1s | <2s | ✅ |

### Zero-JS Philosophy Results

```
Total Components: 33 Astro files
UI Framework Islands: 0
Bundle Size: Minimal (~20KB compressed)
Performance Score: 95+
```

---

## 15. Best Practices Summary

### ✅ DO

1. **Use Content Collections** for all structured content
2. **Use UnifiedSEO.astro** for all SEO metadata
3. **Use Cloudinary** for all images (public_id preferred)
4. **Use named slots** in layouts for flexibility
5. **Use `clamp()`** for responsive CSS values
6. **Use `is:inline`** for minimal client-side scripts
7. **Use Zod validation** for content schemas
8. **Export Props interfaces** for type reusability
9. **Organize components** by purpose (common, content, ui, etc.)
10. **Test on real devices** for performance validation

### ❌ DON'T

1. **Don't use Astro.glob()** for structured content
2. **Don't hardcode SEO tags** in pages
3. **Don't use UI framework islands** unless absolutely necessary
4. **Don't skip image optimization**
5. **Don't use inline styles** (use scoped `<style>`)
6. **Don't exceed media query limits** (use `clamp()` instead)
7. **Don't bundle heavy JavaScript**
8. **Don't use unvalidated content data**
9. **Don't mix component categories**
10. **Don't ignore TypeScript errors**

---

## 16. References

### Internal Documentation

- [OG Image Optimization](./og-image-optimization.md) - 画像最適化の詳細
- [Tech Stack](./tech-stack.md) - 技術スタック詳細
- [Source Tree](./source-tree.md) - プロジェクト構造
- [Coding Standards](./coding-standards.md) - コーディング規約

### External Resources

- [Astro Documentation](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Schema.org](https://schema.org/)

---

## 17. Version History

### v2.1 (2025-10-13)
- **Astro Dev Toolbar Audit統合**: 開発ワークフローへのAudit組み込み
- **Semantic HTML vs ARIA Roles**: セマンティック要素とARIAロールの適切な使い分け
- **Invalid Links対策**: `href="#"`禁止、`<button disabled>`使用ガイドライン
- Code Review Checklistに Audit確認追加

### v2.0 (2025-10-13)
- SEO管理パターン追加（UnifiedSEO + JSON設定）
- OG Image自動変換システム追加
- Content Collections スキーマ詳細追加
- Slot-based layoutsパターン追加
- Performance最適化ガイドライン追加
- TypeScriptパターン追加
- Project-specific patternsセクション追加

### v1.0 (Initial)
- 基本的なAstro開発パターン
- Component階層
- Content Collections基本

---

**Maintained by**: Winston (Architect)  
**Review Frequency**: 四半期ごと、または重要な実装変更時  
**Status**: ✅ Active & Enforced
