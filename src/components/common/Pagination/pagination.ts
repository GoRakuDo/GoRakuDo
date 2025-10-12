// ========== PAGINATION UTILITIES (2025 Astro Native) ==========
import type { CollectionEntry } from 'astro:content';
import { buildCloudinaryUrl } from '../../../utils/cloudinary';

// ========== TYPES ==========
export interface PaginationConfig {
  postsPerPage: number;
  currentPage: number;
  totalPosts: number;
}

export interface PaginationResult<T> {
  paginatedItems: T[];
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface PostData {
  slug: string;
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  emoji?: string;
  tags: string[];
  category: string;
  isRecommended: boolean;
  isBeginner: boolean;
  isTool: boolean;
}

export interface ToolArticleData {
  slug: string;
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  tags: string[];
  toolName: string;
  devicePlatform: string;
  image?: string;
  hasImage: boolean;
}

// ========== PAGINATION LOGIC ==========
export function calculatePagination<T>(
  items: T[],
  config: PaginationConfig
): PaginationResult<T> {
  const { postsPerPage, currentPage, totalPosts } = config;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = Math.min(startIndex + postsPerPage, totalPosts);

  return {
    paginatedItems: items.slice(startIndex, endIndex),
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex,
    endIndex,
  };
}

// ========== POST TRANSFORMATION ==========
export function transformPostData(
  post: CollectionEntry<'docs'>,
  baseUrl = '/docs'
): PostData {
  const primaryCategory = post.data.categories?.[0] || 'general';

  return {
    slug: post.slug,
    title: post.data.title,
    description: post.data.description || '',
    url: `${baseUrl}/${post.slug}`,
    publishedDate: post.data.publishedDate,
    emoji: post.data.emoji,
    tags: post.data.tags || [],
    category: primaryCategory,
    isRecommended: false,
    isBeginner: primaryCategory === 'getting-started',
    isTool: primaryCategory === 'tools',
  };
}

// ========== TOOL ARTICLE TRANSFORMATION ==========
export function transformToolArticleData(
  article: CollectionEntry<'tool-articles'>,
  toolName: string
): ToolArticleData {
  const articleSlug = article.slug?.split('/').slice(1).join('/') || article.id;
  const displayTags = article.data.tags?.slice(0, 3) || [];
  const articleImage = article.data.featuredImage ? buildCloudinaryUrl(article.data.featuredImage) : undefined;

  return {
    slug: articleSlug,
    title: article.data.title,
    description: article.data.description,
    url: `/tools/${toolName}/${articleSlug}`,
    publishedDate: article.data.publishedDate,
    tags: displayTags,
    toolName: article.data.toolName,
    devicePlatform: article.data.devicePlatform || 'Windows',
    image: articleImage,
    hasImage: Boolean(articleImage?.trim()),
  };
}

// ========== SEO UTILITIES ==========
export function generatePageMetadata(
  baseTitle: string,
  baseDescription: string,
  currentPage: number,
  totalPages: number
) {
  const isFirstPage = currentPage === 1;

  return {
    title: isFirstPage ? baseTitle : `Halaman ${currentPage} - ${baseTitle}`,
    description: isFirstPage
      ? baseDescription
      : `${baseDescription} (Halaman ${currentPage}/${totalPages})`,
    canonicalUrl: isFirstPage
      ? 'https://gorakudo.org/docs'
      : `https://gorakudo.org/docs/page-${currentPage}`,
  };
}

// ========== STRUCTURED DATA ==========
export function generateStructuredData(
  pageTitle: string,
  pageDescription: string,
  canonicalUrl: string,
  posts: PostData[],
  currentPage: number,
  totalPages: number,
  totalPosts: number,
  startIndex: number,
  author: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalPosts,
      itemListElement: posts.map((post, index) => ({
        '@type': 'Article',
        position: startIndex + index + 1,
        name: post.title,
        description: post.description,
        url: `https://gorakudo.org${post.url}`,
        datePublished: post.publishedDate,
        author: { '@type': 'Organization', name: author },
      })),
    },
    pagination: {
      '@type': 'CollectionPage',
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}

// ========== VALIDATION UTILITIES ==========
export function validatePageNumber(page: string | undefined): number {
  const pageNum = parseInt(page || '1');
  return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
}

export function shouldRedirectToFirstPage(
  currentPage: number,
  totalPages: number
): boolean {
  return currentPage > totalPages && totalPages > 0;
}
