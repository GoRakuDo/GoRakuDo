<!-- Powered by BMAD™ Core -->

# Sub-Story 5.3: 統合・テスト・品質保証

## Status

**🎯 IN PROGRESS** - 既存システムとの統合、包括的テスト、品質保証の完了
**📋 PLANNED** - 3日間の実装計画、既存システムとの互換性確認、品質基準の達成
**⚠️ CRITICAL WARNING** - 既存システムの変更禁止箇所が特定され、厳格な遵守が必要

## Story

**As a** 開発者,
**I want** 既存システムとの統合、包括的テスト、品質保証を完了する,
**So that** BasicSEOコンポーネントが既存システムと安全に統合され、高品質な運用が可能になる.

## 高校生向け説明

### 🎯 何をやるの？

Sub-Story 5.3では、作ったBasicSEOコンポーネントが既存のシステムと正しく連携するかテストして、品質を保証するんだ。

**統合テストって何？**
- 新しいコンポーネントが既存のシステムと正しく連携するか確認
- 既存の機能が壊れていないかチェック
- パフォーマンスが悪化していないか測定

**品質保証って何？**
- 作った機能が期待通りに動くか確認
- エラーが発生しないかチェック
- ユーザーが快適に使えるか検証

### 🔧 どうやって実装するの？

1. **既存システムとの統合**: HeadSEO.astroと一緒に使えるようにする
2. **包括的テスト**: 正常系・異常系・境界値のテストを実行
3. **パフォーマンステスト**: 既存システムと比較して性能を確認
4. **品質基準の達成**: 設定した品質目標を満たすように調整

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

### 🔒 変更可能な箇所（新規作成のみ）

**1. 新規テストファイル**
- **作成可能**: `tests/integration/basic-seo/`（新規ディレクトリ）
- **制限**: 既存のテストファイルを変更しない

**2. 新規品質保証ファイル**
- **作成可能**: `docs/quality-assurance/`（新規ディレクトリ）
- **制限**: 既存のドキュメントを変更しない

## Acceptance Criteria

**統合要件:**

1. 既存HeadSEO.astroとの併用テスト完了
2. 同時使用時の動作確認完了
3. 競合の有無の確認完了
4. パフォーマンスへの影響確認完了

**テスト要件:**

5. 手動キーワード入力の包括テスト完了
6. 正常系テスト（有効なキーワード）完了
7. 異常系テスト（無効なキーワード）完了
8. 境界値テスト（制限値の確認）完了

**Frontmatter統合要件:**

9. Frontmatter統合の包括テスト完了
10. 各種Frontmatter形式のテスト完了
11. エラーケースのテスト完了
12. 型安全性のテスト完了

**パフォーマンス要件:**

13. パフォーマンステストと最適化完了
14. レンダリング時間の測定完了
15. メモリ使用量の測定完了
16. 既存システムとの比較完了

**品質保証要件:**

17. TypeScript型チェック通過（0エラー、0警告）
18. ビルド成功率100%達成
19. 既存システムとの互換性100%維持
20. パフォーマンステスト通過

**🚨 安全性要件（必須）:**

21. 既存ファイルの変更・削除0件
22. 既存コードの上書き0件
23. 既存設定の変更0件
24. 新規ファイルのみの作成

## 技術仕様

### 1. 統合テストの実装

