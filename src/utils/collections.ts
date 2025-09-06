// Collections Configuration - Astro Native Implementation
// GoRakuDo Project - Simplified and Efficient

// ========== COLLECTION DEFINITIONS ==========
// Centralized configuration for all content collections
// Following Astro best practices with minimal complexity

export const COLLECTIONS = {
  docs: {
    displayName: 'Docs',
    icon: '📚',
    basePath: '/docs'
  },
  'tool-articles': {
    displayName: 'Tools',
    icon: '🛠️',
    basePath: '/tools'
  }
} as const;

// ========== TYPE DEFINITIONS ==========
export type CollectionName = keyof typeof COLLECTIONS;

export interface CollectionInfo {
  displayName: string;
  icon: string;
  basePath: string;
}

// ========== HELPER FUNCTIONS ==========

/**
 * Get collection information by name
 * @param collectionName - Name of the collection
 * @returns Collection metadata
 */
export function getCollectionInfo(collectionName: CollectionName): CollectionInfo {
  return COLLECTIONS[collectionName];
}

/**
 * Resolve content path for a collection and slug
 * @param collectionName - Name of the collection
 * @param slug - Content slug
 * @returns Resolved path
 */
export function resolvePath(collectionName: CollectionName, slug: string): string {
  const info = getCollectionInfo(collectionName);
  return `${info.basePath}/${slug}`;
}

/**
 * Get all available collections
 * @returns Array of all collection configurations
 */
export function getAllCollections(): Array<{ name: CollectionName; info: CollectionInfo }> {
  return Object.entries(COLLECTIONS).map(([name, info]) => ({
    name: name as CollectionName,
    info
  }));
}

// ========== MIGRATION COMPLETED ==========
// All legacy functions have been successfully migrated to Astro-native patterns
// This implementation is now fully optimized and follows Astro best practices
