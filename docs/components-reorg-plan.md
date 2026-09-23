# components/ カテゴリ再編（B案）— 移動マッピング表

> **ステータス: 第2段階まで実行済み（2026-09-23、コミット済み）**
> 作成日: 2026-08-17 / ブランチ: `feat/astro-7-upgrade`
> 本ファイルは承認用の計画書。承認後、第2段階で `git mv` + import 文更新を実行する。

## 分類ルール（承認済み）

| カテゴリ | 定義 |
|---|---|
| `common/` | 全ページ共通の部品（ナビゲーション、SEO、パンくず、検索、TOC等） |
| `ui/` | 純粋な汎用UIプリミティブ（特定ページの文脈を持たないもの） |
| ページ固有 | ページ名フォルダへ（`homepage/`, `panduan-immersion/`, `panduan-lengkap/`(新設), `docs/`, `search/`, `tools/`, `youtube/`(新設) 等） |

## 判断根拠（調査方法）

- `grep -rn "components/" src` で全import文を網羅取得（pages / layouts / components間）
- 全コンポーネント名を逆引きgrep（`src` 全体、`*.astro/ts/js/mjs/css/md`）し、import されない物を検出
- `astro.config` / `tsconfig` にエイリアスなし（相対importのみ）を確認 → 移動時は import 文の書き換えが必須

---

## 移動マッピング表

### A. 移動する（15件）

| 現在パス | 移動先パス | 使用箇所（ファイル数・代表例） | 理由 |
|---|---|---|---|
| `content/ChannelCard.astro` | `youtube/ChannelCard.astro` **(新設)** | 1件: `pages/rekomendasi-channel-youtube-.../index.astro` | youtubeレコメンドページ専用 |
| `content/JapaneseLearningGuide.astro` | `panduan-lengkap/JapaneseLearningGuide.astro` **(新設)** | 1件: `pages/panduan-lengkap-otodidak-bahasa-jepang/index.astro` | panduan-lengkap 専用セクション |
| `content/LanguageLearningProblems.astro` | `panduan-lengkap/LanguageLearningProblems.astro` | 1件: 同上 | 同上 |
| `content/KrashenQuote.astro` | `panduan-lengkap/KrashenQuote.astro` | 1件: 同上 | 同上 |
| `content/TrakteerWidget.astro` | `panduan-lengkap/TrakteerWidget.astro` | 1件: 同上（`index.astro:1174`） | 専用埋め込みwidget。他ページのTrakteer導線はこのコンポーネント不使用（navbar/tutorialは生リンク） |
| `content/TableOfContents.astro` | `common/TableOfContents.astro` | 2件: `layouts/PostLayout.astro`, `pages/tutorial/[tool]/[...slug].astro` | 複数レイアウト/ページで使う共通部品 |
| `features/HistoryBiome.astro` | `panduan-immersion/HistoryBiome.astro` | 1件: `panduan-immersion/HistorySection.astro` | panduan-immersion 専用 |
| `features/JlptCanDoChart.astro` | `panduan-immersion/JlptCanDoChart.astro` | 1件: `panduan-immersion/StopLearningSection.astro` | 同上 |
| `features/LADExperiment.astro` | `panduan-immersion/LADExperiment.astro` | 1件: `panduan-immersion/LADSection.astro` | 同上 |
| `features/StageCard.astro` | `panduan-immersion/StageCard.astro` | 1件: `panduan-immersion/BonsaiRoadmapSection.astro` | 同上 |
| `features/StageMindsetCard.astro` | `panduan-immersion/StageMindsetCard.astro` | 1件: `StageCard.astro` 経由（panduan-immersion専用） | 同上（StageCardとセットで移動） |
| `features/StageQuestCard.astro` | `panduan-immersion/StageQuestCard.astro` | 1件: `StageCard.astro` 経由（panduan-immersion専用） | 同上（StageCardとセットで移動） |
| `ui/DiscordCard.astro` | `panduan-immersion/DiscordCard.astro` | 2件: `panduan-immersion/FinalCTASection.astro`, `NotebookStoriesSection.astro` | Discordレビュー表示専用。当面は panduan-immersion のみ使用（discordページは不使用）。**判断保留①**参照 |
| `ui/FAQ.astro` | `docs/FAQ.astro` | 1件: `pages/docs/[slug].astro` | 記事アコーディオンFAQ。`common/FAQSection`（スキーマ用可視コンテンツ）とは別物。**判断保留②**参照 |
| `ui/SearchForm.astro` | `common/SearchForm.astro` | 2件: `common/SearchPopover.astro`, `search/SearchSection.astro` | 検索フォームは分類ルール上「検索＝common」領域。searchページからも参照されるため共通側が自然。**判断保留③**参照 |

