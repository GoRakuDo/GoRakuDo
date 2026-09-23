# Coding Standards - GoRakuDo

**CRITICAL DOCUMENT:** これはGoRakuDoプロジェクトにおける実際のコーディング規約と実装パターンを定義するドキュメントです。

**Last Updated**: 2025-10-13  
**Version**: 2.0  
**Status**: ✅ Active & Enforced

## Overview

このドキュメントは、GoRakuDoプロジェクトで使用される実際のコーディング規約とパターンを定義します。開発者がこのコードベースで作業する際に従うべき実際のルールと慣習です。

**参照**: `astro-development-patterns.md` - Astro特有のパターンとアーキテクチャ決定

## Table of Contents

### 基本原則
1. [General Principles](#general-principles)
2. [Minimalist Code Principles](#minimalist-code-principles)
3. [File Organization](#file-organization)
4. [Naming Conventions](#naming-conventions)

### 言語別規約
5. [Code Style](#code-style)
6. [TypeScript Standards](#typescript-standards)
7. [Astro Component Standards](#astro-component-standards)
8. [CSS Standards](#css-standards)

### 品質基準
9. [Performance Standards](#performance-standards)
10. [Accessibility Standards](#accessibility-standards)
11. [SEO Standards](#seo-standards)
12. [Comment & Documentation](#comment--documentation)

### ツールと設定
13. [Code Review Checklist](#code-review-checklist)
14. [Tools and Configuration](#tools-and-configuration)
15. [Conclusion](#conclusion)

## General Principles

### 1. DRY (Don't Repeat Yourself - 繰り返しを避ける)
- **MANDATORY**: コードの重複を避けます
- 共通の機能は再利用可能な関数やクラスに抽象化します
- 同様のロジックが3回以上出現する場合は、必ず共通化を検討します
- 設定値や定数は一箇所で管理し、複数箇所でハードコーディングしないでください

### 2. KISS (Keep It Simple, Stupid - シンプルにしておけ)
- **MANDATORY**: 複雑な解決策よりもシンプルな解決策を優先します
- 過度に抽象化したり、パターンを適用しすぎないでください
- 読みやすく理解しやすいコードを書いてください
- 複雑なロジックが必要な場合は、必ずコメントで理由を説明してください

### 3. Consistency Over Perfection
- Follow established patterns in the codebase
- Maintain consistency across similar components
- Prefer readability over cleverness

### 4. Progressive Enhancement
- Ensure core functionality works without JavaScript
- Enhance with interactive features progressively
- Maintain accessibility standards

### 5. Performance First
- Optimize for Core Web Vitals
- Minimize bundle size
- Implement lazy loading where appropriate

### 6. Modern JavaScript Standards
- **MANDATORY**: Use ES Modules (ESM) for all JavaScript files
- **MANDATORY**: Use Strict TypeScript mode for all TypeScript files
- No CommonJS (`require`/`module.exports`) allowed
- Always use `import`/`export` statements

### 7. Test Artifact Cleanup
- **MANDATORY**: Clean up redundant test artifacts immediately after completing work
- Remove temporary test files, mock data, and debug code
- Ensure test environment is clean before committing
- No test artifacts should remain in production code

---

## Minimalist Code Principles

### CRITICAL: Evaluate Every Implementation Against Minimalism

**MANDATORY**: すべての実装を以下のMinimalist原則に照らして評価してください。

### The 5-Line Rule

**Directive:** 関数は**理想的に5行以内**に収めることを目指します。

#### ✅ Good Example

```typescript
// ✅ 3行で完結
const createImageUrl = (siteUrl: string, path: string): string =>
  `${siteUrl.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

// ✅ 5行以内
const validateAndFormat = (email: string): string | null => {
  if (!EMAIL_REGEX.test(email)) return null;
  return email.toLowerCase().trim();
};
```

#### ⚠️ Acceptable Example

```typescript
// ⚠️ 8行 - 複雑なロジックのため許容
const createFullImageUrl = (imagePath?: string, forOgImage = false): string => {
  if (!imagePath) imagePath = seoConfig.site.defaultImage;
  if (forOgImage) return createFullImageUrl(imagePath);
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return joinUrl(getSiteUrl(), imagePath);
  // bare ID（旧Cloudinary public_id）は廃止済み → デフォルト画像にフォールバック
  return createFullImageUrl(seoConfig.site.defaultImage);
};
```

### The Simplicity Question

実装前に必ず自問してください：

```
1. より簡潔な方法はないか？
2. より効率的な方法はないか？
3. 複雑さを削減できないか？
4. 5行以内に収められないか？
```

### Minimalist Design Patterns

#### Pattern 1: 単一責任の関数

```typescript
// ❌ Bad - 1つの関数が複数の責任
function processUserDataAndSendEmail(user: User) {
  const validated = validateUser(user);
  const formatted = formatUserData(validated);
  const saved = saveToDatabase(formatted);
  sendWelcomeEmail(saved);
  return saved;
}

// ✅ Good - 各関数が単一の責任
const validate = (user: User) => validateUser(user);
const format = (user: User) => formatUserData(user);
const save = (user: User) => saveToDatabase(user);
const sendEmail = (user: User) => sendWelcomeEmail(user);

// Usage: パイプライン的に使用
const process = (user: User) => sendEmail(save(format(validate(user))));
```

#### Pattern 2: デフォルト値の活用

```typescript
// ❌ Bad - 条件分岐が多い
function getTitle(title?: string): string {
  if (title === undefined) {
    return 'Default Title';
  }
  if (title === '') {
    return 'Default Title';
  }
  return title;
}

// ✅ Good - 1行で完結
const getTitle = (title?: string): string => title || 'Default Title';
```

#### Pattern 3: オブジェクト展開の活用

```typescript
// ❌ Bad - 個別に設定
const seoData = {
  title: config.seoData.title,
  description: config.seoData.description,
  author: config.seoData.author,
  lang: config.seoData.lang,
  keywords: config.seoData.keywords,
};

// ✅ Good - スプレッド構文で1行
const seoData = { ...config.seoData, lang: config.seoData.lang as 'id' | 'ja' };
```

### Minimalist Refactoring Checklist

実装後に以下をチェック：

- [ ] 関数は5行以内か？（理想）
- [ ] 条件分岐は最小限か？
- [ ] ネストは2レベル以内か？
- [ ] 変数名は明確で短いか？
- [ ] 重複コードはないか？
- [ ] より簡潔な代替案はないか？

**Rationale:** シンプルなコードは読みやすく、保守しやすく、バグが少なくなります。5行ルールは目標であり、複雑なロジックでは柔軟に対応します。

## DRY & KISS Principles in Practice

### DRY Principle Examples

#### ❌ Bad - Code Duplication
```typescript
// Multiple functions with similar logic
function validateUserEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateAdminEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateGuestEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

#### ✅ Good - DRY Principle Applied
```typescript
// Single, reusable validation function
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

// Use the same function everywhere
const isUserEmailValid = validateEmail(userEmail);
const isAdminEmailValid = validateEmail(adminEmail);
const isGuestEmailValid = validateEmail(guestEmail);
```

#### ❌ Bad - Hardcoded Values
```typescript
// Values repeated throughout the code
function calculateTax(amount: number): number {
  return amount * 0.08; // 8% tax rate
}

function calculateDiscount(amount: number): number {
  return amount * 0.15; // 15% discount
}

function calculateTip(amount: number): number {
  return amount * 0.18; // 18% tip
}
```

#### ✅ Good - Centralized Constants
```typescript
// Constants defined in one place
const TAX_RATE = 0.08;
const DISCOUNT_RATE = 0.15;
const TIP_RATE = 0.18;

function calculateTax(amount: number): number {
  return amount * TAX_RATE;
}

function calculateDiscount(amount: number): number {
  return amount * DISCOUNT_RATE;
}

function calculateTip(amount: number): number {
  return amount * TIP_RATE;
}
```

### KISS Principle Examples

#### ❌ Bad - Over-Engineering
```typescript
// Unnecessarily complex abstraction
interface ValidationStrategy<T> {
  validate(data: T): ValidationResult;
}

class EmailValidationStrategy implements ValidationStrategy<string> {
  validate(email: string): ValidationResult {
    // Complex validation logic
    return this.performAdvancedValidation(email);
  }
  
  private performAdvancedValidation(email: string): ValidationResult {
    // Overly complex validation
    return this.validateDomain(email) && this.validateFormat(email);
  }
}

// Usage requires complex setup
const validator = new EmailValidationStrategy();
const result = validator.validate(userEmail);
```

#### ✅ Good - Simple and Direct
```typescript
// Simple, direct validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Usage is straightforward
const isValid = validateEmail(userEmail);
```

#### ❌ Bad - Complex State Management
```typescript
// Overly complex state management
class UserStateManager {
  private state: Map<string, any> = new Map();
  private observers: Set<Function> = new Set();
  
  setState(key: string, value: any): void {
    this.state.set(key, value);
    this.notifyObservers(key, value);
  }
  
  private notifyObservers(key: string, value: any): void {
    this.observers.forEach(observer => observer(key, value));
  }
  
  subscribe(observer: Function): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }
}
```

#### ✅ Good - Simple State Management
```typescript
// Simple state management with Vue reactivity
import { ref, computed } from 'vue';

const userState = ref({
  name: '',
  email: '',
  isLoggedIn: false
});

const userName = computed(() => userState.value.name);
const userEmail = computed(() => userState.value.email);
```

### When to Apply DRY vs KISS

#### Apply DRY When:
- **3回以上**同じロジックが出現する場合
- 設定値や定数が複数箇所で使用される場合
- 同様のデータ処理ロジックが複数箇所にある場合
- 共通のUIコンポーネントパターンがある場合

#### Apply KISS When:
- シンプルな解決策で十分な場合
- 過度な抽象化が可読性を損なう場合
- パフォーマンスが重要な場合
- チームの理解レベルに合わせる必要がある場合

#### Balance Both Principles:
```typescript
// Good balance: DRY for common patterns, KISS for implementation
const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{3}-\d{3}-\d{4}$/,
  zipCode: /^\d{5}(-\d{4})?$/
};

// Simple validation function (KISS)
function validateField(value: string, rule: RegExp): boolean {
  return rule.test(value);
}

// Reusable validation (DRY)
function validateEmail(email: string): boolean {
  return validateField(email, VALIDATION_RULES.email);
}

function validatePhone(phone: string): boolean {
  return validateField(phone, VALIDATION_RULES.phone);
}
```

## File Organization

### Directory Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Astro pages and routes
├── layouts/       # Page layouts and templates
├── content/       # Markdown content and data
├── utils/         # Utility functions and helpers (organized by category)
├── scripts/       # Client-side scripts
├── styles/        # Global styles and CSS modules
├── types/         # TypeScript type definitions
├── data/          # Static data and configurations
└── assets/        # Images, fonts, and static assets
```

### Utils Organization (GoRakuDo Specific)
The `utils/` folder is organized into logical subfolders for better maintainability:

```
utils/
├── ai-content/             # AI-powered content analysis and metadata
├── performance/            # Performance optimization and monitoring
├── error-handling/         # Error handling and reporting (removed)
├── content/                # Content management utilities
├── search/                 # Search functionality
├── security/               # Security utilities
└── content-structure/      # Content structure utilities
```

**Why this matters**: Think of it like organizing your school backpack - you put pencils in one pocket, books in another, and snacks in a third. This makes it easy to find what you need quickly.

### File Naming Conventions
- **Components**: PascalCase (e.g., `Navbar.astro`, `ImageSlideshow.vue`)
- **Pages**: kebab-case (e.g., `tools.astro`)
- **Utilities**: camelCase (e.g., `content-analysis.ts`)
- **Types**: camelCase with `.ts` extension (e.g., `types.ts`)

## Naming Conventions

### What Are Naming Conventions?
Naming conventions are like grammar rules for code. Just like how we capitalize the first letter of a sentence, we have rules for naming things in code to make it easier to read and understand.

### Variables and Functions (camelCase)
```typescript
// ✅ Good - Like writing a sentence, start with lowercase, then capitalize each word
const userSettings = getUserSettings();
const isAuthenticated = checkAuthStatus();
const handleClick = () => { /* ... */ };

// ❌ Bad - Using underscores is like writing_with_spaces_instead_of_capital_letters
const user_settings = getUserSettings();
const is_authenticated = checkAuthStatus();
const handle_click = () => { /* ... */ };
```

**Why camelCase?**: It's like writing a compound word - "userSettings" is easier to read than "user_settings" because it flows better.

### Constants (UPPER_SNAKE_CASE)
```typescript
// ✅ Good - ALL CAPS for things that never change
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// ❌ Bad - Regular variables for things that should be constants
const apiBaseUrl = 'https://api.example.com';
const maxRetryAttempts = 3;
```

**Why UPPER_SNAKE_CASE?**: Think of constants like street signs - they're always in ALL CAPS because they're important and never change.

### CSS Classes (GoRakuDo Specific)
```css
/* ✅ Good - Using custom CSS variables with clr- prefix */
.navbar {
  color: var(--clr-purple);
  background: var(--clr-accent-dark);
}

/* ✅ Good - Tailwind utilities */
.bg-primary-500 {}
.text-secondary-600 {}
```

**Why clr- prefix?**: It's like labeling your art supplies - "clr-accent" tells us this is a color (clr) and it's the accent color.

## Code Style

### JavaScript/TypeScript

#### ES Modules (MANDATORY)
```typescript
// ✅ Good - ES Modules (ESM)
import { defineConfig } from 'astro/config';
import type { User } from '../types/user';
export { default as Navbar } from '../components/Navbar.astro';

// ❌ Bad - CommonJS (NOT ALLOWED)
const { defineConfig } = require('astro/config');
const User = require('../types/user');
module.exports = Navbar;
```

#### Indentation
- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Use single quotes for strings

```typescript
// ✅ Good
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);
}

// ❌ Bad
function calculateTotal(items:Item[]):number{
return items.reduce((sum,item)=>{
return sum+item.price
},0)
}
```

#### Imports
```typescript
// ✅ Good - Grouped and ordered (like organizing your school supplies)
// External libraries (things we download from the internet)
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

// Internal modules (things we made ourselves)
import { Navbar } from '../components/Navbar.astro';
import { formatDate } from '../utils/date-helpers';

// Types (like labels that tell us what something is)
import type { User } from '../types/user';
```

**Why group imports?**: It's like organizing your desk - you put all your pens together, all your books together, and all your papers together. This makes it easy to find what you need.

---

## Astro Component Standards

### Principle: Structured, Type-Safe, Minimalist

**Directive:** すべてのAstroコンポーネントは一貫した構造に従い、型安全性を確保し、ミニマリズムを実践します。

### Standard Component Structure

```astro
---
// ========== IMPORTS ==========
import Layout from '../layouts/Layout.astro';
import UnifiedSEO from '../components/common/UnifiedSEO.astro';
import { getCollection } from 'astro:content';

// ========== TYPE DEFINITIONS ==========
export interface Props {
  title: string;
  description?: string;
  lang?: 'id' | 'ja';
}

// ========== PROPS DESTRUCTURING ==========
const {
  title,
  description = 'Default description',
  lang = 'id',
} = Astro.props;

// ========== DATA FETCHING ==========
const posts = await getCollection('docs', ({ data }) => data.status === 'published');

// ========== UTILITY FUNCTIONS ==========
const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID');
---

<!-- ========== TEMPLATE ========== -->
<Layout {title}>
  <main>
    <h1>{title}</h1>
    <p>{description}</p>
  </main>
</Layout>

<!-- ========== STYLES ========== -->
<style>
  /* Scoped styles */
  main {
    padding: clamp(1rem, 3vw, 2rem);
  }
</style>

<!-- ========== SCRIPTS ========== -->
<script is:inline>
  // Minimal client-side logic
</script>
```

### Section Headers (MANDATORY)

すべてのAstroコンポーネントで以下のセクションヘッダーを使用：

```typescript
// ========== IMPORTS ==========
// ========== TYPE DEFINITIONS ==========
// ========== PROPS DESTRUCTURING ==========
// ========== DATA FETCHING ==========
// ========== UTILITY FUNCTIONS ==========
// ========== CONFIGURATION ==========
```

```html
<!-- ========== TEMPLATE ========== -->
<!-- ========== STYLES ========== -->
<!-- ========== SCRIPTS ========== -->
```

### Props Interface Pattern

```typescript
// ✅ Good - Exported interface for reusability
export interface Props {
  title: string;
  description?: string;
  lang?: 'id' | 'ja';  // Literal types（リテラル型）
  tags?: string[];
  publishedDate?: string;
}

// ✅ Good - Type reuse from other components
import type { Props as UnifiedSEOProps } from '../components/common/UnifiedSEO.astro';

interface LayoutProps {
  breadcrumbSchema?: UnifiedSEOProps['breadcrumbSchema'];
  faqSchema?: UnifiedSEOProps['faqSchema'];
}
```

### Data Fetching Pattern

```typescript
// ✅ Good - Content Collections（型安全）
import { getCollection, getEntry } from 'astro:content';

const docs = await getCollection('docs', ({ data }) => data.status === 'published');
const post = await getEntry('docs', 'getting-started');

// ❌ Bad - Astro.glob()（型安全性なし）
const posts = await Astro.glob('../content/docs/*.mdx');
```

### Vue Components

#### Component Structure
```vue
<template>
  <!-- Template content -->
  <div class="component">
    <slot />
  </div>
</template>

<script setup lang="ts">
// 1. Imports
import { ref, onMounted } from 'vue';

// 2. Props
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

// 3. Emits
const emit = defineEmits<{
  update: [value: string];
}>();

// 4. Reactive data
const isLoading = ref(false);

// 5. Methods
const handleClick = () => {
  emit('update', 'new value');
};

// 6. Lifecycle
onMounted(() => {
  // Component mounted logic
});
</script>

<style scoped>
.component {
  /* Scoped styles */
}
</style>
```

## TypeScript Standards

### What is TypeScript?
TypeScript is like adding labels to everything in your code. Instead of just saying "this is a box," you say "this is a box that contains books." This helps catch mistakes before they happen.

### Strict TypeScript Mode (MANDATORY)
GoRakuDo requires **Strict TypeScript mode** for all TypeScript files. This means:
- `strict: true` in tsconfig.json
- No implicit `any` types
- Strict null checks
- Strict function types
- No implicit returns
- Strict property initialization

### Type Definitions (GoRakuDo Style)
```typescript
// ✅ Good - Explicit types with detailed comments
interface User {
  id: string;           // Unique identifier (like a student ID)
  name: string;         // User's full name
  email: string;        // Email address for contact
  createdAt: Date;      // When the user account was created
}

// ✅ Good - Union types (like a multiple choice question)
type Status = 'loading' | 'success' | 'error';

// ✅ Good - Generic types (like a reusable template)
interface ApiResponse<T> {
  data: T;              // The actual data (could be anything)
  status: number;       // HTTP status code (200, 404, etc.)
  message: string;      // Human-readable message
}
```

### Type Safety (GoRakuDo Patterns)
```typescript
// ✅ Good - Type guards (like checking if something is what we expect)
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

// ✅ Good - Strict null checks (always check if something exists)
function processUser(user: User | null): string {
  if (!user) {
    return 'No user found';
  }
  return user.name;
}

// ✅ Good - Explicit return types (required in strict mode)
function getUserById(id: string): User | null {
  // Implementation
}

// ✅ Good - No implicit any (strict mode requirement)
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return 'Invalid data';
}
```

**Why TypeScript?**: It's like having a spell-checker for your code - it catches mistakes before you even run the program.

**Why Strict Mode?**: It's like having an even better spell-checker that catches more types of mistakes, making your code more reliable and easier to maintain.

---

## CSS Standards

### Principle: OKLCH Color Space + Design Tokens + Responsive with clamp()

**Directive:** すべてのスタイリングはDesign Tokensシステム、OKLCHカラースペース、clamp()によるレスポンシブ値を使用します。

### Design Tokens System

**場所**: `src/styles/global.css`

#### Token Categories

```css
:root {
  /* ===== DESIGN TOKENS & CSS VARIABLES ===== */
  color-scheme: dark !important;

  /* 1. BASE COLOR TOKENS - 頻繁に使用される基本値 */
  --token-white-base: oklch(95% 0.005 285deg);
  --token-black-base: oklch(20% 0.005 285deg);
  --token-purple-base: oklch(65% 0.25 280deg);
  --token-gold-base: oklch(75% 0.12 85deg);

  /* 2. BACKGROUND TOKENS */
  --token-bg-dark: oklch(5% 0 0deg);
  --token-bg-content: oklch(8% 0.01 270deg);
  --token-bg-card: oklch(20% 0.01 270deg);

  /* 3. TEXT TOKENS */
  --token-text-secondary: oklch(80% 0 0deg);
  --token-text-muted: oklch(65% 0 0deg);

  /* 4. ACCENT TOKENS */
  --token-accent-dark: oklch(60% 0.25 280deg);
  --token-accent-foreground: oklch(98% 0.002 270deg);

  /* 5. SEMANTIC COLORS（トークンから派生） */
  --clr-purple: var(--token-purple-base);
  --clr-accent: var(--token-purple-base);
  --clr-text-primary: var(--token-white-base);
  --clr-text-secondary: var(--token-text-secondary);
  --clr-bg-primary: var(--token-bg-dark);
}
```

### OKLCH Color System

**Directive:** すべての色はOKLCH形式で定義します。`oklch(L C H / alpha)`

#### OKLCH Syntax

```css
/* 基本形式 */
oklch(L% C H)
  L: Lightness (0-100%)
  C: Chroma (0-0.4)
  H: Hue (0-360deg)

/* 透明度付き */
oklch(L% C H / alpha)
oklch(from var(--base-color) l c h / 0.5)
```

#### ✅ Good Examples

```css
/* ✅ 静的OKLCH */
.element {
  background: oklch(65% 0.25 280deg);  /* 紫 */
  color: oklch(95% 0.005 285deg);      /* 白 */
}

/* ✅ トークンベース（推奨） */
.element {
  background: var(--token-purple-base);
  color: var(--token-white-base);
}

/* ✅ 動的透明度（oklch from） */
.element {
  background: oklch(from var(--token-bg-card) l c h / 0.5);  /* 50%透明 */
  border: 2px solid oklch(from var(--token-purple-base) l c h / 0.3);
}
```

#### ❌ Bad Examples

```css
/* ❌ HEX色（OKLCHを使用すること） */
.element {
  background: #8B5DFF;
  color: #FFFFFF;
}

/* ❌ RGB/RGBA（OKLCHを使用すること） */
.element {
  background: rgb(139, 93, 255);
  color: rgba(255, 255, 255, 0.5);
}
```

### Responsive Design with clamp()

**Directive:** メディアクエリの代わりにfluid `clamp()` 値を使用します。

#### clamp() Pattern

```css
/* ✅ Good - Fluid responsive values */
:root {
  --card-padding: clamp(1rem, 2vw, 1.5rem);
  --grid-gap: clamp(1rem, 3vw, 2rem);
  --title-font: clamp(1.5rem, 4vw, 2.5rem);
}

.card {
  padding: var(--card-padding);
  gap: var(--grid-gap);
  font-size: var(--title-font);
}

/* 削減効果: メディアクエリ100行 → 3行（97%削減） */
```

#### ❌ Bad - Multiple Media Queries

```css
/* ❌ Bad - メディアクエリの乱用 */
.card {
  padding: 1rem;
}
@media (min-width: 640px) {
  .card { padding: 1.25rem; }
}
@media (min-width: 768px) {
  .card { padding: 1.35rem; }
}
@media (min-width: 1024px) {
  .card { padding: 1.5rem; }
}

/* ↑ 13行 → ↓ 1行 */

/* ✅ Good */
.card {
  padding: clamp(1rem, 2vw, 1.5rem);
}
```

### Tailwind Usage

```html
<!-- ✅ Good - Semantic class grouping -->
<div class="
  flex items-center justify-between
  p-4 bg-primary/20 rounded-lg
  hover:bg-primary/30 transition-colors
">
  <!-- Content -->
</div>

<!-- ❌ Bad - Inline styles -->
<div style="display: flex; padding: 1rem; background: rgba(139,93,255,0.2);">
  <!-- Content -->
</div>
```

### Opacity System

**Directive:** 不透明度は計算可能なシステムを使用します。

```css
:root {
  --opacity-step: 0.05;
  --opacity-step-small: 0.02;
  --opacity-step-large: 0.1;

  /* 計算値 */
  --opacity-05: var(--opacity-step);                    /* 0.05 */
  --opacity-10: calc(var(--opacity-step) * 2);          /* 0.1 */
  --opacity-50: calc(var(--opacity-step) * 10);         /* 0.5 */
}

/* 使用例 */
.overlay {
  background: oklch(from var(--token-black-base) l c h / var(--opacity-50));
}
```

**Rationale:** OKLCHは知覚的に均一な色空間を提供し、clamp()はメディアクエリを削減してメンテナンス性を向上させます。

### CSS Selector Specificity & Ordering (MANDATORY)

**Directive:** セレクターは特異性の**昇順**（低い→高い）に配置し、Stylelintの`no-descending-specificity`ルールに準拠します。

#### 特異性の計算

CSS特異性は`(インラインスタイル, ID, クラス/属性/疑似クラス, 要素)`の4つの値で表されます。

```css
/* 特異性の例 */
.button                                    /* (0,0,1,0) - 低い */
.menu .button                              /* (0,0,2,0) - 中 */
.menu-overlay-content.view-grid .button    /* (0,0,3,0) - 高い */
```

#### The Ascending Specificity Rule

**CRITICAL**: より一般的なセレクター（低い特異性）を**先に**、より具体的なセレクター（高い特異性）を**後に**配置すること。

```css
/* ✅ Good - 昇順（低→高） */
.menu-overlay-divider {
  width: 100%;
  margin: 0.5rem 0;
}

.menu-overlay-content.view-grid .menu-overlay-divider {
  grid-column: 1 / -1;
  margin: 0.25rem 0;
}
```

```css
/* ❌ Bad - 降順（高→低）Stylelintエラー */
.menu-overlay-content.view-grid .menu-overlay-divider {
  grid-column: 1 / -1;
}

.menu-overlay-divider {  /* ← エラー: 前のセレクターより低い特異性 */
  width: 100%;
}
```

#### 特異性順序テーブル

| セレクター | 特異性 | 配置順序 | 例 |
|---|---|---|---|
| `.element` | `(0,0,1,0)` | 1番目（先） | `.button` |
| `.parent .element` | `(0,0,2,0)` | 2番目 | `.nav .button` |
| `.parent.modifier .element` | `(0,0,3,0)` | 3番目（後） | `.nav.active .button` |

#### なぜこの順序が重要なのか

**CSSのカスケード原則**:
1. CSSは上から下へ評価される
2. 同じ特異性なら、後の定義が優先される
3. より具体的なセレクターが後にあれば、意図通りにオーバーライドできる

**視覚的説明**:
```
CSS評価フロー
    ↓
.menu-overlay-divider { margin: 0.5rem; }  ← 一般的（すべてに適用）
    ↓
.menu-overlay-content.view-grid .menu-overlay-divider { margin: 0.25rem; }
    ↓                                      ← 具体的（view-grid時のみオーバーライド）
最終的な適用値が決定
```

#### 実践的な修正例

**エラーメッセージ**:
```
✖ Expected selector ".menu-overlay-divider" to come before selector 
  ".menu-overlay-content.view-grid .menu-overlay-divider" 
  no-descending-specificity
```

**修正手順（3分で完了）**:

1. **特異性を計算する**（30秒）
   ```
   .menu-overlay-divider                                  = (0,0,1,0)
   .menu-overlay-content.view-grid .menu-overlay-divider = (0,0,3,0)
   ```

2. **順序を入れ替える**（2分）
   - 一般的なセレクター（0,0,1,0）を先に移動
   - 具体的なセレクター（0,0,3,0）を後に配置

3. **検証する**（10秒）
   ```bash
   npm run stylelint
   # または
   read_lints(['src/components/...'])
   ```

#### 特異性の高さの判断基準

```css
/* 特異性の高さ = クラス数 + ネストの深さ */

/* 低い（先に配置） */
.item { }                    /* クラス1個 */
.container .item { }         /* クラス2個 */

/* 高い（後に配置） */
.wrapper .container .item { }           /* クラス3個 */
.container.active .item { }             /* クラス3個 */
.wrapper .container.active .item { }    /* クラス4個 */
```

#### ベストプラクティス

1. **クラス数が少ない → 先**
2. **クラス数が多い → 後**
3. **ネストが浅い → 先**
4. **ネストが深い → 後**
5. **疑似クラス（:hover, :active）→ 後**
6. **モディファイア（.is-active, .view-grid）→ 後**

#### 疑似クラスとモディファイアの順序

```css
/* ✅ Good - 正しい順序 */
.button { }                    /* ベース（先） */
.button:hover { }              /* 疑似クラス（中） */
.button:active { }             /* 疑似クラス（中） */
.container.active .button { }  /* モディファイア（後） */
```

#### ネストされた子要素を持つ親モディファイアの配置

**重要**: 親モディファイア（`.nav-btn--active`）内に子要素のネストセレクターがある場合、親モディファイアブロック全体をベース子要素セレクターの**後**に配置すること。

```css
/* ✅ Good - ベース要素を先に、親モディファイアを後に */

/* 1. ベースアイコン (0,0,1,0) - 先 */
.nav-btn__icon {
  display: flex;
  margin-bottom: 0.375rem;
}

/* 2. ベースラベル (0,0,1,0) - 先 */
.nav-btn__label {
  font-size: 0.75rem;
  color: oklch(98% 0.005 50deg);
}

/* 3. 親モディファイア全体 (0,0,2,0) - 後 */
.nav-btn--active {
  box-shadow: 0 3px 12px oklch(0% 0 0deg / 0.06);
  
  /* ネストされた子要素 */
  .nav-btn__icon {    /* 特異性: (0,0,2,0) */
    transform: scale(0.95);
  }
  
  .nav-btn__label {   /* 特異性: (0,0,2,0) */
    transform: none;
  }
}
```

```css
/* ❌ Bad - 親モディファイアがベース要素より先 */

.nav-btn--active {
  /* ... */
  .nav-btn__icon {    /* (0,0,2,0) */
    transform: scale(0.95);
  }
}

.nav-btn__icon {      /* (0,0,1,0) - エラー！後なのに特異性が低い */
  display: flex;
}
```

**エラーが発生する理由**:
- `.nav-btn--active .nav-btn__icon`の特異性は`(0,0,2,0)`
- `.nav-btn__icon`の特異性は`(0,0,1,0)`
- より低い特異性のセレクターが後に配置されているため、Stylelintが`no-descending-specificity`エラーを出す

**修正方法**: 親モディファイアブロック全体を、すべてのベース子要素セレクターの後に移動する

#### CSS Grid - 特別な注意事項

グリッドレイアウトでは、`grid-column`などのプロパティを使用するセレクターが高い特異性を持つことが多いため、特に注意が必要です。

```css
/* ✅ Good - 正しい順序 */
.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(...);
}

/* グリッド特有のスタイルは後 */
.view-grid .divider {
  grid-column: 1 / -1;
  margin: 0.25rem 0;
}
```

**Rationale:** CSS特異性の順序を守ることで、Stylelintエラーを防ぎ、意図しないスタイルのオーバーライドを避け、保守性を向上させます。

## Performance Standards

### What is Performance?
Performance is like making sure your website loads fast and doesn't waste resources. It's like making sure your car is fuel-efficient and gets you where you need to go quickly.

### Bundle Optimization (GoRakuDo Style)
- Keep component files under 50KB (like keeping your backpack light)
- Use dynamic imports for large components (only load what you need, when you need it)
- Implement code splitting for routes (split your code into smaller pieces)

### Image Optimization (GoRakuDo Patterns)
```astro
<!-- ✅ Good - Optimized images with proper attributes -->
<img 
  src={optimizedImage} 
  alt="Descriptive alt text"
  loading="lazy"
  width="800"
  height="600"
/>

<!-- ✅ Good - Responsive images (different sizes for different screens) -->
<picture>
  <source media="(min-width: 768px)" srcset={largeImage} />
  <source media="(min-width: 480px)" srcset={mediumImage} />
  <img src={smallImage} alt="Responsive image" />
</picture>
```

### JavaScript Performance (GoRakuDo Specific)
```typescript
// ✅ Good - Debounced functions (like waiting for someone to finish typing)
import { debounce } from '../utils/debounce';

const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

// ✅ Good - Memoized computations (like remembering the answer to a math problem)
import { computed } from 'vue';

const expensiveValue = computed(() => {
  return heavyCalculation(props.data);
});
```

### Performance Monitoring (GoRakuDo Tools)
```typescript
// Performance monitoring with console logging
console.log("🎯 LCP:", lcp.toFixed(2), "ms");
console.log("⚡ FID:", fid.toFixed(2), "ms");
console.log("📐 CLS:", clsValue.toFixed(4));
```

**Why performance matters?**: It's like having a fast internet connection - users expect websites to load quickly, just like you expect your phone to respond immediately when you tap it.

## Error Handling Standards

### What is Error Handling?
Error handling is like having a backup plan. When something goes wrong, instead of the whole program crashing, we handle the error gracefully and tell the user what happened.

### GoRakuDo Error Handling Patterns

#### Error Reporting (Removed)
```typescript
// ❌ Removed - Error handling system has been removed
// Use standard try-catch blocks for error handling
try {
  // Some risky operation
  riskyOperation();
} catch (error) {
  // Standard error handling
  console.error('Operation failed:', error);
}
```

#### Standard Error Handling
```typescript
// ✅ Good - Standard error handling with fallback
function handleUserAction() {
  try {
    // Try the main approach
    return mainApproach();
  } catch (error) {
    // If that fails, try a simpler approach
    try {
      return fallbackApproach();
    } catch (fallbackError) {
      // If everything fails, show a user-friendly message
      console.error('Operation failed:', fallbackError);
      return showUserFriendlyError();
    }
  }
}
```

#### Console Logging for Debugging
```typescript
// ✅ Good - Debug logging with emojis for easy identification
console.log("🎯 LCP:", lcp.toFixed(2), "ms");
console.log("✅ Search completed in", searchTime.toFixed(2), "ms");
console.log("⚠️ Slow Resource:", entry.name, "-", entry.duration.toFixed(2), "ms");
```

**Why error handling matters?**: It's like having a first aid kit - when something goes wrong, you have the tools to fix it instead of everything falling apart.

---

## Accessibility Standards

### Principle: Web for Everyone

**Directive:** すべてのコンポーネントとページは、WCAG 2.1 AA基準に準拠し、キーボードナビゲーションとスクリーンリーダーをサポートします。

### Semantic HTML vs ARIA Roles (MANDATORY)

**Directive:** セマンティックHTML要素とインタラクティブARIAロールを混在させないこと。

#### The Golden Rule: セマンティックHTML優先

**原則**: ネイティブHTML要素が存在する場合は、ARIAロールよりも優先します。

```html
<!-- ❌ Bad - セマンティック要素にインタラクティブロール -->
<article role="gridcell" aria-label="Article: ...">
  <a href="/article">Read more</a>
</article>

<!-- ✅ Good - セマンティック要素を`<div>`に変更 -->
<div role="gridcell" aria-label="Article: ...">
  <a href="/article">Read more</a>
</div>

<!-- ❌ Bad - ボタンなのに<a>タグ -->
<a href="#" onclick="openMenu()">Menu</a>

<!-- ✅ Good - セマンティックな<button> -->
<button type="button" onclick="openMenu()">Menu</button>
```

#### インタラクティブARIAロールのガイドライン

インタラクティブARIAロール（`button`, `link`, `gridcell`, `tab`, `menuitem`など）は、**意味的なHTML要素（`<article>`, `<section>`, `<header>`など）とは組み合わせない**。

**理由**:
1. セマンティック要素は**コンテンツの意味**を表現
2. インタラクティブロールは**インタラクション動作**を表現
3. 両者の混在は、スクリーンリーダーや支援技術に混乱を与える

**適切な使い分け**:

| 用途 | 使用する要素 | ARIAロール | 例 |
|---|---|---|---|
| **意味的グループ** | `<article>`, `<section>` | なし or `region` | 記事カード全体 |
| **インタラクティブコンテナ** | `<div>` | `gridcell`, `tab`, `button` | グリッドアイテム |
| **ボタン動作** | `<button>` | なし（暗黙的） | メニューボタン |
| **リンク動作** | `<a href="...">` | なし（暗黙的） | ナビゲーションリンク |

#### 実例: Article Card Refactoring

**問題**: Astro Dev Toolbar Auditで検出
```
article - Interactive ARIA role used on non-interactive HTML element
```

**Before (エラーあり):**
```astro
<article role="gridcell" aria-label="Article: ...">
  <a href="/article" class="card-link">
    <h3>{title}</h3>
    <p>{description}</p>
  </a>
</article>
```

**After (修正後):**
```astro
<div role="gridcell" aria-label="Article: ...">
  <a href="/article" class="card-link">
    <h3>{title}</h3>
    <p>{description}</p>
  </a>
</div>
```

**修正理由**:
- `<article>`はコンテンツの意味的グループ（非インタラクティブ）
- `role="gridcell"`はインタラクティブなグリッドシステムの一部
- 両者の混在を避けるため、`<div>`に変更してARIAロールで意味を付与

---

### ARIA Attributes (MANDATORY)

#### 必須ARIA属性

```html
<!-- ✅ Good - Complete ARIA labeling -->
<nav aria-label="Main navigation">
  <ul role="list" aria-label="Navigation items">
    <li role="listitem">
      <a href="/docs" aria-label="Documentation page">Docs</a>
    </li>
  </ul>
</nav>

<!-- ✅ Good - Descriptive labels -->
<button 
  aria-label="Share this post on social media"
  aria-describedby="share-description"
>
  Share
</button>
<span id="share-description" class="sr-only">
  Opens share dialog for Facebook, Twitter, and more
</span>
```

### Keyboard Navigation

```typescript
// ✅ Good - Keyboard event handling
<button 
  onclick="handleClick()"
  onkeydown="if(event.key==='Enter' || event.key===' ') handleClick()"
>
  Click Me
</button>

// ✅ Good - Focus management
<style>
  .button:focus-visible {
    outline: 2px solid oklch(from var(--clr-purple) l c h / 0.5);
    outline-offset: 2px;
  }
</style>
```

### Screen Reader Support

```html
<!-- ✅ Good - Hidden but accessible text -->
<span class="sr-only">Skip to main content</span>

<!-- CSS for sr-only -->
<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

### Invalid Links and Disabled Navigation (MANDATORY)

**Directive:** `href="#"`を使用せず、無効化されたナビゲーションには`<button disabled>`を使用します。

#### The Golden Rule: 正しいHTML要素を選択

**原則**: リンク動作には`<a>`、ボタン動作には`<button>`、無効化されたナビゲーションには`<button disabled>`を使用。

```html
<!-- ❌ Bad - 無効なリンク -->
<a href="#" aria-disabled="true">Disabled Link</a>

<!-- ❌ Bad - JavaScriptボタンなのに<a> -->
<a href="#" onclick="doSomething()">Click Me</a>

<!-- ✅ Good - ボタン動作には<button> -->
<button type="button" onclick="doSomething()">Click Me</button>

<!-- ✅ Good - 無効化されたナビゲーションには<button disabled> -->
<button disabled type="button" aria-label="Previous page (not available)">
  Previous
</button>
```

#### 実例: Pagination Disabled States

**問題**: Astro Dev Toolbar Auditで検出
```
a - Invalid `href` attribute (href="#")
```

**Before (エラーあり):**
```astro
<a
  href={prevPageUrl || '#'}
  class={`pagination-btn ${!prevPageUrl ? 'pagination-disabled' : ''}`}
  aria-disabled={!prevPageUrl}
>
  Sebelumnya
</a>
```

**After (修正後):**
```astro
{
  prevPageUrl ? (
    <a
      href={prevPageUrl}
      class='pagination-btn pagination-prev'
      aria-label='Pindah ke halaman sebelumnya'
      rel='prev'
    >
      Sebelumnya
    </a>
  ) : (
    <button
      class='pagination-btn pagination-prev pagination-disabled'
      aria-label='Halaman sebelumnya (tidak tersedia)'
      disabled
      type='button'
    >
      Sebelumnya
    </button>
  )
}
```

**修正理由**:
- `href="#"`は無効なリンクで、Accessibilityツールがエラーとして検出
- 無効化されたナビゲーションは、ネイティブの`<button disabled>`を使用すべき
- 条件分岐で適切なHTML要素を選択（リンクなら`<a>`、無効なら`<button>`）

#### セマンティックHTML選択フローチャート

```
要素の動作は？
    ↓
┌────────────────┬────────────────┬────────────────┐
│ ページ遷移     │ JavaScript動作 │ 無効化された   │
│ (navigation)   │ (action)       │ ナビゲーション │
└────────────────┴────────────────┴────────────────┘
    ↓               ↓               ↓
<a href="...">  <button>       <button disabled>
rel="..."       type="button"  aria-label="..."
```

#### `href="#"`の代替パターン

```astro
<!-- ❌ Bad - `href="#"`を使用 -->
<a href="#" class="disabled-link">Disabled</a>

<!-- ✅ Good - 条件分岐で適切な要素 -->
{
  isEnabled ? (
    <a href={url} class="link">Link</a>
  ) : (
    <button disabled type="button" class="link disabled">Disabled</button>
  )
}

<!-- ✅ Good - aria-disabledとpointer-eventsで無効化 -->
<a 
  href={url} 
  class={isEnabled ? '' : 'disabled'}
  aria-disabled={!isEnabled}
  {onclick={isEnabled ? handleClick : (e) => e.preventDefault()}}
>
  Link
</a>

<style>
  a[aria-disabled="true"] {
    pointer-events: none;
    opacity: 0.5;
  }
</style>
```

**推奨**: 最初のパターン（条件分岐）がAccessibilityツールとの互換性が最も高い

---

### Touch Target Sizes

```css
/* ✅ Good - Minimum 44px touch targets */
:root {
  --touch-target-min: 44px;
  --touch-target-padding: calc((var(--touch-target-min) - 1.5rem) / 2);
}

.button {
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
  padding: var(--touch-target-padding);
}
```

### Accessibility Checklist

- [ ] すべてのインタラクティブ要素に適切なARIA属性があるか？
- [ ] **セマンティックHTML要素とインタラクティブARIAロールを混在させていないか？**
- [ ] **`href="#"`を使用せず、無効化されたナビゲーションには`<button disabled>`を使用しているか？**
- [ ] ボタン動作には`<button>`、リンク動作には`<a>`を使用しているか？
- [ ] キーボードで完全にナビゲート可能か？
- [ ] フォーカス表示は明確か（:focus-visible）？
- [ ] タッチターゲットは最低44pxか？
- [ ] 画像にalt属性があるか？
- [ ] 色のコントラスト比は4.5:1以上か？
- [ ] スクリーンリーダーで読み上げテストを実施したか？
- [ ] **Astro Dev Toolbar Auditでエラーがないか確認したか？**

---

## SEO Standards

### Principle: Structured Data + Unified SEO Management

**Directive:** すべてのページはUnifiedSEO.astroを通じてSEOメタデータとStructured Dataを管理します。

### UnifiedSEO Component Usage (MANDATORY)

```astro
---
import UnifiedSEO from '../components/common/UnifiedSEO.astro';
import seoConfig from '../data/seo/pages/about-us.json';

const seoData = {
  ...seoConfig.seoData,
  lang: seoConfig.seoData.lang as 'id' | 'ja',
};
---

<head>
  <UnifiedSEO 
    {...seoData}
    faqSchema={seoConfig.faqSchema}
    breadcrumbSchema={breadcrumbSchema}
  />
</head>
```

### JSON-Driven SEO Configuration

**場所**: `src/data/seo/pages/[page-name].json`

```json
{
  "seoData": {
    "title": "Page Title - GoRakuDo",
    "description": "Page description for meta tags",
    "pageType": "article",
    "author": "Tim GoRakuDo",
    "publishedDate": "2025-09-30T18:45:16.276Z",
    "lang": "id",
    "keywords": ["keyword1", "keyword2"]
  },
  "faqSchema": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [...]
  },
  "breadcrumbData": {
    "items": [...]
  }
}
```

### OG Image Requirements

```yaml
# MDX Frontmatter
---
# ✅ Good - ローカル画像パス（推奨）
featuredImage: '/images/docs/gorakudo-tired-study_zhhh2b.webp'

# OG画像は作成時に 1200x630px (1.91:1) で用意する（自動変換なし）
---
```

### Schema.org Structured Data

**Mandatory Types:**
- ✅ Organization
- ✅ Article（全記事ページ）
- ✅ BreadcrumbList（全ページ）
- ✅ FAQPage（該当ページのみ）
- ✅ HowTo（チュートリアルページ）

### Educational Metadata (Schema.org)

```yaml
---
learningResourceType: "Article"
educationalLevel: ["Beginner", "Intermediate"]
about:
  - type: "DefinedTerm"
    name: "Comprehensible Input"
    description: "理解可能なインプット理論"
    sameAs: "https://en.wikipedia.org/wiki/Input_hypothesis"
citation:
  - type: "ScholarlyArticle"
    author: "Stephen Krashen"
    datePublished: "1985"
    name: "The Input Hypothesis"
---
```

### SEO Checklist

- [ ] UnifiedSEO.astroを使用しているか？
- [ ] OG Imageは1200x630pxに最適化されているか？
- [ ] meta descriptionは120-280文字か？
- [ ] keywordsは各60文字以内、15個以内か？
- [ ] Structured Dataは適切に設定されているか？
- [ ] Canonical URLは設定されているか？

---

## Comment & Documentation

### Principle: Explain the "Why", Not Just the "What"

**Directive:** コメントとドキュメントは、コードの意図、理由、コンテキストを説明します。

### GoRakuDo Comment Patterns

#### Section Headers
```typescript
// ========== TYPE DEFINITIONS ==========
// Use equals signs to create clear section dividers

// ========== CONTENT PATH CONFIGURATION ==========
// Centralized configuration for all content collections
```

#### Multi-line Comments with Reasoning
```typescript
/* 
 * REASONING: These animations are used throughout the existing codebase
 * CHANGE: Kept all original keyframes but optimized timing functions
 * 
 * This comment explains WHY we made certain decisions, not just WHAT we did
 */
```

#### Bug Fix Comments
```typescript
// Example bug fix comment format
// FIX #XXX: Description of the issue
// ROOT CAUSE: Technical explanation
// SOLUTION: How it was resolved
// STATUS: ✅ RESOLVED

// CRITICAL FIX: Enhanced positioning that respects sentence boundaries
// This was a major bug that could break the user experience
```

#### Function Documentation
```typescript
/**
 * Resolve content path based on collection entry
 * Auto-detects the appropriate path for any content collection
 *
 * @param post - Collection entry (blog, articles, etc.)
 * @param collectionName - Optional explicit collection name override
 * @returns PathResolutionResult with resolved path and metadata
 */
export function resolveContentPath(
  post: CollectionEntry<any>,
  collectionName?: string,
): PathResolutionResult {
  // Function implementation
}
```

#### Inline Comments for Complex Logic
```typescript
// Determine collection name from post or parameter
const detectedCollectionName = collectionName || detectCollectionFromEntry(post);

// Find matching configuration
const config = CONTENT_PATH_CONFIG.find(
  (c) => c.collectionName === detectedCollectionName,
);
```

**Rationale:** 優れたコメントは、コードの理解を深め、将来の保守を容易にします。

### Documentation Patterns

#### README Files (GoRakuDo Style)
Each major directory includes a README.md file with:
- **Purpose**: What this folder is for
- **Key files**: What each file does
- **Usage examples**: How to use the code
- **Dependencies**: What other things it needs

Example from `src/utils/README.md`:
```markdown
# Utils Folder Organization

This folder contains all utility functions organized into logical subfolders for better maintainability and discoverability.

## 📁 Folder Structure

### 🤖 `ai-content/`
AI-powered content analysis and metadata utilities
- **content-analysis.ts** - Content analysis and internal linking
- **semantic-relationships.ts** - Semantic relationship detection
```

#### Function Documentation (GoRakuDo Style)
```typescript
/**
 * Resolve content path based on collection entry
 * Auto-detects the appropriate path for any content collection
 *
 * @param post - Collection entry (blog, articles, etc.)
 * @param collectionName - Optional explicit collection name override
 * @returns PathResolutionResult with resolved path and metadata
 */
export function resolveContentPath(
  post: CollectionEntry<any>,
  collectionName?: string,
): PathResolutionResult {
  // Function implementation
}
```

#### Component Documentation (GoRakuDo Style)
```vue
<!--
  Component: Navbar
  Purpose: Main navigation bar with responsive design
  Features:
    - Responsive mobile menu
    - Discord invitation modal
    - Keyboard navigation support
  Props: None (self-contained component)
  Events:
    - click: Navigation events
  Usage:
    <Navbar client:visible />
-->
```

#### Code Comments with Reasoning
```typescript
// ========== CONTENT PATH CONFIGURATION ==========
// Centralized configuration for all content collections
// Easy to modify for future collection additions or name changes
const CONTENT_PATH_CONFIG: ContentPathConfig[] = [
  {
    collectionName: "docs",
    basePath: "/docs",
    displayName: "Docs",
    icon: "📚",
    priority: 1,
  },
  // ... more configurations
];
```

**Why documentation matters?**: It's like writing a recipe - if you don't write down the steps, someone else (or future you) won't know how to make the same dish.

---

## Code Review Checklist

### 必須項目（MANDATORY）

#### 基本原則
- [ ] **Minimalist Code**: 関数は理想的に5行以内か？
- [ ] **DRY Principle**: コード重複なし（3回以上の類似ロジックは抽象化）
- [ ] **KISS Principle**: シンプルな解決策が選択されているか？
- [ ] **Type Safety**: Strict TypeScript mode使用、型エラーなし

#### Astro特有
- [ ] **Content Collections**: 構造化コンテンツはgetCollection/getEntry使用
- [ ] **UnifiedSEO**: すべてのページでUnifiedSEO.astro使用
- [ ] **Section Headers**: セクションヘッダー（`// ========== XXX ==========`）使用
- [ ] **Props Export**: Props interfaceをexportしているか
- [ ] **Zero-JS**: 不要なJavaScriptバンドルを追加していないか

#### スタイリング
- [ ] **OKLCH Colors**: すべての色はOKLCH形式か
- [ ] **Design Tokens**: CSS変数（`--token-*`、`--clr-*`）使用
- [ ] **clamp() Responsive**: メディアクエリの代わりにclamp()使用
- [ ] **Scoped Styles**: `<style>`はスコープ化（is:global は必要時のみ）
- [ ] **CSS Specificity**: セレクターは昇順（低い特異性→高い特異性）に配置

#### 品質基準
- [ ] **Accessibility**: ARIA属性、キーボードナビゲーション、タッチターゲット44px
- [ ] **Semantic HTML**: セマンティック要素とARIAロールの混在なし
- [ ] **Invalid Links**: `href="#"`禁止、無効化ナビゲーションは`<button disabled>`
- [ ] **Astro Dev Toolbar Audit**: 開発環境でエラー0確認
- [ ] **SEO**: OG Image 1200x630px、keywords 60文字以内・15個以内
- [ ] **Performance**: 画像は `public/images/` からローカル配信、Resource Hints設定
- [ ] **Images**: 明示的な `/images/...` パスを使用（bare ID禁止）

#### コード品質
- [ ] **ES Modules**: すべてのJSファイルでimport/export使用（CommonJS禁止）
- [ ] **Naming**: PascalCase (components)、camelCase (functions)、kebab-case (files)
- [ ] **Comments**: "why"を説明（"what"だけでなく）
- [ ] **Error Handling**: 適切なtry-catch、フォールバック処理
- [ ] **Test Artifacts**: 一時ファイル、モックデータ、デバッグコード削除済み

### 任意項目（Recommended）

- [ ] Path aliasing（`@/*`）使用で可読性向上
- [ ] Console loggingに絵文字使用（`🎯`、`✅`、`⚠️`）
- [ ] コンポーネントにJSDoc/TSDoc追加
- [ ] ユニットテスト追加（重要な関数）
- [ ] Lighthouseスコア95+確認

### 提出前の最終チェック

```bash
# TypeScript型チェック
npm run typecheck

# Linting
npm run lint

# フォーマット
npm run format

# ビルド確認
npm run build
```

---

## Tools and Configuration

### TypeScript Configuration (MANDATORY)

**場所**: `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    // ===== STRICT MODE =====
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    
    // ===== MODULE SETTINGS =====
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "bundler",
    
    // ===== PATH ALIASING =====
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/types/*": ["scripts/type-scripts/*"]
    },
    
    // ===== COMPATIBILITY =====
    "jsx": "preserve",
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "downlevelIteration": true,
    "skipLibCheck": true
  }
}
```

### ESLint Configuration (MANDATORY)

**場所**: `eslint.config.js`

```javascript
export default [
  js.configs.recommended,
  {
    rules: {
      // ===== GENERAL RULES =====
      'no-console': 'off',        // 開発用に許可
      'prefer-const': 'error',    // const優先
      'no-var': 'error',          // varの使用禁止
    },
  },
  {
    // ===== TYPESCRIPT RULES =====
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
    },
  },
  {
    // ===== VUE RULES =====
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',
      'vue/no-v-html': 'warn',
    },
  },
  {
    // ===== IGNORE PATTERNS =====
    ignores: [
      'node_modules/',
      'dist/',
      '.astro/',
      'public/',
      '**/*.astro',  // Astro CLIで処理
    ],
  },
];
```

### Path Aliasing Usage

```typescript
// ✅ Good - Using path alias
import { Button } from '@/components/ui/Button.astro';
import type { User } from '@/types/user';

// ✅ Also acceptable - Relative paths
import { Button } from '../components/ui/Button.astro';
```

### Prettier Configuration (Recommended)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"]
}
```

### Stylelint Configuration

**場所**: `.stylelintrc` or `stylelint.config.js`

```json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "order/properties-order": "alphabetical",
    "color-function-notation": "modern",
    "alpha-value-notation": "number"
  }
}
```

---

## Conclusion

このコーディング規約は、GoRakuDoプロジェクトで使用される実際のパターンと慣習を反映しています。すべての開発者が一貫性、保守性、品質を確保しながら、効率的に作業できるようにします。

### 🎯 重要原則まとめ

#### 基本原則
1. **Minimalist Code** - 関数は理想的に5行以内、シンプルさを追求
2. **DRY Principle** - コード重複を避け、再利用性を促進
3. **KISS Principle** - シンプルで保守しやすいコードを保つ
4. **Type Safety** - Strict TypeScript mode必須、型安全性の確保

#### Astro特有
5. **Content Collections** - すべての構造化コンテンツにZodバリデーション使用
6. **UnifiedSEO** - すべてのページでSEO統一管理
7. **Zero-JS Philosophy** - デフォルトでJavaScriptゼロ、必要時のみis:inline
8. **Named Slots** - レイアウトの柔軟性を最大化

#### スタイリング
9. **OKLCH Color Space** - すべての色はOKLCH形式で定義
10. **Design Tokens** - CSS変数による一元管理
11. **clamp() Responsive** - メディアクエリを最小化
12. **Scoped Styles** - デフォルトでスコープ化

#### 品質基準
13. **Accessibility** - WCAG 2.1 AA準拠、ARIA属性必須
14. **Performance** - Core Web Vitals最適化、画像は `public/images/` からローカル配信
15. **SEO** - Schema.org Structured Data、OG Image 1200x630px（作成時に整備）

### 📚 参照ドキュメント

| ドキュメント | 内容 |
|---|---|
| `astro-development-patterns.md` | Astro特有のパターンとアーキテクチャ |
| `og-image-optimization.md` | OG Image自動変換システム詳細 |
| `tech-stack.md` | 技術スタック詳細 |
| `source-tree.md` | プロジェクト構造 |

### 🔄 Version History

| Version | Date | Changes |
|---|---|---|
| **2.4** | 2026-09-23 | Cloudinary撤去に伴うローカル画像・OG Imageガイドライン更新 |
| **2.3** | 2025-10-13 | Semantic HTML vs ARIA Roles、Invalid Links & Disabled Navigation、Astro Dev Toolbar Audit統合 |
| **2.2** | 2025-10-13 | ネストされた子要素を持つ親モディファイアの配置ルール追加、BottomNavBar実例追加 |
| **2.1** | 2025-10-13 | CSS Selector Specificity & Ordering セクション追加、Code Review Checklist更新 |
| **2.0** | 2025-10-13 | Minimalist原則、OKLCH、UnifiedSEO、Accessibility、SEO Standards追加 |
| 1.0 | Initial | 基本的なコーディング規約 |

### 📞 質問・提案

- GitHubでissueを作成
- 開発チームと議論
- プロジェクト内の既存コード例を確認

---

**Remember:** 良いコードとは、単に動くだけでなく、将来一緒に作業するすべての人にとって理解しやすく、保守しやすいものです。

**Maintained by**: Winston (Architect)  
**Review Frequency**: 四半期ごと、または重要な実装変更時  
**Status**: ✅ Active & Enforced
