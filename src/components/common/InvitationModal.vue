<template>
  <transition name="fade-scale">
    <div
      v-if="isOpen"
      id="invitationModal"
      class="modal-overlay"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <!-- Floating background particles with varied animations -->
      <div
        class="floating-particle"
        style="top: 10%; left: 10%; animation: float 6s ease-in-out infinite"
      >
        🌸
      </div>
      <div
        class="floating-particle"
        style="
          top: 20%;
          right: 10%;
          animation: float2 8s ease-in-out infinite 2s;
        "
      >
        ⭐
      </div>
      <div
        class="floating-particle"
        style="
          bottom: 20%;
          left: 20%;
          animation: float3 7s ease-in-out infinite 1s;
        "
      >
        🎌
      </div>
      <div
        class="floating-particle"
        style="
          right: 20%;
          bottom: 30%;
          animation: float 9s ease-in-out infinite 3s;
        "
      >
        🌊
      </div>

      <div class="invitation-container">
        <button class="back-button" @click="close" aria-label="Tutup modal">
          ←
        </button>

        <div class="header">
          <ruby class="japanese-title" id="modal-title">
            語<rt>ご</rt>楽<rt>らく</rt>道<rt>どう</rt>
          </ruby>
        </div>

        <div class="content">
          <p>
            Kami bukan komunitas biasa. Kita adalah rumah bagi para pembelajar
            otodidak yang terjun langsung ke
            <strong>🌊 Metode IMMERSION</strong>—sebuah cara belajar yang seru,
            alami, dan terbukti secara ilmiah oleh 🎓 Prof. Stephen Krashen.
          </p>

          <p><strong>Siapa yang kami cari?</strong></p>
          <ul class="member-list" role="list">
            <li role="listitem">
              ✅ <strong>Otaku & Anime Lovers:</strong> Ubah hobimu jadi skill!
            </li>
            <li role="listitem">
              ✅ <strong>Pembelajar Serius:</strong> Temukan cara belajar paling
              efektif.
            </li>
          </ul>

          <p class="final-pitch">
            Semua 100% GRATIS👍<br />Yang kamu butuhkan hanya NIAT.<br />Ayo
            bergabung..!
          </p>
        </div>

        <a
          href="https://discord.gg/j8qmYPAGQh"
          target="_blank"
          rel="noopener noreferrer"
          class="discord-link"
          aria-label="Bergabung dengan server Discord GoRakuDo"
        >
          <div class="discord-header">Alamat Komunitas Digital Kami:</div>
          <div class="discord-url">
            discord.gg/j8qmYPAGQh<span class="arrow">→</span>
          </div>
        </a>

        <div class="signature">
          <img
            src="/img/Logo%20Discord%2080px.webp"
            alt="Logo Gorakudou"
            class="logo-stamp"
          />
          <div class="signature-text">
            <div class="signature-title">Hormat kami,</div>
            <p class="signature-name">Tim GoRakuDo</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue';

// ========== TYPE DEFINITIONS - STRICT MODE COMPLIANT ==========
/**
 * Modal state interface
 * REASONING: Strict typing for modal component state
 * Note: Currently unused but available for future state management
 */
// interface ModalState {
//   isOpen: Ref<boolean>;
// }

/**
 * Touch event interface
 * REASONING: Type-safe touch event handling
 * Note: Extends native TouchEvent for better type safety
 */
interface CustomTouchEvent extends TouchEvent {
  touches: TouchList;
  changedTouches: TouchList;
}

/**
 * Keyboard event interface
 * REASONING: Type-safe keyboard event handling
 * Note: Extends native KeyboardEvent for better type safety
 */
interface CustomKeyboardEvent extends KeyboardEvent {
  key: string;
}

// ========== COMPONENT STATE ==========
const isOpen: Ref<boolean> = ref<boolean>(false);

/**
 * Open modal with body scroll lock
 * REASONING: 3-line function following KISS principle
 */
function open(): void {
  isOpen.value = true;
  document.body.style.overflow = 'hidden';
}

/**
 * Close modal with body scroll restoration
 * REASONING: 3-line function following KISS principle
 */
function close(): void {
  isOpen.value = false;
  document.body.style.overflow = '';
}

// Expose methods to parent component
defineExpose({
  open,
  close,
});

