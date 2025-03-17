/**
 * Time Tracker
 * Tracks time metrics such as session duration and idle time
 */

/**
 * TimeTracker
 * Tracks time-based metrics for user engagement
 */
class TimeTracker {
  constructor(trackerManager) {
    this.trackerManager = trackerManager;
    this.config = trackerManager.config;
    this.initialized = false;
    this.running = false;
    
    // Time state
    this.sessionStartTime = 0;
    this.lastActiveTime = 0;
    this.idleStartTime = 0;
    this.isIdle = false;
    this.totalIdleTime = 0;
    this.idleCount = 0;
    this.activeTimeInterval = null;
    this.idleCheckInterval = null;
    this.sessionDuration = 0;
    this.activeTime = 0;
    this.engagementScore = 0;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.resetIdleTimer = this.resetIdleTimer.bind(this);
    this.checkIdleStatus = this.checkIdleStatus.bind(this);
    this.updateActiveTime = this.updateActiveTime.bind(this);
    this.handleUserActivity = this.handleUserActivity.bind(this);
    this.calculateEngagementScore = this.calculateEngagementScore.bind(this);
  }
  
  /**
   * Initialize the time tracker
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing time tracker');
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Start tracking time metrics
   */
  start() {
    if (!this.initialized) {
      this.init();
    }
    
    if (this.running) return;
    
    this.log('Starting time tracker');
    
    // Set session start time
    this.sessionStartTime = Date.now();
    this.lastActiveTime = this.sessionStartTime;
    
    // Add event listeners for user activity
    const activityEvents = [
      'mousemove', 'mousedown', 'keydown', 
      'touchstart', 'scroll', 'click'
    ];
    
    activityEvents.forEach(eventType => {
      document.addEventListener(eventType, this.handleUserActivity, { passive: true });
    });
    
    // Set up idle check interval
    this.idleCheckInterval = setInterval(
      this.checkIdleStatus, 
      Math.min(1000, this.config.idleThreshold / 2)
    );
    
    // Set up active time update interval
    this.activeTimeInterval = setInterval(this.updateActiveTime, 5000);
    
    this.running = true;
    
    return this;
  }
  
  /**
   * Stop tracking time metrics
   */
  stop() {
    if (!this.running) return;
    
    this.log('Stopping time tracker');
    
    // Remove event listeners
    const activityEvents = [
      'mousemove', 'mousedown', 'keydown', 
      'touchstart', 'scroll', 'click'
    ];
    
    activityEvents.forEach(eventType => {
      document.removeEventListener(eventType, this.handleUserActivity);
    });
    
    // Clear intervals
    if (this.idleCheckInterval) {
      clearInterval(this.idleCheckInterval);
      this.idleCheckInterval = null;
    }
    
    if (this.activeTimeInterval) {
      clearInterval(this.activeTimeInterval);
      this.activeTimeInterval = null;
    }
    
    // Update one last time
    this.updateActiveTime();
    
    this.running = false;
    
    return this;
  }
  
  /**
   * Handle any user activity
   */
  handleUserActivity() {
    if (!this.running) return;
    
    // Avoid duplicate calls by throttling
    const now = Date.now();
    if (now - this.lastActiveTime < 100) return;
    
    // Reset idle timer
    this.resetIdleTimer();
    
    // Calculate session duration
    this.sessionDuration = now - this.sessionStartTime;
    
    // Active again if idle
    if (this.isIdle) {
      const idleDuration = now - this.idleStartTime;
      
      // Add to total idle time
      this.totalIdleTime += idleDuration;
      
      // Create user idle end data
      const idleEndData = {
        timestamp: now,
        duration: idleDuration,
        idleCount: this.idleCount,
        totalIdleTime: this.totalIdleTime,
      };
      
      // Emit idle end event
      this.trackerManager.emit('interaction', 'user_idle_end', idleEndData);
      
      this.isIdle = false;
    }
    
    return this;
  }
  
  /**
   * Reset idle timer
   */
  resetIdleTimer() {
    this.lastActiveTime = Date.now();
    
    return this;
  }
  
  /**
   * Check idle status
   */
  checkIdleStatus() {
    if (!this.running) return;
    
    const now = Date.now();
    const idleTime = now - this.lastActiveTime;
    
    // Check if user became idle
    if (!this.isIdle && idleTime >= this.config.idleThreshold) {
      this.isIdle = true;
      this.idleStartTime = this.lastActiveTime;
      this.idleCount++;
      
      // Create user idle start data
      const idleStartData = {
        timestamp: now,
        idleCount: this.idleCount,
        lastActiveTime: this.lastActiveTime,
      };
      
      // Emit idle start event
      this.trackerManager.emit('interaction', 'user_idle_start', idleStartData);
    }
    
    return this;
  }
  
  /**
   * Update active time metrics
   */
  updateActiveTime() {
    if (!this.running) return;
    
    const now = Date.now();
    
    // Calculate session duration
    this.sessionDuration = now - this.sessionStartTime;
    
    // Calculate active time (session duration minus idle time)
    const currentIdleTime = this.isIdle ? (now - this.idleStartTime) : 0;
    this.activeTime = this.sessionDuration - (this.totalIdleTime + currentIdleTime);
    
    // Calculate engagement score
    this.engagementScore = this.calculateEngagementScore();
    
    // Create time metrics data
    const timeMetricsData = {
      timestamp: now,
      sessionDuration: this.sessionDuration,
      activeTime: this.activeTime,
      idleTime: this.totalIdleTime + currentIdleTime,
      idleCount: this.idleCount,
      isIdle: this.isIdle,
      engagementScore: this.engagementScore,
    };
    
    // Emit time metrics event
    this.trackerManager.emit('interaction', 'time_metrics', timeMetricsData);
    
    return this;
  }
  
  /**
   * Calculate engagement score (0-1)
   */
  calculateEngagementScore() {
    // Simple engagement score calculation
    // Ratio of active time to session duration, with some arbitrary thresholds
    
    if (this.sessionDuration === 0) return 0;
    
    // Calculate raw engagement score
    const rawScore = this.activeTime / this.sessionDuration;
    
    // Adjust for session duration
    let durationFactor = 1;
    
    // Session less than 10s is less reliable
    if (this.sessionDuration < 10000) {
      durationFactor = 0.5;
    }
    // Session 10s-60s is somewhat reliable
    else if (this.sessionDuration < 60000) {
      durationFactor = 0.8;
    }
    
    // Adjust for idle count
    let idleCountFactor = 1;
    if (this.idleCount > 10) {
      idleCountFactor = 0.8;
    }
    
    return Math.min(1, Math.max(0, rawScore * durationFactor * idleCountFactor));
  }
  
  /**
   * Log a message through the tracker manager
   */
  log(message) {
    this.trackerManager.log(`[TimeTracker] ${message}`);
    return this;
  }
}

export default TimeTracker;
