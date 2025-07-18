/**
 * ArcVantage Design Studios - Main JavaScript
 * Core functionality for navigation, smooth scrolling, and section highlighting
 * Enhanced with arc-inspired animations and hero section interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.getElementById('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav a, .footer-links a');
    const sections = document.querySelectorAll('.section');
    const heroSection = document.getElementById('hero');
    
    // Set header to transparent initially
    header.classList.add('header-transparent');
    
    // Load services data
    loadServicesData();
    
    // Mobile menu toggle functionality
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Prevent body scrolling when mobile menu is open
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Enhanced smooth scrolling for navigation links and CTA buttons
    const allScrollLinks = document.querySelectorAll('#main-nav a, .footer-links a, .hero-cta a');
    
    allScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate header height dynamically
                const headerHeight = header.offsetHeight;
                
                // Add a slight delay for visual effect on CTA buttons
                const isCtaButton = this.classList.contains('cta-button');
                const delay = isCtaButton ? 200 : 0;
                
                // Add active state to button if it's a CTA
                if (isCtaButton) {
                    this.classList.add('active');
                    setTimeout(() => {
                        this.classList.remove('active');
                    }, delay);
                }
                
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight, // Adjust for header height
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mainNav && mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Update active class on navigation links
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    
                    // Find and activate the corresponding nav link
                    const correspondingNavLink = document.querySelector(`#main-nav a[href="${targetId}"]`);
                    if (correspondingNavLink) {
                        correspondingNavLink.classList.add('active');
                    }
                }, delay);
            }
        });
    });
    
    // Enhanced header scroll effect with transparency
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.classList.remove('header-transparent');
        } else {
            header.classList.remove('scrolled');
            header.classList.add('header-transparent');
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavOnScroll();
        
        // Parallax effect for hero section
        if (heroSection) {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                // Apply parallax effect to hero background
                const heroBackground = heroSection.querySelector('.hero-background');
                if (heroBackground) {
                    heroBackground.style.transform = `translateY(${scrollPosition * 0.3}px)`;
                }
                
                // Apply parallax effect to hero content
                const heroContent = heroSection.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrollPosition * 0.15}px)`;
                    heroContent.style.opacity = 1 - (scrollPosition * 0.002);
                }
            }
        }
    }
    
    // Update active navigation based on scroll position
    function updateActiveNavOnScroll() {
        // Get current scroll position with a small offset for better UX
        const scrollPosition = window.scrollY + header.offsetHeight + 10;
        
        // Find the current section in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding navigation links
                const activeLinks = document.querySelectorAll(`a[href="#${sectionId}"]`);
                activeLinks.forEach(activeLink => activeLink.classList.add('active'));
            }
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initialize header state and active nav on page load
    handleScroll();
    
    // Handle window resize events for responsive behavior
    window.addEventListener('resize', function() {
        // Reset mobile menu state on window resize (especially important when switching from mobile to desktop)
        if (window.innerWidth >= 768 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
        
        // Recalculate hero section height on orientation change
        if (heroSection) {
            adjustHeroHeight();
        }
    });
    
    // Enhanced orientation change handling
    window.addEventListener('orientationchange', function() {
        // Add a small delay to allow the browser to update dimensions
        setTimeout(function() {
            // Reset mobile menu state
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            
            // Recalculate hero section height
            if (heroSection) {
                adjustHeroHeight();
            }
            
            // Trigger responsive layout updates
            handleResponsiveLayoutChanges();
            
            // Reset any flipped service cards
            const flippedCards = document.querySelectorAll('.service-card-inner.clicked');
            flippedCards.forEach(card => {
                card.classList.remove('clicked');
            });
            
            // Update viewport height for mobile browsers
            updateViewportHeight();
            
            // Trigger scroll handler to update header state
            handleScroll();
        }, 100);
    });
    
    // Handle viewport height changes for mobile browsers
    function updateViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Enhanced responsive layout handling
    function handleResponsiveLayoutChanges() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isDesktop = window.innerWidth >= 1024;
        
        // Update body class for responsive styling
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet);
        document.body.classList.toggle('desktop', isDesktop);
        
        // Adjust grid layouts based on screen size
        const grids = document.querySelectorAll('.services-grid, .projects-grid, .blog-grid');
        grids.forEach(grid => {
            if (isMobile) {
                grid.style.gridTemplateColumns = '1fr';
            } else if (isTablet) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else if (isDesktop) {
                if (grid.classList.contains('services-grid')) {
                    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
                } else {
                    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                }
            }
        });
        
        // Adjust modal sizes for different screen sizes
        const modals = document.querySelectorAll('.modal, .project-modal');
        modals.forEach(modal => {
            if (isMobile) {
                modal.style.width = '95vw';
                modal.style.height = '90vh';
            } else if (isTablet) {
                modal.style.width = '80vw';
                modal.style.height = '80vh';
            } else {
                modal.style.width = '70vw';
                modal.style.height = '70vh';
            }
        });
    }
    
    // Initialize viewport height and responsive layout
    updateViewportHeight();
    handleResponsiveLayoutChanges();
    
    // Enhanced touch interaction handling for all interactive elements
    function initializeTouchInteractions() {
        const serviceCards = document.querySelectorAll('.service-card');
        const projectCards = document.querySelectorAll('.project-card');
        const blogCards = document.querySelectorAll('.blog-card');
        const buttons = document.querySelectorAll('button, .btn, .cta-button');
        
        // Enhanced service cards touch handling
        serviceCards.forEach(card => {
            const cardInner = card.querySelector('.service-card-inner');
            let isFlipped = false;
            let touchStartTime = 0;
            let touchStartX = 0;
            let touchStartY = 0;
            
            // Handle touch start for better responsiveness
            card.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                
                // Add visual feedback
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            // Handle touch end
            card.addEventListener('touchend', function(e) {
                const touchEndTime = Date.now();
                const touchDuration = touchEndTime - touchStartTime;
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const touchDistance = Math.sqrt(
                    Math.pow(touchEndX - touchStartX, 2) + 
                    Math.pow(touchEndY - touchStartY, 2)
                );
                
                // Reset visual feedback
                this.style.transform = '';
                
                // Only trigger if it's a tap (short duration, minimal movement)
                if (touchDuration < 300 && touchDistance < 10) {
                    if (window.innerWidth < 1024) {
                        e.preventDefault();
                        
                        // Toggle flip state
                        if (isFlipped) {
                            cardInner.classList.remove('clicked');
                            isFlipped = false;
                        } else {
                            // Close other flipped cards first
                            serviceCards.forEach(otherCard => {
                                const otherCardInner = otherCard.querySelector('.service-card-inner');
                                if (otherCardInner) {
                                    otherCardInner.classList.remove('clicked');
                                }
                            });
                            
                            cardInner.classList.add('clicked');
                            isFlipped = true;
                        }
                    }
                }
            }, { passive: false });
            
            // Handle click events for mobile (fallback)
            card.addEventListener('click', function(e) {
                // Only handle flip on mobile/tablet (when hover is not available)
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    
                    // Toggle flip state
                    if (isFlipped) {
                        cardInner.classList.remove('clicked');
                        isFlipped = false;
                    } else {
                        // Close other flipped cards first
                        serviceCards.forEach(otherCard => {
                            const otherCardInner = otherCard.querySelector('.service-card-inner');
                            if (otherCardInner) {
                                otherCardInner.classList.remove('clicked');
                            }
                        });
                        
                        cardInner.classList.add('clicked');
                        isFlipped = true;
                    }
                }
            });
            
            // Handle keyboard navigation
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
        
        // Enhanced touch feedback for all buttons
        buttons.forEach(button => {
            let touchStartTime = 0;
            
            button.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
                this.style.transform = 'scale(0.95)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            button.addEventListener('touchend', function(e) {
                const touchDuration = Date.now() - touchStartTime;
                
                // Reset visual feedback
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
                
                // Add ripple effect for touch feedback
                if (touchDuration < 300) {
                    this.classList.add('touch-active');
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 200);
                }
            }, { passive: true });
        });
        
        // Enhanced project and blog card interactions
        [...projectCards, ...blogCards].forEach(card => {
            let touchStartTime = 0;
            
            card.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            card.addEventListener('touchend', function(e) {
                const touchDuration = Date.now() - touchStartTime;
                
                // Reset visual feedback
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }, { passive: true });
            
            // Reset flip state on window resize
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 1024) {
                    cardInner.classList.remove('clicked');
                    isFlipped = false;
                }
            });
        });
    }
    
    // Adjust hero section height for different orientations
    function adjustHeroHeight() {
        if (!heroSection) return;
        
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobile = window.innerWidth < 768;
        
        if (isMobile && isLandscape) {
            // In mobile landscape, use viewport height but ensure minimum height
            heroSection.style.minHeight = Math.max(window.innerHeight, 500) + 'px';
        } else {
            // Reset to CSS default
            heroSection.style.minHeight = '';
        }
    }
    
    // Initialize touch interactions after DOM is loaded
    setTimeout(initializeTouchInteractions, 100);
    
    // Initialize performance optimizations
    initPerformanceOptimizations();
    
    // Add animation to arc elements on mousemove for interactive effect
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            const arcElements = document.querySelectorAll('.arc-element');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            arcElements.forEach((arc, index) => {
                const offsetX = (mouseX - 0.5) * (10 + index * 5);
                const offsetY = (mouseY - 0.5) * (10 + index * 5);
                
                // Apply subtle movement based on mouse position
                arc.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }
    
    /**
     * Load services data from JSON file and populate the services section
     */
    function loadServicesData() {
        fetch('data/services.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Populate services grid
                populateServicesGrid(data.services);
                
                // Populate process steps
                populateProcessSteps(data.process);
                
                // Populate pricing tiers
                populatePricingTiers(data.pricing);
                
                // Populate consultation info
                populateConsultationInfo(data.consultation);
            })
            .catch(error => {
                console.error('Error loading services data:', error);
            });
    }
    
    /**
     * Populate the services grid with data from JSON
     * @param {Array} services - Array of service objects
     */
    function populateServicesGrid(services) {
        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid || !services) return;
        
        // Clear existing content
        servicesGrid.innerHTML = '';
        
        // Add each service card
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.setAttribute('data-service', service.id);
            serviceCard.setAttribute('tabindex', '0'); // Make focusable for accessibility
            
            serviceCard.innerHTML = `
                <div class="service-card-inner">
                    <div class="service-front">
                        <div class="service-icon">
                            <i class="fas fa-${service.icon}"></i>
                        </div>
                        <h3>${service.title}</h3>
                        <p>${service.shortDescription}</p>
                        <div class="service-more">
                            <span>Learn More</span>
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                    <div class="service-back">
                        <h4>${service.title}</h4>
                        <ul class="service-features">
                            ${service.features.map(feature => `
                                <li><i class="fas fa-check-circle"></i> ${feature}</li>
                            `).join('')}
                        </ul>
                        <p class="arc-integration">${service.arcIntegration}</p>
                        <div class="service-cta">
                            <a href="#contact" class="btn btn-outline">Get Started</a>
                        </div>
                    </div>
                </div>
            `;
            
            servicesGrid.appendChild(serviceCard);
        });
    }
    
    /**
     * Populate the process steps with data from JSON
     * @param {Array} processSteps - Array of process step objects
     */
    function populateProcessSteps(processSteps) {
        const processStepsContainer = document.querySelector('.process-steps');
        if (!processStepsContainer || !processSteps) return;
        
        // Clear existing content
        processStepsContainer.innerHTML = '';
        
        // Add each process step
        processSteps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.className = 'process-step';
            
            stepElement.innerHTML = `
                <div class="step-number">${step.step}</div>
                <div class="step-content">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                </div>
            `;
            
            processStepsContainer.appendChild(stepElement);
        });
    }
    
    /**
     * Populate the pricing tiers with data from JSON
     * @param {Array} pricingTiers - Array of pricing tier objects
     */
    function populatePricingTiers(pricingTiers) {
        const pricingContainer = document.querySelector('.pricing-tiers');
        if (!pricingContainer || !pricingTiers) return;
        
        // Clear existing content
        pricingContainer.innerHTML = '';
        
        // Add each pricing tier
        pricingTiers.forEach(tier => {
            const tierElement = document.createElement('div');
            tierElement.className = `pricing-tier${tier.featured ? ' featured' : ''}`;
            
            tierElement.innerHTML = `
                ${tier.featured ? '<div class="tier-badge">Most Popular</div>' : ''}
                <div class="tier-header">
                    <h4>${tier.tier}</h4>
                    <div class="tier-price">${tier.price}</div>
                </div>
                <div class="tier-features">
                    <ul>
                        ${tier.features.map(feature => `
                            <li><i class="fas fa-check"></i> ${feature}</li>
                        `).join('')}
                    </ul>
                </div>
                <div class="tier-cta">
                    <a href="#contact" class="${tier.featured ? 'btn' : 'btn btn-outline'}">${tier.tier === 'Signature' ? 'Request Quote' : 'Select Plan'}</a>
                </div>
            `;
            
            pricingContainer.appendChild(tierElement);
        });
    }
    
    /**
     * Populate the consultation information with data from JSON
     * @param {Object} consultationInfo - Consultation information object
     */
    function populateConsultationInfo(consultationInfo) {
        const consultationContainer = document.querySelector('.consultation-info');
        if (!consultationContainer || !consultationInfo) return;
        
        // Get consultation description container
        const descriptionContainer = consultationContainer.querySelector('.consultation-description');
        if (descriptionContainer) {
            // Clear existing content
            descriptionContainer.innerHTML = '';
            
            // Add title and description
            const titleElement = document.createElement('h4');
            titleElement.textContent = consultationInfo.title;
            descriptionContainer.appendChild(titleElement);
            
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = consultationInfo.description;
            descriptionContainer.appendChild(descriptionElement);
            
            // Add "What to Expect" section
            const whatToExpectTitle = document.createElement('h4');
            whatToExpectTitle.textContent = 'What to Expect';
            descriptionContainer.appendChild(whatToExpectTitle);
            
            // Add consultation steps
            const stepsList = document.createElement('ul');
            stepsList.className = 'consultation-steps';
            
            consultationInfo.steps.forEach(step => {
                const stepItem = document.createElement('li');
                stepItem.innerHTML = `
                    <span class="step-icon"><i class="fas fa-${step.icon}"></i></span>
                    <div class="step-text">
                        <h5>${step.title}</h5>
                        <p>${step.description}</p>
                    </div>
                `;
                stepsList.appendChild(stepItem);
            });
            
            descriptionContainer.appendChild(stepsList);
        }
        
        // Get consultation CTA container
        const ctaContainer = consultationContainer.querySelector('.consultation-cta');
        if (ctaContainer && consultationInfo.cta) {
            // Clear existing content
            ctaContainer.innerHTML = '';
            
            // Add CTA content
            const ctaTitleElement = document.createElement('h4');
            ctaTitleElement.textContent = consultationInfo.cta.title;
            ctaContainer.appendChild(ctaTitleElement);
            
            const ctaDescriptionElement = document.createElement('p');
            ctaDescriptionElement.textContent = consultationInfo.cta.description;
            ctaContainer.appendChild(ctaDescriptionElement);
            
            const ctaButton = document.createElement('a');
            ctaButton.href = '#contact';
            ctaButton.className = 'cta-button';
            ctaButton.textContent = 'Book Consultation';
            ctaContainer.appendChild(ctaButton);
        }
    }
});   
 // Initialize responsive design features
    function initializeResponsiveFeatures() {
        // Add resize event listener with debouncing
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                handleResponsiveLayoutChanges();
                updateViewportHeight();
            }, 250);
        });
        
        // Initialize responsive images
        initializeResponsiveImages();
        
        // Initialize touch gestures
        initializeTouchGestures();
        
        // Initialize responsive modals
        initializeResponsiveModals();
    }
    
    // Responsive image handling
    function initializeResponsiveImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add responsive class
            img.classList.add('responsive-image');
            
            // Add loading attribute for better performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Handle image load errors
            img.addEventListener('error', function() {
                this.src = 'images/placeholder.jpg'; // Fallback image
                this.alt = 'Image not available';
            });
        });
    }
    
    // Enhanced touch gesture handling
    function initializeTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        // Add swipe gesture support for modals
        const modals = document.querySelectorAll('.modal, .project-modal');
        
        modals.forEach(modal => {
            modal.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            modal.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                
                // Detect swipe down to close modal
                if (deltaY > 100 && Math.abs(deltaX) < 100) {
                    const closeButton = modal.querySelector('.close, .modal-close');
                    if (closeButton) {
                        closeButton.click();
                    }
                }
            }, { passive: true });
        });
    }
    
    // Responsive modal handling
    function initializeResponsiveModals() {
        const modals = document.querySelectorAll('.modal, .project-modal');
        
        modals.forEach(modal => {
            // Add responsive classes
            modal.classList.add('modal-responsive');
        });
    }
    
    /**
     * Initialize performance optimizations
     */
    function initPerformanceOptimizations() {
        // Preload critical resources
        preloadCriticalResources();
        
        // Initialize image optimization
        optimizeImages();
        
        // Setup performance monitoring
        setupPerformanceMonitoring();
        
        // Initialize resource hints
        addResourceHints();
        
        // Optimize animations for performance
        optimizeAnimations();
        
        // Initialize responsive features
        initializeResponsiveFeatures();
    }
    
    /**
     * Preload critical resources for better performance
     */
    function preloadCriticalResources() {
        // Preload hero background image
        const heroImage = new Image();
        heroImage.src = 'images/hero/hero-background.jpg';
        
        // Preload critical project images
        const criticalImages = [
            'images/projects/project1-main.jpg',
            'images/projects/project2-main.jpg',
            'images/projects/project3-main.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        
        // Preload data files
        if ('fetch' in window) {
            fetch('data/projects.json').catch(() => {});
            fetch('data/services.json').catch(() => {});
            fetch('data/blog-posts.json').catch(() => {});
        }
    }
    
    /**
     * Optimize images for better performance
     */
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add intersection observer for lazy loading
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decode attribute for better performance
            img.setAttribute('decoding', 'async');
            
            // Optimize image rendering
            img.style.imageRendering = 'auto';
            
            // Add error handling
            img.addEventListener('error', function() {
                this.style.display = 'none';
                console.warn('Failed to load image:', this.src);
            });
        });
    }
    
    /**
     * Setup performance monitoring
     */
    function setupPerformanceMonitoring() {
        // Monitor page load performance
        if ('performance' in window && 'getEntriesByType' in performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    if (navigation) {
                        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
                        console.log(`Page load time: ${loadTime}ms`);
                        
                        // Log slow loading if over 3 seconds
                        if (loadTime > 3000) {
                            console.warn('Page load time exceeds 3 seconds');
                        }
                    }
                }, 0);
            });
        }
        
        // Monitor largest contentful paint
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // Silently fail if not supported
            }
        }
    }
    
    /**
     * Add resource hints for better performance
     */
    function addResourceHints() {
        const head = document.head;
        
        // DNS prefetch for external resources
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = '//fonts.googleapis.com';
        head.appendChild(dnsPrefetch);
        
        // Preconnect to font resources
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = 'https://fonts.gstatic.com';
        preconnect.crossOrigin = 'anonymous';
        head.appendChild(preconnect);
    }
    
    /**
     * Optimize animations for better performance
     */
    function optimizeAnimations() {
        // Use CSS transforms instead of changing layout properties
        const animatedElements = document.querySelectorAll('.arc-element, .hero-content');
        
        animatedElements.forEach(element => {
            // Enable hardware acceleration
            element.style.willChange = 'transform';
            element.style.transform = 'translateZ(0)';
        });
        
        // Reduce motion for users who prefer it
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-normal', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
            
            // Disable parallax effects
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                heroSection.removeEventListener('mousemove', () => {});
            }
        }
    } classes
            modal.classList.add('modal-responsive');
            
            // Handle modal positioning on mobile
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (modal.style.display === 'block' || modal.style.display === 'flex') {
                            adjustModalForMobile(modal);
                        }
                    }
                });
            });
            
            observer.observe(modal, { attributes: true });
        });
    }
    
    // Adjust modal for mobile devices
    function adjustModalForMobile(modal) {
        const isMobile = window.innerWidth < 768;
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isMobile) {
            modal.style.width = '95vw';
            modal.style.height = isLandscape ? '90vh' : '85vh';
            modal.style.maxHeight = '90vh';
            modal.style.margin = '5vh auto';
            
            // Ensure modal content is scrollable
            const modalContent = modal.querySelector('.modal-content, .project-modal-content');
            if (modalContent) {
                modalContent.style.maxHeight = '100%';
                modalContent.style.overflowY = 'auto';
            }
        }
    }
    
    // Performance optimization for mobile
    function optimizeForMobile() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Reduce animation complexity on mobile
            const arcElements = document.querySelectorAll('.arc-element');
            arcElements.forEach(element => {
                element.style.animationDuration = '30s';
            });
            
            // Optimize background images
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.backgroundAttachment = 'scroll';
            }
            
            // Reduce shadow complexity
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.style.boxShadow = 'var(--shadow-sm)';
            });
        }
    }
    
    // Initialize all responsive features
    initializeResponsiveFeatures();
    optimizeForMobile();
    
    // Re-optimize on resize
    window.addEventListener('resize', function() {
        setTimeout(optimizeForMobile, 100);
    });