# GoRakuDo — Design System Specification

> **Version:** 2.1.0 (Discord Dark Pop OKLCH Influences Absorbed)
> **Last Updated:** 2026-05-22
> **Status:** Draft — Pending Implementation
> **Framework:** Astro 5.13 + Tailwind CSS v4.1 + OKLCH Color Space
> **Reference:** `frontend-design` skill framework (6-phase workflow), Discord Dark Pop OKLCH

---

## 0. Baseline Configuration

```
DESIGN_VARIANCE:  5   (1=rigid symmetry,   10=artsy asymmetry)
MOTION_INTENSITY: 5   (1=static,           10=cinematic choreography)
VISUAL_DENSITY:   4   (1=art gallery airy,  10=cockpit packed)
```

**Rationale:** GoRakuDo は語学学習プラットフォーム。コンテンツの可読性が最重要。
過度なモーションや高密度レイアウトは読み物の邪魔になる。
ただし「退屈な教科書」にはしたくないので、variance と motion はやや高めに据える。

---

## 1. Design Direction

### 1.1 Brand Identity

**GoRakuDo (語楽道)** — 「言語の楽しい道」

- **Tone:** Calm authority meets playful curiosity — high-contrast, cinematic, yet refined
- **Aesthetic:** Dark immersive with vibrant luminous accents — "Night Library" meets "Discord Dark Pop" energy
  暗闇の中に知識の光が弾けるイメージ。重厚さと遊び心の共存。
  従来の抑制された美しさに、Discord Dark Pop の高い彩度とコントラストを注入。
- **Differentiation:** 他の語学サイトの明るくカジュアルな雰囲気から差別化し、
  本気の学習者が夜通し没頭したくなる、エナジーにあふれた没入空間を作る。

### 1.2 Design Principles

1. **Content-First:** あらゆるデザイン判断はコンテンツの可読性を最優先する
2. **Quiet Confidence:** 派手さではなく、抑制された美しさで信頼を構築する
3. **Progressive Disclosure:** 情報は必要なときに必要な分だけ — Miller's Law (chunk ~4)
4. **Tactile Feedback:** インタラクションは物理的な質量を感じさせる (spring physics)
5. **Accessibility-Native:** アクセシビリティは後付けではなく設計の起点

---

## 2. Color System

### 2.1 70-20-10 Rule

| Role | Proportion | Color | Description |
|---|---|---|---|
| **Dominant (70%)** | Backgrounds, surfaces, negative space | Black (off-black) + midnight navy surface | 空間の大部分。深い闇に紫のニュアンス。Discord Dark Pop の `surface` (oklch(17.80% 0.058 275.81)) でレイヤー階層を作る |
| **Secondary (20%)** | Accent surfaces, borders, hover states, links | Purple → Blurple | ブランドの核。Discord のシグネチャー blurple (oklch(57.74% 0.209 273.85)) に近づけ、より鮮やかで遊び心のあるインタラクションに |
| **Tertiary (10%)** | CTAs, focus indicators, highlight moments | Royal Blue → Electric Violet | 行動喚起の切り札。Discord の secondary (oklch(38.19% 0.232 267.20)) をCTA背景に活用 |

### 2.2 OKLCH Palette — Dominant (Black & Surface)

ダークモード専用。Pure black (`oklch(0 0 0)`) は禁止 — 全てオフブラック。
Hue は `270deg` 〜 `275deg` の範囲で変調し、Discord Dark Pop の `surface` 層を追加してレイヤー階層を強化する。

