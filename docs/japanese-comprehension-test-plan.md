# Japanese Comprehension Test (JCT) 実装計画書

## 1. 概要・コンセプト
- **URL**: `/japanese-comprehension-test` (略称: JCT)
- **目的**: 
  従来の文法知識テスト（JLPT等）ではなく、Refoldの「Levels of Comprehension（理解度スケール）」を基準に、リアルの生メディア（YouTube、X/Twitter、青空文庫等）を用いて、学習者の「本当の日本語把握力」を測定する。
- **最終着地点**:
  判定された本当のレベルに合わせて、それぞれのレベルに最適なイマージョン学習法（`/wiki/...`）へ導く。

---

## 2. ユーザー体験フロー (UX Flow)

```
[ Step 1: 自己申告 (Self-Assessment) ]
案内役（ヨシア）が問いかけ、自分の感覚で暫定レベル（Lv 1〜7）を直感選択。
  ↓
[ Step 2: リアルメディア実践テスト (Adaptive Media Test) ]
自己申告レベルのプールからランダム抽出：
・リスニング 3問（YouTube動画の指定タイムスタンプ再生）
・リーディング 3問（青空文庫の抜粋 / 日本人のX投稿）
  ↓
[ Step 3: 各問の評価 (2段階判定) ]
各問題ごとに以下を実施：
① 内容理解クイズ（4択）：本当に意味が取れたか客観チェック
② 体感スケール（1〜10）：Refold Comprehension Amount スケールで自己評価
  ↓
[ Step 4: 総合判定 & レベル確定 ]
クイズ正解率 × 体感スケールの掛け合わせで、ブレや過大評価を補正し「真のレベル」を確定。
  ↓
[ Step 5: 専用Wikiへの接続 ]
確定したレベル別のイマージョン実践Wiki（`/wiki/...`）へ案内。
```

---

## 3. 実装フェーズ分割

### フェーズ 1: 画面骨組み & 動作モック構築（最優先）
- **ルート作成**: `src/pages/japanese-comprehension-test/index.astro`
- **ダミーデータ**: 各レベル数問ずつの仮問題で全体フローを実装。
- **画面構成**:
  1. スタート画面（自己申告 1〜7）
  2. メディア提示コンポーネント（YouTube埋め込み / テキストカード）
  3. クイズ＆1〜10スケール入力UI
  4. 結果表示画面（判定ランク・レーダーチャート風・WikiへのCTA）
- **ゴール**: スマホ・PCの実機で一連の操作感、テンポ、手触りを触って確認できる状態にする。

### フェーズ 2: データ構造設計 & 適応型判定ロジック
- **データ管理**: `src/data/jct-pool/` 配下にJSONでレベル別・メディア別に管理。
  - 年1〜2回の更新時はJSONを差し替えるだけで完結する保守設計。
- **データ構造案**:
  ```json
  {
    "id": "L3-L-001",
    "type": "listening",
    "level": 3,
    "media": {
      "platform": "youtube",
      "videoId": "xxxxxx",
      "start": 124,
      "end": 139
    },
    "question": "話者は何について驚いていましたか？",
    "options": ["A", "B", "C", "D"],
    "answer": 0
  }
  ```
- **判定アルゴリズム**:
  - クイズ正解率と自己申告体感スケール（1〜10）の乖離を計算し、レベル補正を行う。

### フェーズ 3: キャラクター演出 & Wiki導線統合
- 案内役（AI Kasou Yoshia）のリアクションセリフ・表情・音声演出。
- 判定結果に応じた `/wiki/...` への動線確立。

### フェーズ 4: 294問プール整備 & コンテンツ投入
- レベル1〜7 × (リスニング21問 + リーディング21問) = 計294問の本格収集とJSON登録。
- 定期メンテナンス手順のドキュメント化。

---

## 4. 実装ログ

### フェーズ 1 実装完了（画面骨組み & 動作モック）

**追加ファイル**

