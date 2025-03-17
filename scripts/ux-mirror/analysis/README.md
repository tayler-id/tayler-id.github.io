# UX Mirror Analysis Engine

The Analysis Engine processes user interaction data to build user profiles and generate insights. It's the "brain" of UX Mirror, converting raw interaction data into actionable UX intelligence.

## Components

### Analysis Engine (`index.js`)

The central coordinator that:
1. Receives interaction events from the Tracker Manager
2. Routes data to the User Profile
3. Periodically triggers insight generation
4. Distributes insights to adaptation and UI components

### User Profile (`profile.js`)

Builds and maintains a comprehensive user behavior profile based on interaction patterns:

- **Interaction Preferences**: Click frequency, scroll speed, navigation style
- **Visual Preferences**: Dark mode preference, animation tolerance
- **Content Preferences**: Reading speed, content density preference
- **Section Interests**: Which sections capture user attention
- **Device Context**: Device type, screen size, input method
- **Usage Patterns**: Session duration, repeat visits
- **Accessibility Needs**: Potential accessibility requirements

### Insights Engine (`insights.js`)

Analyzes the user profile and interaction data to generate actionable insights:

- **Navigation Insights**: How users navigate the site
- **Engagement Insights**: User engagement level with content
- **Accessibility Insights**: Potential accessibility improvements
- **Content Insights**: Content preferences and interests
- **Performance Insights**: User experience of site performance

## How It Works

1. **Data Collection**: The Analysis Engine receives interaction events from trackers
2. **Profile Building**: User interactions incrementally update the user profile
3. **Insight Generation**: Periodically analyzes the profile to generate insights
4. **Distribution**: Insights are distributed to adaptation and UI components

## Configuration

The Analysis Engine can be configured in the main UX Mirror configuration:

```javascript
{
  analysis: {
    enabled: true,               // Enable analysis
    analysisInterval: 5000,      // Analysis interval in milliseconds
    maxInteractionsStored: 1000, // Maximum number of interactions to store
    minInteractionsForAnalysis: 10, // Minimum interactions needed for analysis
    profileUpdateWeight: 0.2,    // Weight for profile updates (0-1)
    confidenceThreshold: 0.3,    // Minimum confidence threshold for insights
  }
}
```

## Insight Structure

Insights follow a standard structure:

```javascript
{
  id: 'insight_123',
  type: 'engagement_level',
  title: 'User shows high engagement',
  description: 'Current engagement level is 75% based on interaction patterns. User is highly engaged. Current approach is working well.',
  confidence: 0.8,
  category: 'engagement',
  severity: 'info',
  timestamp: 1638346800000
}
```

- `id`: Unique identifier
- `type`: Specific insight type
- `title`: Short summary
- `description`: Detailed explanation
- `confidence`: Confidence level (0-1)
- `category`: General insight category
- `severity`: Importance level ('info', 'warning', 'important')
- `timestamp`: When the insight was generated

## Confidence Scoring

The Analysis Engine uses confidence scoring to:

1. Determine the reliability of insights
2. Filter out low-confidence insights
3. Prioritize high-confidence insights
4. Inform adaptation decisions

Confidence scores are calculated based on:
- Amount of data collected
- Consistency of observed patterns
- Time spent on the site
- Strength of behavioral signals

## Extending

To add new analysis capabilities:

### Adding Profile Dimensions

Extend the `UserProfile` class in `profile.js`:

1. Add new properties to the profile object
2. Create update methods for the new dimensions
3. Modify the interaction processing to update these dimensions

### Adding New Insight Types

Extend the `InsightsEngine` class in `insights.js`:

1. Create new insight generation methods
2. Add detection logic for the specific insights
3. Update the main insight generation process to include your new insights

### Using Analysis Data in Custom Components

You can access analysis data from other components:

```javascript
// Get user profile data
const profileData = uxMirror.analysis.userProfile.getData();

// Get current insights
const insights = uxMirror.analysis.insights.insights;

// Register for new insights
uxMirror.on('new_insights', (insights) => {
  // Handle new insights
});