```
Token Name                    OKLCH Value                  Hex Fallback     Usage
─────────────────────────────────────────────────────────────────────────────────────
--grkd-black-950              oklch(0.05  0.005 270)       #08070b          Page bg (deepest)
--grkd-black-900              oklch(0.10  0.008 270)       #110f16          Section bg
--grkd-surface                oklch(0.178 0.058 275.81)    #1e1830          Surface bg (Discord Dark Pop surface層)
--grkd-black-850              oklch(0.14  0.010 270)       #181520          Card bg, content area
--grkd-black-800              oklch(0.18  0.010 270)       #1f1c28          Elevated surface
--grkd-surface-2              oklch(0.3096 0.150 271.29)   #3b2e6e          Bright indigo surface (Discord surface-2, tonal separation用)
--grkd-black-750              oklch(0.22  0.010 270)       #272330          Input bg, code block bg
--grkd-black-700              oklch(0.28  0.008 270)       #332f3d          Subtle border
--grkd-black-600              oklch(0.35  0.008 270)       #433f4d          Muted border
--grkd-black-500              oklch(0.45  0.005 270)       #5a5763          Placeholder text
--grkd-black-400              oklch(0.55  0.005 270)       #74717d          Muted text
--grkd-black-300              oklch(0.65  0.005 270)       #908d98          Secondary text
--grkd-muted                  oklch(0.8599 0.071 282.16)   #d6cce6          Soft lavender text (Discord muted)
--grkd-black-200              oklch(0.75  0.005 270)       #aca9b3          Body text
--grkd-black-100              oklch(0.85  0.005 270)       #cac7d0          Primary text
--grkd-black-50               oklch(0.93  0.003 270)       #e7e5eb          Headings, emphasis

**Contrast Check (WCAG 2.2 AA: 4.5:1 for body, 3:1 for large text):**

| Text Token | Background Token | L-delta | Est. Ratio | Verdict |
|---|---|---|---|---|
| `--grkd-black-200` (0.75) | `--grkd-black-950` (0.05) | 0.70 | ~12:1 | AA Pass |
| `--grkd-black-300` (0.65) | `--grkd-black-950` (0.05) | 0.60 | ~8.5:1 | AA Pass |
| `--grkd-black-400` (0.55) | `--grkd-black-950` (0.05) | 0.50 | ~6:1 | AA Pass |
| `--grkd-black-500` (0.45) | `--grkd-black-950` (0.05) | 0.40 | ~4.5:1 | AA Borderline |
| `--grkd-black-100` (0.85) | `--grkd-black-850` (0.14) | 0.71 | ~12:1 | AA Pass |
| `--grkd-black-300` (0.65) | `--grkd-black-850` (0.14) | 0.51 | ~6:1 | AA Pass |

> L-delta >= 0.40 は AA 4.5:1 のOKLCH近似閾値。0.50以上が安全圏。

### 2.3 OKLCH Palette — Secondary (Purple → Blurple)

ブランドカラー。Discord Dark Pop のシグネチャー blurple (`oklch(57.74% 0.209 273.85)`) を吸収。
Hue は `273deg`（Discord の primary 近似）〜 `280deg`（既存紫）の範囲で変調。
Chroma は最大 `0.22` まで引き上げ、ダークモードでも鮮やかに発色させる。

```
Token Name                    OKLCH Value                  Hex Fallback     Usage
─────────────────────────────────────────────────────────────────────────────────────
--grkd-purple-950             oklch(0.15  0.06  273)       #1a0f30          Deep purple bg wash
--grkd-purple-900             oklch(0.22  0.10  273)       #271a45          Purple surface, sidebar tint
--grkd-purple-800             oklch(0.30  0.14  273)       #36255e          Active nav bg
--grkd-purple-700             oklch(0.40  0.18  273)       #4a3380          Border accent
--grkd-purple-600             oklch(0.50  0.20  273)       #6040a0          Hover state
--grkd-purple-500             oklch(0.58  0.21  274)       #7450b8          Primary blurple (links, icons, accent)
--grkd-purple-400             oklch(0.65  0.22  274)       #8c65d0          Existing accent color
--grkd-purple-300             oklch(0.72  0.18  274)       #a680e0          Light accent, selected
--grkd-purple-200             oklch(0.80  0.14  274)       #c0a0f0          Tag bg, badge
--grkd-purple-100             oklch(0.88  0.08  274)       #d8c8f4          Subtle highlight
--grkd-purple-50              oklch(0.95  0.04  274)       #f0e8fa          Faint wash
```

**Contrast Check:**

| Text/Element | Background | L-delta | Verdict |
|---|---|---|---|
| `--grkd-purple-400` (0.65) on `--grkd-black-950` (0.05) | - | 0.60 | AA Pass (large text + icons) |
| `--grkd-purple-500` (0.58) on `--grkd-black-950` (0.05) | - | 0.53 | AA Pass |
| `--grkd-purple-500` (0.58) on `--grkd-black-850` (0.14) | - | 0.44 | AA Pass (4.5:1+) |
| `--grkd-black-50` (0.93) on `--grkd-purple-700` (0.40) | - | 0.53 | AA Pass (button text) |

### 2.4 OKLCH Palette — Tertiary (Electric Violet / CTA)

10%比率の切り札。CTA・フォーカスリング・プログレスバー・ハイライト専用。
Discord Dark Pop の `secondary` (oklch(38.19% 0.232 267.20)) からインスパイア。
紫 (H~274) との色相差 ~30° で調和しつつ明確に区別。Hue は `247deg` に統一。

```
Token Name                    OKLCH Value                  Hex Fallback     Usage
─────────────────────────────────────────────────────────────────────────────────────
--grkd-blue-900               oklch(0.20  0.12  247)       #0d1a3e          Deep blue bg
--grkd-blue-800               oklch(0.28  0.16  247)       #162b5e          Blue surface
--grkd-blue-700               oklch(0.38  0.20  247)       #2040a0          Active state
--grkd-blue-600               oklch(0.48  0.22  247)       #3058c8          CTA hover
--grkd-blue-500               oklch(0.55  0.22  247)       #406ae0          Primary CTA bg
--grkd-blue-400               oklch(0.63  0.20  247)       #5580f0          Focus ring, link accent
--grkd-blue-300               oklch(0.72  0.16  247)       #7898f8          Selected state
--grkd-blue-200               oklch(0.82  0.10  247)       #a0b8fc          Subtle indicator
--grkd-blue-100               oklch(0.90  0.06  247)       #c8d4fe          Faint wash
```

**Contrast Check:**

| Element | Background | L-delta | Verdict |
|---|---|---|---|
| White text (0.93) on `--grkd-blue-500` (0.55) | - | 0.38 | 3:1+ (large text AA Pass) |
| White text (0.93) on `--grkd-blue-600` (0.48) | - | 0.45 | AA Pass (normal text) |
| `--grkd-blue-400` (0.63) on `--grkd-black-950` (0.05) | - | 0.58 | AA Pass |

### 2.5 Semantic Colors

```css
--grkd-success:     oklch(0.59  0.145 163);   /* Green */
--grkd-warning:     oklch(0.66  0.179  58);   /* Amber */
--grkd-error:       oklch(0.58  0.200  18);   /* Red */
--grkd-info:        oklch(0.58  0.180 245);   /* Royal Blue (info = brand blue) */
```

各セマンティックカラーには `bg` / `fg` / `border` / `icon` バリアントを用意する。

### 2.6 Shadow Tinting

```css
/* Shadows are tinted to background hue (270deg) — never generic rgba(0,0,0,...) */
--grkd-shadow-sm:   0 1px 3px oklch(0.05 0.01 270 / 0.30);
--grkd-shadow-md:   0 4px 12px oklch(0.05 0.01 270 / 0.25), 0 2px 4px oklch(0.05 0.01 270 / 0.15);
--grkd-shadow-lg:   0 8px 24px oklch(0.05 0.01 270 / 0.30), 0 4px 8px oklch(0.05 0.01 270 / 0.20);
--grkd-shadow-xl:   0 16px 48px oklch(0.05 0.01 270 / 0.35);
--grkd-shadow-purple: 0 8px 24px oklch(0.40 0.18 280 / 0.20);
--grkd-shadow-blue:   0 8px 24px oklch(0.38 0.16 245 / 0.20);
```

### 2.7 Glassmorphism Tokens

```css
--grkd-glass-bg:           oklch(0.14 0.010 270 / 0.60);
--grkd-glass-bg-hover:     oklch(0.18 0.010 270 / 0.70);
--grkd-glass-border:       oklch(0.40 0.015 270 / 0.20);
--grkd-glass-border-hover: oklch(0.50 0.020 280 / 0.30);
--grkd-glass-blur:         12px;
--grkd-glass-blur-mobile:  8px;   /* Mobile: backdrop-blur を軽くする */
```

---

## 3. Typography System

### 3.1 Font Stack

| Role | Font | Fallback | Notes |
|---|---|---|---|
| **Primary (UI & Body)** | `Gen Interface JP` | `system-ui, sans-serif` | Latinと和文の調和を最適化したUI用フォント |
| **Heading (Display)** | `Gen Interface JP Display` | `Georgia, serif` | 見出しの格調 |
| **Logo** | `Yuji Syuku` | `serif` | 「語楽道」ロゴ専用 |

> **Note:** `Inter` は frontend-design skill により premium context で禁止されている。
> GoRakuDo は日本語とラテン文字の混植時の可読性重視のため `Gen Interface JP` のスタックに完全移行した。

### 3.2 Type Scale

```css
/* Fluid type scale — clamp(min, preferred, max) */
--grkd-text-xs:    clamp(0.75rem,  1.5vw, 0.813rem);   /* 12-13px */
--grkd-text-sm:    clamp(0.813rem, 1.8vw, 0.875rem);   /* 13-14px */
--grkd-text-base:  clamp(0.875rem, 2.0vw, 1rem);       /* 14-16px */
--grkd-text-lg:    clamp(1rem,     2.5vw, 1.125rem);   /* 16-18px */
--grkd-text-xl:    clamp(1.125rem, 3.0vw, 1.375rem);   /* 18-22px */
--grkd-text-2xl:   clamp(1.375rem, 3.5vw, 1.75rem);    /* 22-28px */
--grkd-text-3xl:   clamp(1.75rem,  4.0vw, 2.25rem);    /* 28-36px */
--grkd-text-4xl:   clamp(2.25rem,  5.0vw, 3rem);       /* 36-48px */
--grkd-text-display: clamp(3rem,   6.0vw, 4.5rem);     /* 48-72px */
```

> **Discord Influence:** 大見出し（`--grkd-text-4xl` 以上）は compact な letter-spacing（`--grkd-tracking-tight`）を適用し、ポスターのようなインパクトを出す。Discord の `Abcgintodiscordnord` のコンパクトな印象を、Gen Interface JP の可読性を犠牲にせず再現する。

### 3.3 Weight Scale

| Token | Value | Usage |
|---|---|---|
| `--grkd-font-normal` | 400 | Body text |
| `--grkd-font-medium` | 500 | Subtitles, labels, emphasis |
| `--grkd-font-semibold` | 600 | Section headings, nav items |
| `--grkd-font-bold` | 700 | Page titles, hero headline |

### 3.4 Line Height & Spacing

```css
/* Body */
--grkd-leading-body:    1.6;      /* Orphan prevention baseline */
--grkd-leading-tight:   1.3;      /* Headings */
--grkd-leading-relaxed: 1.75;     /* Long-form reading */

