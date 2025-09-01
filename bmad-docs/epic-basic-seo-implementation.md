<!-- Powered by BMAD™ Core -->

# Story 5: BasicSEO実装とキーワード管理システム構築

## Status

**🚀 READY FOR IMPLEMENTATION** - 手動入力方式によるBasicSEO実装とキーワード管理システム構築の企画書完成
**🎯 PLANNED** - 2週間の実装計画、手動キーワード管理システム、Frontmatterサポート
**📋 REQUIREMENTS DEFINED** - 詳細な要件定義、技術仕様、実装計画が策定完了
**⚠️ CRITICAL WARNING** - 既存システムの変更禁止箇所が特定され、厳格な遵守が必要

## Story

**As a** コンテンツ作成者,
**I want** SEO特化型のBasicSEOコンポーネントと手動キーワード管理システムを構築する,
**So that** 既存のHeadSEO.astroを改善し、よりわかりやすくSEOPropertyを自由自在に変更しやすく、記事ごとのキーワードを手動で管理できるシステムを実現できる.

## 高校生向け説明

### 🎯 何をやるの？

Story 5では、既存のHeadSEO.astroコンポーネントを改善して、SEO（検索エンジン最適化）に特化したBasicSEOコンポーネントを作るんだ。

**BasicSEOコンポーネントって何？**
- 検索エンジンで見つけやすくするための設定を簡単に変更できるコンポーネント
- 記事ごとにキーワードを手動で設定できる機能
- Frontmatter（記事の先頭の設定部分）でSEO設定を管理できる機能

**手動キーワード管理って何？**
- 自動生成ではなく、人間が記事に合ったキーワードを手動で入力
- 主要キーワード、ロングテールキーワード、記事固有キーワードを分けて管理
- キーワードの妥当性をチェックする機能

### 🔧 どうやって実装するの？

1. **既存システムの改善**: 今あるHeadSEO.astroを基盤として活用（DRY原則）
2. **手動入力システム**: 自動生成を除外し、手動でキーワードを入力する方式
3. **Frontmatterサポート**: 記事の先頭でSEO設定を管理できる機能
4. **段階的移行**: 既存システムと併用しながら段階的に移行

## 🚨 CRITICAL WARNING: 変更禁止箇所の厳格な遵守

### ⚠️ 絶対に変更・削除してはいけないファイル・コード

**1. 既存HeadSEO.astroコンポーネント（src/components/public-components/HeadSEO.astro）**
- **変更禁止**: 既存のProps interface、構造化データ、OGP設定、Twitter Card設定
- **削除禁止**: 既存のメタタグ、リソースヒント、AI最適化機能
- **理由**: 既存記事のSEO設定が破損し、検索エンジンの可視性が失われる

**2. 既存SEO最適化システム（src/utils/ai/seo-optimizer.ts）**
- **変更禁止**: SEOOptimizerクラスの既存メソッド（extractKeywords、optimizeTitle、generateStructuredKeywords）
- **削除禁止**: 既存の日本語・インドネシア語キーワードセット
- **理由**: 既存のSEO最適化機能が停止し、コンテンツの品質が低下する

**3. 既存メタデータ管理システム（src/utils/metadata-loader.ts）**
- **変更禁止**: loadMetadata、getSEOFromMetadata、getRecommendationsFromMetadata関数
- **削除禁止**: MetadataContent、LoadedMetadataインターフェース
- **理由**: 既存記事のメタデータ読み込みが失敗し、SEOデータが失われる

**4. 既存型定義システム（src/types/）**
- **変更禁止**: 既存の型定義ファイル（base-integration.ts、fallback-system.ts、metadata-input.ts）
- **削除禁止**: 既存のインターフェースと型定義
- **理由**: TypeScript型チェックが失敗し、ビルドエラーが発生する

**5. 既存設定ファイル**
- **変更禁止**: astro.config.mjs、tsconfig.json、tailwind.config.mjs
- **削除禁止**: package.json、.gitignore、.prettierrc
- **理由**: プロジェクトの設定が破損し、開発環境が停止する

### 🔒 変更可能な箇所（新規作成のみ）

**1. 新規BasicSEOコンポーネント**
- **作成可能**: `src/components/public-components/BasicSEO.astro`（新規ファイル）
- **制限**: 既存のHeadSEO.astroを参照・拡張するが、直接変更は禁止

**2. 新規型定義**
- **作成可能**: `src/types/basic-seo.ts`（新規ファイル）
- **制限**: 既存の型定義と競合しないよう注意

