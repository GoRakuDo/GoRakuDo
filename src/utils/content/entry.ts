/**
 * Resolve the path segment used by this project for a content entry.
 *
 * In Astro 7 legacy compatibility mode, `id` is a raw relative path that
 * keeps the file extension and preserves casing. `.replace(/\.(mdx|md)$/, '')`
 * reproduces the equivalent of the old `slug` value.
 *
 * Note: If `legacy.collectionsBackwardsCompat` is removed in the future,
 * `id` will be lowercased, so a custom `generateId` will be required to keep
 * casing-sensitive URLs (e.g. `/project/denchou/Card_Types/`).
 */
export function getEntrySlug(entry: { id: string }): string {
  return entry.id.replace(/\.(mdx|md)$/, '');
}
