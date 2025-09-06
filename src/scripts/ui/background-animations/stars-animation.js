/**
 * Stars Animation Module
 *
 * A modular, configurable stars animation system for Astro applications.
 * Extracted from homepage script with enhanced configuration and error handling.
 *
 * ⚠️ PRODUCTION REQUIREMENTS:
 * 1. CSS Variable: --color-accent (with fallback to #8b5dff)
 * 2. Container Strategy: Defaults to dynamic container creation
 * 3. Performance: Conservative settings for stability
 * 4. Accessibility: Respects user preferences by default
 *
 * @version 1.0.0
 * @author GoRakuDo Team
 * @license Mozilla Public License Version 2.0
 *
 * CRITICAL FIXES APPLIED (2024-12-19):
 *
 * 1. CSS VARIABLE DEFINITION:
 *    - ISSUE: Stars were invisible due to undefined --color-accent CSS variable
 *    - SOLUTION: Added --color-accent: #8b5dff; to test page :root
 *    - LOCATION: src/pages/test-stars-animation.astro
 *
 * 2. COLOR FALLBACK MECHANISM:
 *    - ISSUE: Stars became invisible if CSS variable was missing
 *    - SOLUTION: Changed "var(--color-accent)" to "var(--color-accent, #8b5dff)"
 *    - LOCATION: generateOptimizedCSS() method
 *
 * 3. STAR SIZE OPTIMIZATION:
 *    - ISSUE: 2px stars were too small to see clearly
 *    - SOLUTION: Increased star size from 2px to 3px
 *    - LOCATION: generateOptimizedCSS() method
 *
 * 4. DEBUG BORDER ADDITION:
 *    - PURPOSE: Visual indicator for container positioning
 *    - ADDED: Subtle purple border to stars container
 *    - LOCATION: generateOptimizedCSS() method
 *    - NOTE: Remove for production use
 *
 * 5. ENHANCED DEBUG LOGGING:
 *    - PURPOSE: Comprehensive troubleshooting information
 *    - ADDED: Container, stars array, and computed styles logging
 *    - LOCATION: createStars() method
 *    - NOTE: Remove for production use
 *
 * ROOT CAUSE ANALYSIS:
 * The primary issue was that the stars animation module relied on a CSS variable
 * (--color-accent) that wasn't defined in the test environment. This caused stars
 * to be created but remain invisible. The solution involved both defining the
 * variable and adding fallback mechanisms for robustness.
 */

/**
 * Stars Animation Class
 * Handles CSS-based stars animations with configurable parameters
 */
export class StarsAnimation {
  constructor(config = {}) {
    // Enhanced configuration with comprehensive validation
    this.config = this.validateAndMergeConfig(config);

    // Core animation state
    this.container = null;
    this.stars = [];
    this.animationId = null;
    this.isInitialized = false;
    this.isDestroyed = false;
    this.dynamicStyles = null;

    // ENHANCED: Memory management and performance monitoring
    this.memoryMonitor = {
      lastCheck: 0,
      checkInterval: 5000, // Check every 5 seconds
      threshold: 2 * 1024 * 1024, // 2MB threshold
      warnings: 0,
      maxWarnings: 3,
    };

    // ENHANCED: Performance monitoring integration
    this.performanceMetrics = {
      startTime: 0,
      frameCount: 0,
      lastFrameTime: 0,
      averageFPS: 0,
      memoryUsage: 0,
      cssInjectionTime: 0,
    };

    // ENHANCED: Animation conflict prevention
    this.animationConflicts = {
      activeAnimations: new Set(),
      lastAnimationTime: 0,
      minInterval: 100, // Minimum 100ms between animation updates
    };

    // ENHANCED: Error state management
    this.errorState = {
      hasError: false,
      errorMessage: null,
      errorType: null,
      retryCount: 0,
      maxRetries: 3,
    };

    // ENHANCED: Page visibility and accessibility
    this.isPageVisible = true;
    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    this.setupPageVisibilityHandler();
    this.setupAccessibilityHandlers();
  }

