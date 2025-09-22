import { getCollection, type CollectionEntry } from 'astro:content';
import {
  calculatePagination,
  transformPostData,
  generateStructuredData,
  type PaginationConfig,
} from '../components/common/Pagination/pagination';
import { getVisibleDocs } from './content/PostStatus-Filter';

// ========== CONSTANTS ==========
export const POSTS_PER_PAGE = 6;

// ========== TYPES ==========
// Use the existing PostData type from pagination.ts
import type { PostData } from '../components/common/Pagination/pagination';

export interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  mainEntity: {
    '@type': string;
    numberOfItems: number;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      description: string;
      url: string;
      datePublished: string;
      author: {
        '@type': string;
        name: string;
      };
    }>;
  };
  pagination: {
    '@type': string;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface DocsPageData {
  transformedPosts: PostData[];
  totalPages: number;
  totalPosts: number;
  startIndex: number;
  seoConfig: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    canonicalUrl: string;
  };
  structuredData: StructuredData;
}

// ========== MAIN FUNCTION ==========
export async function getDocsPageData(currentPage: number): Promise<DocsPageData> {
  // コンテンツ取得とフィルタリング
  const allPosts = await getCollection('docs');
  const visiblePosts = getVisibleDocs(allPosts);

  // 公開日でフィルタリング（未来の日付は除外）
  const filteredPosts = visiblePosts.filter(
    (post) =>
      post.data.publishedDate &&
      new Date(post.data.publishedDate) <= new Date()
  );

  // 公開日順でソート
  const sortedPosts = filteredPosts.sort(
    (a: CollectionEntry<'docs'>, b: CollectionEntry<'docs'>) =>
      new Date(b.data.publishedDate).getTime() -
      new Date(a.data.publishedDate).getTime()
  );

  // ページネーション処理
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const paginationConfig: PaginationConfig = {
    postsPerPage: POSTS_PER_PAGE,
    currentPage,
    totalPosts: sortedPosts.length,
  };

  const paginationResult = calculatePagination(sortedPosts, paginationConfig);
  const { paginatedItems, startIndex } = paginationResult;

  // データ変換
  const transformedPosts = paginatedItems.map((post: CollectionEntry<'docs'>) =>
    transformPostData(post, '/docs')
  );

  // SEO設定
  const seoConfig = {
    title: 'Dokumentasi & Panduan',
    description:
      'Panduan lengkap untuk memulai perjalanan immersion bahasa Jepang Anda. Dari langkah pertama hingga tingkat lanjut.',
    keywords: [
      'dokumentasi',
      'panduan',
      'tutorial',
      'jepang',
      'belajar',
      'immersion',
    ],
    author: 'Tim GoRakuDo',
    canonicalUrl: currentPage === 1
      ? 'https://gorakudo.org/docs'
      : `https://gorakudo.org/docs/page-${currentPage}`,
  };

  // 構造化データ
  const structuredData = generateStructuredData(
    seoConfig.title,
    seoConfig.description,
    seoConfig.canonicalUrl,
    transformedPosts,
    currentPage,
    totalPages,
    sortedPosts.length,
    startIndex,
    seoConfig.author
  );

  return {
    transformedPosts,
    totalPages,
    totalPosts: sortedPosts.length,
    startIndex,
    seoConfig,
    structuredData,
  };
}
