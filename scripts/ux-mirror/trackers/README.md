# UX Mirror Trackers

The trackers module is responsible for capturing user interactions with the website. Each tracker focuses on a specific type of interaction and generates standardized events that are processed by the Analysis Engine.

## Available Trackers

### Mouse Tracker (`mouse.js`)

Tracks mouse movements across the page.

- **Events**: `mouse_move`, `mouse_down`, `mouse_up`, `mouse_leave`, `mouse_enter`
- **Key Data**: position, speed, distance, target element

### Click Tracker (`click.js`)

Tracks mouse clicks and analyzes click patterns.

- **Events**: `click`
- **Key Data**: position, time since last click, target element, section ID

### Scroll Tracker (`scroll.js`)

Tracks scrolling behavior and scroll patterns.

- **Events**: `scroll`, `scroll_start`, `scroll_end`
- **Key Data**: direction, speed, distance, scroll depth percentage

### Viewport Tracker (`viewport.js`)

Tracks viewport changes and visible content.

- **Events**: `viewport_resize`, `orientation_change`, `section_visibility`, `section_visibility_duration`
- **Key Data**: viewport dimensions, orientation, visible sections

### Time Tracker (`time.js`)

Tracks time-based metrics like session duration and idle time.

- **Events**: `time_metrics`, `user_idle_start`, `user_idle_end`
- **Key Data**: session duration, active time, idle time, engagement score

## Tracker Manager (`index.js`)

The Tracker Manager coordinates all trackers and provides a unified event system. It:

1. Initializes and manages all trackers
2. Provides event emission and subscription methods
3. Handles tracker lifecycle (start/stop)

## Event System

Trackers emit standardized events with the following structure:

```javascript
{
  type: 'event_type',      // e.g. 'click', 'scroll'
  data: {                  // Event-specific data
    timestamp: 1638346800000,
    // Other event properties
  }
}
```

## Configuration

Tracker behavior can be configured in the main UX Mirror configuration:

```javascript
{
  tracking: {
    enabled: true,               // Enable tracking
    trackMouse: true,            // Track mouse movements
    trackClicks: true,           // Track clicks
    trackScroll: true,           // Track scrolling
    trackViewport: true,         // Track viewport changes
    trackTime: true,             // Track time metrics
    clickSampleRate: 1,          // Sample rate for clicks (1 = all clicks)
    mouseSampleRate: 0.1,        // Sample rate for mouse movements (0.1 = 10%)
    scrollSampleRate: 0.5,       // Sample rate for scroll events (0.5 = 50%)
    idleThreshold: 5000,         // Idle threshold in milliseconds
    trackSections: true,         // Track section visibility
    sectionSelector: 'section, .section, [data-section]'  // CSS selector for sections
  }
}
```

## Extending

To create a new tracker:

1. Create a new tracker class following the tracker interface pattern
2. Add it to the Tracker Manager in `index.js`
3. Update the configuration to include settings for your new tracker

### Tracker Interface

All trackers should implement:

- `init()`: Initialize tracker resources
- `start()`: Start tracking
- `stop()`: Stop tracking
- Event handlers for specific DOM events

Example:

```javascript
class MyTracker {
  constructor(trackerManager) {
    this.trackerManager = trackerManager;
    this.config = trackerManager.config;
    this.initialized = false;
    this.running = false;
  }
  
  init() {
    if (this.initialized) return;
    this.initialized = true;
    return this;
  }
  
  start() {
    if (!this.initialized) this.init();
    if (this.running) return;
    
    // Add event listeners
    document.addEventListener('someevent', this.handleEvent);
    
    this.running = true;
    return this;
  }
  
  stop() {
    if (!this.running) return;
    
    // Remove event listeners
    document.removeEventListener('someevent', this.handleEvent);
    
    this.running = false;
    return this;
  }
  
  handleEvent(event) {
    // Process event
    const data = { timestamp: Date.now(), /* other data */ };
    this.trackerManager.emit('interaction', 'my_event', data);
  }
}
