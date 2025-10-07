import { readFileSync, writeFileSync, statSync, existsSync, readdirSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

/**
 * 効率化された自動日付処理システム
 * キャッシュ機能と並列処理を備える
 */

export interface CacheEntry {
 filePath: string;
 lastProcessed: string;
 fileHash: string;
 publishedDate: string;
}

export interface ProcessResult {
 processed: number;
 skipped: number;
 errors: number;
 duration: number;
}

/**
 * ファイルのハッシュ値を計算
 */
function calculateFileHash(filePath: string): string {
 try {
  const content = readFileSync(filePath, 'utf-8');
  return createHash('md5').update(content).digest('hex');
 } catch (error) {
  console.warn(`Failed to calculate hash for ${filePath}:`, error);
  return '';
 }
}

/**
 * キャッシュファイルのパスを取得
 */
function getCacheFilePath(): string {
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = dirname(__filename);
 return join(__dirname, '..', '..', '.cache', 'auto-date-cache.json');
}

/**
 * キャッシュを読み込み
 */
function loadCache(): Map<string, CacheEntry> {
 const cachePath = getCacheFilePath();

 if (!existsSync(cachePath)) {
  return new Map();
 }

 try {
  const cacheData = readFileSync(cachePath, 'utf-8');
  const cacheObject = JSON.parse(cacheData);
  return new Map(Object.entries(cacheObject));
 } catch (error) {
  console.warn('Failed to load cache, starting fresh:', error);
  return new Map();
 }
}

/**
 * キャッシュを保存
 */
function saveCache(cache: Map<string, CacheEntry>): void {
 const cachePath = getCacheFilePath();
 const cacheDir = dirname(cachePath);

 // キャッシュディレクトリを作成
 if (!existsSync(cacheDir)) {
  mkdirSync(cacheDir, { recursive: true });
 }

 try {
  const cacheObject = Object.fromEntries(cache);
  writeFileSync(cachePath, JSON.stringify(cacheObject, null, 2), 'utf-8');
 } catch (error) {
  console.warn('Failed to save cache:', error);
 }
}

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
 * 単一のMDXファイルを処理
 */
function processMdxFile(filePath: string, cache: Map<string, CacheEntry>): boolean {
 try {
  const currentHash = calculateFileHash(filePath);
  const cacheKey = filePath;
  const cachedEntry = cache.get(cacheKey);

  // キャッシュに存在し、ハッシュが同じ場合はスキップ
  if (cachedEntry && cachedEntry.fileHash === currentHash) {
   return false; // スキップ
  }

  const content = readFileSync(filePath, 'utf-8');
  const autoDateRegex = /publishedDate:\s*['"]auto['"]/g;

  if (autoDateRegex.test(content)) {
   const creationDate = getFileCreationDate(filePath);
   const updatedContent = content.replace(
    autoDateRegex,
    `publishedDate: '${creationDate}'`
   );

   writeFileSync(filePath, updatedContent, 'utf-8');

   // キャッシュを更新
   cache.set(cacheKey, {
    filePath,
    lastProcessed: new Date().toISOString(),
    fileHash: currentHash,
    publishedDate: creationDate,
   });

   console.log(`✅ Updated publishedDate for ${filePath} to ${creationDate}`);
   return true; // 処理済み
  }

  return false; // 処理不要
 } catch (error) {
  console.error(`❌ Error processing ${filePath}:`, error);
  return false;
 }
}

/**
 * 並列処理でMDXファイルを処理
 */
async function processMdxFilesParallel(filePaths: string[], cache: Map<string, CacheEntry>): Promise<ProcessResult> {
 const startTime = Date.now();
 let processed = 0;
 let skipped = 0;
 let errors = 0;

 // 並列処理のバッチサイズ（同時に処理するファイル数）
 const BATCH_SIZE = 10;

 for (let i = 0; i < filePaths.length; i += BATCH_SIZE) {
  const batch = filePaths.slice(i, i + BATCH_SIZE);

  const batchPromises = batch.map(async (filePath) => {
   try {
    const wasProcessed = processMdxFile(filePath, cache);
    if (wasProcessed) {
     processed++;
    } else {
     skipped++;
    }
   } catch (error) {
    console.error(`Error in batch processing ${filePath}:`, error);
    errors++;
   }
  });

  await Promise.all(batchPromises);
 }

 const duration = Date.now() - startTime;

 return {
  processed,
  skipped,
  errors,
  duration,
 };
}

/**
 * 効率化されたMDXファイル処理
 */
export async function processMdxFilesEfficiently(): Promise<ProcessResult> {
 console.log('+ Starting efficient auto date processing...');

 const cache = loadCache();
 const contentDir = join(process.cwd(), 'src', 'content');
 const mdxFiles: string[] = [];

 // MDXファイルを収集
 function collectMdxFiles(directory: string): void {
  try {
   const items = readdirSync(directory);

   for (const item of items) {
    const itemPath = join(directory, item);
    const stats = statSync(itemPath);

    if (stats.isDirectory()) {
     collectMdxFiles(itemPath);
    } else if (item.endsWith('.mdx')) {
     mdxFiles.push(itemPath);
    }
   }
  } catch (error) {
   console.error(`Error collecting files from ${directory}:`, error);
  }
 }

 collectMdxFiles(contentDir);
 console.log(`+ Found ${mdxFiles.length} MDX files`);

 // 並列処理でファイルを処理
 const result = await processMdxFilesParallel(mdxFiles, cache);

 // キャッシュを保存
 saveCache(cache);

 console.log(`+ Processing completed:`);
 console.log(`   - Processed: ${result.processed} files`);
 console.log(`   - Skipped: ${result.skipped} files`);
 console.log(`   - Errors: ${result.errors} files`);
 console.log(`   - Duration: ${result.duration}ms`);

 return result;
}

/**
 * キャッシュをクリア
 */
export function clearCache(): void {
 const cachePath = getCacheFilePath();
 if (existsSync(cachePath)) {
  unlinkSync(cachePath);
  console.log('🗑️ Cache cleared');
 }
}
