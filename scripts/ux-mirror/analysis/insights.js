/**
 * Insights Engine
 * Generates insights and recommendations based on user behavior
 */

/**
 * InsightsEngine
 * Analyzes user profile and interactions to generate UX insights
 */
class InsightsEngine {
  constructor(analysisEngine) {
    this.analysisEngine = analysisEngine;
    this.config = analysisEngine.config;
    this.initialized = false;
    
    // Insights storage
    this.insights = [];
    this.lastInsightTime = 0;
    this.insightCounter = 0;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.generateInsights = this.generateInsights.bind(this);
    this.addInsight = this.addInsight.bind(this);
  }
  
  /**
   * Initialize the insights engine
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing insights engine');
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Generate new insights based on user profile and interactions
   */
  generateInsights(profile, interactionSummary) {
    // Don't generate insights too frequently
    const now = Date.now();
    if (now - this.lastInsightTime < 5000) {
      return [];
    }
    
    this.log('Generating insights');
    
    // Store new insights generated this round
    const newInsights = [];
    
    // Only proceed if we have enough data
    if (!profile || !interactionSummary || !interactionSummary.totalInteractions) {
      return newInsights;
    }
    
    // Check navigation style
    const navStyle = profile.interactionPreferences.navigationStyle;
    if (navStyle !== 'undetermined' && profile.confidenceLevels.interactionPreferences > 0.4) {
      this.addInsight(
        newInsights,
        'navigation_style',
        `User has a ${navStyle} navigation style`,
        `This user navigates in a ${navStyle} fashion, which suggests they might prefer ${
          navStyle === 'explorer' ? 'more visual exploration options' :
          navStyle === 'goal-oriented' ? 'direct paths to actions' :
          'clear, sequential information presentation'
        }.`,
        profile.confidenceLevels.interactionPreferences,
        'navigation'
      );
    }
    
    // Check for accessibility needs
    const accessNeeds = profile.accessibilityNeeds;
    if (accessNeeds.requiresHighContrast) {
      this.addInsight(
        newInsights,
        'high_contrast_need',
        'User may benefit from high contrast',
        'System settings or user behavior suggest a preference for high contrast. Consider providing a high contrast mode or ensuring sufficient contrast ratios.',
        profile.confidenceLevels.accessibilityNeeds,
        'accessibility',
        'important'
      );
    }
    
    // Check for engagement level
    const engagement = profile.interactionPreferences.engagementLevel;
    if (engagement > 0 && profile.confidenceLevels.interactionPreferences > 0.3) {
      let engagementDesc = 'moderate';
      if (engagement > 0.8) engagementDesc = 'very high';
      else if (engagement > 0.6) engagementDesc = 'high';
      else if (engagement < 0.3) engagementDesc = 'low';
      
      this.addInsight(
        newInsights,
        'engagement_level',
        `User shows ${engagementDesc} engagement`,
        `Current engagement level is ${(engagement * 100).toFixed(0)}% based on interaction patterns. ${
          engagement < 0.4 ? 'Consider more interactive elements or engaging content.' :
          engagement > 0.7 ? 'User is highly engaged. Current approach is working well.' :
          'Engagement is moderate. Continue monitoring for changes.'
        }`,
        profile.confidenceLevels.interactionPreferences,
        'engagement'
      );
    }
    
    // Check for section interests
    const interests = profile.sectionInterests;
    const interestEntries = Object.entries(interests).sort((a, b) => b[1] - a[1]);
    if (interestEntries.length > 0 && profile.confidenceLevels.sectionInterests > 0.4) {
      const topInterest = interestEntries[0];
      
      if (topInterest[1] > 0.7) {
        this.addInsight(
          newInsights,
          'section_interest',
          `High interest in "${topInterest[0]}" section`,
          `User shows strong interest in the "${topInterest[0]}" section with an interest score of ${(topInterest[1] * 100).toFixed(0)}%. Consider highlighting similar content or expanding this section.`,
          profile.confidenceLevels.sectionInterests,
          'content'
        );
      }
    }
    
    // Update insights with new ones
    if (newInsights.length > 0) {
      this.insights = [...this.insights, ...newInsights];
      
      // Limit the total number of insights stored
      if (this.insights.length > 20) {
        this.insights = this.insights.slice(-20);
      }
    }
    
    this.lastInsightTime = now;
    
    return newInsights;
  }
  
  /**
   * Add a new insight
   */
  addInsight(newInsights, type, title, description, confidence, category = 'general', severity = 'info') {
    // Don't add insights with confidence below threshold
    if (confidence < this.config.confidenceThreshold) {
      return;
    }
    
    // Create new insight
    const insight = {
      id: `insight_${++this.insightCounter}`,
      type,
      title,
      description,
      confidence,
      category,
      severity,
      timestamp: Date.now()
    };
    
    // Add to new insights array
    newInsights.push(insight);
    
    return insight;
  }
  
  /**
   * Log a message through the analysis engine
   */
  log(message) {
    this.analysisEngine.log(`[InsightsEngine] ${message}`);
    return this;
  }
}

export default InsightsEngine;
