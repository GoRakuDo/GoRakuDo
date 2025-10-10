// Collections Configuration - Astro Native Implementation
// GoRakuDo Project - Simplified and Efficient

// ========== COLLECTION DEFINITIONS ==========
// Centralized configuration for all content collections
// Following Astro best practices with minimal complexity

export const COLLECTIONS = {
  docs: {
    displayName: 'Docs',
    basePath: '/docs',
  },
  pages: {
    displayName: 'Pages',
    basePath: '',
  },
  'tool-articles': {
    displayName: 'Tools',
    basePath: '/tools',
  },
} as const;

// ========== TYPE DEFINITIONS ==========
export type CollectionName = keyof typeof COLLECTIONS;

export interface CollectionInfo {
  displayName: string;
  basePath: string;
}

// ========== HELPER FUNCTIONS ==========

/**
 * Get collection information by name
 * @param collectionName - Name of the collection
 * @returns Collection metadata
 */
export function getCollectionInfo(
  collectionName: CollectionName
): CollectionInfo {
  return COLLECTIONS[collectionName];
}

/**
 * Resolve content path for a collection and slug
 * @param collectionName - Name of the collection
 * @param slug - Content slug
 * @returns Resolved path
 */
export function resolvePath(
  collectionName: CollectionName,
  slug: string
): string {
  const info = getCollectionInfo(collectionName);
  return `${info.basePath}/${slug}`;
}

// ========== MIGRATION COMPLETED ==========
// All legacy functions have been successfully migrated to Astro-native patterns
// This implementation is now fully optimized and follows Astro best practices
