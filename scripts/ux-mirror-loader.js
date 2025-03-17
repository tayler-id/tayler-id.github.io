/**
 * UX Mirror Loader
 * Handles loading and initialization of the UX Mirror library
 */

(function() {
  /**
   * UX Mirror Loader
   */
  const UXMirrorLoader = {
    /**
     * Configuration
     */
    config: {
      autoLoad: true,           // Automatically load UX Mirror
      debug: false,             // Enable debug mode
      modules: [                // Modules to load
        'config.js',
        'index.js',
        'trackers/index.js',
        'trackers/mouse.js',
        'trackers/click.js',
        'trackers/scroll.js',
        'trackers/viewport.js',
        'trackers/time.js',
        'analysis/index.js',
        'analysis/profile.js',
        'analysis/insights.js',
        'adaptations/index.js',
        'adaptations/color.js',
        'adaptations/animation.js',
        'adaptations/content.js',
        'ui/index.js',
        'ui/panel.js',
        'ui/visualizations.js',
        'ui/recommendations.js'
      ],
      basePath: '../scripts/ux-mirror/'  // Base path for modules
    },
    
    /**
     * Initialize UX Mirror Loader
     */
    init() {
      this.log('Initializing UX Mirror Loader');
      
      if (this.config.autoLoad) {
        this.loadModules();
      }
      
      return this;
    },
    
    /**
     * Load UX Mirror modules
     */
    loadModules() {
      this.log('Loading UX Mirror modules');
      
      // Create script elements for each module
      const promises = this.config.modules.map(module => {
        const path = this.config.basePath + module;
        return this.loadScript(path);
      });
      
      // When all modules are loaded, initialize UX Mirror
      Promise.all(promises)
        .then(() => {
          this.log('All modules loaded');
          this.initUXMirror();
        })
        .catch(error => {
          this.log(`Error loading modules: ${error}`, 'error');
        });
      
      return this;
    },
    
    /**
     * Load a script
     */
    loadScript(path) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = path;
        
        script.onload = () => {
          this.log(`Loaded script: ${path}`);
          resolve();
        };
        
        script.onerror = () => {
          this.log(`Error loading script: ${path}`, 'error');
          reject(new Error(`Failed to load script: ${path}`));
        };
        
        document.head.appendChild(script);
      });
    },
    
    /**
     * Initialize UX Mirror
     */
    initUXMirror() {
      this.log('Initializing UX Mirror');
      
      // Wait for UXMirror to be available
      const checkUXMirror = () => {
        if (window.UXMirror) {
          const uxMirror = new window.UXMirror();
          window.UXMirror = uxMirror;
          uxMirror.start();
          this.log('UX Mirror initialized');
        } else {
          setTimeout(checkUXMirror, 100);
        }
      };
      
      checkUXMirror();
      
      return this;
    },
    
    /**
     * Log a message
     */
    log(message, level = 'info') {
      if (!this.config.debug) return;
      
      const prefix = '[UX Mirror Loader]';
      
      switch (level) {
        case 'error':
          console.error(`${prefix} ${message}`);
          break;
        case 'warn':
          console.warn(`${prefix} ${message}`);
          break;
        default:
          console.log(`${prefix} ${message}`);
          break;
      }
      
      return this;
    }
  };
  
  // Expose UXMirrorLoader globally
  window.UXMirrorLoader = UXMirrorLoader;
  
  // Initialize loader if DOM is already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => UXMirrorLoader.init(), 1);
  } else {
    document.addEventListener('DOMContentLoaded', () => UXMirrorLoader.init());
  }
})();
