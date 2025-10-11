# Coding Standards - GoRakuDo

## Overview

This document defines the actual coding standards and patterns used in the GoRakuDo project. These are the real rules and conventions that developers follow when working on this codebase.

## Table of Contents

1. [General Principles](#general-principles)
2. [File Organization](#file-organization)
3. [Naming Conventions](#naming-conventions)
4. [Code Style](#code-style)
5. [TypeScript Standards](#typescript-standards)
6. [Vue Component Standards](#vue-component-standards)
7. [Astro Standards](#astro-standards)
8. [CSS/Tailwind Standards](#csstailwind-standards)
9. [Performance Standards](#performance-standards)
10. [Error Handling Standards](#error-handling-standards)
11. [Comment Standards](#comment-standards)
12. [Documentation Standards](#documentation-standards)

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

### Astro Components

#### Component Structure
```astro
---
// 1. Imports
import Layout from '../layouts/Layout.astro';
import { Navbar } from '../components/Navbar.astro';

// 2. Props interface
interface Props {
  title: string;
  description?: string;
}

// 3. Props destructuring
const { title, description = 'Default description' } = Astro.props;

// 4. Data fetching
const posts = await Astro.glob('../content/posts/*.md');
---

<!-- 5. Template -->
<Layout title={title}>
  <Navbar />
  <main>
    <h1>{title}</h1>
    <p>{description}</p>
  </main>
</Layout>

<style is:global>
  /* 6. Scoped styles */
  main {
    padding: 2rem;
  }
</style>
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

## CSS/Tailwind Standards

### What is CSS and Tailwind?
CSS is like the styling rules for your website (colors, fonts, layout). Tailwind is like having a big box of pre-made styling tools that you can quickly use.

### Tailwind Usage (GoRakuDo Style)
```html
<!-- ✅ Good - Semantic class grouping (like organizing your art supplies) -->
<div class="
  flex items-center justify-between
  p-4 bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow duration-200
">
  <!-- Content -->
</div>

<!-- ❌ Bad - Inline styles (like writing instructions on each item) -->
<div style="display: flex; align-items: center; padding: 1rem;">
  <!-- Content -->
</div>
```

**Why group classes?**: It's like organizing your art supplies by type - all the brushes together, all the paints together, etc.

### Custom CSS (GoRakuDo Specific)
```css
/* ✅ Good - CSS custom properties (like having a color palette) */
:root {
  --clr-accent: #8B5DFF;        /* Main purple color */
  --clr-accent-dark: #7B4DEF;   /* Darker purple */
  --clr-accent-glow-strong: #9F75FF;  /* Bright purple */
  --clr-accent-glow-medium: #B794FF;  /* Medium purple */
}

.navbar {
  color: var(--clr-purple);
  background: var(--clr-accent-dark);
}

/* ✅ Good - Responsive design (like having different layouts for phone vs computer) */
.responsive-element {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

@media (min-width: 768px) {
  .responsive-element {
    padding: 2rem;
  }
}
```

**Why CSS variables?**: It's like having a color palette - if you want to change the main color, you only change it in one place and it updates everywhere.

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

## Comment Standards

### What are Comments?
Comments are like notes you leave for yourself or other developers. They explain what your code does and why you wrote it that way.

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

**Why good comments matter?**: It's like leaving clear instructions for someone who will use your code later - they need to understand not just what you did, but why you did it that way.

## Documentation Standards

### What is Documentation?
Documentation is like writing a manual for your code. It helps other developers (and your future self) understand how to use and maintain the code.

### GoRakuDo Documentation Patterns

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

## Code Review Checklist

Before submitting code for review, ensure:

- [ ] Code follows GoRakuDo established patterns
- [ ] **MANDATORY**: All JavaScript files use ES Modules (import/export)
- [ ] **MANDATORY**: All TypeScript files use Strict TypeScript mode
- [ ] **MANDATORY**: All test artifacts have been cleaned up (no temporary files, mock data, or debug code)
- [ ] **MANDATORY**: DRY principle applied - no code duplication (3+ similar logic instances require abstraction)
- [ ] **MANDATORY**: KISS principle applied - simple solutions preferred over complex abstractions
- [ ] TypeScript types are properly defined with comments
- [ ] Components are properly documented with purpose and usage
- [ ] Performance considerations are addressed (bundle size, loading speed)
- [ ] Accessibility standards are met (ARIA labels, keyboard navigation)
- [ ] Error handling is implemented (Discord reporting, fallbacks)
- [ ] Comments explain the "why" not just the "what"
- [ ] Console logging uses emojis for easy identification
- [ ] CSS uses GoRakuDo color variables (--clr-accent, etc.)
- [ ] File organization follows utils subfolder structure
- [ ] No hardcoded values (use constants and variables)
- [ ] Code is properly formatted and indented

## Tools and Configuration

#### TypeScript Configuration (Strict Mode Required)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "strictPropertyInitialization": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

#### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### ESLint Rules
- **MANDATORY**: Enforce TypeScript strict mode
- **MANDATORY**: Enforce ES Modules (no CommonJS)
- Require explicit return types for functions
- Prohibit unused variables
- Enforce consistent import ordering
- Prohibit `require()` and `module.exports` statements

### Git Hooks
- Pre-commit: Run linting and formatting
- Pre-push: Run type checking and tests

## Conclusion

These coding standards reflect the actual patterns and conventions used in the GoRakuDo project. They ensure consistency, maintainability, and quality across the codebase while being accessible to developers of all skill levels.

### Key Takeaways:
1. **DRY principle** prevents code duplication and promotes reusability
2. **KISS principle** keeps code simple and maintainable
3. **Naming conventions** are like grammar rules for code
4. **Comments** explain the "why" behind your decisions
5. **Error handling** is like having a backup plan
6. **Performance** matters for user experience
7. **Documentation** helps others understand your code
8. **Organization** makes code easier to find and maintain
9. **ES Modules** are mandatory for all JavaScript files
10. **Strict TypeScript** mode is required for all TypeScript files
11. **Test artifact cleanup** is mandatory after completing work

### For Questions or Suggestions:
- Open an issue on GitHub
- Discuss with the development team
- Check existing code examples in the project

Remember: Good code is not just about making it work - it's about making it understandable and maintainable for everyone who will work with it in the future.
