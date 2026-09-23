# Cloudinary画像の使用方法

## 概要

`featuredImage`フィールドにはCloudinaryのPublic IDのみを指定できます。システムが自動的に最適化されたCloudinary URLを構築します。

## 使用方法

### MDXファイルでの指定

```yaml
---
title: '記事タイトル'
description: '記事の説明'
featuredImage: 'gorakudo-tired-study_zhhh2b'  # Public IDのみ
---
```

### フルURLも使用可能

既存の互換性のため、フルURLも引き続き使用できます：

```yaml
featuredImage: 'https://res.cloudinary.com/dbvd1cm7u/image/upload/v1759772770/gorakudo-tired-study_zhhh2b.png'
```

## 自動最適化

Public IDを使用すると、以下の最適化が自動的に適用されます：
- `f_auto`: ブラウザに最適なフォーマット（WebP、AVIF等）を自動選択
- `q_auto`: 画質を自動最適化
- 帯域幅の削減とパフォーマンスの向上

## ユーティリティ関数

### `buildCloudinaryUrl(publicId, options?)`

Public IDからCloudinary URLを構築します。

```typescript
import { buildCloudinaryUrl } from '@/utils/cloudinary';

// 基本的な使用
const url = buildCloudinaryUrl('gorakudo-tired-study_zhhh2b');
// → https://res.cloudinary.com/dbvd1cm7u/image/upload/f_auto,q_auto/gorakudo-tired-study_zhhh2b

// オプション付き
const url = buildCloudinaryUrl('gorakudo-tired-study_zhhh2b', {
  format: 'webp',
  quality: '80',
  width: 800
});
// → https://res.cloudinary.com/dbvd1cm7u/image/upload/f_webp,q_80,w_800/gorakudo-tired-study_zhhh2b
```

### `getCloudinaryUrl(publicId)`

最適化なしの基本URLを返します。

```typescript
import { getCloudinaryUrl } from '@/utils/cloudinary';

const url = getCloudinaryUrl('gorakudo-tired-study_zhhh2b');
// → https://res.cloudinary.com/dbvd1cm7u/image/upload/gorakudo-tired-study_zhhh2b
```

## Public IDの確認方法

Cloudinary MCPを使用してPublic IDを確認：

```bash
# アセットを検索
cloudinary-asset-mgmt search-assets --expression "filename:gorakudo-tired-study"
```

返される情報：
- `publicId`: Public ID（例：`gorakudo-tired-study_zhhh2b`）
- `format`: フォーマット（例：`png`）
- `secureUrl`: フルURL

## 実装箇所

以下のファイルでPublic IDからURLへの自動変換が実装されています：

1. `src/pages/docs/[slug].astro` - ドキュメント記事
2. `src/pages/tools/[tool]/[...slug].astro` - ツール記事
3. `src/components/common/Pagination/pagination.ts` - ページネーション

## ベストプラクティス

✅ **推奨**: Public IDのみを使用
```yaml
featuredImage: 'gorakudo-tired-study_zhhh2b'
```

✅ **許容**: フルURL（後方互換性）
```yaml
featuredImage: 'https://res.cloudinary.com/dbvd1cm7u/image/upload/v1759772770/gorakudo-tired-study_zhhh2b.png'
```

❌ **非推奨**: 拡張子なしのフルURL
```yaml
featuredImage: 'https://res.cloudinary.com/dbvd1cm7u/image/upload/gorakudo-tired-study_zhhh2b'
```

## メリット

1. **シンプル**: Public IDだけで管理が容易
2. **最適化**: 自動的にフォーマット・画質が最適化
3. **パフォーマンス**: 帯域幅の削減
4. **保守性**: Cloudinary設定の一元管理
5. **柔軟性**: フルURLも引き続き使用可能