### B. 判断保留（承認者に選択を委ねる・1件）

| 現在パス | 候補A（推奨寄り） | 候補B | 使用箇所 | 論点 |
|---|---|---|---|---|
| `animations/WaveAnimation.astro` | `common/WaveAnimation.astro`（`animations/` 廃止） | 現状維持（`animations/` 維持） | 4件: 全4レイアウト（Base/Article/Post/ToolArticle）がimport | 「全レイアウト共通＝common」に厳密に従うなら移動。ただし `animations/` は意味の通る独立カテゴリで、移動の実益は小さい |

### C. 現状維持（35件）+ 未使用（3件）

| 現在パス | 判定 | 使用箇所（ファイル数・代表例） | 理由 |
|---|---|---|---|
| `common/UnifiedSEO.astro` | 現状維持 | 4レイアウト + `pages/404`, `pages/discord` | 共通SEO、移動済み |
| `common/Breadcrumb.astro` | 現状維持 | 4件: about-us, docs×3, faq | 共通パンくず |
| `common/FAQSection.astro` | 現状維持 | 3件: about-us, index, panduan-immersion | 複数ページ共通 |
| `common/SearchPopover.astro` | 現状維持 | 2件: docs/index, docs/page-[page] | 検索共通部品 |
| `common/navbar/Navbar.astro` | 現状維持 | 4レイアウト | ナビ共通 |
| `common/navbar/BottomNavBar.astro` | 現状維持 | 4レイアウト | ナビ共通 |
| `common/pagination/Pagination.astro` | 現状維持 | 4件: docs×2, tutorial×2 | ページネーション共通 |
| `common/pagination/pagination.ts` | 現状維持 | 同上（ロジック） | 同上 |
| `ui/Button.astro` | 現状維持 | 2件: `content/ChannelCard.astro`, panduan-lengkap ページ | 純粋プリミティブ（ルール例示済み） |
| `ui/Marquee.astro` | 現状維持 | 1件: `panduan-immersion/NotebookStoriesSection.astro` | ルールで ui/ 例示済みの汎用プリミティブ。単一使用だがページ文脈を持たない |
| `ui/PageHeader.astro` | 現状維持 | 3件: docs/index, docs/page-[page], youtube ページ | 複数ページ系統で使用＝ページフォルダ不可。汎用ヘッダープリミティブなので `ui/` が適合 |
| `ui/Prose.astro` | 現状維持 | 4レイアウト/ページ + panduan-immersion×4 + panduan-lengkap | 移動済み（`ui/`） |
| `animations/WaveAnimation.astro` | **判断保留④（B表）** | 4レイアウト | B表参照 |
| `docs/PostsGrid.astro` | 現状維持 | 2件: docs/index, docs/page-[page] | docs専用＝ページフォルダが正しい |
| `search/CategorySection.astro` | 現状維持 | 1件: pages/search | search専用 |
| `search/TagSection.astro` | 現状維持 | 1件: pages/search | search専用 |
| `search/SearchSection.astro` | 現状維持 | 1件: pages/search | search専用 |
| `tools/Tools-GridSection.astro` | 現状維持 | 1件: pages/tutorial/index | tutorial ルート（tools）専用 |
| `tools/Tool-IdContentGrid.astro` | 現状維持 | 2件: tutorial/[tool]/index, page-[page] | 同上 |
| `tools/Tool-IdArticle.astro` | 現状維持 | 1件: `tools/Tool-IdContentGrid.astro` 内部 | 同上の内部部品 |
| `homepage/hero.astro` | 現状維持 | 1件: pages/index | homepage専用 |
| `homepage/MissionSection.astro` | 現状維持 | 1件: pages/index | 同上 |
| `homepage/FeaturesSection.astro` | 現状維持 | 1件: pages/index | 同上 |
| `homepage/FeatureCard.astro` | 現状維持 | 1件: FeaturesSection 内部 | 内部部品 |
| `homepage/AwakeningSection.astro` | 現状維持 | 1件: pages/index | 同上 |
| `panduan-immersion/*.astro`（12件全般） | 現状維持 | 1件: panduan-immersion ページのみ | ページフォルダが正しい |
| `content/DonationButtons.astro` | **未使用（現状維持＋削除候補）** | 0件（全リポジトリgrepで自己ファイルのみ） | デッドコード。削除は承認制のため第2段階では移動せず据え置き。要判断 |
| `content/tagCategories-cards.astro` | **未使用（現状維持＋削除候補）** | 0件 | 同上 |
| `features/StageWrapper.astro` | **未使用（現状維持＋削除候補）** | 0件（使用例は自ファイルのdoc commentのみ） | 同上。features/ 廃止後も残る唯一のファイルになる点に注意 |