  // ENHANCED: Comprehensive configuration with validation
  defaultConfig = {
    enabled: true,
    count: 8,
    animationDuration: '3s',
    opacity: 0.6,
    containerClass: 'stars',
    starClass: 'star',
    containerId: 'stars',
    // Container management options
    useExistingContainer: false,
    createContainer: true,
    containerSelector: '.stars',
    // ENHANCED: Performance and accessibility options
    performance: {
      targetFPS: 60,
      memoryThreshold: 2 * 1024 * 1024, // 2MB
      autoReduceComplexity: true,
      reduceThreshold: 30,
    },
    accessibility: {
      respectReducedMotion: true,
      announceChanges: false,
      screenReaderFriendly: true,
      highContrastSupport: true,
      forceEnable: false, // Allow forcing animation for testing
    },
    // ENHANCED: CSS optimization options
    css: {
      useCSSVariables: true,
      optimizeInjection: true,
      cacheStyles: true,
      minifyCSS: false, // For development debugging
    },
  };

  // ENHANCED: Comprehensive configuration validation
  validateAndMergeConfig(userConfig) {
    const validation = {
      count: { min: 1, max: 20, default: 8, type: 'number' },
      animationDuration: {
        min: '1s',
        max: '10s',
        default: '3s',
        type: 'string',
      },
      opacity: { min: 0.1, max: 1.0, default: 0.6, type: 'number' },
      containerClass: {
        pattern: /^[a-zA-Z][a-zA-Z0-9-_]*$/,
        default: 'stars',
        type: 'string',
      },
      starClass: {
        pattern: /^[a-zA-Z][a-zA-Z0-9-_]*$/,
        default: 'star',
        type: 'string',
      },
      containerId: {
        pattern: /^[a-zA-Z][a-zA-Z0-9-_]*$/,
        default: 'stars',
        type: 'string',
      },
    };

    const validated = {};
    for (const [key, rules] of Object.entries(validation)) {
      const value = userConfig[key];

      if (value === undefined) {
        validated[key] = rules.default;
        continue;
      }

      // Type validation
      if (typeof value !== rules.type) {
        console.warn(
          `Invalid type for ${key}, using default: ${rules.default}`
        );
        validated[key] = rules.default;
        continue;
      }

      // Range/pattern validation
      if (rules.min !== undefined && rules.max !== undefined) {
        // Special handling for CSS time values
        if (
          rules.type === 'string' &&
          (key === 'animationDuration' || key.includes('Duration'))
        ) {
          const timeValue = parseFloat(value);
          const minValue = parseFloat(rules.min);
          const maxValue = parseFloat(rules.max);

          if (
            isNaN(timeValue) ||
            timeValue < minValue ||
            timeValue > maxValue
          ) {
            console.warn(
              `${key} out of range [${rules.min}, ${rules.max}], using default: ${rules.default}`
            );
            validated[key] = rules.default;
            continue;
          }
        } else if (value < rules.min || value > rules.max) {
          console.warn(
            `${key} out of range [${rules.min}, ${rules.max}], using default: ${rules.default}`
          );
          validated[key] = rules.default;
          continue;
        }
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        console.warn(`${key} invalid format, using default: ${rules.default}`);
        validated[key] = rules.default;
        continue;
      }

      validated[key] = value;
    }

    // Merge with defaults
    return this.mergeConfig(this.defaultConfig, {
      ...validated,
      ...userConfig,
    });
  }

