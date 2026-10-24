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
