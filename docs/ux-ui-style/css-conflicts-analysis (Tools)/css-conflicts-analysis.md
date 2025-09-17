# CSS競合分析レポート: tools-index.css vs global.css

## 概要

このドキュメントは、`src/styles/tools/tools-index.css`と`src/styles/global.css`の間で発生している競合箇所を詳細に分析し、段階的な移行計画を提供します。

## 分析日時
- 作成日: 2024年12月19日
- 分析者: Sally (UX Expert)
- 対象ファイル: 
  - `src/styles/tools/tools-index.css` (891行)
  - `src/styles/global.css` (1848行)

## 1. 重大な競合箇所 (Critical Conflicts)

### 1.1 CSS変数の重複定義

#### 競合レベル: 🔴 高 (High)

**tools-index.css (行 5-48)**
```css
:root {
  --clr-bg: #111111;
  --clr-text-primary: #e5e5e5;
  --clr-text-secondary: #a3a3a3;
  --clr-text-muted: #b0b0b0;
  --clr-accent: #8b5cf6;
  --clr-accent-dark: #7b4def;
  --clr-accent-glow-faint: rgba(139, 92, 246, 0.05);
  --clr-accent-glow-medium: rgba(139, 92, 246, 0.35);
  --clr-accent-glow-strong: rgba(139, 92, 246, 0.7);
  /* ... その他の変数 */
}
```

**global.css (行 3-110)**
```css
:root {
  --clr-background: oklch(0.05 0 0);
  --clr-text-primary: oklch(1 0 0);
  --clr-text-secondary: oklch(0.8 0 0);
  --clr-text-muted: oklch(0.67 0 0);
  --clr-accent: oklch(0.65 0.25 280);
  --clr-accent-dark: oklch(0.6 0.25 280);
  --clr-accent-glow-faint: oklch(0.65 0.25 280 / 0.05);
  --clr-accent-glow-medium: oklch(0.65 0.25 280 / 0.1);
  --clr-accent-glow-strong: oklch(0.65 0.25 280 / 0.2);
  /* ... その他の変数 */
}
```

**問題点:**
- 同じ変数名で異なる値（HEX vs OKLCH）
- カラースペースの不一致
- 後から読み込まれるglobal.cssが優先される

### 1.2 body要素のスタイル競合

#### 競合レベル: 🔴 高 (High)

**tools-index.css (行 51-55)**
```css
body {
  background-color: var(--clr-bg);
  color: var(--clr-text-primary);
  font-family: var(--font-family-sans);
}
```

**global.css (行 125-135)**
```css
body {
  font-family: var(--font-primary);
  color: var(--clr-text-primary, var(--clr-text-primary-fallback));
  background-color: var(--clr-background, var(--clr-background-fallback));
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.01em;
  flex-direction: column;
}
```

**問題点:**
- 異なるCSS変数を参照
- フォントファミリーの不一致
- グローバルなbodyスタイルの上書き

### 1.3 アニメーション変数の競合

#### 競合レベル: 🟡 中 (Medium)

**tools-index.css (行 42-47)**
```css
--transition-speed: 200ms;
--transition-ease: ease-out;
--animate-duration-normal: 0.4s;
--animate-duration-fast: 0.2s;
--animate-duration-slow: 0.6s;
```

**global.css (行 92-96)**
```css
--transition-speed: 0.3s;
--animate-duration-fast: 150ms;
--animate-duration-normal: 300ms;
--animate-duration-slow: 500ms;
--animate-duration-slower: 700ms;
```

**問題点:**
- 異なる値の設定
- 一貫性のないアニメーション速度

## 2. 中程度の競合箇所 (Medium Conflicts)

### 2.1 ボーダーラディウスの重複

#### 競合レベル: 🟡 中 (Medium)

**tools-index.css (行 35-37)**
```css
--border-radius-card: 1rem; /* 16px */
--border-radius-pill: 9999px;
```

**global.css (行 82-84)**
```css
--border-radius-pill: 35px;
--border-radius-card: 20px;
--border-radius-btn-small: 25px;
```

