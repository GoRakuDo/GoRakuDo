// ========== TOOLS SEARCH DATA JSON ENDPOINT ==========
// Architect Optimization: Tools-only search data for client-side search
// Purpose: Provides search data exclusively from tool-articles content collection
// File: src/pages/tools/ToolsSearch.json.ts

import { getCollection, type CollectionEntry } from 'astro:content';
import { getVisibleToolArticles } from '../../utils/content/PostStatus-Filter';
import { resolvePath } from '../../utils/collections';
import { logger } from '../../utils/logging/console-logger';

// ========== TYPE DEFINITIONS ==========
interface ToolsSearchItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  content: string;
  fullContent: string;
  tags: string[];
  categories: string[];
  type: 'tool-article';
  toolName: string;
  searchableText: string;
  wordCount: number;
  contentLength: number;
  hasCodeBlocks: boolean;
  hasImages: boolean;
  url: string;
}

interface ToolsSearchMetadata {
  totalItems: number;
  toolArticlesCount: number;
  lastUpdated: string;
  availableTools: string[];
  availableCategories: string[];
  type: 'tools-only';
}

interface ToolsSearchResponse {
  metadata: ToolsSearchMetadata;
  data: ToolsSearchItem[];
  filters: {
    tool?: string;
    category?: string;
  };
}

// ========== DYNAMIC TOOL NAME EXTRACTION ==========
/**
 * Extracts unique tool names from content collection tags
 * Astro-native approach: Dynamic tool name discovery
 */
function extractToolNamesFromCollection(
  articles: CollectionEntry<'tool-articles'>[]
): string[] {
  const toolNames = new Set<string>();

  articles.forEach(article => {
    if (article.data.tags) {
      article.data.tags.forEach(tag => {
        // Only include tags that look like tool names (lowercase, no spaces)
        if (tag && typeof tag === 'string' && /^[a-z]+$/.test(tag)) {
          toolNames.add(tag);
        }
      });
    }
  });

  return Array.from(toolNames).sort();
}

/**
 * Validates if a tool name exists in the collection
 * Type-safe validation using dynamic tool names
 */
function isValidToolName(toolName: string, validToolNames: string[]): boolean {
  return validToolNames.includes(toolName);
}