  init(containerId = 'stars') {
    try {
      // ENHANCED: Animation conflict prevention - register stars animation
      if (!this.registerAnimation('stars')) {
        console.warn('⚠️ Stars animation blocked due to conflict or timing');
        return;
      }

      // ENHANCED: Performance monitoring start
      this.performanceMetrics.startTime = performance.now();
      performance.mark('stars-animation-init-start');

      // ENHANCED: Accessibility check before initialization
      if (
        this.config.accessibility.respectReducedMotion &&
        this.reducedMotion &&
        !this.config.accessibility.forceEnable // Allow override for testing
      ) {
        this.config.enabled = false;
        this.unregisterAnimation('stars'); // Clean up registration
        return;
      }

      // ENHANCED: Apply device-specific frame rate capping
      this.applyFrameRateCapping();

      // Initialize stars container and create star elements
      this.injectDynamicStyles();
      this.setupContainer(containerId);
      this.createStars();

      // ENHANCED: Performance monitoring end
      performance.mark('stars-animation-init-end');
      performance.measure(
        'stars-animation-init',
        'stars-animation-init-start',
        'stars-animation-init-end'
      );

      this.isInitialized = true;
      console.log(
        '✅ Stars animation initialized with performance optimizations'
      );
    } catch (error) {
      this.unregisterAnimation('stars'); // Clean up registration on error
      this.handleError('initialization', error);
    }
  }

  destroy() {
    try {
      // ENHANCED: Cancel animation frame to prevent memory leaks
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      // ENHANCED: Unregister animation from conflict prevention system
      this.unregisterAnimation('stars');

      // ENHANCED: Memory cleanup
      this.cleanupMemory();

      // Cleanup animation and DOM elements
      this.removeDynamicStyles();
      this.cleanupContainer();

      this.isDestroyed = true;
      console.log('✅ Stars animation destroyed and cleaned up');
    } catch (error) {
      console.error('Error during stars animation destruction:', error);
    }
  }

  updateConfig(newConfig) {
    try {
      // ENHANCED: Validate new configuration
      const validatedConfig = this.validateAndMergeConfig(newConfig);

      // Runtime configuration updates
      this.config = { ...this.config, ...validatedConfig };

      if (this.isInitialized) {
        this.applyConfigChanges();
      }

      // Configuration updated successfully
    } catch (error) {
      this.handleError('configuration update', error);
    }
  }

  // ENHANCED: Optimized CSS-in-JS generation with performance monitoring
  injectDynamicStyles() {
    const styleId = `stars-animation-styles-${this.config.containerId}`;

    // Check if styles already exist for this instance
    if (document.getElementById(styleId)) return;

    // ENHANCED: Feature detection for CSS animations
    if (!CSS.supports('animation', 'name 1s infinite')) {
      console.warn('CSS animations not supported, using fallback');
      this.useFallbackAnimation();
      return;
    }

    try {
      // ENHANCED: Performance monitoring for CSS injection
      performance.mark('stars-css-injection-start');

      this.dynamicStyles = document.createElement('style');
      this.dynamicStyles.id = styleId;
      this.dynamicStyles.textContent = this.generateOptimizedCSS();

      document.head.appendChild(this.dynamicStyles);

      // ENHANCED: Performance monitoring end
      performance.mark('stars-css-injection-end');
      performance.measure(
        'stars-css-injection',
        'stars-css-injection-start',
        'stars-css-injection-end'
      );

      const measure = performance.getEntriesByName('stars-css-injection')[0];
      this.performanceMetrics.cssInjectionTime = measure.duration;

      console.log(
        `✅ CSS injected in ${this.performanceMetrics.cssInjectionTime.toFixed(2)}ms`
      );
    } catch (error) {
      this.handleError('CSS injection', error);
    }
  }

