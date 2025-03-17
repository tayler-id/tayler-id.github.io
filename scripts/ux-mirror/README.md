#
 UX Mirror

UX Mirror is a comprehensive user experience analytics and adaptation system that helps improve website usability by tracking user interactions, analyzing behavior patterns, and providing real-time insights and adaptations.

## Features

- **Interaction Tracking**: Capture mouse movements, clicks, scrolling behavior, viewport changes, and time-based metrics
- **User Profiling**: Build user behavior profiles based on interaction patterns
- **Behavioral Insights**: Generate actionable insights about user engagement and preferences
- **Adaptive UI**: Automatically adapt colors, animations, and content based on user behavior
- **Visualization**: View user interaction heatmaps, statistics, and recommendations
- **Privacy-Focused**: Respects Do Not Track settings and allows configurable data collection policies

## Getting Started

### Installation

1. Add the UX Mirror loader script to your HTML:

```html
<script src="scripts/ux-mirror-loader.js"></script>
<link rel="stylesheet" href="styles/ux-mirror.css">
```

2. Configure UX Mirror (optional):

```html
<script>
  window.addEventListener('load', () => {
    if (window.UXMirrorLoader) {
      window.UXMirrorLoader.config.autoLoad = true;
      window.UXMirrorLoader.config.debug = true;
    }
  });
</script>
```

### Basic Usage

UX Mirror will automatically start tracking user interactions when the page loads. The UX Mirror panel will appear after a configurable number of interactions or can be manually toggled.

## Configuration

UX Mirror can be configured by modifying the `config.js` file or by passing a configuration object when initializing:

```javascript
import UXMirror from './scripts/ux-mirror/index.js';

const uxMirror = new UXMirror({
  debug: {
    enabled: true,
    logLevel: 'info'
  },
  tracking: {
    trackMouse: true,
    trackClicks: true,
    trackScroll: true
  },
  ui: {
    panelPosition: 'bottom-right',
    initiallyCollapsed: true
  }
});

uxMirror.start();
```

See the [Configuration Guide](./CONFIG.md) for all available options.

## Architecture

UX Mirror consists of several modular components:

- **Trackers**: Capture user interactions
- **Analysis Engine**: Processes interaction data to generate insights
- **Adaptation Engine**: Dynamically adapts the UI based on user behavior
- **UI Manager**: Provides visualization and controls

```
UX Mirror
├── Trackers
│   ├── Mouse Tracker
│   ├── Click Tracker
│   ├── Scroll Tracker
│   ├── Viewport Tracker
│   └── Time Tracker
├── Analysis Engine
│   ├── User Profile
│   └── Insights Engine
├── Adaptation Engine
│   ├── Color Adapter
│   ├── Animation Adapter
│   └── Content Adapter
└── UI Manager
    ├── Panel
    ├── Visualizations
    └── Recommendations
```

## Documentation

- [Trackers](./trackers/README.md)
- [Analysis Engine](./analysis/README.md)
- [Adaptation Engine](./adaptations/README.md)
- [UI Components](./ui/README.md)

## Privacy Considerations

UX Mirror is designed with privacy in mind:

- All data is processed locally in the browser
- No data is sent to external servers by default
- Respects the Do Not Track browser setting
- Can be configured to anonymize data

## Browser Support

UX Mirror supports modern browsers:

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT License
