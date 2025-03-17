/**
 * Animation Adapter
 * Adapts animation behavior based on user preferences and interaction patterns
 */

/**
 * AnimationAdapter
 * Handles animation adaptations for better user experience
 */
class AnimationAdapter {
  constructor(adaptationEngine) {
    this.adaptationEngine = adaptationEngine;
    this.config = adaptationEngine.config;
    this.initialized = false;
    this.running = false;
    
    // Animation adaptation state
    this.styleElement = null;
    this.activeAdaptations = new Map();
    this.animationSpeed = 'normal'; // 'slow', 'normal', 'fast', 'none'
    this.animationComplexity = 'normal'; // 'minimal', 'normal', 'complex'
    
    // Animation settings for each level
    this.animationSettings = {
      speed: {
        slow: {
          '--animation-speed-factor': '2',
          '--transition-duration': '0.6s',
          '--animation-duration-short': '600ms',
          '--animation-duration-medium': '1000ms',
          '--animation-duration-long': '2000ms'
        },
        normal: {
          '--animation-speed-factor': '1',
          '--transition-duration': '0.3s',
          '--animation-duration-short': '300ms',
          '--animation-duration-medium': '500ms',
          '--animation-duration-long': '1000ms'
        },
        fast: {
          '--animation-speed-factor': '0.5',
          '--transition-duration': '0.15s',
          '--animation-duration-short': '150ms',
          '--animation-duration-medium': '250ms',
          '--animation-duration-long': '500ms'
        },
        none: {
          '--animation-speed-factor': '0',
          '--transition-duration': '0s',
          '--animation-duration-short': '0ms',
          '--animation-duration-medium': '0ms',
          '--animation-duration-long': '0ms'
        }
      },
      complexity: {
        minimal: {
          '--animation-complexity': 'minimal',
          '--animation-transform-distance': '5px',
          '--animation-transform-rotation': '0deg',
          '--animation-transform-scale': '1.02'
        },
        normal: {
          '--animation-complexity': 'normal',
          '--animation-transform-distance': '10px',
          '--animation-transform-rotation': '5deg',
          '--animation-transform-scale': '1.05'
        },
        complex: {
          '--animation-complexity': 'complex',
          '--animation-transform-distance': '20px',
          '--animation-transform-rotation': '10deg',
          '--animation-transform-scale': '1.1'
        }
      }
    };
    
    // Classes to disable animations
    this.disableAnimationsClass = `
      *, *::before, *::after {
        transition: none !important;
        animation: none !important;
        transform: none !important;
      }
    `;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.processInsight = this.processInsight.bind(this);
    this.applyAnimationSpeed = this.applyAnimationSpeed.bind(this);
    this.applyAnimationComplexity = this.applyAnimationComplexity.bind(this);
    this.createStyleElement = this.createStyleElement.bind(this);
    this.updateStyleElement = this.updateStyleElement.bind(this);
  }
  
  /**
   * Initialize the animation adapter
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing animation adapter');
    
    // Check for reduced motion preference
    this.checkReducedMotionPreference();
    
    // Create initial style element
    this.createStyleElement();
    
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Start the animation adapter
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting animation adapter');
    
    // Apply initial animation settings
    this.updateStyleElement();
    
    // Add motion preference listener
    this.setupMediaQueryListeners();
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop the animation adapter
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping animation adapter');
    
    // Remove style element
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }
    
    // Clear active adaptations
    this.activeAdaptations.forEach((adaptationId) => {
      this.adaptationEngine.removeAdaptation(adaptationId);
    });
    this.activeAdaptations.clear();
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Process an insight from the analysis engine
   */
  processInsight(insight) {
    // Handle reduced motion needs
    if (insight.type === 'reduced_motion_need' && insight.confidence > 0.5) {
      this.applyAnimationSpeed('none');
    }
    
    // Handle engagement level insights
    if (insight.type === 'engagement_level') {
      const engagementLevel = parseFloat(insight.description.match(/(\d+)%/)[1]) / 100;
      
      // For low engagement, make animations more noticeable to increase engagement
      if (engagementLevel < 0.3 && insight.confidence > 0.4) {
        this.applyAnimationComplexity('complex');
      }
      // For very high engagement, simplify animations as user is already engaged
      else if (engagementLevel > 0.8 && insight.confidence > 0.4) {
        this.applyAnimationComplexity('minimal');
      }
    }
    
    // Handle animation tolerance from user profile data
    if (insight.type === 'animation_tolerance') {
      const tolerance = parseFloat(insight.data.tolerance);
      
      if (tolerance < 0.2) {
        this.applyAnimationSpeed('none');
      } else if (tolerance < 0.5) {
        this.applyAnimationSpeed('slow');
        this.applyAnimationComplexity('minimal');
      } else if (tolerance < 0.8) {
        this.applyAnimationSpeed('normal');
        this.applyAnimationComplexity('normal');
      } else {
        this.applyAnimationSpeed('fast');
        this.applyAnimationComplexity('complex');
      }
    }
    
    return this;
  }
  