/* Letter Spacing */
--grkd-tracking-tight:   -0.02em; /* Display/H1 */
--grkd-tracking-normal:  -0.01em; /* Body (current value) */
--grkd-tracking-wide:     0.05em; /* Small caps, labels */

/* Max Content Width */
--grkd-prose-max-width:  65ch;
```

### 3.5 Orphan Prevention (既存継続)

```css
p, li {
  orphans: 3;
  widows: 3;
  text-wrap: pretty;
  hyphens: auto;
  hyphenate-limit-chars: 6 3 3;
}
```

---

## 4. Spacing System

### 4.1 Base Unit: 4px (`0.25rem`)

```css
--grkd-space-1:   0.25rem;   /*  4px */
--grkd-space-2:   0.5rem;    /*  8px */
--grkd-space-3:   0.75rem;   /* 12px */
--grkd-space-4:   1rem;      /* 16px */
--grkd-space-5:   1.25rem;   /* 20px */
--grkd-space-6:   1.5rem;    /* 24px */
--grkd-space-8:   2rem;      /* 32px */
--grkd-space-10:  2.5rem;    /* 40px */
--grkd-space-12:  3rem;      /* 48px */
--grkd-space-16:  4rem;      /* 64px */
--grkd-space-20:  5rem;      /* 80px */
--grkd-space-24:  6rem;      /* 96px */
--grkd-space-32:  8rem;      /* 128px */
--grkd-space-hero: 8.125rem; /* 130px — Discord hero vertical spacer */
```

> **Discord Influence:** `--grkd-space-hero` は Hero セクションの見出し〜CTA間の dramatic な垂直スペース。130px のワイドな呼吸感で、cinematic な印象を作る。

### 4.2 Section Spacing

```css
/* Generous vertical padding between major sections (SKILL.md §2.3 mandate) */
--grkd-section-padding-y:  clamp(5rem, 10vw, 8rem);   /* py-20 ~ py-32 */
--grkd-section-gap:        clamp(3rem, 8vw, 6rem);

