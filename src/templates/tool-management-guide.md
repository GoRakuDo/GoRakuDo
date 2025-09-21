# 🛠️ ツール管理ガイド - 凡人スタッフ向け

## 📋 目次
1. [概要](#概要)
2. [新しいツールの追加](#新しいツールの追加)
3. [既存ツールの編集](#既存ツールの編集)
4. [ツールの削除](#ツールの削除)
5. [トラブルシューティング](#トラブルシューティング)
6. [よくある質問](#よくある質問)

---

## 概要

このガイドでは、GoRakuDoサイトでツール（Anki、Migaku、Yomitanなど）を管理する方法を説明します。

### 🎯 重要なポイント
- **自動認識**: 新しいツールを追加すると、自動的にサイトに表示されます
- **中央集権化**: すべての設定は1箇所で管理されます
- **簡単操作**: コーディング知識は不要です

---

## 新しいツールの追加

### ステップ1: ツール記事の作成

1. **フォルダの作成**
   ```
   src/content/tool-articles/[ツール名]/
   ```
   例: `src/content/tool-articles/takoboto/`

2. **記事ファイルの作成**
   ```
   src/content/tool-articles/[ツール名]/[記事名].md
   ```
   例: `src/content/tool-articles/takoboto/pengenalan-takoboto.md`

### ステップ2: 記事の内容を記入

以下のテンプレートを使用してください：

```markdown
---
title: 'Panduan Lengkap Takoboto untuk Pembelajaran Bahasa Jepang'
description: 'Setup dan penggunaan Takoboto dengan sistem dictionary yang powerful untuk mencari kosakata bahasa Jepang secara efektif.'
publishedDate: '2025-01-25T00:00:00.000Z'
author: 'Tim GoRakuDo'

# Tool-Specific Metadata
toolName: 'Takoboto'

# Difficulty and Setup Information
difficulty: 'beginner'
setupTime: '5 minutes'

# Visual Elements
icon: '/img/tools/takoboto-icon.png'

# Content Classification
tags: ['takoboto', 'dictionary', 'japanese', 'vocabulary', 'search']
categories: ['tools', 'tools/dictionary', 'tools/takoboto']

# SEO and Discovery
keywords:
  - 'takoboto'
  - 'dictionary'
  - 'japanese'
  - 'vocabulary'
  - 'search'

relatedTools:
  - 'Yomitan'
  - 'Anki'
  - 'Migaku'

# Content
---

# Pengenalan Takoboto

Takoboto adalah aplikasi dictionary bahasa Jepang yang sangat powerful...

## Fitur Utama

- **Pencarian Cepat**: Mencari kosakata dengan mudah
- **Audio Pronunciation**: Mendengarkan pengucapan yang benar
- **Example Sentences**: Melihat contoh penggunaan kata

## Cara Install

1. Buka website resmi Takoboto
2. Download aplikasi sesuai platform
3. Install dan buka aplikasi
4. Mulai mencari kosakata!

## Tips Penggunaan

- Gunakan romaji untuk pencarian yang lebih mudah
- Simpan kata favorit untuk referensi cepat
- Manfaatkan fitur audio untuk pelafalan

## Kesimpulan

Takoboto adalah tool yang sangat berguna untuk...
```

### ステップ3: アイコンの追加

1. **アイコンファイルを準備**
   - サイズ: 240x240px
   - 形式: WebP（推奨）またはPNG
   - ファイル名: `[ツール名]-icon-240.webp`

2. **アイコンを配置**
   ```
   public/icon/[ツール名]-icon-240.webp
   ```
   例: `public/icon/takoboto-icon-240.webp`

### ステップ4: ツール設定の追加

`src/pages/tools/[tool]/index.astro`の`toolConfigs`に新しいツールを追加：

```javascript
const toolConfigs = {
  anki: { 
    iconPath: '/icon/anki-icon-240.webp', 
    description: '...' 
  },
  migaku: { 
    iconPath: '/icon/migaku-icon-240.webp', 
    description: '...' 
  },
  yomitan: { 
    iconPath: '/icon/yomitan-icon-240.webp', 
    description: '...' 
  },
  // 新しいツールを追加
  takoboto: { 
    iconPath: '/icon/takoboto-icon-240.webp', 
    description: 'Takoboto adalah aplikasi dictionary bahasa Jepang yang sangat powerful untuk mencari kosakata dan mempelajari bahasa Jepang dengan mudah.' 
  }
} as const;
```

### ステップ5: 動作確認

1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

2. **ツールページにアクセス**
   ```
   http://localhost:4321/tools/takoboto
   ```

3. **表示を確認**
   - ヘッダーにツール名とアイコンが表示される
   - 記事一覧が正しく表示される
   - ナビゲーションが機能する

---

## 既存ツールの編集

### 記事の編集

1. **記事ファイルを開く**
   ```
   src/content/tool-articles/[ツール名]/[記事名].md
   ```

2. **内容を編集**
   - タイトル、説明、内容を更新
   - タグやカテゴリを調整

3. **保存して確認**
   - 変更が自動的に反映されます

### ツール設定の編集

1. **設定ファイルを開く**
   ```
   src/pages/tools/[tool]/index.astro
   ```

2. **toolConfigsを編集**
   ```javascript
   takoboto: { 
     iconPath: '/icon/takoboto-icon-240.webp', 
     description: '新しい説明文...' 
   }
   ```

3. **保存して確認**

### アイコンの変更

1. **新しいアイコンを準備**
2. **ファイルを置き換え**
   ```
   public/icon/[ツール名]-icon-240.webp
   ```
3. **設定ファイルのパスを確認**

---

## ツールの削除

### 記事の削除

1. **記事ファイルを削除**
   ```
   src/content/tool-articles/[ツール名]/[記事名].md
   ```

2. **フォルダが空になったら削除**
   ```
   src/content/tool-articles/[ツール名]/
   ```

### ツール設定の削除

1. **設定ファイルを開く**
   ```
   src/pages/tools/[tool]/index.astro
   ```

2. **toolConfigsから削除**
   ```javascript
   // この行を削除
   takoboto: { 
     iconPath: '/icon/takoboto-icon-240.webp', 
     description: '...' 
   }
   ```

3. **アイコンファイルを削除**
   ```
   public/icon/[ツール名]-icon-240.webp
   ```

---

## トラブルシューティング

### よくある問題

#### 1. ツールが表示されない

**原因**: 記事の`toolName`が正しく設定されていない

**解決方法**:
```markdown
---
toolName: 'Takoboto'  # 正確なツール名を記入
---
```

#### 2. アイコンが表示されない

**原因**: アイコンファイルのパスが間違っている

**解決方法**:
1. ファイルが正しい場所にあるか確認
   ```
   public/icon/takoboto-icon-240.webp
   ```
2. 設定ファイルのパスを確認
   ```javascript
   iconPath: '/icon/takoboto-icon-240.webp'
   ```

#### 3. 記事が表示されない

**原因**: 記事の`toolName`とツール名が一致していない

**解決方法**:
- 記事の`toolName`を確認
- ツール名の大文字小文字を統一

#### 4. ビルドエラーが発生

**原因**: 設定ファイルの構文エラー

**解決方法**:
1. 設定ファイルの構文を確認
2. カンマや括弧の位置を確認
3. 開発サーバーでエラーメッセージを確認

### デバッグ手順

1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

2. **コンソールでエラーを確認**
   - ブラウザの開発者ツールを開く
   - Consoleタブでエラーメッセージを確認

3. **ビルドテストを実行**
   ```bash
   npm run build
   ```

---

## よくある質問

### Q: 新しいツールを追加するのにコーディングは必要ですか？

A: 基本的には不要です。記事ファイルとアイコンファイルを追加し、設定ファイルに1行追加するだけです。

### Q: ツール名は英語でなければなりませんか？

A: はい、`toolName`は英語で記入してください。表示名は`title`で日本語やインドネシア語を使用できます。

### Q: アイコンはどのサイズが最適ですか？

A: 240x240pxのWebP形式が推奨です。PNG形式でも使用できます。

### Q: 記事を複数作成できますか？

A: はい、1つのツールに対して複数の記事を作成できます。

### Q: ツールを一時的に非表示にできますか？

A: 記事の`status`を`draft`に設定することで非表示にできます。

---

## 📞 サポート

問題が解決しない場合は、技術チームにご連絡ください。

- **緊急時**: 直接連絡
- **一般的な質問**: このガイドを参照
- **新機能の要望**: チーム会議で提案

---

*最終更新: 2025年1月25日*
*バージョン: 1.0*
