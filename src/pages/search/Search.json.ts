import { getCollection, type CollectionEntry } from 'astro:content';
import { resolvePath } from '../../utils/collections';
import { logger } from '../../utils/logging/console-logger';
import {
 getVisibleDocs,
 getVisibleToolArticles,
 getVisiblePages,
} from '../../utils/content/PostStatus-Filter';

type ItemType = 'docs' | 'tool-article' | 'page';

interface ComprehensiveSearchItem {
 id: string;
 slug: string;
 title: string;
 description: string;
 pubDate: string;
 content: string;
 fullContent: string;
 tags: string[];
 categories: string[];
 type: ItemType;
 toolName?: string;
 searchableText: string;
 wordCount: number;
 contentLength: number;
 hasCodeBlocks: boolean;
 hasImages: boolean;
 url: string;
 path: string;
}

interface ComprehensiveSearchMetadata {
 totalItems: number;
 docsCount: number;
 toolArticlesCount: number;
 pagesCount: number;
 lastUpdated: string;
 availableCategories: string[];
 availableTags: string[];
 availableTools: string[];
 type: 'comprehensive';
}

interface ComprehensiveSearchResponse {
 metadata: ComprehensiveSearchMetadata;
 data: ComprehensiveSearchItem[];
 filters: {
  category?: string;
  tag?: string;
  tool?: string;
  type?: ItemType;
 };
}

