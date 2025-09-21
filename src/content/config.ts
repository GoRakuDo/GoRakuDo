import { defineCollection, z } from 'astro:content';

/**
 * ========================================
 * GoRakuDo Content Collections 設定ファイル
 * ========================================
 *
 * このファイルは、GoRakuDoサイトのコンテンツ管理システムの設定です。
 * 非技術者のスタッフでも安全に変更できるよう、詳細な説明を記載しています。
 *
 * 📋 変更時の注意事項：
 * 1. 既存のコンテンツに影響する変更は慎重に行ってください
 * 2. 変更後は必ずビルドテストを実行してください
 * 3. 不明な点があれば技術チームに相談してください
 *
 * 🔧 よく変更される設定：
 * - デフォルト値（.default()の部分）
 * - 文字数制限（.min()や.max()の数値）
 * - 選択肢（.enum()の配列）
 *
 * ========================================
 */

// ========================================
// 設定定数（よく変更される値）
// ========================================

// 文字数制限設定
const LIMITS = {
  TITLE_MIN: 1, // タイトルの最小文字数
  TITLE_MAX: 180, // タイトルの最大文字数
  DESCRIPTION_MIN: 10, // 説明の最小文字数
  DESCRIPTION_MAX: 280, // 説明の最大文字数
  AUTHOR_MAX: 50, // 作者名の最大文字数
  CATEGORY_MAX: 30, // カテゴリ名の最大文字数
  TAG_MAX: 20, // タグ名の最大文字数
  CATEGORIES_MAX: 5, // カテゴリの最大個数
  TAGS_MAX: 10, // タグの最大個数
} as const;

// デフォルト値設定
const DEFAULTS = {
  AUTHOR: 'Tim GoRakuDo', // デフォルトの作者名
  VERSION: '1.0.0', // デフォルトのバージョン
  STATUS: 'published' as const, // デフォルトの公開状態
  CONTENT_TYPE: 'resource' as const, // デフォルトのコンテンツタイプ
} as const;

// ========================================
// Optimized Content Schema for Indonesian Immersion Learning
// ========================================
/**
 * 📚 ドキュメントコレクション（docs）
 *
 * 用途：ブログ記事、ガイド、チュートリアルなどのメインコンテンツ
 * 場所：src/content/docs/ フォルダ内のMarkdownファイル
 *
 * 必須フィールド：
 * - title: 記事のタイトル
 * - description: 記事の説明（SEO用）
 * - publishedDate: 公開日（ISO形式：2024-01-01T00:00:00.000Z）
 *
 * よく使用されるフィールド：
 * - categories: 記事の分類（例：['getting-started', 'tools']）
 * - tags: 記事のタグ（例：['anki', 'srs', 'flashcards']）
 * - emoji: 記事のアイコン絵文字（例：'📚'）
 */
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // ========================================
    // 基本情報（必須）
    // ========================================

    /** 記事のタイトル（1-100文字） */
    title: z
      .string()
      .min(LIMITS.TITLE_MIN, { message: 'タイトルは1文字以上入力してください' })
      .max(LIMITS.TITLE_MAX, {
        message: `タイトルは${LIMITS.TITLE_MAX}文字以内で入力してください`,
      }),

    /** 記事の説明（10-200文字、SEO用） */
    description: z
      .string()
      .min(LIMITS.DESCRIPTION_MIN, {
        message: '説明は10文字以上入力してください',
      })
      .max(LIMITS.DESCRIPTION_MAX, {
        message: `説明は${LIMITS.DESCRIPTION_MAX}文字以内で入力してください`,
      }),

    /** 公開日（ISO形式：2024-01-01T00:00:00.000Z） */
    publishedDate: z.string().datetime({
      message:
        '公開日は正しい日付形式で入力してください（例：2024-01-01T00:00:00.000Z）',
    }),

    /** 作者名（デフォルト：Tim GoRakuDo） */
    author: z
      .string()
      .min(1, { message: '作者名を入力してください' })
      .max(LIMITS.AUTHOR_MAX, {
        message: `作者名は${LIMITS.AUTHOR_MAX}文字以内で入力してください`,
      })
      .default(DEFAULTS.AUTHOR),

    /** 記事のアイコン絵文字（任意） */
    emoji: z
      .string()
      .regex(
        /^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u,
        { message: '絵文字のみを入力してください（例：📚、🚀、💡）' }
      )
      .optional(),

    // ========================================
    // 分類・タグ（コンテンツ整理用）
    // ========================================

    /** 記事のカテゴリ（1-5個、各30文字以内） */
    categories: z
      .array(
        z
          .string()
          .min(1, { message: 'カテゴリ名を入力してください' })
          .max(LIMITS.CATEGORY_MAX, {
            message: `カテゴリ名は${LIMITS.CATEGORY_MAX}文字以内で入力してください`,
          })
      )
      .min(1, { message: '少なくとも1つのカテゴリを設定してください' })
      .max(LIMITS.CATEGORIES_MAX, {
        message: `カテゴリは${LIMITS.CATEGORIES_MAX}個以内で設定してください`,
      })
      .default(['general']),

    /** 記事のタグ（最大10個、各20文字以内） */
    tags: z
      .array(
        z
          .string()
          .min(1, { message: 'タグ名を入力してください' })
          .max(LIMITS.TAG_MAX, {
            message: `タグ名は${LIMITS.TAG_MAX}文字以内で入力してください`,
          })
      )
      .max(LIMITS.TAGS_MAX, {
        message: `タグは${LIMITS.TAGS_MAX}個以内で設定してください`,
      })
      .default([]),

    // ========================================
    // オプション設定
    // ========================================

    /** 公開状態（published: 公開, draft: 下書き, archived: アーカイブ） */
    status: z
      .enum(['published', 'draft', 'archived'], {
        errorMap: () => ({
          message:
            "公開状態は 'published', 'draft', 'archived' のいずれかを選択してください",
        }),
      })
      .default(DEFAULTS.STATUS),
  }),
});

