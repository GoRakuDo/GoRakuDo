# GoRakuDo - パフォーマンス最適化提案書

**作成日**: 2025年1月10日  
**ベースライン**: Core Web Vitals調査レポート  
**対象**: 全ページの包括的最適化

---

## 提案サマリー

本提案書では、GoRakuDoプロジェクトのCore Web Vitalsをさらに改善するための**優先順位付き最適化施策**を提示いたします。

### 現状評価

- ✅ 現在のパフォーマンス: **優秀**
- ⚠️ 改善の余地: **レンダーブロッキングリソース**
- 🎯 目標: **世界トップ5%のパフォーマンス達成**

---

## 優先順位基準

| 優先度 | 基準 | 実装タイミング |
|--------|------|----------------|
| **P0 (Critical)** | LCP > 4s, CLS > 0.25 | 即座 |
| **P1 (High)** | LCP > 2.5s, 大幅改善可能性 (>500ms) | 1週間以内 |
| **P2 (Medium)** | 改善の余地あり (100-500ms) | 1ヶ月以内 |
| **P3 (Low)** | 最適化の機会 (<100ms) | 随時 |

### 検出結果

- **P0施策**: 0件 ✅
- **P1施策**: 2件 ⚠️
- **P2施策**: 4件
- **P3施策**: 2件

---

## P1 (High Priority) - 高優先度施策

### P1-1: レンダーブロッキングリソースの最適化

**影響度**: High  
**期待改善**: FCP/LCP 300-615ms短縮  
**実装難易度**: Medium  
**所要時間**: 1-2日  
**対象ページ**: 全ページ（特にホームページ）

#### 問題の詳細

レンダーブロッキングリソース（CSS、フォント）が初期レンダリングを遅延させています。

**測定結果:**
- ホームページ: 615ms改善可能性
- その他ページ: 推定200-400ms改善可能性

#### 解決策

##### 1.1 クリティカルCSSのインライン化

**実装内容:**

```astro
<!-- src/layouts/BaseLayout.astro -->
<head>
  <!-- クリティカルCSSをインライン化 -->
  <style is:inline>
    /* Above-the-fold critical CSS */
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background-color: var(--color-background);
      color: var(--color-text);
    }
    .page-header { /* critical styles */ }
    .hero-section { /* critical styles */ }
  </style>

  <!-- 非クリティカルCSSは遅延読み込み -->
  <link 
    rel="stylesheet" 
    href="/styles/global.css" 
    media="print" 
    onload="this.media='all'"
  >
</head>
```

**期待効果**: FCP 200-300ms短縮

##### 1.2 フォント読み込み最適化

**実装内容:**

```css
/* src/styles/fonts.css */
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/your-font.woff2') format('woff2');
  font-display: swap; /* FOIT → FOUT */
  font-weight: 400;
  font-style: normal;
}
```

```html
<!-- BaseLayout.astro -->
<head>
  <!-- フォントのプリロード -->
  <link 
    rel="preload" 
    href="/fonts/your-font.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  >
</head>
```

**期待効果**: レンダーブロッキング解消

##### 1.3 JavaScript最適化

**実装内容:**

```astro
<!-- 非クリティカルJavaScript -->
<script defer src="/scripts/analytics.js"></script>
<script defer src="/scripts/non-critical.js"></script>

<!-- クリティカルJavaScript（必要最小限） -->
<script is:inline>
  // 即座に実行が必要な最小限のコード
</script>
```

**期待効果**: 初期レンダリング時間短縮

#### 実装ステップ

1. ✅ クリティカルCSS抽出ツールの選定（Critical, Penthouse等）
2. ✅ above-the-foldのクリティカルCSSを特定
3. ✅ BaseLayout.astroにインライン化
4. ✅ 非クリティカルCSSの遅延読み込み実装
5. ✅ フォントのfont-display: swap設定
6. ✅ プリロードディレクティブ追加
7. ✅ JavaScript defer/async最適化
8. ✅ 効果測定と検証

#### ファイル変更リスト

- `src/layouts/BaseLayout.astro` - クリティカルCSS追加
- `src/styles/global.css` - 遅延読み込み対応
- `src/styles/fonts.css` - font-display追加
- `astro.config.mjs` - ビルド設定最適化（必要に応じて）

---

### P1-2: ネットワーク依存関係ツリーの最適化

**影響度**: Medium-High  
**期待改善**: LCP 100-200ms短縮  
**実装難易度**: Medium  
**所要時間**: 1日  
**対象ページ**: 全ページ

#### 問題の詳細

リソースの依存チェーンが長く、並列読み込みが阻害されています。

```
HTML → CSS → Font → Image (直列)
```

理想的には:
```
HTML → CSS, Font, Image (並列)
```

#### 解決策

##### 2.1 リソースヒントの戦略的配置

**実装内容:**

