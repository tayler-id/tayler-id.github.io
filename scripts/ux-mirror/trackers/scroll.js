/**
 * Scroll Tracker
 * Tracks scrolling behavior and generates scroll events
 */

/**
 * ScrollTracker
 * Tracks scroll events on the page and analyzes scroll patterns
 */
class ScrollTracker {
  constructor(trackerManager) {
    this.trackerManager = trackerManager;
    this.config = trackerManager.config;
    this.initialized = false;
    this.running = false;
    
    // Scroll state
    this.lastScrollTop = 0;
    this.lastScrollLeft = 0;
    this.lastScrollTime = 0;
    this.scrollDirection = 'none'; // 'up', 'down', 'left', 'right', 'none'
    this.totalScrollDistance = 0;
    this.scrollPaused = true;
    this.scrollPauseTimer = null;
    this.scrollPauseDuration = 0;
    this.maxScrollDepth = 0;
    this.scrollCount = 0;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollStart = this.handleScrollStart.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
    this.calculateScrollDepthPercentage = this.calculateScrollDepthPercentage.bind(this);
  }
  
  /**
   * Initialize the scroll tracker
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing scroll tracker');
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Start tracking scrolls
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting scroll tracker');
    
    // Initialize scroll position
    this.lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    this.lastScrollLeft = window.scrollX || document.documentElement.scrollLeft;
    
    // Add event listeners
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop tracking scrolls
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping scroll tracker');
    
    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    
    // Clear scroll pause timer
    if (this.scrollPauseTimer) {
      clearTimeout(this.scrollPauseTimer);
      this.scrollPauseTimer = null;
    }
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Handle scroll event
   */
  handleScroll(event) {
    // Check if we should sample this scroll
    if (Math.random() > this.config.scrollSampleRate) {
      return;
    }
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const now = Date.now();
    
    // If scroll was paused, this is a scroll start
    if (this.scrollPaused) {
      this.handleScrollStart(scrollTop, scrollLeft, now);
    }
    
    // Calculate scroll distance (in pixels)
    const deltaY = scrollTop - this.lastScrollTop;
    const deltaX = scrollLeft - this.lastScrollLeft;
    const distance = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
    
    // Update total scroll distance
    this.totalScrollDistance += distance;
    
    // Calculate time since last scroll
    const timeSinceLastScroll = now - this.lastScrollTime;
    
    // Calculate scroll speed (pixels per millisecond)
    const speed = timeSinceLastScroll > 0 ? distance / timeSinceLastScroll : 0;
    
    // Determine scroll direction
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical scrolling
      this.scrollDirection = deltaY > 0 ? 'down' : 'up';
    } else if (Math.abs(deltaX) > 0) {
      // Horizontal scrolling
      this.scrollDirection = deltaX > 0 ? 'right' : 'left';
    }
    
    // Calculate scroll depth
    const scrollDepth = this.calculateScrollDepthPercentage();
    
    // Update max scroll depth
    if (scrollDepth > this.maxScrollDepth) {
      this.maxScrollDepth = scrollDepth;
    }
    
    // Increment scroll count
    this.scrollCount++;
    
    // Determine speed category
    let speedCategory = 'normal';
    if (speed > 2) {
      speedCategory = 'fast';
    } else if (speed < 0.5) {
      speedCategory = 'slow';
    }
    
    // Create scroll data
    const scrollData = {
      scrollTop,
      scrollLeft,
      deltaY,
      deltaX,
      timestamp: now,
      timeSinceLastScroll,
      distance,
      speed,
      speedCategory,
      direction: this.scrollDirection,
      totalDistance: this.totalScrollDistance,
      scrollCount: this.scrollCount,
      scrollDepth,
      maxScrollDepth: this.maxScrollDepth,
    };
    
    // Emit scroll event
    this.trackerManager.emit('interaction', 'scroll', scrollData);
    
    // Reset scroll pause timer
    if (this.scrollPauseTimer) {
      clearTimeout(this.scrollPauseTimer);
    }
    this.scrollPauseTimer = setTimeout(() => {
      this.handleScrollEnd(scrollTop, scrollLeft, now);
    }, 200);
    
    // Update last scroll position and time
    this.lastScrollTop = scrollTop;
    this.lastScrollLeft = scrollLeft;
    this.lastScrollTime = now;
    this.scrollPaused = false;
    
    return this;
  }
  
  /**
   * Handle scroll start event
   */
  handleScrollStart(scrollTop, scrollLeft, timestamp) {
    this.log('Scroll started');
    
    // Create scroll start data
    const scrollStartData = {
      scrollTop,
      scrollLeft,
      timestamp,
      pauseDuration: this.scrollPauseDuration,
    };
    
    // Emit scroll start event
    this.trackerManager.emit('interaction', 'scroll_start', scrollStartData);
    
    return this;
  }
  
  /**
   * Handle scroll end event
   */
  handleScrollEnd(scrollTop, scrollLeft, timestamp) {
    this.log('Scroll ended');
    
    // Create scroll end data
    const scrollEndData = {
      scrollTop,
      scrollLeft,
      timestamp,
      scrollDepth: this.calculateScrollDepthPercentage(),
      maxScrollDepth: this.maxScrollDepth,
    };
    
    // Emit scroll end event
    this.trackerManager.emit('interaction', 'scroll_end', scrollEndData);
    
    // Update scroll state
    this.scrollPaused = true;
    this.scrollPauseDuration = 0;
    
    // Clear scroll pause timer
    this.scrollPauseTimer = null;
    
    return this;
  }
  
  /**
   * Calculate scroll depth as percentage
   */
  calculateScrollDepthPercentage() {
    // Get document height
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    // Get viewport height
    const viewportHeight = window.innerHeight;
    
    // Get current scroll position
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Calculate maximum scrollable distance
    const maxScroll = documentHeight - viewportHeight;
    
    // Calculate scroll depth percentage
    const scrollDepth = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    
    return Math.min(100, Math.max(0, scrollDepth));
  }
  
  /**
   * Log a message through the tracker manager
   */
  log(message) {
    this.trackerManager.log(`[ScrollTracker] ${message}`);
    return this;
  }
}

export default ScrollTracker;