```typescript
// tests/integration/basic-seo/head-seo-integration.test.ts（新規作成）
import { describe, test, expect, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import HeadSEO from '../../../src/components/public-components/HeadSEO.astro';
import BasicSEO from '../../../src/components/public-components/BasicSEO.astro';

describe('HeadSEO + BasicSEO Integration', () => {
  test('両コンポーネントの併用テスト', () => {
    // Given: HeadSEO.astroとBasicSEOの両方が準備される
    const headSEOProps = {
      title: '既存タイトル',
      description: '既存説明',
      lang: 'ja' as const
    };
    
    const basicSEOProps = {
      title: '新規タイトル',
      description: '新規説明',
      primaryKeywords: ['新規キーワード'],
      seoProperty: {
        articleType: 'guide' as const,
        learningStage: 'intermediate' as const,
        searchIntent: 'informational' as const
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
  
  test('設定の優先順位テスト', () => {
    // Given: 競合する設定が含まれるPropsが準備される
    const conflictingProps = {
      headSEO: { title: 'HeadSEOタイトル' },
      basicSEO: { title: 'BasicSEOタイトル' }
    };
    
    // When: 両コンポーネントがレンダリングされる
    const page = renderPage(conflictingProps);
    
    // Then: 設定の優先順位が正しく適用される
    expect(page).toHaveNoConflictingMetaTags();
    expect(page).toHaveValidMetaTagPriority();
  });
});
```

### 2. パフォーマンステストの実装

```typescript
// tests/integration/basic-seo/performance-comparison.test.ts（新規作成）
import { describe, test, expect, beforeEach } from '@jest/globals';
import { performance } from 'perf_hooks';

describe('Performance Comparison Tests', () => {
  test('レンダリング時間の比較', () => {
    // Given: 同じPropsで両コンポーネントが準備される
    const testProps = {
      title: 'パフォーマンステスト',
      description: 'パフォーマンス比較テスト',
      primaryKeywords: ['テスト', 'パフォーマンス']
    };
    
    // When: レンダリング時間を測定
    const headSEOTime = measureRenderTime(<HeadSEO {...testProps} />);
    const basicSEOTime = measureRenderTime(<BasicSEO {...testProps} />);
    
    // Then: BasicSEOが既存システムと同等以上のパフォーマンスを示す
    expect(basicSEOTime).toBeLessThanOrEqual(headSEOTime * 1.1); // 10%以内
    expect(basicSEOTime).toBeLessThan(100); // 100ms以内
  });
  
  test('メモリ使用量の比較', () => {
    // Given: メモリ使用量測定の準備
    const initialMemory = process.memoryUsage();
    
    // When: コンポーネントを複数回レンダリング
    for (let i = 0; i < 100; i++) {
      render(<BasicSEO {...testProps} />);
    }
    
    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
    
    // Then: メモリリークが発生していない
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB以内
  });
});

function measureRenderTime(component: React.ReactElement): number {
  const start = performance.now();
  render(component);
  const end = performance.now();
  return end - start;
}
```

### 3. 品質保証チェックリスト

```typescript
// tests/integration/basic-seo/quality-assurance.test.ts（新規作成）
import { describe, test, expect } from '@jest/globals';

describe('Quality Assurance Checklist', () => {
  test('TypeScript型チェック', () => {
    // Given: 全ての型定義ファイルが準備される
    
    // When: TypeScript型チェックが実行される
    
    // Then: 型エラーが0件である
    expect(getTypeScriptErrors()).toHaveLength(0);
    expect(getTypeScriptWarnings()).toHaveLength(0);
  });
  
  test('ビルド成功率', () => {
    // Given: プロジェクトのビルドが準備される
    
    // When: ビルドプロセスが実行される
    
    // Then: ビルドが100%成功する
    expect(getBuildSuccessRate()).toBe(100);
  });
  
  test('既存システム互換性', () => {
    // Given: 既存システムの動作確認が準備される
    
    // When: 互換性チェックが実行される
    
    // Then: 既存システムとの互換性が100%維持される
    expect(getCompatibilityScore()).toBe(100);
  });
  
  test('パフォーマンス基準', () => {
    // Given: パフォーマンステストが準備される
    
    // When: パフォーマンス測定が実行される
    
    // Then: 設定されたパフォーマンス基準を満たす
    expect(getRenderTime()).toBeLessThan(100); // 100ms以内
    expect(getMemoryUsage()).toBeLessThan(50); // 50MB以内
    expect(getBundleSize()).toBeLessThan(100); // 100KB以内
  });
});
```

## 実装計画（詳細版）

### Day 1: 既存システムとの統合テスト

