# クエスト画像生成プロンプト集

AI画像生成用の雛形。各シーンの背景・キャラのプロンプトをここに蓄積する。

## 生成ツール（実測済み・2026-09-25）

Gemini の interactions API（`gemini-3.1-flash-image`、通称 Nano Banana）で生成する。

```bash
# 1. APIキーを .env.local に置く（gitignore済み）: GEMINI_API_KEY=...
# 2. 生成
cd /d/GoRakudo_Projects/GoRakuDo
export $(grep -v '^#' .env.local | xargs)
python scripts/generate-quest-image.py <prompt_file> <out.jpg> <aspect_ratio> <image_size> [ref1 ref2 ...]
# 例: python scripts/generate-quest-image.py prompt.txt out.jpg 16:9 2K ref.webp
```

**APIの制約（実測）**
- `mime_type` は **image/jpeg のみ**（`image/png` は 400 エラー）。透過も不可
  → 透過が必要なキャラ素材は「無地の明るい背景で生成 → rembg等で切り抜き → WebP保存」の手順を取る
- `aspect_ratio`: `16:9` / `1:1` など、`image_size`: `1K` / `2K` / `4K`
- 出力サイズ実測: 16:9×2K = 2752×1536、1:1×1K = 1024×1024
- 参考画像は複数渡せる（`input` 配列に image パートを並べる）
- 生成物は**リサイズせず生のまま保存**する方針（必要に応じて ffmpeg で変換）

---

## 共通ルール（全プロンプトに適用）

- 構造: **画風（冒頭）→ 構図 → 禁止事項（末尾）**
- 「アニメ」という単語は線画を引き寄せがち → 画風は参考作（サムライジャック等）で固定
- 看板・標識の文字は画像に入れない（日本語文字は崩壊する。HTML/CSSで合成）
- 人物・キャラは背景に含めない（別レイヤーで生成して合成）
- 輪郭線が出てしまう場合: 「輪郭線は一切使わない」を先頭1行目に移動
- 最強の手段: 承認済みミニマル2D画像を添付し「この画像と同じ画風で」

### ⚠️ 学び: 「細部なし」を強くしすぎると MS Paint 化する（2026-09-23）
テキスト生成で「輪郭線なし＋細部省略」を強要しすぎると、形が崩れたプリミティブな絵になる。
**正解は2段パイプライン**:
1. まず普通に良い構図の絵（アニメセル調・線画あり）を生成 → 構図と配置を決める
2. その画像をアップして **img2img で「輪郭線だけ消す」編集**（構図はほぼ維持される）

線消し編集プロンプト:
```
この画像を編集してください。
構図・配色・配置されている物・文字はすべてそのまま維持する。
変更するのは一点だけ：黒い輪郭線をすべて消す。
輪郭線があった場所は、両側の色面が自然に接するように補完し、
形の境界は色面の差だけで表現する。
影や色のトーンは変えない。新しい要素・細部・装飾は追加しない。
```
- 2〜3回生成してベストを選ぶ。看板文字が歪む場合は「看板の文字は変えないで」を追加

---

## シーン1: 分かれ道（1章・ヒーロー選択背景）

### 日本語版
```
【画風・最重要】
フラットな2Dミニマリストイラスト、絵本の背景画のような画風。
輪郭線・線画は一切使わない。形はすべて隣接する色面の境界だけで表現する。
ベタ塗りの基本色に、広くて弱い1段階の面影だけを加える。
細部の描き込みは一切せず、大きなシルエットと配色だけで構成する。
低彩度で柔らかい色合い。
参考画風：サムライジャックの背景美術、Alto's Odyssey、海外絵本のフラットイラスト。

【構図】16:9の横長
・画面中央の手前で1本の道が二手に分かれる「運命の分かれ道」
・左の道：明るい青空、桜、簡略化された和風の里（平屋の日本家屋と五重塔のシルエット）、温かい日差し
・右の道：暗い雲、茨の蔦に覆われた荒廃した古い木造校舎、地面に散らばる教科書
・人は描かない
・看板・標識は描かない（文字は後で合成する）

【禁止事項】
輪郭線、ペン入れ線、絵画的な筆致、油絵・水彩の質感、リアルな描き込み、
ジブリ風の細密な背景、文字・数字・記号、人物、3D表現、写真表現、過度なグラデーション
```