```astro
<!-- src/components/UnifiedSEO.astro -->
<head>
  <!-- DNS Prefetch -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  
  <!-- Preconnect (重要なオリジン) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Preload (クリティカルリソース) -->
  <link rel="preload" as="image" href="/img/hero-image.webp" />
  <link rel="preload" as="style" href="/styles/critical.css" />
  <link rel="preload" as="font" href="/fonts/main-font.woff2" type="font/woff2" crossorigin />
  
  <!-- Prefetch (次のページで必要なリソース) -->
  <link rel="prefetch" href="/docs" />
</head>
```

**期待効果**: ネットワーク依存チェーンの削減、並列読み込み

##### 2.2 画像の最適化

**現状確認:**
```bash
# 使用中の画像形式と最適化状況を確認
ls -lh public/img/
```

**実装内容:**

```astro
<!-- src/components/Image.astro -->
<picture>
  <source 
    srcset="/img/hero.avif" 
    type="image/avif"
  >
  <source 
    srcset="/img/hero.webp" 
    type="image/webp"
  >
  <img 
    src="/img/hero.jpg" 
    alt="Hero"
    loading="lazy"
    decoding="async"
    width="1200"
    height="630"
  >
</picture>
```

**期待効果**: 画像読み込み時間30-50%短縮

#### 実装ステップ

1. ✅ 重要なオリジンにpreconnect追加
2. ✅ Above-the-fold画像にpreload追加
3. ✅ Below-the-fold画像にloading="lazy"追加
4. ✅ 次ページリソースにprefetch追加
5. ✅ 効果測定

#### ファイル変更リスト

- `src/components/UnifiedSEO.astro` - リソースヒント追加
- `src/components/` - 各画像コンポーネント最適化

---

## P2 (Medium Priority) - 中優先度施策

### P2-1: DOM要素数の最適化

**影響度**: Medium  
**期待改善**: スタイル計算時間10-20%短縮  
**実装難易度**: Medium-High  
**所要時間**: 2-3日  
**対象ページ**: ドキュメント一覧、ツール一覧

#### 問題の詳細

DOM要素数が多いページで、スタイル計算とレイアウトリフローに時間がかかります。

#### 解決策

##### 1. 不要なラッパー要素の削減

**Before:**
```astro
<div class="wrapper">
  <div class="container">
    <div class="inner">
      <h1>Title</h1>
    </div>
  </div>
</div>
```

**After:**
```astro
<div class="container">
  <h1>Title</h1>
</div>
```

##### 2. CSSによる視覚的構造の実現

**Before:** HTML要素で装飾
**After:** CSS pseudo-elementsで装飾

```css
.card::before {
  content: '';
  /* 装飾スタイル */
}
```

#### 実装ステップ

1. ✅ DOM要素数の監査（Chrome DevTools）
2. ✅ 不要なラッパー要素の特定
3. ✅ リファクタリング実施
4. ✅ 視覚的整合性の確認
5. ✅ パフォーマンス測定

---

### P2-2: サードパーティスクリプトの最適化

**影響度**: Medium  
**期待改善**: メインスレッドブロッキング時間短縮  
**実装難易度**: Low-Medium  
**所要時間**: 1日  
**対象ページ**: 全ページ

#### 問題の詳細

サードパーティスクリプト（アナリティクス、ウィジェット等）がメインスレッドをブロックしています。

#### 解決策

##### 1. スクリプトの遅延読み込み

```astro
<!-- Before -->
<script src="https://example.com/analytics.js"></script>

<!-- After -->
<script defer src="https://example.com/analytics.js"></script>

<!-- Or -->
<script async src="https://example.com/analytics.js"></script>
```

##### 2. ファサード技法の活用

YouTubeエンベッド等の重いサードパーティウィジェットには、軽量なファサードを使用：

```astro
<!-- lite-youtube-embed を使用 -->
<lite-youtube videoid="VIDEO_ID"></lite-youtube>
```

#### 実装ステップ

1. ✅ サードパーティスクリプトの棚卸し
2. ✅ 必要性の再評価
3. ✅ defer/async属性の追加
4. ✅ ファサード技法の実装（該当箇所）
5. ✅ パフォーマンス測定

---

### P2-3: Service Workerの実装

**影響度**: Medium (リピート訪問者向け)  
**期待改善**: リピート訪問時のLCP 50-80%短縮  
**実装難易度**: Medium  
**所要時間**: 2日  
**対象ページ**: 全ページ

#### 問題の詳細

現在、リピート訪問者向けのオフライン対応やキャッシュ戦略が不十分です。

#### 解決策

##### 1. Workbox統合

```javascript
// src/sw.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// 静的アセットのプリキャッシュ
precacheAndRoute(self.__WB_MANIFEST);

// 画像のキャッシュ戦略
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
      }),
    ],
  })
);

// HTMLのキャッシュ戦略
registerRoute(
  ({request}) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7日
      }),
    ],
  })
);
```

