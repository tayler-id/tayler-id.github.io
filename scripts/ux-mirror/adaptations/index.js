/**
 * Adaptations Engine
 * Dynamically adapts the UI based on user behavior and insights
 */

import ColorAdapter from './color.js';
import AnimationAdapter from './animation.js';
import ContentAdapter from './content.js';

/**
 * AdaptationEngine
 * Central system for dynamic UI adaptations based on user profile and insights
 */
class AdaptationEngine {
  constructor(uxMirror) {
    this.uxMirror = uxMirror;
    this.config = uxMirror.config.adaptation;
    this.initialized = false;
    this.running = false;
    
    // Adaptation components
    this.colorAdapter = new ColorAdapter(this);
    this.animationAdapter = new AnimationAdapter(this);
    this.contentAdapter = new ContentAdapter(this);
    
    // Adaptation state
    this.activeAdaptations = [];
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.processInsights = this.processInsights.bind(this);
    this.applyAdaptation = this.applyAdaptation.bind(this);
    this.removeAdaptation = this.removeAdaptation.bind(this);
    this.getCurrentAdaptations = this.getCurrentAdaptations.bind(this);
  }
  
  /**
   * Initialize the adaptation engine
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing adaptation engine');
    
    // Initialize components
    if (this.config.adaptColors) {
      this.colorAdapter.init();
    }
    
    if (this.config.adaptAnimations) {
      this.animationAdapter.init();
    }
    
    if (this.config.adaptContent) {
      this.contentAdapter.init();
    }
    
    this.initialized = true;
    this.log('Adaptation engine initialized');
    
    return this;
  }
  
  /**
   * Start the adaptation engine
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting adaptation engine');
    
    // Start components
    if (this.config.adaptColors) {
      this.colorAdapter.start();
    }
    
    if (this.config.adaptAnimations) {
      this.animationAdapter.start();
    }
    
    if (this.config.adaptContent) {
      this.contentAdapter.start();
    }
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop the adaptation engine
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping adaptation engine');
    
    // Stop components
    if (this.config.adaptColors) {
      this.colorAdapter.stop();
    }
    
    if (this.config.adaptAnimations) {
      this.animationAdapter.stop();
    }
    
    if (this.config.adaptContent) {
      this.contentAdapter.stop();
    }
    
    // Revert all active adaptations
    this.activeAdaptations.forEach(adaptation => {
      this.removeAdaptation(adaptation.id);
    });
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Process new insights from the analysis engine
   */
  processInsights(insights) {
    if (!this.running || !insights || insights.length === 0) return;
    
    this.log(`Processing ${insights.length} new insights`);
    
    // Process each insight
    insights.forEach(insight => {
      // Skip insights with low confidence
      if (insight.confidence < this.config.minConfidenceForAdaptation) {
        return;
      }
      
      // Route insights to appropriate adapters
      switch (insight.category) {
        case 'accessibility':
          if (this.config.adaptColors) {
            this.colorAdapter.processInsight(insight);
          }
          if (this.config.adaptAnimations) {
            this.animationAdapter.processInsight(insight);
          }
          break;
          
        case 'navigation':
        case 'content':
          if (this.config.adaptContent) {
            this.contentAdapter.processInsight(insight);
          }
          break;
          
        case 'engagement':
          if (this.config.adaptAnimations) {
            this.animationAdapter.processInsight(insight);
          }
          if (this.config.adaptContent) {
            this.contentAdapter.processInsight(insight);
          }
          break;
          
        case 'performance':
          if (this.config.adaptAnimations) {
            this.animationAdapter.processInsight(insight);
          }
          break;
          
        default:
          // General insights can be processed by all adapters
          if (this.config.adaptColors) {
            this.colorAdapter.processInsight(insight);
          }
          if (this.config.adaptAnimations) {
            this.animationAdapter.processInsight(insight);
          }
          if (this.config.adaptContent) {
            this.contentAdapter.processInsight(insight);
          }
          break;
      }
    });
    
    return this;
  }
  
  /**
   * Apply a new adaptation to the UI
   */
  applyAdaptation(type, params) {
    // Create adaptation record
    const adaptation = {
      id: `adaptation_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      params,
      timestamp: Date.now()
    };
    
    // Add to active adaptations
    this.activeAdaptations.push(adaptation);
    
    this.log(`Applied ${type} adaptation: ${adaptation.id}`);
    
    return adaptation.id;
  }
  
  /**
   * Remove an adaptation by ID
   */
  removeAdaptation(adaptationId) {
    const index = this.activeAdaptations.findIndex(
      adaptation => adaptation.id === adaptationId
    );
    
    if (index !== -1) {
      const adaptation = this.activeAdaptations[index];
      
      // Remove from active adaptations
      this.activeAdaptations.splice(index, 1);
      
      this.log(`Removed ${adaptation.type} adaptation: ${adaptationId}`);
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Get current active adaptations
   */
  getCurrentAdaptations() {
    return [...this.activeAdaptations];
  }
  
  /**
   * Log a message through UX Mirror
   */
  log(message) {
    this.uxMirror.log(`[Adaptation] ${message}`);
    return this;
  }
}

export default AdaptationEngine;
