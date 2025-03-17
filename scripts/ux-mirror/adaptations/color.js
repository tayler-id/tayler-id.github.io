/**
 * Color Adapter
 * Adapts color schemes based on user preferences and accessibility needs
 */

/**
 * ColorAdapter
 * Handles color scheme adaptations for better user experience
 */
class ColorAdapter {
  constructor(adaptationEngine) {
    this.adaptationEngine = adaptationEngine;
    this.config = adaptationEngine.config;
    this.initialized = false;
    this.running = false;
    
    // Color adaptation state
    this.styleElement = null;
    this.activeAdaptations = new Map();
    this.colorScheme = 'light'; // 'light' or 'dark'
    this.contrastLevel = 'normal'; // 'normal' or 'high'
    
    // CSS variables with default values
    this.cssVariables = {
      light: {
        normal: {
          '--bg-primary': '#ffffff',
          '--bg-secondary': '#f5f7fa',
          '--text-primary': '#333333',
          '--text-secondary': '#6c757d',
          '--accent-primary': '#3498db',
          '--accent-secondary': '#2ecc71',
          '--border-color': '#dee2e6'
        },
        high: {
          '--bg-primary': '#ffffff',
          '--bg-secondary': '#f0f0f0',
          '--text-primary': '#000000',
          '--text-secondary': '#444444',
          '--accent-primary': '#0066cc',
          '--accent-secondary': '#008800',
          '--border-color': '#999999'
        }
      },
      dark: {
        normal: {
          '--bg-primary': '#222222',
          '--bg-secondary': '#333333',
          '--text-primary': '#ffffff',
          '--text-secondary': '#aaaaaa',
          '--accent-primary': '#3498db',
          '--accent-secondary': '#2ecc71',
          '--border-color': '#444444'
        },
        high: {
          '--bg-primary': '#000000',
          '--bg-secondary': '#222222',
          '--text-primary': '#ffffff',
          '--text-secondary': '#cccccc',
          '--accent-primary': '#4dabf7',
          '--accent-secondary': '#51cf66',
          '--border-color': '#666666'
        }
      }
    };
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.processInsight = this.processInsight.bind(this);
    this.applyColorScheme = this.applyColorScheme.bind(this);
    this.applyContrastLevel = this.applyContrastLevel.bind(this);
    this.createStyleElement = this.createStyleElement.bind(this);
    this.updateStyleElement = this.updateStyleElement.bind(this);
  }
  
  /**
   * Initialize the color adapter
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing color adapter');
    
    // Check system preferences
    this.checkSystemPreferences();
    
    // Create initial style element
    this.createStyleElement();
    
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Start the color adapter
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting color adapter');
    
    // Apply initial color scheme and contrast
    this.updateStyleElement();
    
    // Add color scheme media query listener
    this.setupMediaQueryListeners();
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop the color adapter
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping color adapter');
    
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
    // Handle high contrast needs
    if (insight.type === 'high_contrast_need' && insight.confidence > 0.5) {
      this.applyContrastLevel('high');
    }
    
    // Handle dark mode preference
    if (insight.type === 'dark_mode_preference' && insight.confidence > 0.5) {
      this.applyColorScheme('dark');
    }
    
    return this;
  }
  
  /**
   * Apply a color scheme adaptation
   */
  applyColorScheme(scheme) {
    if (scheme !== 'light' && scheme !== 'dark') {
      this.log(`Invalid color scheme: ${scheme}`, 'warn');
      return false;
    }
    
    // Don't reapply the same scheme
    if (this.colorScheme === scheme) {
      return true;
    }
    
    // Update color scheme
    this.colorScheme = scheme;
    
    // Update the style element
    this.updateStyleElement();
    
    // Record the adaptation
    const adaptationId = this.adaptationEngine.applyAdaptation('color_scheme', {
      scheme: this.colorScheme
    });
    
    // Store adaptation ID
    if (this.activeAdaptations.has('color_scheme')) {
      this.adaptationEngine.removeAdaptation(this.activeAdaptations.get('color_scheme'));
    }
    this.activeAdaptations.set('color_scheme', adaptationId);
    
    this.log(`Applied color scheme: ${scheme}`);
    
    return true;
  }
  
  /**
   * Apply a contrast level adaptation
   */
  applyContrastLevel(level) {
    if (level !== 'normal' && level !== 'high') {
      this.log(`Invalid contrast level: ${level}`, 'warn');
      return false;
    }
    
    // Don't reapply the same level
    if (this.contrastLevel === level) {
      return true;
    }
    
    // Update contrast level
    this.contrastLevel = level;
    
    // Update the style element
    this.updateStyleElement();
    
    // Record the adaptation
    const adaptationId = this.adaptationEngine.applyAdaptation('contrast_level', {
      level: this.contrastLevel
    });
    
    // Store adaptation ID
    if (this.activeAdaptations.has('contrast_level')) {
      this.adaptationEngine.removeAdaptation(this.activeAdaptations.get('contrast_level'));
    }
    this.activeAdaptations.set('contrast_level', adaptationId);
    
    this.log(`Applied contrast level: ${level}`);
    
    return true;
  }
  
  /**
   * Check system preferences for color scheme and contrast
   */
  checkSystemPreferences() {
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.colorScheme = 'dark';
    }
    
    // Check for high contrast preference
    if (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches) {
      this.contrastLevel = 'high';
    }
    
    return this;
  }
  
  /**
   * Set up media query listeners for system preferences
   */
  setupMediaQueryListeners() {
    if (window.matchMedia) {
      // Listen for color scheme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newScheme = e.matches ? 'dark' : 'light';
        this.applyColorScheme(newScheme);
      });
      
      // Listen for contrast preference changes
      window.matchMedia('(prefers-contrast: more)').addEventListener('change', (e) => {
        const newLevel = e.matches ? 'high' : 'normal';
        this.applyContrastLevel(newLevel);
      });
    }
    
    return this;
  }
  
  /**
   * Create the style element for CSS variables
   */
  createStyleElement() {
    if (this.styleElement) return;
    
    // Create style element
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'ux-mirror-color-adaptation';
    
    // Add to document head
    document.head.appendChild(this.styleElement);
    
    return this;
  }
  
  /**
   * Update the style element with current color scheme and contrast
   */
  updateStyleElement() {
    if (!this.styleElement) {
      this.createStyleElement();
    }
    
    // Get current variables
    const variables = this.cssVariables[this.colorScheme][this.contrastLevel];
    
    // Build CSS
    let css = ':root {\n';
    for (const [variable, value] of Object.entries(variables)) {
      css += `  ${variable}: ${value};\n`;
    }
    css += '}';
    
    // Set CSS content
    this.styleElement.textContent = css;
    
    return this;
  }
  
  /**
   * Log a message through the adaptation engine
   */
  log(message, level = 'info') {
    this.adaptationEngine.log(`[ColorAdapter] ${message}`);
    return this;
  }
}

export default ColorAdapter;