**午前: HeadSEO.astroとの併用テスト（9:00-12:00）**
- [ ] 同時使用時の動作確認
  - 両コンポーネントの同時レンダリング（HeadSEO.astro + BasicSEO.astro）
  - メタタグの競合確認（重複メタタグの検出、優先順位の確認）
  - 設定の優先順位確認（BasicSEO優先、HeadSEO優先、ハイブリッドモード）
  - パフォーマンスへの影響測定（レンダリング時間、メモリ使用量、バンドルサイズ）
- [ ] 競合の有無の確認
  - メタタグの重複チェック（title、description、keywords等の重複検出）
  - 構造化データの競合チェック（JSON-LDの重複、競合するスキーマの検出）
  - 設定値の競合チェック（言語設定、画像設定、カノニカルURL等の競合）
  - 競合解決機能の実装（自動競合解決、手動競合解決、競合レポート生成）

**午後: 互換性チェックと段階的移行（13:00-17:00）**
- [ ] 既存システムの動作確認
  - SEO最適化システムの動作確認（SEOOptimizerクラスの動作、キーワード抽出機能）
  - メタデータ管理システムの動作確認（metadata-loader.ts、メタデータ読み込み機能）
  - 型定義システムの動作確認（既存型定義の整合性、型チェックの動作）
  - パフォーマンスベースラインの測定（既存システムの基準値取得）
- [ ] 段階的移行の準備
  - 移行フェーズの設定（Phase 1: 併用開始、Phase 2: 新規記事移行、Phase 3: 既存記事移行）
  - 互換性モードの実装（strict mode、loose mode、hybrid mode）
  - 移行ガイドの作成（移行手順書、トラブルシューティング、ロールバック手順）
  - 移行監視システムの実装（移行進捗の監視、問題の早期検出、自動アラート）

### Day 2: 包括的テストの実行

**午前: 手動キーワード入力の包括テスト**
- [ ] 正常系テスト（有効なキーワード）
  - 日本語キーワードのテスト
  - インドネシア語キーワードのテスト
  - 英数字キーワードのテスト
- [ ] 異常系テスト（無効なキーワード）
  - 短すぎるキーワードのテスト
  - 長すぎるキーワードのテスト
  - 空文字・null値のテスト

**午後: 境界値テストとエラーケース**
- [ ] 境界値テスト（制限値の確認）
  - キーワード長の境界値（1文字、2文字、49文字、50文字、51文字）
  - キーワード数の境界値（0個、1個、9個、10個、11個）
  - 設定値の境界値テスト
- [ ] エラーケースのテスト
  - 不正なPropsのテスト
  - 必須プロパティ不足のテスト
  - 型エラーのテスト

### Day 3: パフォーマンステストと品質保証

**午前: パフォーマンステストと最適化**
- [ ] レンダリング時間の測定
  - 単一コンポーネントの測定
  - 複数コンポーネントの測定
  - 既存システムとの比較
- [ ] メモリ使用量の測定
  - 単一レンダリングの測定
  - 複数レンダリングの測定
  - メモリリークの確認

**午後: 品質基準の達成確認**
- [ ] 品質基準の最終確認
  - TypeScript型チェックの確認
  - ビルド成功率の確認
  - 互換性の確認
- [ ] 品質保証レポートの作成
  - テスト結果の集計
  - 品質基準の達成状況
  - 改善点の特定

## ファイル構成

### 新規作成ファイル

**テスト:**
- `tests/integration/basic-seo/` - 統合テスト
- `tests/integration/basic-seo/head-seo-integration.test.ts`
- `tests/integration/basic-seo/performance-comparison.test.ts`
- `tests/integration/basic-seo/quality-assurance.test.ts`
- `tests/integration/basic-seo/keyword-management.test.ts`

**品質保証:**
- `docs/quality-assurance/` - 品質保証ドキュメント
- `docs/quality-assurance/test-results.md`
- `docs/quality-assurance/performance-report.md`
- `docs/quality-assurance/compatibility-report.md`

### 既存ファイル（変更禁止）

**コンポーネント:**
- `src/components/public-components/HeadSEO.astro` - 変更禁止