---

## 移動確定分の内訳

| 移動先 | 件数 |
|---|---|
| `panduan-lengkap/`（新設） | 4 |
| `panduan-immersion/` | 7（features 6 + ui/DiscordCard 1） |
| `common/` | 2（TableOfContents, SearchForm） |
| `docs/` | 1（FAQ） |
| `youtube/`（新設） | 1 |
| **合計** | **15** |
| 判断保留 | 1（WaveAnimation） |
| 現状維持 | 35 |
| 未使用（据え置き・削除候補） | 3 |
| **総ファイル数** | **54**（53 .astro + `common/pagination/pagination.ts`。`find src/components -type f | wc -l` で計測） |

→ 移動後、`content/` は「未使用2件のみ」、`features/` は「未使用1件のみ」が残る（削除承認時は両カテゴリ完全廃止）。

## 第2段階で必要な import 更新（予想、移動先と同一ディレクトリ深度が変わる箇所）

| 呼び出し元 | 変更内容 |
|---|---|
| `pages/panduan-lengkap-.../index.astro` | `content/` → `panduan-lengkap/` ×4 |
| `pages/rekomendasi-channel-youtube-.../index.astro` | `content/` → `youtube/` ×1 |
| `layouts/PostLayout.astro`, `pages/tutorial/[tool]/[...slug].astro` | `content/TableOfContents` → `common/TableOfContents` ×2 |
| `panduan-immersion/HistorySection, StopLearningSection, LADSection, BonsaiRoadmapSection` | `../features/X` → `./X` ×4 |
| `features/StageCard.astro`（移動後） | `./StageQuestCard` 等は深度不変で変更不要 |
| `panduan-immersion/FinalCTASection, NotebookStoriesSection` | `../ui/DiscordCard` → `./DiscordCard` ×2 |
| `pages/docs/[slug].astro` | `../../components/ui/FAQ` → `../../components/docs/FAQ` |
| `common/SearchPopover.astro` | `../ui/SearchForm` → `./SearchForm` |
| `search/SearchSection.astro` | `../ui/SearchForm` → `../common/SearchForm` |

- `content/ChannelCard.astro` → `youtube/` 移動時、内部の `import Button from '../ui/Button.astro'` は深度不変で変更不要
- `KrashenQuote` の `../../assets/...` 等も depth 不変（`src/components/X/` → `src/components/Y/` の横移動のみ）
- CSSは `src/styles/` 側にありコンポーネントパスへの依存なし（`panduan-lengkap-index.css` 等はクラス名コメントのみ）→ 影響なし

## 判断に迷ったコンポーネント（要ユーザー判断）

1. **`ui/DiscordCard`**: panduan-immersion の2箇所（FinalCTA, NotebookStories）のみ使用。`discord/` ページ将来的に使うなら `common/` 案も。→ 今回は panduan-immersion 移動を推奨。
2. **`ui/FAQ` vs `common/FAQSection`**: 名前が紛らわしいが役割が異なる（アコーディオン vs スキーマ可視コンテンツ）。docs専用のため `docs/` 推奨、将来的に全ページ化するなら `common/`。
3. **`ui/SearchForm`**: 純粋フォームプリミティブ（`ui/`維持も可能）だが、ルール上「検索」は common 領域。`common/` 推奨。
4. **`animations/WaveAnimation`**: B表参照（`common/` 移動 or `animations/` 維持）。
5. **未使用3件（DonationButtons / tagCategories-cards / StageWrapper）**: 移動対象外。削除するか据え置くかは別途承認。

## 検証手順（第2段階実行後に実施）

1. `grep -rn "components/content\|components/features\|components/ui/DiscordCard\|components/ui/FAQ\|components/ui/SearchForm" src` → 残存importゼロを確認
2. `npm run build`（astro build）で解決不能importの検出
3. `npm test` / `npm run test:integration`（該当があれば）
