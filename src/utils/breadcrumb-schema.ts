/**
 * Breadcrumb Schema Generator
 * 
 * UnifiedSEO.astroで使用するためのBreadcrumb構造化データ生成ユーティリティ
 * 
 * 使用例:
 * ```typescript
 * import { generateBreadcrumbSchema } from '../utils/breadcrumb-schema';
 * 
 * const breadcrumbSchema = generateBreadcrumbSchema({
 *   items: [
 *     { title: 'ホーム', url: '/', isActive: false },
 *     { title: 'ブログ', url: '/blog', isActive: false },
 *     { title: '記事タイトル', url: '/blog/article', isActive: true }
 *   ],
 *   siteUrl: 'https://gorakudo.org'
 * });
 * ```
 */

export interface BreadcrumbSchemaItem {
 readonly title: string;
 readonly url: string;
 readonly isActive: boolean;
}

export interface BreadcrumbSchemaConfig {
 readonly items: readonly BreadcrumbSchemaItem[];
 readonly siteUrl: string;
}

export interface BreadcrumbSchemaData {
 readonly '@context': 'https://schema.org';
 readonly '@type': 'BreadcrumbList';
 readonly itemListElement: Array<{
  readonly '@type': 'ListItem';
  readonly position: number;
  readonly name: string;
  readonly item: string;
 }>;
}

/**
 * Breadcrumb構造化データを生成する関数
 * 
 * @param config - Breadcrumb設定
 * @returns Schema.org準拠のBreadcrumbList構造化データ
 */
export function generateBreadcrumbSchema(
 config: BreadcrumbSchemaConfig
): BreadcrumbSchemaData {
 const { items, siteUrl } = config;

 // URL正規化関数
 const normalizeUrl = (baseUrl: string, path: string): string => {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return `${cleanBase}${cleanPath}`.replace(/([^:]\/)\/+/g, '$1');
 };

 // itemListElementを生成
 const itemListElement = items.map((item, index) => ({
  '@type': 'ListItem' as const,
  position: index + 1,
  name: item.title,
  item: normalizeUrl(siteUrl, item.url),
 }));

 return {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: itemListElement,
 };
}

/**
 * AstroのBreadcrumbItemからBreadcrumbSchemaItemに変換する関数
 * 
 * @param astroItems - AstroのBreadcrumbItem配列
 * @returns BreadcrumbSchemaItem配列
 */
export function convertAstroBreadcrumbItems(
 astroItems: Array<{
  readonly title: string;
  readonly url: string;
  readonly isActive: boolean;
  readonly icon?: string;
 }>
): BreadcrumbSchemaItem[] {
 return astroItems.map(item => ({
  title: item.title,
  url: item.url,
  isActive: item.isActive,
 }));
}

/**
 * デフォルトのBreadcrumb構造化データを生成する関数
 * 
 * @param siteUrl - サイトのベースURL
 * @returns デフォルトのBreadcrumbList構造化データ
 */
export function generateDefaultBreadcrumbSchema(siteUrl: string): BreadcrumbSchemaData {
 return generateBreadcrumbSchema({
  items: [
   { title: 'Home', url: '/', isActive: true }
  ],
  siteUrl,
 });
}