**3. 新規ユーティリティ**
- **作成可能**: `src/utils/manual-keyword-validator.ts`（新規ファイル）
- **作成可能**: `src/utils/manual-frontmatter-parser.ts`（新規ファイル）
- **制限**: 既存のユーティリティ関数を上書きしない

**4. 新規テスト**
- **作成可能**: `tests/unit/basic-seo/`（新規ディレクトリ）
- **作成可能**: `tests/integration/basic-seo/`（新規ディレクトリ）
- **制限**: 既存のテストファイルを変更しない

### 🚫 厳格な遵守ルール

**1. 既存ファイルの変更禁止**
```bash
# 絶対に実行してはいけないコマンド
rm src/components/public-components/HeadSEO.astro
rm src/utils/ai/seo-optimizer.ts
rm src/utils/metadata-loader.ts
rm src/types/base-integration.ts
```

**2. 既存コードの上書き禁止**
```typescript
// 絶対に実行してはいけない
// 既存のSEOOptimizerクラスを上書き
export class SEOOptimizer {
  // 既存メソッドの変更・削除禁止
}
```

**3. 既存インターフェースの変更禁止**
```typescript
// 絶対に実行してはいけない
// 既存のProps interfaceを変更
export interface Props {
  // 既存プロパティの変更・削除禁止
}
```

**4. 既存設定の変更禁止**
```json
// 絶対に変更してはいけない
{
  "compilerOptions": {
    "strict": true,  // 変更禁止
    "target": "ES2020"  // 変更禁止
  }
}
```

## Acceptance Criteria

**BasicSEOコンポーネント要件:**

1. 手動キーワード管理システムの実装完了
2. Frontmatterサポートの実装完了
3. BasicSEOProps型定義の実装完了
4. キーワード検証システムの実装完了
5. 既存HeadSEO.astroとの併用機能実装完了

**品質保証要件:**

6. TypeScript型チェック通過（0エラー、0警告）
7. ビルド成功率100%達成
8. 既存システムとの互換性維持
9. パフォーマンステスト通過
10. 段階的移行計画の実行完了

**🚨 安全性要件（必須）:**

11. 既存ファイルの変更・削除0件
12. 既存コードの上書き0件
13. 既存設定の変更0件
14. 新規ファイルのみの作成

## 技術仕様

### 1. BasicSEOProps型定義

```typescript
// src/types/basic-seo.ts（新規作成）
export interface BasicSEOProps {
  // 基本SEO（必須・手動入力）
  title: string;
  description: string;
  
  // キーワード管理（手動入力）
  primaryKeywords: string[];      // 主要キーワード（5個まで）
  longTailKeywords?: string[];    // ロングテールキーワード（10個まで）
  articleKeywords?: string[];     // 記事固有キーワード（5個まで）
  categoryKeywords?: string[];    // カテゴリキーワード（手動入力）
  
  // SEOProperty（手動入力）
  seoProperty?: {
    articleType: "guide" | "methodology" | "tool" | "theory";
    learningStage: "alphabet" | "basic-grammar" | "intermediate" | "advanced";
    searchIntent: "informational" | "navigational" | "transactional";
  };
  
  // 基本設定（手動入力）
  canonicalUrl?: string;
  lang?: "id" | "ja";
  noIndex?: boolean;
  ogImage?: ImageMetadata;
  pageType?: "website" | "article";
  publishedDate?: string;
  modifiedDate?: string;
  authorName?: string;
  alternateUrl?: string;
}
```

### 2. キーワード検証システム

```typescript
// src/utils/manual-keyword-validator.ts（新規作成）
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  optimizedKeywords: string[];
}

export class ManualKeywordValidator {
  validateKeywords(keywords: string[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 長さチェック
    keywords.forEach((keyword, index) => {
      if (keyword.length < 2) {
        errors.push(`キーワード${index + 1}が短すぎます: ${keyword}`);
      }
      if (keyword.length > 50) {
        warnings.push(`キーワード${index + 1}が長すぎます: ${keyword}`);
      }
    });
    
    // 重複チェック
    const duplicates = keywords.filter((item, index) => keywords.indexOf(item) !== index);
    if (duplicates.length > 0) {
      warnings.push(`重複キーワード: ${duplicates.join(', ')}`);
    }
    
    // 個数チェック
    if (keywords.length > 10) {
      warnings.push('キーワード数が多すぎます（推奨: 10個まで）');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      optimizedKeywords: this.optimizeKeywords(keywords)
    };
  }
  
  optimizeKeywords(keywords: string[]): string[] {
    // 重複除去
    const uniqueKeywords = [...new Set(keywords)];
    
    // 長さフィルタリング（2文字以上50文字以下）
    const filteredKeywords = uniqueKeywords.filter(k => 
      k.length >= 2 && k.length <= 50
    );
    
    // 個数制限（10個まで）
    return filteredKeywords.slice(0, 10);
  }
}
```

