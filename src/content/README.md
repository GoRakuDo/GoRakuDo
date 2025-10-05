# GoRakuDo Content Collections 設定ガイド

## 📋 概要

このディレクトリは、GoRakuDoサイトのコンテンツ管理システム（Content Collections）の設定ファイルとコンテンツファイルを格納しています。

## 🗂️ ディレクトリ構造

```
src/content/
├── config.ts              # メイン設定ファイル
├── README.md              # このファイル
├── docs/                  # メインコンテンツ（ブログ記事、ガイド）
├── pages/                 # 静的ページ（サポートページなど）
└── tool-articles/         # ツール紹介記事
```

## 🧠 MindMaps構造

### 📊 Content Collections 全体構造

```mermaid
mindmap
  root((GoRakuDo<br/>Content Collections))
    📚 docs
      基本情報
        title
        description
        publishedDate
        author
        emoji
      分類・タグ
        categories
        tags
      オプション
        status
    📄 pages
      基本情報
        title
        description
        publishedDate
        author
      分類・タグ
        category
        tags
        featured
      ページタイプ
        contentType
    🛠️ tool-articles
      基本情報
        title
        description
        publishedDate
        author
      ツール固有情報
        toolName
        toolVersion
        toolWebsite
        toolCategory
      視覚的要素
        emoji
        icon
      分類・タグ
        categories
        tags
      SEO・発見性
        keywords
        relatedTools
```

### 🔧 設定定数構造

```mermaid
mindmap
  root((設定定数))
    📏 LIMITS
      文字数制限
        TITLE_MIN: 1
        TITLE_MAX: 100
        DESCRIPTION_MIN: 10
        DESCRIPTION_MAX: 200
        AUTHOR_MAX: 50
        CATEGORY_MAX: 30
        TAG_MAX: 20
      配列制限
        CATEGORIES_MAX: 5
        TAGS_MAX: 10
    🎯 DEFAULTS
      デフォルト値
        AUTHOR: 'Tim GoRakuDo'
        VERSION: '1.0.0'
        STATUS: 'published'
        COST: 'free'
        CONTENT_TYPE: 'resource'
```

### 📝 フィールドタイプ別分類

```mermaid
mindmap
  root((フィールドタイプ))
    📝 文字列フィールド
      基本文字列
        title
        description
        author
        toolName
      特殊文字列
        publishedDate (ISO形式)
        version (セマンティック)
      正規表現検証
        emoji (絵文字のみ)
        icon (ファイルパス)
        toolVersion (バージョン形式)
    🔢 数値フィールド
      整数
        readTime (削除済み)
    ✅ 真偽値フィールド
      フラグ
        featured
        isActive
    📋 配列フィールド
      文字列配列
        categories
        tags
        keywords
        relatedTools
    🎯 列挙型フィールド
      状態管理
        status (published/draft/archived)
        contentType (resource/info/legal)
      分類
        toolCategory (動的文字列: 英数字、ハイフン、スペースのみ)
```

## 🎯 各コレクション詳細

### 📚 docs コレクション

**用途**: メインコンテンツ（ブログ記事、ガイド、チュートリアル）  
**場所**: `src/content/docs/`  
**必須フィールド**: title, description, publishedDate

#### フィールド構造
```mermaid
graph TD
    A[docs] --> B[基本情報]
    A --> C[分類・タグ]
    A --> D[オプション]
    
    B --> B1[title: 1-100文字]
    B --> B2[description: 10-200文字]
    B --> B3[publishedDate: ISO形式]
    B --> B4[author: デフォルト値あり]
    B --> B5[emoji: 絵文字のみ]
    
    C --> C1[categories: 1-5個]
    C --> C2[tags: 最大10個]
    
    D --> D1[status: 公開状態]
```


### 📄 pages コレクション

**用途**: 静的ページ（サポートページ、お知らせ、法的ページ）  
**場所**: `src/content/pages/`  
**必須フィールド**: title, description, publishedDate

#### フィールド構造
```mermaid
graph TD
    A[pages] --> B[基本情報]
    
    B --> B1[title: 1-180文字]
    B --> B2[description: 10-280文字]
    B --> B3[publishedDate: ISO形式]
    B --> B4[author: デフォルト値あり]
```

### 🛠️ tool-articles コレクション

**用途**: 学習ツールの紹介・解説記事  
**場所**: `src/content/tool-articles/`  
**必須フィールド**: title, description, publishedDate, toolName, toolCategory