/* Optical bottom > top adjustment */
--grkd-section-padding-top:    calc(var(--grkd-section-padding-y) * 0.9);
--grkd-section-padding-bottom: calc(var(--grkd-section-padding-y) * 1.1);
```

### 4.3 Component Internal Spacing

```css
--grkd-card-padding:    clamp(1.5rem, 4vw, 2.5rem);  /* p-6 ~ p-10 */
--grkd-card-gap:        var(--grkd-space-4);
--grkd-input-padding-x: var(--grkd-space-4);
--grkd-input-padding-y: var(--grkd-space-3);
```

---

## 5. Border & Radius System

```css
--grkd-radius-sm:   0.25rem;  /*  4px — pills within cards */
--grkd-radius-md:   0.5rem;   /*  8px — buttons, inputs */
--grkd-radius-lg:   0.75rem;  /* 12px — cards, panels */
--grkd-radius-xl:   1rem;     /* 16px — modals, large containers */
--grkd-radius-2xl:  1.25rem;  /* 20px — hero cards */
--grkd-radius-pill: 9999px;   /* Full pill — tags, badges */
```

> **Rule:** Inner elements のradiusは outer container よりタイトにする。
> Card (`radius-lg`) 内の Button は `radius-md`、Tag は `radius-sm` or `radius-pill`。

---

## 6. Layout Rules

### 6.1 Grid System

```css
/* Page containment */
--grkd-container-max: 1400px;          /* max-w-[1400px] mx-auto */
--grkd-content-max:   65ch;            /* Prose content */
--grkd-wide-max:      1200px;          /* Wide content areas */

