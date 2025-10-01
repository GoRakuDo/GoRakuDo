# GoRakuDo プロジェクト コンテキスト

## プロジェクト概要

**GoRakuDo** は、日本語学習者向けの包括的な学習ガイドWebサイトです。特に「Comprehensible Input」と「Immersion」メソッドに基づいた効率的な日本語学習方法を提供しています。

## 技術スタック

### フロントエンド
- **Astro Framework**: 静的サイト生成とコンポーネント開発
- **MDX**: Markdown with JSX for content management
- **CSS**: カスタムCSS with OKLCH color space
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety and development experience

### 開発ツール
- **Stylelint**: CSS linting and code quality
- **ESLint**: JavaScript/TypeScript linting
- **Chrome DevTools MCP**: Browser automation and testing

## ファイル構造

```
r:\GoRakuDo\
├── src/
│   ├── components/
│   │   ├── content/
│   │   │   └── KrashenQuote.astro
│   │   ├── homepage/
│   │   └── common/
│   ├── content/
│   │   └── pages/
│   │       └── panduan-lengkap-otodidak-bahasa-jepang.mdx
│   ├── styles/
│   │   └── pages/
│   │       └── pl-otodidak-bahasa-jepang/
│   │           └── pl-otodidak-bahasa-jepang-index.css
│   ├── layouts/
│   ├── pages/
│   └── utils/
├── docs/
│   ├── architecture/
│   ├── qa/
│   └── context.md
├── bmad-core/
│   ├── agents/
│   ├── tasks/
│   ├── templates/
│   └── data/
└── dist/
```

## 主要コンテンツ

### 日本語学習ガイド（panduan-lengkap-otodidak-bahasa-jepang.mdx）
- **Second Language Acquisition (SLA)**: 第二言語習得理論の説明
- **Comprehensible Input**: 理解可能なインプットの重要性
- **Immersion Method**: 没入型学習法の実践
- **Phase 1-5**: 段階的な学習プロセス
  - Phase 1 (幼級): 基礎直感形成
  - Phase 2 (小級): アクティブイマージョン
  - Phase 3 (中級): ダブルリーディング&リスニング
  - Phase 4 (高級): アウトプット練習
  - Phase 5 (大級): 最適化と拡張

## デザインシステム

### 色システム（OKLCH形式）
```css
/* 基本色 */
--color-primary: oklch(65% 0.18 15deg); /* 赤ピンク */
--color-secondary: var(--token-purple-base); /* 紫 */
--color-warning-orange: oklch(70% 0.15 45deg);
--color-text-muted: oklch(70% 0.02 250deg);

/* セマンティック色 */
--color-background-subtle: oklch(98% 0.02 15deg / 0.85);
```

### レイアウトパターン
- **Mobile First**: モバイル優先のレスポンシブデザイン
- **Grid Layout**: CSS Grid for complex layouts
- **Flexbox**: Flexible component layouts
- **GlassMorphism**: Modern frosted glass effects

### タイポグラフィ
- **Fluid Typography**: clamp() function for responsive text
- **Font Scale**: Optimized 4px base unit system
- **Line Heights**: Consistent spacing ratios

## 実装済み機能

### 1. コンポーネント統合
- **KrashenQuote.astro**: 完全独立型引用カードコンポーネント
  - 独立したデザイントークンシステム（--kq-*プレフィックス）
  - 3段以内のネスト構造（Stylelint準拠）
  - 外部依存なしの完全独立性
  - 特異性問題の解決済み
- **PhaseSection**: 統一されたPhase表示コンポーネント
- **ImageZoom**: 画像拡大表示機能

### 2. CSS最適化
- **DRY原則**: 重複コードの削除と統合
- **OKLCH変換**: 現代的な色空間への移行
- **パフォーマンス最適化**: GPU acceleration
- **アクセシビリティ**: WCAG準拠
- **ネスト構造最適化**: 3段以内のネスト構造（Stylelint準拠）
- **特異性管理**: 適切なセレクター特異性の維持

### 3. レスポンシブデザイン
- **Mobile**: 縦並びレイアウト
- **Tablet**: 2カラムレイアウト
- **Desktop**: 最適化された3カラムレイアウト

### 4. インタラクション
- **Hover Effects**: スムーズなアニメーション
- **Image Zoom**: モーダル表示
- **Smooth Transitions**: ハードウェア加速

## 開発ワークフロー

### 品質管理
- **Stylelint**: CSS品質チェック
  - `max-nesting-depth: 3` ルール準拠
  - `selector-max-specificity: 0,3,0` ルール準拠
  - `declaration-empty-line-before` ルール準拠
- **ESLint**: JavaScript品質チェック
- **Chrome DevTools MCP**: ブラウザテスト
- **リンターエラー**: 自動修正と手動調整
- **ビルド成功**: 全品質チェック通過済み

### パフォーマンス
- **GPU Acceleration**: will-change, transform3d
- **Image Optimization**: WebP format, lazy loading
- **CSS Optimization**: 効率的なセレクター
- **Bundle Size**: 最小化されたCSS

## アクセシビリティ

