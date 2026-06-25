export const getProjectDocSlug = (id: string): string => (id.split('/').pop() ?? id).replace(/\.mdx$/, '');

// DenChou doc categorization (Setup / Features / Resources)
export const CATEGORY_ORDER = ['setup', 'features', 'resources'] as const;
export type DocCategory = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_TITLES: Record<DocCategory, string> = {
  setup: '[ SETUP ]',
  features: '[ FEATURES ]',
  resources: '[ RESOURCES ]',
};

import type { CollectionEntry } from 'astro:content';

export type DocsLink = { text: string; url: string; slug: string };
export type DocsCategory = { title: string; links: DocsLink[] };

export function buildDocsCategories(
  docs: CollectionEntry<'project-docs'>[],
  projectSlug: string,
): DocsCategory[] {
  const published = docs.filter(
    (d) => d.data.status === 'published' && getProjectDocSlug(d.id) !== 'index',
  );

  // Group by category first, then sort by order WITHIN each category
  const categorized: Record<DocCategory, CollectionEntry<'project-docs'>[]> = {
    setup: [],
    features: [],
    resources: [],
  };

  for (const doc of published) {
    const category: DocCategory = doc.data.category ?? 'resources';
    categorized[category].push(doc);
  }

  // Sort each category independently by order
  for (const category of CATEGORY_ORDER) {
    categorized[category].sort(
      (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
    );
  }

  return CATEGORY_ORDER.map((category) => ({
    title: CATEGORY_TITLES[category],
    links: categorized[category].map((doc) => {
      const slug = getProjectDocSlug(doc.id);
      return { text: doc.data.title, url: `/project/${projectSlug}/${slug}`, slug };
    }),
  }));
}