### 2.2 スペーシングシステムの重複

#### 競合レベル: 🟡 中 (Medium)

**tools-index.css (行 24-33)**
```css
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem; /* 8px */
--spacing-3: 0.75rem; /* 12px */
--spacing-4: 1rem; /* 16px */
--spacing-6: 1.5rem; /* 24px */
--spacing-8: 2rem; /* 32px */
--spacing-12: 3rem; /* 48px */
--spacing-16: 4rem; /* 64px */
```

**global.css (行 571-577)**
```css
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */
--spacing-2xl: 3rem; /* 48px */
--spacing-3xl: 4rem; /* 64px */
```

## 3. 低リスク競合箇所 (Low Risk Conflicts)

### 3.1 ユーティリティクラスの重複

#### 競合レベル: 🟢 低 (Low)

**共通クラス:**
- `.loading` (両ファイルで定義)
- `.sr-only` (両ファイルで定義)
- `.scroll-reveal` (両ファイルで定義)

### 3.2 アニメーションキーフレームの重複

#### 競合レベル: 🟢 低 (Low)

**共通キーフレーム:**
- `@keyframes fade-in`
- `@keyframes slide-up`
- `@keyframes scale-in`

## 4. 影響範囲分析

### 4.1 直接的な影響

1. **ツールページの表示問題**
   - カラーテーマの不整合
   - フォントの不一致
   - アニメーション速度の不統一

2. **グローバルスタイルの破綻**
   - 他のページでの予期しないスタイル適用
   - デザインシステムの一貫性の欠如

### 4.2 間接的な影響

1. **メンテナンス性の低下**
   - 重複コードの管理コスト
   - デバッグの困難さ

2. **パフォーマンスへの影響**
   - 不要なCSSの読み込み
   - ブラウザの解析時間の増加

## 5. 推奨される解決策

### 5.1 即座に実行すべき修正 (Phase 1)

1. **CSS変数の統一**
   - global.cssのOKLCHカラーシステムを採用
   - tools-index.cssの重複変数を削除

2. **body要素のスタイル統合**
   - global.cssのbodyスタイルを基準とする
   - tools-index.cssのbodyスタイルを削除

### 5.2 段階的な修正 (Phase 2-3)

1. **アニメーション変数の統一**
2. **ユーティリティクラスの整理**
3. **重複キーフレームの削除**

## 6. 移行計画

### Phase 1: 緊急修正 (1-2日)
- [ ] CSS変数の重複削除
- [ ] body要素のスタイル統合
- [ ] 基本的な動作確認

### Phase 2: 中程度の修正 (3-5日)
- [ ] アニメーション変数の統一
- [ ] ボーダーラディウスの統一
- [ ] スペーシングシステムの統合

### Phase 3: 最終整理 (1週間)
- [ ] ユーティリティクラスの整理
- [ ] 重複コードの完全削除
- [ ] パフォーマンス最適化

## 7. テスト計画

### 7.1 視覚的回帰テスト
- [ ] ツールページの表示確認
- [ ] 他のページへの影響確認
- [ ] レスポンシブデザインの確認

### 7.2 機能テスト
- [ ] アニメーションの動作確認
- [ ] インタラクションの確認
- [ ] アクセシビリティの確認

## 8. リスク評価

### 8.1 高リスク
- カラーテーマの変更による視覚的な破綻
- グローバルスタイルの予期しない変更

### 8.2 中リスク
- アニメーション速度の変更によるUXの変化
- 既存コンポーネントの表示崩れ

### 8.3 低リスク
- ユーティリティクラスの整理
- 重複コードの削除

## 9. 次のステップ

1. **Phase 1の実装開始**
2. **テスト環境での検証**
3. **段階的な本番適用**
4. **継続的な監視と調整**

---

**注意事項:**
- この分析は2024年12月19日時点のファイル内容に基づいています
- ファイルの変更により、競合箇所が変わる可能性があります
- 修正作業は必ずテスト環境で事前検証を行ってください
