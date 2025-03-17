/**
 * Click Tracker
 * Tracks user clicks and generates click events
 */

/**
 * ClickTracker
 * Tracks clicks on the page and analyzes click patterns
 */
class ClickTracker {
  constructor(trackerManager) {
    this.trackerManager = trackerManager;
    this.config = trackerManager.config;
    this.initialized = false;
    this.running = false;
    
    // Click state
    this.clickCount = 0;
    this.lastClickTime = 0;
    this.lastClickPosition = { x: 0, y: 0 };
    this.clickPositions = [];
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getSectionId = this.getSectionId.bind(this);
  }
  
  /**
   * Initialize the click tracker
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing click tracker');
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Start tracking clicks
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting click tracker');
    
    // Add event listeners
    document.addEventListener('click', this.handleClick, { passive: true });
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop tracking clicks
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping click tracker');
    
    // Remove event listeners
    document.removeEventListener('click', this.handleClick);
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Handle click event
   */
  handleClick(event) {
    // Check if we should sample this click
    if (Math.random() > this.config.clickSampleRate) {
      return;
    }
    
    const { clientX, clientY, target, button } = event;
    const now = Date.now();
    
    // Calculate time since last click
    const timeSinceLastClick = now - this.lastClickTime;
    
    // Calculate distance from last click
    const dx = clientX - this.lastClickPosition.x;
    const dy = clientY - this.lastClickPosition.y;
    const distanceFromLastClick = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate click rate (clicks per minute)
    const clickRate = timeSinceLastClick > 0 ? 
                     (60000 / timeSinceLastClick) : 0;
    
    // Increment click count
    this.clickCount++;
    
    // Store click position
    this.clickPositions.push({ x: clientX, y: clientY, timestamp: now });
    
    // Limit stored positions
    if (this.clickPositions.length > 100) {
      this.clickPositions.shift();
    }
    
    // Get target element info
    const targetElement = {
      tagName: target.tagName,
      id: target.id,
      className: target.className,
      href: target.href || '',
      value: target.value || '',
      type: target.type || '',
      textContent: target.textContent ? target.textContent.substring(0, 50) : '',
    };
    
    // Get section ID if tracking sections
    const sectionId = this.config.trackSections ? this.getSectionId(target) : null;
    
    // Create click data
    const clickData = {
      x: clientX,
      y: clientY,
      button,
      timestamp: now,
      timeSinceLastClick,
      distanceFromLastClick,
      clickRate,
      clickCount: this.clickCount,
      targetElement,
      sectionId,
    };
    
    // Emit click event
    this.trackerManager.emit('interaction', 'click', clickData);
    
    // Update last click position and time
    this.lastClickPosition = { x: clientX, y: clientY };
    this.lastClickTime = now;
    
    return this;
  }
  
  /**
   * Get section ID from an element or its ancestors
   */
  getSectionId(element) {
    // Maximum depth to traverse up the DOM tree
    const maxDepth = 10;
    let currentElement = element;
    let depth = 0;
    
    while (currentElement && depth < maxDepth) {
      // Check if element is a section or has a section ID
      if (currentElement.tagName === 'SECTION' || 
          currentElement.classList.contains('section') ||
          currentElement.hasAttribute('data-section')) {
        // Return ID, data-section, or class as identifier
        return currentElement.id || 
               currentElement.getAttribute('data-section') || 
               currentElement.className.split(' ')[0];
      }
      
      // Check if element matches section selector
      if (this.isSection(currentElement)) {
        return currentElement.id || 
               currentElement.getAttribute('data-section') || 
               currentElement.className.split(' ')[0] ||
               currentElement.tagName.toLowerCase();
      }
      
      // Move up the DOM tree
      currentElement = currentElement.parentElement;
      depth++;
    }
    
    return null;
  }
  
  /**
   * Check if element matches section selector
   */
  isSection(element) {
    try {
      // Use querySelector to check if element matches section selector
      const temp = document.createElement('div');
      temp.appendChild(element.cloneNode(false));
      return temp.querySelector(this.config.sectionSelector) !== null;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Log a message through the tracker manager
   */
  log(message) {
    this.trackerManager.log(`[ClickTracker] ${message}`);
    return this;
  }
}

export default ClickTracker;
