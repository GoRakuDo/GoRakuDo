/**
 * SEO Integration Example
 * 
 * UnifiedSEO.astroでBreadcrumbの構造化データを統合する方法の例
 * 
 * 使用例:
 * ```astro
 * ---
 * import UnifiedSEO from '../components/UnifiedSEO.astro';
 * import Breadcrumb, { breadcrumbSchema } from '../components/common/Breadcrumb.astro';
 * 
 * // Breadcrumbコンポーネントをレンダリングしてスキーマを取得
 * const breadcrumbComponent = await Breadcrumb.render({
 *   currentPath: '/blog/category/article',
 *   showHome: true
 * });
 * 
 * // 構造化データを取得
 * const breadcrumbStructuredData = breadcrumbComponent.breadcrumbSchema;
 * ---
 * 
 * <UnifiedSEO
 *   title="記事タイトル"
 *   description="記事の説明"
 *   breadcrumbSchema={breadcrumbStructuredData}
 * />
 * ```
 */

import type { BreadcrumbSchemaData } from './breadcrumb-schema';

/**
 * 複数の構造化データを統合する関数
 * 
 * @param schemas - 統合する構造化データの配列
 * @returns 統合された構造化データの配列
 */
export function combineStructuredData(
 schemas: readonly BreadcrumbSchemaData[]
): readonly BreadcrumbSchemaData[] {
 return schemas.filter(schema => schema && Object.keys(schema).length > 0);
}

/**
 * UnifiedSEO.astroで使用するための構造化データ統合ヘルパー
 * 
 * @param breadcrumbSchema - Breadcrumbの構造化データ
 * @param additionalSchemas - 追加の構造化データ
 * @returns 統合された構造化データの配列
 */
export function prepareSEOStructuredData(
 breadcrumbSchema?: BreadcrumbSchemaData,
 additionalSchemas: readonly any[] = []
): readonly any[] {
 const schemas: any[] = [];

 if (breadcrumbSchema) {
  schemas.push(breadcrumbSchema);
 }

 schemas.push(...additionalSchemas);

 return Object.freeze(schemas);
}
