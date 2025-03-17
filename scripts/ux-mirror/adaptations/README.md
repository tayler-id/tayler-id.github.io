# UX Mirror Adaptation Engine

The Adaptation Engine dynamically modifies the user interface based on user behavior and insights from the Analysis Engine. It provides a responsive experience that adapts to individual user preferences and needs.

## Components

### Adaptation Engine (`index.js`)

The central coordinator that:
1. Receives insights from the Analysis Engine
2. Routes insights to appropriate adapters
3. Manages active adaptations
4. Provides an API for applying and removing adaptations

### Color Adapter (`color.js`)

Adapts color schemes based on user preferences and accessibility needs:

- **Color Scheme**: Switches between light and dark modes
- **Contrast Level**: Adjusts contrast for better readability
- **System Preferences**: Respects system dark mode and contrast settings

### Animation Adapter (`animation.js`)

Adjusts animation behavior based on user preferences:

- **Animation Speed**: Modifies animation duration (slow, normal, fast, none)
- **Animation Complexity**: Adjusts animation complexity (minimal, normal, complex)
- **Reduced Motion**: Respects reduced motion preferences

### Content Adapter (`content.js`)

Adapts content presentation based on user behavior:

- **Content Density**: Adjusts spacing and information density
- **Reading Level**: Shows different detail levels based on reading patterns
- **Section Emphasis**: Highlights sections of interest to the user

## How It Works

1. **Insight Processing**: The Adaptation Engine receives insights from the Analysis Engine
2. **Adaptation Decision**: Based on insights, decides which adaptations to apply
3. **UI Modification**: Applies adaptations to the UI through CSS variables or DOM manipulation
4. **User Feedback**: Monitors user interaction with adaptations to refine future decisions

## Configuration

The Adaptation Engine can be configured in the main UX Mirror configuration:

```javascript
{
  adaptation: {
    enabled: true,               // Enable adaptation
    adaptColors: true,           // Adapt color scheme
    adaptAnimations: true,       // Adapt animation behavior
    adaptContent: true,          // Adapt content presentation
    adaptNavigation: false,      // Adapt navigation (not implemented)
    minConfidenceForAdaptation: 0.5, // Minimum confidence for adaptation
    adaptationCooldown: 10000,   // Cooldown between adaptations in milliseconds
  }
}
```

## Adaptation Workflow

The adaptation process follows these steps:

1. **Insight Received**: Analysis Engine generates an insight with sufficient confidence
2. **Insight Routing**: Insight is routed to appropriate adapter(s) based on category
3. **Adaptation Decision**: Adapter decides whether to apply an adaptation
4. **Application**: Adaptation is applied to the UI
5. **Tracking**: Adaptation is recorded in the active adaptations list
6. **Reversal** (if needed): Adaptation can be reverted based on new insights

## CSS Variables

Adaptations primarily work through CSS variables that control design elements:

### Color Variables

```css
--bg-primary: #ffffff;
--bg-secondary: #f5f7fa;
--text-primary: #333333;
--text-secondary: #6c757d;
--accent-primary: #3498db;
--accent-secondary: #2ecc71;
--border-color: #dee2e6;
```

### Animation Variables

```css
--animation-speed-factor: 1;
--transition-duration: 0.3s;
--animation-duration-short: 300ms;
--animation-duration-medium: 500ms;
--animation-duration-long: 1000ms;
--animation-transform-distance: 10px;
--animation-transform-rotation: 5deg;
--animation-transform-scale: 1.05;
```

### Content Variables

Content adaptations primarily use CSS classes to control layout and visibility.

## Extending

To add new adaptation capabilities:

### Creating a New Adapter

1. Create a new adapter class following the adapter pattern:

```javascript
class MyAdapter {
  constructor(adaptationEngine) {
    this.adaptationEngine = adaptationEngine;
    this.config = adaptationEngine.config;
    this.initialized = false;
    this.running = false;
    this.activeAdaptations = new Map();
  }
  
  init() {
    if (this.initialized) return;
    this.initialized = true;
    return this;
  }
  
  start() {
    if (!this.initialized) this.init();
    if (this.running) return;
    this.running = true;
    return this;
  }
  
  stop() {
    if (!this.running) return;
    this.running = false;
    return this;
  }
  
  processInsight(insight) {
    // Process insight and decide on adaptations
    if (insight.type === 'relevant_insight_type') {
      this.applyMyAdaptation(someParameter);
    }
    return this;
  }
  
  applyMyAdaptation(parameter) {
    // Apply adaptation to UI
    // Record adaptation
    const adaptationId = this.adaptationEngine.applyAdaptation('my_adaptation', {
      parameter
    });
    
    // Store adaptation ID
    this.activeAdaptations.set('my_adaptation_key', adaptationId);
    
    return true;
  }
}
```

2. Add your adapter to the Adaptation Engine in `index.js`
3. Update the configuration to include settings for your new adapter

### Integration with CSS

For CSS-based adaptations, create a stylesheet or add CSS variables that your adapter can modify dynamically.

### Testing Adaptations

To test adaptations, you can manually trigger insights:

```javascript
// Create a test insight
const testInsight = {
  id: 'test_insight',
  type: 'your_insight_type',
  title: 'Test Insight',
  description: 'This is a test insight',
  confidence: 0.9,
  category: 'your_category',
  severity: 'info',
  timestamp: Date.now()
};

// Process the insight
uxMirror.adaptation.processInsights([testInsight]);