| パス | 役割 |
|---|---|
| `src/pages/japanese-comprehension-test/index.astro` | ページ本体。3ステップのパネル、メディア用 `<template>`、状態遷移の Vanilla JS |
| `src/styles/pages/jct/jct.css` | ページ専用スタイル（`--grkd-*` トークンのみ使用、`!important` なし） |
| `src/data/jct/levels.json` | 自己申告 Lv1〜7 のラベル（インドネシア語＋日本語） |
| `src/data/jct/comprehension-scale.json` | Refold Comprehension Amount 1〜10 のラベル |
| `src/data/jct/questions.mock.json` | モック問題4問（Listening 2 / Reading 2） |

**UI コピー方針**
- メイン＝インドネシア語（`lang='id'` 準拠）、補助＝日本語の二段表示。
- quest の `idText` + `jpText` と同じパターンで、出題メディア本文と4択の選択肢のみ日本語。

**実装した挙動**
1. 自己申告 Lv1〜7 を選択するまで「Mulai Tes」は `disabled`。
2. 出題は4問。`media.kind` に応じて YouTube 風プレイヤー / X 投稿カード / 青空文庫カードを `<template>` から複製して差し込む。
3. YouTube 風プレイヤーは再生タイムスタンプ UI のみのモック（`setInterval` でタイムラインだけ進む。音声ファイルはフェーズ2以降）。
4. 4択と1〜10スケールの両方が選択されるまで「Lanjut」は `disabled`。
5. 最終問題ではボタン文言が「Lihat Hasil」に変わる。
6. 結果画面は listening / reading 別の判定レベル、ギャップ分析、正答数・平均スケール・自己申告の統計、学習法ガイドへの CTA、「Ulangi Tes」を表示。

**判定ロジック（フェーズ1の仮実装）**
- `score = question.level + (正解 ? +0.5 : -0.75) + (scale - 5) * 0.2` を出題タイプ別に平均し、1〜7 にクランプ。
- フェーズ2で「クイズ正解率 × 体感スケール」の重み付きモデルに差し替える前提。コード内にも `Note` コメントで明記済み。

**アクセシビリティ**
- 選択肢は `<label>` + ネイティブ `<input type="radio">`（視覚的に隠すのみで a11y ツリーには残す）。
- パネル切り替え時に `tabindex='-1'` のパネルへフォーカスを移す。
- `aria-live='polite'` で問題番号と結果表示を読み上げ。
- プログレスバーは `role='progressbar'` + `aria-valuenow` を更新。
- タッチターゲットは `--touch-target-min` (44px) 以上。

**検証結果**
- `bun run stylelint:all` — 0 errors
- `astro check` — 0 errors
- `bun run build` — 53 pages built、`dist/japanese-comprehension-test/index.html` 生成

**既知の未実装（フェーズ2以降）**
- 実際の YouTube 埋め込み / 音声ファイル（現状はタイムラインだけのモック）
- 適応型出題（自己申告レベルに応じたプール抽選）
- `/wiki/level-N` の実ページ。現状の結果画面 CTA は既存の学習法ガイド
  `/panduan-immersion-belajar-bahasa-jepang-dengan-otodidak` を指す（404 回避）。
- 案内役キャラクター演出と音声

---

### フェーズ 1.5 実装完了（ヨシア出迎え会話 & かなスライダールート）

**背景**: これまでページを開くといきなり自己申告（Lv1〜7）が出ていた。
完全なゼロ初心者は Lv を選べず離脱するため、まず案内役ヨシアの問いかけで
「もうやってる／これから」を分岐させ、ゼロ勢をかな習熟度スライダー経由で
適切なガイドへ導く。

**変更ファイル**

| パス | 役割 |
|---|---|
| `src/pages/japanese-comprehension-test/index.astro` | パネル `intro` / `kana` / `kana-result` を追加。分岐・スライダー描画・50% 判定の JS |
| `src/styles/pages/jct/jct.css` | `.jct-talk-*` / `.jct-choice-*` / `.jct-back` / `.jct-kana-*` / `.jct-range` |
| `docs/japanese-comprehension-test-plan.md` | 本ログ |

**フロー（新）**

```
[intro] ヨシア「いらっしゃーい！日本語勉強したい人？それとも、もうやってる？」
  ├─ [Iya!]           → [start]  自己申告 Lv1〜7（既存フローそのまま）
  │                       → 4問テスト → 結果
  └─ [Baru mau mulai] → [kana]   かなスライダー（0〜100%, step 5）
                          → [kana-result] 50% で分岐
                               ├─ 50%以上 → Buka Panduan Immersion ▶ / Ulangi ↺
                               └─ 50%未満 → Buka Panduan Kana ▶     / Ulangi ↺
```

