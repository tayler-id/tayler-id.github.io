# UX Mirror UI Components

The UI module provides a visual interface for UX Mirror, allowing users to see analytics data, insights, and control the system. It presents the data gathered by trackers and processed by the Analysis Engine in an accessible way.

## Components

### UI Manager (`index.js`)

The central coordinator that:
1. Manages the UI panel lifecycle
2. Coordinates UI components
3. Handles user interactions with the UI
4. Provides an API for showing/hiding the panel

### Panel (`panel.js`)

Creates and manages the main UI panel:

- **UI Panel**: The floating panel with tabs, controls, and content
- **Toggle Button**: Show/hide button for the UI
- **Tab System**: Navigation between different views
- **Panel Controls**: Collapse, expand, and close controls

### Visualizations (`visualizations.js`)

Displays visual representations of user behavior:

- **Heatmap**: Shows where users click and interact
- **Minimap**: Displays viewport position relative to the page
- **Statistics**: Shows engagement metrics and interaction data

### Recommendations (`recommendations.js`)

Presents insights and recommendations:

- **Insights Cards**: Shows insights from the Analysis Engine
- **Prioritization**: Organizes insights by importance and relevance
- **Filtering**: Allows filtering insights by category

## How It Works

1. **UI Creation**: The UI Manager creates the panel and components
2. **Data Binding**: UI components connect to data sources (Analysis Engine)
3. **Visualization**: Components render data visually
4. **User Interaction**: Panel handles user interactions with the UI
5. **Updates**: UI updates periodically to show new data

## Configuration

The UI can be configured in the main UX Mirror configuration:

```javascript
{
  ui: {
    enabled: true,               // Enable UI
    panelPosition: 'bottom-right', // Panel position: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    initiallyCollapsed: true,    // Initially collapsed
    updateInterval: 2000,        // UI update interval in milliseconds
    showAfterInteractions: 20,   // Show UI after this many interactions
    enableVisualizations: true,  // Enable visualizations
    enableRecommendations: true, // Enable recommendations
    maxRecommendations: 5,       // Maximum number of recommendations to show
    uiScale: 1,                  // UI scale factor
  }
}
```

## Panel Structure

The panel uses a modular structure with tabs:

```
+---------------------------------------+
| UX Mirror             ⌄ ×             |
+---------------------------------------+
| [Insights] [Visualizations] [Adapt.]  |
+---------------------------------------+
|                                       |
|  Tab Content Area                     |
|                                       |
|                                       |
|                                       |
+---------------------------------------+
```

### Insights Tab

Shows recommendations and insights from the Analysis Engine, prioritized by importance.

### Visualizations Tab

Displays visual representations of user behavior:
- Interaction heatmap
- Page minimap
- Interaction statistics

### Adaptations Tab

Shows active adaptations applied to the UI.

## CSS Classes

The UI uses a BEM-like naming convention for CSS classes:

- `ux-mirror-panel`: Main panel container
- `ux-mirror-header`: Panel header
- `ux-mirror-tabs`: Tab navigation
- `ux-mirror-tab`: Individual tab
- `ux-mirror-content`: Content area
- `ux-mirror-visualization`: Visualization container
- `ux-mirror-recommendation`: Recommendation card
- `ux-mirror-toggle-btn`: Toggle button

## Extending

To add new UI components:

### Adding a New Tab

1. Modify the `createContentElement` method in `panel.js`:

```javascript
// Create new tab button
const myTab = document.createElement('button');
myTab.className = 'ux-mirror-tab';
myTab.dataset.tab = 'my-tab';
myTab.textContent = 'My Tab';
this.tabsElement.appendChild(myTab);

// Create new tab panel
const myPanel = document.createElement('div');
myPanel.className = 'ux-mirror-tab-panel';
myPanel.dataset.tabPanel = 'my-tab';
myPanel.innerHTML = `
  <div class="ux-mirror-card">
    <h4>My Custom Content</h4>
    <p>This is my custom tab content.</p>
  </div>
`;
this.tabPanelsElement.appendChild(myPanel);
```

2. Update the CSS to style your new tab content

### Creating a New Visualization

To create a new visualization, extend the `Visualizations` class:

1. Add a new creation method:

```javascript
createMyVisualization() {
  // Create container
  const container = document.createElement('div');
  container.className = 'ux-mirror-card';
  
  // Create title
  const title = document.createElement('h4');
  title.textContent = 'My Visualization';
  container.appendChild(title);
  
  // Create visualization element
  this.myVisualizationElement = document.createElement('div');
  this.myVisualizationElement.className = 'ux-mirror-visualization';
  container.appendChild(this.myVisualizationElement);
  
  // Add to parent container
  this.container.appendChild(container);
  
  return this.myVisualizationElement;
}
```

2. Add an update method:

```javascript
updateMyVisualization() {
  if (!this.myVisualizationElement) return;
  
  // Get user profile
  const profile = this.uiManager.getUserProfile();
  
  // Update visualization based on profile data
  // ...
  
  return this;
}
```

3. Call your methods from the main methods:

```javascript
create(container) {
  // ...
  this.createMyVisualization();
  // ...
}

update() {
  // ...
  this.updateMyVisualization();
  // ...
}
```

### Accessing UI Components from Outside

You can access the UI components from other code:

```javascript
// Show/hide the UI panel
uxMirror.ui.toggleVisibility(true);

// Add a custom recommendation
const recommendation = {
  title: 'Custom Recommendation',
  description: 'This is a custom recommendation',
  confidence: 0.9,
  category: 'custom',
  severity: 'info'
};
uxMirror.ui.recommendations.renderInsight(recommendation);