### 3. Frontmatterサポート

```yaml
# 記事のFrontmatterでのSEO設定例
---
title: "日本語学習ガイド"
description: "効果的な日本語学習方法を紹介します"
publishedDate: "2024-12-31T00:00:00.000Z"

# SEO設定（手動入力）
seo:
  # キーワード管理（手動入力）
  primaryKeywords: ["日本語学習", "イマージョン", "GoRakuDo"]
  longTailKeywords: ["初心者向け日本語学習", "イマージョン学習法"]
  articleKeywords: ["学習ガイド", "効果的な学習"]
  categoryKeywords: ["教育", "言語学習"]
  
  # SEOProperty（手動入力）
  articleType: "guide"
  learningStage: "intermediate"
  searchIntent: "informational"
  
  # 基本SEO設定（手動入力）
  canonicalUrl: "/docs/japanese-learning-guide"
  noIndex: false
  lang: "ja"
  ogImage: "/images/japanese-learning-guide.png"
---
```

## 実装計画（詳細版）

### Story 1: 設計・基盤構築（1週間）

**Day 1: 要件分析と詳細設計**
- [ ] 手動入力方式の詳細設計
  - キーワード入力フォームのUI/UX設計
  - バリデーションルールの詳細化
  - エラーメッセージの日本語化
- [ ] BasicSEOProps型定義の詳細設計
  - 各プロパティの制約条件の明確化
  - デフォルト値の設定
  - 必須・オプションプロパティの分類
- [ ] キーワード管理システムの詳細設計
  - キーワード階層構造の設計
  - 重複チェックアルゴリズムの設計
  - キーワード最適化ロジックの設計

**Day 2: システム設計と統合計画**
- [ ] Frontmatter統合の詳細設計
  - YAMLパーサーの設計
  - 型安全性の確保
  - エラーハンドリングの設計
- [ ] 既存システムとの統合設計
  - HeadSEO.astroとの連携方法
  - 段階的移行の具体的な手順
  - 互換性チェックの方法

**Day 3: 基盤構築 - 型定義とバリデーター**
- [ ] ManualKeywordValidatorクラスの実装
  - キーワード長チェック（2-50文字）
  - 重複チェック（大文字小文字区別なし）
  - 個数制限チェック（最大10個）
  - 日本語文字チェック
- [ ] 型定義ファイルの作成
  - basic-seo.tsの完全実装
  - 既存型定義との競合回避
  - JSDocコメントの追加

**Day 4: 基盤構築 - パーサーとテスト環境**
- [ ] ManualFrontmatterParserクラスの実装
  - YAMLパース機能
  - 型安全性チェック
  - エラーレポート機能
- [ ] テスト環境の構築
  - Jest設定の追加
  - テストファイルのテンプレート作成
  - モックデータの準備

**Day 5: 設計レビューと品質保証**
- [ ] 設計書の詳細レビュー
  - 技術的実現可能性の確認
  - パフォーマンス要件の確認
  - セキュリティ要件の確認
- [ ] 実装計画の最終確認
  - 各タスクの依存関係の確認
  - リスク要因の特定と対策
  - 品質保証プロセスの確認

### Story 2: 実装・統合（1週間）

**Day 1: BasicSEOコンポーネント実装 - 基本構造**
- [ ] BasicSEO.astroコンポーネントの基本実装
  - Props interfaceの実装
  - 基本HTML構造の実装
  - メタタグ生成ロジックの実装
  - 構造化データの実装
- [ ] 手動キーワード管理機能の基本実装
  - キーワード表示機能
  - キーワード検証機能の統合
  - エラー表示機能

**Day 2: BasicSEOコンポーネント実装 - 高度機能**
- [ ] OGP・Twitter Card対応の実装
  - Open Graph メタタグの生成
  - Twitter Card メタタグの生成
  - 画像最適化の実装
- [ ] 多言語対応の実装
  - hreflangタグの生成
  - 言語別メタデータの生成
  - 代替URLの設定

**Day 3: Frontmatter統合と既存システム連携**
- [ ] Frontmatterサポートの完全実装
  - YAMLパーサーの統合
  - 型安全性の確保
  - エラーハンドリングの実装
- [ ] 既存システムとの統合実装
  - HeadSEO.astroとの連携
  - 段階的移行の準備
  - 互換性チェックの実装

