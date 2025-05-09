/**
 * Animations and UI Interactions for Portfolio
 * Handles all animation triggers, scroll effects, and interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scrolling animations
    initScrollAnimations();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize custom cursor effects
    initCustomCursor();
    
    // Initialize UX Mirror panel
    initUXMirrorPanel();
    
    // Add meteor effects to sections
    addMeteorEffects();
    
    // Character wave animation for hero title
    initTextWaveAnimation();
});

/**
 * Initialize scroll-triggered animations for various elements
 */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.fade-in, .reveal-right, .reveal-left, .scroll-fade-in, ' +
        '.scroll-reveal-left, .scroll-reveal-right, .scroll-zoom-in, .reveal-section'
    );
    
    // Handle section reveal animations
    const revealOnScroll = () => {
        const triggerPosition = window.innerHeight * 0.85;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerPosition) {
                element.classList.add('visible');
            }
        });
    };
    
    // Initialize staggered list animations that are in viewport on load
    const staggeredLists = document.querySelectorAll('.stagger-list');
    staggeredLists.forEach(list => {
        const isInViewport = list.getBoundingClientRect().top < window.innerHeight;
        if (isInViewport) {
            list.classList.add('visible');
        }
    });
    
    // Initial check on page load
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
}

/**
 * Initialize mobile menu functionality with overlay
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn'); // Use the button itself for the click
    const hamburgerMenu = document.querySelector('.hamburger-menu'); // Target spans container for animation class
    const navList = document.querySelector('.header .nav-list'); // Target nav list specifically within header
    const overlay = document.querySelector('.mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.header .nav-link'); // Target links within header nav
    
    if (mobileMenuBtn && navList && overlay && hamburgerMenu) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('open'); // Animate hamburger icon
            navList.classList.toggle('active');    // Slide nav list in/out
            overlay.classList.toggle('active');    // Show/hide overlay
            document.body.classList.toggle('menu-open'); // Prevent body scroll
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            hamburgerMenu.classList.remove('open');
            navList.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
        
        // Close menu when clicking navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                 // Only close if menu is actually active
                if (navList.classList.contains('active')) {
                    hamburgerMenu.classList.remove('open');
                    navList.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }
}

/**
 * Initialize custom cursor effects
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !cursorDot) return;
    
    // Add the animation class
    cursor.classList.add('cursor-animation-1');
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Use transform for positioning both elements for consistency and performance
        // CSS handles the translate(-50%, -50%) centering
        const transformString = `translate(${posX}px, ${posY}px)`; 

        cursor.style.transform = transformString;
        cursorDot.style.transform = transformString;

        // Remove setting top/left directly on the outer cursor
        // cursor.style.left = `${posX}px`; // Removed
        // cursor.style.top = `${posY}px`; // Removed
    });
    
    // Interactive elements cursor effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursor.style.backgroundColor = 'rgba(0, 169, 165, 0.1)';
            cursor.style.borderColor = 'var(--color-teal)';
            cursor.style.width = '60px';
            cursor.style.height = '60px';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = 'var(--color-coral)';
            cursor.style.width = '40px';
            cursor.style.height = '40px';
        });
    });
    
    // Hide default cursor on body
    document.body.style.cursor = 'none';
    
    // Hide cursor effect on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
}

/**
 * Initialize UX Mirror panel display and positioning
 */
function initUXMirrorPanel() {
    // Create the UX Mirror panel if it doesn't exist
    if (!document.querySelector('.ux-mirror-panel')) {
        const panel = document.createElement('div');
        panel.className = 'ux-mirror-panel';
        panel.innerHTML = `
            <div class="ux-mirror-panel-header">
                <h3 class="ux-mirror-panel-title">UX Mirror</h3>
                <button class="ux-mirror-panel-close">×</button>
            </div>
            <div class="ux-mirror-panel-section">
                <h4 class="ux-mirror-panel-section-title">Insights</h4>
                <div class="ux-mirror-insights">
                    <div class="ux-mirror-insight">Scrolling patterns indicate engagement with content</div>
                    <div class="ux-mirror-insight">Cursor paused at CTAs suggesting interest</div>
                </div>
            </div>
            <div class="ux-mirror-panel-section">
                <h4 class="ux-mirror-panel-section-title">Visualization</h4>
                <div class="ux-mirror-visualization">
                    <div style="height: 30px; background: linear-gradient(to right, var(--color-teal) 0%, var(--color-teal) 70%, var(--color-dark-gray) 70%, var(--color-dark-gray) 100%); border-radius: 4px; margin-bottom: 8px;"></div>
                    <div style="height: 30px; background: linear-gradient(to right, var(--color-coral) 0%, var(--color-coral) 45%, var(--color-dark-gray) 45%, var(--color-dark-gray) 100%); border-radius: 4px;"></div>
                </div>
            </div>
            <div class="ux-mirror-panel-section">
                <h4 class="ux-mirror-panel-section-title">Recommendations</h4>
                <div class="ux-mirror-panel-recommendations">
                    <div class="ux-mirror-recommendation">Consider larger click targets for mobile</div>
                    <div class="ux-mirror-recommendation">Content layout resonates with viewing patterns</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add close button functionality
        const closeBtn = panel.querySelector('.ux-mirror-panel-close');
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('visible');
        });
    }
    
    // Add show panel button functionality
    const showPanelBtn = document.getElementById('show-panel-btn');
    const panel = document.querySelector('.ux-mirror-panel');
    
    if (showPanelBtn && panel) {
        showPanelBtn.addEventListener('click', () => {
            panel.classList.add('visible');
        });
    }
}

/**
 * Add meteor effects to hero section for visual interest
 */
function addMeteorEffects() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        // Create 5 meteor elements
        for (let i = 0; i < 5; i++) {
            const meteor = document.createElement('div');
            meteor.className = 'meteor';
            
            // Randomize position and delay
            const randomLeft = Math.random() * 100;
            const randomDelay = Math.random() * 10;
            const randomDuration = 3 + Math.random() * 4;
            
            meteor.style.left = `${randomLeft}%`;
            meteor.style.animationDelay = `${randomDelay}s`;
            meteor.style.animationDuration = `${randomDuration}s`;
            
            heroSection.appendChild(meteor);
        }
    }
}

/**
 * Initialize text wave animation for hero title
 */
function initTextWaveAnimation() {
    // Get all span elements in the hero title
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle) {
        // Get text elements
        const coralText = heroTitle.querySelector('.text-coral');
        const tealText = heroTitle.querySelector('.text-teal');
        
        if (coralText && tealText) {
            // Add text-wave-animation class
            coralText.classList.add('text-wave-animation');
            tealText.classList.add('text-wave-animation');
            
            // Split text into individual characters for wave effect
            [coralText, tealText].forEach(element => {
                const text = element.textContent;
                let chars = '';
                
                for (let i = 0; i < text.length; i++) {
                    chars += `<span style="--char-index: ${i}">${text[i]}</span>`;
                }
                
                element.innerHTML = chars;
            });
        }
    }
}