export async function GET({ url }: { url: URL }): Promise<Response> {
  try {
    logger.startGroup('Tools Search Data Generation');
    logger.log('Generating tools-only search data JSON endpoint...', 'info');

    // ========== COLLECT TOOL ARTICLES CONTENT COLLECTION ==========
    const allToolArticles: CollectionEntry<'tool-articles'>[] =
      await getCollection('tool-articles');
    const toolArticles: CollectionEntry<'tool-articles'>[] =
      getVisibleToolArticles(allToolArticles);

    logger.log(`Found ${toolArticles.length} visible tool articles (${allToolArticles.length} total)`, 'success');

    // ========== DYNAMIC TOOL NAME DISCOVERY ==========
    const availableToolNames: string[] =
      extractToolNamesFromCollection(toolArticles);
    logger.log(
      `Discovered tool names: ${availableToolNames.join(', ')}`,
      'info'
    );

    // ========== PROCESS TOOL ARTICLES ==========
    const toolSearchData: ToolsSearchItem[] = toolArticles.map(
      (article: CollectionEntry<'tool-articles'>) => {
        const fullContent: string = article.body || '';
        const cleanedContent: string = fullContent
          .replace(/<[^>]*>/g, ' ')
          .replace(/&[^;]+;/g, ' ')
          .replace(/\n+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Extract tool name from tags with dynamic validation
        const toolName: string =
          article.data.tags?.find((tag: string) =>
            isValidToolName(tag, availableToolNames)
          ) || 'general';

        return {
          // Core data
          id: `tool-${article.slug}`,
          slug: article.slug,
          title: article.data.title,
          description: article.data.description,
          pubDate: article.data.publishedDate,

          // Content
          content: cleanedContent,
          fullContent: cleanedContent,

          // Metadata
          tags: article.data.tags || [],
          categories: ['tools', toolName],
          type: 'tool-article' as const,
          toolName: toolName,

          // Searchable text
          searchableText: [
            article.data.title,
            article.data.description,
            cleanedContent,
            ...(article.data.tags || []),
            toolName,
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
          url: resolvePath('tool-articles', article.slug),
        };
      }
    );

    // ========== ENHANCE TOOLS SEARCH DATA ==========
    const allSearchData: ToolsSearchItem[] = toolSearchData;

    // Add tools search metadata with dynamic tool names
    const searchMetadata: ToolsSearchMetadata = {
      totalItems: allSearchData.length,
      toolArticlesCount: toolSearchData.length,
      lastUpdated: new Date().toISOString(),
      availableTools: availableToolNames,
      availableCategories: [
        ...new Set(
          allSearchData.flatMap((item: ToolsSearchItem) => item.categories)
        ),
      ],
      type: 'tools-only',
    };

    // ========== FILTER BY QUERY PARAMETERS ==========
    const searchParams: URLSearchParams = new URLSearchParams(url.search);
    const toolFilter: string | null = searchParams.get('tool');
    const categoryFilter: string | null = searchParams.get('category');

    let filteredData: ToolsSearchItem[] = allSearchData;

    // Tool filtering - strict matching with dynamic validation
    if (toolFilter) {
      // Validate tool filter against discovered tool names
      if (!isValidToolName(toolFilter, availableToolNames)) {
        logger.log(
          `⚠️ Invalid tool filter: ${toolFilter}. Available tools: ${availableToolNames.join(', ')}`,
          'warning'
        );
        // Return empty results for invalid tool names
        filteredData = [];
      } else {
        filteredData = filteredData.filter((item: ToolsSearchItem) => {
          const isMatch: boolean = item.toolName === toolFilter;
          if (isMatch) {
            logger.log(
              `✅ Tool article matched: ${item.title} (toolName: ${item.toolName})`,
              'info'
            );
          }
          return isMatch;
        });

        logger.log(
          `🔍 Tool filter applied: ${toolFilter}, ${filteredData.length} items remaining`,
          'info'
        );
      }
    }

    // Category filtering for tools
    if (categoryFilter) {
      filteredData = filteredData.filter((item: ToolsSearchItem) =>
        item.categories.includes(categoryFilter)
      );
    }

    // ========== LOGGING AND SUMMARY ==========
    logger.log(
      `Generated tools search data for ${filteredData.length} items (${allSearchData.length} total)`,
      'success'
    );
    logger.logSummary('Tools Search Data Summary', {
      'Total tool items': allSearchData.length,
      'Filtered items': filteredData.length,
      'Available tools': searchMetadata.availableTools.join(', '),
      'Available categories': searchMetadata.availableCategories.join(', '),
      'Total words': allSearchData.reduce(
        (sum: number, item: ToolsSearchItem) => sum + item.wordCount,
        0
      ),
    });

    // Log sample data for troubleshooting
    if (filteredData.length > 0) {
      logger.logContentPreview(
        'Sample filtered tools search data',
        JSON.stringify({
          id: filteredData[0].id,
          title: filteredData[0].title,
          type: filteredData[0].type,
          toolName: filteredData[0].toolName,
          url: filteredData[0].url,
          hasContent: !!filteredData[0].content,
          contentLength: filteredData[0].content?.length || 0,
        })
      );
    }

    // ========== RETURN TOOLS RESPONSE ==========
    const responseData: ToolsSearchResponse = {
      metadata: searchMetadata,
      data: filteredData,
      filters: {
        tool: toolFilter || undefined,
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
      `Error generating tools search data: ${(error as Error).message}`,
      'error'
    );

    return new Response(
      JSON.stringify({
        error: 'Failed to generate tools search data',
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