// ========== EVENT HANDLERS - TYPE SAFE ==========
/**
 * Keyboard navigation handler
 * REASONING: Type-safe keyboard event handling
 */
function handleKeydown(e: CustomKeyboardEvent): void {
  if (e.key === 'Escape' && isOpen.value) {
    close();
  }
}

// ========== TOUCH GESTURE SUPPORT - TYPE SAFE ==========
/**
 * Touch gesture state
 * REASONING: Type-safe touch gesture handling
 */
let touchStartY: number = 0;
let touchEndY: number = 0;

/**
 * Handle touch start event
 * REASONING: Type-safe touch event handling
 */
function handleTouchStart(e: CustomTouchEvent): void {
  touchStartY = e.touches[0].clientY;
}

/**
 * Handle touch end event
 * REASONING: Type-safe touch event handling
 */
function handleTouchEnd(e: CustomTouchEvent): void {
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
}

/**
 * Handle swipe gesture
 * REASONING: Type-safe swipe gesture handling
 */
function handleSwipe(): void {
  const swipeThreshold: number = 100;
  const swipeDistance: number = touchEndY - touchStartY;

  // Swipe down to close modal (only if started from top area)
  if (swipeDistance > swipeThreshold && touchStartY < 100) {
    close();
  }
}

// ========== VIEWPORT ADJUSTMENT - TYPE SAFE ==========
/**
 * Mobile viewport height detection and adjustment
 * REASONING: Type-safe DOM manipulation
 */
function adjustModalForMobile(): void {
  const modalOverlay: HTMLElement | null =
    document.querySelector('.modal-overlay');
  const invitationContainer: HTMLElement | null = document.querySelector(
    '.invitation-container'
  );

  if (modalOverlay && invitationContainer) {
    if (window.innerHeight < 700) {
      // Small screen detected - adjust for mobile scrolling
      modalOverlay.style.alignItems = 'flex-start';
      modalOverlay.style.paddingTop = '10px';
      modalOverlay.style.paddingBottom = '10px';
    } else {
      // Desktop - center the modal
      modalOverlay.style.alignItems = 'center';
      modalOverlay.style.paddingTop = '20px';
      modalOverlay.style.paddingBottom = '20px';
    }
  }
}

// ========== LIFECYCLE MANAGEMENT - TYPE SAFE ==========
/**
 * Component mount lifecycle
 * REASONING: Type-safe global function exposure
 */
onMounted(() => {
  // Expose to global for legacy code compatibility with strict typing
  (window as Window).openInvitationModal = open;
  (window as Window).closeInvitationModal = close;

  // Add keyboard event listener
  document.addEventListener('keydown', handleKeydown);

  // Add touch event listeners for mobile gesture support
  const modalOverlay: HTMLElement | null =
    document.querySelector('.modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener
    );
    modalOverlay.addEventListener(
      'touchend',
      handleTouchEnd as unknown as EventListener
    );
  }

  // Adjust modal for mobile viewport
  adjustModalForMobile();
  window.addEventListener('resize', adjustModalForMobile);

  // Add content animations when modal opens
  if (isOpen.value) {
    animateContent();
  }

  // Global event listener for opening modal from anywhere
  window.addEventListener('open-invitation-modal', open);

  // Global function for opening modal with strict typing
  (window as Window).openInvitationModal = open;

  // Check URL parameter for modal opening
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('openModal') === 'true') {
    open();
    // Clean up URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }
});

/**
 * Component unmount lifecycle
 * REASONING: Type-safe cleanup with strict typing
 */
onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener(
    'keydown',
    handleKeydown as unknown as EventListener
  );
  window.removeEventListener('resize', adjustModalForMobile);

  const modalOverlay: HTMLElement | null =
    document.querySelector('.modal-overlay');
  if (modalOverlay) {
    modalOverlay.removeEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener
    );
    modalOverlay.removeEventListener(
      'touchend',
      handleTouchEnd as unknown as EventListener
    );
  }

  // Clean up global listeners with strict typing
  window.removeEventListener(
    'open-invitation-modal',
    open as unknown as EventListener
  );
  delete window.openInvitationModal;
});

// ========== REACTIVE WATCHERS - TYPE SAFE ==========
/**
 * Watch for modal open state to trigger animations
 * REASONING: Type-safe reactive watcher
 */
