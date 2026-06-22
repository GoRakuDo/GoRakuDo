export const getProjectDocSlug = (id: string): string => (id.split('/').pop() ?? id).replace(/\.mdx$/, '');

// DenChou doc categorization (Setup / Features / Resources)
export const CATEGORY_ORDER = ['setup', 'features', 'resources'] as const;
export type DocCategory = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_TITLES: Record<DocCategory, string> = {
  setup: '[ SETUP ]',
  features: '[ FEATURES ]',
  resources: '[ RESOURCES ]',
};

export const DOC_CATEGORY: Record<string, DocCategory> = {
  // Setup — first-run, install, settings
  setup_overview: 'setup',
  anki: 'setup',
  AnkiFields: 'setup',
  yomitan: 'setup',
  Preferences: 'setup',
  sharex: 'setup',
  mpvacious: 'setup',
  yomipv: 'setup',
  tags: 'setup',
  external_links: 'setup',

  // Features — visual, UX, card display
  Card_Types: 'features',
  Custom_Dark_Mode: 'features',
  dictionary_colorizer: 'features',
  defnition_toggle: 'features',
  lightbox: 'features',
  Reading_Display: 'features',
  scene_switching: 'features',
  kanji_hover: 'features',
  jitendex: 'features',
  frequency: 'features',
  pitch_accent_automatic_colors: 'features',
  Image_Blurring: 'features',
  sentence_translation: 'features',

  // Resources — responsive, mobile, helpers
  responsive_grid_layout: 'resources',
  responsive_layout: 'resources',
  mobile: 'resources',
  collect_glossary_images: 'resources',
  misc_info: 'resources',
};

import type { CollectionEntry } from 'astro:content';

export type DocsLink = { text: string; url: string; slug: string };
export type DocsCategory = { title: string; links: DocsLink[] };

export function buildDocsCategories(
  docs: CollectionEntry<'project-docs'>[],
  projectSlug: string,
): DocsCategory[] {
  const sorted = [...docs]
    .filter((d) => d.data.status === 'published' && getProjectDocSlug(d.id) !== 'index')
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));

  const categorized: Record<DocCategory, CollectionEntry<'project-docs'>[]> = {
    setup: [],
    features: [],
    resources: [],
  };

  for (const doc of sorted) {
    const slug = getProjectDocSlug(doc.id);
    if (!(slug in DOC_CATEGORY)) {
      console.warn(`[project-docs] No DOC_CATEGORY entry for "${slug}" — falling back to "resources".`);
    }
    const category: DocCategory = DOC_CATEGORY[slug] ?? 'resources';
    categorized[category].push(doc);
  }

  return CATEGORY_ORDER.map((category) => ({
    title: CATEGORY_TITLES[category],
    links: categorized[category].map((doc) => {
      const slug = getProjectDocSlug(doc.id);
      return { text: doc.data.title, url: `/project/${projectSlug}/${slug}`, slug };
    }),
  }));
}
