/**
 * ArcVantage Design Studios - Projects Gallery JavaScript
 * Handles loading, filtering, and displaying projects in a responsive grid layout
 * Includes modal/lightbox functionality for detailed project views
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const projectsGrid = document.querySelector('.projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // State
    let projects = [];
    let currentFilter = 'all';
    
    // Show initial loading state
    showProjectsLoadingState();
    
    // Initialize the projects gallery
    initProjectsGallery();
    
    /**
     * Initialize the projects gallery by loading data and setting up event listeners
     */
    async function initProjectsGallery() {
        try {
            // Load project data
            projects = await loadProjectData();
            
            // Render projects
            renderProjects(projects);
            
            // Set up filter buttons
            setupFilterButtons();
            
            // Set up modal functionality
            setupModalFunctionality();
            
        } catch (error) {
            console.error('Error initializing projects gallery:', error);
            projectsGrid.innerHTML = '<p class="error-message">Unable to load projects. Please try again later.</p>';
        }
    }
    
    /**
     * Load project data from JSON file
     * @returns {Promise<Array>} Array of project objects
     */
    async function loadProjectData() {
        try {
            const response = await fetch('/data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.projects;
        } catch (error) {
            console.error('Error loading project data:', error);
            throw error;
        }
    }
    
    /**
     * Render projects in the grid
     * @param {Array} projectsToRender - Array of project objects to render
     */
    function renderProjects(projectsToRender) {
        // Clear existing projects and loading states
        projectsGrid.innerHTML = '';
        projectsGrid.classList.remove('loading');
        
        if (projectsToRender.length === 0) {
            projectsGrid.innerHTML = '<p class="no-results">No projects found matching your criteria.</p>';
            return;
        }
        
        // Create project items
        projectsToRender.forEach(project => {
            const projectElement = createProjectElement(project);
            projectsGrid.appendChild(projectElement);
        });
        
        // Initialize lazy loading for images
        initLazyLoading();
        
        // Initialize masonry layout after images are loaded
        initMasonryLayout();
    }
    
    /**
     * Create a project element for the grid
     * @param {Object} project - Project data object
     * @returns {HTMLElement} Project element
     */
    function createProjectElement(project) {
        const projectElement = document.createElement('div');
        projectElement.className = `project-item ${project.category}`;
        projectElement.setAttribute('data-project-id', project.id);
        
        // Create placeholder image URL (in a real project, you would use actual image paths)
        const imagePath = project.images && project.images.length > 0 
            ? `/images/projects/${project.images[0]}` 
            : `/images/projects/placeholder.jpg`;
        
        projectElement.innerHTML = `
            <div class="project-card">
                <div class="project-image">
                    <img data-src="${imagePath}" alt="${project.title}" class="lazy-load" loading="lazy">
                    <div class="image-placeholder">
                        <div class="skeleton-loader"></div>
                    </div>
                    <div class="project-overlay">
                        <div class="project-category">${project.category}</div>
                        <button class="view-project-btn" aria-label="View project details">
                            <i class="fas fa-search-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <span class="project-location"><i class="fas fa-map-marker-alt"></i> ${project.location}</span>
                        <span class="project-date"><i class="fas fa-calendar-alt"></i> ${formatDate(project.completionDate)}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add click event to open modal
        projectElement.querySelector('.view-project-btn').addEventListener('click', (e) => {
            e.preventDefault();
            openProjectModal(project);
        });
        
        // Also make the whole card clickable
        projectElement.querySelector('.project-card').addEventListener('click', (e) => {
            // Don't trigger if clicking on the button (it has its own handler)
            if (!e.target.closest('.view-project-btn')) {
                openProjectModal(project);
            }
        });
        
        return projectElement;
    }
    
    /**
     * Format date string to a more readable format
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    }
    
    /**
     * Set up filter button functionality
     */
    function setupFilterButtons() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Get filter value
                const filterValue = button.getAttribute('data-filter');
                currentFilter = filterValue;
                
                // Filter projects
                filterProjects(filterValue);
            });
        });
    }
    
    /**
     * Filter projects based on category
     * @param {string} category - Category to filter by
     */
    function filterProjects(category) {
        const filteredProjects = category === 'all' 
            ? projects 
            : projects.filter(project => project.category === category);
        
        renderProjects(filteredProjects);
    }
    
    /**
     * Initialize masonry layout for the projects grid
     */
    function initMasonryLayout() {
        // Wait for images to load before initializing masonry
        const images = projectsGrid.querySelectorAll('img');
        let loadedImages = 0;
        
        // If no images, don't wait
        if (images.length === 0) {
            applyMasonryLayout();
            return;
        }
        
        // Wait for all images to load
        images.forEach(img => {
            if (img.complete) {
                imageLoaded();
            } else {
                img.addEventListener('load', imageLoaded);
                img.addEventListener('error', imageLoaded);
            }
        });
        
        function imageLoaded() {
            loadedImages++;
            if (loadedImages === images.length) {
                applyMasonryLayout();
            }
        }
    }
    
    /**
     * Apply masonry layout using CSS Grid with auto-placement
     */
    function applyMasonryLayout() {
        // Add a class to indicate layout is ready
        projectsGrid.classList.add('masonry-loaded');
        
        // Add animation to project items
        const projectItems = projectsGrid.querySelectorAll('.project-item');
        projectItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, 100 * index);
        });
    }
    
    /**
     * Set up modal/lightbox functionality
     */
    function setupModalFunctionality() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('project-modal')) {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'project-modal';
            modalContainer.className = 'project-modal';
            modalContainer.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <button class="modal-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-content">
                        <!-- Content will be dynamically inserted here -->
                    </div>
                </div>
            `;
            document.body.appendChild(modalContainer);
            
            // Add event listeners for modal
            const modalOverlay = modalContainer.querySelector('.modal-overlay');
            const closeButton = modalContainer.querySelector('.modal-close');
            
            modalOverlay.addEventListener('click', closeProjectModal);
            closeButton.addEventListener('click', closeProjectModal);
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
                    closeProjectModal();
                }
            });
        }
    }
    
    /**
     * Open project modal with detailed view
     * @param {Object} project - Project data object
     */
    function openProjectModal(project) {
        const modalContent = document.querySelector('#project-modal .modal-content');
        
        // Create image gallery HTML
        let galleryHTML = '';
        if (project.images && project.images.length > 0) {
            galleryHTML = `
                <div class="project-gallery">
                    <div class="gallery-main">
                        <img src="/images/projects/${project.images[0]}" alt="${project.title}" class="main-image">
                    </div>
                    ${project.images.length > 1 ? `
                        <div class="gallery-thumbnails">
                            ${project.images.map((image, index) => `
                                <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image-index="${index}">
                                    <img src="/images/projects/${image}" alt="${project.title} - Image ${index + 1}">
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Create features HTML
        let featuresHTML = '';
        if (project.features && project.features.length > 0) {
            featuresHTML = `
                <div class="project-features">
                    <h4>Key Features</h4>
                    <ul>
                        ${project.features.map(feature => `<li><i class="fas fa-check-circle"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Populate modal content
        modalContent.innerHTML = `
            <div class="project-modal-content">
                <div class="project-modal-header">
                    <h2>${project.title}</h2>
                    <div class="project-meta">
                        <span class="project-category"><i class="fas fa-tag"></i> ${project.category}</span>
                        <span class="project-location"><i class="fas fa-map-marker-alt"></i> ${project.location}</span>
                        <span class="project-date"><i class="fas fa-calendar-alt"></i> ${formatDate(project.completionDate)}</span>
                    </div>
                </div>
                
                <div class="project-modal-body">
                    ${galleryHTML}
                    
                    <div class="project-details">
                        <div class="project-description">
                            ${project.fullDescription.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                        </div>
                        
                        ${featuresHTML}
                    </div>
                </div>
                
                <div class="project-modal-footer">
                    <a href="#contact" class="cta-button modal-cta" onclick="closeProjectModal()">Discuss Your Project</a>
                </div>
            </div>
        `;
        
        // Add gallery thumbnail functionality if there are multiple images
        if (project.images && project.images.length > 1) {
            const thumbnails = modalContent.querySelectorAll('.thumbnail');
            const mainImage = modalContent.querySelector('.main-image');
            
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', () => {
                    // Update active thumbnail
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                    
                    // Update main image
                    const imageIndex = thumbnail.getAttribute('data-image-index');
                    mainImage.src = `/images/projects/${project.images[imageIndex]}`;
                    mainImage.alt = `${project.title} - Image ${parseInt(imageIndex) + 1}`;
                    
                    // Add a subtle animation to the main image
                    mainImage.classList.add('image-transition');
                    setTimeout(() => {
                        mainImage.classList.remove('image-transition');
                    }, 300);
                });
            });
        }
        
        // Open modal with animation
        const modal = document.getElementById('project-modal');
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        
        // Scroll to top of modal content
        modalContent.scrollTop = 0;
    }
    
    /**
     * Close project modal
     */
    function closeProjectModal() {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
    }
    
    // Make closeProjectModal available globally for the CTA button
    window.closeProjectModal = closeProjectModal;
    
    // Handle responsive behavior
    function handleResponsiveLayout() {
        // Adjust modal size for mobile
        const modal = document.getElementById('project-modal');
        if (modal) {
            const modalContainer = modal.querySelector('.modal-container');
            if (window.innerWidth < 768) {
                modalContainer.style.width = '95%';
                modalContainer.style.height = '95%';
                modalContainer.style.maxHeight = '95vh';
            } else {
                modalContainer.style.width = '';
                modalContainer.style.height = '';
                modalContainer.style.maxHeight = '';
            }
        }
        
        // Adjust grid layout based on screen size
        if (projectsGrid) {
            const screenWidth = window.innerWidth;
            let columns = 1;
            
            if (screenWidth >= 1200) {
                columns = 4;
            } else if (screenWidth >= 1024) {
                columns = 3;
            } else if (screenWidth >= 768) {
                columns = 2;
            } else {
                columns = 1;
            }
            
            projectsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        }
    }
    
    // Add resize event listener
    window.addEventListener('resize', handleResponsiveLayout);
    window.addEventListener('orientationchange', function() {
        setTimeout(handleResponsiveLayout, 100);
    });
    
    // Initialize responsive layout
    handleResponsiveLayout();
    
    /**
     * Show loading state for projects section
     */
    function showProjectsLoadingState() {
        if (!projectsGrid) return;
        
        projectsGrid.classList.add('loading');
        projectsGrid.innerHTML = `
            <div class="content-loading">
                <div class="loading-spinner large"></div>
                <div class="loading-message">Loading projects...</div>
            </div>
        `;
        
        // Add skeleton cards for better UX after a short delay
        setTimeout(() => {
            if (projectsGrid.querySelector('.content-loading')) {
                projectsGrid.innerHTML = '';
                for (let i = 0; i < 6; i++) {
                    const skeletonCard = createSkeletonProjectCard();
                    projectsGrid.appendChild(skeletonCard);
                }
            }
        }, 500);
    }
    
    /**
     * Create skeleton project card for loading state
     * @returns {HTMLElement} Skeleton project card element
     */
    function createSkeletonProjectCard() {
        const skeletonElement = document.createElement('div');
        skeletonElement.className = 'project-item skeleton-card';
        
        skeletonElement.innerHTML = `
            <div class="project-card">
                <div class="project-image">
                    <div class="skeleton-loader"></div>
                </div>
                <div class="project-info">
                    <div class="text-skeleton line long"></div>
                    <div class="text-skeleton line medium"></div>
                    <div class="text-skeleton line short"></div>
                    <div class="project-meta">
                        <div class="text-skeleton line short"></div>
                        <div class="text-skeleton line short"></div>
                    </div>
                </div>
            </div>
        `;
        
        return skeletonElement;
    }
    
    /**
     * Initialize lazy loading for images using Intersection Observer
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-load');
        
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const placeholder = img.nextElementSibling;
                        
                        // Load the image
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-load');
                        img.classList.add('loading');
                        
                        // Handle image load success
                        img.addEventListener('load', () => {
                            img.classList.remove('loading');
                            img.classList.add('loaded');
                            if (placeholder && placeholder.classList.contains('image-placeholder')) {
                                placeholder.style.display = 'none';
                            }
                        });
                        
                        // Handle image load error
                        img.addEventListener('error', () => {
                            img.classList.remove('loading');
                            img.classList.add('error');
                            img.src = '/images/projects/placeholder.jpg';
                            if (placeholder && placeholder.classList.contains('image-placeholder')) {
                                placeholder.innerHTML = '<div class="error-placeholder">Image not available</div>';
                            }
                        });
                        
                        // Stop observing this image
                        observer.unobserve(img);
                    }
                });
            }, {
                // Load images when they're 100px away from viewport
                rootMargin: '100px 0px',
                threshold: 0.01
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without Intersection Observer
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy-load');
            });
        }
    }
});