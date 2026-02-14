/**
 * SEO Template Variable Replacement Utility
 *
 * SEO JSON データ内の {{variable}} プレースホルダーを実際の値に置き換えるユーティリティ。
 * src/data/seo/pages/*.json を使用するページで利用されます。
 *
 * 使用例:
 * ```typescript
 * import { replaceTemplateVars } from '../utils/seo-template';
 *
 * const vars = { seoTitle: seoData.title, seoDescription: seoData.description };
 * const structuredData = replaceTemplateVars(rawStructuredData, vars);
 * ```
 */
export function replaceTemplateVars(
 template: unknown,
 vars: Record<string, string>
): unknown {
 if (typeof template === 'string') {
  return template.replace(
   /\{\{(\w+)\}\}/g,
   (match, key) => vars[key] ?? match
  );
 }
 if (Array.isArray(template)) {
  return template.map((item) => replaceTemplateVars(item, vars));
 }
 if (template && typeof template === 'object') {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(template)) {
   result[key] = replaceTemplateVars(value, vars);
  }
  return result;
 }
 return template;
}