**実装した挙動**
1. 初期表示は `intro`。ステップチップは「01 Penilaian Diri」が点灯したまま
   （`stepOfPanel` マップで intro/kana/kana-result をすべて step 01 に束ねる）。
2. `[Iya!]` → 既存の自己申告パネル。自己申告パネルには「← Kembali ke sapaan」を
   追加し、分岐を後戻りできるようにした（誤タップ対策）。
3. `[Baru mau mulai]` → かなスライダー。数値は大きな `NN%`、その下に体感ラベル
   （ID + JP 二段）。0/20/40/60/80/100 の 6 バンドで文言が切り替わる。
4. スライダーのトラックは `--jct-kana-fill`（JS が `NN%` を注入）で塗り分け。
   グラデーションは常に全幅で描き、暗いオーバーレイの幅だけを縮めるので
   値が増えても色相がずれない。
5. `[Lanjut ▶]` で 50% 判定。50% 以上 =「文字読めるならもう十分」＋
   `Buka Panduan Immersion`、50% 未満 =「最初はみんな暗号に見える」＋
   `Buka Panduan Kana`。両方とも現状の遷移先は
   `/panduan-immersion-belajar-bahasa-jepang-dengan-otodidak`（Wiki 未整備のため）。
6. `[Ulangi ↺]` はスライダーを 0 に戻して `kana` へ。テスト側の「Ulangi Tes」と
   同じ「そのステップをやり直す」規約に揃えた。
7. 既存の `[Iya!]` → Lv1〜7 → 4問 → 結果フローは挙動変更なし。

**アクセシビリティ**
- スライダーは `aria-label` + `aria-valuetext`（`"40%: Hiragana sudah setengah jalan"`）
  で数値だけでなく体感ラベルも読み上げる。
- パネル遷移ごとに `tabindex='-1'` のパネルへフォーカス移動、`aria-live` で
  判定結果を通知（既存の仕組みをそのまま利用）。
- 体感ラベル・数値は `<p>` のテキスト更新のみ（レイアウトシフトなし）。
- タッチターゲットは `--touch-target-min` (44px) 以上。

**検証結果**
- `bun run stylelint:all` — 0 errors
- `astro check` — 0 errors / 0 warnings
- `bun run build` — 53 pages built
- ビルド済み `dist/japanese-comprehension-test/index.html` を jsdom に読み込み、
  34 項目のフロー検証（intro 初期表示 / 分岐 / スライダー描画 / 50% 以上・未満の
  文言と CTA / Ulangi / 既存テストフローの回帰）をすべて PASS。
- 実機（Chrome, 1280×900 と 390×844）で intro・kana・kana-result の 3 画面と
  両分岐を目視確認。モバイルではボトムナビ（88px）に CTA が被らないことも確認。

**既知の未実装**
- `Buka Panduan Kana` の遷移先がまだ immersion ガイド（専用かなガイドは未作成）。

---

### フェーズ 1.5b 実装ログ（タップ分断進行・立ち絵・ボイス組み込み）

**実装した挙動**
1. **初期ゲート（`intro`）**: タイトル・サブタイトル・ステップインジケーターを保持したまま、中央にスタートボタン（`Mulai Tes ▶` / `テスト開始`）を配置。このクリックがユーザーの起点となり、ブラウザの自動再生ブロックを完全に回避。
2. **場面1（`vn` - greet）**: クリックと同時に立ち絵（`guide-p02.webp`）と音声（`jct_01_intro.mp3`「いらっしゃーい！日本語勉強したい人？」）が再生。画面タップまたは Enter/Space で次へ。
3. **場面2（`choice`）**: 立ち絵と音声を非表示にし、`[Iya!]` と `[Baru mau mulai]` の選択肢ボタンのみを表示。
4. **場面3（`vn` - zero）**: `[Baru mau mulai]` 選択後、2行タップ送り（`jct_02_zero.mp3` ➔ `jct_03_kana_ask.mp3`、立ち絵 `guide-p03_yes` ➔ `guide-p04`）。
5. **場面4（`kana`）**: 立ち絵・音声を引っ込め、0〜100% かなスライダーと `[Lanjut 次へ ▶]` ボタンのみを表示。
6. **場面5A / 5B（`vn` ➔ `kana-result`）**:
   - 50%以上: 2行タップ送り（`jct_04` ➔ `jct_05`）➔ 立ち絵・音声なしで `Buka Panduan Immersion ▶` ＋ `Ulangi ↺`（スライダーやり直し）。
   - 50%未満: 4行タップ送り（`jct_06` ➔ `jct_07` ➔ `jct_08` ➔ `jct_09`）➔ 立ち絵・音声なしで `Buka Panduan Kana ▶` ＋ `Ulangi ↺`（スライダーやり直し）。
