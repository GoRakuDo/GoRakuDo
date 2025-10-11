# アニメーション ユーティリティ ガイド

このドキュメントでは、再利用可能なアニメーション効果の使用方法を説明します。

## CSS変数

### トランジション
```css
--transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

### ホバー効果
```css
--hover-lift: translateY(-3px);
--hover-lift-small: translateY(-1px);
--hover-scale: scale(1.02);
```

### シャドウ効果
```css
--shadow-hover: 0 8px 25px rgb(0 0 0 / 0.2), 0 4px 12px rgb(0 0 0 / 0.15);
--shadow-base: 0 2px 8px rgb(0 0 0 / 0.1);
```

## ユーティリティクラス

### 基本クラス
```html
<!-- 滑らかなトランジションを適用 -->
<button class="hover-smooth">ボタン</button>

<!-- ホバー時に上に上がる -->
<div class="hover-lift">カード</div>

<!-- ホバー時に少し上に上がる -->
<a class="hover-lift-small">リンク</a>

<!-- ホバー時に拡大 -->
<svg class="hover-scale">アイコン</svg>
```

### ボタン用クラス
```html
<!-- Primaryボタンのホバー効果 -->
<button class="btn-hover-primary">Primary Button</button>

<!-- Secondaryボタンのホバー効果 -->
<button class="btn-hover-secondary">Secondary Button</button>
```

### カード用クラス
```html
<!-- カードのホバー効果 -->
<div class="card-hover">カードコンテンツ</div>
```

### リンク用クラス
```html
<!-- リンクのホバー効果 -->
<a class="link-hover">リンクテキスト</a>
```

### アイコン用クラス
```html
<!-- アイコンのホバー効果 -->
<svg class="icon-hover">アイコン</svg>
```

## カスタム使用例

### 独自のホバー効果を作成
```css
.my-custom-button {
  /* 基本の滑らかなトランジションを適用 */
  @apply hover-smooth;
  
  /* カスタムのホバー効果 */
  &:hover {
    background-color: var(--clr-purple);
    box-shadow: var(--shadow-hover);
    transform: var(--hover-lift);
  }
}
```

### 複数の効果を組み合わせ
```html
<div class="hover-smooth card-hover">
  <h3>タイトル</h3>
  <p>説明文</p>
  <button class="btn-hover-primary">アクション</button>
</div>
```

## パフォーマンス最適化

すべてのユーティリティクラスには以下の最適化が含まれています：

- `will-change: transform, background-color, box-shadow` - GPU加速
- `cubic-bezier(0.4, 0, 0.2, 1)` - 自然なイージング
- 適切なトランジション時間（0.2s-0.4s）

## ブラウザサポート

- Chrome 88+
- Firefox 87+
- Safari 14+
- Edge 88+

## 注意事項

1. ホバー効果は`@media (hover: hover)`で制御することを推奨
2. タッチデバイスでは`@media (hover: none)`で無効化
3. `prefers-reduced-motion`に対応する場合は`transition: none`を設定
