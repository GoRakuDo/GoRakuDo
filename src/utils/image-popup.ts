/**
 * Image Popup Utility
 * 
 * 画像クリック時のpopup overlay機能を提供するユーティリティ
 * TabletとDesktopでのみ動作し、モバイルでは無効化される
 * 
 * ========================================
 * 導入方法・使用方法
 * ========================================
 * 
 * 1. HTMLの構造
 * -------------
 * クリック可能な画像にクラスを追加：
 * <img class="kaiwa-practice-image-clickable" 
 *      src="thumbnail.jpg" 
 *      data-full-src="full-size.jpg" 
 *      alt="画像の説明" />
 * 
 * ポップアップオーバーレイのHTMLを追加：
 * <div id="image-popup-overlay" class="image-popup-overlay">
 *   <div class="image-popup-container">
 *     <button class="image-popup-close" aria-label="画像を閉じる">×</button>
 *     <img id="popup-image" class="popup-image" alt="拡大画像" />
 *     <p class="popup-caption">画像のキャプション（オプション）</p>
 *   </div>
 * </div>
 * 
 * 2. CSSの設定
 * ------------
 * global.cssに以下のスタイルが含まれていることを確認：
 * - .image-popup-overlay
 * - .image-popup-container  
 * - .image-popup-close
 * - .popup-image
 * - .popup-caption
 * 
 * 3. JavaScriptの初期化
 * --------------------
 * 方法A: 自動初期化（推奨）
 * import { autoInitImagePopup } from './utils/image-popup';
 * autoInitImagePopup();
 * 
 * 方法B: 手動初期化
 * import { initImagePopup } from './utils/image-popup';
 * const imagePopup = initImagePopup();
 * 
 * 方法C: カスタム設定での初期化
 * import { ImagePopup } from './utils/image-popup';
 * const customPopup = new ImagePopup({
 *   clickableSelector: '.my-custom-image',
 *   overlaySelector: '#my-overlay',
 *   imageSelector: '#my-image',
 *   closeButtonSelector: '.my-close-btn',
 *   minWidth: 1024
 * });
 * customPopup.init();
 * 
 * 4. Astroでの使用例
 * -----------------
 * // index.astro
 * <script>
 *   import { autoInitImagePopup } from '../utils/image-popup';
 *   autoInitImagePopup();
 * </script>
 * 
 * 5. カスタマイズオプション
 * ------------------------
 * - clickableSelector: クリック可能な画像のセレクタ（デフォルト: '.kaiwa-practice-image-clickable'）
 * - overlaySelector: オーバーレイのセレクタ（デフォルト: '#image-popup-overlay'）
 * - imageSelector: ポップアップ画像のセレクタ（デフォルト: '#popup-image'）
 * - closeButtonSelector: 閉じるボタンのセレクタ（デフォルト: '.image-popup-close'）
 * - minWidth: 機能を有効にする最小画面幅（デフォルト: 768px）
 * 
 * 6. 注意事項
 * ----------
 * - モバイル（768px未満）では自動的に無効化されます
 * - data-full-src属性がない場合は、src属性の画像が使用されます
 * - アクセシビリティのため、閉じるボタンにはaria-labelを設定してください
 * - オーバーレイクリック、Escapeキーでもポップアップを閉じることができます
 * - ポップアップ表示中はbodyのスクロールが無効化されます
 * 
 * 7. トラブルシューティング
 * ------------------------
 * - 要素が見つからない場合はコンソールに警告が表示されます
 * - イベントリスナーが正しく設定されているか確認してください
 * - CSSのz-indexが適切に設定されているか確認してください
 */

export interface ImagePopupConfig {
 clickableSelector: string;
 overlaySelector: string;
 imageSelector: string;
 closeButtonSelector: string;
 minWidth: number;
}

export class ImagePopup {
 private config: ImagePopupConfig;
 private clickableImage: HTMLElement | null = null;
 private popupOverlay: HTMLElement | null = null;
 private popupImage: HTMLImageElement | null = null;
 private closeButton: HTMLElement | null = null;
 private isInitialized = false;

 constructor(config: Partial<ImagePopupConfig> = {}) {
  this.config = {
   clickableSelector: '.kaiwa-practice-image-clickable',
   overlaySelector: '#image-popup-overlay',
   imageSelector: '#popup-image',
   closeButtonSelector: '.image-popup-close',
   minWidth: 768,
   ...config,
  };
 }