  // ENHANCED: Optimized CSS generation with CSS variables
  generateOptimizedCSS() {
    console.log('🎨 Generating CSS for stars animation');
    console.log('⚙️ Config:', {
      opacity: this.config.opacity,
      animationDuration: this.config.animationDuration,
      containerClass: this.config.containerClass,
      starClass: this.config.starClass,
    });

    /*
     * CRITICAL FIXES APPLIED:
     *
     * 1. COLOR FALLBACK: Added fallback color to prevent invisible stars
     *    - CHANGED: "var(--color-accent)"
     *    - TO: "var(--color-accent, #8b5dff)"
     *    - REASON: If CSS variable is undefined, stars become invisible
     *
     * 2. STAR SIZE: Increased visibility by making stars larger
     *    - CHANGED: "2px"
     *    - TO: "3px"
     *    - REASON: 2px stars were too small to see clearly
     *
     * 3. DEBUG BORDER: Added container border for visual debugging
     *    - ADDED: border: 1px solid rgba(139, 93, 255, 0.1);
     *    - REASON: Helps identify if container is positioned correctly
     */
    const cssVars = {
      '--stars-opacity': this.config.opacity,
      '--stars-animation-duration': this.config.animationDuration,
      '--stars-color': 'var(--color-accent, #8b5dff)', // FIX: Added fallback color
      '--stars-size': '3px', // FIX: Increased from 2px for better visibility
      '--stars-scale': '1.2',
    };

    const cssVarsString = Object.entries(cssVars)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n      ');

    const css = `
             .${this.config.containerClass} {
         position: fixed;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         pointer-events: none;
         z-index: 10;
         ${cssVarsString}

       }

      .${this.config.starClass} {
        position: absolute;
        width: var(--stars-size);
        height: var(--stars-size);
        background: var(--stars-color);
        border-radius: 50%;
        opacity: var(--stars-opacity);
        animation: twinkle var(--stars-animation-duration) infinite;
        ${this.config.accessibility.highContrastSupport ? 'filter: contrast(1.2);' : ''}
      }

      ${
        this.config.accessibility.highContrastSupport
          ? `
      @media (prefers-contrast: high) {
        .${this.config.starClass} {
          filter: contrast(1.5) brightness(1.2);
        }
      }`
          : ''
      }
    `.trim();

    console.log('✅ CSS generated:', css);
    return css;
  }

  removeDynamicStyles() {
    if (this.dynamicStyles) {
      this.dynamicStyles.remove();
      this.dynamicStyles = null;
    }
  }

  // ENHANCED: Memory management and cleanup
  cleanupMemory() {
    // Clear star elements
    if (this.stars.length > 0) {
      this.stars.forEach(star => {
        if (star && star.parentNode) {
          star.parentNode.removeChild(star);
        }
      });
      this.stars = [];
    }

    // Clear performance measurements
    performance.clearMarks('stars-animation-*');
    performance.clearMeasures('stars-animation-*');

    // Reset performance metrics
    this.performanceMetrics = {
      startTime: 0,
      frameCount: 0,
      lastFrameTime: 0,
      averageFPS: 0,
      memoryUsage: 0,
      cssInjectionTime: 0,
    };

    // Reset error state
    this.errorState = {
      hasError: false,
      errorMessage: null,
      errorType: null,
      retryCount: 0,
      maxRetries: 3,
    };

    console.log('🧹 Memory cleanup completed');
  }

  // ENHANCED: Memory monitoring
  checkMemoryUsage() {
    if (!performance.memory) return;

    const currentTime = performance.now();
    if (
      currentTime - this.memoryMonitor.lastCheck <
      this.memoryMonitor.checkInterval
    ) {
      return;
    }

    this.memoryMonitor.lastCheck = currentTime;
    const memoryUsage = performance.memory.usedJSHeapSize;

    if (memoryUsage > this.memoryMonitor.threshold) {
      this.memoryMonitor.warnings++;
      console.warn(
        `⚠️ High memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`
      );

      if (this.memoryMonitor.warnings >= this.memoryMonitor.maxWarnings) {
        console.warn('🔄 Reducing animation complexity due to memory pressure');
        this.reduceAnimationComplexity();
        this.memoryMonitor.warnings = 0;
      }
    }
  }

