# GoRakuDo - Core Web Vitals調査対象ページ一覧

**調査日**: 2025年1月10日  
**総ページ数**: 48ページ  
**調査環境**: 本番ビルド (npm run build && npm run preview)  
**プレビューURL**: http://localhost:4321

---

## グループ1: 最重要ページ (3ページ)

| # | ページ名 | URL | 説明 |
|---|---------|-----|------|
| 1 | ホームページ | `/` | サイトのランディングページ |
| 2 | 日本語学習ガイド | `/panduan-lengkap-otodidak-bahasa-jepang` | メインコンテンツページ |
| 3 | YouTubeチャンネル推奨 | `/rekomendasi-channel-youtube-belajar-bahasa-jepang` | リソースページ |

---

## グループ2: 機能ページ (10ページ)

### ツールセクション (4ページ)
| # | ページ名 | URL | 説明 |
|---|---------|-----|------|
| 4 | ツール一覧 | `/tools` | ツールカタログ |
| 5 | Anki詳細 | `/tools/anki` | Ankiツール詳細ページ |
| 6 | Migaku詳細 | `/tools/migaku` | Migakuツール詳細ページ |
| 7 | Yomitan詳細 | `/tools/yomitan` | Yomitanツール詳細ページ |

### ドキュメントセクション (6ページ)
| # | ページ名 | URL | 説明 |
|---|---------|-----|------|
| 8 | ドキュメント一覧 | `/docs` | ドキュメントカタログ (page 1) |
| 9 | ドキュメント一覧 P2 | `/docs/page-2` | ページネーション (page 2) |
| 10 | ドキュメント一覧 P3 | `/docs/page-3` | ページネーション (page 3) |
| 11 | ツールページネーション | `/tools/anki/page-2` | Ankiツール記事一覧 (page 2) |
| 12 | ツールページネーション | `/tools/yomitan/page-2` | Yomitanツール記事一覧 (page 2) |
| 13 | ツールページネーション | `/tools/yomitan/page-3` | Yomitanツール記事一覧 (page 3) |

---

## グループ3: その他静的ページ (5ページ)

| # | ページ名 | URL | 説明 |
|---|---------|-----|------|
| 14 | FAQ | `/faq` | よくある質問 |
| 15 | サポート | `/support-us` | サポートページ |
| 16 | 検索 | `/search` | 検索機能ページ |
| 17 | Discord | `/discord` | Discord招待ページ |
| 18 | 404エラー | `/404` | エラーページ |

---

## グループ4: コンテンツページ (30ページ - サンプリング10ページ)

### ドキュメント記事 (13記事 - サンプリング5記事)
| # | ページ名 | URL | サンプリング |
|---|---------|-----|------------|
| 19 | Getting Started | `/docs/getting-started` | ✅ |
| 20 | Immersion Philosophy | `/docs/immersion-philosophy` | ✅ |
| 21 | Language Reactor Guide | `/docs/language-reactor-guide` | ✅ |
| 22 | Choosing Content | `/docs/choosing-content` | ✅ |
| - | Sample Article 01 | `/docs/sample-article-01` | - |
| - | Sample Article 02 | `/docs/sample-article-02` | - |
| - | Sample Article 03 | `/docs/sample-article-03` | - |
| - | Sample Article 04 | `/docs/sample-article-04` | - |
| - | Sample Article 05 | `/docs/sample-article-05` | - |
| - | Sample Article 06 | `/docs/sample-article-06` | - |
| - | Sample Article 07 | `/docs/sample-article-07` | - |
| 23 | Sample Article 08 | `/docs/sample-article-08` | ✅ |
| - | Test Article | `/docs/test-article` | - |

### Ankiツール記事 (7記事 - サンプリング2記事)
| # | ページ名 | URL | サンプリング |
|---|---------|-----|------------|
| 24 | Apa itu Anki | `/tools/anki/apa-itu-anki` | ✅ |
| - | Addons Essentials | `/tools/anki/addons-essentials` | - |
| - | Deck Management | `/tools/anki/deck-management` | - |
| - | Mobile Setup | `/tools/anki/mobile-setup` | - |
| - | Test2 | `/tools/anki/test2` | - |
| - | Tips Advanced | `/tools/anki/tips-advanced` | - |
| 25 | Troubleshooting | `/tools/anki/troubleshooting-common-issues` | ✅ |

### Migakuツール記事 (2記事 - 全て)
| # | ページ名 | URL | サンプリング |
|---|---------|-----|------------|
| 26 | Pengenalan Migaku | `/tools/migaku/pengenalan-migaku` | ✅ (全て) |
| 27 | Browser Extension Guide | `/tools/migaku/browser-extension-guide` | ✅ (全て) |

### Yomitanツール記事 (8記事 - サンプリング3記事)
| # | ページ名 | URL | サンプリング |
|---|---------|-----|------------|
| 28 | Pengenalan Yomitan | `/tools/yomitan/pengenalan-yomitan` | ✅ |
| - | Advanced Settings | `/tools/yomitan/advanced-settings` | - |
| - | Anki Integration | `/tools/yomitan/anki-integration` | - |
| - | Backup Restore | `/tools/yomitan/backup-restore` | - |
| - | Dictionary Guide | `/tools/yomitan/dictionary-guide` | - |
| - | Mobile Setup | `/tools/yomitan/mobile-setup` | - |
| - | Performance Optimization | `/tools/yomitan/performance-optimization` | - |
| 29 | Setup Guide | `/tools/yomitan/setup-guide` | ✅ |

---

## 測定対象URL総数

- **グループ1 (最重要)**: 3ページ
- **グループ2 (機能)**: 10ページ
- **グループ3 (静的)**: 5ページ
- **グループ4 (コンテンツ・サンプリング)**: 11ページ

**合計測定ページ数**: 29ページ

---

## 測定計画

### Core Web Vitals指標
- **LCP** (Largest Contentful Paint): 最大コンテンツ描画時間
- **FID/INP** (First Input Delay/Interaction to Next Paint): インタラクティブ性
- **CLS** (Cumulative Layout Shift): レイアウトシフト
- **FCP** (First Contentful Paint): 初回コンテンツ描画
- **TTFB** (Time to First Byte): 初回バイト到達時間

### 閾値基準
- **Good (良好)**: LCP < 2.5s, CLS < 0.1
- **Needs Improvement (改善必要)**: LCP 2.5-4.0s, CLS 0.1-0.25
- **Poor (不良)**: LCP > 4.0s, CLS > 0.25

### 優先順位設定
- **P0 (Critical)**: LCP > 4s, CLS > 0.25
- **P1 (High)**: LCP > 2.5s, CLS > 0.1
- **P2 (Medium)**: 改善の余地あり
- **P3 (Low)**: 最適化の機会

