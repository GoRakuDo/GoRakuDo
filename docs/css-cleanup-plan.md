# Global CSS Cleanup & Optimization Plan

**Date:** 2026-05-21
**Target:** src/styles/global.css (with cross-references to downstream files)
**Reference:** D:\GoRakuDo\DESIGN.md, rontend-design skill
**Status:** Reviewed and Expanded (incorporating @code-reviewer feedback)

## Phase 1: Core Performance & Typography Fixes (Immediate)
1. **Typography !important Consolidation**
   - **Issue:** Duplicate ont-family: var(--font-primary) !important; breaks Tailwind utility classes.
   - **Action:** Remove !important globally. Consolidate into ody.
   - **Note:** src/styles/pages/youtube-rekomendasi/youtube-rekomendasi-index.css:103 explicitly references the banned Inter font. This must be updated to match the design system.

2. **ackdrop-filter Violations on Normal Cards**
   - **Issue:** .glassmorphism and .glass-panel use heavy ackdrop-filter: blur(12px). While technically not overflow: scroll containers, they apply massive compositor load and violate the strict "fixed/sticky only" performance rule in rontend-design.
   - **Action:** Remove ackdrop-filter from non-sticky/non-fixed components. Use OKLCH semi-transparent backgrounds to convey depth instead. (Needs follow-up for 40 downstream occurrences).

3. **	ext-rendering Conflict**
   - **Issue:** 	ext-rendering: optimizeSpeed !important degrades typography (kerning/ligatures).
   - **Action:** Remove it globally to resolve conflicts with components that correctly request optimizeLegibility.

## Phase 2: Design System Token Migration (Alignment with DESIGN.md)
4. **Comprehensive !important Audit**
   - **Action:** Evaluate all 10 instances of !important in global.css. Keep color-scheme: dark !important;. Remove or override font-smoothing and word-spacing with higher specificity instead of !important.

5. **Easing System Alignment**
   - **Issue:** global.css has outdated easings and raw ase keywords (19 instances).
   - **Action:** Map all transitions to the 4 official curves in DESIGN.md (--grkd-ease-productive, --grkd-ease-expressive, --grkd-ease-spring, --grkd-ease-out). Replace all raw ase keywords.

6. **Color & Glassmorphism Token Migration**
   - **Action:** Migrate legacy color tokens (--token-purple-base, --token-bg-dark) to the new --grkd-* namespace (--grkd-purple-400, --grkd-black-950).
   - **Action:** Rename glassmorphism tokens to --grkd-glass-bg, --grkd-glass-border, --grkd-glass-blur matching DESIGN.md.

7. **Shadow Tinting Alignment**
   - **Issue:** Current shadows use generic black (rgba or un-tinted oklch).
   - **Action:** Update box-shadows to use 270deg hue tinted shadows (e.g., oklch(0.05 0.01 270 / 0.30)) to achieve the "Night Library" aesthetic.

8. **Z-Index Scale Completion**
   - **Issue:** Modal layer is incorrectly defined or missing.
   - **Action:** Add missing layers (sticky: 100, dropdown: 200) and fix modal to 1400 per DESIGN.md.

9. **Dead Code Removal**
   - **Action:** Remove --animate-twinkle and its references, as the @keyframes twinkle does not exist.

---

## 📋 実施記録 (2026-09-22/23)

Phase A〜Cを2026-09-22〜23に実施。各Phaseの検証方法は「**dist CSS リーフルール diff = 0**」（ビルド出力CSSのリーフルール比較で意図しない差分が出ないこと）を1行添付。

### Phase A: 死にCSS削除 (2026-09-22)
- `.article-content` 系: 約470行（未使用・重複セレクタ）
- modal系スタイル（不要になったモーダル装飾）
- 重複 `@keyframes` 定義のマージ・削除
- 合計 **約1,170行削除**
- **検証**: dist CSS リーフルール diff = 0（死コードのみ削除されたことを確認）

### Phase B-1: `--token-*` → `--grkd-*` 移行 (2026-09-22)
- **238箇所 / 27ファイル** を `--grkd-*` 名前空間へ機械置換（値は原則不変）
- **検証**: dist CSS リーフルール diff = 0（トークン名のみの置換で解決値が不変）

### Phase B-2: 衝突トークンのglobal統一スケール化 (2026-09-22/23)
- ファイル間で値が衝突していたトークンを `global.css` の統一スケール（fluid/solid scale）へ集約
- 衝突により枯死したトークン定義 **47個を削除**
- **検証**: dist CSS リーフルール diff = 0（全参照先が同じ解決値になることを確認）

### Phase C: CSS集約・移管 (2026-09-23)
- `@import 'tailwindcss'` を **10ファイル → 1ファイル**（`src/styles/global.css`）に集約
- `is:global <style>` **5本（計3,623行）** を `src/styles/components/` へ移管
- `tutorial-image-grid.css` をスタイル直下のimportから `ToolArticleLayout.astro` のimportへ移行
- **結果: dist CSS -33.6%**
- **検証**: dist CSS リーフルール diff = 0（サイズ削減は不要なものだけの削除・再配置によるもの）

### 受容済み副作用
- Tailwindデフォルトテーマ消滅により `radius` / `shadow` が `DESIGN.md` の設計値に正規化（例: bottom-nav の角丸 12px → 16px）
- ユーザー受容済み（デザイン意図に合致）。見た目の微調整は後日対応予定。

### 残課題
- `global.css` 内のページ固有 z-index トークンの移動候補洗い出し（ページCSSへの分離）
- `panduan-lengkap-index.css` の責務分離（ページ固有スタイルと共通スタイルの整理）
- `--clr-*` トークンの漸進整理（`--grkd-*` との統合方針）
