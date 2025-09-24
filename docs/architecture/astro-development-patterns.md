
# Astro Development Patterns & Architectural Decisions

**CRITICAL DOCUMENT:** This is a living document and the single source of truth for all Astro implementation patterns in this project. All agents, especially `dev-astro` and `architect`, MUST adhere to these guidelines. These rules override any generic best practices.

**Mandatory:** Always Consult Astro Documentation ( search_astro_docs on mcp tools or @web ). Recall the most idiomatic, performant, and "Astro-native" way to achieve that goal.
**Purpose:** To ensure consistency, performance, and maintainability across the entire Astro codebase.

---

## 1. Component Architecture

### Principle: A Clear Hierarchy of Components

**Directive:** Components MUST be organized into one of three directories based on their purpose: `src/layouts/`, `src/components/`, or locally within a `src/pages/` subdirectory.

-   **`src/layouts/`:** For top-level page shells. A layout defines the surrounding structure of a page (e.g., `<html>`, `<head>`, `<body>`, header, footer).
-   **`src/components/`:** For reusable, general-purpose UI components that will be used on two or more distinct pages (e.g., `Button.astro`, `Card.astro`, `Header.astro`).
-   **`src/pages/some-page/components/`:** For single-use components that are tightly coupled to a specific page and are not intended for reuse elsewhere.

**Rationale:** This separation makes it clear where to find components and what their intended scope of use is, preventing accidental tight coupling.

---

## 2. Content Fetching

### Principle: Use the Right Tool for the Job

**Directive:** Astro's Content Collections are the **default and mandatory** method for managing and querying structured content (e.g., blog posts, documentation, authors). The `Astro.glob()` function should only be used for simple, unstructured file listings where type safety is not a primary concern.

-   **Use Content Collections (`getCollection`, `getEntry`) when:**
    -   Content has a defined schema (e.g., `title`, `pubDate`, `author`).
    -   You need type-safety and autocompletion in your code.
    -   You need to query relationships between different content types.
-   **Use `Astro.glob()` when:**
    -   You are simply listing files from a directory (e.g., an image gallery).
    -   The files have no shared schema or frontmatter.

**Rationale:** Content Collections prevent runtime errors by enforcing a data schema at build time, making the codebase more robust and easier to maintain.

**Example (Correct `getCollection` Usage):**
```astro
---
// src/pages/blog.astro
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
---
<ul>
  {posts.map(post => (
    <li><a href={`/blog/${post.slug}/`}>{post.data.title}</a></li>
  ))}
</ul>
```

---

## 3. Interactivity (Client-Side JavaScript)

### Principle: Zero-JavaScript by Default (The Astro Way)

**Directive:** Interactivity is an **exception**, not the rule. An `.astro` component that renders static HTML is always the default. A UI Framework component (React, Svelte, Vue, etc.) MUST only be used when stateful, client-side interactivity is absolutely unavoidable.

**The Decision Process:**
1.  Can this be pure, static HTML and CSS? **If yes, use an `.astro` component.**
2.  If not, is the interactivity simple enough for a standard `<script>` tag in an `.astro` component? **If yes, use that.**
3.  Only if the interactivity requires complex state management, hooks, or a component lifecycle, you may use a UI Framework component as an "island".

**Directive:** When a UI Framework component is used, it MUST use a specific `client:*` directive to control its hydration. AVOID `client:load` unless the component must be interactive immediately. Prefer `client:idle` or `client:visible`.

**Rationale:** This is the core performance philosophy of Astro. Shipping zero JavaScript by default results in the fastest possible load times.

**Example (Correct Usage of an Interactive Island):**
```astro
---
// src/pages/index.astro
import Counter from '../components/Counter.jsx'; // A React component
---
<h1>My Page</h1>
<p>This part is static HTML.</p>

<!-- This is the ONLY interactive part of the page -->
<Counter client:visible />
```

---

## 4. Styling

### Principle: Scoped by Default, Global When Necessary

**Directive:** All component-specific styles MUST be placed within a `<style is:global>` tag inside the `.astro` component file. This ensures styles are scoped and do not leak globally. Global styles (e.g., fonts, CSS variables, resets) are ONLY permitted in a central file, `src/styles/global.css`, which is imported into the main layout.

**Rationale:** Scoped styles prevent CSS conflicts and make components truly modular and portable.

---

## 5. API Endpoints (Server-Side Logic)

### Principle: Endpoints for Data, Not Pages

**Directive:** API routes (files in `src/pages/api/`) are to be used for serving data (JSON) to interactive client-side islands or external services. They MUST NOT be used to render HTML pages. All API responses MUST follow a consistent JSON structure.

**Rationale:** This maintains a clear separation between the data layer and the presentation layer, aligning with modern web architecture.

**Example (Standard API Response):**
```typescript
// src/pages/api/posts.json.ts
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  return new Response(JSON.stringify({
    success: true,
    data: posts.map(post => ({
      title: post.data.title,
      slug: post.slug
    }))
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 6. Image Handling

### Principle: Performance is Non-Negotiable

**Directive:** All local images (`src/assets/`) that are part of the content MUST be handled by Astro's built-in `<Image />` component to ensure automatic optimization (resizing, format conversion, etc.). Static assets in the `public/` folder should only be used for files that must not be processed, like `favicon.svg`.

**Rationale:** Using the `<Image />` component is one of the most significant performance optimizations available in Astro. Bypassing it leads to unoptimized, slow-loading images.

---