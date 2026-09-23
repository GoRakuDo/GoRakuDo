# Auto Date Processing Scripts

このフォルダには、MDXファイルの`publishedDate: 'auto'`を自動処理するスクリプトが含まれています。

## 📁 ファイル構成

### `processor-basic.ts`
- **用途**: 基本的な自動日付処理
- **特徴**: シンプルな実装、すべてのファイルを毎回処理
- **使用場面**: デバッグやテスト用

### `processor-efficient.ts`
- **用途**: 効率化された自動日付処理
- **特徴**: キャッシュ機能、並列処理、変更検知
- **使用場面**: 本番ビルド、パフォーマンス重視

### `watcher.ts`
- **用途**: 開発モード用のファイル監視
- **特徴**: リアルタイム監視、デバウンス処理
- **使用場面**: 開発中の自動処理

## 🚀 使用方法

### 基本的な処理
```bash
npm run process-auto-dates
```

### 効率化された処理（推奨）
```bash
npm run process-auto-dates:fast
```

### キャッシュクリア
```bash
npm run process-auto-dates:clear
```

### 開発モード監視
```bash
npm run dev:watch-dates
```

## 📊 パフォーマンス比較

| スクリプト | 処理時間 | キャッシュ | 並列処理 | 用途 |
|-----------|---------|-----------|---------|------|
| `processor-basic.ts` | 数百ms | ❌ | ❌ | デバッグ |
| `processor-efficient.ts` | 3-6ms | ✅ | ✅ | 本番 |
| `watcher.ts` | リアルタイム | ✅ | ✅ | 開発 |

## 🔧 技術詳細

- **キャッシュ**: `.cache/auto-date-cache.json`に保存
- **並列処理**: 10ファイルずつバッチ処理
- **変更検知**: MD5ハッシュによる差分検知
- **デバウンス**: 1秒の遅延で不要な処理を防止
