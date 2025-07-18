/**
 * ArcVantage Design Studios - Blog System JavaScript
 * Handles loading, filtering, searching, and displaying blog posts
 * Includes modal/overlay functionality for reading complete posts
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const blogGrid = document.querySelector('.blog-grid');
    const searchInput = document.querySelector('.blog-search input');
    const searchButton = document.querySelector('.blog-search button');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // State
    let blogPosts = [];
    let currentCategory = 'all';
    let searchQuery = '';
    
    // Show loading state initially
    showBlogLoadingState();
    
    // Initialize the blog system
    initBlogSystem();
    
    /**
     * Initialize the blog system by loading data and setting up event listeners
     */
    async function initBlogSystem() {
        try {
            // Load blog data
            blogPosts = await loadBlogData();
            
            // Render blog posts
            renderBlogPosts(blogPosts);
            
            // Set up search functionality
            setupSearch();
            
            // Set up category filtering
            setupCategoryFilters();
            
            // Set up modal functionality
            setupModalFunctionality();
            
        } catch (error) {
            console.error('Error initializing blog system:', error);
            if (blogGrid) {
                blogGrid.innerHTML = '<p class="error-message">Unable to load blog posts. Please try again later.</p>';
            }
        }
    }
    
    /**
     * Load blog data from JSON file
     * @returns {Promise<Array>} Array of blog post objects
     */
    async function loadBlogData() {
        try {
            const response = await fetch('/data/blog-posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.posts;
        } catch (error) {
            console.error('Error loading blog data:', error);
            throw error;
        }
    }
    
    /**
     * Render blog posts in the grid
     * @param {Array} postsToRender - Array of blog post objects to render
     */
    function renderBlogPosts(postsToRender) {
        // Clear existing posts
        if (!blogGrid) return;
        blogGrid.innerHTML = '';
        
        if (postsToRender.length === 0) {
            blogGrid.innerHTML = '<p class="no-results">No blog posts found matching your criteria.</p>';
            return;
        }
        
        // Create blog post cards
        postsToRender.forEach(post => {
            const postElement = createBlogPostElement(post);
            blogGrid.appendChild(postElement);
        });
        
        // Add animation to blog posts
        animateBlogPosts();
    }
    
    /**
     * Create a blog post element for the grid
     * @param {Object} post - Blog post data object
     * @returns {HTMLElement} Blog post element
     */
    function createBlogPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = `blog-post ${post.category}`;
        postElement.setAttribute('data-post-id', post.id);
        
        // Create image URL (in a real project, you would use actual image paths)
        const imagePath = post.featuredImage 
            ? `/images/blog/${post.featuredImage}` 
            : `/images/projects/placeholder.jpg`;
        
        postElement.innerHTML = `
            <div class="blog-card">
                <div class="blog-image">
                    <img src="${imagePath}" alt="${post.title}" loading="lazy">
                    <div class="blog-category">${getCategoryName(post.category)}</div>
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-meta">
                        <span class="blog-author"><i class="fas fa-user"></i> ${post.author}</span>
                        <span class="blog-date"><i class="fas fa-calendar-alt"></i> ${formatDate(post.publishDate)}</span>
                    </div>
                    <button class="read-more-btn" aria-label="Read full article">Read More</button>
                </div>
            </div>
        `;
        
        // Add click event to open modal
        postElement.querySelector('.read-more-btn').addEventListener('click', () => {
            openBlogModal(post);
        });
        
        // Add keyboard navigation support for the read more button
        postElement.querySelector('.read-more-btn').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openBlogModal(post);
            }
        });
        
        // Make the whole card clickable and keyboard accessible
        const blogCard = postElement.querySelector('.blog-card');
        blogCard.setAttribute('tabindex', '0');
        blogCard.setAttribute('role', 'button');
        blogCard.setAttribute('aria-label', `Read full article: ${post.title}`);
        
        blogCard.addEventListener('click', (e) => {
            if (!e.target.closest('.read-more-btn')) {
                openBlogModal(post);
            }
        });
        
        // Add keyboard navigation for the blog card
        blogCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openBlogModal(post);
            }
        });
        
        return postElement;
    }
    
    /**
     * Get the display name for a category
     * @param {string} categoryId - Category identifier
     * @returns {string} Category display name
     */
    function getCategoryName(categoryId) {
        const categories = {
            'design-tips': 'Design Tips',
            'living-spaces': 'Living Spaces',
            'architecture': 'Architecture'
        };
        
        return categories[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
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
            month: 'long',
            day: 'numeric'
        });
    }
    
    /**
     * Set up search functionality
     */
    function setupSearch() {
        if (!searchInput || !searchButton) return;
        
        // Search on button click
        searchButton.addEventListener('click', performSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Live search as user types (with debounce)
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(performSearch, 300);
        });
    }
    
    /**
     * Perform search based on input value
     */
    function performSearch() {
        if (!searchInput) return;
        
        searchQuery = searchInput.value.trim().toLowerCase();
        filterAndRenderPosts();
    }
    
    /**
     * Set up category filter buttons
     */
    function setupCategoryFilters() {
        if (!categoryButtons.length) return;
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button and ARIA attributes
                categoryButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                
                // Get category value
                currentCategory = button.getAttribute('data-category');
                
                // Filter posts
                filterAndRenderPosts();
                
                // Add ripple effect to button
                createRippleEffect(button);
            });
            
            // Add keyboard navigation support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const currentIndex = Array.from(categoryButtons).indexOf(button);
                    let nextIndex;
                    
                    if (e.key === 'ArrowLeft') {
                        nextIndex = currentIndex > 0 ? currentIndex - 1 : categoryButtons.length - 1;
                    } else {
                        nextIndex = currentIndex < categoryButtons.length - 1 ? currentIndex + 1 : 0;
                    }
                    
                    categoryButtons[nextIndex].focus();
                }
            });
        });
    }
    
    /**
     * Filter and render posts based on current category and search query
     */
    function filterAndRenderPosts() {
        let filteredPosts = blogPosts;
        
        // Filter by category if not 'all'
        if (currentCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
        }
        
        // Filter by search query if present
        if (searchQuery) {
            filteredPosts = filteredPosts.filter(post => {
                return (
                    post.title.toLowerCase().includes(searchQuery) ||
                    post.excerpt.toLowerCase().includes(searchQuery) ||
                    post.content.toLowerCase().includes(searchQuery) ||
                    post.author.toLowerCase().includes(searchQuery) ||
                    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
                );
            });
        }
        
        // Render filtered posts
        renderBlogPosts(filteredPosts);
    }
    
    /**
     * Create ripple effect on element click
     * @param {HTMLElement} element - The element to add ripple effect to
     */
    function createRippleEffect(element) {
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
     * Add animation to blog posts as they appear
     */
    function animateBlogPosts() {
        const posts = document.querySelectorAll('.blog-post');
        posts.forEach((post, index) => {
            setTimeout(() => {
                post.classList.add('visible');
            }, 100 * index);
        });
    }
    
    /**
     * Set up modal/overlay functionality for reading full blog posts
     */
    function setupModalFunctionality() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('blog-modal')) {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'blog-modal';
            modalContainer.className = 'blog-modal';
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
            
            modalOverlay.addEventListener('click', closeBlogModal);
            closeButton.addEventListener('click', closeBlogModal);
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
                    closeBlogModal();
                }
            });
        }
    }
    
    /**
     * Open blog modal with full article content
     * @param {Object} post - Blog post data object
     */
    function openBlogModal(post) {
        const modalContent = document.querySelector('#blog-modal .modal-content');
        if (!modalContent) return;
        
        // Create image URL
        const imagePath = post.featuredImage 
            ? `/images/blog/${post.featuredImage}` 
            : `/images/projects/placeholder.jpg`;
        
        // Format tags if they exist
        let tagsHTML = '';
        if (post.tags && post.tags.length > 0) {
            tagsHTML = `
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
        }
        
        // Populate modal content
        modalContent.innerHTML = `
            <article class="blog-full">
                <div class="blog-header">
                    <h2>${post.title}</h2>
                    <div class="blog-meta">
                        <span class="blog-author"><i class="fas fa-user"></i> ${post.author}</span>
                        <span class="blog-date"><i class="fas fa-calendar-alt"></i> ${formatDate(post.publishDate)}</span>
                        <span class="blog-category"><i class="fas fa-tag"></i> ${getCategoryName(post.category)}</span>
                    </div>
                </div>
                
                <div class="blog-featured-image">
                    <img src="${imagePath}" alt="${post.title}">
                </div>
                
                <div class="blog-body">
                    ${post.content}
                </div>
                
                ${tagsHTML}
                
                <div class="blog-share">
                    <h4>Share This Article</h4>
                    <div class="share-buttons">
                        <a href="#" class="share-btn" aria-label="Share on Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="share-btn" aria-label="Share on Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="share-btn" aria-label="Share on LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" class="share-btn" aria-label="Share on Pinterest"><i class="fab fa-pinterest-p"></i></a>
                    </div>
                </div>
                
                <div class="blog-related">
                    <h4>Related Articles</h4>
                    <div class="related-posts">
                        <!-- Related posts would be dynamically generated here -->
                        <p>Explore more articles about ${getCategoryName(post.category)}</p>
                    </div>
                </div>
            </article>
        `;
        
        // Open modal with animation
        const modal = document.getElementById('blog-modal');
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        
        // Scroll to top of modal content
        modalContent.scrollTop = 0;
        
        // Add arc-inspired decorative elements to the modal
        addArcDecorators(modalContent);
    }
    
    /**
     * Add arc-inspired decorative elements to the blog modal
     * @param {HTMLElement} container - Container to add decorators to
     */
    function addArcDecorators(container) {
        // Create arc decorators
        const arcDecorator1 = document.createElement('div');
        arcDecorator1.className = 'arc-decorator blog-arc-1';
        
        const arcDecorator2 = document.createElement('div');
        arcDecorator2.className = 'arc-decorator blog-arc-2';
        
        // Add to container
        container.appendChild(arcDecorator1);
        container.appendChild(arcDecorator2);
    }
    
    /**
     * Close blog modal
     */
    function closeBlogModal() {
        const modal = document.getElementById('blog-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.classList.remove('modal-open');
        }
    }
    
    // Make closeBlogModal available globally
    window.closeBlogModal = closeBlogModal;
    
    /**
     * Show loading state for blog section
     */
    function showBlogLoadingState() {
        if (!blogGrid) return;
        
        blogGrid.innerHTML = `
            <div class="content-loading">
                <div class="loading-spinner large"></div>
                <div class="loading-message">Loading blog posts...</div>
            </div>
        `;
        
        // Add skeleton cards for better UX
        setTimeout(() => {
            if (blogGrid.querySelector('.content-loading')) {
                blogGrid.innerHTML = '';
                for (let i = 0; i < 6; i++) {
                    const skeletonCard = createSkeletonBlogCard();
                    blogGrid.appendChild(skeletonCard);
                }
            }
        }, 500);
    }
    
    /**
     * Create skeleton blog card for loading state
     * @returns {HTMLElement} Skeleton blog card element
     */
    function createSkeletonBlogCard() {
        const skeletonElement = document.createElement('div');
        skeletonElement.className = 'blog-post skeleton-card';
        
        skeletonElement.innerHTML = `
            <div class="blog-card">
                <div class="blog-image">
                    <div class="skeleton-loader"></div>
                </div>
                <div class="blog-content">
                    <div class="text-skeleton line long"></div>
                    <div class="text-skeleton line medium"></div>
                    <div class="text-skeleton line short"></div>
                    <div class="blog-meta">
                        <div class="text-skeleton line short"></div>
                        <div class="text-skeleton line short"></div>
                    </div>
                </div>
            </div>
        `;
        
        return skeletonElement;
    }
});