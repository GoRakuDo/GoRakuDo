// HOMEPAGE SCRIPT - Landing Page Specific JavaScript

// Global variables
let waveAnimation = null;

// Fluid Kanagawa Wave Animation
class WaveAnimation {
  constructor() {
    this.canvas = document.getElementById('waveCanvas');
    if (!this.canvas) {
      console.warn('Wave canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.animationId = null;
    this.time = 0;

    // ============================================================================
    // WAVE CONFIGURATION - HOW TO CHANGE NUMBER OF WAVES
    // ============================================================================
    //
    // TO CHANGE THE NUMBER OF WAVES:
    // 1. Add or remove wave objects from this array
    // 2. Each wave object requires these properties:
    //    - amplitude: Wave height (20-80 recommended)
    //    - frequency: Wave density (0.005-0.015 recommended)
    //    - speed: Animation speed (positive = right, negative = left)
    //    - offset: Phase offset (0 to Math.PI for variety)
    //    - color: Wave color with opacity (rgba format)
    //    - y: Vertical position (0.6-0.9 recommended, higher = lower on screen)
    //
    // EXAMPLE: To add a 5th wave, add this object to the array:
    // {
    //   amplitude: 30,
    //   frequency: 0.007,
    //   speed: 0.012,
    //   offset: Math.PI / 4,
    //   color: "rgba(139, 93, 255, 0.05)",
    //   y: 0.9,
    // }
    //
    // PERFORMANCE NOTE: Each wave adds rendering overhead. 3-6 waves recommended.
    // ============================================================================

    this.waves = [
      {
        amplitude: 40,
        frequency: 0.01,
        speed: 0.02,
        offset: 0,
        color: 'rgba(139, 93, 255, 0.08)',
        y: 0.7,
      },
      {
        amplitude: 60,
        frequency: 0.008,
        speed: -0.015,
        offset: Math.PI / 3,
        color: 'rgba(139, 93, 255, 0.06)',
        y: 0.75,
      },
      {
        amplitude: 35,
        frequency: 0.012,
        speed: 0.025,
        offset: Math.PI / 2,
        color: 'rgba(139, 93, 255, 0.04)',
        y: 0.8,
      },
      {
        amplitude: 45,
        frequency: 0.009,
        speed: -0.018,
        offset: Math.PI,
        color: 'rgba(139, 93, 255, 0.03)',
        y: 0.85,
      },
    ];

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.animate();
    console.log('🌊 Wave animation initialized');
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Update wave y positions based on new height
    this.waves.forEach(wave => {
      wave.yPos = this.height * wave.y;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Create gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, 'rgba(10, 10, 10, 1)');
    gradient.addColorStop(0.5, 'rgba(10, 10, 10, 0.95)');
    gradient.addColorStop(1, 'rgba(139, 93, 255, 0.02)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw waves
    this.waves.forEach((wave, index) => {
      this.ctx.beginPath();

      // Create wave path
      for (let x = 0; x <= this.width + 10; x += 2) {
        const y =
          wave.yPos +
          Math.sin(x * wave.frequency + this.time * wave.speed + wave.offset) *
            wave.amplitude;

        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      // Close the path to create filled area
      this.ctx.lineTo(this.width, this.height);
      this.ctx.lineTo(0, this.height);
      this.ctx.closePath();

      this.ctx.fillStyle = wave.color;
      this.ctx.fill();

      // Add subtle stroke for more definition
      this.ctx.strokeStyle = 'rgba(139, 93, 255, 0.1)';
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    });

    // Add floating particles
    for (let i = 0; i < 8; i++) {
      const x =
        this.width * 0.1 +
        i * this.width * 0.1 +
        Math.sin(this.time * 0.01 + i) * 20;
      const y = this.height * 0.3 + Math.sin(this.time * 0.008 + i * 1.5) * 30;
      const size = 1 + Math.sin(this.time * 0.02 + i) * 0.5;
      const opacity = 0.3 + Math.sin(this.time * 0.015 + i) * 0.2;

      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(139, 93, 255, ${opacity})`;
      this.ctx.fill();
    }

    this.time += 1;
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}

// Navigation and interaction functions - Make them globally accessible
window.scrollToMission = function () {
  console.log('📍 Calculating custom scroll to mission section...');
  const missionSection = document.getElementById('mission');
  const navbar = document.querySelector('.navbar');

  if (missionSection && navbar) {
    // 1. Get the height of the fixed navigation bar.
    const navbarHeight = navbar.offsetHeight;

    // 2. Get the position of the top of the mission section.
    const missionSectionTop =
      missionSection.getBoundingClientRect().top + window.pageYOffset;

    // 3. Define a comfortable top margin (in pixels). Adjust this value if needed.
    const desiredTopMargin = 40;

    // 4. Calculate the final, perfect scroll position.
    const scrollToPosition =
      missionSectionTop - navbarHeight - desiredTopMargin;

    // 5. Command the window to scroll smoothly to that exact position.
    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth',
    });
  } else {
    // Fallback in case something isn't found
    console.warn('Mission section or navbar not found for custom scroll.');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

window.goToPosts = function () {
  console.log('📚 Navigating to posts...');
  window.location.href = '/docs';
};

// Modal functions for invitation - Make them globally accessible
window.openInvitationModal = function () {
  console.log('🎯 Opening invitation modal...');
  const modal = document.getElementById('invitationModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Add modal opening animation
    setTimeout(() => {
      modal.style.opacity = '1';
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.style.transform = 'scale(1)';
      }
    }, 10);
  } else {
    console.warn('Invitation modal not found');
  }
};

window.closeInvitationModal = function () {
  console.log('❌ Closing invitation modal...');
  const modal = document.getElementById('invitationModal');
  if (modal) {
    modal.style.opacity = '0';
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.transform = 'scale(0.95)';
    }

    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 200);
  }
};

// Enhanced close modal functionality
document.addEventListener('click', function (e) {
  const modal = document.getElementById('invitationModal');
  if (modal && e.target === modal) {
    closeInvitationModal();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeInvitationModal();
  }
});

// Navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
      navbar.style.backdropFilter = 'blur(15px)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.9)';
      navbar.style.backdropFilter = 'blur(10px)';
    }
  }
}

// Parallax effect for stars
function handleStarsParallax() {
  const scrolled = window.pageYOffset;
  const stars = document.querySelectorAll('.star');

  stars.forEach((star, index) => {
    const speed = 0.5 + index * 0.1;
    star.style.transform = `translateY(${scrolled * speed}px)`;
  });
}

// Intersection Observer for fade-in animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for animations
  const animatedElements = document.querySelectorAll(
    '.mission-section, .features-section, .docs-preview-section'
  );
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });

  // Stagger animation for feature cards
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.8s ease ${index * 0.15}s, transform 0.8s ease ${index * 0.15}s`;

    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    cardObserver.observe(card);
  });
}

// Enhanced hover effects for feature cards
function setupFeatureCardEffects() {
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      this.style.boxShadow = '0 15px 40px rgba(139, 93, 255, 0.15)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 10px 30px rgba(139, 93, 255, 0.1)';
    });
  });
}

// Keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.classList.contains('nav-item')) {
      if (e.target.textContent === 'Gabung Discord') {
        openInvitationModal();
      }
    }
  });
}

