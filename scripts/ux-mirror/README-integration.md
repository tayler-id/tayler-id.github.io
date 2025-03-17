# UX Mirror Integration Guide

This document explains how the UX Mirror analytics and adaptation system is integrated into the portfolio website.

## Overview

UX Mirror is featured on the portfolio site both as:
1. A showcase project (displaying your work on the tool)
2. An active component providing real-time analytics

## Integration Components

### 1. Script Loader
The `ux-mirror-loader.js` script is the entry point that dynamically loads all other UX Mirror components. It's included in the main HTML file:

```html
<script src="../scripts/ux-mirror-loader.js"></script>
```

### 2. Styling
UX Mirror styles are imported separately from the main site styles:

```html
<link rel="stylesheet" href="../styles/ux-mirror.css">
```

### 3. Demo Integration
The UX Mirror demo section includes:
- Feature explanations (tracking, profiling, insights, adaptations)
- Interactive demo area with a button to show the UX Mirror panel
- Integrated tracking to demonstrate the tool's capabilities

### 4. Initialization
UX Mirror is initialized in the main HTML file with configuration parameters:

```javascript
window.addEventListener('load', () => {
    if (window.UXMirrorLoader) {
        window.UXMirrorLoader.config.autoLoad = false;
        window.UXMirrorLoader.config.debug = true;
        window.UXMirrorLoader.init();
    }
    
    // Show panel button handler
    const showPanelBtn = document.getElementById('show-panel-btn');
    if (showPanelBtn) {
        showPanelBtn.addEventListener('click', () => {
            if (window.UXMirror && window.UXMirror.ui) {
                window.UXMirror.ui.toggleVisibility(true);
            }
        });
    }
});
```

## Loading Sequence

1. The HTML page loads and includes the UX Mirror loader script
2. The loader initializes and loads all required dependencies
3. UX Mirror begins tracking user interactions but remains hidden
4. When the user clicks "Show UX Mirror Panel", the interface appears
5. The panel displays insights based on the user's behavior

## Development Notes

- When testing locally using file:// protocol, CORS restrictions will prevent some scripts from loading properly
- When deployed to a web server, these restrictions won't apply
- For local development, use a local development server (like Live Server for VS Code)

## Troubleshooting

If the UX Mirror panel doesn't appear:
1. Check browser console for CORS errors
2. Ensure all UX Mirror scripts are accessible
3. Try running the site through a local server instead of directly opening the HTML file
4. Verify that the UXMirror object is initialized in the console

## Future Enhancements

- Implement persistence for user profiles
- Add ability to save and compare different user sessions
- Integrate with backend analytics for aggregated insights
