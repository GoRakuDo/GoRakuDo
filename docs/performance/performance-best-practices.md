# GoRakuDo - パフォーマンスベストプラクティス

**最終更新**: 2025年1月10日  
**対象**: GoRakuDoプロジェクト全体  
**フレームワーク**: Astro v5.13.9

---

## 📋 目次

1. [Core Web Vitals目標値](#core-web-vitals目標値)
2. [測定と監視](#測定と監視)
3. [リソース最適化](#リソース最適化)
4. [重要な教訓](#重要な教訓)
5. [開発ワークフロー](#開発ワークフロー)

---

## Core Web Vitals目標値

### プロジェクト基準

| 指標 | Good | Needs Improvement | Poor | GoRakuDo目標 |
|------|------|-------------------|------|--------------|
| **LCP** | < 2.5s | 2.5-4.0s | > 4.0s | **< 700ms** |
| **FID/INP** | < 100ms | 100-300ms | > 300ms | **< 100ms** |
| **CLS** | < 0.1 | 0.1-0.25 | > 0.25 | **0.00** |
| **FCP** | < 1.8s | 1.8-3.0s | > 3.0s | **< 500ms** |
| **TTFB** | < 800ms | 800-1800ms | > 1800ms | **< 100ms** |

### 現在の達成状況

✅ **LCP**: 平均456ms (目標 < 700ms)  
✅ **CLS**: 全ページ0.00 (目標 0.00)  
✅ **TTFB**: 平均39ms (目標 < 100ms)

---

## 測定と監視

### 1. 継続的測定の重要性

**ゴールデンルール:** 変更前後で必ず測定

```bash
# 1. ビルド
npm run build

# 2. プレビュー起動
npm run preview

# 3. Chrome DevTools MCPで測定
# (または手動でLighthouse実行)

# 4. 結果を記録
```

### 2. 測定環境

#### ローカル環境
- **用途**: 開発中の迅速な確認
- **注意**: 本番環境と結果が異なる可能性あり
- **特徴**: ネットワーク遅延なし、キャッシュ効果が顕著

#### 本番環境
- **用途**: 最終的なパフォーマンス検証
- **推奨**: Lighthouse CI、WebPageTest
- **特徴**: 実際のユーザー環境に近い

### 3. 測定ツール

| ツール | 用途 | 推奨度 |
|--------|------|--------|
| Chrome DevTools MCP | 開発環境での継続的測定 | ⭐⭐⭐⭐⭐ |
| Lighthouse | 包括的な品質監査 | ⭐⭐⭐⭐⭐ |
| WebPageTest | 詳細なネットワーク分析 | ⭐⭐⭐⭐ |
| Core Web Vitals Extension | 本番環境のスポット測定 | ⭐⭐⭐ |

---

## リソース最適化

### 1. フォント最適化 ✅ **実装済み**

#### 現在の実装

```css
/* src/styles/fonts.css */
@import '@fontsource-variable/roboto-flex';
@import '@fontsource-variable/roboto-serif';
@import '@fontsource/noto-sans-jp/400.css';
/* ... */
```

**利点:**
- ✅ 自動的に`font-display: swap`適用
- ✅ npm経由での簡単な管理
- ✅ Unicode-range最適化
- ✅ WOFF2フォーマット

**ベストプラクティス:**
- ✅ @fontsourceパッケージを使用
- ✅ 必要なウェイトのみインポート
- ⚠️ 外部フォントサービス（Google Fonts CDN）は避ける

### 2. 画像最適化

#### Astro Imageコンポーネント活用

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.webp';
---

<Image 
  src={heroImage}
  alt="Hero"
  width={1200}
  height={630}
  loading="lazy"
  decoding="async"
  quality={80}
/>
```

**ベストプラクティス:**
- ✅ WebP/AVIFフォーマット優先
- ✅ `loading="lazy"` for below-the-fold images
- ✅ `width`/`height`属性でCLS防止
- ✅ `quality`を80-85に設定（品質と容量のバランス）

### 3. CSS最適化

#### クリティカルCSS戦略

**現状:** グローバルCSS 1931KB (gzip: 630KB)

**改善案:**
```astro
<!-- BaseLayout.astro -->
<head>
  <!-- Above-the-foldのクリティカルCSSのみインライン -->
  <style is:inline>
    /* 最小限のクリティカルスタイル */
    body { margin: 0; font-family: system-ui; }
    .hero { /* ... */ }
  </style>
  
  <!-- 非クリティカルCSSは遅延読み込み -->
  <link rel="stylesheet" href="/styles/global.css" media="print" onload="this.media='all'">
</head>
```

### 4. JavaScript最適化

#### defer/async の適切な使用

```astro
<!-- クリティカルでないスクリプト -->
<script defer src="/scripts/analytics.js"></script>

<!-- 独立したサードパーティスクリプト -->
<script async src="https://example.com/widget.js"></script>

<!-- クリティカルスクリプト（最小限） -->
<script is:inline>
  // 即座に実行が必要な最小限のコード
</script>
```

### 5. リソースヒント ⚠️ **慎重に使用**

#### 重要な教訓

**❌ やってはいけないこと:**
```astro
<!-- 過剰なリソースヒント -->
<BaseLayout
  preconnect={['https://fonts.googleapis.com', 'https://fonts.gstatic.com']}
  dnsPrefetch={['https://www.googletagmanager.com', 'https://www.google-analytics.com']}
  prefetch={['/docs', '/tools', '/panduan-lengkap-otodidak-bahasa-jepang']}
>
```

**結果:** LCP 624ms → 1236ms (98%悪化)

#### ✅ 推奨事項

**1. preconnect - 最大3-4個まで**
```astro
<!-- 本当に必要な外部オリジンのみ -->
<link rel="preconnect" href="https://analytics.example.com">
```

**2. dns-prefetch - 重要度の低い外部リソース**
```astro
<!-- preconnectの代替として -->
<link rel="dns-prefetch" href="https://cdn.example.com">
```

**3. prefetch - 次のナビゲーションで確実に必要なページ**
```astro
<!-- ユーザーの次の行動が予測可能な場合のみ -->
<link rel="prefetch" href="/next-step">
```

**4. preload - Above-the-foldのクリティカルリソース**
```astro
<!-- LCPに関わる画像 -->
<link rel="preload" as="image" href="/hero.webp">
```

#### 適用条件

```typescript
// 環境による条件分岐
const shouldUseResourceHints = import.meta.env.PROD && !import.meta.env.DEV;

<BaseLayout
  {...(shouldUseResourceHints && {
    dnsPrefetch: ['https://analytics.example.com']
  })}
>
```

---

## 重要な教訓

### 1. 測定なしに最適化なし

**学び:** リソースヒント追加によりLCPが98%悪化

**教訓:**
- ✅ 変更前にベースライン測定
- ✅ 変更後に効果検証
- ✅ 複数環境でテスト
- ⚠️ 理論だけでなく実測で判断

### 2. 環境による違いを理解

| 環境 | 特徴 | リソースヒントの効果 |
|------|------|---------------------|
| **ローカル** | 遅延なし | 効果なし〜逆効果 |
| **本番 (Fast 3G)** | ネットワーク遅延あり | 大きな効果 |
| **本番 (CDN)** | 地理的距離あり | 効果あり |

**教訓:**
- ローカルでのテスト結果を過信しない
- 本番環境での測定を重視
- 実際のユーザー環境を想定

### 3. 既存の最適化を尊重

**学び:** @fontsourceパッケージは既に最適化済み

**教訓:**
- ✅ 既存の最適化ツールを理解
- ⚠️ 重複した最適化を避ける
- ✅ パッケージのドキュメントを確認

### 4. 少ないほど良い

**Minimalist Principle適用:**
- リソースヒントは必要最小限
- クリティカルCSSは本当にクリティカルなもののみ
- JavaScriptは最小限に

---

## 開発ワークフロー

### 1. 新機能開発時

```bash
# 1. ベースライン測定
npm run build && npm run preview
# Chrome DevTools MCPで測定 → 結果を記録

# 2. 機能実装
# コード変更...

# 3. 効果検証
npm run build && npm run preview
# 再測定 → Before/After比較

# 4. リグレッションチェック
# LCP/CLS/TTFBが悪化していないか確認
```

### 2. パフォーマンス最適化時

```bash
# 1. 問題特定
# Chrome DevTools Performance Insights実行

# 2. 仮説立案
# 「Xを変更すればYが改善する」

# 3. 最小限の変更実装
# 一度に1つの変更のみ

# 4. 効果測定
# 仮説が正しいか検証

# 5. ドキュメント化
# 学びを記録
```

### 3. コードレビュー時のチェックリスト

#### パフォーマンス影響のある変更

- [ ] Before/After測定を実施したか？
- [ ] 複数環境でテストしたか？
- [ ] リソースヒントは適切か？（3-4個以下）
- [ ] 画像に`width`/`height`属性があるか？
- [ ] Above-the-fold画像は`loading="eager"`か？
- [ ] Below-the-fold画像は`loading="lazy"`か？
- [ ] JavaScriptは`defer`/`async`を適切に使用しているか？

---

## Core Web Vitals 改善チートシート

### LCP改善

| 問題 | 解決策 |
|------|--------|
| 遅いサーバー応答 | CDN、キャッシング、SSG |
| レンダーブロッキングリソース | クリティカルCSS、defer/async |
| 遅いリソース読み込み | 画像最適化、preload |
| クライアント側レンダリング | SSG/SSR、ハイドレーション最適化 |

### CLS改善

| 問題 | 解決策 |
|------|--------|
| 画像サイズ未指定 | `width`/`height`属性 |
| 動的コンテンツ挿入 | スペース予約、`aspect-ratio` |
| Webフォント | `font-display: swap` |
| アニメーション | `transform`/`opacity`のみ |

### TTFB改善

| 問題 | 解決策 |
|------|--------|
| サーバー処理遅延 | キャッシング、SSG |
| ネットワーク遅延 | CDN、HTTP/2 |
| データベースクエリ | インデックス、キャッシング |

---

## 継続的改善

### 四半期ごとのレビュー

1. **全ページのCore Web Vitals測定**
2. **新しいベストプラクティスの調査**
3. **パフォーマンスバジェットの見直し**
4. **このドキュメントの更新**

### パフォーマンス文化の醸成

- ✅ 測定を習慣化
- ✅ 学びを共有
- ✅ 失敗から学ぶ
- ✅ データドリブンな意思決定

---

## 参考リソース

### 公式ドキュメント

- [Web Vitals](https://web.dev/vitals/)
- [Astro Performance](https://docs.astro.build/en/guides/performance/)
- [Fontsource](https://fontsource.org/)

### 測定ツール

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [WebPageTest](https://www.webpagetest.org/)

### プロジェクト固有

- [Core Web Vitals調査レポート](./core-web-vitals-report.md)
- [最適化提案書](./optimization-proposals.md)
- [Before/After比較](./performance-improvement-summary.md)

---

**最終更新者**: Winston (Architect Agent)  
**次回更新予定**: 2025年4月 (四半期レビュー)

