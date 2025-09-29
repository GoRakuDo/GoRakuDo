/**
 * Image Zoom Functionality
 * Modern, accessible image zoom modal for Astro projects
 * Follows Astro architectural principles with minimal client-side JavaScript
 */

class ImageZoom {
  constructor() {
    this.modal = null;
    this.currentImage = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    // Create modal HTML structure
    this.createModal();

    // Add event listeners to zoom triggers
    this.addEventListeners();

    // Handle keyboard navigation
    this.handleKeyboard();
  }

  createModal() {
    // Create modal HTML structure
    const modalHTML = `
      <div class="image-zoom-modal" id="image-zoom-modal" inert>
        <div class="image-zoom-container">
          <button class="image-zoom-close" id="image-zoom-close" aria-label="画像を閉じる">
            ×
          </button>
          <div class="image-zoom-content">
            <img class="image-zoom-image" id="image-zoom-image" alt="" />
          </div>
        </div>
      </div>
    `;

    // Insert modal into document
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Get modal elements
    this.modal = document.getElementById('image-zoom-modal');
    this.image = document.getElementById('image-zoom-image');
    this.closeButton = document.getElementById('image-zoom-close');
  }

  addEventListeners() {
    // Add click listeners to all zoom triggers
    const triggers = document.querySelectorAll('.image-zoom-trigger');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', e => this.openModal(e));
      trigger.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openModal(e);
        }
      });
    });

    // Close modal events
    this.closeButton.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }

  handleKeyboard() {
    document.addEventListener('keydown', e => {
      if (this.isOpen) {
        if (e.key === 'Escape') {
          this.closeModal();
        }
      }
    });
  }

  openModal(event) {
    const trigger = event.currentTarget;
    const imageSrc = trigger.dataset.zoomSrc;
    const imageAlt = trigger.dataset.zoomAlt;

    if (!imageSrc) {
      console.warn('Image zoom: No data-zoom-src attribute found');
      return;
    }

    // Set image source and alt text
    this.image.src = imageSrc;
    this.image.alt = imageAlt || '拡大表示画像';

    // Show modal
    this.modal.classList.add('is-open');
    this.modal.removeAttribute('inert');
    this.isOpen = true;

    // Focus management
    this.closeButton.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Store reference to trigger for focus return
    this.currentImage = trigger;
  }

  closeModal() {
    if (!this.isOpen) return;

    // Hide modal
    this.modal.classList.remove('is-open');
    this.modal.setAttribute('inert', '');
    this.isOpen = false;

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus to trigger
    if (this.currentImage) {
      this.currentImage.focus();
      this.currentImage = null;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ImageZoom();
  });
} else {
  new ImageZoom();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageZoom;
}
