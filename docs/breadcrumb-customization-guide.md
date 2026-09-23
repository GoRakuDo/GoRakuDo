# パンくずリストカスタマイズガイド

## 概要
このガイドでは、パンくずリスト（Breadcrumb）コンポーネントを簡単にカスタマイズする方法を説明します。技術的な知識がなくても、設定ファイルを編集するだけで見た目やアイコンを変更できます。

## 設定ファイルの場所
```
src/config/breadcrumb-config.ts
```

## 基本的な変更方法

### 1. アイコンの変更

#### 新しいアイコンを追加する場合
`src/config/breadcrumb-config.ts` ファイルの `BREADCRUMB_ICONS` 配列に新しいアイコンを追加します：

```typescript
{
  name: '新しいアイコン名',
  svg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <!-- SVGパスをここに記述 -->
  </svg>`,
  description: 'アイコンの説明'
}
```

#### 既存のアイコンを変更する場合
`BREADCRUMB_ICONS` 配列内の該当するアイコンの `svg` 部分を新しいSVGコードに置き換えます。

### 2. パス別アイコンの設定

特定のパスで表示されるアイコンを変更したい場合は、`PATH_ICON_MAP` を編集します：

```typescript
export const PATH_ICON_MAP: Record<string, string> = {
  'docs': 'book',        // /docs パスで本のアイコン
  'pages': 'document',   // /pages パスでドキュメントのアイコン
  'support-us': 'folder', // /support-us パスでフォルダーのアイコン
  'tools': 'tools'       // /tools パスでツールのアイコン
};
```

### 3. ツール別アイコンの設定

各ツールのアイコンを変更したい場合は、`TOOL_ICON_MAP` を編集します：

```typescript
export const TOOL_ICON_MAP: Record<string, string> = {
  'anki': 'anki',      // Ankiツールのアイコン
  'migaku': 'migaku',  // Migakuツールのアイコン
  'yomitan': 'yomitan' // Yomitanツールのアイコン
};
```

### 4. デフォルト設定の変更

全体的な見た目を変更したい場合は、`BREADCRUMB_DEFAULTS` を編集します：

```typescript
export const BREADCRUMB_DEFAULTS = {
  variant: 'compact',     // 'compact' | 'spacious' | 'minimal' | 'pill' | 'underline'
  theme: 'auto',          // 'light' | 'dark' | 'auto'
  showIcons: true,        // true | false
  orientation: 'horizontal', // 'horizontal' | 'vertical'
  maxItems: 5             // 表示する最大アイテム数
};
```

## よくある変更例

### 例1: ホームアイコンを変更する
```typescript
// BREADCRUMB_ICONS 配列内の home アイコンを探す
{
  name: 'home',
  svg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <!-- 新しいホームアイコンのSVGコード -->
  </svg>`,
  description: 'ホームページのアイコン'
}
```

### 例2: ドキュメントページのアイコンを変更する
```typescript
// PATH_ICON_MAP を編集
export const PATH_ICON_MAP: Record<string, string> = {
  'docs': '新しいアイコン名',  // 本のアイコンから別のアイコンに変更
  // 他の設定...
};
```

### 例3: デフォルトでアイコンを非表示にする
```typescript
export const BREADCRUMB_DEFAULTS = {
  // 他の設定...
  showIcons: false,  // true から false に変更
  // 他の設定...
};
```

## アイコンの取得方法

### 1. Heroicons から取得
https://heroicons.com/ から無料のSVGアイコンを取得できます。

### 2. 他のアイコンライブラリから取得
- Feather Icons: https://feathericons.com/
- Lucide Icons: https://lucide.dev/
- Tabler Icons: https://tabler-icons.io/

### 3. カスタムアイコンの作成
SVGエディタ（Inkscape、Adobe Illustrator等）でカスタムアイコンを作成できます。

## 注意事項

1. **SVGコードの形式**: 必ず `class="w-4 h-4"` を含めてください
2. **ファイル保存**: 変更後は必ずファイルを保存してください
3. **ビルド**: 変更を反映するには、サイトを再ビルドする必要があります
4. **バックアップ**: 重要な変更を行う前に、設定ファイルのバックアップを取ってください

## トラブルシューティング

### アイコンが表示されない場合
1. SVGコードに構文エラーがないか確認
2. アイコン名が正しく設定されているか確認
3. ファイルが正しく保存されているか確認

### 設定が反映されない場合
1. サイトを再ビルドしてください
2. ブラウザのキャッシュをクリアしてください
3. 設定ファイルの構文エラーがないか確認してください

## サポート

設定で困った場合は、開発チームまでお気軽にお問い合わせください。
