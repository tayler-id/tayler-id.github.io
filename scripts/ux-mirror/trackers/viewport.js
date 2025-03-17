/**
 * Viewport Tracker
 * Tracks viewport changes and visible content
 */

/**
 * ViewportTracker
 * Tracks viewport size, position, and visible elements
 */
class ViewportTracker {
  constructor(trackerManager) {
    this.trackerManager = trackerManager;
    this.config = trackerManager.config;
    this.initialized = false;
    this.running = false;
    
    // Viewport state
    this.viewportWidth = 0;
    this.viewportHeight = 0;
    this.devicePixelRatio = 1;
    this.orientation = 'landscape';
    this.lastResizeTime = 0;
    this.resizeCount = 0;
    this.visibleSections = new Set();
    this.sectionVisibilityTimers = new Map();
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleOrientationChange = this.handleOrientationChange.bind(this);
    this.trackVisibleSections = this.trackVisibleSections.bind(this);
    this.isElementInViewport = this.isElementInViewport.bind(this);
    this.getSectionVisibility = this.getSectionVisibility.bind(this);
  }
  
  /**
   * Initialize the viewport tracker
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing viewport tracker');
    
    // Set initial viewport dimensions
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.orientation = this.viewportWidth >= this.viewportHeight ? 'landscape' : 'portrait';
    
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Start tracking viewport changes
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting viewport tracker');
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('orientationchange', this.handleOrientationChange, { passive: true });
    
    // Set up section tracking interval
    if (this.config.trackSections) {
      this.sectionTrackingInterval = setInterval(this.trackVisibleSections, 1000);
    }
    
    // Track visible sections initially
    if (this.config.trackSections) {
      this.trackVisibleSections();
    }
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop tracking viewport changes
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping viewport tracker');
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    
    // Clear section tracking interval
    if (this.sectionTrackingInterval) {
      clearInterval(this.sectionTrackingInterval);
      this.sectionTrackingInterval = null;
    }
    
    // Clear section visibility timers
    this.sectionVisibilityTimers.forEach((timer) => {
      clearTimeout(timer.timeoutId);
    });
    this.sectionVisibilityTimers.clear();
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Handle resize event
   */
  handleResize() {
    const now = Date.now();
    
    // Calculate time since last resize
    const timeSinceLastResize = now - this.lastResizeTime;
    
    // Get new viewport dimensions
    const newViewportWidth = window.innerWidth;
    const newViewportHeight = window.innerHeight;
    const newDevicePixelRatio = window.devicePixelRatio || 1;
    
    // Calculate size changes
    const widthChange = newViewportWidth - this.viewportWidth;
    const heightChange = newViewportHeight - this.viewportHeight;
    const pixelRatioChange = newDevicePixelRatio - this.devicePixelRatio;
    
    // Check if orientation changed
    const newOrientation = newViewportWidth >= newViewportHeight ? 'landscape' : 'portrait';
    const orientationChanged = newOrientation !== this.orientation;
    
    // Increment resize count
    this.resizeCount++;
    
    // Create resize data
    const resizeData = {
      width: newViewportWidth,
      height: newViewportHeight,
      devicePixelRatio: newDevicePixelRatio,
      orientation: newOrientation,
      widthChange,
      heightChange,
      pixelRatioChange,
      orientationChanged,
      timestamp: now,
      timeSinceLastResize,
      resizeCount: this.resizeCount,
    };
    
    // Emit viewport resize event
    this.trackerManager.emit('interaction', 'viewport_resize', resizeData);
    
    // Update viewport state
    this.viewportWidth = newViewportWidth;
    this.viewportHeight = newViewportHeight;
    this.devicePixelRatio = newDevicePixelRatio;
    this.orientation = newOrientation;
    this.lastResizeTime = now;
    
    // Track visible sections after resize
    if (this.config.trackSections) {
      this.trackVisibleSections();
    }
    
    return this;
  }
  
  /**
   * Handle orientation change event
   */
  handleOrientationChange() {
    // Orientation change is also handled by resize event,
    // but we emit a specific event for it
    const now = Date.now();
    
    // Check new orientation
    const newOrientation = window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait';
    
    // Only emit if orientation actually changed
    if (newOrientation !== this.orientation) {
      // Create orientation change data
      const orientationData = {
        previousOrientation: this.orientation,
        orientation: newOrientation,
        width: window.innerWidth,
        height: window.innerHeight,
        timestamp: now,
      };
      
      // Emit orientation change event
      this.trackerManager.emit('interaction', 'orientation_change', orientationData);
      
      // Update orientation
      this.orientation = newOrientation;
    }
    
    return this;
  }
  
