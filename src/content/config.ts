import { defineCollection, z } from 'astro:content';

// 設定定数
const LIMITS = {
  TITLE_MAX: 180,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 280,
  AUTHOR_MAX: 50,
  CATEGORY_MAX: 30,
  TAG_MAX: 20,
  CATEGORIES_MAX: 5,
  TAGS_MAX: 10,
} as const;

const DEFAULTS = {
  AUTHOR: 'Tim GoRakuDo',
  STATUS: 'draft' as const,
} as const;

// ドキュメントコレクション
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(LIMITS.TITLE_MAX),
    description: z.string().min(LIMITS.DESCRIPTION_MIN).max(LIMITS.DESCRIPTION_MAX),
    publishedDate: z.string().datetime(),
    author: z.string().max(LIMITS.AUTHOR_MAX).default(DEFAULTS.AUTHOR),
    emoji: z.string().regex(/^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u).optional(),
    categories: z.array(z.string().max(LIMITS.CATEGORY_MAX)).min(1).max(LIMITS.CATEGORIES_MAX).default(['general']),
    tags: z.array(z.string().max(LIMITS.TAG_MAX)).max(LIMITS.TAGS_MAX).default([]),
    status: z.enum(['published', 'draft', 'archived']).default(DEFAULTS.STATUS),
    // 自動認識画像フィールド
    autoImages: z.array(z.object({
      src: z.string(),
      alt: z.string().optional(),
      title: z.string().optional(),
      order: z.number().optional(),
    })).optional(),
    featuredImage: z.string().optional(),
  }).transform((data) => ({
    ...data,
    // autoImagesのaltとtitleに記事タイトルをデフォルト設定
    autoImages: data.autoImages?.map(image => ({
      ...image,
      alt: image.alt || data.title,
      title: image.title || data.title,
    })),
  })),
});

// ページコレクション
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(LIMITS.TITLE_MAX),
    description: z.string().min(LIMITS.DESCRIPTION_MIN).max(LIMITS.DESCRIPTION_MAX),
    publishedDate: z.string().datetime(),
    author: z.string().max(LIMITS.AUTHOR_MAX).default(DEFAULTS.AUTHOR),
    status: z.enum(['published', 'draft', 'archived']).default(DEFAULTS.STATUS),
  }),
});

// ツール記事コレクション
const toolArticlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(LIMITS.TITLE_MAX),
    description: z.string().min(LIMITS.DESCRIPTION_MIN).max(LIMITS.DESCRIPTION_MAX),
    publishedDate: z.string().datetime(),
    updatedDate: z.string().datetime().optional(),
    author: z.string().max(LIMITS.AUTHOR_MAX).default(DEFAULTS.AUTHOR),
    toolName: z.string().min(1).max(50),
    icon: z.string().regex(/^\/[a-zA-Z0-9/\-_.]+\.(png|jpg|jpeg|svg|webp)$/).optional(),
    categories: z.array(z.string().max(LIMITS.CATEGORY_MAX)).min(1).max(LIMITS.CATEGORIES_MAX).default(['tools']),
    tags: z.array(z.string().max(20)).max(10).default([]),
    keywords: z.array(z.string().max(30)).max(15).default([]),
    relatedTools: z.array(z.string().max(50)).max(10).default([]),
    status: z.enum(['published', 'draft', 'archived']).default(DEFAULTS.STATUS),
    // 自動認識画像フィールド
    autoImages: z.array(z.object({
      src: z.string(),
      alt: z.string().optional(),
      title: z.string().optional(),
      order: z.number().optional(),
    })).optional(),
    featuredImage: z.string().optional(),
  }).transform((data) => ({
    ...data,
    // autoImagesのaltとtitleに記事タイトルをデフォルト設定
    autoImages: data.autoImages?.map(image => ({
      ...image,
      alt: image.alt || data.title,
      title: image.title || data.title,
    })),
  })),
});

// コレクションのエクスポート
export const collections = {
  docs: docsCollection,
  pages: pagesCollection,
  'tool-articles': toolArticlesCollection,
};
