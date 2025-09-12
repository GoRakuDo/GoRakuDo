import type { SearchDataItem } from '../global';

/**
 * Simplified Content Processor for Docs Page
 * Astro SSG 2025方式 - Content Collectionsを使用した簡素化実装
 * 不要機能削除: AI メタデータ、コンテンツ分類、推奨システム
 */
export class ContentProcessor {
  private sortedPosts: SearchDataItem[] = [];
  private currentPage: number;
  private postsPerPage: number;
  private isInitialized = false;

  constructor(currentPage = 1, postsPerPage = 6) {
    this.currentPage = currentPage;
    this.postsPerPage = postsPerPage;
    this.init();
  }

  private async init(): Promise<void> {
    try {
      // データの読み込み、ソート、ページネーションを一括処理
      await this.loadAndProcessData();
      this.isInitialized = true;
    } catch (error) {
      console.error('Content Processor initialization failed:', error);
    }
  }

  /**
   * 初期化完了確認
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * データの読み込み、ソート、ページネーションを一括処理
   */
  private async loadAndProcessData(): Promise<void> {
    try {
      // search.jsonからデータを取得
      const response = await fetch('/search.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      if (!Array.isArray(rawData)) {
        throw new Error('Invalid data format: expected array');
      }

      // データのソート（公開日順、新しい順）
      this.sortedPosts = (rawData as SearchDataItem[]).sort((a, b) => {
        const dateA = new Date(a.pubDate || '').getTime() || 0;
        const dateB = new Date(b.pubDate || '').getTime() || 0;
        return dateB - dateA;
      });

      // デバッグ情報
      console.log(`ContentProcessor: Loaded ${this.sortedPosts.length} posts`);
      if (this.sortedPosts.length > 0) {
        console.log('First post:', this.sortedPosts[0]);
      }
    } catch (error) {
      console.error('Error loading content data:', error);
      // エラー時は空配列を設定
      this.sortedPosts = [];
      throw error;
    }
  }

  /**
   * ページ変更
   */
  public changePage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) {
      return;
    }

    this.currentPage = page;
    this.updateDisplay();
  }

  /**
   * 総ページ数の取得
   */
  public getTotalPages(): number {
    return Math.ceil(this.sortedPosts.length / this.postsPerPage);
  }

  /**
   * 現在のページの取得
   */
  public getCurrentPage(): number {
    return this.currentPage;
  }

  /**
   * コンテンツ表示とページネーションUIの統合更新
   */
  public updateDisplay(): void {
    this.updateContentDisplay();
    this.updatePaginationUI();
  }

  /**
   * コンテンツ表示の更新
   */
  public updateContentDisplay(): void {
    const contentContainer = document.querySelector('#postsContainer') || document.querySelector('.posts-container');
    if (!contentContainer) {
      console.error('ContentProcessor: Content container not found');
      return;
    }

    // データが読み込まれていない場合は何もしない
    if (!this.sortedPosts || this.sortedPosts.length === 0) {
      console.warn('ContentProcessor: No posts data available');
      return;
    }

    console.log(`ContentProcessor: Updating display for page ${this.currentPage}, ${this.sortedPosts.length} total posts`);

    // 現在のページの投稿を取得
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const paginatedPosts = this.sortedPosts.slice(startIndex, endIndex);

    // 既存の投稿カードを非表示にする（削除しない）
    const existingCards = contentContainer.querySelectorAll('.post-card');
    existingCards.forEach(card => {
      (card as HTMLElement).style.display = 'none';
    });

    // 現在のページの投稿を表示
    paginatedPosts.forEach((post, index) => {
      let card = existingCards[index] as HTMLElement;
      
      if (!card) {
        // 新しいカードを作成
        card = document.createElement('article');
        card.className = 'post-card';
        contentContainer.appendChild(card);
      }

      // 日付フォーマット関数
      const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        } catch {
          return '';
        }
      };

      // カードの内容を更新
      card.innerHTML = `
        ${post.emoji ? `<div class="post-emoji">${post.emoji}</div>` : ''}
        <div class="post-card-container">
          <div class="post-header">
            <h2 class="post-title">
              <a href="/docs/${post.slug}">
                ${post.title || 'Untitled'}
              </a>
            </h2>
            <div class="post-meta">
              <span class="post-date">${formatDate(post.pubDate || '')}</span>
            </div>
          </div>
          <p class="post-description">${post.description || ''}</p>
          <div class="post-tags" data-all-tags='${JSON.stringify(post.tags || [])}'>
            ${(post.tags || []).slice(0, 3).map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            ${(post.tags || []).length > 3 ? `<span class="post-tag-more" data-count="${(post.tags || []).length - 3}">+${(post.tags || []).length - 3}</span>` : ''}
          </div>
          <a href="/docs/${post.slug}" class="read-more-btn">
            Baca Selengkapnya →
          </a>
        </div>
      `;
      
      // カードを表示
      card.style.display = 'block';
    });
  }

  /**
   * ページネーションUIの更新
   */
  public updatePaginationUI(): void {
    const paginationContainer = document.getElementById('paginationControls');
    if (!paginationContainer) {
      return;
    }

    const totalPages = this.getTotalPages();
    const currentPage = this.getCurrentPage();

    // シンプルなページネーションUI生成
    let paginationHTML = '<div class="pagination" role="navigation" aria-label="ページネーション">';
    
    // 前のページボタン
    if (currentPage > 1) {
      paginationHTML += `
        <button 
          class="pagination-btn" 
          data-page="${currentPage - 1}"
          aria-label="前のページ"
          title="前のページに移動">
          ← Previous
        </button>`;
    }

    // ページ番号（最大10ページまで表示）
    const maxVisiblePages = 10;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage ? 'active' : '';
      paginationHTML += `
        <button 
          class="pagination-btn ${isActive}" 
          data-page="${i}"
          aria-label="ページ ${i}"
          aria-current="${isActive ? 'page' : 'false'}"
          title="ページ ${i} に移動">
          ${i}
        </button>`;
    }

    // 次のページボタン
    if (currentPage < totalPages) {
      paginationHTML += `
        <button 
          class="pagination-btn" 
          data-page="${currentPage + 1}"
          aria-label="次のページ"
          title="次のページに移動">
          Next →
        </button>`;
    }

    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;

    // イベントリスナーを追加
    this.setupPaginationEventListeners();
  }

  /**
   * ページネーションイベントリスナーの設定
   */
  private setupPaginationEventListeners(): void {
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const page = parseInt(target.getAttribute('data-page') || '1');
        this.changePage(page);
      });
    });
  }

}
