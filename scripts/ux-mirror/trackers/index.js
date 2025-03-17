/**
 * Tracker Manager
 * Manages user interaction trackers
 */

import MouseTracker from './mouse.js';
import ClickTracker from './click.js';
import ScrollTracker from './scroll.js';
import ViewportTracker from './viewport.js';
import TimeTracker from './time.js';

/**
 * TrackerManager
 * Manages and coordinates user interaction trackers
 */
class TrackerManager {
  constructor(uxMirror) {
    this.uxMirror = uxMirror;
    this.config = uxMirror.config.tracking;
    this.initialized = false;
    this.running = false;
    
    // Trackers
    this.trackers = {};
    this.eventListeners = {};
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.emit = this.emit.bind(this);
  }
  
  /**
   * Initialize trackers
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing tracker manager');
    
    // Initialize trackers based on configuration
    if (this.config.trackMouse) {
      this.trackers.mouse = new MouseTracker(this);
    }
    
    if (this.config.trackClicks) {
      this.trackers.click = new ClickTracker(this);
    }
    
    if (this.config.trackScroll) {
      this.trackers.scroll = new ScrollTracker(this);
    }
    
    if (this.config.trackViewport) {
      this.trackers.viewport = new ViewportTracker(this);
    }
    
    if (this.config.trackTime) {
      this.trackers.time = new TimeTracker(this);
    }
    
    // Initialize each tracker
    Object.values(this.trackers).forEach(tracker => tracker.init());
    
    this.initialized = true;
    this.log('Tracker manager initialized');
    
    return this;
  }
  
  /**
   * Start tracking user interactions
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting trackers');
    
    // Start each tracker
    Object.values(this.trackers).forEach(tracker => tracker.start());
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop tracking user interactions
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping trackers');
    
    // Stop each tracker
    Object.values(this.trackers).forEach(tracker => tracker.stop());
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    
    this.eventListeners[event].push(callback);
    
    return this;
  }
  
  /**
   * Remove event listener
   */
  off(event, callback) {
    if (!this.eventListeners[event]) {
      return this;
    }
    
    this.eventListeners[event] = this.eventListeners[event].filter(
      listener => listener !== callback
    );
    
    return this;
  }
  
  /**
   * Emit event to listeners
   */
  emit(event, ...args) {
    if (!this.eventListeners[event]) {
      return this;
    }
    
    this.eventListeners[event].forEach(callback => {
      try {
        callback(...args);
      } catch (err) {
        this.log(`Error in event listener for ${event}: ${err.message}`, 'error');
      }
    });
    
    return this;
  }
  
  /**
   * Log a message through UX Mirror
   */
  log(message, level = 'info') {
    this.uxMirror.log(`[TrackerManager] ${message}`, level);
    return this;
  }
}

export default TrackerManager;
