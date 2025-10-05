import { readFileSync, writeFileSync, statSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * ビルド時にMDXファイルのpublishedDate: 'auto'を実際の日付に置換するフック
 */

/**
 * ファイルの作成日時を取得
 */
function getFileCreationDate(filePath: string): string {
 try {
  const stats = statSync(filePath);
  return stats.birthtime.toISOString();
 } catch (error) {
  console.warn(`Failed to get creation date for ${filePath}:`, error);
  return new Date().toISOString();
 }
}

/**
 * MDXファイルのpublishedDate: 'auto'を実際の日付に置換
 */
function processMdxFile(filePath: string): void {
 try {
  const content = readFileSync(filePath, 'utf-8');

  // publishedDate: 'auto'を検索して置換
  const autoDateRegex = /publishedDate:\s*['"]auto['"]/g;
  if (autoDateRegex.test(content)) {
   const creationDate = getFileCreationDate(filePath);
   const updatedContent = content.replace(
    autoDateRegex,
    `publishedDate: '${creationDate}'`
   );

   writeFileSync(filePath, updatedContent, 'utf-8');
   console.log(`Updated publishedDate for ${filePath} to ${creationDate}`);
  }
 } catch (error) {
  console.error(`Error processing ${filePath}:`, error);
 }
}

/**
 * 指定されたディレクトリ内のすべてのMDXファイルを処理
 */
export function processMdxFilesInDirectory(directory: string): void {
 try {
  console.log(`Processing directory: ${directory}`);
  const items = readdirSync(directory);
  console.log(`Found items: ${items.join(', ')}`);

  for (const item of items) {
   const itemPath = join(directory, item);
   const stats = statSync(itemPath);

   if (stats.isDirectory()) {
    // 再帰的にサブディレクトリを処理
    processMdxFilesInDirectory(itemPath);
   } else if (item.endsWith('.mdx')) {
    // MDXファイルを処理
    console.log(`Processing MDX file: ${itemPath}`);
    processMdxFile(itemPath);
   }
  }
 } catch (error) {
  console.error(`Error processing directory ${directory}:`, error);
 }
}

/**
 * コンテンツディレクトリ内のすべてのMDXファイルを処理
 */
export function processAllContentFiles(): void {
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = dirname(__filename);
 const contentDir = join(__dirname, '..', '..', 'content');

 console.log('Processing MDX files for auto publishedDate...');
 processMdxFilesInDirectory(contentDir);
 console.log('Finished processing MDX files.');
}