/**
 * 📄 ページコレクション（pages）
 *
 * 用途：静的ページ（サポートページ、お知らせ、法的ページなど）
 * 場所：src/content/pages/ フォルダ内のMarkdownファイル
 *
 * 必須フィールド：
 * - title: ページのタイトル
 * - description: ページの説明（SEO用）
 * - publishedDate: 公開日
 *
 * よく使用されるフィールド：
 * - contentType: ページの種類（resource, info, legal）
 * - category: ページのカテゴリ
 * - readTime: 読了時間（分）
 */
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // ========================================
    // 基本情報（必須）
    // ========================================

    /** ページのタイトル（1-100文字） */
    title: z
      .string()
      .min(LIMITS.TITLE_MIN, { message: 'タイトルは1文字以上入力してください' })
      .max(LIMITS.TITLE_MAX, {
        message: `タイトルは${LIMITS.TITLE_MAX}文字以内で入力してください`,
      }),

    /** ページの説明（10-200文字、SEO用） */
    description: z
      .string()
      .min(LIMITS.DESCRIPTION_MIN, {
        message: '説明は10文字以上入力してください',
      })
      .max(LIMITS.DESCRIPTION_MAX, {
        message: `説明は${LIMITS.DESCRIPTION_MAX}文字以内で入力してください`,
      }),

    /** 公開日（ISO形式：2024-01-01T00:00:00.000Z） */
    publishedDate: z.string().datetime({
      message:
        '公開日は正しい日付形式で入力してください（例：2024-01-01T00:00:00.000Z）',
    }),

    /** 作者名（デフォルト：Tim GoRakuDo） */
    author: z
      .string()
      .min(1, { message: '作者名を入力してください' })
      .max(LIMITS.AUTHOR_MAX, {
        message: `作者名は${LIMITS.AUTHOR_MAX}文字以内で入力してください`,
      })
      .default(DEFAULTS.AUTHOR),

    // ========================================
    // 分類・タグ
    // ========================================

    /** ページのカテゴリ（デフォルト：general） */
    category: z
      .string()
      .min(1, { message: 'カテゴリ名を入力してください' })
      .max(LIMITS.CATEGORY_MAX, {
        message: `カテゴリ名は${LIMITS.CATEGORY_MAX}文字以内で入力してください`,
      })
      .default('general'),

    /** ページのタグ（最大10個、各20文字以内） */
    tags: z
      .array(
        z
          .string()
          .min(1, { message: 'タグ名を入力してください' })
          .max(LIMITS.TAG_MAX, {
            message: `タグ名は${LIMITS.TAG_MAX}文字以内で入力してください`,
          })
      )
      .max(LIMITS.TAGS_MAX, {
        message: `タグは${LIMITS.TAGS_MAX}個以内で設定してください`,
      })
      .default([]),

    /** おすすめページフラグ（true: おすすめ表示, false: 通常表示） */
    featured: z.boolean().default(false),

    // ========================================
    // ページタイプ設定
    // ========================================

    /** ページの種類 */
    contentType: z
      .enum(['resource', 'info', 'legal'], {
        errorMap: () => ({
          message:
            "ページ種類は 'resource'（リソースページ）, 'info'（情報ページ）, 'legal'（法的ページ）のいずれかを選択してください",
        }),
      })
      .default(DEFAULTS.CONTENT_TYPE),
  }),
});