  /**
   * Track visible sections
   */
  trackVisibleSections() {
    if (!this.config.trackSections) return;
    
    // Get all sections using the configured selector
    const sections = document.querySelectorAll(this.config.sectionSelector);
    
    // Current visible sections
    const currentlyVisibleSections = new Set();
    
    // Check each section
    sections.forEach((section) => {
      // Skip sections without ID
      const sectionId = section.id || 
                       section.getAttribute('data-section') || 
                       section.className.split(' ')[0] ||
                       section.tagName.toLowerCase() + '-' + Math.random().toString(36).substr(2, 5);
      
      // Get section visibility
      const visibility = this.getSectionVisibility(section);
      
      // Skip sections with zero visibility
      if (visibility.visiblePercentage <= 0) return;
      
      // Add to currently visible sections
      currentlyVisibleSections.add(sectionId);
      
      // If section wasn't visible before, it just became visible
      if (!this.visibleSections.has(sectionId)) {
        // Create section visibility data
        const visibilityData = {
          id: sectionId,
          element: section,
          visiblePercentage: visibility.visiblePercentage,
          visibleArea: visibility.visibleArea,
          timestamp: Date.now(),
          viewportWidth: this.viewportWidth,
          viewportHeight: this.viewportHeight,
        };
        
        // Emit section visibility event
        this.trackerManager.emit('interaction', 'section_visibility', {
          ...visibilityData,
          visible: true,
        });
        
        // Start tracking visibility duration
        this.sectionVisibilityTimers.set(sectionId, {
          startTime: Date.now(),
          timeoutId: null,
        });
      }
    });
    
    // Check for sections that are no longer visible
    this.visibleSections.forEach((sectionId) => {
      if (!currentlyVisibleSections.has(sectionId)) {
        // Get section
        const sectionSelector = `#${sectionId}, [data-section="${sectionId}"], .${sectionId}`;
        const section = document.querySelector(sectionSelector);
        
        // Get timer info
        const timerInfo = this.sectionVisibilityTimers.get(sectionId);
        
        // Calculate visibility duration
        const duration = Date.now() - (timerInfo ? timerInfo.startTime : Date.now());
        
        // Create section visibility data
        const visibilityData = {
          id: sectionId,
          element: section,
          visiblePercentage: 0,
          visibleArea: 0,
          timestamp: Date.now(),
          duration,
          viewportWidth: this.viewportWidth,
          viewportHeight: this.viewportHeight,
        };
        
        // Emit section visibility event
        this.trackerManager.emit('interaction', 'section_visibility', {
          ...visibilityData,
          visible: false,
        });
        
        // Emit section visibility duration event
        this.trackerManager.emit('interaction', 'section_visibility_duration', visibilityData);
        
        // Clear section visibility timer
        if (timerInfo && timerInfo.timeoutId) {
          clearTimeout(timerInfo.timeoutId);
        }
        
        // Remove from visibility timers
        this.sectionVisibilityTimers.delete(sectionId);
      }
    });
    
    // Update visible sections
    this.visibleSections = currentlyVisibleSections;
    
    return this;
  }
  
  /**
   * Check if an element is in the viewport
   */
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
      rect.top < this.viewportHeight &&
      rect.bottom > 0 &&
      rect.left < this.viewportWidth &&
      rect.right > 0
    );
  }
  
  /**
   * Get section visibility metrics
   */
  getSectionVisibility(element) {
    const rect = element.getBoundingClientRect();
    
    // Check if element is outside viewport
    if (
      rect.top >= this.viewportHeight ||
      rect.bottom <= 0 ||
      rect.left >= this.viewportWidth ||
      rect.right <= 0
    ) {
      return {
        visiblePercentage: 0,
        visibleArea: 0,
      };
    }
    
    // Calculate visible dimensions
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(this.viewportHeight, rect.bottom);
    const visibleLeft = Math.max(0, rect.left);
    const visibleRight = Math.min(this.viewportWidth, rect.right);
    
    // Calculate visible area
    const visibleWidth = visibleRight - visibleLeft;
    const visibleHeight = visibleBottom - visibleTop;
    const visibleArea = visibleWidth * visibleHeight;
    
    // Calculate total area
    const totalArea = rect.width * rect.height;
    
    // Calculate visible percentage
    const visiblePercentage = (visibleArea / totalArea) * 100;
    
    return {
      visiblePercentage,
      visibleArea,
    };
  }
  
  /**
   * Log a message through the tracker manager
   */
  log(message) {
    this.trackerManager.log(`[ViewportTracker] ${message}`);
    return this;
  }
}

export default ViewportTracker;
