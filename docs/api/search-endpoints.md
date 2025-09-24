Search Endpoints Specification

本書は統合検索で使用するJSONエンドポイントの仕様書です。いずれも GET のみ対応し、キャッシュとCORSヘッダを返します。

1) Comprehensive Search
- URL: /search/Search.json
- Method: GET
- Query Params: category, tag, tool, type (docs|tool-article|page)
- Response (200) 概要:
```
{
  "metadata": { "type": "comprehensive", ... },
  "data": [ { /* item */ } ],
  "filters": { "category": "...", "tag": "...", "tool": "...", "type": "..." }
}
```

2) Docs Search (Docs Collection Only)
- URL: /docs/DocsSearch.json
- Method: GET
- Query Params: category (optional)
- Response 概要: metadata.type=docs, data=[docs item], filters={category}

3) Tools Search (Tool Articles Only)
- URL: /tools/ToolsSearch.json
- Method: GET
- Query Params: tool, category (optional)
- Response 概要: metadata.type=tools, data=[tool-article item], filters={tool,category}

共通フィールド
- 各 data アイテム: id, slug, title, description, pubDate, content, fullContent, tags, categories, type, url, path
- toolName は type==='tool-article' のみ
- 解析補助: searchableText, wordCount, contentLength, hasCodeBlocks, hasImages

ヘッダ
- Cache-Control: public, max-age=1800
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET
- Access-Control-Allow-Headers: Content-Type

期待する利用パターン
- 検索ページ: /search/Search.json を取得しFuse.jsで全文検索・ハイライト
- ポップオーバー検索: /docs/DocsSearch.json または /tools/ToolsSearch.json を用途別に使用