##### 2. Astro統合

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'GoRakuDo',
        short_name: 'GoRakuDo',
        description: '日本語学習ガイド',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,webp,jpg,svg}']
      }
    })
  ]
});
```

#### 実装ステップ

1. ✅ @vite-pwa/astroのインストール
2. ✅ Service Worker戦略の設計
3. ✅ manifest.json作成
4. ✅ アイコンの準備
5. ✅ キャッシュ戦略の実装
6. ✅ テストと検証
7. ✅ パフォーマンス測定

---

### P2-4: キャッシュ戦略の最適化

**影響度**: Low-Medium (リピート訪問者向け)  
**期待改善**: リピート訪問時のTTFB大幅短縮  
**実装難易度**: Low  
**所要時間**: 半日  
**対象ページ**: 全ページ

#### 問題の詳細

静的アセットのキャッシュ有効期限が短い、またはCache-Controlヘッダーが最適化されていません。

#### 解決策

##### 1. 静的アセットのキャッシュヘッダー最適化

**Astro設定:**

```javascript
// astro.config.mjs
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
    },
  },
});
```

##### 2. サーバー設定（本番環境）

**Nginx設定例:**

```nginx
# /etc/nginx/sites-available/gorakudo
location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|ico)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
  expires 1h;
  add_header Cache-Control "public, must-revalidate";
}
```

#### 実装ステップ

1. ✅ アセットのハッシュ化確認
2. ✅ Cache-Controlヘッダーの設定
3. ✅ CDN設定の最適化（該当する場合）
4. ✅ 効果測定

---

## P3 (Low Priority) - 低優先度施策

### P3-1: 動的インポートの活用

**影響度**: Low  
**期待改善**: 初期バンドルサイズ10-15%削減  
**実装難易度**: Medium  
**所要時間**: 1-2日  

#### 解決策

```javascript
// Before
import HeavyComponent from './HeavyComponent.astro';

// After
const HeavyComponent = lazy(() => import('./HeavyComponent.astro'));
```

---

### P3-2: 画像の次世代フォーマット完全移行

**影響度**: Low  
**期待改善**: 画像サイズ5-10%削減  
**実装難易度**: Low  
**所要時間**: 半日  

#### 解決策

全画像をAVIF + WebP + JPEGのフォールバック構成に。

---

## 実装ロードマップ

### Week 1: P1施策の実装

| 日 | タスク | 期待改善 |
|----|--------|----------|
| 1-2 | P1-1: レンダーブロッキング最適化 | LCP 300-615ms |
| 3 | P1-2: ネットワーク依存関係最適化 | LCP 100-200ms |
| 4-5 | テストと検証 | - |

### Week 2-4: P2施策の段階的実装

| Week | タスク | 期待改善 |
|------|--------|----------|
| 2 | P2-1: DOM最適化 | スタイル計算10-20% |
| 2 | P2-2: サードパーティ最適化 | ブロッキング時間短縮 |
| 3 | P2-3: Service Worker実装 | リピート訪問50-80% |
| 3 | P2-4: キャッシュ戦略最適化 | TTFB短縮 |
| 4 | テストと検証 | - |

### 随時: P3施策

必要に応じて段階的に実装。

---

## 期待される総合改善効果

### 初回訪問者

| 指標 | 現在 | 改善後 | 改善率 |
|------|------|--------|--------|
| LCP (平均) | 456ms | 200-300ms | 34-56% |
| LCP (最悪) | 624ms | 350-450ms | 28-44% |
| FCP | 推定400ms | 200-300ms | 25-50% |

### リピート訪問者

| 指標 | 現在 | 改善後 | 改善率 |
|------|------|--------|--------|
| LCP | 456ms | 100-150ms | 67-78% |
| TTFB | 39ms | 5-10ms | 74-87% |

---

## 測定と監視

### KPI設定

1. **LCP**: 全ページで< 300ms（現在456ms平均）
2. **FCP**: 全ページで< 200ms
3. **CLS**: 0.00維持（既に達成）
4. **TTFB**: リピート訪問で< 10ms

### 継続的監視ツール

1. **Chrome DevTools**: 開発環境での継続的測定
2. **Lighthouse CI**: CI/CDパイプラインでの自動測定
3. **Web Vitals Chrome Extension**: 本番環境でのスポット測定

---

## 結論

GoRakuDoプロジェクトは既に優秀なパフォーマンスを達成しておりますが、P1-P2施策の実装により、**世界トップ5%のパフォーマンス**を実現できます。

### 推奨実装順序

1. **即座**: P1-1 (レンダーブロッキング最適化)
2. **1週間以内**: P1-2 (ネットワーク依存関係)
3. **1ヶ月以内**: P2施策全て
4. **随時**: P3施策

---

**提案者**: Winston (Architect Agent)  
**次のステップ**: P1施策の実装開始

