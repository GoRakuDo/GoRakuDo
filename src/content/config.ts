import { defineCollection, z } from 'astro:content';

// 設定定数
const LIMITS = {
  TITLE_MAX: 180,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 280,
  AUTHOR_MAX: 50,
  CATEGORY_MAX: 30,
  TAG_MAX: 20,
  KEYWORD_MAX: 60,
  CATEGORIES_MAX: 5,
  TAGS_MAX: 10,
  KEYWORDS_MAX: 15,
} as const;

const DEFAULTS = {
  AUTHOR: 'Tim GoRakuDo',
  STATUS: 'draft' as const,
} as const;

// ドキュメントコレクション（MDX対応）
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(LIMITS.TITLE_MAX),
    description: z.string().min(LIMITS.DESCRIPTION_MIN).max(LIMITS.DESCRIPTION_MAX),
    publishedDate: z.string(),
    author: z.string().max(LIMITS.AUTHOR_MAX).default(DEFAULTS.AUTHOR),
    emoji: z.string().regex(/^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u).optional(),
    categories: z.array(z.string().max(LIMITS.CATEGORY_MAX)).min(1).max(LIMITS.CATEGORIES_MAX).default(['general']),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string().max(LIMITS.KEYWORD_MAX)).max(LIMITS.KEYWORDS_MAX).default([]),
    learningResourceType: z.union([z.string().max(50), z.array(z.string().max(50))]).optional(),
    educationalLevel: z.union([z.string().max(50), z.array(z.string().max(50))]).optional(),
    faq: z.array(z.object({
      question: z.string().max(200),
      answer: z.string().max(1000),
    })).max(20).optional(),
    about: z.union([
      z.string().max(200),
      z.array(z.object({
        type: z.string().max(30),
        name: z.string().max(100),
        description: z.string().max(300).optional(),
        sameAs: z.string().url().optional(),
      }))
    ]).optional(),
    mentions: z.union([
      z.array(z.string().max(100)),
      z.array(z.object({
        type: z.string().max(30),
        name: z.string().max(100),
        sameAs: z.string().url().optional(),
      }))
    ]).optional(),
    citation: z.array(z.object({
      type: z.string().max(50),
      author: z.union([z.string().max(100), z.array(z.string().max(100))]).optional(),
      datePublished: z.string().max(20).optional(),
      name: z.string().max(300).optional(),
      headline: z.string().max(300).optional(),
      description: z.string().max(500).optional(),
      url: z.string().url().optional(),
      isPartOf: z.object({
        type: z.string().max(50),
        name: z.string().max(200),
      }).optional(),
    })).max(20).optional(),
    status: z.enum(['published', 'draft', 'archived']).default(DEFAULTS.STATUS),
    featuredImage: z.string().optional(),
  }),
});

// ページコレクション（MDX対応）
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(LIMITS.TITLE_MAX),
    description: z.string().min(LIMITS.DESCRIPTION_MIN).max(LIMITS.DESCRIPTION_MAX),
    publishedDate: z.string(),
    author: z.string().max(LIMITS.AUTHOR_MAX).default(DEFAULTS.AUTHOR),
    status: z.enum(['published', 'draft', 'archived']).default(DEFAULTS.STATUS),
  }),
});

// ツール記事コレクション（MDX対応）
const toolArticlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(LIMITS.TITLE_MAX),
    description: z.string().min(LIMITS.DESCRIPTION_MIN).max(LIMITS.DESCRIPTION_MAX),
    publishedDate: z.string(),
    author: z.string().max(LIMITS.AUTHOR_MAX).default(DEFAULTS.AUTHOR),
    toolName: z.string().min(1).max(50),
    icon: z.string().regex(/^\/[a-zA-Z0-9/\-_.]+\.(png|jpg|jpeg|svg|webp)$/).optional(),
    devicePlatform: z.enum(['Android', 'Windows']).default('Windows'),
    categories: z.array(z.string().max(LIMITS.CATEGORY_MAX)).min(1).max(LIMITS.CATEGORIES_MAX).default(['tools']),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string().max(LIMITS.KEYWORD_MAX)).max(LIMITS.KEYWORDS_MAX).default([]),
    relatedTools: z.array(z.string().max(50)).max(10).default([]),
    status: z.enum(['published', 'draft', 'archived']).default(DEFAULTS.STATUS),
    featuredImage: z.string().optional(),
  }),
});

// コレクションのエクスポート
export const collections = {
  docs: docsCollection,
  pages: pagesCollection,
  'tool-articles': toolArticlesCollection,
};