watch(isOpen, (newValue: boolean) => {
  if (newValue) {
    // Trigger animations after modal is rendered
    setTimeout(animateContent, 100);
    // Adjust for mobile after modal opens
    setTimeout(adjustModalForMobile, 150);
  }
});

// ========== ANIMATION FUNCTIONS - TYPE SAFE ==========
/**
 * Animate content elements
 * REASONING: Type-safe DOM manipulation and animation
 */
function animateContent(): void {
  const elements: NodeListOf<Element> = document.querySelectorAll(
    '.content p, .member-list li'
  );
  elements.forEach((el: Element, index: number) => {
    const element: HTMLElement = el as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    setTimeout(
      () => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      },
      (index + 1) * 100
    );
  });
}
</script>

<style scoped>
/* Import fonts to match discord.astro exactly */
@import url('https://fonts.googleapis.com/css2?family=Yuji+Syuku&family=Inter:wght@300;400;500;600;700&family=Lora:wght@400;600&family=Cedarville+Cursive&display=swap');

/* Modal overlay with responsive scrolling - FIXED for mobile overflow */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center; /* Default center for desktop */
  overflow: hidden auto; /* Prevent horizontal scrolling */

  /* Enable smooth scrolling on mobile */

  /* Enable vertical scrolling */
  width: 100%;
  height: 100%;
  padding: 20px;
  background: linear-gradient(
    135deg,
    oklch(4% 0 0deg) 0%,
    oklch(10% 0 0deg) 100%
  );
  color: oklch(25% 0 0deg);
  -webkit-overflow-scrolling: touch; /* iOS smooth scrolling */
  scroll-behavior: smooth; /* Modern browsers */
}

/* Main invitation container - responsive for mobile scrolling with wave pattern background and FIXED DESKTOP WIDTH */
.invitation-container {
  position: relative;
  width: 600px; /* Fixed width for desktop */
  min-width: 600px; /* Prevent shrinking */

  /* FIXED DESKTOP WIDTH - No expansion beyond 600px */
  max-width: 600px;
  min-height: fit-content;
  margin: auto;
  padding: 50px;
  border: 1px solid var(--clr-paper-border);
  border-radius: var(--border-radius-card);
  background-color: var(--clr-paper-bg);
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"%3E%3Cg fill="none" stroke="%23DCD9D5" stroke-width="1"%3E%3Cpath d="M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30S1000 75 1000 75"/%3E%3Cpath d="M-500 125c0 0 125-30 250-30S0 125 0 125s125 30 250 30s250-30 250-30s125-30 250-30S1000 125 1000 125"/%3E%3Cpath d="M-500 175c0 0 125-30 250-30S0 175 0 175s125 30 250 30s250-30 250-30s125-30 250-30S1000 175 1000 175"/%3E%3Cpath d="M-500 225c0 0 125-30 250-30S0 225 0 225s125 30 250 30s250-30 250-30s125-30 250-30S1000 225 1000 225"/%3E%3Cpath d="M-500 275c0 0 125-30 250-30S0 275 0 275s125 30 250 30s250-30 250-30s125-30 250-30S1000 275 1000 275"/%3E%3Cpath d="M-500 325c0 0 125-30 250-30S0 325 0 325s125 30 250 30s250-30 250-30s125-30 250-30S1000 325 1000 325"/%3E%3Cpath d="M-500 375c0 0 125-30 250-30S0 375 0 375s125 30 250 30s250-30 250-30s125-30 250-30S1000 375 1000 375"/%3E%3Cpath d="M-500 425c0 0 125-30 250-30S0 425 0 425s125 30 250 30s250-30 250-30s125-30 250-30S1000 425 1000 425"/%3E%3Cpath d="M-500 475c0 0 125-30 250-30S0 475 0 475s125 30 250 30s250-30 250-30s125-30 250-30S1000 475 1000 475"/%3E%3Cpath d="M-500 525c0 0 125-30 250-30S0 525 0 525s125 30 250 30s250-30 250-30s125-30 250-30S1000 525 1000 525"/%3E%3Cpath d="M-500 575c0 0 125-30 250-30S0 575 0 575s125 30 250 30s250-30 250-30s125-30 250-30S1000 575 1000 575"/%3E%3Cpath d="M-500 625c0 0 125-30 250-30S0 625 0 625s125 30 250 30s250-30 250-30s125-30 250-30S1000 625 1000 625"/%3E%3Cpath d="M-500 675c0 0 125-30 250-30S0 675 0 675s125 30 250 30s250-30 250-30s125-30 250-30S1000 675 1000 675"/%3E%3Cpath d="M-500 725c0 0 125-30 250-30S0 725 0 725s125 30 250 30s250-30 250-30s125-30 250-30S1000 725 1000 725"/%3E%3Cpath d="M-500 775c0 0 125-30 250-30S0 775 0 775s125 30 250 30s250-30 250-30s125-30 250-30S1000 775 1000 775"/%3E%3C/g%3E%3C/svg%3E');
  animation: fadeIn 1s ease-out;
  box-shadow: 0 20px 60px oklch(65% 0.25 280deg / 0.2);
}