/* Grid */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
gap: var(--grkd-space-6);
```

### 6.2 Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| `xs` | < 640px | Single column, `px-4` |
| `sm` | >= 640px | Single/double column |
| `md` | >= 768px | Multi-column begins |
| `lg` | >= 1024px | Full desktop layout |
| `xl` | >= 1280px | Wide layout |
| `2xl` | >= 1600px | Ultra-wide |

### 6.3 Constraints

- **Full-height sections:** `min-h-[100dvh]` のみ。`h-screen` は禁止 (iOS Safari)
- **Mobile first:** `md:` 以上でのみマルチカラム。モバイルは必ず single column
- **No horizontal scroll on mobile:** 厳守。はみ出しは critical failure
- **Touch targets:** 最小 44px
- **Anti-3-column:** 3等分カードレイアウトは禁止。Zig-zag、非対称グリッド、masonry を使う

---

## 7. Motion & Interaction

### 7.1 Duration Tokens

```css
--grkd-duration-snappy:  80ms;    /* Active/pressed state */
--grkd-duration-fast:    120ms;   /* Hover, tooltip */
--grkd-duration-normal:  200ms;   /* Panel, accordion */
--grkd-duration-slow:    350ms;   /* Modal, page transition */
--grkd-duration-reveal:  600ms;   /* Scroll entry reveal */
```

### 7.2 Easing Functions

```css
/* Productive: gets out of the way */
--grkd-ease-productive:  cubic-bezier(0.2, 0, 0.38, 0.9);

/* Expressive: calls attention */
--grkd-ease-expressive:  cubic-bezier(0.4, 0.14, 0.3, 1);

/* Spring-like: weighty feel */
--grkd-ease-spring:      cubic-bezier(0.32, 0.72, 0, 1);

/* Out-quart: smooth deceleration */
--grkd-ease-out:         cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### 7.3 Scroll Entry Pattern

```css
/* Elements reveal: translate-y + blur + opacity */
.scroll-reveal {
  opacity: 0;
  transform: translateY(1rem);
  filter: blur(4px);
  transition:
    opacity var(--grkd-duration-reveal) var(--grkd-ease-expressive),
    transform var(--grkd-duration-reveal) var(--grkd-ease-expressive),
    filter var(--grkd-duration-reveal) var(--grkd-ease-expressive);
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
```

### 7.4 Hover & Active Feedback

```css
/* Hover lift */
--grkd-hover-lift:    translateY(-2px);
--grkd-hover-scale:   scale(1.02);

/* Active press */
--grkd-active-press:  translateY(1px) scale(0.98);
```

### 7.5 Stagger Pattern

```css
/* CSS cascade stagger for grid items */
.stagger-item {
  animation-delay: calc(var(--index, 0) * 80ms);
}
```

### 7.6 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Component Patterns

### 8.1 Cards

- Elevation で hierarchy を表現する場合にのみ使用
- Card 内の Card nesting は禁止
- Variable height 許容。全カード同じ高さに揃えなくてよい
- Border: `1px solid var(--grkd-black-700)` — hover で `--grkd-purple-700`
- Background (default): `var(--grkd-black-850)`
- Background (elevated/accent): `var(--grkd-surface-2)` — Discord Dark Pop の indigo surface。カードの種類にメリハリをつけるために使用する
- Background (glass): `var(--grkd-glass-bg)` — Navbar など固定要素のみ
- Padding: `var(--grkd-card-padding)` (clamp)
- Radius: `var(--grkd-radius-lg)`
- Shadow: `var(--grkd-shadow-md)` — hover で `var(--grkd-shadow-lg)`
- Card 同士の間隔: `var(--grkd-section-gap)`

#### 8.1.1 Card Variants

| Variant | Background | Border | Shadow | Usage |
|---|---|---|---|---|
| **Default** | `--grkd-black-850` | `--grkd-black-700` | `--grkd-shadow-sm` | Content cards, article previews |
| **Elevated** | `--grkd-surface-2` | `--grkd-purple-700` | `--grkd-shadow-md` | Feature cards, highlighted content (Discord surface-2 inspired) |
| **Glass** | `--grkd-glass-bg` | `--grkd-glass-border` | none | Overlay cards, modals |

### 8.2 Buttons

Discord Dark Pop のボタンパターンを吸収。primary は白ベース（高コントラスト）、secondary は blurple ベース。

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| **Primary** | `--grkd-black-50` (white) | `--grkd-tertiary` (dark) | none | Main CTA, strongest action — Discord の white filled button |
| **Secondary** | `--grkd-purple-500` (blurple) | `--grkd-black-50` (white) | none | Alternative actions — Discord の blurple filled |
| **Ghost** | transparent | `--grkd-black-200` | none | Tertiary actions, header nav |

- Height: `56px` (desktop), `48px` (mobile)
- Padding: `15px 24px` (Discord の substantial padding)
- Radius: `var(--grkd-radius-lg)` (12px — Discord の medium rounding)
- Hover: `filter: brightness(1.15)` または `--grkd-hover-lift` (translateY(-2px))
- Active: `--grkd-active-press` (translateY(1px) scale(0.98))
- Focus: `outline: 2px solid var(--grkd-blue-400); outline-offset: 2px`
- Disabled: `opacity: 0.5; cursor: not-allowed; filter: none`
- Font: `var(--font-primary)` at `--grkd-text-base` weight `--grkd-font-semibold`

> **Note:** ボタンの形状は medium-rounded を維持。pill shape (`--grkd-radius-pill`) は避け、`12px` で統一。

