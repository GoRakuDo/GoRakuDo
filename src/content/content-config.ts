// FIX #129: Content config migration - Moved from /src/utils/ to /src/content/
// ROOT CAUSE: Better organization and alignment with content structure
// SOLUTION: Updated all imports and aligned with actual content themes
// STATUS: ✅ MIGRATED

import type { CollectionEntry } from "astro:content";

/**
 * Content Configuration System
 *
 * This system provides a simple, text-editor-friendly way to manage:
 * - Categories and tags for content organization
 * - Filter buttons and their behavior
 * - Mind map integration
 * - Content recommendations
 * - Search suggestions
 *
 * Edit this file to customize your content organization - no complex UI needed!
 */

export interface ContentCategory {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  keywords: string[];
  priority: number;
  isActive: boolean;
}

export interface ContentTag {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  category: string; // Links to a category
  isActive: boolean;
}

export interface ContentFilter {
  id: string;
  name: string;
  displayName: string;
  type: 'category' | 'tag' | 'custom';
  target: string; // category ID, tag ID, or custom logic
  color: string;
  icon: string;
  description: string;
  isActive: boolean;
  showCount: boolean;
  priority: number;
}

export interface SearchSuggestions {
  enabled: boolean;
  suggestions: string[];
  maxSuggestions: number;
  autoGenerate: boolean;
}

export interface ContentConfig {
  version: string;
  categories: Record<string, ContentCategory>;
  tags: Record<string, ContentTag>;
  filters: Record<string, ContentFilter>;

  search: SearchSuggestions;
  metadata: {
    lastUpdated: string;
    totalCategories: number;
    totalTags: number;
    totalFilters: number;
  };
}

// Main Configuration - EDIT THIS FILE TO CUSTOMIZE YOUR CONTENT!
export const CONTENT_CONFIG: ContentConfig = {
  version: '2.0.0',

  // Categories - Main content organization (aligned with actual content themes)
  categories: {
    getting_started: {
      id: 'getting_started',
      name: 'getting-started',
      displayName: 'Memulai',
      description: 'Getting started guides and tutorials for beginners',
      color: '#3B82F6',
      icon: '🚀',
      keywords: [
        'memulai',
        'getting started',
        'tutorial',
        'guide',
        'awal',
        'perjalanan',
      ],
      priority: 1,
      isActive: true,
    },

    methodology: {
      id: 'methodology',
      name: 'methodology',
      displayName: 'Metodologi',
      description: 'Learning methodology, theory, and immersion philosophy',
      color: '#8B5CF6',
      icon: '🧠',
      keywords: [
        'metodologi',
        'methodology',
        'teori',
        'theory',
        'filosofi',
        'immersion',
      ],
      priority: 2,
      isActive: true,
    },

    tools: {
      id: 'tools',
      name: 'tools',
      displayName: 'Tools',
      description: 'Tools, applications, and resources for Japanese learning',
      color: '#F59E0B',
      icon: '🛠️',
      keywords: ['tools', 'anki', 'aplikasi', 'software', 'resource', 'srs'],
      priority: 3,
      isActive: true,
    },

    content_selection: {
      id: 'content_selection',
      name: 'content-selection',
      displayName: 'Pemilihan Konten',
      description: 'How to choose appropriate content for your level',
      color: '#10B981',
      icon: '📚',
      keywords: [
        'konten',
        'content',
        'selection',
        'pemilihan',
        'anime',
        'manga',
      ],
      priority: 4,
      isActive: true,
    },
  },

  // Tags - Specific content labels (aligned with actual content)
  tags: {
    immersion: {
      id: 'immersion',
      name: 'immersion',
      displayName: 'Immersion',
      description: 'Immersion learning techniques and philosophy',
      color: '#8B5CF6',
      category: 'methodology',
      isActive: true,
    },

    anki: {
      id: 'anki',
      name: 'anki',
      displayName: 'Anki',
      description: 'Anki flashcard system and setup',
      color: '#F59E0B',
      category: 'tools',
      isActive: true,
    },

    beginner: {
      id: 'beginner',
      name: 'beginner',
      displayName: 'Pemula',
      description: 'Content suitable for beginners',
      color: '#10B981',
      category: 'getting_started',
      isActive: true,
    },

    hiragana: {
      id: 'hiragana',
      name: 'hiragana',
      displayName: 'Hiragana',
      description: 'Hiragana writing system',
      color: '#3B82F6',
      category: 'getting_started',
      isActive: true,
    },

    katakana: {
      id: 'katakana',
      name: 'katakana',
      displayName: 'Katakana',
      description: 'Katakana writing system',
      color: '#3B82F6',
      category: 'getting_started',
      isActive: true,
    },

    kanji: {
      id: 'kanji',
      name: 'kanji',
      displayName: 'Kanji',
      description: 'Kanji characters and learning methods',
      color: '#DC2626',
      category: 'getting_started',
      isActive: true,
    },

    filosofi: {
      id: 'filosofi',
      name: 'filosofi',
      displayName: 'Filosofi',
      description: 'Philosophical foundations of immersion learning',
      color: '#8B5CF6',
      category: 'methodology',
      isActive: true,
    },

    panduan: {
      id: 'panduan',
      name: 'panduan',
      displayName: 'Panduan',
      description: 'Step-by-step guides and tutorials',
      color: '#10B981',
      category: 'getting_started',
      isActive: true,
    },
  },

  // Filters - What appears in the filter buttons
  filters: {
    all: {
      id: 'all',
      name: 'all',
      displayName: 'Semua',
      type: 'custom',
      target: 'all',
      color: '#6B7280',
      icon: '📚',
      description: 'Show all content',
      isActive: true,
      showCount: true,
      priority: 1,
    },

    getting_started_filter: {
      id: 'getting_started_filter',
      name: 'getting-started',
      displayName: 'Memulai',
      type: 'category',
      target: 'getting_started',
      color: '#3B82F6',
      icon: '🚀',
      description: 'Getting started guides',
      isActive: true,
      showCount: true,
      priority: 2,
    },

    methodology_filter: {
      id: 'methodology_filter',
      name: 'methodology',
      displayName: 'Metodologi',
      type: 'category',
      target: 'methodology',
      color: '#8B5CF6',
      icon: '🧠',
      description: 'Learning methodology',
      isActive: true,
      showCount: true,
      priority: 3,
    },

    tools_filter: {
      id: 'tools_filter',
      name: 'tools',
      displayName: 'Tools',
      type: 'category',
      target: 'tools',
      color: '#F59E0B',
      icon: '🛠️',
      description: 'Tools and resources',
      isActive: true,
      showCount: true,
      priority: 4,
    },

    content_selection_filter: {
      id: 'content_selection_filter',
      name: 'content-selection',
      displayName: 'Pemilihan Konten',
      type: 'category',
      target: 'content_selection',
      color: '#10B981',
      icon: '📚',
      description: 'Content selection guides',
      isActive: true,
      showCount: true,
      priority: 5,
    },
  },

  // Search Suggestions - Based on actual content themes
  search: {
    enabled: true,
    suggestions: [
      'immersion',
      'anki',
      'memulai',
      'filosofi',
      'panduan',
      'hiragana',
      'katakana',
      'kanji',
      'pemula',
      'metodologi',
      'tools',
      'konten',
    ],
    maxSuggestions: 6,
    autoGenerate: true,
  },

  // Metadata - Will be calculated automatically
  metadata: {
    lastUpdated: new Date().toISOString(),
    totalCategories: 0, // Will be calculated automatically
    totalTags: 0, // Will be calculated automatically
    totalFilters: 0, // Will be calculated automatically
  },
};

