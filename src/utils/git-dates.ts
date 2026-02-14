import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

/**
 * Get the last Git commit date for a file.
 * Returns ISO 8601 string, or null if not tracked / in CI without full history.
 */
export function getGitLastModified(filePath: string): string | null {
 try {
  const absPath = resolve(filePath);
  const result = execSync(
   `git log -1 --format=%cI -- "${absPath}"`,
   { encoding: 'utf-8', timeout: 5000 }
  ).trim();
  return result || null;
 } catch {
  return null;
 }
}

/**
 * Get Git dates for a content collection entry.
 * Falls back to publishedDate if Git data is unavailable (e.g. CI shallow clone).
 */
export function getContentDates(filePath: string, publishedDate?: string) {
 const gitModified = getGitLastModified(filePath);
 return {
  modifiedDate: gitModified || publishedDate || new Date().toISOString(),
  publishedDate: publishedDate || gitModified || new Date().toISOString(),
 };
}