/* Fade-in animation matching discord.astro */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Back button styling - responsive positioning */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10; /* Ensure it's above content */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: none;
  color: oklch(45% 0 0deg);
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: oklch(95% 0 0deg);
  color: oklch(25% 0 0deg);
}

/* Header section */
.header {
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--clr-paper-border);
  text-align: center;
}

/* Japanese title - responsive typography */
.japanese-title {
  color: oklch(20% 0 0deg);
  font-family: var(--font-jp);
  font-size: 4.5rem;
  font-weight: 400;
  line-height: 1;
  ruby-position: over;
}

.japanese-title rt {
  color: oklch(40% 0 0deg);
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 600;
}

/* Content styling - responsive typography */
.content {
  margin-bottom: 30px;
  color: var(--clr-paper-text-primary);
  font-family: var(--font-serif);
  font-size: 1.1rem;
  line-height: 1.8;
}

.content p {
  margin-bottom: 1.2em;
}

.content strong {
  color: oklch(25% 0 0deg);
}

/* Member list styling */
.member-list {
  margin: 25px 0;
  padding-left: 0;
  list-style: none;
}

.member-list li {
  margin-bottom: 10px;
  font-family: Inter, sans-serif;
}

/* Final pitch styling */
.final-pitch {
  margin-top: 30px;
  color: oklch(25% 0 0deg);
  font-size: 1.15rem;
  font-weight: 600;
  text-align: center;
}

/* Discord link styling - exact replica */
.discord-link {
  display: block;
  margin: 20px 2.5px 40px;
  padding: 20px;
  border: 1px solid oklch(92% 0.01 60deg);
  border-radius: 8px;
  background-color: oklch(97% 0.01 60deg);
  color: oklch(25% 0 0deg);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.discord-link:hover {
  border-color: var(--clr-accent);
  box-shadow: 0 5px 15px oklch(65% 0.25 280deg / 0.2);
  transform: scale(1.02);
}

.discord-header {
  margin-bottom: 8px;
  color: oklch(45% 0 0deg);
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 600;
}

.discord-url {
  color: var(--clr-accent);
  font-family: var(--font-primary);
  font-size: 1.1rem;
  font-weight: 600;
  overflow-wrap: break-word;
}

.arrow {
  display: inline-block;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.discord-link:hover .arrow {
  transform: translateX(5px);
}

/* Signature section - responsive layout */
.signature {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 20px;
}

.logo-stamp {
  width: 80px;
  height: 80px;
  opacity: 0.85;
  flex-shrink: 0;
}

.signature-text {
  text-align: right;
}

.signature-title {
  margin-bottom: -10px;
  color: oklch(25% 0 0deg);
  text-align: right;
}

.signature-name {
  color: oklch(25% 0 0deg);
  font-family: var(--font-cursive);
  font-size: 1.9rem;
  text-align: right;
}

/* Floating particles - ensure they don't interfere with scrolling */
.floating-particle {
  position: fixed;
  z-index: -1;
  opacity: 0.15;
  pointer-events: none;

  /* Prevent particles from blocking scroll */
}

/* Buttery smooth floating animations with varied patterns */
@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }

  25% {
    transform: translateY(-8px) translateX(4px);
  }

  50% {
    transform: translateY(-4px) translateX(-6px);
  }

  75% {
    transform: translateY(-12px) translateX(2px);
  }
}