// Navigation item click handlers
function setupNavigationHandlers() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.textContent === 'Gabung Discord') {
      item.addEventListener('click', openInvitationModal);
    }
  });
}

// Enhanced button interactions
function setupButtonEffects() {
  const buttons = document.querySelectorAll(
    '.primary-button, .secondary-button, .cta-button, .docs-button'
  );
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-3px) scale(1.02)';
    });

    button.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Mouse sparkle effects (reduced for performance)
let mouseX = 0;
let mouseY = 0;
let sparkleCount = 0;

document.addEventListener('mousemove', function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Reduced sparkle frequency for better performance
  if (Math.random() < 0.02 && sparkleCount < 10) {
    createSparkle(mouseX, mouseY);
  }
});

function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.style.position = 'fixed';
  sparkle.style.left = x + 'px';
  sparkle.style.top = y + 'px';
  sparkle.style.width = '2px';
  sparkle.style.height = '2px';
  sparkle.style.background = '#8B5DFF';
  sparkle.style.borderRadius = '50%';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.zIndex = '9999';
  sparkle.style.animation = 'sparkle 1s ease-out forwards';

  document.body.appendChild(sparkle);
  sparkleCount++;

  setTimeout(() => {
    if (sparkle.parentNode) {
      sparkle.remove();
      sparkleCount--;
    }
  }, 1000);
}

// Enhanced logo interaction
function setupLogoEffects() {
  const logo = document.querySelector('.logo-japanese');
  if (logo) {
    logo.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'transform 0.3s ease';
    });

    logo.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('🌊 GoRakuDo Homepage Loading...');

  // Check if all required elements exist
  const requiredElements = {
    waveCanvas: document.getElementById('waveCanvas'),
    invitationModal: document.getElementById('invitationModal'),
    missionSection: document.getElementById('mission'),
    heroContent: document.querySelector('.hero-content'),
  };
  console.log('🔍 Element check:', requiredElements);

  // Initialize wave animation
  try {
    waveAnimation = new WaveAnimation();
    console.log('✅ Wave animation initialized');
  } catch (error) {
    console.error('❌ Wave animation failed:', error);
  }

  // Setup all event listeners and animations
  setupScrollAnimations();
  setupFeatureCardEffects();
  setupKeyboardNavigation();
  setupNavigationHandlers();
  setupButtonEffects();
  setupLogoEffects();

  // Test functions are accessible
  console.log('🧪 Function availability check:');
  console.log('scrollToMission:', typeof window.scrollToMission);
  console.log('openInvitationModal:', typeof window.openInvitationModal);
  console.log('closeInvitationModal:', typeof window.closeInvitationModal);
  console.log('goToPosts:', typeof window.goToPosts);

  // Window scroll events with throttling
  let scrollTimeout = null;
  window.addEventListener('scroll', function () {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(() => {
      handleNavbarScroll();
      handleStarsParallax();
      scrollTimeout = null;
    }, 16); // ~60fps
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', function () {
    if (waveAnimation) {
      waveAnimation.destroy();
    }
  });

  // Add modal transition styles
  const modal = document.getElementById('invitationModal');
  if (modal) {
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.transform = 'scale(0.95)';
      modalContent.style.transition = 'transform 0.3s ease';
    }
  }

  console.log('✨ Homepage Loaded Successfully!');
});

// Utility function for smooth scrolling to any element
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

// Performance optimization - cleanup unused animations
window.addEventListener('beforeunload', function () {
  // Stop all ongoing animations
  const runningAnimations = document.getAnimations();
  runningAnimations.forEach(animation => animation.cancel());

  // Remove event listeners
  document.removeEventListener('mousemove', arguments.callee);
  window.removeEventListener('scroll', arguments.callee);
});