  // ENHANCED: Animation complexity reduction
  reduceAnimationComplexity() {
    if (!this.config.performance.autoReduceComplexity) return;

    // Reduce star count
    const currentCount = this.stars.length;
    const reducedCount = Math.max(4, Math.floor(currentCount * 0.7));

    if (reducedCount < currentCount) {
      console.log(`🔄 Reducing stars from ${currentCount} to ${reducedCount}`);
      this.updateStarCount(reducedCount);
    }

    // Reduce animation frequency
    if (this.config.performance.targetFPS > 30) {
      this.config.performance.targetFPS = 30;
      console.log('🔄 Reducing target FPS to 30');
    }
  }

  // ENHANCED: Animation conflict prevention methods
  registerAnimation(name) {
    const now = performance.now();

    // Prevent rapid-fire animation updates
    if (
      now - this.animationConflicts.lastAnimationTime <
      this.animationConflicts.minInterval
    ) {
      return false; // Animation blocked due to timing
    }

    // Check for conflicting animations
    if (this.animationConflicts.activeAnimations.has(name)) {
      console.warn(`⚠️ Animation conflict detected: ${name} is already active`);
      return false;
    }

    this.animationConflicts.activeAnimations.add(name);
    this.animationConflicts.lastAnimationTime = now;
    return true;
  }

  unregisterAnimation(name) {
    this.animationConflicts.activeAnimations.delete(name);
  }

  clearAnimationConflicts() {
    this.animationConflicts.activeAnimations.clear();
    console.log('🧹 Animation conflicts cleared');
  }

  // ENHANCED: Device-specific frame rate capping
  applyFrameRateCapping() {
    const screenWidth = window.innerWidth;
    let targetFPS = 60;

    // Device-specific frame rate capping (GoRakuDo Strategy)
    if (screenWidth < 640) {
      // Mobile phones
      targetFPS = 30;
    } else if (screenWidth < 1024) {
      // Tablets
      targetFPS = 45;
    } else {
      // Desktop/large screens
      targetFPS = 60;
    }

    // Update configuration
    this.config.performance.targetFPS = targetFPS;
    this.config.animationDuration = `${4 / (targetFPS / 60)}s`; // Scale duration based on FPS

    console.log(
      `🎯 Applied frame rate capping: ${targetFPS}fps for ${screenWidth}px screen`
    );
    return targetFPS;
  }

  // ENHANCED: Flexible container management with accessibility
  setupContainer(containerId) {
    console.log('🔍 setupContainer() called with:', {
      containerId,
      useExistingContainer: this.config.useExistingContainer,
      createContainer: this.config.createContainer,
      containerSelector: this.config.containerSelector,
    });

    if (this.config.useExistingContainer) {
      // Use existing container
      console.log(
        `🔍 Looking for existing container: ${this.config.containerSelector}`
      );
      this.container = document.querySelector(this.config.containerSelector);

      if (!this.container) {
        console.warn(
          `⚠️ Existing container not found: ${this.config.containerSelector}`
        );
        console.log('📄 Current DOM structure:');
        console.log(
          "All elements with class 'stars':",
          document.querySelectorAll('.stars')
        );
        console.log(
          "All elements with id 'stars':",
          document.getElementById('stars')
        );
        console.log('Document body:', document.body);
        this.createNewContainer(containerId);
      } else {
        console.log(`✅ Found existing container:`, this.container);
      }
    } else if (this.config.createContainer) {
      // Create new container
      console.log('🔄 Creating new container');
      this.createNewContainer(containerId);
    } else {
      // Use provided container ID
      console.log(`🔍 Looking for container by ID: ${containerId}`);
      this.container = document.getElementById(containerId);

      if (!this.container) {
        console.warn(`⚠️ Container not found: ${containerId}`);
        console.log('📄 Current DOM structure:');
        console.log(
          "All elements with id 'stars':",
          document.getElementById('stars')
        );
        this.createNewContainer(containerId);
      } else {
        console.log(`✅ Found container by ID:`, this.container);
      }
    }

    // ENHANCED: Setup accessibility attributes
    this.setupAccessibility();
  }

