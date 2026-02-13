---
name: astro
description: Complete Astro framework knowledge combining official documentation and Astro codebase. Use when building Astro sites, understanding islands architecture, or debugging Astro issues.
---

# Astro Framework Skill

This skill provides comprehensive Astro framework knowledge for building, debugging, and maintaining Astro projects.

## When to Use

- Building or modifying Astro sites
- Understanding Astro's islands architecture
- Debugging Astro-specific issues
- Working with Astro components, routing, layouts, and integrations
- Configuring Astro projects (`astro.config.mjs`)

## Key Documentation References

When you need Astro-specific information, consult these official documentation pages:

### Getting Started
- [Getting Started](https://docs.astro.build/en/getting-started/)
- [Installation](https://docs.astro.build/en/install/)

### Core Concepts
- [Project Structure](https://docs.astro.build/en/core-concepts/project-structure/)
- [Astro Components](https://docs.astro.build/en/core-concepts/astro-components/)
- [Pages](https://docs.astro.build/en/core-concepts/astro-pages/)
- [Layouts](https://docs.astro.build/en/core-concepts/layouts/)
- [Routing](https://docs.astro.build/en/core-concepts/routing/)

### Guides
- [Integrations Guide](https://docs.astro.build/en/guides/integrations-guide/)
- [UI Frameworks](https://docs.astro.build/en/guides/framework-components/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [Data Fetching](https://docs.astro.build/en/guides/data-fetching/)
- [Deployment](https://docs.astro.build/en/guides/deploy/)
- [Server-Side Rendering (SSR)](https://docs.astro.build/en/guides/server-side-rendering/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)

### API Reference
- [Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)
- [API Reference](https://docs.astro.build/en/reference/api-reference/)
- [CLI Reference](https://docs.astro.build/en/reference/cli-reference/)

## Astro Component Syntax

Astro components use a `.astro` file extension with the following structure:

```astro
---
// Component Script (JavaScript/TypeScript)
// Runs at build time only
import MyComponent from '../components/MyComponent.astro';

const { title } = Astro.props;
const data = await fetch('https://api.example.com/data').then(r => r.json());
---

<!-- Component Template (HTML + JSX-like expressions) -->
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <MyComponent />
    {data.map(item => <p>{item.name}</p>)}
  </body>
</html>

<style>
  /* Scoped CSS - only applies to this component */
  h1 { color: purple; }
</style>

<script>
  // Client-side JavaScript - runs in the browser
  console.log('Hello from the browser!');
</script>
```

## Islands Architecture

Astro uses an "islands architecture" where interactive UI components are hydrated independently:

- `client:load` — Hydrate immediately on page load
- `client:idle` — Hydrate once the page is done with its initial load
- `client:visible` — Hydrate once the component enters the viewport
- `client:media={QUERY}` — Hydrate when a CSS media query is met
- `client:only={FRAMEWORK}` — Skip server rendering, hydrate on client only

```astro
---
import ReactCounter from '../components/ReactCounter.jsx';
import SvelteWidget from '../components/SvelteWidget.svelte';
---

<!-- Static HTML, no JS loaded -->
<h1>Welcome</h1>

<!-- Interactive island: hydrated when visible -->
<ReactCounter client:visible />

<!-- Interactive island: hydrated on idle -->
<SvelteWidget client:idle />
```

## Project Structure

```
├── public/              # Static assets (fonts, images, etc.)
├── src/
│   ├── components/      # Astro/React/Vue/Svelte components
│   ├── layouts/         # Layout components
│   ├── pages/           # File-based routing (.astro, .md, .mdx)
│   ├── content/         # Content collections
│   ├── styles/          # Global styles
│   └── data/            # Data files
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```

## Common Patterns

### Data Fetching (Build Time)
```astro
---
// Fetches at build time (SSG) or request time (SSR)
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---
<ul>
  {data.map(item => <li>{item.name}</li>)}
</ul>
```

### Dynamic Routes
```astro
---
// src/pages/posts/[slug].astro
export async function getStaticPaths() {
  const posts = await fetchPosts();
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---
<h1>{post.title}</h1>
```

### Content Collections
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

## GitHub Repository

The Astro source code is available at [withastro/astro](https://github.com/withastro/astro). Key source paths:

- `packages/astro/src/` — Core Astro runtime
- `packages/astro/src/core/` — Core build and rendering logic
- `packages/integrations/` — Official integrations

## Troubleshooting Tips

1. **Build errors**: Check `astro.config.mjs` for correct integration setup
2. **Hydration issues**: Verify correct `client:*` directive usage
3. **Styling conflicts**: Astro styles are scoped by default; use `is:global` for global styles
4. **Import errors**: Ensure proper file extensions in imports (`.astro`, `.tsx`, etc.)
5. **SSR issues**: Check adapter configuration in `astro.config.mjs`