### 英語版（従わない場合こちらを試す）
```
Flat 2D minimalist illustration, storybook background art style.
No outlines or line art at all — every shape is defined only by the boundary
between adjacent flat color planes.
Flat base colors with only one soft, broad shadow layer.
No fine details; compose with big silhouettes and simple color blocks.
Soft, low-saturation storybook palette.
Style reference: Samurai Jack background art, Alto's Odyssey,
modern children's book flat illustration.

Composition (16:9 wide):
A single road in the center foreground splitting into two diverging paths
— a fateful crossroads.
Left path: bright blue sky, cherry blossoms, simplified Japanese village
(one-story houses and a five-story pagoda silhouette), warm sunlight.
Right path: dark storm clouds, a ruined old wooden schoolhouse covered in
thorny vines, textbooks scattered on the ground.
No people. No signboards. No text anywhere.

Avoid: outlines, inked lines, painterly brushwork, oil/watercolor texture,
realistic detail, Ghibli-style intricate backgrounds, text/letters/symbols,
characters, 3D rendering, photorealism, heavy gradients.
```

---

## シーン0: 深夜の勉強部屋（序章・**採用済み** 2026-09-25）

✅ 生成完了・配置済み: `public/images/quest/prologue-room.webp`（2752×1536, 187KB WebP）
API: Gemini `gemini-3.1-flash-image`（interactions API, JPEGのみ対応→ローカルでWebP変換）
参照画像: `grkd_mainsite_hero_v2.webp`（モニター・デスク上の小物・配色の参照として）

**採用プロンプト（v2・自然な空間統合版）**: `A:\Temp\quest-room-prompt-v2.txt`
ポイント（ハリボテ対策の学習）:
- 斜め45度の3/4ビュー、少し見下ろす（正面から貼られた構図の排除）
- 机は床に接地：脚・接地影・ラグとの重なり・配線・ゴミ箱・リュック
- **手前に椅子の背もたれを大きくボケさせて**前景→中景→後景の奥行きを作る
- 光源をモニターの青紫＋右奥ランプのアンバーの2つに限定し、空間全体で陰影を連続させる
- 禁止: コラージュ／切り貼り、浮遊物、遠近の不一致

---

## シーン0b: インドネシア語学校（序章後半・将来）

⚠️ セリフ末尾（p08「Ayo, kita lihat sekolah bahasa Indonesianya」）で行く先として言及。
実装は背景切替機能（マルチシーン）が必要になった時点で。

シナリオ: `docs/quest-scenario-draft.md` 序章。
保存先: `public/images/quest/prologue-classroom.webp`

### 日本語版
```
【画風・最重要】
フラットな2Dミニマリストイラスト、絵本の背景画のような画風。
輪郭線・線画は一切使わない。形はすべて隣接する色面の境界だけで表現する。
ベタ塗りの基本色に、広くて弱い1段階の面影だけを加える。
低彩度で柔らかい色合い。
参考画風：サムライジャックの背景美術、Alto's Odyssey、海外絵本のフラットイラスト。

【構図】16:9の横長
・インドネシアの小さな語学学校（sekolah bahasa）。教室の外観または教室内部
・窓から南国の光が差し込む。扇風機、白い壁、テーブルと椅子
・教室の机に、教科書とノートを広げて俯いている日本人男性の後ろ姿（中年・シルエット中心）
・壁にインドネシア語の勉強ポスター、時計、黒板
・人物は上記1人のみ（顔は描かない・後ろ姿）
・文字・看板は描かない（後で合成する）

【禁止事項】
輪郭線、ペン入れ線、絵画的な筆致、リアルな描き込み、文字・数字、過度なグラデーション、
人物の顔（後ろ姿のみ）、ホラー表現、暗すぎる雰囲気（哀愁はあるが、温かみを残す）
```

