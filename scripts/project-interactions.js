/**
 * Project Interactions
 * Handles all project-related interactions, including filtering, details view, etc.
 */

const ProjectInteractions = {
    // Store project elements for filtering
    projects: [],
    
    // Filter categories
    categories: [],
    
    /**
     * Initialize project interactions
     */
    init: function() {
        // Get all project cards
        this.projects = document.querySelectorAll('.project-card');
        if (this.projects.length === 0) return;
        
        // Extract unique categories
        this.extractCategories();
        
        // Create filter UI if we have multiple categories
        if (this.categories.length > 1) {
            this.createFilterUI();
        }
        
        // Initialize project card hover effects
        this.initProjectHoverEffects();
        
        // Initialize project details modal if used
        const projectLinks = document.querySelectorAll('.project-card a');
        projectLinks.forEach(link => {
            // Only initialize for links that aren't direct case study links
            if (!link.getAttribute('href').startsWith('#case-study-')) {
                link.addEventListener('click', (e) => {
                    // Only handle clicks for project detail links
                    if (link.classList.contains('btn-outline') && !link.getAttribute('target')) {
                        e.preventDefault();
                        this.showProjectDetails(link.closest('.project-card'));
                    }
                });
            }
        });
    },
    
    /**
     * Extract unique categories from project cards
     */
    extractCategories: function() {
        const categorySet = new Set();
        
        this.projects.forEach(project => {
            const categoryEl = project.querySelector('.project-category');
            if (categoryEl) {
                const category = categoryEl.textContent.trim();
                categorySet.add(category);
            }
        });
        
        this.categories = Array.from(categorySet);
    },
    
    /**
     * Create filter UI above projects
     */
    createFilterUI: function() {
        // Get the projects container
        const projectsSection = document.querySelector('#projects .container');
        if (!projectsSection) return;
        
        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        
        // Create "All" filter option
        const allFilter = document.createElement('button');
        allFilter.className = 'filter-btn active';
        allFilter.textContent = 'All';
        allFilter.dataset.category = 'all';
        
        // Add click event to all filter
        allFilter.addEventListener('click', () => {
            this.filterProjects('all');
            this.setActiveFilter(allFilter);
        });
        
        filterContainer.appendChild(allFilter);
        
        // Create filter buttons for each category
        this.categories.forEach(category => {
            const filterBtn = document.createElement('button');
            filterBtn.className = 'filter-btn';
            filterBtn.textContent = category;
            filterBtn.dataset.category = category;
            
            // Add click event
            filterBtn.addEventListener('click', () => {
                this.filterProjects(category);
                this.setActiveFilter(filterBtn);
            });
            
            filterContainer.appendChild(filterBtn);
        });
        
        // Insert filter UI after the section heading
        const sectionHeading = projectsSection.querySelector('h2');
        if (sectionHeading) {
            sectionHeading.insertAdjacentElement('afterend', filterContainer);
        } else {
            projectsSection.insertAdjacentElement('afterbegin', filterContainer);
        }
        
        // Add the styles to head if not already defined in CSS
        if (!document.querySelector('style#project-filter-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'project-filter-styles';
            styleEl.textContent = `
                .project-filters {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-3);
                    margin-bottom: var(--space-6);
                }
                
                .filter-btn {
                    padding: var(--space-2) var(--space-4);
                    background-color: var(--color-dark-gray);
                    color: var(--color-light-gray);
                    border-radius: var(--radius-md);
                    transition: all var(--transition-normal);
                    cursor: pointer;
                    border: none;
                    font-size: var(--text-sm);
                }
                
                .filter-btn:hover {
                    background-color: var(--color-medium-gray);
                }
                
                .filter-btn.active {
                    background-color: var(--color-coral);
                    color: var(--color-white);
                }
            `;
            document.head.appendChild(styleEl);
        }
    },
    
    /**
     * Filter projects by category
     * @param {string} category - Category to filter by, or 'all'
     */
    filterProjects: function(category) {
        this.projects.forEach(project => {
            if (category === 'all') {
                // Show all projects
                project.style.display = '';
                
                // Trigger reveal animation
                setTimeout(() => {
                    project.classList.add('visible');
                }, 100);
            } else {
                // Check if project matches category
                const projectCategory = project.querySelector('.project-category')?.textContent.trim();
                
                if (projectCategory === category) {
                    // Show matching project
                    project.style.display = '';
                    
                    // Trigger reveal animation
                    setTimeout(() => {
                        project.classList.add('visible');
                    }, 100);
                } else {
                    // Hide non-matching project
                    project.style.display = 'none';
                    project.classList.remove('visible');
                }
            }
        });
    },
    
    /**
     * Set active filter button
     * @param {HTMLElement} activeBtn - The button to set as active
     */
    setActiveFilter: function(activeBtn) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        activeBtn.classList.add('active');
    },
    
    /**
     * Initialize hover effects for project cards
     */
    initProjectHoverEffects: function() {
        this.projects.forEach(project => {
            // Skip if already initialized
            if (project.dataset.hoverInitialized) return;
            
            // Get project image
            const projectImage = project.querySelector('.project-image img');
            if (!projectImage) return;
            
            // Create hover effect layer
            const hoverLayer = document.createElement('div');
            hoverLayer.className = 'project-hover-layer';
            
            // Get project title and category
            const projectTitle = project.querySelector('.project-title')?.textContent || '';
            const projectCategory = project.querySelector('.project-category')?.textContent || '';
            
            // Create hover content
            const hoverContent = document.createElement('div');
            hoverContent.className = 'project-hover-content';
            hoverContent.innerHTML = `
                <div class="project-hover-title">${projectTitle}</div>
                <div class="project-hover-category">${projectCategory}</div>
                <div class="project-hover-icon">
                    <i class="fas fa-arrow-right"></i>
                </div>
            `;
            
            hoverLayer.appendChild(hoverContent);
            
            // Add to project image container
            const imageContainer = project.querySelector('.project-image');
            if (imageContainer) {
                imageContainer.appendChild(hoverLayer);
                
                // Mark as initialized
                project.dataset.hoverInitialized = 'true';
            }
        });
        
        // Add the styles to head if not already defined in CSS
        if (!document.querySelector('style#project-hover-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'project-hover-styles';
            styleEl.textContent = `
                .project-image {
                    position: relative;
                    overflow: hidden;
                }
                
                .project-hover-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity var(--transition-normal);
                }
                
                .project-card:hover .project-hover-layer {
                    opacity: 1;
                }
                
                .project-hover-content {
                    text-align: center;
                    color: var(--color-white);
                    padding: var(--space-4);
                }
                
                .project-hover-title {
                    font-size: var(--text-xl);
                    font-weight: var(--weight-bold);
                    margin-bottom: var(--space-2);
                }
                
                .project-hover-category {
                    color: var(--color-coral);
                    margin-bottom: var(--space-4);
                }
                
                .project-hover-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: var(--color-coral);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    transition: transform var(--transition-normal);
                }
                
                .project-card:hover .project-hover-icon {
                    transform: scale(1.2);
                }
            `;
            document.head.appendChild(styleEl);
        }
    },
    
    /**
     * Show project details in a modal
     * @param {HTMLElement} projectCard - The project card to show details for
     */
    showProjectDetails: function(projectCard) {
        // Create modal if it doesn't exist
        if (!document.querySelector('#project-modal')) {
            const modal = document.createElement('div');
            modal.id = 'project-modal';
            modal.className = 'project-modal';
            modal.innerHTML = `
                <div class="project-modal-overlay"></div>
                <div class="project-modal-container">
                    <button class="project-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="project-modal-content"></div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add close event to overlay and close button
            const overlay = modal.querySelector('.project-modal-overlay');
            const closeBtn = modal.querySelector('.project-modal-close');
            
            overlay.addEventListener('click', this.hideProjectDetails);
            closeBtn.addEventListener('click', this.hideProjectDetails);
            
            // Add escape key event
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hideProjectDetails();
                }
            });
            
            // Add the styles to head
            const styleEl = document.createElement('style');
            styleEl.id = 'project-modal-styles';
            styleEl.textContent = `
                .project-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: var(--z-modal);
                    display: none;
                }
                
                .project-modal.active {
                    display: block;
                }
                
                .project-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                }
                
                .project-modal-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 900px;
                    max-height: 90vh;
                    background-color: var(--color-dark-gray);
                    border-radius: var(--radius-lg);
                    overflow-y: auto;
                }
                
                .project-modal-close {
                    position: absolute;
                    top: var(--space-4);
                    right: var(--space-4);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background-color: var(--color-medium-gray);
                    color: var(--color-white);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 1;
                }
                
                .project-modal-content {
                    padding: var(--space-8);
                }
            `;
            document.head.appendChild(styleEl);
        }
        
        // Get project details
        const title = projectCard.querySelector('.project-title')?.textContent || '';
        const category = projectCard.querySelector('.project-category')?.textContent || '';
        const description = projectCard.querySelector('.project-description')?.textContent || '';
        const imageUrl = projectCard.querySelector('.project-image img')?.src || '';
        
        // Populate modal
        const modal = document.querySelector('#project-modal');
        const content = modal.querySelector('.project-modal-content');
        
        content.innerHTML = `
            <div class="project-modal-header">
                <div class="project-modal-category">${category}</div>
                <h2 class="project-modal-title">${title}</h2>
            </div>
            
            <div class="project-modal-image">
                <img src="${imageUrl}" alt="${title}">
            </div>
            
            <div class="project-modal-description">
                <p>${description}</p>
                <p>View the detailed case study for more information about this project, including the challenge, approach, and results.</p>
            </div>
            
            <div class="project-modal-actions">
                <a href="#case-study-${title.toLowerCase().replace(/\s+/g, '-')}" class="btn btn-primary">View Case Study</a>
            </div>
        `;
        
        // Show modal
        modal.classList.add('active');
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    },
    
    /**
     * Hide project details modal
     */
    hideProjectDetails: function() {
        const modal = document.querySelector('#project-modal');
        if (!modal) return;
        
        modal.classList.remove('active');
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
    }
};

// Initialize project interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ProjectInteractions.init();
});
