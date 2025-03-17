/**
 * User Profile
 * Maintains and updates the user behavior profile based on interactions
 */

/**
 * UserProfile
 * Tracks user behavior patterns, preferences, and usage habits
 */
class UserProfile {
  constructor(analysisEngine) {
    this.analysisEngine = analysisEngine;
    this.config = analysisEngine.config;
    this.initialized = false;
    
    // Profile data
    this.profile = {
      // Interaction preferences
      interactionPreferences: {
        clickFrequency: 0,               // How frequently user clicks (clicks per minute)
        scrollSpeed: 0,                  // Average scroll speed
        navigationStyle: 'undetermined', // 'methodical', 'explorer', 'goal-oriented'
        attentionSpan: 0,                // Average time spent on sections (ms)
        engagementLevel: 0,              // Overall engagement (0-1)
      },
      
      // Visual preferences
      visualPreferences: {
        prefersDarkMode: null,           // Preference for dark mode
        colorPreference: null,           // Preferred color scheme
        animationTolerance: 0.5,         // Tolerance for animations (0-1)
        fontSizePreference: 'normal',    // 'small', 'normal', 'large'
      },
      
      // Content preferences
      contentPreferences: {
        readingSpeed: 'normal',          // 'slow', 'normal', 'fast'
        contentDensity: 'normal',        // 'sparse', 'normal', 'dense'
        mediaPreference: 'balanced',     // 'text', 'visual', 'balanced'
        detailLevel: 'normal',           // 'brief', 'normal', 'detailed'
      },
      
      // Section interests
      sectionInterests: {},              // Map of section IDs to interest scores (0-1)
      
      // Device and environment
      deviceContext: {
        deviceType: this.detectDeviceType(),
        screenSize: this.getScreenSize(),
        isMobile: this.isMobileDevice(),
        connectionType: 'unknown',
        inputMethod: this.detectInputMethod(),
      },
      
      // Usage patterns
      usagePatterns: {
        sessionCount: 1,
        totalSessionTime: 0,
        averageSessionDuration: 0,
        repeatVisits: false,
        lastVisitTimestamp: Date.now(),
      },
      
      // Accessibility needs
      accessibilityNeeds: {
        requiresLargeText: false,
        requiresHighContrast: false,
        requiresReducedMotion: false,
        requiresKeyboardNavigation: false,
      },
      
      // Confidence levels
      confidenceLevels: {
        interactionPreferences: 0,
        visualPreferences: 0,
        contentPreferences: 0,
        sectionInterests: 0,
        accessibilityNeeds: 0,
      }
    };
    
    // Bind methods
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.getData = this.getData.bind(this);
    this.detectDeviceType = this.detectDeviceType.bind(this);
    this.getScreenSize = this.getScreenSize.bind(this);
    this.isMobileDevice = this.isMobileDevice.bind(this);
    this.detectInputMethod = this.detectInputMethod.bind(this);
    this.updateInteractionPreferences = this.updateInteractionPreferences.bind(this);
    this.updateVisualPreferences = this.updateVisualPreferences.bind(this);
    this.updateContentPreferences = this.updateContentPreferences.bind(this);
    this.updateSectionInterests = this.updateSectionInterests.bind(this);
    this.updateAccessibilityNeeds = this.updateAccessibilityNeeds.bind(this);
  }
  
  /**
   * Initialize the user profile
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing user profile');
    
    // Try to load any saved profile from localStorage
    this.loadProfile();
    
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Update profile based on a new interaction
   */
  update(interaction) {
    const { type, data } = interaction;
    
    // Update specific profile sections based on interaction type
    switch (type) {
      case 'mouse_move':
        // Mouse movements can inform about user's precision and speed
        break;
        
      case 'click':
        // Clicks can inform about navigation style and interests
        this.updateInteractionPreferences(interaction);
        this.updateSectionInterests(interaction);
        break;
        
      case 'scroll':
        // Scrolling can inform about reading speed and engagement
        this.updateInteractionPreferences(interaction);
        this.updateContentPreferences(interaction);
        break;
        
      case 'section_visibility':
      case 'section_visibility_duration':
        // Section visibility can inform about interests and attention span
        this.updateSectionInterests(interaction);
        this.updateInteractionPreferences(interaction);
        break;
        
      case 'viewport':
        // Viewport changes can inform about device and browsing behavior
        break;
        
      case 'time_metrics':
        // Time metrics can inform about engagement and session patterns
        this.updateInteractionPreferences(interaction);
        this.updateUsagePatterns(interaction);
        break;
        
      case 'user_idle':
        // User idle periods can inform about engagement
        this.updateInteractionPreferences(interaction);
        break;
    }
    
    // Update confidence levels
    this.updateConfidenceLevels();
    
    // Save profile periodically
    this.saveProfile();
    
    return this;
  }
  
  /**
   * Get profile data
   */
  getData() {
    return { ...this.profile };
  }
  