**Day 4: 統合テストと品質保証**
- [ ] 既存HeadSEO.astroとの併用テスト
  - 同時使用時の動作確認
  - 競合の有無の確認
  - パフォーマンスへの影響確認
- [ ] 手動キーワード入力の包括テスト
  - 正常系テスト（有効なキーワード）
  - 異常系テスト（無効なキーワード）
  - 境界値テスト（制限値の確認）

**Day 5: 最終統合とパフォーマンステスト**
- [ ] Frontmatter統合の包括テスト
  - 各種Frontmatter形式のテスト
  - エラーケースのテスト
  - 型安全性のテスト
- [ ] パフォーマンステストと最適化
  - レンダリング時間の測定
  - メモリ使用量の測定
  - 既存システムとの比較
  - 必要に応じた最適化

## ファイル構成

### 新規作成ファイル

**型定義:**
- `src/types/basic-seo.ts` - BasicSEOの型定義

**ユーティリティ:**
- `src/utils/manual-keyword-validator.ts` - 手動キーワード検証
- `src/utils/manual-frontmatter-parser.ts` - Frontmatterパーサー

**コンポーネント:**
- `src/components/public-components/BasicSEO.astro` - BasicSEOコンポーネント

**テスト:**
- `tests/unit/basic-seo/` - 単体テスト
- `tests/integration/basic-seo/` - 統合テスト

### 既存ファイル拡張

**テンプレート拡張:**
- `src/content/templates/post-template.md` - SEO設定の追加

## 移行戦略

### 段階的併用戦略

**Story 1: BasicSEOコンポーネント作成**
- 新規BasicSEOコンポーネントの実装
- 既存HeadSEO.astroとの併用準備

**Story 2: 新規記事でのBasicSEO使用開始**
- 新規記事でBasicSEO使用開始
- Frontmatter統合のテスト
- パフォーマンス比較

**Story 3: 既存記事の段階的移行**
- 既存記事のBasicSEOへの移行
- パフォーマンス監視
- 問題発生時の対応

**Story 4: 完全移行（パフォーマンス比較完了後）**
- 既存HeadSEO.astroからの完全移行
- システム統合の完了
- 運用ガイドの作成

## 期待される効果

### 1. SEO効果の向上
- 手動最適化による高品質なキーワード設定
- 構造化データによるリッチスニペット表示
- 多言語対応による国際SEO強化

### 2. 運用効率の向上
- 手動入力による完全なコントロール
- Frontmatter統合による設定の簡素化
- 柔軟なSEOProperty変更による対応力向上

### 3. 保守性の向上
- シンプルなBasicSEOコンポーネント
- 型安全性によるエラー防止
- 段階的移行によるリスク最小化

## 成功基準（詳細版）

### 必須達成項目
- **TypeScript型チェック**: 0エラー、0警告
- **ビルド成功率**: 100%
- **キーワード検証**: 100%正常動作
- **Frontmatter統合**: 100%正常動作
- **既存システム互換性**: 100%維持

### 品質測定指標
- **SEO品質スコア**: 80%以上
- **コンポーネント品質**: 90%以上
- **テストカバレッジ**: 95%以上
- **パフォーマンス**: 既存システムと同等以上

### 具体的なテストケース

#### **1. キーワード検証テスト**
```typescript
// 正常系テスト
test('有効なキーワードの検証', () => {
  const keywords = ['日本語学習', 'イマージョン', 'GoRakuDo'];
  const result = validator.validateKeywords(keywords);
  expect(result.isValid).toBe(true);
  expect(result.errors).toHaveLength(0);
});

// 異常系テスト
test('無効なキーワードの検証', () => {
  const keywords = ['a', '日本語学習', '']; // 短すぎる、空文字
  const result = validator.validateKeywords(keywords);
  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('キーワード1が短すぎます: a');
});

// 境界値テスト
test('キーワード数の制限チェック', () => {
  const keywords = Array.from({length: 11}, (_, i) => `キーワード${i}`);
  const result = validator.validateKeywords(keywords);
  expect(result.warnings).toContain('キーワード数が多すぎます（推奨: 10個まで）');
});
```

#### **2. Frontmatter統合テスト**
```typescript
// 正常系テスト
test('有効なFrontmatterの解析', () => {
  const frontmatter = `
    seo:
      primaryKeywords: ["日本語学習", "イマージョン"]
      articleType: "guide"
  `;
  const result = parser.parse(frontmatter);
  expect(result.seo.primaryKeywords).toEqual(['日本語学習', 'イマージョン']);
});

// エラーケーステスト
test('無効なFrontmatterの解析', () => {
  const invalidFrontmatter = `
    seo:
      primaryKeywords: "文字列ではなく配列" # 型エラー
  `;
  expect(() => parser.parse(invalidFrontmatter)).toThrow();
});
```

