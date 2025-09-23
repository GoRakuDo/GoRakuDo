import { statSync } from 'fs';
import { join } from 'path';

/**
 * ファイル日付取得ユーティリティ
 * 
 * 全コレクションで共通して使用できるファイルの作成日・更新日取得機能
 * AstroのContent Collectionsと連携して、フロントマターの日付がない場合の自動補完を提供
 */

export interface FileDates {
 createdDate: string;  // ISO形式の作成日
 modifiedDate: string; // ISO形式の更新日
}

/**
 * 指定されたコレクションとスラッグからファイルの日付情報を取得
 * 
 * @param collection - コレクション名（'docs', 'pages', 'tool-articles'）
 * @param slug - ファイルのスラッグ
 * @returns ファイルの作成日と更新日（ISO形式）
 */
export function getFileDates(collection: string, slug: string): FileDates {
 try {
  // MDXファイルを優先的に探し、見つからない場合はMDファイルを探す
  let filePath = join(process.cwd(), 'src/content', collection, `${slug}.mdx`);
  let stats;

  try {
   stats = statSync(filePath);
  } catch {
   // MDXファイルが見つからない場合はMDファイルを試す
   filePath = join(process.cwd(), 'src/content', collection, `${slug}.md`);
   stats = statSync(filePath);
  }

  return {
   createdDate: stats.birthtime.toISOString(),
   modifiedDate: stats.mtime.toISOString(),
  };
 } catch (error) {
  console.warn(`⚠️ Could not get file dates for ${collection}/${slug}:`, error);

  // フォールバック: 現在の日時を使用
  const now = new Date().toISOString();
  return {
   createdDate: now,
   modifiedDate: now,
  };
 }
}

/**
 * コレクションエントリーからファイル日付を取得（ヘルパー関数）
 * 
 * @param entry - AstroのCollectionEntry
 * @returns ファイルの作成日と更新日（ISO形式）
 */
export function getFileDatesFromEntry(entry: { slug: string; collection: string }): FileDates {
 return getFileDates(entry.collection, entry.slug);
}

/**
 * フロントマターの日付とファイル日付をマージ
 * フロントマターに日付が設定されていない場合は、ファイル日付を使用
 * 
 * @param frontmatterDate - フロントマターの日付（ISO形式）
 * @param fileDate - ファイルの日付（ISO形式）
 * @returns 優先される日付（ISO形式）
 */
export function mergeDates(frontmatterDate: string | undefined, fileDate: string): string {
 return frontmatterDate || fileDate;
}

/**
 * コレクションエントリー用の日付マージヘルパー
 * 
 * @param entry - AstroのCollectionEntry
 * @param publishedDate - フロントマターの公開日
 * @param updatedDate - フロントマターの更新日（オプション）
 * @returns マージされた日付情報
 */
export function getMergedDates(
 entry: { slug: string; collection: string },
 publishedDate?: string,
 updatedDate?: string
): {
 publishedDate: string;
 updatedDate: string;
} {
 const fileDates = getFileDatesFromEntry(entry);

 return {
  publishedDate: mergeDates(publishedDate, fileDates.createdDate),
  updatedDate: mergeDates(updatedDate, fileDates.modifiedDate),
 };
}