  /**
   * Load saved profile from localStorage if available
   */
  loadProfile() {
    try {
      const savedProfile = localStorage.getItem('uxMirrorUserProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        // Merge saved profile with default profile
        this.profile = { ...this.profile, ...parsedProfile };
        
        // Update session data
        this.profile.usagePatterns.sessionCount += 1;
        this.profile.usagePatterns.repeatVisits = true;
        
        this.log('Loaded saved user profile');
      }
    } catch (error) {
      this.log(`Error loading profile: ${error.message}`, 'error');
    }
    
    return this;
  }
  
  /**
   * Save profile to localStorage
   */
  saveProfile() {
    try {
      localStorage.setItem('uxMirrorUserProfile', JSON.stringify(this.profile));
    } catch (error) {
      this.log(`Error saving profile: ${error.message}`, 'error');
    }
    
    return this;
  }
  
  /**
   * Detect device type
   */
  detectDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }
  
  /**
   * Get screen size category
   */
  getScreenSize() {
    const width = window.innerWidth;
    if (width < 576) return 'xs';
    if (width < 768) return 'sm';
    if (width < 992) return 'md';
    if (width < 1200) return 'lg';
    return 'xl';
  }
  
  /**
   * Check if device is mobile
   */
  isMobileDevice() {
    return this.detectDeviceType() === 'mobile';
  }
  
  /**
   * Detect input method
   */
  detectInputMethod() {
    // Check if has touch support
    const hasTouch = ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0) || 
                     (navigator.msMaxTouchPoints > 0);
                     
    if (hasTouch && this.isMobileDevice()) {
      return 'touch';
    }
    
    return 'mouse';
  }
  
  /**
   * Update interaction preferences based on interaction
   */
  updateInteractionPreferences(interaction) {
    const { type, data } = interaction;
    const prefs = this.profile.interactionPreferences;
    const weight = this.config.profileUpdateWeight;
    
    switch (type) {
      case 'click':
        // Update click frequency
        if (data.timeSinceLastClick) {
          const clickRate = 60000 / data.timeSinceLastClick; // clicks per minute
          prefs.clickFrequency = (prefs.clickFrequency * (1 - weight)) + (clickRate * weight);
        }
        break;
        
      case 'scroll':
        // Update scroll speed
        if (data.speed) {
          prefs.scrollSpeed = (prefs.scrollSpeed * (1 - weight)) + (data.speed * weight);
        }
        
        // Update navigation style
        if (data.speedCategory === 'fast' && data.distance > 500) {
          // Fast, long scrolls suggest "explorer" behavior
          const explorerWeight = 0.1;
          if (prefs.navigationStyle === 'undetermined' || prefs.navigationStyle === 'explorer') {
            prefs.navigationStyle = 'explorer';
          } else {
            // Gradually shift towards explorer
            const isGoalOriented = prefs.navigationStyle === 'goal-oriented';
            const isMethodical = prefs.navigationStyle === 'methodical';
            
            if (isGoalOriented) {
              // Goal-oriented users sometimes explore, so this is a weaker signal
              prefs.navigationStyle = Math.random() < explorerWeight ? 'explorer' : 'goal-oriented';
            } else if (isMethodical) {
              // Methodical users rarely make long fast scrolls, so this is a stronger signal
              prefs.navigationStyle = Math.random() < explorerWeight * 2 ? 'explorer' : 'methodical';
            }
          }
        }
        break;
        
      case 'section_visibility_duration':
        // Update attention span
        if (data.duration) {
          prefs.attentionSpan = (prefs.attentionSpan * (1 - weight)) + (data.duration * weight);
        }
        break;
        
      case 'time_metrics':
        // Update engagement level
        if (data.engagementScore !== undefined) {
          prefs.engagementLevel = (prefs.engagementLevel * (1 - weight)) + (data.engagementScore * weight);
        }
        break;
    }
    
    // Infer navigation style if still undetermined
    if (prefs.navigationStyle === 'undetermined' && prefs.clickFrequency > 0 && prefs.scrollSpeed > 0) {
      if (prefs.clickFrequency > 10) {
        prefs.navigationStyle = 'goal-oriented'; // Many clicks = goal-oriented
      } else if (prefs.scrollSpeed < 0.3 && prefs.attentionSpan > 10000) {
        prefs.navigationStyle = 'methodical'; // Slow scrolling + long attention = methodical
      } else if (prefs.scrollSpeed > 1 && prefs.attentionSpan < 5000) {
        prefs.navigationStyle = 'explorer'; // Fast scrolling + short attention = explorer
      }
    }
    
    return this;
  }
  
  /**
   * Update visual preferences based on interaction
   */
  updateVisualPreferences(interaction) {
    // Visual preferences are mostly set by detecting CSS settings or user actions
    const { type, data } = interaction;
    const prefs = this.profile.visualPreferences;
    
    // Check for system preferences
    if (prefs.prefersDarkMode === null) {
      prefs.prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Animation tolerance can be inferred from scroll behavior
    if (type === 'scroll' && data.speedCategory === 'fast') {
      // Fast scrollers might prefer less animation
      prefs.animationTolerance = Math.max(0, prefs.animationTolerance - 0.05);
    }
    
    return this;
  }
  
  /**
   * Update content preferences based on interaction
   */
  updateContentPreferences(interaction) {
    const { type, data } = interaction;
    const prefs = this.profile.contentPreferences;
    
    switch (type) {
      case 'scroll':
        // Reading speed can be inferred from scroll behavior
        if (data.speedCategory === 'fast') {
          // Fast scrolling suggests faster reading or skimming
          if (prefs.readingSpeed === 'normal') {
            prefs.readingSpeed = 'fast';
          }
        } else if (data.speedCategory === 'slow' && data.duration > 5000) {
          // Slow, deliberate scrolling suggests careful reading
          if (prefs.readingSpeed === 'normal') {
            prefs.readingSpeed = 'slow';
          }
        }
        break;
    }
    
    return this;
  }
  
  /**
   * Update section interests based on interaction
   */
  updateSectionInterests(interaction) {
    const { type, data } = interaction;
    const interests = this.profile.sectionInterests;
    const weight = this.config.profileUpdateWeight;
    
    // Only certain interactions inform about section interests
    switch (type) {
      case 'click':
        // Clicks on specific sections indicate interest
        if (data.sectionId) {
          // Initialize if new section
          if (!interests[data.sectionId]) {
            interests[data.sectionId] = 0.5; // Start at neutral
          }
          
          // Increment interest based on interaction
          interests[data.sectionId] = Math.min(1, interests[data.sectionId] + (0.1 * weight));
        }
        break;
        
      case 'section_visibility_duration':
        // Time spent on a section indicates interest
        if (data.id) {
          // Initialize if new section
          if (!interests[data.id]) {
            interests[data.id] = 0.5; // Start at neutral
          }
          
          // Interest level depends on duration
          // Longer than 10 seconds is a strong signal
          const durationWeight = Math.min(1, data.duration / 10000);
          const interestChange = durationWeight * 0.2 * weight;
          
          interests[data.id] = Math.min(1, interests[data.id] + interestChange);
        }
        break;
    }
    
    return this;
  }
  
  /**
   * Update usage patterns based on time metrics
   */
  updateUsagePatterns(interaction) {
    const { type, data } = interaction;
    const patterns = this.profile.usagePatterns;
    
    if (type === 'time_metrics') {
      // Update session duration
      patterns.totalSessionTime = data.sessionDuration;
      
      // Update average session duration
      const sessionCount = Math.max(1, patterns.sessionCount);
      const totalTime = patterns.averageSessionDuration * (sessionCount - 1) + data.sessionDuration;
      patterns.averageSessionDuration = totalTime / sessionCount;
      
      // Update last visit timestamp
      patterns.lastVisitTimestamp = Date.now();
    }
    
    return this;
  }
  
  /**
   * Update accessibility needs based on interactions and settings
   */
  updateAccessibilityNeeds(interaction) {
    const needs = this.profile.accessibilityNeeds;
    
    // Check for system preferences
    needs.requiresReducedMotion = window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check for high contrast preference
    needs.requiresHighContrast = window.matchMedia && 
      window.matchMedia('(prefers-contrast: more)').matches;
    
    // Check for keyboard navigation
    if (interaction.type === 'keydown' && interaction.data.key === 'Tab') {
      needs.requiresKeyboardNavigation = true;
    }
    
    return this;
  }
  
  /**
   * Update confidence levels for profile sections
   */
  updateConfidenceLevels() {
    const confidence = this.profile.confidenceLevels;
    const interactionCount = this.analysisEngine.interactions.length;
    
    // Basic confidence scaling based on number of interactions
    // More interactions = higher confidence, up to a limit
    const baseConfidence = Math.min(0.95, interactionCount / 100);
    
    // Update specific confidences
    confidence.interactionPreferences = baseConfidence;
    
    // Visual preferences confidence depends on specific signals
    confidence.visualPreferences = this.profile.visualPreferences.prefersDarkMode !== null ? 
      baseConfidence : baseConfidence * 0.5;
    
    // Content preferences confidence based on session time
    confidence.contentPreferences = this.profile.usagePatterns.totalSessionTime > 60000 ?
      baseConfidence : baseConfidence * 0.7;
    
    // Section interests confidence based on number of sections with data
    const sectionCount = Object.keys(this.profile.sectionInterests).length;
    confidence.sectionInterests = sectionCount > 0 ?
      Math.min(0.9, baseConfidence * (1 + sectionCount / 10)) : 0.1;
    
    // Accessibility needs confidence is higher if we detect specific needs
    const accessibilitySignals = Object.values(this.profile.accessibilityNeeds).filter(v => v).length;
    confidence.accessibilityNeeds = accessibilitySignals > 0 ?
      Math.max(0.8, baseConfidence) : baseConfidence * 0.5;
    
    return this;
  }
  
  /**
   * Log a message through the analysis engine
   */
  log(message, level = 'info') {
    this.analysisEngine.log(`[UserProfile] ${message}`, level);
    return this;
  }
}

export default UserProfile;
