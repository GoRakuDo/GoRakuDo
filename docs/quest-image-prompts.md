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

# 案内役「AI Kasou Yoshia」最新シナリオ表情・ポーズ集（全9セリフ対応）

確定アンカー（同一性・構図・配色の絶対基準）:
`output/gorakudo/Kasou_Yoshia/Female/fm_kasou_yoshia_smiletocamera.webp`

- モデル: Qwen-Image-2.1（bf16 または int8 + Pruna 8step、I2I / Edit）
- `--image` に上記のアンカーを渡す（顔の造形・髪型・衣装を固定）
- 解像度: 1024×1024（または縦長 1024×1280、手のポーズで切れる場合）
- スタイル: 白背景、2Dセル画調、マット塗装、クッキリした線画

---

## 共通ベースプロンプト（全セリフ共通の土台）
```
same character as the reference image, exact same face,
1girl, solo, upper body, bust portrait, long black hair, vivid royal blue inner streaks, blue tips,
sharp narrow slanted blue eyes, hood down resting behind the neck, standing collar visible,
plain black hooded jacket, no emblem, no logo, black turtleneck, thin silver cross necklace,
plain pure white background, 2D anime style, crisp clean line art, flat matte cel shading,
no text, no letters, no watermark, centered composition, evenly lit
```

---

## 各セリフと完全連動するポーズ・表情プロンプト（自然言語 ＋ booruタグ）

### 1. `p01` 「ちょっと待っててね...」
- **声のトーン**: リラックスした吐息混じりの親しい囁き（「ふっ、ちょっと待っててね」）。
- **表情・ポーズ**: 親しい友人に向けた柔らかな微笑み。片手を胸のあたりで軽く立てて「少しだけ待ってて」の仕草。
- **booruタグ**: `soft smile, gentle eyes, closed mouth, relaxed, one hand slightly raised, looking at viewer`
- **自然言語プロンプト**:
```
a soft relaxed smile with gentle half-lidded eyes, looking warmly at the viewer,
she lightly raises one open hand in a casual "wait just a second" gesture,
relaxed and intimate mood, calm breath
```

---

### 2. `p02` 「いらっしゃーい！日本語を勉強したい方ですか？それと、今お勉強されています？」
- **声のトーン**: `[delighted]` ウェルカム感あふれる明るい挨拶 → `[curious][calm]` 優しい首かしげの問いかけ。
- **表情・ポーズ**: 満面の笑顔で片手を高く上げて振る（ウェルカム）、少し首をかしげて興味深そうにこちらを覗き込む。
- **booruタグ**: `cheerful smile, open mouth, wide bright eyes, waving, hand raised, head tilt, welcoming, energetic, looking at viewer`
- **自然言語プロンプト**:
```
a bright cheerful welcoming smile with mouth slightly open, happy sparkling eyes,
she tilts her head curiously while raising one hand to wave a warm hello,
inviting and hospitable host stance, friendly greeting
```

---

### 3. `p03_yes` 「じゃあ、話が早いです！うち、語楽道は自然言語習得っていう方式で教えてます。それはイマージョンって言うんです。」
- **声のトーン**: `[confident][emphasis]` 落ち着きと説得力に満ちたプロの風格。確固たる自信。
- **表情・ポーズ**: 自信に満ちた笑み（不敵な笑み・smirk）。胸の下で軽く腕組み、または片手を胸に当てて誇らしげ。
- **booruタグ**: `confident, smirk, knowing smile, crossed arms, raised chin, sharp gaze, looking at viewer`
- **自然言語プロンプト**:
```
a confident and proud smirk, sharp intelligent eyes looking directly at the viewer with quiet authority,
chin slightly raised, arms crossed beneath her chest in a poised and knowledgeable posture,
trustworthy professional mentor look
```

---

### 4. `p03_yes_desc` 「イマージョンは文法と翻訳なしで、ゼロから赤ちゃんみたいに自然習得するんです。」
- **声のトーン**: `[confident][soft tone]` 知的で親切な解説。優しく語りかける先生のトーン。
- **表情・ポーズ**: 優しい知的な笑顔。片手のひらを上に向けて差し出し、何かを紹介・解説するプレゼンジェスチャー。
- **booruタグ**: `gentle smile, calm eyes, open palm gesture, outstretched arm, explaining, presenting, looking at viewer`
- **自然言語プロンプト**:
```
a calm intellectual smile with kind reassuring eyes,
she extends one arm forward with an open palm facing upward in a gentle explaining gesture,
as if showing a clear concept, articulate and welcoming teacher stance
```

---

