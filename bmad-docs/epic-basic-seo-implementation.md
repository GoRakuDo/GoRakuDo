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

## 実装計画

### Story 1: 設計・基盤構築（1週間）

**Day 1-2: 要件分析と設計**
- [ ] 手動入力方式の詳細設計
- [ ] BasicSEOProps型定義の設計
- [ ] キーワード管理システムの設計
- [ ] Frontmatter統合の設計

**Day 3-4: 基盤構築**
- [ ] ManualKeywordValidatorクラスの実装
- [ ] ManualFrontmatterParserクラスの実装
- [ ] 型定義ファイルの作成
- [ ] テスト環境の構築

**Day 5: 設計レビュー**
- [ ] 設計書のレビュー
- [ ] 実装計画の最終確認
- [ ] リスク要因の特定と対策

### Story 2: 実装・統合（1週間）

**Day 1-3: BasicSEOコンポーネント実装**
- [ ] BasicSEO.astroコンポーネントの実装
- [ ] 手動キーワード管理機能の統合
- [ ] Frontmatterサポートの実装
- [ ] 既存システムとの統合

**Day 4-5: 統合・テスト**
- [ ] 既存HeadSEO.astroとの併用テスト
- [ ] 手動キーワード入力のテスト
- [ ] Frontmatter統合のテスト
- [ ] パフォーマンステスト

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

## 成功基準

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

## 次のステップ

1. **実装開始の承認**: この企画書での実装開始
2. **Story 1の開始**: 設計・基盤構築フェーズの開始
3. **定期レビュー**: 各フェーズ完了時のレビュー実施
4. **🚨 安全性確認**: 各段階での既存システム保護確認
