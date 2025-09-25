/**
 * Simple Tag Popup Manager
 * シンプル化されたタグポップアップ機能
 * Astro Native Approach - 最小限の機能で最大の効果
 */

export interface TagPopupConfig {
  maxVisibleTags: number;
  popupClassName: string;
  headerText: string;
  showOnHover: boolean;
  showOnClick: boolean;
}

export class SimpleTagPopup {
  private config: TagPopupConfig;
  private initialized = false;

  constructor(config: Partial<TagPopupConfig> = {}) {
    this.config = {
      maxVisibleTags: 3,
      popupClassName: 'tag-popup',
      headerText: 'Tag Lain-nya:',
      showOnHover: true,
      showOnClick: true,
      ...config
    };
  }

  /**
   * タグポップアップ機能の初期化
   */
  public initialize(): void {
    if (this.initialized) {
      return;
    }

    try {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log('Initializing simple tag popups...', 'info');
      }

      this.setupTagPopups();
      this.initialized = true;

      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log('Simple tag popups initialized successfully', 'success');
      }
    } catch (error) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(`Tag popup initialization failed: ${error}`, 'error');
      }
    }
  }

  /**
   * タグポップアップの設定
   */
  private setupTagPopups(): void {
    const tagContainers = document.querySelectorAll('.post-tags');

    tagContainers.forEach((container) => {
      this.setupContainer(container as HTMLElement);
    });
  }

  /**
   * 個別のコンテナの設定（public method for external use）
   */
  public setupContainer(container: HTMLElement): void {
    const moreButton = container.querySelector('.post-tag-more') as HTMLElement;
    if (!moreButton) return;

    // タグデータの取得
    const allTags = this.getTagsFromContainer(container);
    const hiddenTags = allTags.slice(this.config.maxVisibleTags);

    if (hiddenTags.length === 0) return;

    // ポップアップの作成と設定
    const popup = this.createPopup(hiddenTags);
    container.appendChild(popup);

    // イベントリスナーの設定
    this.setupEventListeners(moreButton, popup);
  }

  /**
   * コンテナからタグデータを取得
   */
  private getTagsFromContainer(container: HTMLElement): string[] {
    try {
      const allTagsData = container.dataset.allTags;
      return allTagsData ? JSON.parse(allTagsData) : [];
    } catch (error) {
      if (window.clientLogger && window.clientLogger.log) {
        window.clientLogger.log(`Error parsing tags data: ${error}`, 'warning');
      }
      return [];
    }
  }

  /**
   * ポップアップ要素の作成
   */
  private createPopup(hiddenTags: string[]): HTMLElement {
    const popup = document.createElement('div');
    popup.className = this.config.popupClassName;
    popup.setAttribute('aria-hidden', 'true');

    const header = document.createElement('div');
    header.className = 'tag-popup-header';
    header.textContent = this.config.headerText;

    const content = document.createElement('div');
    content.className = 'tag-popup-content';

    hiddenTags.forEach((tag: string) => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag-popup-tag';
      tagElement.textContent = tag;
      content.appendChild(tagElement);
    });

    popup.appendChild(header);
    popup.appendChild(content);

    return popup;
  }

  /**
   * イベントリスナーの設定
   */
  private setupEventListeners(moreButton: HTMLElement, popup: HTMLElement): void {
    // ホバーイベント
    if (this.config.showOnHover) {
      moreButton.addEventListener('mouseenter', () => this.showPopup(popup, moreButton));
      moreButton.addEventListener('mouseleave', () => this.hidePopup(popup, moreButton));
    }

    // クリックイベント
    if (this.config.showOnClick) {
      moreButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePopup(popup, moreButton);
      });
    }

    // タッチイベント（モバイル対応）
    moreButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.togglePopup(popup, moreButton);
    });

    // キーボードイベント（アクセシビリティ）
    moreButton.addEventListener('keydown', (e) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
        e.preventDefault();
        this.togglePopup(popup, moreButton);
      }
      if (keyEvent.key === 'Escape') {
        this.hidePopup(popup, moreButton);
      }
    });

    // ARIA属性の設定
    this.setupAriaAttributes(moreButton, popup);
  }

  /**
   * ポップアップの表示
   */
  private showPopup(popup: HTMLElement, button: HTMLElement): void {
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
  }

  /**
   * ポップアップの非表示
   */
  private hidePopup(popup: HTMLElement, button: HTMLElement): void {
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
  }

  /**
   * ポップアップの切り替え
   */
  private togglePopup(popup: HTMLElement, button: HTMLElement): void {
    if (popup.classList.contains('show')) {
      this.hidePopup(popup, button);
    } else {
      this.showPopup(popup, button);
    }
  }

  /**
   * ARIA属性の設定
   */
  private setupAriaAttributes(button: HTMLElement, _popup: HTMLElement): void {
    button.setAttribute('role', 'button');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('tabindex', '0');

    const hiddenTags = this.getTagsFromContainer(button.parentElement as HTMLElement);
    const remainingCount = hiddenTags.length - this.config.maxVisibleTags;
    button.setAttribute('aria-label', `Tampilkan ${remainingCount} tag lainnya`);
  }

  /**
   * 動的に追加された要素にも適用
   */
  public refresh(): void {
    this.initialized = false;
    this.initialize();
  }

  /**
   * クリーンアップ
   */
  public cleanup(): void {
    const popups = document.querySelectorAll(`.${this.config.popupClassName}`);
    popups.forEach(popup => popup.remove());
    this.initialized = false;
  }
}

// グローバル関数として提供（既存コードとの互換性のため）
declare global {
  interface Window {
    initializeTagPopups?: () => void;
    simpleTagPopup?: SimpleTagPopup;
  }
}

// グローバル関数の設定
window.initializeTagPopups = function (): void {
  if (!window.simpleTagPopup) {
    window.simpleTagPopup = new SimpleTagPopup();
  }
  window.simpleTagPopup.initialize();
};