#### **3. 既存システム互換性テスト**
```typescript
// 併用テスト
test('HeadSEO.astroとの併用', () => {
  const page = renderPage({
    headSEO: <HeadSEO {...headSEOProps} />,
    basicSEO: <BasicSEO {...basicSEOProps} />
  });
  expect(page).toHaveValidHTML();
  expect(page).toHaveValidMetaTags();
});

// パフォーマンス比較テスト
test('パフォーマンス比較', () => {
  const headSEOTime = measureRenderTime(<HeadSEO {...props} />);
  const basicSEOTime = measureRenderTime(<BasicSEO {...props} />);
  expect(basicSEOTime).toBeLessThanOrEqual(headSEOTime * 1.1); // 10%以内
});
```

### 品質保証プロセス

#### **1. コードレビュー**
- **自動チェック**: ESLint、Prettier、TypeScript型チェック
- **手動レビュー**: 既存システムへの影響確認
- **セキュリティチェック**: XSS対策、インジェクション対策

#### **2. テスト戦略**
- **単体テスト**: 各クラス・関数の個別テスト
- **統合テスト**: コンポーネント間の連携テスト
- **E2Eテスト**: 実際のページでの動作確認

#### **3. パフォーマンス監視**
- **レンダリング時間**: 100ms以内
- **メモリ使用量**: 既存システムと同等以下
- **バンドルサイズ**: 10KB以内の増加

### 🚨 安全性指標（必須達成）
- **既存ファイル変更**: 0件
- **既存コード上書き**: 0件
- **既存設定変更**: 0件
- **新規ファイル作成**: 100%完了

## リスク管理

### 特定されたリスク
- **既存システムとの互換性**: 段階的移行による軽減
- **Frontmatter統合の複雑性**: シンプルな設計による軽減
- **キーワード検証の精度**: 包括的テストによる品質保証

### 軽減策
- DRY + KISS原則の適用
- 既存システムパターンの活用
- 包括的なテスト戦略

### 🚨 重大リスク（変更禁止違反）
- **既存ファイルの変更・削除**: プロジェクト全体の破損
- **既存コードの上書き**: 既存機能の停止
- **既存設定の変更**: 開発環境の停止

### 🛡️ リスク軽減策（厳格な遵守）
- **変更禁止箇所の事前確認**: 実装前の詳細分析
- **新規ファイルのみの作成**: 既存ファイルへの一切の変更禁止
- **段階的テスト**: 各段階での既存システム動作確認

## エラーハンドリングとトラブルシューティング

### 想定されるエラーと対処法

#### **1. TypeScript型エラー**
```typescript
// エラー: Type 'string' is not assignable to type 'string[]'
// 原因: キーワードが配列ではなく文字列として渡されている
// 対処法: 配列形式で渡す
const props: BasicSEOProps = {
  primaryKeywords: ["キーワード1", "キーワード2"], // 正しい形式
  // primaryKeywords: "キーワード1", // 間違った形式
};

// エラー: Property 'seoProperty' is missing
// 原因: 必須プロパティが不足している
// 対処法: 必須プロパティを追加
const props: BasicSEOProps = {
  title: "タイトル",
  description: "説明",
  primaryKeywords: ["キーワード"],
  seoProperty: { // 必須プロパティ
    articleType: "guide",
    learningStage: "intermediate",
    searchIntent: "informational"
  }
};
```

#### **2. バリデーションエラー**
```typescript
// エラー: キーワードが短すぎます
// 原因: 2文字未満のキーワード
// 対処法: 2文字以上のキーワードを使用
const keywords = ["日本語学習", "イマージョン"]; // 正しい
// const keywords = ["a", "b"]; // 間違った

// エラー: キーワード数が多すぎます
// 原因: 10個を超えるキーワード
// 対処法: 10個以内に制限
const keywords = keywords.slice(0, 10); // 10個に制限
```

#### **3. Frontmatter解析エラー**
```yaml
# エラー: YAML形式が不正
# 原因: インデントや構文の誤り
# 対処法: 正しいYAML形式で記述
---
seo:
  primaryKeywords: ["キーワード1", "キーワード2"]  # 正しい形式
  articleType: "guide"
---

# 間違った形式
---
seo:
primaryKeywords: [キーワード1, キーワード2]  # インデントなし、クォートなし
articleType: guide  # クォートなし
---
```

