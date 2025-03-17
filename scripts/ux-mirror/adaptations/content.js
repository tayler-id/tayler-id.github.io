/**
 * Content Adapter
 * Adapts content presentation based on user behavior and preferences
 */

/**
 * ContentAdapter
 * Handles content-related adaptations for better user experience
 */
class ContentAdapter {
  constructor(adaptationEngine) {
    this.adaptationEngine = adaptationEngine;
    this.config = adaptationEngine.config;
    this.initialized = false;
    this.running = false;
    
    // Content adaptation state
    this.activeAdaptations = new Map();
    this.emphasizedSections = new Set();
    this.contentDensity = 'normal'; // 'sparse', 'normal', 'dense'
    this.readingLevel = 'normal'; // 'simple', 'normal', 'detailed'
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.processInsight = this.processInsight.bind(this);
    this.emphasizeSection = this.emphasizeSection.bind(this);
    this.deemphasizeSection = this.deemphasizeSection.bind(this);
    this.applyContentDensity = this.applyContentDensity.bind(this);
    this.applyReadingLevel = this.applyReadingLevel.bind(this);
  }
  
  /**
   * Initialize the content adapter
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing content adapter');
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Start the content adapter
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting content adapter');
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop the content adapter
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping content adapter');
    
    // Remove all adaptations
    this.emphasizedSections.forEach(sectionId => {
      this.deemphasizeSection(sectionId);
    });
    
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
    switch (insight.type) {
      case 'section_interest':
        // Emphasize sections the user is interested in
        const sectionMatch = insight.title.match(/High interest in "([^"]+)" section/);
        if (sectionMatch && sectionMatch[1] && insight.confidence > 0.5) {
          this.emphasizeSection(sectionMatch[1]);
        }
        break;
        
      case 'navigation_style':
        // Adjust content density based on navigation style
        if (insight.confidence > 0.4) {
          const navStyle = insight.title.match(/User has a (\w+) navigation style/)[1];
          
          if (navStyle === 'explorer') {
            // Explorers prefer more visual, scannable content
            this.applyContentDensity('sparse');
            this.applyReadingLevel('simple');
          } else if (navStyle === 'methodical') {
            // Methodical users prefer detailed content
            this.applyContentDensity('normal');
            this.applyReadingLevel('detailed');
          } else if (navStyle === 'goal-oriented') {
            // Goal-oriented users prefer dense, actionable content
            this.applyContentDensity('dense');
            this.applyReadingLevel('normal');
          }
        }
        break;
        
      case 'engagement_level':
        // Adjust content based on engagement level
        const engagementMatch = insight.title.match(/User shows (\w+) engagement/);
        if (engagementMatch && engagementMatch[1] && insight.confidence > 0.4) {
          const engagementLevel = engagementMatch[1];
          
          if (engagementLevel === 'low') {
            // For low engagement, simplify and make more scannable
            this.applyContentDensity('sparse');
            this.applyReadingLevel('simple');
          } else if (engagementLevel === 'high' || engagementLevel === 'very high') {
            // For high engagement, provide more detailed content
            this.applyReadingLevel('detailed');
          }
        }
        break;
    }
    
    return this;
  }
  
  /**
   * Emphasize a section to draw user attention
   */
  emphasizeSection(sectionId) {
    if (!sectionId || this.emphasizedSections.has(sectionId)) {
      return false;
    }
    
    this.log(`Emphasizing section: ${sectionId}`);
    
    // Find the section element
    const section = document.getElementById(sectionId) || 
                   document.querySelector(`[data-section="${sectionId}"]`) || 
                   document.querySelector(`.${sectionId}`);
    
    if (!section) {
      this.log(`Section not found: ${sectionId}`, 'warn');
      return false;
    }
    
    // Add emphasis class
    section.classList.add('ux-mirror-emphasized');
    
    // Apply a subtle highlight effect
    const originalBackgroundColor = window.getComputedStyle(section).backgroundColor;
    section.style.transition = 'background-color 0.5s ease';
    section.style.backgroundColor = 'rgba(52, 152, 219, 0.05)';
    
    // Scroll the section into view if not visible
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    
    if (!isVisible) {
      // Apply smooth scrolling if in viewport and user has engaged with the section
      section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Record the adaptation
    const adaptationId = this.adaptationEngine.applyAdaptation('section_emphasis', {
      sectionId,
      originalBackgroundColor
    });
    
    // Store adaptation info
    this.emphasizedSections.add(sectionId);
    this.activeAdaptations.set(`section_emphasis_${sectionId}`, adaptationId);
    
    return true;
  }
  
  /**
   * Deemphasize a previously emphasized section
   */
  deemphasizeSection(sectionId) {
    if (!sectionId || !this.emphasizedSections.has(sectionId)) {
      return false;
    }
    
    this.log(`Deemphasizing section: ${sectionId}`);
    
    // Find the section element
    const section = document.getElementById(sectionId) || 
                   document.querySelector(`[data-section="${sectionId}"]`) || 
                   document.querySelector(`.${sectionId}`);
    
    if (!section) {
      this.log(`Section not found: ${sectionId}`, 'warn');
      return false;
    }
    
    // Remove emphasis class
    section.classList.remove('ux-mirror-emphasized');
    
    // Reset background color
    section.style.backgroundColor = '';
    
    // Get adaptation ID
    const adaptationKey = `section_emphasis_${sectionId}`;
    const adaptationId = this.activeAdaptations.get(adaptationKey);
    
    if (adaptationId) {
      // Remove the adaptation
      this.adaptationEngine.removeAdaptation(adaptationId);
      this.activeAdaptations.delete(adaptationKey);
    }
    
    // Remove from emphasized sections
    this.emphasizedSections.delete(sectionId);
    
    return true;
  }
  
  /**
   * Apply content density adaptation
   */
  applyContentDensity(density) {
    if (!['sparse', 'normal', 'dense'].includes(density)) {
      this.log(`Invalid content density: ${density}`, 'warn');
      return false;
    }
    
    // Don't reapply the same density
    if (this.contentDensity === density) {
      return true;
    }
    
    this.log(`Applying content density: ${density}`);
    
    // Update content density
    this.contentDensity = density;
    
    // Apply CSS classes to body
    document.body.classList.remove('ux-mirror-content-sparse', 'ux-mirror-content-normal', 'ux-mirror-content-dense');
    document.body.classList.add(`ux-mirror-content-${density}`);
    
    // Record the adaptation
    const adaptationId = this.adaptationEngine.applyAdaptation('content_density', {
      density: this.contentDensity
    });
    
    // Store adaptation ID
    if (this.activeAdaptations.has('content_density')) {
      this.adaptationEngine.removeAdaptation(this.activeAdaptations.get('content_density'));
    }
    this.activeAdaptations.set('content_density', adaptationId);
    
    return true;
  }
  
  /**
   * Apply reading level adaptation
   */
  applyReadingLevel(level) {
    if (!['simple', 'normal', 'detailed'].includes(level)) {
      this.log(`Invalid reading level: ${level}`, 'warn');
      return false;
    }
    
    // Don't reapply the same level
    if (this.readingLevel === level) {
      return true;
    }
    
    this.log(`Applying reading level: ${level}`);
    
    // Update reading level
    this.readingLevel = level;
    
    // Apply reading level content adaptations
    this.applyReadingLevelAdaptations(level);
    
    // Record the adaptation
    const adaptationId = this.adaptationEngine.applyAdaptation('reading_level', {
      level: this.readingLevel
    });
    
    // Store adaptation ID
    if (this.activeAdaptations.has('reading_level')) {
      this.adaptationEngine.removeAdaptation(this.activeAdaptations.get('reading_level'));
    }
    this.activeAdaptations.set('reading_level', adaptationId);
    
    return true;
  }
  
  /**
   * Apply reading level content adaptations
   */
  applyReadingLevelAdaptations(level) {
    // Find content elements with different detail levels
    const simplifiedElements = document.querySelectorAll('[data-content-level="simple"]');
    const normalElements = document.querySelectorAll('[data-content-level="normal"]');
    const detailedElements = document.querySelectorAll('[data-content-level="detailed"]');
    
    // Show/hide elements based on reading level
    switch (level) {
      case 'simple':
        showElements(simplifiedElements);
        hideElements(normalElements);
        hideElements(detailedElements);
        break;
        
      case 'normal':
        showElements(simplifiedElements);
        showElements(normalElements);
        hideElements(detailedElements);
        break;
        
      case 'detailed':
        showElements(simplifiedElements);
        showElements(normalElements);
        showElements(detailedElements);
        break;
    }
    
    // Helper functions
    function showElements(elements) {
      elements.forEach(el => {
        el.style.display = '';
        el.classList.remove('ux-mirror-hidden');
      });
    }
    
    function hideElements(elements) {
      elements.forEach(el => {
        el.style.display = 'none';
        el.classList.add('ux-mirror-hidden');
      });
    }
  }
  
  /**
   * Log a message through the adaptation engine
   */
  log(message, level = 'info') {
    this.adaptationEngine.log(`[ContentAdapter] ${message}`);
    return this;
  }
}

export default ContentAdapter;
