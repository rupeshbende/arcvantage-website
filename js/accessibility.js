/**
 * ArcVantage Design Studios - Accessibility Enhancement JavaScript
 * Provides cross-browser compatibility and accessibility improvements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accessibility features
    initAccessibilityFeatures();
    
    // Initialize cross-browser compatibility
    initCrossBrowserCompatibility();
    
    // Initialize focus management
    initFocusManagement();
    
    // Initialize keyboard navigation
    initKeyboardNavigation();
    
    // Initialize ARIA live regions
    initAriaLiveRegions();
    
    /**
     * Initialize accessibility features
     */
    function initAccessibilityFeatures() {
        // Add focus-visible polyfill for better focus management
        addFocusVisiblePolyfill();
        
        // Enhance form accessibility
        enhanceFormAccessibility();
        
        // Add skip links functionality
        enhanceSkipLinks();
        
        // Add alt text to images that don't have it
        addMissingAltText();
        
        // Enhance modal accessibility
        enhanceModalAccessibility();
        
        // Add ARIA labels to interactive elements
        addAriaLabels();
    }
    
    /**
     * Initialize cross-browser compatibility
     */
    function initCrossBrowserCompatibility() {
        // Add CSS custom properties fallbacks for older browsers
        addCssVariableFallbacks();
        
        // Add smooth scroll polyfill for older browsers
        addSmoothScrollPolyfill();
        
        // Add IntersectionObserver polyfill if needed
        addIntersectionObserverPolyfill();
        
        // Fix flexbox issues in older browsers
        fixFlexboxIssues();
        
        // Add CSS Grid fallbacks
        addGridFallbacks();
    }
    
    /**
     * Initialize focus management
     */
    function initFocusManagement() {
        // Track focus for keyboard users
        let isKeyboardUser = false;
        
        // Detect keyboard usage
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                isKeyboardUser = true;
                document.body.classList.add('keyboard-user');
            }
        });
        
        // Detect mouse usage
        document.addEventListener('mousedown', function() {
            isKeyboardUser = false;
            document.body.classList.remove('keyboard-user');
        });
        
        // Manage focus for dynamic content
        manageDynamicFocus();
        
        // Add focus trap for modals
        addFocusTrap();
    }
    
    /**
     * Initialize keyboard navigation
     */
    function initKeyboardNavigation() {
        // Add keyboard navigation to custom elements
        addKeyboardNavigationToCards();
        
        // Add keyboard navigation to carousels
        addKeyboardNavigationToCarousels();
        
        // Add keyboard shortcuts
        addKeyboardShortcuts();
        
        // Enhance tab navigation
        enhanceTabNavigation();
    }
    
    /**
     * Initialize ARIA live regions
     */
    function initAriaLiveRegions() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
        
        // Create assertive live region for urgent announcements
        const assertiveLiveRegion = document.createElement('div');
        assertiveLiveRegion.setAttribute('aria-live', 'assertive');
        assertiveLiveRegion.setAttribute('aria-atomic', 'true');
        assertiveLiveRegion.className = 'sr-only';
        assertiveLiveRegion.id = 'assertive-live-region';
        document.body.appendChild(assertiveLiveRegion);
        
        // Function to announce messages
        window.announceToScreenReader = function(message, assertive = false) {
            const region = assertive ? assertiveLiveRegion : liveRegion;
            region.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        };
    }
    
    /**
     * Add focus-visible polyfill for better focus management
     */
    function addFocusVisiblePolyfill() {
        // Simple focus-visible polyfill
        if (!CSS.supports('selector(:focus-visible)')) {
            document.body.classList.add('js-focus-visible');
            
            let hadKeyboardEvent = true;
            const keyboardThrottleTimeout = 100;
            
            function onPointerDown() {
                hadKeyboardEvent = false;
            }
            
            function onKeyDown(e) {
                if (e.metaKey || e.altKey || e.ctrlKey) {
                    return;
                }
                hadKeyboardEvent = true;
            }
            
            function onFocus(e) {
                if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
                    e.target.classList.add('focus-visible');
                }
            }
            
            function onBlur(e) {
                e.target.classList.remove('focus-visible');
            }
            
            document.addEventListener('keydown', onKeyDown, true);
            document.addEventListener('mousedown', onPointerDown, true);
            document.addEventListener('pointerdown', onPointerDown, true);
            document.addEventListener('touchstart', onPointerDown, true);
            document.addEventListener('focus', onFocus, true);
            document.addEventListener('blur', onBlur, true);
        }
    }
    
    /**
     * Enhance form accessibility
     */
    function enhanceFormAccessibility() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add form validation announcements
            form.addEventListener('submit', function(e) {
                const invalidFields = form.querySelectorAll(':invalid');
                if (invalidFields.length > 0) {
                    const fieldNames = Array.from(invalidFields).map(field => {
                        const label = form.querySelector(`label[for="${field.id}"]`);
                        return label ? label.textContent : field.name || field.type;
                    }).join(', ');
                    
                    window.announceToScreenReader(`Please correct the following fields: ${fieldNames}`, true);
                }
            });
            
            // Add real-time validation announcements
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('invalid', function() {
                    const label = form.querySelector(`label[for="${this.id}"]`);
                    const fieldName = label ? label.textContent : this.name || this.type;
                    window.announceToScreenReader(`${fieldName} is invalid: ${this.validationMessage}`);
                });
                
                input.addEventListener('valid', function() {
                    if (this.hasAttribute('aria-invalid')) {
                        this.removeAttribute('aria-invalid');
                        const label = form.querySelector(`label[for="${this.id}"]`);
                        const fieldName = label ? label.textContent : this.name || this.type;
                        window.announceToScreenReader(`${fieldName} is now valid`);
                    }
                });
            });
        });
    }
    
    /**
     * Enhance skip links functionality
     */
    function enhanceSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        
        skipLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    // Make target focusable if it isn't already
                    if (!target.hasAttribute('tabindex')) {
                        target.setAttribute('tabindex', '-1');
                    }
                    
                    // Focus the target
                    target.focus();
                    
                    // Announce the skip
                    window.announceToScreenReader(`Skipped to ${target.textContent || targetId}`);
                    
                    // Remove tabindex after focus if we added it
                    setTimeout(() => {
                        if (target.getAttribute('tabindex') === '-1') {
                            target.removeAttribute('tabindex');
                        }
                    }, 1000);
                }
            });
        });
    }
    
    /**
     * Add missing alt text to images
     */
    function addMissingAltText() {
        const images = document.querySelectorAll('img:not([alt])');
        
        images.forEach(img => {
            // Try to get alt text from surrounding context
            let altText = '';
            
            // Check for nearby headings or captions
            const nearbyHeading = img.closest('section')?.querySelector('h1, h2, h3, h4, h5, h6');
            const caption = img.closest('figure')?.querySelector('figcaption');
            const title = img.getAttribute('title');
            
            if (caption) {
                altText = caption.textContent.trim();
            } else if (title) {
                altText = title;
            } else if (nearbyHeading) {
                altText = `Image related to ${nearbyHeading.textContent.trim()}`;
            } else {
                // Check if image is decorative (has no meaningful content)
                const isDecorative = img.closest('[aria-hidden="true"]') || 
                                   img.classList.contains('decoration') ||
                                   img.classList.contains('background');
                
                altText = isDecorative ? '' : 'Image';
            }
            
            img.setAttribute('alt', altText);
        });
    }
    
    /**
     * Enhance modal accessibility
     */
    function enhanceModalAccessibility() {
        const modals = document.querySelectorAll('.modal, .project-modal, .blog-modal');
        
        modals.forEach(modal => {
            // Add ARIA attributes
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            
            // Add close button if it doesn't exist
            if (!modal.querySelector('.close, .modal-close')) {
                const closeButton = document.createElement('button');
                closeButton.className = 'modal-close';
                closeButton.innerHTML = '&times;';
                closeButton.setAttribute('aria-label', 'Close modal');
                modal.appendChild(closeButton);
            }
            
            // Add keyboard event listeners
            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    const closeButton = modal.querySelector('.close, .modal-close');
                    if (closeButton) {
                        closeButton.click();
                    }
                }
            });
        });
    }
    
    /**
     * Add ARIA labels to interactive elements
     */
    function addAriaLabels() {
        // Add labels to buttons without text
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        
        buttons.forEach(button => {
            const icon = button.querySelector('i[class*="fa-"]');
            const text = button.textContent.trim();
            
            if (!text && icon) {
                // Try to determine button purpose from icon class
                const iconClass = icon.className;
                let label = 'Button';
                
                if (iconClass.includes('search')) label = 'Search';
                else if (iconClass.includes('menu') || iconClass.includes('bars')) label = 'Menu';
                else if (iconClass.includes('close') || iconClass.includes('times')) label = 'Close';
                else if (iconClass.includes('play')) label = 'Play';
                else if (iconClass.includes('pause')) label = 'Pause';
                else if (iconClass.includes('next')) label = 'Next';
                else if (iconClass.includes('prev')) label = 'Previous';
                else if (iconClass.includes('up')) label = 'Up';
                else if (iconClass.includes('down')) label = 'Down';
                else if (iconClass.includes('left')) label = 'Left';
                else if (iconClass.includes('right')) label = 'Right';
                
                button.setAttribute('aria-label', label);
            }
        });
        
        // Add labels to links without text
        const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        
        links.forEach(link => {
            const text = link.textContent.trim();
            const href = link.getAttribute('href');
            
            if (!text && href) {
                if (href.startsWith('#')) {
                    link.setAttribute('aria-label', `Navigate to ${href.substring(1)} section`);
                } else if (href.startsWith('mailto:')) {
                    link.setAttribute('aria-label', `Send email to ${href.substring(7)}`);
                } else if (href.startsWith('tel:')) {
                    link.setAttribute('aria-label', `Call ${href.substring(4)}`);
                } else {
                    link.setAttribute('aria-label', 'Link');
                }
            }
        });
    }
    
    /**
     * Add CSS custom properties fallbacks for older browsers
     */
    function addCssVariableFallbacks() {
        // Check if CSS custom properties are supported
        if (!window.CSS || !CSS.supports('color', 'var(--fake-var)')) {
            // Add fallback styles for older browsers
            const fallbackStyles = `
                .hero-section { background-color: #1a365d; }
                .cta-button { background-color: #d69e2e; }
                .btn { background-color: #38b2ac; }
                .text-accent { color: #d69e2e; }
                .service-card { background-color: #f7fafc; }
                .project-card { background-color: #ffffff; }
            `;
            
            const style = document.createElement('style');
            style.textContent = fallbackStyles;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Add smooth scroll polyfill for older browsers
     */
    function addSmoothScrollPolyfill() {
        // Check if smooth scrolling is supported
        if (!('scrollBehavior' in document.documentElement.style)) {
            // Simple smooth scroll polyfill
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    
                    if (target) {
                        const startPosition = window.pageYOffset;
                        const targetPosition = target.offsetTop - 80; // Account for header
                        const distance = targetPosition - startPosition;
                        const duration = 800;
                        let start = null;
                        
                        function animation(currentTime) {
                            if (start === null) start = currentTime;
                            const timeElapsed = currentTime - start;
                            const run = ease(timeElapsed, startPosition, distance, duration);
                            window.scrollTo(0, run);
                            if (timeElapsed < duration) requestAnimationFrame(animation);
                        }
                        
                        function ease(t, b, c, d) {
                            t /= d / 2;
                            if (t < 1) return c / 2 * t * t + b;
                            t--;
                            return -c / 2 * (t * (t - 2) - 1) + b;
                        }
                        
                        requestAnimationFrame(animation);
                    }
                });
            });
        }
    }
    
    /**
     * Add IntersectionObserver polyfill if needed
     */
    function addIntersectionObserverPolyfill() {
        if (!('IntersectionObserver' in window)) {
            // Simple fallback for IntersectionObserver
            window.IntersectionObserver = function(callback, options) {
                this.callback = callback;
                this.options = options || {};
                this.elements = [];
                
                this.observe = function(element) {
                    this.elements.push(element);
                    // Immediately trigger callback for all elements
                    this.callback([{
                        target: element,
                        isIntersecting: true,
                        intersectionRatio: 1
                    }]);
                };
                
                this.unobserve = function(element) {
                    const index = this.elements.indexOf(element);
                    if (index > -1) {
                        this.elements.splice(index, 1);
                    }
                };
                
                this.disconnect = function() {
                    this.elements = [];
                };
            };
        }
    }
    
    /**
     * Fix flexbox issues in older browsers
     */
    function fixFlexboxIssues() {
        // Add flexbox fixes for IE10/11
        const isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
        
        if (isIE) {
            const flexContainers = document.querySelectorAll('.hero-cta, .about-content, .services-grid, .projects-grid');
            
            flexContainers.forEach(container => {
                container.style.display = '-ms-flexbox';
                container.style.display = 'flex';
            });
        }
    }
    
    /**
     * Add CSS Grid fallbacks
     */
    function addGridFallbacks() {
        // Check if CSS Grid is supported
        if (!CSS.supports('display', 'grid')) {
            // Add fallback styles for CSS Grid
            const gridFallbackStyles = `
                .services-grid { display: flex; flex-wrap: wrap; }
                .service-card { flex: 1 1 300px; margin: 10px; }
                .projects-grid { display: flex; flex-wrap: wrap; }
                .project-item { flex: 1 1 300px; margin: 10px; }
                .blog-grid { display: flex; flex-wrap: wrap; }
                .blog-card { flex: 1 1 300px; margin: 10px; }
            `;
            
            const style = document.createElement('style');
            style.textContent = gridFallbackStyles;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Manage focus for dynamic content
     */
    function manageDynamicFocus() {
        // Store the last focused element before dynamic content changes
        let lastFocusedElement = null;
        
        // Function to save current focus
        window.saveFocus = function() {
            lastFocusedElement = document.activeElement;
        };
        
        // Function to restore focus
        window.restoreFocus = function() {
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        };
    }
    
    /**
     * Add focus trap for modals
     */
    function addFocusTrap() {
        window.trapFocus = function(element) {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
            
            // Focus the first element
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        };
    }
    
    /**
     * Add keyboard navigation to cards
     */
    function addKeyboardNavigationToCards() {
        const cardContainers = document.querySelectorAll('.services-grid, .projects-grid, .blog-grid');
        
        cardContainers.forEach(container => {
            const cards = container.querySelectorAll('.service-card, .project-card, .blog-card');
            
            cards.forEach((card, index) => {
                card.addEventListener('keydown', function(e) {
                    let nextIndex;
                    
                    switch(e.key) {
                        case 'ArrowRight':
                        case 'ArrowDown':
                            e.preventDefault();
                            nextIndex = index < cards.length - 1 ? index + 1 : 0;
                            cards[nextIndex].focus();
                            break;
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            e.preventDefault();
                            nextIndex = index > 0 ? index - 1 : cards.length - 1;
                            cards[nextIndex].focus();
                            break;
                        case 'Home':
                            e.preventDefault();
                            cards[0].focus();
                            break;
                        case 'End':
                            e.preventDefault();
                            cards[cards.length - 1].focus();
                            break;
                    }
                });
            });
        });
    }
    
    /**
     * Add keyboard navigation to carousels
     */
    function addKeyboardNavigationToCarousels() {
        // This would be implemented if there were carousels in the design
        // Placeholder for future carousel implementation
    }
    
    /**
     * Add keyboard shortcuts
     */
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Only trigger shortcuts when not in form fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                return;
            }
            
            // Alt + key shortcuts
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        document.querySelector('a[href="#hero"]')?.click();
                        break;
                    case '2':
                        e.preventDefault();
                        document.querySelector('a[href="#about"]')?.click();
                        break;
                    case '3':
                        e.preventDefault();
                        document.querySelector('a[href="#projects"]')?.click();
                        break;
                    case '4':
                        e.preventDefault();
                        document.querySelector('a[href="#services"]')?.click();
                        break;
                    case '5':
                        e.preventDefault();
                        document.querySelector('a[href="#blog"]')?.click();
                        break;
                    case '6':
                        e.preventDefault();
                        document.querySelector('a[href="#contact"]')?.click();
                        break;
                }
            }
        });
    }
    
    /**
     * Enhance tab navigation
     */
    function enhanceTabNavigation() {
        // Add visible focus indicators for keyboard users
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-user *:focus {
                outline: 2px solid var(--accent-color, #38b2ac) !important;
                outline-offset: 2px !important;
            }
            
            .keyboard-user button:focus,
            .keyboard-user a:focus,
            .keyboard-user input:focus,
            .keyboard-user select:focus,
            .keyboard-user textarea:focus {
                box-shadow: 0 0 0 4px rgba(56, 178, 172, 0.2) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize on page load
    console.log('Accessibility enhancements loaded');
});