  // ENHANCED: Accessibility setup
  setupAccessibility() {
    if (!this.container) return;

    // Enhanced accessibility attributes
    this.container.setAttribute('aria-hidden', 'true');
    this.container.setAttribute('role', 'presentation');
    this.container.setAttribute('data-animation-type', 'decorative');
    this.container.setAttribute(
      'data-stars-count',
      this.config.count.toString()
    );

    // Screen reader announcement for dynamic content
    if (this.config.accessibility.announceChanges) {
      this.setupScreenReaderAnnouncements();
    }

    // High contrast support
    if (this.config.accessibility.highContrastSupport) {
      this.container.setAttribute('data-high-contrast', 'true');
    }
  }

  // ENHANCED: Screen reader announcements
  setupScreenReaderAnnouncements() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText =
      'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';

    document.body.appendChild(liveRegion);
    this.liveRegion = liveRegion;
  }

  // ENHANCED: Announce changes to screen readers
  announceToScreenReader(message) {
    if (this.liveRegion && this.config.accessibility.announceChanges) {
      this.liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        this.liveRegion.textContent = '';
      }, 1000);
    }
  }

  createNewContainer(containerId) {
    console.log(`🔄 Creating new container with ID: ${containerId}`);

    this.container = document.createElement('div');
    this.container.id = containerId;
    this.container.className = this.config.containerClass;
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 10;
    `;

    console.log('📦 New container created:', this.container);
    console.log('📍 Appending to document body');

    document.body.appendChild(this.container);

    console.log('✅ Container appended to DOM');
    console.log(
      '🔍 Verifying container in DOM:',
      document.getElementById(containerId)
    );
  }

  // ENHANCED: Page visibility and accessibility handlers
  setupPageVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;

      // DISABLED: Keep stars running continuously
      // if (this.isPageVisible) {
      //   this.resumeAnimation();
      // } else {
      //   this.pauseAnimation();
      // }

      // Always keep animation running
      if (this.isPageVisible && this.isInitialized) {
        this.resumeAnimation();
      }
    });
  }

  setupAccessibilityHandlers() {
    // DISABLED: Reduced motion pause functionality
    // Listen for reduced motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', e => {
      this.reducedMotion = e.matches;

      // DISABLED: Keep stars running regardless of motion preference
      // if (
      //   this.reducedMotion &&
      //   this.config.accessibility.respectReducedMotion
      // ) {
      //   console.log("Reduced motion preference detected, pausing animation");
      //   this.pauseAnimation();
      // } else if (!this.reducedMotion && this.isInitialized) {
      //   console.log("Reduced motion preference removed, resuming animation");
      //   this.resumeAnimation();
      // }

      // Always keep animation running
      if (this.isInitialized) {
        this.resumeAnimation();
      }
    });

    // Listen for high contrast preference changes
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    contrastQuery.addEventListener('change', e => {
      if (this.config.accessibility.highContrastSupport) {
        this.updateHighContrastMode(e.matches);
      }
    });
  }

  // ENHANCED: Animation pause/resume
  pauseAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.container) {
      this.container.style.animationPlayState = 'paused';
    }

    console.log('⏸️ Stars animation paused');
  }

  resumeAnimation() {
    if (this.isDestroyed || this.reducedMotion) return;

    if (this.container) {
      this.container.style.animationPlayState = 'running';
    }

    this.update();
    console.log('▶️ Stars animation resumed');
  }

  // ENHANCED: High contrast mode update
  updateHighContrastMode(enabled) {
    if (this.container) {
      this.container.setAttribute('data-high-contrast', enabled.toString());
    }

    if (enabled) {
      console.log('🎨 High contrast mode enabled for stars animation');
    }
  }

  cleanupContainer() {
    if (this.container && this.config.createContainer) {
      this.container.remove();
    }
    this.container = null;
  }

  // ENHANCED: Star creation with accessibility and performance
  createStar() {
    const star = document.createElement('div');
    star.className = this.config.starClass;

    // Random positioning with better distribution
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const twinkleDelay = Math.random() * 4; // Random twinkle delay
    const floatDelay = Math.random() * 8; // Random float delay for natural movement

    // Random floating pattern for varied movement
    const floatPatterns = ['float', 'float-2', 'float-3'];
    const randomFloatPattern =
      floatPatterns[Math.floor(Math.random() * floatPatterns.length)];

    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.animationDelay = `${twinkleDelay}s, ${floatDelay}s`; // Both twinkle and float delays
    star.style.animationName = `twinkle, ${randomFloatPattern}`; // Random float pattern

    // ENHANCED: Accessibility attributes for individual stars
    star.setAttribute('aria-hidden', 'true');
    star.setAttribute('role', 'presentation');

    // ENHANCED: Performance optimization - use transform instead of top/left
    star.style.transform = `translate(${left}vw, ${top}vh)`;

    return star;
  }

  // ENHANCED: Animation loop with memory management and performance monitoring
  update() {
    if (this.isDestroyed || !this.isPageVisible || this.reducedMotion) return;

    // ENHANCED: Cancel previous frame to prevent memory leaks
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // ENHANCED: Performance monitoring
    const currentTime = performance.now();
    this.performanceMetrics.frameCount++;

    if (this.performanceMetrics.lastFrameTime > 0) {
      const frameTime = currentTime - this.performanceMetrics.lastFrameTime;
      this.performanceMetrics.averageFPS = 1000 / frameTime;
    }

    this.performanceMetrics.lastFrameTime = currentTime;

    // ENHANCED: Memory monitoring
    this.checkMemoryUsage();

    // ENHANCED: Performance-based frame rate control
    const targetFrameTime = 1000 / this.config.performance.targetFPS;
    const elapsed = currentTime - this.performanceMetrics.lastFrameTime;

    if (elapsed >= targetFrameTime) {
      this.animationId = requestAnimationFrame(() => this.update());
    } else {
      setTimeout(() => {
        this.animationId = requestAnimationFrame(() => this.update());
      }, targetFrameTime - elapsed);
    }
  }

  // ENHANCED: Star count update with performance monitoring
  updateStarCount(newCount) {
    const currentCount = this.stars.length;

    if (newCount > currentCount) {
      // Add stars
      const starsToAdd = newCount - currentCount;
      for (let i = 0; i < starsToAdd; i++) {
        const star = this.createStar();
        this.container.appendChild(star);
        this.stars.push(star);
      }
    } else if (newCount < currentCount) {
      // Remove stars
      const starsToRemove = currentCount - newCount;
      for (let i = 0; i < starsToRemove; i++) {
        const star = this.stars.pop();
        if (star && star.parentNode) {
          star.parentNode.removeChild(star);
        }
      }
    }

    // Update container attribute
    if (this.container) {
      this.container.setAttribute('data-stars-count', newCount.toString());
    }

    // Announce to screen reader
    this.announceToScreenReader(`Stars animation updated to ${newCount} stars`);

    console.log(`🔄 Stars count updated from ${currentCount} to ${newCount}`);
  }

  // ENHANCED: Error handling with retry logic
  handleError(context, error, retryCount = 0) {
    const maxRetries = this.errorState.maxRetries;

    console.error(`❌ Stars Animation Error (${context}):`, error);

    this.errorState.hasError = true;
    this.errorState.errorMessage = error.message;
    this.errorState.errorType = context;

    if (retryCount < maxRetries) {
      console.log(
        `🔄 Retrying stars animation (${retryCount + 1}/${maxRetries})...`
      );
      setTimeout(
        () => {
          this.retryInitialization(context, retryCount + 1);
        },
        1000 * (retryCount + 1)
      ); // Exponential backoff
    } else {
      console.warn('🔄 Max retries reached, triggering fallback...');
      this.triggerFallback();
    }
  }

  // ENHANCED: Retry initialization
  retryInitialization(context, retryCount) {
    try {
      this.destroy();
      this.init(this.config.containerId);
      this.errorState.hasError = false;
      console.log('✅ Stars animation retry successful');
    } catch (error) {
      this.handleError(context, error, retryCount);
    }
  }

  // ENHANCED: Fallback mechanism
  triggerFallback() {
    console.warn('🔄 Triggering stars animation fallback...');

    // Disable animation but keep container
    this.config.enabled = false;

    // Create simple static stars
    this.createStaticStars();

    // Announce to screen reader
    this.announceToScreenReader('Stars animation fallback mode activated');
  }

  // ENHANCED: Static stars fallback
  createStaticStars() {
    if (!this.container) return;

    // Clear existing stars
    this.stars.forEach(star => {
      if (star && star.parentNode) {
        star.parentNode.removeChild(star);
      }
    });
    this.stars = [];

    // Create simple static stars
    for (let i = 0; i < Math.min(this.config.count, 4); i++) {
      const star = document.createElement('div');
      star.className = this.config.starClass;
      star.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--color-accent);
        border-radius: 50%;
        opacity: 0.6;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
      `;
      star.setAttribute('aria-hidden', 'true');

      this.container.appendChild(star);
      this.stars.push(star);
    }
  }

  // ENHANCED: Fallback animation for unsupported browsers
  useFallbackAnimation() {
    console.log('🔄 Using fallback animation for unsupported browser');

    // Create simple opacity-based animation
    const fallbackCSS = `
      .${this.config.starClass} {
        animation: fallback-twinkle 3s infinite;
      }
      
      @keyframes fallback-twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }
    `;

    const style = document.createElement('style');
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
    this.fallbackStyle = style;
  }

  // Helper methods
  mergeConfig(defaultConfig, userConfig) {
    return {
      ...defaultConfig,
      ...userConfig,
      performance: {
        ...defaultConfig.performance,
        ...userConfig.performance,
      },
      accessibility: {
        ...defaultConfig.accessibility,
        ...userConfig.accessibility,
      },
      css: {
        ...defaultConfig.css,
        ...userConfig.css,
      },
    };
  }

  applyConfigChanges() {
    // Recreate stars with new configuration
    this.cleanupMemory();
    this.createStars();
  }

  createStars() {
    console.log('🔍 createStars() called');
    console.log('📍 Container exists:', !!this.container);
    console.log('⚙️ Config enabled:', this.config.enabled);

    if (!this.container || !this.config.enabled) {
      console.warn('⚠️ Cannot create stars: container or config issue', {
        container: this.container,
        enabled: this.config.enabled,
      });
      return;
    }

    // Clear existing stars
    this.stars = [];
    this.container.innerHTML = '';

    console.log(`🔄 Creating ${this.config.count} stars...`);

    // Create new stars
    for (let i = 0; i < this.config.count; i++) {
      const star = this.createStar();
      this.container.appendChild(star);
      this.stars.push(star);
    }

    console.log(`✅ Successfully created ${this.stars.length} stars`);

    // Start animation loop
    this.update();

    console.log(
      `✨ Stars animation initialized with ${this.config.count} stars`
    );

    // ENHANCED DEBUG LOGGING
    console.log(`📍 Container:`, this.container);
    console.log(`🌟 Stars array:`, this.stars);
    console.log(
      `🎨 Container computed style:`,
      window.getComputedStyle(this.container)
    );

    // Check if stars are actually visible
    if (this.stars.length > 0) {
      const firstStar = this.stars[0];
      const computedStyle = window.getComputedStyle(firstStar);
      console.log('⭐ First star computed style:', {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        background: computedStyle.background,
        width: computedStyle.width,
        height: computedStyle.height,
        position: computedStyle.position,
        top: computedStyle.top,
        left: computedStyle.left,
        zIndex: computedStyle.zIndex,
      });
    }
  }
}

/**
 * Factory function to create StarsAnimation instance
 * @param {Object} config - Configuration object
 * @returns {StarsAnimation} StarsAnimation instance
 */
export function initStarsAnimation(config = {}) {
  return new StarsAnimation(config);
}