### 5. `p03_no_exit` 「そうっすか？また今度で興味があればぜひ、大歓迎です！」
- **声のトーン**: `[relaxed]` 肩の力が抜けたフランクな返答 → `[delighted]` 押し付けがましくない爽やかな見送り。
- **表情・ポーズ**: 片手を軽く挙げて「じゃあね！」と爽やかに手を振る。片手を腰に当ててリラックスした立ち姿。
- **booruタグ**: `relaxed smile, one eye closed or gentle squint, casual wave, hand on hip, friendly parting, looking at viewer`
- **自然言語プロンプト**:
```
a casual and easygoing smile with relaxed eyes, no pressure at all,
one hand resting loosely on her hip while her other hand gives a small cheerful farewell wave,
breezy and friendly parting posture
```

---

### 6. `p01_return` 「おかえり！始めようか？」
- **声のトーン**: `[happy][excited]` 親密で包容力のある、耳元で語りかけるようなウィスパーボイス。
- **表情・ポーズ**: 少し身を乗り出して、温かい眼差しで微笑む。両手または片手を差し伸べて「おいで」の仕草。
- **booruタグ**: `tender smile, blushing slightly, reaching towards viewer, leaning forward, welcoming back, intimate, looking at viewer`
- **自然言語プロンプト**:
```
a sweet and tender affectionate smile, softly leaning slightly closer toward the viewer,
gentle loving eyes, holding out a hand to welcome the viewer back in an intimate reunion mood,
comforting and cozy presence
```

---

### 7. `p04` 「インドネシア語を片言で話してる日本人はみたことあります？」
- **声のトーン**: `[curious]` 好奇心と興味を引く自然な問いかけ。「ねぇ、ある？」のノリ。
- **表情・ポーズ**: 顎に指先を当てて「うーん？」と考える、または人差し指を1本立てて興味深そうに眉を上げる。
- **booruタグ**: `curious, raised eyebrow, finger on own chin or cheek, thinking, head tilt, inquisitive gaze, looking at viewer`
- **自然言語プロンプト**:
```
an intrigued and curious expression with one eyebrow slightly arched, head tilted,
one index finger lightly touching her cheek or chin in a pensive questioning pose,
leaning in with an inquisitive sparkle in her eyes
```

---

### 8. `p05` 「僕の知り合いは、8年もインドネシア語を勉強してきたのに、まだ全然上手く話せてないね...」
- **声のトーン**: `[worried][sympathetic][nostalgic]` 呆れと残念さ、肩を落として世間話をするような語尾の抜け感。
- **表情・ポーズ**: 眉を八の字に寄せた困り顔・同情の表情。小さく肩をすくめる、または片手を後頭部に当てて困惑。
- **booruタグ**: `worried, sympathetic, furrowed brow, troubled smile, sweatdrop, shrugging or hand behind head, looking down slightly`
- **自然言語プロンプト**:
```
a sympathetic, slightly troubled expression with gently knitted eyebrows and a wry bittersweet smile,
small sweatdrop near temple, shoulders slightly slumped or shrugging in mild disbelief,
looking with compassionate understanding
```

---

### 9. `p07` 「実は簡単だけど、どうやって勉強するかによって結果が違うんですよ。僕の知り合いはどうやって勉強したか、みて行こうか？」
- **声のトーン**: `[cheerful][hopeful][compassionate][calm]` 前向きな説得力から、次の冒険へ手を取るワクワク感。
- **表情・ポーズ**: 茶目っ気のあるウインク、または輝く笑顔。こちらに手をしっかり差し伸べて「さあ、一緒に行こう！」と誘う。
- **booruタグ**: `wink or bright confident smile, outstretched hand towards viewer, inviting, dynamic pose, hopeful, leading the way`
- **自然言語プロンプト**:
```
a bright hopeful smile with a charming wink in one eye, radiant and inspiring energy,
she firmly extends her open hand toward the viewer inviting them to take it and follow her forward,
heroic and encouraging guide leading into the journey
```

---

## 🎨 生成コマンドの書き方例（ComfyUI / Colab）

```bash
cd D:\OSS_ProgramFiles\ComfyUI
.venv\Scripts\python.exe tools\comfy-gen.py \
  --workflow workflows/edit_pruna_int8_api.json \
  --image "output/gorakudo/Kasou_Yoshia/Female/fm_kasou_yoshia_smiletocamera.webp" \
  --prompt "<共通ベース> + <各セリフのbooruタグ> + <各セリフの自然言語プロンプト>" \
  --seed 777 \
  --out "output/gorakudo/Kasou_Yoshia/Female/p02_welcoming.png"
```
（※ Colab の G4 GPU ハイブリッドUI環境で生成する場合は、ブラウザ `http://127.0.0.1:8188` からアンカー画像をドラッグ＆ドロップして、上記プロンプトを貼るだけでOK！）


