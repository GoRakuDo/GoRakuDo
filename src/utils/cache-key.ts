import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { getGitLastModified } from './git-dates';

/**
 * cacheKey helpers for Astro's experimental.incrementalBuild (astro.config.mjs).
 *
 * A page is skipped on rebuild only when its cacheKey is byte-identical to the
 * previous build, so every input below must be content-derived and stable:
 * never Date.now(), random values, or locale-dependent formatting.
 *
 * Note: time-gated visibility (frontmatter publishedDate <= build time) cannot
 * be expressed as a content digest — an article that becomes visible purely by
 * the clock still needs the next build to appear in list pages.
 */

/** Minimal structural view of a content collection entry (extra fields are fine). */
export interface DigestibleEntry {
  id: string;
  body?: string;
  filePath?: string;
  data?: {
    publishedDate?: string | Date | null;
    modifiedDate?: string | Date | null;
  };
}

function toStablePart(part: string | number | Date | null | undefined): string {
  if (part === null || part === undefined) return '';
  if (part instanceof Date) return part.toISOString();
  return String(part);
}

/**
 * Build a stable cacheKey: identical parts always produce the same sha256 hex.
 * Parts are joined with a unit separator so ["ab", "c"] and ["a", "bc"] differ.
 */
export function makeCacheKey(
  ...parts: Array<string | number | Date | null | undefined>
): string {
  const hash = createHash('sha256');
  for (const part of parts) {
    hash.update(toStablePart(part));
    hash.update('\u001f');
  }
  return hash.digest('hex');
}

// getStaticPaths() runs once per route but collections share entries, so each
// file is read / each git log spawned at most once per build process.
const fileHashCache = new Map<string, string>();
const gitDateCache = new Map<string, string>();

function fileContentHash(filePath: string): string | undefined {
  const cached = fileHashCache.get(filePath);
  if (cached !== undefined) return cached;
  try {
    const digest = createHash('sha256').update(readFileSync(filePath)).digest('hex');
    fileHashCache.set(filePath, digest);
    return digest;
  } catch {
    return undefined; // unreadable file → caller falls back to entry.body
  }
}

function stableGitDate(filePath: string): string {
  const cached = gitDateCache.get(filePath);
  if (cached !== undefined) return cached;
  // '' when git has no date — a "now" fallback would disable skipping entirely.
  const date = getGitLastModified(filePath) ?? '';
  gitDateCache.set(filePath, date);
  return date;
}

/**
 * Digest of a single article: entry id + raw file content (frontmatter and
 * body, so any edit changes the key) + git last-modified date (pages embed it
 * via getContentDates) + the date frontmatter.
 */
export function entryCacheKey(entry: DigestibleEntry): string {
  const fileHash = entry.filePath ? fileContentHash(entry.filePath) : undefined;
  const content = fileHash ?? entry.body ?? '';
  const gitDate = entry.filePath ? stableGitDate(entry.filePath) : '';
  return makeCacheKey(
    'entry',
    entry.id,
    content,
    gitDate,
    entry.data?.publishedDate,
    entry.data?.modifiedDate
  );
}

/**
 * Digest of a whole entry set for list / pagination routes: order-independent
 * combination of every contained article's digest, so changing one article
 * changes the set key.
 */
export function entrySetCacheKey(entries: readonly DigestibleEntry[]): string {
  const digests = entries.map(entryCacheKey).sort();
  return makeCacheKey('entry-set', digests.length, ...digests);
}
