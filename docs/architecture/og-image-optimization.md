# OG Image配信システム - 技術仕様書

## 📋 概要

GoRakuDoのすべての画像は `public/images/` 配下のローカルファイルから配信されます。OG Image（ソーシャルメディア用1200x630px）も例外ではなく、`UnifiedSEO.astro` がローカルパスを絶対URL（`https://gorakudo.org/images/...`）に変換して `og:image` / `twitter:image` に出力します。

旧Cloudinaryパイプライン（`res.cloudinary.com/dbvd1cm7u`）は **2026-09-22に撤去済み** です。旧仕様の記録は `docs/archive/cloudinary-setup.md` にarchiveされています。

**最終更新**: 2026-09-23  
**実装ファイル**: `src/components/common/UnifiedSEO.astro`、`src/utils/local-image.ts`

---

## 🏗️ 現行アーキテクチャ

```
画像パス入力（featuredImage, image）
    ↓
createFullImageUrl(imagePath, forOgImage)（UnifiedSEO.astro）
  - bare ID（旧Cloudinary public_id）→ console.warn で検出し defaultImage へ
  - 表示用 <img> は別経路で toLocalImage()（src/utils/local-image.ts）を使用
    ↓
┌──────────────────┬──────────────────┐
│  ローカル画像     │    外部URL       │
│  /images/xxx.webp│  https://xxx.jpg │
└──────────────────┴──────────────────┘
    ↓                    ↓
絶対URLに変換（https://gorakudo.org/... を付与）
    ↓
og:image / twitter:image / JSON-LD ImageObject で出力
```

**ランタイム変換はありません。** 画像のリサイズ・パディング・フォーマット変換は行わず、用意されたファイルをそのまま配信します。

---

## 💻 実装詳細

### 1. メイン関数: `createFullImageUrl()`

**場所**: `src/components/common/UnifiedSEO.astro`

```typescript
const createFullImageUrl = (imagePath?: string, forOgImage = false): string => {
  // 空の場合はツールページのiconUrl、なければデフォルトOG画像
  if (!imagePath || imagePath.trim() === '') {
    const toolImage = getToolImageFromPath();
    imagePath = toolImage || seoConfig.site.defaultImage;
  }

  // 入力は全て実パス（/ または http 始まり）。bare ID（旧Cloudinary public_id）は廃止済み。
  if (forOgImage) {
    return createFullImageUrl(imagePath, false);
  }

  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return joinUrl(getSiteUrl(), imagePath);

  // 実パスでない入力は壊れたURLのもとになるためデフォルト画像へフォールバック
  console.warn(`[UnifiedSEO] Unsupported image path: ${imagePath}. Falling back to default image.`);
  return createFullImageUrl(seoConfig.site.defaultImage, false);
};
```

### 2. 入力ルール

| 入力例 | 判定 | 結果 |
|---|---|---|
| `/images/docs/xxx.webp` | `/` 始まり | ✅ `https://gorakudo.org/images/docs/xxx.webp` |
| `https://example.com/x.jpg` | `http` 始まり | ✅ そのまま利用 |
| `gorakudo-tired-study_zhhh2b` | bare ID（旧Cloudinary） | ❌ DEV警告 → デフォルト画像へフォールバック |

### 3. 2つのURL生成

```typescript
const fullImageUrl = createFullImageUrl(image);       // JSON-LD等（通常表示）
const ogImageUrl = createFullImageUrl(image, true);   // og:image / twitter:image
```

現在はどちらも同じローカル絶対URLです（変換処理の分岐は撤去済み）。

### 4. デフォルト画像

```json
// src/data/seo/unifiedSeo-config.json
{ "site": { "defaultImage": "/images/og/gorakudo-immerison.png" } }
```

画像が未指定のページ（および不正パス）はすべてこのデフォルトOG画像にフォールバックします。画像読み込み失敗時は `handleImgError` が同じ `/images/og/gorakudo-immerison.png` → 空SVG の順でフォールバックします。

---

## 🖼️ 画像ファイルの配置ルール

すべて `public/images/` 配下に置き、フロントマターには `/images/...` の明示パスを書きます。

```yaml
# MDX Frontmatter
---
# 記事のFeatured Image
featuredImage: '/images/docs/gorakudo-tired-study_zhhh2b.webp'

# ツール記事のOG Image（作成時に1200x630pxで用意）
featuredImage: '/images/content/tools-yomitan/setup-yomitan-android/setup-yomitan-android-OgImage.webp'
---
```

### 配置先の目安

| 種別 | 配置先 | 例 |
|---|---|---|
| 記事ヘッダー・Featured | `public/images/docs/` | `gorakudo-tired-study_zhhh2b.webp` |
| 記事専用OG画像 | 記事と同じツール配下 | `setup-yomitan-android-OgImage.webp` |
| デフォルトOG画像 | `public/images/og/` | `gorakudo-immerison.png` |
| ヘッダー背景 | `public/images/headers/` | `gorakudo-docs_nmobpw.webp` |