7. **バックグラウンド制御**: `visibilitychange` イベントで、タブ切り替えや非表示時に音声を自動一時停止。


---

### フェーズ 1.5c 実装ログ（BaseLayout 撤廃 → /quest 型スタンドアロン化）

**背景**: BaseLayout 由来のグローバル要素が JCT の VN シーンと衝突していた。

| 衝突元 | 実測値 | 症状 |
|---|---|---|
| `.nav-container`（Navbar） | 76px | スマホで JCT ヘッダーと重なる |
| `.layout-content` mobile clearance | `navbar-height + 2rem` = 102px | 上部に過大パディング |
| `BottomNavBar`（fixed） | 88px | VN シーンの下部が常に食われる |
| `main { padding-bottom: var(--bottom-nav-spacing) }` | 88px | 上と二重に確保 |

**方針**: `/quest/index.astro` と同じ「ページが `<!doctype html>` から文書全体を所有する」構造へ移行。`BaseLayout` は使わない。

**変更ファイル**

| パス | 役割 |
|---|---|
| `src/pages/japanese-comprehension-test/index.astro` | `BaseLayout` → 自前の `<html>` / `<head>` / `<body>`。`UnifiedSEO` を直接使い、`global.css` を明示 import。JCT 専用トップバー（`語楽道` 戻りリンク ＋ `/// JCT_ONLINE ///`）を追加 |
| `src/styles/pages/jct/jct.css` | ページシェル・トップバー・自前背景・モバイル VN フィル・フォーカスリング抑制 |
| `docs/japanese-comprehension-test-plan.md` | 本ログ |

**実装した挙動**

1. **スタンドアロン化**: site Navbar / BottomNavBar / WaveAnimation / `.layout-content` を完全撤廃。`--mobile-content-padding: 0` の opt-out ハックも不要になり削除（もう対象セレクタが存在しない）。
2. **JCT 専用トップバー**（`.jct-topbar`）: `position: fixed` ではなく通常フロー。左に `語楽道` ロゴ（`/` への戻りリンク、`Logo.svg` を `invert` で白抜き）、右に `/// JCT_ONLINE ///`。**重なりは構造的に発生しない**ため、クリアランス計算そのものが不要。
3. **JCT 専用背景**: WaveAnimation（homepage hero 用のぼかし写真）を廃止し、`body` に Night Library の静かな背景を自前描画（深い base ＋ Blurple 上部グロー ＋ 右下 Gold グロー、OKLCH トークンのみ）。`background-attachment: fixed` は iOS でジャンクするため不使用。
4. **スタートゲートの中央寄せ**: `body` が `min-height: 100dvh` の flex column、`main` が `flex: 1 1 auto` なので、`calc(100dvh - 112px)` のようなビューポート計算なしで残り領域に伸びる。
5. **スタート後モバイルでヘッダーを隠す**: `.jct-page:has(:where(.jct-gate[hidden])) .jct-header { display: none }`。`:where()` でゲート参照を特異度ゼロにし、ルール全体を 0,2,0 に保つ（`selector-max-specificity` 予算内）。
6. **モバイル VN のスクロールなし収容**: `body` を `100dvh` + `overflow: hidden` にし、`main → .jct-vn-panel → .jct-vn-stage → .jct-vn-guide` を `flex: 1 1 0; min-height: 0` で鎖状に縮め、立ち絵が残り領域を吸収。会話ボックスは `flex: 0 0 auto` で自然高さを維持（テキストを絶対に切らない）。ページ側 `overflow-y: auto` は安全弁。
7. **横向きスマホ対応**: `@media (max-width: 767px), (max-width: 1024px) and (max-height: 520px)`。844×390 は「幅はデスクトップ並・高さはスマホ」で、実測 325px オーバーフローしていたため同じ処理を適用。
8. **パネルのフォーカスリング抑制**: `.jct-panel:focus { outline: none }`。パネルは `tabindex='-1'` のフォーカス受け皿であって操作対象ではなく、既定の `:focus-visible` リングがパネル全体を白枠で囲み「壊れたボーダー」に見えていた。各操作要素のフォーカススタイルは維持。

