# クエスト画像生成プロンプト集

AI画像生成用の雛形。各シーンの背景・キャラのプロンプトをここに蓄積する。

## 共通ルール（全プロンプトに適用）

- 構造: **画風（冒頭）→ 構図 → 禁止事項（末尾）**
- 「アニメ」という単語は線画を引き寄せがち → 画風は参考作（サムライジャック等）で固定
- 看板・標識の文字は画像に入れない（日本語文字は崩壊する。HTML/CSSで合成）
- 人物・キャラは背景に含めない（別レイヤーで生成して合成）
- 輪郭線が出てしまう場合: 「輪郭線は一切使わない」を先頭1行目に移動
- 最強の手段: 承認済みミニマル2D画像を添付し「この画像と同じ画風で」

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

## 今後追加予定
- 序章: 失敗の洞窟（石化した人々・散乱する文法書）
- 2章: クラッシェンの伝承（賢者の庵）
- 3章: 盆栽スキルツリー
- キャラスプライト: 案内役 / ヒーロー3人（透過WebP用・単色背景で生成→rembg）
