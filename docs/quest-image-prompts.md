# クエスト画像生成プロンプト集

AI画像生成用の雛形。各シーンの背景・キャラのプロンプトをここに蓄積する。

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

## シーン0: 失敗の洞窟（序章）

シナリオ: `docs/quest-scenario-draft.md` 序章。石化した人々と散乱する文法書が転がる薄暗い洞窟。
保存先: `public/images/quest/prologue-cave.webp`

### 日本語版
```
【画風・最重要】
フラットな2Dミニマリストイラスト、絵本の背景画のような画風。
輪郭線・線画は一切使わない。形はすべて隣接する色面の境界だけで表現する。
ベタ塗りの基本色に、広くて弱い1段階の面影だけを加える。
低彩度で柔らかい色合い。
参考画風：サムライジャックの背景美術、Alto's Odyssey、海外絵本のフラットイラスト。

【構図】16:9の横長
・薄暗い洞窟の内部。天井からは僅かな光が差し込む
・床には古びた文法書・単語帳・過去問が散乱
・壁際に「石化した人々」の彫像が数体（動きを止めた人型のシルエット、怖すぎないように）
・奥に続く道がほのかに光っている（希望の示唆）
・人物は描かない（石化した彫像以外）

【禁止事項】
輪郭線、ペン入れ線、絵画的な筆致、リアルな描き込み、文字・数字、過度なグラデーション、
ホラー・グロテスク表現（怖い化石ではなく、物語的な哀愁のある表現にする）
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
Interior of a dim cave. A faint shaft of light falls from the ceiling.
Old grammar books, vocabulary notebooks and test papers scattered on the floor.
A few stone-petrified human figures stand along the walls as statues
(still human silhouettes — melancholic, not scary).
A path in the back glows faintly, hinting at hope.
No living characters.

Avoid: outlines, inked lines, painterly brushwork, realistic detail, text/letters,
heavy gradients, horror or grotesque imagery.
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
