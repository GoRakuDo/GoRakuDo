/**
 * Google Analytics Verification Script
 * GitHub Pages用のGoogle Analytics検証ツール
 *
 * 使用方法:
 * 1. ブラウザの開発者ツールのコンソールで実行
 * 2. または、ページに一時的に追加して検証
 */

(function () {
  'use strict';

  console.log('🔍 Google Analytics Verification Tool - GoRakuDo');
  console.log('================================================');

  // 1. Google Analyticsタグの存在確認
  const gtagScript = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]'
  );
  if (gtagScript) {
    console.log('✅ Google Analytics script tag found:', gtagScript.src);

    // GA IDの抽出
    const gaIdMatch = gtagScript.src.match(/id=([^&]+)/);
    if (gaIdMatch) {
      console.log('✅ Google Analytics ID:', gaIdMatch[1]);
    }
  } else {
    console.log('❌ Google Analytics script tag not found');
  }

  // 2. dataLayerの確認
  if (typeof window.dataLayer !== 'undefined') {
    console.log('✅ dataLayer found:', window.dataLayer);
    console.log('📊 dataLayer length:', window.dataLayer.length);
  } else {
    console.log('❌ dataLayer not found');
  }

  // 3. gtag関数の確認
  if (typeof window.gtag !== 'undefined') {
    console.log('✅ gtag function found');
  } else {
    console.log('❌ gtag function not found');
  }

  // 4. ページビューイベントの送信テスト
  if (typeof window.gtag === 'function') {
    console.log('🧪 Testing page view event...');
    window.gtag('event', 'ga_verification_test', {
      event_category: 'verification',
      event_label: 'manual_test',
      value: 1,
    });
    console.log('✅ Test event sent');
  }

  // 5. ネットワークリクエストの確認
  console.log('🌐 Checking for Google Analytics requests...');

  // Performance Observer を使用してネットワークリクエストを監視
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (
          entry.name.includes('google-analytics.com') ||
          entry.name.includes('googletagmanager.com') ||
          entry.name.includes('analytics.google.com')
        ) {
          console.log('📡 GA Request detected:', entry.name);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // 5秒後に監視を停止
    setTimeout(() => {
      observer.disconnect();
      console.log('⏹️ Network monitoring stopped');
    }, 5000);
  }

  // 6. サイト情報の表示
  console.log('📋 Site Information:');
  console.log('   URL:', window.location.href);
  console.log('   Title:', document.title);
  console.log('   User Agent:', navigator.userAgent);
  console.log('   Referrer:', document.referrer || 'Direct');

  // 7. 推奨事項の表示
  console.log('💡 Recommendations:');
  console.log('   1. Google Search Consoleでサイトを登録');
  console.log('   2. sitemap.xmlをGoogle Search Consoleに送信');
  console.log('   3. 24-48時間待ってから再テスト');
  console.log('   4. Google Analytics Real-timeレポートで確認');

  console.log('================================================');
  console.log('✅ Verification complete!');
})();