/**
 * 🛠️ ツール記事コレクション（tool-articles）
 *
 * 用途：学習ツールの紹介・解説記事
 * 場所：src/content/tool-articles/ フォルダ内のMarkdownファイル
 *
 * 必須フィールド：
 * - title: 記事のタイトル
 * - description: 記事の説明
 * - publishedDate: 公開日
 * - toolName: ツール名
 * - toolCategory: ツールのカテゴリ
 *
 * よく使用されるフィールド：
 * - toolVersion: ツールのバージョン
 * - toolWebsite: ツールの公式サイト
 */
const toolArticlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // ========================================
    // 基本情報（必須）
    // ========================================

    /** 記事のタイトル（1-100文字） */
    title: z
      .string()
      .min(LIMITS.TITLE_MIN, { message: 'タイトルは1文字以上入力してください' })
      .max(LIMITS.TITLE_MAX, {
        message: `タイトルは${LIMITS.TITLE_MAX}文字以内で入力してください`,
      }),

    /** 記事の説明（10-200文字、SEO用） */
    description: z
      .string()
      .min(LIMITS.DESCRIPTION_MIN, {
        message: '説明は10文字以上入力してください',
      })
      .max(LIMITS.DESCRIPTION_MAX, {
        message: `説明は${LIMITS.DESCRIPTION_MAX}文字以内で入力してください`,
      }),

    /** 公開日（ISO形式：2024-01-01T00:00:00.000Z） */
    publishedDate: z.string().datetime({
      message:
        '公開日は正しい日付形式で入力してください（例：2024-01-01T00:00:00.000Z）',
    }),

    /** 更新日（ISO形式：2024-01-01T00:00:00.000Z、任意） */
    updatedDate: z
      .string()
      .datetime({
        message:
          '更新日は正しい日付形式で入力してください（例：2024-01-01T00:00:00.000Z）',
      })
      .optional(),

    /** 作者名（デフォルト：Tim GoRakuDo） */
    author: z
      .string()
      .min(1, { message: '作者名を入力してください' })
      .max(LIMITS.AUTHOR_MAX, {
        message: `作者名は${LIMITS.AUTHOR_MAX}文字以内で入力してください`,
      })
      .default(DEFAULTS.AUTHOR),

    // ========================================
    // ツール固有情報（必須）
    // ========================================

    /** ツール名（1-50文字） */
    toolName: z
      .string()
      .min(1, { message: 'ツール名を入力してください' })
      .max(50, { message: 'ツール名は50文字以内で入力してください' }),

    /** ツールのバージョン（例：2.1.66、任意） */
    toolVersion: z
      .string()
      .regex(/^\d+\.\d+(\.\d+)?(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/, {
        message:
          'バージョンは正しい形式で入力してください（例：2.1.66、1.0.0-beta、2.0.0+20240101）',
      })
      .optional(),

    /** ツールの公式サイトURL（任意） */
    toolWebsite: z
      .string()
      .url({
        message: '正しいURL形式で入力してください（例：https://example.com）',
      })
      .optional(),

    /** ツールのカテゴリ（1-30文字、任意のカテゴリ名を設定可能） */
    toolCategory: z
      .string()
      .min(1, { message: 'ツールカテゴリを入力してください' })
      .max(30, { message: 'ツールカテゴリは30文字以内で入力してください' })
      .regex(/^[a-zA-Z0-9\-\s]+$/, {
        message:
          'ツールカテゴリは英数字、ハイフン、スペースのみ使用可能です（例：flashcard, reading-tools, mobile app）',
      }),

    // ========================================
    // 視覚的要素
    // ========================================

    /** ツールのアイコン絵文字（任意） */
    emoji: z
      .string()
      .regex(
        /^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u,
        { message: '絵文字のみを入力してください（例：📚、🚀、💡）' }
      )
      .optional(),

    /** ツールのアイコンファイルパス（任意） */
    icon: z
      .string()
      .regex(/^\/[a-zA-Z0-9/\-_.]+\.(png|jpg|jpeg|svg|webp)$/, {
        message:
          'アイコンパスは正しい形式で入力してください（例：/img/tools/anki-icon.png）',
      })
      .optional(),

    // ========================================
    // 分類・タグ
    // ========================================

    /** ツールのカテゴリ（1-3個、各30文字以内） */
    categories: z
      .array(
        z
          .string()
          .min(1, { message: 'カテゴリ名を入力してください' })
          .max(30, { message: 'カテゴリ名は30文字以内で入力してください' })
      )
      .min(1, { message: '少なくとも1つのカテゴリを設定してください' })
      .max(3, { message: 'カテゴリは3個以内で設定してください' })
      .default(['tools']),

    /** ツールのタグ（最大10個、各20文字以内） */
    tags: z
      .array(
        z
          .string()
          .min(1, { message: 'タグ名を入力してください' })
          .max(20, { message: 'タグ名は20文字以内で入力してください' })
      )
      .max(10, { message: 'タグは10個以内で設定してください' })
      .default([]),

    // ========================================
    // SEO・発見性
    // ========================================

    /** SEOキーワード（最大15個、各30文字以内） */
    keywords: z
      .array(
        z
          .string()
          .min(1, { message: 'キーワードを入力してください' })
          .max(30, { message: 'キーワードは30文字以内で入力してください' })
      )
      .max(15, { message: 'キーワードは15個以内で設定してください' })
      .default([]),

    /** 関連ツール（最大10個、各50文字以内） */
    relatedTools: z
      .array(
        z
          .string()
          .min(1, { message: '関連ツール名を入力してください' })
          .max(50, { message: '関連ツール名は50文字以内で入力してください' })
      )
      .max(10, { message: '関連ツールは10個以内で設定してください' })
      .default([]),
  }),
});

