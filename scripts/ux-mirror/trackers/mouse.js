/**
 * Mouse Tracker
 * Tracks mouse movements and generates mouse events
 */

/**
 * MouseTracker
 * Tracks mouse movements on the page
 */
class MouseTracker {
  constructor(trackerManager) {
    this.trackerManager = trackerManager;
    this.config = trackerManager.config;
    this.initialized = false;
    this.running = false;
    
    // Mouse state
    this.lastPosition = { x: 0, y: 0 };
    this.lastMoveTime = 0;
    this.totalDistance = 0;
    this.movementCount = 0;
    this.isMouseDown = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }
  
  /**
   * Initialize the mouse tracker
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing mouse tracker');
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Start tracking mouse movements
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting mouse tracker');
    
    // Add event listeners
    document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    document.addEventListener('mousedown', this.handleMouseDown, { passive: true });
    document.addEventListener('mouseup', this.handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', this.handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', this.handleMouseEnter, { passive: true });
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop tracking mouse movements
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping mouse tracker');
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
    document.removeEventListener('mouseenter', this.handleMouseEnter);
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Handle mouse move event
   */
  handleMouseMove(event) {
    // Check if we should sample this movement
    if (Math.random() > this.config.mouseSampleRate) {
      return;
    }
    
    const { clientX, clientY, target } = event;
    const now = Date.now();
    
    // Calculate time since last move
    const timeSinceLastMove = now - this.lastMoveTime;
    
    // Calculate distance from last position
    const dx = clientX - this.lastPosition.x;
    const dy = clientY - this.lastPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate speed (pixels per millisecond)
    const speed = timeSinceLastMove > 0 ? distance / timeSinceLastMove : 0;
    
    // Update total distance
    this.totalDistance += distance;
    
    // Update movement count
    this.movementCount++;
    
    // Get element info
    const targetElement = {
      tagName: target.tagName,
      id: target.id,
      className: target.className,
      textContent: target.textContent ? target.textContent.substring(0, 20) : '',
    };
    
    // Create mouse move data
    const moveData = {
      x: clientX,
      y: clientY,
      timestamp: now,
      timeSinceLastMove,
      distance,
      speed,
      totalDistance: this.totalDistance,
      movementCount: this.movementCount,
      isMouseDown: this.isMouseDown,
      targetElement,
    };
    
    // Emit mouse move event
    this.trackerManager.emit('interaction', 'mouse_move', moveData);
    
    // Update last position and time
    this.lastPosition = { x: clientX, y: clientY };
    this.lastMoveTime = now;
    
    return this;
  }
  
  /**
   * Handle mouse down event
   */
  handleMouseDown(event) {
    const { clientX, clientY, button, target } = event;
    
    // Update mouse state
    this.isMouseDown = true;
    
    // Get element info
    const targetElement = {
      tagName: target.tagName,
      id: target.id,
      className: target.className,
      textContent: target.textContent ? target.textContent.substring(0, 20) : '',
    };
    
    // Create mouse down data
    const mouseDownData = {
      x: clientX,
      y: clientY,
      button,
      timestamp: Date.now(),
      targetElement,
    };
    
    // Emit mouse down event
    this.trackerManager.emit('interaction', 'mouse_down', mouseDownData);
    
    return this;
  }
  
  /**
   * Handle mouse up event
   */
  handleMouseUp(event) {
    const { clientX, clientY, button, target } = event;
    
    // Update mouse state
    this.isMouseDown = false;
    
    // Get element info
    const targetElement = {
      tagName: target.tagName,
      id: target.id,
      className: target.className,
      textContent: target.textContent ? target.textContent.substring(0, 20) : '',
    };
    
    // Create mouse up data
    const mouseUpData = {
      x: clientX,
      y: clientY,
      button,
      timestamp: Date.now(),
      targetElement,
    };
    
    // Emit mouse up event
    this.trackerManager.emit('interaction', 'mouse_up', mouseUpData);
    
    return this;
  }
  
  /**
   * Handle mouse leave event
   */
  handleMouseLeave(event) {
    const { clientX, clientY } = event;
    
    // Create mouse leave data
    const mouseLeaveData = {
      x: clientX,
      y: clientY,
      timestamp: Date.now(),
    };
    
    // Emit mouse leave event
    this.trackerManager.emit('interaction', 'mouse_leave', mouseLeaveData);
    
    return this;
  }
  
  /**
   * Handle mouse enter event
   */
  handleMouseEnter(event) {
    const { clientX, clientY } = event;
    
    // Create mouse enter data
    const mouseEnterData = {
      x: clientX,
      y: clientY,
      timestamp: Date.now(),
    };
    
    // Emit mouse enter event
    this.trackerManager.emit('interaction', 'mouse_enter', mouseEnterData);
    
    return this;
  }
  
  /**
   * Log a message through the tracker manager
   */
  log(message) {
    this.trackerManager.log(`[MouseTracker] ${message}`);
    return this;
  }
}

export default MouseTracker;
