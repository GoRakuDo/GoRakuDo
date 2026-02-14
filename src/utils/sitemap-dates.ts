import { getGitLastModified } from './git-dates';

/**
 * Registry of static page URLs to their source content files.
 * Used by the sitemap plugin to set accurate <lastmod> dates.
 *
 * Dynamic pages (docs, tools, etc.) are handled separately
 * via their content collection entries and Git history.
 */
const PAGE_SOURCE_MAP: Record<string, string> = {
 '/': 'src/pages/index.astro',
 '/panduan-immersion-belajar-bahasa-jepang-dengan-otodidak/':
  'src/pages/panduan-immersion-belajar-bahasa-jepang-dengan-otodidak/index.astro',
 '/panduan-lengkap-otodidak-bahasa-jepang/':
  'src/pages/panduan-lengkap-otodidak-bahasa-jepang/index.astro',
 '/about-us/': 'src/pages/about-us/index.astro',
 '/discord/': 'src/pages/discord/index.astro',
 '/faq/': 'src/pages/faq/index.astro',
 '/search/': 'src/pages/search/index.astro',
 '/tools/': 'src/pages/tools/index.astro',
};

/**
 * Get the last modification date for a sitemap URL.
 * Tries Git history first, then falls back to a provided default.
 */
export function getLastModForUrl(
 urlPath: string,
 fallback: Date = new Date()
): Date {
 const sourceFile = PAGE_SOURCE_MAP[urlPath];
 if (sourceFile) {
  const gitDate = getGitLastModified(sourceFile);
  if (gitDate) return new Date(gitDate);
 }
 return fallback;
}