### 8.3 Navigation

- Navbar: `position: sticky; top: 0` + `backdrop-filter: blur(var(--grkd-glass-blur))`
- Background: `var(--grkd-glass-bg)`
- Height: `70px` (mobile) → `75px` (tablet) → `80px` (desktop)
- Z-index: `var(--z-Navbar-navbar)` (1000)
- Active link: `border-bottom: 2px solid var(--grkd-purple-500)`

### 8.4 Forms

- Label above input
- Input bg: `var(--grkd-black-750)`
- Input border: `1px solid var(--grkd-black-600)` → focus: `var(--grkd-blue-400)`
- Error border: `var(--grkd-error)`
- Helper text: `var(--grkd-text-sm)` in `var(--grkd-black-400)`
- Gap between label/input/helper: `var(--grkd-space-2)`

### 8.5 Links

- Default: `var(--grkd-purple-400)`
- Hover: `var(--grkd-purple-300)` + underline
- Visited: `var(--grkd-purple-500)` (slightly darker)
- Focus: same ring as buttons

### 8.6 Chips (Tags & Badges) — Discord Dark Pop Inspired

小型で装飾的なラベル。カテゴリタグ、ステータスバッジ、フィルターチップに使用。

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| **Default** | `--grkd-surface-2` | `--grkd-black-50` | none | Category tags, filter chips |
| **Accent** | `--grkd-purple-700` | `--grkd-black-50` | none | Active filter, selected state |
| **Outline** | transparent | `--grkd-purple-400` | `1px solid --grkd-purple-700` | Subtle tag |

- Padding: `6px 12px` (compact)
- Radius: `var(--grkd-radius-pill)` (fully rounded — Discord の pill shape)
- Font: `--grkd-text-sm` (14px), weight `--grkd-font-medium`
- Gap between chips: `var(--grkd-space-2)`

### 8.7 Shapes & Elevation

Discord Dark Pop の形状言語を吸収。**フラットでトーナルな奥行き** — shadow ではなく、色のコントラストとレイヤーで階層を表現する。

#### 8.7.1 Shape Language

- **Interactive elements:** Medium-rounded (`var(--grkd-radius-lg)` = 12px) — ボタン、カード
- **Container surfaces:** Subtle rounding (`var(--grkd-radius-md)` = 8px) — 入力欄、パネル
- **Decorative tags:** Fully rounded (`var(--grkd-radius-pill)`) — チップ、バッジ
- **Inner < Outer rule:** Inner elements のradiusは outer container よりタイトにする

#### 8.7.2 Elevation Strategy

| Layer | Method | Tokens |
|---|---|---|
| **Background (deepest)** | Base dark color | `--grkd-black-950` |
| **Section surface** | 1 step lighter | `--grkd-black-900` |
| **Surface layer** | Midnight navy tint | `--grkd-surface` |
| **Card content** | 2 steps lighter | `--grkd-black-850` |
| **Elevated card** | Indigo surface (Discord tonal separation) | `--grkd-surface-2` |
| **Interactive hover** | Lighter + lift transform | `--grkd-black-800` + `--grkd-hover-lift` |

> **Discord Influence:** Shadow に依存せず、背景色の段階的な明度差（L-delta 0.05〜0.08 step）と彩度（Chroma）の変化だけで奥行きを表現する。これにより、フラットながらも豊かな階層感を実現する。

---

## 9. Accessibility (WCAG 2.2 AA)

### 9.1 Contrast Requirements

| Element Type | Minimum Ratio | Check Method |
|---|---|---|
| Body text | 4.5:1 | OKLCH L-delta >= 0.40 |
| Large text (>= 24px or >= 18.66px bold) | 3:1 | OKLCH L-delta >= 0.30 |
| UI components (borders, icons) | 3:1 | OKLCH L-delta >= 0.30 |
| Focus indicators | 3:1 against adjacent colors | — |

### 9.2 Mandatory Checks

- [ ] `prefers-reduced-motion` media query respected (section 7.6)
- [ ] `prefers-contrast: high` alternative styles (borders thicker, shadows removed)
- [ ] Skip-to-content link present
- [ ] All interactive elements keyboard-reachable (Tab, Enter, Space, Escape)
- [ ] Focus indicators visible against all backgrounds
- [ ] Color is not the sole means of conveying information
- [ ] Touch targets >= 44px
- [ ] All images have meaningful `alt` text
- [ ] Form inputs have associated `<label>`
- [ ] Error messages identify the field and describe the issue
- [ ] Modals trap focus and restore on close
- [ ] `scrollbar-gutter: stable` to prevent layout shift

### 9.3 High Contrast Mode

```css
@media (prefers-contrast: high) {
  /* Borders: 2px solid */
  /* Shadows: removed */
  /* Gradients: simplified to solid colors */
  /* Contrast: 7:1 minimum (WCAG AAA) */
  /* Accent chroma: increased for visibility */
}
```