**検証結果（Chrome CDP 実測）**

| viewport | ヘッダー | スクロール | 会話ボックス下端 |
|---|---|---|---|
| 320×568 | 非表示 | なし | 556 / 568 |
| 375×667 | 非表示 | なし | 655 / 667 |
| 390×844 | 非表示 | なし | 832 / 844 |
| 412×915 | 非表示 | なし | 903 / 915 |
| 844×390（横向き） | 非表示 | なし | 366 / 390 |
| 768×1024 | 表示 | なし | 全画面内 |
| 1023×768 | 表示 | なし | 743 / 768 |
| 1280×900 | 表示 | なし | 791 / 900 |
| 1440×900 | 表示 | なし | 791 / 900 |

- 全 viewport で横スクロールなし（`scrollWidth == innerWidth`）
- ビルド済み `dist/japanese-comprehension-test/index.html` に `navbar` / `bottom-nav` / `layout-content` / `wave-canvas` / `static-background-container` が **1 件も含まれない**ことを確認
- 全フロー回帰（gate → VN → choice → start/kana → test 4問 → result → retry）を CDP で実行し、各パネルでヘッダー非表示・横溢れなしを確認
- `bun run stylelint:all` — 0 errors
- `astro check` — 0 errors / 0 warnings
- `bun run build` — 53 pages built

**既知の制限**
- デスクトップの「高さ 520px 未満」ウィンドウ（例 1280×600）はメディアクエリ対象外のためスクロールが出る。意図的（PC の極端な横長ウィンドウはスマホ横向きではないと判断）。

---

### フェーズ 1.6 実装完了（Wiki専用レイアウト整備 & かなCTA導線の機構化）

**背景**: フェーズ 1.5 で「50% 未満 → Buka Panduan Kana」の文言分岐は入ったが、
`<a>` の `href` は 1 本固定のままだった。つまりボタンの文言と遷移先が食い違う
状態で、かな専用 Wiki 記事を作っても差し替えられない。本フェーズは記事本体を
作らず、**受け皿（レイアウト）と差し替え機構**だけを先に固める。

**変更ファイル**

| パス | 役割 |
|---|---|
| `src/layouts/WikiLayout.astro` | Wiki 専用レイアウト（新規・未使用状態で待機） |
| `src/styles/layouts/WikiLayout.css` | 同レイアウトのスタイル（新規） |
| `src/pages/japanese-comprehension-test/index.astro` | `data-jct-kana-cta` 追加 + `kanaCtas` を `{label, href}` 化 |

**WikiLayout の設計**

- `BaseLayout` 不使用の自前シェル。理由は JCT / quest と同じ（サイト Navbar の
  fixed ピル + BottomNavBar 88px + `.layout-content` のモバイルクリアランスが
  このページのトップバーと衝突する）。
- トップバーは**通常フロー**（fixed ではない）なので重なりが構造的に起きない。
  左が語楽道ロゴ戻りリンク、右が `/// WIKI_CODEX ///`（`aria-hidden` の装飾）。
- 背景は `body::before` の `position: fixed` 疑似要素。`background-attachment:
  fixed` は iOS Safari がスクロール毎に再描画してジャンクするため不採用。
  `z-index: -1` で canvas 背景の上・全子要素の下に描画される。
- `html` は `.wiki-html` クラスでスコープ。`scroll-padding-top` を 1rem に
  上書きしている（global.css の `--navbar-height` = 70px オフセットは、ナビバーの
  無いこのページでは TOC アンカーを 70px 下にずらしてしまう）。