**ユーティリティ:**
- `src/utils/ai/seo-optimizer.ts` - 変更禁止
- `src/utils/metadata-loader.ts` - 変更禁止

## 品質保証（詳細版）

### 品質基準

**統合品質:**
- 既存システム互換性: 100%維持
- 競合回避: 100%動作
- 段階的移行: 100%成功

**テスト品質:**
- テストカバレッジ: 95%以上
- 正常系テスト: 100%成功
- 異常系テスト: 100%成功
- 境界値テスト: 100%成功

**パフォーマンス品質:**
- レンダリング時間: 100ms以内
- メモリ使用量: 既存システムと同等以下
- バンドルサイズ: 10KB以内の増加

**型安全性:**
- TypeScript型チェック: 0エラー、0警告
- ビルド成功率: 100%
- 型定義の完全性: 100%

### 具体的なテストケース

#### **1. 統合テスト**
```typescript
// 既存システムとの併用テスト
test('HeadSEO.astro + BasicSEO.astroの併用', () => {
  // Given: 両コンポーネントのProps
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
  
  // When: 両コンポーネントが同時レンダリングされる
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

// 競合解決テスト
test('メタタグ競合の自動解決', () => {
  // Given: 競合する設定
  const conflictingProps = {
    headSEO: { title: 'HeadSEOタイトル', description: 'HeadSEO説明' },
    basicSEO: { title: 'BasicSEOタイトル', description: 'BasicSEO説明' }
  };
  
  // When: 競合解決機能が実行される
  const page = renderPage(conflictingProps);
  
  // Then: 競合が適切に解決される
  expect(page).toHaveNoConflictingMetaTags();
  expect(page).toHaveValidMetaTagPriority();
});
```

#### **2. パフォーマンステスト**
```typescript
// レンダリング時間の比較テスト
test('レンダリング時間の比較', () => {
  // Given: 同じPropsで両コンポーネント
  const testProps = {
    title: 'パフォーマンステスト',
    description: 'パフォーマンス比較テスト',
    primaryKeywords: ['テスト', 'パフォーマンス']
  };
  
  // When: レンダリング時間を測定
  const headSEOTime = measureRenderTime(<HeadSEO {...testProps} />);
  const basicSEOTime = measureRenderTime(<BasicSEO {...testProps} />);
  
  // Then: BasicSEOが既存システムと同等以上のパフォーマンスを示す
  expect(basicSEOTime).toBeLessThanOrEqual(headSEOTime * 1.1); // 10%以内
  expect(basicSEOTime).toBeLessThan(100); // 100ms以内
  
  // パフォーマンスレポートの生成
  console.log(`HeadSEO レンダリング時間: ${headSEOTime.toFixed(2)}ms`);
  console.log(`BasicSEO レンダリング時間: ${basicSEOTime.toFixed(2)}ms`);
  console.log(`パフォーマンス比率: ${(basicSEOTime / headSEOTime).toFixed(2)}`);
});

// メモリ使用量テスト
test('メモリ使用量の測定', () => {
  // Given: メモリ使用量測定の準備
  const initialMemory = process.memoryUsage();
  
  // When: コンポーネントを複数回レンダリング
  for (let i = 0; i < 100; i++) {
    render(<BasicSEO {...testProps} />);
  }
  
  const finalMemory = process.memoryUsage();
  const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
  
  // Then: メモリリークが発生していない
  expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB以内
});
```