### デバッグとログ出力

#### **1. 開発時のログ出力**
```typescript
// デバッグモードでの詳細ログ
if (process.env.NODE_ENV === 'development') {
  console.log('BasicSEO Props:', props);
  console.log('Validation Result:', validationResult);
  console.log('Parsed Frontmatter:', parsedFrontmatter);
}
```

#### **2. エラー時の詳細情報**
```typescript
try {
  const result = validator.validateKeywords(keywords);
  return result;
} catch (error) {
  console.error('キーワード検証エラー:', {
    keywords,
    error: error.message,
    stack: error.stack
  });
  throw error;
}
```

## 次のステップ

1. **実装開始の承認**: この企画書での実装開始
2. **Story 1の開始**: 設計・基盤構築フェーズの開始
3. **定期レビュー**: 各フェーズ完了時のレビュー実施
4. **🚨 安全性確認**: 各段階での既存システム保護確認
5. **エラー監視**: 実装中のエラー発生状況の監視
6. **品質チェック**: 各段階での品質基準の確認

この品質保証分析により、既存システムの安全性を保証しながら、新規BasicSEOコンポーネントの高品質な実装が可能になります。各フェーズでの品質ゲートを確実に通過し、プロジェクトの成功を保証します。

---

## 🔍 要件とテストのトレーサビリティマッピング（Given-When-Thenパターン）

### 📋 要件トレーサビリティマトリックス

#### **REQ-001: 手動キーワード管理システム**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-001-01 | 有効なキーワード配列が入力される | ManualKeywordValidator.validateKeywords()が実行される | 検証結果が有効（isValid: true）で返される | 100%動作 | 🔄 計画中 |
| TC-001-02 | 短すぎるキーワード（2文字未満）が含まれる | バリデーションが実行される | エラーメッセージが返され、isValid: falseになる | 100%精度 | 🔄 計画中 |
| TC-001-03 | 長すぎるキーワード（50文字超過）が含まれる | バリデーションが実行される | 警告メッセージが返され、最適化されたキーワードが返される | 95%精度 | 🔄 計画中 |
| TC-001-04 | 重複キーワードが含まれる | 重複チェックが実行される | 警告メッセージが返され、重複が除去されたキーワードが返される | 100%精度 | 🔄 計画中 |
| TC-001-05 | 10個を超えるキーワードが入力される | 個数制限チェックが実行される | 警告メッセージが返され、10個に制限されたキーワードが返される | 100%精度 | 🔄 計画中 |

#### **REQ-002: Frontmatterサポート**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-002-01 | 有効なYAML形式のFrontmatterが入力される | ManualFrontmatterParser.parse()が実行される | パースされたSEO設定オブジェクトが返される | 100%動作 | 🔄 計画中 |
| TC-002-02 | 無効なYAML形式のFrontmatterが入力される | パース処理が実行される | 適切なエラーメッセージが返される | 100%エラーハンドリング | 🔄 計画中 |
| TC-002-03 | 必須SEOプロパティが不足しているFrontmatter | バリデーションが実行される | 必須プロパティ不足のエラーメッセージが返される | 100%検証 | 🔄 計画中 |
| TC-002-04 | ネストされたSEO設定が含まれる | 深いネストのパースが実行される | 正しく構造化されたSEO設定オブジェクトが返される | 100%動作 | 🔄 計画中 |
| TC-002-05 | 多言語対応のFrontmatterが入力される | 言語別設定のパースが実行される | 言語別に適切に処理された設定が返される | 100%動作 | 🔄 計画中 |

#### **REQ-003: BasicSEOProps型定義**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-003-01 | 必須プロパティのみでBasicSEOPropsが定義される | TypeScript型チェックが実行される | 型エラーが発生しない | 0エラー | 🔄 計画中 |
| TC-003-02 | オプションプロパティを含むBasicSEOPropsが定義される | 型チェックが実行される | 型エラーが発生しない | 0エラー | 🔄 計画中 |
| TC-003-03 | 無効な型のプロパティが設定される | 型チェックが実行される | 適切な型エラーが発生する | 100%型安全性 | 🔄 計画中 |
| TC-003-04 | 既存型定義との競合が発生する可能性がある | 型定義の競合チェックが実行される | 競合が検出され、適切に解決される | 100%競合解決 | 🔄 計画中 |
| TC-003-05 | 厳密なTypeScript設定でビルドが実行される | ビルドプロセスが実行される | ビルドが成功し、型エラーが0件になる | 100%ビルド成功 | 🔄 計画中 |

