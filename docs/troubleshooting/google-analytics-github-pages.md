# Google Analytics GitHub Pages トラブルシューティングガイド

## 問題の概要

GitHub PagesにデプロイしたAstroサイトでGoogle Analyticsタグが認識されない問題の解決方法をまとめています。

## 実装済みの修正

### 1. URL正規化の改善
- `UnifiedSEO.astro`の`normalizeUrl`関数を強化
- ダブルスラッシュ問題を解決
- sitemap.xmlのURL構造を修正

### 2. Google Analytics設定の最適化
- GitHub Pages用の設定を追加
- `transport_type: 'beacon'`でパフォーマンス向上
- カスタムパラメータでサイト情報を送信

## 検証手順

### ステップ1: ブラウザでの検証
1. サイトにアクセス: https://gorakudo.org
2. 開発者ツールを開く (F12)
3. コンソールタブで以下を実行:

```javascript
// Google Analytics検証スクリプトを実行
fetch('/src/scripts/ga-verification.js')
  .then(response => response.text())
  .then(script => eval(script));
```

### ステップ2: Google Analytics Real-timeレポート
1. Google Analyticsにログイン
2. プロパティ `G-R4V6TV2BM3` を選択
3. レポート > リアルタイム > 概要
4. サイトにアクセスしてリアルタイムデータを確認

### ステップ3: Google Search Console
1. [Google Search Console](https://search.google.com/search-console)にアクセス
2. プロパティを追加: `https://gorakudo.org`
3. 所有権の確認方法を選択:
   - HTMLファイルのアップロード
   - HTMLタグの追加
   - Google Analytics
4. sitemap.xmlを送信: `https://gorakudo.org/sitemap.xml`

## よくある問題と解決策

### 問題1: タグが検出されない
**原因**: JavaScriptの実行タイミング
**解決策**: 
- 24-48時間待つ
- ブラウザキャッシュをクリア
- プライベートブラウジングでテスト

### 問題2: データが表示されない
**原因**: フィルタ設定
**解決策**:
- Google Analyticsのフィルタを確認
- リアルタイムレポートで確認
- デバッグビューを有効化

### 問題3: sitemap.xmlのエラー
**原因**: ダブルスラッシュ
**解決策**: 
- URL正規化関数の改善（実装済み）
- ビルド後のsitemap.xmlを確認

## パフォーマンス最適化

### 実装済みの最適化
1. **Resource Hints**: DNS prefetch, preconnect
2. **Font Loading**: 重要なフォントのpreload
3. **Image Optimization**: WebP/AVIF形式
4. **Code Splitting**: 適切なチャンク分割

### 追加の最適化案
1. **Service Worker**: オフライン対応
2. **Critical CSS**: 重要なCSSのインライン化
3. **Lazy Loading**: 画像の遅延読み込み

## 監視とメンテナンス

### 定期的なチェック項目
- [ ] Google Analyticsのデータ受信状況
- [ ] sitemap.xmlの更新
- [ ] robots.txtの確認
- [ ] ページ速度の監視
- [ ] Core Web Vitalsの確認

### アラート設定
1. Google Analyticsで目標設定
2. Google Search Consoleでアラート設定
3. GitHub Actionsでデプロイ通知

## 参考資料

- [Google Analytics Help](https://support.google.com/analytics)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Astro SEO Guide](https://docs.astro.build/en/guides/integrations-guide/astro-seo/)
- [Google Search Console Help](https://support.google.com/webmasters)

## サポート

問題が解決しない場合は、以下を確認してください:

1. ブラウザのコンソールエラー
2. ネットワークタブでのリクエスト状況
3. Google Analyticsのデバッグビュー
4. GitHub Pagesのデプロイログ

---

**最終更新**: 2025年1月23日  
**バージョン**: 1.0  
**対象**: GoRakuDo Astroサイト