---

## 🎨 OG画像の推奨仕様

ランタイム変換が無いため、**作成時に**以下の仕様で用意します。

| プラットフォーム | 推奨解像度 | アスペクト比 | 対応 |
|---|---|---|---|
| **Facebook** | 1200x630px | 1.91:1 | ✅ |
| **Twitter** | 1200x600px | 2:1 | ✅ 1200x630で互換 |
| **LinkedIn** | 1200x627px | 1.91:1 | ✅ |
| **Discord** | 1200x630px | 1.91:1 | ✅ |

### 1.91:1への対応方針

旧Cloudinaryの `c_pad`（余白追加）は撤去されたため、余白が必要な場合は**画像編集時に背景を付けて** 1200x630pxで書き出します。正方形画像をそのまま流用するとSNSでの表示品質が下がる点に注意してください。

---

## 📈 メタタグ出力

**場所**: `src/components/common/UnifiedSEO.astro`

```html
<!-- OPEN GRAPH -->
<meta property="og:image" content={ogImageUrl} />
<meta property="og:image:alt" content={title} />

<!-- TWITTER CARDS -->
<meta name="twitter:image" content={ogImageUrl} />
<meta name="twitter:image:alt" content={title} />
```

- `ogImageUrl` は常に絶対URL（`https://gorakudo.org/images/...`）
- JSON-LDの `ImageObject` も同じローカル絶対URLを使用
- Resource HintsにCloudinary用 `preconnect` / `dns-prefetch` は存在しません（`unifiedSeo-config.json` の `resourceHints` は googletagmanager 等のみ）

---

## 🔧 トラブルシューティング

### 問題1: OG画像がSNSに表示されない

1. `public/images/` 配下にファイルが実在するか確認（パスとファイル名の完全一致）
2. frontmatterが `/` または `http` 始まりの実パスか確認（bare IDは不可）
3. デフォルト画像にフォールバックしていないか、ビルド出力を確認
4. ブラウザ/SNS側のキャッシュ（SNSは再取得に時間がかかる）

### 問題2: bare ID（旧Cloudinary public_id）が残っている

- 開発ビルドで `[toLocalImage] Bare image ID is unsupported: ...` が出ます
- 該当画像を `public/images/` へ移動済みの実パスに置換してください
- 移動対応表は `docs/public-migration-map.md` を参照

### 問題3: 画像が切れる・縦横比が崩れる

- ランタイム変換（`c_pad`等）は無効です。作成時に1200x630pxで書き出してください

---

## 📝 開発ガイドライン

### 新しい画像を追加する手順

1. 画像を `public/images/` の該当ディレクトリへ配置（OG用は1200x630pxで作成）
2. frontmatterに `/images/...` の明示パスを記入
3. `toLocalImage()` / UnifiedSEOが絶対URLを自動生成

### コードレビューチェックリスト

- [ ] 画像は `public/images/` に配置されているか
- [ ] frontmatterは `/images/...` の実パスか（bare IDでないか）
- [ ] OG用画像は1200x630px (1.91:1) で作成されているか
- [ ] ファイルサイズは1MB以下か

---

## 🎯 Minimalist Principles適用

### 実装の簡潔性

| 実装 | 内容 |
|---|---|
| **パス判定** | `/` か `http` かの2分岐 |
| **絶対URL化** | `joinUrl()` で1箇所 |
| **フォールバック** | デフォルトOG画像へ1箇所 |
| **変換処理** | なし（作成時に整備） |

### 設定の一元管理

- デフォルト画像: `src/data/seo/unifiedSeo-config.json` の `site.defaultImage`
- Resource Hints: 同 `resourceHints`（Cloudinary項目なし）

---

## 📚 関連リソース

### 実装ファイル

| ファイル | 説明 |
|---|---|
| `src/components/common/UnifiedSEO.astro` | `createFullImageUrl` / メタタグ出力 |
| `src/utils/local-image.ts` | `toLocalImage()` bare ID検出 |
| `src/data/seo/unifiedSeo-config.json` | デフォルトOG画像・Resource Hints |
| `docs/public-migration-map.md` | 旧画像パス → `public/images/` 移動対応表 |

### 関連ドキュメント

- 旧Cloudinaryパイプライン（archive）: `docs/archive/cloudinary-setup.md`
- 技術スタック: `docs/architecture/tech-stack.md`
- 開発パターン: `docs/architecture/astro-development-patterns.md`

---

**作成日**: 2025-10-13  
**作成者**: Winston (Architect)  
**最終更新**: 2026-09-23（Cloudinary撤去に伴う現行パイプラインへ全面更新）
