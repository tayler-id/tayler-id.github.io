/**
 * UX Mirror Configuration
 * Default configuration settings for UX Mirror
 */

/**
 * Default configuration
 */
const defaultConfig = {
  /**
   * Debug configuration
   */
  debug: {
    enabled: true,               // Enable debug mode
    logLevel: 'info',            // Log level: 'debug', 'info', 'warn', 'error'
    consoleLogging: true,        // Log to console
  },
  
  /**
   * Tracking configuration
   */
  tracking: {
    enabled: true,               // Enable tracking
    trackMouse: true,            // Track mouse movements
    trackClicks: true,           // Track clicks
    trackScroll: true,           // Track scrolling
    trackViewport: true,         // Track viewport changes
    trackTime: true,             // Track time metrics
    clickSampleRate: 1,          // Sample rate for clicks (1 = all clicks)
    mouseSampleRate: 0.1,        // Sample rate for mouse movements (0.1 = 10% of movements)
    scrollSampleRate: 0.5,       // Sample rate for scroll events (0.5 = 50% of scrolls)
    idleThreshold: 5000,         // Idle threshold in milliseconds
    trackSections: true,         // Track section visibility
    sectionSelector: 'section, .section, [data-section], article, main > div',  // CSS selector for sections
    sectionVisibilityThreshold: 0.5,  // Percentage of section visible to count as viewed (0.5 = 50%)
    dataCollection: {
      cookies: false,            // Collect cookie information
      forms: false,              // Track form interactions
      localStorage: false,       // Access localStorage data
    }
  },
  
  /**
   * Analysis configuration
   */
  analysis: {
    enabled: true,               // Enable analysis
    analysisInterval: 5000,      // Analysis interval in milliseconds
    maxInteractionsStored: 1000, // Maximum number of interactions to store
    minInteractionsForAnalysis: 10, // Minimum interactions needed for analysis
    profileUpdateWeight: 0.2,    // Weight for profile updates (0-1)
    confidenceThreshold: 0.3,    // Minimum confidence threshold for insights
  },
  
  /**
   * Adaptation configuration
   */
  adaptation: {
    enabled: true,               // Enable adaptation
    adaptColors: true,           // Adapt color scheme
    adaptAnimations: true,       // Adapt animation behavior
    adaptContent: true,          // Adapt content presentation
    adaptNavigation: false,      // Adapt navigation (not implemented)
    minConfidenceForAdaptation: 0.5, // Minimum confidence for adaptation
    adaptationCooldown: 10000,   // Cooldown between adaptations in milliseconds
  },
  
  /**
   * UI configuration
   */
  ui: {
    enabled: true,               // Enable UI
    panelPosition: 'bottom-right', // Panel position: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    initiallyCollapsed: true,    // Initially collapsed
    updateInterval: 2000,        // UI update interval in milliseconds
    showAfterInteractions: 20,   // Show UI after this many interactions
    enableVisualizations: true,  // Enable visualizations
    enableRecommendations: true, // Enable recommendations
    maxRecommendations: 5,       // Maximum number of recommendations to show
    uiScale: 1,                  // UI scale factor
  },
  
  /**
   * Privacy & consent configuration
   */
  privacy: {
    requiredConsent: false,      // Require user consent
    consentMessage: 'UX Mirror collects interaction data to improve your experience.',
    consentExpiry: 30,           // Days until consent expires
    dataRetention: 7,            // Days to retain data
    anonymizeData: true,         // Anonymize collected data
    respectDNT: true,            // Respect Do Not Track setting
  },
  
  /**
   * Storage configuration
   */
  storage: {
    useLocalStorage: true,       // Use localStorage
    localStorageKey: 'ux-mirror', // localStorage key prefix
    maxStorageSize: 5242880,     // Maximum storage size in bytes (5MB)
  }
};

/**
 * Get configuration with user overrides
 */
export function getConfig(userConfig = {}) {
  // Deep merge configs
  return deepMerge(defaultConfig, userConfig);
}

/**
 * Deep merge objects
 */
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Check if value is an object
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default defaultConfig;