#### **REQ-004: キーワード検証システム**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-004-01 | 日本語キーワードが入力される | 日本語文字チェックが実行される | 日本語キーワードが正しく検証される | 95%精度 | 🔄 計画中 |
| TC-004-02 | インドネシア語キーワードが入力される | インドネシア語文字チェックが実行される | インドネシア語キーワードが正しく検証される | 95%精度 | 🔄 計画中 |
| TC-004-03 | 英数字キーワードが入力される | 英数字文字チェックが実行される | 英数字キーワードが正しく検証される | 95%精度 | 🔄 計画中 |
| TC-004-04 | 特殊文字を含むキーワードが入力される | 特殊文字チェックが実行される | 適切に処理されたキーワードが返される | 90%精度 | 🔄 計画中 |
| TC-004-05 | 空文字やnull値が入力される | 空値チェックが実行される | 適切なエラーメッセージが返される | 100%エラーハンドリング | 🔄 計画中 |

#### **REQ-005: 既存システム併用**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-005-01 | HeadSEO.astroとBasicSEOが同時に使用される | 両コンポーネントが同時レンダリングされる | 競合なく両方のSEO設定が適用される | 100%互換性 | 🔄 計画中 |
| TC-005-02 | 既存SEO最適化システムが動作している | BasicSEOが新規実装される | 既存システムの動作に影響しない | 100%非干渉 | 🔄 計画中 |
| TC-005-03 | 既存メタデータ管理システムが動作している | 新規メタデータが追加される | 既存メタデータとの競合が発生しない | 100%競合回避 | 🔄 計画中 |
| TC-005-04 | 既存型定義システムが動作している | 新規型定義が追加される | 既存型定義との競合が発生しない | 100%競合回避 | 🔄 計画中 |
| TC-005-05 | 段階的移行が実行される | 既存システムから新規システムへの移行が実行される | 既存機能が停止することなく移行が完了する | 100%継続性 | 🔄 計画中 |

### 🧪 テストシナリオ詳細（Given-When-Then形式）

#### **TC-001-01: 有効なキーワードの検証**

```typescript
describe('ManualKeywordValidator - 有効なキーワード検証', () => {
  test('正常なキーワード配列の検証', () => {
    // Given: 有効なキーワード配列が準備される
    const validKeywords = ['日本語学習', 'イマージョン', 'GoRakuDo'];
    const validator = new ManualKeywordValidator();
    
    // When: バリデーションが実行される
    const result = validator.validateKeywords(validKeywords);
    
    // Then: 検証結果が有効で返される
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.optimizedKeywords).toEqual(validKeywords);
    expect(result.warnings).toHaveLength(0);
  });
});
```

#### **TC-002-01: 有効なFrontmatterの解析**

```typescript
describe('ManualFrontmatterParser - 有効なFrontmatter解析', () => {
  test('正常なYAML形式の解析', () => {
    // Given: 有効なYAML形式のFrontmatterが準備される
    const validFrontmatter = `
      seo:
        primaryKeywords: ["日本語学習", "イマージョン"]
        articleType: "guide"
        learningStage: "intermediate"
        searchIntent: "informational"
    `;
    const parser = new ManualFrontmatterParser();
    
    // When: パース処理が実行される
    const result = parser.parse(validFrontmatter);
    
    // Then: パースされたSEO設定オブジェクトが返される
    expect(result.seo.primaryKeywords).toEqual(['日本語学習', 'イマージョン']);
    expect(result.seo.articleType).toBe('guide');
    expect(result.seo.learningStage).toBe('intermediate');
    expect(result.seo.searchIntent).toBe('informational');
  });
});
```

#### **TC-003-01: 必須プロパティの型チェック**

```typescript
describe('BasicSEOProps - 必須プロパティの型チェック', () => {
  test('必須プロパティのみでの型定義', () => {
    // Given: 必須プロパティのみでBasicSEOPropsが定義される
    const basicProps: BasicSEOProps = {
      title: '日本語学習ガイド',
      description: '効果的な日本語学習方法を紹介します',
      primaryKeywords: ['日本語学習', 'イマージョン'],
      seoProperty: {
        articleType: 'guide',
        learningStage: 'intermediate',
        searchIntent: 'informational'
      }
    };
    
    // When: TypeScript型チェックが実行される
    // Then: 型エラーが発生しない（コンパイル成功）
    expect(basicProps.title).toBe('日本語学習ガイド');
    expect(basicProps.primaryKeywords).toHaveLength(2);
    expect(basicProps.seoProperty.articleType).toBe('guide');
  });
});
```

