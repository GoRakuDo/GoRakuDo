お世話になっております。Navbar.vueをAstroコンポーネントにポートする具体的な方法について、アーキテクチャの観点から分析し、最適な移行戦略をご提案いたします。

まず、現在のVueコンポーネントの構造を詳しく分析し、Astroへの移行計画を立てさせていただきます。


[3 tools called]

現在のプロジェクト構造を分析いたしました。Navbar.vueをAstroコンポーネントにポートする具体的な移行戦略をご提案いたします。

## 🏗️ **Navbar.vue → Astro ポート戦略**

### **1. アーキテクチャ分析**

現在のVueコンポーネントの特徴：
- **複雑なJavaScript機能**: ナビゲーション、モーダル管理、スクロール制御
- **高度なCSS**: Glass morphism、CSS Scroll-driven Animations、レスポンシブデザイン
- **Vue特有の機能**: リアクティブデータ、ライフサイクルフック

### **2. 段階的移行アプローチ**

#### **Phase 1: 基本構造のコピーとAstro化**
```astro
---
// Navbar.astro - Phase 1: Basic Structure
export interface Props {
  // 必要に応じてプロパティを追加
}
---

<div class="navbar-wrapper">
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <!-- 既存のHTML構造をそのまま移植 -->
  </nav>
</div>

<style is:global>
  /* 既存のCSSをそのまま移植 */
</style>
```

#### **Phase 2: JavaScript機能の移行**
```astro
---
// Navbar.astro - Phase 2: JavaScript Integration
---

<!-- HTML構造 -->

<script>
  // Vueの機能をVanilla JSに変換
  const NAV_ROUTES = {
    resources: { path: "/docs", label: "Resources" },
    posts: { path: "/docs", label: "Posts" },
    tools: { path: "/tools", label: "Tools" },
    panduan: { path: "/docs", label: "Panduan" }
  };

  function openInvitationModal() {
    window.open("https://discord.gg/j8qmYPAGQh", "_blank");
  }

  function navigateTo(routeKey) {
    const route = NAV_ROUTES[routeKey];
    if (route) window.location.href = route.path;
  }

  function handleGetStartedAction() {
    const isHomepage = window.location.pathname === "/" || window.location.pathname === "/index.html";
    if (isHomepage) scrollToMission();
    else window.open("https://discord.gg/j8qmYPAGQh", "_blank");
  }

  function scrollToMission() {
    const missionSection = document.getElementById("mission");
    if (!missionSection) {
      setTimeout(scrollToMission, 100);
      return;
    }
    
    const navbarHeight = (document.querySelector(".navbar") as HTMLElement)?.offsetHeight || 0;
    const scrollToPosition = Math.max(0, missionSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 40);
    window.scrollTo({ top: scrollToPosition, behavior: "smooth" });
  }

  // DOMContentLoadedでイベントリスナーを設定
  document.addEventListener('DOMContentLoaded', () => {
    // イベントリスナーの設定
  });
</script>
```

### **3. 具体的な実装手順**

#### **Step 1: ファイル作成**
```bash
# 既存のVueコンポーネントをコピー
cp src/components/public-components/Navbar.vue src/components/public-components/Navbar.astro
```

#### **Step 2: テンプレート部分の変換**
- Vueの`v-for`、`@click`、`:key`をAstroの標準HTMLに変換
- 条件分岐をAstroの条件レンダリングに変換

#### **Step 3: スタイルの最適化**
- Vueの`scoped`スタイルをAstroの標準スタイルに変換
- CSS変数の統合とグローバルシステムとの連携

#### **Step 4: JavaScript機能の移植**
- Vueのリアクティブ機能をVanilla JSに変換
- ライフサイクルフックをDOMContentLoadedイベントに変換

### **4. パフォーマンス最適化**

#### **CSS最適化**
```css
/* Astroネイティブの最適化 */
.navbar {
  /* CSS Scroll-driven Animationsを維持 */
  animation: navbarScrollOpacity linear;
  animation-timeline: scroll(root);
  animation-range: 0px 200px;
  
  /* GPU加速を維持 */
  will-change: background, backdrop-filter, border-color, transform;
  transform: translateZ(0);
}
```

#### **JavaScript最適化**
```javascript
// パフォーマンス最適化されたイベントハンドリング
const navbar = {
  init() {
    this.bindEvents();
    this.setupScrollAnimation();
  },
  
  bindEvents() {
    // イベントデリゲーションを使用
    document.addEventListener('click', this.handleClick.bind(this));
  },
  
  handleClick(e) {
    // 効率的なイベント処理
  }
};
```

### **5. 移行後の利点**

1. **パフォーマンス向上**: Vueのオーバーヘッドが削除
2. **バンドルサイズ削減**: Vueランタイムが不要
3. **SEO最適化**: サーバーサイドレンダリング
4. **保守性向上**: シンプルなHTML/CSS/JS構造

### **6. 実装の優先順位**

1. **高優先度**: 基本ナビゲーション機能
2. **中優先度**: スクロールアニメーション
3. **低優先度**: 高度なインタラクション

この戦略により、Vueコンポーネントの機能を維持しながら、Astroの利点を最大限活用できます。具体的な実装を開始されますでしょうか？