@keyframes float2 {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }

  33% {
    transform: translateY(-6px) translateX(-3px);
  }

  66% {
    transform: translateY(-10px) translateX(5px);
  }
}

@keyframes float3 {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }

  50% {
    transform: translateY(-8px) translateX(-2px);
  }
}

/* Mobile-first responsive design - FIXED for mobile overflow with edge-to-edge layout */
@media (max-width: 768px) {
  .modal-overlay {
    align-items: flex-start;
    padding: 0; /* Remove all padding for edge-to-edge */
  }

  .invitation-container {
    width: 100vw; /* Full viewport width */
    max-width: 100vw; /* Override max-width */
    min-height: 100vh; /* Full viewport height */
    margin: 0; /* Remove margins for edge-to-edge */
    padding: 30px 20px;
    border-radius: 0; /* Remove border radius for edge-to-edge */
  }

  .japanese-title {
    margin-bottom: 25px; /* Increased spacing */
    color: oklch(20% 0 0deg); /* Slightly darker for better contrast */
    font-size: clamp(3.2rem, 12vw, 4.2rem); /* Increased from 2.2rem-2.8rem */
    font-weight: 500; /* Slightly bolder for better visibility */
    line-height: 1.1;
    letter-spacing: 0.02em; /* Slight letter spacing for clarity */
    animation: logoEmphasis 0.8s ease-out;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizelegibility;
    font-feature-settings:
      'liga' 1,
      'kern' 1;
    text-shadow: 0 1px 2px oklch(0% 0 0deg / 0.05); /* Subtle shadow */
  }

  .japanese-title rt {
    margin-top: 8px; /* Better spacing for ruby text */
    font-size: clamp(1rem, 4vw, 1.2rem); /* Increased ruby text */
    font-weight: 600;
  }

  .content {
    margin-bottom: 25px;
    font-size: clamp(0.9rem, 4vw, 0.95rem);
    line-height: 1.7;
    text-align: justify; /* Better text alignment */
    hyphens: auto; /* Enable hyphenation */
    overflow-wrap: break-word; /* Prevent overflow */
  }

  .content p {
    margin-bottom: 1em;
    text-indent: 0; /* Remove text indentation */
  }

  .member-list {
    margin: 20px 0;
    padding-left: 0;
  }

  .member-list li {
    margin-bottom: 12px;
    padding-left: 0;
    line-height: 1.5;
    text-align: left;
  }

  .final-pitch {
    margin-top: 25px;
    font-size: clamp(1rem, 4.5vw, 1.15rem);
    font-weight: 600;
    line-height: 1.4;
    text-align: center;
  }

  .discord-header {
    margin-bottom: 10px;
    font-size: clamp(0.8rem, 3.5vw, 0.9rem);
  }

  .discord-url {
    font-size: clamp(1rem, 4.5vw, 1.1rem);
    line-height: 1.3;
  }

  .signature-name {
    font-size: clamp(1.4rem, 6vw, 1.6rem);
    line-height: 1.2;
  }

  /* Visual scroll indicators for mobile */
  .invitation-container::before,
  .invitation-container::after {
    position: absolute;
    left: 50%;
    width: 40px;
    height: 4px;
    border-radius: 2px;
    background: oklch(65% 0.25 280deg / 0.3);
    opacity: 0.6;
    transform: translateX(-50%);
    content: '';
  }

  .invitation-container::before {
    top: 10px;
  }

  .invitation-container::after {
    bottom: 10px;
  }

  /* Sticky back button for mobile */
  .back-button {
    position: sticky;
    top: 10px;
    left: 10px;
    width: 48px; /* Larger touch target */
    height: 48px;
    border: 1px solid oklch(65% 0.25 280deg / 0.1);
    background: oklch(100% 0 0deg / 0.9);
    font-size: 22px;
    backdrop-filter: blur(10px);
  }

  /* Better touch targets for mobile */
  .discord-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 60px; /* Minimum touch target height */
  }

  /* Better visual hierarchy on mobile */
  .header {
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom-width: 2px; /* Slightly thicker border */
  }

  .content strong {
    color: oklch(20% 0 0deg);
    font-weight: 700; /* Bolder emphasis */
  }

  .member-list li strong {
    color: oklch(25% 0 0deg);
    font-weight: 600;
  }

  /* Add subtle spacing between sections */
  .content > p:not(:last-child) {
    margin-bottom: 1.5em;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0;
  }

  .invitation-container {
    width: 100vw;
    max-width: 100vw;
    margin: 0;
    padding: 25px 15px;
    border-radius: 0;
  }

  .japanese-title {
    margin-bottom: 20px;
    font-size: clamp(2.8rem, 10vw, 3.6rem); /* Increased from 1.8rem-2.4rem */
    line-height: 1.05;
  }

  .japanese-title rt {
    margin-top: 6px;
    font-size: clamp(0.9rem, 3.5vw, 1.1rem);
  }

  .content {
    margin-bottom: 20px;
    font-size: clamp(0.85rem, 3.5vw, 0.9rem);
    line-height: 1.6;
  }

  .member-list li {
    margin-bottom: 10px;
    font-size: clamp(0.8rem, 3.5vw, 0.9rem);
  }

  .final-pitch {
    margin-top: 20px;
    font-size: clamp(0.9rem, 4vw, 1rem);
  }

  .discord-link {
    margin: 15px 0 30px;
    padding: 20px 15px;
  }

  .signature {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 15px;
  }

  .signature-text {
    text-align: center;
  }

  .logo-stamp {
    width: 60px;
    height: 60px;
  }

  /* Enhanced touch targets for mobile */
  .back-button {
    width: 44px; /* Minimum touch target size */
    height: 44px;
    font-size: 20px;
  }
}