function sanitizeContent(source: string | undefined): string {
 const content = source || '';
 return content
  .replace(/<[^>]*>/g, ' ')
  .replace(/&[^;]+;/g, ' ')
  .replace(/\n+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
}

function toDocsItem(post: CollectionEntry<'docs'>): ComprehensiveSearchItem {
 const fullContent = post.body || '';
 const cleanedContent = sanitizeContent(fullContent);
 return {
  id: `docs-${post.slug}`,
  slug: post.slug,
  title: post.data.title,
  description: post.data.description,
  pubDate: post.data.publishedDate,
  content: cleanedContent,
  fullContent: cleanedContent,
  tags: post.data.tags || [],
  categories: post.data.categories || ['general'],
  type: 'docs',
  searchableText: [
   post.data.title,
   post.data.description,
   cleanedContent,
   ...(post.data.tags || []),
   ...(post.data.categories || []),
  ]
   .filter(Boolean)
   .join(' '),
  wordCount: cleanedContent.split(/\s+/).filter((w) => w.length > 0).length,
  contentLength: cleanedContent.length,
  hasCodeBlocks: fullContent.includes('```'),
  hasImages: fullContent.includes('!['),
  url: (() => {
   try {
    return resolvePath('docs', post.slug);
   } catch (error) {
    logger.log(
     `Failed to resolve docs path for ${post.slug}: ${(error as Error).message}`,
     'warning'
    );
    return `/docs/${post.slug}`;
   }
  })(),
  path: `docs/${post.slug}`,
 };
}

function toToolArticleItem(article: CollectionEntry<'tool-articles'>): ComprehensiveSearchItem {
 const fullContent = article.body || '';
 const cleanedContent = sanitizeContent(fullContent);
 const toolName = article.data.toolName ||
  article.data.tags?.find((tag) => tag && typeof tag === 'string' && /^[a-z]+$/.test(tag)) ||
  'general';

 return {
  id: `tool-${article.slug}`,
  slug: article.slug,
  title: article.data.title,
  description: article.data.description,
  pubDate: article.data.publishedDate,
  content: cleanedContent,
  fullContent: cleanedContent,
  tags: article.data.tags || [],
  categories: ['tools', toolName, ...(article.data.categories || [])],
  type: 'tool-article',
  toolName,
  searchableText: [
   article.data.title,
   article.data.description,
   cleanedContent,
   ...(article.data.tags || []),
   toolName,
   ...(article.data.categories || []),
  ]
   .filter(Boolean)
   .join(' '),
  wordCount: cleanedContent.split(/\s+/).filter((w) => w.length > 0).length,
  contentLength: cleanedContent.length,
  hasCodeBlocks: fullContent.includes('```'),
  hasImages: fullContent.includes('!['),
  url: (() => {
   try {
    return resolvePath('tool-articles', article.slug);
   } catch (error) {
    logger.log(
     `Failed to resolve tool-articles path for ${article.slug}: ${(error as Error).message}`,
     'warning'
    );
    return `/tools/${toolName}/${article.slug}`;
   }
  })(),
  path: `tools/${toolName}/${article.slug}`,
 };
}

function toPageItem(page: CollectionEntry<'pages'>): ComprehensiveSearchItem {
 const fullContent = page.body || '';
 const cleanedContent = sanitizeContent(fullContent);
 return {
  id: `page-${page.slug}`,
  slug: page.slug,
  title: page.data.title || page.slug,
  description: page.data.description || '',
  pubDate: page.data.publishedDate || new Date().toISOString(),
  content: cleanedContent,
  fullContent: cleanedContent,
  tags: [],
  categories: ['pages'],
  type: 'page',
  searchableText: [
   page.data.title || page.slug,
   page.data.description || '',
   cleanedContent,
  ]
   .filter(Boolean)
   .join(' '),
  wordCount: cleanedContent.split(/\s+/).filter((w) => w.length > 0).length,
  contentLength: cleanedContent.length,
  hasCodeBlocks: fullContent.includes('```'),
  hasImages: fullContent.includes('!['),
  url: (() => {
   try {
    return resolvePath('pages', page.slug);
   } catch (error) {
    logger.log(
     `Failed to resolve pages path for ${page.slug}: ${(error as Error).message}`,
     'warning'
    );
    return `/${page.slug}`;
   }
  })(),
  path: page.slug,
 };
}

export async function GET({ url }: { url: URL }): Promise<Response> {
 try {
  logger.startGroup('Comprehensive Search Data Generation');
  logger.log('Generating comprehensive search data from all content collections...', 'info');

  const [allDocs, allToolArticles, allPages] = await Promise.all([
   getCollection('docs'),
   getCollection('tool-articles'),
   getCollection('pages'),
  ]);

  const docs = getVisibleDocs(allDocs);
  const toolArticles = getVisibleToolArticles(allToolArticles);
  const pages = getVisiblePages(allPages);

  logger.log(
   `Found ${docs.length} docs, ${toolArticles.length} tool articles, ${pages.length} pages`,
   'success'
  );

  const comprehensiveData: ComprehensiveSearchItem[] = [
   ...docs.map(toDocsItem),
   ...toolArticles.map(toToolArticleItem),
   ...pages.map(toPageItem),
  ];

  const metadata: ComprehensiveSearchMetadata = {
   totalItems: comprehensiveData.length,
   docsCount: docs.length,
   toolArticlesCount: toolArticles.length,
   pagesCount: pages.length,
   lastUpdated: new Date().toISOString(),
   availableCategories: [...new Set(comprehensiveData.flatMap((item) => item.categories))],
   availableTags: [...new Set(comprehensiveData.flatMap((item) => item.tags))],
   availableTools: [
    ...new Set(
     comprehensiveData
      .filter((item) => item.type === 'tool-article' && item.toolName)
      .map((item) => item.toolName as string)
    ),
   ],
   type: 'comprehensive',
  };

  const searchParams = new URLSearchParams(url.search);
  const categoryFilter = searchParams.get('category');
  const tagFilter = searchParams.get('tag');
  const toolFilter = searchParams.get('tool');
  const typeFilter = searchParams.get('type') as ItemType | null;

  let filteredData = comprehensiveData;

  if (categoryFilter) {
   filteredData = filteredData.filter((item) => item.categories.includes(categoryFilter));
  }
  if (tagFilter) {
   filteredData = filteredData.filter((item) => item.tags.includes(tagFilter));
  }
  if (toolFilter) {
   filteredData = filteredData.filter(
    (item) => item.type === 'tool-article' && item.toolName === toolFilter
   );
  }
  if (typeFilter) {
   filteredData = filteredData.filter((item) => item.type === typeFilter);
  }

  logger.log(
   `Generated comprehensive search data for ${filteredData.length} items (${comprehensiveData.length} total)`,
   'success'
  );
  logger.logSummary('Comprehensive Search Data Summary', {
   'Total items': comprehensiveData.length,
   'Filtered items': filteredData.length,
   'Docs items': docs.length,
   'Tool articles': toolArticles.length,
   'Pages': pages.length,
   'Available categories': metadata.availableCategories.length,
   'Available tags': metadata.availableTags.length,
   'Available tools': metadata.availableTools.length,
  });

  const responseData: ComprehensiveSearchResponse = {
   metadata,
   data: filteredData,
   filters: {
    category: categoryFilter || undefined,
    tag: tagFilter || undefined,
    tool: toolFilter || undefined,
    type: typeFilter || undefined,
   },
  };

  logger.endGroup();
  return new Response(JSON.stringify(responseData, null, 2), {
   status: 200,
   headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=1800',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
   },
  });
 } catch (error) {
  logger.log(
   `Error generating comprehensive search data: ${(error as Error).message}`,
   'error'
  );

  return new Response(
   JSON.stringify(
    {
     error: 'Failed to generate comprehensive search data',
     message: (error as Error).message,
     timestamp: new Date().toISOString(),
    },
    null,
    2
   ),
   {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
   }
  );
 }
}


