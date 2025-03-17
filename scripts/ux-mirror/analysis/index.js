/**
 * Analysis Engine
 * Processes interaction data to generate insights and user profiles
 */

import UserProfile from './profile.js';
import InsightsEngine from './insights.js';

/**
 * AnalysisEngine
 * Central system for processing user interactions and generating insights
 */
class AnalysisEngine {
  constructor(uxMirror) {
    this.uxMirror = uxMirror;
    this.config = uxMirror.config.analysis;
    this.initialized = false;
    this.running = false;
    
    // Analysis state
    this.interactions = [];
    this.userProfile = new UserProfile(this);
    this.insights = new InsightsEngine(this);
    this.analysisInterval = null;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.processInteraction = this.processInteraction.bind(this);
    this.runAnalysis = this.runAnalysis.bind(this);
    this.getInteractionsSummary = this.getInteractionsSummary.bind(this);
  }
  
  /**
   * Initialize the analysis engine
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing analysis engine');
    
    // Initialize components
    this.userProfile.init();
    this.insights.init();
    
    this.initialized = true;
    this.log('Analysis engine initialized');
    
    return this;
  }
  
  /**
   * Start the analysis engine
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting analysis engine');
    
    // Set up periodic analysis
    this.analysisInterval = setInterval(this.runAnalysis, this.config.analysisInterval);
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop the analysis engine
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping analysis engine');
    
    // Clear analysis interval
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Process a new interaction
   */
  processInteraction(type, data) {
    // Create standardized interaction record
    const interaction = {
      type,
      data,
      timestamp: data.timestamp || Date.now()
    };
    
    // Add to interactions array
    this.interactions.push(interaction);
    
    // Limit array size
    if (this.interactions.length > this.config.maxInteractionsStored) {
      this.interactions.shift();
    }
    
    // If we have enough interactions, update user profile
    if (this.interactions.length >= this.config.minInteractionsForAnalysis) {
      this.userProfile.update(interaction);
    }
    
    return this;
  }
  
  /**
   * Run periodic analysis
   */
  runAnalysis() {
    if (this.interactions.length < this.config.minInteractionsForAnalysis) {
      return;
    }
    
    this.log('Running analysis');
    
    // Generate new insights
    const newInsights = this.insights.generateInsights(
      this.userProfile.getData(),
      this.getInteractionsSummary()
    );
    
    // If we have new insights, notify adaptation and UI
    if (newInsights && newInsights.length > 0) {
      // Notify adaptation engine
      if (this.uxMirror.adaptation && this.uxMirror.config.adaptation.enabled) {
        this.uxMirror.adaptation.processInsights(newInsights);
      }
      
      // Notify UI
      if (this.uxMirror.ui && this.uxMirror.config.ui.enabled) {
        this.uxMirror.ui.updateInsights(newInsights);
      }
    }
    
    return this;
  }
  
  /**
   * Get summary of recent interactions
   */
  getInteractionsSummary() {
    if (this.interactions.length === 0) {
      return {};
    }
    
    // Count by type
    const typeCounts = {};
    this.interactions.forEach(interaction => {
      typeCounts[interaction.type] = (typeCounts[interaction.type] || 0) + 1;
    });
    
    // Get time range
    const timestamps = this.interactions.map(i => i.timestamp);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeRange = maxTime - minTime;
    
    // Calculate rates
    const totalInteractions = this.interactions.length;
    const interactionRates = {};
    
    for (const type in typeCounts) {
      interactionRates[type] = timeRange > 0 
        ? (typeCounts[type] / (timeRange / 1000)) 
        : 0;
    }
    
    // Create summary
    return {
      totalInteractions,
      typeCounts,
      timeRange,
      interactionRates,
      latestTimestamp: maxTime
    };
  }
  
  /**
   * Log a message through UX Mirror
   */
  log(message) {
    this.uxMirror.log(`[Analysis] ${message}`);
    return this;
  }
}

export default AnalysisEngine;