 /**
  * 画像popup機能を初期化
  */
 public init(): void {
  if (this.isInitialized) {
   return;
  }

  this.clickableImage = document.querySelector(this.config.clickableSelector);
  this.popupOverlay = document.querySelector(this.config.overlaySelector);
  this.popupImage = document.querySelector(this.config.imageSelector);
  this.closeButton = document.querySelector(this.config.closeButtonSelector);

  if (!this.clickableImage || !this.popupOverlay || !this.popupImage || !this.closeButton) {
   console.warn('Image popup elements not found');
   return;
  }

  this.setupEventListeners();
  this.isInitialized = true;
 }

 /**
  * イベントリスナーを設定
  */
 private setupEventListeners(): void {
  // 画像クリックイベント（Tablet/Desktopのみ）
  if (window.innerWidth >= this.config.minWidth) {
   this.clickableImage!.addEventListener('click', this.handleImageClick.bind(this));
  }

  // 閉じるボタンクリック
  this.closeButton!.addEventListener('click', this.closePopup.bind(this));

  // オーバーレイクリック（画像以外）
  this.popupOverlay!.addEventListener('click', this.handleOverlayClick.bind(this));

  // Escapeキー
  document.addEventListener('keydown', this.handleKeydown.bind(this));

  // ウィンドウリサイズ
  window.addEventListener('resize', this.handleResize.bind(this));
 }

 /**
  * 画像クリック時の処理
  */
 private handleImageClick(event: Event): void {
  const target = event.currentTarget as HTMLElement;
  const fullSrc = target.getAttribute('data-full-src') || (target as HTMLImageElement).src;

  if (this.popupImage) {
   this.popupImage.src = fullSrc;
   this.showPopup();
  }
 }

 /**
  * オーバーレイクリック時の処理
  */
 private handleOverlayClick(event: Event): void {
  if (event.target === this.popupOverlay) {
   this.closePopup();
  }
 }

 /**
  * キーボードイベントの処理
  */
 private handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && this.popupOverlay?.classList.contains('active')) {
   this.closePopup();
  }
 }

 /**
  * ウィンドウリサイズ時の処理
  */
 private handleResize(): void {
  if (this.clickableImage) {
   if (window.innerWidth >= this.config.minWidth) {
    this.clickableImage.style.cursor = 'pointer';
    // クリックイベントを再設定
    this.clickableImage.removeEventListener('click', this.handleImageClick.bind(this));
    this.clickableImage.addEventListener('click', this.handleImageClick.bind(this));
   } else {
    this.clickableImage.style.cursor = 'default';
    // クリックイベントを削除
    this.clickableImage.removeEventListener('click', this.handleImageClick.bind(this));
   }
  }
 }

 /**
  * Popupを表示
  */
 private showPopup(): void {
  if (this.popupOverlay) {
   this.popupOverlay.classList.add('active');
   document.body.style.overflow = 'hidden';
  }
 }

 /**
  * Popupを閉じる
  */
 private closePopup(): void {
  if (this.popupOverlay) {
   this.popupOverlay.classList.remove('active');
   document.body.style.overflow = '';
  }
 }

 /**
  * インスタンスを破棄
  */
 public destroy(): void {
  if (!this.isInitialized) {
   return;
  }

  // イベントリスナーを削除
  if (this.clickableImage) {
   this.clickableImage.removeEventListener('click', this.handleImageClick.bind(this));
  }

  if (this.closeButton) {
   this.closeButton.removeEventListener('click', this.closePopup.bind(this));
  }

  if (this.popupOverlay) {
   this.popupOverlay.removeEventListener('click', this.handleOverlayClick.bind(this));
  }

  document.removeEventListener('keydown', this.handleKeydown.bind(this));
  window.removeEventListener('resize', this.handleResize.bind(this));

  this.isInitialized = false;
 }
}

/**
 * デフォルトのImagePopupインスタンスを作成・初期化
 */
export function initImagePopup(): ImagePopup {
 const imagePopup = new ImagePopup();
 imagePopup.init();
 return imagePopup;
}

/**
 * DOMContentLoadedイベントで自動初期化
 */
export function autoInitImagePopup(): void {
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImagePopup);
 } else {
  initImagePopup();
 }
}
