/**
 * コンテンツコレクションのステータスフィルタリングユーティリティ
 * 全コレクション（docs, pages, tool-articles）のstatusフィールドに基づいてフィルタリング
 */

import type { CollectionEntry } from 'astro:content';

// ========== 型定義 ==========
export type PostStatus = 'published' | 'draft' | 'archived';

// ========== ドキュメントコレクション用フィルタリング ==========

/**
 * ドキュメントコレクションから公開済みの記事のみをフィルタリングして返します。
 * @param entries ドキュメントコレクションのエントリ配列
 * @returns 公開済みのドキュメントエントリの配列
 */
export function getVisibleDocs<T extends CollectionEntry<'docs'>>(entries: T[]): T[] {
  return entries.filter(entry => entry.data.status === 'published');
}

/**
 * ドキュメントコレクションからドラフト記事のみをフィルタリングして返します。
 * @param entries ドキュメントコレクションのエントリ配列
 * @returns ドラフトドキュメントエントリの配列
 */
export function getDraftDocs<T extends CollectionEntry<'docs'>>(entries: T[]): T[] {
  return entries.filter(entry => entry.data.status === 'draft');
}

/**
 * ドキュメントコレクションからアーカイブ済み記事のみをフィルタリングして返します。
 * @param entries ドキュメントコレクションのエントリ配列
 * @returns アーカイブ済みドキュメントエントリの配列
 */
export function getArchivedDocs<T extends CollectionEntry<'docs'>>(entries: T[]): T[] {
  return entries.filter(entry => entry.data.status === 'archived');
}

/**
 * ドキュメントのステータスに基づいて表示情報を返します。
 * @param status ドキュメントのステータス
 * @returns ステータスに応じた表示情報
 */
export function getDocStatus(status: PostStatus): { isVisible: boolean; label: string } {
  switch (status) {
    case 'published':
      return { isVisible: true, label: '公開済み' };
    case 'draft':
      return { isVisible: false, label: '編集中 (非公開)' };
    case 'archived':
      return { isVisible: false, label: 'アーカイブ済み (非公開)' };
    default:
      return { isVisible: false, label: '不明なステータス' };
  }
}

// ========== ページコレクション用フィルタリング ==========

/**
 * ページコレクションから公開済みのページのみをフィルタリングして返します。
 * @param entries ページコレクションのエントリ配列
 * @returns 公開済みのページエントリの配列
 */
export function getVisiblePages<T extends CollectionEntry<'pages'>>(entries: T[]): T[] {
  return entries.filter(entry => entry.data.status === 'published');
}

/**
 * ページコレクションからドラフトページのみをフィルタリングして返します。
 * @param entries ページコレクションのエントリ配列
 * @returns ドラフトページエントリの配列
 */
export function getDraftPages<T extends CollectionEntry<'pages'>>(entries: T[]): T[] {
  return entries.filter(entry => entry.data.status === 'draft');
}

/**
 * ページコレクションからアーカイブ済みページのみをフィルタリングして返します。
 * @param entries ページコレクションのエントリ配列
 * @returns アーカイブ済みページエントリの配列
 */
export function getArchivedPages<T extends CollectionEntry<'pages'>>(entries: T[]): T[] {
  return entries.filter(entry => entry.data.status === 'archived');
}

/**
 * ページのステータスに基づいて表示情報を返します。
 * @param status ページのステータス
 * @returns ステータスに応じた表示情報
 */
export function getPageStatus(status: PostStatus): { isVisible: boolean; label: string } {
  switch (status) {
    case 'published':
      return { isVisible: true, label: '公開済み' };
    case 'draft':
      return { isVisible: false, label: '編集中 (非公開)' };
    case 'archived':
      return { isVisible: false, label: 'アーカイブ済み (非公開)' };
    default:
      return { isVisible: false, label: '不明なステータス' };
  }
}

// ========== ツール記事コレクション用フィルタリング ==========

/**
 * ツール記事コレクションから公開済みの記事のみをフィルタリングして返します。
 * @param entries ツール記事コレクションのエントリ配列
 * @returns 公開済みのツール記事エントリの配列
 */
export function getVisibleToolArticles<T extends CollectionEntry<'tool-articles'>>(entries: T[]): T[] {
  return entries.filter(entry => entry.data.status === 'published');
}

/**
 * ツール記事コレクションからドラフト記事のみをフィルタリングして返します。
 * @param entries ツール記事コレクションのエントリ配列
 * @returns ドラフトツール記事エントリの配列
 */
export function getDraftToolArticles<T extends CollectionEntry<'tool-articles'>>(entries: T[]): T[] {
  return entries.filter(entry => entry.data.status === 'draft');
}

/**
 * ツール記事コレクションからアーカイブ済み記事のみをフィルタリングして返します。
 * @param entries ツール記事コレクションのエントリ配列
 * @returns アーカイブ済みツール記事エントリの配列
 */
export function getArchivedToolArticles<T extends CollectionEntry<'tool-articles'>>(entries: T[]): T[] {
  return entries.filter(entry => entry.data.status === 'archived');
}

/**
 * ツール記事のステータスに基づいて表示情報を返します。
 * @param status ツール記事のステータス
 * @returns ステータスに応じた表示情報
 */
export function getToolArticleStatus(status: PostStatus): { isVisible: boolean; label: string } {
  switch (status) {
    case 'published':
      return { isVisible: true, label: '公開済み' };
    case 'draft':
      return { isVisible: false, label: '編集中 (非公開)' };
    case 'archived':
      return { isVisible: false, label: 'アーカイブ済み (非公開)' };
    default:
      return { isVisible: false, label: '不明なステータス' };
  }
}

// ========== 汎用フィルタリング関数 ==========

/**
 * 任意のコレクションエントリのステータスをチェックします。
 * @param entry コレクションエントリ
 * @returns ステータス情報
 */
export function getPostStatus(entry: CollectionEntry<'docs' | 'pages' | 'tool-articles'>): {
  isPublished: boolean;
  isDraft: boolean;
  isArchived: boolean;
  isVisible: boolean;
  status: PostStatus;
} {
  const status = entry.data.status as PostStatus;
  return {
    isPublished: status === 'published',
    isDraft: status === 'draft',
    isArchived: status === 'archived',
    isVisible: status === 'published',
    status,
  };
}

/**
 * ステータスに基づいて表示可能かどうかを判定します。
 * @param status ステータス
 * @returns 表示可能かどうか
 */
export function isVisibleStatus(status: PostStatus): boolean {
  return status === 'published';
}

/**
 * ステータスに基づいて非表示かどうかを判定します。
 * @param status ステータス
 * @returns 非表示かどうか
 */
export function isHiddenStatus(status: PostStatus): boolean {
  return status === 'draft' || status === 'archived';
}