// ========================================
// コレクションのエクスポート
// ========================================

/**
 * 📦 コレクション設定のエクスポート
 *
 * このオブジェクトは、AstroのContent Collectionsシステムに
 * 各コレクションの設定を提供します。
 *
 * 各コレクションの用途：
 * - docs: メインコンテンツ（ブログ記事、ガイドなど）
 * - pages: 静的ページ（サポートページなど）
 * - tool-articles: ツール紹介記事
 *
 * 注意：このオブジェクトの構造を変更する場合は、
 * 既存のコンテンツに影響がないか十分確認してください。
 */
export const collections = {
  docs: docsCollection,
  pages: pagesCollection,
  'tool-articles': toolArticlesCollection,
};

// ========================================
// 設定変更ガイド
// ========================================

/**
 * 🔧 よくある設定変更
 *
 * 1. 文字数制限の変更：
 *    LIMITS オブジェクトの値を変更してください
 *    例：TITLE_MAX: 100 → TITLE_MAX: 150
 *
 * 2. デフォルト値の変更：
 *    DEFAULTS オブジェクトの値を変更してください
 *    例：AUTHOR: 'Tim GoRakuDo' → AUTHOR: '新しい作者名'
 *
 * 3. 選択肢の追加・変更：
 *    z.enum() の配列に項目を追加・削除してください
 *    例：['published', 'draft'] → ['published', 'draft', 'review']
 *
 * 4. 新しいフィールドの追加：
 *    各コレクションのschemaに新しいフィールドを追加してください
 *    例：newField: z.string().optional()
 *
 * ⚠️ 変更時の注意事項：
 * - 既存のコンテンツファイルが新しい設定に準拠しているか確認
 * - 変更後は必ずビルドテストを実行
 * - 破壊的変更の場合は既存コンテンツの更新が必要
 *
 * 📞 サポート：
 * 設定変更で不明な点がある場合は、技術チームにご相談ください。
 */
