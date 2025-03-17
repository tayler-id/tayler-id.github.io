/**
 * Panel Component
 * Creates and manages the UI panel for the UX Mirror
 */

/**
 * Panel
 * UI panel for the UX Mirror that displays visualizations and recommendations
 */
class Panel {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.config = uiManager.config;
    this.initialized = false;
    
    // Panel elements
    this.panelElement = null;
    this.headerElement = null;
    this.contentElement = null;
    this.tabsElement = null;
    this.tabPanelsElement = null;
    this.toggleButton = null;
    
    // Panel state
    this.activeTab = 'insights';
    this.visualizationsContainer = null;
    this.recommendationsContainer = null;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.create = this.create.bind(this);
    this.destroy = this.destroy.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.createPanelElement = this.createPanelElement.bind(this);
    this.createHeaderElement = this.createHeaderElement.bind(this);
    this.createContentElement = this.createContentElement.bind(this);
    this.createToggleButton = this.createToggleButton.bind(this);
    this.activateTab = this.activateTab.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleCollapseClick = this.handleCollapseClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }
  
  /**
   * Initialize the panel
   */
  init() {
    if (this.initialized) return;
    
    this.log('Initializing panel');
    this.initialized = true;
    
    return this;
  }
  
  /**
   * Create the panel element and add it to the DOM
   */
  create() {
    this.log('Creating panel');
    
    // Create the panel element
    this.createPanelElement();
    
    // Create the toggle button
    this.createToggleButton();
    
    // Add to document
    document.body.appendChild(this.panelElement);
    document.body.appendChild(this.toggleButton);
    
    return this;
  }
  
  /**
   * Destroy the panel element and remove it from the DOM
   */
  destroy() {
    this.log('Destroying panel');
    
    // Remove event listeners
    
    // Remove panel from document
    if (this.panelElement && this.panelElement.parentNode) {
      this.panelElement.parentNode.removeChild(this.panelElement);
    }
    
    // Remove toggle button from document
    if (this.toggleButton && this.toggleButton.parentNode) {
      this.toggleButton.parentNode.removeChild(this.toggleButton);
    }
    
    // Reset panel elements
    this.panelElement = null;
    this.headerElement = null;
    this.contentElement = null;
    this.tabsElement = null;
    this.tabPanelsElement = null;
    this.toggleButton = null;
    this.visualizationsContainer = null;
    this.recommendationsContainer = null;
    
    return this;
  }
  
  /**
   * Show the panel
   */
  show() {
    if (!this.panelElement) return;
    
    this.log('Showing panel');
    
    // Remove hidden class
    this.panelElement.classList.remove('hidden');
    
    // Show toggle button
    if (this.toggleButton) {
      this.toggleButton.style.display = 'none';
    }
    
    return this;
  }
  
  /**
   * Hide the panel
   */
  hide() {
    if (!this.panelElement) return;
    
    this.log('Hiding panel');
    
    // Add hidden class
    this.panelElement.classList.add('hidden');
    
    // Show toggle button
    if (this.toggleButton) {
      this.toggleButton.style.display = 'flex';
    }
    
    return this;
  }
  
  /**
   * Expand the panel
   */
  expand() {
    if (!this.panelElement) return;
    
    this.log('Expanding panel');
    
    // Remove collapsed class
    this.panelElement.classList.remove('collapsed');
    
    return this;
  }
  
  /**
   * Collapse the panel
   */
  collapse() {
    if (!this.panelElement) return;
    
    this.log('Collapsing panel');
    
    // Add collapsed class
    this.panelElement.classList.add('collapsed');
    
    return this;
  }
  
  /**
   * Get visualizations container element
   */
  getVisualizationsContainer() {
    return this.visualizationsContainer;
  }
  
  /**
   * Get recommendations container element
   */
  getRecommendationsContainer() {
    return this.recommendationsContainer;
  }
  
  /**
   * Create the panel element
   */
  createPanelElement() {
    // Create panel element
    this.panelElement = document.createElement('div');
    this.panelElement.className = 'ux-mirror-panel';
    this.panelElement.classList.add(this.config.panelPosition);
    
    // Apply initial state
    if (this.config.initiallyCollapsed) {
      this.panelElement.classList.add('collapsed');
    }
    
    // Create header
    this.headerElement = this.createHeaderElement();
    this.panelElement.appendChild(this.headerElement);
    
    // Create content
    this.contentElement = this.createContentElement();
    this.panelElement.appendChild(this.contentElement);
    
    return this.panelElement;
  }
  
  /**
   * Create the header element
   */
  createHeaderElement() {
    // Create header element
    const header = document.createElement('div');
    header.className = 'ux-mirror-header';
    
    // Create title
    const title = document.createElement('h3');
    title.className = 'ux-mirror-title';
    title.textContent = 'UX Mirror';
    header.appendChild(title);
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'ux-mirror-controls';
    
    // Create collapse button
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'ux-mirror-btn';
    collapseBtn.setAttribute('aria-label', 'Collapse panel');
    collapseBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    collapseBtn.addEventListener('click', this.handleCollapseClick);
    controls.appendChild(collapseBtn);
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ux-mirror-btn';
    closeBtn.setAttribute('aria-label', 'Close panel');
    closeBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    closeBtn.addEventListener('click', this.handleCloseClick);
    controls.appendChild(closeBtn);
    
    header.appendChild(controls);
    
    return header;
  }
  
  /**
   * Create the content element
   */
  createContentElement() {
    // Create content element
    const content = document.createElement('div');
    content.className = 'ux-mirror-content';
    
    // Create tabs
    this.tabsElement = document.createElement('div');
    this.tabsElement.className = 'ux-mirror-tabs';
    
    // Create tab buttons
    const insightsTab = document.createElement('button');
    insightsTab.className = 'ux-mirror-tab active';
    insightsTab.dataset.tab = 'insights';
    insightsTab.textContent = 'Insights';
    insightsTab.addEventListener('click', this.handleTabClick);
    this.tabsElement.appendChild(insightsTab);
    
    const visualizationsTab = document.createElement('button');
    visualizationsTab.className = 'ux-mirror-tab';
    visualizationsTab.dataset.tab = 'visualizations';
    visualizationsTab.textContent = 'Visualizations';
    visualizationsTab.addEventListener('click', this.handleTabClick);
    this.tabsElement.appendChild(visualizationsTab);
    
    const adaptationsTab = document.createElement('button');
    adaptationsTab.className = 'ux-mirror-tab';
    adaptationsTab.dataset.tab = 'adaptations';
    adaptationsTab.textContent = 'Adaptations';
    adaptationsTab.addEventListener('click', this.handleTabClick);
    this.tabsElement.appendChild(adaptationsTab);
    
    content.appendChild(this.tabsElement);
    
    // Create tab panels
    this.tabPanelsElement = document.createElement('div');
    this.tabPanelsElement.className = 'ux-mirror-tab-panels';
    
    // Create insights panel
    const insightsPanel = document.createElement('div');
    insightsPanel.className = 'ux-mirror-tab-panel active';
    insightsPanel.dataset.tabPanel = 'insights';
    
    // Create recommendations container
    this.recommendationsContainer = document.createElement('div');
    this.recommendationsContainer.className = 'ux-mirror-recommendations';
    insightsPanel.appendChild(this.recommendationsContainer);
    
    this.tabPanelsElement.appendChild(insightsPanel);
    
    // Create visualizations panel
    const visualizationsPanel = document.createElement('div');
    visualizationsPanel.className = 'ux-mirror-tab-panel';
    visualizationsPanel.dataset.tabPanel = 'visualizations';
    
    // Create visualizations container
    this.visualizationsContainer = document.createElement('div');
    this.visualizationsContainer.className = 'ux-mirror-visualizations';
    visualizationsPanel.appendChild(this.visualizationsContainer);
    
    this.tabPanelsElement.appendChild(visualizationsPanel);
    
    // Create adaptations panel
    const adaptationsPanel = document.createElement('div');
    adaptationsPanel.className = 'ux-mirror-tab-panel';
    adaptationsPanel.dataset.tabPanel = 'adaptations';
    
    // Create adaptations content
    const adaptationsContent = document.createElement('div');
    adaptationsContent.className = 'ux-mirror-adaptations';
    adaptationsContent.innerHTML = `
      <div class="ux-mirror-card">
        <h4>Active Adaptations</h4>
        <p>No active adaptations yet.</p>
      </div>
    `;
    adaptationsPanel.appendChild(adaptationsContent);
    
    this.tabPanelsElement.appendChild(adaptationsPanel);
    
    content.appendChild(this.tabPanelsElement);
    
    return content;
  }
  
  /**
   * Create the toggle button
   */
  createToggleButton() {
    // Create toggle button
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'ux-mirror-toggle-btn';
    this.toggleButton.setAttribute('aria-label', 'Show UX Mirror');
    this.toggleButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    
    // Add click event listener
    this.toggleButton.addEventListener('click', this.handleToggleClick);
    
    return this.toggleButton;
  }
  
  /**
   * Activate a tab
   */
  activateTab(tabId) {
    if (this.activeTab === tabId) return;
    
    this.log(`Activating tab: ${tabId}`);
    
    // Update active tab
    this.activeTab = tabId;
    
    // Update tab buttons
    const tabButtons = this.tabsElement.querySelectorAll('.ux-mirror-tab');
    tabButtons.forEach(tab => {
      if (tab.dataset.tab === tabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update tab panels
    const tabPanels = this.tabPanelsElement.querySelectorAll('.ux-mirror-tab-panel');
    tabPanels.forEach(panel => {
      if (panel.dataset.tabPanel === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
    
    return this;
  }
  
  /**
   * Handle toggle button click
   */
  handleToggleClick(event) {
    event.preventDefault();
    
    this.log('Toggle button clicked');
    
    // Toggle visibility through UI manager
    this.uiManager.toggleVisibility();
    
    return this;
  }
  
  /**
   * Handle tab click
   */
  handleTabClick(event) {
    event.preventDefault();
    
    const tabId = event.currentTarget.dataset.tab;
    this.log(`Tab clicked: ${tabId}`);
    
    // Activate tab
    this.activateTab(tabId);
    
    return this;
  }
  
  /**
   * Handle collapse button click
   */
  handleCollapseClick(event) {
    event.preventDefault();
    
    this.log('Collapse button clicked');
    
    // Toggle expanded state through UI manager
    this.uiManager.toggleExpanded();
    
    return this;
  }
  
  /**
   * Handle close button click
   */
  handleCloseClick(event) {
    event.preventDefault();
    
    this.log('Close button clicked');
    
    // Hide panel through UI manager
    this.uiManager.toggleVisibility(false);
    
    return this;
  }
  
  /**
   * Log a message through the UI manager
   */
  log(message) {
    this.uiManager.log(`[Panel] ${message}`);
    return this;
  }
}

export default Panel;