#### **3. 段階的移行テスト**
```typescript
// 移行フェーズの動作確認
test('段階的移行の動作確認', () => {
  // Given: 移行フェーズの設定
  const migrationPhases = ['phase1', 'phase2', 'phase3', 'complete'];
  
  migrationPhases.forEach(phase => {
    // When: 各フェーズでの動作確認
    const result = testMigrationPhase(phase);
    
    // Then: 各フェーズで既存機能が正常に動作する
    expect(result.existingSystemStatus).toBe('healthy');
    expect(result.newSystemStatus).toBe('ready');
    expect(result.compatibilityScore).toBeGreaterThanOrEqual(95);
  });
});

// ロールバック機能のテスト
test('ロールバック機能の動作確認', () => {
  // Given: 問題が発生した移行状態
  const problematicState = simulateMigrationProblem();
  
  // When: ロールバックが実行される
  const rollbackResult = executeRollback(problematicState);
  
  // Then: 既存システムが正常な状態に復旧する
  expect(rollbackResult.status).toBe('rolled_back');
  expect(rollbackResult.existingSystemHealth).toBe('healthy');
  expect(rollbackResult.dataIntegrity).toBe(100);
});
```

### 品質保証プロセス

#### **1. 統合テスト**
- **自動テスト**: CI/CDパイプラインでの自動統合テスト
- **手動テスト**: 実際のブラウザでの動作確認
- **パフォーマンステスト**: 継続的なパフォーマンス監視

#### **2. 移行監視**
- **進捗監視**: 移行フェーズの進捗状況の可視化
- **問題検出**: 早期警告システム、自動アラート
- **品質測定**: 移行後の品質指標の継続監視

#### **3. 品質ゲート**
- **統合品質ゲート**: 既存システムとの互換性確認
- **パフォーマンスゲート**: 性能基準の達成確認
- **移行完了ゲート**: 全機能の正常動作確認

### テスト戦略

**統合テスト:**
- HeadSEO.astroとの併用
- 既存システムとの互換性
- 段階的移行の動作確認

**パフォーマンステスト:**
- レンダリング時間の測定
- メモリ使用量の測定
- 既存システムとの比較

**品質保証テスト:**
- 型安全性の確認
- ビルド成功率の確認
- 互換性の確認

## リスク管理

### 特定されたリスク

**統合時の競合:**
- メタタグの重複生成
- 構造化データの競合
- 設定値の競合

**パフォーマンスの悪化:**
- レンダリング時間の増加
- メモリ使用量の増加
- バンドルサイズの増加

**品質基準の未達成:**
- 型エラーの発生
- ビルドの失敗
- 互換性の低下

### 軽減策

**競合回避:**
- 競合検出機能の実装
- 設定の優先順位の明確化
- 段階的移行の実施

**パフォーマンス最適化:**
- 効率的なレンダリング
- メモリ使用量の最適化
- バンドルサイズの最小化

**品質保証強化:**
- 包括的なテスト
- 自動品質チェック
- 継続的品質監視

## 次のステップ

1. **実装開始の承認**: このSub-Storyでの実装開始
2. **Day 1の開始**: 既存システムとの統合テスト開始
3. **定期レビュー**: 各Day完了時のレビュー実施
4. **🚨 安全性確認**: 各段階での既存システム保護確認
5. **エラー監視**: 実装中のエラー発生状況の監視
6. **品質チェック**: 各段階での品質基準の確認

この統合・テスト・品質保証により、BasicSEOコンポーネントが既存システムと安全に統合され、高品質な運用が保証されます。各Dayでの品質ゲートを確実に通過し、プロジェクトの成功を確実にします。

---

## 🔍 要件とテストのトレーサビリティマッピング

### 📋 要件トレーサビリティマトリックス

#### **REQ-001: 既存システム統合**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-001-01 | HeadSEO.astroとBasicSEOが同時に使用される | 両コンポーネントが同時レンダリングされる | 競合なく両方のSEO設定が適用される | 100%互換性 | 🔄 計画中 |
| TC-001-02 | 既存SEO最適化システムが動作している | BasicSEOが新規実装される | 既存システムの動作に影響しない | 100%非干渉 | 🔄 計画中 |
| TC-001-03 | 段階的移行が実行される | 既存システムから新規システムへの移行が実行される | 既存機能が停止することなく移行が完了する | 100%継続性 | 🔄 計画中 |

