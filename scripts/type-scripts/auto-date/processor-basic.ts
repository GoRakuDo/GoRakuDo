import { processAllContentFiles } from '../../../src/utils/content/auto-date-hook';

/**
 * 基本的な自動日付処理スクリプト
 * ビルド前にMDXファイルのpublishedDate: 'auto'を処理する
 */
export function processAutoDates(): void {
 console.log('🚀 Starting auto date processing...');
 processAllContentFiles();
 console.log('✅ Auto date processing completed!');
}

// スクリプトとして実行された場合
processAutoDates();
