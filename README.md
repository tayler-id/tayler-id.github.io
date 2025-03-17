# Tayler.id Portfolio Website

A professional portfolio website for a Senior UX Designer & Frontend Developer built with vanilla HTML, CSS, and JavaScript.

## Overview

This portfolio website showcases professional work, skills, and case studies using a modern, minimalist design approach with a black, coral, and teal color scheme. The site features responsive layouts, interactive elements, and the UX Mirror analytics tool integration.

## Project Structure

```
tayler.id/
├── assets/              # Images and other static assets
├── html/                # HTML files
├── scripts/             # JavaScript files
│   ├── ux-mirror/       # UX Mirror analytics tool
│   └── ...
├── styles/              # CSS files
│   ├── design-system.css  # Design tokens and variables
│   ├── main.css         # Main styles
│   ├── animations.css   # Animation definitions
│   └── ...
├── memory_bank/         # Project documentation
└── .cline/              # Development notes and rules
```

## Features

- Modern, minimalist design with cohesive color scheme
- Responsive layout using CSS Grid and Flexbox
- Scroll-triggered animations and interactive elements
- Project filtering functionality
- Case study presentation format
- Custom cursor with interactive effects
- UX Mirror analytics integration
- Contact form

## Technologies

- HTML5 for semantic structure
- CSS3 for styling (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript for interactions
- No external libraries or frameworks
- Progressive enhancement approach

## Getting Started

1. Clone the repository
2. Run a local server to view the site (to avoid CORS issues):
   ```
   python -m http.server 8000
   ```
3. Visit http://localhost:8000/html/index.html in your browser

## Development Notes

- The site follows a component-based design system
- CSS is organized with a modular approach
- JavaScript is separated by functionality
- UX Mirror is integrated both as a featured project and functional tool

## Future Enhancements

- Add real project content and images
- Implement contact form functionality
- Add dark/light mode toggle
- Enhance animations for hero section
- Add more detailed case studies
- Implement service worker for offline functionality

## Documentation

For more detailed information, see:
- [Portfolio Implementation Guide](.cline/portfolio-implementation.md)
- [UX Mirror Integration Guide](scripts/ux-mirror/README-integration.md)
- [Project Memory Bank](memory_bank/)