**Prose タイポグラフィ**

- flex `gap` をやめ、`.wiki-prose > * + *` のリズム規則に統一。flex gap は
  見出しの `margin-block-start` と加算されるため h2 前に 3rem 超の穴が空いていた。
- `Note:` `.wiki-prose p { margin: 0 }` を**入れてはいけない**。(0,1,1) が
  リズム規則 (0,1,0) を打ち負かし、全段落が前の要素に密着する。実際に一度
  入れて build 後の CSS で発覚したため、コメントで明示した。
- `code` / `pre` / `table` / `img` / `figure` / `figcaption` / `hr` を新規対応。
- テーブルは**ネイティブ table レイアウト維持**。`display: block` +
  `overflow-x: auto` は一見定石だが、block 化した table ボックスが行を
  shrink-wrap するため 2 列テーブルが 61px セルまで潰れる（実測）。
  代わりにセルへ `overflow-wrap: anywhere`。120 文字の非改行セルで
  `break-word` = 1133px / ページ溢れ、`anywhere` = 316px / 溢れなし（390px 幅で実測）。

**アクセシビリティ**

- 先頭タブストップに `Langsung ke isi` スキップリンク（`#wiki-content`）。
- TOC の `/// DAFTAR_ISI ///` マーカーは CSS `::before`。スクリーンリーダーには
  素の「Daftar Isi」だけが渡る。
- `time[datetime]` で日付をマークアップ。
- `:focus-visible` を全リンク・ボタンに定義、`prefers-reduced-motion: reduce` で
  transition と hover の浮きを無効化。
- タッチターゲットは `--touch-target-min` (44px) 以上。

**JCT 側の差し替え機構**

```js
const kanaCtas = {
  high: { label: 'Buka Panduan Immersion', href: '/panduan-immersion-...' },
  low:  { label: 'Buka Panduan Kana',      href: '/panduan-immersion-...' },
};
// showKanaResult():
if (kanaCtaLabel) kanaCtaLabel.textContent = cta.label;
if (kanaCta) kanaCta.href = cta.href;
```

- マークアップ側の `href` は **no-JS フォールバック**。両分岐とも現在は実在ページを
  指すため、JS 無効でも 404 にならない。
- `low.href` はかな Wiki 記事が未公開のため暫定で immersion ガイド。公開時は
  **この 1 行を差し替えるだけ**で導線が切り替わる（マークアップ変更不要）。

**検証結果（Chrome CDP 実測 + ビルド）**

WikiLayout は未使用のため、検証用の一時ページ `src/pages/wiki-check/` を作って
レンダリングし、**確認後に削除**（`dist/wiki-check` も削除済み）。

| 項目 | 1280px | 390px |
|---|---|---|
| 横スクロール | なし | なし |
| 記事カード幅 | 768px | 358px |
| タイトル実寸 | 36.8px | 24.8px |
| h2 実寸 | 24px | 19.2px |
| テーブルセル幅 | 306px | 140px |
| CTA ボタン高さ | 44px | 44px |

- TOC アンカークリック → `#solusi` がビューポート上端 +69px に着地
  （`scroll-padding-top: 16px` + `scroll-margin-top: 16px` が効いている）
- 長いコード行（200 文字）→ `pre` 内で横スクロール（`scrollWidth 1696 / clientWidth 314`）、
  ページは溢れない
- フッター CTA は 390×844 で完全に視野内（`footerBottom 759 <= 844`）
- JCT 実機フロー（gate → VN → choice → kana → kana-result）を CDP で走査:
  - `20%` → ラベル `Buka Panduan Kana` / href = immersion（暫定）
  - `45%` → `Buka Panduan Kana`
  - `50%` / `55%` / `80%` → `Buka Panduan Immersion`
  - `step=5` のため `49` は 50 にスナップする（ブラウザ仕様。判定は `>= 50`）
- `bun run stylelint:all` — 0 errors
- `bun run build` — **53 pages built**（一時ページ削除後に再実行して確認）

**既知の未実装（次フェーズ）**