### 英語版
```
Flat 2D minimalist illustration, storybook background art style.
No outlines or line art at all — every shape is defined only by the boundary
between adjacent flat color planes.
Flat base colors with only one soft, broad shadow layer.
Soft, low-saturation storybook palette.
Style reference: Samurai Jack background art, Alto's Odyssey,
modern children's book flat illustration.

Composition (16:9 wide):
A small Indonesian language school (sekolah bahasa) — classroom interior or exterior.
Tropical light comes through the windows. Ceiling fan, white walls, tables and chairs.
A middle-aged Japanese man sits hunched at a desk, back to the viewer,
notebooks and textbooks open in front of him.
Language-learning posters on the wall, a clock, a blackboard.
Only this one figure; no faces (back view), no other people.
No text, no signboards.

Avoid: outlines, inked lines, painterly brushwork, realistic detail, text/letters,
heavy gradients, faces, horror imagery, overly dark mood (melancholic but warm).
```

---

## キャラクター: 案内役（候補: 黒猫）

**未決**: 造形はユーザー確認待ち。黒猫の場合のプロンプト雛形:
```
【キャラ仕様】
ミニマルな2Dキャラクター。輪郭線を使わず、色面の差で形を表現。
黒猫（全身・立ち姿または座り姿）。大きな丸い頭、簡略化された4〜5頭身。
目は、ほぼ黒に近い単色のカプセル形状を正確に2つ（縦長の棒状・上下が丸い）。
口と鼻は描かない。両頬に低彩度の淡い赤みを小さく入れる。
背景は完全透過（RGBA）。床・影・枠・文字を一切描かない。
```
※キャラは「単色背景で生成 → 背景除去（rembg等）→ 透過WebP」が最も安定
※保存先: `public/images/quest/guide.webp`

---

# 案内役「AI Kasou Yoshia」の表情差分（序章 p02〜p08）

**確定アンカー**（同一性・構図・スケールの基準／これ以上ぶれると差し替え時にガタつく）:
`output/gorakudo/Kasou_Yoshia/Female/fm_kasou_yoshia_smiletocamera.webp`

- 生成: `workflows/edit_pruna_int8_api.json`（int8 + Pruna 8step、I2I）
- `--image` に上のアンカーを渡す（＝顔・構図・大きさを固定）
- 1024×1024・白背景・**バストアップ**を維持（CSSの枠がそのまま使える）
- プロンプトは **booruタグ＋自然言語** の合わせ技（タグで構図/表情を、自然言語でニュアンスを指定）

## 共通ベース（全プロンプトの土台）
```
same character as the reference image, exact same face,
1girl, solo, upper body, bust portrait, long black hair, vivid royal blue inner streaks, blue tips,
sharp narrow slanted blue eyes, hood down resting behind the neck, standing collar visible,
plain black hooded jacket, no emblem, no logo, black turtleneck, thin silver cross necklace,
plain pure white background, 2D anime style, crisp line art, flat matte cel shading,
no text, no letters, no watermark, centered composition, evenly lit
```

## 7つの表情（台詞と対応）

### p02 「Tapi tunggu... auramu beda, ya?」（気づき・首をかしげる）
booru: `head tilt, raised eyebrow, closed mouth, sweatdrop, looking at viewer`
```
she tilts her head slightly to one side with a curious, slightly puzzled look,
one eyebrow raised, a small sweatdrop near her temple, lips closed in a small unsure smile
```

### p03 「Kayaknya kamu habis berjalan di jalan yang agak berliku, ya?」（優しい見抜き笑み）
booru: `light smile, closed mouth, half-closed eyes, gentle expression, head tilt`
```
a warm, gentle knowing smile, eyes softly half-closed, sympathetic and reassuring,
subtle head tilt, calm and kind
```

### p04 「Itu dia! Orang Jepang itu!」（驚き・指さし）
booru: `surprised, wide eyes, open mouth, pointing, outstretched arm, looking away, excited`
```
she suddenly looks to the side and points with one hand, eyes wide with excitement,
mouth open mid-shout, eyebrows raised, energetic pose
```

