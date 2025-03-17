/**
 * Recommendations Component
 * Displays insights and recommendations based on UX analysis
 */

/**
 * Recommendations
 * Presents UX insights and actionable recommendations to improve user experience
 */
class Recommendations {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.config = uiManager.config;
    this.initialized = false;
    
    // Recommendations elements
    this.container = null;
    this.insightsContainer = null;
    
    // Recommendations data
    this.insights = [];
    this.displayedInsightIds = new Set();
    
    // Bind methods
    this.init = this.init.bind(this);
    this.create = this.create.bind(this);
    this.updateInsights = this.updateInsights.bind(this);
    this.renderInsight = this.renderInsight.bind(this);
    this.sortInsights = this.sortInsights.bind(this);
    this.filterInsights = this.filterInsights.bind(this);
    this.getConfidenceLabel = this.getConfidenceLabel.bind(this);
  }
  
  /**
   * Initialize the recommendations
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing recommendations');
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Create the recommendations UI
   */
  create(container) {
    this.log('Creating recommendations');
    
    // Store container reference
    this.container = container;
    
    // Create welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'ux-mirror-card';
    welcomeMessage.innerHTML = `
      <h4>UX Mirror Insights</h4>
      <p>UX Mirror is analyzing user interactions to generate insights and recommendations for improving user experience.</p>
      <p>As more data is collected, personalized recommendations will appear here.</p>
    `;
    this.container.appendChild(welcomeMessage);
    
    // Create insights container
    this.insightsContainer = document.createElement('div');
    this.insightsContainer.className = 'ux-mirror-insights-container';
    this.container.appendChild(this.insightsContainer);
    
    return this;
  }
  
  /**
   * Update insights with new data
   */
  updateInsights(newInsights) {
    if (!this.container || !this.insightsContainer) return;
    
    this.log(`Updating with ${newInsights.length} new insights`);
    
    // Add new insights
    newInsights.forEach(insight => {
      // Skip if already displayed
      if (this.displayedInsightIds.has(insight.id)) {
        return;
      }
      
      // Add to insights array
      this.insights.push(insight);
      
      // Mark as displayed
      this.displayedInsightIds.add(insight.id);
      
      // Render the insight
      this.renderInsight(insight);
    });
    
    // If we have insights, remove the welcome message
    if (this.insights.length > 0 && this.container.querySelector('.ux-mirror-card')) {
      const welcomeMessage = this.container.querySelector('.ux-mirror-card');
      this.container.removeChild(welcomeMessage);
    }
    
    return this;
  }
  
  /**
   * Render a single insight as a recommendation card
   */
  renderInsight(insight) {
    // Create recommendation element
    const recommendation = document.createElement('div');
    recommendation.className = 'ux-mirror-recommendation';
    recommendation.dataset.insightId = insight.id;
    
    // Add severity class
    if (insight.severity === 'important') {
      recommendation.classList.add('ux-mirror-recommendation-important');
    } else if (insight.severity === 'warning') {
      recommendation.classList.add('ux-mirror-recommendation-warning');
    }
    
    // Create title
    const title = document.createElement('h5');
    title.className = 'ux-mirror-recommendation-title';
    title.textContent = insight.title;
    recommendation.appendChild(title);
    
    // Create content
    const content = document.createElement('div');
    content.className = 'ux-mirror-recommendation-content';
    content.textContent = insight.description;
    recommendation.appendChild(content);
    
    // Create confidence indicator
    const confidence = document.createElement('div');
    confidence.className = 'ux-mirror-recommendation-confidence';
    confidence.textContent = `Confidence: ${this.getConfidenceLabel(insight.confidence)}`;
    recommendation.appendChild(confidence);
    
    // Add to insights container
    this.insightsContainer.insertBefore(recommendation, this.insightsContainer.firstChild);
    
    // Add fade-in effect
    setTimeout(() => {
      recommendation.classList.add('ux-mirror-fade-in');
    }, 10);
    
    return recommendation;
  }
  
  /**
   * Sort insights by priority and recency
   */
  sortInsights() {
    // Sort insights by severity, confidence, and timestamp
    this.insights.sort((a, b) => {
      // First sort by severity
      const severityOrder = { important: 3, warning: 2, info: 1 };
      const severityA = severityOrder[a.severity] || 0;
      const severityB = severityOrder[b.severity] || 0;
      
      if (severityB !== severityA) {
        return severityB - severityA;
      }
      
      // Then by confidence
      if (b.confidence !== a.confidence) {
        return b.confidence - a.confidence;
      }
      
      // Finally by timestamp (newest first)
      return b.timestamp - a.timestamp;
    });
    
    return this;
  }
  
  /**
   * Filter insights based on criteria
   */
  filterInsights(criteria = {}) {
    let filteredInsights = [...this.insights];
    
    // Filter by category
    if (criteria.category) {
      filteredInsights = filteredInsights.filter(
        insight => insight.category === criteria.category
      );
    }
    
    // Filter by minimum confidence
    if (criteria.minConfidence) {
      filteredInsights = filteredInsights.filter(
        insight => insight.confidence >= criteria.minConfidence
      );
    }
    
    // Filter by type
    if (criteria.type) {
      filteredInsights = filteredInsights.filter(
        insight => insight.type === criteria.type
      );
    }
    
    return filteredInsights;
  }
  
  /**
   * Get a human-readable confidence label
   */
  getConfidenceLabel(confidence) {
    if (confidence >= 0.8) return 'Very High';
    if (confidence >= 0.6) return 'High';
    if (confidence >= 0.4) return 'Medium';
    if (confidence >= 0.2) return 'Low';
    return 'Very Low';
  }
  
  /**
   * Log a message through the UI manager
   */
  log(message) {
    this.uiManager.log(`[Recommendations] ${message}`);
    return this;
  }
}

export default Recommendations;
