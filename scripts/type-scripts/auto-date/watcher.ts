import { watch } from 'fs';
import type { FSWatcher } from 'fs';
import { join } from 'path';
import { processMdxFilesEfficiently } from '../../../src/utils/content/auto-date-cache';

/**
 * 開発モード用のファイル監視機能
 * MDXファイルの変更を監視してリアルタイムで処理
 */

export class AutoDateWatcher {
 private watchers: Map<string, FSWatcher> = new Map();
 private isWatching = false;
 private debounceTimer: NodeJS.Timeout | null = null;
 private readonly DEBOUNCE_DELAY = 1000; // 1秒のデバウンス

 /**
  * 監視を開始
  */
 start(): void {
  if (this.isWatching) {
   console.log('👀 Auto date watcher is already running');
   return;
  }

  console.log('👀 Starting auto date watcher...');
  this.isWatching = true;

  const contentDir = join(process.cwd(), 'src', 'content');
  this.watchDirectory(contentDir);

  console.log('✅ Auto date watcher started');
 }

 /**
  * 監視を停止
  */
 stop(): void {
  if (!this.isWatching) {
   return;
  }

  console.log('🛑 Stopping auto date watcher...');

  this.watchers.forEach((watcher) => {
   watcher.close();
  });

  this.watchers.clear();
  this.isWatching = false;

  if (this.debounceTimer) {
   clearTimeout(this.debounceTimer);
   this.debounceTimer = null;
  }

  console.log('✅ Auto date watcher stopped');
 }

 /**
  * ディレクトリを監視
  */
 private watchDirectory(directory: string): void {
  try {
   const watcher = watch(directory, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.mdx')) {
     this.handleFileChange(eventType, filename, directory);
    }
   });

   this.watchers.set(directory, watcher);
   console.log(`👀 Watching directory: ${directory}`);
  } catch (error) {
   console.error(`Failed to watch directory ${directory}:`, error);
  }
 }

 /**
  * ファイル変更を処理
  */
 private handleFileChange(eventType: string, filename: string, directory: string): void {
  if (eventType !== 'change') {
   return;
  }

  const filePath = join(directory, filename);
  console.log(`📝 File changed: ${filePath}`);

  // デバウンス処理
  if (this.debounceTimer) {
   clearTimeout(this.debounceTimer);
  }

  this.debounceTimer = setTimeout(async () => {
   try {
    console.log('🔄 Processing changed files...');
    await processMdxFilesEfficiently();
    console.log('✅ Auto date processing completed');
   } catch (error) {
    console.error('❌ Error processing files:', error);
   }
  }, this.DEBOUNCE_DELAY);
 }
}

/**
 * メイン関数
 */
async function main(): Promise<void> {
 const watcher = new AutoDateWatcher();

 // 初期処理
 console.log('🚀 Running initial auto date processing...');
 await processMdxFilesEfficiently();

 // 監視開始
 watcher.start();

 // シグナルハンドリング
 process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping watcher...');
  watcher.stop();
  process.exit(0);
 });

 process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, stopping watcher...');
  watcher.stop();
  process.exit(0);
 });

 console.log('👀 Auto date watcher is running. Press Ctrl+C to stop.');
}

// スクリプトとして実行
if (import.meta.url.endsWith(process.argv[1])) {
 main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
 });
}