---

## 10. Z-Index Scale

| Layer | Value | Elements |
|---|---|---|
| `base` | 0 | Default flow |
| `docked` | 10 | Cards on hover, TOC |
| `sticky` | 100 | Sticky headers |
| `dropdown` | 200 | Dropdown menus |
| `navbar` | 1000 | Top navigation bar |
| `search-popover` | 1000 | Search overlay |
| `bottom-nav` | 1200 | Mobile bottom nav |
| `overlay` | 1300 | Dim backdrop |
| `modal` | 1400 | Modal dialogs |
| `toast` | 1500 | Toast notifications |

---

## 11. Migration Notes (既存 global.css との差分)

### 11.1 カラートークン変更

| Legacy Token | New Token | Change |
|---|---|---|
| `--token-purple-base: oklch(65% 0.25 280deg)` | `--grkd-purple-400: oklch(0.65 0.22 280)` | Chroma 0.25 → 0.22 (ダーク上での調和) |
| `--token-bg-dark: oklch(5% 0 0deg)` | `--grkd-black-950: oklch(0.05 0.005 270)` | Hue を neutral(0) から tinted(270) へ |
| `--token-gold-base` (Gold 85deg) | 廃止候補 | 70-20-10 で Gold は不要。必要なら semantic `warning` で代替 |
| `--clr-accent` | `--grkd-purple-400` | 名前変更のみ |
| なし (新規) | `--grkd-blue-*` | Royal Blue パレット全体が新規追加 |

### 11.2 フォント変更

**変更:** 既存の Roboto Flex + Noto Sans JP から `Gen Interface JP` への完全移行。ロゴ用の `Yuji Syuku` は継続。

### 11.3 構造的変更

- Opacity calc system (`--opacity-*`) は deprecated 継続。新規コードは使わない
- Shadow system は tinted shadow に統一
- Glassmorphism tokens はプレフィックス `--grkd-glass-*` に改名
- Easing は4種に集約（`productive` / `expressive` / `spring` / `out`）

---

## 12. Forbidden Patterns (Anti-AI-Slop)

frontend-design skill Section 7 準拠:

- **Pure black (#000000):** 禁止。常にオフブラック (L >= 0.05, C > 0)
- **Neon outer glows:** 禁止。inner border か tinted shadow のみ
- **Inter font:** このプロジェクトでは使わない
- **3-column equal cards:** 禁止
- **Generic serif in UI:** ダッシュボード/UI コンテキストでは禁止 (docs本文は許容)
- **`h-screen`:** 禁止。`min-h-[100dvh]` のみ
- **`calc()` percentage hacks:** 禁止。CSS Grid を使う
- **Emoji in code/markup:** 禁止。astro-icon を使う
- **Lorem ipsum:** 禁止。リアルなドラフトコピーを書く
- **Unsplash links:** 禁止。`picsum.photos` か SVG placeholder
- **`animate: linear`:** 禁止。カスタムeasing必須
- **Animating `top/left/width/height`:** 禁止。`transform` と `opacity` のみ
- **`backdrop-blur` on scroll containers:** 禁止。fixed/sticky 要素のみ

---

## Appendix A: CSS Custom Property Naming Convention

```
--grkd-{category}-{name}-{variant}

Examples:
  --grkd-black-850       (color, neutral scale)
  --grkd-purple-400      (color, brand scale)
  --grkd-blue-500        (color, CTA scale)
  --grkd-space-6         (spacing)
  --grkd-radius-lg       (border-radius)
  --grkd-shadow-md       (elevation)
  --grkd-duration-fast   (animation)
  --grkd-ease-spring     (easing)
  --grkd-glass-bg        (glassmorphism)
  --grkd-text-xl         (typography size)
  --grkd-font-semibold   (typography weight)
```

`grkd` prefix は GoRakuDo の略。他のライブラリとの衝突を防ぐ。

---

## Appendix D: Discord Dark Pop OKLCH — Absorbed Influences

> 本デザインシステムは、[Discord Dark Pop OKLCH](https://github.com/discord/discord-design-tokens) の設計哲学・カラー値・コンポーネントパターンを部分的に吸収している。

### D.1 吸収した要素

| 要素 | Discord の値 | GoRakuDo での適用 | 根拠 |
|---|---|---|---|
| **Surface 層** | `oklch(17.80% 0.058 275.81)` | `--grkd-surface` として新規追加 | 背景のレイヤー階層を強化。midnight navy のトーンで「Night Library」感を増幅 |
| **Surface-2 層** | `oklch(30.96% 0.150 271.29)` | `--grkd-surface-2` として新規追加 | カードのエレベーテッドバリアントに使用。紫がかった indigo で視覚的トーナル分離 |
| **Muted Text** | `oklch(85.99% 0.071 282.16)` | `--grkd-muted` として新規追加 | セカンダリテキストより明るく、ラベンダーがかった色合いで柔らかい印象を追加 |
| **Primary Blurple** | `oklch(57.74% 0.209 273.85)` | `--grkd-purple-500` の Hue を 273deg に調整 | より鮮やかでモダンなブランドカラーに。Discord の「遊び心のあるエネルギッシュさ」を注入 |
| **Button Primary** | White filled bg + dark text | 既存の Blue CTA を白ベースに変更 | 最強の CTA は白背景＋暗色テキスト。Discord パターンを採用し、視覚的インパクトを最大化 |
| **Button Secondary** | Blurple filled bg + white text | 既存の Secondary を blurple ベースに変更 | プライマリとセカンダリの明確な役割分担。背景色を塗りで区別 |
| **Chips** | Fully rounded, compact pills | 新規コンポーネントとして追加 | カテゴリタグ・フィルターに使用。Discord の pill 形状を採用 |
| **Shapes** | Medium-rounded (12px), no pill for buttons | Card radius を 12px に統一 | フレンドリーで構造的な印象。親しみやすさとプロフェッショナルさのバランス |
| **Elevation** | Flat/surface — shadow minimal | トーナルな奥行き戦略を明確化 | Shadow ではなく、背景色の明度差と彩度で階層を表現 |
| **Spacing Hero** | 130px vertical spacer | `--grkd-space-hero` として追加 | Hero セクションの cinematic な呼吸感を実現 |

### D.2 あえて吸収しなかった要素

| 要素 | Discord の値 | 除外理由 |
|---|---|---|
| **Font family** | `Abcgintodiscordnord`, `Ggsans` | Discord 専用プロプライエタリフォント。GoRakuDo は `Gen Interface JP` を継続 |
| **Typography 3-voice system** | Display / Body / Label の3系統 | GoRakuDo は和文混植のため、よりシンプルな2系統（UI + Serif）を維持 |
| **Chroma cap removal** | 一部トークンで Chroma > 0.25 | ダークモードでの彩度暴走防止のため、Chroma 0.22 キャップは維持 |
| **Pure black** | 使用していない | 元から禁止。問題なし |
| **Heavy shadows / glossy** | 使用していない | トーナルな奥行き戦略と一致。問題なし |

### D.3 マイグレーションステータス

- [x] Brand Identity Tone の更新（抑制 + 遊び心）
- [x] Dominant palette に surface / surface-2 / muted トークン追加
- [x] Purple palette の Hue を 273deg に調整
- [x] Blue palette の Chroma を 0.12~0.22 に引き上げ
- [x] Button variants の redesign（primary=white, secondary=blurple）
- [x] Card elevated variant に surface-2 追加
- [x] Chips コンポーネント追加
- [x] Shapes & Elevation 戦略の明確化
- [x] Spacing hero トークン追加
- [ ] **global.css へのトークン反映（別タスク）**
- [ ] **Figma / デザインファイルの更新（別タスク）**

---

## Appendix B: Token Alias Layer (Semantic Mapping)

```css
/* Semantic aliases — swap these for theming */
--grkd-color-bg-page:        var(--grkd-black-950);
--grkd-color-bg-section:     var(--grkd-black-900);
--grkd-color-bg-card:        var(--grkd-black-850);
--grkd-color-bg-elevated:    var(--grkd-black-800);
--grkd-color-bg-input:       var(--grkd-black-750);

--grkd-color-text-primary:   var(--grkd-black-100);
--grkd-color-text-secondary: var(--grkd-black-300);
--grkd-color-text-muted:     var(--grkd-black-400);
--grkd-color-text-placeholder: var(--grkd-black-500);

--grkd-color-border-subtle:  var(--grkd-black-700);
--grkd-color-border-default: var(--grkd-black-600);

--grkd-color-accent:         var(--grkd-purple-400);
--grkd-color-accent-hover:   var(--grkd-purple-300);
--grkd-color-accent-active:  var(--grkd-purple-600);

--grkd-color-cta:            var(--grkd-blue-500);
--grkd-color-cta-hover:      var(--grkd-blue-600);
--grkd-color-cta-active:     var(--grkd-blue-700);

--grkd-color-focus-ring:     var(--grkd-blue-400);
--grkd-color-scrollbar:      var(--grkd-purple-500);
```

---

## Appendix C: File Map

| File | Role | Status |
|---|---|---|
| `src/styles/global.css` | Design tokens, base layer, components, utilities | 要改修 |
| `src/styles/fonts.css` | Fontsource imports | 変更なし |
| `src/styles/typography.css` | Extended type rules | 要確認 |
| `src/styles/mobile-performance.css` | Mobile GPU optimizations | 変更なし |
| `tailwind.config.mjs` | TW v4 plugin config (typography) | 要改修 |
| `DESIGN.md` | This document | 更新済 (v2.1.0) |
