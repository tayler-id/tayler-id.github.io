/**
 * UI Manager
 * Manages the UI panel and components for UX Mirror
 */

import Panel from './panel.js';
import Visualizations from './visualizations.js';
import Recommendations from './recommendations.js';

/**
 * UIManager
 * Coordinates UI components and user interactions with the UX Mirror panel
 */
class UIManager {
  constructor(uxMirror) {
    this.uxMirror = uxMirror;
    this.config = uxMirror.config.ui;
    this.initialized = false;
    this.running = false;
    
    // UI state
    this.panel = null;
    this.visualizations = null;
    this.recommendations = null;
    this.isVisible = false;
    this.isExpanded = false;
    this.interactionCounter = 0;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.handleInteraction = this.handleInteraction.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.updateInsights = this.updateInsights.bind(this);
    this.createUI = this.createUI.bind(this);
    this.updateUI = this.updateUI.bind(this);
  }
  
  /**
   * Initialize the UI manager
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing UI manager');
    
    // Initialize UI components
    this.panel = new Panel(this);
    
    if (this.config.enableVisualizations) {
      this.visualizations = new Visualizations(this);
    }
    
    if (this.config.enableRecommendations) {
      this.recommendations = new Recommendations(this);
    }
    
    // Initialize components
    this.panel.init();
    
    if (this.visualizations) {
      this.visualizations.init();
    }
    
    if (this.recommendations) {
      this.recommendations.init();
    }
    
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Start the UI manager
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting UI manager');
    
    // Create the UI
    this.createUI();
    
    // Set initial state
    this.isVisible = false;
    this.isExpanded = !this.config.initiallyCollapsed;
    
    // Hide panel initially
    this.panel.hide();
    
    // Set up update interval
    this.updateInterval = setInterval(this.updateUI, this.config.updateInterval);
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop the UI manager
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping UI manager');
    
    // Clear update interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    // Remove UI elements
    if (this.panel) {
      this.panel.destroy();
    }
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Handle user interactions
   */
  handleInteraction() {
    this.interactionCounter++;
    
    // Check if we should show the UI after a certain number of interactions
    if (!this.isVisible && 
        this.interactionCounter >= this.config.showAfterInteractions) {
      this.toggleVisibility(true);
    }
    
    return this;
  }
  
  /**
   * Toggle UI visibility
   */
  toggleVisibility(show = null) {
    const newVisibility = show !== null ? show : !this.isVisible;
    
    if (newVisibility !== this.isVisible) {
      this.isVisible = newVisibility;
      
      if (this.isVisible) {
        this.panel.show();
        this.log('UI panel shown');
      } else {
        this.panel.hide();
        this.log('UI panel hidden');
      }
    }
    
    return this;
  }
  
  /**
   * Toggle expanded state
   */
  toggleExpanded(expanded = null) {
    const newExpanded = expanded !== null ? expanded : !this.isExpanded;
    
    if (newExpanded !== this.isExpanded) {
      this.isExpanded = newExpanded;
      
      if (this.isExpanded) {
        this.panel.expand();
        this.log('UI panel expanded');
      } else {
        this.panel.collapse();
        this.log('UI panel collapsed');
      }
    }
    
    return this;
  }
  
  /**
   * Update insights in the UI
   */
  updateInsights(insights) {
    if (!this.running || !insights || !insights.length) return;
    
    this.log(`Updating UI with ${insights.length} new insights`);
    
    // Update recommendations with new insights
    if (this.recommendations) {
      this.recommendations.updateInsights(insights);
    }
    
    // Show panel if it's not visible and we have important insights
    const hasImportantInsights = insights.some(
      insight => insight.severity === 'important' && insight.confidence > 0.6
    );
    
    if (hasImportantInsights && !this.isVisible) {
      this.toggleVisibility(true);
    }
    
    return this;
  }
  
  /**
   * Create the UI elements
   */
  createUI() {
    this.log('Creating UI elements');
    
    // Create panel
    this.panel.create();
    
    // Create visualizations
    if (this.visualizations) {
      this.visualizations.create(this.panel.getVisualizationsContainer());
    }
    
    // Create recommendations
    if (this.recommendations) {
      this.recommendations.create(this.panel.getRecommendationsContainer());
    }
    
    return this;
  }
  
  /**
   * Update the UI periodically
   */
  updateUI() {
    if (!this.running) return;
    
    // Update visualizations with latest data
    if (this.visualizations && this.isVisible) {
      this.visualizations.update();
    }
    
    return this;
  }
  
  /**
   * Get the user profile from the analysis engine
   */
  getUserProfile() {
    if (this.uxMirror.analysis && this.uxMirror.analysis.userProfile) {
      return this.uxMirror.analysis.userProfile.getData();
    }
    
    return null;
  }
  
  /**
   * Get insights from the analysis engine
   */
  getInsights() {
    if (this.uxMirror.analysis && this.uxMirror.analysis.insights) {
      return this.uxMirror.analysis.insights.insights || [];
    }
    
    return [];
  }
  
  /**
   * Get the current adaptations from the adaptation engine
   */
  getAdaptations() {
    if (this.uxMirror.adaptation) {
      return this.uxMirror.adaptation.getCurrentAdaptations();
    }
    
    return [];
  }
  
  /**
   * Log a message through UX Mirror
   */
  log(message) {
    this.uxMirror.log(`[UI] ${message}`);
    return this;
  }
}

export default UIManager;