// Utility functions for content configuration
export const ContentConfigUtils = {
  /**
   * Get all active categories
   */
  getActiveCategories(): ContentCategory[] {
    return Object.values(CONTENT_CONFIG.categories).filter(cat => cat.isActive);
  },

  /**
   * Get all active tags
   */
  getActiveTags(): ContentTag[] {
    return Object.values(CONTENT_CONFIG.tags).filter(tag => tag.isActive);
  },

  /**
   * Get all active filters
   */
  getActiveFilters(): ContentFilter[] {
    return Object.values(CONTENT_CONFIG.filters).filter(
      filter => filter.isActive
    );
  },

  /**
   * Get filters sorted by priority
   */
  getSortedFilters(): ContentFilter[] {
    return this.getActiveFilters().sort((a, b) => a.priority - b.priority);
  },

  /**
   * Get category by ID
   */
  getCategory(id: string): ContentCategory | undefined {
    return CONTENT_CONFIG.categories[id];
  },

  /**
   * Get tag by ID
   */
  getTag(id: string): ContentTag | undefined {
    return CONTENT_CONFIG.tags[id];
  },

  /**
   * Get filter by ID
   */
  getFilter(id: string): ContentFilter | undefined {
    return CONTENT_CONFIG.filters[id];
  },

  /**
   * Get tags by category
   */
  getTagsByCategory(categoryId: string): ContentTag[] {
    return this.getActiveTags().filter(tag => tag.category === categoryId);
  },

  /**
   * Get search suggestions
   */
  getSearchSuggestions(): string[] {
    if (!CONTENT_CONFIG.search.enabled) return [];

    if (CONTENT_CONFIG.search.autoGenerate) {
      // Auto-generate from active tags and categories
      const tagNames = this.getActiveTags().map(tag => tag.name);
      const categoryNames = this.getActiveCategories().map(cat => cat.name);
      return [...tagNames, ...categoryNames].slice(
        0,
        CONTENT_CONFIG.search.maxSuggestions
      );
    }

    return CONTENT_CONFIG.search.suggestions.slice(
      0,
      CONTENT_CONFIG.search.maxSuggestions
    );
  },

  /**
   * Count posts by category
   */
  countPostsByCategory(posts: CollectionEntry<"docs">[], categoryId: string): number {
    return posts.filter(post => {
      const category = this.getCategory(categoryId);
      if (!category) return false;

      // Check if post matches category keywords
      return category.keywords.some(
        keyword =>
          post.data.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          post.data.description
            ?.toLowerCase()
            .includes(keyword.toLowerCase()) ||
          post.data.category === category.name ||
          post.data.contentType === category.name
      );
    }).length;
  },

  /**
   * Count posts by tag
   */
  countPostsByTag(posts: CollectionEntry<"docs">[], tagId: string): number {
    return posts.filter(post => {
      const tag = this.getTag(tagId);
      if (!tag) return false;

      return (
        post.data.tags?.some(
          (postTag: string) => postTag.toLowerCase() === tag.name.toLowerCase()
        ) || false
      );
    }).length;
  },

  /**
   * Filter posts by category
   */
  filterPostsByCategory(posts: CollectionEntry<"docs">[], categoryId: string): CollectionEntry<"docs">[] {
    const category = this.getCategory(categoryId);
    if (!category) return [];

    return posts.filter(post =>
      category.keywords.some(
        keyword =>
          post.data.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          post.data.description
            ?.toLowerCase()
            .includes(keyword.toLowerCase()) ||
          post.data.category === category.name ||
          post.data.contentType === category.name
      )
    );
  },

  /**
   * Filter posts by tag
   */
  filterPostsByTag(posts: CollectionEntry<"docs">[], tagId: string): CollectionEntry<"docs">[] {
    const tag = this.getTag(tagId);
    if (!tag) return [];

    return posts.filter(
      post =>
        post.data.tags?.some(
          (postTag: string) => postTag.toLowerCase() === tag.name.toLowerCase()
        ) || false
    );
  },

  /**
   * Filter posts by mind map branch - REMOVED: MindMap functionality deprecated
   */
  // filterPostsByMindMapBranch(posts: any[], branchId: string): any[] {
  //   return posts.filter((post) => post.data.mindMapBranch === branchId);
  // },

  /**
   * Get filter count for display
   */
  getFilterCount(posts: CollectionEntry<"docs">[], filter: ContentFilter): number {
    switch (filter.type) {
      case 'category':
        return this.countPostsByCategory(posts, filter.target);
      case 'tag':
        return this.countPostsByTag(posts, filter.target);

      case 'custom':
        if (filter.target === 'all') return posts.length;
        return 0;
      default:
        return 0;
    }
  },

  /**
   * Apply filter to posts
   */
  applyFilter(posts: CollectionEntry<"docs">[], filter: ContentFilter): CollectionEntry<"docs">[] {
    switch (filter.type) {
      case 'category':
        return this.filterPostsByCategory(posts, filter.target);
      case 'tag':
        return this.filterPostsByTag(posts, filter.target);

      case 'custom':
        if (filter.target === 'all') return posts;
        return [];
      default:
        return [];
    }
  },

  /**
   * Validate configuration
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check categories
    Object.entries(CONTENT_CONFIG.categories).forEach(([id, category]) => {
      if (!category.name || !category.displayName) {
        errors.push(`Category ${id}: Missing required fields`);
      }
    });

    // Check tags
    Object.entries(CONTENT_CONFIG.tags).forEach(([id, tag]) => {
      if (!tag.name || !tag.displayName) {
        errors.push(`Tag ${id}: Missing required fields`);
      }
      if (!CONTENT_CONFIG.categories[tag.category]) {
        errors.push(`Tag ${id}: Invalid category reference '${tag.category}'`);
      }
    });

    // Check filters
    Object.entries(CONTENT_CONFIG.filters).forEach(([id, filter]) => {
      if (!filter.name || !filter.displayName) {
        errors.push(`Filter ${id}: Missing required fields`);
      }

      // Validate filter targets
      switch (filter.type) {
        case 'category':
          if (!CONTENT_CONFIG.categories[filter.target]) {
            errors.push(
              `Filter ${id}: Invalid category target '${filter.target}'`
            );
          }
          break;
        case 'tag':
          if (!CONTENT_CONFIG.tags[filter.target]) {
            errors.push(`Filter ${id}: Invalid tag target '${filter.target}'`);
          }
          break;
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Export configuration for external use
   */
  exportConfig() {
    return {
      ...CONTENT_CONFIG,
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalCategories: Object.keys(CONTENT_CONFIG.categories).length,
        totalTags: Object.keys(CONTENT_CONFIG.tags).length,
        totalFilters: Object.keys(CONTENT_CONFIG.filters).length,
      },
    };
  },

  /**
   * Get current metadata with automatic counting
   */
  getMetadata() {
    return {
      lastUpdated: new Date().toISOString(),
      totalCategories: Object.keys(CONTENT_CONFIG.categories).length,
      totalTags: Object.keys(CONTENT_CONFIG.tags).length,
      totalFilters: Object.keys(CONTENT_CONFIG.filters).length,
    };
  },
};

// Export for use in other files
export default CONTENT_CONFIG;