  /**
   * Apply animation speed adaptation
   */
  applyAnimationSpeed(speed) {
    if (!['slow', 'normal', 'fast', 'none'].includes(speed)) {
      this.log(`Invalid animation speed: ${speed}`, 'warn');
      return false;
    }
    
    // Don't reapply the same speed
    if (this.animationSpeed === speed) {
      return true;
    }
    
    // Update animation speed
    this.animationSpeed = speed;
    
    // Update the style element
    this.updateStyleElement();
    
    // Record the adaptation
    const adaptationId = this.adaptationEngine.applyAdaptation('animation_speed', {
      speed: this.animationSpeed
    });
    
    // Store adaptation ID
    if (this.activeAdaptations.has('animation_speed')) {
      this.adaptationEngine.removeAdaptation(this.activeAdaptations.get('animation_speed'));
    }
    this.activeAdaptations.set('animation_speed', adaptationId);
    
    this.log(`Applied animation speed: ${speed}`);
    
    return true;
  }
  
  /**
   * Apply animation complexity adaptation
   */
  applyAnimationComplexity(complexity) {
    if (!['minimal', 'normal', 'complex'].includes(complexity)) {
      this.log(`Invalid animation complexity: ${complexity}`, 'warn');
      return false;
    }
    
    // Don't reapply the same complexity
    if (this.animationComplexity === complexity) {
      return true;
    }
    
    // Update animation complexity
    this.animationComplexity = complexity;
    
    // Update the style element
    this.updateStyleElement();
    
    // Record the adaptation
    const adaptationId = this.adaptationEngine.applyAdaptation('animation_complexity', {
      complexity: this.animationComplexity
    });
    
    // Store adaptation ID
    if (this.activeAdaptations.has('animation_complexity')) {
      this.adaptationEngine.removeAdaptation(this.activeAdaptations.get('animation_complexity'));
    }
    this.activeAdaptations.set('animation_complexity', adaptationId);
    
    this.log(`Applied animation complexity: ${complexity}`);
    
    return true;
  }
  
  /**
   * Check for reduced motion preference
   */
  checkReducedMotionPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.animationSpeed = 'none';
    }
    
    return this;
  }
  
  /**
   * Set up media query listeners for system preferences
   */
  setupMediaQueryListeners() {
    if (window.matchMedia) {
      // Listen for reduced motion preference changes
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        const newSpeed = e.matches ? 'none' : 'normal';
        this.applyAnimationSpeed(newSpeed);
      });
    }
    
    return this;
  }
  
  /**
   * Create the style element for animation CSS
   */
  createStyleElement() {
    if (this.styleElement) return;
    
    // Create style element
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'ux-mirror-animation-adaptation';
    
    // Add to document head
    document.head.appendChild(this.styleElement);
    
    return this;
  }
  
  /**
   * Update the style element with current animation settings
   */
  updateStyleElement() {
    if (!this.styleElement) {
      this.createStyleElement();
    }
    
    // Build CSS based on current settings
    let css = ':root {\n';
    
    // Add speed variables if not 'none'
    if (this.animationSpeed !== 'none') {
      const speedVars = this.animationSettings.speed[this.animationSpeed];
      for (const [variable, value] of Object.entries(speedVars)) {
        css += `  ${variable}: ${value};\n`;
      }
      
      // Add complexity variables
      const complexityVars = this.animationSettings.complexity[this.animationComplexity];
      for (const [variable, value] of Object.entries(complexityVars)) {
        css += `  ${variable}: ${value};\n`;
      }
      
      css += '}\n';
    } else {
      // For 'none', just add the speed variables
      const speedVars = this.animationSettings.speed[this.animationSpeed];
      for (const [variable, value] of Object.entries(speedVars)) {
        css += `  ${variable}: ${value};\n`;
      }
      
      css += '}\n';
      
      // Add disable animations for all elements
      css += this.disableAnimationsClass;
    }
    
    // Set CSS content
    this.styleElement.textContent = css;
    
    return this;
  }
  
  /**
   * Log a message through the adaptation engine
   */
  log(message, level = 'info') {
    this.adaptationEngine.log(`[AnimationAdapter] ${message}`);
    return this;
  }
}

export default AnimationAdapter;
