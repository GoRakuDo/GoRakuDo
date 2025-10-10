// ========== DOCS SEARCH DATA JSON ENDPOINT ==========
// Architect Optimization: Docs-only search data for client-side search
// Purpose: Provides search data exclusively from docs content collection
// File: src/pages/docs/DocsSearch.json.ts

import { getCollection, type CollectionEntry } from 'astro:content';
import { getVisibleDocs } from '../../utils/content/PostStatus-Filter';
import { resolvePath } from '../../utils/collections';
import { logger } from '../../utils/logging/console-logger';

// ========== TYPE DEFINITIONS ==========
interface DocsSearchItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  emoji?: string;
  content: string;
  fullContent: string;
  tags: string[];
  categories: string[];
  type: 'docs';
  searchableText: string;
  wordCount: number;
  contentLength: number;
  hasCodeBlocks: boolean;
  hasImages: boolean;
  url: string;
}

interface DocsSearchMetadata {
  totalItems: number;
  docsCount: number;
  lastUpdated: string;
  availableCategories: string[];
  type: 'docs-only';
}

interface DocsSearchResponse {
  metadata: DocsSearchMetadata;
  data: DocsSearchItem[];
  filters: {
    category?: string;
  };
}

export async function GET({ url }: { url: URL }): Promise<Response> {
  try {
    logger.startGroup('Docs Search Data Generation');
    logger.log('Generating docs-only search data JSON endpoint...', 'info');

    // ========== COLLECT DOCS CONTENT COLLECTION ==========
    const allDocsPosts: CollectionEntry<'docs'>[] = await getCollection('docs');
    const docsPosts: CollectionEntry<'docs'>[] = getVisibleDocs(allDocsPosts);

    logger.log(`Found ${docsPosts.length} visible docs posts (${allDocsPosts.length} total)`, 'success');

    // ========== PROCESS DOCS POSTS ==========
    const docsSearchData: DocsSearchItem[] = docsPosts.map(
      (post: CollectionEntry<'docs'>) => {
        const fullContent: string = post.body || '';
        const cleanedContent: string = fullContent
          .replace(/<[^>]*>/g, ' ')
          .replace(/&[^;]+;/g, ' ')
          .replace(/\n+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        return {
          // Core data
          id: `docs-${post.slug}`,
          slug: post.slug,
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.publishedDate,
          emoji: post.data.emoji,

          // Content
          content: cleanedContent,
          fullContent: cleanedContent,

          // Metadata
          tags: post.data.tags || [],
          categories: post.data.categories || ['general'],
          type: 'docs' as const,

          // Searchable text
          searchableText: [
            post.data.title,
            post.data.description,
            cleanedContent,
            ...(post.data.tags || []),
            ...(post.data.categories || []),
          ]
            .filter(Boolean)
            .join(' '),

          // Analysis
          wordCount: cleanedContent
            .split(/\s+/)
            .filter((word: string) => word.length > 0).length,
          contentLength: cleanedContent.length,

          // Features
          hasCodeBlocks: fullContent.includes('```'),
          hasImages: fullContent.includes('!['),

          // URL
          url: resolvePath('docs', post.slug),
        };
      }
    );

    // ========== ENHANCE DOCS SEARCH DATA ==========
    const allSearchData: DocsSearchItem[] = docsSearchData;

    // Add docs search metadata
    const searchMetadata: DocsSearchMetadata = {
      totalItems: allSearchData.length,
      docsCount: docsSearchData.length,
      lastUpdated: new Date().toISOString(),
      availableCategories: [
        ...new Set(
          allSearchData.flatMap((item: DocsSearchItem) => item.categories)
        ),
      ],
      type: 'docs-only',
    };

    // ========== FILTER BY QUERY PARAMETERS ==========
    const searchParams: URLSearchParams = new URLSearchParams(url.search);
    const categoryFilter: string | null = searchParams.get('category');

    let filteredData: DocsSearchItem[] = allSearchData;

    // Category filtering for docs only
    if (categoryFilter) {
      filteredData = filteredData.filter((item: DocsSearchItem) =>
        item.categories.includes(categoryFilter)
      );
    }

    // ========== LOGGING AND SUMMARY ==========
    logger.log(
      `Generated docs search data for ${filteredData.length} items (${allSearchData.length} total)`,
      'success'
    );
    logger.logSummary('Docs Search Data Summary', {
      'Total docs items': allSearchData.length,
      'Filtered items': filteredData.length,
      'Available categories': searchMetadata.availableCategories.join(', '),
      'Total words': allSearchData.reduce(
        (sum: number, item: DocsSearchItem) => sum + item.wordCount,
        0
      ),
    });

    // Log sample data for troubleshooting
    if (filteredData.length > 0) {
      logger.logContentPreview(
        'Sample filtered docs search data',
        JSON.stringify({
          id: filteredData[0].id,
          title: filteredData[0].title,
          type: filteredData[0].type,
          url: filteredData[0].url,
          hasContent: !!filteredData[0].content,
          contentLength: filteredData[0].content?.length || 0,
        })
      );
    }

    // ========== RETURN DOCS RESPONSE ==========
    const responseData: DocsSearchResponse = {
      metadata: searchMetadata,
      data: filteredData,
      filters: {
        category: categoryFilter || undefined,
      },
    };

    logger.endGroup();
    return new Response(JSON.stringify(responseData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    logger.log(
      `Error generating docs search data: ${(error as Error).message}`,
      'error'
    );

    return new Response(
      JSON.stringify({
        error: 'Failed to generate docs search data',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
