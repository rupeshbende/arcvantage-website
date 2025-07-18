/**
 * ArcVantage Design Studios - Services JavaScript
 * Handles interactive elements for the services section
 * Including card flipping, tab switching, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceTabs = document.querySelectorAll('.service-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const servicesSection = document.querySelector('.services-section');
    
    // Initialize services functionality
    initServices();
    
    /**
     * Initialize services section functionality
     */
    function initServices() {
        // Set up service card interactions
        setupServiceCards();
        
        // Set up tab switching
        setupTabSwitching();
        
        // Add scroll animations
        setupScrollAnimations();
        
        // Add arc-inspired hover effects
        setupArcEffects();
        
        // Add interactive particle effects
        setupParticleEffects();
        
        // Add interactive arc elements that follow mouse movement
        setupInteractiveArcs();
    }
    
    /**
     * Set up service card interactions
     */
    function setupServiceCards() {
        serviceCards.forEach(card => {
            // Add click event for mobile touch support (in addition to hover)
            card.addEventListener('click', function() {
                // Toggle flip class for mobile
                if (window.innerWidth < 768) {
                    this.querySelector('.service-card-inner').classList.toggle('clicked');
                }
                
                // Get the service type for detailed view
                const serviceType = this.getAttribute('data-service');
                if (serviceType && window.innerWidth >= 768) {
                    // For desktop, clicking a card should show its details
                    showServiceDetail(serviceType);
                }
            });
            
            // Add keyboard navigation and accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View details for ${card.querySelector('h3').textContent} service`);
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.querySelector('.service-card-inner').classList.toggle('clicked');
                    
                    // Get the service type for detailed view
                    const serviceType = this.getAttribute('data-service');
                    if (serviceType) {
                        showServiceDetail(serviceType);
                    }
                }
            });
            
            // Get the service type
            const serviceType = card.getAttribute('data-service');
            
            // Add hover effect with subtle background
            if (serviceType) {
                // Create a background image element for hover effect
                const bgImage = document.createElement('div');
                bgImage.className = 'service-bg-image';
                
                // Use service-specific image if available, otherwise use placeholder
                let imagePath = `/images/projects/placeholder.jpg`;
                
                // Try to match service type with project images
                if (serviceType === 'residential') {
                    imagePath = `/images/projects/project1-main.jpg`;
                } else if (serviceType === 'commercial') {
                    imagePath = `/images/projects/project2-main.jpg`;
                } else if (serviceType === 'interior') {
                    imagePath = `/images/projects/project3-main.jpg`;
                } else if (serviceType === 'landscape') {
                    imagePath = `/images/projects/project5-outdoor.jpg`;
                }
                
                bgImage.style.backgroundImage = `url('${imagePath}')`;
                
                // Add to front of card
                const frontCard = card.querySelector('.service-front');
                if (frontCard) {
                    frontCard.appendChild(bgImage);
                }
            }
            
            // Add interactive hover effects for desktop
            if (window.innerWidth >= 768) {
                card.addEventListener('mousemove', function(e) {
                    // Calculate mouse position relative to card
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left; // x position within the element
                    const y = e.clientY - rect.top;  // y position within the element
                    
                    // Calculate rotation based on mouse position
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    // Limit rotation to a small amount for subtle effect
                    const rotateX = ((y - centerY) / centerY) * 5; // Max 5 degrees
                    const rotateY = ((centerX - x) / centerX) * 5; // Max 5 degrees
                    
                    // Apply 3D rotation to card
                    const cardInner = this.querySelector('.service-card-inner');
                    if (!cardInner.classList.contains('clicked')) {
                        cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    }
                    
                    // Add highlight effect based on mouse position
                    const icon = this.querySelector('.service-icon');
                    if (icon) {
                        const iconRect = icon.getBoundingClientRect();
                        const iconCenterX = iconRect.left + iconRect.width / 2;
                        const iconCenterY = iconRect.top + iconRect.height / 2;
                        const distance = Math.sqrt(
                            Math.pow(e.clientX - iconCenterX, 2) + 
                            Math.pow(e.clientY - iconCenterY, 2)
                        );
                        
                        // Add glow effect when mouse is near icon
                        if (distance < 100) {
                            icon.style.boxShadow = `0 0 20px rgba(214, 158, 46, ${0.5 - distance/200})`;
                        } else {
                            icon.style.boxShadow = 'none';
                        }
                    }
                    
                    // Add dynamic text shadow effect
                    const title = this.querySelector('h3');
                    if (title) {
                        const offsetX = (x - centerX) / 20;
                        const offsetY = (y - centerY) / 20;
                        title.style.textShadow = `${offsetX}px ${offsetY}px 5px rgba(26, 54, 93, 0.2)`;
                    }
                });
                
                // Reset card on mouse leave
                card.addEventListener('mouseleave', function() {
                    const cardInner = this.querySelector('.service-card-inner');
                    cardInner.style.transform = '';
                    
                    const icon = this.querySelector('.service-icon');
                    if (icon) {
                        icon.style.boxShadow = 'none';
                    }
                    
                    const title = this.querySelector('h3');
                    if (title) {
                        title.style.textShadow = '';
                    }
                });
            }
        });
    }
    
    /**
     * Set up tab switching functionality with enhanced animations
     */
    function setupTabSwitching() {
        serviceTabs.forEach(tab => {
            // Add ARIA attributes for accessibility
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
            
            tab.addEventListener('click', function() {
                // If already active, do nothing
                if (this.classList.contains('active')) {
                    return;
                }
                
                // Remove active class from all tabs and update ARIA
                serviceTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                
                // Add active class to clicked tab and update ARIA
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Get tab target
                const tabTarget = this.getAttribute('data-tab');
                
                // Get current active pane for transition
                const currentPane = document.querySelector('.tab-pane.active');
                
                // Prepare for transition
                if (currentPane) {
                    // Add exit animation class
                    currentPane.classList.add('fade-out');
                    
                    // After exit animation completes
                    setTimeout(() => {
                        // Hide all tab panes
                        tabPanes.forEach(pane => {
                            pane.classList.remove('active');
                            pane.classList.remove('fade-out');
                        });
                        
                        // Show target tab pane
                        const targetPane = document.getElementById(`${tabTarget}-tab`);
                        if (targetPane) {
                            targetPane.classList.add('active');
                            
                            // Trigger animations for elements inside the new tab
                            animateTabContent(targetPane);
                        }
                    }, 300); // Match this to CSS transition time
                } else {
                    // No current active pane, just show the new one
                    tabPanes.forEach(pane => pane.classList.remove('active'));
                    
                    const targetPane = document.getElementById(`${tabTarget}-tab`);
                    if (targetPane) {
                        targetPane.classList.add('active');
                        animateTabContent(targetPane);
                    }
                }
                
                // Add ripple effect to tab
                createRippleEffect(this, event);
            });
            
            // Add keyboard navigation support
            tab.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const currentIndex = Array.from(serviceTabs).indexOf(this);
                    let nextIndex;
                    
                    if (e.key === 'ArrowLeft') {
                        nextIndex = currentIndex > 0 ? currentIndex - 1 : serviceTabs.length - 1;
                    } else {
                        nextIndex = currentIndex < serviceTabs.length - 1 ? currentIndex + 1 : 0;
                    }
                    
                    serviceTabs[nextIndex].focus();
                }
            });
        });
    }
    
    /**
     * Create ripple effect on element click
     * @param {HTMLElement} element - The element to add ripple effect to
     * @param {Event} event - The click event
     */
    function createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600); // Match to animation duration
    }
    
    /**
     * Animate elements inside a tab when it becomes active
     * @param {HTMLElement} tabPane - The tab pane to animate content for
     */
    function animateTabContent(tabPane) {
        // Find elements to animate
        const animatableElements = tabPane.querySelectorAll('.process-step, .pricing-tier, .consultation-steps li');
        
        // Add staggered animation
        animatableElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, 100 * index); // Stagger animations by 100ms
        });
    }
    
    /**
     * Set up scroll animations for service elements
     */
    function setupScrollAnimations() {
        // Elements to observe for scroll animations
        const animatedElements = document.querySelectorAll('.process-step, .pricing-tier, .consultation-steps li');
        
        // Create intersection observer for animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animated class with delay based on index
                    const index = Array.from(animatedElements).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, 100 * (index % 4)); // Stagger by groups of 4
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element comes into view
        });
        
        // Observe each element
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    /**
     * Set up arc-inspired interactive effects
     */
    function setupArcEffects() {
        // Add arc-inspired decorative elements
        const servicesSection = document.querySelector('.services-section');
        if (servicesSection) {
            // Create arc decorators
            const arcDecorator1 = document.createElement('div');
            arcDecorator1.className = 'arc-decorator services-arc-1';
            
            const arcDecorator2 = document.createElement('div');
            arcDecorator2.className = 'arc-decorator services-arc-2';
            
            // Add to services section
            servicesSection.appendChild(arcDecorator1);
            servicesSection.appendChild(arcDecorator2);
            
            // Interactive effect on mouse movement
            servicesSection.addEventListener('mousemove', function(e) {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                // Move arc decorators based on mouse position
                arcDecorator1.style.transform = `rotate(${mouseX * 20}deg) translateX(${(mouseX - 0.5) * 50}px)`;
                arcDecorator2.style.transform = `rotate(${-mouseY * 20}deg) translateY(${(mouseY - 0.5) * 50}px)`;
            });
        }
        
        // Add interactive effects to pricing tiers
        const pricingTiers = document.querySelectorAll('.pricing-tier');
        pricingTiers.forEach(tier => {
            tier.addEventListener('mouseenter', function() {
                // Add arc highlight to featured tier
                if (this.classList.contains('featured')) {
                    this.style.boxShadow = `0 10px 30px rgba(214, 158, 46, 0.3), 
                                           0 0 0 2px rgba(214, 158, 46, 0.5)`;
                } else {
                    this.style.boxShadow = `0 10px 20px rgba(26, 54, 93, 0.2)`;
                }
            });
            
            tier.addEventListener('mouseleave', function() {
                // Reset shadow
                this.style.boxShadow = '';
            });
        });
        
        // Add interactive effects to process steps
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach(step => {
            step.addEventListener('mouseenter', function() {
                const stepNumber = this.querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.transform = 'scale(1.1) rotate(10deg)';
                }
            });
            
            step.addEventListener('mouseleave', function() {
                const stepNumber = this.querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.transform = '';
                }
            });
        });
    }
    
    /**
     * Set up particle effects for service section
     */
    function setupParticleEffects() {
        const servicesSection = document.querySelector('.services-section');
        if (!servicesSection) return;
        
        // Create canvas for particles
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        canvas.style.opacity = '0.3';
        
        // Insert canvas as first child of services section
        servicesSection.insertBefore(canvas, servicesSection.firstChild);
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = servicesSection.offsetWidth;
            canvas.height = servicesSection.offsetHeight;
        };
        
        // Call resize initially and on window resize
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Get canvas context
        const ctx = canvas.getContext('2d');
        
        // Particle class
        class Particle {
            constructor(x, y, size, color) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) {
                    this.speedX = -this.speedX;
                }
                
                if (this.y < 0 || this.y > canvas.height) {
                    this.speedY = -this.speedY;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Create particles
        const particles = [];
        const particleCount = Math.min(Math.floor(canvas.width * canvas.height / 20000), 50);
        
        // Primary color particles (navy)
        const primaryColor = '26, 54, 93'; // RGB for --primary-color
        // Secondary color particles (gold)
        const secondaryColor = '214, 158, 46'; // RGB for --secondary-color
        // Accent color particles (teal)
        const accentColor = '56, 178, 172'; // RGB for --accent-color
        
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 3 + 1;
            
            // Randomly choose color
            const colorIndex = Math.floor(Math.random() * 3);
            let color;
            
            switch (colorIndex) {
                case 0:
                    color = primaryColor;
                    break;
                case 1:
                    color = secondaryColor;
                    break;
                case 2:
                    color = accentColor;
                    break;
                default:
                    color = primaryColor;
            }
            
            particles.push(new Particle(x, y, size, color));
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections between particles
            drawConnections();
            
            requestAnimationFrame(animate);
        }
        
        // Draw connections between nearby particles
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Only connect particles within a certain distance
                    if (distance < 100) {
                        // Opacity based on distance
                        const opacity = 0.1 * (1 - distance / 100);
                        
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(214, 158, 46, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Start animation
        animate();
        
        // Add mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let isMouseInSection = false;
        
        servicesSection.addEventListener('mousemove', function(e) {
            const rect = servicesSection.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isMouseInSection = true;
            
            // Create ripple effect on mouse move
            if (Math.random() < 0.05) { // Limit the frequency of ripples
                createRippleParticle(mouseX, mouseY);
            }
        });
        
        servicesSection.addEventListener('mouseleave', function() {
            isMouseInSection = false;
        });
        
        // Create ripple particle at mouse position
        function createRippleParticle(x, y) {
            const ripple = {
                x: x,
                y: y,
                size: 0,
                maxSize: Math.random() * 50 + 30,
                opacity: 0.5,
                color: Math.random() < 0.5 ? secondaryColor : accentColor
            };
            
            function animateRipple() {
                ripple.size += 2;
                ripple.opacity -= 0.01;
                
                if (ripple.size < ripple.maxSize && ripple.opacity > 0) {
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, ripple.size, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${ripple.color}, ${ripple.opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    
                    requestAnimationFrame(animateRipple);
                }
            }
            
            animateRipple();
        }
    }
    
    /**
     * Handle service card click for detailed view
     * @param {string} serviceType - Type of service clicked
     */
    function showServiceDetail(serviceType) {
        console.log(`Show detailed view for ${serviceType} service`);
        
        // Scroll to service details section
        const serviceDetailsContainer = document.querySelector('.service-details-container');
        if (serviceDetailsContainer) {
            // Smooth scroll to details
            serviceDetailsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Highlight the process tab by default
            const processTab = document.querySelector('.service-tab[data-tab="process"]');
            if (processTab) {
                // Simulate click on process tab
                processTab.click();
            }
            
            // Add a subtle highlight effect to the details container
            serviceDetailsContainer.style.boxShadow = '0 0 30px rgba(56, 178, 172, 0.2)';
            setTimeout(() => {
                serviceDetailsContainer.style.boxShadow = '';
            }, 1500);
        }
    }
    
    /**
     * Set up interactive arc elements that follow mouse movement
     */
    function setupInteractiveArcs() {
        const servicesSection = document.querySelector('.services-section');
        if (!servicesSection) return;
        
        // Create interactive arc elements
        const arcCount = 3;
        for (let i = 0; i < arcCount; i++) {
            const arc = document.createElement('div');
            arc.className = `interactive-arc interactive-arc-${i+1}`;
            
            // Set initial position and size
            const size = 100 + (i * 50); // Increasing sizes
            arc.style.width = `${size}px`;
            arc.style.height = `${size}px`;
            
            // Add to services section
            servicesSection.appendChild(arc);
        }
        
        // Add mouse move event to animate arcs
        servicesSection.addEventListener('mousemove', function(e) {
            const rect = servicesSection.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Get all interactive arcs
            const arcs = document.querySelectorAll('.interactive-arc');
            
            // Animate each arc with different delay and distance
            arcs.forEach((arc, index) => {
                const delay = index * 0.2; // Staggered delay
                const distance = index * 20; // Different distances from mouse
                
                // Calculate position with delay
                setTimeout(() => {
                    arc.style.transform = `translate(${mouseX - arc.offsetWidth/2}px, ${mouseY - arc.offsetHeight/2}px)`;
                }, delay * 1000);
            });
        });
    }
    
    // Make functions available globally if needed
    window.showServiceDetail = showServiceDetail;
});