/* Desktop-specific back button positioning */
@media (min-width: 769px) {
  .back-button {
    position: absolute; /* Revert to absolute on desktop */
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
}

/* High DPI display optimizations */
@media (min-resolution: 2dppx), (min-resolution: 192dpi) {
  .invitation-container {
    border-width: 0.5px; /* Thinner borders on high DPI */
  }

  .back-button {
    border-width: 0.5px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .modal-overlay {
    scroll-behavior: auto;
  }

  .invitation-container {
    animation: none;
  }

  .floating-particle {
    animation: none;
  }

  .discord-link:hover {
    transform: none;
  }

  .arrow {
    transition: none;
  }

  .discord-link:hover .arrow {
    transform: none;
  }
}

/* Vue transition for modal scale + fade */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Android-specific viewport fixes */
@supports (-webkit-touch-callout: none) {
  /* iOS devices */
  .modal-overlay {
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
      env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
}

/* Android Chrome and other browsers */
@media screen and (max-width: 768px) {
  .modal-overlay {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  .invitation-container {
    width: 100%;
    max-width: none;
    margin: 0;
    border-radius: 0;
  }
}

/* Android viewport fixes */
@supports not (-webkit-touch-callout: none) {
  /* Non-iOS devices (Android) */
  .modal-overlay {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  .invitation-container {
    width: 100%;
    max-width: none;
    min-height: 100vh;
    margin: 0;
    border-radius: 0;
  }
}

/* Prevent horizontal scrolling on Android */
@media screen and (max-width: 768px) {
  body {
    overflow-x: hidden;
  }

  .modal-overlay {
    overflow-x: hidden;
  }
}

/* Android Chrome specific adjustments */
@media screen and (max-width: 768px) and (min-resolution: 1dppx) {
  .invitation-container {
    /* Force hardware acceleration */
    transform: translateZ(0);
  }

  .modal-overlay {
    transform: translateZ(0);
    -webkit-overflow-scrolling: touch;
  }
}

/* Optimize for high DPI displays */
@media (min-resolution: 2dppx), (min-resolution: 192dpi) {
  .japanese-title {
    font-weight: 600; /* Slightly bolder on high DPI */
  }

  .japanese-title rt {
    font-weight: 700; /* Bolder ruby text */
  }
}

/* Desktop-first approach with fixed sizing and HEIGHT CONSTRAINTS */
@media (min-width: 768px) {
  .invitation-container {
    /* Content-based height with constraints */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    overflow: hidden auto; /* Prevent horizontal scrolling */

    /* Ensure proper overflow handling */

    /* Enable scrolling if content exceeds max-height */
    width: 600px; /* Fixed width on desktop */
    min-width: 600px;
    max-width: 600px;
    height: auto; /* Let content determine natural height */
    min-height: auto; /* Allow content to determine minimum height */

    /* HEIGHT CONSTRAINTS - Prevent excessive stretching */
    max-height: 90vh; /* Maximum 90% of viewport height */
    margin: auto;

    /* Optimal padding for desktop */
    padding: 40px 50px; /* Slightly reduced top/bottom padding */
    flex-shrink: 0; /* Prevent flex shrinking */

    /* Smooth scrolling for overflow content */
    scrollbar-width: thin;
    scrollbar-color: oklch(65% 0.25 280deg / 0.3) transparent;
  }

  /* Custom scrollbar styling for webkit browsers */
  .invitation-container::-webkit-scrollbar {
    width: 6px;
  }

  .invitation-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .invitation-container::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: oklch(65% 0.25 280deg / 0.3);
  }

  .invitation-container::-webkit-scrollbar-thumb:hover {
    background: oklch(65% 0.25 280deg / 0.5);
  }

  .modal-overlay {
    justify-content: center;
    align-items: center;
    overflow: hidden auto;

    /* Ensure overlay can handle modal height constraints */
    min-height: 100vh;
    padding: 20px;
  }

  /* Optimize content spacing for constrained height */
  .header {
    max-width: 500px;
    margin-right: auto;
    margin-bottom: 25px; /* Reduced margin */
    margin-left: auto;
    padding-bottom: 20px; /* Reduced padding */
    flex-shrink: 0; /* Prevent header from shrinking */
  }

  .content {
    flex: 1; /* Allow content to expand */
    overflow: hidden auto;

    /* Ensure content is scrollable if needed */
    max-width: 500px; /* Optimal reading width */
    margin-right: auto;
    margin-bottom: 25px; /* Reduced margin */
    margin-left: auto;
  }

  .discord-link {
    max-width: 500px;
    margin: 15px auto 30px; /* Reduced margins */
    flex-shrink: 0; /* Prevent link from shrinking */
  }

  .signature {
    max-width: 500px;
    margin-top: 15px; /* Reduced margin */
    margin-right: auto;
    margin-left: auto;
    flex-shrink: 0; /* Prevent signature from shrinking */
  }

  /* Optimize typography for fixed container width */
  .japanese-title {
    margin-bottom: 0;
    font-size: 4.2rem; /* Slightly smaller for better fit */
    line-height: 1;
  }

  .japanese-title rt {
    font-size: 0.85rem;
  }

  .content p {
    margin-bottom: 1em;
  }

  .member-list {
    margin: 20px 0;
    padding-left: 0;
  }

  .member-list li {
    margin-bottom: 8px;
    text-align: left;
  }

  .final-pitch {
    margin-top: 20px;
    font-size: 1.1rem;
    line-height: 1.4;
    text-align: center;
  }

  .discord-url {
    font-size: 1.1rem;
  }

  .signature-name {
    font-size: 1.8rem; /* Slightly smaller */
  }

  /* Ensure perfect centering on desktop */

  /* Maintain consistent visual hierarchy on desktop */

  /* Enhanced desktop styling */

  .back-button {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  /* Optimize spacing between sections */
  .header + .content {
    margin-top: 0; /* Remove extra margin */
  }

  .content + .discord-link {
    margin-top: 15px; /* Consistent spacing */
  }

  .discord-link + .signature {
    margin-top: 15px; /* Consistent spacing */
  }
}

/* Mobile breakpoint - full width edge-to-edge */
@media (max-width: 480px) {
  .modal-overlay {
    align-items: flex-start;
    padding: 0;
  }
}

/* Large desktop screens - tighter height constraints */
@media (min-width: 1200px) {
  .invitation-container {
    max-height: 85vh; /* Slightly tighter constraint on large screens */
    padding: 35px 50px; /* Reduced padding */
  }

  .header {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  .content {
    margin-bottom: 20px;
  }

  .discord-link {
    margin: 10px auto 25px;
  }

  .signature {
    margin-top: 10px;
  }
}

/* Medium desktop screens - balanced constraints */
@media (min-width: 768px) and (max-width: 1199px) {
  .invitation-container {
    max-height: 90vh;
    padding: 40px 50px;
  }
}

/* Small desktop screens - more generous constraints */
@media (min-width: 768px) and (max-width: 1024px) {
  .invitation-container {
    max-height: 95vh; /* More generous on smaller desktop screens */
    padding: 45px 50px;
  }
}
</style>