### p05 「Dia sudah puluhan tahun belajar bahasa Indonesia, tapi tetap begini.」（真剣・困り顔）
booru: `serious, furrowed brow, frown, closed mouth, looking down, narrowed eyes`
```
a serious, troubled expression with a slight frown, eyebrows drawn together,
eyes narrowed and looking slightly down, lips pressed closed, conveying concern
```

### p06 「Dia sendiri bingung, kenapa Indonesianya tidak makin lancar.」（同情・悲しみ）
booru: `worried, sad, downturned mouth, sweatdrop, looking down, half-closed eyes`
```
a sympathetic, slightly sad expression, eyes half-closed and looking down,
small frown, a faint sweatdrop, shoulders slightly lowered
```

### p07 「Menurutmu, kenapa?」（問いかけ・視線を合わせる）
booru: `head tilt, raised eyebrow, closed mouth, looking at viewer, faint smile`
```
she tilts her head and looks straight at the viewer with a questioning, inviting expression,
one eyebrow slightly raised, small closed-mouth smile
```

### p08 「Ayo, kita lihat sekolah bahasa Indonesianya.」（誘い・ウインク）
booru: `wink, one eye closed, smile, open mouth, cheerful, looking at viewer`
```
a playful wink with one eye closed, bright cheerful smile with the mouth slightly open,
mischievous inviting mood
```

## 実行例（表情を1つ作る）
```bash
cd /d/OSS_ProgramFiles/ComfyUI
.venv/Scripts/python.exe tools/comfy-gen.py --workflow workflows/edit_pruna_int8_api.json \
  --image "output/gorakudo/Kasou_Yoshia/Female/fm_kasou_yoshia_smiletocamera.webp" \
  --prompt "<共通ベース> + <表情のbooruタグ> + <自然言語>" \
  --seed 777 --out "output/gorakudo/Kasou_Yoshia/Female/expr_p02_tilt.png"
```

---

# 上半身ポーズ集（booru ＋ 自然言語）

表情と同じく **共通ベース＋アンカー** を使う。ファイル名は `pose_*.png`。

### ① 手を差し伸べる（誘う）※p01「こっちへおいで」向け
booru: `outstretched arm, reaching towards viewer, open hand, inviting, light smile, looking at viewer`
```
she holds out one hand toward the viewer with an open palm, inviting them to follow,
warm smile, the other arm relaxed at her side
```

### ② 指さし（横を指す）※p04向け
booru: `pointing, outstretched arm, looking away, open mouth, surprised eyes`
```
she points to her right with an extended arm, body slightly turned, excited surprised expression
```

### ③ 腕組み（自信・説明）
booru: `crossed arms, closed mouth, smirk, looking at viewer, confident`
```
both arms crossed under the chest, confident knowing smirk, chin slightly raised
```

### ④ 考え中（顎に手）※p07向け
booru: `hand on own chin, thinking, closed mouth, head tilt, looking up`
```
one hand raised to her chin, eyes looking up and away in thought, pensive thoughtful mood
```

### ⑤ 手を振る（挨拶）
booru: `waving, hand up, open mouth, smile, looking at viewer, cheerful`
```
she raises one hand and waves hello, cheerful open smile, friendly greeting
```

### ⑥ 手のひらで示す（説明）※p08向け
booru: `outstretched arm, open palm, gesturing, closed mouth, explaining, looking at viewer`
```
she gestures with an open palm as if presenting something beside her, calm explaining expression
```

### ⑦ サムズアップ（励まし）
booru: `thumbs up, smile, open mouth, looking at viewer, energetic`
```
she gives a thumbs up with a bright energetic smile, encouraging mood
```

### ⑧ 腰に手（リラックス）
booru: `hand on hip, closed mouth, slight smile, looking at viewer`
```
one hand resting on her hip, relaxed confident stance, slight smile
```

**注意**：③⑦⑧ は腕が広がるので、**「upper body」の枠を維持**しつつ手が切れないか確認（切れたら `--width 1024 --height 1280` で縦長に）。