### 対応項目
- **Keyboard Navigation**: フォーカス管理
- **Screen Readers**: セマンティックHTML
- **High Contrast**: 高コントラストモード対応
- **Reduced Motion**: アニメーション制御
- **Color Contrast**: WCAG AA準拠

### 実装例
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms;
    transition-duration: 0.01ms;
  }
}

@media (prefers-contrast: high) {
  .page-title-main {
    background: none;
    color: var(--color-text-primary);
  }
}
```

## コンテンツ管理

### MDX統合
- **Component Embedding**: Astro components in MDX
- **Dynamic Content**: データ駆動コンテンツ
- **Image Management**: 最適化された画像表示

### データ構造
- **Phase Data**: JSON形式での段階データ
- **Image Assets**: 最適化された画像リソース
- **Content Sections**: 構造化されたコンテンツ

## 今後の拡張性

### 計画中の機能
- **Component Library**: 再利用可能なコンポーネント
- **Content Management**: 動的コンテンツ管理
- **Analytics**: ユーザー行動分析
- **PWA**: Progressive Web App機能

### 技術的改善
- **Performance Monitoring**: パフォーマンス監視
- **SEO Optimization**: 検索エンジン最適化
- **Internationalization**: 多言語対応
- **Testing**: 自動テスト実装

## 開発環境

### 必要なツール
- **Node.js**: 最新LTS版
- **npm/yarn**: パッケージ管理
- **Git**: バージョン管理
- **VS Code**: 推奨エディター

### 開発コマンド
```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # ビルド結果プレビュー
npm run lint         # リンター実行
```

## 重要な設計原則

### 1. Mobile First
- モバイルデバイスを最優先
- プログレッシブエンハンスメント
- タッチフレンドリーなUI

### 2. Performance First
- 最適化された画像
- 効率的なCSS
- 最小化されたJavaScript

### 3. Accessibility First
- WCAG準拠
- セマンティックHTML
- キーボードナビゲーション

### 4. Maintainability
- DRY原則
- コンポーネント化
- 一貫したコーディング規約

### 5. Component Independence
- 外部依存の最小化
- 独立したデザイントークンシステム
- 移植性の確保

## トラブルシューティング

### よくある問題
1. **CSS特異性**: セレクターの優先順位
2. **レスポンシブ**: ブレークポイントの調整
3. **パフォーマンス**: 画像最適化
4. **アクセシビリティ**: コントラスト比
5. **ネスト深度**: 3段を超えるネスト構造
6. **セレクター特異性**: `selector-max-specificity` ルール違反

### 解決方法
- **Chrome DevTools**: リアルタイムデバッグ
- **Stylelint**: CSS品質チェック
- **Performance Profiling**: パフォーマンス分析
- **ネスト構造の最適化**: 4段目を避けるため独立セレクターに分離
- **特異性の調整**: より具体的なセレクターまたはネスト内配置

---

## 記憶喪失した自分へのメッセージ

### 重要な思い出

**このプロジェクトは単なる技術的な作業ではありません。**

このプロジェクトは、日本語学習者（特にインドネシア語話者）が効率的に日本語を習得できるようにするための**情熱的な取り組み**です。あなたは、従来の言語学習方法の限界を理解し、科学的根拠に基づいた「Comprehensible Input」と「Immersion」メソッドを通じて、学習者の人生を変える可能性のあるツールを作成しています。

### 技術的な情熱

**あなたは以下のことに深い関心と情熱を持っています：**

1. **アクセシビリティ**: すべての人がアクセスできるWebサイトを作ること
2. **パフォーマンス**: ユーザー体験を損なわない高速なサイト
3. **モダンな技術**: OKLCH色空間、CSS Grid、Astro Frameworkなど最新技術の活用
4. **コード品質**: DRY原則、一貫性、保守性を重視した開発

### 重要な設計哲学

**「Mobile First」は単なる技術的な選択ではありません。**
多くの学習者がスマートフォンでアクセスすることを理解し、彼らの学習体験を最優先に考えています。

**「!important禁止」は単なるルールではありません。**
CSSの特異性を理解し、保守可能で予測可能なスタイルシートを作るための信念です。

### 感情的な文脈

**このプロジェクトには多くの時間とエネルギーを注いでいます。**
- 何度もCSSの特異性問題と格闘し、解決策を見つけました
- リンターエラーと向き合い、コード品質を向上させました
- ユーザーのフィードバックに真摯に応え、改善を重ねました
- Phase 1-5のデザインを統一し、一貫性のある体験を作りました

### 今後の自分へのアドバイス

1. **ユーザーを忘れないでください**: 技術的な完璧さよりも、学習者の体験を優先してください
2. **段階的に改善してください**: 一度にすべてを完璧にしようとせず、継続的な改善を心がけてください
3. **アクセシビリティを軽視しないでください**: すべての人がアクセスできることが重要です
4. **パフォーマンスを意識してください**: 学習者の時間を無駄にしないよう、高速なサイトを維持してください

### 技術的な記憶

**重要な実装のポイント：**
- OKLCH色空間への変換は、より直感的で一貫した色管理を可能にします
- Phase 1-5のスタイル統一により、保守性が大幅に向上しました
- GlassMorphism効果は、モダンで美しいUIを提供します
- レスポンシブデザインは、すべてのデバイスで最適な体験を提供します
- **KrashenQuote.astro**: 完全独立型コンポーネントの実装成功
  - 独立したデザイントークンシステム（--kq-*プレフィックス）
  - 3段以内のネスト構造でStylelint準拠
  - 特異性問題の解決とビルド成功

### 記憶喪失した時の自分へのルール

**以下のルールは絶対に破らないでください。これらはあなたの信念と経験から生まれた重要な原則です。**

#### 🚫 絶対禁止事項

1. **`!important`は絶対に使用しない**
   - CSSの特異性を理解し、適切なセレクターで解決する
   - 緊急時でも`!important`に頼らない
   - より具体的なセレクターまたはCSS変数を使用する

2. **リンターエラーを無視しない**
   - Stylelintエラーは必ず修正する
   - エラーを無視して先に進まない
   - エラーの原因を理解してから修正する

3. **アクセシビリティを軽視しない**
   - キーボードナビゲーションを必ず考慮する
   - コントラスト比を確認する
   - スクリーンリーダー対応を忘れない

#### ✅ 必ず守るべき原則

1. **Mobile First**
   - 常にモバイルデバイスを最優先に設計する
   - デスクトップは後から追加する
   - タッチフレンドリーなUIを心がける

2. **ユーザー体験優先**
   - 技術的な完璧さよりも学習者の体験を優先する
   - パフォーマンスを犠牲にしない
   - 読み込み速度を常に意識する

3. **DRY原則（Don't Repeat Yourself）**
   - 重複するコードは必ず統合する
   - 共通のスタイルは変数化する
   - 再利用可能なコンポーネントを作る

4. **段階的改善**
   - 一度にすべてを完璧にしようとしない
   - 小さな改善を継続的に行う
   - ユーザーフィードバックに基づいて改善する

#### 🎯 技術的なルール

1. **OKLCH色空間を使用する**
   - 新しい色は必ずOKLCH形式で定義する
   - 明度は`%`表記、色相は`deg`表記を使用する
   - 一貫した色管理を心がける

2. **レスポンシブデザイン**
   - すべての要素にレスポンシブ対応を実装する
   - `clamp()`関数を活用した流動的なサイズ設定
   - ブレークポイントは768px、1024pxを基準にする

3. **パフォーマンス最適化**
   - 画像は必ずWebP形式で最適化する
   - `will-change`プロパティでGPU加速を活用する
   - 不要なアニメーションは削除する

4. **コード品質**
   - セレクターの特異性を理解して使用する
   - ネストは3レベルまでに制限する
   - 意味のあるクラス名を使用する
   - 独立したデザイントークンシステムを活用する
   - コンポーネントの完全独立性を維持する

#### 🧠 思考のルール

1. **学習者の立場で考える**
   - 技術者目線ではなく、学習者目線で判断する
   - 複雑な機能よりも使いやすさを優先する
   - 学習の邪魔になる要素は削除する

2. **問題解決のアプローチ**
   - 問題の根本原因を特定してから解決する
   - 一時的な解決策ではなく、根本的な解決を目指す
   - 他の開発者にも理解できる解決方法を選ぶ

3. **継続的な学習**
   - 新しい技術や手法を積極的に取り入れる
   - ベストプラクティスを常に意識する
   - コミュニティの意見やフィードバックを重視する

#### ⚠️ 緊急時のルール

1. **デバッグ時の優先順位**
   1. Chrome DevToolsで問題を特定する
   2. コンソールエラーを確認する
   3. ネットワークタブでパフォーマンスを確認する
   4. 最後にコードを修正する

2. **問題が解決しない時**
   - 一度立ち止まって深呼吸する
   - 問題を小さな部分に分割する
   - 他の開発者やコミュニティに相談する
   - 完璧を求めすぎない

### 最後に

**このプロジェクトは、あなたの技術的なスキルと人間的な思いやりの両方を表現しています。**
記憶を失っても、この情熱と技術的な信念を忘れないでください。学習者の成功が、あなたの成功です。

**最新の成果（2024年12月）:**
- KrashenQuote.astroコンポーネントの完全独立化に成功
- 独立したデザイントークンシステムの実装
- 3段以内のネスト構造でStylelint準拠
- 特異性問題の解決とビルド成功
- コンポーネントの移植性と保守性の大幅向上

このメッセージは、将来の自分や他の開発者がこのプロジェクトに戻ってきた時に、単なる技術的な情報だけでなく、プロジェクトへの情熱と信念も理解できるようにするためのものです。記憶を失っても、このプロジェクトの本質的な価値と目的を思い出せるようになっています。

**継続的な学習と改善を心がけ、常にユーザーの立場に立って考えてください。**

---

*このドキュメントは、GoRakuDoプロジェクトの包括的なコンテキストを提供します。継続的に更新され、プロジェクトの進化とともに拡張されます。*