#### **TC-004-01: 日本語キーワードの検証**

```typescript
describe('ManualKeywordValidator - 日本語キーワード検証', () => {
  test('日本語文字の正確な検証', () => {
    // Given: 日本語キーワードが準備される
    const japaneseKeywords = ['日本語', 'ひらがな', 'カタカナ', '漢字', '文法'];
    const validator = new ManualKeywordValidator();
    
    // When: 日本語文字チェックが実行される
    const result = validator.validateKeywords(japaneseKeywords);
    
    // Then: 日本語キーワードが正しく検証される
    expect(result.isValid).toBe(true);
    expect(result.optimizedKeywords).toEqual(japaneseKeywords);
    expect(result.errors).toHaveLength(0);
  });
});
```

#### **TC-005-01: 既存システムとの併用**

```typescript
describe('BasicSEO Integration - 既存システム併用', () => {
  test('HeadSEO.astroとの競合回避', () => {
    // Given: HeadSEO.astroとBasicSEOの両方が準備される
    const headSEOProps = {
      title: '既存タイトル',
      description: '既存説明',
      lang: 'ja' as const
    };
    
    const basicSEOProps: BasicSEOProps = {
      title: '新規タイトル',
      description: '新規説明',
      primaryKeywords: ['新規キーワード'],
      seoProperty: {
        articleType: 'guide',
        learningStage: 'intermediate',
        searchIntent: 'informational'
      }
    };
    
    // When: 両コンポーネントが同時にレンダリングされる
    const page = renderPage({
      headSEO: <HeadSEO {...headSEOProps} />,
      basicSEO: <BasicSEO {...basicSEOProps} />
    });
    
    // Then: 競合なく両方のSEO設定が適用される
    expect(page).toHaveValidHTML();
    expect(page).toHaveValidMetaTags();
    expect(page).toHaveNoConflictingMetaTags();
    expect(page).toContain('既存タイトル');
    expect(page).toContain('新規キーワード');
  });
});
```

### 📊 トレーサビリティマトリックス（詳細版）

#### **要件→テストケース→実装ファイルのマッピング**

| 要件ID | 要件内容 | テストケース | 実装ファイル | テストファイル | 品質基準 | ステータス |
|--------|----------|--------------|--------------|----------------|----------|------------|
| REQ-001 | 手動キーワード管理システム | TC-001-01〜TC-001-05 | `manual-keyword-validator.ts` | `test-keyword-validator.test.ts` | 95%精度 | 🔄 計画中 |
| REQ-002 | Frontmatterサポート | TC-002-01〜TC-002-05 | `manual-frontmatter-parser.ts` | `test-frontmatter-parser.test.ts` | 100%動作 | 🔄 計画中 |
| REQ-003 | BasicSEOProps型定義 | TC-003-01〜TC-003-05 | `basic-seo.ts` | `test-type-definitions.test.ts` | 0エラー | 🔄 計画中 |
| REQ-004 | キーワード検証システム | TC-004-01〜TC-004-05 | `manual-keyword-validator.ts` | `test-keyword-validator.test.ts` | 95%精度 | 🔄 計画中 |
| REQ-005 | 既存システム併用 | TC-005-01〜TC-005-05 | `BasicSEO.astro` | `test-integration.test.ts` | 100%互換性 | 🔄 計画中 |

#### **テストカバレッジ目標**

- **単体テストカバレッジ**: 95%以上
- **統合テストカバレッジ**: 90%以上
- **E2Eテストカバレッジ**: 85%以上
- **要件カバレッジ**: 100%

#### **品質ゲートでのトレーサビリティ確認**

**🧪 品質ゲート1: 設計完了**
- [ ] 全要件（REQ-001〜REQ-005）の詳細分析完了
- [ ] 全テストケース（TC-001-01〜TC-005-05）の設計完了
- [ ] 実装ファイルとテストファイルの対応関係確認完了

**🧪 品質ゲート2: 実装完了**
- [ ] 全テストケースの単体テスト実装完了
- [ ] 全要件の実装完了
- [ ] 型安全性の確認完了

**🧪 品質ゲート3: 統合完了**
- [ ] 全テストケースの統合テスト完了
- [ ] 要件トレーサビリティの最終確認完了
- [ ] 品質基準の達成確認完了

---

この要件トレーサビリティマッピングにより、各要件が具体的なテストケースと実装ファイルに明確に紐づけられ、Given-When-Thenパターンによる包括的な品質保証が実現されます。