#### フィールド構造
```mermaid
graph TD
    A[tool-articles] --> B[基本情報]
    A --> C[ツール固有情報]
    A --> D[セットアップ情報]
    A --> E[視覚的要素]
    A --> F[分類・タグ]
    A --> G[ツール機能・要件]
    A --> H[SEO・発見性]
    
    B --> B1[title: 1-100文字]
    B --> B2[description: 10-200文字]
    B --> B3[publishedDate: ISO形式]
    B --> B4[author: デフォルト値あり]
    
    C --> C1[toolName: 1-50文字]
    
    E --> E1[icon: ファイルパス形式]
    
    F --> F1[categories: 1-3個]
    F --> F2[tags: 最大10個]
    
    H --> H1[keywords: 最大15個]
    H --> H2[relatedTools: 最大10個]
```

## 🔧 設定変更ガイド

### よくある設定変更

#### 1. 文字数制限の変更
```typescript
// LIMITS オブジェクトの値を変更
const LIMITS = {
  TITLE_MAX: 100,  // 100 → 150 に変更
  // ...
} as const;
```

#### 2. デフォルト値の変更
```typescript
// DEFAULTS オブジェクトの値を変更
const DEFAULTS = {
  AUTHOR: 'Tim GoRakuDo',  // 新しい作者名に変更
  // ...
} as const;
```

#### 3. 選択肢の追加・変更
```typescript
// z.enum() の配列に項目を追加（toolCategoryは動的文字列のため変更不要）
status: z.enum([
  'published',
  'draft',
  'new-status',  // 新しいステータスを追加
  // ...
])

// toolCategoryは動的文字列バリデーション（コード変更不要）
toolCategory: z.string()
  .min(1, { message: 'ツールカテゴリを入力してください' })
  .max(30, { message: 'ツールカテゴリは30文字以内で入力してください' })
  .regex(/^[a-zA-Z0-9\-\s]+$/, { 
    message: 'ツールカテゴリは英数字、ハイフン、スペースのみ使用可能です' 
  })
```

#### 4. 新しいフィールドの追加
```typescript
// 各コレクションのschemaに新しいフィールドを追加
schema: z.object({
  // 既存のフィールド...
  newField: z.string().optional(),  // 新しいフィールドを追加
})
```

## ⚠️ 変更時の注意事項

1. **既存コンテンツの確認**: 変更前に既存のコンテンツファイルが新しい設定に準拠しているか確認
2. **ビルドテスト**: 変更後は必ず `npm run build` でビルドテストを実行
3. **破壊的変更**: 必須フィールドの追加など、破壊的変更の場合は既存コンテンツの更新が必要
4. **バックアップ**: 重要な変更前は設定ファイルのバックアップを取る
5. **toolCategoryの柔軟性**: toolCategoryは動的文字列バリデーションのため、新しいカテゴリの追加時にコード変更は不要

## 🚀 toolCategory動的読み込みの利点

### 従来のenum定義との比較

**従来（enum定義）:**
```typescript
toolCategory: z.enum([
  'flashcard', 'reading', 'listening', 'writing', 'suite',
  'video', 'browser-extension', 'mobile-app', 'desktop-app'
])
```
- 新しいカテゴリ追加時にコード変更が必要
- 開発者の介入が必要
- デプロイが必要

**現在（動的文字列バリデーション）:**
```typescript
toolCategory: z.string()
  .min(1, { message: 'ツールカテゴリを入力してください' })
  .max(30, { message: 'ツールカテゴリは30文字以内で入力してください' })
  .regex(/^[a-zA-Z0-9\-\s]+$/, { 
    message: 'ツールカテゴリは英数字、ハイフン、スペースのみ使用可能です' 
  })
```
- 新しいカテゴリ追加時にコード変更不要
- コンテンツ作成者が直接設定可能
- 即座に反映

### 使用例

```yaml
---
title: 'AI学習アシスタントの紹介'
toolName: 'ChatGPT'
toolCategory: 'ai-assistant'  # 新しいカテゴリを自由に設定
---
```

## 📞 サポート

設定変更で不明な点がある場合は、技術チームにご相談ください。

## 🔗 関連リンク

- [Astro Content Collections公式ドキュメント](https://docs.astro.build/ja/guides/content-collections/)
- [Zodバリデーションライブラリ](https://zod.dev/)
- [GoRakuDoプロジェクトメインREADME](../README.md)