#### **REQ-002: 包括的テスト**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-002-01 | 有効なキーワード配列が入力される | 手動キーワード入力テストが実行される | 正常にキーワードが処理される | 100%動作 | 🔄 計画中 |
| TC-002-02 | 無効なキーワードが入力される | 異常系テストが実行される | 適切なエラーメッセージが表示される | 100%エラーハンドリング | 🔄 計画中 |
| TC-002-03 | 境界値のキーワードが入力される | 境界値テストが実行される | 境界値が正しく処理される | 100%精度 | 🔄 計画中 |

#### **REQ-003: パフォーマンステスト**

| テストケース | Given（前提条件） | When（実行条件） | Then（期待結果） | 品質基準 | ステータス |
|-------------|------------------|------------------|------------------|----------|------------|
| TC-003-01 | 既存システムのパフォーマンスが測定される | パフォーマンス比較テストが実行される | 既存システムの基準値が取得される | 100%測定 | 🔄 計画中 |
| TC-003-02 | BasicSEOコンポーネントのパフォーマンスが測定される | 新規システムのパフォーマンステストが実行される | 新規システムの性能値が取得される | 100%測定 | 🔄 計画中 |
| TC-003-03 | 両システムのパフォーマンスが比較される | パフォーマンス比較が実行される | BasicSEOが既存システムと同等以上の性能を示す | 100%比較 | 🔄 計画中 |

### 🧪 テストシナリオ詳細（Given-When-Then形式）

#### **TC-001-01: 既存システムとの併用**

```typescript
describe('BasicSEO Integration - 既存システム併用', () => {
  test('HeadSEO.astroとの競合回避', () => {
    // Given: HeadSEO.astroとBasicSEOの両方が準備される
    const headSEOProps = {
      title: '既存タイトル',
      description: '既存説明',
      lang: 'ja' as const
    };
    
    const basicSEOProps = {
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

#### **TC-002-01: 包括的キーワードテスト**

```typescript
describe('Keyword Management - 包括的テスト', () => {
  test('境界値でのキーワード検証', () => {
    // Given: 境界値のキーワードが準備される
    const boundaryKeywords = [
      'a',           // 1文字（最小値未満）
      'ab',          // 2文字（最小値）
      'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', // 50文字（最大値）
      'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzx' // 51文字（最大値超過）
    ];
    
    const validator = new ManualKeywordValidator();
    
    // When: 境界値でのバリデーションが実行される
    const result = validator.validateKeywords(boundaryKeywords);
    
    // Then: 境界値が正しく処理される
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('キーワード1が短すぎます: a');
    expect(result.warnings).toContain('キーワード4が長すぎます: abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzx');
    expect(result.optimizedKeywords).toHaveLength(2); // 2文字と50文字のみ有効
  });
});
```

#### **TC-003-01: パフォーマンス比較テスト**

```typescript
describe('Performance Comparison - パフォーマンステスト', () => {
  test('レンダリング時間の比較', () => {
    // Given: 同じPropsで両コンポーネントが準備される
    const testProps = {
      title: 'パフォーマンステスト',
      description: 'パフォーマンス比較テスト',
      primaryKeywords: ['テスト', 'パフォーマンス']
    };
    
    // When: レンダリング時間を測定
    const headSEOTime = measureRenderTime(<HeadSEO {...testProps} />);
    const basicSEOTime = measureRenderTime(<BasicSEO {...testProps} />);
    
    // Then: BasicSEOが既存システムと同等以上のパフォーマンスを示す
    expect(basicSEOTime).toBeLessThanOrEqual(headSEOTime * 1.1); // 10%以内
    expect(basicSEOTime).toBeLessThan(100); // 100ms以内
    
    // パフォーマンスレポートの生成
    console.log(`HeadSEO レンダリング時間: ${headSEOTime.toFixed(2)}ms`);
    console.log(`BasicSEO レンダリング時間: ${basicSEOTime.toFixed(2)}ms`);
    console.log(`パフォーマンス比率: ${(basicSEOTime / headSEOTime).toFixed(2)}`);
  });
});
```

---

このSub-Story 5.3により、BasicSEOコンポーネントの統合・テスト・品質保証が完了し、既存システムとの安全な統合が保証されます。
