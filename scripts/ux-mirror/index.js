/**
 * UX Mirror
 * Main entry point for the UX Mirror system
 */

import { getConfig } from './config.js';
import AnalysisEngine from './analysis/index.js';
import AdaptationEngine from './adaptations/index.js';
import UIManager from './ui/index.js';
import TrackerManager from './trackers/index.js';

/**
 * UXMirror
 * Main class for the UX Mirror system
 */
class UXMirror {
  constructor(userConfig = {}) {
    // Initialize with user configuration
    this.config = getConfig(userConfig);
    this.initialized = false;
    this.running = false;
    this.startTime = Date.now();
    
    // Initialize components
    this.trackers = new TrackerManager(this);
    this.analysis = new AnalysisEngine(this);
    this.adaptation = new AdaptationEngine(this);
    this.ui = new UIManager(this);
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.log = this.log.bind(this);
    this.handleInteraction = this.handleInteraction.bind(this);
  }
  
  /**
   * Initialize the UX Mirror system
   */
  init() {
    if (this.initialized) return this;
    
    this.log('Initializing UX Mirror');
    
    // Check for Do Not Track setting
    if (this.config.privacy.respectDNT && 
        (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes')) {
      this.log('Do Not Track enabled, disabling UX Mirror', 'warn');
      return this;
    }
    
    // Initialize components
    if (this.config.tracking.enabled) {
      this.trackers.init();
      
      // Set up interaction handler
      this.trackers.on('interaction', this.handleInteraction);
    }
    
    if (this.config.analysis.enabled) {
      this.analysis.init();
    }
    
    if (this.config.adaptation.enabled) {
      this.adaptation.init();
    }
    
    if (this.config.ui.enabled) {
      this.ui.init();
    }
    
    this.initialized = true;
    this.log('UX Mirror initialized');
    
    return this;
  }
  
  /**
   * Start the UX Mirror system
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return this;
    
    this.log('Starting UX Mirror');
    
    // Start components
    if (this.config.tracking.enabled) {
      this.trackers.start();
    }
    
    if (this.config.analysis.enabled) {
      this.analysis.start();
    }
    
    if (this.config.adaptation.enabled) {
      this.adaptation.start();
    }
    
    if (this.config.ui.enabled) {
      this.ui.start();
    }
    
    this.running = true;
    this.log('UX Mirror started');
    
    return this;
  }
  
  /**
   * Stop the UX Mirror system
   */
  stop() {
    if (!this.running) return this;
    
    this.log('Stopping UX Mirror');
    
    // Stop components in reverse order
    if (this.config.ui.enabled) {
      this.ui.stop();
    }
    
    if (this.config.adaptation.enabled) {
      this.adaptation.stop();
    }
    
    if (this.config.analysis.enabled) {
      this.analysis.stop();
    }
    
    if (this.config.tracking.enabled) {
      this.trackers.stop();
    }
    
    this.running = false;
    this.log('UX Mirror stopped');
    
    return this;
  }
  
  /**
   * Log a message to the console
   */
  log(message, level = 'info') {
    if (!this.config.debug.enabled || !this.config.debug.consoleLogging) {
      return;
    }
    
    const logLevels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    // Skip logging if level is below configured level
    const configLevelValue = logLevels[this.config.debug.logLevel] || 1;
    const messageLevelValue = logLevels[level] || 1;
    
    if (messageLevelValue < configLevelValue) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const prefix = `[UX Mirror] [${timestamp}]`;
    
    switch (level) {
      case 'debug':
        console.debug(`${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`);
        break;
      case 'error':
        console.error(`${prefix} ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
        break;
    }
    
    return this;
  }
  
  /**
   * Handle user interaction events
   */
  handleInteraction(type, data) {
    // Process the interaction in the analysis engine
    if (this.config.analysis.enabled) {
      this.analysis.processInteraction(type, data);
    }
    
    // Notify UI manager of interaction
    if (this.config.ui.enabled) {
      this.ui.handleInteraction();
    }
    
    return this;
  }
  
  /**
   * Get the current session duration in milliseconds
   */
  getSessionDuration() {
    return Date.now() - this.startTime;
  }
}

// Create global instance
// const uxMirror = new UXMirror(); // Prevent self-instantiation when loaded as a module

// Auto-initialize on load if not in a module context
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Assign the CLASS to window.UXMirror if it's not already defined.
    // The loader will handle instantiation.
    if (typeof window.UXMirror === 'undefined') {
        window.UXMirror = UXMirror; // UXMirror here refers to the class definition
    }
  });
}

export default UXMirror;