- かな Wiki 記事本体（`docs/drafts/panduan-belajar-hiragana-katakana-buku-cerita.md`
  に原稿あり。ユーザーのドラフト確認後に MDX 化して `/wiki/...` を新設）。
- `src/content/wiki/` コレクションと `src/pages/wiki/[slug].astro` ルート。
- `kanaCtas.low.href` の実 URL 差し替え。

---

### フェーズ 1.6b レビュー反映（code-reviewer フィードバック）

**BLOCKER 1: リストマーカー消失**

Tailwind preflight が `ol, ul, menu { list-style: none }` を出力しているため、
`.wiki-prose` 内の `<ul>` / `<ol>` が**箇条書きの記号も番号も出ない**状態だった
（ビルド済み `dist/assets/global-*.css` で確認）。親要素の `list-style` 一括指定
ではなくリスト種別ごとに復元したので、`<ul>` の中に置いた `<ol>` も
decimal のまま番号を保つ。

```css
.wiki-prose ul { list-style-type: disc; }
.wiki-prose ol { list-style-type: decimal; }
.wiki-prose li::marker { color: var(--grkd-purple-400); font-weight: 700; }
```

**BLOCKER 2: ボタンのコントラスト AA 不適合**

`.wiki-btn-primary` のグラデーション開始色が `purple-500` で、白文字との
コントラストが **3.98:1**（AA 4.5:1 未満）。JCT の `.jct-btn-primary` と同じ
`purple-700 → purple-600` に揃えた。`.wiki-skip` も同様に `purple-700`。

| 組み合わせ | 比 | 判定 |
|---|---|---|
| 白文字 / purple-700（新・開始） | **8.49** | AA PASS |
| 白文字 / purple-600（新・終了） | **5.54** | AA PASS |
| 白文字 / purple-500（旧・開始） | 3.98 | FAIL |
| 白文字 / purple-700（skip link） | **8.49** | AA PASS |

**カテゴリバッジの文字色**

`purple-400` on `purple-500/0.2` は **3.27:1** で不合格。`gold-base` に変更して
**7.33:1**（AA PASS）。バッジは装飾的な小サイズ（0.72rem）なので、AA 通常
テキスト基準（4.5:1）を余裕で超える値にした。

**その他の指摘**

- **日付の整形**: `publishedDate` をそのまま出していたため `2026-10-26` と
  生 ISO 文字列が表示されていた。`toLocaleDateString('id-ID', { year: 'numeric',
  month: 'long', day: 'numeric' })` で **「26 Oktober 2026」** に。
  `<time datetime="2026-10-26">` で機械可読値は保持。書式は
  `ToolArticleLayout.astro` と同一に揃えた。
- **ロゴの a11y**: `aria-label` を `'Kembali ke Beranda GoRakuDo'` から
  `'語楽道 — Kembali ke Beranda'` に変更。可視テキスト（語楽道）が
  アクセシブルネームに含まれるようになり、WCAG 2.5.3（Label in Name）を満たす。
- **`.gitignore`**: 巨大な非ソース資産 5 種を追加。
  `objinfo.json`（1.9MB）/ `hf_repo.json` / `.tmp-production-sitemap.xml` /
  `build-manual-import-gif.py` / `__pycache__/` + `*.pyc`。
  `git check-ignore -v` で 5 件すべてがヒットすることを確認済み。

**検証結果**

- CDP 実測（760px 幅）: `ul` = `disc` / `ol` = `decimal` / ネストした `ol` = `decimal`、
  `::marker` の色は `oklch(0.65 0.22 273.85)`（= purple-400）、`font-weight: 700`
- 目視スクリーンショット: 紫の disc、ネストした decimal、`26 Oktober 2026`、
  ゴールドのバッジ、暗いボタングラデーションをすべて確認
- コントラストは OKLCH → linear sRGB 変換 + WCAG 相対輝度で数値算出（上表）
- `bun run stylelint:all` — 0 errors
- `bun run build` — **53 pages built**（一時検証ページ削除後に再実行）

**注記**: WikiLayout は未だどのページからも import されていないため、
ビルド済み `dist` にはこの CSS チャンクが含まれない（意図通り。`/wiki/...`
ルート新設時に初めてバンドルされる）。
