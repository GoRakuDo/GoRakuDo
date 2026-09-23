import { processMdxFilesEfficiently, clearCache } from '../../../src/utils/content/auto-date-cache';

/**
 * 効率化された自動日付処理スクリプト
 * キャッシュ機能と並列処理を備える
 */

async function main(): Promise<void> {
 const args = process.argv.slice(2);

 // キャッシュクリアオプション
 if (args.includes('--clear-cache')) {
  clearCache();
  return;
 }

 // 詳細ログオプション
 const verbose = args.includes('--verbose');

 try {
  const result = await processMdxFilesEfficiently();

  if (verbose) {
   console.log('\n📊 Detailed Results:');
   console.log(`   Total files found: ${result.processed + result.skipped + result.errors}`);
   console.log(`   Processing efficiency: ${((result.skipped / (result.processed + result.skipped)) * 100).toFixed(1)}% cache hit rate`);
  }

  // エラーがある場合は非ゼロ終了コード
  if (result.errors > 0) {
   process.exit(1);
  }
 } catch (error) {
  console.error('❌ Fatal error during processing:', error);
  process.exit(1);
 }
}

// スクリプトとして実行
main();
